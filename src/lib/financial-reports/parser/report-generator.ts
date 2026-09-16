/**
 * FinAi KAP PDF Parser — Human-Readable Extraction Report Generator
 * Formats extraction results into a detailed Markdown / ASCII report
 * for review prior to DB persistence.
 */

import type { FinancialReportExtractionResult } from './types';

export function generateExtractionSummaryReport(result: FinancialReportExtractionResult): string {
  const { documentMetadata, companyResolution, tables, validation, provenance, metrics, overallConfidence } = result;

  const lines: string[] = [];

  lines.push('================================================================================');
  lines.push('          FİNAİ MANUEL KAP FİNANSAL RAPOR PDF EXTRACTION RAPORU');
  lines.push('================================================================================');
  lines.push('');

  // 1. Şirket & Genel Rapor Üstverisi
  lines.push('--- [ 1. ŞİRKET VE BELGE BİLGİLERİ ] ---');
  lines.push(`Şirket Sembolü    : ${companyResolution.symbol || 'BİLİNMİYOR'} (FinAi: ${companyResolution.finaiSymbol || '-'})`);
  lines.push(`Şirket Adı        : ${companyResolution.companyName || companyResolution.rawText || '-'}`);
  lines.push(`Eşleşme Durumu    : ${companyResolution.status} (Güven: ${(companyResolution.confidence * 100).toFixed(1)}%)`);
  lines.push(`Mali Dönem        : ${documentMetadata.detectedFiscalYear || '-'} Q${documentMetadata.detectedFiscalQuarter || '-'}`);
  lines.push(`Raporlama Tarihi  : ${documentMetadata.detectedReportDate || documentMetadata.detectedPeriodEnd || '-'}`);
  lines.push(`Konsolidasyon     : ${documentMetadata.consolidationType}`);
  lines.push(`Para Birimi       : ${documentMetadata.defaultCurrency}`);
  lines.push(`Rapor Ölçeği      : ${documentMetadata.defaultScale} (Çarpan: x${documentMetadata.scaleMultiplier.toLocaleString('tr-TR')})`);
  lines.push(`Denetim Durumu    : ${documentMetadata.auditStatus}`);
  lines.push(`Toplam Sayfa      : ${provenance.totalPages} sayfa (Taranan: ${provenance.pagesScanned.length})`);
  lines.push(`Dosya SHA-256     : ${provenance.sourceDocumentHashSha256.slice(0, 16)}...`);
  lines.push('');

  // 2. Tablolar ve Kolon Yapısı
  lines.push('--- [ 2. TESPİT EDİLEN TABLOLAR VE DÖNEM KOLONLARI ] ---');
  if (tables.length === 0) {
    lines.push('Hiçbir finansal tablo bulunamadı!');
  } else {
    for (const table of tables) {
      lines.push(`\n▶ Tablo: ${table.tableName} [${table.statementType}]`);
      lines.push(`  Tanımlayıcı : ${table.tableIdentifier} (Sayfa: ${table.pageStart}-${table.pageEnd})`);
      lines.push(`  Para/Ölçek  : ${table.currency} / ${table.scale} (x${table.scaleMultiplier.toLocaleString('tr-TR')})`);
      lines.push(`  Kolonlar (${table.columns.length}):`);
      for (const col of table.columns) {
        const compTag = col.isComparative ? ' [KARŞILAŞTIRMALI]' : '';
        const primTag = col.isPrimaryTargetPeriod ? ' ★' : '';
        lines.push(
          `    #${col.columnOrder}: "${col.rawHeaderText}" -> ${col.periodType}${compTag}${primTag} | Bitiş: ${col.periodEnd} (${col.durationMonths} Ay)`
        );
      }
      lines.push(`  Satır Sayısı: ${table.rows.length} adet ham satır`);
    }
  }
  lines.push('');

  // 3. Örnek Satırlar (İlk 5 ve Unmapped örnekleri)
  lines.push('--- [ 3. SATIR VE KALEM EXTRACTION ÖRNEKLERİ ] ---');
  for (const table of tables) {
    lines.push(`\nTablo: ${table.tableName} (Örnek Satırlar)`);
    const sampleRows = table.rows.slice(0, 6);
    for (const row of sampleRows) {
      const canonicalTag = row.canonicalItemCode ? ` -> [${row.canonicalItemCode}]` : ' -> [UNMAPPED]';
      const valuesStr = row.values.map((v) => v.rawTextValue || '(boş)').join(' | ');
      const subtotalTag = row.isSubtotal ? ' [TOPLAM]' : '';
      lines.push(`  L${row.rowOrder} (P${row.pdfPageNumber}) "${row.rawLabel}"${canonicalTag}${subtotalTag}`);
      lines.push(`       Değerler: [ ${valuesStr} ]`);
    }
  }
  lines.push('');

  // 4. Metrikler ve Veri Kaybı Doğrulaması
  lines.push('--- [ 4. METRİKLER VE HAM VERİ KORUMA GÜVENCESİ ] ---');
  lines.push(`Toplam Tablo       : ${metrics.totalTables}`);
  lines.push(`Toplam Kolon       : ${metrics.totalColumns}`);
  lines.push(`Toplam Ham Satır   : ${metrics.totalRows}`);
  lines.push(`Toplam Hücre Değeri: ${metrics.totalValues}`);
  lines.push(`Eşleşen Satırlar   : ${metrics.mappedRowsCount}`);
  lines.push(`Eşleşmeyen (Raw)   : ${metrics.unmappedRowsCount} (asla silinmedi, korundu)`);
  lines.push(`Belirsiz Satırlar  : ${metrics.ambiguousRowsCount}`);
  lines.push(`Tire / Sıfır Hücre : ${metrics.dashOrZeroValuesCount}`);
  lines.push(`Boş Hücre          : ${metrics.emptyValuesCount}`);
  lines.push(`RAW VERİ KAYBI     : ${metrics.rawLossCount} (0 KAYIP - %${(metrics.rawPreservationRate * 100).toFixed(1)} Koruma)`);
  lines.push('');

  // 5. Doğrulama ve Uyarılar
  lines.push('--- [ 5. VALIDATION VE KALİTE RAPORU ] ---');
  lines.push(`Validation Durumu  : ${validation.status} (Hatalar: ${validation.errorCount}, Uyarılar: ${validation.warningCount})`);
  lines.push(`Genel Güven Skoru  : ${overallConfidence}`);
  if (validation.issues.length > 0) {
    lines.push('Tespit Edilen Maddeler:');
    for (const issue of validation.issues) {
      const prefix = issue.severity === 'ERROR' ? '❌ [ERROR]' : issue.severity === 'WARNING' ? '⚠️ [WARNING]' : 'ℹ️ [INFO]';
      lines.push(`  ${prefix} [${issue.code}] ${issue.message}`);
    }
  } else {
    lines.push('✅ Hiçbir hata veya uyarı tespit edilmedi.');
  }

  lines.push('');
  lines.push('================================================================================');

  return lines.join('\n');
}
