import { ensureEnvLoaded } from '../src/lib/financial-reports/admin-client';
ensureEnvLoaded();

console.log('Available DB/Supabase env keys:');
for (const k of Object.keys(process.env)) {
  if (k.includes('SUPABASE') || k.includes('POSTGRES') || k.includes('DATABASE') || k.includes('URL')) {
    console.log(` - ${k}`);
  }
}
