const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/FinAiYesterdayReportWidget.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace green styling
code = code.replace(/border-\[#1F7A63\]\/20/g, 'border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/20 border border-\[#1F7A63\]\/40/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');
code = code.replace(/text-white bg-\[#1F7A63\] font-bold/g, 'text-white bg-[#0E1E38] font-normal');
code = code.replace(/hover:text-\[#1F7A63\]/g, 'hover:text-[#0E1E38]/80');
code = code.replace(/text-white bg-\[#1F7A63\]\/25 border border-\[#1F7A63\]\/40/g, 'text-[#0E1E38] bg-[#0E1E38]/5 border border-[#0E1E38]/10');

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('FinAiYesterdayReportWidget.tsx updated.');
