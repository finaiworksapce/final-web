/**
 * FinAi KAP System — FAZ 6 Financial History, Versioning & Restatement Hardening Test Harness
 * Executes 14 comprehensive, non-destructive, database-verified automated tests.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getSupabaseAdminClient, ensureEnvLoaded } from '../src/lib/financial-reports/admin-client';
import { ingestFinancialReport } from '../src/lib/financial-reports/ingestion/orchestrator';
import {
  getCompanyReportHistory,
  getCurrentReportForPeriod,
  getReportSnapshots,
  verifyDatabaseIntegrity,
} from '../src/lib/financial-reports/repository';
import { validateAccountingIntegrity } from '../src/lib/financial-reports/standardizer/accounting-validator';

ensureEnvLoaded();
const sbAdmin = getSupabaseAdminClient();

const TEST_SYMBOL_1 = 'TEST_COEXIST';
const TEST_SYMBOL_2 = 'TEST_ISOLATED';


async function cleanupTestFixtures() {
  const symbols = [TEST_SYMBOL_1, TEST_SYMBOL_2];
  for (const sym of symbols) {
    const { data: reps } = await sbAdmin
      .from('financial_reports')
      .select('id')
      .eq('symbol', sym);

    if (reps && reps.length > 0) {
      const { rollbackReport } = await import('../src/lib/financial-reports/ingestion/persistence');
      for (const r of reps) {
        await rollbackReport(r.id);
      }
    }

    const { error: upsertErr } = await sbAdmin.from('symbol_mappings').upsert(
      {
        finai_symbol: sym,
        yahoo_symbol: `${sym}.IS`,
        company_name: `TEST HARNESS ${sym}`,
        is_active: true,
      },
      { onConflict: 'finai_symbol' }
    );

    if (upsertErr) {
      console.error(`[ERROR] symbol_mappings upsert error for ${sym}:`, upsertErr);
    }
  }
}


async function runPhase6Tests() {
  console.log('='.repeat(80));
  console.log('FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 6 TARSİHÇE & VERSIONING HARDENING (14/14 TEST)');
  console.log('='.repeat(80));

  await cleanupTestFixtures();

  const basePdfPath = path.resolve(process.cwd(), 'Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf');
  let sampleBuffer: Buffer;

  if (fs.existsSync(basePdfPath)) {
    sampleBuffer = fs.readFileSync(basePdfPath);
  } else {
    const altPdfPath = 'C:\\Users\\kavak\\Downloads\\Gelecek Varlık Yönetimi A.Ş. 30 Haziran 2026.pdf';
    if (fs.existsSync(altPdfPath)) {
      sampleBuffer = fs.readFileSync(altPdfPath);
    } else {
      throw new Error(`Test PDF belgesi bulunamadı: ${basePdfPath}`);
    }
  }

  const pdfBufferQ1 = Buffer.concat([sampleBuffer, Buffer.from('\n% FIXTURE_COEXIST_2026_Q1')]);
  const pdfBufferQ2 = Buffer.concat([sampleBuffer, Buffer.from('\n% FIXTURE_COEXIST_2026_Q2')]);
  const pdfBufferIsolated = Buffer.concat([sampleBuffer, Buffer.from('\n% FIXTURE_ISOLATED_2026_Q2')]);

  // ---------------------------------------------------------------------------
  // TEST 1: Logical Period Identity Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 1/14] Logical Period Identity Testi...');
  const ingestQ1 = await ingestFinancialReport(pdfBufferQ1, {
    overrideSymbol: TEST_SYMBOL_1,
    sourceFileName: 'TEST_COEXIST_2026_Q1_V1.pdf',
  });

  if (!ingestQ1.success || !ingestQ1.reportId) {
    throw new Error(`TEST 1 Ingestion başarısız: ${ingestQ1.message}`);
  }

  // Manually update period to 2026 Q1 for testing period identity
  await sbAdmin
    .from('financial_reports')
    .update({
      fiscal_year: 2026,
      fiscal_quarter: 1,
      reporting_period_start: '2026-01-01',
      reporting_period_end: '2026-03-31',
      report_date: '2026-03-31',
      report_slug: `${TEST_SYMBOL_1}_2026_Q1_V1`,
    })
    .eq('id', ingestQ1.reportId);

  await sbAdmin
    .from('financial_statement_snapshots')
    .update({
      fiscal_year: 2026,
      fiscal_quarter: 1,
      period_end: '2026-03-31',
    })
    .eq('report_id', ingestQ1.reportId);

  const { data: q1Raw } = await sbAdmin.from('financial_reports').select('consolidation_type').eq('id', ingestQ1.reportId).single();
  const q1Consolidation = q1Raw?.consolidation_type || 'STANDALONE';
  const q1Report = await getCurrentReportForPeriod(TEST_SYMBOL_1, 2026, 1, q1Consolidation as any);
  if (!q1Report || q1Report.id !== ingestQ1.reportId || q1Report.fiscal_quarter !== 1) {
    throw new Error('TEST 1: Logical Period Q1 kaydı doğrulanamadı!');
  }

  console.log(`   • Q1 Report ID  : ${q1Report.id}`);
  console.log(`   • Dönem Key     : ${q1Report.symbol} ${q1Report.fiscal_year} Q${q1Report.fiscal_quarter} (${q1Report.consolidation_type})`);
  console.log('   ✅ [TEST 1/14] Logical Period Identity %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 2: Different Periods Coexist Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 2/14] Coexistence of Different Periods Testi...');
  const ingestQ2 = await ingestFinancialReport(pdfBufferQ2, {
    overrideSymbol: TEST_SYMBOL_1,
    sourceFileName: 'TEST_COEXIST_2026_Q2_V1.pdf',
  });

  if (!ingestQ2.success || !ingestQ2.reportId) {
    throw new Error(`TEST 2 Ingestion başarısız: ${ingestQ2.message}`);
  }

  const historyAfterQ2 = await getCompanyReportHistory(TEST_SYMBOL_1, { currentOnly: true });
  if (historyAfterQ2.length < 2) {
    throw new Error(`TEST 2: Q1 ve Q2 bir arada bulunamadı! Toplam current: ${historyAfterQ2.length}`);
  }

  const currentQ1 = historyAfterQ2.find((r) => r.fiscal_quarter === 1);
  const currentQ2 = historyAfterQ2.find((r) => r.fiscal_quarter === 2);

  if (!currentQ1 || !currentQ2 || !currentQ1.is_current || !currentQ2.is_current) {
    throw new Error('TEST 2: Farklı dönemlerin is_current = true olarak bir arada var olması sağlaanamadı!');
  }
  console.log(`   • Aktif Q1 ID : ${currentQ1.id} (Version: v${currentQ1.version})`);
  console.log(`   • Aktif Q2 ID : ${currentQ2.id} (Version: v${currentQ2.version})`);
  console.log('   ✅ [TEST 2/14] Coexistence of Different Periods %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 3: Same Hash = Duplicate Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 3/14] Same Hash = Duplicate Testi...');
  const duplicateRes = await ingestFinancialReport(pdfBufferQ2, {
    overrideSymbol: TEST_SYMBOL_1,
    sourceFileName: 'TEST_COEXIST_2026_Q2_V1_DUP.pdf',
  });

  if (duplicateRes.status !== 'DUPLICATE') {
    throw new Error(`TEST 3: Aynı hash için DUPLICATE bekleniyordu ancak ${duplicateRes.status} alındı.`);
  }

  const reportsPostDup = await getCompanyReportHistory(TEST_SYMBOL_1);
  if (reportsPostDup.length !== 2) {
    throw new Error(`TEST 3: Mükerrer yükleme yeni rapor ekledi! Toplam rapor: ${reportsPostDup.length}`);
  }
  console.log(`   • İkinci Yükleme Statüsü : ${duplicateRes.status}`);
  console.log(`   • Mükerrer Engelleme    : Mükerrer kayıt engellendi, toplam rapor sayısı = ${reportsPostDup.length}`);
  console.log('   ✅ [TEST 3/14] Same Hash = Duplicate %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 4: Same Period + Different Hash = Restatement (v2) Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 4/14] Same Period + Different Hash = Restatement (v2) Testi...');
  const restatedBuffer = Buffer.concat([pdfBufferQ2, Buffer.from('\n% RESTATEMENT FOOTER V2 TEST')]);
  const restateRes = await ingestFinancialReport(restatedBuffer, {
    overrideSymbol: TEST_SYMBOL_1,
    sourceFileName: 'TEST_COEXIST_2026_Q2_V2_RESTATED.pdf',
  });

  if (!restateRes.success || !restateRes.reportId) {
    throw new Error(`TEST 4 Restatement başarısız: ${restateRes.message}`);
  }

  const { data: q2V1 } = await sbAdmin.from('financial_reports').select('*').eq('id', ingestQ2.reportId).single();
  const { data: q2V2 } = await sbAdmin.from('financial_reports').select('*').eq('id', restateRes.reportId).single();

  if (!q2V1 || !q2V2) {
    throw new Error('TEST 4: Restatement rapor kayıtları DB\'de bulunamadı!');
  }

  if (q2V1.is_current !== false || q2V2.is_current !== true || q2V2.version !== 2 || q2V2.is_restatement !== true || q2V2.supersedes_report_id !== q2V1.id) {
    throw new Error(`TEST 4: Restatement versiyon zinciri hatalı! v1: is_current=${q2V1.is_current}, v2: is_current=${q2V2.is_current}, ver=${q2V2.version}`);
  }
  console.log(`   • Eski Rapor (v1) : Version=${q2V1.version}, is_current=${q2V1.is_current}`);
  console.log(`   • Yeni Rapor (v2) : Version=${q2V2.version}, is_current=${q2V2.is_current}, is_restatement=${q2V2.is_restatement}`);
  console.log(`   • Supersedes ID   : ${q2V2.supersedes_report_id}`);
  console.log('   ✅ [TEST 4/14] Same Period + Different Hash = Restatement (v2) %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 5: Only One Current Version Per Logical Period Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 5/14] Only One Current Version Per Logical Period Testi...');
  const { data: periodQ2Reports } = await sbAdmin
    .from('financial_reports')
    .select('id, version, is_current')
    .eq('symbol', TEST_SYMBOL_1)
    .eq('fiscal_year', 2026)
    .eq('fiscal_quarter', 2);

  const currentCountInQ2 = (periodQ2Reports || []).filter((r) => r.is_current).length;
  if (currentCountInQ2 !== 1) {
    throw new Error(`TEST 5: 2026 Q2 dönemi için is_current=true sayısı 1 olmalı ancak ${currentCountInQ2} bulundu!`);
  }
  console.log(`   • 2026 Q2 Rapor Sayısı      : ${periodQ2Reports?.length} adet`);
  console.log(`   • Aktif (is_current) Sayısı : ${currentCountInQ2} adet (En fazla 1 kuralı %100 sağlandı)`);
  console.log('   ✅ [TEST 5/14] Only One Current Version Per Logical Period %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 6: Old Version Preserved Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 6/14] Old Version Preserved (Immutability) Testi...');
  const { count: v1TablesCount } = await sbAdmin.from('financial_report_tables').select('*', { count: 'exact', head: true }).eq('report_id', q2V1.id);
  const { count: v1RowsCount } = await sbAdmin.from('financial_report_raw_rows').select('*', { count: 'exact', head: true }).eq('report_id', q2V1.id);

  if (!v1TablesCount || v1TablesCount === 0 || !v1RowsCount || v1RowsCount === 0) {
    throw new Error(`TEST 6: Eski v1 versiyonunun ham tabloları/satırları silinmiş! Tables: ${v1TablesCount}, Rows: ${v1RowsCount}`);
  }
  console.log(`   • v1 Rapor ID    : ${q2V1.id}`);
  console.log(`   • Korunan Tablolar: ${v1TablesCount} adet`);
  console.log(`   • Korunan Satırlar: ${v1RowsCount} adet`);
  console.log('   ✅ [TEST 6/14] Old Version Preserved %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 7: Raw Data Preserved (Zero Data Loss) Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 7/14] Raw Data Preserved (Zero Overwrite) Testi...');
  const { count: v2RowsCount } = await sbAdmin.from('financial_report_raw_rows').select('*', { count: 'exact', head: true }).eq('report_id', q2V2.id);

  if (!v2RowsCount || v2RowsCount === 0) {
    throw new Error('TEST 7: v2 ham satırları bulunamadı!');
  }
  console.log(`   • v1 Raw Rows : ${v1RowsCount} adet`);
  console.log(`   • v2 Raw Rows : ${v2RowsCount} adet`);
  console.log('   ✅ [TEST 7/14] Raw Data Preserved %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 8: Snapshot Provenance Preserved Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 8/14] Snapshot Provenance Preserved Testi...');
  const v1Snapshots = await getReportSnapshots(q2V1.id);
  const v2Snapshots = await getReportSnapshots(q2V2.id);

  if (v1Snapshots.length === 0 || v2Snapshots.length === 0) {
    throw new Error(`TEST 8: Snapshot'lar bulunamadı! v1: ${v1Snapshots.length}, v2: ${v2Snapshots.length}`);
  }

  const v1CurrentSnaps = v1Snapshots.filter((s) => s.is_current).length;
  const v2CurrentSnaps = v2Snapshots.filter((s) => s.is_current).length;

  if (v1CurrentSnaps !== 0 || v2CurrentSnaps !== v2Snapshots.length) {
    throw new Error(`TEST 8: Snapshot provenance hatalı! v1 active: ${v1CurrentSnaps}, v2 active: ${v2CurrentSnaps}`);
  }
  console.log(`   • v1 Snapshots : ${v1Snapshots.length} adet (is_current=false)`);
  console.log(`   • v2 Snapshots : ${v2Snapshots.length} adet (is_current=true)`);
  console.log('   ✅ [TEST 8/14] Snapshot Provenance Preserved %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 9: Historical Ordering Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 9/14] Historical Ordering Testi...');
  const historyList = await getCompanyReportHistory(TEST_SYMBOL_1);

  if (historyList.length < 3) {
    throw new Error(`TEST 9: Rapor geçmişi beklenenden eksik! Sayı: ${historyList.length}`);
  }

  const firstInHistory = historyList[0];
  const secondInHistory = historyList[1];

  if (firstInHistory.fiscal_quarter !== 2 || firstInHistory.version !== 2) {
    throw new Error(`TEST 9: Sıralamada ilk eleman 2026 Q2 v2 olmalıydı ancak quarter=${firstInHistory.fiscal_quarter}, version=${firstInHistory.version} geldi!`);
  }
  if (secondInHistory.fiscal_quarter !== 2 || secondInHistory.version !== 1) {
    throw new Error(`TEST 9: Sıralamada ikinci eleman 2026 Q2 v1 olmalıydı ancak quarter=${secondInHistory.fiscal_quarter}, version=${secondInHistory.version} geldi!`);
  }

  console.log('   • Deterministik Sıralama:');
  for (let i = 0; i < historyList.length; i++) {
    const r = historyList[i];
    console.log(`     ${i + 1}. ${r.symbol} ${r.fiscal_year} Q${r.fiscal_quarter} v${r.version} (current: ${r.is_current})`);
  }
  console.log('   ✅ [TEST 9/14] Historical Ordering %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 10: Multi-Company Isolation Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 10/14] Multi-Company Isolation Testi...');
  const ingestIsolated = await ingestFinancialReport(pdfBufferIsolated, {
    overrideSymbol: TEST_SYMBOL_2,
    sourceFileName: 'TEST_ISOLATED_2026_Q2_V1.pdf',
  });

  if (!ingestIsolated.success || !ingestIsolated.reportId) {
    throw new Error(`TEST 10 Ingestion başarısız: ${ingestIsolated.message}`);
  }

  const isolatedHistory = await getCompanyReportHistory(TEST_SYMBOL_2);
  const coexistHistory = await getCompanyReportHistory(TEST_SYMBOL_1);

  if (isolatedHistory.length !== 1 || coexistHistory.length !== 3) {
    throw new Error(`TEST 10: Şirketler arası çakışma var! Symbol 1: ${coexistHistory.length}, Symbol 2: ${isolatedHistory.length}`);
  }
  console.log(`   • ${TEST_SYMBOL_1} Rapor Sayısı : ${coexistHistory.length} adet`);
  console.log(`   • ${TEST_SYMBOL_2} Rapor Sayısı : ${isolatedHistory.length} adet`);
  console.log('   ✅ [TEST 10/14] Multi-Company Isolation %100 Başarılı (0 Çakışma).');

  // ---------------------------------------------------------------------------
  // TEST 11: Audit Trail Verification
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 11/14] Audit Trail Verification Testi...');
  const { data: auditLogs } = await sbAdmin
    .from('financial_report_audit_logs')
    .select('*')
    .eq('symbol', TEST_SYMBOL_1)
    .order('created_at', { ascending: false });

  if (!auditLogs || auditLogs.length === 0) {
    throw new Error('TEST 11: Audit log kayıtları bulunamadı!');
  }

  const eventTypes = new Set(auditLogs.map((l) => l.event_type));
  if (!eventTypes.has('PARSED') || !eventTypes.has('VERSION_CREATED') || !eventTypes.has('INGEST_COMPLETED')) {
    throw new Error(`TEST 11: Beklenen audit olayları eksik! Bulunanlar: ${Array.from(eventTypes).join(', ')}`);
  }

  console.log(`   • Toplam Audit Log  : ${auditLogs.length} adet`);
  console.log(`   • Kayıtlı Olay Türü: ${Array.from(eventTypes).join(', ')}`);
  console.log('   ✅ [TEST 11/14] Audit Trail Verification %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 12: Database Integrity Check
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 12/14] Database Integrity Check Testi...');
  const integrityResult = await verifyDatabaseIntegrity();

  if (!integrityResult.valid) {
    console.error('Integrity check issues:', integrityResult.issues);
    throw new Error(`TEST 12: DB Integrity denetiminde ${integrityResult.issues.length} ihlal tespit edildi!`);
  }
  console.log(`   • Toplam Rapor      : ${integrityResult.stats.totalReports}`);
  console.log(`   • Aktif Rapor Sayısı: ${integrityResult.stats.currentReportsCount}`);
  console.log(`   • Mantıksal Dönem  : ${integrityResult.stats.logicalPeriodsCount}`);
  console.log(`   • Orphan Snapshot   : ${integrityResult.stats.orphanSnapshotsCount}`);
  console.log(`   • Security Leaks    : ${integrityResult.stats.auditSecretLeaksCount}`);
  console.log('   ✅ [TEST 12/14] Database Integrity Check %100 Başarılı (0 İhlal).');

  // ---------------------------------------------------------------------------
  // TEST 13: Existing THYAO Regression Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 13/14] THYAO Faz 5 Regresyon Testi...');
  const { data: thyaoReport } = await sbAdmin
    .from('financial_reports')
    .select('id, symbol, is_current')
    .eq('symbol', 'THYAO')
    .eq('is_current', true)
    .maybeSingle();

  if (!thyaoReport) {
    throw new Error('TEST 13: Canlı THYAO aktif raporu DB\'de bulunamadı!');
  }

  const thyaoValidation = await validateAccountingIntegrity(thyaoReport.id);
  if (!thyaoValidation.passed || !thyaoValidation.balanceSheetEquation.passed) {
    throw new Error('TEST 13: THYAO bilanço denkliği bozulmuş!');
  }
  console.log(`   • THYAO Report ID    : ${thyaoReport.id}`);
  console.log(`   • THYAO Aktif=Pasif  : ${thyaoValidation.balanceSheetEquation.passed} (Fark: ${thyaoValidation.balanceSheetEquation.currentPeriod.difference} TL)`);
  console.log('   ✅ [TEST 13/14] THYAO Faz 5 Regresyon %100 Başarılı.');

  // ---------------------------------------------------------------------------
  // TEST 14: Existing GLCVY Regression Test
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 14/14] GLCVY Faz 5 Regresyon Testi...');
  const { data: glcvyReport } = await sbAdmin
    .from('financial_reports')
    .select('id, symbol, is_current')
    .eq('symbol', 'GLCVY')
    .eq('is_current', true)
    .maybeSingle();

  if (!glcvyReport) {
    throw new Error('TEST 14: Canlı GLCVY aktif raporu DB\'de bulunamadı!');
  }

  const glcvyValidation = await validateAccountingIntegrity(glcvyReport.id);
  if (!glcvyValidation.passed || !glcvyValidation.balanceSheetEquation.passed) {
    throw new Error('TEST 14: GLCVY bilanço denkliği bozulmuş!');
  }
  console.log(`   • GLCVY Report ID    : ${glcvyReport.id}`);
  console.log(`   • GLCVY Aktif=Pasif  : ${glcvyValidation.balanceSheetEquation.passed} (Fark: ${glcvyValidation.balanceSheetEquation.currentPeriod.difference} TL)`);
  console.log('   ✅ [TEST 14/14] GLCVY Faz 5 Regresyon %100 Başarılı.');


  // Clean up test fixtures after test completion
  await cleanupTestFixtures();

  console.log('\n' + '='.repeat(80));
  console.log('🎉 TÜM 14 DOĞRULAMA TESTİ BAŞARIYLA GEÇTİ! FAZ 6 %100 TAMAMLATILDI.');
  console.log('='.repeat(80) + '\n');
}

runPhase6Tests().catch((err) => {
  console.error('\n❌ FAZ 6 TEST HATA:', err);
  process.exit(1);
});
