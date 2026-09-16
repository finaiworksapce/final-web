import fs from 'node:fs';
import { ingestFinancialReport } from '../src/lib/financial-reports/ingestion/orchestrator';
import { getSupabaseAdminClient } from '../src/lib/financial-reports/admin-client';
import { validateAccountingIntegrity } from '../src/lib/financial-reports/standardizer/accounting-validator';

async function testTHYAOIngest() {
  const pdfPath = 'C:\\Users\\kavak\\Downloads\\THY A.O. Haziran 2026.pdf';
  if (!fs.existsSync(pdfPath)) return;

  const pdfBuffer = fs.readFileSync(pdfPath);
  const sbAdmin = getSupabaseAdminClient();

  // Delete prior THYAO 2026 Q2 test record
  await sbAdmin.from('financial_reports').delete().eq('symbol', 'THYAO').eq('fiscal_year', 2026).eq('fiscal_quarter', 2);

  console.log('Re-ingesting THYAO PDF with updated statement-detector...');
  const ingestRes = await ingestFinancialReport(pdfBuffer, {
    sourceFileName: 'THY A.O. Haziran 2026.pdf',
    overrideSymbol: 'THYAO',
    uploadedBy: 'FAZ5_TEST_HARNESS',
  });

  console.log('Ingest Status:', ingestRes.status, 'Report ID:', ingestRes.reportId);

  if (ingestRes.reportId) {
    const valRes = await validateAccountingIntegrity(ingestRes.reportId);
    console.log('--- ACCOUNTING VALIDATION ---');
    console.log('Passed:', valRes.passed);
    console.log('BS Equation:', valRes.balanceSheetEquation);
    console.log('Net Profit Consistency:', valRes.netProfitConsistency);
    console.log('Issues:', valRes.issues);
  }
}

testTHYAOIngest().catch(console.error);
