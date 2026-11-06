"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, Loader2, TrendingUp, TrendingDown, Percent, ArrowRight, Sparkles, BarChart2 } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";

export function FinAiYesterdayReportWidget() {
    const { user, myAssets = [], prices = {}, isDataLoaded } = useUser();
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    const fetchReport = async (tf: 'weekly' | 'monthly' | 'all-time') => {
        setLoading(true);
        try {
            const baseUrl = user 
                ? `/api/finai-daily-report?userId=${user.id}&timeframe=${tf}` 
                : `/api/finai-daily-report?timeframe=${tf}`;
            const res = await fetch(baseUrl);
            const json = await res.json();
            if (json.success && json.data) {
                setReport(json.data);
            }
        } catch (e) {
            console.error("Failed to load FinAi report:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport(timeframe);
    }, [user?.id, effectiveAssets.length, timeframe]);

    const clientFallbackNarrative = useMemo(() => {
        let currentTotal = 0;
        let totalCost = 0;
        const assetGains: { name: string; gain: number }[] = [];

        effectiveAssets.forEach((asset: any) => {
            const symUpper = (asset.symbol || '').toUpperCase();
            const symClean = symUpper.replace(/\.IS$/, '');
            const price = effectivePrices[symUpper] ?? effectivePrices[symClean] ?? effectivePrices[`${symClean}.IS`] ?? asset.avgCost ?? 0;

            const val = price * asset.quantity;
            const cost = asset.avgCost * asset.quantity;
            const gain = val - cost;

            currentTotal += val;
            totalCost += cost;
            assetGains.push({ name: asset.symbol.replace(/\.IS$/, ''), gain });
        });

        const diffVal = currentTotal - totalCost;
        const diffPct = totalCost > 0 ? (diffVal / totalCost) * 100 : 0;
        const isPos = diffVal >= 0;

        assetGains.sort((a, b) => Math.abs(b.gain) - Math.abs(a.gain));
        const topDriver = assetGains[0]?.name || 'ana varlıklarınız';

        const absDiffStr = Math.abs(diffVal).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const absPctStr = Math.abs(diffPct).toFixed(2);
        const startStr = totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const endStr = currentTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `Son 7 günlük dönemde portföyünüzün toplam değeri ₺${startStr} seviyesinden ₺${endStr} seviyesine ${isPos ? 'yükseldi' : 'geriledi'}. Bu, ₺${absDiffStr} tutarında (${isPos ? '+' : '-'}%${absPctStr}) pozitif bir bakiye büyümesine karşılık geliyor. Süreçteki performansın en güçlü belirleyicisi ${topDriver} pozisyonunuz oldu.`;
    }, [effectiveAssets, effectivePrices, timeframe]);

    const isApiEmpty = !report || !report.narrativeText || report.narrativeText.includes("bulunmuyor");
    const narrativeToDisplay = isApiEmpty ? clientFallbackNarrative : (report?.narrativeText || clientFallbackNarrative);

    const displayDiffValue = (!isApiEmpty && report?.diffValue !== undefined) ? report.diffValue : (effectiveAssets.reduce((tot: number, a: any) => tot + (effectivePrices[a.symbol.toUpperCase()] || a.avgCost) * a.quantity, 0) - effectiveAssets.reduce((tot: number, a: any) => tot + a.avgCost * a.quantity, 0));
    const displayDiffPercent = (!isApiEmpty && report?.diffPercent !== undefined) ? report.diffPercent : (displayDiffValue / (effectiveAssets.reduce((tot: number, a: any) => tot + a.avgCost * a.quantity, 0) || 1)) * 100;
    const isPositive = displayDiffValue >= 0;

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group">
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0E1E38]/5 border border-[#0E1E38]/10 flex items-center justify-center text-[#0E1E38] shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#0E1E38]" />
                    </div>
                    <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#0E1E38] tracking-tight">
                        FinAi Portföy Raporu
                    </h3>
                </div>

                <span className="text-[10px] zodiak-subtitle font-[325] text-white bg-[#0E1E38] font-normal px-2.5 py-0.5 rounded-full shadow-xs">
                    Canlı Analiz
                </span>
            </div>

            {/* 2. Ana İçerik */}
            <div className="my-auto py-2">
                {loading && !narrativeToDisplay ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                        <Loader2 className="w-4 h-4 text-[#0E1E38] animate-spin" />
                        <span className="text-[11px] zodiak-desc font-[225] text-[#0E1E38]/60">Piyasa analizi hazırlanıyor...</span>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <h4 className="text-sm sm:text-[15px] zodiak-subtitle font-[325] text-[#0E1E38] tracking-tight leading-snug">
                            {isPositive
                                ? "Portföy Gelişim ve Büyüme Değerlendirmesi"
                                : "Piyasa Dinamikleri ve Portföy Dengesi"}
                        </h4>

                        <p className="text-xs zodiak-desc font-[225] text-[#0E1E38]/80 leading-relaxed line-clamp-4">
                            {narrativeToDisplay}
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Alt Aksiyon Linki */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                    href="/dashboard/portfolio"
                    className="text-xs zodiak-subtitle font-[325] text-[#0E1E38] hover:text-[#0E1E38]/80 transition-colors inline-flex items-center gap-1.5 group/link"
                >
                    <span>Detaylı portföy analizi</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>

                <span className="text-[10px] font-numbers font-normal px-2 py-0.5 rounded-md text-[#0E1E38] bg-[#0E1E38]/5 border border-[#0E1E38]/10">
                    {isPositive ? '+' : ''}%{displayDiffPercent.toFixed(1)}
                </span>
            </div>
        </div>
    );
}
