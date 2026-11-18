"use client";

import React, { useState } from "react";
import { 
    Clock, 
    Calendar, 
    Building2, 
    Coins, 
    CheckCircle2, 
    X,
    ExternalLink
} from "lucide-react";
import { NextMonthExpectationsBlock } from "@/lib/finai-monthly-report-service";
import StockLogo from "@/components/StockLogo";

interface MonthlyNextMonthExpectationsWidgetProps {
    data?: NextMonthExpectationsBlock | null;
    loading: boolean;
}

export default function MonthlyNextMonthExpectationsWidget({
    data,
    loading
}: MonthlyNextMonthExpectationsWidgetProps) {
    const [showEventsModal, setShowEventsModal] = useState<boolean>(false);

    if (loading) {
        return (
            <div className="w-full h-full bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 sm:p-7 animate-pulse flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-slate-200 dark:bg-white/10 rounded"></div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-100 dark:bg-white/5 rounded"></div>
                    <div className="h-4 w-4/6 bg-slate-100 dark:bg-white/5 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const companyEvents = data.companyEvents || [];
    const macroEvents = data.macroEvents || [];
    const count = data.totalCalendarEventsCount || macroEvents.length;

    return (
        <article className="w-full h-full bg-white dark:bg-[#040989]/20 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
            {/* 1. Editoryal Üst Başlık (Monokrom, temiz, 50/50 simetrisi) */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/60 dark:bg-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-white/10 border border-blue-200/60 dark:border-white/10 flex items-center justify-center text-[#004BFA] dark:text-[#93C5FD]">
                        <Clock className="w-4 h-4 text-current" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                            {data.title}
                        </h2>
                    </div>
                </div>

                {/* Dinamik Takvim Olay Sayacı Butonu */}
                {count > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowEventsModal(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#004BFA] dark:text-[#93C5FD] bg-[#004BFA]/5 dark:bg-white/5 hover:bg-[#004BFA]/10 dark:hover:bg-white/10 rounded-lg border border-[#004BFA]/20 dark:border-white/10 transition-colors cursor-pointer"
                        title="Tüm ekonomik takvim verilerini görüntüle"
                    >
                        <Calendar className="w-3.5 h-3.5 text-[#004BFA]" />
                        <span>{data.targetMonthLabel} Ajandası ({count} Olay)</span>
                    </button>
                )}
            </div>

            {/* 2. Ana Gövde (Storytelling Narrative & Mentör Perspektifi) */}
            <div className="p-6 space-y-5 flex-1">
                {/* Tarih Aralığı Bilgisi */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-500 dark:text-slate-400">Hedef Dönem Penceresi:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-numbers">
                        {data.targetDateRangeFormatted}
                    </span>
                </div>

                {/* Editoryal Mentör Paragrafları (Çeşitlendirilmiş bağlayıcı ifadeler, sıfır tekrar) */}
                <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {data.narrativeParagraphs.map((para, idx) => (
                        <p key={idx} className="tracking-normal">
                            {para}
                        </p>
                    ))}
                </div>

                {/* 3. Portföyde En Yüksek Ağırlıklı 2 Varlığın Şirket Olayları (SADECE VARSA GÖRÜNÜR, YOKSA ATLANIR) */}
                {companyEvents.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#004BFA]" />
                                <span>Yaklaşan Şirket Olayları (Temettü & Bilanço)</span>
                            </span>
                            <span className="text-[10px] text-slate-400">İlk 2 Varlık</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {companyEvents.map((ev, i) => (
                                <div 
                                    key={i} 
                                    className="p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex flex-col justify-between space-y-2 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StockLogo symbol={ev.symbol} className="w-6 h-6 object-contain shrink-0" />
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                                                    <span>{ev.symbol}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                                                        ev.eventType === 'dividend' 
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                    }`}>
                                                        {ev.eventType === 'dividend' ? 'Temettü' : 'Bilanço'}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{ev.companyName}</div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 font-numbers">
                                                {ev.dateFormatted}
                                            </div>
                                            <div className="text-[9px] text-slate-400">Takvim Tarihi</div>
                                        </div>
                                    </div>

                                    {/* Temettü Tahmini Nakit Bilgisi (Tavsiye İçermez, Sadece Net Tutar) */}
                                    {ev.eventType === 'dividend' && ev.estimatedPayoutTL !== undefined && (
                                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                                            Hisse başı net: <strong>{ev.netAmountPerShare} ₺</strong> • Tahmini Nakit: <strong>{Math.round(ev.estimatedPayoutTL).toLocaleString('tr-TR')} ₺</strong>
                                        </div>
                                    )}

                                    {/* Bilanço Dönem Bilgisi */}
                                    {ev.eventType === 'earnings' && ev.periodLabel && (
                                        <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/40">
                                            Açıklanacak Finansal Dönem: <strong>{ev.periodLabel}</strong>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Altın & Küresel Jeopolitik Gündem Alanı (Eğer portföyde altın varsa) */}
                {data.goldGeopoliticalInsight && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                        <div className="border-l-2 border-amber-500/80 bg-amber-50/30 dark:bg-amber-950/20 p-3.5 rounded-r-xl space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                                <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>Kıymetli Maden & Jeopolitik Pusula</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                                {data.goldGeopoliticalInsight}
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* 5. Alt Doğrulama Şeridi */}
            <div className="px-6 py-3 border-t border-slate-100 dark:border-white/10 bg-slate-50/40 dark:bg-white/5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#004BFA]" />
                    <span>FinAi Takvim verileriyle 1-1 senkronize çalışır.</span>
                </div>
                <span>Disiplin: Bilinçli Ortaklık</span>
            </div>

            {/* 6. İNTERAKTİF MİKRO TAKVİM MODAL / POPOVER */}
            {showEventsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="w-full max-w-xl bg-white dark:bg-[#02041A] border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#004BFA]" />
                                    <span>{data.targetMonthLabel} Kritik Takvim Başlıkları ({count} Gelişme)</span>
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Portföyünüzün coğrafyasıyla eşleştirilmiş öncü ekonomik göstergeler
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEventsModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                            {macroEvents.map((ev, i) => (
                                <div 
                                    key={i}
                                    className="p-3 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 space-y-1.5 text-xs"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                                {ev.country}
                                            </span>
                                            <span>{ev.event}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-numbers shrink-0">
                                            {ev.dateFormatted}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {ev.plainExplanation}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowEventsModal(false)}
                                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
