const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/FinancialTicker.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/bg-\[#1F7A63\]\/10 border-b border-\[#1F7A63\]\/30 backdrop-blur-sm/g, 'bg-white border-b border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/10 border-b border-\[#1F7A63\]\/30 backdrop-blur-md/g, 'bg-white border-b border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/40/g, 'bg-slate-200');

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('FinancialTicker.tsx updated.');
