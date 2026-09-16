import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function main() {
  const sbAdmin = getSupabaseAdminClient();
  const { data: reports } = await sbAdmin
    .from('financial_reports')
    .select('id, symbol, company_name, reporting_period_end');

  console.log('REPORTS:', reports);

  for (const r of reports || []) {
    const { data: tables } = await sbAdmin
      .from('financial_report_tables')
      .select('id, statement_type, table_name')
      .eq('report_id', r.id)
      .eq('statement_type', 'BALANCE_SHEET');

    console.log(`\n=== Symbol: ${r.symbol} (report_id: ${r.id}, reporting_period_end: ${r.reporting_period_end}) ===`);
    console.log(`Balance Sheet Tables count: ${tables?.length}`);

    for (const t of tables || []) {
      const { data: cols } = await sbAdmin
        .from('financial_report_columns')
        .select('id, column_label, period_end, period_type')
        .eq('table_id', t.id);

      console.log(`Table ${t.id} (${t.table_name}):`);
      for (const col of cols || []) {
        console.log(`  Col ${col.id}: label="${col.column_label}", period_end="${col.period_end}", period_type="${col.period_type}"`);
      }
    }
  }
}

main().catch(console.error);
