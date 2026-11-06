const fs = require('fs');
const path = require('path');

// 1. DailyAgendaWidget.tsx
const agendaPath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let agenda = fs.readFileSync(agendaPath, 'utf-8');

// Replace container and top area
agenda = agenda.replace(
    `    return (
        <div className="bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f0f6fe_100%)] border border-slate-200/70 hover:border-blue-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-[395px] group relative overflow-hidden">
            {/* Arka Plan Hafif Soft Parıltı */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

            {/* 1. Üst Başlık & Kategori Filtreleri (Sabit Üst Alan) */}
            <div className="relative z-10 shrink-0">
                {/* Başlık Satırı */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
                                Günlük Ajanda
                            </h3>
                            <span className="text-[11px] font-medium text-slate-400">
                                ({todayFormattedDate})
                            </span>
                        </div>
                    </div>

                    <Link
                        href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                    >
                        <span>Tümünü Gör</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Kategori Filtre Sekmeleri */}
                <div className="flex items-center gap-1 overflow-x-auto py-2.5 custom-scrollbar">
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id)}
                                className={\`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 \${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                                }\`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>`,
    `    return (
        <div className="bg-white border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[395px] group relative overflow-hidden">
            {/* 1. Üst Başlık & Kategori Filtreleri */}
            <div className="relative z-10 shrink-0">
                {/* Başlık Satırı */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#78B8F5]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#78B8F5]/20 border border-[#78B8F5]/40 flex items-center justify-center text-[#142B50] shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#142B50]" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#142B50] tracking-tight">
                                Günlük Ajanda
                            </h3>
                            <span className="text-[11px] zodiak-desc font-[225] text-[#142B50]/60">
                                ({todayFormattedDate})
                            </span>
                        </div>
                    </div>

                    <Link
                        href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                        className="inline-flex items-center gap-1 text-xs zodiak-subtitle font-[325] text-[#142B50] hover:text-[#78B8F5] transition-colors group/link"
                    >
                        <span>Tümünü Gör</span>
                        <ArrowRight className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Kategori Filtre Sekmeleri */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 custom-scrollbar">
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id)}
                                className={\`px-3 py-1 text-xs zodiak-subtitle font-[325] rounded-lg transition-all shrink-0 \${
                                    isActive
                                        ? "bg-[#142B50] text-white shadow-xs"
                                        : "bg-[#78B8F5]/15 text-[#142B50] hover:bg-[#78B8F5]/30"
                                }\`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>`
);

// Replace rows and footer in DailyAgendaWidget
agenda = agenda.replace(
    `<Link
                                key={item.id}
                                href={item.link || '/dashboard/calendar'}
                                className="flex items-center justify-between gap-2.5 py-2.5 px-1 hover:bg-slate-50/80 rounded-lg transition-colors group/item block"
                            >
                                {/* Sol: Saat (Yalnızca Ekonomik verilerde) + Ülke / Sembol */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.category === 'economic' && item.time ? (
                                        <span className="text-xs font-mono font-semibold text-slate-500 w-11 shrink-0">
                                            {item.time}
                                        </span>
                                    ) : null}
                                    {item.category === 'economic' ? (
                                        <span className="text-xs font-bold text-slate-700 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 shrink-0 min-w-[32px] text-center">
                                            {item.symbolOrCountry}
                                        </span>
                                    ) : (
                                        <div className="flex items-center justify-center shrink-0">
                                            <StockLogo symbol={item.symbolOrCountry} className="w-8 h-8 ring-1 ring-slate-200/60 shadow-xs" />
                                        </div>
                                    )}
                                </div>

                                {/* Orta: Başlık ve Yardımcı Değer */}
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="text-xs font-semibold text-slate-800 truncate group-hover/item:text-blue-600 transition-colors">
                                        {item.title}
                                    </div>
                                    {item.auxiliaryText && (
                                        <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                                            {item.auxiliaryText}
                                        </div>
                                    )}
                                </div>

                                {/* Sağ: Etki + Kategori Badge */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {renderImpactBars(item.impact)}
                                    <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 \${item.badgeColor}\`}>
                                        {item.categoryLabel}
                                    </span>
                                </div>
                            </Link>`,
    `<Link
                                key={item.id}
                                href={item.link || '/dashboard/calendar'}
                                className="flex items-center justify-between gap-2.5 py-2 px-1.5 hover:bg-[#78B8F5]/10 rounded-xl transition-colors group/item block"
                            >
                                {/* Sol: Saat (Yalnızca Ekonomik verilerde) + Ülke / Sembol */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.category === 'economic' && item.time ? (
                                        <span className="text-xs font-mono zodiak-subtitle font-[325] text-[#142B50]/70 w-11 shrink-0">
                                            {item.time}
                                        </span>
                                    ) : null}
                                    {item.category === 'economic' ? (
                                        <span className="text-xs zodiak-subtitle font-[325] text-[#142B50] px-2 py-0.5 rounded-md bg-[#78B8F5]/20 border border-[#78B8F5]/40 shrink-0 min-w-[32px] text-center">
                                            {item.symbolOrCountry}
                                        </span>
                                    ) : (
                                        <div className="flex items-center justify-center shrink-0">
                                            <StockLogo symbol={item.symbolOrCountry} className="w-8 h-8 ring-1 ring-[#78B8F5]/40 shadow-xs" />
                                        </div>
                                    )}
                                </div>

                                {/* Orta: Başlık ve Yardımcı Değer */}
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="text-xs zodiak-subtitle font-[325] text-[#142B50] truncate group-hover/item:text-[#142B50]">
                                        {item.title}
                                    </div>
                                    {item.auxiliaryText && (
                                        <div className="text-[10px] zodiak-desc font-[225] text-[#142B50]/60 truncate mt-0.5">
                                            {item.auxiliaryText}
                                        </div>
                                    )}
                                </div>

                                {/* Sağ: Etki + Kategori Badge */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {renderImpactBars(item.impact)}
                                    <span className="text-[10px] zodiak-subtitle font-[325] px-2 py-0.5 rounded-md shrink-0 bg-[#78B8F5]/20 text-[#142B50] border border-[#78B8F5]/30">
                                        {item.categoryLabel}
                                    </span>
                                </div>
                            </Link>`
);

agenda = agenda.replace(
    `<div className="relative z-10 shrink-0 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] text-slate-500">Bugünün piyasa ve şirket gelişmeleri</span>
                </div>

                <Link
                    href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                >
                    <span>Tüm Takvim</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>`,
    `<div className="relative z-10 shrink-0 pt-2.5 border-t border-[#78B8F5]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#142B50]" />
                    <span className="text-[11px] zodiak-desc font-[225] text-[#142B50]/70">Bugünün piyasa ve şirket gelişmeleri</span>
                </div>

                <Link
                    href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                    className="text-[11px] zodiak-subtitle font-[325] text-[#142B50] hover:text-[#78B8F5] transition-colors inline-flex items-center gap-1"
                >
                    <span>Tüm Takvim</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>`
);

fs.writeFileSync(agendaPath, agenda, 'utf-8');
console.log("DailyAgendaWidget.tsx updated successfully.");

// 2. LatestNewsWidget.tsx
const newsPath = path.join(__dirname, '../src/components/dashboard/LatestNewsWidget.tsx');
let news = fs.readFileSync(newsPath, 'utf-8');

const updatedNewsWidget = `"use client";

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
        <div className="bg-white border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
            {/* 1. Başlık Alanı */}
            <div className="flex items-center justify-between pb-3 border-b border-[#78B8F5]/20 shrink-0 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#78B8F5]/20 border border-[#78B8F5]/40 flex items-center justify-center text-[#142B50] shrink-0">
                        <Newspaper className="w-3.5 h-3.5 text-[#142B50]" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#142B50] tracking-tight">
                            Son Haberler
                        </h3>
                    </div>
                </div>
                <Link
                    href="/dashboard/news"
                    className="inline-flex items-center gap-1.5 text-xs zodiak-subtitle font-[325] bg-[#78B8F5]/15 text-[#142B50] hover:bg-[#78B8F5]/30 px-3 py-1 rounded-lg transition-colors"
                >
                    <span>Tüm Haberler</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* 2. Haber Listesi: 5 Kolonlu Kartlar */}
            {newsList.length > 0 ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#78B8F5]/20 gap-2 sm:gap-0">
                    {newsList.map((item, idx) => {
                        const href = item.slug
                            ? \`/dashboard/news/\${item.slug}\`
                            : item.link
                            ? \`/dashboard/news?url=\${encodeURIComponent(item.link)}\`
                            : "/dashboard/news";

                        return (
                            <Link
                                key={item.id || idx}
                                href={href}
                                className="group flex items-start gap-2.5 sm:gap-3 p-2 sm:px-3 sm:py-2 hover:bg-[#78B8F5]/10 rounded-2xl transition-colors min-w-0"
                            >
                                <NewsThumbnail 
                                    imageUrl={item.imageUrl} 
                                    title={item.title} 
                                    className="w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] xl:w-[82px] xl:h-[82px] rounded-xl border border-[#78B8F5]/30 shadow-xs"
                                />

                                {/* Sağ Bilgi Alanı */}
                                <div className="min-w-0 flex-1 flex flex-col justify-between h-[70px] sm:h-[76px] xl:h-[82px]">
                                    <span className="text-[11px] sm:text-xs zodiak-desc font-[225] text-[#142B50]/60">
                                        {formatClockTime(item.pubDate)}
                                    </span>

                                    <h4 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#142B50] leading-snug line-clamp-2 my-auto">
                                        {item.title}
                                    </h4>

                                    <div>
                                        <span className="inline-block text-[10px] zodiak-desc font-[225] text-[#142B50] bg-[#78B8F5]/20 border border-[#78B8F5]/30 px-2 py-0.5 rounded-md">
                                            {item.categoryLabel || "Ekonomi"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-10 text-center text-xs zodiak-desc font-[225] text-[#142B50]/60">
                    Henüz gösterilecek haber bulunmuyor.
                </div>
            )}
        </div>
    );
}
`;

fs.writeFileSync(newsPath, updatedNewsWidget, 'utf-8');
console.log("LatestNewsWidget.tsx updated successfully.");
`;

fs.writeFileSync(path.join(__dirname, 'patch_agenda_and_news.js'), updatedScript, 'utf-8');
