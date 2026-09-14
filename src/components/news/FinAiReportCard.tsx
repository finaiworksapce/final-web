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
        <div className={`bg-[#0b192c] text-white border border-[#1a2f4c] shadow-xl shadow-black/30 rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all group ${className}`}>
            {/* Subtle Ambient Glows matching Toplam Varlık Değeri */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Title is directly "Özet" */}
            <div className="relative z-10 flex items-center justify-between gap-2 pb-3.5 border-b border-white/15 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight">
                        Özet
                    </h3>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-[10px] font-semibold text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>FinAi Akıllı Analiz</span>
                </div>
            </div>

            <div className="relative z-10 space-y-4 text-slate-200">
                {/* 1. Kısa Özet */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Kısa Özet</span>
                    </div>
                    <p className="text-xs text-slate-200/90 leading-relaxed font-normal pl-5.5">
                        {summary}
                    </p>
                </div>

                {/* 2. Neden Önemli? (Varsa) */}
                {whyImportant && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <ThumbsUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Neden Önemli?</span>
                        </div>
                        <p className="text-xs text-slate-200/90 leading-relaxed font-normal pl-5.5">
                            {whyImportant}
                        </p>
                    </div>
                )}

                {/* 3. Neleri Etkileyebilir? (Varsa) */}
                {possibleImpacts && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <GitFork className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Neleri Etkileyebilir?</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-200/90 pl-5.5">
                            {possibleImpacts.map((impact, idx) => (
                                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                    <span>{impact}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. Nelere Dikkat Edilmeli? (Varsa) */}
                {watchPoints && (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>Nelere Dikkat Edilmeli?</span>
                        </div>
                        <div className="space-y-1 text-xs text-slate-200/90 pl-5.5">
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
