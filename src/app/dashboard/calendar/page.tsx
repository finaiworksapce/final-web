"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Bell,
    TrendingUp,
    Building2,
    Coins,
    Sparkles,
    Globe2,
    Briefcase,
    Loader2,
    Clock,
    Search,
    X,
    AlertCircle,
    ExternalLink
} from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    colorScheme?: 'emerald' | 'blue' | 'purple' | 'amber';
}

function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    colorScheme = 'emerald'
}: TablePaginationProps) {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const activeStyles = {
        emerald: 'bg-emerald-600 text-white shadow-xs',
        blue: 'bg-blue-600 text-white shadow-xs',
        purple: 'bg-purple-600 text-white shadow-xs',
        amber: 'bg-amber-600 text-white shadow-xs'
    }[colorScheme];

    const borderStyles = {
        emerald: 'border-emerald-200 text-emerald-800 hover:bg-emerald-50',
        blue: 'border-blue-200 text-blue-800 hover:bg-blue-50',
        purple: 'border-purple-200 text-purple-800 hover:bg-purple-50',
        amber: 'border-amber-200 text-amber-800 hover:bg-amber-50'
    }[colorScheme];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-bold">
            <span className="text-slate-400 text-[11px]">
                {totalItems > 0 ? `${startItem} – ${endItem} / Toplam ${totalItems} kayıt` : 'Kayıt bulunamadı'}
            </span>
            <div className="flex items-center gap-1 self-center sm:self-auto">
                <button
                    onClick={() => {
                        onPageChange(Math.max(1, currentPage - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    aria-label="Önceki sayfa"
                    className={`min-h-[34px] px-2.5 py-1.5 rounded-xl border bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 ${borderStyles}`}
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Önceki</span>
                </button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .map((p, idx, arr) => (
                            <React.Fragment key={p}>
                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                    <span className="text-slate-300 px-1 font-bold">…</span>
                                )}
                                <button
                                    onClick={() => {
                                        onPageChange(p);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    aria-label={`Sayfa ${p}`}
                                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                                        p === currentPage
                                            ? activeStyles
                                            : `bg-white text-slate-700 border ${borderStyles}`
                                    }`}
                                >
                                    {p}
                                </button>
                            </React.Fragment>
                        ))}
                </div>

                <button
                    onClick={() => {
                        onPageChange(Math.min(totalPages, currentPage + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Sonraki sayfa"
                    className={`min-h-[34px] px-2.5 py-1.5 rounded-xl border bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1 ${borderStyles}`}
                >
                    <span className="hidden sm:inline text-[11px]">Sonraki</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

function CalendarContent() {
    const { myAssets = [] } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initial active filter from URL query param
    const getInitialFilter = (): 'all' | 'earnings' | 'dividends' | 'ipo' | 'economic' => {
        const typeParam = searchParams ? (searchParams.get('type') || searchParams.get('focus')) : null;
        if (typeParam) {
            const p = typeParam.toLowerCase();
            if (p === 'dividend' || p === 'dividends' || p === 'temettu') return 'dividends';
            if (p === 'earnings' || p === 'bilanco') return 'earnings';
            if (p === 'ipo' || p === 'halka-arz') return 'ipo';
            if (p === 'economic' || p === 'ekonomik') return 'economic';
        }
        return 'all';
    };

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewDate, setViewDate] = useState<Date>(new Date());
    const [activeFilter, setActiveFilter] = useState<'all' | 'earnings' | 'dividends' | 'ipo' | 'economic'>(getInitialFilter);

    // Data States
    const [earnings, setEarnings] = useState<any[]>([]);
    const [dividends, setDividends] = useState<any[]>([]);
    const [ipos, setIpos] = useState<any[]>([]);
    const [economicEvents, setEconomicEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // 1. TEMETTÜ STATE'LERİ
    // ==========================================
    const [divSearch, setDivSearch] = useState<string>(() => searchParams?.get('search') || '');
    const [divDateFilter, setDivDateFilter] = useState<'all' | 'today' | 'this-week' | 'this-month' | 'next-3-months'>(
        () => (searchParams?.get('date') as any) || 'all'
    );
    const [divStatusFilter, setDivStatusFilter] = useState<'all' | 'upcoming' | 'completed'>(
        () => (searchParams?.get('status') as any) || 'all'
    );
    const [divYieldFilter, setDivYieldFilter] = useState<'all' | '0-2' | '2-5' | '5plus'>(
        () => (searchParams?.get('yield') as any) || 'all'
    );
    const [divAmountFilter, setDivAmountFilter] = useState<'all' | 'low' | 'medium' | 'high'>(
        () => (searchParams?.get('amount') as any) || 'all'
    );
    const [divPortfolioOnly, setDivPortfolioOnly] = useState<boolean>(
        () => searchParams?.get('portfolio') === 'true'
    );
    const [divSort, setDivSort] = useState<'default' | 'date-asc' | 'date-desc' | 'yield-desc' | 'yield-asc' | 'amount-desc' | 'name-asc' | 'name-desc'>(
        () => (searchParams?.get('sort') as any) || 'default'
    );

    // ==========================================
    // 2. BİLANÇO STATE'LERİ
    // ==========================================
    const [earnSearch, setEarnSearch] = useState<string>(() => searchParams?.get('search') || '');
    const [earnDateFilter, setEarnDateFilter] = useState<'all' | 'today' | 'this-week' | 'this-month' | 'next-3-months'>(
        () => (searchParams?.get('date') as any) || 'all'
    );
    const [earnPeriodFilter, setEarnPeriodFilter] = useState<'all' | '1q' | '2q' | '3q' | '4q'>(
        () => (searchParams?.get('period') as any) || 'all'
    );
    const [earnStatusFilter, setEarnStatusFilter] = useState<'all' | 'upcoming' | 'completed'>(
        () => (searchParams?.get('status') as any) || 'all'
    );
    const [earnPortfolioOnly, setEarnPortfolioOnly] = useState<boolean>(
        () => searchParams?.get('portfolio') === 'true'
    );
    const [earnSort, setEarnSort] = useState<'date-asc' | 'date-desc' | 'name-asc' | 'name-desc'>(
        () => (searchParams?.get('sort') as any) || 'date-asc'
    );

    // ==========================================
    // 3. HALKA ARZ STATE'LERİ
    // ==========================================
    const [ipoSearch, setIpoSearch] = useState<string>(() => searchParams?.get('search') || '');
    const [ipoDateFilter, setIpoDateFilter] = useState<'all' | 'today' | 'this-week' | 'this-month'>(
        () => (searchParams?.get('date') as any) || 'all'
    );
    const [ipoStatusFilter, setIpoStatusFilter] = useState<'all' | 'talep-toplama' | 'taslak' | 'basvuru' | 'ertelendi' | 'reddedildi' | 'iptal-edildi'>(
        () => (searchParams?.get('status') as any) || 'all'
    );
    const [ipoPriceFilter, setIpoPriceFilter] = useState<'all' | '0-25' | '25-50' | '50-100' | '100plus'>(
        () => (searchParams?.get('price') as any) || 'all'
    );
    const [ipoSort, setIpoSort] = useState<'default' | 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc'>(
        () => (searchParams?.get('sort') as any) || 'default'
    );

    // ==========================================
    // 4. EKONOMİK TAKVİM STATE'LERİ
    // ==========================================
    const [ecoSearch, setEcoSearch] = useState<string>(() => searchParams?.get('search') || '');
    const [ecoDateFilter, setEcoDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'this-week' | 'this-month'>(
        () => (searchParams?.get('date') as any) || 'all'
    );
    const [ecoCountryFilter, setEcoCountryFilter] = useState<'all' | 'tr' | 'us' | 'eu' | 'uk' | 'other'>(
        () => (searchParams?.get('country') as any) || 'all'
    );
    const [ecoImportanceFilter, setEcoImportanceFilter] = useState<'all' | 'high' | 'medium' | 'low'>(
        () => (searchParams?.get('importance') as any) || 'all'
    );
    const [ecoStatusFilter, setEcoStatusFilter] = useState<'all' | 'pending' | 'announced'>(
        () => (searchParams?.get('status') as any) || 'all'
    );
    const [ecoSort, setEcoSort] = useState<'default' | 'date-asc' | 'importance-desc' | 'name-asc'>(
        () => (searchParams?.get('sort') as any) || 'default'
    );

    // ==========================================
    // SAYFALAMA (PAGINATION) - 10 Kayıt / Sayfa
    // ==========================================
    const ITEMS_PER_PAGE = 10;
    const [divPage, setDivPage] = useState<number>(1);
    const [earnPage, setEarnPage] = useState<number>(1);
    const [ipoPage, setIpoPage] = useState<number>(1);
    const [ecoPage, setEcoPage] = useState<number>(1);

    // Sync URL search params -> state (Sayfa açılışında ve URL değişiminde)
    useEffect(() => {
        const typeParam = searchParams ? (searchParams.get('type') || searchParams.get('focus')) : null;
        if (typeParam) {
            const p = typeParam.toLowerCase();
            if (p === 'dividend' || p === 'dividends' || p === 'temettu') {
                setActiveFilter('dividends');
            } else if (p === 'earnings' || p === 'bilanco') {
                setActiveFilter('earnings');
            } else if (p === 'ipo' || p === 'halka-arz') {
                setActiveFilter('ipo');
            } else if (p === 'economic' || p === 'ekonomik') {
                setActiveFilter('economic');
            } else {
                setActiveFilter('all');
            }
        } else {
            setActiveFilter('all');
        }

        if (!searchParams) return;

        // 1. Temettü Parametreleri
        if (typeParam === 'dividend' || typeParam === 'dividends' || typeParam === 'temettu') {
            setDivSearch(searchParams.get('search') || '');
            setDivDateFilter((searchParams.get('date') as any) || 'all');
            setDivStatusFilter((searchParams.get('status') as any) || 'all');
            setDivYieldFilter((searchParams.get('yield') as any) || 'all');
            setDivAmountFilter((searchParams.get('amount') as any) || 'all');
            setDivPortfolioOnly(searchParams.get('portfolio') === 'true');
            setDivSort((searchParams.get('sort') as any) || 'default');
        }

        // 2. Bilanço Parametreleri
        if (typeParam === 'earnings' || typeParam === 'bilanco') {
            setEarnSearch(searchParams.get('search') || '');
            setEarnDateFilter((searchParams.get('date') as any) || 'all');
            setEarnPeriodFilter((searchParams.get('period') as any) || 'all');
            setEarnStatusFilter((searchParams.get('status') as any) || 'all');
            setEarnPortfolioOnly(searchParams.get('portfolio') === 'true');
            setEarnSort((searchParams.get('sort') as any) || 'date-asc');
        }

        // 3. Halka Arz Parametreleri
        if (typeParam === 'ipo' || typeParam === 'halka-arz') {
            setIpoSearch(searchParams.get('search') || '');
            setIpoDateFilter((searchParams.get('date') as any) || 'all');
            setIpoStatusFilter((searchParams.get('status') as any) || 'all');
            setIpoPriceFilter((searchParams.get('price') as any) || 'all');
            setIpoSort((searchParams.get('sort') as any) || 'default');
        }

        // 4. Ekonomik Takvim Parametreleri
        if (typeParam === 'economic' || typeParam === 'ekonomik') {
            setEcoSearch(searchParams.get('search') || '');
            setEcoDateFilter((searchParams.get('date') as any) || 'all');
            setEcoCountryFilter((searchParams.get('country') as any) || 'all');
            setEcoImportanceFilter((searchParams.get('importance') as any) || 'all');
            setEcoStatusFilter((searchParams.get('status') as any) || 'all');
            setEcoSort((searchParams.get('sort') as any) || 'default');
        }
    }, [searchParams]);

    // URL Parametresi Güncelleme Fonksiyonları (UI -> URL)
    const updateDividendUrlParams = (newParams: Partial<Record<string, any>>) => {
        setDivPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set('type', 'dividend');
        const s = newParams.search !== undefined ? newParams.search : divSearch;
        const d = newParams.date !== undefined ? newParams.date : divDateFilter;
        const st = newParams.status !== undefined ? newParams.status : divStatusFilter;
        const y = newParams.yield !== undefined ? newParams.yield : divYieldFilter;
        const a = newParams.amount !== undefined ? newParams.amount : divAmountFilter;
        const p = newParams.portfolio !== undefined ? newParams.portfolio : divPortfolioOnly;
        const so = newParams.sort !== undefined ? newParams.sort : divSort;

        if (s) params.set('search', s); else params.delete('search');
        if (d && d !== 'all') params.set('date', d); else params.delete('date');
        if (st && st !== 'all') params.set('status', st); else params.delete('status');
        if (y && y !== 'all') params.set('yield', y); else params.delete('yield');
        if (a && a !== 'all') params.set('amount', a); else params.delete('amount');
        if (p) params.set('portfolio', 'true'); else params.delete('portfolio');
        if (so && so !== 'date-asc') params.set('sort', so); else params.delete('sort');
        router.replace(`/dashboard/calendar?${params.toString()}`, { scroll: false });
    };

    const updateEarningsUrlParams = (newParams: Partial<Record<string, any>>) => {
        setEarnPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set('type', 'earnings');
        const s = newParams.search !== undefined ? newParams.search : earnSearch;
        const d = newParams.date !== undefined ? newParams.date : earnDateFilter;
        const pe = newParams.period !== undefined ? newParams.period : earnPeriodFilter;
        const st = newParams.status !== undefined ? newParams.status : earnStatusFilter;
        const p = newParams.portfolio !== undefined ? newParams.portfolio : earnPortfolioOnly;
        const so = newParams.sort !== undefined ? newParams.sort : earnSort;

        if (s) params.set('search', s); else params.delete('search');
        if (d && d !== 'all') params.set('date', d); else params.delete('date');
        if (pe && pe !== 'all') params.set('period', pe); else params.delete('period');
        if (st && st !== 'all') params.set('status', st); else params.delete('status');
        if (p) params.set('portfolio', 'true'); else params.delete('portfolio');
        if (so && so !== 'date-asc') params.set('sort', so); else params.delete('sort');
        router.replace(`/dashboard/calendar?${params.toString()}`, { scroll: false });
    };

    const updateIpoUrlParams = (newParams: Partial<Record<string, any>>) => {
        setIpoPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set('type', 'ipo');
        const s = newParams.search !== undefined ? newParams.search : ipoSearch;
        const d = newParams.date !== undefined ? newParams.date : ipoDateFilter;
        const st = newParams.status !== undefined ? newParams.status : ipoStatusFilter;
        const pr = newParams.price !== undefined ? newParams.price : ipoPriceFilter;
        const so = newParams.sort !== undefined ? newParams.sort : ipoSort;

        if (s) params.set('search', s); else params.delete('search');
        if (d && d !== 'all') params.set('date', d); else params.delete('date');
        if (st && st !== 'all') params.set('status', st); else params.delete('status');
        if (pr && pr !== 'all') params.set('price', pr); else params.delete('price');
        params.delete('portfolio');
        if (so && so !== 'default') params.set('sort', so); else params.delete('sort');
        router.replace(`/dashboard/calendar?${params.toString()}`, { scroll: false });
    };

    const updateEconomicUrlParams = (newParams: Partial<Record<string, any>>) => {
        setEcoPage(1);
        const params = new URLSearchParams(window.location.search);
        params.set('type', 'economic');
        const s = newParams.search !== undefined ? newParams.search : ecoSearch;
        const d = newParams.date !== undefined ? newParams.date : ecoDateFilter;
        const c = newParams.country !== undefined ? newParams.country : ecoCountryFilter;
        const i = newParams.importance !== undefined ? newParams.importance : ecoImportanceFilter;
        const st = newParams.status !== undefined ? newParams.status : ecoStatusFilter;
        const so = newParams.sort !== undefined ? newParams.sort : ecoSort;

        if (s) params.set('search', s); else params.delete('search');
        if (d && d !== 'all') params.set('date', d); else params.delete('date');
        if (c && c !== 'all') params.set('country', c); else params.delete('country');
        if (i && i !== 'all') params.set('importance', i); else params.delete('importance');
        if (st && st !== 'all') params.set('status', st); else params.delete('status');
        if (so && so !== 'default') params.set('sort', so); else params.delete('sort');
        router.replace(`/dashboard/calendar?${params.toString()}`, { scroll: false });
    };

    const handleFilterSelect = (filterId: 'all' | 'earnings' | 'dividends' | 'ipo' | 'economic') => {
        setActiveFilter(filterId);
        setDivPage(1);
        setEarnPage(1);
        setIpoPage(1);
        setEcoPage(1);
        const typeMap: Record<string, string> = {
            dividends: 'dividend',
            earnings: 'earnings',
            ipo: 'ipo',
            economic: 'economic',
            all: 'all'
        };
        const targetType = typeMap[filterId];
        if (targetType === 'all') {
            router.push('/dashboard/calendar');
        } else {
            router.push(`/dashboard/calendar?type=${targetType}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Veri Çekimi & Canlı Periyodik Yenileme
    useEffect(() => {
        let isMounted = true;

        async function loadData(isInitial = false) {
            if (isInitial) setLoading(true);
            try {
                const [earningsRes, divRes, ipoRes, ecoRes] = await Promise.all([
                    fetch('/api/halkarz-earnings', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/halkarz-dividends', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/halkarz-ipo', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ data: [] })),
                    fetch('/api/calendar', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ data: [] }))
                ]);

                if (isMounted) {
                    setEarnings(earningsRes.data || []);
                    setDividends(divRes.data || []);
                    setIpos(ipoRes.data || []);
                    setEconomicEvents(ecoRes.data || []);
                }
            } catch (e) {
                console.error("Calendar data fetch error:", e);
            } finally {
                if (isMounted && isInitial) setLoading(false);
            }
        }

        // İlk yükleme
        loadData(true);

        // Belirli aralıklarla (60 saniyede bir) arka planda otomatik canlı veri yenileme
        const interval = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
            loadData(false);
        }, 60000);

        // Sekmeye dönüldüğünde anında tazeleme
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadData(false);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isMounted = false;
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Tarih Sınırlandırması (Kullanıcının 2030 gibi uzak yıllara gitmesini kısıtlar)
    const minNavDate = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear() - 1, d.getMonth(), 1);
    }, []);

    const maxNavDate = useMemo(() => {
        const d = new Date();
        // Mevcut yıldan en fazla 14 ay sonrasına (örneğin 2027 sonu) izin verilir
        return new Date(d.getFullYear() + 1, d.getMonth() + 2, 1);
    }, []);

    const isPrevMonthDisabled = useMemo(() => {
        const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        return prev < minNavDate;
    }, [viewDate, minNavDate]);

    const isNextMonthDisabled = useMemo(() => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        return next > maxNavDate;
    }, [viewDate, maxNavDate]);

    // Ay Navigasyon Kontrolleri
    const handlePrevMonth = () => {
        if (isPrevMonthDisabled) return;
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() - 1);
        setViewDate(d);
    };

    const handleNextMonth = () => {
        if (isNextMonthDisabled) return;
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + 1);
        setViewDate(d);
    };

    const handleToday = () => {
        const today = new Date();
        setSelectedDate(today);
        setViewDate(today);
    };

    // Gerçek Veri Tarih Eşleme Fonksiyonları (Sallama ve rastgele atamaları engeller)
    const isDividendDateMatch = (item: any, target: Date) => {
        const year = target.getFullYear();
        const month = String(target.getMonth() + 1).padStart(2, '0');
        const day = String(target.getDate()).padStart(2, '0');
        const targetIso = `${year}-${month}-${day}`;
        const targetTr = `${day}.${month}.${year}`;

        if (item.parsedDate && item.parsedDate === targetIso) return true;
        if (item.paymentDate) {
            const trimmed = item.paymentDate.trim();
            if (trimmed === targetTr || trimmed === `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`) return true;
        }
        return false;
    };

    const isEarningsDateMatch = (item: any, target: Date) => {
        const year = target.getFullYear();
        const month = String(target.getMonth() + 1).padStart(2, '0');
        const day = String(target.getDate()).padStart(2, '0');
        const targetIso = `${year}-${month}-${day}`;
        const targetTr = `${day}.${month}.${year}`;

        if (item.parsedDate && item.parsedDate === targetIso) return true;
        if (item.earningsDate) {
            const trimmed = item.earningsDate.trim();
            if (trimmed === targetTr || trimmed === `${parseInt(day, 10)}.${parseInt(month, 10)}.${year}`) return true;
        }
        return false;
    };

    const isIpoDateMatch = (item: any, target: Date) => {
        const year = target.getFullYear();
        const month = String(target.getMonth() + 1).padStart(2, '0');
        const day = String(target.getDate()).padStart(2, '0');
        const targetIso = `${year}-${month}-${day}`;

        if (Array.isArray(item.dates) && item.dates.includes(targetIso)) return true;
        if (item.startDate && item.endDate) {
            return targetIso >= item.startDate && targetIso <= item.endDate;
        }
        return false;
    };

    const isEconomicDateMatch = (item: any, target: Date) => {
        const year = target.getFullYear();
        const month = String(target.getMonth() + 1).padStart(2, '0');
        const day = String(target.getDate()).padStart(2, '0');
        const targetIso = `${year}-${month}-${day}`;
        const targetTr = `${day}.${month}.${year}`;

        if (item.dateFormatted && (item.dateFormatted.trim() === targetTr || item.dateFormatted.includes(targetTr))) return true;
        if (item.event_date && item.event_date === targetIso) return true;
        if (item.date && (item.date === targetIso || item.date === targetTr)) return true;
        return false;
    };

    const dayHasEvents = (cellDate: Date) => {
        if (activeFilter === 'dividends') {
            return dividends.some(d => isDividendDateMatch(d, cellDate));
        }
        if (activeFilter === 'earnings') {
            return earnings.some(e => isEarningsDateMatch(e, cellDate));
        }
        if (activeFilter === 'ipo') {
            return ipos.some(i => isIpoDateMatch(i, cellDate));
        }
        if (activeFilter === 'economic') {
            return economicEvents.some(ev => isEconomicDateMatch(ev, cellDate));
        }
        return (
            dividends.some(d => isDividendDateMatch(d, cellDate)) ||
            earnings.some(e => isEarningsDateMatch(e, cellDate)) ||
            ipos.some(i => isIpoDateMatch(i, cellDate)) ||
            economicEvents.some(ev => isEconomicDateMatch(ev, cellDate))
        );
    };

    // Portföy Sembol Seti
    const portfolioSymbols = useMemo(() => {
        return new Set((myAssets || []).map((a: any) => (a.symbol || '').toUpperCase().replace(/\.IS$/, '')));
    }, [myAssets]);

    // Portföye Özel Olaylar
    const portfolioEvents = useMemo(() => {
        if (portfolioSymbols.size === 0) return [];
        const list: any[] = [];

        earnings.forEach(e => {
            const sym = (e.symbol || '').toUpperCase().replace(/\.IS$/, '');
            if (portfolioSymbols.has(sym)) {
                list.push({ ...e, eventType: 'earnings', typeLabel: 'Bilanço', date: e.earningsDate });
            }
        });

        dividends.forEach(d => {
            const sym = (d.symbol || '').toUpperCase().replace(/\.IS$/, '');
            if (portfolioSymbols.has(sym)) {
                list.push({ ...d, eventType: 'dividends', typeLabel: 'Temettü', date: d.paymentDate });
            }
        });

        return list;
    }, [portfolioSymbols, earnings, dividends]);

    // Tarih / Sayı Ayrıştırma Yardımcıları
    const getItemTimestamp = (item: any, dateKey: string = 'paymentDate'): number => {
        if (item.timestamp && item.timestamp > 0) return item.timestamp;
        const val = item[dateKey] || item.earningsDate || item.paymentDate;
        if (val && String(val).trim() !== '...' && String(val).trim() !== 'Açıklanmadı' && String(val).trim() !== '-') {
            const parts = String(val).split('.');
            if (parts.length === 3) {
                const d = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);
                const y = parseInt(parts[2], 10);
                if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d > 0 && d <= 31 && m > 0 && m <= 12 && y >= 2020) {
                    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
                }
            }
            const t = new Date(val).getTime();
            if (!isNaN(t)) return t;
        }
        return 0;
    };

    const isDividendDateAnnounced = (item: any): boolean => {
        if (!item) return false;
        const val = String(item.paymentDate || item.parsedDate || '').trim();
        if (!val || val === '...' || val === '-' || val.toLowerCase().includes('açıklanma')) return false;
        const ts = getItemTimestamp(item, 'paymentDate');
        return ts > 0;
    };

    // HALKA ARZ: Tek tarih kaynağı "Talep Toplama Tarihleri" (startDate / endDate)
    const isIpoDateAnnounced = (item: any): boolean => {
        return Boolean(item && item.startDate && item.endDate);
    };

    const getIpoTimeRange = (item: any): { start: number; end: number } | null => {
        if (!isIpoDateAnnounced(item)) return null;
        const s = new Date(item.startDate + 'T00:00:00').getTime();
        const e = new Date(item.endDate + 'T23:59:59').getTime();
        if (isNaN(s) || isNaN(e)) return null;
        return { start: s, end: e };
    };

    // Talep toplama tarihlerine göre bugünkü aşama (kullanıcının yerel gününe göre)
    const getIpoPhase = (item: any): 'active' | 'upcoming' | 'completed' | null => {
        if (!isIpoDateAnnounced(item)) return null;
        const now = new Date();
        const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (todayIso < item.startDate) return 'upcoming';
        if (todayIso > item.endDate) return 'completed';
        return 'active';
    };

    // Talep toplama tarihine göre "en yakından en uzağa" karşılaştırma:
    // Talep toplayanlar → Yaklaşanlar (en yakın başlangıç önce) → Tamamlananlar (en son biten önce) → Tarihsizler
    const compareIposByTalepToplama = (a: any, b: any): number => {
        const rank = (p: ReturnType<typeof getIpoPhase>) => (p === 'active' ? 0 : p === 'upcoming' ? 1 : p === 'completed' ? 2 : 3);
        const pa = getIpoPhase(a);
        const pb = getIpoPhase(b);
        if (rank(pa) !== rank(pb)) return rank(pa) - rank(pb);
        if (pa === 'completed') return String(b.endDate).localeCompare(String(a.endDate));
        if (pa === 'active' || pa === 'upcoming') return String(a.startDate).localeCompare(String(b.startDate));
        return 0;
    };

    const getIpoStatusLabel = (item: any): string => {
        const badge = String(item?.status || '').trim();
        const phase = getIpoPhase(item);
        // halkarz.com rozetleri (Ertelendi, Başvuru Sürecinde, İptal vb.) korunur
        if (badge && !/talep|taslak/i.test(badge)) return badge;
        if (phase === 'active') return 'Talep Toplanıyor';
        if (phase === 'upcoming') return 'Talep Toplama Yaklaşıyor';
        if (phase === 'completed') return 'Talep Toplama Tamamlandı';
        return badge || 'Taslak';
    };

    const getIpoStatusBadgeClass = (item: any): string => {
        const phase = getIpoPhase(item);
        if (phase === 'active') return 'bg-purple-600 text-white border-purple-700';
        if (phase === 'upcoming') return 'bg-purple-100 text-purple-800 border-purple-300';
        if (phase === 'completed') return 'bg-slate-100 text-slate-600 border-slate-200';
        return 'bg-purple-50 text-purple-700 border-purple-200';
    };

    const isEconomicEventReleased = (item: any): boolean => {
        if (!item) return false;
        if (item.is_released === true) return true;
        if (item.is_released === false) return false;
        const act = String(item.actual || '').trim();
        if (!act || act === '-' || act === '—' || act === '...' || act.toLowerCase() === 'bekleniyor') {
            return false;
        }
        return true;
    };

    const getEconomicEventTimestamp = (item: any): number => {
        if (item.timestamp && item.timestamp > 0) return item.timestamp;
        const dateStr = item.dateFormatted || item.event_date || item.date;
        const timeStr = item.time || '00:00';
        if (dateStr) {
            const parts = String(dateStr).split('.');
            if (parts.length === 3) {
                const d = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);
                const y = parseInt(parts[2], 10);
                const [hh, mm] = String(timeStr).split(':').map((x: string) => parseInt(x, 10) || 0);
                if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                    return new Date(y, m - 1, d, hh, mm).getTime();
                }
            }
            const t = new Date(dateStr).getTime();
            if (!isNaN(t)) return t;
        }
        return 0;
    };

    const getItemYield = (item: any): number => {
        if (item.yieldPercent !== undefined && item.yieldPercent !== null) return Number(item.yieldPercent);
        if (item.yield !== undefined && item.yield !== null) return Number(item.yield);
        return 0;
    };

    const getItemAmount = (item: any): number => {
        if (item.netAmountPerShare !== undefined && item.netAmountPerShare !== null) return Number(item.netAmountPerShare);
        if (item.netAmount !== undefined && item.netAmount !== null) return Number(item.netAmount);
        if (item.netAmountFormatted) {
            const parsed = parseFloat(item.netAmountFormatted.replace('TL', '').replace(',', '.').trim());
            if (!isNaN(parsed)) return parsed;
        }
        return 0;
    };

    // ==========================================
    // TEMETTÜ FİLTRELEME & SIRALAMA MANTIĞI
    // ==========================================
    const filteredDividends = useMemo(() => {
        let list = [...dividends];
        if (divSearch.trim()) {
            const q = divSearch.trim().toLowerCase();
            list = list.filter(item =>
                (item.symbol || '').toLowerCase().includes(q) ||
                (item.companyName || '').toLowerCase().includes(q)
            );
        }
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // 1. Tarih Filtresi (Kural 2 & 3: Tarihi açıklanmayan hisseler SADECE "Tümü" seçildiğinde listelenir)
        if (divDateFilter !== 'all') {
            list = list.filter(item => {
                if (!isDividendDateAnnounced(item)) return false;
                const ts = getItemTimestamp(item, 'paymentDate');
                if (!ts) return false;
                const itemDate = new Date(ts);
                if (divDateFilter === 'today') return itemDate.toDateString() === now.toDateString();
                if (divDateFilter === 'this-week') {
                    const diffDays = (itemDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
                    return diffDays >= -1 && diffDays <= 7;
                }
                if (divDateFilter === 'this-month') return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                return true;
            });
        }

        // 2. Durum Filtresi
        if (divStatusFilter !== 'all') {
            list = list.filter(item => {
                const isAnnounced = isDividendDateAnnounced(item);
                if (!isAnnounced) {
                    return divStatusFilter === 'upcoming';
                }
                const ts = getItemTimestamp(item, 'paymentDate');
                return divStatusFilter === 'upcoming' ? ts >= todayStart : ts < todayStart;
            });
        }
        if (divYieldFilter !== 'all') {
            list = list.filter(item => {
                const y = getItemYield(item);
                if (divYieldFilter === '0-2') return y > 0 && y <= 2;
                if (divYieldFilter === '2-5') return y > 2 && y <= 5;
                if (divYieldFilter === '5plus') return y > 5;
                return true;
            });
        }
        if (divAmountFilter !== 'all') {
            list = list.filter(item => {
                const amt = getItemAmount(item);
                if (divAmountFilter === 'low') return amt > 0 && amt < 2;
                if (divAmountFilter === 'medium') return amt >= 2 && amt <= 10;
                if (divAmountFilter === 'high') return amt > 10;
                return true;
            });
        }
        if (divPortfolioOnly) {
            list = list.filter(item => {
                const sym = (item.symbol || '').toUpperCase().replace(/\.IS$/, '');
                return portfolioSymbols.has(sym);
            });
        }

        // Kural 4: Sıralamada En Yakın ve En Uzak seçildiğinde tarihi açıklanmayanlar filtrelenir
        if (divSort === 'date-asc' || divSort === 'date-desc') {
            list = list.filter(item => isDividendDateAnnounced(item));
        }

        // Kural 1: Varsayılan sıralamada tarihi açıklanmayan hisseler EN ALTTA çıkar
        list.sort((a, b) => {
            const hasDateA = isDividendDateAnnounced(a);
            const hasDateB = isDividendDateAnnounced(b);
            const tsA = getItemTimestamp(a, 'paymentDate');
            const tsB = getItemTimestamp(b, 'paymentDate');
            const yA = getItemYield(a);
            const yB = getItemYield(b);
            const amtA = getItemAmount(a);
            const amtB = getItemAmount(b);

            // Varsayılan sıralama: Kesin tarihi olanlar yakından uzağa, tarihi açıklanmayanlar en altta
            if (divSort === 'default') {
                if (hasDateA && !hasDateB) return -1;
                if (!hasDateA && hasDateB) return 1;
                if (!hasDateA && !hasDateB) return (a.symbol || '').localeCompare(b.symbol || '');
                return tsA - tsB;
            }

            if (divSort === 'date-asc') return tsA - tsB;
            if (divSort === 'date-desc') return tsB - tsA;

            // Diğer tüm sıralamalarda da tarihi açıklanmayanları en alta yerleştir
            if (hasDateA && !hasDateB) return -1;
            if (!hasDateA && hasDateB) return 1;

            if (divSort === 'yield-desc') return yB - yA;
            if (divSort === 'yield-asc') return yA - yB;
            if (divSort === 'amount-desc') return amtB - amtA;
            if (divSort === 'name-asc') return (a.companyName || '').localeCompare(b.companyName || '');
            if (divSort === 'name-desc') return (b.companyName || '').localeCompare(a.companyName || '');
            return 0;
        });
        return list;
    }, [dividends, divSearch, divDateFilter, divStatusFilter, divYieldFilter, divAmountFilter, divPortfolioOnly, divSort, portfolioSymbols]);

    const divActiveChips = useMemo(() => {
        const chips: { id: string; label: string; clear: () => void }[] = [];
        if (divSearch.trim()) chips.push({ id: 'search', label: `Arama: "${divSearch}"`, clear: () => { setDivSearch(''); updateDividendUrlParams({ search: '' }); } });
        if (divDateFilter !== 'all') {
            const labels: Record<string, string> = { today: 'Bugün', 'this-week': 'Bu Hafta', 'this-month': 'Bu Ay' };
            chips.push({ id: 'date', label: `Tarih: ${labels[divDateFilter] || divDateFilter}`, clear: () => { setDivDateFilter('all'); updateDividendUrlParams({ date: 'all' }); } });
        }
        if (divStatusFilter !== 'all') chips.push({ id: 'status', label: `Durum: ${divStatusFilter === 'upcoming' ? 'Yaklaşan' : 'Gerçekleşen'}`, clear: () => { setDivStatusFilter('all'); updateDividendUrlParams({ status: 'all' }); } });
        if (divYieldFilter !== 'all') {
            const labels: Record<string, string> = { '0-2': '%0–2', '2-5': '%2–5', '5plus': '%5+' };
            chips.push({ id: 'yield', label: `Verim: ${labels[divYieldFilter]}`, clear: () => { setDivYieldFilter('all'); updateDividendUrlParams({ yield: 'all' }); } });
        }
        if (divAmountFilter !== 'all') {
            const labels: Record<string, string> = { low: 'Düşük (<2 TL)', medium: 'Orta (2–10 TL)', high: 'Yüksek (>10 TL)' };
            chips.push({ id: 'amount', label: `Tutar: ${labels[divAmountFilter]}`, clear: () => { setDivAmountFilter('all'); updateDividendUrlParams({ amount: 'all' }); } });
        }
        if (divPortfolioOnly) chips.push({ id: 'portfolio', label: 'Portföyümdekiler', clear: () => { setDivPortfolioOnly(false); updateDividendUrlParams({ portfolio: false }); } });
        return chips;
    }, [divSearch, divDateFilter, divStatusFilter, divYieldFilter, divAmountFilter, divPortfolioOnly]);

    const divTotalPages = Math.ceil(filteredDividends.length / ITEMS_PER_PAGE) || 1;
    const paginatedDividends = useMemo(() => {
        const start = (divPage - 1) * ITEMS_PER_PAGE;
        return filteredDividends.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredDividends, divPage]);

    const clearAllDividendFilters = () => {
        setDivSearch('');
        setDivDateFilter('all');
        setDivStatusFilter('all');
        setDivYieldFilter('all');
        setDivAmountFilter('all');
        setDivPortfolioOnly(false);
        setDivSort('default');
        setDivPage(1);
        updateDividendUrlParams({ search: '', date: 'all', status: 'all', yield: 'all', amount: 'all', portfolio: false, sort: 'default' });
    };

    // ==========================================
    // BİLANÇO FİLTRELEME & SIRALAMA MANTIĞI
    // ==========================================
    const filteredEarnings = useMemo(() => {
        let list = [...earnings];
        if (earnSearch.trim()) {
            const q = earnSearch.trim().toLowerCase();
            list = list.filter(item =>
                (item.symbol || '').toLowerCase().includes(q) ||
                (item.companyName || '').toLowerCase().includes(q)
            );
        }
        const now = new Date();
        if (earnDateFilter !== 'all') {
            list = list.filter(item => {
                const ts = getItemTimestamp(item, 'earningsDate');
                if (!ts) return false;
                const itemDate = new Date(ts);
                if (earnDateFilter === 'today') return itemDate.toDateString() === now.toDateString();
                if (earnDateFilter === 'this-week') {
                    const diffDays = (itemDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
                    return diffDays >= -1 && diffDays <= 7;
                }
                if (earnDateFilter === 'this-month') return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                if (earnDateFilter === 'next-3-months') {
                    const diffDays = (itemDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
                    return diffDays >= 0 && diffDays <= 90;
                }
                return true;
            });
        }
        if (earnPeriodFilter !== 'all') {
            list = list.filter(item => {
                const str = (item.earningsDate || item.period || '').toLowerCase();
                if (earnPeriodFilter === '1q') return str.includes('1ç') || str.includes('1q');
                if (earnPeriodFilter === '2q') return str.includes('2ç') || str.includes('2q');
                if (earnPeriodFilter === '3q') return str.includes('3ç') || str.includes('3q');
                if (earnPeriodFilter === '4q') return str.includes('4ç') || str.includes('4q') || str.includes('yıllık');
                return true;
            });
        }
        if (earnStatusFilter !== 'all') {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            list = list.filter(item => {
                const ts = getItemTimestamp(item, 'earningsDate');
                if (!ts) return true;
                return earnStatusFilter === 'upcoming' ? ts >= todayStart : ts < todayStart;
            });
        }
        if (earnPortfolioOnly) {
            list = list.filter(item => {
                const sym = (item.symbol || '').toUpperCase().replace(/\.IS$/, '');
                return portfolioSymbols.has(sym);
            });
        }
        list.sort((a, b) => {
            const tsA = getItemTimestamp(a, 'earningsDate');
            const tsB = getItemTimestamp(b, 'earningsDate');
            if (earnSort === 'date-asc') return tsA - tsB;
            if (earnSort === 'date-desc') return tsB - tsA;
            if (earnSort === 'name-asc') return (a.companyName || '').localeCompare(b.companyName || '');
            if (earnSort === 'name-desc') return (b.companyName || '').localeCompare(a.companyName || '');
            return 0;
        });
        return list;
    }, [earnings, earnSearch, earnDateFilter, earnPeriodFilter, earnStatusFilter, earnPortfolioOnly, earnSort, portfolioSymbols]);

    const earnActiveChips = useMemo(() => {
        const chips: { id: string; label: string; clear: () => void }[] = [];
        if (earnSearch.trim()) chips.push({ id: 'search', label: `Arama: "${earnSearch}"`, clear: () => { setEarnSearch(''); updateEarningsUrlParams({ search: '' }); } });
        if (earnDateFilter !== 'all') {
            const labels: Record<string, string> = { today: 'Bugün', 'this-week': 'Bu Hafta', 'this-month': 'Bu Ay', 'next-3-months': 'Önümüzdeki 3 Ay' };
            chips.push({ id: 'date', label: `Tarih: ${labels[earnDateFilter]}`, clear: () => { setEarnDateFilter('all'); updateEarningsUrlParams({ date: 'all' }); } });
        }
        if (earnPeriodFilter !== 'all') {
            const labels: Record<string, string> = { '1q': '1. Çeyrek (1Ç)', '2q': '2. Çeyrek (2Ç)', '3q': '3. Çeyrek (3Ç)', '4q': '4. Çeyrek (Yıllık)' };
            chips.push({ id: 'period', label: `Dönem: ${labels[earnPeriodFilter]}`, clear: () => { setEarnPeriodFilter('all'); updateEarningsUrlParams({ period: 'all' }); } });
        }
        if (earnStatusFilter !== 'all') chips.push({ id: 'status', label: `Durum: ${earnStatusFilter === 'upcoming' ? 'Yaklaşan' : 'Açıklanan'}`, clear: () => { setEarnStatusFilter('all'); updateEarningsUrlParams({ status: 'all' }); } });
        if (earnPortfolioOnly) chips.push({ id: 'portfolio', label: 'Portföyümdekiler', clear: () => { setEarnPortfolioOnly(false); updateEarningsUrlParams({ portfolio: false }); } });
        return chips;
    }, [earnSearch, earnDateFilter, earnPeriodFilter, earnStatusFilter, earnPortfolioOnly]);

    const earnTotalPages = Math.ceil(filteredEarnings.length / ITEMS_PER_PAGE) || 1;
    const paginatedEarnings = useMemo(() => {
        const start = (earnPage - 1) * ITEMS_PER_PAGE;
        return filteredEarnings.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEarnings, earnPage]);

    const clearAllEarningsFilters = () => {
        setEarnSearch('');
        setEarnDateFilter('all');
        setEarnPeriodFilter('all');
        setEarnStatusFilter('all');
        setEarnPortfolioOnly(false);
        setEarnSort('date-asc');
        setEarnPage(1);
        router.replace('/dashboard/calendar?type=earnings', { scroll: false });
    };

    // ==========================================
    // HALKA ARZ FİLTRELEME & SIRALAMA MANTIĞI
    // ==========================================
    const filteredIpos = useMemo(() => {
        let list = [...ipos];
        if (ipoSearch.trim()) {
            const q = ipoSearch.trim().toLowerCase();
            list = list.filter(item =>
                (item.symbol || '').toLowerCase().includes(q) ||
                (item.companyName || '').toLowerCase().includes(q)
            );
        }
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const todayEnd = todayStart + (24 * 60 * 60 * 1000) - 1;

        // Kural 5: Tarih filtresinde herhangi bir zaman aralığı seçildiğinde
        // sadece Talep toplama tarihleri belli olan ve belirlenen zaman aralığına uygun hisseleri gösterelim
        if (ipoDateFilter !== 'all') {
            list = list.filter(item => {
                const range = getIpoTimeRange(item);
                if (!range) return false; // Kesinlikle tarihi açıklanmamış olanları eler

                if (ipoDateFilter === 'today') {
                    return range.start <= todayEnd && range.end >= todayStart;
                }
                if (ipoDateFilter === 'this-week') {
                    const dayOfWeek = now.getDay();
                    const diffMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffMon).getTime();
                    const weekEnd = weekStart + (7 * 24 * 60 * 60 * 1000) - 1;
                    return range.start <= weekEnd && range.end >= weekStart;
                }
                if (ipoDateFilter === 'this-month') {
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
                    return range.start <= monthEnd && range.end >= monthStart;
                }
                return true;
            });
        }

        // Kural 4: Durum filtresi seçenekleri: ertelendi, taslak, reddedildi, iptal edildi, talep toplama, başvuru sürecinde
        if (ipoStatusFilter !== 'all') {
            list = list.filter(item => {
                const st = `${item.status || ''} ${item.badge || ''}`.toLowerCase();
                if (ipoStatusFilter === 'talep-toplama') return isIpoDateAnnounced(item);
                if (ipoStatusFilter === 'taslak') return st.includes('taslak');
                if (ipoStatusFilter === 'basvuru') return st.includes('başvuru') || st.includes('basvuru') || st.includes('spk onay') || st.includes('onay');
                if (ipoStatusFilter === 'ertelendi') return st.includes('ertelendi') || st.includes('ertele');
                if (ipoStatusFilter === 'reddedildi') return st.includes('reddedildi') || st.includes('ret');
                if (ipoStatusFilter === 'iptal-edildi') return st.includes('iptal');
                return true;
            });
        }

        if (ipoPriceFilter !== 'all') {
            list = list.filter(item => {
                const p = parseFloat(item.priceFormatted || item.offerPrice || '0');
                if (ipoPriceFilter === '0-25') return p > 0 && p <= 25;
                if (ipoPriceFilter === '25-50') return p > 25 && p <= 50;
                if (ipoPriceFilter === '50-100') return p > 50 && p <= 100;
                if (ipoPriceFilter === '100plus') return p > 100;
                return true;
            });
        }

        // Kural 2: En yakın tarih ve en uzak tarih seçeneği sıralama filtresinden seçildiği zaman
        // kullanıcıya sadece tarihleri açıklanmış olan hisseleri gösterelim
        if (ipoSort === 'date-asc' || ipoSort === 'date-desc') {
            list = list.filter(item => isIpoDateAnnounced(item));
        }

        list.sort((a, b) => {
            if (ipoSort === 'name-asc') {
                return (a.companyName || '').localeCompare(b.companyName || '');
            }
            if (ipoSort === 'name-desc') {
                return (b.companyName || '').localeCompare(a.companyName || '');
            }
            // En Uzak Tarih: talep toplama tarihine göre en yakından en uzağa sıralamanın tersi
            if (ipoSort === 'date-desc') {
                return compareIposByTalepToplama(b, a);
            }
            // Varsayılan ve En Yakın Tarih: yalnızca talep toplama tarihlerine göre
            // Talep toplayanlar → Yaklaşanlar → Tamamlananlar (en son biten önce) → Tarihsizler (en altta)
            return compareIposByTalepToplama(a, b);
        });

        return list;
    }, [ipos, ipoSearch, ipoDateFilter, ipoStatusFilter, ipoPriceFilter, ipoSort]);

    const ipoActiveChips = useMemo(() => {
        const chips: { id: string; label: string; clear: () => void }[] = [];
        if (ipoSearch.trim()) chips.push({ id: 'search', label: `Arama: "${ipoSearch}"`, clear: () => { setIpoSearch(''); updateIpoUrlParams({ search: '' }); } });
        if (ipoDateFilter !== 'all') {
            const labels: Record<string, string> = { today: 'Bugün', 'this-week': 'Bu Hafta', 'this-month': 'Bu Ay' };
            chips.push({ id: 'date', label: `Tarih: ${labels[ipoDateFilter]}`, clear: () => { setIpoDateFilter('all'); updateIpoUrlParams({ date: 'all' }); } });
        }
        if (ipoStatusFilter !== 'all') {
            const labels: Record<string, string> = {
                'talep-toplama': 'Talep Toplama',
                'taslak': 'Taslak',
                'basvuru': 'Başvuru Sürecinde',
                'ertelendi': 'Ertelendi',
                'reddedildi': 'Reddedildi',
                'iptal-edildi': 'İptal Edildi'
            };
            chips.push({ id: 'status', label: `Durum: ${labels[ipoStatusFilter] || ipoStatusFilter}`, clear: () => { setIpoStatusFilter('all'); updateIpoUrlParams({ status: 'all' }); } });
        }
        if (ipoPriceFilter !== 'all') {
            const labels: Record<string, string> = { '0-25': '0–25 TL', '25-50': '25–50 TL', '50-100': '50–100 TL', '100plus': '100 TL+' };
            chips.push({ id: 'price', label: `Fiyat: ${labels[ipoPriceFilter]}`, clear: () => { setIpoPriceFilter('all'); updateIpoUrlParams({ price: 'all' }); } });
        }
        return chips;
    }, [ipoSearch, ipoDateFilter, ipoStatusFilter, ipoPriceFilter]);

    const ipoTotalPages = Math.ceil(filteredIpos.length / ITEMS_PER_PAGE) || 1;
    const paginatedIpos = useMemo(() => {
        const start = (ipoPage - 1) * ITEMS_PER_PAGE;
        return filteredIpos.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredIpos, ipoPage]);

    const clearAllIpoFilters = () => {
        setIpoSearch('');
        setIpoDateFilter('all');
        setIpoStatusFilter('all');
        setIpoPriceFilter('all');
        setIpoSort('default');
        setIpoPage(1);
        router.replace('/dashboard/calendar?type=ipo', { scroll: false });
    };

    // ==========================================
    // EKONOMİK TAKVİM FİLTRELEME & SIRALAMA MANTIĞI
    // ==========================================
    const filteredEconomicEvents = useMemo(() => {
        let list = [...economicEvents];

        // Kural 2: Çin, Japonya ve Almanya gibi ülkeleri kaldır
        list = list.filter(item => {
            const c = (item.country || item.currency || '').toLowerCase();
            if (c.includes('cn') || c.includes('cny') || c.includes('çin') ||
                c.includes('jp') || c.includes('jpy') || c.includes('japonya') ||
                c.includes('de') || c.includes('almanya')) {
                return false;
            }
            return true;
        });

        if (ecoSearch.trim()) {
            const q = ecoSearch.trim().toLowerCase();
            list = list.filter(item =>
                (item.event || '').toLowerCase().includes(q) ||
                (item.country || '').toLowerCase().includes(q) ||
                (item.currency || '').toLowerCase().includes(q)
            );
        }
        const now = new Date();
        if (ecoDateFilter !== 'all') {
            list = list.filter(item => {
                if (ecoDateFilter === 'today') return item.isToday || false;
                if (ecoDateFilter === 'tomorrow') {
                    const tom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    return item.dateFormatted?.includes(tom.getDate().toString()) || false;
                }
                return true;
            });
        }
        if (ecoCountryFilter !== 'all') {
            list = list.filter(item => {
                const c = (item.country || item.currency || '').toLowerCase();
                if (ecoCountryFilter === 'tr') return c.includes('tr') || c.includes('try') || c.includes('türkiye');
                if (ecoCountryFilter === 'us') return c.includes('us') || c.includes('usd') || c.includes('abd');
                if (ecoCountryFilter === 'eu') return c.includes('eu') || c.includes('eur') || c.includes('euro');
                if (ecoCountryFilter === 'uk') return c.includes('uk') || c.includes('gbp') || c.includes('ingiltere');
                return true;
            });
        }

        // Kural 1: Önem seviyesi seçildiğinde direkt tüm verilerin kaybolması düzeltildi
        if (ecoImportanceFilter !== 'all') {
            list = list.filter(item => {
                const imp = item.impact;
                if (ecoImportanceFilter === 'high') {
                    return imp === 'critical' || imp === 'high' || imp === 'Yüksek' || imp === 'Kritik' || imp === 3 || imp === '3';
                }
                if (ecoImportanceFilter === 'medium') {
                    return imp === 'medium' || imp === 'Orta' || imp === 2 || imp === '2';
                }
                if (ecoImportanceFilter === 'low') {
                    return imp === 'low' || imp === 'Düşük' || imp === 1 || imp === '1';
                }
                return true;
            });
        }

        // Kural 3: Durum filtresi - Açıklandı seçildiğinde sadece açıklananlar, Beklenen seçildiğinde sadece beklenenler
        if (ecoStatusFilter !== 'all') {
            list = list.filter(item => {
                const hasActual = isEconomicEventReleased(item);
                return ecoStatusFilter === 'announced' ? hasActual : !hasActual;
            });
        }

        // Kural 4: En yakın tarih seçeneğine basıldığı zaman açıklanmamış verilerden en yakın tarihten itibaren başlasın, açıklananlar gizlensin
        if (ecoSort === 'date-asc') {
            list = list.filter(item => !isEconomicEventReleased(item));
        }

        list.sort((a, b) => {
            const impVal = (item: any) => {
                const imp = item.impact;
                if (imp === 'critical' || imp === 'high' || imp === 'Yüksek' || imp === 'Kritik' || imp === 3) return 3;
                if (imp === 'medium' || imp === 'Orta' || imp === 2) return 2;
                return 1;
            };

            if (ecoSort === 'importance-desc') {
                return impVal(b) - impVal(a);
            }
            if (ecoSort === 'name-asc') {
                return (a.event || '').localeCompare(b.event || '');
            }
            if (ecoSort === 'date-asc') {
                const tsA = getEconomicEventTimestamp(a);
                const tsB = getEconomicEventTimestamp(b);
                return (tsA || Infinity) - (tsB || Infinity);
            }

            // Default Sort: En yakın / güncel tarihe göre sırala
            const tsA = getEconomicEventTimestamp(a);
            const tsB = getEconomicEventTimestamp(b);
            if (tsA && tsB) return tsA - tsB;
            return 0;
        });

        return list;
    }, [economicEvents, ecoSearch, ecoDateFilter, ecoCountryFilter, ecoImportanceFilter, ecoStatusFilter, ecoSort]);

    const ecoActiveChips = useMemo(() => {
        const chips: { id: string; label: string; clear: () => void }[] = [];
        if (ecoSearch.trim()) chips.push({ id: 'search', label: `Arama: "${ecoSearch}"`, clear: () => { setEcoSearch(''); updateEconomicUrlParams({ search: '' }); } });
        if (ecoDateFilter !== 'all') {
            const labels: Record<string, string> = { today: 'Bugün', tomorrow: 'Yarın', 'this-week': 'Bu Hafta', 'this-month': 'Bu Ay' };
            chips.push({ id: 'date', label: `Tarih: ${labels[ecoDateFilter]}`, clear: () => { setEcoDateFilter('all'); updateEconomicUrlParams({ date: 'all' }); } });
        }
        if (ecoCountryFilter !== 'all') {
            const labels: Record<string, string> = { tr: 'Türkiye (TRY)', us: 'ABD (USD)', eu: 'Euro Bölgesi', uk: 'İngiltere' };
            chips.push({ id: 'country', label: `Ülke: ${labels[ecoCountryFilter] || ecoCountryFilter}`, clear: () => { setEcoCountryFilter('all'); updateEconomicUrlParams({ country: 'all' }); } });
        }
        if (ecoImportanceFilter !== 'all') {
            const labels: Record<string, string> = { high: 'Yüksek Önem', medium: 'Orta Önem', low: 'Düşük Önem' };
            chips.push({ id: 'importance', label: `Önem: ${labels[ecoImportanceFilter]}`, clear: () => { setEcoImportanceFilter('all'); updateEconomicUrlParams({ importance: 'all' }); } });
        }
        if (ecoStatusFilter !== 'all') {
            chips.push({ id: 'status', label: `Durum: ${ecoStatusFilter === 'announced' ? 'Açıklandı' : 'Bekleniyor'}`, clear: () => { setEcoStatusFilter('all'); updateEconomicUrlParams({ status: 'all' }); } });
        }
        return chips;
    }, [ecoSearch, ecoDateFilter, ecoCountryFilter, ecoImportanceFilter, ecoStatusFilter]);

    const ecoTotalPages = Math.ceil(filteredEconomicEvents.length / ITEMS_PER_PAGE) || 1;
    const paginatedEconomicEvents = useMemo(() => {
        const start = (ecoPage - 1) * ITEMS_PER_PAGE;
        return filteredEconomicEvents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEconomicEvents, ecoPage]);

    const clearAllEconomicFilters = () => {
        setEcoSearch('');
        setEcoDateFilter('all');
        setEcoCountryFilter('all');
        setEcoImportanceFilter('all');
        setEcoStatusFilter('all');
        setEcoSort('default');
        setEcoPage(1);
        router.replace('/dashboard/calendar?type=economic', { scroll: false });
    };

    // Sol Mini Takvim Grid Hesaplaması
    const monthCalendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let firstDayIndex = firstDayOfMonth.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        const daysInMonth = lastDayOfMonth.getDate();
        const grid: { date: Date; isCurrentMonth: boolean; dayNum: number }[] = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            grid.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
                dayNum: prevMonthLastDay - i
            });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            grid.push({
                date: new Date(year, month, d),
                isCurrentMonth: true,
                dayNum: d
            });
        }

        const remaining = 35 - grid.length > 0 ? 35 - grid.length : 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false,
                dayNum: i
            });
        }

        return grid;
    }, [viewDate]);

    // Seçili Günün Ajandası (Yalnızca gerçek eşleşen etkinlikler - sallama veri yok)
    const selectedDayAgenda = useMemo(() => {
        const agendaList: any[] = [];

        // 1. Bilanço
        if (activeFilter === 'all' || activeFilter === 'earnings') {
            earnings.forEach(e => {
                if (isEarningsDateMatch(e, selectedDate)) {
                    agendaList.push({
                        time: '09:00',
                        category: 'Bilanço',
                        categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
                        symbol: e.symbol,
                        title: e.companyName,
                        subtitle: `${e.earningsDate || '2026/3Ç'} Finansal Sonuçları (Resmi)`
                    });
                }
            });
        }

        // 2. Temettü
        if (activeFilter === 'all' || activeFilter === 'dividends') {
            dividends.forEach(d => {
                if (isDividendDateMatch(d, selectedDate)) {
                    agendaList.push({
                        time: '10:00',
                        category: 'Temettü',
                        categoryColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        symbol: d.symbol,
                        title: d.companyName,
                        subtitle: `${d.netAmountFormatted || 'Temettü Ödemesi'} (Hak Kullanım Tarihi)`
                    });
                }
            });
        }

        // 3. Halka Arz
        if (activeFilter === 'all' || activeFilter === 'ipo') {
            ipos.forEach(ipo => {
                if (isIpoDateMatch(ipo, selectedDate)) {
                    agendaList.push({
                        time: '11:00',
                        category: 'Halka Arz',
                        categoryColor: 'bg-purple-50 text-purple-700 border-purple-200',
                        symbol: ipo.symbol,
                        title: ipo.companyName,
                        subtitle: `Talep Toplama: ${ipo.dateRange || 'Tarih Bekleniyor'} (${ipo.status || 'Aktif'})`
                    });
                }
            });
        }

        // 4. Ekonomik Veri
        if (activeFilter === 'all' || activeFilter === 'economic') {
            economicEvents.forEach(ev => {
                if (isEconomicDateMatch(ev, selectedDate)) {
                    agendaList.push({
                        time: ev.time || '15:30',
                        category: 'Ekonomik',
                        categoryColor: 'bg-blue-50 text-blue-700 border-blue-200',
                        symbol: ev.country || 'USD',
                        title: ev.event,
                        subtitle: `Önceki: ${ev.previous} | Beklenti: ${ev.forecast}`
                    });
                }
            });
        }

        return agendaList;
    }, [selectedDate, activeFilter, earnings, dividends, ipos, economicEvents]);

    // ==========================================
    // GENEL BAKIŞ WİDGETLARI SIRALAMA MANTIĞI (Tarihi En Yakından En Uzağa)
    // ==========================================
    const overviewEarnings = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const valid = earnings.filter(item => {
            const ts = getItemTimestamp(item, 'earningsDate');
            return ts > 0;
        });

        // Bugünden itibaren yaklaşan bilançolar
        const upcoming = valid.filter(item => getItemTimestamp(item, 'earningsDate') >= todayStart);
        // Geçmiş bilançolar
        const past = valid.filter(item => getItemTimestamp(item, 'earningsDate') < todayStart);

        // Yaklaşanlar en yakın tarihten uzağa doğru artan sırada
        upcoming.sort((a, b) => getItemTimestamp(a, 'earningsDate') - getItemTimestamp(b, 'earningsDate'));
        // Geçmiştekiler bugüne en yakın olandan geriye doğru
        past.sort((a, b) => getItemTimestamp(b, 'earningsDate') - getItemTimestamp(a, 'earningsDate'));

        return [...upcoming, ...past].slice(0, 4);
    }, [earnings]);

    const overviewDividends = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        const valid = dividends.filter(item => isDividendDateAnnounced(item));

        // Bugünden itibaren yaklaşan temettüler (21 Ekim BASCM -> 23 Ekim MCARD -> 26 Ekim OSMEN ...)
        const upcoming = valid.filter(item => getItemTimestamp(item, 'paymentDate') >= todayStart);
        // Geçmişte ödenmiş temettüler (BEGYO vb.)
        const past = valid.filter(item => getItemTimestamp(item, 'paymentDate') < todayStart);

        // Yaklaşanlar en yakın tarihten uzağa doğru artan sırada
        upcoming.sort((a, b) => getItemTimestamp(a, 'paymentDate') - getItemTimestamp(b, 'paymentDate'));
        // Geçmiştekiler bugüne en yakın olandan geriye doğru
        past.sort((a, b) => getItemTimestamp(b, 'paymentDate') - getItemTimestamp(a, 'paymentDate'));

        return [...upcoming, ...past].slice(0, 4);
    }, [dividends]);

    const overviewIpos = useMemo(() => {
        // Genel bakışta sadece talep toplama tarihi belli olan halka arzlar gösterilir
        return ipos
            .filter(item => isIpoDateAnnounced(item))
            .sort(compareIposByTalepToplama)
            .slice(0, 4);
    }, [ipos]);

    // Piyasa Gündemi kartı: şu an talep toplayan + talep toplaması yaklaşan halka arz sayısı
    const activeOrUpcomingIpoCount = useMemo(() => {
        return ipos.filter(item => {
            const phase = getIpoPhase(item);
            return phase === 'active' || phase === 'upcoming';
        }).length;
    }, [ipos]);

    const overviewEconomicEvents = useMemo(() => {
        // Henüz açıklanmamış / yaklaşan ekonomik veriler
        const pending = economicEvents.filter(item => !isEconomicEventReleased(item));
        // Açıklanmış veriler
        const released = economicEvents.filter(item => isEconomicEventReleased(item));

        // Yaklaşan haberler en yakın tarih ve saate göre artan sırada
        pending.sort((a, b) => {
            const tsA = getEconomicEventTimestamp(a);
            const tsB = getEconomicEventTimestamp(b);
            return (tsA || Infinity) - (tsB || Infinity);
        });

        // Açıklanmış olanlar en son açıklanandan geriye doğru
        released.sort((a, b) => {
            const tsA = getEconomicEventTimestamp(a);
            const tsB = getEconomicEventTimestamp(b);
            return (tsB || 0) - (tsA || 0);
        });

        return [...pending, ...released].slice(0, 5);
    }, [economicEvents]);

    const formattedViewMonthYear = viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    const formattedSelectedDayHeader = selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });

    return (
        <div className="w-full min-h-screen bg-slate-50/50 p-3 sm:p-6 lg:p-8 space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    {activeFilter !== 'all' && (
                        <button
                            onClick={() => handleFilterSelect('all')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-[#00008B] transition-all mb-2.5 shadow-2xs"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Tüm Takvime Dön
                        </button>
                    )}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-[#00008B]/5 border border-[#00008B]/10 flex items-center justify-center text-[#00008B]">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#00008B] tracking-tight">
                            {activeFilter === 'dividends' && 'Temettü Takvimi'}
                            {activeFilter === 'earnings' && 'Bilanço Takvimi'}
                            {activeFilter === 'ipo' && 'Halka Arz Takvimi'}
                            {activeFilter === 'economic' && 'Ekonomik Takvim'}
                            {activeFilter === 'all' && 'Takvim'}
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-1">
                        {activeFilter === 'dividends' && 'Borsa İstanbul şirketlerinin temettü dağıtım ve hakediş takvimi.'}
                        {activeFilter === 'earnings' && 'Şirketlerin finansal sonuç ve bilanço açıklama takvimi.'}
                        {activeFilter === 'ipo' && 'Yaklaşan ve aktif talep toplayan halka arzların listesi.'}
                        {activeFilter === 'economic' && 'Küresel makroekonomik veriler ve faiz kararları takvimi.'}
                        {activeFilter === 'all' && 'Piyasalardaki önemli tarihleri takip edin ve yatırım planlarınızı öne geçirin.'}
                    </p>
                </div>

                {/* Date Controls */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                        onClick={handleToday}
                        className="px-3.5 py-2 text-xs font-black text-[#00008B] bg-[#00008B]/5 hover:bg-[#00008B]/10 border border-[#00008B]/10 rounded-xl transition-all shadow-xs"
                    >
                        Bugün
                    </button>
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                        <button
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled}
                            className="p-1.5 text-slate-600 hover:text-[#00008B] hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            aria-label="Önceki Ay"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 text-xs font-black text-[#00008B] min-w-[110px] text-center capitalize">
                            {formattedViewMonthYear}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            disabled={isNextMonthDisabled}
                            className="p-1.5 text-slate-600 hover:text-[#00008B] hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                            aria-label="Sonraki Ay"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Üst Kategori Filtre Butonları */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {[
                    { id: 'all', label: 'Tümü', icon: Sparkles, activeStyle: 'bg-[#00008B] text-white border-[#00008B] shadow-md shadow-[#00008B]/20', inactiveStyle: 'bg-white text-slate-600 border-slate-200/80 hover:border-[#00008B]/30 hover:text-[#00008B]' },
                    { id: 'earnings', label: 'Bilanço', icon: Building2, activeStyle: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20', inactiveStyle: 'bg-blue-50/60 text-blue-700 border-blue-200/60 hover:bg-blue-100/60' },
                    { id: 'dividends', label: 'Temettü', icon: Coins, activeStyle: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20', inactiveStyle: 'bg-emerald-50/60 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/60' },
                    { id: 'ipo', label: 'Halka Arz', icon: TrendingUp, activeStyle: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20', inactiveStyle: 'bg-purple-50/60 text-purple-700 border-purple-200/60 hover:bg-purple-100/60' },
                    { id: 'economic', label: 'Ekonomik', icon: Globe2, activeStyle: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20', inactiveStyle: 'bg-blue-50/60 text-blue-700 border-blue-200/60 hover:bg-blue-100/60' }
                ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleFilterSelect(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-2xl border transition-all whitespace-nowrap shadow-xs ${
                                isActive ? tab.activeStyle : tab.inactiveStyle
                            }`}
                        >
                            <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ================================================= */}
            {/* TEMETTÜ GELİŞMİŞ FİLTRELEME PANENİ */}
            {/* ================================================= */}
            {activeFilter === 'dividends' && (
                <div className="bg-gradient-to-b from-emerald-50/60 via-white to-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-100/60">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                <Coins className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-[#00008B]">Temettü Takvimi ve Filtreleme</h2>
                                <p className="text-[11px] font-bold text-slate-400">Şirket adına, verime, tutara ve tarihe göre temettü araması yapın</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={divSearch}
                                onChange={(e) => { setDivSearch(e.target.value); updateDividendUrlParams({ search: e.target.value }); }}
                                placeholder="Hisse Kodu veya Şirket Ara (örn: THYAO)..."
                                className="w-full pl-9 pr-8 py-2 text-xs font-bold text-slate-800 bg-white border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
                            />
                            {divSearch && (
                                <button onClick={() => { setDivSearch(''); updateDividendUrlParams({ search: '' }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-bold">
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Tarih</label>
                            <select value={divDateFilter} onChange={(e) => { const v = e.target.value as any; setDivDateFilter(v); updateDividendUrlParams({ date: v }); }} className="w-full p-2 bg-white border border-emerald-200/80 rounded-xl text-slate-700">
                                <option value="all">Tümü</option>
                                <option value="today">Bugün</option>
                                <option value="this-week">Bu Hafta</option>
                                <option value="this-month">Bu Ay</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Durum</label>
                            <select value={divStatusFilter} onChange={(e) => { const v = e.target.value as any; setDivStatusFilter(v); updateDividendUrlParams({ status: v }); }} className="w-full p-2 bg-white border border-emerald-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Durumlar</option>
                                <option value="upcoming">Yaklaşan</option>
                                <option value="completed">Gerçekleşen</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Verim</label>
                            <select value={divYieldFilter} onChange={(e) => { const v = e.target.value as any; setDivYieldFilter(v); updateDividendUrlParams({ yield: v }); }} className="w-full p-2 bg-white border border-emerald-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Verimler</option>
                                <option value="0-2">%0 – %2</option>
                                <option value="2-5">%2 – %5</option>
                                <option value="5plus">%5 ve Üzeri</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Net Tutar</label>
                            <select value={divAmountFilter} onChange={(e) => { const v = e.target.value as any; setDivAmountFilter(v); updateDividendUrlParams({ amount: v }); }} className="w-full p-2 bg-white border border-emerald-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Tutarlar</option>
                                <option value="low">Düşük (&lt; 2 TL)</option>
                                <option value="medium">Orta (2 – 10 TL)</option>
                                <option value="high">Yüksek (&gt; 10 TL)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Portföy</label>
                            <button onClick={() => { const v = !divPortfolioOnly; setDivPortfolioOnly(v); updateDividendUrlParams({ portfolio: v }); }} className={`w-full p-2 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${divPortfolioOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-emerald-200/80'}`}>
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>Portföyümdekiler</span>
                            </button>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Sıralama</label>
                            <select value={divSort} onChange={(e) => { const v = e.target.value as any; setDivSort(v); updateDividendUrlParams({ sort: v }); }} className="w-full p-2 bg-white border border-emerald-200/80 rounded-xl text-slate-700">
                                <option value="default">Varsayılan</option>
                                <option value="date-asc">En Yakın Tarih</option>
                                <option value="date-desc">En Uzak Tarih</option>
                                <option value="yield-desc">En Yüksek Verim</option>
                                <option value="yield-asc">En Düşük Verim</option>
                                <option value="amount-desc">En Yüksek Net Tutar</option>
                                <option value="name-asc">Şirket (A-Z)</option>
                                <option value="name-desc">Şirket (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {divActiveChips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-emerald-100/60">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Aktif Filtreler:</span>
                            {divActiveChips.map(chip => (
                                <span key={chip.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                                    <span>{chip.label}</span>
                                    <button onClick={chip.clear} className="hover:bg-emerald-200/80 rounded-full p-0.5"><X className="w-3 h-3 text-emerald-800" /></button>
                                </span>
                            ))}
                            <button onClick={clearAllDividendFilters} className="text-xs font-extrabold text-rose-600 hover:underline ml-2">Filtreleri Temizle</button>
                        </div>
                    )}

                    <div className="pt-2">
                        {/* Kural 4: En Yakın / En Uzak sıralamasında uyarı metni */}
                        {(divSort === 'date-asc' || divSort === 'date-desc') && (
                            <div className="mb-3 flex items-start sm:items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                                <p>
                                    <span className="font-extrabold text-amber-950">Bilgilendirme:</span> Sıralamada <strong>{divSort === 'date-asc' ? 'En Yakın Tarih' : 'En Uzak Tarih'}</strong> seçildiğinde, kesin temettü dağıtım tarihi henüz açıklanmayan hisseler listelenmez. Tarihi açıklanmayan hisseleri de görmek için <button type="button" onClick={() => { setDivSort('default'); updateDividendUrlParams({ sort: 'default' }); }} className="underline font-black text-amber-900 hover:text-amber-950">Varsayılan sıralama</button> modunu kullanabilirsiniz.
                                </p>
                            </div>
                        )}

                        <span className="text-xs font-black text-[#00008B] block mb-3">Toplam {filteredDividends.length} Temettü Kaydı</span>
                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : filteredDividends.length === 0 ? (
                            <div className="py-12 bg-white rounded-2xl border border-dashed border-emerald-200 flex flex-col items-center justify-center gap-2 text-center">
                                <Clock className="w-8 h-8 text-emerald-300" />
                                <p className="text-sm font-black text-slate-700">Sonuç bulunamadı</p>
                                <button onClick={clearAllDividendFilters} className="px-4 py-2 text-xs font-black text-white bg-emerald-600 rounded-xl">Filtreleri Temizle</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="overflow-x-auto scrollbar-none bg-white rounded-2xl border border-emerald-100 p-2 shadow-2xs">
                                    <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-0 text-xs font-bold">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase">
                                                <th className="py-2.5 px-3.5 bg-emerald-50/50 text-emerald-900/60 rounded-l-xl pl-4">Hisse / Şirket</th>
                                                <th className="py-2.5 px-3.5 bg-emerald-50/50 text-emerald-900/60">Hakediş / Ödeme Tarihi</th>
                                                <th className="py-2.5 px-3.5 bg-emerald-50/50 text-emerald-900/60">Hisse Başına Net Tutar</th>
                                                <th className="py-2.5 px-3.5 bg-emerald-50/50 text-emerald-900/60">Temettü Verimi</th>
                                                <th className="py-2.5 px-3.5 bg-emerald-50/50 text-emerald-900/60">Durum</th>
                                                <th className="py-2.5 px-3.5 text-right bg-emerald-50/50 text-emerald-900/60 rounded-r-xl pr-4">Hatırlatıcı</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedDividends.map((item, idx) => {
                                                const isAnnounced = isDividendDateAnnounced(item);
                                                const ts = getItemTimestamp(item, 'paymentDate');
                                                const now = new Date();
                                                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                                const isPaid = isAnnounced && ts > 0 && ts < todayStart;

                                                const cellBg = isPaid
                                                    ? "bg-emerald-600 group-hover:bg-emerald-700"
                                                    : !isAnnounced
                                                    ? "bg-slate-50/70 group-hover:bg-slate-100/80"
                                                    : "bg-emerald-50/40 group-hover:bg-emerald-50/70";

                                                return (
                                                    <tr key={idx} className="group transition-colors">
                                                        <td className={`py-3.5 pl-4 pr-3.5 rounded-l-2xl ${cellBg}`}>
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                                                                    isPaid
                                                                        ? 'bg-emerald-700 border-emerald-500 text-white'
                                                                        : !isAnnounced
                                                                        ? 'bg-slate-200/80 border-slate-300 text-slate-700'
                                                                        : 'bg-emerald-100/80 border-emerald-200 text-emerald-800'
                                                                }`}>
                                                                    {item.symbol?.substring(0, 3)}
                                                                </div>
                                                                <div>
                                                                    {item.symbol && item.symbol.trim() !== '-' ? (
                                                                        <Link 
                                                                            href={`/dashboard/varlik/${item.symbol.toUpperCase().replace(/\.IS$/, '').trim()}`}
                                                                            className={`hover:underline font-black text-xs block ${
                                                                                isPaid ? 'text-white hover:text-emerald-100' : 'text-[#00008B] hover:text-emerald-800'
                                                                            }`}
                                                                            title={`${item.symbol} Şirket Detayına Git`}
                                                                        >
                                                                            {item.symbol}
                                                                        </Link>
                                                                    ) : (
                                                                        <span className={`text-xs font-black block ${isPaid ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol || '-'}</span>
                                                                    )}
                                                                    <span className={`text-[11px] font-bold line-clamp-1 max-w-[220px] ${
                                                                        isPaid ? 'text-emerald-100' : 'text-slate-500'
                                                                    }`} title={item.companyName}>
                                                                        {item.companyName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-bold ${cellBg}`}>
                                                            {isAnnounced ? (
                                                                <span className={isPaid ? 'text-white font-black' : 'text-slate-700'}>{item.paymentDate}</span>
                                                            ) : (
                                                                <span className="text-slate-400 italic font-semibold">Açıklanmadı</span>
                                                            )}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-black ${cellBg} ${isPaid ? 'text-white' : 'text-emerald-700'}`}>
                                                            {item.netAmountFormatted || `${item.netAmountPerShare ? item.netAmountPerShare.toFixed(2) : '0,00'} TL`}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            <span className={`font-black text-xs ${isPaid ? 'text-white' : 'text-emerald-700'}`}>
                                                                %{getItemYield(item).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            <span className={`text-xs font-bold ${
                                                                isPaid ? 'text-white' : !isAnnounced ? 'text-slate-400 italic' : 'text-blue-700'
                                                            }`}>
                                                                {isPaid ? 'Ödendi' : !isAnnounced ? 'Açıklanmadı' : 'Yaklaşan'}
                                                            </span>
                                                        </td>
                                                        <td className={`py-3.5 pl-3.5 pr-4 text-right whitespace-nowrap rounded-r-2xl ${cellBg}`}>
                                                            <button title="Hatırlatıcı Ekle" className={`p-1.5 rounded-lg transition-all ${
                                                                isPaid
                                                                    ? 'text-white hover:text-emerald-100 hover:bg-emerald-700/80'
                                                                    : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-100/60'
                                                            }`}>
                                                                <Bell className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <TablePagination
                                    currentPage={divPage}
                                    totalPages={divTotalPages}
                                    totalItems={filteredDividends.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setDivPage}
                                    colorScheme="emerald"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* BİLANÇO GELİŞMİŞ FİLTRELEME PANENİ */}
            {/* ================================================= */}
            {activeFilter === 'earnings' && (
                <div className="bg-gradient-to-b from-blue-50/60 via-white to-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-blue-100/60">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-[#00008B]">Bilanço Takvimi ve Filtreleme</h2>
                                <p className="text-[11px] font-bold text-slate-400">Şirket adına, döneme, açıklama durumuna ve tarihe göre bilanço araması yapın</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={earnSearch}
                                onChange={(e) => { setEarnSearch(e.target.value); updateEarningsUrlParams({ search: e.target.value }); }}
                                placeholder="Hisse Kodu veya Şirket Ara (örn: THYAO)..."
                                className="w-full pl-9 pr-8 py-2 text-xs font-bold text-slate-800 bg-white border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs"
                            />
                            {earnSearch && (
                                <button onClick={() => { setEarnSearch(''); updateEarningsUrlParams({ search: '' }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-bold">
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Tarih</label>
                            <select value={earnDateFilter} onChange={(e) => { const v = e.target.value as any; setEarnDateFilter(v); updateEarningsUrlParams({ date: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Tarihler</option>
                                <option value="today">Bugün</option>
                                <option value="this-week">Bu Hafta</option>
                                <option value="this-month">Bu Ay</option>
                                <option value="next-3-months">Önümüzdeki 3 Ay</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Dönem</label>
                            <select value={earnPeriodFilter} onChange={(e) => { const v = e.target.value as any; setEarnPeriodFilter(v); updateEarningsUrlParams({ period: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Dönemler</option>
                                <option value="1q">1. Çeyrek (1Ç)</option>
                                <option value="2q">2. Çeyrek (2Ç)</option>
                                <option value="3q">3. Çeyrek (3Ç)</option>
                                <option value="4q">4. Çeyrek (Yıllık)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Durum</label>
                            <select value={earnStatusFilter} onChange={(e) => { const v = e.target.value as any; setEarnStatusFilter(v); updateEarningsUrlParams({ status: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Durumlar</option>
                                <option value="upcoming">Yaklaşan</option>
                                <option value="completed">Açıklanan</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Portföy</label>
                            <button onClick={() => { const v = !earnPortfolioOnly; setEarnPortfolioOnly(v); updateEarningsUrlParams({ portfolio: v }); }} className={`w-full p-2 rounded-xl border transition-all flex items-center justify-center gap-1.5 ${earnPortfolioOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-blue-200/80'}`}>
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>Portföyümdekiler</span>
                            </button>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Sıralama</label>
                            <select value={earnSort} onChange={(e) => { const v = e.target.value as any; setEarnSort(v); updateEarningsUrlParams({ sort: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="date-asc">En Yakın Tarih</option>
                                <option value="date-desc">En Uzak Tarih</option>
                                <option value="name-asc">Şirket (A-Z)</option>
                                <option value="name-desc">Şirket (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {earnActiveChips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-blue-100/60">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Aktif Filtreler:</span>
                            {earnActiveChips.map(chip => (
                                <span key={chip.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-blue-100/80 text-blue-900 border border-blue-200">
                                    <span>{chip.label}</span>
                                    <button onClick={chip.clear} className="hover:bg-blue-200/80 rounded-full p-0.5"><X className="w-3 h-3 text-blue-800" /></button>
                                </span>
                            ))}
                            <button onClick={clearAllEarningsFilters} className="text-xs font-extrabold text-rose-600 hover:underline ml-2">Filtreleri Temizle</button>
                        </div>
                    )}

                    <div className="pt-2">
                        <span className="text-xs font-black text-[#00008B] block mb-3">Toplam {filteredEarnings.length} Bilanço Kaydı</span>
                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : filteredEarnings.length === 0 ? (
                            <div className="py-12 bg-white rounded-2xl border border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 text-center">
                                <Clock className="w-8 h-8 text-blue-300" />
                                <p className="text-sm font-black text-slate-700">Sonuç bulunamadı</p>
                                <button onClick={clearAllEarningsFilters} className="px-4 py-2 text-xs font-black text-white bg-blue-600 rounded-xl">Filtreleri Temizle</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="overflow-x-auto scrollbar-none bg-white rounded-2xl border border-blue-100 p-2 shadow-2xs">
                                    <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-0 text-xs font-bold">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase">
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60 rounded-l-xl pl-4">Hisse / Şirket</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Bilanço Dönemi</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Açıklanma Tarihi</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Kalan Süre</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Durum</th>
                                                <th className="py-2.5 px-3.5 text-right bg-blue-50/50 text-blue-900/60 rounded-r-xl pr-4">Hatırlatıcı</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEarnings.map((item, idx) => {
                                                const isAnnounced = item.daysLeft !== undefined && item.daysLeft <= 0;
                                                const cellBg = isAnnounced
                                                    ? "bg-blue-600 group-hover:bg-blue-700"
                                                    : "bg-slate-50/70 group-hover:bg-blue-50/50";

                                                return (
                                                    <tr key={idx} className="group transition-colors">
                                                        <td className={`py-3.5 pl-4 pr-3.5 rounded-l-2xl ${cellBg}`}>
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                                                                    isAnnounced
                                                                        ? 'bg-blue-700 border-blue-500 text-white'
                                                                        : 'bg-blue-100/80 border-blue-200 text-blue-800'
                                                                }`}>
                                                                    {item.symbol?.substring(0, 3)}
                                                                </div>
                                                                <div>
                                                                    {item.symbol && item.symbol.trim() !== '-' ? (
                                                                        <Link 
                                                                            href={`/dashboard/varlik/${item.symbol.toUpperCase().replace(/\.IS$/, '').trim()}`}
                                                                            className={`hover:underline font-black text-xs block ${
                                                                                isAnnounced ? 'text-white hover:text-blue-100' : 'text-[#00008B] hover:text-blue-800'
                                                                            }`}
                                                                            title={`${item.symbol} Şirket Detayına Git`}
                                                                        >
                                                                            {item.symbol}
                                                                        </Link>
                                                                    ) : (
                                                                        <span className={`text-xs font-black block ${isAnnounced ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol || '-'}</span>
                                                                    )}
                                                                    <span className={`text-[11px] font-bold line-clamp-1 max-w-[220px] ${
                                                                        isAnnounced ? 'text-blue-100' : 'text-slate-500'
                                                                    }`} title={item.companyName}>
                                                                        {item.companyName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            <span className={`text-xs font-bold ${isAnnounced ? 'text-white' : 'text-slate-700'}`}>
                                                                2026/1Ç
                                                            </span>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-bold ${cellBg} ${isAnnounced ? 'text-white' : 'text-slate-700'}`}>
                                                            {item.earningsDate || 'Belirtilmedi'}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-semibold ${cellBg} ${isAnnounced ? 'text-blue-100' : 'text-slate-500'}`}>
                                                            {item.daysLeft !== undefined && item.daysLeft > 0 ? `${item.daysLeft} gün kaldı` : (isAnnounced ? 'Açıklandı' : 'Yakında')}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            <span className={`text-xs font-bold ${isAnnounced ? 'text-white' : 'text-blue-700'}`}>
                                                                {isAnnounced ? 'Açıklandı' : 'Bekleniyor'}
                                                            </span>
                                                        </td>
                                                        <td className={`py-3.5 pl-3.5 pr-4 text-right whitespace-nowrap rounded-r-2xl ${cellBg}`}>
                                                            <button title="Hatırlatıcı Ekle" className={`p-1.5 rounded-lg transition-all ${
                                                                isAnnounced
                                                                    ? 'text-white hover:text-blue-100 hover:bg-blue-700/80'
                                                                    : 'text-slate-400 hover:text-blue-700 hover:bg-blue-100/60'
                                                            }`}>
                                                                <Bell className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <TablePagination
                                    currentPage={earnPage}
                                    totalPages={earnTotalPages}
                                    totalItems={filteredEarnings.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setEarnPage}
                                    colorScheme="blue"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* HALKA ARZ GELİŞMİŞ FİLTRELEME PANENİ */}
            {/* ================================================= */}
            {activeFilter === 'ipo' && (
                <div className="bg-gradient-to-b from-purple-50/60 via-white to-white border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-purple-100/60">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-[#00008B]">Halka Arz Takvimi ve Filtreleme</h2>
                                <p className="text-[11px] font-bold text-slate-400">Şirket adına, başvuru durumuna, fiyata ve tarihe göre halka arz araması yapın</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={ipoSearch}
                                onChange={(e) => { setIpoSearch(e.target.value); updateIpoUrlParams({ search: e.target.value }); }}
                                placeholder="Hisse Kodu veya Şirket Ara (örn: EFORK)..."
                                className="w-full pl-9 pr-8 py-2 text-xs font-bold text-slate-800 bg-white border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 shadow-xs"
                            />
                            {ipoSearch && (
                                <button onClick={() => { setIpoSearch(''); updateIpoUrlParams({ search: '' }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-bold">
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Tarih</label>
                            <select value={ipoDateFilter} onChange={(e) => { const v = e.target.value as any; setIpoDateFilter(v); updateIpoUrlParams({ date: v }); }} className="w-full p-2 bg-white border border-purple-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Tarihler</option>
                                <option value="today">Bugün</option>
                                <option value="this-week">Bu Hafta</option>
                                <option value="this-month">Bu Ay</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Durum</label>
                            <select value={ipoStatusFilter} onChange={(e) => { const v = e.target.value as any; setIpoStatusFilter(v); updateIpoUrlParams({ status: v }); }} className="w-full p-2 bg-white border border-purple-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Durumlar</option>
                                <option value="talep-toplama">Talep Toplama</option>
                                <option value="taslak">Taslak</option>
                                <option value="basvuru">Başvuru Sürecinde</option>
                                <option value="ertelendi">Ertelendi</option>
                                <option value="reddedildi">Reddedildi</option>
                                <option value="iptal-edildi">İptal Edildi</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Fiyat</label>
                            <select value={ipoPriceFilter} onChange={(e) => { const v = e.target.value as any; setIpoPriceFilter(v); updateIpoUrlParams({ price: v }); }} className="w-full p-2 bg-white border border-purple-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Fiyatlar</option>
                                <option value="0-25">0 – 25 TL</option>
                                <option value="25-50">25 – 50 TL</option>
                                <option value="50-100">50 – 100 TL</option>
                                <option value="100plus">100 TL ve Üzeri</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Sıralama</label>
                            <select value={ipoSort} onChange={(e) => { const v = e.target.value as any; setIpoSort(v); updateIpoUrlParams({ sort: v }); }} className="w-full p-2 bg-white border border-purple-200/80 rounded-xl text-slate-700">
                                <option value="default">Varsayılan Sıralama</option>
                                <option value="date-asc">En Yakın Tarih</option>
                                <option value="date-desc">En Uzak Tarih</option>
                                <option value="name-asc">Şirket (A-Z)</option>
                                <option value="name-desc">Şirket (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {ipoActiveChips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-purple-100/60">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Aktif Filtreler:</span>
                            {ipoActiveChips.map(chip => (
                                <span key={chip.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-purple-100/80 text-purple-900 border border-purple-200">
                                    <span>{chip.label}</span>
                                    <button onClick={chip.clear} className="hover:bg-purple-200/80 rounded-full p-0.5"><X className="w-3 h-3 text-purple-800" /></button>
                                </span>
                            ))}
                            <button onClick={clearAllIpoFilters} className="text-xs font-extrabold text-rose-600 hover:underline ml-2">Filtreleri Temizle</button>
                        </div>
                    )}

                    <div className="pt-2">
                        {/* Halka Arz Tarih Sıralaması Uyarısı */}
                        {(ipoSort === 'date-asc' || ipoSort === 'date-desc') && (
                            <div className="mb-3 flex items-start sm:items-center gap-2.5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                                <p>
                                    <span className="font-extrabold text-amber-950">Bilgilendirme:</span> Sıralamada <strong>{ipoSort === 'date-asc' ? 'En Yakın Tarih' : 'En Uzak Tarih'}</strong> seçildiğinde, yalnızca talep toplama tarihleri resmi olarak açıklanmış şirketler listelenir. Tarihi henüz kesinleşmemiş (taslak/başvuru sürecindeki) halka arzları da görmek için <button type="button" onClick={() => { setIpoSort('default'); updateIpoUrlParams({ sort: 'default' }); }} className="underline font-black text-amber-900 hover:text-amber-950">Varsayılan sıralama</button> modunu kullanabilirsiniz.
                                </p>
                            </div>
                        )}

                        <span className="text-xs font-black text-[#00008B] block mb-3">Toplam {filteredIpos.length} Halka Arz Kaydı</span>
                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : filteredIpos.length === 0 ? (
                            <div className="py-12 bg-white rounded-2xl border border-dashed border-purple-200 flex flex-col items-center justify-center gap-2 text-center">
                                <Clock className="w-8 h-8 text-purple-300" />
                                <p className="text-sm font-black text-slate-700">Sonuç bulunamadı</p>
                                <button onClick={clearAllIpoFilters} className="px-4 py-2 text-xs font-black text-white bg-purple-600 rounded-xl">Filtreleri Temizle</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="overflow-x-auto scrollbar-none bg-white rounded-2xl border border-purple-100 p-2 shadow-2xs">
                                    <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-0 text-xs font-bold">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase">
                                                <th className="py-2.5 px-3.5 bg-purple-50/50 text-purple-900/60 rounded-l-xl pl-4">Hisse / Şirket</th>
                                                <th className="py-2.5 px-3.5 bg-purple-50/50 text-purple-900/60">Talep Toplama Tarihleri</th>
                                                <th className="py-2.5 px-3.5 bg-purple-50/50 text-purple-900/60">Halka Arz Fiyatı</th>
                                                <th className="py-2.5 px-3.5 bg-purple-50/50 text-purple-900/60">Durum</th>
                                                <th className="py-2.5 px-3.5 text-right bg-purple-50/50 text-purple-900/60 rounded-r-xl pr-4">Hatırlatıcı</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedIpos.map((item, idx) => {
                                                const isCompleted = getIpoPhase(item) === 'completed';
                                                const cellBg = isCompleted
                                                    ? "bg-purple-600 group-hover:bg-purple-700"
                                                    : "bg-slate-50/70 group-hover:bg-purple-50/50";

                                                return (
                                                    <tr key={idx} className="group transition-colors">
                                                        <td className={`py-3.5 pl-4 pr-3.5 rounded-l-2xl ${cellBg}`}>
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                                                                    isCompleted
                                                                        ? 'bg-purple-700 border-purple-500 text-white'
                                                                        : 'bg-purple-100/80 border-purple-200 text-purple-800'
                                                                }`}>
                                                                    {item.symbol?.substring(0, 3)}
                                                                </div>
                                                                <div>
                                                                    {item.symbol && item.symbol.trim() !== '-' && item.symbol.trim().length >= 2 ? (
                                                                        <Link 
                                                                            href={`/dashboard/varlik/${item.symbol.toUpperCase().replace(/\.IS$/, '').trim()}`}
                                                                            className={`hover:underline font-black text-xs block ${
                                                                                isCompleted ? 'text-white hover:text-purple-100' : 'text-[#00008B] hover:text-purple-800'
                                                                            }`}
                                                                            title={`${item.symbol} Şirket Detayına Git`}
                                                                        >
                                                                            {item.symbol}
                                                                        </Link>
                                                                    ) : (
                                                                        <span className={`text-xs font-black block ${isCompleted ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol || '-'}</span>
                                                                    )}
                                                                    <span className={`text-[11px] font-bold line-clamp-1 max-w-[220px] ${
                                                                        isCompleted ? 'text-purple-100' : 'text-slate-500'
                                                                    }`} title={item.companyName}>
                                                                        {item.companyName}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-bold ${cellBg} ${isCompleted ? 'text-white' : 'text-slate-700'}`}>
                                                            {item.dateRange || 'Yakında'}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap font-black ${cellBg} ${isCompleted ? 'text-white' : 'text-purple-700'}`}>
                                                            {item.price ? `${item.price} TL` : 'Belirlenmedi'}
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            <span className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-purple-700'}`}>
                                                                {getIpoStatusLabel(item)}
                                                            </span>
                                                        </td>
                                                        <td className={`py-3.5 pl-3.5 pr-4 text-right whitespace-nowrap rounded-r-2xl ${cellBg}`}>
                                                            <button title="Hatırlatıcı Ekle" className={`p-1.5 rounded-lg transition-all ${
                                                                isCompleted
                                                                    ? 'text-white hover:text-purple-100 hover:bg-purple-700/80'
                                                                    : 'text-slate-400 hover:text-purple-700 hover:bg-purple-100/60'
                                                            }`}>
                                                                <Bell className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <TablePagination
                                    currentPage={ipoPage}
                                    totalPages={ipoTotalPages}
                                    totalItems={filteredIpos.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setIpoPage}
                                    colorScheme="purple"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* EKONOMİK TAKVİM GELİŞMİŞ FİLTRELEME PANENİ */}
            {/* ================================================= */}
            {activeFilter === 'economic' && (
                <div className="bg-gradient-to-b from-blue-50/60 via-white to-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-blue-100/60">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                                <Globe2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-[#00008B]">Ekonomik Takvim ve Filtreleme</h2>
                                <p className="text-[11px] font-bold text-slate-400">Veri adına, ülkeye, önem seviyesine ve açıklama durumuna göre makroekonomik arama yapın</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={ecoSearch}
                                onChange={(e) => { setEcoSearch(e.target.value); updateEconomicUrlParams({ search: e.target.value }); }}
                                placeholder="Veri Adı, Ülke veya Para Birimi Ara (örn: Enflasyon, USD)..."
                                className="w-full pl-9 pr-8 py-2 text-xs font-bold text-slate-800 bg-white border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs"
                            />
                            {ecoSearch && (
                                <button onClick={() => { setEcoSearch(''); updateEconomicUrlParams({ search: '' }); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs font-bold">
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Tarih</label>
                            <select value={ecoDateFilter} onChange={(e) => { const v = e.target.value as any; setEcoDateFilter(v); updateEconomicUrlParams({ date: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Tarihler</option>
                                <option value="today">Bugün</option>
                                <option value="tomorrow">Yarın</option>
                                <option value="this-week">Bu Hafta</option>
                                <option value="this-month">Bu Ay</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Ülke / Bölge</label>
                            <select value={ecoCountryFilter} onChange={(e) => { const v = e.target.value as any; setEcoCountryFilter(v); updateEconomicUrlParams({ country: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Ülkeler</option>
                                <option value="tr">Türkiye (TRY)</option>
                                <option value="us">ABD (USD)</option>
                                <option value="eu">Euro Bölgesi (EUR)</option>
                                <option value="uk">İngiltere (GBP)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Önem Seviyesi</label>
                            <select value={ecoImportanceFilter} onChange={(e) => { const v = e.target.value as any; setEcoImportanceFilter(v); updateEconomicUrlParams({ importance: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Önem Düzeyleri</option>
                                <option value="high">Yüksek Önem</option>
                                <option value="medium">Orta Önem</option>
                                <option value="low">Düşük Önem</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Durum</label>
                            <select value={ecoStatusFilter} onChange={(e) => { const v = e.target.value as any; setEcoStatusFilter(v); updateEconomicUrlParams({ status: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="all">Tüm Durumlar</option>
                                <option value="pending">Bekleniyor</option>
                                <option value="announced">Açıklandı</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Sıralama</label>
                            <select value={ecoSort} onChange={(e) => { const v = e.target.value as any; setEcoSort(v); updateEconomicUrlParams({ sort: v }); }} className="w-full p-2 bg-white border border-blue-200/80 rounded-xl text-slate-700">
                                <option value="default">Varsayılan Sıralama</option>
                                <option value="date-asc">En Yakın Tarih (Beklenenler)</option>
                                <option value="importance-desc">Önem: Yüksek → Düşük</option>
                                <option value="name-asc">Veri Adı (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    {ecoActiveChips.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-blue-100/60">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Aktif Filtreler:</span>
                            {ecoActiveChips.map(chip => (
                                <span key={chip.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-blue-100/80 text-blue-900 border border-blue-200">
                                    <span>{chip.label}</span>
                                    <button onClick={chip.clear} className="hover:bg-blue-200/80 rounded-full p-0.5"><X className="w-3 h-3 text-blue-800" /></button>
                                </span>
                            ))}
                            <button onClick={clearAllEconomicFilters} className="text-xs font-extrabold text-rose-600 hover:underline ml-2">Filtreleri Temizle</button>
                        </div>
                    )}

                    <div className="pt-2">
                        {/* Ekonomik Takvim En Yakın Tarih Sıralaması Uyarısı */}
                        {ecoSort === 'date-asc' && (
                            <div className="mb-3 flex items-start sm:items-center gap-2.5 p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-blue-950 text-xs font-semibold shadow-xs">
                                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
                                <p>
                                    <span className="font-extrabold text-[#00008B]">Bilgilendirme:</span> <strong>En Yakın Tarih</strong> sıralamasında yalnızca henüz açıklanmamış (beklenen) ekonomik veriler en yakın tarihten başlayarak listelenir; açıklanmış geçmiş veriler bu sıralamada gizlenir. Tüm verileri görmek için <button type="button" onClick={() => { setEcoSort('default'); updateEconomicUrlParams({ sort: 'default' }); }} className="underline font-black text-[#00008B] hover:text-blue-900">Varsayılan sıralama</button> modunu kullanabilirsiniz.
                                </p>
                            </div>
                        )}

                        <span className="text-xs font-black text-[#00008B] block mb-3">Toplam {filteredEconomicEvents.length} Ekonomik Veri Kaydı</span>
                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : filteredEconomicEvents.length === 0 ? (
                            <div className="py-12 bg-white rounded-2xl border border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 text-center">
                                <Clock className="w-8 h-8 text-blue-300" />
                                <p className="text-sm font-black text-slate-700">Sonuç bulunamadı</p>
                                <button onClick={clearAllEconomicFilters} className="px-4 py-2 text-xs font-black text-white bg-blue-600 rounded-xl">Filtreleri Temizle</button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="overflow-x-auto scrollbar-none bg-white rounded-2xl border border-blue-100 p-2 shadow-2xs">
                                    <table className="w-full text-left border-separate border-spacing-y-2 border-spacing-x-0 text-xs font-bold">
                                        <thead>
                                            <tr className="text-[10px] font-black text-slate-400 uppercase">
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60 rounded-l-xl pl-4">Tarih / Saat</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Ülke</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Veri</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Önceki</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Beklenti</th>
                                                <th className="py-2.5 px-3.5 bg-blue-50/50 text-blue-900/60">Açıklanan</th>
                                                <th className="py-2.5 px-3.5 text-right bg-blue-50/50 text-blue-900/60 rounded-r-xl pr-4">Önem</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedEconomicEvents.map((item, idx) => {
                                                const isReleased = isEconomicEventReleased(item);
                                                const isHigh = item.impact === 'critical' || item.impact === 'high' || item.impact === 'Yüksek' || item.impact === 'Kritik' || item.impact === 3;
                                                const isMed = item.impact === 'medium' || item.impact === 'Orta' || item.impact === 2;
                                                const detailHref = `/dashboard/economic-calendar/${encodeURIComponent(item.id || item.event)}`;

                                                const cellBg = isReleased
                                                    ? "bg-[#00008B] group-hover:bg-[#000075]"
                                                    : "bg-slate-50/70 group-hover:bg-blue-50/50";

                                                return (
                                                    <tr key={idx} className="group transition-colors">
                                                        <td className={`py-3.5 pl-4 pr-3.5 font-black whitespace-nowrap rounded-l-2xl ${cellBg} ${isReleased ? 'text-white' : 'text-[#00008B]'}`}>{item.dateFormatted || 'Bugün'} {item.time || '15:30'}</td>
                                                        <td className={`py-3.5 px-3.5 font-black whitespace-nowrap ${cellBg} ${isReleased ? 'text-white' : 'text-slate-700'}`}>{item.country || 'USD'}</td>
                                                        <td className={`py-3.5 px-3.5 ${cellBg}`}>
                                                            <Link
                                                                href={detailHref}
                                                                className={`hover:underline font-bold transition-colors inline-flex items-center gap-1.5 group/link ${
                                                                    isReleased ? 'text-white font-black hover:text-blue-100' : 'text-slate-800'
                                                                }`}
                                                                title={`${item.event} Detayına Git`}
                                                            >
                                                                <span>{item.event}</span>
                                                                <ExternalLink className={`w-3 h-3 group-hover/link:text-white opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ${
                                                                    isReleased ? 'text-white/80' : 'text-slate-400'
                                                                }`} />
                                                            </Link>
                                                        </td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg} ${isReleased ? 'text-blue-100 font-semibold' : 'text-slate-500'}`}>{item.previous || '—'}</td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg} ${isReleased ? 'text-blue-100 font-semibold' : 'text-slate-700'}`}>{item.forecast || '—'}</td>
                                                        <td className={`py-3.5 px-3.5 whitespace-nowrap ${cellBg}`}>
                                                            {isReleased ? (
                                                                <span className="text-xs font-black text-white">
                                                                    {item.actual}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-bold text-slate-400">
                                                                    {item.actual || 'Bekleniyor'}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className={`py-3.5 pl-3.5 pr-4 text-right whitespace-nowrap rounded-r-2xl ${cellBg}`}>
                                                            <span className={`text-xs font-bold ${
                                                                isReleased
                                                                    ? (isHigh ? 'text-rose-300' : isMed ? 'text-blue-200' : 'text-slate-300')
                                                                    : (isHigh ? 'text-rose-600' : isMed ? 'text-blue-700' : 'text-slate-500')
                                                            }`}>
                                                                {isHigh ? 'Yüksek' : isMed ? 'Orta' : 'Düşük'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <TablePagination
                                    currentPage={ecoPage}
                                    totalPages={ecoTotalPages}
                                    totalItems={filteredEconomicEvents.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setEcoPage}
                                    colorScheme="blue"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* GENEL TAKVİM ÖZET GÖRÜNÜMÜ (SADECE TÜMÜ SEÇİLİYKEN) */}
            {/* ================================================= */}
            {activeFilter === 'all' && (
                <>
                    {/* ANA TAKVİM ALANI: Sol Mini Takvim & Sağ Günün Ajandası */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sol: Mini Takvim */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-black text-[#00008B] capitalize">{formattedViewMonthYear}</h3>
                            <span className="text-[10px] font-bold text-slate-400">Aylık Görünüm</span>
                        </div>

                        {/* Days of Week */}
                        <div className="grid grid-cols-7 text-center mb-2">
                            {['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PZR'].map((day, idx) => (
                                <span key={idx} className="text-[10px] font-black text-slate-400 py-1">
                                    {day}
                                </span>
                            ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {monthCalendarGrid.map((cell, idx) => {
                                const isSelected = selectedDate.getDate() === cell.dayNum &&
                                                   selectedDate.getMonth() === cell.date.getMonth() &&
                                                   selectedDate.getFullYear() === cell.date.getFullYear();
                                const isTodayCell = new Date().getDate() === cell.dayNum &&
                                                    new Date().getMonth() === cell.date.getMonth() &&
                                                    new Date().getFullYear() === cell.date.getFullYear();

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(cell.date)}
                                        className={`h-9 w-full rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center relative ${
                                            isSelected
                                                ? 'bg-[#00008B] text-white shadow-md shadow-[#00008B]/30 scale-105 z-10'
                                                : isTodayCell
                                                ? 'bg-blue-50 text-[#00008B] border border-blue-200'
                                                : cell.isCurrentMonth
                                                ? 'text-slate-700 hover:bg-slate-100'
                                                : 'text-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{cell.dayNum}</span>
                                        {(cell.isCurrentMonth && dayHasEvents(cell.date)) && (
                                            <span className={`w-1 h-1 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-[#00008B]'}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sağ: Seçili Günün Ajandası */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-sm font-black text-[#00008B] capitalize">{formattedSelectedDayHeader}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Günün Ajandası</p>
                            </div>
                            <span className="text-xs font-black text-[#00008B] bg-[#00008B]/5 px-2.5 py-1 rounded-xl border border-[#00008B]/10">
                                {selectedDayAgenda.length} Etkinlik
                            </span>
                        </div>

                        {/* Agenda List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <Loader2 className="w-6 h-6 text-[#00008B] animate-spin" />
                                <span className="text-xs font-bold text-slate-400">Ajanda verileri yükleniyor...</span>
                            </div>
                        ) : selectedDayAgenda.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
                                <Clock className="w-8 h-8 text-slate-300" />
                                <p className="text-xs font-bold text-slate-600">Bu tarih için kayıtlı etkinlik bulunmuyor.</p>
                                <p className="text-[10px] text-slate-400">Diğer günleri veya filtreleri seçerek ajandanızı inceleyebilirsiniz.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {selectedDayAgenda.map((item, idx) => {
                                    const rowBg = item.category === 'Bilanço'
                                        ? 'bg-blue-50/40 border-blue-100/80 hover:bg-blue-50/70'
                                        : item.category === 'Temettü'
                                        ? 'bg-emerald-50/40 border-emerald-100/80 hover:bg-emerald-50/70'
                                        : item.category === 'Halka Arz'
                                        ? 'bg-purple-50/40 border-purple-100/80 hover:bg-purple-50/70'
                                        : 'bg-blue-50/40 border-blue-100/80 hover:bg-blue-50/70';

                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${rowBg}`}>
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-xs font-black text-slate-600 w-10 shrink-0">{item.time}</span>
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border shrink-0 ${item.categoryColor}`}>
                                                    {item.category}
                                                </span>
                                                <span className="text-xs font-black text-[#00008B] shrink-0">{item.symbol}</span>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
                                                </div>
                                            </div>
                                            <button title="Hatırlatıcı Ekle" className="p-1.5 text-slate-400 hover:text-[#00008B] hover:bg-white rounded-lg transition-all shrink-0">
                                                <Bell className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* ÜÇLÜ KART IZGARASI: Bilanço, Temettü, Halka Arz */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. BİLANÇO TAKVİMİ (SOFT BLUE TINT) */}
                <div className="bg-gradient-to-b from-blue-50/50 via-white to-white border border-blue-100/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100/60">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-blue-100/70 border border-blue-200/80 flex items-center justify-center text-blue-700">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-[#00008B]">Bilanço Takvimi</h3>
                            </div>
                            <Link href="/dashboard/calendar?type=earnings" onClick={() => { setActiveFilter('earnings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[10px] font-extrabold text-blue-600 hover:underline">
                                Tümünü Gör
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : overviewEarnings.length === 0 ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yaklaşan bilanço verisi bulunmuyor.</div>
                        ) : (
                            <div className="space-y-3">
                                {overviewEarnings.map((item, idx) => {
                                    const isAnnounced = item.daysLeft !== undefined && item.daysLeft <= 0;
                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                                            isAnnounced
                                                ? 'bg-blue-600 border border-blue-700 text-white shadow-xs'
                                                : 'bg-blue-50/50 border border-blue-100/70 hover:bg-blue-100/50'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 rounded-xl text-center min-w-[44px] ${
                                                    isAnnounced ? 'bg-blue-700 text-white' : 'bg-blue-100/80 text-blue-800'
                                                }`}>
                                                    <span className="text-[9px] font-black uppercase block leading-tight">{item.earningsDate?.split('.')[1] || 'MAY'}</span>
                                                    <span className="text-xs font-black block leading-tight">{item.earningsDate?.split('.')[0] || '20'}</span>
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-black ${isAnnounced ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol}</p>
                                                    <p className={`text-[10px] font-bold truncate max-w-[130px] ${isAnnounced ? 'text-blue-100' : 'text-slate-600'}`}>{item.companyName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isAnnounced ? (
                                                    <span className="text-xs font-black text-white">2026/1Ç</span>
                                                ) : (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg border text-blue-700 bg-white/80 border-blue-200/80">2026/1Ç</span>
                                                )}
                                                <button title="Hatırlat" className={`p-1 ${isAnnounced ? 'text-white hover:text-blue-200' : 'text-blue-400 hover:text-[#00008B]'}`}>
                                                    <Bell className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/calendar?type=earnings" onClick={() => { setActiveFilter('earnings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-4 pt-3 border-t border-blue-100/60 flex items-center justify-center text-xs font-black text-[#00008B] hover:text-blue-600 transition-colors">
                        Tüm Bilançoları Gör →
                    </Link>
                </div>

                {/* 2. TEMETTÜ TAKVİMİ (SOFT EMERALD GREEN TINT) */}
                <div className="bg-gradient-to-b from-emerald-50/50 via-white to-white border border-emerald-100/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100/60">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-emerald-100/70 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                                    <Coins className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-[#00008B]">Temettü Takvimi</h3>
                            </div>
                            <Link href="/dashboard/calendar?type=dividend" onClick={() => { setActiveFilter('dividends'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[10px] font-extrabold text-emerald-600 hover:underline">
                                Tümünü Gör
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : overviewDividends.length === 0 ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yaklaşan temettü ödemesi bulunmuyor.</div>
                        ) : (
                            <div className="space-y-3">
                                {overviewDividends.map((item, idx) => {
                                    const isAnnounced = isDividendDateAnnounced(item);
                                    const ts = getItemTimestamp(item, 'paymentDate');
                                    const now = new Date();
                                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                                    const isPaid = isAnnounced && ts > 0 && ts < todayStart;

                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                                            isPaid
                                                ? 'bg-emerald-600 border border-emerald-700 text-white shadow-xs'
                                                : 'bg-emerald-50/50 border border-emerald-100/70 hover:bg-emerald-100/50'
                                        }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 rounded-xl text-center min-w-[44px] ${
                                                    isPaid ? 'bg-emerald-700 text-white' : 'bg-emerald-100/80 text-emerald-800'
                                                }`}>
                                                    <span className="text-[9px] font-black uppercase block leading-tight">{item.paymentDate?.split('.')[1] || 'MAY'}</span>
                                                    <span className="text-xs font-black block leading-tight">{item.paymentDate?.split('.')[0] || '19'}</span>
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-black ${isPaid ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol}</p>
                                                    <p className={`text-[10px] font-bold truncate max-w-[120px] ${isPaid ? 'text-emerald-100' : 'text-slate-600'}`}>{item.companyName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isPaid ? (
                                                    <span className="text-xs font-black text-white">
                                                        {item.netAmountFormatted || '6,00 TL'}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg border text-emerald-800 bg-white/80 border-emerald-200/80">
                                                        {item.netAmountFormatted || '6,00 TL'}
                                                    </span>
                                                )}
                                                <button title="Hatırlat" className={`p-1 ${isPaid ? 'text-white hover:text-emerald-200' : 'text-emerald-500 hover:text-[#00008B]'}`}>
                                                    <Bell className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/calendar?type=dividend" onClick={() => { setActiveFilter('dividends'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center justify-center text-xs font-black text-[#00008B] hover:text-emerald-600 transition-colors">
                        Tüm Temettüleri Gör →
                    </Link>
                </div>

                {/* 3. HALKA ARZ TAKVİMİ (SOFT PURPLE TINT) */}
                <div className="bg-gradient-to-b from-purple-50/50 via-white to-white border border-purple-100/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-100/60">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-purple-100/70 border border-purple-200/80 flex items-center justify-center text-purple-700">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-[#00008B]">Halka Arz Takvimi</h3>
                            </div>
                            <Link href="/dashboard/calendar?type=ipo" onClick={() => { setActiveFilter('ipo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[10px] font-extrabold text-purple-600 hover:underline">
                                Tümünü Gör
                            </Link>
                        </div>

                        {loading ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yükleniyor...</div>
                        ) : overviewIpos.length === 0 ? (
                            <div className="py-8 text-center text-xs font-bold text-slate-400">Yaklaşan halka arz bulunmuyor.</div>
                        ) : (
                            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-200">
                                {overviewIpos.map((item, idx) => {
                                    const isCompleted = getIpoPhase(item) === 'completed';
                                    return (
                                        <div key={idx} className={`relative flex items-center justify-between p-2 rounded-2xl transition-all ${
                                            isCompleted
                                                ? 'bg-purple-600 border border-purple-700 text-white shadow-xs'
                                                : 'bg-purple-50/40 border border-purple-100/70 hover:bg-purple-100/40'
                                        }`}>
                                            <div className={`absolute -left-[19px] w-3 h-3 rounded-full ${isCompleted ? 'bg-purple-700 ring-4 ring-purple-300' : 'bg-purple-600 ring-4 ring-purple-100'}`} />
                                            
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-black ${isCompleted ? 'text-white' : 'text-[#00008B]'}`}>{item.symbol}</span>
                                                    {isCompleted ? (
                                                        <span className="text-[10px] font-black text-purple-200">
                                                            {getIpoStatusLabel(item)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-purple-700">
                                                            {getIpoStatusLabel(item)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-[10px] font-bold truncate max-w-[140px] ${isCompleted ? 'text-purple-100' : 'text-slate-600'}`}>{item.companyName}</p>
                                            </div>
                                            {isCompleted ? (
                                                <span className="text-xs font-black text-white">
                                                    {item.dateRange || 'Yakında'}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-slate-600">
                                                    {item.dateRange || 'Yakında'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/calendar?type=ipo" onClick={() => { setActiveFilter('ipo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-4 pt-3 border-t border-purple-100/60 flex items-center justify-center text-xs font-black text-[#00008B] hover:text-purple-600 transition-colors">
                        Tüm Halka Arzları Gör →
                    </Link>
                </div>
            </div>

            {/* EKONOMİK TAKVİM VE PİYASA GÜNDEMİ — YAN YANA YERLEŞİM */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                
                {/* SOL: EKONOMİK TAKVİM TABLOSU */}
                <div className="bg-gradient-to-b from-blue-50/40 via-white to-white border border-blue-100/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100/60">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-blue-100/70 border border-blue-200/80 flex items-center justify-center text-blue-700">
                                    <Globe2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#00008B]">Ekonomik Takvim</h3>
                                    <p className="text-[10px] font-bold text-slate-400">Küresel makroekonomik veriler ve faiz kararları</p>
                                </div>
                            </div>
                            <Link href="/dashboard/calendar?type=economic" onClick={() => { setActiveFilter('economic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-xs font-extrabold text-blue-600 hover:underline">
                                Tümünü Gör →
                            </Link>
                        </div>

                        <div className="overflow-x-auto scrollbar-none">
                            <table className="w-full text-left border-separate border-spacing-y-1.5 border-spacing-x-0">
                                <thead>
                                    <tr className="text-[10px] font-black text-blue-800/60 uppercase tracking-wider">
                                        <th className="py-2 px-2.5 bg-blue-50/50 rounded-l-lg pl-3">Tarih/Saat</th>
                                        <th className="py-2 px-2 bg-blue-50/50">Ülke</th>
                                        <th className="py-2 px-2 bg-blue-50/50">Veri</th>
                                        <th className="py-2 px-2.5 text-right bg-blue-50/50 rounded-r-lg pr-3">Önem</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400">Veriler yükleniyor...</td>
                                        </tr>
                                    ) : overviewEconomicEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-slate-400">Kayıtlı ekonomik veri bulunmuyor.</td>
                                        </tr>
                                    ) : (
                                        overviewEconomicEvents.map((item, idx) => {
                                            const isReleased = isEconomicEventReleased(item);
                                            const cellBg = isReleased
                                                ? "bg-[#00008B] group-hover:bg-[#000075]"
                                                : "bg-slate-50/60 group-hover:bg-blue-50/50";

                                            return (
                                                <tr key={idx} className="group transition-colors">
                                                    <td className={`py-2 px-2.5 whitespace-nowrap rounded-l-xl pl-3 ${cellBg} ${isReleased ? 'text-white' : 'text-[#00008B]'}`}>
                                                        {item.dateFormatted && (
                                                            <span className={`font-bold mr-1.5 text-[10px] ${isReleased ? 'text-blue-200' : 'text-slate-500'}`}>
                                                                {item.dateFormatted.split('.')[0]}.{item.dateFormatted.split('.')[1]}
                                                            </span>
                                                        )}
                                                        <span>{item.time || '15:30'}</span>
                                                    </td>
                                                    <td className={`py-2 px-2 font-black whitespace-nowrap ${cellBg} ${isReleased ? 'text-white' : 'text-slate-700'}`}>{item.country || 'USD'}</td>
                                                    <td className={`py-2 px-2 truncate max-w-[130px] ${cellBg}`}>
                                                        <Link
                                                            href={`/dashboard/economic-calendar/${encodeURIComponent(item.id || item.event)}`}
                                                            className={`hover:underline transition-colors truncate block ${isReleased ? 'text-white hover:text-blue-200' : 'text-slate-800 hover:text-[#00008B]'}`}
                                                            title={item.event}
                                                        >
                                                            {item.event}
                                                        </Link>
                                                    </td>
                                                    <td className={`py-2 px-2.5 whitespace-nowrap text-right rounded-r-xl pr-3 ${cellBg}`}>
                                                        {isReleased ? (
                                                            <span className={`text-[11px] font-black ${
                                                                item.impact === 'critical' || item.impact === 'high' || item.impact === 'Yüksek' || item.impact === 3 ? 'text-rose-300' : 'text-blue-200'
                                                            }`}>
                                                                {item.impact === 'critical' || item.impact === 'high' || item.impact === 'Yüksek' || item.impact === 3 ? 'Yüksek' : 'Orta'}
                                                            </span>
                                                        ) : (
                                                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                                                                item.impact === 'critical' || item.impact === 'high' || item.impact === 'Yüksek' || item.impact === 'Kritik' || item.impact === 3
                                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                                    : 'bg-blue-100/80 text-blue-800 border-blue-200'
                                                            }`}>
                                                                {item.impact === 'critical' || item.impact === 'high' || item.impact === 'Yüksek' || item.impact === 3 ? 'Yüksek' : 'Orta'}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Link href="/dashboard/calendar?type=economic" onClick={() => { setActiveFilter('economic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-4 pt-3 border-t border-blue-100/60 flex items-center justify-center text-xs font-black text-[#00008B] hover:text-blue-600 transition-colors">
                        Tüm Ekonomik Verileri Gör →
                    </Link>
                </div>

                {/* SAĞ: PİYASA GÜNDEMİ & YAKLAŞAN ÖNEMLİ TARİHLER (KOYU SUMMARY PANELİ) */}
                <div className="bg-[#0c101d] text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Piyasa Gündemi</h3>
                                    <p className="text-[10px] font-bold text-slate-400">Yaklaşan önemli tarihler ve özet göstergeler</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-400/20">Canlı Takip</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/dashboard/calendar?type=earnings" onClick={() => { setActiveFilter('earnings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 backdrop-blur-md cursor-pointer hover:bg-blue-500/20 transition-all block">
                                <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1">Bilanço</span>
                                <span className="text-base font-black text-blue-400 block">{earnings.length || 5} Şirket</span>
                                <span className="text-[9px] text-blue-200/60">Yaklaşan Sonuçlar</span>
                            </Link>

                            <Link href="/dashboard/calendar?type=dividend" onClick={() => { setActiveFilter('dividends'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 backdrop-blur-md cursor-pointer hover:bg-emerald-500/20 transition-all block">
                                <span className="text-[10px] font-bold text-emerald-300 uppercase block mb-1">Temettü</span>
                                <span className="text-base font-black text-emerald-400 block">{dividends.length || 4} Ödeme</span>
                                <span className="text-[9px] text-emerald-200/60">Hak Hakediş</span>
                            </Link>

                            <Link href="/dashboard/calendar?type=ipo" onClick={() => { setActiveFilter('ipo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-3.5 backdrop-blur-md cursor-pointer hover:bg-purple-500/20 transition-all block">
                                <span className="text-[10px] font-bold text-purple-300 uppercase block mb-1">Halka Arz</span>
                                <span className="text-base font-black text-purple-400 block">
                                    {activeOrUpcomingIpoCount > 0 ? activeOrUpcomingIpoCount : (ipos.length || 0)} {activeOrUpcomingIpoCount > 0 ? 'Aktif / Yaklaşan' : 'Talep Toplama'}
                                </span>
                                <span className="text-[9px] text-purple-200/60">Talep Toplama Takvimi</span>
                            </Link>

                            <Link href="/dashboard/calendar?type=economic" onClick={() => { setActiveFilter('economic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 backdrop-blur-md cursor-pointer hover:bg-blue-500/20 transition-all block">
                                <span className="text-[10px] font-bold text-blue-300 uppercase block mb-1">Ekonomik Veri</span>
                                <span className="text-base font-black text-blue-400 block">{economicEvents.length || 7} Önemli Veri</span>
                                <span className="text-[9px] text-blue-200/60">Makro Göstergeler</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Piyasa takvimindeki tüm gelişmeler günceldir.</span>
                    </div>
                </div>

            </div>
                </>
            )}

        </div>
    );
}

export default function CalendarPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen bg-slate-50/50 p-8 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00008B]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Takvim Yükleniyor...
                </div>
            </div>
        }>
            <CalendarContent />
        </Suspense>
    );
}
