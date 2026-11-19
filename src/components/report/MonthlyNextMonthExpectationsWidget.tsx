"use client";

import React, { useState } from "react";
import { 
    Clock, 
    Calendar, 
    Building2, 
    Coins, 
    CheckCircle2, 
    X,
    ExternalLink,
    Download
} from "lucide-react";
import Link from "next/link";
import { NextMonthExpectationsBlock } from "@/lib/finai-monthly-report-service";
import StockLogo from "@/components/StockLogo";
import WikipediaEntityText from "./WikipediaEntityText";

interface MonthlyNextMonthExpectationsWidgetProps {
    data?: NextMonthExpectationsBlock | null;
    loading: boolean;
}

export default function MonthlyNextMonthExpectationsWidget({
    data,
    loading
}: MonthlyNextMonthExpectationsWidgetProps) {
    const [showEventsModal, setShowEventsModal] = useState<boolean>(false);
    const [downloadedNotice, setDownloadedNotice] = useState<boolean>(false);

    if (loading) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#02041A] via-[#040989] to-[#0A2682] border border-white/10 rounded-2xl p-6 sm:p-7 animate-pulse flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="h-6 w-48 bg-white/20 rounded"></div>
                    <div className="h-4 w-full bg-white/10 rounded"></div>
                    <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                    <div className="h-4 w-4/6 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const companyEvents = data.companyEvents || [];
    const macroEvents = data.macroEvents || [];
    const count = data.totalCalendarEventsCount || macroEvents.length;
    const activeSymbols = companyEvents.map(e => e.symbol);

    const handleExportCalendar = () => {
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//FinAi Workspace//Stratejik Ajanda//TR\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
        
        macroEvents.forEach(ev => {
            const rawDate = ev.rawDate ? ev.rawDate.replace(/-/g, '') : '';
            if (rawDate) {
                icsContent += `BEGIN:VEVENT\nSUMMARY:[FinAi] ${ev.country} - ${ev.event}\nDESCRIPTION:${ev.plainExplanation}\nDTSTART;VALUE=DATE:${rawDate}\nDTEND;VALUE=DATE:${rawDate}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
            }
        });

        companyEvents.forEach(ev => {
            const rawDate = ev.rawDate ? ev.rawDate.replace(/-/g, '') : '';
            if (rawDate) {
                const desc = ev.eventType === 'dividend' 
                    ? `Temettü Ödemesi (Net: ${ev.netAmountPerShare} TL${ev.estimatedPayoutTL ? ` - Tahmini Nakit: ${Math.round(ev.estimatedPayoutTL)} TL` : ''})` 
                    : `Finansal Sonuçlar (${ev.periodLabel || 'Bilanço'})`;
                icsContent += `BEGIN:VEVENT\nSUMMARY:[FinAi Şirket] ${ev.symbol} - ${ev.title}\nDESCRIPTION:${desc}\nDTSTART;VALUE=DATE:${rawDate}\nDTEND;VALUE=DATE:${rawDate}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
            }
        });

        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const cleanMonth = (data.targetMonthLabel || 'Ay').replace(/[^a-zA-Z0-9_-]/g, '_');
        link.setAttribute('download', `FinAi_${cleanMonth}_Stratejik_Ajandasi.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloadedNotice(true);
        setTimeout(() => setDownloadedNotice(false), 3000);
    };

    const fullNarrativeText = (data.narrativeParagraphs || []).filter(Boolean).join(" ");

    return (
        <article className="w-full h-full bg-gradient-to-br from-[#02041A] via-[#040989] to-[#0A2682] text-white border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between">
            {/* 1. Editoryal Üst Başlık (FinAi Lacivert/Mavi Tema) */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-3 bg-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-[#93C5FD]">
                        <Clock className="w-4 h-4 text-current" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white tracking-tight">
                            Gelecek Ay İçin Beklentiler
                        </h2>
                    </div>
                </div>

                {/* Dinamik Takvim Olay Sayacı Butonu */}
                {count > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowEventsModal(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#93C5FD] bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 transition-colors cursor-pointer"
                        title="Tüm ekonomik takvim verilerini görüntüle"
                    >
                        <Calendar className="w-3.5 h-3.5 text-[#93C5FD]" />
                        <span>{data.targetMonthLabel} Ajandası ({count} Olay)</span>
                    </button>
                )}
            </div>

            {/* 2. Ana Gövde: Akıcı Tek Paragraf Anlatım */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="text-xs sm:text-[13px] leading-relaxed text-[#D6E4FF]/90 tracking-normal space-y-3">
                    <p className="leading-relaxed">
                        <WikipediaEntityText text={fullNarrativeText} activeSymbols={activeSymbols} variant="dark" />
                    </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#D6E4FF]/60">
                    <span>FinAi Stratejik Ajanda Motoru</span>
                    <span className="font-medium text-[#93C5FD]">Detaylar için altı çizili başlıklara basabilirsiniz</span>
                </div>
            </div>

            {/* 6. İNTERAKTİF MİKRO TAKVİM MODAL / POPOVER */}
            {showEventsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <div className="w-full max-w-2xl bg-[#02041A] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col text-white">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#93C5FD]" />
                                    <span>{data.targetMonthLabel} Stratejik Ajandası ({count} Olay)</span>
                                </h3>
                                <p className="text-[11px] text-[#D6E4FF]/70 mt-0.5">
                                    BIST hisseleriniz için Türkiye resmi takvimi ve Altın için ABD Fed faiz kararı
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEventsModal(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Aksiyon Araç Çubuğu: Takvime Entegre Et & FinAi Takvim Sayfası */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <span className="text-xs text-[#D6E4FF] font-medium">
                                Bu ajandayı doğrudan kişisel telefonunuza veya bilgisayar takviminize aktarın:
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleExportCalendar}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#004BFA] hover:bg-blue-600 rounded-xl transition-colors shadow-xs cursor-pointer active:scale-95"
                                    title="Google Takvim / iCal .ics dosyasını indir"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>{downloadedNotice ? "✓ Takvim İndirildi" : "Kişisel Takvime Ekle (.ics)"}</span>
                                </button>

                                <Link
                                    href="/dashboard/calendar"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#93C5FD] bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors cursor-pointer"
                                >
                                    <span>Takvim Sayfası</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Olaylar Listesi */}
                        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                            {macroEvents.map((ev, i) => (
                                <div 
                                    key={i}
                                    className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1.5 text-xs hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 font-medium text-white">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                ev.country === 'TR' 
                                                    ? 'bg-blue-950 text-blue-300 border border-blue-500/30' 
                                                    : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                            }`}>
                                                {ev.country === 'TR' ? 'TÜRKİYE' : 'ABD FED'}
                                            </span>
                                            <span>{ev.event}</span>
                                        </div>
                                        <span className="text-[11px] text-[#D6E4FF]/70 font-numbers shrink-0 font-medium">
                                            📅 {ev.dateFormatted}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#D6E4FF]/80 leading-relaxed">
                                        {ev.plainExplanation}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowEventsModal(false)}
                                className="px-4 py-2 text-xs font-medium text-[#D6E4FF] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
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
