import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function debugGlcvyBsDetail() {
  const sbAdmin = getSupabaseAdminClient();
  const reportId = '041157d1-8510-4bc5-826e-14b3d4069d31';

  const tableIds = ['82ad5ced-238a-46bf-af29-07098bb38f93', '90a35df9-7d3c-4986-b00e-4889aec7e8fa'];

  for (const tId of tableIds) {
    const { data: rows } = await sbAdmin
      .from('financial_report_raw_rows')
      .select('id, raw_label, row_order')
      .eq('table_id', tId)
      .order('row_order');

    console.log(`\n=================== TABLE ${tId} ===================`);
    for (const r of rows || []) {
      const { data: vals } = await sbAdmin
        .from('financial_report_raw_values')
        .select('parsed_numeric_value, column_id')
        .eq('row_id', r.id);

      console.log(`Row ${r.row_order}: "${r.raw_label}" ->`, vals?.map(v => v.parsed_numeric_value));
    }
  }
}

debugGlcvyBsDetail().catch(console.error);
