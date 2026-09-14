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
        <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden transition-all ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-black text-[#00008B] tracking-tight">
                    FinAi Raporu
                </h3>
            </div>

            <div className="space-y-4">
                {/* 1. Kısa Özet */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Kısa Özet</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal pl-5.5">
                        {summary}
                    </p>
                </div>

                {/* 2. Neden Önemli? (Varsa render edilir) */}
                {whyImportant && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <ThumbsUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Neden Önemli?</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal pl-5.5">
                            {whyImportant}
                        </p>
                    </div>
                )}

                {/* 3. Neleri Etkileyebilir? (Varsa render edilir) */}
                {possibleImpacts && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <GitFork className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Neleri Etkileyebilir?</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600 pl-5.5">
                            {possibleImpacts.map((impact, idx) => (
                                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0" />
                                    <span>{impact}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Nelere Dikkat Edilmeli? (Varsa render edilir) */}
                {watchPoints && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Nelere Dikkat Edilmeli?</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600 pl-5.5">
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
