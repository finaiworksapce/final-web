"use client";

import { useMemo, useState } from "react";
import { PieChart, ChevronRight, Layers } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";

// 60-30-10 Uyumlu Dağılım Paleti
const DISTRIBUTION_COLORS = ["#040989", "#004BFA", "#5B80FF", "#02041A", "#8AA8FF"];

const TYPE_NAMES: Record<string, string> = {
    STOCK: "Hisse",
    FUND: "Fon",
    GOLD: "Altın",
    CASH: "Nakit",
    CRYPTO: "Kripto",
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(val);
};

export function TopAssetDistributionCard() {
    const { myAssets = [], prices = {}, isDataLoaded } = useUser();
    const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

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

    // Portföy dağılımı ve yüzde hesabı
    const { distributionItems, totalValue, activeCount } = useMemo(() => {
        let total = 0;
        const assetMap = new Map<string, { name: string; value: number; type: string }>();

        const activeAssets = effectiveAssets.filter((asset: any) => {
            const qty = Number(asset.quantity) || 0;
            if (qty <= 0) return false;
            const rawSymbol = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
            const cleanSymbol = rawSymbol.replace(/\.IS$/, '');
            const isCash = asset.type === 'CASH' || cleanSymbol === 'NAKİT' || cleanSymbol === 'TRY_CASH';
            const currentPrice = isCash
                ? (asset.avgCost || 1)
                : (effectivePrices[rawSymbol] ?? effectivePrices[cleanSymbol] ?? prices[`${cleanSymbol}.IS`] ?? asset.avgCost ?? 0);
            return (currentPrice * qty) > 0;
        });

        const distinctTypes = new Set(activeAssets.map((a: any) => {
            const sym = a.symbol ? a.symbol.toUpperCase().trim() : "";
            if (a.type === 'CASH' || sym === 'NAKİT' || sym === 'TRY_CASH') return 'CASH';
            return a.type || 'STOCK';
        }));
        const groupByClass = distinctTypes.size > 1;

        activeAssets.forEach((asset: any) => {
            const rawSymbol = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
            const cleanSymbol = rawSymbol.replace(/\.IS$/, '');
            const isCash = asset.type === 'CASH' || cleanSymbol === 'NAKİT' || cleanSymbol === 'TRY_CASH';
            const effectiveType = isCash ? 'CASH' : (asset.type || 'STOCK');
            const currentPrice = isCash
                ? (asset.avgCost || 1)
                : (effectivePrices[rawSymbol] ?? effectivePrices[cleanSymbol] ?? prices[`${cleanSymbol}.IS`] ?? asset.avgCost ?? 0);
            const val = currentPrice * asset.quantity;

            total += val;

            const groupKey = groupByClass
                ? (TYPE_NAMES[effectiveType] || effectiveType || cleanSymbol)
                : (isCash ? "Nakit" : cleanSymbol);

            if (assetMap.has(groupKey)) {
                assetMap.get(groupKey)!.value += val;
            } else {
                assetMap.set(groupKey, { name: groupKey, value: val, type: effectiveType });
            }
        });

        const sorted = Array.from(assetMap.values()).sort((a, b) => b.value - a.value);

        const items: { name: string; value: number; percentage: number; color: string }[] = [];
        let otherTotal = 0;

        sorted.forEach((item, index) => {
            if (index < 4) {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                items.push({
                    name: item.name,
                    value: item.value,
                    percentage,
                    color: DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]
                });
            } else {
                otherTotal += item.value;
            }
        });

        if (otherTotal > 0) {
            const percentage = total > 0 ? (otherTotal / total) * 100 : 0;
            items.push({
                name: "Diğer",
                value: otherTotal,
                percentage,
                color: DISTRIBUTION_COLORS[4]
            });
        }

        return {
            distributionItems: items,
            totalValue: total,
            activeCount: activeAssets.length
        };
    }, [effectiveAssets, effectivePrices]);

    const hasData = distributionItems.length > 0 && totalValue > 0;

    const RADIUS = 34;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    let cumulativeOffset = 0;

    const handleDonutMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!hasData) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;
        const norm = (angle / 360) * 100;

        let cumulativePct = 0;
        for (const item of distributionItems) {
            if (norm >= cumulativePct && norm < cumulativePct + item.percentage) {
                if (hoveredSymbol !== item.name) setHoveredSymbol(item.name);
                return;
            }
            cumulativePct += item.percentage;
        }
        const lastItem = distributionItems[distributionItems.length - 1];
        if (lastItem && hoveredSymbol !== lastItem.name) setHoveredSymbol(lastItem.name);
    };

    return (
        <div className="bg-white rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group">
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#D6E4FF]/30 border border-[#D6E4FF]/60 flex items-center justify-center text-[#040989] shrink-0">
                        <PieChart className="w-3.5 h-3.5 text-[#040989]" />
                    </div>
                    <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] tracking-tight">
                        Varlık Dağılımı
                    </h3>
                </div>

                <Link
                    href="/dashboard/portfolio?focus=distribution"
                    className="text-[#040989]/60 hover:text-[#040989] transition-colors p-0.5"
                    title="Portföy Dağılımını İncele"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* 2. Orta İçerik: Donut Grafik + Liste */}
            {hasData ? (
                <div className="flex items-center gap-2 min-[360px]:gap-3.5 my-auto py-1.5 min-[360px]:py-2">
                    {/* Donut Grafik */}
                    <div className="relative w-24 h-24 min-[360px]:w-28 min-[360px]:h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full transform -rotate-90 filter drop-shadow-xs cursor-pointer"
                            onMouseMove={handleDonutMouseMove}
                            onMouseLeave={() => setHoveredSymbol(null)}
                        >
                            {distributionItems.map((item) => {
                                const strokeLength = (item.percentage / 100) * CIRCUMFERENCE;
                                const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
                                const strokeDashoffset = -cumulativeOffset;
                                cumulativeOffset += strokeLength;

                                const isHovered = hoveredSymbol === item.name;

                                return (
                                    <circle
                                        key={item.name}
                                        cx="50"
                                        cy="50"
                                        r={RADIUS}
                                        fill="none"
                                        stroke={item.color}
                                        strokeWidth={isHovered ? 11 : 9}
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={strokeDashoffset}
                                        pointerEvents="none"
                                        style={{ transition: 'stroke-width 200ms ease-out' }}
                                    />
                                );
                            })}
                        </svg>

                        {/* Donut İçi Toplam */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
                            <span className="text-[10px] clash-desc font-[225] text-[#040989]/70 leading-tight">
                                Toplam
                            </span>
                            <span className="text-xs sm:text-[13px] font-numbers font-medium text-[#040989] tracking-tight mt-0.5 truncate max-w-[80px]">
                                {formatCurrency(totalValue)}
                            </span>
                        </div>
                    </div>

                    {/* Dağılım Listesi */}
                    <div className="flex-1 min-w-0 space-y-2 pl-1">
                        {distributionItems.map((item) => {
                            const isHovered = hoveredSymbol === item.name;
                            return (
                                <div
                                    key={item.name}
                                    onMouseEnter={() => setHoveredSymbol(item.name)}
                                    onMouseLeave={() => setHoveredSymbol(null)}
                                    className={`flex items-center justify-between gap-1.5 py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                                        isHovered ? "bg-[#D6E4FF]/30" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-xs clash-subtitle font-[325] text-[#040989] truncate flex-1">
                                            {item.name}
                                        </span>
                                    </div>

                                    <span className="text-xs font-numbers font-normal text-[#040989] tabular-nums ml-auto shrink-0">
                                        %{item.percentage.toFixed(1).replace('.', ',')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* Boş Varlık Durumu */
                <div className="flex flex-col items-center justify-center py-4 gap-1 text-center my-auto">
                    <div className="w-8 h-8 rounded-xl bg-[#D6E4FF]/30 border border-[#D6E4FF]/60 flex items-center justify-center text-[#040989]/60">
                        <Layers className="w-4 h-4" />
                    </div>
                    <p className="text-xs clash-subtitle font-[325] text-[#040989]">Henüz kayıtlı varlık yok</p>
                    <p className="text-[10px] clash-desc font-[225] text-[#040989]/60 max-w-[180px]">
                        Portföyünüze varlık eklediğinizde dağılım burada listelenecektir.
                    </p>
                </div>
            )}
        </div>
    );
}
