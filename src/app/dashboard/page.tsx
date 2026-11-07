"use client";

// Dashboard v1.3.1 - Refined Top Section Faithful to Design Reference
import { AuthComponent } from "@/components/ui/sign-up";
import { TrendingUp, Activity, Newspaper, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";

import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { DynamicAssetAllocationContainer } from "@/components/dashboard/DynamicAssetAllocationContainer";
import { FinAiYesterdayReportWidget } from "@/components/FinAiYesterdayReportWidget";
import { MarketOverviewWidget } from "@/components/dashboard/MarketOverviewWidget";
import { DailyAgendaWidget } from "@/components/dashboard/DailyAgendaWidget";
import { LatestNewsWidget } from "@/components/dashboard/LatestNewsWidget";
import { FinancialTicker } from "@/components/FinancialTicker";
import Link from "next/link";
export default function DashboardPage() {
    const isDev = process.env.NODE_ENV === 'development';
    const { user, email: userEmail, userName, isAuthenticated, authState, isDataLoaded, globalNews } = useUser();
    const [news, setNews] = useState<any[]>([]);

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
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 text-[#040989] w-full mx-auto relative overflow-x-hidden font-clash">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#D6E4FF]/30 blur-[120px] pointer-events-none" />

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10 mb-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0] || "Salih KAVAKCI"}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-center">
                        <Link 
                            href="/dashboard/portfolio" 
                            className="px-3.5 py-1.5 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5"
                        >
                            <span>Portföy Detayı</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* UNIFIED RESPONSIVE LAYOUT (250px to 2500px) */}
                <div className="flex flex-col gap-3.5 sm:gap-5 xl:gap-6 w-full relative z-10">
                    {/* 1. ÜST BÖLÜM: TOPLAM VARLIK (%42), VARLIK DAĞILIMI (%25), FİNANSAL RAPOR (%33) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 xl:gap-5 items-stretch w-full">
                        <div className="flex flex-col min-w-0 lg:col-span-12 xl:col-span-5 2xl:col-span-5">
                            <DashboardSummaryCards />
                        </div>
                        <div className="flex flex-col min-w-0 lg:col-span-6 xl:col-span-3 2xl:col-span-3">
                            <DynamicAssetAllocationContainer />
                        </div>
                        <div className="flex flex-col min-w-0 lg:col-span-6 xl:col-span-4 2xl:col-span-4">
                            <FinAiYesterdayReportWidget />
                        </div>
                    </div>

                    {/* 2. İKİNCİ BÖLÜM: PİYASA GENEL GÖRÜNÜMÜ (%50) & GÜNLÜK AJANDA (%50) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 xl:gap-5 items-stretch w-full">
                        <div className="flex flex-col min-w-0">
                            <MarketOverviewWidget />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <DailyAgendaWidget />
                        </div>
                    </div>

                    {/* 3. ÜÇÜNCÜ BÖLÜM: SON HABERLER (%100) */}
                    <div className="w-full">
                        <LatestNewsWidget news={news} />
                    </div>
                </div>
            </div>
        </div>
    );
}
