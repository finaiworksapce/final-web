const fs = require('fs');
const path = require('path');

console.log("=== APPLYING EXPOSE FONT FOR NUMBERS & #D4A24C FOR 10% ACCENT ===");

// 1. globals.css - Add Expose font-face and .font-numbers utility
const cssPath = path.join(__dirname, '../src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf-8');

if (!css.includes('Expose-Medium')) {
    const fontBlock = `@font-face {
  font-family: 'Expose-Medium';
  src: url('/fonts/Expose-Medium.woff2') format('woff2'),
       url('/fonts/Expose-Medium.woff') format('woff'),
       url('/fonts/Expose-Medium.ttf') format('truetype');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'Expose';
  src: url('/fonts/Expose-Medium.woff2') format('woff2'),
       url('/fonts/Expose-Medium.woff') format('woff'),
       url('/fonts/Expose-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

.font-numbers, .font-expose {
  font-family: 'Expose-Medium', 'Expose', sans-serif !important;
  font-feature-settings: 'tnum' on, 'lnum' on;
}
`;
    css = css.replace('@import "tailwindcss";', `@import "tailwindcss";\n\n${fontBlock}`);
    fs.writeFileSync(cssPath, css, 'utf-8');
    console.log("Updated globals.css with Expose-Medium font-face");
}

// 2. Replace #2EC4B6 with #D4A24C across all files
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
        const count = (content.match(/#2EC4B6/gi) || []).length;
        if (count > 0) {
            content = content.replace(/#2EC4B6/gi, '#D4A24C');
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Replaced ${count} occurrences of #2EC4B6 with #D4A24C in ${relPath}`);
        }
    }
});

// 3. Add font-numbers to numbers in DashboardSummaryCards.tsx
const summaryPath = path.join(__dirname, '../src/components/DashboardSummaryCards.tsx');
let summary = fs.readFileSync(summaryPath, 'utf-8');
summary = summary.replace(
    'zodiak-title font-[500] text-white tracking-tight truncate leading-none',
    'font-numbers font-[500] text-white tracking-tight truncate leading-none'
);
summary = summary.replace(
    'zodiak-title font-[500] text-white block truncate',
    'font-numbers font-[500] text-white block truncate'
);
summary = summary.replace(
    '<span>{isPositive ? "+" : ""}%{Math.abs(profitRatio).toFixed(2)}</span>',
    '<span className="font-numbers">{isPositive ? "+" : ""}%{Math.abs(profitRatio).toFixed(2)}</span>'
);
fs.writeFileSync(summaryPath, summary, 'utf-8');
console.log("Updated numbers font in DashboardSummaryCards.tsx");

// 4. Add font-numbers to TopAssetDistributionCard.tsx
const donutPath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let donut = fs.readFileSync(donutPath, 'utf-8');
donut = donut.replace(
    'text-xs sm:text-[13px] zodiak-title font-[500] text-[#0E1E38] tracking-tight mt-0.5 truncate max-w-[84px]',
    'text-xs sm:text-[13px] font-numbers font-[500] text-[#0E1E38] tracking-tight mt-0.5 truncate max-w-[84px]'
);
donut = donut.replace(
    'text-xs zodiak-title font-[500] text-[#0E1E38] tabular-nums ml-auto shrink-0',
    'text-xs font-numbers font-[500] text-[#0E1E38] tabular-nums ml-auto shrink-0'
);
fs.writeFileSync(donutPath, donut, 'utf-8');
console.log("Updated numbers font in TopAssetDistributionCard.tsx");

// 5. Add font-numbers to FinAiYesterdayReportWidget.tsx
const reportPath = path.join(__dirname, '../src/components/FinAiYesterdayReportWidget.tsx');
let report = fs.readFileSync(reportPath, 'utf-8');
report = report.replace(
    'text-[10px] zodiak-title font-[500] px-2 py-0.5 rounded-md text-[#0E1E38]',
    'text-[10px] font-numbers font-[500] px-2 py-0.5 rounded-md text-[#0E1E38]'
);
fs.writeFileSync(reportPath, report, 'utf-8');
console.log("Updated numbers font in FinAiYesterdayReportWidget.tsx");

// 6. Add font-numbers to DailyAgendaWidget.tsx
const agendaPath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let agenda = fs.readFileSync(agendaPath, 'utf-8');
agenda = agenda.replace(
    'text-xs font-mono zodiak-subtitle font-[325] text-[#0E1E38]/70 w-11 shrink-0',
    'text-xs font-mono font-numbers font-[500] text-[#0E1E38]/80 w-11 shrink-0'
);
agenda = agenda.replace(
    '({todayFormattedDate})',
    '(<span className="font-numbers">{todayFormattedDate}</span>)'
);
fs.writeFileSync(agendaPath, agenda, 'utf-8');
console.log("Updated numbers font in DailyAgendaWidget.tsx");

// 7. Add font-numbers to LatestNewsWidget.tsx
const newsPath = path.join(__dirname, '../src/components/dashboard/LatestNewsWidget.tsx');
let news = fs.readFileSync(newsPath, 'utf-8');
news = news.replace(
    'text-[11px] sm:text-xs zodiak-desc font-[225] text-[#0E1E38]/60',
    'text-[11px] sm:text-xs font-numbers text-[#0E1E38]/70'
);
fs.writeFileSync(newsPath, news, 'utf-8');
console.log("Updated numbers font in LatestNewsWidget.tsx");

// 8. Add font-numbers to FinancialTicker.tsx
const tickerPath = path.join(__dirname, '../src/components/FinancialTicker.tsx');
let ticker = fs.readFileSync(tickerPath, 'utf-8');
ticker = ticker.replace(
    'text-xs md:text-sm zodiak-title font-[500] text-[#0E1E38] whitespace-nowrap',
    'text-xs md:text-sm font-numbers font-[500] text-[#0E1E38] whitespace-nowrap'
);
ticker = ticker.replace(
    'flex items-center text-[10px] md:text-xs zodiak-subtitle font-[325] whitespace-nowrap',
    'flex items-center text-[10px] md:text-xs font-numbers font-[500] whitespace-nowrap'
);
fs.writeFileSync(tickerPath, ticker, 'utf-8');
console.log("Updated numbers font in FinancialTicker.tsx");

// 9. Add font-numbers to page.tsx live timestamp
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');
page = page.replace(
    '{new Date().toLocaleTimeString(\'tr-TR\', { hour: \'2-digit\', minute: \'2-digit\' })}',
    '<span className="font-numbers">{new Date().toLocaleTimeString(\'tr-TR\', { hour: \'2-digit\', minute: \'2-digit\' })}</span>'
);
fs.writeFileSync(pagePath, page, 'utf-8');
console.log("Updated numbers font in page.tsx");

console.log("=== COMPLETED ALL UPDATES SUCCESSFULLY ===");
