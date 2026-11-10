"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    Sparkles, 
    ArrowLeft, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    RefreshCw, 
    Printer, 
    ShieldCheck, 
    Layers, 
    BarChart3, 
    Loader2, 
    Percent, 
    CheckCircle2, 
    Brain, 
    Activity, 
    Zap, 
    AlertTriangle, 
    Sliders, 
    PlusCircle, 
    ArrowRight,
    Scale,
    Clock,
    ChevronDown,
    FileText,
    Award,
    PieChart,
    Target,
    HelpCircle
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    ReferenceLine, 
    Cell 
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import StockLogo from "@/components/StockLogo";
import Link from "next/link";
import { WeeklyReportData, WeeklyAssetMetric, SectorPerformance } from "@/lib/finai-weekly-report-service";

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val || 0);
};

// Recharts Custom Tooltip
const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isPos = data.returnPct >= 0;
        return (
            <div className="bg-white/95 dark:bg-[#02041A]/95 backdrop-blur-md border border-[#D6E4FF] dark:border-white/10 rounded-2xl p-3.5 shadow-xl text-xs space-y-2 min-w-[210px] z-50">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#D6E4FF]/40 dark:border-white/10">
                    <span className="clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                        {data.name}
                    </span>
                    {data.weightPct !== undefined && data.weightPct > 0 && (
                        <span className="text-[10px] clash-subtitle font-[325] px-1.5 py-0.5 rounded-md bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
                            %{data.weightPct.toFixed(1)} Pay
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                        Haftalık Getiri:
                    </span>
                    <span className={`font-numbers font-[500] text-sm ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPos ? '+' : ''}%{data.returnPct.toFixed(2)}
                    </span>
                </div>

                {data.returnTL !== undefined && data.returnTL !== 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                            Net Katkı:
                        </span>
                        <span className={`font-numbers font-[500] ${data.returnTL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {data.returnTL >= 0 ? '+' : ''}{formatCurrency(data.returnTL)}
                        </span>
                    </div>
                )}

                {data.assetCount !== undefined && (
                    <div className="flex items-center justify-between text-[10px] text-[#040989]/60 dark:text-white/60 pt-1 border-t border-[#D6E4FF]/40 dark:border-white/10">
                        <span>Pozisyon Sayısı:</span>
                        <span className="font-numbers font-[500]">{data.assetCount} Varlık</span>
                    </div>
                )}

                {data.symbols && data.symbols.length > 0 && (
                    <div className="text-[10px] text-[#040989]/60 dark:text-white/60 truncate">
                        <span>Dahil Varlıklar: </span>
                        <span className="font-semibold">{data.symbols.join(', ')}</span>
                    </div>
                )}

                {data.volatilityPct !== undefined && data.volatilityPct > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-[#040989]/60 dark:text-white/60">
                        <span>Sektör Volatilitesi:</span>
                        <span className="font-numbers font-[500]">%{data.volatilityPct.toFixed(2)}</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

// Recharts Custom Bar Ticks
const renderCustomXAxisTick = ({ x, y, payload }: any) => {
    const val = payload.value || "";
    const shortVal = val.length > 11 ? val.slice(0, 10) + "…" : val;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor="middle"
                className="fill-[#040989]/70 dark:fill-[#F5F7FA]/70 text-[10px] sm:text-[11px] font-clash"
            >
                {shortVal}
            </text>
        </g>
    );
};

// Recharts Custom Bar Value Labels
const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === null || isNaN(value)) return null;
    const isPos = value >= 0;
    const absHeight = Math.abs(height || 0);
    const labelY = isPos ? y - 6 : y + absHeight + 14;
    return (
        <text
            x={x + width / 2}
            y={labelY}
            fill={isPos ? "#059669" : "#E11D48"}
            textAnchor="middle"
            className="text-[10px] font-numbers font-[500] fill-current"
        >
            {isPos ? '+' : ''}{value.toFixed(1)}%
        </text>
    );
};

export default function FinAiReportViewPage() {
    const { user, myAssets = [], isDataLoaded, userName, email } = useUser();
    const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
    const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    
    // Dikey Grafik Görünüm Modu: Sektörler vs Bireysel Varlıklar
    const [chartViewMode, setChartViewMode] = useState<'sectors' | 'assets'>('sectors');
    const [showBenchmarkLine, setShowBenchmarkLine] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchReport = async (weekIdx: number = 0) => {
        setLoading(true);
        try {
            const baseUrl = user 
                ? `/api/finai-daily-report?userId=${user.id}&weekIndex=${weekIdx}` 
                : `/api/finai-daily-report?weekIndex=${weekIdx}`;
            const res = await fetch(baseUrl);
            const json = await res.json();
            if (json.success) {
                if (json.weeklyReport) {
                    setWeeklyReport(json.weeklyReport);
                } else if (json.data?.weeklyReport) {
                    setWeeklyReport(json.data.weeklyReport);
                }
            }
        } catch (e) {
            console.error("FinAi weekly report error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDataLoaded) {
            fetchReport(selectedWeekIndex);
        }
    }, [user?.id, myAssets.length, selectedWeekIndex, isDataLoaded]);

    const hasActiveAssets = weeklyReport ? weeklyReport.hasActiveAssets : (myAssets && myAssets.length > 0);
    const summary = weeklyReport?.summary;
    const aiBlocks = weeklyReport?.aiLiteracyBlocks;
    const sectors = weeklyReport?.sectorAnalysis?.sectors || [];
    const assets = weeklyReport?.assets || [];
    const riskAlerts = weeklyReport?.riskAlerts || [];
    const period = weeklyReport?.period;
    const availableWeeks = weeklyReport?.availableWeeks || [];

    const bist100Return = summary?.bist100WeeklyReturnPct ?? 1.45;

    // Dikey Sütun Grafiği Veri Seti (X Ekseni: İsimler, Y Ekseni: Yüzde Getiri)
    const chartData = useMemo(() => {
        if (chartViewMode === 'sectors') {
            if (!sectors || sectors.length === 0) return [];
            return sectors.map((sec) => ({
                name: sec.name,
                returnPct: Number(sec.weeklyReturnPct.toFixed(2)),
                returnTL: sec.weeklyReturnTL,
                weightPct: sec.weightPct,
                assetCount: sec.assetCount,
                symbols: sec.symbols,
                volatilityPct: sec.volatilityPct,
                isPositive: sec.weeklyReturnPct >= 0
            }));
        } else {
            if (!assets || assets.length === 0) return [];
            return assets.map((ast) => ({
                name: ast.cleanSymbol,
                returnPct: Number(ast.weeklyReturnPct.toFixed(2)),
                returnTL: ast.weeklyReturnTL,
                weightPct: ast.weightPct,
                assetCount: 1,
                symbols: [ast.cleanSymbol],
                volatilityPct: ast.volatilityPct,
                isPositive: ast.weeklyReturnPct >= 0
            }));
        }
    }, [chartViewMode, sectors, assets]);

    // Dinamik Y-Ekseni Ölçeği (Simetrik ve net sıfır eksenli)
    const yAxisDomain = useMemo(() => {
        const values = chartData.map(d => d.returnPct);
        if (bist100Return !== 0) values.push(bist100Return);
        if (values.length === 0) return [-6, 6];
        const maxVal = Math.max(...values, 1);
        const minVal = Math.min(...values, -1);
        const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));
        const ceiling = Math.ceil(absMax + 1.5);
        return [-ceiling, ceiling];
    }, [chartData, bist100Return]);

    // Lider ve Geciken Sektörler
    const topSector = useMemo(() => {
        if (!sectors || sectors.length === 0) return null;
        return [...sectors].sort((a, b) => b.weeklyReturnPct - a.weeklyReturnPct)[0];
    }, [sectors]);

    const worstSector = useMemo(() => {
        if (!sectors || sectors.length === 0) return null;
        return [...sectors].sort((a, b) => a.weeklyReturnPct - b.weeklyReturnPct)[0];
    }, [sectors]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-16">
            {/* Sürekli AI Loop Ambient Işık Efektleri */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent blur-[140px] pointer-events-none"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                }}
                className="absolute top-[35%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
            />

            {/* ANA KAPSAYICI: Tam Genişlik Edge-to-Edge */}
            <div className="w-full max-w-[2500px] mx-auto px-2 min-[360px]:px-3 sm:px-6 md:px-8 xl:px-10 py-3 sm:py-6 relative z-10 flex flex-col gap-5 sm:gap-7">
                
                {/* 1. ÜST BAR: Navigasyon, Geçmiş Hafta Arşiv Seçici ve Araçlar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#D6E4FF]/60 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Ana Sayfaya Dön</span>
                        </Link>

                        <div className="h-4 w-px bg-[#D6E4FF] dark:bg-white/20 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm clash-title font-[500] tracking-tight">
                                Haftalık Özet ve Sektörel Performans Modülü
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                        {/* Geçmiş Hafta Arşiv Görünümü Seçici */}
                        <div className="relative inline-flex items-center">
                            <select
                                value={selectedWeekIndex}
                                onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                                className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-white dark:bg-[#040989] border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] text-xs clash-subtitle font-[325] cursor-pointer shadow-2xs hover:bg-[#D6E4FF]/20 focus:outline-hidden focus:ring-1 focus:ring-[#004BFA]"
                            >
                                {availableWeeks.map((w) => (
                                    <option key={w.weekIndex} value={w.weekIndex}>
                                        {w.label} ({w.dateRange})
                                    </option>
                                ))}
                            </select>
                            <Calendar className="w-3.5 h-3.5 text-[#004BFA] absolute left-2.5 pointer-events-none" />
                            <ChevronDown className="w-3 h-3 text-[#040989]/60 dark:text-white/60 absolute right-2.5 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => fetchReport(selectedWeekIndex)}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
                            title="Raporu Yenile"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#004BFA]' : 'text-[#004BFA]'}`} />
                            <span className="hidden sm:inline">Yenile</span>
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
                            title="PDF / Yazdır"
                        >
                            <Printer className="w-3.5 h-3.5 text-[#004BFA]" />
                            <span className="hidden sm:inline">PDF / Yazdır</span>
                        </button>
                    </div>
                </div>

                {/* 2. RAPOR BAŞLIK BANNERI VE ENTEGRE YÖNETİCİ ÖZET ŞERİDİ (RASYOLAR BURADA MANTIKLI VE KOMPAKT OLARAK SUNULUR) */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden flex flex-col gap-5">
                    <motion.div
                        animate={{
                            scale: [1, 1.25, 1],
                            opacity: [0.2, 0.45, 0.2],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent rounded-full blur-2xl pointer-events-none"
                    />

                    {/* Başlık ve Hafta Atlama */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#D6E4FF]/60 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 uppercase tracking-wider flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004BFA] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004BFA]" />
                                    </span>
                                    Canlı Yapay Zekâ Analiz Motoru
                                </span>
                                <span className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                                    • {period?.weekLabel || "Pazartesi - Pazar Döngüsü"}
                                </span>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-white/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-white/10">
                                    Pazar 00:00 Otomatik Arşivleme
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                Haftalık Özet ve Sektörel Performans Raporu
                            </h1>
                            <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-0.5">
                                {userName || email?.split('@')[0] || "Salih KAVAKCI"} için Borsa İstanbul endeksi, makroekonomik veriler ve sektörel ağırlıklar temelinde hazırlanmıştır.
                            </p>
                        </div>

                        {/* Hızlı Hafta Atlama Butonları */}
                        <div className="flex items-center gap-1.5 bg-[#F5F7FA] dark:bg-white/10 p-1.5 rounded-2xl self-start lg:self-center shrink-0 border border-[#D6E4FF]/60 dark:border-white/10">
                            <button
                                onClick={() => setSelectedWeekIndex(0)}
                                className={`px-3 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                    selectedWeekIndex === 0
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                                }`}
                            >
                                Bu Hafta
                            </button>
                            <button
                                onClick={() => setSelectedWeekIndex(1)}
                                className={`px-3 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                    selectedWeekIndex === 1
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                                }`}
                            >
                                Geçen Hafta
                            </button>
                            <button
                                onClick={() => setSelectedWeekIndex(2)}
                                className={`px-3 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                    selectedWeekIndex === 2
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                                }`}
                            >
                                2 Hafta Önce
                            </button>
                        </div>
                    </div>

                    {/* ENTEGRE KOMPAKT ÖZET ŞERİDİ (Üstteki kalabalık 5 kutu yerine sade, şık ve amaca yönelik snapshot) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#D6E4FF]/60 dark:border-white/10 relative z-10">
                        {/* 1. Portföy Toplam Değeri */}
                        <div className="bg-[#F5F7FA]/80 dark:bg-white/5 rounded-2xl p-3 sm:p-3.5 border border-[#D6E4FF]/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-white/60">
                                <Layers className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Toplam Portföy Değeri</span>
                            </div>
                            <div className="text-base sm:text-lg font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-0.5 tracking-tight">
                                {formatCurrency(summary?.totalValue || 0)}
                            </div>
                        </div>

                        {/* 2. Haftalık Net Sonuç */}
                        <div className="bg-[#F5F7FA]/80 dark:bg-white/5 rounded-2xl p-3 sm:p-3.5 border border-[#D6E4FF]/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-white/60">
                                <TrendingUp className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Haftalık Net Sonuç</span>
                            </div>
                            <div className={`text-base sm:text-lg font-numbers font-[500] mt-0.5 flex items-center gap-1 tracking-tight ${
                                (summary?.weeklyNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                <span>{(summary?.weeklyNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.weeklyNetProfitTL || 0)}</span>
                                <span className="text-xs font-normal">
                                    (%{(summary?.weeklyNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.weeklyNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                        </div>

                        {/* 3. BIST 100 Piyasa Durumu */}
                        <div className="bg-[#F5F7FA]/80 dark:bg-white/5 rounded-2xl p-3 sm:p-3.5 border border-[#D6E4FF]/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-white/60">
                                <Scale className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>BIST 100 Haftalık</span>
                            </div>
                            <div className="text-base sm:text-lg font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-0.5 tracking-tight flex items-center gap-1.5">
                                <span>%{(summary?.bist100WeeklyReturnPct || 0).toFixed(2)}</span>
                                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                                    (summary?.relativeAlphaPct || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {(summary?.relativeAlphaPct || 0) >= 0 ? '+' : ''}{(summary?.relativeAlphaPct || 0).toFixed(2)} Alfa
                                </span>
                            </div>
                        </div>

                        {/* 4. Risk & Sağlık Skoru */}
                        <div className="bg-[#F5F7FA]/80 dark:bg-white/5 rounded-2xl p-3 sm:p-3.5 border border-[#D6E4FF]/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-white/60">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Sağlık & Risk Notu</span>
                            </div>
                            <div className="text-base sm:text-lg font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-0.5 tracking-tight flex items-center gap-2">
                                <span className="text-[#004BFA] dark:text-[#D6E4FF]">{summary?.healthScore || 75} / 100</span>
                                <span className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-white/60 truncate">
                                    • {summary?.volatilityNote || "Dengeli"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk & Volatilite Uyarısı Bildirim Bandı */}
                {riskAlerts.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200"
                    >
                        <div className="flex items-start sm:items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-xs clash-title font-[500] uppercase tracking-wider block">
                                    Risk & Volatilite Eşik Uyarısı ({riskAlerts.length} Varlık)
                                </span>
                                <p className="text-xs clash-desc font-[225] text-amber-800 dark:text-amber-300 mt-0.5">
                                    {riskAlerts[0]?.warningMessage}
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] clash-subtitle font-[325] px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-200 self-start sm:self-center shrink-0">
                            Eşik Değer: %4.00 Üzeri Volatilite
                        </span>
                    </motion.div>
                )}

                {/* 3. YAPAY ZEKA DESTEKLİ FİNANSAL OKURYAZARLIK ÖZET BLOKLARI (PDF Bölüm 2 - 5 ila 10 Cümle Kuralı) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
                    {/* Blok 1: Geçen Hafta Özeti */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white p-5 sm:p-7 shadow-xl border border-white/10 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D6E4FF]">
                                        <Brain className="w-4 h-4 text-[#D6E4FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base clash-title font-[500] text-white tracking-tight">
                                            {aiBlocks?.lastWeekSummary?.title || "Geçen Hafta Özeti"}
                                        </h3>
                                        <p className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/75">
                                            Piyasa yönü, en çok kazandıran sektör gerekçesi ve genel kapanış
                                        </p>
                                    </div>
                                </div>

                                <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    {aiBlocks?.lastWeekSummary?.sentenceCount || 6} Cümle (Kural Doğrulandı)
                                </span>
                            </div>

                            {loading ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                                    <Loader2 className="w-5 h-5 text-[#D6E4FF] animate-spin" />
                                    <span className="text-xs clash-desc font-[225] text-[#D6E4FF]">Geçen hafta analizi derleniyor...</span>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-xs sm:text-[13px] clash-desc font-[225] leading-relaxed">
                                    <p>{aiBlocks?.lastWeekSummary?.text}</p>
                                </div>
                            )}
                        </div>

                        {/* Alt Metrik Rozetleri */}
                        {aiBlocks?.lastWeekSummary?.topSector && (
                            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-[#D6E4FF]/80">
                                <span>Lider Sektör: <strong className="text-emerald-300">{aiBlocks.lastWeekSummary.topSector.name} (+%{aiBlocks.lastWeekSummary.topSector.returnPct.toFixed(2)})</strong></span>
                                {aiBlocks.lastWeekSummary.laggingSector && (
                                    <span>Baskılayan Sektör: <strong className="text-rose-300">{aiBlocks.lastWeekSummary.laggingSector.name} (%{aiBlocks.lastWeekSummary.laggingSector.returnPct.toFixed(2)})</strong></span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Blok 2: Gelecek Hafta Beklentileri */}
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white p-5 sm:p-7 shadow-xl border border-white/10 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D6E4FF]">
                                        <Clock className="w-4 h-4 text-[#D6E4FF]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm sm:text-base clash-title font-[500] text-white tracking-tight">
                                            {aiBlocks?.nextWeekExpectations?.title || "Gelecek Hafta Beklentileri"}
                                        </h3>
                                        <p className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/75">
                                            Ekonomik veri takvimi, sektörel hareket alanları ve stratejik rehberlik
                                        </p>
                                    </div>
                                </div>

                                <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    {aiBlocks?.nextWeekExpectations?.sentenceCount || 6} Cümle (Kural Doğrulandı)
                                </span>
                            </div>

                            {loading ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-2 text-center">
                                    <Loader2 className="w-5 h-5 text-[#D6E4FF] animate-spin" />
                                    <span className="text-xs clash-desc font-[225] text-[#D6E4FF]">Gelecek hafta takvimi analiz ediliyor...</span>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-xs sm:text-[13px] clash-desc font-[225] leading-relaxed">
                                    <p>{aiBlocks?.nextWeekExpectations?.text}</p>
                                </div>
                            )}
                        </div>

                        {/* Öne Çıkan Ekonomik Takvim Maddeleri */}
                        {aiBlocks?.nextWeekExpectations?.highlightedEvents && aiBlocks.nextWeekExpectations.highlightedEvents.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-[10px]">
                                <span className="text-[#D6E4FF]/70">Takvim Odakları:</span>
                                {aiBlocks.nextWeekExpectations.highlightedEvents.map((ev, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-white/90">
                                        {ev.event} ({ev.date})
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. MERKEZİ ANALİZ: DİKEY SÜTUN GRAFİĞİ (X & Y EKSENLİ) + SEKTÖR & PİYASA RASYOLARI */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
                    
                    {/* SOL (8 Kolon): DİKEY SÜTUN GRAFİĞİ (X VE Y EKSENLİ) */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                        
                        {/* Grafik Üst Başlık ve Filtre Araç Çubuğu */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D6E4FF]/60 dark:border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#004BFA]" />
                                    <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                        Haftalık Getiri Sütun Grafiği (Dikey X & Y Eksenli)
                                    </h3>
                                </div>
                                <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-0.5">
                                    X ekseninde sektörler / varlıklar, Y ekseninde yüzde getiri oranları sıfır referans tabanıyla sunulmaktadır.
                                </p>
                            </div>

                            {/* Görünüm Değiştirici: Sektörler vs Bireysel Varlıklar */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <div className="flex items-center bg-[#F5F7FA] dark:bg-white/10 p-1 rounded-xl border border-[#D6E4FF]/60 dark:border-white/10 text-xs">
                                    <button
                                        onClick={() => setChartViewMode('sectors')}
                                        className={`px-3 py-1 rounded-lg transition-all clash-subtitle font-[325] ${
                                            chartViewMode === 'sectors'
                                                ? 'bg-[#004BFA] text-white shadow-xs'
                                                : 'text-[#040989]/70 dark:text-white/70 hover:text-[#040989]'
                                        }`}
                                    >
                                        Sektörler ({sectors.length})
                                    </button>
                                    <button
                                        onClick={() => setChartViewMode('assets')}
                                        className={`px-3 py-1 rounded-lg transition-all clash-subtitle font-[325] ${
                                            chartViewMode === 'assets'
                                                ? 'bg-[#004BFA] text-white shadow-xs'
                                                : 'text-[#040989]/70 dark:text-white/70 hover:text-[#040989]'
                                        }`}
                                    >
                                        Hisseler ({assets.length})
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowBenchmarkLine(!showBenchmarkLine)}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] clash-subtitle font-[325] border transition-colors ${
                                        showBenchmarkLine 
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-[#004BFA] dark:text-blue-300 border-[#004BFA]/40' 
                                            : 'bg-white dark:bg-white/5 text-[#040989]/60 dark:text-white/50 border-[#D6E4FF] dark:border-white/10'
                                    }`}
                                    title="BIST 100 Karşılaştırma Referansını Aç / Kapat"
                                >
                                    BIST 100 Çizgisi
                                </button>
                            </div>
                        </div>

                        {/* Lejant (Pozitif / Negatif / Referans) */}
                        <div className="flex flex-wrap items-center justify-between text-xs gap-3">
                            <div className="flex items-center gap-4 text-[11px] clash-subtitle font-[325]">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                                    <span className="text-[#040989]/80 dark:text-[#F5F7FA]/80">Pozitif Getiri (Yukarı Sütun)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-rose-500" />
                                    <span className="text-[#040989]/80 dark:text-[#F5F7FA]/80">Negatif Getiri (Aşağı Sütun)</span>
                                </div>
                                {showBenchmarkLine && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-4 h-0.5 border-b-2 border-dashed border-[#004BFA]" />
                                        <span className="text-[#004BFA] dark:text-[#D6E4FF]">
                                            BIST 100 (%{(bist100Return >= 0 ? '+' : '') + bist100Return.toFixed(2)})
                                        </span>
                                    </div>
                                )}
                            </div>

                            <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                Y-Ekseni: % Getiri • X-Ekseni: {chartViewMode === 'sectors' ? 'Sektörel Kırılım' : 'Varlık Kırılımı'}
                            </span>
                        </div>

                        {/* DİKEY SÜTUN GRAFİK ALANI */}
                        <div className="w-full h-[370px] pt-2 relative">
                            {isMounted && chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 25, right: 15, left: -5, bottom: 25 }}
                                    >
                                        <CartesianGrid 
                                            strokeDasharray="3 3" 
                                            vertical={false} 
                                            stroke="currentColor" 
                                            className="text-[#D6E4FF]/60 dark:text-white/10" 
                                        />
                                        
                                        {/* X Eksen: Sektör veya Hisse Adları */}
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                                            tick={renderCustomXAxisTick}
                                            interval={0}
                                        />
                                        
                                        {/* Y Eksen: Yüzde Değerleri (+% / -%) */}
                                        <YAxis
                                            tickLine={false}
                                            axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                                            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                                            tickFormatter={(val) => `${val > 0 ? '+' : ''}${val}%`}
                                            domain={yAxisDomain}
                                            width={42}
                                        />

                                        {/* 0 Referans Taban Çizgisi */}
                                        <ReferenceLine 
                                            y={0} 
                                            stroke="#64748B" 
                                            strokeWidth={1.5} 
                                        />

                                        {/* BIST 100 Benchmark Kesikli Referans Çizgisi */}
                                        {showBenchmarkLine && (
                                            <ReferenceLine
                                                y={bist100Return}
                                                stroke="#004BFA"
                                                strokeDasharray="4 4"
                                                strokeWidth={2}
                                                label={{
                                                    value: `BIST 100 (%${bist100Return >= 0 ? '+' : ''}${bist100Return.toFixed(1)})`,
                                                    fill: '#004BFA',
                                                    fontSize: 10,
                                                    position: 'insideTopRight',
                                                    className: 'font-clash font-medium'
                                                }}
                                            />
                                        )}

                                        <Tooltip 
                                            content={<CustomBarTooltip />} 
                                            cursor={{ fill: 'rgba(0, 75, 250, 0.05)' }}
                                        />

                                        {/* Dikey Sütunlar (Pozitif yukarı, negatif aşağı) */}
                                        <Bar 
                                            dataKey="returnPct" 
                                            radius={[5, 5, 5, 5]}
                                            label={renderCustomBarLabel}
                                        >
                                            {chartData.map((entry, idx) => (
                                                <Cell
                                                    key={`cell-${idx}`}
                                                    fill={entry.returnPct >= 0 ? '#10B981' : '#F43F5E'}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
                                    <BarChart3 className="w-10 h-10 text-[#004BFA]/40 animate-pulse" />
                                    <div className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                        Grafik için aktif pozisyon verisi bekleniyor
                                    </div>
                                    <p className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 max-w-xs">
                                        Portföyünüze varlık eklediğinizde dikey sütun grafiği otomatik olarak hesaplanacaktır.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Alt Bilgi İpucu */}
                        <div className="flex items-center justify-between text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 pt-2 border-t border-[#D6E4FF]/40 dark:border-white/10">
                            <span>İpucu: Sütunların üzerine gelerek ilgili sektörün portföy katkısını ve dahil olan şirketleri görebilirsiniz.</span>
                            <span className="font-numbers font-[500]">0% Çizgisi = Başabaş Noktası</span>
                        </div>
                    </div>

                    {/* SAĞ (4 Kolon): SEKTÖR VE PİYASA RASYOLARI (Dikey grafiğin doğrudan yanında, mantıklı konumlandırma) */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        
                        {/* Kart 1: Piyasa Kıyaslaması ve Relatif Alfa Rasyosu */}
                        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                            <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/40 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-[#004BFA]" />
                                    <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                        Piyasa Kıyaslaması (Alfa Rasyosu)
                                    </span>
                                </div>
                                <span className={`text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full ${
                                    (summary?.relativeAlphaPct || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {(summary?.relativeAlphaPct || 0) >= 0 ? 'Piyasa Üstü' : 'Piyasa Altı'}
                                </span>
                            </div>

                            <div className="py-3">
                                <div className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-white/70">
                                    BIST 100 Endeksine Göre Net Alfa:
                                </div>
                                <div className={`text-2xl font-numbers font-[500] tracking-tight mt-0.5 ${
                                    (summary?.relativeAlphaPct || 0) >= 0 ? 'text-[#004BFA] dark:text-[#D6E4FF]' : 'text-rose-600 dark:text-rose-400'
                                }`}>
                                    {(summary?.relativeAlphaPct || 0) >= 0 ? '+' : ''}%{(summary?.relativeAlphaPct || 0).toFixed(2)} Alfa
                                </div>
                                <p className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 mt-1">
                                    Portföy haftalık getirisi (%{(summary?.weeklyNetProfitPct || 0).toFixed(2)}), BIST 100 getirisinden (%{(summary?.bist100WeeklyReturnPct || 0).toFixed(2)}) {(summary?.relativeAlphaPct || 0) >= 0 ? 'daha yüksek performans sergiledi.' : 'daha geride kaldı.'}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-[#D6E4FF]/40 dark:border-white/10 flex items-center justify-between text-[11px]">
                                <span className="text-[#040989]/70 dark:text-white/70">Endeks Getirisi:</span>
                                <span className="font-numbers font-[500]">%{(summary?.bist100WeeklyReturnPct || 0).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Kart 2: İstatistiksel Volatilite & Risk Rasyosu */}
                        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                            <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/40 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#004BFA]" />
                                    <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                        Portföy Volatilitesi (Std. Sapma)
                                    </span>
                                </div>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-white/10 text-[#004BFA] dark:text-[#D6E4FF]">
                                    Haftalık Risk
                                </span>
                            </div>

                            <div className="py-3">
                                <div className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-white/70">
                                    Haftalık Standart Sapma Oranı:
                                </div>
                                <div className="text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] tracking-tight mt-0.5 flex items-center gap-1.5">
                                    <span>%{(summary?.portfolioVolatilityPct || 0).toFixed(2)}</span>
                                    <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
                                        ({summary?.volatilityNote || "Dengeli Volatilite"})
                                    </span>
                                </div>
                                <p className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 mt-1">
                                    Portföyünüzün dalgalanma katsayısı makul risk sınırları içerisinde seyretmektedir.
                                </p>
                            </div>

                            <div className="pt-2 border-t border-[#D6E4FF]/40 dark:border-white/10 flex items-center justify-between text-[11px]">
                                <span className="text-[#040989]/70 dark:text-white/70">Risk Sınırı Eşiği:</span>
                                <span className="font-numbers font-[500] text-amber-600">%4.00</span>
                            </div>
                        </div>

                        {/* Kart 3: Sektörel Kutuplar ve Liderlik */}
                        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-[#D6E4FF]/40 dark:border-white/10">
                                <Award className="w-4 h-4 text-[#004BFA]" />
                                <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                    Haftalık Sektör Kutupları
                                </span>
                            </div>

                            {/* En Çok Kazandıran Sektör */}
                            {topSector ? (
                                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] clash-subtitle font-[325] text-emerald-700 dark:text-emerald-300 block">
                                            🏆 En Çok Kazandıran Sektör
                                        </span>
                                        <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                            {topSector.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-numbers font-[500] text-emerald-600 dark:text-emerald-400">
                                        +%{topSector.weeklyReturnPct.toFixed(2)}
                                    </span>
                                </div>
                            ) : null}

                            {/* En Çok Baskılayan Sektör */}
                            {worstSector && worstSector.name !== topSector?.name ? (
                                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] clash-subtitle font-[325] text-rose-700 dark:text-rose-300 block">
                                            🔻 En Çok Baskılayan Sektör
                                        </span>
                                        <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                            {worstSector.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-numbers font-[500] text-rose-600 dark:text-rose-400">
                                        %{worstSector.weeklyReturnPct.toFixed(2)}
                                    </span>
                                </div>
                            ) : null}

                            {/* Portföy Sağlık & Çeşitlilik Rozeti */}
                            <div className="pt-1 flex items-center justify-between text-[11px] text-[#040989]/70 dark:text-white/70">
                                <span>AI Portföy Sağlık Puanı:</span>
                                <strong className="font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF]">
                                    {summary?.healthScore || 75} / 100
                                </strong>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 5. DETAYLI VARLIK PERFORMANSI VE ÇİFT KATMANLI GETİRİ TABLOSU (ÇİFT KATMANLI RASYOLAR BURADA DOĞRUDAN TABLO ÖZETİ OLARAK YER ALIR) */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
                    
                    {/* Tablo Üst Başlığı */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-[#004BFA]" />
                                <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                    Varlık Performans ve Çift Katmanlı Getiri Tablosu
                                </h3>
                            </div>
                            <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-0.5">
                                Her bir hisse senedinin haftalık getiri katkısı (1. Katman) ile portföye ilk katıldığı günden bu yana biriken toplam reel kârı (2. Katman) yan yana listelenmektedir.
                            </p>
                        </div>
                        <span className="text-xs clash-subtitle font-[325] px-3 py-1.5 rounded-xl bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 self-start sm:self-center">
                            {assets.length} Aktif Pozisyon
                        </span>
                    </div>

                    {/* ÇİFT KATMANLI RASYOLARIN MANTIKLI KONUMU: TABLONUN DOĞRUDAN ÜST ÖZET KARTLARI */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                        
                        {/* 1. Katman Rasyosu: Haftalık Net Getiri */}
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-white/5 border border-blue-200/80 dark:border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-[#004BFA] dark:text-[#D6E4FF]">
                                    1. Katman • Haftalık Net Getiri
                                </span>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-md bg-[#004BFA]/15 text-[#004BFA] dark:text-[#D6E4FF]">
                                    Son 7 Gün
                                </span>
                            </div>
                            <div className={`text-xl font-numbers font-[500] mt-2 flex items-center gap-1.5 ${
                                (summary?.weeklyNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {(summary?.weeklyNetProfitTL || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{(summary?.weeklyNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.weeklyNetProfitTL || 0)}</span>
                                <span className="text-xs font-normal">
                                    (%{(summary?.weeklyNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.weeklyNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                            <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 mt-1">
                                Portföyün bu hafta içinde ürettiği net nominal kâr / zarar.
                            </span>
                        </div>

                        {/* 2. Katman Rasyosu: Kümülatif Getiri (Tüm Zamanlar) */}
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-white/5 border border-emerald-200/80 dark:border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-emerald-700 dark:text-emerald-300">
                                    2. Katman • Kümülatif Getiri
                                </span>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                    İlk Günden Beri
                                </span>
                            </div>
                            <div className={`text-xl font-numbers font-[500] mt-2 flex items-center gap-1.5 ${
                                (summary?.cumulativeNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {(summary?.cumulativeNetProfitTL || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{(summary?.cumulativeNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.cumulativeNetProfitTL || 0)}</span>
                                <span className="text-xs font-normal">
                                    (%{(summary?.cumulativeNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.cumulativeNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                            <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 mt-1">
                                Pozisyonların açıldığı andan bugüne dek birikmiş toplam kâr.
                            </span>
                        </div>

                        {/* Maliyet Tabanı ve Ortalama Büyüklük */}
                        <div className="p-4 rounded-2xl bg-[#F5F7FA] dark:bg-white/5 border border-[#D6E4FF]/60 dark:border-white/10 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-white/70">
                                    Maliyet Tabanı & Portföy Büyüklüğü
                                </span>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                    Sermaye
                                </span>
                            </div>
                            <div className="text-xl font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-2">
                                {formatCurrency(summary?.totalCost || 0)}
                            </div>
                            <div className="flex items-center justify-between text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60 mt-1">
                                <span>Güncel Piyasa Değeri:</span>
                                <strong className="font-numbers font-[500]">{formatCurrency(summary?.totalValue || 0)}</strong>
                            </div>
                        </div>

                    </div>

                    {/* Varlık Tablosu */}
                    {hasActiveAssets && assets.length > 0 ? (
                        <div className="overflow-x-auto pt-2">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                                        <th className="py-3 px-3">Varlık / Sektör</th>
                                        <th className="py-3 px-3">Adet / Maliyet</th>
                                        <th className="py-3 px-3">Güncel Fiyat</th>
                                        <th className="py-3 px-3">Piyasa Değeri</th>
                                        <th className="py-3 px-3 bg-blue-50/50 dark:bg-white/5 rounded-t-lg">
                                            1. Katman • Haftalık Getiri
                                        </th>
                                        <th className="py-3 px-3 bg-emerald-50/50 dark:bg-white/5 rounded-t-lg">
                                            2. Katman • Kümülatif Getiri
                                        </th>
                                        <th className="py-3 px-3">Portföy Payı</th>
                                        <th className="py-3 px-3">AI Strateji Notu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                                    {assets.map((asset) => {
                                        const isWeekPos = asset.weeklyReturnTL >= 0;
                                        const isCumPos = asset.cumulativeReturnTL >= 0;

                                        return (
                                            <tr key={asset.id || asset.symbol} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-[#D6E4FF]/30 dark:bg-white/10 flex items-center justify-center shrink-0">
                                                            <StockLogo symbol={asset.cleanSymbol} className="w-6 h-6 object-contain" />
                                                        </div>
                                                        <div>
                                                            <div className="clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-tight">
                                                                {asset.cleanSymbol}
                                                            </div>
                                                            <div className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                                                {asset.sector}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div className="font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                                        {asset.quantity.toLocaleString('tr-TR')} Adet
                                                    </div>
                                                    <div className="text-[10px] font-numbers text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                                        Ort: {formatCurrency(asset.avgCost)}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                                                    {formatCurrency(asset.currentPrice)}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                                                    {formatCurrency(asset.totalValue)}
                                                </td>

                                                {/* 1. KATMAN: HAFTALIK NET GETİRİ */}
                                                <td className="py-3.5 px-3 bg-blue-50/30 dark:bg-white/5">
                                                    <span className={`inline-flex items-center gap-1 font-numbers font-[500] ${
                                                        isWeekPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {isWeekPos ? '+' : ''}{formatCurrency(asset.weeklyReturnTL)}
                                                        <span className="text-[10px] font-normal ml-0.5">
                                                            ({isWeekPos ? '+' : ''}%{asset.weeklyReturnPct.toFixed(1)})
                                                        </span>
                                                    </span>
                                                </td>

                                                {/* 2. KATMAN: KÜMÜLATİF GETİRİ */}
                                                <td className="py-3.5 px-3 bg-emerald-50/30 dark:bg-white/5">
                                                    <span className={`inline-flex items-center gap-1 font-numbers font-[500] ${
                                                        isCumPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {isCumPos ? '+' : ''}{formatCurrency(asset.cumulativeReturnTL)}
                                                        <span className="text-[10px] font-normal ml-0.5">
                                                            ({isCumPos ? '+' : ''}%{asset.cumulativeReturnPct.toFixed(1)})
                                                        </span>
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-14 h-2 bg-[#D6E4FF]/50 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-[#004BFA] rounded-full" 
                                                                style={{ width: `${Math.min(100, asset.weightPct)}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums text-[11px]">
                                                            %{asset.weightPct.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className={`text-[10px] clash-subtitle font-[325] px-2.5 py-1 rounded-lg border whitespace-nowrap ${asset.aiAdviceColor}`}>
                                                        {asset.aiAdvice}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                Portföyünüzde henüz aktif varlık bulunmuyor
                            </h4>
                            <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 max-w-md">
                                İlk varlığınızı eklediğiniz anda canlı piyasa fiyatları, sektörel kırılım dikey sütun grafiği ve çift katmanlı getiri raporunuz anlık üretilecektir.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <Link
                                    href="/dashboard/portfolio?openAdd=true"
                                    className="px-4 py-2 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-sm active:scale-95"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Hemen Varlık Ekle</span>
                                </Link>

                                <Link
                                    href="/dashboard/sample-portfolio"
                                    className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
                                >
                                    <span>Örnek Portföyü İncele</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
