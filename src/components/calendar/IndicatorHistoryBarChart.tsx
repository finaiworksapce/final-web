"use client";

import { useMemo, useState } from "react";
import { HistoricalDataPoint } from "@/lib/indicator-history-data";

interface IndicatorHistoryBarChartProps {
    data: HistoricalDataPoint[];
    unit?: string;
    eventName: string;
}

export default function IndicatorHistoryBarChart({
    data,
    unit = "%",
    eventName
}: IndicatorHistoryBarChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // En az 4, en fazla 8 veri noktası alalım
    const displayData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.slice(-8);
    }, [data]);

    // Değerlerin min ve max aralığını belirle
    const { minValue, maxValue, hasNegative } = useMemo(() => {
        let min = 0;
        let max = 0;
        let neg = false;

        for (const pt of displayData) {
            const vals = [pt.actual, pt.forecast].filter(v => v !== null && v !== undefined) as number[];
            for (const v of vals) {
                if (v < min) min = v;
                if (v > max) max = v;
                if (v < 0) neg = true;
            }
        }

        // Marjin ekle
        if (min === 0 && max === 0) {
            max = 10;
        } else {
            const range = max - min;
            max = max + (range * 0.15 || 1);
            if (neg) min = min - (range * 0.15 || 1);
        }

        return { minValue: min, maxValue: max, hasNegative: neg };
    }, [displayData]);

    if (!displayData || displayData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-xs font-bold text-slate-400">
                Bu gösterge için henüz tarihsel geçmiş veri bulunmuyor.
            </div>
        );
    }

    const range = maxValue - minValue || 1;
    // Sıfır çizgisinin tabandan yüksekliği (%)
    const zeroYPercent = hasNegative ? ((0 - minValue) / range) * 100 : 0;

    return (
        <div className="w-full space-y-4 select-none">
            {/* Üst Lejant & Açıklama */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#00008B]">
                        <span className="w-3 h-3 rounded-sm bg-[#00008B]" />
                        <span>Açıklanan Veri</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-400">
                        <span className="w-3 h-3 rounded-sm bg-slate-300 border border-dashed border-slate-400" />
                        <span>Piyasa Beklentisi</span>
                    </div>
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                    Birim: <span className="text-[#00008B]">{unit}</span>
                </div>
            </div>

            {/* Sütun Grafik Alanı */}
            <div className="relative h-64 sm:h-72 w-full pt-8 pb-8 px-2 sm:px-4 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-end">
                {/* Arka plan referans çizgileri */}
                <div className="absolute inset-0 pt-8 pb-8 px-4 flex flex-col justify-between pointer-events-none opacity-40">
                    <div className="border-b border-dashed border-slate-300 w-full" />
                    <div className="border-b border-dashed border-slate-300 w-full" />
                    <div className="border-b border-dashed border-slate-300 w-full" />
                </div>

                {/* Sıfır çizgisi (negatif veri varsa) */}
                {hasNegative && (
                    <div
                        className="absolute left-0 right-0 border-b border-slate-400/70 pointer-events-none z-10"
                        style={{ bottom: `${zeroYPercent}%` }}
                    />
                )}

                {/* Sütun Grupları */}
                <div className="relative z-10 grid w-full grid-flow-col auto-cols-fr gap-2 sm:gap-4 h-full items-end">
                    {displayData.map((pt, idx) => {
                        const actualVal = pt.actual;
                        const forecastVal = pt.forecast;

                        // Yükseklik hesaplamaları
                        const actualHeight = actualVal !== null 
                            ? Math.max(4, Math.abs((actualVal / range) * 100)) 
                            : 0;
                        const forecastHeight = forecastVal !== null 
                            ? Math.max(4, Math.abs((forecastVal / range) * 100)) 
                            : 0;

                        const isHovered = hoveredIdx === idx;
                        const isActualAboveZero = (actualVal ?? 0) >= 0;
                        const isForecastAboveZero = (forecastVal ?? 0) >= 0;

                        return (
                            <div
                                key={pt.date || idx}
                                className="group relative flex flex-col items-center h-full justify-end cursor-pointer"
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Hover Tooltip Kartı */}
                                {isHovered && (
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#00008B] text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl z-30 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                                        <div className="text-blue-200 text-[10px] mb-0.5 border-b border-white/20 pb-0.5">
                                            {pt.label} {pt.period ? `(${pt.period})` : ""}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>Açıklanan:</span>
                                            <span className="text-white font-black">
                                                {actualVal !== null ? `${actualVal} ${unit}` : "—"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <span>Beklenen:</span>
                                            <span className="font-bold">
                                                {forecastVal !== null ? `${forecastVal} ${unit}` : "—"}
                                            </span>
                                        </div>
                                        {/* Tooltip oku */}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00008B] rotate-45" />
                                    </div>
                                )}

                                {/* Sütun Çifti (Yan Yana: Açıklanan ve Beklenti) */}
                                <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full h-full pb-1">
                                    {/* Açıklanan Veri Sütunu (Lacivert) */}
                                    <div
                                        className="w-3.5 sm:w-5 bg-[#00008B] rounded-t-sm group-hover:bg-blue-700 transition-all duration-200 relative shadow-xs"
                                        style={{ height: `${actualHeight}%` }}
                                    >
                                        {/* Sütun Üstü Değer (Hover veya Ekran Uygunsa) */}
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-[#00008B] opacity-0 group-hover:opacity-100 transition-opacity">
                                            {actualVal}
                                        </span>
                                    </div>

                                    {/* Beklenen Veri Sütunu (Açık Gri / Mavi) */}
                                    <div
                                        className="w-3.5 sm:w-5 bg-slate-300/90 border border-dashed border-slate-400 rounded-t-sm group-hover:bg-slate-400 transition-all duration-200 relative shadow-xs"
                                        style={{ height: `${forecastHeight}%` }}
                                    >
                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {forecastVal}
                                        </span>
                                    </div>
                                </div>

                                {/* Alt Etiket (Ay/Yıl) */}
                                <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight mt-1 transition-colors ${
                                    isHovered ? "text-[#00008B] font-black scale-105" : "text-slate-500"
                                }`}>
                                    {pt.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
