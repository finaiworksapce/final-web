"use client";

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
    const { myAssets = [], prices = {}, isDataLoaded, isAuthenticated } = useUser();
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

    // Oturum açmış kullanıcının henüz varlığı yoksa 0 TL gösterilir (sampleAssets atanmaz)
    const effectiveAssets = isAuthenticated ? (myAssets || []) : (myAssets && myAssets.length > 0 ? myAssets : sampleAssets);
    const effectivePrices = (prices && Object.keys(prices).length > 0) ? prices : (isAuthenticated ? {} : samplePrices);

    // Portföyüm sayfasıyla %100 aynı hesaplama mantığı
    const { totalValue, totalCost, totalProfit, profitRatio } = useMemo(() => {
        let val = 0;
        let cost = 0;

        effectiveAssets.forEach((asset: any) => {
            const symKey = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
            const cleanSymKey = symKey.replace(/\.IS$/, '');
            const currentPrice = effectivePrices[symKey] ?? effectivePrices[cleanSymKey] ?? effectivePrices[`${cleanSymKey}.IS`] ?? asset.avgCost ?? 0;

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
            <div className={`bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] rounded-3xl p-5 flex flex-col justify-between animate-pulse ${compact ? 'min-h-[160px]' : 'min-h-[250px]'}`}>
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
        <div className={`bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white shadow-xl shadow-[#0E1E38]/20 relative overflow-hidden flex flex-col justify-between h-full group ${
            compact 
                ? 'rounded-2xl p-3 sm:p-4 min-h-0' 
                : 'rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 min-h-[220px] min-[360px]:min-h-[250px]'
        }`}>
            {/* Ambient Background Gradient Circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#004BFA]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#004BFA]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle SVG Wave Background with Electric Sky Blue Line */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <svg viewBox="0 0 500 160" className="w-full h-full opacity-40" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="heroSummaryLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#004BFA" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#5B80FF" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#5B80FF" stopOpacity="0.95" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                        fill="none"
                        stroke="url(#heroSummaryLine)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="499" cy="24" r="3.5" fill="#5B80FF" opacity="1" className="animate-pulse" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                {/* 1. Üst Başlık */}
                <div className={`flex items-center justify-between gap-1.5 flex-wrap border-b border-white/10 ${compact ? 'pb-1.5' : 'pb-2.5'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0 ${compact ? 'w-6 h-6' : 'w-7 h-7'}`}>
                            <Wallet className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-white`} />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <h3 className={`clash-subtitle font-[325] text-[#F5F7FA] tracking-tight ${compact ? 'text-[11px] min-[360px]:text-xs' : 'text-[11px] min-[360px]:text-xs sm:text-[13px]'}`}>
                                Toplam Varlık Değeri
                            </h3>
                            {/* Bakiye Gizle / Göster */}
                            <button
                                onClick={() => setIsBalanceHidden(prev => !prev)}
                                title={isBalanceHidden ? "Bakiyeyi Göster" : "Bakiyeyi Gizle"}
                                className="p-1 rounded-md text-[#D6E4FF]/80 hover:text-white hover:bg-white/10 transition-colors"
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

                    {/* Sağ Üst Canlı Portföy Rozeti (%35/#0E1E38 & White Accent) */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004BFA] text-[#F5F7FA] font-medium shadow-sm shadow-[#004BFA]/30 clash-subtitle font-[325] shadow-xs ${compact ? 'text-[9px]' : 'text-[9px] min-[360px]:text-[10px] sm:text-[11px]'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Canlı Portföy</span>
                    </div>
                </div>

                {/* 2. Büyük Rakam ve Değişim Rozeti (Orta Bölüm) */}
                <div className={compact ? "py-1.5 my-auto" : "my-auto py-2"}>
                    <h2 className={`font-numbers font-normal text-white tracking-tight truncate leading-none ${
                        compact ? 'text-xl min-[360px]:text-2xl sm:text-3xl' : 'text-[22px] min-[320px]:text-[26px] min-[380px]:text-3xl sm:text-4xl lg:text-[40px] 2xl:text-[44px]'
                    }`}>
                        {isBalanceHidden ? "₺ ••••••••" : formatCurrency(totalValue)}
                    </h2>

                    {/* Değişim Rozeti */}
                    <div className={`flex items-center gap-2 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full clash-subtitle font-[325] shadow-xs bg-[#004BFA] text-[#F5F7FA] font-medium shadow-sm shadow-[#004BFA]/30 ${
                            compact ? 'text-[11px]' : 'text-xs'
                        }`}>
                            {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-[#0E1E38]" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                            <span className="font-numbers">{isPositive ? "+" : ""}%{Math.abs(profitRatio).toFixed(2)}</span>
                        </div>
                        <span className={`clash-desc font-[225] text-[#D6E4FF] ${compact ? 'text-[10px]' : 'text-xs'}`}>
                            (Toplam Net Getiri)
                        </span>
                    </div>
                </div>

                {/* 3. Alt Bilgi Şeridi */}
                <div className={`grid grid-cols-3 gap-1 min-[340px]:gap-2 border-t border-white/15 text-left ${compact ? 'pt-1.5' : 'pt-2.5'}`}>
                    <div>
                        <span className={`clash-desc font-[225] text-[#D6E4FF]/80 block ${compact ? 'text-[9px]' : 'text-[9px] min-[360px]:text-[10px] sm:text-[11px]'}`}>
                            <span className="hidden min-[340px]:inline">Toplam </span>Yatırım
                        </span>
                        <span className={`font-numbers font-normal text-white block truncate ${compact ? 'text-[10px] min-[360px]:text-xs mt-0.5' : 'text-[10px] min-[340px]:text-xs sm:text-[13px] 2xl:text-sm mt-0.5'}`}>
                            {isBalanceHidden ? "₺ ••••••" : formatCurrency(totalCost)}
                        </span>
                    </div>

                    <div>
                        <span className={`clash-desc font-[225] text-[#D6E4FF]/80 block ${compact ? 'text-[9px]' : 'text-[9px] min-[360px]:text-[10px] sm:text-[11px]'}`}>
                            <span className="hidden min-[340px]:inline">Toplam </span>Kar / Zarar
                        </span>
                        <span className={`clash-title font-normal text-white block truncate ${compact ? 'text-[10px] min-[360px]:text-xs mt-0.5' : 'text-[10px] min-[340px]:text-xs sm:text-[13px] 2xl:text-sm mt-0.5'}`}>
                            {isBalanceHidden
                                ? (isPositive ? "+₺ •••" : "-₺ •••")
                                : `${isPositive ? "+" : ""}${formatCurrency(totalProfit)}`}
                        </span>
                    </div>

                    <div>
                        <span className={`clash-desc font-[225] text-[#D6E4FF]/80 block ${compact ? 'text-[9px]' : 'text-[9px] min-[360px]:text-[10px] sm:text-[11px]'}`}>
                            <span className="hidden min-[340px]:inline">Portföy </span>Pozisyon
                        </span>
                        <span className={`clash-title font-normal text-white block truncate ${compact ? 'text-[10px] min-[360px]:text-xs mt-0.5' : 'text-[10px] min-[340px]:text-xs sm:text-[13px] 2xl:text-sm mt-0.5'}`}>
                            {effectiveAssets.length} Aktif Varlık
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
