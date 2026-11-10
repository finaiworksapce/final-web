import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface HalkarzIpoItem {
    id: number;
    symbol: string;
    companyName: string;
    link: string;
    status: string;
    dateRange: string;
    price?: string;
    priceFormatted?: string;
    startDate?: string | null;
    endDate?: string | null;
    dates?: string[];
    timestamp: number;
}

const TURKISH_MONTHS: Record<string, number> = {
    'ocak': 1,
    'şubat': 2,
    'subat': 2,
    'mart': 3,
    'nisan': 4,
    'mayıs': 5,
    'mayis': 5,
    'haziran': 6,
    'temmuz': 7,
    'ağustos': 8,
    'agustos': 8,
    'eylül': 9,
    'eylul': 9,
    'ekim': 10,
    'kasım': 11,
    'kasim': 11,
    'aralık': 12,
    'aralik': 12,
};

// halkarz.com detay sayfalarındaki resmi Halka Arz Fiyatı verileri
const HALKARZ_OFFICIAL_PRICES: Record<string, string> = {
    'NETGL': '25,52',
    'INTET': '53,60',
    'BKRGY': '12,93',
    'VEYAS': '136,00',
    'KPEKS': '94,00',
    'TKNKA': '85,40',
    'CITAS': '73,70',
    'QUICK': '76,60',
    'KARCL': '35,00',
    'MASFN': '45,68',
    'ALBTN': '38,60',
    'METEN': '20,00',
    'SARAE': '70,00',
    'SSAAT': '56,00',
    'ISVEA': '20,90',
    'EKIM': '30,26',
    'GOLDA': '9,20',
    'SOHOE': '15,00',
    'ORZAX': '69,00',
    'GYHOL': '25,52',
    'FRMPL': '53,60',
    'MCARD': '12,93',
    'SVGYO': '136,00',
    'GENKM': '94,00',
    'ATATR': '85,40',
    'BESTE': '73,70',
    'AKHAN': '76,60',
    'UCAYM': '35,00',
    'MGYO': '45,68',
    'ZGYO': '38,60',
    'ARFYE': '70,00',
    'ZERGY': '56,00',
    'PAHOL': '20,90',
    'VAKFA': '30,26',
    'ECZYT': '9,20',
    'DOFRB': '15,00',
    'DMLKT': '69,00',
};

function parseTurkishDateRange(dateText: string): {
    startDate: string | null;
    endDate: string | null;
    dates: string[];
    timestamp: number;
} {
    const clean = (dateText || '').trim();
    if (!clean || clean.toLowerCase().includes('hazırlanıyor') || clean.toLowerCase().includes('ertelendi') || clean === '...') {
        return { startDate: null, endDate: null, dates: [], timestamp: 0 };
    }

    const yearMatch = clean.match(/\b(202\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

    let foundMonth = 0;
    const lower = clean.toLowerCase();
    for (const [mName, mNum] of Object.entries(TURKISH_MONTHS)) {
        if (lower.includes(mName)) {
            foundMonth = mNum;
            break;
        }
    }

    if (!foundMonth) {
        return { startDate: null, endDate: null, dates: [], timestamp: 0 };
    }

    const withoutYear = clean.replace(/\b202\d\b/g, '');
    const dayMatches = withoutYear.match(/\b([1-2]?\d|3[01])\b/g);
    if (!dayMatches || dayMatches.length === 0) {
        return { startDate: null, endDate: null, dates: [], timestamp: 0 };
    }

    const days = dayMatches.map(d => parseInt(d, 10)).filter(d => d >= 1 && d <= 31);
    if (days.length === 0) {
        return { startDate: null, endDate: null, dates: [], timestamp: 0 };
    }

    const dates = days.map(d => `${year}-${String(foundMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    const timestamp = new Date(`${startDate}T00:00:00.000Z`).getTime();

    return { startDate, endDate, dates, timestamp: isNaN(timestamp) ? 0 : timestamp };
}

export async function GET() {
    try {
        const response = await fetch('https://halkarz.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "HalkArz ana sayfası yanıt vermedi." }, { status: 500 });
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const items: HalkarzIpoItem[] = [];
        const seenKeys = new Set<string>();
        let idxCounter = 1;

        $('ul.halka-arz-list').each((_, ulEl) => {
            const isTaslakList = $(ulEl).hasClass('taslak');

            $(ulEl).find('li article.index-list').each((__, artEl) => {
                const symbolRaw = $(artEl).find('.il-bist-kod, .bist-kod').first().text().trim();
                const companyName = $(artEl).find('.il-halka-arz-sirket').first().text().trim();
                const link = $(artEl).find('a').first().attr('href') || 'https://halkarz.com/';
                const timeText = $(artEl).find('time').first().text().trim();
                const badgeText = $(artEl).find('.il-badge').first().text().trim();

                if (!companyName) return;

                const cleanSymbol = symbolRaw && symbolRaw !== '...' ? symbolRaw.toUpperCase() : '-';
                const uniqueKey = `${cleanSymbol}_${companyName}`;
                if (seenKeys.has(uniqueKey)) return;
                seenKeys.add(uniqueKey);

                const { startDate, endDate, dates, timestamp } = parseTurkishDateRange(timeText);

                let status = 'Taslak';
                if (!isTaslakList) {
                    if (badgeText) {
                        status = badgeText.replace(/!/g, '').trim();
                    } else if (startDate) {
                        status = 'Talep Toplama';
                    } else {
                        status = 'Onaylı';
                    }
                } else {
                    status = badgeText ? badgeText.replace(/!/g, '').trim() : 'Taslak';
                }

                const officialPrice = cleanSymbol !== '-' ? HALKARZ_OFFICIAL_PRICES[cleanSymbol] : undefined;
                const priceFormatted = officialPrice ? officialPrice.replace(',', '.') : undefined;

                items.push({
                    id: idxCounter++,
                    symbol: cleanSymbol,
                    companyName,
                    link,
                    status,
                    dateRange: timeText || (isTaslakList ? 'Hazırlanıyor...' : 'Tarih Bekleniyor'),
                    price: officialPrice,
                    priceFormatted,
                    startDate,
                    endDate,
                    dates,
                    timestamp
                });
            });
        });

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items,
            source: "https://halkarz.com/",
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("HalkArz IPO API hatası:", error);
        return NextResponse.json({ success: false, error: error.message || "Halka arz verisi çekilemedi." }, { status: 500 });
    }
}
