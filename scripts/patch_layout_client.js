const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace active sidebar item styling (clean white on dark navy sidebar)
code = code.replace(
    /text-white bg-\[#1F7A63\] shadow-\[0_4px_14px_rgba\(120,\s*184,\s*245,\s*0\.35\)\] font-bold font-bold/g,
    'text-[#0E1E38] bg-white shadow-sm font-normal'
);
code = code.replace(
    /text-white bg-\[#1F7A63\] shadow-\[0_4px_14px_rgba\(120,\s*184,\s*245,\s*0\.35\)\] font-bold/g,
    'text-[#0E1E38] bg-white shadow-sm font-normal'
);
code = code.replace(
    /bg-\[#1F7A63\] text-white shadow-sm font-bold/g,
    'bg-white text-[#0E1E38] shadow-sm font-normal'
);

// Mobile navigation and sub-elements
code = code.replace(/bg-\[#1F7A63\]\/20 text-\[#0E1E38\] font-bold/g, 'bg-slate-100 text-[#0E1E38] font-normal');
code = code.replace(/bg-\[#1F7A63\] text-white shadow-sm/g, 'bg-[#0E1E38] text-white shadow-sm font-normal');
code = code.replace(/border-b border-\[#1F7A63\]\/30/g, 'border-b border-slate-100');

// Focus rings
code = code.replace(/focus-visible:ring-\[#1F7A63\]\/[0-9]+/g, 'focus-visible:ring-[#0E1E38]/20');

// Avatar button
code = code.replace(/bg-\[#1F7A63\]\/20 flex items-center justify-center text-\[#0E1E38\] zodiak-subtitle hover:bg-\[#1F7A63\]\/40 border border-\[#1F7A63\]\/50/g, 'bg-slate-100 flex items-center justify-center text-[#0E1E38] zodiak-subtitle hover:bg-slate-200 border border-slate-200');

// Any remaining #1F7A63 in layout-client
code = code.replace(/#1F7A63/g, '#0E1E38');

// Remove harsh boldings
code = code.replace(/font-black/g, 'font-normal');
code = code.replace(/font-extrabold/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('layout-client.tsx updated.');
