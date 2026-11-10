import { ECONOMIC_CALENDAR_CATALOG, CatalogCalendarEvent } from './calendar-catalog';

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

interface TvIndicatorSpec {
    tvCountry: 'TR' | 'US' | 'EU' | 'GB';
    tvTitles: string[];
    formatType: 'percent' | 'k' | 'm' | 'b_usd' | 'plain';
    occurrenceIndex?: number; // For weekly series within the month (0, 1, 2)
}

const CATALOG_TO_TV_MAP: Record<string, TvIndicatorSpec> = {
    // TR
    tr_trade_balance_1: { tvCountry: 'TR', tvTitles: ['Balance of Trade Prel', 'Balance of Trade Final'], formatType: 'b_usd' },
    tr_cpi_mom_1: { tvCountry: 'TR', tvTitles: ['Inflation Rate MoM'], formatType: 'percent' },
    tr_cpi_yoy_1: { tvCountry: 'TR', tvTitles: ['Inflation Rate YoY'], formatType: 'percent' },
    tr_ppi_mom_1: { tvCountry: 'TR', tvTitles: ['PPI MoM'], formatType: 'percent' },
    tr_ind_prod_1: { tvCountry: 'TR', tvTitles: ['Industrial Production MoM', 'Industrial Production YoY'], formatType: 'percent' },
    tr_unemp_1: { tvCountry: 'TR', tvTitles: ['Unemployment Rate'], formatType: 'percent' },
    tr_tcmb_rate_2: { tvCountry: 'TR', tvTitles: ['TCMB Interest Rate Decision'], formatType: 'percent' },

    // US / ABD
    us_ism_pmi_1: { tvCountry: 'US', tvTitles: ['ISM Manufacturing PMI'], formatType: 'plain' },
    us_ism_prices_1: { tvCountry: 'US', tvTitles: ['ISM Manufacturing Prices'], formatType: 'plain' },
    us_construction_1: { tvCountry: 'US', tvTitles: ['Construction Spending MoM'], formatType: 'percent' },
    us_factory_orders_1: { tvCountry: 'US', tvTitles: ['Factory Orders MoM'], formatType: 'percent' },
    us_services_pmi_1: { tvCountry: 'US', tvTitles: ['S&P Global Services PMI Final', 'S&P Global Services PMI Flash'], formatType: 'plain' },
    us_ism_services_1: { tvCountry: 'US', tvTitles: ['ISM Services PMI'], formatType: 'plain' },
    us_crude_oil_1: { tvCountry: 'US', tvTitles: ['EIA Crude Oil Stocks Change'], formatType: 'm', occurrenceIndex: 0 },
    us_crude_oil_2: { tvCountry: 'US', tvTitles: ['EIA Crude Oil Stocks Change'], formatType: 'm', occurrenceIndex: 1 },
    us_jobless_claims_1: { tvCountry: 'US', tvTitles: ['Initial Jobless Claims'], formatType: 'k', occurrenceIndex: 0 },
    us_jobless_claims_2: { tvCountry: 'US', tvTitles: ['Initial Jobless Claims'], formatType: 'k', occurrenceIndex: 1 },
    us_jobless_claims_3: { tvCountry: 'US', tvTitles: ['Initial Jobless Claims'], formatType: 'k', occurrenceIndex: 2 },
    us_nfp_1: { tvCountry: 'US', tvTitles: ['Non Farm Payrolls'], formatType: 'k' },
    us_unemp_1: { tvCountry: 'US', tvTitles: ['Unemployment Rate'], formatType: 'percent' },
    us_hourly_earnings_1: { tvCountry: 'US', tvTitles: ['Average Hourly Earnings MoM'], formatType: 'percent' },
    us_michigan_2: { tvCountry: 'US', tvTitles: ['Michigan Consumer Sentiment Prel', 'Michigan Consumer Sentiment Final'], formatType: 'plain' },
    us_cpi_mom_2: { tvCountry: 'US', tvTitles: ['Inflation Rate MoM'], formatType: 'percent' },
    us_cpi_yoy_2: { tvCountry: 'US', tvTitles: ['Inflation Rate YoY'], formatType: 'percent' },
    us_ppi_mom_2: { tvCountry: 'US', tvTitles: ['PPI MoM'], formatType: 'percent' },
    us_retail_sales_2: { tvCountry: 'US', tvTitles: ['Retail Sales MoM'], formatType: 'percent' },
    us_building_permits_3: { tvCountry: 'US', tvTitles: ['Building Permits Prel'], formatType: 'm' },
    us_fed_rate_3: { tvCountry: 'US', tvTitles: ['Interest Rate', 'Fed Interest Rate Decision'], formatType: 'percent' },

    // EU
    eu_manufacturing_pmi_1: { tvCountry: 'EU', tvTitles: ['S&P Global Manufacturing PMI Final', 'HCOB Manufacturing PMI Final'], formatType: 'plain' },
    eu_ppi_mom_1: { tvCountry: 'EU', tvTitles: ['PPI MoM'], formatType: 'percent' },
    eu_gdp_qoq_2: { tvCountry: 'EU', tvTitles: ['GDP Growth Rate QoQ 2nd Est', 'GDP Growth Rate QoQ Flash', 'GDP Growth Rate QoQ Final'], formatType: 'percent' },
    eu_consumer_conf_3: { tvCountry: 'EU', tvTitles: ['Consumer Confidence Flash', 'Consumer Confidence Final'], formatType: 'plain' },

    // UK
    uk_manufacturing_pmi_1: { tvCountry: 'GB', tvTitles: ['S&P Global Manufacturing PMI Final'], formatType: 'plain' },
    uk_boe_rate_1: { tvCountry: 'GB', tvTitles: ['Interest Rate', 'BoE Interest Rate Decision'], formatType: 'percent' }
};

function formatTvNumber(val: any, formatType: TvIndicatorSpec['formatType']): string | null {
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    if (isNaN(num)) return String(val);

    if (formatType === 'percent') {
        const absStr = Math.abs(num).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
        return num < 0 ? `-%${absStr}` : `%${absStr}`;
    }
    if (formatType === 'k') {
        const str = num.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
        return `${str}K`;
    }
    if (formatType === 'm') {
        const str = num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
        return `${str} M`;
    }
    if (formatType === 'b_usd') {
        const str = num.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
        return `${str} B $`;
    }
    return num.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

// Strictly verify if event date/time has passed in TSİ (Europe/Istanbul UTC+3)
function isEventTimePassed(dateFormatted: string, time: string): boolean {
    try {
        const now = new Date();
        const [dayStr, monthStr, yearStr] = dateFormatted.split('.').map(Number);
        const [hourStr, minStr] = time.split(':').map(Number);

        // TSİ (UTC+3) conversion to UTC timestamp
        const eventUtc = new Date(Date.UTC(yearStr, monthStr - 1, dayStr, hourStr - 3, minStr));

        return now.getTime() >= eventUtc.getTime();
    } catch {
        return false;
    }
}

let realEventsMemoryCache: CatalogCalendarEvent[] = [];

/**
 * Kataloğu mevcut gerçek tarihlerle ve saat kontrolüyle döndürür
 */
export function getDynamicCalendarCatalog(): CatalogCalendarEvent[] {
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

    const sourceList = realEventsMemoryCache.length > 0 ? realEventsMemoryCache : ECONOMIC_CALENDAR_CATALOG;

    return sourceList.map(item => {
        const hasTimePassed = isEventTimePassed(item.dateFormatted, item.time);
        const isToday = item.dateFormatted === todayFormatted;
        const isTomorrow = item.dateFormatted === tomorrowFormatted;

        return {
            ...item,
            isToday,
            isTomorrow,
            actual: hasTimePassed ? item.actual : 'Bekleniyor'
        };
    });
}

/**
 * TradingView Ekonomik Takvim API'sinden (veri_botu kaynağı) 30 göstergenin
 * gerçek tarihlerini, saatlerini ve gerçek açıklanan/beklenti/önceki verilerini çeker.
 */
export async function scrapeEconomicCalendar(): Promise<CatalogCalendarEvent[]> {
    const now = new Date();
    const todayFormatted = now.toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowFormatted = tomorrowDate.toLocaleDateString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    try {
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth(); // 0-indexed
        const fromDate = new Date(Date.UTC(year, month, 1, 0, 0, 0));
        const toDate = new Date(Date.UTC(year, month + 2, 0, 23, 59, 59));

        const params = new URLSearchParams({
            from: fromDate.toISOString(),
            to: toDate.toISOString(),
            countries: 'TR,US,EU,GB'
        });

        const response = await fetch(`https://economic-calendar.tradingview.com/events?${params.toString()}`, {
            headers: {
                'Origin': 'https://www.tradingview.com',
                'Referer': 'https://www.tradingview.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
                'Accept': 'application/json'
            },
            cache: 'no-store'
        });

        if (response.ok) {
            const rawJson = await response.json();
            const tvEvents: any[] = Array.isArray(rawJson?.result) ? rawJson.result : (Array.isArray(rawJson) ? rawJson : []);

            if (tvEvents.length > 0) {
                const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

                const enriched = ECONOMIC_CALENDAR_CATALOG.map(catItem => {
                    const spec = CATALOG_TO_TV_MAP[catItem.id];
                    if (!spec) {
                        const hasTimePassed = isEventTimePassed(catItem.dateFormatted, catItem.time);
                        return {
                            ...catItem,
                            isToday: catItem.dateFormatted === todayFormatted,
                            isTomorrow: catItem.dateFormatted === tomorrowFormatted,
                            actual: hasTimePassed ? catItem.actual : 'Bekleniyor'
                        };
                    }

                    // Find matching events in TradingView feed
                    const matches = tvEvents
                        .filter(e => e.country === spec.tvCountry && spec.tvTitles.includes(e.title) && e.date)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    if (matches.length === 0) {
                        const hasTimePassed = isEventTimePassed(catItem.dateFormatted, catItem.time);
                        return {
                            ...catItem,
                            isToday: catItem.dateFormatted === todayFormatted,
                            isTomorrow: catItem.dateFormatted === tomorrowFormatted,
                            actual: hasTimePassed ? catItem.actual : 'Bekleniyor'
                        };
                    }

                    // Prefer events in the current month first, or next month if none in current month
                    const currentMonthMatches = matches.filter(m => String(m.date).startsWith(currentMonthPrefix));
                    let chosen: any = null;

                    if (spec.occurrenceIndex !== undefined) {
                        const pool = currentMonthMatches.length > spec.occurrenceIndex ? currentMonthMatches : matches;
                        chosen = pool[Math.min(spec.occurrenceIndex, pool.length - 1)];
                    } else {
                        chosen = currentMonthMatches.length > 0 ? currentMonthMatches[0] : matches[0];
                    }

                    if (!chosen) {
                        const hasTimePassed = isEventTimePassed(catItem.dateFormatted, catItem.time);
                        return {
                            ...catItem,
                            isToday: catItem.dateFormatted === todayFormatted,
                            isTomorrow: catItem.dateFormatted === tomorrowFormatted,
                            actual: hasTimePassed ? catItem.actual : 'Bekleniyor'
                        };
                    }

                    const dt = new Date(chosen.date);
                    const dateFormatted = dt.toLocaleDateString('tr-TR', {
                        timeZone: 'Europe/Istanbul',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    const time = dt.toLocaleTimeString('tr-TR', {
                        timeZone: 'Europe/Istanbul',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const istanbulDateStr = dt.toLocaleDateString('en-CA', { timeZone: 'Europe/Istanbul' });
                    const [iy, im, id] = istanbulDateStr.split('-').map(Number);
                    const localDayObj = new Date(iy, im - 1, id);
                    const dateDayName = DAY_NAMES[localDayObj.getDay()] || catItem.dateDayName;

                    const liveActual = formatTvNumber(chosen.actual, spec.formatType);
                    const liveForecast = formatTvNumber(chosen.forecast, spec.formatType);
                    const livePrevious = formatTvNumber(chosen.previous, spec.formatType);

                    const hasTimePassed = isEventTimePassed(dateFormatted, time);
                    let resolvedActual = 'Bekleniyor';
                    if (hasTimePassed) {
                        if (liveActual !== null) {
                            resolvedActual = liveActual;
                        } else if (catItem.actual && catItem.actual !== 'Bekleniyor') {
                            resolvedActual = catItem.actual;
                        } else if (liveForecast !== null) {
                            resolvedActual = liveForecast;
                        }
                    }

                    return {
                        ...catItem,
                        dateFormatted,
                        dateDayName,
                        time,
                        forecast: liveForecast ?? catItem.forecast,
                        previous: livePrevious ?? catItem.previous,
                        actual: resolvedActual,
                        isToday: dateFormatted === todayFormatted,
                        isTomorrow: dateFormatted === tomorrowFormatted
                    };
                });

                // Kronolojik sıralama (En erken tarihten en geç tarihe)
                enriched.sort((a, b) => {
                    const isoA = a.dateFormatted.split('.').reverse().join('-');
                    const isoB = b.dateFormatted.split('.').reverse().join('-');
                    if (isoA !== isoB) return isoA.localeCompare(isoB);
                    return a.time.localeCompare(b.time);
                });

                realEventsMemoryCache = enriched;
                return enriched;
            }
        }
    } catch (error) {
        console.warn("[CALENDAR SCRAPER WARNING] TradingView live fetch error, using catalog baseline:", error);
    }

    return getDynamicCalendarCatalog();
}
