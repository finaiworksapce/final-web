"use client";

import React from "react";
import { 
    TrendingUp, 
    Compass, 
    ArrowUpRight, 
    ArrowDownRight 
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

export default function MonthlyLastMonthSummaryWidget({
    report,
    loading
}: MonthlyLastMonthSummaryWidgetProps) {
    const mentor = report?.mentorSummary;
    const summary = report?.summary;
    const period = report?.period;

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

    const netTL = summary?.monthlyNetProfitTL || 0;
    const isNetPos = netTL >= 0;
    const activeSymbols = (mentor.keyMovements || mentor.topContributors || []).map(c => c.symbol);

    const movements = (mentor.keyMovements && mentor.keyMovements.length > 0)
        ? mentor.keyMovements
        : (mentor.topContributors || []).map(c => ({
            symbol: c.symbol,
            sector: c.sector,
            returnTL: c.returnTL !== undefined ? c.returnTL : c.contributionTL,
            isGain: c.isGain !== undefined ? c.isGain : (c.returnPct >= 0),
            story: c.story
        }));

    return (
        <article className="w-full h-full bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            {/* 1. Editoryal Üst Başlık (Sade, Yüzdesiz, Saf TL) */}
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
                    <span className={`font-semibold font-numbers tabular-nums text-sm ${isNetPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isNetPos ? '+' : '-'}{Math.abs(netTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL
                    </span>
                </div>
            </div>

            {/* 2. Ana Gövde (Editoryal Metin & TL Bazlı Analiz) */}
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

                {/* 3. Ayın En Çok Kazandıran ve Kaybettiren Varlıkları & Sektörleri (Katkı Payı Yok, Sadece TL) */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-[#004BFA]" />
                            <span>Ayın En Çok Kazandıran ve Kaybettiren Varlıkları</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Net TL Değişimi</span>
                    </div>

                    {/* Sektörel Liderler Özeti */}
                    {(mentor.topGainingSector || mentor.topLosingSector) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {mentor.topGainingSector && (
                                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30 flex items-center justify-between">
                                    <span className="text-emerald-800 dark:text-emerald-300 font-medium truncate">
                                        ▲ En Çok Kazandıran Sektör: <strong>{mentor.topGainingSector.sectorName}</strong>
                                    </span>
                                    <span className="font-numbers font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">
                                        +{Math.abs(mentor.topGainingSector.gainTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL
                                    </span>
                                </div>
                            )}
                            {mentor.topLosingSector && (
                                <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/30 flex items-center justify-between">
                                    <span className="text-rose-800 dark:text-rose-300 font-medium truncate">
                                        ▼ En Çok Kaybettiren Sektör: <strong>{mentor.topLosingSector.sectorName}</strong>
                                    </span>
                                    <span className="font-numbers font-semibold text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                                        -{Math.abs(mentor.topLosingSector.lossTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Varlık Bazlı Liste */}
                    <div className="space-y-2">
                        {movements.map((m, i) => (
                            <div 
                                key={i} 
                                className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <StockLogo symbol={m.symbol} className="w-6 h-6 object-contain shrink-0" />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                                            <Link 
                                                href={`/dashboard/analysis?q=${m.symbol}`}
                                                className="hover:underline text-[#004BFA] dark:text-[#93C5FD]"
                                                title={`${m.symbol} Şirket Analiz Sayfası`}
                                            >
                                                {m.symbol}
                                            </Link>
                                            <span className="text-[10px] font-normal text-slate-400 ml-1.5">• {m.sector}</span>
                                        </div>
                                        <Link 
                                            href={`/dashboard/news?q=${m.symbol}`}
                                            className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-[#004BFA] hover:underline truncate mt-0.5 block transition-colors cursor-pointer"
                                            title="İlgili haberi ve şirket gelişmelerini görüntüle"
                                        >
                                            {m.story}
                                        </Link>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className={`font-semibold font-numbers flex items-center justify-end gap-0.5 text-xs sm:text-[13px] ${
                                        m.isGain ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                    }`}>
                                        {m.isGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {m.isGain ? '+' : '-'}{Math.abs(m.returnTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL
                                    </div>
                                    <div className="text-[10px] font-numbers text-slate-400">
                                        {m.isGain ? 'Net Kazanç' : 'Net Kayıp'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </article>
    );
}
