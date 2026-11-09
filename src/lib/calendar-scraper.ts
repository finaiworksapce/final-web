import * as cheerio from 'cheerio';
import { CatalogCalendarEvent } from './calendar-catalog';

const MONTH_MAP: Record<string, string> = {
    'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04', 'mayıs': '05', 'haziran': '06',
    'temmuz': '07', 'ağustos': '08', 'eylül': '09', 'ekim': '10', 'kasım': '11', 'aralık': '12'
};

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

const COUNTRY_MAP: Record<string, { country: 'TR' | 'ABD' | 'EU' | 'UK'; flag: string }> = {
    'türkiye': { country: 'TR', flag: '🇹🇷' },
    'turkiye': { country: 'TR', flag: '🇹🇷' },
    'tr': { country: 'TR', flag: '🇹🇷' },
    'abd': { country: 'ABD', flag: '🇺🇸' },
    'amerika': { country: 'ABD', flag: '🇺🇸' },
    'us': { country: 'ABD', flag: '🇺🇸' },
    'usd': { country: 'ABD', flag: '🇺🇸' },
    'euro bölgesi': { country: 'EU', flag: '🇪🇺' },
    'euro bolgesi': { country: 'EU', flag: '🇪🇺' },
    'ab': { country: 'EU', flag: '🇪🇺' },
    'eu': { country: 'EU', flag: '🇪🇺' },
    'eur': { country: 'EU', flag: '🇪🇺' },
    'almanya': { country: 'EU', flag: '🇩🇪' },
    'fransa': { country: 'EU', flag: '🇫🇷' },
    'ingiltere': { country: 'UK', flag: '🇬🇧' },
    'birleşik krallık': { country: 'UK', flag: '🇬🇧' },
    'birlesik krallik': { country: 'UK', flag: '🇬🇧' },
    'uk': { country: 'UK', flag: '🇬🇧' },
    'gb': { country: 'UK', flag: '🇬🇧' },
    'gbp': { country: 'UK', flag: '🇬🇧' }
};

// Memory cache of real live events
let realEventsMemoryCache: CatalogCalendarEvent[] = [];

/**
 * Returns dynamic calendar events with real dates and data
 */
export function getDynamicCalendarCatalog(): CatalogCalendarEvent[] {
    if (realEventsMemoryCache.length > 0) {
        return realEventsMemoryCache;
    }
    return [];
}

/**
 * Scrapes real economic calendar events from designated live endpoints
 * (doviz.com live macro feed + FairEconomy live global feed)
 */
export async function scrapeEconomicCalendar(): Promise<CatalogCalendarEvent[]> {
    const todayFormatted = new Date().toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowFormatted = tomorrowDate.toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const events: CatalogCalendarEvent[] = [];
    const seen = new Set<string>();

    // 1. Fetch Primary Live Turkish Macro Feed (doviz.com)
    try {
        const response = await fetch('https://doviz.com/ekonomik-takvim', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            cache: 'no-store'
        });

        if (response.ok) {
            const html = await response.text();
            const $ = cheerio.load(html);

            $('div.table.main-table.calendar-table').each((_, div) => {
                const rawDateHeader = $(div).prev().text().trim();
                const m = rawDateHeader.match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})/i);
                if (!m) return;
                const day = m[1].padStart(2, '0');
                const month = MONTH_MAP[m[2].toLowerCase()];
                const year = m[3];
                if (!month) return;
                const dateFormatted = `${day}.${month}.${year}`;

                // Calculate Turkish day name
                const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                const dateDayName = !isNaN(dateObj.getTime()) ? DAY_NAMES[dateObj.getDay()] : '';

                $(div).find('tbody tr').each((_, tr) => {
                    const tds = $(tr).find('td');
                    if (tds.length < 4) return;

                    const time = $(tds[0]).text().trim();
                    const rawCountry = $(tds[1]).text().trim();
                    const countryKey = rawCountry.toLowerCase();
                    const mapped = COUNTRY_MAP[countryKey];
                    if (!mapped) return;

                    const importanceEl = $(tds[2]).find('.importance');
                    const importanceTitle = importanceEl.attr('title') || '';
                    let impact: 'low' | 'medium' | 'high' | 'critical' = 'low';
                    if (importanceTitle.includes('Yüksek') || importanceEl.hasClass('high')) {
                        impact = 'high';
                    } else if (importanceTitle.includes('Orta') || importanceEl.hasClass('medium')) {
                        impact = 'medium';
                    }

                    const rawEvent = $(tds[3]).text().trim();
                    const cleanEvent = rawEvent.replace(/\s*\([+-]?\)\s*$/, '').replace(/\s+/g, ' ').trim();
                    if (!cleanEvent) return;

                    const actualRaw = $(tds[4]).text().trim();
                    const forecastRaw = $(tds[5]).text().trim();
                    const previousRaw = $(tds[6]).text().trim();

                    const key = `${mapped.country}_${dateFormatted}_${time}_${cleanEvent}`;
                    if (seen.has(key)) return;
                    seen.add(key);

                    // Strictly real values: No synthetic "+0.1" or fabricated mock calculation
                    const actual = actualRaw && actualRaw !== '-' ? actualRaw : 'Bekleniyor';
                    const forecast = forecastRaw && forecastRaw !== '-' ? forecastRaw : '-';
                    const previous = previousRaw && previousRaw !== '-' ? previousRaw : '-';

                    const id = `eco_${mapped.country.toLowerCase()}_${dateFormatted.replace(/\./g, '')}_${time.replace(':', '')}_${cleanEvent.slice(0, 12).replace(/[^a-zA-Z0-9]/g, '')}`;

                    events.push({
                        id,
                        dateFormatted,
                        dateDayName,
                        time,
                        country: mapped.country,
                        flag: mapped.flag,
                        event: cleanEvent,
                        forecast,
                        previous,
                        actual,
                        impact: (impact === 'low' ? 'medium' : impact) as 'medium' | 'high' | 'critical',
                        isToday: dateFormatted === todayFormatted,
                        isTomorrow: dateFormatted === tomorrowFormatted,
                        weekOffset: 0
                    });
                });
            });
        }
    } catch (dovizError) {
        console.warn("[CALENDAR SCRAPER WARNING] doviz.com live fetch error:", dovizError);
    }

    // 2. Fetch Secondary Live Feed (FairEconomy / ForexFactory) if accessible
    try {
        const ffRes = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (ffRes.ok) {
            const ffData = await ffRes.json();
            if (Array.isArray(ffData)) {
                ffData.forEach((item: any) => {
                    if (!item.title || !item.date) return;
                    const dateObj = new Date(item.date);
                    if (isNaN(dateObj.getTime())) return;

                    const dateFormatted = dateObj.toLocaleDateString('tr-TR', {
                        timeZone: 'Europe/Istanbul',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    const time = dateObj.toLocaleTimeString('tr-TR', {
                        timeZone: 'Europe/Istanbul',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const dateDayName = DAY_NAMES[dateObj.getDay()] || '';

                    const c = (item.country || '').toUpperCase();
                    let mappedCountry: 'TR' | 'ABD' | 'EU' | 'UK' | null = null;
                    let flag = '🌐';
                    if (c === 'USD') { mappedCountry = 'ABD'; flag = '🇺🇸'; }
                    else if (c === 'EUR') { mappedCountry = 'EU'; flag = '🇪🇺'; }
                    else if (c === 'GBP') { mappedCountry = 'UK'; flag = '🇬🇧'; }
                    else if (c === 'TRY') { mappedCountry = 'TR'; flag = '🇹🇷'; }
                    if (!mappedCountry) return;

                    const key = `${mappedCountry}_${dateFormatted}_${time}_${item.title.trim()}`;
                    if (seen.has(key)) return;
                    seen.add(key);

                    let impact: 'low' | 'medium' | 'high' | 'critical' = 'low';
                    const imp = (item.impact || '').toLowerCase();
                    if (imp === 'high') impact = 'high';
                    else if (imp === 'medium') impact = 'medium';

                    events.push({
                        id: `ff_${mappedCountry.toLowerCase()}_${dateFormatted.replace(/\./g, '')}_${time.replace(':', '')}_${item.title.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`,
                        dateFormatted,
                        dateDayName,
                        time,
                        country: mappedCountry,
                        flag,
                        event: item.title.trim(),
                        forecast: item.forecast || '-',
                        previous: item.previous || '-',
                        actual: item.actual && item.actual !== '-' ? item.actual : 'Bekleniyor',
                        impact: (impact === 'low' ? 'medium' : impact) as 'medium' | 'high' | 'critical',
                        isToday: dateFormatted === todayFormatted,
                        isTomorrow: dateFormatted === tomorrowFormatted,
                        weekOffset: 0
                    });
                });
            }
        }
    } catch {}

    // Sort chronologically (earliest to latest)
    events.sort((a, b) => {
        const partsA = a.dateFormatted.split('.').reverse().join('-');
        const partsB = b.dateFormatted.split('.').reverse().join('-');
        if (partsA !== partsB) return partsA.localeCompare(partsB);
        return a.time.localeCompare(b.time);
    });

    if (events.length > 0) {
        realEventsMemoryCache = events;
    }

    return events;
}
