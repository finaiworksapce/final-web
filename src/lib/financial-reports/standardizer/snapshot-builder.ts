/**
 * FinAi KAP System — FAZ 4 Snapshot Standardizer
 * Generates structured, standardized financial snapshots into `financial_statement_snapshots` table
 * strictly for trusted canonical items.
 */

import { getSupabaseAdminClient } from '../admin-client';
import { mapRawLabelToCanonical } from './canonical-mapper';
import type { FinancialStatementType, FinancialPeriodNature as PeriodType } from '../../../types/kap-financials';

export interface StandardizedSnapshotItem {
  reportId: string;
  symbol: string;
  finaiSymbol: string;
  canonicalItemCode: string;
  canonicalItemId?: string | null;
  statementType: FinancialStatementType;
  periodType: PeriodType;
  fiscalYear: number;
  fiscalQuarter: number;
  periodEnd: string;
  numericValue: number;
  currency: string;
  scale: string;
  scaleMultiplier: number;
  sourceRawRowId?: string;
  sourceRawValueId?: string;
}

/**
 * Builds and persists standardized financial snapshots for trusted canonical items
 */
export async function buildStandardizedSnapshots(
  reportId: string
): Promise<{ count: number; snapshots: StandardizedSnapshotItem[] }> {
  const sbAdmin = getSupabaseAdminClient();

  // 1. Fetch Report details
  const { data: report, error: reportErr } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (reportErr || !report) {
    throw new Error(`Snapshot Builder: Report ID ${reportId} bulunamadı!`);
  }

  // 2. Clear prior snapshots for this report ID to ensure idempotency
  await sbAdmin
    .from('financial_statement_snapshots')
    .delete()
    .eq('report_id', reportId);

  // 3. Fetch Catalog Map (item_code -> id)
  const { data: catalogItems } = await sbAdmin
    .from('financial_items_catalog')
    .select('id, item_code, statement_type');

  const catalogMap = new Map<string, string>();
  for (const cat of (catalogItems || [])) {
    catalogMap.set(`${cat.statement_type}_${cat.item_code}`, cat.id);
    catalogMap.set(cat.item_code, cat.id);
  }

  // 4. Query all raw items for this report (Paginated to bypass 1,000 row cap)
  const rawItems: any[] = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data: pageData, error: pageErr } = await sbAdmin
      .from('financial_report_raw_items')
      .select('*')
      .eq('report_id', reportId)
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (pageErr) {
      console.error('Snapshot builder items query error:', pageErr.message);
      break;
    }
    if (!pageData || pageData.length === 0) break;
    rawItems.push(...pageData);
    if (pageData.length < pageSize) break;
    page++;
  }

  const snapshotMap = new Map<string, any>();
  const rowsToUpdate = new Map<string, { mapping_status: string; canonical_item_id: string }>();

  const targetPeriodEnd = report.reporting_period_end || report.period_end;
  const targetYearStr = targetPeriodEnd ? targetPeriodEnd.slice(0, 4) : (report.fiscal_year ? String(report.fiscal_year) : '');

  for (const item of rawItems) {
    if (item.parsed_numeric_value === null || item.parsed_numeric_value === undefined) continue;
    // Filter out comparative columns from prior fiscal years (e.g. 2025 in a 2026 report),
    // but preserve all columns belonging to the primary fiscal year (e.g. 2026).
    if (item.period_end && targetYearStr) {
      const itemYearStr = item.period_end.slice(0, 4);
      if (itemYearStr !== targetYearStr) {
        continue;
      }
    }

    const val = Number(item.parsed_numeric_value);
    if (isNaN(val) || val === 0) continue;

    const stType = (item.statement_type as FinancialStatementType) || 'BALANCE_SHEET';
    const mappingRes = mapRawLabelToCanonical(item.raw_label, stType);
    const code = item.canonical_item_code || (mappingRes.status === 'MAPPED' ? mappingRes.canonicalItemCode : null);

    if (code) {
      const catId = item.canonical_item_id || catalogMap.get(`${stType}_${code}`) || catalogMap.get(code) || null;

      if (catId && item.row_id && item.mapping_status !== 'MAPPED') {
        rowsToUpdate.set(item.row_id, { mapping_status: 'MAPPED', canonical_item_id: catId });
      }

      const pType: PeriodType = (item.period_type as PeriodType) || (stType === 'BALANCE_SHEET' ? 'POINT_IN_TIME' : 'CUMULATIVE_INTERIM');
      const pEnd = item.period_end || report.reporting_period_end || report.period_end;
      const key = `${stType}_${code}_${pEnd}_${pType}`;

      if (!snapshotMap.has(key)) {
        snapshotMap.set(key, {
          item,
          code,
          catId,
          val,
          stType,
          pType,
          pEnd,
        });
      } else {
        const existing = snapshotMap.get(key);
        if (Math.abs(val) > Math.abs(existing.val)) {
          snapshotMap.set(key, {
            item,
            code,
            catId,
            val,
            stType,
            pType,
            pEnd,
          });
        }
      }
    }
  }

  // 5. Update mapped rows in DB
  for (const [rowId, updatePayload] of rowsToUpdate.entries()) {
    await sbAdmin
      .from('financial_report_raw_rows')
      .update(updatePayload)
      .eq('id', rowId);
  }

  const snapshotPayloads: any[] = [];
  const generatedSnapshots: StandardizedSnapshotItem[] = [];

  for (const entry of snapshotMap.values()) {
    const snapObj: StandardizedSnapshotItem = {
      reportId: report.id,
      symbol: report.symbol,
      finaiSymbol: report.finai_symbol || report.symbol,
      canonicalItemCode: entry.code,
      canonicalItemId: entry.catId,
      statementType: entry.stType,
      periodType: entry.pType,
      fiscalYear: report.fiscal_year,
      fiscalQuarter: report.fiscal_quarter,
      periodEnd: entry.pEnd,
      numericValue: entry.val,
      currency: entry.item.currency || report.currency || 'TRY',
      scale: entry.item.scale || report.default_scale || 'THOUSAND',
      scaleMultiplier: Number(entry.item.scale_multiplier || report.scale_multiplier || 1000),
      sourceRawRowId: entry.item.row_id,
      sourceRawValueId: entry.item.raw_value_id,
    };

    generatedSnapshots.push(snapObj);

    snapshotPayloads.push({
      report_id: snapObj.reportId,
      symbol: snapObj.symbol,
      finai_symbol: snapObj.finaiSymbol,
      canonical_item_code: snapObj.canonicalItemCode,
      canonical_item_id: snapObj.canonicalItemId || null,
      statement_type: snapObj.statementType,
      fiscal_year: snapObj.fiscalYear,
      fiscal_quarter: snapObj.fiscalQuarter,
      period_start: entry.item.period_start || null,
      period_end: snapObj.periodEnd,
      duration_months: entry.item.duration_months ?? (snapObj.statementType === 'BALANCE_SHEET' ? 0 : 6),
      period_type: snapObj.periodType,
      value: snapObj.numericValue,
      raw_value: entry.item.parsed_numeric_value ? Number(entry.item.parsed_numeric_value) : snapObj.numericValue,
      raw_text_value: entry.item.raw_text_value || String(snapObj.numericValue),
      currency: snapObj.currency,
      scale: snapObj.scale,
      scale_multiplier: snapObj.scaleMultiplier,
      source_raw_value_id: snapObj.sourceRawValueId || entry.item.value_id || null,
      source_page: entry.item.pdf_page_number || 1,
      is_current: report.is_current ?? true,
      version: report.version ?? 1,
      verification_status: 'VERIFIED',
    });
  }

  if (snapshotPayloads.length > 0) {
    const { error: insErr } = await sbAdmin
      .from('financial_statement_snapshots')
      .insert(snapshotPayloads);

    if (insErr) {
      console.error('Snapshots insert error details:', insErr);
      throw new Error(`Snapshots insert error: ${insErr.message} (code: ${insErr.code}, details: ${insErr.details})`);
    }
  }

  return {
    count: snapshotPayloads.length,
    snapshots: generatedSnapshots,
  };
}
