"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, Loader2, TrendingUp, TrendingDown, Percent, ArrowRight, Compass, BarChart2 } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";

function renderFormattedNarrative(text: string) {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-semibold text-[#040989]">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

export function FinAiYesterdayReportWidget() {
    const { user, userName, email: userEmail, myAssets = [], prices = {}, isDataLoaded, isAuthenticated } = useUser();
    const [timeframe] = useState<'weekly' | 'monthly' | 'all-time'>('monthly');
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

    const effectiveAssets = isAuthenticated ? (myAssets || []) : (myAssets && myAssets.length > 0 ? myAssets : sampleAssets);
    const effectivePrices = (prices && Object.keys(prices).length > 0) ? prices : (isAuthenticated ? {} : samplePrices);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const encodedName = encodeURIComponent(userName || userEmail?.split('@')[0] || '');
            const baseUrl = user 
                ? `/api/finai-daily-report?userId=${user.id}&timeframe=monthly&userName=${encodedName}` 
                : `/api/finai-daily-report?timeframe=monthly&userName=${encodedName}`;
            const res = await fetch(baseUrl);
            const json = await res.json();
            if (json.success && json.data) {
                setReport(json.data);
            }
        } catch (e) {
            console.error("Failed to load FinAi monthly report:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [user?.id, userName, effectiveAssets.length]);

    const clientFallbackNarrative = useMemo(() => {
        if (!effectiveAssets || effectiveAssets.length === 0) {
            return "Portföyünüzde henüz kayıtlı aktif bir varlık bulunmuyor. Varlık ekledikten sonra FinAi aylık piyasa korelasyonu ve portföy gelişim raporunuz anlık olarak burada üretilecektir.";
        }

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

        return `Bu ayki dönemde portföyünüzün toplam değeri ₺${startStr} seviyesinden ₺${endStr} seviyesine ${isPos ? 'yükseldi' : 'geriledi'}. Bu, ₺${absDiffStr} tutarında (${isPos ? '+' : '-'}%${absPctStr}) bir bakiye değişimine karşılık geliyor. Süreçteki performansın en güçlü belirleyicisi ${topDriver} pozisyonunuz oldu.`;
    }, [effectiveAssets, effectivePrices]);

    const isApiEmpty = !report || !report.narrativeText || report.narrativeText.includes("bulunmuyor");
    const rawNarrative = isApiEmpty ? clientFallbackNarrative : (report?.narrativeText || clientFallbackNarrative);

    // "Değerli Bey" gibi jenerik hitap hatalarını temizleme
    const narrativeToDisplay = useMemo(() => {
        if (!rawNarrative) return "";
        let txt = rawNarrative;
        if (txt.includes("Değerli Bey,")) {
            const properName = userName ? `${userName.split(' ')[0]} Bey,` : "Değerli Yatırımcımız,";
            txt = txt.replace(/Değerli Bey,/g, properName);
        }
        return txt;
    }, [rawNarrative, userName]);

    const displayDiffValue = (!isApiEmpty && report?.diffValue !== undefined) ? report.diffValue : (effectiveAssets.reduce((tot: number, a: any) => tot + (effectivePrices[a.symbol.toUpperCase()] || a.avgCost) * a.quantity, 0) - effectiveAssets.reduce((tot: number, a: any) => tot + a.avgCost * a.quantity, 0));
    const displayDiffPercent = (!isApiEmpty && report?.diffPercent !== undefined) ? report.diffPercent : (displayDiffValue / (effectiveAssets.reduce((tot: number, a: any) => tot + a.avgCost * a.quantity, 0) || 1)) * 100;
    const isPositive = displayDiffValue >= 0;

    const periodLabel = useMemo(() => {
        if (report?.monthlyReport?.period?.monthName) {
            return `${report.monthlyReport.period.monthName} ${report.monthlyReport.period.year || ''}`.trim();
        }
        return new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    }, [report]);

    return (
        <Link
            href="/dashboard/report"
            className="bg-white rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group cursor-pointer border border-[#D6E4FF]/40 hover:border-[#004BFA]/40 block text-left"
            title="Detaylı aylık portföy raporunu inceleyin"
        >
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#D6E4FF]/30 border border-[#D6E4FF]/60 flex items-center justify-center text-[#040989] shrink-0">
                        <Compass className="w-3.5 h-3.5 text-[#040989]" />
                    </div>
                    <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] tracking-tight">
                        Aylık Özet Rapor
                    </h3>
                </div>

                <span className="text-[10px] clash-subtitle font-[325] text-[#040989] bg-[#D6E4FF]/35 border border-[#D6E4FF]/60 font-normal px-2.5 py-0.5 rounded-full capitalize">
                    {periodLabel}
                </span>
            </div>

            {/* 2. Ana İçerik */}
            <div className="my-auto py-2">
                {loading && !narrativeToDisplay ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                        <Loader2 className="w-4 h-4 text-[#040989] animate-spin" />
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/60">Aylık analiz hazırlanıyor...</span>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <h4 className="text-xs min-[360px]:text-sm sm:text-[15px] clash-subtitle font-[325] text-[#040989] tracking-tight leading-snug group-hover:text-[#004BFA] transition-colors">
                            {isPositive
                                ? "Portföy Gelişim ve Büyüme Değerlendirmesi"
                                : "Piyasa Dinamikleri ve Portföy Dengesi"}
                        </h4>

                        <p className="text-[11px] min-[360px]:text-xs clash-desc font-[225] text-[#040989]/80 leading-relaxed line-clamp-3 min-[360px]:line-clamp-4 xl:line-clamp-5">
                            {renderFormattedNarrative(narrativeToDisplay)}
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Alt Aksiyon Linki */}
            <div className="pt-2 border-t border-[#D6E4FF]/50 flex items-center justify-between">
                <div className="text-xs clash-subtitle font-[325] text-[#040989] group-hover:text-[#004BFA] transition-colors inline-flex items-center gap-1.5">
                    <span>Aylık özeti incele</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>

                <span className={`text-[10px] font-numbers font-medium px-2 py-0.5 rounded-md ${
                    isPositive 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                        : 'text-rose-700 bg-rose-50 border border-rose-200'
                }`}>
                    {isPositive ? '+' : ''}%{displayDiffPercent.toFixed(1)}
                </span>
            </div>
        </Link>
    );
}
