"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";

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

import { NewsThumbnail } from "@/components/news/NewsThumbnail";

export function LatestNewsWidget({ news }: LatestNewsWidgetProps) {
    // 5 adet yatay kart eşit aralıklarla yan yana dizilir
    const newsList = Array.isArray(news) ? news.slice(0, 5) : [];

    return (
        <div className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full">
            {/* 1. Başlık Alanı */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100/80 shrink-0 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Newspaper className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
                            Son Haberler
                        </h3>
                    </div>
                </div>
                <Link
                    href="/dashboard/news"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                >
                    Tümü <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* 2. Haber Listesi: 5 Kolonlu Yatay Kartlar */}
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
                                className="group flex items-start gap-2.5 sm:gap-3 p-2 sm:px-3 sm:py-1.5 hover:bg-slate-50/70 rounded-xl transition-colors min-w-0"
                            >
                                <NewsThumbnail 
                                    imageUrl={item.imageUrl} 
                                    title={item.title} 
                                    className="w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] xl:w-[82px] xl:h-[82px] rounded-xl"
                                />

                                {/* Sağ Bilgi Alanı: Saat + Başlık + Kategori */}
                                <div className="min-w-0 flex-1 flex flex-col justify-between h-[70px] sm:h-[76px] xl:h-[82px]">
                                    {/* Saat */}
                                    <span className="text-[11px] sm:text-xs font-medium text-slate-400">
                                        {formatClockTime(item.pubDate)}
                                    </span>

                                    {/* Başlık */}
                                    <h4 className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 my-auto">
                                        {item.title}
                                    </h4>

                                    {/* Kategori Badge */}
                                    <div>
                                        <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                                            {item.categoryLabel || "Ekonomi"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-10 text-center text-xs font-semibold text-slate-400">
                    Henüz gösterilecek haber bulunmuyor.
                </div>
            )}
        </div>
    );
}
