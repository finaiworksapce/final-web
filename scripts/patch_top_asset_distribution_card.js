const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace green from distribution colors
code = code.replace(/#1F7A63/g, '#2E5894');

// Header border and icon box
code = code.replace(/border-\[#1F7A63\]\/20/g, 'border-slate-100');
code = code.replace(/border-\[#2E5894\]\/20/g, 'border-slate-100');
code = code.replace(/bg-\[#2E5894\]\/20 border border-\[#2E5894\]\/40/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');
code = code.replace(/bg-\[#2E5894\]\/15/g, 'bg-[#0E1E38]/5');
code = code.replace(/bg-\[#2E5894\]\/10 border border-\[#2E5894\]\/30/g, 'bg-[#0E1E38]/5 border border-[#0E1E38]/10');

// Remove harsh boldings
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('TopAssetDistributionCard.tsx updated.');
