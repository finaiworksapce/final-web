"use client";

import { useMemo } from "react";
import { 
    BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine 
} from "recharts";
import { HistoricalDataPoint } from "@/lib/indicator-history-data";
import { 
    ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig 
} from "@/components/ui/chart";

interface IndicatorHistoryBarChartProps {
    data: HistoricalDataPoint[];
    unit?: string;
    eventName: string;
}

const chartConfig = {
    actual: {
        label: "Açıklanan Veri",
        color: "#00008B",
    },
    forecast: {
        label: "Piyasa Beklentisi",
        color: "#94a3b8",
    },
} satisfies ChartConfig;

export default function IndicatorHistoryBarChart({
    data,
    unit = "%",
    eventName,
}: IndicatorHistoryBarChartProps) {
    // Son 8 veri noktasını al
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.slice(-8).map((pt) => ({
            month: pt.label,
            period: pt.period || "",
            actual: pt.actual !== null && pt.actual !== undefined ? Number(pt.actual) : null,
            forecast: pt.forecast !== null && pt.forecast !== undefined ? Number(pt.forecast) : null,
            previous: pt.previous !== null && pt.previous !== undefined ? Number(pt.previous) : null,
            unit: pt.unit || unit,
        }));
    }, [data, unit]);

    // Negatif değer olup olmadığını ve otomatik min/max aralığını belirle
    const hasNegative = useMemo(() => {
        return chartData.some((d) => (d.actual !== null && d.actual < 0) || (d.forecast !== null && d.forecast < 0));
    }, [chartData]);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-xs font-bold text-slate-400">
                Bu gösterge için henüz tarihsel geçmiş veri bulunmuyor.
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 select-none">
            {/* Üst Lejant & Birim Bilgisi */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 font-bold text-[#00008B]">
                        <span className="w-3.5 h-3.5 rounded-sm bg-[#00008B] shadow-xs inline-block" />
                        <span>Açıklanan Veri</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-500">
                        <span className="w-3.5 h-3.5 rounded-sm bg-slate-300 border border-dashed border-slate-400 shadow-xs inline-block" />
                        <span>Piyasa Beklentisi</span>
                    </div>
                </div>
                <div className="text-[11px] font-bold text-slate-400">
                    Birim: <span className="text-[#00008B] font-extrabold">{unit}</span>
                </div>
            </div>

            {/* Recharts BarChart Alanı */}
            <div className="w-full h-72 sm:h-80 pt-4 pb-2 px-2 sm:px-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
                <ChartContainer config={chartConfig} className="w-full h-full aspect-auto">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ top: 16, right: 12, left: -16, bottom: 4 }}
                        barGap={6}
                        barCategoryGap="24%"
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                        
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={{ stroke: "#cbd5e1" }}
                            tickMargin={8}
                            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                            tickFormatter={(value: any) => `${value}`}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                            domain={['auto', 'auto']}
                            tickFormatter={(value: any) => `${value}`}
                        />

                        {hasNegative && (
                            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} />
                        )}

                        <ChartTooltip
                            cursor={{ fill: "rgba(0, 0, 139, 0.04)" }}
                            content={
                                <ChartTooltipContent
                                    className="min-w-44 gap-2 border border-slate-200 bg-white/95 backdrop-blur-sm shadow-xl p-3 rounded-xl"
                                    labelFormatter={(val: any, payload: any) => {
                                        const period = payload?.[0]?.payload?.period;
                                        return (
                                            <div className="border-b border-slate-100 pb-1.5 mb-1 flex items-center justify-between">
                                                <span className="text-xs font-black text-[#00008B]">
                                                    {val} {period ? `(${period})` : ""}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {unit}
                                                </span>
                                            </div>
                                        );
                                    }}
                                    formatter={(value: any, name: any) => {
                                        const isActual = name === "actual";
                                        return (
                                            <div className="flex w-full items-center justify-between gap-3 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span 
                                                        className="w-2.5 h-2.5 rounded-xs shrink-0" 
                                                        style={{ 
                                                            backgroundColor: isActual ? "#00008B" : "#94a3b8",
                                                            border: isActual ? "none" : "1px dashed #64748b"
                                                        }} 
                                                    />
                                                    <span className={isActual ? "text-[#00008B] font-bold" : "text-slate-500 font-medium"}>
                                                        {isActual ? "Açıklanan" : "Beklenen"}
                                                    </span>
                                                </div>
                                                <span className={`font-mono font-bold ${isActual ? "text-[#00008B]" : "text-slate-700"}`}>
                                                    {value !== null && value !== undefined ? `${value} ${unit}` : "—"}
                                                </span>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />

                        {/* Açıklanan Veri Sütunu: Kurumsal Lacivert (#00008B) */}
                        <Bar
                            dataKey="actual"
                            name="actual"
                            fill="#00008B"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                        />

                        {/* Beklenen Veri Sütunu: Nötr Gri (#94a3b8) */}
                        <Bar
                            dataKey="forecast"
                            name="forecast"
                            fill="#cbd5e1"
                            stroke="#94a3b8"
                            strokeDasharray="2 2"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
}
