"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { NewsThumbnail } from "@/components/news/NewsThumbnail";

export interface LatestNewsWidgetProps {
    news: any[];
}

function formatClockTime(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "--:--";
    }
}

export function LatestNewsWidget({ news }: LatestNewsWidgetProps) {
    const newsList = Array.isArray(news) ? news.slice(0, 5) : [];

    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            {/* 1. Başlık Alanı */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0E1E38]/5 border border-[#0E1E38]/10 flex items-center justify-center text-[#0E1E38] shrink-0">
                        <Newspaper className="w-3.5 h-3.5 text-[#0E1E38]" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#0E1E38] tracking-tight">
                            Son Haberler
                        </h3>
                    </div>
                </div>
                <Link
                    href="/dashboard/news"
                    className="inline-flex items-center gap-1.5 text-xs zodiak-subtitle font-[325] bg-[#0E1E38] text-white font-normal hover:bg-[#0E1E38]/90 px-3 py-1 rounded-lg shadow-xs transition-colors"
                >
                    <span>Tüm Haberler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* 2. Haber Listesi: 5 Kolonlu Kartlar */}
            {newsList.length > 0 ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-2 sm:gap-0">
                    {newsList.map((item, idx) => {
                        const href = item.slug
                            ? `/dashboard/news/${item.slug}`
                            : item.link
                            ? `/dashboard/news?url=${encodeURIComponent(item.link)}`
                            : "/dashboard/news";

                        return (
                            <Link
                                key={item.id || idx}
                                href={href}
                                className="group flex items-start gap-2.5 sm:gap-3 p-2 sm:px-3 sm:py-2 hover:bg-slate-50 rounded-2xl transition-colors min-w-0"
                            >
                                <NewsThumbnail 
                                    imageUrl={item.imageUrl} 
                                    title={item.title} 
                                    className="w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] xl:w-[82px] xl:h-[82px] rounded-xl border border-slate-100 shadow-xs"
                                />

                                {/* Sağ Bilgi Alanı */}
                                <div className="min-w-0 flex-1 flex flex-col justify-between h-[70px] sm:h-[76px] xl:h-[82px]">
                                    <span className="text-[11px] sm:text-xs font-numbers text-[#0E1E38]/70">
                                        {formatClockTime(item.pubDate)}
                                    </span>

                                    <h4 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#0E1E38] leading-snug line-clamp-2 my-auto">
                                        {item.title}
                                    </h4>

                                    <div>
                                        <span className="inline-block text-[10px] zodiak-desc font-[225] text-[#0E1E38] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                                            {item.categoryLabel || "Ekonomi"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-10 text-center text-xs zodiak-desc font-[225] text-[#0E1E38]/60">
                    Henüz gösterilecek haber bulunmuyor.
                </div>
            )}
        </div>
    );
}
