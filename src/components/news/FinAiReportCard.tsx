"use client";

import React from "react";
import { Sparkles, FileText, ThumbsUp, GitFork, Eye } from "lucide-react";
import { FinAiReport } from "@/app/api/news/article/route";

interface FinAiReportCardProps {
    report?: FinAiReport | null;
    fallbackSummary?: string;
    className?: string;
}

export function FinAiReportCard({ report, fallbackSummary, className = "" }: FinAiReportCardProps) {
    const summary = report?.summary || fallbackSummary;
    if (!summary) return null;

    const whyImportant = report?.whyImportant;
    const possibleImpacts = report?.possibleImpacts && report.possibleImpacts.length > 0 ? report.possibleImpacts : null;
    const watchPoints = report?.watchPoints && report.watchPoints.length > 0 ? report.watchPoints : null;

    return (
        <div className={`bg-white border border-[#D6E4FF] rounded-2xl p-5 sm:p-6 shadow-xs transition-all duration-300 group ${className}`}>
            {/* Header: Title is directly "Özet" without the badge */}
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#D6E4FF]/60 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 border border-[#D6E4FF]/70 flex items-center justify-center text-[#004BFA] shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-[#004BFA]" />
                    </div>
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] tracking-tight">
                        Özet
                    </h3>
                </div>
            </div>

            <div className="space-y-4">
                {/* 1. Kısa Özet */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989]">
                        <FileText className="w-3.5 h-3.5 text-[#004BFA] shrink-0" />
                        <span>Kısa Özet</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#040989]/80 leading-relaxed font-normal pl-5.5">
                        {summary}
                    </p>
                </div>

                {/* 2. Neden Önemli? (Varsa) */}
                {whyImportant && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989]">
                            <ThumbsUp className="w-3.5 h-3.5 text-[#004BFA] shrink-0" />
                            <span>Neden Önemli?</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-[#040989]/80 leading-relaxed font-normal pl-5.5">
                            {whyImportant}
                        </p>
                    </div>
                )}

                {/* 3. Neleri Etkileyebilir? (Varsa) */}
                {possibleImpacts && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989]">
                            <GitFork className="w-3.5 h-3.5 text-[#004BFA] shrink-0" />
                            <span>Neleri Etkileyebilir?</span>
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#040989]/80 pl-5.5">
                            {possibleImpacts.map((impact, idx) => (
                                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA] mt-1.5 shrink-0" />
                                    <span>{impact}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Nelere Dikkat Edilmeli? (Varsa) */}
                {watchPoints && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989]">
                            <Eye className="w-3.5 h-3.5 text-[#004BFA] shrink-0" />
                            <span>Nelere Dikkat Edilmeli?</span>
                        </div>
                        <div className="space-y-1 text-xs sm:text-[13px] text-[#040989]/80 pl-5.5">
                            {watchPoints.map((point, idx) => (
                                <p key={idx} className="leading-relaxed">
                                    {point}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
