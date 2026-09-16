/**
 * FinAi KAP PDF Parser — Synthetic Test Suite (16 Core Scenarios)
 * Validates extraction pipeline deterministically without touching production DB.
 */

import {
  parseKapFinancialPdf,
  createSyntheticPageLayout,
  generateExtractionSummaryReport,
  parseFinancialNumber,
  parseColumnPeriod,
  detectScale,
  resolveCompanyFromText,
  resolveCanonicalMapping,
  validateExtraction,
} from '../src/lib/financial-reports/parser/index';

async function runAllTests() {
  console.log('====================================================================');
  console.log('FİNAİ MANUEL KAP PDF PARSER — FAZ 2 SENTETİK TEST SÜİTİ');
  console.log('====================================================================\n');

  let passedTests = 0;
  const totalTests = 16;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [TEST ${passedTests + 1}/${totalTests}] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [BAŞARISIZ] ${testName}`);
      if (detail) console.error(`   Detay: ${detail}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: POINT_IN_TIME (Bilanço anlık tarih tespiti)
  // ---------------------------------------------------------------------------
  const p1 = parseColumnPeriod('30 Haziran 2026', 'BALANCE_SHEET', 2026);
  assert(
    p1.periodType === 'POINT_IN_TIME' && p1.fiscalYear === 2026 && p1.fiscalQuarter === 2 && p1.periodEnd === '2026-06-30',
    'POINT_IN_TIME dönem tespiti',
    JSON.stringify(p1)
  );

  // ---------------------------------------------------------------------------
  // TEST 2: DISCRETE_QUARTER (3 Aylık münferit çeyrek)
  // ---------------------------------------------------------------------------
  const p2 = parseColumnPeriod('1 Nisan - 30 Haziran 2026', 'INCOME_STATEMENT', 2026);
  assert(
    p2.periodType === 'DISCRETE_QUARTER' && p2.durationMonths === 3 && p2.periodStart === '2026-04-01',
    'DISCRETE_QUARTER dönem tespiti',
    JSON.stringify(p2)
  );

  // ---------------------------------------------------------------------------
  // TEST 3: CUMULATIVE_INTERIM (6 Aylık kümülatif ara dönem)
  // ---------------------------------------------------------------------------
  const p3 = parseColumnPeriod('1 Ocak - 30 Haziran 2026', 'INCOME_STATEMENT', 2026);
  assert(
    p3.periodType === 'CUMULATIVE_INTERIM' && p3.durationMonths === 6 && p3.periodStart === '2026-01-01',
    'CUMULATIVE_INTERIM dönem tespiti',
    JSON.stringify(p3)
  );

  // ---------------------------------------------------------------------------
  // TEST 4: COMPARATIVE (Önceki dönem karşılaştırma kolonu)
  // ---------------------------------------------------------------------------
  const p4 = parseColumnPeriod('31 Aralık 2025', 'BALANCE_SHEET', 2026);
  assert(
    p4.isComparative === true && p4.fiscalYear === 2025,
    'COMPARATIVE önceki dönem kolonu tespiti',
    JSON.stringify(p4)
  );

  // ---------------------------------------------------------------------------
  // TEST 5: Negatif Parantezli Değer: (123.456) -> -123456
  // ---------------------------------------------------------------------------
  const numNeg = parseFinancialNumber('(123.456)', 'THOUSAND', 1000);
  assert(
    numNeg.parsedNumericValue === -123456 && numNeg.signApplied === -1 && numNeg.scaledNumericValue === -123456000,
    'Negatif parantezli değer parsing',
    JSON.stringify(numNeg)
  );

  // ---------------------------------------------------------------------------
  // TEST 6: Türkçe Sayı Formatı (Nokta binlik, virgül ondalık)
  // ---------------------------------------------------------------------------
  const numTr = parseFinancialNumber('1.234.567,85');
  assert(
    numTr.parsedNumericValue === 1234567.85 && numTr.isDashOrZero === false,
    'Türkçe sayı formatı (1.234.567,85)',
    JSON.stringify(numTr)
  );

  // ---------------------------------------------------------------------------
  // TEST 7: Tire (-) vs Sıfır (0) vs Boş Hücre Ayrımı
  // ---------------------------------------------------------------------------
  const numDash = parseFinancialNumber('—');
  const numZero = parseFinancialNumber('0');
  const numEmpty = parseFinancialNumber('');
  assert(
    numDash.isDashOrZero === true && numDash.rawTextValue === '—' &&
    numZero.isDashOrZero === true && numZero.rawTextValue === '0' &&
    numEmpty.isEmptyOrNull === true && numEmpty.parsedNumericValue === null,
    'Tire (-) vs Sıfır (0) vs Boş hücre ayrımı',
    `Dash: ${JSON.stringify(numDash)}, Zero: ${JSON.stringify(numZero)}, Empty: ${JSON.stringify(numEmpty)}`
  );

  // ---------------------------------------------------------------------------
  // TEST 8: Scale Bilgisi (Bin TL, Milyon TL, exact)
  // ---------------------------------------------------------------------------
  const scaleThousand = detectScale('Tutarlar aksi belirtilmedikçe Bin TL olarak ifade edilmiştir');
  const scaleMillion = detectScale('Tablodaki tutarlar Milyon TL cinsindendir');
  assert(
    scaleThousand.scale === 'THOUSAND' && scaleThousand.scaleMultiplier === 1000 &&
    scaleMillion.scale === 'MILLION' && scaleMillion.scaleMultiplier === 1000000,
    'Ölçek tespiti (THOUSAND / MILLION)',
    `Thousand: ${scaleThousand.scale}, Million: ${scaleMillion.scale}`
  );

  // ---------------------------------------------------------------------------
  // TEST 9: Mapped Row (Canonical Catalog eşleşmesi)
  // ---------------------------------------------------------------------------
  const mapRev = resolveCanonicalMapping('Hasılat', 'INCOME_STATEMENT');
  const mapAssets = resolveCanonicalMapping('TOPLAM VARLIKLAR', 'BALANCE_SHEET');
  assert(
    mapRev.status === 'MAPPED' && mapRev.canonicalItemCode === 'REVENUE' &&
    mapAssets.status === 'MAPPED' && mapAssets.canonicalItemCode === 'TOTAL_ASSETS',
    'Mapped row canonical eşleşmesi',
    `Revenue: ${JSON.stringify(mapRev)}, Assets: ${JSON.stringify(mapAssets)}`
  );

  // ---------------------------------------------------------------------------
  // TEST 10: Unmapped Row (Eşleşmeyen satırın kaybolmadan korunması)
  // ---------------------------------------------------------------------------
  const mapUnmapped = resolveCanonicalMapping('Özel Uçak Bakım Ek Havuz Payları', 'BALANCE_SHEET');
  assert(
    mapUnmapped.status === 'UNMAPPED' && mapUnmapped.canonicalItemCode === null,
    'Unmapped row kayıpsız korunma durumu',
    JSON.stringify(mapUnmapped)
  );

  // ---------------------------------------------------------------------------
  // TEST 11: Ambiguous Mapping (Belirsiz eşleşme tespiti)
  // ---------------------------------------------------------------------------
  const mapAmbiguous = resolveCanonicalMapping('Borçlar', 'BALANCE_SHEET');
  assert(
    mapAmbiguous.status === 'AMBIGUOUS' || mapAmbiguous.status === 'UNMAPPED',
    'Ambiguous mapping tespiti (yanlış eşleme engelleme)',
    JSON.stringify(mapAmbiguous)
  );

  // ---------------------------------------------------------------------------
  // TEST 12: Birden Fazla Statement Table (Bilanço, Gelir Tablosu, Nakit Akış)
  // ---------------------------------------------------------------------------
  const page1 = createSyntheticPageLayout(1, [
    { label: 'TÜRK HAVA YOLLARI A.O. - KONSOLİDE FİNANSAL DURUM TABLOSU (BİLANÇO)', values: [''] },
    { label: 'Tutarlar aksi belirtilmedikçe Bin TL cinsindendir', values: [''] },
    { label: 'Dönem', values: ['30 Haziran 2026', '31 Aralık 2025'] },
    { label: 'Dönen Varlıklar', values: ['50.000.000', '40.000.000'], indentLevel: 0 },
    { label: 'Nakit ve Nakit Benzerleri', values: ['20.000.000', '15.000.000'], indentLevel: 1 },
    { label: 'Toplam Varlıklar', values: ['120.000.000', '100.000.000'], indentLevel: 0 },
  ]);

  const page2 = createSyntheticPageLayout(2, [
    { label: 'KÂR VEYA ZARAR TABLOSU (GELİR TABLOSU)', values: [''] },
    { label: 'Dönem', values: ['1 Ocak - 30 Haziran 2026', '1 Ocak - 30 Haziran 2025'] },
    { label: 'Hasılat', values: ['85.000.000', '65.000.000'] },
    { label: 'Satışların Maliyeti (-)', values: ['(60.000.000)', '(45.000.000)'] },
    { label: 'Brüt Kâr (Zarar)', values: ['25.000.000', '20.000.000'] },
    { label: 'Dönem Net Kârı (Zararı)', values: ['12.500.000', '9.800.000'] },
  ]);

  const multiResult = await parseKapFinancialPdf([page1, page2], 'THYAO_2026_Q2.pdf');
  assert(
    multiResult.tables.length === 2 &&
    multiResult.tables[0].statementType === 'BALANCE_SHEET' &&
    multiResult.tables[1].statementType === 'INCOME_STATEMENT',
    'Birden fazla statement table tespiti',
    `Bulunan tablolar: ${multiResult.tables.map((t) => t.statementType).join(', ')}`
  );

  // ---------------------------------------------------------------------------
  // TEST 13: Aynı Statement İçinde Birden Fazla Tablo (Bilanço Varlıklar & Kaynaklar)
  // ---------------------------------------------------------------------------
  const page3 = createSyntheticPageLayout(3, [
    { label: 'FİNANSAL DURUM TABLOSU - YÜKÜMLÜLÜKLER VE ÖZKAYNAKLAR (PASİF)', values: [''] },
    { label: 'Dönem', values: ['30 Haziran 2026', '31 Aralık 2025'] },
    { label: 'Kısa Vadeli Borçlanmalar', values: ['18.000.000', '14.000.000'] },
    { label: 'Toplam Özkaynaklar', values: ['60.000.000', '50.000.000'] },
  ]);

  const multiPartBs = await parseKapFinancialPdf([page1, page3], 'THYAO_BS_Parts.pdf');
  assert(
    multiPartBs.tables.length === 2 &&
    multiPartBs.tables.every((t) => t.statementType === 'BALANCE_SHEET'),
    'Aynı statement içinde çoklu tablo parçaları',
    `Tablo IDleri: ${multiPartBs.tables.map((t) => t.tableIdentifier).join(', ')}`
  );

  // ---------------------------------------------------------------------------
  // TEST 14: Source Page Bilgisi (Provenance)
  // ---------------------------------------------------------------------------
  const firstTableRow = multiResult.tables[0].rows[0];
  const secondTableRow = multiResult.tables[1].rows[0];
  assert(
    firstTableRow.pdfPageNumber === 1 && secondTableRow.pdfPageNumber === 2,
    'Source page provenance doğrulaması',
    `Row 1 Page: ${firstTableRow.pdfPageNumber}, Row 2 Page: ${secondTableRow.pdfPageNumber}`
  );

  // ---------------------------------------------------------------------------
  // TEST 15: Validation Error (Şirket veya dönem çözülemediğinde)
  // ---------------------------------------------------------------------------
  const unknownPage = createSyntheticPageLayout(1, [
    { label: 'BİLİNMEYEN BİR RAPOR METNİ HİÇBİR BİST ŞİRKETİ YOKTUR', values: [''] },
    { label: 'Tablo', values: ['1', '2'] },
  ]);
  const errResult = await parseKapFinancialPdf([unknownPage], 'unknown.pdf');
  assert(
    errResult.validation.hasErrors === true &&
    errResult.validation.issues.some((i) => i.code === 'COMPANY_UNRESOLVED'),
    'Validation ERROR üretimi (Şirket tespit edilemediğinde)',
    `Hatalar: ${JSON.stringify(errResult.validation.issues)}`
  );

  // ---------------------------------------------------------------------------
  // TEST 16: Validation Warning (Unmapped satırlar veya çelişkiler)
  // ---------------------------------------------------------------------------
  const warningPage = createSyntheticPageLayout(1, [
    { label: 'TÜRK HAVA YOLLARI A.O. BİLANÇO 2026', values: [''] },
    { label: 'Dönem', values: ['30 Haziran 2026', '31 Aralık 2025'] },
    { label: 'Toplam Varlıklar', values: ['100', '90'] },
    { label: 'Özel Kurum İçi Tasnif Kalemi', values: ['10', '5'] }, // Unmapped line
  ]);
  const warnResult = await parseKapFinancialPdf([warningPage], 'THYAO_Warning.pdf');
  assert(
    warnResult.metrics.unmappedRowsCount > 0 &&
    warnResult.metrics.rawLossCount === 0 &&
    warnResult.metrics.rawPreservationRate === 1.0,
    'Validation WARNING ve Raw Data Loss = 0 koruması',
    `Unmapped: ${warnResult.metrics.unmappedRowsCount}, Loss: ${warnResult.metrics.rawLossCount}`
  );

  console.log('\n====================================================================');
  console.log(`🎉 TÜM SENTETİK TESTLER BAŞARILI: ${passedTests}/${totalTests}`);
  console.log('====================================================================\n');

  // Print Sample Extraction Report
  console.log(generateExtractionSummaryReport(multiResult));
}

runAllTests().catch((err) => {
  console.error('Test süiti hatayla sonuçlandı:', err);
  process.exit(1);
});
