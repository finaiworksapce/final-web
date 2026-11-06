const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace green styling
code = code.replace(/border-\[#1F7A63\]\/20/g, 'border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/20 border border-\[#1F7A63\]\/40/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');
code = code.replace(/hover:text-\[#1F7A63\]/g, 'hover:text-[#0E1E38]/80');
code = code.replace(/bg-\[#1F7A63\]\/15 text-\[#0E1E38\] hover:bg-\[#1F7A63\]\/30/g, 'bg-slate-100 text-[#0E1E38]/75 hover:bg-slate-200/80');
code = code.replace(/bg-\[#1F7A63\]\/30/g, 'bg-slate-200');
code = code.replace(/bg-\[#1F7A63\]\/50/g, 'bg-slate-300');
code = code.replace(/divide-\[#1F7A63\]\/20/g, 'divide-slate-100');
code = code.replace(/hover:bg-\[#1F7A63\]\/10/g, 'hover:bg-slate-50');
code = code.replace(/bg-\[#1F7A63\]\/20 border border-\[#1F7A63\]\/40/g, 'bg-slate-100 border border-slate-200');
code = code.replace(/ring-\[#1F7A63\]\/40/g, 'ring-slate-200');
code = code.replace(/bg-\[#1F7A63\]\/20 text-\[#0E1E38\] border border-\[#1F7A63\]\/30/g, 'bg-slate-100 text-[#0E1E38] border border-slate-200');
code = code.replace(/bg-\[#1F7A63\]\/10 border border-\[#1F7A63\]\/30/g, 'bg-slate-50 border border-slate-200');

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('DailyAgendaWidget.tsx updated.');
