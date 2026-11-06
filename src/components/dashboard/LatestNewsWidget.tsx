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
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4FF]/50 shrink-0 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/30 border border-[#D6E4FF]/60 flex items-center justify-center text-[#040989] shrink-0">
                        <Newspaper className="w-3.5 h-3.5 text-[#040989]" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] tracking-tight">
                            Son Haberler
                        </h3>
                    </div>
                </div>
                <Link
                    href="/dashboard/news"
                    className="inline-flex items-center gap-1.5 text-xs clash-subtitle font-[325] bg-[#004BFA] text-[#F5F7FA] font-medium hover:bg-[#004BFA]/90 shadow-sm shadow-[#004BFA]/20 px-3 py-1 rounded-lg shadow-xs transition-colors"
                >
                    <span>Tüm Haberler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* 2. Haber Listesi: 5 Kolonlu Kartlar */}
            {newsList.length > 0 ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#D6E4FF]/40 gap-2 sm:gap-0">
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
                                className="group flex items-start gap-2.5 sm:gap-3 p-2 sm:px-3 sm:py-2 hover:bg-[#D6E4FF]/20 rounded-2xl transition-colors min-w-0"
                            >
                                <NewsThumbnail 
                                    imageUrl={item.imageUrl} 
                                    title={item.title} 
                                    className="w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] xl:w-[82px] xl:h-[82px] rounded-xl border border-[#D6E4FF]/50 shadow-xs"
                                />

                                {/* Sağ Bilgi Alanı */}
                                <div className="min-w-0 flex-1 flex flex-col justify-between h-[70px] sm:h-[76px] xl:h-[82px]">
                                    <span className="text-[11px] sm:text-xs font-numbers text-[#040989]/70">
                                        {formatClockTime(item.pubDate)}
                                    </span>

                                    <h4 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] leading-snug line-clamp-2 my-auto">
                                        {item.title}
                                    </h4>

                                    <div>
                                        <span className="inline-block text-[10px] clash-subtitle font-[325] text-[#004BFA] uppercase tracking-wider">
                                            {item.categoryLabel || "Ekonomi"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-10 text-center text-xs clash-desc font-[225] text-[#040989]/60">
                    Henüz gösterilecek haber bulunmuyor.
                </div>
            )}
        </div>
    );
}
