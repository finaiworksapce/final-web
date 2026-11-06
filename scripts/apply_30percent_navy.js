const fs = require('fs');
const path = require('path');

console.log("=== APPLYING %30 #142B50 (NAVY) & %10 #78B8F5 (ACCENT SKY) ===");

// 1. DashboardSummaryCards.tsx
const summaryCardsPath = path.join(__dirname, '../src/components/DashboardSummaryCards.tsx');
const summaryCardsContent = `"use client";

import { useMemo, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff, Sparkles } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
};

export function DashboardSummaryCards({ layout = "grid", compact = false }: { layout?: "grid" | "stacked"; compact?: boolean }) {
    const { myAssets = [], prices = {}, isDataLoaded } = useUser();
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);

    const sampleAssets = useMemo(() => [
        { symbol: 'THYAO', quantity: 350, avgCost: 285.50, type: 'STOCK' },
        { symbol: 'ASELS', quantity: 500, avgCost: 61.20, type: 'STOCK' },
        { symbol: 'TUPRS', quantity: 200, avgCost: 165.00, type: 'STOCK' },
        { symbol: 'TI2', quantity: 25000, avgCost: 0.25, type: 'FUND' },
    ], []);

    const samplePrices: Record<string, number> = useMemo(() => ({
        'THYAO': 324.50,
        'ASELS': 69.80,
        'TUPRS': 182.40,
        'TI2': 0.298,
    }), []);

    const effectiveAssets = myAssets && myAssets.length > 0 ? myAssets : sampleAssets;
    const effectivePrices = prices && Object.keys(prices).length > 0 ? prices : samplePrices;

    // Portföyüm sayfasıyla %100 aynı hesaplama mantığı
    const { totalValue, totalCost, totalProfit, profitRatio } = useMemo(() => {
        let val = 0;
        let cost = 0;

        effectiveAssets.forEach((asset: any) => {
            const symKey = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
            const cleanSymKey = symKey.replace(/\\.IS$/, '');
            const currentPrice = effectivePrices[symKey] ?? effectivePrices[cleanSymKey] ?? effectivePrices[\`\${cleanSymKey}.IS\`] ?? asset.avgCost ?? 0;

            val += currentPrice * asset.quantity;
            cost += asset.avgCost * asset.quantity;
        });

        const profit = val - cost;
        const ratio = cost > 0 ? (profit / cost) * 100 : 0;

        return {
            totalValue: val,
            totalCost: cost,
            totalProfit: profit,
            profitRatio: ratio
        };
    }, [effectiveAssets, effectivePrices]);

    if (!isDataLoaded) {
        return (
            <div className={\`bg-[#142B50] rounded-3xl p-5 flex flex-col justify-between animate-pulse \${compact ? 'min-h-[160px]' : 'min-h-[250px]'}\`}>
                <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-white/20 rounded-lg" />
                    <div className="h-4 w-14 bg-white/20 rounded-lg" />
                </div>
                <div className="h-10 w-48 bg-white/20 rounded-xl my-auto" />
                <div className="h-6 w-full bg-white/20 rounded-lg pt-1" />
            </div>
        );
    }

    const isPositive = totalProfit >= 0;

    return (
        <div className={\`bg-[#142B50] text-white border-2 border-[#142B50] shadow-xl shadow-[#142B50]/25 relative overflow-hidden flex flex-col justify-between h-full group \${
            compact 
                ? 'rounded-2xl p-3.5 sm:p-4 min-h-0' 
                : 'rounded-3xl p-4 sm:p-5 min-h-[250px]'
        }\`}>
            {/* Ambient Background Gradient Circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#78B8F5]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#78B8F5]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle SVG Wave Background with Electric Sky Blue Line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <svg viewBox="0 0 500 160" className="w-full h-full opacity-40" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="heroSummaryLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#78B8F5" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#78B8F5" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#78B8F5" stopOpacity="0.95" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                        fill="none"
                        stroke="url(#heroSummaryLine)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="499" cy="24" r="3.5" fill="#78B8F5" opacity="1" className="animate-pulse" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* 1. Üst Başlık */}
                <div className={\`flex items-center justify-between gap-2 border-b border-white/10 \${compact ? 'pb-1.5' : 'pb-2.5'}\`}>
                    <div className="flex items-center gap-2">
                        <div className={\`rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#78B8F5] shadow-xs shrink-0 \${compact ? 'w-6 h-6' : 'w-7 h-7'}\`}>
                            <Wallet className={\`\${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#78B8F5]\`} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <h3 className={\`zodiak-subtitle font-[325] text-white/90 tracking-tight \${compact ? 'text-xs' : 'text-xs sm:text-[13px]'}\`}>
                                Toplam Varlık Değeri
                            </h3>
                            {/* Bakiye Gizle / Göster */}
                            <button
                                onClick={() => setIsBalanceHidden(prev => !prev)}
                                title={isBalanceHidden ? "Bakiyeyi Göster" : "Bakiyeyi Gizle"}
                                className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Bakiyeyi Gizle / Göster"
                            >
                                {isBalanceHidden ? (
                                    <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sağ Üst Canlı Portföy Rozeti (10% #78B8F5 Accent) */}
                    <div className={\`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#78B8F5] text-[#142B50] font-bold zodiak-subtitle font-[325] shadow-xs \${compact ? 'text-[9px]' : 'text-[11px]'}\`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#142B50] animate-pulse" />
                        <span>Canlı Portföy</span>
                    </div>
                </div>

                {/* 2. Büyük Rakam ve Değişim Rozeti (Orta Bölüm) */}
                <div className={compact ? "py-1.5 my-auto" : "my-auto py-2"}>
                    <h2 className={\`zodiak-title font-[500] text-white tracking-tight truncate leading-none \${
                        compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-[42px]'
                    }\`}>
                        {isBalanceHidden ? "₺ ••••••••" : formatCurrency(totalValue)}
                    </h2>

                    {/* Değişim Rozeti (10% #78B8F5 Accent) */}
                    <div className={\`flex items-center gap-2 \${compact ? 'mt-1.5' : 'mt-2.5'}\`}>
                        <div className={\`inline-flex items-center gap-1 px-3 py-1 rounded-full zodiak-subtitle font-[325] shadow-xs bg-[#78B8F5] text-[#142B50] font-bold \${
                            compact ? 'text-[11px]' : 'text-xs'
                        }\`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-[#142B50]" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                            <span>{isPositive ? "+" : ""}%{Math.abs(profitRatio).toFixed(2)}</span>
                        </div>
                        <span className={\`zodiak-desc font-[225] text-white/70 \${compact ? 'text-[10px]' : 'text-xs'}\`}>
                            (Toplam Net Getiri)
                        </span>
                    </div>
                </div>

                {/* 3. Alt Bilgi Şeridi */}
                <div className={\`grid grid-cols-3 gap-2 border-t border-white/15 text-left \${compact ? 'pt-1.5' : 'pt-2.5'}\`}>
                    <div>
                        <span className={\`zodiak-desc font-[225] text-white/60 block \${compact ? 'text-[10px]' : 'text-[11px]'}\`}>
                            Toplam Yatırım
                        </span>
                        <span className={\`zodiak-title font-[500] text-white block truncate \${compact ? 'text-xs mt-0.5' : 'text-xs sm:text-[13px] mt-0.5'}\`}>
                            {isBalanceHidden ? "₺ ••••••" : formatCurrency(totalCost)}
                        </span>
                    </div>

                    <div>
                        <span className={\`zodiak-desc font-[225] text-white/60 block \${compact ? 'text-[10px]' : 'text-[11px]'}\`}>
                            Toplam Kar / Zarar
                        </span>
                        <span className={\`zodiak-title font-[500] text-white block truncate \${compact ? 'text-xs mt-0.5' : 'text-xs sm:text-[13px] mt-0.5'}\`}>
                            {isBalanceHidden
                                ? (isPositive ? "+₺ •••" : "-₺ •••")
                                : \`\${isPositive ? "+" : ""}\${formatCurrency(totalProfit)}\`}
                        </span>
                    </div>

                    <div>
                        <span className={\`zodiak-desc font-[225] text-white/60 block \${compact ? 'text-[10px]' : 'text-[11px]'}\`}>
                            Portföy Pozisyonu
                        </span>
                        <span className={\`zodiak-title font-[500] text-white block truncate \${compact ? 'text-xs mt-0.5' : 'text-xs sm:text-[13px] mt-0.5'}\`}>
                            {effectiveAssets.length} Aktif Varlık
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
`;

fs.writeFileSync(summaryCardsPath, summaryCardsContent, 'utf-8');
console.log("Updated DashboardSummaryCards.tsx to #142B50 (%30)");

// 2. layout-client.tsx (Sidebar to #142B50, Active Nav to #78B8F5)
const layoutPath = path.join(__dirname, '../src/app/dashboard/layout-client.tsx');
let layout = fs.readFileSync(layoutPath, 'utf-8');

// Replace aside styling
layout = layout.replace(
    'border-r border-[#78B8F5]/40 bg-[#78B8F5] shadow-lg md:shadow-xl',
    'border-r border-[#142B50]/30 bg-[#142B50] shadow-xl md:shadow-2xl'
);

layout = layout.replace(
    'border-r-2 border-[#142B50]/15 bg-[#78B8F5] shadow-xl',
    'border-r border-[#142B50]/30 bg-[#142B50] shadow-xl md:shadow-2xl'
);

// In nav items: active item was text-white bg-[#142B50], now bg-[#78B8F5] text-[#142B50]!
layout = layout.replace(
    /text-white bg-\[#142B50\] shadow-\[0_4px_14px_rgba\(20, 43, 80, 0\.25\)\]/g,
    'text-[#142B50] bg-[#78B8F5] shadow-[0_4px_14px_rgba(120, 184, 245, 0.35)] font-bold'
);

// Inactive nav items: previously text-[#142B50] hover:bg-white/40, now text-white/80 hover:bg-white/10 hover:text-white
layout = layout.replace(
    /text-\[#142B50\] hover:bg-white\/40 hover:text-\[#142B50\] transition-colors/g,
    'text-white/80 hover:bg-white/10 hover:text-white transition-colors'
);

layout = layout.replace(
    /text-\[#142B50\] hover:bg-white\/40 hover:text-\[#142B50\]/g,
    'text-white/80 hover:bg-white/10 hover:text-white'
);

// Submenu active: bg-[#142B50] text-white -> bg-[#78B8F5] text-[#142B50]
layout = layout.replace(
    /bg-\[#142B50\] text-white shadow-sm font-bold/g,
    'bg-[#78B8F5] text-[#142B50] shadow-sm font-bold'
);

// In nav item icon: isActive ? 'text-[#142B50]' : 'text-white/70'
layout = layout.replace(
    /\$\{isActive \? 'text-white' : 'text-\[#142B50\]'\}\`/g,
    "\${isActive ? 'text-[#142B50]' : 'text-white/70'}\`"
);

// Chevron toggle button:
layout = layout.replace(
    "hover:bg-[#78B8F5]/25 text-slate-600 hover:text-[#142B50]",
    "hover:bg-white/10 text-white/60 hover:text-white"
);

// Tree line: border-[#142B50]/30 -> border-white/20
layout = layout.replace(
    "border-l-2 border-[#142B50]/30",
    "border-l-2 border-white/20"
);

// Logout button
layout = layout.replace(
    "text-[#142B50] hover:text-rose-600 hover:bg-white/40",
    "text-white/70 hover:text-rose-400 hover:bg-white/10"
);

fs.writeFileSync(layoutPath, layout, 'utf-8');
console.log("Updated layout-client.tsx sidebar to #142B50");

// 3. page.tsx CTA to #78B8F5 (10% accent)
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');

page = page.replace(
    'bg-[#142B50] hover:bg-[#142B50]/90 text-white text-xs zodiak-subtitle font-[325] shadow-xs',
    'bg-[#78B8F5] hover:bg-[#78B8F5]/85 text-[#142B50] font-bold text-xs zodiak-subtitle font-[325] shadow-xs'
);

fs.writeFileSync(pagePath, page, 'utf-8');
console.log("Updated page.tsx CTA to #78B8F5");

// 4. FinAiYesterdayReportWidget.tsx badge to #78B8F5
const reportPath = path.join(__dirname, '../src/components/FinAiYesterdayReportWidget.tsx');
let report = fs.readFileSync(reportPath, 'utf-8');

report = report.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5]',
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5]'
);

report = report.replace(
    'text-white bg-[#142B50] px-2.5 py-0.5 rounded-full shadow-xs',
    'text-[#142B50] bg-[#78B8F5] font-bold px-2.5 py-0.5 rounded-full shadow-xs'
);

fs.writeFileSync(reportPath, report, 'utf-8');
console.log("Updated FinAiYesterdayReportWidget.tsx badge to #78B8F5");

// 5. MarketOverviewWidget.tsx badge to #78B8F5
const marketPath = path.join(__dirname, '../src/components/dashboard/MarketOverviewWidget.tsx');
let market = fs.readFileSync(marketPath, 'utf-8');

market = market.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5]',
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5]'
);

market = market.replace(
    'text-white bg-[#142B50] px-2.5 py-0.5 rounded-full shadow-xs',
    'text-[#142B50] bg-[#78B8F5] font-bold px-2.5 py-0.5 rounded-full shadow-xs'
);

fs.writeFileSync(marketPath, market, 'utf-8');
console.log("Updated MarketOverviewWidget.tsx badge to #78B8F5");

// 6. DailyAgendaWidget.tsx borders
const agendaPath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let agenda = fs.readFileSync(agendaPath, 'utf-8');

agenda = agenda.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5]',
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5]'
);

fs.writeFileSync(agendaPath, agenda, 'utf-8');
console.log("Updated DailyAgendaWidget.tsx border");

// 7. LatestNewsWidget.tsx borders & CTA
const newsPath = path.join(__dirname, '../src/components/dashboard/LatestNewsWidget.tsx');
let news = fs.readFileSync(newsPath, 'utf-8');

news = news.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5]',
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5]'
);

news = news.replace(
    'bg-[#78B8F5]/15 text-[#142B50] hover:bg-[#78B8F5]/30 px-3 py-1 rounded-lg',
    'bg-[#78B8F5] text-[#142B50] font-bold hover:bg-[#78B8F5]/85 px-3 py-1 rounded-lg shadow-xs'
);

fs.writeFileSync(newsPath, news, 'utf-8');
console.log("Updated LatestNewsWidget.tsx border & CTA");

// 8. TopAssetDistributionCard.tsx border
const donutCardPath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let donutCard = fs.readFileSync(donutCardPath, 'utf-8');

donutCard = donutCard.replace(
    'border-2 border-[#78B8F5]/40 hover:border-[#78B8F5]',
    'border-2 border-[#142B50]/15 hover:border-[#78B8F5]'
);

fs.writeFileSync(donutCardPath, donutCard, 'utf-8');
console.log("Updated TopAssetDistributionCard.tsx border");

console.log("=== ALL FILES UPDATED TO %30 #142B50 SUCCESSFULLY ===");
