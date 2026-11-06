const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let layout = fs.readFileSync(layoutPath, 'utf-8');

layout = layout.replace(
    "${isActive ? 'text-[#0E1E38]' : 'text-white/70'}",
    "${isActive ? 'text-white' : 'text-white/70'}"
);

fs.writeFileSync(layoutPath, layout, 'utf-8');
console.log('Fixed icon color to text-white on active nav');
