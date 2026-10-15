import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic';

export type IpoPhase = 'upcoming' | 'active' | 'completed' | null;

export interface HalkarzIpoItem {
    id: number;
    symbol: string;
    companyName: string;
    link: string;
    status: string;
    /** halkarz.com'daki ham "Talep Toplama Tarihleri" metni */
    dateRange: string;
    /** Talep toplamanın ilk günü (YYYY-MM-DD) */
    startDate?: string | null;
    /** Talep toplamanın son günü (YYYY-MM-DD) */
    endDate?: string | null;
    /** Talep toplamanın tüm günleri (YYYY-MM-DD) */
    dates?: string[];
    /** Talep toplamanın ilk gününün zaman damgası */
    timestamp: number;
    /** Talep toplama tarihlerine göre bugünkü aşama */
    phase: IpoPhase;
}

const TURKISH_MONTH_MAP: Record<string, number> = {
    'ocak': 1, 'şubat': 2, 'mart': 3, 'nisan': 4, 'mayıs': 5, 'haziran': 6,
    'temmuz': 7, 'ağustos': 8, 'eylül': 9, 'ekim': 10, 'kasım': 11, 'aralık': 12
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Talep toplama tarih metnini ayrıştırır. Desteklenen biçimler:
 *  - "9-10-11 Eylül 2026"
 *  - "26-27 Ağustos 2026"
 *  - "30 Haziran, 1 Temmuz 2026"          (iki aya yayılan)
 *  - "29-30 Haziran, 1 Temmuz 2026"       (iki aya yayılan)
 *  - "30-31 Aralık 2026, 2 Ocak 2027"     (iki yıla yayılan)
 *  - "30-31 Aralık, 2 Ocak 2027"          (iki yıla yayılan, yıl sadece sonda)
 * Tarih içermeyen metinler ("Ertelendi", boş vb.) için null döner.
 */
function parseIpoDates(dateText: string) {
    const empty = { start: null as string | null, end: null as string | null, timestamp: 0, dates: [] as string[] };
    if (!dateText) return empty;

    const segments = dateText
        .toLocaleLowerCase('tr-TR')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

    type Seg = { days: number[]; month: number; year: number | null };
    const parsed: Seg[] = [];

    for (const seg of segments) {
        const m = seg.match(/^([\d\s\-–]+)\s+([a-zçğıöşü]+)(?:\s+(\d{4}))?$/i);
        if (!m) return empty;
        const month = TURKISH_MONTH_MAP[m[2]];
        if (!month) return empty;
        const days = m[1]
            .split(/[\-–\s]+/)
            .map(d => parseInt(d, 10))
            .filter(d => !isNaN(d) && d >= 1 && d <= 31);
        if (days.length === 0) return empty;
        parsed.push({ days, month, year: m[3] ? parseInt(m[3], 10) : null });
    }
    if (parsed.length === 0) return empty;

    // Yılı olmayan segmentler yılı sağdaki segmentten devralır;
    // ay geriye doğru büyüyorsa (Aralık → Ocak) bir önceki yıla aittir.
    for (let i = parsed.length - 1; i >= 0; i--) {
        if (parsed[i].year !== null) continue;
        const next = parsed[i + 1];
        if (!next || next.year === null) return empty;
        parsed[i].year = parsed[i].month > next.month ? next.year - 1 : next.year;
    }

    const dates: string[] = [];
    for (const seg of parsed) {
        for (const d of seg.days) {
            dates.push(`${seg.year}-${pad(seg.month)}-${pad(d)}`);
        }
    }
    const unique = Array.from(new Set(dates)).sort();
    const start = unique[0];
    const end = unique[unique.length - 1];
    const [y, mo, d] = start.split('-').map(Number);

    return {
        start,
        end,
        timestamp: new Date(y, mo - 1, d).getTime(),
        dates: unique
    };
}

/** İstanbul saatine göre bugünün tarihi (YYYY-MM-DD) */
function getIstanbulTodayIso(): string {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
}

function getPhase(start: string | null, end: string | null, todayIso: string): IpoPhase {
    if (!start || !end) return null;
    if (todayIso < start) return 'upcoming';
    if (todayIso > end) return 'completed';
    return 'active';
}

function getStatusLabel(badge: string, phase: IpoPhase): string {
    // halkarz.com'un kendi rozeti (Ertelendi, Başvuru Sürecinde, İptal vb.) varsa onu kullan
    if (badge) return badge;
    if (phase === 'active') return 'Talep Toplanıyor';
    if (phase === 'upcoming') return 'Talep Toplama Yaklaşıyor';
    if (phase === 'completed') return 'Talep Toplama Tamamlandı';
    return 'Taslak';
}

export async function GET() {
    try {
        const response = await fetch("https://halkarz.com/", {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "halkarz.com ana sayfasına ulaşılamadı." }, { status: 500 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const items: HalkarzIpoItem[] = [];
        const todayIso = getIstanbulTodayIso();

        $('article.index-list').each((idx, el) => {
            const symbol = $(el).find('.il-bist-kod').text().replace(/\s+/g, ' ').trim();
            const companyName = $(el).find('.il-halka-arz-sirket a').text().trim();
            const link = $(el).find('.il-halka-arz-sirket a').attr('href') || '';
            // Tek tarih kaynağı: halkarz.com'daki "Talep Toplama Tarihleri" alanı
            const dateRange = $(el).find('.il-halka-arz-tarihi time').text().trim();
            const badge = $(el).find('.il-badge').text().trim();

            if (symbol || companyName) {
                const dateInfo = parseIpoDates(dateRange);
                const phase = getPhase(dateInfo.start, dateInfo.end, todayIso);
                items.push({
                    id: idx + 1,
                    symbol,
                    companyName,
                    link,
                    dateRange: dateRange || 'Tarih Bekleniyor',
                    status: getStatusLabel(badge, phase),
                    startDate: dateInfo.start,
                    endDate: dateInfo.end,
                    dates: dateInfo.dates,
                    timestamp: dateInfo.timestamp,
                    phase
                });
            }
        });

        // Sıralama (yalnızca talep toplama tarihlerine göre):
        // 1) Şu an talep toplayanlar, 2) Yaklaşanlar (en yakın başlangıç önce),
        // 3) Tamamlananlar (en son biten önce), 4) Talep toplama tarihi olmayanlar
        const phaseRank = (p: IpoPhase) => (p === 'active' ? 0 : p === 'upcoming' ? 1 : p === 'completed' ? 2 : 3);
        items.sort((a, b) => {
            const ra = phaseRank(a.phase);
            const rb = phaseRank(b.phase);
            if (ra !== rb) return ra - rb;
            if (a.phase === 'completed') return (b.endDate || '').localeCompare(a.endDate || '');
            if (a.phase === 'active' || a.phase === 'upcoming') return (a.startDate || '').localeCompare(b.startDate || '');
            return 0; // tarihsizlerde halkarz.com sırası korunur
        });

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items,
            source: "https://halkarz.com/",
            updatedAt: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("HalkArz IPO Scraper Hatası:", error);
        return NextResponse.json({ success: false, error: error.message || "IPO verisi çekilemedi." }, { status: 500 });
    }
}
