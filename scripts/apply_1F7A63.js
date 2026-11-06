const fs = require('fs');
const path = require('path');

console.log("=== APPLYING %10 #1F7A63 (EMERALD GREEN) ACROSS ALL COMPONENTS ===");

const filesToReplaceColor = [
    'src/components/DashboardSummaryCards.tsx',
    'src/app/dashboard/layout-client.tsx',
    'src/app/dashboard/page.tsx',
    'src/components/FinAiYesterdayReportWidget.tsx',
    'src/components/dashboard/MarketOverviewWidget.tsx',
    'src/components/dashboard/DailyAgendaWidget.tsx',
    'src/components/dashboard/LatestNewsWidget.tsx',
    'src/components/dashboard/TopAssetDistributionCard.tsx',
    'src/components/FinancialTicker.tsx'
];

filesToReplaceColor.forEach(relPath => {
    const fullPath = path.join(__dirname, '..', relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const count = (content.match(/#3D8BFD/gi) || []).length;
        if (count > 0) {
            content = content.replace(/#3D8BFD/gi, '#1F7A63');
            // Since #1F7A63 is a deep emerald green, ensure text on it is crisp white:
            content = content.replace(/bg-\[#1F7A63\]\s+text-\[#0E1E38\]/g, 'bg-[#1F7A63] text-white');
            content = content.replace(/text-\[#0E1E38\]\s+bg-\[#1F7A63\]/g, 'text-white bg-[#1F7A63]');
            content = content.replace(/bg-\[#1F7A63\]\s+hover:bg-\[#1F7A63\]\/85\s+text-\[#0E1E38\]/g, 'bg-[#1F7A63] hover:bg-[#1F7A63]/90 text-white');
            
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Replaced ${count} occurrences of #3D8BFD with #1F7A63 in ${relPath}`);
        }
    }
});

// Sidebar active icon text color
const layoutPath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let layout = fs.readFileSync(layoutPath, 'utf-8');
layout = layout.replace(
    "${isActive ? 'text-[#0E1E38]' : 'text-white/70'}",
    "${isActive ? 'text-white' : 'text-white/70'}"
);
layout = layout.replace(
    "${isActive ? 'text-[#1F7A63]' : 'text-white/70'}",
    "${isActive ? 'text-white' : 'text-white/70'}"
);
fs.writeFileSync(layoutPath, layout, 'utf-8');

console.log("=== COMPLETED COLOR SWAP TO #1F7A63 ===");
