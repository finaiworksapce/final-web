"use client";

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import Link from "next/link";
import { 
    Newspaper, 
    RefreshCw, 
    Zap, 
    TrendingUp, 
    Globe, 
    Coins, 
    PieChart, 
    Loader2, 
    AlertCircle, 
    Flame,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Filter,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import { EnrichedNewsItem } from "@/app/api/news/route";
import { NewsHeroCard } from "@/components/news/NewsHeroCard";
import { NewsCard } from "@/components/news/NewsCard";

const CATEGORY_OPTIONS = [
    { id: 'all', label: 'Tüm Haberler', sectionTitle: 'Günün Tüm Haberleri', icon: Newspaper },
    { id: 'portfolio', label: 'Portföyüm', sectionTitle: 'Portföyünüze Özel Haberler', icon: PieChart },
    { id: 'bist', label: 'Borsa İstanbul', sectionTitle: 'Borsa İstanbul Gelişmeleri', icon: TrendingUp },
    { id: 'commodity', label: 'Altın & Emtia', sectionTitle: 'Altın & Emtia Piyasaları', icon: Flame },
    { id: 'macro', label: 'Makro Ekonomi', sectionTitle: 'Makro Ekonomi & Para Politikası', icon: Zap },
    { id: 'global', label: 'Küresel Piyasalar', sectionTitle: 'Küresel Piyasa Gelişmeleri', icon: Globe },
    { id: 'crypto', label: 'Kripto Varlıklar', sectionTitle: 'Kripto Para Haberleri', icon: Coins }
];

const ITEMS_PER_PAGE = 6;

function NewsContent() {
    const { user } = useUser();

    // Data states
    const [news, setNews] = useState<EnrichedNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter & Pagination states
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNewsData = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const url = user 
                ? `/api/news?userId=${user.id}${isManualRefresh ? '&refresh=true' : ''}`
                : `/api/news${isManualRefresh ? '?refresh=true' : ''}`;
            
            const res = await fetch(url);
            const data = await res.json();

            if (data.success && Array.isArray(data.data)) {
                setNews(data.data);
            } else {
                setError(data.error || "Haber akışı yüklenemedi.");
            }
        } catch (err: any) {
            console.error("News fetch error:", err);
            setError("Sunucuya bağlanırken bir sorun oluştu.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Category change & reset page
    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        setCurrentPage(1);
        setIsDropdownOpen(false);
    };

    // Filter news client-side
    const filteredNews = useMemo(() => {
        return news.filter(item => {
            if (selectedCategory === 'all') return true;
            return item.category === selectedCategory;
        });
    }, [news, selectedCategory]);

    // Separate Featured Hero Stories and Stream News
    const { featuredStory, subStories } = useMemo(() => {
        const portfolioMatches = news.filter(n => n.category === 'portfolio');
        const otherHotNews = news.filter(n => n.category !== 'portfolio');

        let pool = [...portfolioMatches, ...otherHotNews];
        const main = pool[0] || null;
        const subs = pool.slice(1, 5);

        return { featuredStory: main, subStories: subs };
    }, [news]);

    const streamNews = useMemo(() => {
        if (selectedCategory === 'all') {
            const featuredIds = new Set([featuredStory?.id, ...subStories.map(s => s.id)].filter(Boolean));
            return filteredNews.filter(n => !featuredIds.has(n.id));
        }
        return filteredNews;
    }, [filteredNews, featuredStory, subStories, selectedCategory]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(streamNews.length / ITEMS_PER_PAGE));
    const paginatedNews = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return streamNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [streamNews, currentPage]);

    const currentTabInfo = useMemo(() => {
        return CATEGORY_OPTIONS.find(t => t.id === selectedCategory) || CATEGORY_OPTIONS[0];
    }, [selectedCategory]);

    return (
        <div className="min-h-screen relative pb-24">
            {/* 1. SAYFA ARKA PLANI: Referans görseldeki açık, ferah, gazete dokulu & küreli atmosfer */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
                {/* Çok açık beyaz/buz mavisi taban */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/60 to-[#e2e8f0]/30" />

                {/* Sol Üst: Çok hafif gazete dokusu filigranı (FINANCIAL TIMES) */}
                <div className="absolute -top-12 -left-8 w-[520px] h-[340px] opacity-[0.04] rotate-[-12deg] pointer-events-none font-serif text-[42px] leading-tight font-black tracking-widest text-slate-900 overflow-hidden">
                    FINANCIAL TIMES
                    <div className="text-[12px] font-sans tracking-normal mt-2">
                        GLOBAL MARKETS • ECONOMY • STOCKS • COMMODITIES • FOREX • CURRENCIES • CRYPTO
                    </div>
                </div>

                {/* Sağ Üst / Orta: Dünya Haritası Küre Silueti & Finans Grafiği */}
                <div className="absolute -top-20 -right-20 w-[640px] h-[480px] opacity-[0.05] pointer-events-none">
                    <svg viewBox="0 0 500 500" className="w-full h-full text-blue-900" fill="currentColor">
                        <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" />
                        <ellipse cx="250" cy="250" rx="200" ry="80" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <ellipse cx="250" cy="250" rx="80" ry="200" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M50 250 H450 M250 50 V450" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 6" />
                    </svg>
                </div>

                {/* Sağ Taraf: Yumuşak Yeşil/Mavi Borsa Mum Grafiği Silueti */}
                <div className="absolute top-10 right-4 w-72 h-44 opacity-[0.06] pointer-events-none flex items-end gap-2.5">
                    <div className="w-2.5 h-20 bg-emerald-500 rounded-xs" />
                    <div className="w-2.5 h-32 bg-emerald-500 rounded-xs" />
                    <div className="w-2.5 h-16 bg-rose-500 rounded-xs" />
                    <div className="w-2.5 h-28 bg-emerald-500 rounded-xs" />
                    <div className="w-2.5 h-40 bg-emerald-500 rounded-xs" />
                    <div className="w-2.5 h-24 bg-rose-500 rounded-xs" />
                    <div className="w-2.5 h-36 bg-emerald-500 rounded-xs" />
                </div>
            </div>

            {/* İçerik Konteyneri */}
            <div className="relative z-10 p-4 sm:p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto">

                {/* 2. ÜST BAŞLIK ALANI (Referans görseldeki birebir hiyerarşi) */}
                <div className="space-y-2 pt-1">
                    {/* Haberler Rozeti */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold shadow-2xs">
                        <Newspaper className="w-3.5 h-3.5 text-blue-600" />
                        <span>Haberler</span>
                    </div>

                    {/* Ana Başlık */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Finans dünyasından en güncel gelişmeler
                    </h1>

                    {/* Açıklama & Sağda Yenile */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                        <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed max-w-3xl">
                            Ekonomi, piyasalar, şirketler ve dünya gündemine dair en önemli haberleri FinAi ile takip edin. Doğru analizler, güvenilir kaynaklar.
                        </p>

                        <button
                            onClick={() => fetchNewsData(true)}
                            disabled={refreshing || loading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer self-start sm:self-auto shrink-0"
                            title="Verileri Yenile"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Yenile</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-28 space-y-4">
                        <div className="relative">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <p className="text-slate-500 font-semibold text-sm">
                            Güncel piyasa haberleri derleniyor...
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <h3 className="font-bold text-sm">Haberler Alınamadı</h3>
                            <p className="text-xs text-red-600 mt-0.5">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* 3. ANA ÜST HABER ALANI: Sol %60 Günün Öne Çıkanı, Sağ %40 Son Dakika Haberleri */}
                        {selectedCategory === 'all' && featuredStory && (
                            <NewsHeroCard
                                mainNews={featuredStory}
                                subNews={subStories}
                            />
                        )}

                        {/* 4. GÜNÜN TÜM HABERLERİ */}
                        <div className="space-y-5" id="all-news">
                            
                            {/* Başlık & Kategori Filtresi Barı */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                        {selectedCategory === 'all' ? 'Günün Tüm Haberleri' : currentTabInfo.sectionTitle}
                                    </h2>
                                </div>

                                {/* Kategori Dropdown Filtre Menüsü */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                                    >
                                        <Filter className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="text-slate-400 font-medium">Kategori:</span>
                                        <span className="text-slate-900 font-bold">{currentTabInfo.label}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                                className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 z-50 overflow-hidden"
                                            >
                                                <div className="space-y-0.5">
                                                    {CATEGORY_OPTIONS.map((option) => {
                                                        const Icon = option.icon;
                                                        const isSelected = selectedCategory === option.id;
                                                        return (
                                                            <button
                                                                key={option.id}
                                                                onClick={() => handleCategoryChange(option.id)}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer ${
                                                                    isSelected 
                                                                        ? 'bg-blue-600 text-white shadow-xs' 
                                                                        : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                                                                    <span>{option.label}</span>
                                                                </div>
                                                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* 3 Kolonlu Haber Grid'i */}
                            {paginatedNews.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                                        {paginatedNews.map((item, idx) => (
                                            <NewsCard
                                                key={item.id || idx}
                                                item={item}
                                                index={idx}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-1.5 pt-4 border-t border-slate-200/60">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-30 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs cursor-pointer shadow-2xs"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" /> Önceki
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                            currentPage === pageNum
                                                                ? 'bg-blue-600 text-white shadow-xs'
                                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-30 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs cursor-pointer shadow-2xs"
                                            >
                                                Sonraki <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-14 text-center space-y-2.5 border border-slate-100 shadow-2xs">
                                    <Newspaper className="w-7 h-7 text-slate-300 mx-auto" />
                                    <h3 className="text-sm font-bold text-slate-800">Bu kategoride henüz haber bulunmuyor</h3>
                                    <p className="text-xs text-slate-400">Diğer kategorileri inceleyebilirsiniz.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <NewsContent />
        </Suspense>
    );
}
