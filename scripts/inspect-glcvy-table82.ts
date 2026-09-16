import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function inspectGlcvyTable82() {
  const sbAdmin = getSupabaseAdminClient();
  const tableId = '82ad5ced-238a-46bf-af29-07098bb38f93';

  const { data: cols } = await sbAdmin
    .from('financial_report_columns')
    .select('*')
    .eq('table_id', tableId)
    .order('column_order');

  console.log('COLUMNS:');
  for (const c of cols || []) {
    console.log(`  Col order ${c.column_order} (id: ${c.id}): label="${c.column_label}", period_end="${c.period_end}"`);
  }

  const { data: rows } = await sbAdmin
    .from('financial_report_raw_rows')
    .select('*')
    .eq('table_id', tableId)
    .order('row_order');

  console.log('\nROWS & VALUES:');
  for (const r of rows || []) {
    const { data: vals } = await sbAdmin
      .from('financial_report_raw_values')
      .select('*')
      .eq('row_id', r.id);

    console.log(`Row ${r.row_order} ["${r.raw_label}"]:`);
    for (const v of vals || []) {
      console.log(`   ColId ${v.column_id} rawText="${v.raw_text_value}", numeric=${v.parsed_numeric_value}`);
    }
  }
}

inspectGlcvyTable82().catch(console.error);
