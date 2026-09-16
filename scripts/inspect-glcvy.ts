import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function main() {
  const sb = getSupabaseAdminClient();
  const { data: reports } = await sb
    .from('financial_reports')
    .select('id, symbol, fiscal_year, fiscal_quarter, report_slug, is_current, version')
    .eq('symbol', 'GLCVY')
    .order('version', { ascending: false });

  console.log('--- GLCVY REPORTS IN DB ---');
  console.table(reports);

  if (!reports || reports.length === 0) {
    console.log('GLCVY report not found in DB!');
    return;
  }

  for (const rep of reports) {
    const { count: tCount } = await sb
      .from('financial_report_tables')
      .select('*', { count: 'exact', head: true })
      .eq('report_id', rep.id);
    console.log(`Report ${rep.id} (${rep.report_slug}, v${rep.version}, isCurrent: ${rep.is_current}): ${tCount || 0} tables`);
  }

  const currentReport = reports.find((r) => r.is_current) || reports[0];

  // Inspect tables
  const { data: tables } = await sb
    .from('financial_report_tables')
    .select('id, table_name, statement_type, table_order, page_start')
    .eq('report_id', currentReport.id)
    .order('table_order', { ascending: true });

  console.log(`\n--- TABLES IN REPORT (${tables?.length || 0}) ---`);
  for (const t of (tables || []).slice(0, 15)) {
    console.log(`[Table #${t.table_order}] Page ${t.page_start} | Type: ${t.statement_type.padEnd(16)} | Name: ${t.table_name}`);
  }

  // Find real Balance Sheet tables (Table #10 & Table #11 on pages 10 & 11)
  const bsTables = (tables || []).filter((t) => t.page_start === 10 || t.page_start === 11);
  for (const bsTable of bsTables) {
    console.log(`\n--- BALANCE SHEET TABLE (Table #${bsTable.table_order}, Page: ${bsTable.page_start}) ---`);
    const { data: cols } = await sb
      .from('financial_report_columns')
      .select('id, column_label, period_type, period_nature, period_end, column_order')
      .eq('table_id', bsTable.id)
      .order('column_order');
    console.log('Columns:');
    console.table(cols);

    const { data: rows } = await sb
      .from('financial_report_raw_rows')
      .select('id, raw_label, row_order, mapping_status, canonical_item_id')
      .eq('table_id', bsTable.id)
      .order('row_order');

    console.log(`Rows in Table #${bsTable.table_order} (${rows?.length || 0}):`);
    for (const r of (rows || [])) {
      const { data: vals } = await sb
        .from('financial_report_raw_values')
        .select('raw_text_value, parsed_numeric_value, column_id')
        .eq('row_id', r.id);
      const valStrs = (vals || []).map((v) => `${v.raw_text_value} (${v.parsed_numeric_value})`).join(' | ');
      console.log(`[Row #${r.row_order}] [${r.mapping_status}] ${r.raw_label} ==> ${valStrs}`);
    }
  }
}

main().catch(console.error);
