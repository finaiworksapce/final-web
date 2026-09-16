import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function debugGlcvyLatest() {
  const sbAdmin = getSupabaseAdminClient();

  const { data: rep } = await sbAdmin
    .from('financial_reports')
    .select('id, symbol')
    .eq('symbol', 'GLCVY')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!rep) {
    console.log('No GLCVY report found');
    return;
  }

  const { data: tables } = await sbAdmin
    .from('financial_report_tables')
    .select('id, statement_type, table_name')
    .eq('report_id', rep.id)
    .eq('statement_type', 'BALANCE_SHEET');

  console.log('GLCVY BALANCE SHEET TABLES:', tables);

  for (const t of tables || []) {
    const { data: rows } = await sbAdmin
      .from('financial_report_raw_rows')
      .select('id, raw_label, row_order')
      .eq('table_id', t.id)
      .order('row_order');

    console.log(`\n=================== TABLE ${t.id} (${t.table_name}) ===================`);
    for (const r of rows || []) {
      const { data: vals } = await sbAdmin
        .from('financial_report_raw_values')
        .select('parsed_numeric_value, column_id, raw_text_value')
        .eq('row_id', r.id);

      const labelUpper = String(r.raw_label).toUpperCase();
      if (
        labelUpper.includes('YÜKÜMLÜLÜK') ||
        labelUpper.includes('ÖZKAYNAK') ||
        labelUpper.includes('PASİF') ||
        labelUpper.includes('KAYNAK') ||
        labelUpper.includes('TOPLAM')
      ) {
        console.log(`Row ${r.row_order}: "${r.raw_label}" ->`, vals?.map(v => ({ text: v.raw_text_value, num: v.parsed_numeric_value })));
      }
    }
  }
}

debugGlcvyLatest().catch(console.error);
