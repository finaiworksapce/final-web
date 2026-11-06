const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/dashboard/TradingViewMarketOverview.tsx');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/widgetFontColor:\s*\"#0B1F3A\"/g, 'widgetFontColor: "#0E1E38"');
code = code.replace(/fontFamily:\s*\"[^\"]*\"/g, 'fontFamily: "Zodiak, Georgia, serif"');

fs.writeFileSync(filePath, code, 'utf8');
console.log('TradingViewMarketOverview.tsx updated.');
