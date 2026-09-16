/**
 * FinAi KAP System — Ingestion Versioning & Duplicate Control
 * Handles SHA-256 hash deduplication (idempotency) and logical period versioning chain.
 */

import { getSupabaseAdminClient } from '../admin-client';
import type { FinancialReportRecord } from '../../../types/kap-financials';

export interface VersionResolutionResult {
  isDuplicate: boolean;
  existingReport: FinancialReportRecord | null;
  targetVersion: number;
  isRestatement: boolean;
  supersedesReportId: string | null;
  reportSlug: string;
}

/**
 * Checks if a PDF with the exact same SHA-256 hash has already been ingested
 */
export async function findReportByHash(fileHashSha256: string): Promise<FinancialReportRecord | null> {
  const sbAdmin = getSupabaseAdminClient();

  const { data, error } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('source_document_hash_sha256', fileHashSha256)
    .maybeSingle();

  if (error) {
    console.error('SHA-256 duplicate check error:', error.message);
    return null;
  }

  return data as FinancialReportRecord | null;
}

/**
 * Resolves logical period versioning for (Symbol + FiscalYear + FiscalQuarter + ConsolidationType)
 */
export async function resolvePeriodVersion(
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  consolidationType: 'CONSOLIDATED' | 'STANDALONE',
  fileHashSha256: string,
  forceReingest: boolean = false
): Promise<VersionResolutionResult> {
  const sbAdmin = getSupabaseAdminClient();
  const cleanSymbol = symbol.toUpperCase();

  // 1. Check exact SHA-256 hash duplication
  if (!forceReingest) {
    const existingHashMatch = await findReportByHash(fileHashSha256);
    if (existingHashMatch) {
      return {
        isDuplicate: true,
        existingReport: existingHashMatch,
        targetVersion: existingHashMatch.version,
        isRestatement: existingHashMatch.is_restatement,
        supersedesReportId: existingHashMatch.supersedes_report_id,
        reportSlug: existingHashMatch.report_slug,
      };
    }
  }

  // 2. Query existing reports for this logical period
  const { data: periodReports, error: periodError } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('symbol', cleanSymbol)
    .eq('fiscal_year', fiscalYear)
    .eq('fiscal_quarter', fiscalQuarter)
    .eq('consolidation_type', consolidationType)
    .order('version', { ascending: false });

  if (periodError) {
    throw new Error(`Period version resolution error: ${periodError.message}`);
  }

  if (!periodReports || periodReports.length === 0) {
    // First version for this period
    const reportSlug = `${cleanSymbol}_${fiscalYear}_Q${fiscalQuarter}_V1`;
    return {
      isDuplicate: false,
      existingReport: null,
      targetVersion: 1,
      isRestatement: false,
      supersedesReportId: null,
      reportSlug,
    };
  }

  // Subsequent version / restatement
  const latestReport = periodReports[0] as FinancialReportRecord;
  const targetVersion = latestReport.version + 1;
  const reportSlug = `${cleanSymbol}_${fiscalYear}_Q${fiscalQuarter}_V${targetVersion}`;

  return {
    isDuplicate: false,
    existingReport: null,
    targetVersion,
    isRestatement: true,
    supersedesReportId: latestReport.id,
    reportSlug,
  };
}

/**
 * Updates prior report versions and snapshots for the period to set is_current = false
 */
export async function deprecatePriorReportVersions(
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  consolidationType: 'CONSOLIDATED' | 'STANDALONE',
  newReportId?: string
): Promise<void> {
  const sbAdmin = getSupabaseAdminClient();
  const cleanSymbol = symbol.toUpperCase();

  // 1. Deprecate prior reports
  let reportQuery = sbAdmin
    .from('financial_reports')
    .update({ is_current: false })
    .eq('symbol', cleanSymbol)
    .eq('fiscal_year', fiscalYear)
    .eq('fiscal_quarter', fiscalQuarter)
    .eq('consolidation_type', consolidationType);

  if (newReportId && newReportId.length > 0) {
    reportQuery = reportQuery.neq('id', newReportId);
  }

  const { error: repErr } = await reportQuery;
  if (repErr) {
    console.error('Deprecate prior report versions error:', repErr.message);
  }

  // 2. Deprecate prior snapshots for this logical period
  let snapshotQuery = sbAdmin
    .from('financial_statement_snapshots')
    .update({ is_current: false })
    .eq('symbol', cleanSymbol)
    .eq('fiscal_year', fiscalYear)
    .eq('fiscal_quarter', fiscalQuarter);

  if (newReportId && newReportId.length > 0) {
    snapshotQuery = snapshotQuery.neq('report_id', newReportId);
  }

  const { error: snapErr } = await snapshotQuery;
  if (snapErr) {
    console.error('Deprecate prior snapshots error:', snapErr.message);
  }
}

/**
 * Recovery / Cleanup helper: Ensures exactly ONE report has is_current = true (the highest version)
 * for a given logical period. Useful during rollback or integrity repair.
 */
export async function ensureSingleCurrentReport(
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  consolidationType: 'CONSOLIDATED' | 'STANDALONE' = 'CONSOLIDATED'
): Promise<void> {
  const sbAdmin = getSupabaseAdminClient();
  const cleanSymbol = symbol.toUpperCase();

  const { data: reports, error } = await sbAdmin
    .from('financial_reports')
    .select('id, version, is_current')
    .eq('symbol', cleanSymbol)
    .eq('fiscal_year', fiscalYear)
    .eq('fiscal_quarter', fiscalQuarter)
    .eq('consolidation_type', consolidationType)
    .order('version', { ascending: false });

  if (error || !reports || reports.length === 0) return;

  const highestReport = reports[0];

  // Set highest version to is_current = true
  await sbAdmin
    .from('financial_reports')
    .update({ is_current: true })
    .eq('id', highestReport.id);

  await sbAdmin
    .from('financial_statement_snapshots')
    .update({ is_current: true })
    .eq('report_id', highestReport.id);

  // Set all other versions to is_current = false
  if (reports.length > 1) {
    const otherIds = reports.slice(1).map((r) => r.id);
    await sbAdmin
      .from('financial_reports')
      .update({ is_current: false })
      .in('id', otherIds);

    await sbAdmin
      .from('financial_statement_snapshots')
      .update({ is_current: false })
      .in('report_id', otherIds);
  }
}

