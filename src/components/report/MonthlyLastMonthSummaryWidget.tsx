"use client";

import React, { useState } from "react";
import { 
    TrendingUp, 
    Compass, 
    ShieldCheck, 
    HelpCircle, 
    ArrowUpRight, 
    ArrowDownRight, 
    CheckCircle2
} from "lucide-react";
import { MonthlyReportData } from "@/lib/finai-monthly-report-service";
import StockLogo from "@/components/StockLogo";
import Link from "next/link";
import WikipediaEntityText from "./WikipediaEntityText";

interface MonthlyLastMonthSummaryWidgetProps {
    report: MonthlyReportData | null;
    loading: boolean;
    onRefresh?: () => void;
}

// 5. Öneri: UI Bazında Mikro Finans Terim Tercümanı Sözlüğü
const FINANCIAL_GLOSSARY: Record<string, { title: string; simpleExplanation: string }> = {
    "TWR": {
        title: "TWR (Zaman Ağırlıklı Getiri)",
        simpleExplanation: "Hesabınıza dışarıdan eklediğiniz veya çektiğiniz parayı hesaba katmadan, sadece hisselerinizin kendi becerisiyle kazandığı gerçek kâr oranıdır."
    },
    "Katkı Payı": {
        title: "Büyüme Katkı Payı",
        simpleExplanation: "Bir hissenin cüzdanınızdaki büyüklüğü ile kârının çarpımıdır. Yani tüm portföyün büyümesine tek başına kaç puan güç kattığını gösterir."
    },
    "Sektör Ayrışması": {
        title: "Sektörel Ayrışma",
        simpleExplanation: "Bir şirketin, kendi sektöründeki rakiplerinden veya genel piyasadan çok daha hızlı yükselerek lig atlamasıdır."
    },
    "Sermaye Akışı": {
        title: "Net Sermaye Akışı",
        simpleExplanation: "Ay boyunca cüzdanınıza borsa dışından eklediğiniz veya cüzdandan çektiğiniz nakit para transferidir."
    },
    "BIST 100": {
        title: "BIST 100 Endeksi",
        simpleExplanation: "Borsa İstanbul'un en büyük 100 şirketinin ortalama nabzıdır; piyasanın o ay genel olarak nereye koştuğunu gösterir."
    }
};

export default function MonthlyLastMonthSummaryWidget({
    report,
    loading
}: MonthlyLastMonthSummaryWidgetProps) {
    const [activeTermKey, setActiveTermKey] = useState<string | null>(null);

    const mentor = report?.mentorSummary;
    const summary = report?.summary;
    const period = report?.period;

    const renderTermBadge = (termKey: string, displayText?: string) => {
        const item = FINANCIAL_GLOSSARY[termKey];
        if (!item) return <span>{displayText || termKey}</span>;

        const isActive = activeTermKey === termKey;

        return (
            <span className="relative inline-block mx-0.5">
                <button
                    type="button"
                    onClick={() => setActiveTermKey(isActive ? null : termKey)}
                    onMouseEnter={() => setActiveTermKey(termKey)}
                    onMouseLeave={() => setActiveTermKey(null)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-[#004BFA] dark:text-[#93C5FD] bg-[#004BFA]/5 dark:bg-white/5 hover:bg-[#004BFA]/10 dark:hover:bg-white/10 rounded-md border border-[#004BFA]/20 dark:border-white/15 transition-colors cursor-help align-baseline"
                >
                    <span>{displayText || termKey}</span>
                    <HelpCircle className="w-2.5 h-2.5 opacity-60" />
                </button>

                {/* Editoryal Mikro Sözlük Baloncuğu */}
                {isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3 bg-[#02041A] text-white text-[11px] leading-relaxed rounded-xl shadow-2xl border border-white/15 z-50 pointer-events-none">
                        <div className="font-medium text-[#93C5FD] pb-1 border-b border-white/10 mb-1.5 flex items-center justify-between">
                            <span>{item.title}</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/50">Halk Diliyle</span>
                        </div>
                        <p className="text-white/85 font-normal">{item.simpleExplanation}</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#02041A]"></div>
                    </div>
                )}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="w-full h-full bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 sm:p-7 animate-pulse flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded"></div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-white/5 rounded"></div>
                    <div className="h-4 w-4/6 bg-slate-100 dark:bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    if (!report || !mentor) return null;

    const isNetPos = (summary?.monthlyNetProfitTL || 0) >= 0;
    const activeSymbols = mentor.topContributors?.map(c => c.symbol) || [];

    return (
        <article className="w-full h-full bg-gradient-to-b from-white via-white to-[#F0F5FF]/70 dark:from-[#040989]/30 dark:via-[#040989]/20 dark:to-[#02041A]/60 border-t-2 border-t-[#004BFA] border-x border-b border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            {/* 1. Editoryal Üst Başlık (Monokrom, temiz) */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-white/10 border border-blue-200/60 dark:border-white/10 flex items-center justify-center text-[#004BFA] dark:text-[#93C5FD]">
                        <Compass className="w-4 h-4 text-current" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                            {period?.monthLabel || "Geçen Ayın"} Anatomisi & Mentör Çıkarımları
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">Net Değişim:</span>
                    <span className={`font-semibold font-numbers ${isNetPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isNetPos ? '+' : ''}%{summary?.monthlyNetProfitPct.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* 2. Ana Gövde (Editoryal Metin & Büyüme Analizi) */}
            <div className="p-6 space-y-5 flex-1">
                
                {/* Giriş Kanca Cümlesi */}
                <p className="text-xs sm:text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed pb-3 border-b border-slate-100 dark:border-white/5">
                    <WikipediaEntityText text={mentor.greetingSentence} activeSymbols={activeSymbols} variant="light" />
                </p>

                {/* Mentör Paragrafları (Wikipedia Tarzı Canlı Varlık/Haber Köprüleri) */}
                <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {mentor.narrativeParagraphs.map((para, idx) => (
                        <p key={idx} className="tracking-normal">
                            <WikipediaEntityText text={para} activeSymbols={activeSymbols} variant="light" />
                        </p>
                    ))}
                </div>

                {/* 3. Büyümenin Lokomotifi Olan Hisseler */}
                {mentor.topContributors && mentor.topContributors.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Büyümeye En Çok Güç Katan Hisseler ({renderTermBadge("Katkı Payı")})</span>
                            </span>
                            <span className="text-[10px] text-slate-400">Ağırlık × Getiri</span>
                        </div>

                        <div className="space-y-2">
                            {mentor.topContributors.map((c, i) => (
                                <div 
                                    key={i} 
                                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <StockLogo symbol={c.symbol} className="w-6 h-6 object-contain shrink-0" />
                                        <div className="min-w-0">
                                            <div className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                                                {c.symbol} <span className="text-[10px] font-normal text-slate-400">• {c.sector}</span>
                                            </div>
                                            <Link 
                                                href={`/dashboard/news?q=${c.symbol}`}
                                                className="text-[11px] text-[#004BFA] dark:text-[#93C5FD] hover:underline truncate mt-0.5 block transition-colors cursor-pointer"
                                                title="İlgili haberi ve şirket gelişmelerini görüntüle"
                                            >
                                                {c.story}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="font-semibold font-numbers text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-0.5">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +%{c.returnPct.toFixed(1)}
                                        </div>
                                        <div className="text-[10px] font-numbers text-slate-400">
                                            Katkı: +%{c.contributionPct.toFixed(1)} Puan
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}
