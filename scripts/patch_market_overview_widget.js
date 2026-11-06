const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/dashboard/MarketOverviewWidget.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace green styling
code = code.replace(/border-\[#1F7A63\]\/20/g, 'border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/20 border border-\[#1F7A63\]\/40/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');
code = code.replace(/text-white bg-\[#1F7A63\] font-bold/g, 'text-white bg-[#0E1E38] font-normal');

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('MarketOverviewWidget.tsx updated.');
