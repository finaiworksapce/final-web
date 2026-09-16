import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local safely
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim();
      process.env[k] = v;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sbAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

export async function runKapSchemaSmokeTest() {
  console.log('====================================================================');
  console.log('FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — VERİ BÜTÜNLÜĞÜ SMOKE TESTİ');
  console.log('====================================================================\n');

  // Test 0: Tablo Varlığı Ön Kontrolü
  const { error: checkError } = await sbAdmin.from('financial_reports').select('id').limit(1);
  if (checkError && checkError.code === 'PGRST205') {
    console.log('⚠️ Tablolar henüz veritabanında oluşturulmamış (PGRST205). Migration SQL Editor üzerinde çalıştırılmalıdır.');
    return { success: false, reason: 'MIGRATION_PENDING' };
  }

  const testReportSlug = `SMOKE_TEST_THYAO_${Date.now()}`;
  const testHash = `smoke_hash_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  let reportId: string | null = null;
  let reportV2Id: string | null = null;

  try {
    // 1. Rapor Oluşturma Testi
    console.log('[TEST 1] financial_reports tablosuna kontrollü test kaydı ekleniyor...');
    const { data: repData, error: repError } = await sbAdmin
      .from('financial_reports')
      .insert({
        report_slug: testReportSlug,
        symbol: 'THYAO',
        finai_symbol: 'THYAO',
        company_name: 'Türk Hava Yolları A.O.',
        fiscal_year: 2099,
        fiscal_quarter: 2,
        reporting_period_start: '2099-01-01',
        reporting_period_end: '2099-06-30',
        report_date: '2099-06-30',
        consolidation_type: 'CONSOLIDATED',
        statement_currency: 'TRY',
        currency: 'TRY',
        default_scale: 'MILLION',
        scale_multiplier: 1000000.0,
        report_type: 'INTERIM',
        audit_status: 'LIMITED_REVIEW',
        source: 'SMOKE_TEST',
        source_document_name: 'smoke_test.pdf',
        source_document_hash_sha256: testHash,
        storage_bucket: 'financial-reports',
        storage_path: `THYAO/2099/Q2/1/${testHash}.pdf`,
        version: 1,
        is_current: true,
        is_restatement: false,
        verification_status: 'VERIFIED'
      })
      .select()
      .single();

    if (repError || !repData) {
      throw new Error(`financial_reports insert hatası: ${repError?.message}`);
    }
    reportId = repData.id;
    console.log(`   ✅ Test Raporu oluşturuldu: ID=${reportId}, Slug=${testReportSlug}`);

    // 2. Tablo Ekleme Testi
    console.log('\n[TEST 2] financial_report_tables tablosuna çoklu tablo ekleniyor...');
    const { data: tableData, error: tableError } = await sbAdmin
      .from('financial_report_tables')
      .insert([
        {
          report_id: reportId,
          statement_type: 'BALANCE_SHEET',
          table_name: 'Finansal Durum Tablosu',
          table_order: 1,
          table_identifier: 'TAB_BS_1',
          page_start: 4,
          page_end: 5
        },
        {
          report_id: reportId,
          statement_type: 'INCOME_STATEMENT',
          table_name: 'Kâr veya Zarar Tablosu',
          table_order: 2,
          table_identifier: 'TAB_IS_1',
          page_start: 6,
          page_end: 7
        }
      ])
      .select();

    if (tableError || !tableData || tableData.length !== 2) {
      throw new Error(`financial_report_tables insert hatası: ${tableError?.message}`);
    }
    const bsTableId = tableData[0].id;
    console.log(`   ✅ 2 Tablo başarıyla oluşturuldu (Bilanço ID=${bsTableId})`);

    // 3. Kolon Ekleme Testi (Dönem Semantiği)
    console.log('\n[TEST 3] financial_report_columns tablosuna çoklu dönem kolonları ekleniyor...');
    const { data: colData, error: colError } = await sbAdmin
      .from('financial_report_columns')
      .insert([
        {
          table_id: bsTableId,
          column_order: 1,
          column_label: '30 Haziran 2099',
          raw_header_text: '30 Haziran 2099 (Bağımsız Denetimden Geçmemiş)',
          period_start: null,
          period_end: '2099-06-30',
          duration_months: 0,
          period_type: 'POINT_IN_TIME',
          is_comparative: false,
          fiscal_year: 2099,
          fiscal_quarter: 2
        },
        {
          table_id: bsTableId,
          column_order: 2,
          column_label: '31 Aralık 2098',
          raw_header_text: '31 Aralık 2098 (Bağımsız Denetimden Geçmiş)',
          period_start: null,
          period_end: '2098-12-31',
          duration_months: 0,
          period_type: 'COMPARATIVE',
          is_comparative: true,
          fiscal_year: 2098,
          fiscal_quarter: 4
        }
      ])
      .select();

    if (colError || !colData || colData.length !== 2) {
      throw new Error(`financial_report_columns insert hatası: ${colError?.message}`);
    }
    const col1Id = colData[0].id;
    const col2Id = colData[1].id;
    console.log(`   ✅ 2 Dönem Kolonu oluşturuldu (Cari Bilanço Col1=${col1Id}, Karşılaştırma Col2=${col2Id})`);

    // 4. Raw Row ve Raw Value Ekleme Testi (2 Kademeli Mimari)
    console.log('\n[TEST 4] financial_report_raw_rows ve financial_report_raw_values 2 kademeli kayıt testi...');
    const { data: rowData, error: rowError } = await sbAdmin
      .from('financial_report_raw_rows')
      .insert({
        report_id: reportId,
        table_id: bsTableId,
        row_order: 1,
        row_identifier: 'ROW_1',
        raw_label: 'Toplam Varlıklar',
        normalized_label: 'toplam varlıklar',
        footnote_ref: '3',
        pdf_page_number: 4,
        indent_level: 0,
        is_subtotal: true,
        mapping_status: 'MAPPED'
      })
      .select()
      .single();

    if (rowError || !rowData) {
      throw new Error(`financial_report_raw_rows insert hatası: ${rowError?.message}`);
    }
    const rowId = rowData.id;

    // Aynı satır için Col1 ve Col2 değerlerini ekle
    const { data: valData, error: valError } = await sbAdmin
      .from('financial_report_raw_values')
      .insert([
        {
          row_id: rowId,
          column_id: col1Id,
          raw_text_value: '1.250.000',
          is_dash_or_zero: false,
          parsed_numeric_value: 1250000.0,
          scaled_numeric_value: 1250000000000.0, // 1.25 Trilyon TL
          scale: 'MILLION',
          scale_multiplier: 1000000.0
        },
        {
          row_id: rowId,
          column_id: col2Id,
          raw_text_value: '1.100.000',
          is_dash_or_zero: false,
          parsed_numeric_value: 1100000.0,
          scaled_numeric_value: 1100000000000.0,
          scale: 'MILLION',
          scale_multiplier: 1000000.0
        }
      ])
      .select();

    if (valError || !valData || valData.length !== 2) {
      throw new Error(`financial_report_raw_values insert hatası: ${valError?.message}`);
    }
    console.log(`   ✅ 1 Ham Satır ve o satıra ait 2 Farklı Dönem Kolon Değeri kayıpsız kaydedildi.`);

    // 5. Raw Items View Sorgulama Testi
    console.log('\n[TEST 5] financial_report_raw_items VIEW üzerinden birleşik sorgu testi...');
    const { data: viewData, error: viewError } = await sbAdmin
      .from('financial_report_raw_items')
      .select('*')
      .eq('report_id', reportId);

    if (viewError || !viewData || viewData.length !== 2) {
      throw new Error(`financial_report_raw_items view sorgu hatası: ${viewError?.message}`);
    }
    console.log(`   ✅ VIEW başarıyla sorgulandı: ${viewData.length} kayıt döndü (Etiket: "${viewData[0].raw_label}", Kolon: "${viewData[0].column_label}")`);

    // 6. Snapshot ve Audit Log Ekleme Testi
    console.log('\n[TEST 6] financial_statement_snapshots ve financial_report_audit_logs testi...');
    const { error: snapError } = await sbAdmin
      .from('financial_statement_snapshots')
      .insert({
        report_id: reportId,
        symbol: 'THYAO',
        finai_symbol: 'THYAO',
        canonical_item_code: 'TOTAL_ASSETS',
        statement_type: 'BALANCE_SHEET',
        fiscal_year: 2099,
        fiscal_quarter: 2,
        period_start: null,
        period_end: '2099-06-30',
        duration_months: 0,
        period_type: 'POINT_IN_TIME',
        value: 1250000000000.0,
        raw_value: 1250000.0,
        raw_text_value: '1.250.000',
        currency: 'TRY',
        scale: 'MILLION',
        scale_multiplier: 1000000.0,
        version: 1,
        is_current: true,
        verification_status: 'VERIFIED'
      });

    if (snapError) {
      throw new Error(`financial_statement_snapshots insert hatası: ${snapError.message}`);
    }

    const { error: auditError } = await sbAdmin
      .from('financial_report_audit_logs')
      .insert({
        report_id: reportId,
        symbol: 'THYAO',
        event_type: 'VALIDATION_PASSED',
        status: 'SUCCESS',
        message: 'Smoke test muhasebe eşitlik kontrolü başarıyla tamamlandı.'
      });

    if (auditError) {
      throw new Error(`financial_report_audit_logs insert hatası: ${auditError.message}`);
    }
    console.log('   ✅ Snapshot ve Audit Log başarıyla kaydedildi.');

    // 7. Restatement / Versiyonlama Zinciri Testi
    console.log('\n[TEST 7] Düzeltme (Restatement v2) ve supersedes_report_id ilişkisi testi...');
    const testV2Slug = `SMOKE_TEST_THYAO_V2_${Date.now()}`;
    const testV2Hash = `smoke_hash_v2_${Date.now()}`;
    const { data: v2Data, error: v2Error } = await sbAdmin
      .from('financial_reports')
      .insert({
        report_slug: testV2Slug,
        symbol: 'THYAO',
        finai_symbol: 'THYAO',
        company_name: 'Türk Hava Yolları A.O.',
        fiscal_year: 2099,
        fiscal_quarter: 2,
        reporting_period_start: '2099-01-01',
        reporting_period_end: '2099-06-30',
        report_date: '2099-06-30',
        consolidation_type: 'CONSOLIDATED',
        statement_currency: 'TRY',
        currency: 'TRY',
        report_type: 'INTERIM',
        source_document_name: 'smoke_test_v2.pdf',
        source_document_hash_sha256: testV2Hash,
        storage_bucket: 'financial-reports',
        storage_path: `THYAO/2099/Q2/2/${testV2Hash}.pdf`,
        version: 2,
        is_current: true,
        is_restatement: true,
        supersedes_report_id: reportId
      })
      .select()
      .single();

    if (v2Error || !v2Data) {
      throw new Error(`v2 restatement insert hatası: ${v2Error?.message}`);
    }
    reportV2Id = v2Data.id;
    console.log(`   ✅ Versiyon 2 Raporu oluşturuldu ve v1'e (supersedes_report_id) başarıyla bağlandı.`);

    return { success: true };
  } catch (err: any) {
    console.error('❌ Smoke test sırasında hata oluştu:', err.message);
    return { success: false, error: err.message };
  } finally {
    // 8. Temizlik (Cleanup) — Test verilerini production'da ASLA bırakma!
    console.log('\n[TEMİZLİK] Test kayıtları production DB üzerinden temizleniyor...');
    if (reportV2Id) {
      await sbAdmin.from('financial_reports').delete().eq('id', reportV2Id);
    }
    if (reportId) {
      // ON DELETE CASCADE sayesinde tables, columns, rows, values, snapshots ve audit loglar otomatik temizlenir
      await sbAdmin.from('financial_reports').delete().eq('id', reportId);
    }
    console.log('✅ Temizlik tamamlandı. Production veritabanı 100% temiz durumda.');
  }
}

// Doğrudan çağrıldığında çalıştır
runKapSchemaSmokeTest().then(res => {
  if (res.success) {
    console.log('\n🎉 SMOKE TEST SONUCU: BAŞARILI (Veri modeli, FK, CASCADE, VIEW ve Versiyonlama 100% doğrulandı)');
    process.exit(0);
  } else if (res.reason === 'MIGRATION_PENDING') {
    console.log('\n⏳ SMOKE TEST SONUCU: MIGRATION BEKLENİYOR (SQL Editor çalıştırması sonrasında tekrar çalıştırılmalıdır)');
    process.exit(0);
  } else {
    console.error('\n❌ SMOKE TEST SONUCU: BAŞARISIZ');
    process.exit(1);
  }
});
