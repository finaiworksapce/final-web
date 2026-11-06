const fs = require('fs');
const path = require('path');

console.log("=== APPLYING %10 #2EC4B6 (TEAL) ACROSS ALL DASHBOARD COMPONENTS ===");

const filesToUpdate = [
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

filesToUpdate.forEach(relPath => {
    const fullPath = path.join(__dirname, '..', relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        const count = (content.match(/#78B8F5/gi) || []).length;
        if (count > 0) {
            content = content.replace(/#78B8F5/gi, '#2EC4B6');
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Updated ${relPath} (replaced ${count} occurrences with #2EC4B6)`);
        } else {
            console.log(`No #78B8F5 found in ${relPath}`);
        }
    } else {
        console.warn(`File not found: ${relPath}`);
    }
});

console.log("=== ALL FILES UPDATED TO #2EC4B6 ===");
