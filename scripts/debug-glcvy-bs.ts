import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function debugGlcvyBs() {
  const sbAdmin = getSupabaseAdminClient();
  const reportId = '041157d1-8510-4bc5-826e-14b3d4069d31';

  const { data: tables } = await sbAdmin
    .from('financial_report_tables')
    .select('id, statement_type, table_name, table_order')
    .eq('report_id', reportId)
    .eq('statement_type', 'BALANCE_SHEET');

  console.log('BALANCE SHEET TABLES:', tables);

  for (const t of tables || []) {
    const { data: rows } = await sbAdmin
      .from('financial_report_raw_rows')
      .select('id, raw_label, row_order')
      .eq('table_id', t.id);

    console.log(`\nTable ${t.id} (${t.table_name}):`);
    for (const r of rows || []) {
      const { data: vals } = await sbAdmin
        .from('financial_report_raw_values')
        .select('*')
        .eq('row_id', r.id);

      const labelUpper = String(r.raw_label).toUpperCase();
      if (
        labelUpper.includes('VARLIK') ||
        labelUpper.includes('PASİF') ||
        labelUpper.includes('KAYNAK') ||
        labelUpper.includes('YÜKÜMLÜLÜK') ||
        labelUpper.includes('ÖZKAYNAK')
      ) {
        console.log(`  Row ${r.row_order}: "${r.raw_label}" -> vals:`, vals?.map(v => v.parsed_numeric_value));
      }
    }
  }
}

debugGlcvyBs().catch(console.error);
