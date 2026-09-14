"use client";

import React from "react";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { EnrichedNewsItem } from "@/app/api/news/route";
import { NewsThumbnail } from "@/components/news/NewsThumbnail";

interface RelatedNewsWidgetProps {
    items: EnrichedNewsItem[];
    limit?: number;
    className?: string;
}

export function RelatedNewsWidget({ items, limit = 6, className = "" }: RelatedNewsWidgetProps) {
    if (!items || items.length === 0) return null;

    const displayItems = items.slice(0, limit);

    return (
        <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs ${className}`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Newspaper className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-[#00008B] tracking-tight">
                        İlgili Haberler
                    </h3>
                </div>
                <Link 
                    href="/dashboard/news" 
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:underline"
                >
                    Tümünü Gör <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="divide-y divide-slate-100">
                {displayItems.map((item, idx) => (
                    <Link
                        key={item.id || idx}
                        href={`/dashboard/news/${item.slug}`}
                        className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5 group transition-all hover:bg-slate-50/70 -mx-2 px-2 rounded-xl"
                    >
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0">
                            <NewsThumbnail
                                imageUrl={item.imageUrl}
                                title={item.title}
                                aspectRatio="square"
                                className="w-full h-full rounded-xl"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded-md uppercase tracking-wider mb-1">
                                {item.categoryLabel}
                            </span>
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1">
                                <span>FinAi Ekonomi Masası</span>
                                <span>•</span>
                                <span>{item.readTime || '3 dk'}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
