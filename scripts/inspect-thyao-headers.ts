import fs from 'node:fs';
import { parseKapFinancialPdf } from '../src/lib/financial-reports/parser/orchestrator';

async function inspectThyaoHeaders() {
  const pdfPath = 'C:\\Users\\kavak\\Downloads\\THY A.O. Haziran 2026.pdf';
  const pdfBuffer = fs.readFileSync(pdfPath);
  const parsed = await parseKapFinancialPdf(pdfBuffer, 'THY A.O. Haziran 2026.pdf');
  
  console.log(`Extracted ${parsed.tables.length} tables from THYAO PDF.`);
  for (const t of parsed.tables) {
    console.log(`Page ${t.pageStart} | Type: ${t.statementType} | Title: "${t.tableName}" | Rows: ${t.rows.length}`);
  }

}

inspectThyaoHeaders().catch(console.error);
