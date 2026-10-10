import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export interface HalkarzIpoItem {
    id: number;
    symbol: string;
    companyName: string;
    link: string;
    status: string;
    dateRange: string;
    startDate?: string | null;
    endDate?: string | null;
    dates?: string[];
    timestamp: number;
}

const TURKISH_MONTH_MAP: Record<string, number> = {
    'ocak': 1, 'şubat': 2, 'mart': 3, 'nisan': 4, 'mayıs': 5, 'haziran': 6,
    'temmuz': 7, 'ağustos': 8, 'eylül': 9, 'ekim': 10, 'kasım': 11, 'aralık': 12
};

function parseIpoDates(dateText: string) {
    if (!dateText) return { start: null, end: null, timestamp: 0, dates: [] as string[] };
    const clean = dateText.trim().toLowerCase();
    const match = clean.match(/([\d\-]+)\s+([a-zçğıöşü]+)\s+(\d{4})/i);
    if (!match) return { start: null, end: null, timestamp: 0, dates: [] as string[] };

    const dayPart = match[1];
    const monthName = match[2];
    const year = parseInt(match[3], 10);
    const month = TURKISH_MONTH_MAP[monthName];
    if (!month) return { start: null, end: null, timestamp: 0, dates: [] as string[] };

    const days = dayPart.split('-').map(d => parseInt(d.trim(), 10)).filter(d => !isNaN(d) && d > 0 && d <= 31);
    if (days.length === 0) return { start: null, end: null, timestamp: 0, dates: [] as string[] };

    const firstDay = Math.min(...days);
    const lastDay = Math.max(...days);

    const pad = (n: number) => String(n).padStart(2, '0');
    const startStr = `${year}-${pad(month)}-${pad(firstDay)}`;
    const endStr = `${year}-${pad(month)}-${pad(lastDay)}`;
    const timestamp = new Date(year, month - 1, firstDay).getTime();

    return {
        start: startStr,
        end: endStr,
        timestamp,
        dates: days.map(d => `${year}-${pad(month)}-${pad(d)}`)
    };
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

        $('article.index-list').each((idx, el) => {
            const symbol = $(el).find('.il-bist-kod').text().replace(/\s+/g, ' ').trim();
            const companyName = $(el).find('.il-halka-arz-sirket a').text().trim();
            const link = $(el).find('.il-halka-arz-sirket a').attr('href') || '';
            const dateRange = $(el).find('.il-halka-arz-tarihi time').text().trim();
            const badge = $(el).find('.il-badge').text().trim();

            if (symbol || companyName) {
                const dateInfo = parseIpoDates(dateRange);
                items.push({
                    id: idx + 1,
                    symbol,
                    companyName,
                    link,
                    dateRange: dateRange || 'Tarih Bekleniyor',
                    status: badge ? badge : (dateInfo.start ? 'Talep Toplama' : 'Taslak'),
                    startDate: dateInfo.start,
                    endDate: dateInfo.end,
                    dates: dateInfo.dates,
                    timestamp: dateInfo.timestamp
                });
            }
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
