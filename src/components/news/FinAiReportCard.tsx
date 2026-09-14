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
        <div className={`bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_45%,#f0f6fe_100%)] border border-slate-200/80 hover:border-blue-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-300 group ${className}`}>
            {/* Header: Title is directly "Özet" with soft blue theme */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100/90 mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100/90 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-black text-[#00008B] tracking-tight">
                        Özet
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/90 border border-blue-100/90 text-xs font-bold text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span>FinAi Akıllı Analiz</span>
                </div>
            </div>

            <div className="space-y-5">
                {/* 1. Kısa Özet */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-[13px] sm:text-sm font-bold text-slate-900">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Kısa Özet</span>
                    </div>
                    <p className="text-[13px] sm:text-[13.5px] text-slate-700 leading-relaxed font-normal pl-6.5">
                        {summary}
                    </p>
                </div>

                {/* 2. Neden Önemli? (Varsa) */}
                {whyImportant && (
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2.5 text-[13px] sm:text-sm font-bold text-slate-900">
                            <ThumbsUp className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Neden Önemli?</span>
                        </div>
                        <p className="text-[13px] sm:text-[13.5px] text-slate-700 leading-relaxed font-normal pl-6.5">
                            {whyImportant}
                        </p>
                    </div>
                )}

                {/* 3. Neleri Etkileyebilir? (Varsa) */}
                {possibleImpacts && (
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2.5 text-[13px] sm:text-sm font-bold text-slate-900">
                            <GitFork className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Neleri Etkileyebilir?</span>
                        </div>
                        <ul className="space-y-2 text-[13px] sm:text-[13.5px] text-slate-700 pl-6.5">
                            {possibleImpacts.map((impact, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <span>{impact}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Nelere Dikkat Edilmeli? (Varsa) */}
                {watchPoints && (
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2.5 text-[13px] sm:text-sm font-bold text-slate-900">
                            <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Nelere Dikkat Edilmeli?</span>
                        </div>
                        <div className="space-y-1.5 text-[13px] sm:text-[13.5px] text-slate-700 pl-6.5">
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
