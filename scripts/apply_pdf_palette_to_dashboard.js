const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
    const fullPath = path.join(__dirname, '..', relativePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [from, to] of replacements) {
        content = content.replace(from, to);
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relativePath}`);
}

// 1. DashboardSummaryCards.tsx
replaceInFile('src/components/DashboardSummaryCards.tsx', [
    [/bg-\[#0E1E38\]/g, 'bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A]'],
    [/bg-white\/5/g, 'bg-[#004BFA]/15'],
    [/stopColor="#FFFFFF" stopOpacity="0.2"/g, 'stopColor="#004BFA" stopOpacity="0.3"'],
    [/stopColor="#FFFFFF" stopOpacity="0.5"/g, 'stopColor="#5B80FF" stopOpacity="0.7"'],
    [/stopColor="#FFFFFF" stopOpacity="0.85"/g, 'stopColor="#5B80FF" stopOpacity="0.95"'],
    [/fill="#FFFFFF"/g, 'fill="#5B80FF"'],
    [/bg-white\/10 text-white border border-white\/20 font-normal/g, 'bg-[#004BFA] text-[#F5F7FA] font-medium shadow-sm shadow-[#004BFA]/30'],
    [/text-white\/60/g, 'text-[#D6E4FF]/80'],
    [/text-white\/70/g, 'text-[#D6E4FF]'],
    [/text-white\/90/g, 'text-[#F5F7FA]'],
]);

// 2. FinAiYesterdayReportWidget.tsx
replaceInFile('src/components/FinAiYesterdayReportWidget.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-\[#0E1E38\]\/5/g, 'bg-[#D6E4FF]/30'],
    [/border-\[#0E1E38\]\/10/g, 'border-[#D6E4FF]/60'],
    [/bg-\[#0E1E38\]/g, 'bg-[#004BFA]'],
    [/hover:text-\[#0E1E38\]\/80/g, 'hover:text-[#004BFA]'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
]);

// 3. MarketOverviewWidget.tsx
replaceInFile('src/components/dashboard/MarketOverviewWidget.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-\[#0E1E38\]\/5/g, 'bg-[#D6E4FF]/30'],
    [/border-\[#0E1E38\]\/10/g, 'border-[#D6E4FF]/60'],
    [/bg-\[#0E1E38\]/g, 'bg-[#004BFA]'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
]);

// 4. DailyAgendaWidget.tsx
replaceInFile('src/components/dashboard/DailyAgendaWidget.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-\[#0E1E38\]\/5/g, 'bg-[#D6E4FF]/30'],
    [/border-\[#0E1E38\]\/10/g, 'border-[#D6E4FF]/60'],
    [/bg-\[#0E1E38\]/g, 'bg-[#004BFA]'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
    [/divide-slate-100/g, 'divide-[#D6E4FF]/40'],
    [/bg-slate-100/g, 'bg-[#D6E4FF]/30'],
    [/border-slate-200/g, 'border-[#D6E4FF]/60'],
    [/hover:bg-slate-50/g, 'hover:bg-[#D6E4FF]/20'],
    [/hover:text-\[#0E1E38\]\/80/g, 'hover:text-[#004BFA]'],
]);

// 5. LatestNewsWidget.tsx
replaceInFile('src/components/dashboard/LatestNewsWidget.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-\[#0E1E38\]\/5/g, 'bg-[#D6E4FF]/30'],
    [/border-\[#0E1E38\]\/10/g, 'border-[#D6E4FF]/60'],
    [/bg-\[#0E1E38\] text-white font-normal hover:bg-\[#0E1E38\]\/90/g, 'bg-[#004BFA] text-[#F5F7FA] font-medium hover:bg-[#004BFA]/90 shadow-sm shadow-[#004BFA]/20'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
    [/divide-slate-100/g, 'divide-[#D6E4FF]/40'],
    [/bg-slate-100/g, 'bg-[#D6E4FF]/30'],
    [/border-slate-200/g, 'border-[#D6E4FF]/60'],
    [/hover:bg-slate-50/g, 'hover:bg-[#D6E4FF]/20'],
]);

// 6. TopAssetDistributionCard.tsx
replaceInFile('src/components/dashboard/TopAssetDistributionCard.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-\[#0E1E38\]\/5/g, 'bg-[#D6E4FF]/30'],
    [/border-\[#0E1E38\]\/10/g, 'border-[#D6E4FF]/60'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
    [/DISTRIBUTION_COLORS = \[[^\]]+\]/g, 'DISTRIBUTION_COLORS = ["#040989", "#004BFA", "#5B80FF", "#2E5894", "#78B8F5"]'],
]);

// 7. FinancialTicker.tsx
replaceInFile('src/components/FinancialTicker.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
    [/bg-slate-200/g, 'bg-[#D6E4FF]'],
]);

// 8. page.tsx
replaceInFile('src/app/dashboard/page.tsx', [
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/bg-white text-\[#040989\]/g, 'bg-[#F5F7FA] text-[#040989]'],
    [/bg-\[#0E1E38\]/g, 'bg-[#004BFA]'],
    [/bg-blue-50\/50/g, 'bg-[#D6E4FF]/30'],
]);

// 9. layout-client.tsx
replaceInFile('src/app/dashboard/layout-client.tsx', [
    [/bg-\[#0E1E38\]/g, 'bg-[#02041A]'],
    [/text-\[#0E1E38\]/g, 'text-[#040989]'],
    [/border-slate-100/g, 'border-[#D6E4FF]/50'],
    [/bg-white text-\[#040989\] shadow-sm/g, 'bg-[#004BFA] text-[#F5F7FA] shadow-md shadow-[#004BFA]/30'],
]);

console.log('All dashboard components aligned with FinAi PDF color palette & Clash Grotesk.');
