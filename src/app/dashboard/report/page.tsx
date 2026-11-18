"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    Compass, 
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
    CheckCircle2, 
    Activity, 
    AlertTriangle, 
    PlusCircle, 
    ArrowRight,
    Scale,
    Clock,
    ChevronDown,
    FileText,
    Award,
    PieChart,
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
import { 
    MonthlyReportData, 
    MonthlyAssetMetric, 
    MonthlySectorPerformance 
} from "@/lib/finai-monthly-report-service";
import MonthlyLastMonthSummaryWidget from "@/components/report/MonthlyLastMonthSummaryWidget";
import MonthlyNextMonthExpectationsWidget from "@/components/report/MonthlyNextMonthExpectationsWidget";

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val || 0);
};

// Recharts Custom Tooltip (Aylık Getiri ve Büyüme Katkı Payı ile zenginleştirilmiş)
const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isPos = data.returnPct >= 0;
        return (
            <div className="bg-white/95 dark:bg-[#02041A]/95 backdrop-blur-md border border-[#D6E4FF] dark:border-white/10 rounded-2xl p-3.5 shadow-xl text-xs space-y-2 min-w-[220px] z-50">
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
                        Aylık Getiri:
                    </span>
                    <span className={`font-numbers font-[500] text-sm ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPos ? '+' : ''}%{data.returnPct.toFixed(2)}
                    </span>
                </div>

                {data.contributionPct !== undefined && (
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                            Büyüme Katkı Payı:
                        </span>
                        <span className={`font-numbers font-[500] ${data.contributionPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {data.contributionPct >= 0 ? '+' : ''}%{data.contributionPct.toFixed(2)} Puan
                        </span>
                    </div>
                )}

                {data.returnTL !== undefined && data.returnTL !== 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                            Net Nominal Fark:
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
    // Default 1: Geçen Ay (Tamamlanan son ay)
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(1);
    const [monthlyReport, setMonthlyReport] = useState<MonthlyReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    
    // Dikey Grafik Görünüm Modu: Sektörler vs Bireysel Varlıklar
    const [chartViewMode, setChartViewMode] = useState<'sectors' | 'assets'>('sectors');
    const [showBenchmarkLine, setShowBenchmarkLine] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchReport = async (monthIdx: number = selectedMonthIndex) => {
        setLoading(true);
        try {
            const encodedName = encodeURIComponent(userName || email?.split('@')[0] || '');
            const baseUrl = user 
                ? `/api/finai-daily-report?userId=${user.id}&monthIndex=${monthIdx}&timeframe=monthly&userName=${encodedName}` 
                : `/api/finai-daily-report?monthIndex=${monthIdx}&timeframe=monthly&userName=${encodedName}`;
            const res = await fetch(baseUrl);
            const json = await res.json();
            if (json.success && json.monthlyReport) {
                setMonthlyReport(json.monthlyReport);
            }
        } catch (e) {
            console.error("FinAi monthly report error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDataLoaded) {
            fetchReport(selectedMonthIndex);
        }
    }, [user?.id, myAssets.length, selectedMonthIndex, isDataLoaded, userName]);

    const hasActiveAssets = monthlyReport ? monthlyReport.hasActiveAssets : (myAssets && myAssets.length > 0);
    const summary = monthlyReport?.summary;
    const sectors = monthlyReport?.sectors || [];
    const assets = monthlyReport?.assets || [];
    const period = monthlyReport?.period;
    const availableMonths = monthlyReport?.availableMonths || [];

    const bist100Return = summary?.bist100MonthlyReturnPct ?? 3.2;

    // Dikey Sütun Grafiği Veri Seti (X Ekseni: İsimler, Y Ekseni: Yüzde Getiri)
    const chartData = useMemo(() => {
        if (chartViewMode === 'sectors') {
            if (!sectors || sectors.length === 0) return [];
            return sectors.map((sec) => ({
                name: sec.name,
                returnPct: Number(sec.monthlyReturnPct.toFixed(2)),
                returnTL: sec.monthlyReturnTL,
                weightPct: sec.weightPct,
                assetCount: sec.assetCount,
                symbols: sec.symbols,
                isPositive: sec.monthlyReturnPct >= 0
            }));
        } else {
            if (!assets || assets.length === 0) return [];
            return assets.map((ast) => ({
                name: ast.cleanSymbol,
                returnPct: Number(ast.monthlyReturnPct.toFixed(2)),
                returnTL: ast.monthlyReturnTL,
                weightPct: ast.weightPct,
                contributionPct: ast.contributionPct,
                assetCount: 1,
                symbols: [ast.cleanSymbol],
                isPositive: ast.monthlyReturnPct >= 0
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
        const ceiling = Math.ceil(absMax + 2);
        return [-ceiling, ceiling];
    }, [chartData, bist100Return]);

    // Lider ve Baskılayan Sektörler
    const topSector = useMemo(() => {
        if (!sectors || sectors.length === 0) return null;
        return sectors[0];
    }, [sectors]);

    const worstSector = useMemo(() => {
        if (!sectors || sectors.length < 2) return null;
        return sectors[sectors.length - 1];
    }, [sectors]);

    return (
        <div className="w-full min-h-screen bg-[#F5F7FA] dark:bg-[#02041A] text-[#040989] dark:text-[#F5F7FA] p-3 sm:p-6 lg:p-8 space-y-6">
            <div className="w-full mx-auto space-y-6">

                {/* 1. ÜST GEZİNTİ VE DÖNEM SEÇİCİ TOOLBAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D6E4FF]/60 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/portfolio"
                            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs"
                            title="Portföy Tablosuna Dön"
                        >
                            <ArrowLeft className="w-4 h-4 text-[#004BFA]" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] uppercase tracking-wider">
                                    FinAi Premium Rapor Motoru
                                </span>
                                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF] border border-[#004BFA]/20">
                                    Aylık Analiz
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-tight">
                                {period?.monthLabel || "Aylık Özet"}
                            </h2>
                        </div>
                    </div>

                    {/* Sağ Araçlar: Dönem Seçici ve Yenileme */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex items-center">
                            <select
                                value={selectedMonthIndex}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setSelectedMonthIndex(val);
                                }}
                                className="appearance-none pl-8 pr-8 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] focus:outline-hidden focus:ring-2 focus:ring-[#004BFA]/40 shadow-2xs cursor-pointer"
                            >
                                {availableMonths.length > 0 ? (
                                    availableMonths.map((m) => (
                                        <option key={m.monthIndex} value={m.monthIndex} className="bg-white dark:bg-[#02041A] text-[#040989] dark:text-white">
                                            {m.label} {m.isCurrent ? '(Bu Ay)' : ''}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value={1}>Ekim 2026 (Geçen Ay)</option>
                                        <option value={0}>Kasım 2026 (Bu Ay)</option>
                                        <option value={2}>Eylül 2026</option>
                                    </>
                                )}
                            </select>
                            <Calendar className="w-3.5 h-3.5 text-[#004BFA] absolute left-2.5 pointer-events-none" />
                            <ChevronDown className="w-3 h-3 text-[#040989]/60 dark:text-white/60 absolute right-2.5 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => fetchReport(selectedMonthIndex)}
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

                {/* 2. RAPOR BAŞLIK BANNERI VE ENTEGRE YÖNETİCİ ÖZET ŞERİDİ */}
                <div className="bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
                    {/* Başlık ve Ay Atlama */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-white/10 text-[#004BFA] dark:text-[#93C5FD] border border-blue-200/60 dark:border-white/10 uppercase tracking-wider flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#93C5FD]" />
                                    Canlı Algoritma & Mentör Motoru
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    • {period?.dateRangeFormatted || "Ay Başı - Ay Sonu Kapanışı"}
                                </span>
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                                Aylık Performans ve Portföy Analizi Raporu
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                {userName || email?.split('@')[0] || "Değerli Yatırımcımız"} için Borsa İstanbul endeksi, reel haber akışı ve sektörel ağırlıklar temelinde hazırlanmıştır.
                            </p>
                        </div>

                        {/* Hızlı Ay Atlama Butonları */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-xl self-start lg:self-center shrink-0 border border-slate-200/70 dark:border-white/10">
                            <button
                                onClick={() => setSelectedMonthIndex(1)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                    selectedMonthIndex === 1
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Geçen Ay
                            </button>
                            <button
                                onClick={() => setSelectedMonthIndex(0)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                    selectedMonthIndex === 0
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                Bu Ay
                            </button>
                            <button
                                onClick={() => setSelectedMonthIndex(2)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                    selectedMonthIndex === 2
                                        ? 'bg-[#004BFA] text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                2 Ay Önce
                            </button>
                        </div>
                    </div>

                    {/* ENTEGRE KOMPAKT ÖZET ŞERİDİ */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
                        {/* 1. Portföy Toplam Değeri */}
                        <div className="bg-slate-50/70 dark:bg-white/5 rounded-xl p-3.5 border border-slate-200/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Layers className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Toplam Portföy Değeri</span>
                            </div>
                            <div className="text-base sm:text-lg font-semibold font-numbers text-slate-900 dark:text-white mt-1 tracking-tight">
                                {formatCurrency(summary?.totalValue || 0)}
                            </div>
                        </div>

                        {/* 2. Aylık Net Değişim */}
                        <div className="bg-slate-50/70 dark:bg-white/5 rounded-xl p-3.5 border border-slate-200/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <TrendingUp className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Aylık Nominal Değişim</span>
                            </div>
                            <div className={`text-base sm:text-lg font-semibold font-numbers mt-1 flex items-center gap-1 tracking-tight ${
                                (summary?.monthlyNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                <span>{(summary?.monthlyNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.monthlyNetProfitTL || 0)}</span>
                                <span className="text-xs font-normal">
                                    (%{(summary?.monthlyNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.monthlyNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                        </div>

                        {/* 3. TWR Gerçek Yatırım Getirisi */}
                        <div className="bg-slate-50/70 dark:bg-white/5 rounded-xl p-3.5 border border-slate-200/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Compass className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>TWR Gerçek Getiri</span>
                            </div>
                            <div className="text-base sm:text-lg font-semibold font-numbers text-slate-900 dark:text-white mt-1 tracking-tight flex items-center gap-1.5">
                                <span>%{(summary?.twrPct || 0).toFixed(2)}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                    (Arındırılmış)
                                </span>
                            </div>
                        </div>

                        {/* 4. BIST 100 Karşılaştırması */}
                        <div className="bg-slate-50/70 dark:bg-white/5 rounded-xl p-3.5 border border-slate-200/50 dark:border-white/10">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                <Scale className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>BIST 100 Karşılaştırma</span>
                            </div>
                            <div className="text-base sm:text-lg font-semibold font-numbers text-slate-900 dark:text-white mt-1 tracking-tight flex items-center gap-1.5">
                                <span>%{(summary?.bist100MonthlyReturnPct || 0).toFixed(2)}</span>
                                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${
                                    (summary?.relativeAlphaPct || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {(summary?.relativeAlphaPct || 0) >= 0 ? '+' : ''}{(summary?.relativeAlphaPct || 0).toFixed(2)} Alfa
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. EDİTORYAL MENTÖR VE STRATEJİK AJANDA (50/50 SİMETRİK YAN YANA GRİD) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full items-stretch">
                    <div className="w-full flex flex-col">
                        <MonthlyLastMonthSummaryWidget
                            report={monthlyReport}
                            loading={loading}
                            onRefresh={() => fetchReport(selectedMonthIndex)}
                        />
                    </div>
                    <div className="w-full flex flex-col">
                        <MonthlyNextMonthExpectationsWidget
                            data={monthlyReport?.nextMonthExpectations}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* 5. MERKEZİ ANALİZ: DİKEY SÜTUN GRAFİĞİ (X & Y EKSENLİ) + SEKTÖR & PİYASA RASYOLARI */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
                    
                    {/* SOL (8 Kolon): DİKEY SÜTUN GRAFİĞİ (X VE Y EKSENLİ) */}
                    <div className="lg:col-span-8 bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                        
                        {/* Grafik Üst Başlık ve Filtre Araç Çubuğu */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#004BFA]" />
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                                        Aylık Getiri ve Büyüme Katkı Sütun Grafiği
                                    </h3>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    X ekseninde sektörler / hisseler, Y ekseninde yüzde getiri oranları sıfır referans tabanıyla sunulmaktadır.
                                </p>
                            </div>

                            {/* Görünüm Değiştirici: Sektörler vs Bireysel Varlıklar */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <div className="flex items-center bg-slate-50 dark:bg-white/5 p-1 rounded-xl border border-slate-200/70 dark:border-white/10 text-xs">
                                    <button
                                        onClick={() => setChartViewMode('sectors')}
                                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                                            chartViewMode === 'sectors'
                                                ? 'bg-[#004BFA] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Sektörler ({sectors.length})
                                    </button>
                                    <button
                                        onClick={() => setChartViewMode('assets')}
                                        className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                                            chartViewMode === 'assets'
                                                ? 'bg-[#004BFA] text-white shadow-xs'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Hisseler ({assets.length})
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowBenchmarkLine(!showBenchmarkLine)}
                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                                        showBenchmarkLine 
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-[#004BFA] dark:text-blue-300 border-[#004BFA]/40' 
                                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200/70 dark:border-white/10'
                                    }`}
                                    title="BIST 100 Karşılaştırma Referansını Aç / Kapat"
                                >
                                    BIST 100 Çizgisi
                                </button>
                            </div>
                        </div>

                        {/* Lejant (Pozitif / Negatif / Referans) */}
                        <div className="flex flex-wrap items-center justify-between text-xs gap-3">
                            <div className="flex items-center gap-4 text-[11px] font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                                    <span className="text-slate-700 dark:text-slate-300">Pozitif Getiri</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-rose-500" />
                                    <span className="text-slate-700 dark:text-slate-300">Negatif Getiri</span>
                                </div>
                                {showBenchmarkLine && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-4 h-0.5 border-b-2 border-dashed border-[#004BFA]" />
                                        <span className="text-[#004BFA] dark:text-[#93C5FD]">
                                            BIST 100 (%{(bist100Return >= 0 ? '+' : '') + bist100Return.toFixed(2)})
                                        </span>
                                    </div>
                                )}
                            </div>

                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
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
                                            className="text-slate-200/70 dark:text-white/10" 
                                        />
                                        
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                                            tick={renderCustomXAxisTick}
                                            interval={0}
                                        />
                                        
                                        <YAxis
                                            tickLine={false}
                                            axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                                            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                                            tickFormatter={(val: number) => `${val > 0 ? '+' : ''}${val}%`}
                                            domain={yAxisDomain}
                                            width={42}
                                        />

                                        <ReferenceLine 
                                            y={0} 
                                            stroke="#64748B" 
                                            strokeWidth={1.5} 
                                        />

                                        {showBenchmarkLine && bist100Return !== 0 && (
                                            <ReferenceLine
                                                y={bist100Return}
                                                stroke="#004BFA"
                                                strokeDasharray="4 4"
                                                strokeWidth={1.5}
                                            />
                                        )}

                                        <Tooltip 
                                            content={<CustomBarTooltip />} 
                                            cursor={{ fill: 'rgba(0, 75, 250, 0.04)' }} 
                                        />

                                        <Bar
                                            dataKey="returnPct"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={48}
                                            label={renderCustomBarLabel}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.returnPct >= 0 ? '#10B981' : '#F43F5E'} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
                                    <BarChart3 className="w-8 h-8 text-[#004BFA]/40 mb-2 animate-bounce" />
                                    <span>Grafik verisi yükleniyor veya aktif varlık bulunamadı...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ (4 Kolon): SEKTÖR VE PORTFÖY ÖZETİ */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        
                        {/* Kart 1: Sektörel Kutuplar */}
                        <div className="bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                                <Award className="w-4 h-4 text-[#004BFA]" />
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                    Aylık Sektör Kutupları
                                </span>
                            </div>

                            {/* En Çok Kazandıran Sektör */}
                            {topSector ? (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 block">
                                            🏆 En Çok Kazandıran Sektör
                                        </span>
                                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                            {topSector.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold font-numbers text-emerald-600 dark:text-emerald-400">
                                        +%{topSector.monthlyReturnPct.toFixed(2)}
                                    </span>
                                </div>
                            ) : null}

                            {/* En Çok Baskılayan Sektör */}
                            {worstSector && worstSector.name !== topSector?.name ? (
                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-medium text-rose-700 dark:text-rose-300 block">
                                            🔻 En Çok Baskılayan Sektör
                                        </span>
                                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                            {worstSector.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold font-numbers text-rose-600 dark:text-rose-400">
                                        %{worstSector.monthlyReturnPct.toFixed(2)}
                                    </span>
                                </div>
                            ) : null}

                            {/* Portföy Sağlık Skoru */}
                            <div className="pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>FinAi Sağlık Skoru:</span>
                                <strong className="font-semibold font-numbers text-[#004BFA] dark:text-[#93C5FD]">
                                    {summary?.healthScore || 75} / 100
                                </strong>
                            </div>
                        </div>

                        {/* Kart 2: Portföy Büyüme Özeti */}
                        <div className="bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#004BFA]" />
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Ay İçi Net Sermaye Akışı
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-white/10 text-[#004BFA] dark:text-[#93C5FD]">
                                    Nakit Transferi
                                </span>
                            </div>

                            <div className="py-2">
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Dışarıdan Eklenen / Çekilen Nakit:
                                </div>
                                <div className="text-xl font-semibold font-numbers text-[#004BFA] dark:text-[#93C5FD] tracking-tight mt-0.5">
                                    {formatCurrency(summary?.netCapitalFlow || 0)}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                    TWR formülü sayesinde bu nakit transferi kâr gibi görünmez; gerçek borsa getiriniz ayrıştırılır.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 6. DETAYLI VARLIK PERFORMANSI VE BÜYÜME KATKI PAYI TABLOSU */}
                <div className="bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-[#004BFA]" />
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                                    Varlık Performans ve Büyüme Katkı Payı Tablosu
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Portföydeki her bir varlığın ay başı fiyatı, son fiyatı, aylık net getirisi ve toplam cüzdan büyümesine net katkı payı (Ağırlık × Getiri) aşağıda listelenmektedir.
                            </p>
                        </div>
                    </div>

                    {hasActiveAssets && assets.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-medium text-[11px] bg-slate-50/60 dark:bg-white/5">
                                        <th className="py-3 px-3">Varlık / Sektör</th>
                                        <th className="py-3 px-3">Adet & Maliyet</th>
                                        <th className="py-3 px-3">Ay Başı Fiyat</th>
                                        <th className="py-3 px-3">Son Fiyat</th>
                                        <th className="py-3 px-3">Toplam Değer</th>
                                        <th className="py-3 px-3 bg-blue-50/50 dark:bg-white/5">Aylık Getiri</th>
                                        <th className="py-3 px-3 bg-emerald-50/50 dark:bg-white/5 font-semibold text-[#004BFA] dark:text-[#93C5FD]">Büyüme Katkı Payı</th>
                                        <th className="py-3 px-3">Cüzdan Payı</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                    {assets.map((asset) => {
                                        const isMonthPos = asset.monthlyReturnTL >= 0;

                                        return (
                                            <tr key={asset.id || asset.symbol} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                                                            <StockLogo symbol={asset.cleanSymbol} className="w-6 h-6 object-contain" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                                                                <span>{asset.cleanSymbol}</span>
                                                                {asset.isAnomaly && (
                                                                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-normal">
                                                                        Anomali
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                {asset.sector}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div className="font-numbers font-medium text-slate-900 dark:text-white">
                                                        {asset.quantity.toLocaleString('tr-TR')} Adet
                                                    </div>
                                                    <div className="text-[10px] font-numbers text-slate-500 dark:text-slate-400">
                                                        Ort: {formatCurrency(asset.avgCost)}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-medium text-slate-900 dark:text-white tabular-nums">
                                                    {formatCurrency(asset.startPrice)}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-medium text-slate-900 dark:text-white tabular-nums">
                                                    {formatCurrency(asset.currentPrice)}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-medium text-slate-900 dark:text-white tabular-nums">
                                                    {formatCurrency(asset.totalValue)}
                                                </td>

                                                {/* AYLIK NET GETİRİ */}
                                                <td className="py-3.5 px-3 bg-blue-50/30 dark:bg-white/5">
                                                    <span className={`inline-flex items-center gap-1 font-numbers font-medium ${
                                                        isMonthPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {isMonthPos ? '+' : ''}{formatCurrency(asset.monthlyReturnTL)}
                                                        <span className="text-[10px] font-normal ml-0.5">
                                                            ({isMonthPos ? '+' : ''}%{asset.monthlyReturnPct.toFixed(1)})
                                                        </span>
                                                    </span>
                                                </td>

                                                {/* BÜYÜME KATKI PAYI */}
                                                <td className="py-3.5 px-3 bg-emerald-50/30 dark:bg-white/5">
                                                    <span className={`inline-flex items-center gap-1 font-numbers font-medium ${
                                                        asset.contributionPct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {asset.contributionPct >= 0 ? '+' : ''}%{asset.contributionPct.toFixed(2)} Puan
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-14 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-[#004BFA] rounded-full" 
                                                                style={{ width: `${Math.min(100, asset.weightPct)}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-numbers font-medium text-slate-700 dark:text-slate-300 tabular-nums text-[11px]">
                                                            %{asset.weightPct.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-white/10 flex items-center justify-center text-[#004BFA] dark:text-[#93C5FD]">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                Portföyünüzde henüz aktif varlık bulunmuyor
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                                İlk varlığınızı eklediğiniz anda canlı piyasa fiyatları, sektörel kırılım dikey sütun grafiği ve aylık getiri raporunuz üretilecektir.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <Link
                                    href="/dashboard/portfolio?openAdd=true"
                                    className="px-4 py-2 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>Hemen Varlık Ekle</span>
                                </Link>

                                <Link
                                    href="/dashboard/sample-portfolio"
                                    className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/20 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
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
