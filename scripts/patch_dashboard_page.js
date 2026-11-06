const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/bg-\[#1F7A63\] hover:bg-\[#1F7A63\]\/90 text-white font-bold/g, 'bg-[#0E1E38] hover:bg-[#0E1E38]/90 text-white font-normal');

// Remove harsh boldings
code = code.replace(/font-black/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('page.tsx updated.');
