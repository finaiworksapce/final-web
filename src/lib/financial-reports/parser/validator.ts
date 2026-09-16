/**
 * FinAi KAP PDF Parser — Validation Layer
 * Comprehensive multi-point verification before any persistence.
 * Distinguishes between CRITICAL ERRORS (blocks ingestion) and WARNINGS (preserves data with flag).
 */

import type {
  ExtractedTable,
  CompanyResolution,
  DocumentMetadata,
  ValidationReport,
  ValidationIssue,
  ValidationSeverity,
  ExtractionConfidence,
} from './types';

export function validateExtraction(
  metadata: DocumentMetadata,
  companyResolution: CompanyResolution,
  tables: ExtractedTable[]
): ValidationReport {
  const issues: ValidationIssue[] = [];

  const addIssue = (severity: ValidationSeverity, code: string, message: string, context?: any) => {
    issues.push({ severity, code, message, context });
  };

  // 1. Şirket Doğrulaması (Company Resolution)
  if (companyResolution.status === 'UNRESOLVED') {
    addIssue('ERROR', 'COMPANY_UNRESOLVED', 'PDF içeriğinden geçerli bir BIST şirketi tespit edilemedi.');
  } else if (companyResolution.status === 'AMBIGUOUS') {
    addIssue(
      'ERROR',
      'COMPANY_AMBIGUOUS',
      'PDF içeriğinde birden fazla çelişkili şirket adı eşleşti.',
      { matched: companyResolution.notes }
    );
  }

  // 2. Rapor Dönemi Doğrulaması (Fiscal Period)
  if (!metadata.detectedFiscalYear || metadata.detectedFiscalYear < 2000 || metadata.detectedFiscalYear > 2100) {
    addIssue('ERROR', 'INVALID_FISCAL_YEAR', 'Geçerli bir mali yıl (fiscal_year) tespit edilemedi.');
  }

  if (!metadata.detectedFiscalQuarter || metadata.detectedFiscalQuarter < 1 || metadata.detectedFiscalQuarter > 4) {
    addIssue('WARNING', 'INVALID_FISCAL_QUARTER', 'Mali çeyrek (fiscal_quarter) netleşmedi.');
  }

  // 3. Tablo Varlık Kontrolü (Tables Existence)
  if (!tables || tables.length === 0) {
    addIssue('ERROR', 'NO_TABLES_FOUND', 'PDF içeriğinde hiçbir finansal tablo tespit edilemedi.');
    return buildReportFromIssues(issues);
  }

  // Check statement type presence
  const statementTypes = tables.map((t) => t.statementType);
  const hasBalanceSheet = statementTypes.includes('BALANCE_SHEET');
  const hasIncomeStatement = statementTypes.includes('INCOME_STATEMENT');

  if (!hasBalanceSheet && !hasIncomeStatement) {
    addIssue(
      'WARNING',
      'CORE_STATEMENTS_MISSING',
      'Rapor ne Bilanço ne de Gelir Tablosu içeriyor.',
      { foundTypes: statementTypes }
    );
  }

  // 4. Her Tablo İçin Detaylı Kontroller
  let totalRows = 0;
  let totalValues = 0;
  let unmappedCount = 0;

  for (const table of tables) {
    // A. Kolon kontrolü
    if (!table.columns || table.columns.length === 0) {
      addIssue(
        'ERROR',
        'TABLE_HAS_NO_COLUMNS',
        `"${table.tableName}" tablosunda hiçbir dönem kolonu tespit edilemedi.`,
        { tableIdentifier: table.tableIdentifier }
      );
      continue;
    }

    // Check for duplicate columns
    const columnLabels = table.columns.map((c) => `${c.periodType}_${c.periodEnd}_${c.fiscalYear}_${c.durationMonths}`);
    const uniqueLabels = new Set(columnLabels);
    if (columnLabels.length !== uniqueLabels.size) {
      addIssue(
        'WARNING',
        'DUPLICATE_COLUMN_PERIODS',
        `"${table.tableName}" tablosunda aynı döneme ait çakışan kolonlar tespit edildi.`,
        { tableIdentifier: table.tableIdentifier }
      );
    }

    // B. Satır kontrolü
    if (!table.rows || table.rows.length === 0) {
      addIssue(
        'WARNING',
        'TABLE_HAS_NO_ROWS',
        `"${table.tableName}" tablosunda hiçbir satır bulunamadı.`,
        { tableIdentifier: table.tableIdentifier }
      );
      continue;
    }

    const expectedCols = table.columns.length;

    // C. Satır x Kolon Değer Hizalama ve Numeric Parsing Kontrolü
    for (const row of table.rows) {
      totalRows++;
      if (row.mappingStatus === 'UNMAPPED') {
        unmappedCount++;
      } else if (row.mappingStatus === 'AMBIGUOUS') {
        addIssue(
          'WARNING',
          'ROW_MAPPING_AMBIGUOUS',
          `"${row.rawLabel}" satırı için birden fazla olası canonical eşleşme var.`,
          { rowIdentifier: row.rowIdentifier }
        );
      }

      if (row.values.length !== expectedCols) {
        addIssue(
          'ERROR',
          'COLUMN_VALUE_MISMATCH',
          `"${row.rawLabel}" satırındaki değer sayısı (${row.values.length}) tablonun kolon sayısıyla (${expectedCols}) eşleşmiyor. Hizalama bozuk.`,
          { rowIdentifier: row.rowIdentifier, tableIdentifier: table.tableIdentifier }
        );
      }

      for (const val of row.values) {
        totalValues++;
        // Check if numeric parsing failed on non-empty, non-dash text
        if (!val.isEmptyOrNull && !val.isDashOrZero && val.parsedNumericValue === null) {
          addIssue(
            'WARNING',
            'NUMERIC_PARSE_UNCERTAIN',
            `"${val.rawTextValue}" hücresi sayısal olarak çözümlenemedi.`,
            { rawText: val.rawTextValue, rowIdentifier: row.rowIdentifier }
          );
        }
      }
    }
  }

  // 5. Ölçek Doğrulaması (Scale Check)
  if (!metadata.defaultScale) {
    addIssue('WARNING', 'SCALE_UNCERTAIN', 'Rapor para birimi ölçeği (scale) tespit edilemedi, varsayılan atandı.');
  }

  return buildReportFromIssues(issues);
}

function buildReportFromIssues(issues: ValidationIssue[]): ValidationReport {
  const errorCount = issues.filter((i) => i.severity === 'ERROR').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;

  let status: ValidationReport['status'] = 'VALID';
  if (hasErrors) {
    status = 'ERROR';
  } else if (hasWarnings) {
    status = 'WARNING';
  }

  return {
    status,
    isValid: !hasErrors,
    hasErrors,
    hasWarnings,
    errorCount,
    warningCount,
    issues,
  };
}

/**
 * Calculates overall extraction confidence level
 */
export function calculateOverallConfidence(report: ValidationReport): ExtractionConfidence {
  if (report.hasErrors) return 'LOW';
  if (report.hasWarnings && report.warningCount > 2) return 'MEDIUM';
  if (report.hasWarnings) return 'HIGH'; // Minor warnings like unmapped lines still yield high confidence in extraction
  return 'HIGH';
}
