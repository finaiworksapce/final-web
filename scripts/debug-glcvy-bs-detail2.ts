import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function debugGlcvyBsDetail2() {
  const sbAdmin = getSupabaseAdminClient();
  const tId = '90a35df9-7d3c-4986-b00e-4889aec7e8fa';

  const { data: rows } = await sbAdmin
    .from('financial_report_raw_rows')
    .select('id, raw_label, row_order')
    .eq('table_id', tId)
    .order('row_order');

  console.log(`\n=================== TABLE ${tId} ALL ROWS ===================`);
  for (const r of rows || []) {
    const { data: vals } = await sbAdmin
      .from('financial_report_raw_values')
      .select('parsed_numeric_value, column_id, raw_text_value')
      .eq('row_id', r.id);

    console.log(`Row ${r.row_order}: "${r.raw_label}" ->`, vals?.map(v => ({ text: v.raw_text_value, num: v.parsed_numeric_value })));
  }
}

debugGlcvyBsDetail2().catch(console.error);
