import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local
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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const sbAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const sbAnon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function verifyKapBackendSchema() {
  console.log('====================================================================');
  console.log('FİNAİ MANUEL KAP FİNANSAL RAPOR SİSTEMİ — FAZ 1 BACKEND DOĞRULAMASI');
  console.log('====================================================================');
  console.log(`Supabase URL: ${url}\n`);

  // 1. Storage Bucket Kontrolü
  console.log('[KONTROL 1] Supabase Storage "financial-reports" özel bucket kontrolü...');
  const { data: buckets, error: bError } = await sbAdmin.storage.listBuckets();
  if (bError) {
    console.error('❌ Storage bucket listeleme hatası:', bError.message);
  } else {
    const kapBucket = buckets.find(b => b.id === 'financial-reports');
    if (kapBucket) {
      console.log(`✅ "financial-reports" bucket aktif (Public: ${kapBucket.public}, Max Size: ${(kapBucket.file_size_limit || 0) / 1024 / 1024}MB)`);
    } else {
      console.warn('⚠️ "financial-reports" bucket henüz oluşturulmamış.');
    }
  }

  // 2. symbol_mappings FK Bağlantı Kontrolü
  console.log('\n[KONTROL 2] symbol_mappings tablosu ve pilot hisse (THYAO) kontrolü...');
  const { data: symData, error: symError } = await sbAdmin
    .from('symbol_mappings')
    .select('finai_symbol, company_name, is_active')
    .eq('finai_symbol', 'THYAO')
    .single();

  if (symError || !symData) {
    console.error('❌ THYAO sembolü symbol_mappings tablosunda bulunamadı:', symError?.message);
  } else {
    console.log(`✅ Pilot sembol doğrulandı: ${symData.finai_symbol} — ${symData.company_name} (Aktif: ${symData.is_active})`);
  }

  // 3. Tablo Varlığı ve Durum Kontrolü
  console.log('\n[KONTROL 3] 8 Çekirdek Tablo ve 1 View varlık kontrolü...');
  const coreTables = [
    'financial_reports',
    'financial_report_tables',
    'financial_report_columns',
    'financial_items_catalog',
    'financial_item_mappings',
    'financial_report_raw_rows',
    'financial_report_raw_values',
    'financial_report_raw_items',
    'financial_statement_snapshots',
    'financial_report_audit_logs'
  ];

  let readyCount = 0;
  let pendingCount = 0;

  for (const t of coreTables) {
    const { data, error } = await sbAdmin.from(t).select('*').limit(1);
    if (!error) {
      console.log(`   ✅ [AKTİF] ${t}`);
      readyCount++;
    } else if (error.code === 'PGRST205') {
      console.log(`   ⏳ [MİGRATİON BEKLİYOR - PGRST205] ${t}`);
      pendingCount++;
    } else {
      console.log(`   ⚠️ [DURUM: ${error.code}] ${t} (${error.message})`);
    }
  }

  // 4. Seed Edilen Kalem Sayısı Kontrolü
  if (readyCount > 0) {
    console.log('\n[KONTROL 4] financial_items_catalog seed verisi kontrolü...');
    const { count, error: cError } = await sbAdmin
      .from('financial_items_catalog')
      .select('*', { count: 'exact', head: true });

    if (!cError && count !== null) {
      console.log(`✅ Toplam seed edilmiş canonical kalem: ${count}`);
    }

    console.log('\n[KONTROL 5] financial_item_mappings başlangıç eşlemeleri...');
    const { count: mCount, error: mError } = await sbAdmin
      .from('financial_item_mappings')
      .select('*', { count: 'exact', head: true });

    if (!mError && mCount !== null) {
      console.log(`✅ Toplam seed edilmiş kural eşlemesi: ${mCount}`);
    }
  }

  console.log('\n====================================================================');
  console.log(`ÖZET: ${readyCount}/${coreTables.length} tablo aktif, ${pendingCount} tablo migration SQL Editor çalıştırması bekliyor.`);
  console.log('====================================================================\n');
}

verifyKapBackendSchema().catch(console.error);
