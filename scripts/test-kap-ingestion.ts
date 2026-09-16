/**
 * FinAi KAP System — Phase 3 Ingestion Test Suite
 * End-to-end test of ingestion, DB persistence, storage upload, versioning,
 * idempotency, auditing, and post-insert verification on live Supabase DB.
 */

import fs from 'node:fs';
import {
  ingestFinancialReport,
} from '../src/lib/financial-reports/ingestion/index';
import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function runIngestionTest() {
  console.log('================================================================================');
  console.log('FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 3 SUPABASE INGESTION TESTİ');
  console.log('================================================================================\n');

  const pdfPath = 'C:\\Users\\kavak\\Downloads\\Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf';
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF dosyası bulunamadı: ${pdfPath}`);
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  console.log(`[TEST 1/5] PDF Dosyası Yüklendi (${pdfBuffer.length} bayt). Önceki Test Temizliği Yapılıyor...`);

  // Clean prior test runs for GLCVY 2026 Q2 to ensure deterministic test execution
  const sbAdminSetup = getSupabaseAdminClient();
  await sbAdminSetup.from('financial_reports').delete().eq('symbol', 'GLCVY').eq('fiscal_year', 2026).eq('fiscal_quarter', 2);

  console.log('   Önceki test verileri temizlendi. Ingestion Pipeline (v1) Başlatılıyor...');

  // ---------------------------------------------------------------------------
  // 1. GERÇEK INGESTION TESTİ (v1)
  // ---------------------------------------------------------------------------
  const result1 = await ingestFinancialReport(pdfBuffer, {
    sourceFileName: 'Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf',
    overrideSymbol: 'GLCVY',
    uploadedBy: 'SYSTEM_PHASE3_TEST',
  });

  console.log('\n--- INGESTION SONUCU (v1) ---');
  console.log(`Status            : ${result1.status}`);
  console.log(`Report ID         : ${result1.reportId}`);
  console.log(`Report Slug       : ${result1.reportSlug}`);
  console.log(`Versiyon          : v${result1.version} (isCurrent: ${result1.isCurrent})`);
  console.log(`BİST / FinAi      : ${result1.symbol} (${result1.companyName})`);
  console.log(`Dönem             : ${result1.fiscalYear} Q${result1.fiscalQuarter} (${result1.periodEnd})`);
  console.log(`Storage Path      : ${result1.storagePath}`);
  console.log(`Yazılan Tablo     : ${result1.insertedTables}`);
  console.log(`Yazılan Kolon     : ${result1.insertedColumns}`);
  console.log(`Yazılan Ham Satır : ${result1.insertedRows}`);
  console.log(`Yazılan Hücre     : ${result1.insertedValues}`);
  console.log(`Unmapped Korunan  : ${result1.unmappedRowsCount}`);
  console.log(`Oluşturulan Snap  : ${result1.snapshotsCreated}`);
  console.log(`Audit Log Kaydı   : ${result1.auditLogsCreated}`);

  if (!result1.success || !result1.reportId) {
    console.error('❌ Ingest hatası:', result1.message);
    console.error('❌ Verification Issues:', result1.verification?.issues);
    throw new Error('Ingestion v1 başarısız!');
  }
  console.log('✅ [TEST 1/5] Gerçek Ingestion ve DB Persistence Başarılı.');

  // ---------------------------------------------------------------------------
  // 2. POST-INSERT VERIFICATION (DB'den Tekrar Okuyarak Doğrulama)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 2/5] Post-Insert DB Doğrulaması (Canlı DB Sorgusu)...');
  const ver = result1.verification;
  if (!ver || !ver.passed) {
    console.error('❌ DB Doğrulama Hataları:', ver?.issues);
    throw new Error('Post-insert DB verification başarısız!');
  }

  console.log(`   ✅ DB Kaydı Mevcut       : ${ver.reportExists}`);
  console.log(`   ✅ Sembol / Dönem Uyumu  : ${ver.symbolMatches} / ${ver.periodMatches}`);
  console.log(`   ✅ Tablo / Kolon Sayısı  : ${ver.tablesCountMatch} / ${ver.columnsCountMatch}`);
  console.log(`   ✅ Raw Satır / Değer     : ${ver.rawRowsCountMatch} / ${ver.rawValuesCountMatch}`);
  console.log(`   ✅ Unmapped Korunması    : ${ver.unmappedRowsPreserved}`);
  console.log(`   ✅ Storage Dosya & Hash  : ${ver.storageFileExists} / ${ver.storageHashMatches}`);
  console.log(`   ✅ Bilanço Dengesi (A=P) : ${ver.balanceSheetEquityEqualsAssets} (Aktif: ${ver.totalAssetsValue.toLocaleString('tr-TR')}, Pasif: ${ver.totalLiabilitiesEquityValue.toLocaleString('tr-TR')} Bin TL)`);
  console.log(`   ✅ Net Dönem Kârı        : ${ver.netIncomeValue.toLocaleString('tr-TR')} Bin TL`);
  console.log('✅ [TEST 2/5] Post-Insert DB Doğrulaması %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // 3. IDEMPOTENCY / MÜKERRER KAYIT TESTİ (Aynı PDF İkinci Kez İletiliyor)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 3/5] Idempotency / Mükerrer Ingestion Testi (Aynı PDF Tekrar Geri Gönderiliyor)...');
  const result2 = await ingestFinancialReport(pdfBuffer, {
    sourceFileName: 'Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf',
    overrideSymbol: 'GLCVY',
  });

  console.log(`   İkinci Çalıştırma Status: ${result2.status}`);
  console.log(`   Yazılan Yeni Satır Sayısı: ${result2.insertedRows}`);
  if (result2.status !== 'DUPLICATE' || result2.insertedRows !== 0) {
    throw new Error('Idempotency hatası! Aynı PDF mükerrer satırlar ekledi.');
  }

  // Teyit: DB'deki toplam kaydın artmadığını sorgula
  const sbAdmin = getSupabaseAdminClient();
  const { count: reportCount } = await sbAdmin
    .from('financial_reports')
    .select('*', { count: 'exact', head: true })
    .eq('symbol', 'GLCVY')
    .eq('fiscal_year', 2026)
    .eq('fiscal_quarter', 2);

  console.log(`   DB'deki Toplam Rapor Sayısı: ${reportCount} adet`);
  if (reportCount !== 1) {
    throw new Error(`Mükerrer rapor sayısı hatalı! Beklenen: 1, DB: ${reportCount}`);
  }
  console.log('✅ [TEST 3/5] Idempotency / Duplicate Engelleme %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // 4. VERSIONING & RESTATEMENT ZİNCİRİ TESTİ (Restatement v2 Üretimi)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 4/5] Versioning / Restatement Zincir Testi (v2 Üretiliyor)...');
  const result3 = await ingestFinancialReport(pdfBuffer, {
    sourceFileName: 'Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf',
    overrideSymbol: 'GLCVY',
    forceReingest: true, // Force version creation
    uploadedBy: 'TEST_RESTATEMENT_TRIGGER',
    notes: 'KONTROLLÜ RESTATEMENT TESTİ V2',
  });

  console.log(`   Yeni Versiyon Status : ${result3.status}`);
  console.log(`   Versiyon             : v${result3.version} (isCurrent: ${result3.isCurrent})`);
  console.log(`   Restatement Bayrağı  : ${result3.isRestatement}`);
  console.log(`   Supersedes Report ID : ${result3.supersedesReportId}`);

  if (result3.version !== 2 || !result3.isRestatement || result3.supersedesReportId !== result1.reportId) {
    throw new Error('Versioning / Restatement zinciri hatalı!');
  }

  // Verify DB version chain
  const { data: v1Data } = await sbAdmin
    .from('financial_reports')
    .select('id, version, is_current')
    .eq('id', result1.reportId)
    .single();

  const { data: v2Data } = await sbAdmin
    .from('financial_reports')
    .select('id, version, is_current, supersedes_report_id')
    .eq('id', result3.reportId)
    .single();

  console.log(`   v1 Durumu DB         : Version ${v1Data?.version}, is_current = ${v1Data?.is_current}`);
  console.log(`   v2 Durumu DB         : Version ${v2Data?.version}, is_current = ${v2Data?.is_current}, supersedes = ${v2Data?.supersedes_report_id}`);

  if (v1Data?.is_current !== false || v2Data?.is_current !== true) {
    throw new Error('DB is_current versiyon güncellemesi hatalı!');
  }
  console.log('✅ [TEST 4/5] Versioning ve Restatement Zinciri %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // 5. AUDIT LOG ZİNCİRİ DOĞRULAMASI
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 5/5] Audit Log Kayıtlarının Doğrulanması...');
  const { data: auditEvents } = await sbAdmin
    .from('financial_report_audit_logs')
    .select('event_type, status, message, created_at')
    .eq('symbol', 'GLCVY')
    .order('created_at', { ascending: true });

  console.log(`   Oluşturulan Toplam Audit Log: ${auditEvents?.length || 0} adet`);
  if (auditEvents) {
    for (const ev of auditEvents.slice(0, 10)) {
      console.log(`   • [${ev.status.padEnd(7)}] ${ev.event_type.padEnd(20)} : ${ev.message.slice(0, 70)}`);
    }
  }

  if (!auditEvents || auditEvents.length < 5) {
    throw new Error('Audit log sayısı yetersiz!');
  }
  console.log('✅ [TEST 5/5] Audit Log Kayıtları %100 Doğrulandı.');

  console.log('\n================================================================================');
  console.log('🎉 FAZ 3 INGGESTION TESTİ BAŞARIYLA TAMAMLANDI.');
  console.log('   Rapor ID (v2 Current) : ', result3.reportId);
  console.log('   Storage PDF Path      : ', result3.storagePath);
  console.log('   Bilanço Aktif/Pasif   : ', ver.totalAssetsValue.toLocaleString('tr-TR'), 'Bin TL');
  console.log('   Net Dönem Kârı        : ', ver.netIncomeValue.toLocaleString('tr-TR'), 'Bin TL');
  console.log('================================================================================\n');
}

runIngestionTest().catch((err) => {
  console.error('Ingestion test hatası:', err);
  process.exit(1);
});
