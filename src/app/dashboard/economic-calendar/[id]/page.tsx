"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Calendar as CalendarIcon, Target, 
    ChevronDown, ChevronUp, Layers, Activity, Sparkles, BookOpen, Lightbulb, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { CatalogCalendarEvent, ECONOMIC_CALENDAR_CATALOG } from "@/lib/calendar-catalog";
import { getDynamicCalendarCatalog } from "@/lib/calendar-scraper";
import { INDICATOR_PROFILES_DATABASE, IndicatorProfile } from "@/lib/indicator-profiles";
import { calculateBackendDifferences, generateFinAiAnalysis } from "@/lib/finai-calendar-analysis-engine";
import FollowIndicatorButton from "@/components/calendar/FollowIndicatorButton";
import EconomicImpactChainStepper from "@/components/calendar/EconomicImpactChainStepper";

function toSlug(str: string): string {
    return str
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function resolveCalendarEvent(rawId: string, list: CatalogCalendarEvent[]): CatalogCalendarEvent | null {
    if (!rawId || !list || list.length === 0) return null;

    const decoded = decodeURIComponent(rawId).trim();
    const cleanLower = decoded.toLowerCase();

    // 1. Exact Event ID Match
    const exactId = list.find(e => e.id === decoded || e.id === rawId);
    if (exactId) return exactId;

    // 2. Exact Event Name Match
    const exactName = list.find(e => e.event === decoded || e.event.toLowerCase() === cleanLower);
    if (exactName) return exactName;

    // 3. Match by Slugified Event Name or Slug ID
    const targetSlug = toSlug(decoded);
    const bySlug = list.find(e => {
        const itemSlug = toSlug(e.event);
        const itemIdSlug = e.id ? toSlug(e.id) : '';
        return itemSlug === targetSlug || itemIdSlug === targetSlug;
    });
    if (bySlug) return bySlug;

    // 4. Fuzzy / Partial Match
    const partialMatch = list.find(e => {
        const eLower = e.event.toLowerCase();
        return eLower.includes(cleanLower) || cleanLower.includes(eLower);
    });
    if (partialMatch) return partialMatch;

    return null;
}

export default function EconomicEventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const rawId = params?.id as string;
    const eventId = rawId ? decodeURIComponent(rawId) : "";

    const [event, setEvent] = useState<CatalogCalendarEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAllScenarios, setShowAllScenarios] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        let isMounted = true;

        async function fetchEventData(isInitial = false) {
            if (isInitial) setLoading(true);

            try {
                // Öncelik: Canlı veritabanı veya API'den anlık takvim çek
                const res = await fetch('/api/calendar?t=' + Date.now(), { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    const liveList: CatalogCalendarEvent[] = data.events || data.economicEvents || (Array.isArray(data) ? data : []);
                    const resolved = resolveCalendarEvent(eventId, liveList);
                    if (resolved && isMounted) {
                        setEvent(resolved);
                        if (isInitial) setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Live calendar event fetch error:", err);
            }

            // Fallback: Dinamik haftalık takvim kataloğu ile güncel tarihleri çözümle
            if (isMounted) {
                const dynamicList = getDynamicCalendarCatalog();
                const catalogResolved = resolveCalendarEvent(eventId, dynamicList);
                if (catalogResolved) {
                    setEvent(catalogResolved);
                }
                if (isInitial) setLoading(false);
            }
        }

        // İlk yükleme
        fetchEventData(true);

        // Belirli aralıklarla (30 saniyede bir) otomatik canlı veri yenileme
        const interval = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
            fetchEventData(false);
        }, 30000);

        // Sekmeye geri dönüldüğünde anlık yenileme
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchEventData(false);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isMounted = false;
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center text-[#00008B]">
                <div className="w-10 h-10 rounded-full border-4 border-[#00008B] border-t-transparent animate-spin mb-3" />
                <span className="text-xs font-black uppercase tracking-wider">Gösterge Analizi Yükleniyor...</span>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center p-6 text-[#00008B]">
                <h2 className="text-xl font-black mb-2">Gösterge Bulunamadı</h2>
                <p className="text-xs text-slate-500 mb-6">İstenen ekonomik veri detayına ve analiz geçmişine ulaşılamadı.</p>
                <Link href="/dashboard/calendar?type=economic" className="px-5 py-2.5 rounded-xl bg-[#00008B] text-white font-bold text-xs">
                    Takvime Dön
                </Link>
            </div>
        );
    }

    // Indicator Profile Lookup
    const profile: IndicatorProfile = INDICATOR_PROFILES_DATABASE[event.event] || 
        INDICATOR_PROFILES_DATABASE[Object.keys(INDICATOR_PROFILES_DATABASE).find(k => event.event.includes(k)) || ""] || 
        INDICATOR_PROFILES_DATABASE["Default"];

    const calc = calculateBackendDifferences(event);
    const finAiAnalysis = generateFinAiAnalysis(event);

    // Etki zincirinin altında önerilecek diğer haberler
    const relatedNames = profile.relatedIndicators?.map(r => r.name.toLowerCase()) || [];
    const filteredEvents = ECONOMIC_CALENDAR_CATALOG.filter(e => {
        if (e.event.toLowerCase() === event.event.toLowerCase()) return false;
        return (
            relatedNames.some(rn => e.event.toLowerCase().includes(rn) || rn.includes(e.event.toLowerCase())) ||
            e.country === event.country ||
            e.impact === 'critical'
        );
    });

    const seenEvents = new Set<string>();
    const recommendedEvents: CatalogCalendarEvent[] = [];
    for (const item of filteredEvents) {
        if (!seenEvents.has(item.event) && item.event !== event.event) {
            seenEvents.add(item.event);
            recommendedEvents.push(item);
        }
        if (recommendedEvents.length >= 4) break;
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 text-[#00008B] w-full mx-auto relative overflow-hidden">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10 mb-20">
                {/* Navigation Top Bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard/calendar?type=economic"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-[#00008B] font-bold text-xs shadow-sm hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Ekonomik Takvime Dön
                    </Link>
                </div>

                {/* 1. BAŞLIK VE TARİH: TARİH SOLDA, BAŞLIK TAM ORTADA */}
                <div className="w-full pt-1 pb-2">
                    {/* Sol tarafta tarih */}
                    <div className="flex items-center text-xs font-bold text-slate-500 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-bold">
                            <CalendarIcon className="w-4 h-4 text-[#00008B]" /> {event.dateFormatted || 'Bugün'} · {event.time} TSİ
                        </span>
                    </div>

                    {/* Ortada Başlık */}
                    <div className="text-center w-full py-1">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00008B] tracking-tight leading-tight max-w-4xl mx-auto">
                            {event.event}
                        </h1>
                    </div>
                </div>

                {/* ANA İÇERİK & SAĞ DİKEY ETKİ ZİNCİRİ BAREMİ */}
                <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

                    {/* SOL BÖLÜM: 2 KART (TANIM & FINAI INTELLIGENCE), GRAFİK VE GEÇMİŞTE NELER OLDU */}
                    <div className="flex-1 min-w-0 space-y-6 w-full">

                        {/* 2. BAŞLIĞIN ALTINDA İKİYE BÖLÜNEN ALAN: SOLDA LACİVERT TANIM, SAĞDA BEYAZ FINAI INTELLIGENCE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {/* SOL: TANIM (LACİVERT KUTU, BEYAZ DÜZ YAZI, İÇ FON YOK) */}
                            <div className="bg-[#00008B] text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 pb-3 border-b border-white/40">
                                        <div className="w-9 h-9 rounded-2xl bg-blue-900/60 border border-blue-800 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-white tracking-tight">Tanım</h2>
                                        </div>
                                    </div>

                                    {profile.definition ? (
                                        <div className="pt-1">
                                            <p className="text-xs sm:text-[13px] font-normal text-white leading-relaxed tracking-normal">
                                                {profile.definition}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center">
                                            <p className="text-xs font-bold text-blue-200/60 leading-relaxed max-w-sm mx-auto">
                                                Bu göstergenin akademik tanımı ve piyasa literatüründeki kavramsal karşılığı yakında bu alana eklenecektir.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SAĞ: FINAI INTELLIGENCE (BEYAZ KUTU, LACİVERT/KOYU DÜZ YAZI, İÇ FON YOK) */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-150">
                                        <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4 text-[#00008B]" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-[#00008B] tracking-tight">FinAi INTELLIGENCE</h2>
                                        </div>
                                    </div>

                                    {profile.realLifeExample ? (
                                        <div className="pt-1">
                                            <p className="text-xs sm:text-[13px] font-normal text-slate-800 leading-relaxed tracking-normal">
                                                {profile.realLifeExample}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center">
                                            <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">
                                                Açıklanan verinin bireysel bütçeye, gündelik tüketime ve sokaktaki reel hayata somut yansımaları yakında eklenecektir.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. GEÇMİŞ VERİ GRAFİĞİ (BUĞULU / FROSTED GLASS - BAŞLIK & YAKINDA) */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 relative overflow-hidden">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-[#00008B]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#00008B] tracking-tight">Geçmiş Veri Grafiği</h2>
                                        <p className="text-xs text-slate-400 font-bold">Tarihsel Değişim & Eğilim Trendi</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buğulu Mock Grafik Alanı */}
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/80 h-64 sm:h-72 flex items-center justify-center">
                                {/* Arka planda flu çizim/çubuk grafik silueti */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between filter blur-md opacity-35 select-none pointer-events-none">
                                    <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-200 pb-2">
                                        <span>5.50%</span>
                                        <span>5.25%</span>
                                        <span>5.00%</span>
                                        <span>4.75%</span>
                                        <span>4.50%</span>
                                    </div>
                                    <svg viewBox="0 0 800 200" className="w-full h-36" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#00008B" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#00008B" stopOpacity="0.0" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M0,140 Q100,110 200,120 T400,60 T600,80 T800,40 L800,200 L0,200 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <path
                                            d="M0,140 Q100,110 200,120 T400,60 T600,80 T800,40"
                                            fill="none"
                                            stroke="#00008B"
                                            strokeWidth="3"
                                        />
                                    </svg>
                                    <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                                        <span>Oca 2026</span>
                                        <span>Şub 2026</span>
                                        <span>Mar 2026</span>
                                        <span>Nis 2026</span>
                                        <span>May 2026</span>
                                    </div>
                                </div>

                                {/* Üst katman: Frosted Glass Buğu ve Yakında Rozeti */}
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                                    <div className="px-5 py-2.5 rounded-2xl bg-[#00008B] text-white shadow-lg shadow-[#00008B]/25 flex items-center gap-2 mb-2 hover:scale-105 transition-transform">
                                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span className="text-xs font-black tracking-wider uppercase">Yakında</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 max-w-sm leading-relaxed">
                                        Göstergeye ait tarihsel açıklanan veriler ve interaktif geçmiş trend grafiği yakında burada görüntülenecektir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4. EN ALT KISIM: GEÇMİŞTE NELER OLDU (SENARYO ANALİZİ FORMATINDA) */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-[#00008B]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-[#00008B]">Geçmişte Neler Oldu?</h2>
                                        <p className="text-xs text-slate-400 font-bold">Gerçekleşen Veri Açıklaması & Piyasa Yansıması</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAllScenarios(!showAllScenarios)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#00008B] font-extrabold text-xs transition-all"
                                >
                                    {showAllScenarios ? 'Diğer Senaryoları Gizle' : 'Diğer Senaryoları Görüntüle'}
                                    {showAllScenarios ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="p-6 rounded-3xl bg-[#00008B] text-white space-y-4 shadow-lg">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 rounded-xl bg-emerald-400 text-[#00008B] text-xs font-black">
                                        Gerçekleşen Durum
                                    </span>
                                    <span className="text-xs font-bold text-blue-200">
                                        {calc.forecastDiffText || 'Piyasa Paralelinde'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-blue-100 pt-2 border-t border-blue-800">
                                    <div>
                                        <span className="text-[10px] text-blue-300 uppercase block font-bold">PİYASA BEKLENTİSİ</span>
                                        <span className="text-sm font-black text-white">{event.forecast || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-blue-300 uppercase block font-bold">GERÇEKLEŞEN VERİ</span>
                                        <span className="text-sm font-black text-white">{event.actual || 'Bekleniyor'}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-blue-300 uppercase block font-bold">PİYASAYA ETKİ & YANSIMA</span>
                                        <span className="text-xs font-bold text-emerald-300">{finAiAnalysis.whatItMeans.slice(0, 80)}...</span>
                                    </div>
                                </div>
                            </div>

                            {showAllScenarios && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-150">
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                        <h4 className="text-xs font-black text-emerald-700">1. Beklentinin Üzerinde Geldiğinde</h4>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                            Göstergenin piyasa beklentilerinin üzerinde açıklanması faiz ve getiri beklentilerini yukarı yönlü etkileyebilir, politika duruşunda sıkılaşma eğilimini güçlendirebilir.
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                        <h4 className="text-xs font-black text-rose-700">2. Beklentinin Altında Geldiğinde</h4>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                            Göstergenin piyasa tahminlerinin altında kalması ekonomik aktivitede soğuma veya dezenflasyonist baskı yaratabilir, gevşeme beklentilerini artırabilir.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SAĞ BÖLÜM: EKONOMİK ETKİ ZİNCİRİ & ÖNERİLEN DİĞER HABERLER */}
                    <div className="w-full lg:w-[260px] xl:w-[290px] shrink-0 space-y-6">
                        <EconomicImpactChainStepper channels={profile.impactChannels} />

                        {/* ETKİ ZİNCİRİNİN ALTINDA: DİĞER ÖNERİLEN HABERLER */}
                        {recommendedEvents.length > 0 && (
                            <div className="space-y-3 pt-3 border-t border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-3.5 h-3.5 text-[#00008B]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black text-[#00008B] tracking-tight uppercase">
                                            Önerilen Haberler
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-bold">Takip Edilebilecek Göstergeler</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {recommendedEvents.map((rec, idx) => (
                                        <Link
                                            key={rec.id || idx}
                                            href={`/dashboard/economic-calendar/${toSlug(rec.event)}`}
                                            className="group block p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#00008B] hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-0.5">
                                                        <span>{rec.flag}</span>
                                                        <span className="text-[#00008B] font-black">{rec.country}</span>
                                                        <span>·</span>
                                                        <span>{rec.time} TSİ</span>
                                                    </div>
                                                    <h4 className="text-xs font-bold text-[#00008B] group-hover:text-blue-700 leading-snug line-clamp-2 transition-colors">
                                                        {rec.event}
                                                    </h4>
                                                </div>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00008B] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
