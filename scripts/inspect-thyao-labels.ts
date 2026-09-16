import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';

async function checkLabels() {
  const sbAdmin = getSupabaseAdminClient();
  const { data: rep } = await sbAdmin
    .from('financial_reports')
    .select('id')
    .eq('symbol', 'THYAO')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!rep) {
    console.log('THYAO report not found');
    return;
  }

  const { data: items } = await sbAdmin
    .from('financial_report_raw_items')
    .select('raw_label, statement_type, parsed_numeric_value')
    .eq('report_id', rep.id);

  console.log(`Found ${items?.length} items for THYAO report ID ${rep.id}`);
  
  const profitItems = items?.filter(i => 
    i.raw_label?.toUpperCase().includes('KÂR') || 
    i.raw_label?.toUpperCase().includes('KAR') || 
    i.raw_label?.toUpperCase().includes('ZARAR') ||
    i.raw_label?.toUpperCase().includes('DÖNEM')
  );
  console.log('--- Sample Net Profit / Income Items ---');
  for (const item of (profitItems || []).slice(0, 40)) {
    if (item.parsed_numeric_value) {
      console.log(`[${item.statement_type}] ${item.raw_label} -> ${item.parsed_numeric_value}`);
    }
  }

  const statementTypes = new Set(items?.map(i => i.statement_type));
  console.log('Statement types present:', Array.from(statementTypes));
}

checkLabels().catch(console.error);
