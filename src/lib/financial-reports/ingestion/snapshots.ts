/**
 * FinAi KAP System — Snapshot Generator
 * Populates financial_statement_snapshots from extracted mapped raw values.
 */

import { getSupabaseAdminClient } from '../admin-client';
import type { ExtractedTable } from '../parser/types';
import type { FinancialStatementSnapshotRecord } from '../../../types/kap-financials';

export async function generateReportSnapshots(
  reportId: string,
  symbol: string,
  finaiSymbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  version: number,
  tables: ExtractedTable[],
  insertedRowMap: Map<string, string>, // rowIdentifier -> inserted row UUID
  insertedValueMap: Map<string, string> // rowIdentifier_colOrder -> inserted value UUID
): Promise<number> {
  const sbAdmin = getSupabaseAdminClient();
  const snapshotRecords: Partial<FinancialStatementSnapshotRecord>[] = [];

  for (const table of tables) {
    for (const row of table.rows) {
      if (row.mappingStatus !== 'MAPPED' || !row.canonicalItemCode) {
        continue;
      }

      for (const val of row.values) {
        if (val.isEmptyOrNull || val.parsedNumericValue === null) {
          continue;
        }

        const col = table.columns.find((c) => c.columnOrder === val.columnOrder);
        if (!col) continue;

        const valKey = `${row.rowIdentifier}_col${val.columnOrder}`;
        const sourceValueId = insertedValueMap.get(valKey) || null;

        snapshotRecords.push({
          report_id: reportId,
          symbol,
          finai_symbol: finaiSymbol,
          canonical_item_code: row.canonicalItemCode,
          canonical_item_id: row.canonicalItemId || null,
          statement_type: table.statementType,
          fiscal_year: col.fiscalYear,
          fiscal_quarter: col.fiscalQuarter,
          period_start: col.periodStart,
          period_end: col.periodEnd,
          duration_months: col.durationMonths,
          period_type: col.periodType,
          value: val.scaledNumericValue ?? (val.parsedNumericValue * val.scaleMultiplier),
          raw_value: val.parsedNumericValue,
          raw_text_value: val.rawTextValue,
          currency: val.currency,
          scale: val.scale,
          scale_multiplier: val.scaleMultiplier,
          source_raw_value_id: sourceValueId,
          source_page: row.pdfPageNumber,
          is_current: true,
          version,
          verification_status: 'VERIFIED',
        });
      }
    }
  }

  if (snapshotRecords.length === 0) {
    return 0;
  }

  // Insert snapshots in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < snapshotRecords.length; i += batchSize) {
    const batch = snapshotRecords.slice(i, i + batchSize);
    const { data, error } = await sbAdmin
      .from('financial_statement_snapshots')
      .insert(batch)
      .select('id');

    if (error) {
      console.error('Snapshot batch insert error:', error.message);
      throw new Error(`Snapshot insertion error: ${error.message}`);
    }

    if (data) {
      insertedCount += data.length;
    }
  }

  return insertedCount;
}
