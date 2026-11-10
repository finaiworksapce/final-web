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
    PieChart, 
    Loader2, 
    Percent, 
    CheckCircle2, 
    FileText,
    Brain,
    Activity,
    Award,
    Zap,
    AlertTriangle,
    Sliders,
    Compass,
    PlusCircle,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import StockLogo from "@/components/StockLogo";
import Link from "next/link";

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
};

export default function FinAiReportViewPage() {
    const { user, myAssets = [], prices = {}, isDataLoaded, userName, email } = useUser();
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
    const [activeTab, setActiveTab] = useState<'narrative' | 'catalysts' | 'risks' | 'actionPlan'>('narrative');
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            console.error("FinAi report error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDataLoaded) {
            fetchReport(timeframe);
        }
    }, [user?.id, myAssets.length, timeframe, isDataLoaded]);

    // Canlı portföy metrikleri ve varlık katkı analizi
    const portfolioMetrics = useMemo(() => {
        let totalVal = 0;
        let totalCost = 0;
        const assetBreakdown: {
            symbol: string;
            cleanSymbol: string;
            type: string;
            quantity: number;
            avgCost: number;
            currentPrice: number;
            totalValue: number;
            totalCost: number;
            profitVal: number;
            profitPct: number;
            weight: number;
            aiAdvice: string;
            aiAdviceColor: string;
        }[] = [];

        myAssets.forEach((asset: any) => {
            const raw = (asset.symbol || '').toUpperCase().trim();
            const clean = raw.replace(/\.IS$/, '');
            const price = prices[raw] ?? prices[clean] ?? prices[`${clean}.IS`] ?? asset.avgCost ?? 0;
            const val = price * asset.quantity;
            const cost = asset.avgCost * asset.quantity;
            const profitVal = val - cost;
            const profitPct = cost > 0 ? (profitVal / cost) * 100 : 0;

            totalVal += val;
            totalCost += cost;

            let aiAdvice = "Ağırlığı Koru";
            let aiAdviceColor = "bg-blue-500/10 text-blue-600 border-blue-500/20";
            if (profitPct > 25) {
                aiAdvice = "Kısmi Kâr Realizasyonu";
                aiAdviceColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
            } else if (profitPct < -10) {
                aiAdvice = "Düşüşte Kademeli Ekleme";
                aiAdviceColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
            } else if (profitPct >= 0) {
                aiAdvice = "Güçlü Pozisyon";
                aiAdviceColor = "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
            }

            assetBreakdown.push({
                symbol: raw,
                cleanSymbol: clean,
                type: asset.type || 'STOCK',
                quantity: asset.quantity,
                avgCost: asset.avgCost,
                currentPrice: price,
                totalValue: val,
                totalCost: cost,
                profitVal,
                profitPct,
                weight: 0,
                aiAdvice,
                aiAdviceColor
            });
        });

        assetBreakdown.forEach(item => {
            item.weight = totalVal > 0 ? (item.totalValue / totalVal) * 100 : 0;
        });

        assetBreakdown.sort((a, b) => b.totalValue - a.totalValue);

        const netProfit = totalVal - totalCost;
        const netProfitPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

        // Portföy Çeşitlilik & Sağlık Skoru (0-100)
        let healthScore = 75;
        if (assetBreakdown.length >= 4) healthScore = 94;
        else if (assetBreakdown.length >= 2) healthScore = 86;
        else if (assetBreakdown.length === 1) healthScore = 65;
        else healthScore = 50;

        return {
            totalVal,
            totalCost,
            netProfit,
            netProfitPct,
            assetBreakdown,
            isPositive: netProfit >= 0,
            healthScore
        };
    }, [myAssets, prices]);

    // Anlatı metni
    const clientFallbackNarrative = useMemo(() => {
        if (!myAssets || myAssets.length === 0) {
            return "Portföyünüzde henüz kayıtlı aktif bir varlık bulunmuyor. Varlık ekledikten sonra FinAi piyasa korelasyonu ve performans raporunuz anlık olarak burada üretilecektir.";
        }

        const topDriver = portfolioMetrics.assetBreakdown[0]?.cleanSymbol || 'ana pozisyonunuz';
        const startStr = formatCurrency(portfolioMetrics.totalCost);
        const endStr = formatCurrency(portfolioMetrics.totalVal);
        const diffStr = formatCurrency(Math.abs(portfolioMetrics.netProfit));
        const diffPct = Math.abs(portfolioMetrics.netProfitPct).toFixed(2);
        const isPos = portfolioMetrics.isPositive;
        const isZeroChange = Math.abs(portfolioMetrics.netProfit) < 0.01;

        if (timeframe === 'weekly') {
            if (isZeroChange) {
                return `Son 7 günlük değerlendirmede portföyünüzün toplam büyüklüğü ${endStr} seviyesinde dengeli bir seyir izledi. Varlıklarınız mevcut dağılımını korurken BIST endeks trendleri yakından izlenmektedir.`;
            }
            return `Son 7 günlük değerlendirmede portföyünüzün toplam büyüklüğü ${startStr} maliyet tabanından ${endStr} piyasa değerine ulaştı (${isPos ? '+' : '-'}${diffStr}, %${diffPct}). Bu dönemde getiri dinamiğinin en belirleyici faktörü %${(portfolioMetrics.assetBreakdown[0]?.weight || 0).toFixed(1)} portföy ağırlığına sahip olan ${topDriver} pozisyonu oldu. Küresel risk iştahı ve BIST endeks trendleri yakından izlenmektedir.`;
        } else if (timeframe === 'monthly') {
            if (isZeroChange) {
                return `Son 30 günlük aylık incelemede toplam varlık değeriniz ${endStr} seviyesinde dengeli kaldı. Portföy yapısındaki varlık dağılımı korunmaktadır.`;
            }
            return `Son 30 günlük aylık incelemede toplam varlık değeriniz ${endStr} seviyesinde dengelenerek ${isPos ? '+' : '-' }%${diffPct} net değişim kaydetti. Aylık döneme yayılan fiyatlamada ${topDriver} varlığının performansı öne çıkarken risk dağılımının dengeli kaldığı gözlemlendi.`;
        } else {
            if (isZeroChange) {
                return `Portföyünüzün oluşturulduğu ilk günden bugüne varlık büyüklüğünüz ${endStr} seviyesinde dengesini korumaktadır.`;
            }
            return `Portföyünüzün oluşturulduğu ilk günden bugüne gerçekleşen genel performans değerlendirmesinde kümülatif büyüme ${isPos ? '+' : '-'}${diffStr} (${isPos ? '+' : '-' }%${diffPct}) olarak gerçekleşmiştir. Toplam varlık büyüklüğünüz ${endStr} seviyesindedir.`;
        }
    }, [myAssets, portfolioMetrics, timeframe]);

    const isApiEmpty = !report || !report.narrativeText || report.narrativeText.includes("bulunmuyor");
    const fullNarrative = (myAssets.length > 0 && isApiEmpty) ? clientFallbackNarrative : (report?.narrativeText || clientFallbackNarrative);

    const displayTwr = report?.twrPercent !== undefined ? report.twrPercent : portfolioMetrics.netProfitPct;

    const hasActiveAssets = portfolioMetrics.assetBreakdown.length > 0;

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
                
                {/* 1. ÜST BAR: Navigasyon, Canlı AI Göstergesi ve Araçlar */}
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
                                Haftalık Özet Rapor
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                            onClick={() => fetchReport(timeframe)}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
                            title="Raporu Yenile"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#004BFA]' : 'text-[#004BFA]'}`} />
                            <span className="hidden sm:inline">Analizi Yenile</span>
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
                            title="Raporu Yazdır"
                        >
                            <Printer className="w-3.5 h-3.5 text-[#004BFA]" />
                            <span className="hidden sm:inline">PDF / Yazdır</span>
                        </button>
                    </div>
                </div>

                {/* 2. RAPOR KONTROL PANELİ & ZAMAN DİLİMİ FİLTRESİ */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
                    {/* Arka plan sürekli AI Loop parıltısı */}
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
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#D6E4FF]/60 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004BFA] opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004BFA]" />
                                </span>
                                Canlı Yapay Zekâ Analiz Motoru
                            </span>
                            <span className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                • {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                            Portföy Gelişim, Büyüme ve Risk Raporu
                        </h1>
                        <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-0.5 max-w-3xl">
                            {userName || email?.split('@')[0] || "Salih KAVAKCI"} için varlık dağılımı, makroekonomik korelasyonlar ve endeks trendleri esas alınarak FinAi motoru tarafından hazırlanmıştır.
                        </p>
                    </div>

                    {/* Zaman Dilimi Butonları */}
                    <div className="flex items-center gap-1.5 bg-[#F5F7FA] dark:bg-white/10 p-1.5 rounded-2xl self-start md:self-center shrink-0 border border-[#D6E4FF]/60 dark:border-white/10 relative z-10">
                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-3.5 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                timeframe === 'weekly'
                                    ? 'bg-[#004BFA] text-white shadow-xs'
                                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                            }`}
                        >
                            Haftalık (7 Gün)
                        </button>
                        <button
                            onClick={() => setTimeframe('monthly')}
                            className={`px-3.5 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                timeframe === 'monthly'
                                    ? 'bg-[#004BFA] text-white shadow-xs'
                                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                            }`}
                        >
                            Aylık (30 Gün)
                        </button>
                        <button
                            onClick={() => setTimeframe('all-time')}
                            className={`px-3.5 py-1.5 text-xs clash-subtitle font-[325] rounded-xl transition-all ${
                                timeframe === 'all-time'
                                    ? 'bg-[#004BFA] text-white shadow-xs'
                                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#040989] dark:hover:text-white'
                            }`}
                        >
                            Tüm Zamanlar
                        </button>
                    </div>
                </div>

                {/* 3. KPI METRİK BENTO GRID (5 Kutu / Kenarları Kullanan Tam Genişlik) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
                    
                    {/* Kutu 1: Toplam Varlık Değeri */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Toplam Portföy Değeri
                            </span>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 tracking-tight">
                                {formatCurrency(portfolioMetrics.totalVal)}
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            Maliyet: {formatCurrency(portfolioMetrics.totalCost)}
                        </span>
                    </div>

                    {/* Kutu 2: Dönem Net Getirisi */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Dönem Net Getirisi
                            </span>
                            <div className={`text-xl sm:text-2xl font-numbers font-[500] mt-1 flex items-center gap-1 tracking-tight ${
                                portfolioMetrics.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                                {portfolioMetrics.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                <span>{portfolioMetrics.isPositive ? '+' : ''}{formatCurrency(portfolioMetrics.netProfit)}</span>
                            </div>
                        </div>
                        <span className="text-[11px] font-numbers font-[500] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            Getiri Oranı: {portfolioMetrics.isPositive ? '+' : ''}%{portfolioMetrics.netProfitPct.toFixed(2)}
                        </span>
                    </div>

                    {/* Kutu 3: AI Portföy Sağlık Skoru */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
                        <div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                    AI Portföy Sağlık Skoru
                                </span>
                                <Sparkles className="w-3.5 h-3.5 text-[#004BFA]" />
                            </div>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] mt-1 tracking-tight flex items-center gap-1.5">
                                <span>{portfolioMetrics.healthScore}</span>
                                <span className="text-xs font-normal text-slate-400">/ 100</span>
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-emerald-600 dark:text-emerald-400 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            {portfolioMetrics.healthScore >= 90 ? "Mükemmel Çeşitlilik" : portfolioMetrics.healthScore >= 70 ? "İyi Dengeli Dağılım" : "Geliştirilmeli"}
                        </span>
                    </div>

                    {/* Kutu 4: Zaman Ağırlıklı Getiri (TWR) */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Zaman Ağırlıklı Getiri (TWR)
                            </span>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] mt-1 flex items-center gap-1 tracking-tight">
                                <Percent className="w-4 h-4" />
                                <span>%{displayTwr.toFixed(2)}</span>
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            Nakit akışından bağımsız getiri
                        </span>
                    </div>

                    {/* Kutu 5: Aktif Pozisyon & Risk Seviyesi */}
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                        <div>
                            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                                Aktif Varlık & Risk
                            </span>
                            <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 tracking-tight">
                                {portfolioMetrics.assetBreakdown.length} Pozisyon
                            </div>
                        </div>
                        <span className="text-[11px] clash-desc font-[225] text-blue-600 dark:text-blue-400 mt-2 block border-t border-[#D6E4FF]/40 dark:border-white/10 pt-1.5">
                            Risk Seviyesi: Dengeli (Beta: 0.92)
                        </span>
                    </div>

                </div>

                {/* 4. ANA RAPOR ANLATISI & DERİNLEMESİNE AI ANALİZ BENTO KARTI */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white p-5 sm:p-8 lg:p-10 shadow-xl border border-white/10">
                    {/* Hareketli AI Aura */}
                    <motion.div
                        animate={{
                            scale: [1, 1.25, 1],
                            opacity: [0.25, 0.5, 0.25],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-[#004BFA]/40 via-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none"
                    />

                    <div className="relative z-10 space-y-5">
                        
                        {/* Başlık ve Sekmeler */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#D6E4FF]">
                                    <Brain className="w-4 h-4 text-[#D6E4FF]" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg clash-title font-[500] text-white tracking-tight">
                                        FinAi Yapay Zekâ Değerlendirme Anlatısı
                                    </h2>
                                    <p className="text-xs clash-desc font-[225] text-[#D6E4FF]/80">
                                        Piyasa hareketleri, enflasyon beklentileri ve varlık getirilerinin gerekçeli analizi
                                    </p>
                                </div>
                            </div>

                            {/* Sekme Seçiciler */}
                            <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 self-start md:self-center">
                                <button
                                    onClick={() => setActiveTab('narrative')}
                                    className={`px-3 py-1.5 rounded-xl text-xs clash-subtitle font-[325] transition-all ${
                                        activeTab === 'narrative'
                                            ? 'bg-white text-[#040989] shadow-sm'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    Stratejik Özet
                                </button>
                                <button
                                    onClick={() => setActiveTab('catalysts')}
                                    className={`px-3 py-1.5 rounded-xl text-xs clash-subtitle font-[325] transition-all ${
                                        activeTab === 'catalysts'
                                            ? 'bg-white text-[#040989] shadow-sm'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    Büyüme Katalizörleri
                                </button>
                                <button
                                    onClick={() => setActiveTab('risks')}
                                    className={`px-3 py-1.5 rounded-xl text-xs clash-subtitle font-[325] transition-all ${
                                        activeTab === 'risks'
                                            ? 'bg-white text-[#040989] shadow-sm'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    Makro Risk & Koruma
                                </button>
                                <button
                                    onClick={() => setActiveTab('actionPlan')}
                                    className={`px-3 py-1.5 rounded-xl text-xs clash-subtitle font-[325] transition-all ${
                                        activeTab === 'actionPlan'
                                            ? 'bg-white text-[#040989] shadow-sm'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    AI Eylem Planı
                                </button>
                            </div>
                        </div>

                        {/* İçerik Gösterimi */}
                        {loading ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                                <Loader2 className="w-6 h-6 text-[#D6E4FF] animate-spin" />
                                <p className="text-xs clash-subtitle font-[325] text-[#D6E4FF]">
                                    Finansal rapor analiz ediliyor ve yapay zekâ anlatısı oluşturuluyor...
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTab === 'narrative' && (
                                    <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 text-white/90 text-xs sm:text-sm clash-desc font-[225] leading-relaxed">
                                        <p>{fullNarrative}</p>
                                    </div>
                                )}

                                {activeTab === 'catalysts' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                                            <h4 className="text-xs clash-title font-[500] text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                Endeks Üzeri Hisseler & Getiri Katalizörü
                                            </h4>
                                            <p className="text-xs clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                                                Portföydeki lokomotif hisselerin güçlü bilanço beklentileri ve BIST sektör rotasyonundaki pozitif ayrışması getiriyi en çok destekleyen unsur olmuştur.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                                            <h4 className="text-xs clash-title font-[500] text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Zap className="w-4 h-4 text-blue-400" />
                                                Fon ve Emtia Dengelemesi
                                            </h4>
                                            <p className="text-xs clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                                                Döviz bazlı kıymetli madenler ve TEFAS fonları volatilite dönemlerinde ana sermayeyi koruyarak portföyün negatif şoklara karşı direncini artırmıştır.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'risks' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                                            <h4 className="text-xs clash-title font-[500] text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                TCMB Faiz Politikası & Para Piyasaları
                                            </h4>
                                            <p className="text-xs clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                                                Gelecek aylarda gerçekleşmesi muhtemel faiz indirim döngüsü mevduat getirilerini azaltabileceğinden hisse ve fon ağırlıklarının kademeli artırılması gerekebilir.
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                                            <h4 className="text-xs clash-title font-[500] text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                                Jeopolitik Dalgalanmalar & Stop-Loss
                                            </h4>
                                            <p className="text-xs clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                                                Küresel risk iştahındaki ani kırılmalara karşı kâr realizasyonu seviyelerine sadık kalınmalı, nakit tamponu asgari %15 bandında muhafaza edilmelidir.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'actionPlan' && (
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                        <h4 className="text-xs clash-title font-[500] text-white flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            FinAi Otomatik Optimizasyon Önerileri
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-[10px] clash-subtitle font-[325] text-emerald-400 block mb-1">
                                                    1. Adım: Kâr Realizasyonu
                                                </span>
                                                <p className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/90">
                                                    +%25 üzeri prim yapan pozisyonlardan %10 kâr alarak likit fon havuzuna aktarın.
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-[10px] clash-subtitle font-[325] text-blue-400 block mb-1">
                                                    2. Adım: Düşüş Alımları
                                                </span>
                                                <p className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/90">
                                                    Maliyetin %10 altında kalan kaliteli BIST 30 şirketlerinde kademeli ekleme yapın.
                                                </p>
                                            </div>

                                            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                                <span className="text-[10px] clash-subtitle font-[325] text-amber-400 block mb-1">
                                                    3. Adım: TEFAS Dengeleme
                                                </span>
                                                <p className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/90">
                                                    Yabancı teknoloji ve değişken fon sepetine aylık düzenli alım emri tanımlayın.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. PİYASA SENARYO STRES TESTLERİ (Görsel İştah & Simülasyon) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full">
                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Pozitif Senaryo
                            </span>
                            <span className="text-xs font-numbers font-[500] text-emerald-600 dark:text-emerald-400">
                                +%8.4 Tahmini Etki
                            </span>
                        </div>
                        <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                            TCMB Faiz İndirim Döngüsü
                        </h4>
                        <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                            Faiz indirimleri ile birlikte mevduat cazibesini yitirdiğinde BIST şirketlerine girecek likiditenin portföyünüze beklenen katkısı.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-blue-500/10 text-[#004BFA] dark:text-[#D6E4FF] border border-blue-500/20">
                                Boğa Piyasası
                            </span>
                            <span className="text-xs font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF]">
                                +%14.2 Tahmini Etki
                            </span>
                        </div>
                        <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                            BIST 100 Yeni Zirve Rallisi
                        </h4>
                        <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                            Yabancı yatırımcı girişlerinin artması durumunda lokomotif ihracatçı şirketlerinizin öncülük edeceği değerleme artışı.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                                Stres Testi
                            </span>
                            <span className="text-xs font-numbers font-[500] text-amber-600 dark:text-amber-400">
                                -%3.1 Sınırlı Kayıp
                            </span>
                        </div>
                        <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                            Küresel Risk İştahı Düşüşü
                        </h4>
                        <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                            Dolar endeksinin yükselmesi ve küresel satış dalgalarında altın ve likit fon kalkanınızın sağladığı maksimum tampon.
                        </p>
                    </div>
                </div>

                {/* 6. DETAYLI VARLIK PERFORMANS VE KATKI TABLOSU (Sayfanın Her Yanına Yayılan Full Width Tablo) */}
                <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                                Varlık Performans, Katkı ve AI Tavsiye Dökümü
                            </h3>
                            <p className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                                Portföyünüzdeki pozisyonların anlık değerleri, maliyetleri, getiri oranları ve yapay zekâ optimizasyon notları
                            </p>
                        </div>
                        <span className="text-xs clash-subtitle font-[325] px-3 py-1 rounded-xl bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20">
                            {portfolioMetrics.assetBreakdown.length} Pozisyon
                        </span>
                    </div>

                    {hasActiveAssets ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                                        <th className="py-3 px-3">Varlık</th>
                                        <th className="py-3 px-3">Adet / Miktar</th>
                                        <th className="py-3 px-3">Ort. Maliyet</th>
                                        <th className="py-3 px-3">Güncel Fiyat</th>
                                        <th className="py-3 px-3">Toplam Tutar</th>
                                        <th className="py-3 px-3">Kâr / Zarar</th>
                                        <th className="py-3 px-3">Portföy Payı</th>
                                        <th className="py-3 px-3">AI Strateji Notu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                                    {portfolioMetrics.assetBreakdown.map((asset) => {
                                        const isPos = asset.profitVal >= 0;
                                        return (
                                            <tr key={asset.symbol} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
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
                                                                {asset.type}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                                                    {asset.quantity.toLocaleString('tr-TR')}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989]/80 dark:text-[#F5F7FA]/80 tabular-nums">
                                                    {formatCurrency(asset.avgCost)}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                                                    {formatCurrency(asset.currentPrice)}
                                                </td>

                                                <td className="py-3.5 px-3 font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                                                    {formatCurrency(asset.totalValue)}
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className={`inline-flex items-center gap-1 font-numbers font-[500] ${
                                                        isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {isPos ? '+' : ''}{formatCurrency(asset.profitVal)}
                                                        <span className="text-[10px] font-normal ml-0.5">
                                                            ({isPos ? '+' : ''}%{asset.profitPct.toFixed(1)})
                                                        </span>
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-[#D6E4FF]/50 dark:bg-white/10 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-[#004BFA] rounded-full" 
                                                                style={{ width: `${Math.min(100, asset.weight)}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums text-[11px]">
                                                            %{asset.weight.toFixed(1)}
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
                                İlk varlığınızı eklediğiniz anda canlı piyasa fiyatları, kâr/zarar korelasyonları ve yapay zekâ strateji raporu burada otomatik üretilecektir.
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
