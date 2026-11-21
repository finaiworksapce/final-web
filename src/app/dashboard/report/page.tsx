"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    Compass, 
    ArrowLeft, 
    TrendingUp, 
    Calendar, 
    RefreshCw, 
    Printer, 
    Layers, 
    BarChart3, 
    Activity, 
    PlusCircle, 
    ArrowRight,
    ChevronDown
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
import { useUser } from "@/components/providers/UserProvider";
import StockLogo from "@/components/StockLogo";
import Link from "next/link";
import { 
    MonthlyReportData 
} from "@/lib/finai-monthly-report-service";
import MonthlyLastMonthSummaryWidget from "@/components/report/MonthlyLastMonthSummaryWidget";
import MonthlyNextMonthExpectationsWidget from "@/components/report/MonthlyNextMonthExpectationsWidget";
import FinAiMonthlyNewsFindings from "@/components/report/FinAiMonthlyNewsFindings";

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val || 0);
};

// Recharts Custom Tooltip (Sadece Varlık Adı, Aylık Yüzde ve Net TL Getiri)
const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const isPos = data.returnPct >= 0;
        return (
            <div className="bg-white/95 dark:bg-[#02041A]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[170px] z-50">
                <div className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-white/10">
                    {data.name}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Aylık Getiri:
                    </span>
                    <span className={`font-numbers font-semibold text-xs ${isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPos ? '+' : ''}%{data.returnPct.toFixed(2)}
                    </span>
                </div>

                {data.returnTL !== undefined && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Net Getiri:
                        </span>
                        <span className={`font-numbers font-semibold text-xs ${data.returnTL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            {data.returnTL >= 0 ? '+' : ''}{formatCurrency(data.returnTL)}
                        </span>
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
    const shortVal = val.length > 12 ? val.slice(0, 11) + "…" : val;
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={12}
                textAnchor="middle"
                className="fill-slate-600 dark:fill-slate-400 text-[10px] sm:text-[11px] font-medium"
            >
                {shortVal}
            </text>
        </g>
    );
};

// Recharts Custom Bar Value Labels
const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === 0) return null;
    const isPos = value >= 0;
    const labelY = isPos ? Math.max(y - 6, 12) : y + height + 14;
    return (
        <text
            x={x + width / 2}
            y={labelY}
            fill={isPos ? '#10B981' : '#F43F5E'}
            textAnchor="middle"
            className="text-[10px] font-numbers font-medium fill-current"
        >
            {isPos ? '+' : ''}{value.toFixed(1)}%
        </text>
    );
};

export default function FinAiReportViewPage() {
    const { user, myAssets = [], isDataLoaded, userName, email } = useUser();
    
    // Varsayılan: 1 = Ekim 2026 (Tamamlanmış güncel ay raporu)
    const [selectedMonthIndex] = useState<number>(1);
    const [monthlyReport, setMonthlyReport] = useState<MonthlyReportData | null>(() => {
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem('finai_cached_monthly_report');
            if (cached) {
                try { return JSON.parse(cached); } catch {}
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(() => {
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem('finai_cached_monthly_report');
            if (cached) return false;
        }
        return true;
    });
    const [isMounted, setIsMounted] = useState(false);
    
    // Dikey Grafik Görünüm Modu: Hisseler vs Sektörler (Varsayılan: Hisseler)
    const [chartViewMode, setChartViewMode] = useState<'sectors' | 'assets'>('assets');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchReport = async (monthIdx: number = selectedMonthIndex) => {
        // Eğer önbellekte veri yoksa loading spinner göster, varsa arka planda sessiz güncelle
        if (!monthlyReport) {
            setLoading(true);
        }
        try {
            const encodedName = encodeURIComponent(userName || email?.split('@')[0] || '');
            const baseUrl = user 
                ? `/api/finai-daily-report?userId=${user.id}&monthIndex=${monthIdx}&timeframe=monthly&userName=${encodedName}` 
                : `/api/finai-daily-report?monthIndex=${monthIdx}&timeframe=monthly&userName=${encodedName}`;
            const res = await fetch(baseUrl);
            const json = await res.json();
            if (json.success && json.monthlyReport) {
                setMonthlyReport(json.monthlyReport);
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('finai_cached_monthly_report', JSON.stringify(json.monthlyReport));
                }
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

    // Dikey Sütun Grafiği Veri Seti (X Ekseni: İsimler, Y Ekseni: Yüzde Getiri • Büyükten Küçüğe Sıralı)
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
            })).sort((a, b) => b.returnPct - a.returnPct);
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
            })).sort((a, b) => b.returnPct - a.returnPct);
        }
    }, [chartViewMode, sectors, assets]);

    // Sağdaki %30 Widget İçin Büyükten Küçüğe Sıralı Varlık Listesi
    const sortedAssets = useMemo(() => {
        if (!assets || assets.length === 0) return [];
        return [...assets].sort((a, b) => b.monthlyReturnPct - a.monthlyReturnPct);
    }, [assets]);

    // Dinamik ve Otomatik Ölçeklenen Y-Ekseni (Sütun etiketlerinin taşmaması için dinamik pay bırakılır)
    const yAxisDomain = useMemo(() => {
        const values = chartData.map(d => d.returnPct);
        if (values.length === 0) return [-6, 6];
        const minVal = Math.min(...values, 0);
        const maxVal = Math.max(...values, 0);
        const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));
        const ceiling = Math.max(4, Math.ceil(absMax + 2.5));
        return [-ceiling, ceiling];
    }, [chartData]);

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/30 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] p-3 sm:p-6 lg:p-8 space-y-6 relative overflow-x-hidden font-clash">
            
            {/* AMBİANS ARKA PLAN RGB IŞIKLARI (Beyazlığı kıran lüks FinAi atmosferi) */}
            <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#D6E4FF]/30 dark:bg-[#004BFA]/10 blur-[140px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-5%] w-[35%] h-[35%] rounded-full bg-[#5B80FF]/15 dark:bg-[#040989]/20 blur-[120px] pointer-events-none" />

            <div className="w-full mx-auto space-y-6 relative z-10">

                {/* 1. TEK VE NET EDİTORYAL MASTHEAD BAŞLIK & AY SEÇİCİ */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/portfolio"
                            className="p-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/20 text-[#004BFA] dark:text-[#93C5FD] hover:bg-slate-50 dark:hover:bg-white/20 transition-colors shadow-2xs cursor-pointer shrink-0"
                            title="Portföy Tablosuna Dön"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
                                {period?.monthLabel || "Ekim 2026"} Ayı Performans Raporu
                            </h1>
                        </div>
                    </div>

                    {/* Sağ Araçlar: Yenile, PDF/Yazdır */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchReport(selectedMonthIndex)}
                            disabled={loading}
                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#040989]/30 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Raporu Yenile"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-[#004BFA] ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Yenile</span>
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#040989]/30 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-xs font-medium flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            title="PDF / Yazdır"
                        >
                            <Printer className="w-3.5 h-3.5 text-[#004BFA]" />
                            <span className="hidden sm:inline">PDF / Yazdır</span>
                        </button>
                    </div>
                </header>

                {/* 2. EDİTORYAL MENTÖR VE STRATEJİK AJANDA (50/50 SİMETRİK YAN YANA GRİD) */}
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

                {/* 3. MERKEZİ ANALİZ: %70 DİKEY GETİRİ SÜTUN GRAFİĞİ + %30 VARLIK PERFORMANSI */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-5 sm:gap-6 w-full items-stretch">
                    
                    {/* SOL (%70 = 7 Kolon): DİKEY GETİRİ SÜTUN GRAFİĞİ */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4">
                        
                        {/* Grafik Üst Başlık ve Filtre Araç Çubuğu */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-[#004BFA]" />
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                                    Aylık Getiri Sütun Grafiği
                                </h3>
                            </div>

                            {/* Görünüm Değiştirici: Hisseler vs Sektörler */}
                            <div className="flex items-center bg-slate-50 dark:bg-white/5 p-1 rounded-xl border border-slate-200/70 dark:border-white/10 text-xs self-start sm:self-center">
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
                            </div>
                        </div>

                        {/* Lejant (Pozitif / Negatif) */}
                        <div className="flex flex-wrap items-center justify-start text-xs gap-3">
                            <div className="flex items-center gap-4 text-[11px] font-medium">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-emerald-500" />
                                    <span className="text-slate-700 dark:text-slate-300">Pozitif Getiri</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-md bg-rose-500" />
                                    <span className="text-slate-700 dark:text-slate-300">Negatif Getiri</span>
                                </div>
                            </div>
                        </div>

                        {/* DİKEY SÜTUN GRAFİK ALANI */}
                        <div className="w-full h-[400px] pt-2 relative">
                            {isMounted && chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 30, right: 15, left: -10, bottom: 25 }}
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
                                            width={44}
                                        />

                                        <ReferenceLine 
                                            y={0} 
                                            stroke="#64748B" 
                                            strokeWidth={1.5} 
                                        />

                                        <Tooltip 
                                            content={<CustomBarTooltip />} 
                                            cursor={{ fill: 'rgba(0, 75, 250, 0.04)' }} 
                                        />

                                        <Bar
                                            dataKey="returnPct"
                                            radius={[5, 5, 5, 5]}
                                            maxBarSize={52}
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

                    {/* SAĞ (%30 = 3 Kolon): VARLIK PERFORMANSI WİDGETI (Büyükten Küçüğe Sıralı, Sade) */}
                    <div className="lg:col-span-3 bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#004BFA]" />
                                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                                    Varlık Performansı
                                </h3>
                            </div>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-white/10 text-[#004BFA] dark:text-[#93C5FD] font-medium">
                                {sortedAssets.length} Hisse
                            </span>
                        </div>

                        {/* Sıralı Varlık Listesi: Sadece Hisse ve Aylık Getiri */}
                        <div className="flex-1 overflow-y-auto max-h-[440px] pr-1 space-y-2.5">
                            {sortedAssets.length > 0 ? (
                                sortedAssets.map((asset) => {
                                    const isPos = asset.monthlyReturnPct >= 0;
                                    const cleanSector = (!asset.sector || asset.sector === 'Finance') ? 'Finans' : asset.sector;
                                    return (
                                        <Link
                                            key={asset.id || asset.symbol}
                                            href={`/dashboard/varlik/${asset.cleanSymbol}`}
                                            className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-white/5 hover:bg-blue-50/50 dark:hover:bg-white/10 border border-transparent hover:border-blue-100 dark:hover:border-white/15 transition-all"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 border border-slate-200/50 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                                    <StockLogo symbol={asset.cleanSymbol} className="w-6 h-6 object-contain" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-[#004BFA] transition-colors truncate">
                                                        {asset.cleanSymbol}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                                        {cleanSector}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 pl-2">
                                                <div className={`font-numbers font-semibold text-xs ${
                                                    isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {isPos ? '+' : ''}%{asset.monthlyReturnPct.toFixed(2)}
                                                </div>
                                                <div className={`text-[10px] font-numbers ${
                                                    asset.monthlyReturnTL >= 0 ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-rose-600/80 dark:text-rose-400/80'
                                                }`}>
                                                    {asset.monthlyReturnTL >= 0 ? '+' : ''}{formatCurrency(asset.monthlyReturnTL)}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                                    Portföyde varlık bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. BÖLÜM: DOĞRULANMIŞ HABER BULGULARI & EDİTORYAL ANLATI (3 İZİNLİ KAYNAK) */}
                <div className="w-full pt-2">
                    <FinAiMonthlyNewsFindings 
                        availableSymbols={sortedAssets.map(a => ({ symbol: a.symbol || a.cleanSymbol, cleanSymbol: a.cleanSymbol, name: a.name }))}
                        userName={userName || email?.split('@')[0]}
                    />
                </div>

            </div>
        </div>
    );
}
