const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/DashboardSummaryCards.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove #1F7A63 glows and replace with subtle white glow
code = code.replace(/bg-\[#1F7A63\]\/15/g, 'bg-white/5');
code = code.replace(/bg-\[#1F7A63\]\/10/g, 'bg-white/5');

// 2. SVG wave line gradients
code = code.replace(/stopColor="#1F7A63" stopOpacity="0.2"/g, 'stopColor="#FFFFFF" stopOpacity="0.2"');
code = code.replace(/stopColor="#1F7A63" stopOpacity="0.6"/g, 'stopColor="#FFFFFF" stopOpacity="0.5"');
code = code.replace(/stopColor="#1F7A63" stopOpacity="0.95"/g, 'stopColor="#FFFFFF" stopOpacity="0.85"');
code = code.replace(/fill="#1F7A63"/g, 'fill="#FFFFFF"');

// 3. Wallet icon color
code = code.replace(/text-\[#1F7A63\]/g, 'text-white');

// 4. "Canlı Portföy" badge
code = code.replace(/bg-\[#1F7A63\] text-white font-bold/g, 'bg-white/10 text-white border border-white/20 font-normal');
code = code.replace(/bg-\[#0E1E38\] animate-pulse/g, 'bg-white animate-pulse');

// 5. Change badge: white pill with #0E1E38 text
code = code.replace(/bg-\[#1F7A63\] text-white font-bold/g, 'bg-white text-[#0E1E38] font-normal shadow-xs');
code = code.replace(/text-\[#0E1E38\]/g, 'text-[#0E1E38]');

// 6. Ensure no font-black or font-extrabold or harsh bolding on numbers and titles
code = code.replace(/font-\[500\]/g, 'font-normal');
code = code.replace(/font-bold/g, 'font-normal');
code = code.replace(/font-extrabold/g, 'font-normal');
code = code.replace(/font-black/g, 'font-normal');

fs.writeFileSync(filePath, code, 'utf8');
console.log('DashboardSummaryCards.tsx updated.');
