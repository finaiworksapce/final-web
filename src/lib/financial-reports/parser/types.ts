import type {
  FinancialStatementType,
  FinancialPeriodNature,
  FinancialReportType,
  FinancialAuditStatus,
  FinancialVerificationStatus,
  FinancialMappingMethod,
} from '../../../types/kap-financials';

export type ExtractionConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type CompanyResolutionStatus = 'RESOLVED' | 'UNRESOLVED' | 'AMBIGUOUS';
export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFO';
export type ValidationStatus = 'VALID' | 'WARNING' | 'ERROR';
export type MappingStatus = 'MAPPED' | 'UNMAPPED' | 'AMBIGUOUS' | 'IGNORED';
export type ScaleType = 'EXACT' | 'THOUSAND' | 'MILLION' | 'BILLION';

export interface DocumentMetadata {
  fileName: string;
  fileHashSha256: string;
  totalPages: number;
  detectedTitle?: string;
  detectedCompanyName?: string;
  detectedSymbol?: string;
  detectedReportDate?: string;
  detectedFiscalYear?: number;
  detectedFiscalQuarter?: number;
  detectedPeriodStart?: string;
  detectedPeriodEnd?: string;
  consolidationType: 'CONSOLIDATED' | 'STANDALONE';
  reportType: FinancialReportType;
  auditStatus: FinancialAuditStatus;
  defaultCurrency: string;
  defaultScale: ScaleType;
  scaleMultiplier: number;
  totalExtractedRawLines?: number;
}

export interface CompanyResolution {
  status: CompanyResolutionStatus;
  symbol?: string;
  finaiSymbol?: string;
  companyName?: string;
  matchedPattern?: string;
  confidence: number;
  rawText?: string;
  notes?: string;
}

export interface PeriodResolution {
  fiscalYear: number;
  fiscalQuarter: number;
  periodStart: string | null;
  periodEnd: string;
  durationMonths: number;
  periodType: FinancialPeriodNature;
  isComparative: boolean;
  rawHeaderText: string;
  confidence: number;
}

export interface ScaleResolution {
  currency: string;
  scale: ScaleType;
  scaleMultiplier: number;
  rawScaleText: string;
  source: 'DOCUMENT_HEADER' | 'TABLE_HEADER' | 'COLUMN_HEADER' | 'FOOTNOTE' | 'DEFAULT';
}

export interface ExtractedColumn {
  columnOrder: number;
  columnLabel: string;
  rawHeaderText: string;
  periodStart: string | null;
  periodEnd: string;
  durationMonths: number;
  periodType: FinancialPeriodNature;
  isComparative: boolean;
  fiscalYear: number;
  fiscalQuarter: number;
  currency: string;
  scale: ScaleType;
  scaleMultiplier: number;
  isPrimaryTargetPeriod: boolean;
  confidence: ExtractionConfidence;
}

export interface ExtractedValue {
  columnOrder: number;
  rawTextValue: string;
  isDashOrZero: boolean;
  isEmptyOrNull: boolean;
  parsedNumericValue: number | null;
  scaledNumericValue: number | null;
  currency: string;
  scale: ScaleType;
  scaleMultiplier: number;
  signApplied: number; // +1 or -1
  footnoteOverride: string | null;
  parseConfidence: ExtractionConfidence;
}

export interface ExtractedRow {
  rowOrder: number;
  rowIdentifier: string;
  rawLabel: string;
  normalizedLabel: string;
  footnoteRef: string | null;
  pdfPageNumber: number;
  indentLevel: number;
  isSubtotal: boolean;
  canonicalItemId: string | null;
  canonicalItemCode: string | null;
  mappingStatus: MappingStatus;
  mappingRule?: string;
  mappingConfidence: number;
  values: ExtractedValue[];
}

export interface ExtractedTable {
  tableIdentifier: string;
  tableName: string;
  statementType: FinancialStatementType;
  tableOrder: number;
  pageStart: number;
  pageEnd: number;
  currency: string;
  scale: ScaleType;
  scaleMultiplier: number;
  notes: string | null;
  columns: ExtractedColumn[];
  rows: ExtractedRow[];
  confidence: ExtractionConfidence;
}

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  message: string;
  context?: Record<string, any>;
}

export interface ValidationReport {
  status: ValidationStatus;
  isValid: boolean;
  hasErrors: boolean;
  hasWarnings: boolean;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

export interface ProvenanceInfo {
  sourceFileName: string;
  sourceDocumentHashSha256: string;
  totalPages: number;
  pagesScanned: number[];
  extractedAt: string;
  parserVersion: string;
}

export interface ExtractionMetrics {
  totalTables: number;
  totalColumns: number;
  totalRows: number;
  totalValues: number;
  mappedRowsCount: number;
  unmappedRowsCount: number;
  ambiguousRowsCount: number;
  dashOrZeroValuesCount: number;
  emptyValuesCount: number;
  rawPreservationRate: number; // Must be exactly 1.0 (100%)
  rawLossCount: number; // Must be exactly 0
}

/**
 * The complete structured Result DTO produced by Phase 2 parser pipeline
 */
export interface FinancialReportExtractionResult {
  documentMetadata: DocumentMetadata;
  companyResolution: CompanyResolution;
  tables: ExtractedTable[];
  validation: ValidationReport;
  provenance: ProvenanceInfo;
  metrics: ExtractionMetrics;
  overallConfidence: ExtractionConfidence;
}

/**
 * Raw text line with page and layout provenance for pipeline consumption
 */
export interface ExtractedRawLine {
  pageNumber: number;
  lineIndex: number;
  text: string;
  indentLevel: number;
  rawTokens: string[];
}

/**
 * Page level layout data
 */
export interface ExtractedPageLayout {
  pageNumber: number;
  rawText: string;
  lines: ExtractedRawLine[];
}

export interface ParserOptions {
  strictValidation?: boolean;
  defaultCurrency?: string;
  defaultScale?: ScaleType;
  knownSymbols?: Array<{ symbol: string; companyName: string; finaiSymbol: string }>;
  overrideSymbol?: string;
}
