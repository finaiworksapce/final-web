"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Zap, FileText } from "lucide-react";
import { EnrichedNewsItem } from "@/app/api/news/route";
import { NewsThumbnail } from "@/components/news/NewsThumbnail";

interface NewsHeroCardProps {
    mainNews: EnrichedNewsItem;
    subNews: EnrichedNewsItem[];
}

export function NewsHeroCard({ mainNews, subNews }: NewsHeroCardProps) {
    const [bgImageError, setBgImageError] = useState(false);

    if (!mainNews) return null;

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

    const formatClockTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } catch {
            return "";
        }
    };

    const hasValidBg = mainNews.imageUrl && !bgImageError;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* SOL KART: %60 Genişlik (lg:col-span-7) - Günün Öne Çıkanı */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-7 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group border border-slate-200/90 min-h-[380px] sm:min-h-[420px] bg-slate-900"
            >
                {/* 1. Arka Plan Görseli (object-cover) */}
                {hasValidBg && (
                    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                        <img
                            src={mainNews.imageUrl!}
                            alt={mainNews.title}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            onError={() => setBgImageError(true)}
                        />
                    </div>
                )}

                {/* 2. REFERANS TASARIMDAKİ KONTROLLÜ YATAY GRADIENT:
                    Sol taraftaki metinlerin arkası koyu lacivert/siyah, sağ taraftaki fotoğraf ise tamamen aydınlık ve görünür */}
                <div 
                    className={`absolute inset-0 z-[1] transition-opacity duration-300 ${
                        hasValidBg 
                            ? "bg-gradient-to-r from-slate-950/95 via-slate-950/70 md:via-slate-950/60 to-transparent"
                            : "bg-gradient-to-br from-[#00008B] via-[#000066] to-[#0a1e3d]"
                    }`} 
                />

                {/* Ek olarak alttaki CTA buton ve zaman alanının okunabilirliği için çok hafif alt gradient */}
                {hasValidBg && (
                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                )}

                {/* 3. Üst Etiketler (Kategori Rozeti) */}
                <div className="relative z-10 p-5 sm:p-7 md:p-8 flex items-center justify-between gap-3">
                    <span className="px-3 py-1 bg-blue-900/85 hover:bg-blue-900 text-white text-[10px] sm:text-[11px] font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs">
                        {mainNews.categoryLabel || "Küresel Piyasalar"}
                    </span>
                </div>

                {/* 4. Başlık ve Kısa Özet (Sol %65 genişlik alanı ile sınırlı) */}
                <div className="relative z-10 px-5 sm:px-7 md:px-8 my-auto max-w-xl space-y-2.5">
                    <Link href={`/dashboard/news/${mainNews.slug}`} className="block group/link">
                        <h2 className="text-xl sm:text-2xl md:text-[28px] font-black leading-snug tracking-tight text-white group-hover/link:text-blue-200 transition-colors line-clamp-2 drop-shadow-md">
                            {mainNews.title}
                        </h2>
                    </Link>

                    <p className="text-slate-200/90 text-xs sm:text-[13px] font-normal leading-relaxed line-clamp-2 max-w-lg drop-shadow-sm">
                        {mainNews.description}
                    </p>
                </div>

                {/* 5. Alt Bölüm: Kaynak, Zaman ve "Haberi Oku →" Butonu */}
                <div className="relative z-10 p-5 sm:p-7 md:p-8 pt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium drop-shadow-sm">
                        <span className="font-bold text-white">{mainNews.source}</span>
                        <span className="text-white/50">•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-slate-300" />
                            {formatTimeAgo(mainNews.pubDate)}
                        </span>
                    </div>

                    <Link
                        href={`/dashboard/news/${mainNews.slug}`}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                        <FileText className="w-3.5 h-3.5 text-blue-700" />
                        Haberi Oku <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                    </Link>
                </div>
            </motion.div>

            {/* SAĞ PANEL: %40 Genişlik (lg:col-span-5) - Son Dakika Haberleri */}
            <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                {/* Panel Başlığı */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-2 shrink-0">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600 fill-current" />
                        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
                            Son Dakika Haberleri
                        </h3>
                    </div>

                    <Link
                        href="#all-news"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                        Tümünü Gör <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* 4 Son Haber Satırı */}
                <div className="divide-y divide-slate-100 flex-1 flex flex-col justify-around">
                    {subNews.slice(0, 4).map((item, idx) => (
                        <Link
                            key={item.id || idx}
                            href={`/dashboard/news/${item.slug}`}
                            className="group py-2.5 first:pt-1 last:pb-1 flex items-center gap-3 hover:bg-slate-50/70 rounded-xl px-2 -mx-2 transition-colors cursor-pointer"
                        >
                            {/* Sabit Ölçü ve Aspect Ratio'da Thumbnail (Referans görseldeki kompakt ölçü) */}
                            <NewsThumbnail
                                imageUrl={item.imageUrl}
                                title={item.title}
                                className="w-[72px] h-[52px] sm:w-[80px] sm:h-[56px] rounded-xl shrink-0"
                            />

                            {/* Metin Alanı */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {item.categoryLabel || "Dünya"}
                                    </span>
                                </div>

                                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                                    {item.title}
                                </h4>

                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                                    <span className="font-medium text-slate-500">{item.source}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                                        {formatTimeAgo(item.pubDate)}
                                    </span>
                                </div>
                            </div>

                            {/* Sağ Saat & Yön Oku */}
                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-1">
                                <span className="hidden sm:inline-block font-semibold text-slate-400">
                                    {formatClockTime(item.pubDate)}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
