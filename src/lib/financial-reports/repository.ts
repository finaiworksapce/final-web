/**
 * FinAi KAP System — Financial Report Repository & History Query Layer
 * Provides deterministic historical report ordering, single-current period retrieval,
 * snapshot querying, and multi-check database integrity verification.
 */

import { getSupabaseAdminClient } from './admin-client';
import type { FinancialReportRecord } from '../../types/kap-financials';

export interface ReportHistoryOptions {
  currentOnly?: boolean;
  consolidationType?: 'CONSOLIDATED' | 'STANDALONE';
  limit?: number;
}

export interface DbIntegrityCheckResult {
  valid: boolean;
  issues: string[];
  stats: {
    totalReports: number;
    currentReportsCount: number;
    logicalPeriodsCount: number;
    totalSnapshots: number;
    currentSnapshotsCount: number;
    orphanSnapshotsCount: number;
    orphanRawRowsCount: number;
    multiCompanyConflictsCount: number;
    auditSecretLeaksCount: number;
  };
}

/**
 * Fetches company report history sorted deterministically by fiscal_year DESC, fiscal_quarter DESC, version DESC
 */
export async function getCompanyReportHistory(
  symbol: string,
  options: ReportHistoryOptions = {}
): Promise<FinancialReportRecord[]> {
  const sbAdmin = getSupabaseAdminClient();
  const cleanSymbol = symbol.toUpperCase();

  let query = sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('symbol', cleanSymbol);

  if (options.currentOnly) {
    query = query.eq('is_current', true);
  }

  if (options.consolidationType) {
    query = query.eq('consolidation_type', options.consolidationType);
  }

  query = query
    .order('fiscal_year', { ascending: false })
    .order('fiscal_quarter', { ascending: false })
    .order('version', { ascending: false });

  if (options.limit && options.limit > 0) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching company report history:', error.message);
    throw new Error(`Report history query error: ${error.message}`);
  }

  return (data || []) as FinancialReportRecord[];
}

/**
 * Retrieves the single current report record for a specific logical period
 */
export async function getCurrentReportForPeriod(
  symbol: string,
  fiscalYear: number,
  fiscalQuarter: number,
  consolidationType: 'CONSOLIDATED' | 'STANDALONE' = 'CONSOLIDATED'
): Promise<FinancialReportRecord | null> {
  const sbAdmin = getSupabaseAdminClient();
  const cleanSymbol = symbol.toUpperCase();

  const { data, error } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('symbol', cleanSymbol)
    .eq('fiscal_year', fiscalYear)
    .eq('fiscal_quarter', fiscalQuarter)
    .eq('consolidation_type', consolidationType)
    .eq('is_current', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching current report for period:', error.message);
    return null;
  }

  return data as FinancialReportRecord | null;
}

/**
 * Fetches standardized snapshot records for a report ID
 */
export async function getReportSnapshots(
  reportId: string,
  currentOnly: boolean = false
): Promise<any[]> {
  const sbAdmin = getSupabaseAdminClient();

  let query = sbAdmin
    .from('financial_statement_snapshots')
    .select('*')
    .eq('report_id', reportId);

  if (currentOnly) {
    query = query.eq('is_current', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching report snapshots:', error.message);
    throw new Error(`Snapshot query error: ${error.message}`);
  }

  return data || [];
}

/**
 * Evaluates comprehensive database integrity invariants across reports, snapshots, raw rows, and audit logs.
 */
export async function verifyDatabaseIntegrity(): Promise<DbIntegrityCheckResult> {
  const sbAdmin = getSupabaseAdminClient();
  const issues: string[] = [];

  // 1. Fetch all financial reports
  const { data: reports, error: reportsErr } = await sbAdmin
    .from('financial_reports')
    .select('id, symbol, fiscal_year, fiscal_quarter, consolidation_type, version, is_current, supersedes_report_id');

  if (reportsErr) {
    throw new Error(`Database integrity check failed fetching reports: ${reportsErr.message}`);
  }

  const allReports = reports || [];

  // Check 1: Invariant — At most 1 current report per logical period
  const periodCurrentCountMap = new Map<string, number>();
  for (const rep of allReports) {
    if (rep.is_current) {
      const key = `${rep.symbol}_${rep.fiscal_year}_Q${rep.fiscal_quarter}_${rep.consolidation_type}`;
      const count = (periodCurrentCountMap.get(key) || 0) + 1;
      periodCurrentCountMap.set(key, count);
      if (count > 1) {
        issues.push(`CRITICAL: Period "${key}" has ${count} current reports with is_current = true!`);
      }
    }
  }

  // Check 2: Supersedes reference validity
  const reportIdSet = new Set(allReports.map((r) => r.id));
  for (const rep of allReports) {
    if (rep.supersedes_report_id && !reportIdSet.has(rep.supersedes_report_id)) {
      issues.push(`ORPHAN: Report ${rep.id} references non-existent supersedes_report_id ${rep.supersedes_report_id}`);
    }
  }

  // 2. Fetch all snapshots
  const { data: snapshots, error: snapErr } = await sbAdmin
    .from('financial_statement_snapshots')
    .select('id, report_id, symbol, is_current');

  if (snapErr) {
    throw new Error(`Database integrity check failed fetching snapshots: ${snapErr.message}`);
  }

  const allSnapshots = snapshots || [];
  let orphanSnapshotsCount = 0;
  let multiCompanyConflictsCount = 0;

  const reportSymbolMap = new Map<string, string>();
  for (const r of allReports) {
    reportSymbolMap.set(r.id, r.symbol);
  }

  for (const snap of allSnapshots) {
    if (!reportIdSet.has(snap.report_id)) {
      orphanSnapshotsCount++;
      issues.push(`ORPHAN SNAPSHOT: Snapshot ${snap.id} references non-existent report_id ${snap.report_id}`);
    } else {
      const expectedSymbol = reportSymbolMap.get(snap.report_id);
      if (expectedSymbol && snap.symbol !== expectedSymbol) {
        multiCompanyConflictsCount++;
        issues.push(`CROSS-COMPANY LEAK: Snapshot ${snap.id} has symbol ${snap.symbol} but report ${snap.report_id} has symbol ${expectedSymbol}`);
      }
    }
  }

  // 3. Check orphan raw rows
  const { data: rawRows, error: rawRowsErr } = await sbAdmin
    .from('financial_report_raw_rows')
    .select('id, report_id');

  let orphanRawRowsCount = 0;
  if (!rawRowsErr && rawRows) {
    for (const row of rawRows) {
      if (!reportIdSet.has(row.report_id)) {
        orphanRawRowsCount++;
        issues.push(`ORPHAN RAW ROW: Row ${row.id} references non-existent report_id ${row.report_id}`);
      }
    }
  }

  // 4. Check Audit logs for leaked secrets or key tokens
  const { data: auditLogs } = await sbAdmin
    .from('financial_report_audit_logs')
    .select('id, message, metadata');

  let auditSecretLeaksCount = 0;
  const secretRegex = /service_role|sbp_[a-zA-Z0-9]+|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/i;

  if (auditLogs) {
    for (const log of auditLogs) {
      const msgMatch = secretRegex.test(log.message || '');
      const metaStr = JSON.stringify(log.metadata || {});
      const metaMatch = secretRegex.test(metaStr);
      if (msgMatch || metaMatch) {
        auditSecretLeaksCount++;
        issues.push(`SECURITY LEAK: Audit log ${log.id} contains leaked credential/secret keyword!`);
      }
    }
  }

  const currentReportsCount = Array.from(periodCurrentCountMap.values()).reduce((a, b) => a + b, 0);
  const currentSnapshotsCount = allSnapshots.filter((s) => s.is_current).length;

  return {
    valid: issues.length === 0,
    issues,
    stats: {
      totalReports: allReports.length,
      currentReportsCount,
      logicalPeriodsCount: periodCurrentCountMap.size,
      totalSnapshots: allSnapshots.length,
      currentSnapshotsCount,
      orphanSnapshotsCount,
      orphanRawRowsCount,
      multiCompanyConflictsCount,
      auditSecretLeaksCount,
    },
  };
}
