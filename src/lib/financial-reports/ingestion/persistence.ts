/**
 * FinAi KAP System — DB Persistence Engine
 * Transaction-safe multi-table insertion of financial reports, tables, columns,
 * raw rows, and raw values into Supabase with automatic cleanup on failure.
 */

import { getSupabaseAdminClient } from '../admin-client';
import type { FinancialReportExtractionResult, ExtractedTable } from '../parser/types';
import type { StorageUploadResult } from './storage';
import type { VersionResolutionResult } from './versioning';

export interface ReportPersistenceResult {
  reportId: string;
  insertedTablesCount: number;
  insertedColumnsCount: number;
  insertedRowsCount: number;
  insertedValuesCount: number;
  insertedRowMap: Map<string, string>; // rowIdentifier -> DB UUID
  insertedValueMap: Map<string, string>; // rowIdentifier_colOrder -> DB UUID
}

/**
 * Rolls back (deletes) a report and all cascade children on failure
 */
export async function rollbackReport(reportId: string): Promise<void> {
  try {
    const sbAdmin = getSupabaseAdminClient();
    await sbAdmin.from('financial_report_audit_logs').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_statement_snapshots').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_report_raw_values').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_report_raw_rows').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_report_columns').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_report_tables').delete().eq('report_id', reportId);
    await sbAdmin.from('financial_reports').delete().eq('id', reportId);
  } catch (err: any) {
    console.error('Rollback cleanup error:', err.message || err);
  }
}

/**
 * Persists the entire Phase 2 extraction DTO into Supabase
 */
export async function persistExtractionResult(
  extractionResult: FinancialReportExtractionResult,
  storageResult: StorageUploadResult,
  versionResult: VersionResolutionResult,
  uploadedBy: string = 'SYSTEM_MANUAL_INGEST'
): Promise<ReportPersistenceResult> {
  const sbAdmin = getSupabaseAdminClient();
  const meta = extractionResult.documentMetadata;
  const comp = extractionResult.companyResolution;
  const symbol = comp.finaiSymbol || comp.symbol || meta.detectedSymbol || 'UNKNOWN';
  const finaiSymbol = symbol;
  const companyName = comp.companyName || meta.detectedCompanyName || symbol;




  // 1. Insert Record into financial_reports
  const reportPayload = {
    report_slug: versionResult.reportSlug,
    symbol,
    finai_symbol: finaiSymbol,
    company_name: companyName,
    fiscal_year: meta.detectedFiscalYear || new Date().getFullYear(),
    fiscal_quarter: meta.detectedFiscalQuarter || 4,
    reporting_period_start: meta.detectedPeriodStart || `${meta.detectedFiscalYear}-01-01`,
    reporting_period_end: meta.detectedPeriodEnd || `${meta.detectedFiscalYear}-12-31`,
    report_date: meta.detectedPeriodEnd || `${meta.detectedFiscalYear}-12-31`,
    consolidation_type: meta.consolidationType,
    statement_currency: meta.defaultCurrency,
    currency: meta.defaultCurrency,
    default_scale: meta.defaultScale,
    scale_multiplier: meta.scaleMultiplier,
    report_type: meta.reportType,
    audit_status: meta.auditStatus,
    source: 'KAP_MANUAL_PDF',
    source_document_name: meta.fileName,
    source_document_hash_sha256: storageResult.fileHashSha256,
    storage_bucket: storageResult.bucket,
    storage_path: storageResult.path,
    version: versionResult.targetVersion,
    is_current: true,
    is_restatement: versionResult.isRestatement,
    supersedes_report_id: versionResult.supersedesReportId,
    verification_status: extractionResult.validation.isValid ? 'VERIFIED' : 'WARNING',
    verification_notes: extractionResult.validation.issues.map((i) => i.message).join('; '),
    uploaded_by: uploadedBy,
    metadata: {
      totalPages: meta.totalPages,
      rawMetrics: extractionResult.metrics,
      parserVersion: extractionResult.provenance.parserVersion,
    },
  };

  const { data: reportInsertData, error: reportError } = await sbAdmin
    .from('financial_reports')
    .insert(reportPayload)
    .select('id')
    .single();

  if (reportError || !reportInsertData) {
    throw new Error(`financial_reports insert failed: ${reportError?.message}`);
  }

  const reportId = reportInsertData.id;

  try {
    let insertedTablesCount = 0;
    let insertedColumnsCount = 0;
    let insertedRowsCount = 0;
    let insertedValuesCount = 0;

    const insertedRowMap = new Map<string, string>();
    const insertedValueMap = new Map<string, string>();

    // 2. Iterate and Insert Tables
    for (const table of extractionResult.tables) {
      const tablePayload = {
        report_id: reportId,
        statement_type: table.statementType,
        table_name: table.tableName.slice(0, 240),
        table_order: table.tableOrder,
        table_identifier: table.tableIdentifier.slice(0, 60),
        page_start: table.pageStart,
        page_end: table.pageEnd,
        currency: table.currency,
        scale_multiplier: table.scaleMultiplier,
        notes: table.notes,
        metadata: { confidence: table.confidence },
      };

      const { data: tableData, error: tableError } = await sbAdmin
        .from('financial_report_tables')
        .insert(tablePayload)
        .select('id')
        .single();

      if (tableError || !tableData) {
        throw new Error(`financial_report_tables insert failed: ${tableError?.message}`);
      }

      const tableId = tableData.id;
      insertedTablesCount++;

      // 3. Insert Columns for this table
      const columnPayloads = table.columns.map((col) => ({
        table_id: tableId,
        column_order: col.columnOrder,
        column_label: col.columnLabel.slice(0, 240),
        raw_header_text: col.rawHeaderText.slice(0, 240),
        period_start: col.periodStart,
        period_end: col.periodEnd,
        duration_months: col.durationMonths,
        period_type: col.periodType,
        period_nature: col.periodType,
        is_comparative: col.isComparative,
        fiscal_year: col.fiscalYear,
        fiscal_quarter: col.fiscalQuarter,
        currency: col.currency,
        scale: col.scale,
        scale_multiplier: col.scaleMultiplier,
        is_primary_target_period: col.isPrimaryTargetPeriod,
        metadata: { confidence: col.confidence },
      }));

      const { data: colData, error: colError } = await sbAdmin
        .from('financial_report_columns')
        .insert(columnPayloads)
        .select('id, column_order');

      if (colError || !colData) {
        throw new Error(`financial_report_columns insert failed: ${colError?.message}`);
      }

      insertedColumnsCount += colData.length;

      const columnIdMap = new Map<number, string>();
      for (const cData of colData) {
        columnIdMap.set(cData.column_order, cData.id);
      }

      // 4. Insert Raw Rows for this table (Batched)
      const batchSize = 150;
      for (let rIdx = 0; rIdx < table.rows.length; rIdx += batchSize) {
        const rowBatch = table.rows.slice(rIdx, rIdx + batchSize);
        const rowPayloads = rowBatch.map((row) => ({
          report_id: reportId,
          table_id: tableId,
          row_order: row.rowOrder,
          row_identifier: row.rowIdentifier.slice(0, 60),
          raw_label: row.rawLabel.slice(0, 500),
          normalized_label: row.normalizedLabel.slice(0, 500),
          footnote_ref: row.footnoteRef ? row.footnoteRef.slice(0, 50) : null,
          pdf_page_number: row.pdfPageNumber,
          indent_level: row.indentLevel,
          is_subtotal: row.isSubtotal,
          canonical_item_id: row.canonicalItemId,
          mapping_status: row.mappingStatus,
          extraction_metadata: {
            mappingRule: row.mappingRule,
            mappingConfidence: row.mappingConfidence,
            canonicalItemCode: row.canonicalItemCode,
          },
        }));

        const { data: rowsInserted, error: rowError } = await sbAdmin
          .from('financial_report_raw_rows')
          .insert(rowPayloads)
          .select('id, row_identifier');

        if (rowError || !rowsInserted) {
          throw new Error(`financial_report_raw_rows insert failed: ${rowError?.message}`);
        }

        insertedRowsCount += rowsInserted.length;

        const batchRowIdMap = new Map<string, string>();
        for (const rData of rowsInserted) {
          batchRowIdMap.set(rData.row_identifier, rData.id);
          insertedRowMap.set(rData.row_identifier, rData.id);
        }

        // 5. Insert Raw Values for this batch of rows
        const valuePayloads: any[] = [];
        for (const row of rowBatch) {
          const rowDbId = batchRowIdMap.get(row.rowIdentifier);
          if (!rowDbId) continue;

          for (const val of row.values) {
            const colDbId = columnIdMap.get(val.columnOrder);
            if (!colDbId) continue;

            valuePayloads.push({
              row_id: rowDbId,
              column_id: colDbId,
              raw_text_value: val.rawTextValue ? val.rawTextValue.slice(0, 64) : '',
              is_dash_or_zero: val.isDashOrZero,
              is_empty_or_null: val.isEmptyOrNull,
              parsed_numeric_value: val.parsedNumericValue,
              scaled_numeric_value: val.scaledNumericValue,
              currency: val.currency,
              scale: val.scale,
              scale_multiplier: val.scaleMultiplier,
              sign_applied: val.signApplied,
              footnote_override: val.footnoteOverride ? val.footnoteOverride.slice(0, 50) : null,
            });
          }
        }

        if (valuePayloads.length > 0) {
          const { data: valuesInserted, error: valError } = await sbAdmin
            .from('financial_report_raw_values')
            .insert(valuePayloads)
            .select('id, row_id, column_id');

          if (valError || !valuesInserted) {
            throw new Error(`financial_report_raw_values insert failed: ${valError?.message}`);
          }

          insertedValuesCount += valuesInserted.length;

          // Map values back for snapshot linking
          for (const vData of valuesInserted) {
            // Find rowIdentifier and colOrder
            const rowEntry = Array.from(batchRowIdMap.entries()).find((e) => e[1] === vData.row_id);
            const colEntry = Array.from(columnIdMap.entries()).find((e) => e[1] === vData.column_id);
            if (rowEntry && colEntry) {
              insertedValueMap.set(`${rowEntry[0]}_col${colEntry[0]}`, vData.id);
            }
          }
        }
      }
    }

    return {
      reportId,
      insertedTablesCount,
      insertedColumnsCount,
      insertedRowsCount,
      insertedValuesCount,
      insertedRowMap,
      insertedValueMap,
    };
  } catch (err: any) {
    // Rollback created report on failure
    await rollbackReport(reportId);
    throw err;
  }
}
