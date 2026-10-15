"use client";

import { useState, useEffect, useMemo } from "react";
import { 
    Calendar as CalendarIcon, 
    ArrowRight, 
    Clock, 
    Loader2, 
    AlertCircle 
} from "lucide-react";
import Link from "next/link";

export interface DailyAgendaItem {
    id: string;
    category: 'all' | 'ipo' | 'dividends' | 'earnings' | 'economic';
    categoryLabel: string;
    time?: string;
    symbolOrCountry: string;
    title: string;
    badgeColor: string;
    impact?: 'low' | 'medium' | 'high' | 'critical';
    auxiliaryText?: string;
    link?: string;
    sortKey: string;
}

const CATEGORY_TABS = [
    { id: 'all', label: 'Tümü' },
    { id: 'ipo', label: 'Halka Arz' },
    { id: 'dividends', label: 'Temettü' },
    { id: 'earnings', label: 'Bilanço' },
    { id: 'economic', label: 'Ekonomik' }
] as const;

// Tümü sekmesinde kategori sıralama önceliği:
// 1. Ekonomik Gelişmeler (En üstte, saatleriyle)
// 2. Halka Arzlar (Alt alta, saatsiz)
// 3. Temettüler (Alt alta, saatsiz)
// 4. Bilançolar (Alt alta, saatsiz)
const CATEGORY_PRIORITY: Record<string, number> = {
    economic: 1,
    ipo: 2,
    dividends: 3,
    earnings: 4
};

export function DailyAgendaWidget() {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    // Ham veri setleri (Haberler tamamen kaldırıldı)
    const [economicData, setEconomicData] = useState<any[]>([]);
    const [earningsData, setEarningsData] = useState<any[]>([]);
    const [dividendsData, setDividendsData] = useState<any[]>([]);
    const [ipoData, setIpoData] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        async function fetchAgendaData() {
            setLoading(true);
            try {
                // FinAi Takvim sayfasıyla birebir aynı API endpoint'lerinden tam senkron veri çekimi
                const [ecoRes, earnRes, divRes, ipoRes] = await Promise.all([
                    fetch('/api/calendar').then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/halkarz-earnings').then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/halkarz-dividends').then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/halkarz-ipo').then(r => r.json()).catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setEconomicData(Array.isArray(ecoRes?.data) ? ecoRes.data : []);
                    setEarningsData(Array.isArray(earnRes?.data) ? earnRes.data : []);
                    setDividendsData(Array.isArray(divRes?.data) ? divRes.data : []);
                    setIpoData(Array.isArray(ipoRes?.data) ? ipoRes.data : []);
                }
            } catch (err) {
                console.error("DailyAgenda fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchAgendaData();
        return () => { isMounted = false; };
    }, []);

    // Bugünün Tarih Bilgileri (TR Yerel Saati / Europe/Istanbul)
    const now = new Date();
    const todayFormattedDate = now.toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const todayIso = now.toLocaleDateString('sv-SE', {
        timeZone: 'Europe/Istanbul'
    }); // Format: YYYY-MM-DD

    const dateParts = todayFormattedDate.split('.');
    const dInt = parseInt(dateParts[0], 10);
    const mInt = parseInt(dateParts[1], 10);
    const yInt = parseInt(dateParts[2], 10);
    const todayTrShort = `${dInt}.${mInt}.${yInt}`;

    const todayStart = new Date(yInt, mInt - 1, dInt, 0, 0, 0, 0).getTime();
    const todayEnd = new Date(yInt, mInt - 1, dInt, 23, 59, 59, 999).getTime();

    // Takvim sayfasından gelen verileri ajanda formatında birleştirme (SADECE BUGÜNÜN TARİHİ)
    const agendaItems = useMemo(() => {
        const unified: DailyAgendaItem[] = [];

        // 1. EKONOMİK TAKVİM (Sadece Bugünün Tarihindeki Gelişmeler)
        const todayEco = economicData.filter((item: any) => {
            if (item.isToday) return true;
            if (item.dateFormatted && (item.dateFormatted.trim() === todayFormattedDate || item.dateFormatted.trim() === todayTrShort)) return true;
            if (item.event_date && item.event_date === todayIso) return true;
            if (item.date && (item.date === todayIso || item.date === todayFormattedDate || item.date === todayTrShort)) return true;
            if (item.timestamp && item.timestamp >= todayStart && item.timestamp <= todayEnd) return true;
            return false;
        });

        todayEco.forEach((item: any, idx: number) => {
            let aux = '';
            if (item.actual && item.actual !== '-' && item.actual !== 'Bekleniyor') {
                aux = `Açıklanan: ${item.actual}`;
            } else if (item.forecast) {
                aux = `Beklenti: ${item.forecast}`;
            } else if (item.previous) {
                aux = `Önceki: ${item.previous}`;
            }

            unified.push({
                id: `eco-${item.id || idx}`,
                category: 'economic',
                categoryLabel: 'Ekonomik',
                time: item.time || '14:00',
                symbolOrCountry: item.flag || item.country || 'TR',
                title: item.event || 'Ekonomik Gelişme',
                badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200/60',
                impact: item.impact || 'high',
                auxiliaryText: aux,
                link: item.id ? `/dashboard/economic-calendar/${encodeURIComponent(item.id)}` : '/dashboard/calendar?type=economic',
                sortKey: item.time || '14:00'
            });
        });

        // 2. HALKA ARZ TAKVİMİ (Sadece Bugün Talep Toplama / İşlem Sürecinde Olanlar)
        const todayIpo = ipoData.filter((item: any) => {
            if (Array.isArray(item.dates) && item.dates.includes(todayIso)) return true;
            if (item.startDate && item.endDate) {
                return todayIso >= item.startDate && todayIso <= item.endDate;
            }
            if (item.timestamp && item.timestamp >= todayStart && item.timestamp <= todayEnd) return true;
            if (item.dateRange) {
                const text = String(item.dateRange).trim().toLowerCase();
                const match = text.match(/([\d\-]+)\s+([a-zçğıöşü]+)\s+(\d{4})/i);
                if (match) {
                    const dayPart = match[1];
                    const monthName = match[2];
                    const yr = parseInt(match[3], 10);
                    const TURKISH_MONTHS: Record<string, number> = {
                        'ocak': 1, 'şubat': 2, 'mart': 3, 'nisan': 4, 'mayıs': 5, 'haziran': 6,
                        'temmuz': 7, 'ağustos': 8, 'eylül': 9, 'ekim': 10, 'kasım': 11, 'aralık': 12
                    };
                    const mo = TURKISH_MONTHS[monthName];
                    if (mo && yr === yInt && mo === mInt) {
                        const days = dayPart.split('-').map(d => parseInt(d.trim(), 10)).filter(d => !isNaN(d));
                        if (days.length > 0) {
                            const minDay = Math.min(...days);
                            const maxDay = Math.max(...days);
                            if (dInt >= minDay && dInt <= maxDay) return true;
                        }
                    }
                }
            }
            return false;
        });

        todayIpo.forEach((item: any, idx: number) => {
            const statusLabel = item.status || 'Talep Toplama';
            const dateText = item.dateRange || '';
            const aux = dateText ? `${dateText} • ${statusLabel}` : statusLabel;

            unified.push({
                id: `ipo-${item.id || idx}`,
                category: 'ipo',
                categoryLabel: 'Halka Arz',
                symbolOrCountry: item.symbol || 'IPO',
                title: `${item.companyName || item.symbol} Halka Arz`,
                badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                auxiliaryText: aux,
                link: '/dashboard/calendar?type=ipo',
                sortKey: 'ipo'
            });
        });

        // 3. TEMETTÜ TAKVİMİ (Sadece Bugünün Tarihindeki Temettü Ödemeleri)
        const todayDiv = dividendsData.filter((item: any) => {
            if (item.parsedDate && item.parsedDate === todayIso) return true;
            if (item.paymentDate) {
                const pDate = String(item.paymentDate).trim();
                if (pDate === todayFormattedDate || pDate === todayTrShort) return true;
            }
            if (item.timestamp && item.timestamp >= todayStart && item.timestamp <= todayEnd) return true;
            return false;
        });

        todayDiv.forEach((item: any, idx: number) => {
            const netStr = item.netAmountFormatted ? `Net: ${item.netAmountFormatted}` : '';
            const dateStr = item.paymentDate && item.paymentDate !== 'Açıklanmadı' ? item.paymentDate : '';
            const aux = [netStr, dateStr].filter(Boolean).join(' • ');

            unified.push({
                id: `div-${item.symbol || idx}`,
                category: 'dividends',
                categoryLabel: 'Temettü',
                symbolOrCountry: item.symbol || 'BİST',
                title: `${item.companyName || item.symbol} Temettü Dağıtımı`,
                badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200/60',
                auxiliaryText: aux || 'Temettü Dağıtımı',
                link: '/dashboard/calendar?type=dividend',
                sortKey: 'div'
            });
        });

        // 4. BİLANÇO TAKVİMİ (Sadece Bugünün Tarihindeki Bilanço Açıklamaları)
        const todayEarn = earningsData.filter((item: any) => {
            if (item.parsedDate && item.parsedDate === todayIso) return true;
            if (item.earningsDate) {
                const eDate = String(item.earningsDate).trim();
                if (eDate === todayFormattedDate || eDate === todayTrShort) return true;
            }
            if (item.daysLeft === 0) return true;
            if (item.timestamp && item.timestamp >= todayStart && item.timestamp <= todayEnd) return true;
            return false;
        });

        todayEarn.forEach((item: any, idx: number) => {
            const dateStr = item.earningsDate ? `Tarih: ${item.earningsDate}` : '';
            const aux = [dateStr, 'Seans Sonu'].filter(Boolean).join(' • ');

            unified.push({
                id: `earn-${item.symbol || idx}`,
                category: 'earnings',
                categoryLabel: 'Bilanço',
                symbolOrCountry: item.symbol || 'BİST',
                title: `${item.companyName || item.symbol} Bilanço Açıklaması`,
                badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200/60',
                auxiliaryText: aux,
                link: '/dashboard/calendar?type=earnings',
                sortKey: 'earn'
            });
        });

        // Kategori hiyerarşisine göre sıralama:
        // 1. Ekonomik Gelişmeler (En üstte, saat sırasına göre)
        // 2. Halka Arzlar
        // 3. Temettüler
        // 4. Bilançolar
        return unified.sort((a, b) => {
            const orderA = CATEGORY_PRIORITY[a.category] ?? 99;
            const orderB = CATEGORY_PRIORITY[b.category] ?? 99;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            if (a.category === 'economic') {
                return (a.time || '').localeCompare(b.time || '');
            }
            return 0;
        });
    }, [economicData, earningsData, dividendsData, ipoData, todayFormattedDate, todayIso, todayTrShort, todayStart, todayEnd, dInt, mInt, yInt]);

    // Seçili sekmeye göre filtreleme
    const filteredItems = useMemo(() => {
        if (activeCategory === 'all') return agendaItems;
        return agendaItems.filter(item => item.category === activeCategory);
    }, [agendaItems, activeCategory]);

    // Etki sinyal barları (Ekonomik veriler için açık tema)
    const renderImpactBars = (impact?: string) => {
        if (!impact) return null;
        const isHigh = impact === 'high' || impact === 'critical';
        const isMedium = impact === 'medium';

        return (
            <div className="flex items-end gap-[2px] h-3 w-3 shrink-0" title={isHigh ? "Yüksek Etki" : (isMedium ? "Orta Etki" : "Düşük Etki")}>
                <div className={`w-[2.5px] rounded-xs ${isHigh || isMedium ? 'h-1.5 bg-blue-600' : 'h-1 bg-slate-200'}`} />
                <div className={`w-[2.5px] rounded-xs ${isHigh || isMedium ? 'h-2 bg-blue-600' : 'h-1 bg-slate-200'}`} />
                <div className={`w-[2.5px] rounded-xs ${isHigh ? 'h-3 bg-blue-600' : 'h-1 bg-slate-200'}`} />
            </div>
        );
    };

    return (
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
                        href={activeCategory !== 'all' ? `/dashboard/calendar?type=${activeCategory === 'dividends' ? 'dividend' : activeCategory}` : "/dashboard/calendar"}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group/link"
                    >
                        <span>Tümünü Gör</span>
                        <ArrowRight className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" />
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
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Ajanda Satırları: En Üstten En Alta Uzanır & Scroll Edilebilir */}
            <div className="relative z-10 flex-1 min-h-0 my-2 overflow-y-auto pr-1.5 custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-xs font-medium text-slate-400">Günün gelişmeleri yükleniyor...</span>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="divide-y divide-slate-100/80 space-y-0.5">
                        {filteredItems.map((item) => (
                            <Link
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
                                    <span className="text-xs font-bold text-slate-700 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 shrink-0 min-w-[32px] text-center">
                                        {item.symbolOrCountry}
                                    </span>
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
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${item.badgeColor}`}>
                                        {item.categoryLabel}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Boş Durum (Empty State) */
                    <div className="py-10 flex flex-col items-center justify-center text-center gap-1.5 px-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 mb-1">
                            <AlertCircle className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">
                            Bugün bu kategoride planlanmış bir gelişme bulunmuyor.
                        </p>
                        <p className="text-[10px] text-slate-400 max-w-[240px]">
                            Gelecek günlerin takvimi ve tüm şirket olayları için takvim sayfasına göz atabilirsiniz.
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Alt Bilgi & Yönlendirme (Sabit Alt Alan) */}
            <div className="relative z-10 shrink-0 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px] text-slate-500">Bugünün piyasa ve şirket gelişmeleri</span>
                </div>

                <Link
                    href={activeCategory !== 'all' ? `/dashboard/calendar?type=${activeCategory === 'dividends' ? 'dividend' : activeCategory}` : "/dashboard/calendar"}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
                >
                    <span>Tüm Takvim</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
