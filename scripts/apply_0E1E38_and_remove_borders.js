const fs = require('fs');
const path = require('path');

console.log("=== APPLYING %30 #0E1E38 & REMOVING WIDGET BORDERS ===");

// 1. DashboardSummaryCards.tsx
const summaryCardsPath = path.join(__dirname, '../src/components/DashboardSummaryCards.tsx');
let summary = fs.readFileSync(summaryCardsPath, 'utf-8');
// Replace bg and remove border
summary = summary.replace(
    'bg-[#142B50] text-white border-2 border-[#142B50] shadow-xl shadow-[#142B50]/25',
    'bg-[#0E1E38] text-white shadow-xl shadow-[#0E1E38]/20'
);
summary = summary.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(summaryCardsPath, summary, 'utf-8');
console.log("DashboardSummaryCards.tsx updated to #0E1E38 and border removed.");

// 2. TopAssetDistributionCard.tsx
const donutPath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let donut = fs.readFileSync(donutPath, 'utf-8');
// Remove outer border
donut = donut.replace(
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
donut = donut.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
donut = donut.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(donutPath, donut, 'utf-8');
console.log("TopAssetDistributionCard.tsx updated to #0E1E38 and border removed.");

// 3. FinAiYesterdayReportWidget.tsx
const reportPath = path.join(__dirname, '../src/components/FinAiYesterdayReportWidget.tsx');
let report = fs.readFileSync(reportPath, 'utf-8');
// Remove outer border
report = report.replace(
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
report = report.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
report = report.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(reportPath, report, 'utf-8');
console.log("FinAiYesterdayReportWidget.tsx updated to #0E1E38 and border removed.");

// 4. MarketOverviewWidget.tsx
const marketPath = path.join(__dirname, '../src/components/dashboard/MarketOverviewWidget.tsx');
let market = fs.readFileSync(marketPath, 'utf-8');
// Remove outer border
market = market.replace(
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
market = market.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
market = market.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(marketPath, market, 'utf-8');
console.log("MarketOverviewWidget.tsx updated to #0E1E38 and border removed.");

// 5. DailyAgendaWidget.tsx
const agendaPath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let agenda = fs.readFileSync(agendaPath, 'utf-8');
// Remove outer border
agenda = agenda.replace(
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
agenda = agenda.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
agenda = agenda.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(agendaPath, agenda, 'utf-8');
console.log("DailyAgendaWidget.tsx updated to #0E1E38 and border removed.");

// 6. LatestNewsWidget.tsx
const newsPath = path.join(__dirname, '../src/components/dashboard/LatestNewsWidget.tsx');
let news = fs.readFileSync(newsPath, 'utf-8');
// Remove outer border
news = news.replace(
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
news = news.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl',
    'rounded-3xl'
);
news = news.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(newsPath, news, 'utf-8');
console.log("LatestNewsWidget.tsx updated to #0E1E38 and border removed.");

// 7. layout-client.tsx
const layoutPath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let layout = fs.readFileSync(layoutPath, 'utf-8');
layout = layout.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(layoutPath, layout, 'utf-8');
console.log("layout-client.tsx updated to #0E1E38.");

// 8. page.tsx
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');
page = page.replace(/#142B50/g, '#0E1E38');
// Remove border on live pill if any
page = page.replace('border border-[#78B8F5]/40', 'border-0');
fs.writeFileSync(pagePath, page, 'utf-8');
console.log("page.tsx updated to #0E1E38.");

// 9. FinancialTicker.tsx
const tickerPath = path.join(__dirname, '../src/components/FinancialTicker.tsx');
let ticker = fs.readFileSync(tickerPath, 'utf-8');
ticker = ticker.replace(/#142B50/g, '#0E1E38');
fs.writeFileSync(tickerPath, ticker, 'utf-8');
console.log("FinancialTicker.tsx updated to #0E1E38.");

console.log("=== ALL CHANGES APPLIED SUCCESSFULLY ===");
