"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Newspaper,
    RefreshCw,
    Search,
    Filter,
    Coins,
    Building2,
    Sparkles,
    Clock,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/providers/UserProvider";
import { PortfolioService, Asset } from "@/lib/portfolio-service";
import { HalkarzDividendItem } from "@/app/api/halkarz-dividends/route";
import { HalkarzEarningsItem } from "@/app/api/halkarz-earnings/route";

interface AgendaPageEventItem {
    id: string;
    symbol: string;
    companyName: string;
    type: "DIVIDEND" | "EARNINGS";
    typeLabel: string;
    title: string;
    dateStr: string;
    rawDateStr: string;
    isoDate: string;
    isToday: boolean;
    daysUntil: number;
    isInPortfolio: boolean;
    valueFormatted?: string;
    yieldPercent?: number;
}

export default function PortfolioAgendaPage() {
    const { user, isAuthenticated, myAssets } = useUser();
    const [assets, setAssets] = useState<Asset[]>(() => (myAssets && myAssets.length > 0 ? myAssets : []));
    const [dividends, setDividends] = useState<HalkarzDividendItem[]>([]);
    const [earnings, setEarnings] = useState<HalkarzEarningsItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtreler
    const [scopeFilter, setScopeFilter] = useState<"PORTFOLIO" | "ALL">("PORTFOLIO");
    const [categoryFilter, setCategoryFilter] = useState<"ALL" | "TODAY" | "DIVIDEND" | "EARNINGS">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (myAssets && myAssets.length > 0 && assets.length === 0) {
            setAssets(myAssets);
        }
    }, [myAssets, assets.length]);

    const fetchAgendaPageData = async () => {
        setLoading(true);
        try {
            const promises: Promise<any>[] = [
                fetch("/api/halkarz-dividends", { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: [] })),
                fetch("/api/halkarz-earnings", { cache: "no-store" }).then(r => r.json()).catch(() => ({ data: [] }))
            ];

            if (isAuthenticated && user?.id) {
                promises.push(PortfolioService.getAssets(user.id).catch(() => null));
            }

            const [divJson, earnJson, fetchedAssets] = await Promise.all(promises);

            if (divJson?.success && Array.isArray(divJson.data)) {
                setDividends(divJson.data);
            }
            if (earnJson?.success && Array.isArray(earnJson.data)) {
                setEarnings(earnJson.data);
            }
            if (Array.isArray(fetchedAssets) && fetchedAssets.length > 0) {
                setAssets(fetchedAssets);
            }
        } catch (err) {
            console.error("Portföy gündemi yükleme hatası:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgendaPageData();
    }, [isAuthenticated, user?.id]);

    // Kullanıcının aktif portföy sembolleri (Nakit hariç, miktarı > 0 olanlar)
    const portfolioSymbols = useMemo(() => {
        const set = new Set<string>();
        assets.forEach(a => {
            if ((Number(a.quantity) || 0) <= 0) return;
            const sym = (a.symbol || "").toUpperCase().replace(/\.IS$/i, "").trim();
            if (sym && sym !== "NAKİT" && sym !== "TRY_CASH" && a.type !== "CASH") {
                set.add(sym);
            }
        });
        return set;
    }, [assets]);

    // Tüm Gündem Verilerini Birleştirme ve En Yakın Tarihten En Uzak Tarihe Sıralama
    const allEvents = useMemo(() => {
        const todayIstanbulStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
        const todayDate = new Date(todayIstanbulStr);
        const list: AgendaPageEventItem[] = [];

        // 1. Temettü Ödemeleri
        dividends.forEach(div => {
            const sym = (div.symbol || "").toUpperCase().replace(/\.IS$/i, "").trim();
            if (!sym) return;
            if (!div.paymentDate || div.paymentDate.includes("Açıklanmadı") || div.paymentDate.includes("Verilmiyor")) return;

            const parts = div.paymentDate.split(".");
            if (parts.length !== 3) return;
            const isoDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            const itemDate = new Date(isoDate);
            if (isNaN(itemDate.getTime())) return;

            if (isoDate >= todayIstanbulStr) {
                const isToday = isoDate === todayIstanbulStr;
                const daysUntil = Math.max(0, Math.round((itemDate.getTime() - todayDate.getTime()) / 86400000));
                const monthName = itemDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

                list.push({
                    id: `div-${sym}-${isoDate}`,
                    symbol: sym,
                    companyName: div.companyName || sym,
                    type: "DIVIDEND",
                    typeLabel: "Temettü Ödemesi",
                    title: `${sym} Temettü Dağıtımı`,
                    dateStr: monthName,
                    rawDateStr: div.paymentDate,
                    isoDate,
                    isToday,
                    daysUntil,
                    isInPortfolio: portfolioSymbols.has(sym),
                    valueFormatted: div.netAmountFormatted ? `${div.netAmountFormatted} / pay` : undefined,
                    yieldPercent: div.yieldPercent
                });
            }
        });

        // 2. Bilanço Açıklamaları
        earnings.forEach(earn => {
            const sym = (earn.symbol || "").toUpperCase().replace(/\.IS$/i, "").trim();
            if (!sym) return;
            if (!earn.earningsDate || earn.earningsDate.includes("Açıklanmadı")) return;

            const parts = earn.earningsDate.split(".");
            if (parts.length !== 3) return;
            const isoDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            const itemDate = new Date(isoDate);
            if (isNaN(itemDate.getTime())) return;

            if (isoDate >= todayIstanbulStr) {
                const isToday = isoDate === todayIstanbulStr;
                const daysUntil = Math.max(0, Math.round((itemDate.getTime() - todayDate.getTime()) / 86400000));
                const monthName = itemDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

                list.push({
                    id: `earn-${sym}-${isoDate}`,
                    symbol: sym,
                    companyName: earn.companyName || sym,
                    type: "EARNINGS",
                    typeLabel: "Bilanço Açıklaması",
                    title: `${sym} Dönemsel Bilanço Açıklaması`,
                    dateStr: monthName,
                    rawDateStr: earn.earningsDate,
                    isoDate,
                    isToday,
                    daysUntil,
                    isInPortfolio: portfolioSymbols.has(sym)
                });
            }
        });

        // KRONOLOJİK SIRALAMA: En yakın tarihten en uzak tarihe
        list.sort((a, b) => {
            if (a.isoDate !== b.isoDate) {
                return a.isoDate.localeCompare(b.isoDate);
            }
            const typeOrder = { DIVIDEND: 1, EARNINGS: 2 };
            if (typeOrder[a.type] !== typeOrder[b.type]) {
                return typeOrder[a.type] - typeOrder[b.type];
            }
            return a.symbol.localeCompare(b.symbol);
        });

        // Tekilleştirme
        const unique: AgendaPageEventItem[] = [];
        const seen = new Set<string>();
        for (const item of list) {
            const key = `${item.symbol}_${item.type}_${item.isoDate}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }

        return unique;
    }, [dividends, earnings, portfolioSymbols]);

    // Seçili kapsam ve kategoriye göre filtrelenmiş liste
    const filteredEvents = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return allEvents.filter(item => {
            if (scopeFilter === "PORTFOLIO" && !item.isInPortfolio) return false;
            if (categoryFilter === "TODAY" && !item.isToday) return false;
            if (categoryFilter === "DIVIDEND" && item.type !== "DIVIDEND") return false;
            if (categoryFilter === "EARNINGS" && item.type !== "EARNINGS") return false;

            if (q) {
                const matchSym = item.symbol.toLowerCase().includes(q);
                const matchName = item.companyName.toLowerCase().includes(q);
                const matchTitle = item.title.toLowerCase().includes(q);
                if (!matchSym && !matchName && !matchTitle) return false;
            }

            return true;
        });
    }, [allEvents, scopeFilter, categoryFilter, searchQuery]);

    const portfolioEventCount = useMemo(() => allEvents.filter(e => e.isInPortfolio).length, [allEvents]);
    const todayEventCount = useMemo(
        () => allEvents.filter(e => (scopeFilter === "PORTFOLIO" ? e.isInPortfolio : true) && e.isToday).length,
        [allEvents, scopeFilter]
    );

    return (
        <div className="p-4 md:p-8 space-y-6 min-h-screen bg-slate-50/50 font-sans max-w-5xl mx-auto">
            {/* ÜST GERİ DÖNÜŞ VE FİLTRE ÇUBUĞU */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link
                    href="/dashboard/portfolio"
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-[#00008B] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Portföyüme Geri Dön
                </Link>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
                        <button
                            onClick={() => setScopeFilter("PORTFOLIO")}
                            className={cn(
                                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5",
                                scopeFilter === "PORTFOLIO"
                                    ? "bg-[#00008B] text-white shadow-sm"
                                    : "text-slate-600 hover:text-[#00008B]"
                            )}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            Portföyümün Gündemi ({portfolioEventCount})
                        </button>
                        <button
                            onClick={() => setScopeFilter("ALL")}
                            className={cn(
                                "px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5",
                                scopeFilter === "ALL"
                                    ? "bg-[#00008B] text-white shadow-sm"
                                    : "text-slate-600 hover:text-[#00008B]"
                            )}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            Tüm BIST Gündemi ({allEvents.length})
                        </button>
                    </div>

                    <button
                        onClick={fetchAgendaPageData}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-[#00008B] font-bold rounded-2xl text-xs transition-all active:scale-95 border border-slate-200/80 shadow-xs"
                    >
                        <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                        Yenile
                    </button>
                </div>
            </div>

            {/* TAM EKRAN PORTFÖY GÜNDEMİ WIDGET KARTI */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#00008B]/5 space-y-6">
                {/* PORTFÖY GÜNDEMİ BAŞLIĞI VE ALT BAŞLIK (WIDGET İLE BİREBİR TASARIM) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#00008B]/5 border border-[#00008B]/10 text-[#00008B] flex items-center justify-center shrink-0">
                            <Newspaper className="w-6 h-6 text-[#00008B]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-[#00008B] tracking-tight">Portföy Gündemi</h1>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium">
                                Bugün ve yaklaşan tüm gelişmeler (En yakın tarihten en uzak tarihe sıralı)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        {todayEventCount > 0 && (
                            <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                BUGÜN {todayEventCount} HAREKETLİLİK
                            </span>
                        )}
                        <span className="text-xs font-bold text-[#00008B] bg-blue-50 border border-blue-200/50 px-3.5 py-1 rounded-full">
                            {filteredEvents.length} OLAY
                        </span>
                    </div>
                </div>

                {/* FİLTRE VE ARAMA BAR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-[#00008B] uppercase tracking-wider mr-1 flex items-center gap-1">
                            <Filter className="w-3.5 h-3.5" /> Filtre:
                        </span>
                        {[
                            { id: "ALL", label: "Tümü" },
                            { id: "TODAY", label: "Bugün" },
                            { id: "DIVIDEND", label: "Temettü Ödemesi" },
                            { id: "EARNINGS", label: "Bilanço Açıklaması" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setCategoryFilter(tab.id as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all border",
                                    categoryFilter === tab.id
                                        ? "bg-[#00008B] text-white border-[#00008B] shadow-xs"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Sembol veya şirket ara..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-[#00008B] font-bold placeholder:text-slate-400 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00008B]/20"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* TÜM GÜNDEM LİSTESİ (BUGÜNKÜ HAREKETLİLİK = 2X ALAN, DİĞERLERİ = 1X ALAN) */}
                {loading ? (
                    <div className="py-12 text-center space-y-3">
                        <RefreshCw className="w-7 h-7 text-[#00008B] animate-spin mx-auto" />
                        <p className="text-sm font-bold text-[#00008B]">Gündem verileri yükleniyor...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-10 px-5 text-center bg-[#0b192c] text-white border border-[#1a2f4c] rounded-2xl sm:rounded-3xl shadow-lg shadow-black/20 relative overflow-hidden">
                        <div className="relative z-10 space-y-2.5 max-w-md mx-auto">
                            <p className="text-white font-extrabold text-sm sm:text-[15px] tracking-tight">
                                {scopeFilter === "PORTFOLIO"
                                    ? "Yaklaşan önemli bir portföy gelişmesi bulunmuyor."
                                    : "Arama kriterlerinize uygun gündem gelişmesi bulunamadı."}
                            </p>
                            <span className="text-[11px] sm:text-xs text-blue-200/70 font-medium block leading-relaxed">
                                Portföyünüzdeki şirketlere ait bilanço, temettü veya resmi haberler açıklandıkça burada en yakın tarihten en uzak tarihe sıralı olarak listelenir.
                            </span>
                            {scopeFilter === "PORTFOLIO" && allEvents.length > 0 && (
                                <button
                                    onClick={() => setScopeFilter("ALL")}
                                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#00008B] font-extrabold text-xs shadow-md hover:bg-blue-50 transition-all"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Tüm BIST Gündemini Göster ({allEvents.length})
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredEvents.map(item =>
                            item.isToday ? (
                                /* BUGÜNKÜ HAREKETLİLİK: 2X ALAN (DİKKAT ÇEKİCİ KART) */
                                <div
                                    key={item.id}
                                    className="min-h-[144px] p-5 sm:p-6 rounded-2xl border-2 border-[#00008B]/30 bg-gradient-to-br from-blue-50 via-indigo-50/70 to-white shadow-md shadow-[#00008B]/10 ring-2 ring-[#00008B]/10 transition-all flex flex-col justify-between gap-3 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#00008B]" />

                                    <div className="flex items-center justify-between gap-2 flex-wrap pl-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-3 py-1 rounded-xl bg-[#00008B] text-white font-black text-xs tracking-wider uppercase shadow-sm inline-flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                BUGÜN · {item.symbol}
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-100/90 text-amber-800 border border-amber-300/70 font-extrabold text-[10px] uppercase tracking-wider">
                                                Günün Hareketliliği
                                            </span>
                                        </div>
                                        <span className="text-xs font-extrabold text-[#00008B] bg-white/90 border border-blue-200 px-3 py-1 rounded-lg shrink-0 inline-flex items-center gap-1.5">
                                            {item.type === "DIVIDEND" ? <Coins className="w-3.5 h-3.5 text-emerald-600" /> : <Building2 className="w-3.5 h-3.5 text-blue-600" />}
                                            {item.typeLabel}
                                        </span>
                                    </div>

                                    <div className="pl-1.5 space-y-1">
                                        <h3 className="font-black text-[#00008B] text-base sm:text-lg leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                                            <span className="font-black text-[#00008B]">{item.companyName} ({item.symbol})</span> varlığı için bugün ({item.dateStr}) planlanan <span className="font-bold">{item.typeLabel.toLowerCase()}</span> gerçekleşiyor.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-blue-200/60 pl-1.5 flex-wrap">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            {item.valueFormatted ? (
                                                <span className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-lg">
                                                    {item.valueFormatted}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-extrabold text-[#00008B] inline-flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Tarih: Bugün ({item.dateStr})
                                                </span>
                                            )}
                                            {typeof item.yieldPercent === "number" && item.yieldPercent > 0 && (
                                                <span className="text-xs font-extrabold text-[#00008B] bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-lg">
                                                    Verim: %{item.yieldPercent.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* STANDART YAKLAŞAN HAREKETLİLİK: 1X ALAN */
                                <div
                                    key={item.id}
                                    className="min-h-[70px] p-4 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 bg-slate-50/70 border-slate-100"
                                >
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-700 font-extrabold text-[10px] tracking-wider uppercase">
                                                {item.dateStr.toUpperCase()} · {item.symbol}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                ({item.daysUntil} gün kaldı)
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {item.typeLabel}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-[#00008B] text-xs sm:text-sm leading-snug">
                                            {item.title} <span className="text-slate-400 font-medium text-xs">— {item.companyName}</span>
                                        </h4>
                                        {item.valueFormatted && (
                                            <span className="text-xs font-black text-emerald-700 shrink-0">
                                                {item.valueFormatted}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
