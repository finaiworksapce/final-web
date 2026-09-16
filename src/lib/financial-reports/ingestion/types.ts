/**
 * FinAi KAP System — Ingestion Pipeline Types
 * Phase 3: Supabase Ingestion, Storage, Versioning & Audit DTOs
 */

import type { ValidationReport } from '../parser/types';

export type IngestionStatus =
  | 'SUCCESS'
  | 'WARNING'
  | 'BLOCKED'
  | 'DUPLICATE'
  | 'RESTATEMENT'
  | 'VERSION_CREATED'
  | 'VALIDATION_BLOCKED'
  | 'FAILED';

export interface PostIngestionVerificationResult {
  passed: boolean;
  reportExists: boolean;
  symbolMatches: boolean;
  periodMatches: boolean;
  versionMatches: boolean;
  tablesCountMatch: boolean;
  columnsCountMatch: boolean;
  rawRowsCountMatch: boolean;
  rawValuesCountMatch: boolean;
  unmappedRowsPreserved: boolean;
  snapshotsCreated: boolean;
  auditLogsCreated: boolean;
  storageFileExists: boolean;
  storageHashMatches: boolean;
  balanceSheetEquityEqualsAssets: boolean;
  netIncomeMatchesBetweenStatements: boolean;
  totalAssetsValue: number;
  totalLiabilitiesEquityValue: number;
  netIncomeValue: number;
  issues: string[];
}

export interface IngestionResultPayload {
  success: boolean;
  status: IngestionStatus;
  reportId: string | null;
  reportSlug: string;
  version: number;
  isCurrent: boolean;
  isRestatement: boolean;
  supersedesReportId: string | null;
  symbol: string;
  finaiSymbol: string;
  companyName: string;
  fiscalYear: number;
  fiscalQuarter: number;
  periodEnd: string;
  storageBucket: string;
  storagePath: string;
  fileHashSha256: string;
  insertedTables: number;
  insertedColumns: number;
  insertedRows: number;
  insertedValues: number;
  mappedRowsCount: number;
  unmappedRowsCount: number;
  ambiguousRowsCount: number;
  snapshotsCreated: number;
  auditLogsCreated: number;
  validationReport: ValidationReport;
  verification: PostIngestionVerificationResult | null;
  message: string;
  formattedReportText?: string;
  ingestedAt: string;
}

export interface IngestionOptions {
  overrideSymbol?: string;
  forceReingest?: boolean;
  uploadedBy?: string;
  notes?: string;
  sourceFileName?: string;
  isRestated?: boolean;
}

