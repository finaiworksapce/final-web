/**
 * FinAi KAP System — Operational CLI Ingestion Entrypoint (FAZ 9)
 * Usage: cmd /c npx tsx scripts/ingest-kap-pdf.ts "<PDF_PATH>" [SYMBOL]
 */

import fs from 'node:fs';
import path from 'node:path';
import { ensureEnvLoaded } from '../src/lib/financial-reports/admin-client';
import { ingestFinancialReport } from '../src/lib/financial-reports/ingestion/orchestrator';

ensureEnvLoaded();

async function runCliIngestion() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ HATA: PDF dosya yolu belirtilmelidir.');
    console.log('Kullanım: cmd /c npx tsx scripts/ingest-kap-pdf.ts "<PDF_PATH>" [SYMBOL]');
    process.exit(1);
  }

  const pdfPath = path.resolve(process.cwd(), args[0]);
  const overrideSymbol = args[1] ? args[1].toUpperCase().trim() : undefined;

  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ HATA: Dosya bulunamadı: "${pdfPath}"`);
    process.exit(1);
  }

  const stats = fs.statSync(pdfPath);
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  if (stats.size > MAX_FILE_SIZE) {
    console.error(`❌ HATA: Dosya boyutu (${(stats.size / 1024 / 1024).toFixed(2)} MB) izin verilen maksimum sınırı (100MB) aşıyor.`);
    process.exit(1);
  }

  const fileName = path.basename(pdfPath);
  const pdfBuffer = fs.readFileSync(pdfPath);

  console.log(`[FAZ 9 CLI] PDF İşleme Başlatılıyor: "${fileName}" (Boyut: ${pdfBuffer.length} bayt)...`);
  if (overrideSymbol) {
    console.log(`[FAZ 9 CLI] Belirtilen Sembol (Override): ${overrideSymbol}`);
  }

  const result = await ingestFinancialReport(pdfBuffer, {
    sourceFileName: fileName,
    overrideSymbol,
    uploadedBy: 'CLI_MANUAL_OPERATOR',
  });

  console.log('\n' + (result.formattedReportText || result.message) + '\n');

  if (result.status === 'BLOCKED' || result.status === 'VALIDATION_BLOCKED' || result.status === 'FAILED' || !result.success) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runCliIngestion().catch((err) => {
  console.error('\n❌ OPERASYONEL INGESTION HATA:', err.message || err);
  process.exit(1);
});
