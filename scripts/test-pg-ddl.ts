import { getSupabaseAdminClient, ensureEnvLoaded } from '../src/lib/financial-reports/admin-client';

ensureEnvLoaded();
const sb = getSupabaseAdminClient();

async function testBackupTable() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const ref = url.split('//')[1].split('.')[0];

  console.log('Project Ref:', ref);

  // Check if we can execute SQL via Supabase REST SQL endpoint
  const sqlEndpoint = `${url}/rest/v1/rpc/exec_sql`;
  try {
    const res = await fetch(sqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      },
      body: JSON.stringify({ query: 'CREATE TABLE IF NOT EXISTS public.legacy_financial_statement_periods_backup AS TABLE public.financial_statement_periods;' })
    });

    console.log('RPC exec_sql status:', res.status);
    const text = await res.text();
    console.log('RPC response:', text);
  } catch (e: any) {
    console.log('RPC failed:', e.message);
  }

  // Check table status via admin client
  const { count, error } = await sb.from('legacy_financial_statement_periods_backup').select('id', { count: 'exact', head: true });
  console.log('Table legacy_financial_statement_periods_backup check:', count, error?.message);
}

testBackupTable();
