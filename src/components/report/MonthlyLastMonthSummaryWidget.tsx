"use client";

import React, { useState } from "react";
import { 
    TrendingUp, 
    Compass, 
    ArrowUpRight, 
    ArrowDownRight,
    ChevronDown,
    ChevronUp
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
    const [isExpanded, setIsExpanded] = useState(false);
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

    const rawParagraphs = mentor.narrativeParagraphs && mentor.narrativeParagraphs.length > 0
        ? mentor.narrativeParagraphs.flatMap(p => p.split(/\n\n+/))
        : [mentor.greetingSentence].filter(Boolean);

    const canExpand = rawParagraphs.length > 4;
    const displayedParagraphs = !isExpanded && canExpand
        ? rawParagraphs.slice(0, 4)
        : rawParagraphs;

    return (
        <article className="w-full h-full bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-start">
            {/* 1. Editoryal Üst Başlık */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-white/10 border border-blue-200/60 dark:border-white/10 flex items-center justify-center text-[#004BFA] dark:text-[#93C5FD]">
                        <Compass className="w-4 h-4 text-current" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                            Bu Ayın Özeti
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

            {/* 2. Ana Gövde: Anlatım ve Bulgular (2. Bulguda 'Daha Fazla' Açılımı) */}
            <div className="p-6 flex-1 flex flex-col justify-start">
                <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 tracking-normal space-y-3.5">
                    {displayedParagraphs.map((para, idx) => (
                        <p key={idx} className="leading-relaxed">
                            <WikipediaEntityText text={para} activeSymbols={activeSymbols} variant="light" />
                            {canExpand && !isExpanded && idx === 3 && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className="inline-flex items-center gap-1 ml-1.5 font-semibold text-[#004BFA] dark:text-[#93C5FD] hover:underline cursor-pointer transition-colors"
                                >
                                    <span>[Daha Fazla]</span>
                                    <ChevronDown className="w-3.5 h-3.5 inline-block" />
                                </button>
                            )}
                        </p>
                    ))}
                </div>

                {canExpand && isExpanded && (
                    <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#004BFA] dark:text-[#93C5FD] hover:underline cursor-pointer transition-colors"
                        >
                            <span>[Daha Az Göster]</span>
                            <ChevronUp className="w-3.5 h-3.5 inline-block" />
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}
