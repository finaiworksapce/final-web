const fs = require('fs');
const path = require('path');

console.log("=== APPLYING %10 #3D8BFD ACROSS ALL DASHBOARD COMPONENTS ===");

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
        const count = (content.match(/#D4A24C/gi) || []).length;
        if (count > 0) {
            content = content.replace(/#D4A24C/gi, '#3D8BFD');
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Replaced ${count} occurrences of #D4A24C with #3D8BFD in ${relPath}`);
        }
    }
});

console.log("=== COMPLETED COLOR SWAP TO #3D8BFD ===");
