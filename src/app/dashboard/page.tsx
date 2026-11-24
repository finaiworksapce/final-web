"use client";

// Dashboard v1.3.1 - Refined Top Section Faithful to Design Reference
import { AuthComponent } from "@/components/ui/sign-up";
import { TrendingUp, Activity, Newspaper, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";

import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { DynamicAssetAllocationContainer } from "@/components/dashboard/DynamicAssetAllocationContainer";
import { FinAiYesterdayReportWidget } from "@/components/FinAiYesterdayReportWidget";
import { SamplePortfolioWidget } from "@/components/dashboard/SamplePortfolioWidget";
import { FinAiAkademiWidget } from "@/components/dashboard/FinAiAkademiWidget";
import { MarketOverviewWidget } from "@/components/dashboard/MarketOverviewWidget";
import { DailyAgendaWidget } from "@/components/dashboard/DailyAgendaWidget";
import { LatestNewsWidget } from "@/components/dashboard/LatestNewsWidget";
import { FinancialTicker } from "@/components/FinancialTicker";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import Link from "next/link";

export default function DashboardPage() {
    const isDev = process.env.NODE_ENV === 'development';
    const { user, email: userEmail, userName, isAuthenticated, authState, isDataLoaded, globalNews, myAssets = [], prices = {} } = useUser();
    const [news, setNews] = useState<any[]>([]);

    // Kullanıcının hiç aktif varlığı yok ise sadece Örnek Portföy ve FinAi Akademi widgetları gösterilir
    const hasActiveAssets = useMemo(() => {
        if (!myAssets || myAssets.length === 0) return false;

        return myAssets.some((asset: any) => {
            const qty = Number(asset.quantity) || 0;
            if (qty <= 0) return false;
            const rawSymbol = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
            const cleanSymbol = rawSymbol.replace(/\.IS$/, "");
            const isCash = asset.type === "CASH" || cleanSymbol === "NAKİT" || cleanSymbol === "TRY_CASH";
            const currentPrice = isCash
                ? asset.avgCost || 1
                : prices[rawSymbol] ?? prices[cleanSymbol] ?? prices[`${cleanSymbol}.IS`] ?? asset.avgCost ?? 0;
            return currentPrice * qty > 0;
        });
    }, [myAssets, prices]);

    useEffect(() => {
        if (globalNews && globalNews.length > 0 && news.length === 0) {
            setNews(globalNews);
        }
    }, [globalNews, news.length]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const url = user?.id ? `/api/news?userId=${user.id}` : `/api/news`;
                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    const items = data.news || data.data || [];
                    if (items.length > 0) {
                        setNews(items);
                    }
                } else if (globalNews && globalNews.length > 0) {
                    setNews(globalNews);
                }
            } catch (error) {
                console.error("Dashboard news fetch error:", error);
                if (globalNews && globalNews.length > 0) setNews(globalNews);
            }
        };
        fetchNews();
    }, [user?.id, globalNews]);

    const [loadingStep, setLoadingStep] = useState(0);
    const loadingMessages = [
        "Portföy verileri hazırlanıyor...",
        "Piyasa fiyatları güncelleniyor...",
        "Varlık dağılımı hesaplanıyor...",
        "Analiz tamamlanıyor..."
    ];

    useEffect(() => {
        if (!isDataLoaded) {
            const interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [isDataLoaded]);

    if (!isDev && authState === 'UNAUTHENTICATED' && isAuthenticated === false && isDataLoaded) {
        return <AuthComponent />;
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D6E4FF]/30 dark:bg-[#004BFA]/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[2500px] mx-auto px-2 min-[360px]:px-3 sm:px-6 md:px-8 xl:px-10 py-2 min-[360px]:py-3 lg:py-6 flex flex-col justify-between gap-3.5 sm:gap-5 xl:gap-6 relative z-10 flex-1 min-h-[calc(100vh-3.5rem)] pb-6 md:pb-10">
                <AnimatePresence>
                    {!isDev && !isDataLoaded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md"
                        >
                            <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 text-[#040989] shadow-2xl text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 relative">
                                    <Loader2 className="w-20 h-20 sm:w-24 sm:h-24 text-[#040989] animate-spin opacity-20" />
                                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-[#040989] absolute inset-0 m-auto animate-pulse" />
                                </div>
                                <h2 className="text-xl sm:text-2xl font-normal mb-2 tracking-tighter">FinAi Hazırlanıyor</h2>
                                <p className="text-xs sm:text-sm font-normal text-slate-400 animate-pulse">{loadingMessages[loadingStep]}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Welcome Area (Zodiak Hierarchy 500/325/225 + 60-30-10) */}
                <div className="relative z-10 mb-2 flex items-center justify-between gap-4 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                        Hoş Geldiniz, {userName || userEmail?.split('@')[0] || "Salih KAVAKCI"}
                    </h1>
                    <DashboardTour hasActiveAssets={hasActiveAssets} news={news} />
                </div>

                {/* UNIFIED RESPONSIVE LAYOUT (250px to 2500px) */}
                <div className="flex flex-col gap-3.5 sm:gap-5 xl:gap-6 w-full relative z-10">
                    {/* 1. ÜST BÖLÜM: KULLANICININ HİÇBİR VARLIĞI YOKSA SADECE ÖRNEK PORTFÖY VE FİNAİ AKADEMİ */}
                    {!hasActiveAssets ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 xl:gap-5 items-stretch w-full">
                            <div id="finai-widget-sample-portfolio" className="flex flex-col min-w-0">
                                <SamplePortfolioWidget />
                            </div>
                            <div id="finai-widget-academy" className="flex flex-col min-w-0">
                                <FinAiAkademiWidget />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 xl:gap-5 items-stretch w-full">
                            <div id="finai-widget-summary" className="flex flex-col min-w-0 lg:col-span-12 xl:col-span-5 2xl:col-span-5">
                                <DashboardSummaryCards />
                            </div>
                            <div id="finai-widget-allocation" className="flex flex-col min-w-0 lg:col-span-6 xl:col-span-3 2xl:col-span-3">
                                <DynamicAssetAllocationContainer />
                            </div>
                            <div id="finai-widget-monthly-report" className="flex flex-col min-w-0 lg:col-span-6 xl:col-span-4 2xl:col-span-4">
                                <FinAiYesterdayReportWidget />
                            </div>
                        </div>
                    )}

                    {/* 2. İKİNCİ BÖLÜM: PİYASA GENEL GÖRÜNÜMÜ (%50) & GÜNLÜK AJANDA (%50) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 xl:gap-5 items-stretch w-full">
                        <div id="finai-widget-market" className="flex flex-col min-w-0">
                            <MarketOverviewWidget />
                        </div>
                        <div id="finai-widget-agenda" className="flex flex-col min-w-0">
                            <DailyAgendaWidget />
                        </div>
                    </div>

                    {/* 3. ÜÇÜNCÜ BÖLÜM: SON HABERLER (%100) */}
                    <div id="finai-widget-news" className="w-full">
                        <LatestNewsWidget news={news} />
                    </div>
                </div>
            </div>
        </div>
    );
}
