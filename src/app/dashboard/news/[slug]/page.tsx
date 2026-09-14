"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Share2, 
    ExternalLink, 
    Check, 
    Loader2, 
    AlertCircle, 
    FileText,
    ChevronRight,
    Radio
} from "lucide-react";
import { motion } from "framer-motion";
import { EnrichedNewsItem } from "@/app/api/news/route";
import { ArticleResponseData } from "@/app/api/news/article/route";
import { NewsThumbnail } from "@/components/news/NewsThumbnail";
import { FinAiReportCard } from "@/components/news/FinAiReportCard";
import { RelatedNewsWidget } from "@/components/news/RelatedNewsWidget";

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    const [newsItem, setNewsItem] = useState<EnrichedNewsItem | null>(null);
    const [article, setArticle] = useState<ArticleResponseData | null>(null);
    const [relatedNews, setRelatedNews] = useState<EnrichedNewsItem[]>([]);
    const [breakingNews, setBreakingNews] = useState<EnrichedNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchArticleData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Fetch news list to find item matching slug or ID
                const newsRes = await fetch('/api/news');
                const newsJson = await newsRes.json();
                
                let currentItem: EnrichedNewsItem | undefined;
                let otherItems: EnrichedNewsItem[] = [];

                const decodedSlug = decodeURIComponent(slug);

                if (newsJson.success && Array.isArray(newsJson.data)) {
                    currentItem = newsJson.data.find((item: EnrichedNewsItem) => 
                        item.slug === slug || 
                        item.id === slug || 
                        item.slug === decodedSlug || 
                        item.id === decodedSlug
                    );
                    otherItems = newsJson.data.filter((item: EnrichedNewsItem) => 
                        item.slug !== slug && 
                        item.slug !== decodedSlug &&
                        item.id !== slug &&
                        item.id !== decodedSlug
                    );
                    setBreakingNews(newsJson.data.slice(0, 5));
                    
                    // Filter related news by same category first, then other categories to ensure sufficient items
                    if (currentItem) {
                        const sameCat = otherItems.filter(item => item.category === currentItem?.category);
                        const diffCat = otherItems.filter(item => item.category !== currentItem?.category);
                        setRelatedNews([...sameCat, ...diffCat].slice(0, 8));
                    } else {
                        setRelatedNews(otherItems.slice(0, 8));
                    }
                }

                if (!currentItem) {
                    setError("Haber bulunamadı veya yayından kaldırılmış.");
                    setLoading(false);
                    return;
                }

                setNewsItem(currentItem);

                // 2. Fetch full article body and structured FinAi Report
                const articleRes = await fetch(`/api/news/article?url=${encodeURIComponent(currentItem.link)}&desc=${encodeURIComponent(currentItem.description)}`);
                const articleJson = await articleRes.json();

                if (articleJson.success && articleJson.data) {
                    setArticle(articleJson.data);
                } else {
                    // Safe fallback if article scraping encounters issues
                    setArticle({
                        title: currentItem.title,
                        image: currentItem.imageUrl,
                        paragraphs: [currentItem.description],
                        summary: currentItem.description,
                        report: {
                            summary: currentItem.description,
                            whyImportant: "Bu gelişme piyasalar ve ilgili sektör dinamikleri açısından yakından takip edilmektedir.",
                            metadata: {
                                model: 'fallback',
                                promptVersion: 'v1',
                                generatedAt: new Date().toISOString(),
                                contentFingerprint: 'fallback',
                                status: 'fallback'
                            }
                        },
                        sourceUrl: currentItem.link
                    });
                }

            } catch (err: any) {
                console.error("News detail fetch error:", err);
                setError("Haber içeriği yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticleData();
    }, [slug]);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Bugün';
        try {
            return new Date(dateStr).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    const coverImage = article?.image || newsItem?.imageUrl || null;

    // Calculate how many related news items to display to match article length
    const paragraphCount = article?.paragraphs?.length || 1;
    const relatedLimit = paragraphCount <= 2 ? 3 : paragraphCount <= 5 ? 5 : 7;

    return (
        <div className="min-h-screen bg-slate-50/50 text-[#00008B] pb-24">
            {/* Top Bar with Return Link and Share */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-16 z-30 px-4 sm:px-8 py-3">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <Link
                        href="/dashboard/news"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-600" /> Haberler Listesine Dön
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="px-3 py-1.5 text-slate-600 hover:text-[#00008B] hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                            title="Haberi Paylaş"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                            <span>{copied ? 'Kopyalandı' : 'Paylaş'}</span>
                        </button>
                        {article?.sourceUrl && (
                            <a
                                href={article.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 text-slate-600 hover:text-[#00008B] hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
                                title="Orijinal Kaynak"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Kaynak</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-5 space-y-6">

                {/* CANLI AKIŞ TICKER */}
                {breakingNews.length > 0 && (
                    <div className="w-full bg-[#00008B] text-white rounded-xl px-4 py-2 flex items-center gap-3 overflow-hidden shadow-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-600 text-white font-black text-[10px] rounded-md uppercase tracking-wider shrink-0">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            <span>CANLI AKIŞ</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-blue-100 font-medium truncate">
                            {breakingNews.map((item, idx) => (
                                <Link 
                                    key={idx} 
                                    href={`/dashboard/news/${item.slug}`}
                                    className="hover:underline hover:text-white shrink-0 truncate flex items-center gap-2"
                                >
                                    <span>{item.title}</span>
                                    {idx < breakingNews.length - 1 && <span className="text-blue-400 font-bold">•</span>}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center space-y-4 shadow-xs">
                        <div className="relative w-12 h-12 mx-auto">
                            <Loader2 className="w-12 h-12 text-[#00008B] animate-spin" />
                            <FileText className="w-5 h-5 text-[#00008B] absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <h3 className="text-base font-black text-[#00008B]">Haber Detayı Hazırlanıyor</h3>
                        <p className="text-xs text-slate-400 font-bold">Tam metin ve FinAi Özeti derleniyor...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl flex items-center gap-4">
                        <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />
                        <div>
                            <h3 className="font-black text-base">Haber Yüklenemedi</h3>
                            <p className="text-xs text-red-600 mt-1">{error}</p>
                            <Link href="/dashboard/news" className="inline-block mt-4 text-xs font-black underline">
                                Haberler Sayfasına Geri Dön
                            </Link>
                        </div>
                    </div>
                ) : newsItem && article ? (
                    /* 2-Column Responsive Grid: Left 8 cols (~65%), Right 4 cols (~35%) */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* SOL KOLON: Ana Haber İçeriği (%65 Genişlik) */}
                        <motion.article
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs space-y-6"
                        >
                            {/* 1. Breadcrumb */}
                            <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                <Link href="/dashboard/news" className="hover:text-[#00008B] transition-colors">
                                    Haberler
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                <Link 
                                    href={`/dashboard/news?category=${newsItem.category}`} 
                                    className="hover:text-[#00008B] transition-colors"
                                >
                                    {newsItem.categoryLabel}
                                </Link>
                            </nav>

                            {/* 2. Kategori Rozeti */}
                            <div>
                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-lg uppercase tracking-wider border border-blue-100">
                                    {newsItem.categoryLabel}
                                </span>
                            </div>

                            {/* 3. Büyük Haber Başlığı */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#00008B] tracking-tight leading-tight">
                                {article.title || newsItem.title}
                            </h1>

                            {/* 4. Editör & Zaman Çubuğu */}
                            <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-slate-100 text-xs text-slate-500 font-bold">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#00008B] text-white font-black text-sm flex items-center justify-center shadow-xs">
                                        F
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-black text-[#00008B]">FinAi Ekonomi Masası</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Piyasa & Finans İstihbaratı</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {formatDate(newsItem.pubDate)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        {newsItem.readTime || '3 dk okuma'}
                                    </span>
                                </div>
                            </div>

                            {/* 5. Geniş 16:7 Ana Haber Görseli (Cover Image) */}
                            <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-slate-100">
                                <NewsThumbnail
                                    imageUrl={coverImage}
                                    title={article.title || newsItem.title}
                                    aspectRatio="hero"
                                    caption={newsItem.source ? `${newsItem.source} Fotoğraf Arşivi` : undefined}
                                    className="w-full rounded-2xl"
                                />
                            </div>

                            {/* 6. Haber Paragrafları (Rahat Okuma Tipografisi) */}
                            <div className="space-y-5 text-slate-700 text-base sm:text-[17px] leading-relaxed font-normal pt-2">
                                {article.paragraphs.map((paragraph, idx) => (
                                    <p key={idx} className="leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* 7. Kaynak Referansı Kartı */}
                            <div className="pt-6 border-t border-slate-100">
                                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-black uppercase tracking-wider">Kaynak Referansı</span>
                                        </div>
                                        <p className="text-xs text-slate-600 font-medium">
                                            Bu içerik <span className="font-bold text-slate-800">{newsItem.source}</span> bülteninden FinAi okuyucuları için derlenmiştir.
                                        </p>
                                    </div>
                                    <a
                                        href={article.sourceUrl || newsItem.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200/80 text-blue-600 hover:text-blue-800 text-xs font-black rounded-xl transition-all shadow-2xs shrink-0"
                                    >
                                        Orijinal Kaynak <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </motion.article>

                        {/* SAĞ KOLON: Özet + İlgili Haberler (%35 Genişlik) */}
                        <div className="lg:col-span-4 space-y-5">
                            
                            {/* WIDGET 1: Özet (Toplam Varlık Değeri Stili #0b192c) */}
                            <FinAiReportCard 
                                report={article.report} 
                                fallbackSummary={article.summary} 
                            />

                            {/* WIDGET 2: İlgili Haberler (Haber metninin bitimine kadar olan boşluğu doldurur) */}
                            {relatedNews.length > 0 && (
                                <RelatedNewsWidget 
                                    items={relatedNews} 
                                    limit={relatedLimit}
                                />
                            )}

                        </div>

                    </div>
                ) : null}
            </div>
        </div>
    );
}
