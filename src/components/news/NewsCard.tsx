"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { EnrichedNewsItem } from "@/app/api/news/route";
import { NewsThumbnail } from "@/components/news/NewsThumbnail";

interface NewsCardProps {
    item: EnrichedNewsItem;
    index: number;
}

export function NewsCard({ item, index }: NewsCardProps) {
    const formatTimeAgo = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 60) return `${Math.max(1, diffMin)} dk önce`;
            const diffHours = Math.floor(diffMin / 60);
            if (diffHours < 24) return `${diffHours} saat önce`;
            return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        } catch {
            return "Bugün";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.3) }}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 hover:border-blue-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-full relative"
        >
            <div>
                {/* Üst Kısım: Yatay Thumbnail + Sağ tarafta Kategori & Başlık */}
                <div className="flex items-start gap-3 sm:gap-3.5 mb-2.5">
                    {/* Referans görseldeki gibi temiz orantılı thumbnail */}
                    <NewsThumbnail
                        imageUrl={item.imageUrl}
                        title={item.title}
                        className="w-[96px] h-[72px] sm:w-[104px] sm:h-[78px] rounded-xl shrink-0"
                    />

                    {/* Sağ Taraf: Kategori & Başlık */}
                    <div className="min-w-0 flex-1">
                        <span className="inline-block text-[9px] sm:text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100/80 px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                            {item.categoryLabel || "Küresel Piyasalar"}
                        </span>

                        <Link href={`/dashboard/news/${item.slug}`} className="block">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 leading-snug transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                    </div>
                </div>

                {/* Kısa Açıklama */}
                <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2 mt-1 mb-3">
                    {item.description}
                </p>
            </div>

            {/* Alt Kontroller: Kaynak, Zaman & "Haberi Oku →" Butonu */}
            <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate pr-2">
                    <span className="text-slate-600 font-semibold truncate">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 shrink-0 text-slate-400">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimeAgo(item.pubDate)}
                    </span>
                </div>

                <Link
                    href={`/dashboard/news/${item.slug}`}
                    className="px-3.5 py-1.5 bg-[#00008B] hover:bg-[#0808a3] text-white text-[11px] font-bold rounded-lg shadow-2xs flex items-center gap-1 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                >
                    Haberi Oku <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </motion.div>
    );
}
