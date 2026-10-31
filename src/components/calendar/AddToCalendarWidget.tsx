"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Clock, Check, ChevronDown, Download, ExternalLink } from "lucide-react";
import { CatalogCalendarEvent } from "@/lib/calendar-catalog";

interface CountdownData {
    isPast: boolean;
    text?: string;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

// 1. CANLI GERİ SAYIM METNİ (Tarih ile birebir aynı font ve sade stil)
export function EventCountdownTimer({ event }: { event: CatalogCalendarEvent }) {
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const targetDate = useMemo(() => {
        if (!event.dateFormatted) return null;
        const parts = event.dateFormatted.split(".");
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        let hours = 10;
        let minutes = 0;
        if (event.time && event.time.includes(":")) {
            const timeParts = event.time.split(":");
            hours = parseInt(timeParts[0], 10) || 10;
            minutes = parseInt(timeParts[1], 10) || 0;
        }

        return new Date(year, month, day, hours, minutes, 0);
    }, [event.dateFormatted, event.time]);

    const countdown: CountdownData | null = useMemo(() => {
        if (!targetDate) return null;
        const diffMs = targetDate.getTime() - now.getTime();

        if (diffMs <= 0) {
            return { isPast: true, text: "Veri Açıklandı" };
        }

        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            isPast: false,
            days,
            hours,
            minutes,
            seconds,
        };
    }, [targetDate, now]);

    if (!countdown) return null;

    if (countdown.isPast) {
        return (
            <div className="flex items-center text-xs font-bold text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-slate-500 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" /> Veri Açıklandı
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-slate-500 font-bold">
                <Clock className="w-4 h-4 text-[#00008B]" /> Açıklanmasına:{" "}
                <span className="text-[#00008B] font-bold">
                    {(countdown.days ?? 0) > 0 && `${countdown.days}g `}
                    {String(countdown.hours ?? 0).padStart(2, "0")}s :{" "}
                    {String(countdown.minutes ?? 0).padStart(2, "0")}d :{" "}
                    {String(countdown.seconds ?? 0).padStart(2, "0")}sn
                </span>
            </span>
        </div>
    );
}

// 2. TAKVİME EKLE BUTONU (Başlık satırında sağa/ortaya hizalı)
export function AddToCalendarButton({ event }: { event: CatalogCalendarEvent }) {
    const [isOpen, setIsOpen] = useState(false);

    const targetDate = useMemo(() => {
        if (!event.dateFormatted) return null;
        const parts = event.dateFormatted.split(".");
        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        let hours = 10;
        let minutes = 0;
        if (event.time && event.time.includes(":")) {
            const timeParts = event.time.split(":");
            hours = parseInt(timeParts[0], 10) || 10;
            minutes = parseInt(timeParts[1], 10) || 0;
        }

        return new Date(year, month, day, hours, minutes, 0);
    }, [event.dateFormatted, event.time]);

    const googleCalendarUrl = useMemo(() => {
        if (!targetDate) return "#";
        const startIso = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);
        const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const title = encodeURIComponent(`FinAi: ${event.event} (${event.country})`);
        const details = encodeURIComponent(
            `FinAi Ekonomik Takvim Göstergesi\n` +
            `Ülke: ${event.country}\n` +
            `Beklenti: ${event.forecast || '—'}\n` +
            `Önceki Değer: ${event.previous || '—'}\n` +
            `Önem Düzeyi: ${event.impact?.toUpperCase() || 'NORMAL'}`
        );
        const location = encodeURIComponent("FinAi Terminal");

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    }, [targetDate, event]);

    const handleDownloadICS = () => {
        if (!targetDate) return;
        const startIso = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000);
        const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//FinAi//Ekonomik Takvim//TR",
            "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            `SUMMARY:FinAi: ${event.event} (${event.country})`,
            `DESCRIPTION:Beklenti: ${event.forecast || '—'}, Önceki: ${event.previous || '—'}`,
            `DTSTART:${startIso}`,
            `DTEND:${endIso}`,
            `STATUS:CONFIRMED`,
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.event.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 hover:border-[#00008B] text-[#00008B] font-bold text-xs shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
                <Calendar className="w-3.5 h-3.5 text-[#00008B]" />
                <span>Takvime Ekle</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                        <a
                            href={googleCalendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00008B] hover:bg-blue-50 rounded-xl transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                Google Takvim
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>

                        <button
                            onClick={handleDownloadICS}
                            className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#00008B] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer text-left"
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-800" />
                                Apple / Outlook (.ics)
                            </span>
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function AddToCalendarWidget({ event }: { event: CatalogCalendarEvent }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <EventCountdownTimer event={event} />
            <AddToCalendarButton event={event} />
        </div>
    );
}
