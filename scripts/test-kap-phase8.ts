/**
 * FinAi KAP System — FAZ 8 Asset Detail Page & Integration Test Harness
 * Executes 15 comprehensive automated test assertions on live Supabase KAP data.
 */

import { getSupabaseAdminClient, ensureEnvLoaded } from '../src/lib/financial-reports/admin-client';
import { FinAiArchiveReader } from '../src/lib/api/finai-archive-reader';
import { fetchStockFundamentals } from '../src/lib/fundamentals-service';

ensureEnvLoaded();
const sbAdmin = getSupabaseAdminClient();

async function runPhase8Tests() {
  console.log('='.repeat(80));
  console.log('FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 8 UÇTAN UCA VARLIK BAĞLANTISI (15/15 TEST)');
  console.log('='.repeat(80));

  let passedTests = 0;
  const totalTests = 15;

  // ---------------------------------------------------------------------------
  // TEST 1: THYAO Symbol Resolution & KAP Report Presence
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 1/15] THYAO Symbol Resolution & KAP Report Presence...');
  const { data: thyaoReports, error: thyaoErr } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('symbol', 'THYAO')
    .eq('is_current', true);

  if (thyaoErr || !thyaoReports || thyaoReports.length === 0) {
    throw new Error(`TEST 1 Failed: THYAO current KAP report not found. Error: ${thyaoErr?.message}`);
  }
  const thyaoRep = thyaoReports[0];
  if (thyaoRep.fiscal_year !== 2026 || thyaoRep.fiscal_quarter !== 2) {
    throw new Error(`TEST 1 Failed: Unexpected THYAO period ${thyaoRep.fiscal_year} Q${thyaoRep.fiscal_quarter}`);
  }
  console.log(`  └─ SUCCESS: Verified THYAO KAP report present (ID: ${thyaoRep.id}, 2026 Q2).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 2: GLCVY Symbol Resolution & KAP Report Presence
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 2/15] GLCVY Symbol Resolution & KAP Report Presence...');
  const { data: glcvyReports, error: glcvyErr } = await sbAdmin
    .from('financial_reports')
    .select('*')
    .eq('symbol', 'GLCVY')
    .eq('is_current', true);

  if (glcvyErr || !glcvyReports || glcvyReports.length === 0) {
    throw new Error(`TEST 2 Failed: GLCVY current KAP report not found. Error: ${glcvyErr?.message}`);
  }
  const glcvyRep = glcvyReports[0];
  if (glcvyRep.fiscal_year !== 2026 || glcvyRep.fiscal_quarter !== 2) {
    throw new Error(`TEST 2 Failed: Unexpected GLCVY period ${glcvyRep.fiscal_year} Q${glcvyRep.fiscal_quarter}`);
  }
  console.log(`  └─ SUCCESS: Verified GLCVY KAP report present (ID: ${glcvyRep.id}, 2026 Q2).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 3: THYAO 2026 Q2 Current Period KAP Data Retrieval via FinAiArchiveReader
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 3/15] THYAO 2026 Q2 Current Period KAP Data Retrieval via FinAiArchiveReader...');
  const thyaoStatements = await FinAiArchiveReader.getQuarterlyStatements('THYAO');
  if (!thyaoStatements || thyaoStatements.length === 0) {
    throw new Error('TEST 3 Failed: FinAiArchiveReader returned empty statements for THYAO');
  }
  const thyaoQ2 = thyaoStatements.find((s: any) => s.fiscalYear === 2026 && s.fiscalQuarter === 2);
  if (!thyaoQ2 || !thyaoQ2.isKapData) {
    throw new Error('TEST 3 Failed: THYAO 2026 Q2 KAP statement missing or isKapData flag false');
  }
  console.log(`  └─ SUCCESS: Retrieved THYAO 2026 Q2 statement (isKapData: true, Total Assets: ${thyaoQ2.totalAssets} Bin TL).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 4: GLCVY 2026 Q2 Current Period KAP Data Retrieval via FinAiArchiveReader
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 4/15] GLCVY 2026 Q2 Current Period KAP Data Retrieval via FinAiArchiveReader...');
  const glcvyStatements = await FinAiArchiveReader.getQuarterlyStatements('GLCVY');
  if (!glcvyStatements || glcvyStatements.length === 0) {
    throw new Error('TEST 4 Failed: FinAiArchiveReader returned empty statements for GLCVY');
  }
  const glcvyQ2 = glcvyStatements.find((s: any) => s.fiscalYear === 2026 && s.fiscalQuarter === 2);
  if (!glcvyQ2 || !glcvyQ2.isKapData) {
    throw new Error('TEST 4 Failed: GLCVY 2026 Q2 KAP statement missing or isKapData flag false');
  }
  console.log(`  └─ SUCCESS: Retrieved GLCVY 2026 Q2 statement (isKapData: true, Net Income: ${glcvyQ2.netIncome} Bin TL).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 5: Historical Period List Sorting
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 5/15] Historical Period List Sorting Assertion...');
  for (let i = 0; i < thyaoStatements.length - 1; i++) {
    const cur = thyaoStatements[i];
    const next = thyaoStatements[i + 1];
    const curKey = cur.fiscalYear * 10 + cur.fiscalQuarter;
    const nextKey = next.fiscalYear * 10 + next.fiscalQuarter;
    if (curKey < nextKey) {
      throw new Error(`TEST 5 Failed: Unsorted period list at index ${i}. ${curKey} < ${nextKey}`);
    }
  }
  console.log(`  └─ SUCCESS: Verified statements are sorted DESC by (fiscalYear, fiscalQuarter).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 6: Non-Current v1 Versions Filtered Out of Selectable UI Periods
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 6/15] Non-Current v1 Versions Filtered Out Assertion...');
  const { data: nonCurrentReps } = await sbAdmin
    .from('financial_reports')
    .select('id')
    .eq('symbol', 'THYAO')
    .eq('is_current', false);

  const nonCurrentIds = new Set((nonCurrentReps || []).map((r) => r.id));
  const returnedNonCurrent = thyaoStatements.filter((s: any) => nonCurrentIds.has(s.reportId));
  if (returnedNonCurrent.length > 0) {
    throw new Error(`TEST 6 Failed: Returned ${returnedNonCurrent.length} non-current report versions to UI`);
  }
  console.log(`  └─ SUCCESS: Verified 0 non-current report versions exposed in UI statements.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 7: Current Version Selected By Default
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 7/15] Current Version Selected By Default Assertion...');
  const latestTHYAO = thyaoStatements[0];
  if (latestTHYAO.fiscalYear !== 2026 || latestTHYAO.fiscalQuarter !== 2) {
    throw new Error(`TEST 7 Failed: Default selected statement is not 2026 Q2. Found: ${latestTHYAO.fiscalYear} Q${latestTHYAO.fiscalQuarter}`);
  }
  console.log(`  └─ SUCCESS: Verified 2026 Q2 current version is selected by default for THYAO.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 8: Balance Sheet Canonical Values Integrity
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 8/15] Balance Sheet Canonical Values Integrity...');
  if (!thyaoQ2.totalAssets || thyaoQ2.totalAssets <= 0) {
    throw new Error(`TEST 8 Failed: THYAO totalAssets invalid: ${thyaoQ2.totalAssets}`);
  }
  if (!thyaoQ2.totalEquity || thyaoQ2.totalEquity <= 0) {
    throw new Error(`TEST 8 Failed: THYAO totalEquity invalid: ${thyaoQ2.totalEquity}`);
  }
  if (!glcvyQ2.totalAssets || glcvyQ2.totalAssets <= 0) {
    throw new Error(`TEST 8 Failed: GLCVY totalAssets invalid: ${glcvyQ2.totalAssets}`);
  }
  console.log(`  └─ SUCCESS: Total Assets THYAO: ${thyaoQ2.totalAssets} Bin TL, GLCVY: ${glcvyQ2.totalAssets} Bin TL.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 9: Currency & Scale Metadata
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 9/15] Currency & Scale Metadata Assertion...');
  if (thyaoQ2.currency !== 'TRY' || (thyaoQ2.scale !== 'THOUSAND' && thyaoQ2.scaleMultiplier !== 1000)) {
    throw new Error(`TEST 9 Failed: Unexpected THYAO currency/scale: ${thyaoQ2.currency}/${thyaoQ2.scale}`);
  }
  if (glcvyQ2.currency !== 'TRY' || (glcvyQ2.scale !== 'THOUSAND' && glcvyQ2.scaleMultiplier !== 1000)) {
    throw new Error(`TEST 9 Failed: Unexpected GLCVY currency/scale: ${glcvyQ2.currency}/${glcvyQ2.scale}`);
  }
  console.log(`  └─ SUCCESS: Currency: TRY, Scale: THOUSAND (Multiplier 1000) verified for both companies.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 10: Period Semantics Assertion
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 10/15] Period Semantics Assertion...');
  if (thyaoQ2.periodEnd !== '2026-06-30' || glcvyQ2.periodEnd !== '2026-06-30') {
    throw new Error('TEST 10 Failed: Period end mismatch in point-in-time balance sheet date');
  }
  console.log(`  └─ SUCCESS: Verified period end date 2026-06-30 for Q2 reporting.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 11: Provenance Metadata Presence
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 11/15] Provenance Metadata & Source Attribution...');
  const thyaoFundamentals = await fetchStockFundamentals('THYAO');
  if (!thyaoFundamentals || thyaoFundamentals.source !== 'KAP Finansal Raporu') {
    throw new Error(`TEST 11 Failed: Fundamentals source mismatch for THYAO. Found: ${thyaoFundamentals?.source}`);
  }
  console.log(`  └─ SUCCESS: fetchStockFundamentals('THYAO') returned source: "${thyaoFundamentals.source}".`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 12: Legacy Fallback Operational for Unmigrated Symbols (IHLGM)
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 12/15] Legacy Fallback Operational Assertion (IHLGM)...');
  const ihlgmFundamentals = await fetchStockFundamentals('IHLGM');
  if (!ihlgmFundamentals || !ihlgmFundamentals.quarters) {
    throw new Error('TEST 12 Failed: Legacy fallback failed for IHLGM');
  }
  console.log(`  └─ SUCCESS: IHLGM fundamentals fetched via legacy fallback (${ihlgmFundamentals.quarters.length} quarters).`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 13: Empty State Handling for Non-Existent Symbols
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 13/15] Empty State Handling for Non-Existent Symbols...');
  const nonExistent = await FinAiArchiveReader.getQuarterlyStatements('XYZ_NON_EXISTENT_SYMBOL');
  if (nonExistent !== null && (!Array.isArray(nonExistent) || nonExistent.length !== 0)) {
    throw new Error('TEST 13 Failed: Expected empty result for non-existent symbol');
  }
  console.log(`  └─ SUCCESS: Safely handled non-existent symbol without exception.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 14: Security Audit — Service-Role Key Leakage Check
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 14/15] Security Audit — Zero Secret Key Leakage Assertion...');
  const jsonDto = JSON.stringify(thyaoFundamentals);
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secretKey && jsonDto.includes(secretKey)) {
    throw new Error('TEST 14 Failed CRITICAL: Service-role key leaked in returned DTO object!');
  }
  if (jsonDto.includes('postgresql://') || jsonDto.includes('postgres://')) {
    throw new Error('TEST 14 Failed CRITICAL: DB Connection URL leaked in returned DTO object!');
  }
  console.log(`  └─ SUCCESS: Clean security audit. Zero service-role keys or DB credentials found in public DTOs.`);
  passedTests++;

  // ---------------------------------------------------------------------------
  // TEST 15: Exclusion of Test Fixtures from Public Resolution
  // ---------------------------------------------------------------------------
  console.log('\n[TEST 15/15] Exclusion of Test Fixtures Assertion...');
  const testFixtureResult = await FinAiArchiveReader.getQuarterlyStatements('TEST_NO_WRITE');
  if (testFixtureResult && testFixtureResult.length > 0) {
    throw new Error('TEST 15 Failed: Test fixture symbol returned public financial reports');
  }
  console.log(`  └─ SUCCESS: Test fixture symbols isolated from public asset resolution.`);
  passedTests++;

  console.log('\n' + '='.repeat(80));
  console.log(`FAZ 8 UÇTAN UCA VARLIK BAĞLANTISI BAŞARIYLA TAMAMLANDI! (${passedTests}/${totalTests} PASS)`);
  console.log('='.repeat(80) + '\n');
}

runPhase8Tests().catch((err) => {
  console.error('\n❌ PHASE 8 TEST HARNESS FAILED:', err);
  process.exit(1);
});
