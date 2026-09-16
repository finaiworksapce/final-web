/**
 * FinAi Manual KAP Financial Report & Balance Sheet System — Types
 * Phase 1: Backend Data Model Interfaces
 */

export type FinancialStatementType =
  | 'BALANCE_SHEET'
  | 'INCOME_STATEMENT'
  | 'COMPREHENSIVE_INCOME'
  | 'CASH_FLOW'
  | 'EQUITY_CHANGES'
  | 'OTHER';

export type FinancialPeriodNature =
  | 'POINT_IN_TIME'        // Bilanço anlık tarih (30.06.2026, 31.12.2025)
  | 'DISCRETE_QUARTER'     // 3 Aylık münferit çeyrek (1 Nis - 30 Haz)
  | 'CUMULATIVE_INTERIM'   // Kümülatif ara dönem (6A: 1 Oca - 30 Haz, 9A: 1 Oca - 30 Eyl)
  | 'ANNUAL'               // 12 Aylık tam yıl
  | 'COMPARATIVE'          // Önceki dönem karşılaştırma kolonu
  | 'UNKNOWN';

export type FinancialReportType = 'ANNUAL' | 'INTERIM' | 'SPECIAL';

export type FinancialAuditStatus = 'AUDITED' | 'LIMITED_REVIEW' | 'UNAUDITED';

export type FinancialVerificationStatus = 'PENDING' | 'VERIFIED' | 'WARNING' | 'REJECTED';

export type FinancialMappingMethod = 'MANUAL' | 'RULE' | 'AI' | 'VERIFIED' | 'UNKNOWN';

export type FinancialAuditEventType =
  | 'PDF_RECEIVED'
  | 'HASH_CHECKED'
  | 'REPORT_CREATED'
  | 'TABLE_EXTRACTED'
  | 'COLUMN_DETECTED'
  | 'ROW_EXTRACTED'
  | 'VALUE_EXTRACTED'
  | 'ITEM_MAPPED'
  | 'VALIDATION_STARTED'
  | 'VALIDATION_FAILED'
  | 'VALIDATION_PASSED'
  | 'SNAPSHOT_CREATED'
  | 'RESTATEMENT_CREATED'
  | 'QUARANTINED'
  | 'GENERAL_AUDIT';

export interface FinancialReportRecord {
  id: string;
  report_slug: string;
  symbol: string;
  finai_symbol: string;
  company_name: string;
  fiscal_year: number;
  fiscal_quarter: number;
  reporting_period_start: string; // ISO date YYYY-MM-DD
  reporting_period_end: string;
  report_date: string;
  publication_date: string | null;
  consolidation_type: 'CONSOLIDATED' | 'STANDALONE';
  statement_currency: string;
  currency: string;
  default_scale: 'EXACT' | 'THOUSAND' | 'MILLION' | 'BILLION';
  scale_multiplier: number;
  report_type: FinancialReportType;
  audit_status: FinancialAuditStatus;
  source: string;
  source_document_name: string;
  source_document_hash_sha256: string;
  storage_bucket: string;
  storage_path: string;
  version: number;
  is_current: boolean;
  is_restatement: boolean;
  supersedes_report_id: string | null;
  verification_status: FinancialVerificationStatus;
  verification_notes: string | null;
  uploaded_by: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FinancialReportTableRecord {
  id: string;
  report_id: string;
  statement_type: FinancialStatementType;
  table_name: string;
  table_order: number;
  table_identifier: string;
  page_start: number;
  page_end: number;
  currency: string;
  scale_multiplier: number;
  notes: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface FinancialReportColumnRecord {
  id: string;
  table_id: string;
  column_order: number;
  column_label: string;
  raw_header_text: string;
  period_start: string | null;
  period_end: string;
  duration_months: number;
  period_type: FinancialPeriodNature;
  is_comparative: boolean;
  fiscal_year: number;
  fiscal_quarter: number;
  currency: string;
  scale: string;
  scale_multiplier: number;
  is_primary_target_period: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface FinancialItemCatalogRecord {
  id: string;
  item_code: string;
  statement_type: FinancialStatementType;
  canonical_name: string;
  name_tr: string;
  name_en: string;
  category: string;
  parent_item_id: string | null;
  sign_convention: number; // +1 or -1
  unit_type: 'CURRENCY' | 'SHARES' | 'RATIO' | 'PERCENT';
  is_mandatory_summary: boolean;
  display_order: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialItemMappingRecord {
  id: string;
  statement_type: FinancialStatementType;
  raw_label: string;
  normalized_label: string;
  canonical_item_id: string;
  confidence: number;
  mapping_method: FinancialMappingMethod;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialReportRawRowRecord {
  id: string;
  report_id: string;
  table_id: string;
  row_order: number;
  row_identifier: string;
  raw_label: string;
  normalized_label: string;
  footnote_ref: string | null;
  pdf_page_number: number;
  indent_level: number;
  is_subtotal: boolean;
  canonical_item_id: string | null;
  mapping_status: 'MAPPED' | 'UNMAPPED' | 'AMBIGUOUS' | 'IGNORED';
  extraction_metadata?: Record<string, any>;
  created_at: string;
}

export interface FinancialReportRawValueRecord {
  id: string;
  row_id: string;
  column_id: string;
  raw_text_value: string;
  is_dash_or_zero: boolean;
  is_empty_or_null: boolean;
  parsed_numeric_value: number | null;
  scaled_numeric_value: number | null;
  currency: string;
  scale: string;
  scale_multiplier: number;
  sign_applied: number;
  footnote_override: string | null;
  created_at: string;
}

export interface FinancialStatementSnapshotRecord {
  id: string;
  report_id: string;
  symbol: string;
  finai_symbol: string;
  canonical_item_code: string;
  canonical_item_id: string | null;
  statement_type: FinancialStatementType;
  fiscal_year: number;
  fiscal_quarter: number;
  period_start: string | null;
  period_end: string;
  duration_months: number;
  period_type: FinancialPeriodNature;
  value: number;
  raw_value: number | null;
  raw_text_value: string | null;
  currency: string;
  scale: string;
  scale_multiplier: number;
  source_raw_value_id: string | null;
  source_page: number | null;
  is_current: boolean;
  version: number;
  verification_status: FinancialVerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface FinancialReportAuditLogRecord {
  id: string;
  report_id: string | null;
  symbol: string | null;
  event_type: FinancialAuditEventType;
  status: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  message: string;
  metadata?: Record<string, any>;
  created_at: string;
}
