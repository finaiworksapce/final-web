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
    FileText
} from "lucide-react";
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

export default function FinAiReportViewPage() {
    const { user, myAssets = [], prices = {}, isDataLoaded, userName, email } = useUser();
    const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
    const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeBlockTab, setActiveBlockTab] = useState<'both' | 'lastWeek' | 'nextWeek'>('both');

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

    // Dinamik Sütun Grafiği için maksimum mutlak getiri oranı
    const maxSectorReturn = useMemo(() => {
        if (!sectors || sectors.length === 0) return 10;
        const maxVal = Math.max(...sectors.map(s => Math.abs(s.weeklyReturnPct)));
        return Math.max(5, Math.ceil(maxVal + 2));
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

            {/* ANA KAPSAYICI: Kenarları Maksimum Kullanan Tam Genişlik (Edge-to-Edge 2500px) */}
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
                        {/* 10. ÖNERİ: Geçmiş Hafta Arşiv Görünümü Seçici */}
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

                {/* 2. RAPOR KONTROL PANELİ & PERİYOT BİLGİSİ */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
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
                        className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent rounded-full blur-2xl pointer-events-none"
                    />

                    <div className="relative z-10">
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
                        <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-0.5 max-w-3xl">
                            {userName || email?.split('@')[0] || "Salih KAVAKCI"} için Borsa İstanbul endeksi, makroekonomik veriler ve sektörel ağırlıklar temelinde FinAi motoru tarafından hazırlanmıştır.
                        </p>
                    </div>

                    {/* Hızlı Hafta Atlama Butonları */}
                    <div className="flex items-center gap-1.5 bg-[#F5F7FA] dark:bg-white/10 p-1.5 rounded-2xl self-start md:self-center shrink-0 border border-[#D6E4FF]/60 dark:border-white/10 relative z-10">
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

                {/* 5. ÖNERİ: Risk & Volatilite Uyarısı Bildirim Bandı */}
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
                                    5. Öneri — Risk & Volatilite Eşik Uyarısı ({riskAlerts.length} Varlık)
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

                {/* 3. KPI METRİK BENTO GRID: Çift Katmanlı Metrik Kartları (PDF Bölüm 1) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
                    
                    {/* Kutu 1: Toplam Portföy Büyüklüğü */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Toplam Portföy Değeri
                            </span>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 tracking-tight">
                                {formatCurrency(summary?.totalValue || 0)}
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            Maliyet Tabanı: {formatCurrency(summary?.totalCost || 0)}
                        </span>
                    </div>

                    {/* Kutu 2: ÇİFT KATMANLI GETİRİ KARTI (Haftalık Net Getiri vs Kümülatif Getiri) */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Çift Katmanlı Net Getiri
                            </span>
                            <span className="text-[10px] clash-subtitle font-[325] px-1.5 py-0.5 rounded-md bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
                                Çift Katman
                            </span>
                        </div>
                        
                        {/* Katman 1: Haftalık Getiri */}
                        <div className="mt-1">
                            <div className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60">
                                1. Katman • Haftalık Getiri:
                            </div>
                            <div className={`text-base sm:text-lg font-numbers font-[500] flex items-center gap-1 ${
                                (summary?.weeklyNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {(summary?.weeklyNetProfitTL || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                <span>{(summary?.weeklyNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.weeklyNetProfitTL || 0)}</span>
                                <span className="text-xs font-normal">
                                    (%{(summary?.weeklyNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.weeklyNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                        </div>

                        {/* Katman 2: Kümülatif Getiri */}
                        <div className="mt-2 pt-1.5 border-t border-[#D6E4FF]/40 dark:border-white/10">
                            <div className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-white/60">
                                2. Katman • Kümülatif Getiri (İlk Günden Beri):
                            </div>
                            <div className={`text-xs font-numbers font-[500] ${
                                (summary?.cumulativeNetProfitTL || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {(summary?.cumulativeNetProfitTL || 0) >= 0 ? '+' : ''}{formatCurrency(summary?.cumulativeNetProfitTL || 0)}
                                <span className="ml-1">
                                    (%{(summary?.cumulativeNetProfitPct || 0) >= 0 ? '+' : ''}{(summary?.cumulativeNetProfitPct || 0).toFixed(2)})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Kutu 3: Benchmark (BIST 100) & Relatif Alfa Getirisi */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                    Piyasa Kıyaslaması (Alfa)
                                </span>
                                <Scale className="w-3.5 h-3.5 text-[#004BFA]" />
                            </div>
                            <div className={`text-xl sm:text-2xl font-numbers font-[500] mt-1 tracking-tight ${
                                (summary?.relativeAlphaPct || 0) >= 0 ? 'text-[#004BFA] dark:text-[#D6E4FF]' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {(summary?.relativeAlphaPct || 0) >= 0 ? '+' : ''}%{(summary?.relativeAlphaPct || 0).toFixed(2)} Alfa
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            BIST 100 Haftalık: %{(summary?.bist100WeeklyReturnPct || 0).toFixed(2)}
                        </span>
                    </div>

                    {/* Kutu 4: İstatistiksel Volatilite & Risk Notu (PDF Bölüm 4) */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Portföy Volatilitesi (Std. Sapma)
                            </span>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] mt-1 flex items-center gap-1 tracking-tight">
                                <Activity className="w-4 h-4" />
                                <span>%{(summary?.portfolioVolatilityPct || 0).toFixed(2)}</span>
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-emerald-600 dark:text-emerald-400 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5 truncate">
                            {summary?.volatilityNote || "Dengeli Volatilite"}
                        </span>
                    </div>

                    {/* Kutu 5: AI Portföy Sağlık & Çeşitlilik Skoru */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                    AI Portföy Sağlık Skoru
                                </span>
                                <Sparkles className="w-3.5 h-3.5 text-[#004BFA]" />
                            </div>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] mt-1 tracking-tight flex items-center gap-1.5">
                                <span>{summary?.healthScore || 75}</span>
                                <span className="text-xs font-normal text-slate-400">/ 100</span>
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-emerald-600 dark:text-emerald-400 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            {sectors.length} Farklı Sektör • {assets.length} Aktif Varlık
                        </span>
                    </div>

                </div>

                {/* 4. YAPAY ZEKA DESTEKLİ FİNANSAL OKURYAZARLIK ÖZET BLOKLARI (PDF Bölüm 2 - Kesin Cümle Sınırı Kuralı: 5 - 10 Cümle) */}
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

                {/* 5. SEKTÖREL GETİRİ ANALİZİ VE DİNAMİK SÜTUN GRAFİĞİ (PDF Bölüm 3) */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#004BFA]" />
                                <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                    Sektörel Getiri Analizi ve Dinamik Sütun Grafiği Kıyaslaması
                                </h3>
                            </div>
                            <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                                Portföyünüzdeki sektörlerin haftalık getiri oranları dinamik sütun grafiği ile BIST 100 endeksi kıyaslamalı olarak sunulmaktadır.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs clash-subtitle font-[325]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                                <span className="text-[#040989]/70 dark:text-[#F5F7FA]/70">Pozitif Getiri</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-md bg-rose-500" />
                                <span className="text-[#040989]/70 dark:text-[#F5F7FA]/70">Negatif Getiri</span>
                            </div>
                        </div>
                    </div>

                    {/* DİNAMİK SÜTUN GRAFİĞİ ALANI */}
                    {sectors.length > 0 ? (
                        <div className="space-y-4">
                            {/* Benchmark Kıyaslama Satırı (PDF Bölüm 3) */}
                            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-white/5 border border-blue-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-[#004BFA]" />
                                    <span className="clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                        Genel Piyasa Endeksi (BIST 100) Relatif Kıyaslaması:
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span>BIST 100 Haftalık: <strong className="font-numbers font-[500]">%{(summary?.bist100WeeklyReturnPct || 0).toFixed(2)}</strong></span>
                                    <span>Portföy Haftalık: <strong className="font-numbers font-[500]">%{(summary?.weeklyNetProfitPct || 0).toFixed(2)}</strong></span>
                                    <span className={`px-2.5 py-0.5 rounded-lg font-numbers font-[500] ${
                                        (summary?.relativeAlphaPct || 0) >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                    }`}>
                                        Alfa: {(summary?.relativeAlphaPct || 0) >= 0 ? '+' : ''}%{(summary?.relativeAlphaPct || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Sütun Grafikleri (Yan Yana & Yatay Dinamik Çubuklar) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                                {sectors.map((sec) => {
                                    const isPos = sec.weeklyReturnPct >= 0;
                                    const absPct = Math.abs(sec.weeklyReturnPct);
                                    const barWidth = Math.min(100, Math.max(6, (absPct / maxSectorReturn) * 100));

                                    return (
                                        <div 
                                            key={sec.name} 
                                            className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#D6E4FF]/60 dark:border-white/10 hover:border-[#004BFA]/40 transition-colors space-y-2.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="clash-title font-[500] text-sm text-[#040989] dark:text-[#F5F7FA]">
                                                        {sec.name}
                                                    </span>
                                                    <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                                        ({sec.assetCount} Varlık • %{sec.weightPct} Portföy Payı)
                                                    </span>
                                                </div>

                                                <span className={`text-sm font-numbers font-[500] ${
                                                    isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                }`}>
                                                    {isPos ? '+' : ''}%{sec.weeklyReturnPct.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Çubuk Göstergesi */}
                                            <div className="w-full h-3 bg-[#D6E4FF]/40 dark:bg-white/10 rounded-full overflow-hidden flex items-center">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${barWidth}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${
                                                        isPos ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
                                                    }`}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                                                <span>Haftalık Net TL Katkısı: <strong className="font-numbers font-[500]">{isPos ? '+' : ''}{formatCurrency(sec.weeklyReturnTL)}</strong></span>
                                                <span>Sektör Volatilitesi: <strong className="font-numbers font-[500]">% {sec.volatilityPct.toFixed(2)}</strong></span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center text-xs clash-desc font-[225] text-[#040989]/60 dark:text-white/60">
                            Portföyde kayıtlı aktif varlık bulunmadığından sektörel sütun grafiği oluşturulamamıştır.
                        </div>
                    )}
                </div>

                {/* 6. DETAYLI VARLIK PERFORMANS VE ÇİFT KATMANLI GETİRİ TABLOSU (PDF Bölüm 1 & 4) */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                Varlık Performans ve Çift Katmanlı Getiri Tablosu
                            </h3>
                            <p className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                Her bir varlığın haftalık anlık getirisi (Katman 1) ve portföye dahil edildiği andan itibaren toplam kümülatif getirisi (Katman 2) yan yana gösterilmektedir.
                            </p>
                        </div>
                        <span className="text-xs clash-subtitle font-[325] px-3 py-1 rounded-xl bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 self-start sm:self-center">
                            {assets.length} Aktif Pozisyon
                        </span>
                    </div>

                    {hasActiveAssets && assets.length > 0 ? (
                        <div className="overflow-x-auto">
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
                                İlk varlığınızı eklediğiniz anda canlı piyasa fiyatları, sektörel kırılım sütun grafiği ve çift katmanlı getiri raporunuz anlık üretilecektir.
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
