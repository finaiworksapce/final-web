const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/dashboard/LatestNewsWidget.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace green styling
code = code.replace(/border-\[#1F7A63\]\/20/g, 'border-slate-100');
code = code.replace(/bg-\[#1F7A63\]\/20 border border-\[#1F7A63\]\/40/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');
code = code.replace(/bg-\[#1F7A63\] text-white font-bold hover:bg-\[#1F7A63\]\/85/g, 'bg-[#0E1E38] text-white font-normal hover:bg-[#0E1E38]/90');
code = code.replace(/divide-\[#1F7A63\]\/20/g, 'divide-slate-100');
code = code.replace(/hover:bg-\[#1F7A63\]\/10/g, 'hover:bg-slate-50');
code = code.replace(/border border-\[#1F7A63\]\/30/g, 'border border-slate-100');

// Fix invisible white text on category badge:
code = code.replace(
    'text-white bg-[#1F7A63]/20 border border-[#1F7A63]/30',
    'text-[#0E1E38] bg-slate-100 border border-slate-200'
);

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('LatestNewsWidget.tsx updated.');
