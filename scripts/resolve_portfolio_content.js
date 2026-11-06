const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/PortfolioContent.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of #00008B with #142B50
code = code.replace(/#00008B/g, '#142B50');

// Remove the inline font-inter override
code = code.replace('style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}', '');

fs.writeFileSync(filePath, code, 'utf8');
console.log('PortfolioContent.tsx successfully cleaned and updated!');
