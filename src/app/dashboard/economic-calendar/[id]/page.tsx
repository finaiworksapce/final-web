"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Calendar as CalendarIcon, BookOpen, Target, 
    ChevronDown, ChevronUp, Layers, CheckCircle2, ShieldCheck, Activity, Zap, Sparkles
} from "lucide-react";
import Link from "next/link";
import { CatalogCalendarEvent } from "@/lib/calendar-catalog";
import { getDynamicCalendarCatalog } from "@/lib/calendar-scraper";
import { INDICATOR_PROFILES_DATABASE, IndicatorProfile } from "@/lib/indicator-profiles";
import { calculateBackendDifferences, generateFinAiAnalysis } from "@/lib/finai-calendar-analysis-engine";
import FollowIndicatorButton from "@/components/calendar/FollowIndicatorButton";

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
    const slugMatch = list.find(e => {
        const eSlug = toSlug(e.event);
        return eSlug === targetSlug || e.id.toLowerCase() === targetSlug;
    });
    if (slugMatch) return slugMatch;

    // 4. Parse Legacy Composite ID: ${country}_${eventName}_${date}
    const underscoreParts = decoded.split('_');
    if (underscoreParts.length >= 2) {
        const countryCandidate = underscoreParts[0].toUpperCase();
        const middleParts = underscoreParts.slice(1, underscoreParts.length - 1).join('_');
        const middleSlug = toSlug(middleParts);

        if (middleParts || middleSlug) {
            const compositeMatch = list.find(e => {
                const countryOk = !countryCandidate || e.country.toUpperCase() === countryCandidate;
                const nameOk = e.event === middleParts || 
                               e.event.toLowerCase() === middleParts.toLowerCase() ||
                               toSlug(e.event) === middleSlug;
                return countryOk && nameOk;
            });
            if (compositeMatch) return compositeMatch;
        }
    }

    // 5. Strict Substring Match for Long Log Strings
    const strictContains = list.find(e => {
        const eLower = e.event.toLowerCase();
        return cleanLower.includes(eLower) && (cleanLower.length - eLower.length) < 25;
    });
    if (strictContains) return strictContains;

    return null;
}

export default function EconomicEventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params?.id as string;

    const [event, setEvent] = useState<CatalogCalendarEvent | null>(null);
    const [loading, setLoading] = useState(true);

    // State: Show all scenarios accordion toggle
    const [showAllScenarios, setShowAllScenarios] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        let isMounted = true;

        async function fetchEventData(isInitial = false) {
            try {
                const res = await fetch('/api/calendar', { cache: 'no-store' });
                const json = await res.json();
                if (json.data && Array.isArray(json.data) && isMounted) {
                    const resolved = resolveCalendarEvent(eventId, json.data);
                    if (resolved) {
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
                <Link href="/dashboard/economic-calendar" className="px-5 py-2.5 rounded-xl bg-[#00008B] text-white font-bold text-xs">
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

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 text-[#00008B] w-full mx-auto relative overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:px-10 lg:py-8 space-y-6 relative z-10 mb-20">
                {/* Navigation Top Bar */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/dashboard/economic-calendar"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-[#00008B] font-bold text-xs shadow-sm hover:bg-slate-100 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Ekonomik Takvime Dön
                    </Link>
                </div>

                {/* SADELEŞTİRİLMİŞ HEADER BANNER (TAKİP ET BUTONU EKLENDİ) */}
                <div className="w-full bg-[#00008B] text-white border border-[#00008B] rounded-3xl p-6 md:p-8 shadow-xl shadow-[#00008B]/20 relative overflow-hidden space-y-4">
                    <div className="relative z-10 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold">
                                <span>{profile.flag}</span>
                                <span>{event.country}</span>
                                <span>·</span>
                                <span>{profile.category}</span>
                            </div>
                            <FollowIndicatorButton indicatorName={event.event} />
                        </div>

                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                                {event.event}
                            </h1>
                            <p className="text-xs font-bold text-blue-200 mt-1.5 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-300" /> {event.dateFormatted || 'Bugün'} · {event.time} TSİ
                            </p>
                        </div>
                    </div>
                </div>

                {/* FINAI INTELLIGENCE ANA BÖLÜMÜ (TEKNİK NİTELEMELER KALDIRILDI) */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-[#00008B]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#00008B] tracking-tight">FINAI INTELLIGENCE</h2>
                            <p className="text-xs text-slate-400 font-bold">
                                Bu verinin ne söylediğini, ne anlama geldiğini ve hangi koşullarda önem kazandığını açıklıyoruz.
                            </p>
                        </div>
                    </div>

                    {/* FINAI'NİN KISA DEĞERLENDİRMESİ */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-md">
                        <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" /> FinAi'nin Kısa Değerlendirmesi
                        </h3>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">
                            {finAiAnalysis.shortExecutiveSummary}
                        </p>
                    </div>

                    {/* DÖRT PARÇALI ANALİZ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                            <h4 className="text-xs font-black text-[#00008B] uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#00008B]" /> 01 — NE OLDU?
                            </h4>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                {finAiAnalysis.whatHappened}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-emerald-600" /> 02 — NE ANLAMA GELİYOR?
                            </h4>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                {finAiAnalysis.whatItMeans}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-purple-600" /> 03 — NELERİ ETKİLEYEBİLİR?
                            </h4>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                {finAiAnalysis.potentialImpacts}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-amber-600" /> 04 — NELERE DİKKAT EDİLMELİ?
                            </h4>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                {finAiAnalysis.pointsToConsider}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BU VERİ NEDİR? */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#00008B]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#00008B]">Bu Veri Nedir?</h2>
                            <p className="text-xs text-slate-400 font-bold">Gösterge Özeti ve Yorumlama Mantığı</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <h3 className="text-xs font-black text-[#00008B] uppercase tracking-wider">1. Tanım</h3>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{profile.definition}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <h3 className="text-xs font-black text-[#00008B] uppercase tracking-wider">2. Ne Ölçer?</h3>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{profile.whatItMeasures}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <h3 className="text-xs font-black text-[#00008B] uppercase tracking-wider">3. Neden Önemlidir?</h3>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{profile.whyItMatters}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                            <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 4. Nasıl Yorumlanır?
                            </h3>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{profile.howToInterpret}</p>
                        </div>
                    </div>
                </div>

                {/* EKONOMİK ETKİ ZİNCİRİ */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-150">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-[#00008B]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#00008B]">Ekonomik Etki Zinciri</h2>
                            <p className="text-xs text-slate-400 font-bold">Veri Açıklamasından Varlık Fiyatlamalarına Neden-Sonuç Akışı</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-3">
                        {profile.impactChannels.map((channel, idx) => (
                            <div key={idx} className="flex-1 flex flex-col lg:flex-row items-center gap-3">
                                <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                                        {channel.step}
                                    </span>
                                    <h4 className="text-xs font-black text-[#00008B]">{channel.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium leading-normal">{channel.desc}</p>
                                </div>
                                {idx < profile.impactChannels.length - 1 && (
                                    <span className="text-slate-300 font-black text-sm hidden lg:block">➔</span>
                                )}
                                {idx < profile.impactChannels.length - 1 && (
                                    <span className="text-slate-300 font-black text-sm lg:hidden">↓</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* SENARYO ANALİZİ */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                                <Target className="w-5 h-5 text-[#00008B]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#00008B]">Senaryo Analizi</h2>
                                <p className="text-xs text-slate-400 font-bold">Gerçekleşen Senaryo & Olası Alternatif Durumlar</p>
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
                                Gerçekleşen Senaryo
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
                                <span className="text-[10px] text-blue-300 uppercase block font-bold">OLASI EKONOMİK YANSIMA</span>
                                <span className="text-xs font-bold text-emerald-300">{finAiAnalysis.whatItMeans.slice(0, 80)}...</span>
                            </div>
                        </div>
                    </div>

                    {showAllScenarios && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-150">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                <h4 className="text-xs font-black text-emerald-700">1. Beklentinin Üzerinde Gelirse</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    Göstergenin öngörülen beklenti seviyesinin üzerinde gerçekleşmesi durumunda faiz beklentileri sıkılaşabilir ve para politikasında temkinli duruş korunabilir.
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                <h4 className="text-xs font-black text-rose-700">2. Beklentinin Altında Gelirse</h4>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                    Göstergenin piyasa beklentilerinin gerisinde kalması halinde dezenflasyonist veya yavaşlama sinyalleri güçlenebilir, faiz indirimi alanları doğabilir.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
