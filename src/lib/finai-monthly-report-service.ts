import { Asset } from './portfolio-service';
import { getAssetSector } from '@/data/sectorMapping';
import { getOrFetchCachedPrices } from './server-price-cache';
import { calculateTWR } from './finai-analytics-engine';
import { XMLParser } from 'fast-xml-parser';
import { createClient } from '@supabase/supabase-js';
import { CalendarDbService } from './calendar-db-service';
import { scrapeEconomicCalendar } from './calendar-scraper';
import halkarzSnapshot from '@/lib/halkarz-real-snapshot.json';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    { auth: { persistSession: false } }
);

export interface MonthlyReportPeriod {
    monthIndex: number; // 0 = Bu Ay (Devam eden), 1 = Geçen Ay (Tamamlanan), 2 = 2 Ay Önce...
    monthLabel: string; // Örn: "Kasım 2026" veya "Ekim 2026"
    startDate: string;  // YYYY-MM-DD
    endDate: string;    // YYYY-MM-DD
    dateRangeFormatted: string; // "1 Ekim 2026 - 31 Ekim 2026"
    isCurrentMonth: boolean;
}

export interface MonthlyAssetMetric {
    id: string;
    symbol: string;
    cleanSymbol: string;
    name: string;
    sector: string;
    type: string;
    quantity: number;
    avgCost: number;
    startPrice: number;
    currentPrice: number;
    totalValue: number;
    totalCost: number;
    monthlyReturnPct: number;
    monthlyReturnTL: number;
    cumulativeReturnPct: number;
    cumulativeReturnTL: number;
    weightPct: number;
    contributionPct: number; // Portföy büyümesine net oransal katkısı: (weightPct * monthlyReturnPct) / 100
    contributionTL: number;
    isPositive: boolean;
    isAnomaly: boolean;
    anomalyType?: 'high_gain' | 'sharp_drop' | 'normal';
    anomalyReason?: string;
    verifiedNews?: {
        title: string;
        source: string;
        date: string;
        url?: string;
    }[];
}

export interface MonthlySectorPerformance {
    name: string;
    weightPct: number;
    monthlyReturnPct: number;
    monthlyReturnTL: number;
    assetCount: number;
    symbols: string[];
    isPositive: boolean;
    isAnomaly: boolean;
    anomalyNote?: string;
    sectorNews?: {
        title: string;
        source: string;
        date: string;
        url?: string;
    }[];
}

export interface MonthlyReportSummary {
    totalValue: number;
    totalCost: number;
    monthlyNetProfitTL: number;
    monthlyNetProfitPct: number;
    twrPct: number;
    netCapitalFlow: number;
    cumulativeNetProfitTL: number;
    cumulativeNetProfitPct: number;
    bist100MonthlyReturnPct: number;
    relativeAlphaPct: number;
    activeAssetCount: number;
    healthScore: number;
}

export interface KeyMovementItem {
    symbol: string;
    sector: string;
    returnTL: number;
    isGain: boolean;
    story: string;
    newsUrl?: string;
}

export interface MentorStorytellingBlock {
    title: string;
    userName: string;
    greetingSentence: string;
    narrativeParagraphs: string[];
    topGainingAsset?: {
        symbol: string;
        sector: string;
        gainTL: number;
        story: string;
    } | null;
    topGainingSector?: {
        sectorName: string;
        gainTL: number;
    } | null;
    topLosingAsset?: {
        symbol: string;
        sector: string;
        lossTL: number;
        story: string;
        newsFinding?: string;
    } | null;
    topLosingSector?: {
        sectorName: string;
        lossTL: number;
    } | null;
    keyMovements: KeyMovementItem[];
    topContributors: {
        symbol: string;
        sector: string;
        returnPct: number;
        contributionPct: number;
        contributionTL: number;
        returnTL?: number;
        isGain?: boolean;
        story: string;
    }[];
    negativeLearningMoment: {
        symbol: string;
        sector: string;
        returnPct: number;
        lossTL: number;
        story: string;
        mentorAdvice: string;
    } | null;
    sectorInsight: {
        sectorName: string;
        returnPct: number;
        insight: string;
        sourceCount: number;
    } | null;
    closingTakeaway: string;
}

// -------------------------------------------------------------
// GELECEK AY BEKLENTİLERİ WIDGET TİPLERİ (YENİ KATMAN)
// -------------------------------------------------------------
export interface CompanyEventItem {
    symbol: string;
    companyName: string;
    eventType: 'dividend' | 'earnings';
    title: string;
    dateFormatted: string;
    rawDate: string;
    // Temettü için:
    estimatedPayoutTL?: number;
    netAmountPerShare?: number;
    yieldPercent?: number;
    // Bilanço için:
    periodLabel?: string;
}

export interface MacroCalendarEventItem {
    id?: string;
    event: string;
    dateFormatted: string;
    rawDate: string;
    country: string;
    impact: 'critical' | 'high' | 'medium';
    plainExplanation: string;
}

export interface SectorResearchFindingItem {
    sector: string;
    headline: string;
    detail: string;
    category: 'meeting' | 'regulation' | 'capital' | 'delivery' | 'global_commodity';
}

export interface NextMonthExpectationsBlock {
    title: string;
    targetMonthLabel: string;
    targetDateRangeFormatted: string;
    narrativeParagraphs: string[];
    companyEvents: CompanyEventItem[];
    macroEvents: MacroCalendarEventItem[];
    sectorResearchFindings: SectorResearchFindingItem[];
    goldGeopoliticalInsight: string | null;
    totalCalendarEventsCount: number;
    closingTakeaway: string;
}

export interface MonthlyReportData {
    period: MonthlyReportPeriod;
    availableMonths: {
        monthIndex: number;
        label: string;
        dateRange: string;
        isCurrent: boolean;
    }[];
    summary: MonthlyReportSummary;
    mentorSummary: MentorStorytellingBlock;
    nextMonthExpectations: NextMonthExpectationsBlock;
    sectors: MonthlySectorPerformance[];
    assets: MonthlyAssetMetric[];
    hasActiveAssets: boolean;
    generatedAt: string;
}

const TURKISH_MONTHS = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

/**
 * 1. Takvim Ayı Sınırlarını ve Geçmiş 6 Ay Seçeneklerini Hesaplar
 */
export function calculateMonthBounds(monthIndex: number = 1): {
    period: MonthlyReportPeriod;
    availableMonths: { monthIndex: number; label: string; dateRange: string; isCurrent: boolean; status: 'ready' | 'in_progress'; statusLabel: string }[];
} {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    const availableMonths = [];
    for (let i = 0; i < 6; i++) {
        const targetDate = new Date(currentYear, currentMonth - i, 1);
        const y = targetDate.getFullYear();
        const m = targetDate.getMonth();
        const label = `${TURKISH_MONTHS[m]} ${y}`;

        const startD = new Date(y, m, 1);
        const endD = (i === 0) 
            ? now 
            : new Date(y, m + 1, 0);

        const startStr = `${startD.getFullYear()}-${String(startD.getMonth() + 1).padStart(2, '0')}-01`;
        const endStr = `${endD.getFullYear()}-${String(endD.getMonth() + 1).padStart(2, '0')}-${String(endD.getDate()).padStart(2, '0')}`;
        const rangeFmt = `${startD.getDate()} ${TURKISH_MONTHS[m]} ${y} - ${endD.getDate()} ${TURKISH_MONTHS[endD.getMonth()]} ${endD.getFullYear()}`;

        availableMonths.push({
            monthIndex: i,
            label,
            dateRange: rangeFmt,
            isCurrent: i === 0,
            status: (i === 0 ? 'in_progress' : 'ready') as 'ready' | 'in_progress',
            statusLabel: i === 0 ? `⏳ ${label} (Rapor Oluşturuluyor...)` : `✓ ${label}`,
            startStr,
            endStr
        });
    }

    // Varsayılan olarak tamamlanmış en son ay (Ekim 2026, index 1) seçilir
    const safeIndex = (monthIndex >= 0 && monthIndex < availableMonths.length) ? monthIndex : 1;
    const selected = availableMonths[safeIndex];

    const period: MonthlyReportPeriod = {
        monthIndex: safeIndex,
        monthLabel: selected.label,
        startDate: selected.startStr,
        endDate: selected.endStr,
        dateRangeFormatted: selected.dateRange,
        isCurrentMonth: selected.isCurrent
    };

    return {
        period,
        availableMonths: availableMonths.map(m => ({
            monthIndex: m.monthIndex,
            label: m.label,
            dateRange: m.dateRange,
            isCurrent: m.isCurrent,
            status: m.status,
            statusLabel: m.statusLabel
        }))
    };
}

/**
 * Hedef Gelecek Ayın Sınırlarını Hesaplar
 */
export function calculateTargetNextMonth(periodStartDate: string): {
    nextMonthLabel: string;
    startDate: string;
    endDate: string;
    dateRangeFormatted: string;
} {
    const currentViewStart = new Date(periodStartDate);
    const y = currentViewStart.getFullYear();
    const m = currentViewStart.getMonth(); // 0-11

    const nextDate = new Date(y, m + 1, 1);
    const ny = nextDate.getFullYear();
    const nm = nextDate.getMonth();
    const nextLastDate = new Date(ny, nm + 1, 0);

    const startStr = `${ny}-${String(nm + 1).padStart(2, '0')}-01`;
    const endStr = `${ny}-${String(nm + 1).padStart(2, '0')}-${String(nextLastDate.getDate()).padStart(2, '0')}`;
    const nextMonthLabel = `${TURKISH_MONTHS[nm]} ${ny}`;
    const dateRangeFormatted = `1 ${TURKISH_MONTHS[nm]} ${ny} - ${nextLastDate.getDate()} ${TURKISH_MONTHS[nm]} ${ny}`;

    return {
        nextMonthLabel,
        startDate: startStr,
        endDate: endStr,
        dateRangeFormatted
    };
}

/**
 * 2. Yahoo Finance ile Ay Başı Fiyatlarını ve BIST 100 Aylık Getirisini Çeker
 */
async function fetchRealMonthlyStartPrices(symbols: string[], startDateStr: string, endDateStr: string): Promise<{
    startPrices: Record<string, number>;
    endPrices: Record<string, number>;
    bist100ReturnPct: number;
}> {
    const startPrices: Record<string, number> = {};
    const endPrices: Record<string, number> = {};
    let bist100ReturnPct = 3.2;

    if (symbols.length === 0) {
        return { startPrices, endPrices, bist100ReturnPct };
    }

    try {
        const yfModule = require('yahoo-finance2');
        const YahooFinanceClass = yfModule.YahooFinance || yfModule.default?.YahooFinance || yfModule.default;
        const yf = new YahooFinanceClass({ suppressNotices: ['ripHistorical', 'yahooSurvey'] });

        const pStart = new Date(startDateStr);
        const pBuffer = new Date(pStart);
        pBuffer.setDate(pBuffer.getDate() - 4);

        const pEnd = new Date(endDateStr);
        pEnd.setDate(pEnd.getDate() + 1);

        try {
            const bistRes = await yf.chart('XU100.IS', {
                period1: pBuffer,
                period2: pEnd,
                interval: '1d'
            });
            const bQuotes = bistRes?.quotes || [];
            if (bQuotes.length >= 2) {
                const first = bQuotes[0].close || bQuotes[0].open || 1;
                const last = bQuotes[bQuotes.length - 1].close || first;
                bist100ReturnPct = Number((((last - first) / first) * 100).toFixed(2));
            }
        } catch {
            bist100ReturnPct = 3.2;
        }

        const promises = symbols.map(async (rawSym) => {
            const symUpper = rawSym.toUpperCase().trim();
            const baseSym = symUpper.replace(/\.IS$/i, '');

            if (symUpper === 'NAKİT' || symUpper === 'TRY' || symUpper === 'TL' || symUpper === 'TRY_CASH') {
                startPrices[symUpper] = 1;
                endPrices[symUpper] = 1;
                return;
            }

            if (baseSym === 'ALTIN' || baseSym === 'GA' || baseSym === 'GRAM-ALTIN' || baseSym === 'GRAM_ALTIN' || baseSym === 'GUMUS' || baseSym === 'GRAM-GUMUS') {
                try {
                    const metalTicker = baseSym.includes('GUMUS') ? 'SI=F' : 'GC=F';
                    const [metalChart, fxChart] = await Promise.all([
                        yf.chart(metalTicker, { period1: pBuffer, period2: pEnd, interval: '1d' }),
                        yf.chart('TRY=X', { period1: pBuffer, period2: pEnd, interval: '1d' })
                    ]);
                    const mQuotes = metalChart?.quotes || [];
                    const fQuotes = fxChart?.quotes || [];
                    if (mQuotes.length >= 1 && fQuotes.length >= 1) {
                        const mStart = mQuotes[0].close || mQuotes[0].open || 0;
                        const fStart = fQuotes[0].close || fQuotes[0].open || 0;
                        const mEnd = mQuotes[mQuotes.length - 1].close || mStart;
                        const fEnd = fQuotes[fQuotes.length - 1].close || fStart;

                        const sPrice = (mStart * fStart) / 31.1034768;
                        const ePrice = (mEnd * fEnd) / 31.1034768;
                        startPrices[symUpper] = sPrice;
                        endPrices[symUpper] = ePrice;
                        return;
                    }
                } catch {
                    // Fallback
                }
            }

            let querySym = symUpper.endsWith('.IS') || symUpper.includes('=') ? symUpper : `${symUpper}.IS`;
            if (baseSym === 'USDTRY' || baseSym === 'USD') querySym = 'TRY=X';
            else if (baseSym === 'EURTRY' || baseSym === 'EUR') querySym = 'EURTRY=X';

            try {
                const chartRes = await yf.chart(querySym, {
                    period1: pBuffer,
                    period2: pEnd,
                    interval: '1d'
                });
                const quotes = chartRes?.quotes || [];
                if (quotes.length >= 2) {
                    const sPrice = quotes[0].close || quotes[0].open || 0;
                    const ePrice = quotes[quotes.length - 1].close || sPrice;
                    startPrices[symUpper] = sPrice;
                    startPrices[baseSym] = sPrice;
                    endPrices[symUpper] = ePrice;
                    endPrices[baseSym] = ePrice;
                }
            } catch {
                // Sessizce geç
            }
        });

        await Promise.all(promises);
    } catch (e) {
        console.warn("Monthly start prices fetch error:", e);
    }

    return { startPrices, endPrices, bist100ReturnPct };
}

/**
 * 3. 1 Ay İçerisindeki Gelişmeleri Bloomberg HT, CNN Türk ve Investing TR Üzerinden Tarayan Motor
 */
async function searchTargetedFinancialNews(
    query: string,
    startDateStr?: string,
    endDateStr?: string
): Promise<{
    title: string;
    source: string;
    date: string;
    url?: string;
}[]> {
    try {
        const queryWithSources = `${query} site:bloomberght.com OR site:cnnturk.com OR site:tr.investing.com`;
        const encoded = encodeURIComponent(queryWithSources);
        const rssUrl = `https://news.google.com/rss/search?q=${encoded}&hl=tr&gl=TR&ceid=TR:tr`;

        const res = await fetch(rssUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            next: { revalidate: 1800 }
        });

        if (!res.ok) return [];

        const xmlText = await res.text();
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const parsed = parser.parse(xmlText);
        const items = parsed?.rss?.channel?.item;
        if (!items) return [];

        const rawList = Array.isArray(items) ? items : [items];
        const verifiedItems: { title: string; source: string; date: string; url?: string }[] = [];

        for (const item of rawList) {
            let cleanTitle = (item.title || '')
                .replace(/\s*-\s*[^-]+$/, '')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .trim();

            let source = item.source?.['#text'] || item.source || 'Bloomberg HT / Investing TR';
            if (source.includes('Investing')) source = 'Investing.com TR';
            else if (source.includes('Bloomberg') || source.includes('Bloomberght')) source = 'Bloomberg HT';
            else if (source.includes('CNN') || source.includes('cnnturk')) source = 'CNN Türk';

            const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            const dateFormatted = pubDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

            if (cleanTitle.length > 8) {
                // Çoklu hisse kodlu liste haberlerini (Örn: Hangisi Ralli Yapacak? ASTOR ASELS THYAO PGSUS SASA TUPRS) filtrele
                const upperCodes = cleanTitle.match(/\b[A-Z]{4,5}\b/g) || [];
                if (upperCodes.length >= 3) continue;

                // Genel piyasa/borsa gün içi özetlerini filtrele
                const tLower = cleanTitle.toLowerCase();
                const genericPhrases = [
                    'günün özeti', 'piyasalarda günün özeti', 'bist 100 günü', 'borsada gün',
                    'borsa günü', 'sabah bülteni', 'kapanış özeti', 'gün ortası', 'ralli yapacak',
                    'en çok kazandıran', 'en çok kaybettiren'
                ];
                if (genericPhrases.some(p => tLower.includes(p))) continue;

                verifiedItems.push({
                    title: cleanTitle,
                    source,
                    date: dateFormatted,
                    url: item.link || undefined
                });
            }

            if (verifiedItems.length >= 3) break;
        }

        return verifiedItems;
    } catch (e) {
        console.warn(`Targeted news search error for ${query}:`, e);
        return [];
    }
}


async function fetchSynchronizedCalendarDividends(): Promise<{
    symbol: string;
    companyName: string;
    netAmountPerShare: number;
    paymentDate: string;
    parsedDate: string | null;
}[]> {
    try {
        let rawData: any[] | null = null;
        try {
            const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/temettu.php?v=${Date.now()}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                const parsed = await response.json();
                if (Array.isArray(parsed) && parsed.length > 0) {
                    rawData = parsed;
                }
            }
        } catch {
            // Ağ durumunda yerel snapshot devreye girer
        }

        if (!rawData || rawData.length === 0) {
            rawData = (halkarzSnapshot as any)?.rawDividends || [];
        }

        return (rawData || []).map((item: any) => {
            const symbol = (item.t_bistkod || item.symbol || '').toUpperCase().trim();
            const rawDate = (item.t_tarih || item.paymentDate || '').trim();
            const netAmount = parseFloat(String(item.t_temt_net ?? item.t_net ?? item.netAmountPerShare ?? '0').replace(',', '.')) || 0;
            let parsedDateStr: string | null = item.parsedDate || null;
            if (!parsedDateStr && rawDate && rawDate.includes('.')) {
                const parts = rawDate.split('.');
                if (parts.length === 3) {
                    const d = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10);
                    const y = parseInt(parts[2], 10);
                    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 2020) {
                        parsedDateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    }
                }
            }
            return {
                symbol,
                companyName: item.t_sirket || item.companyName || symbol,
                netAmountPerShare: netAmount,
                paymentDate: rawDate,
                parsedDate: parsedDateStr
            };
        }).filter((d: any) => d.symbol && d.parsedDate);
    } catch (e) {
        console.warn("fetchSynchronizedCalendarDividends error:", e);
        return [];
    }
}

async function fetchSynchronizedCalendarEarnings(): Promise<{
    symbol: string;
    companyName: string;
    earningsDate: string;
    period?: string;
    parsedDate: string | null;
}[]> {
    try {
        let rawData: any[] | null = null;
        try {
            const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/bilanco.php?v=${Date.now()}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                signal: AbortSignal.timeout(3000)
            });
            if (response.ok) {
                const parsed = await response.json();
                if (Array.isArray(parsed) && parsed.length > 0) {
                    rawData = parsed;
                }
            }
        } catch {
            // Ağ durumunda yerel snapshot
        }

        if (!rawData || rawData.length === 0) {
            rawData = (halkarzSnapshot as any)?.earnings || [];
        }

        return (rawData || []).map((item: any) => {
            const symbol = (item.b_bistkod || item.symbol || '').toUpperCase().trim();
            const rawDate = (item.b_tarih || item.earningsDate || '').trim();
            let parsedDateStr: string | null = item.parsedDate || null;
            if (!parsedDateStr && rawDate && rawDate.includes('.')) {
                const parts = rawDate.split('.');
                if (parts.length === 3) {
                    const d = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10);
                    const y = parseInt(parts[2], 10);
                    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 2020) {
                        parsedDateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                    }
                }
            }
            return {
                symbol,
                companyName: item.b_sirket || item.companyName || symbol,
                earningsDate: rawDate,
                period: item.b_donem || item.period || '',
                parsedDate: parsedDateStr
            };
        }).filter((e: any) => e.symbol && e.parsedDate);
    } catch (e) {
        console.warn("fetchSynchronizedCalendarEarnings error:", e);
        return [];
    }
}

async function fetchSynchronizedEconomicEvents(startDateIso: string, endDateIso: string): Promise<MacroCalendarEventItem[]> {
    try {
        const dbEvents = await CalendarDbService.getEventsByDateRange(startDateIso, endDateIso);
        let catalogList: any[] = [];
        if (dbEvents && dbEvents.length > 0) {
            catalogList = dbEvents.map(d => ({
                id: d.id,
                dateFormatted: d.event_date ? `${d.event_date.split('-')[2]}.${d.event_date.split('-')[1]}.${d.event_date.split('-')[0]}` : '',
                rawDate: d.event_date,
                country: d.country_code || 'TR',
                event: d.event_name,
                impact: (d.impact_level || 'medium') as 'critical' | 'high' | 'medium'
            }));
        } else {
            const scraped = await scrapeEconomicCalendar();
            catalogList = (scraped || []).map(e => ({
                id: e.id,
                dateFormatted: e.dateFormatted,
                rawDate: e.dateFormatted ? e.dateFormatted.split('.').reverse().join('-') : '',
                country: (e.country as string) || 'TR',
                event: e.event,
                impact: (e.impact || 'medium') as 'critical' | 'high' | 'medium'
            }));
        }

        return catalogList.map(item => {
            let plainExplanation = "Piyasa likiditesi ve sektörel kârlılık üzerinde genel yön belirleyici kritik bir gösterge.";
            const evLower = (item.event || '').toLowerCase();
            if (evLower.includes('faiz') || evLower.includes('interest rate')) {
                plainExplanation = "Şirketlerin borçlanma ve finansman maliyetlerini belirler; sabit kalması veya inmesi sanayi hisselerini rahatlatır.";
            } else if (evLower.includes('enflasyon') || evLower.includes('cpi') || evLower.includes('tüfe')) {
                plainExplanation = "Tüketici harcamalarını ve perakende/gıda şirketlerinin ciro büyüme hızını gösterir.";
            } else if (evLower.includes('istihdam') || evLower.includes('payrolls') || evLower.includes('işsizlik')) {
                plainExplanation = "Ekonomik canlılığın ve küresel para akışının gücünü gösteren öncü bir sinyaldir.";
            }
            return {
                id: item.id,
                event: item.event,
                dateFormatted: item.dateFormatted,
                rawDate: item.rawDate,
                country: item.country,
                impact: item.impact,
                plainExplanation
            };
        });
    } catch (e) {
        console.warn("fetchSynchronizedEconomicEvents error:", e);
        return [];
    }
}

/**
 * GELECEK AY BEKLENTİLERİ MOTORU (3 KATMANLI SENTEZLEYİCİ)
 */
async function generateNextMonthExpectations(
    period: MonthlyReportPeriod,
    computedAssets: MonthlyAssetMetric[],
    sectors: MonthlySectorPerformance[],
    userName: string
): Promise<NextMonthExpectationsBlock> {
    const nextMonth = calculateTargetNextMonth(period.startDate);

    // Eşzamanlı Takvim Verisi Çekimi (FinAi Takvim ile 1-1 Senkron)
    const [allDividends, allEarnings, allMacroEvents] = await Promise.all([
        fetchSynchronizedCalendarDividends(),
        fetchSynchronizedCalendarEarnings(),
        fetchSynchronizedEconomicEvents(nextMonth.startDate, nextMonth.endDate)
    ]);

    // 1. KATMAN: PORTFÖYDEKİ TÜM VARLIKLARIN TEMETTÜ VE BİLANÇO KONTROLÜ (Portföy Gündemi ile Tam Senkron)
    const companyEvents: CompanyEventItem[] = [];

    for (const asset of computedAssets) {
        const clean = asset.cleanSymbol;
        
        // Temettü kontrolü (Hedef ay içerisinde mi?)
        const divMatch = allDividends.find(d => 
            d.symbol === clean && 
            d.parsedDate && 
            d.parsedDate >= nextMonth.startDate && 
            d.parsedDate <= nextMonth.endDate
        );

        if (divMatch) {
            const estimatedPayoutTL = asset.quantity > 0 ? (asset.quantity * divMatch.netAmountPerShare) : undefined;
            companyEvents.push({
                symbol: clean,
                companyName: divMatch.companyName || clean,
                eventType: 'dividend',
                title: `${clean} Temettü Dağıtımı`,
                dateFormatted: divMatch.paymentDate,
                rawDate: divMatch.parsedDate!,
                netAmountPerShare: divMatch.netAmountPerShare,
                estimatedPayoutTL: estimatedPayoutTL ? Number(estimatedPayoutTL.toFixed(2)) : undefined
            });
        }

        // Bilanço kontrolü (Hedef ay içerisinde mi?)
        const earnMatch = allEarnings.find(e => 
            e.symbol === clean && 
            e.parsedDate && 
            e.parsedDate >= nextMonth.startDate && 
            e.parsedDate <= nextMonth.endDate
        );

        if (earnMatch) {
            companyEvents.push({
                symbol: clean,
                companyName: earnMatch.companyName || clean,
                eventType: 'earnings',
                title: `${clean} Finansal Sonuç Açıklaması`,
                dateFormatted: earnMatch.earningsDate,
                rawDate: earnMatch.parsedDate!,
                periodLabel: earnMatch.period || 'Dönemsel Bilanço'
            });
        }
    }

    // Kronolojik Sıralama: En yakın tarihten en uzak tarihe (Tek ve birleşik liste)
    companyEvents.sort((a, b) => (a.rawDate || '').localeCompare(b.rawDate || ''));

    // 2. KATMAN: DİNAMİK ÜLKE VE MAKRO EŞLEMESİ
    // BIST için tüm TR haberleri; Altın için sadece Fed Faiz Kararı ve Küresel riskler!
    const hasBistOrTL = computedAssets.some(a => a.type === 'STOCK' || a.cleanSymbol === 'TRY' || a.sector !== 'Kıymetli Maden');
    const hasGold = computedAssets.some(a => 
        a.cleanSymbol === 'ALTIN' || a.cleanSymbol === 'GA' || a.cleanSymbol === 'GRAM_ALTIN' || 
        a.cleanSymbol === 'GUMUS' || a.cleanSymbol === 'GC=F'
    );

    const filteredMacroEvents = allMacroEvents.filter(ev => {
        const c = ev.country.toUpperCase();
        if (hasBistOrTL && (c === 'TR' || c === 'TUR' || c === 'TÜRKİYE')) return true;
        if (hasGold && (c === 'US' || c === 'ABD' || c === 'USA' || c === 'GLOBAL' || c === 'KÜRESEL')) {
            const evL = (ev.event || '').toLowerCase();
            return evL.includes('faiz') || evL.includes('interest rate') || evL.includes('fed') || evL.includes('fomc') || evL.includes('powell');
        }
        return false;
    });

    const totalCalendarEventsCount = filteredMacroEvents.length;

    // Kullanıcıya her seferinde aynı haberi söylememek kaydı ile 1 adet öne çıkan ekonomik haber başlığı seçimi
    // Öncelik Sıralaması: TCMB Faiz Kararı > Sanayi Üretimi > GSYH Büyüme > Kapasite Kullanım > Cari Denge (TÜFE tekrarı engellenir)
    const priorityEvent = filteredMacroEvents.find(e => {
        const evL = (e.event || '').toLowerCase();
        return evL.includes('faiz') || evL.includes('ppk') || evL.includes('policy rate');
    }) || filteredMacroEvents.find(e => {
        const evL = (e.event || '').toLowerCase();
        return evL.includes('sanayi') || evL.includes('industrial');
    }) || filteredMacroEvents.find(e => {
        const evL = (e.event || '').toLowerCase();
        return evL.includes('büyüme') || evL.includes('gdp');
    }) || filteredMacroEvents.find(e => {
        const evL = (e.event || '').toLowerCase();
        return !evL.includes('tüfe') && !evL.includes('enflasyon') && !evL.includes('cpi');
    }) || filteredMacroEvents[0] || {
        event: 'TCMB Para Politikası Kurulu (PPK) Faiz Kararı',
        country: 'TR',
        dateFormatted: 'Ay İçinde',
        plainExplanation: 'Piyasa likiditesi, şirketlerin borçlanma maliyetleri ve Borsa İstanbul genel değerlemesi üzerinde ana yön belirleyici olacaktır.'
    };

    // Altın için siyasi, sosyal, savaş/barış durumu (Yuvarlamasız, net ve kesin cümleler)
    let goldGeopoliticalInsight: string | null = null;
    if (hasGold) {
        goldGeopoliticalInsight = "Altın pozisyonunuz açısından önümüzdeki ayın jeopolitik ve makro dengeleri oldukça nettir: Orta Doğu'daki çatışmaların tırmanma eğilimi ve Ukrayna-Rusya hattında kalıcı bir barış ve ateşkes ihtimalinin ötelenmesi, küresel piyasalarda jeopolitik risk primini yüksek seviyede kilitlemektedir. Barışın ötelenmesi güvenli liman talebini canlı tutarken; ABD yönetiminden gelebilecek yeni gümrük tarifesi adımları ve Fed'in kademeli faiz indirim patikası ons altının 2.650 - 2.750 dolar bandındaki güçlü duruşunu perçinleyen ana eksen olacaktır.";
    }

    // 3. KATMAN: SEKTÖREL VE ŞİRKET HABERLERİ ARAŞTIRMASI (Bloomberg HT, CNN Türk, Investing TR)
    // 4. EDİTORYAL MENTÖR METNİ SENTEZİ (FinAi Ekibi "Biz" Perspektifi)
    const paragraphs: string[] = [];

    // Kanca: FinAi Ekibi Perspektifi
    paragraphs.push(
        `${userName}, geride bıraktığımız ayın ardından FinAi ekibi olarak rotamızı ${nextMonth.nextMonthLabel} ayına ve portföyünüzün karşılaşacağı kritik gelişmelere çeviriyoruz.`
    );

    // Makroekonomik Takvim Olayı (Sayfa linki ile doğrudan entegre)
    const calendarEventId = priorityEvent.id || 'tr_interest_rate';
    const eventLinkToken = `[ekonomi:${calendarEventId}|${priorityEvent.event}]`;
    paragraphs.push(
        `Piyasaların genel seyrini tayin edecek makroekonomik takvimde ise portföyünüz açısından öne çıkan en kritik gelişme, ${priorityEvent.country === 'TR' ? 'Türkiye' : 'küresel'} piyasalarda ${priorityEvent.dateFormatted} tarihinde açıklanacak olan ${eventLinkToken} olacaktır. Bu gelişmeyi kısaca sizlere aktarmamız gerekirse; ${priorityEvent.plainExplanation}`
    );

    // Altın Jeopolitik / Küresel Denge Analizi (Varsa)
    if (goldGeopoliticalInsight) {
        paragraphs.push(goldGeopoliticalInsight);
    }

    // Kapanış - Tavsiye cümlesi kaldırıldı (kullanıcı direktifi: tavsiye vermeye gerek yok)
    const closingTakeaway = '';

    return {
        title: `${nextMonth.nextMonthLabel} Beklentileri & Stratejik Ajanda`,
        targetMonthLabel: nextMonth.nextMonthLabel,
        targetDateRangeFormatted: nextMonth.dateRangeFormatted,
        narrativeParagraphs: paragraphs,
        companyEvents,
        macroEvents: filteredMacroEvents,
        sectorResearchFindings: [],
        goldGeopoliticalInsight,
        totalCalendarEventsCount,
        closingTakeaway
    };
}

/**
 * 4. Ana Aylık Performans, Katkı Analizi ve Mentör Özeti Servisi
 */
export async function generateMonthlyPerformanceReport(
    userId?: string,
    monthIndex: number = 0,
    requestedUserName?: string
): Promise<MonthlyReportData> {
    const { period, availableMonths } = calculateMonthBounds(monthIndex);

    // 1. Portföy Varlıklarını Çek
    let dbAssets: any[] = [];
    let historySnapshots: any[] = [];
    let transactions: any[] = [];
    let userFullName = requestedUserName || "Değerli Yatırımcımız";

    if (userId) {
        try {
            const [assetsRes, histRes, txRes, profileRes] = await Promise.all([
                supabaseAdmin.from('user_portfolios').select('*').eq('user_id', userId),
                supabaseAdmin.from('portfolio_history').select('*').eq('user_id', userId).gte('snapshot_date', period.startDate).order('snapshot_date', { ascending: true }),
                supabaseAdmin.from('user_transactions').select('*').eq('user_id', userId).gte('transaction_date', period.startDate).order('transaction_date', { ascending: true }),
                supabaseAdmin.from('user_profiles').select('full_name, name').eq('id', userId).single()
            ]);

            if (assetsRes.data) dbAssets = assetsRes.data;
            if (histRes.data) historySnapshots = histRes.data;
            if (txRes.data) transactions = txRes.data;
            if (profileRes.data) {
                userFullName = profileRes.data.full_name || profileRes.data.name || userFullName;
            }
        } catch (e) {
            console.error("Monthly report database fetch error:", e);
        }
    }

    // Nakit varlıkları aylık performans raporundan hariç tut (Kullanıcı Talebi: Nakit bu sayfada varlık olarak gösterilmeyecek)
    dbAssets = dbAssets.filter(a => {
        const sym = (a.symbol || '').toUpperCase().trim();
        const clean = sym.replace(/\.IS$/i, '').trim();
        return !['NAKİT', 'NAKIT', 'TRY', 'TL', 'TRY_CASH', 'CASH'].includes(clean);
    });

    // TARİH DUYARLILIĞI: Varlık bu ayın bitiş tarihinden sonra mı eklendi?
    // Eğer varlığın purchase_date veya created_at tarihi period.endDate'den sonraysa,
    // o varlık bu geçmiş ayda kullanıcı portföyünde henüz YOKTUR!
    if (userId) {
        dbAssets = dbAssets.filter(a => {
            const rawDate = a.purchase_date || a.created_at;
            if (!rawDate) return true;
            const assetDateStr = typeof rawDate === 'string' 
                ? rawDate.slice(0, 10) 
                : new Date(rawDate).toISOString().slice(0, 10);
            return assetDateStr <= period.endDate;
        });
    }

    const cleanFirstName = userFullName.split(' ')[0] || userFullName;
    const politeGreetingName = `${cleanFirstName} Bey`;

    const hasActiveAssets = dbAssets.length > 0;

    // Yalnızca oturum açmamış demo ziyaretçileri için örnek hisseler verilir.
    // Oturum açmış bir kullanıcının geçmiş bir ayda varlığı yoksa ASLA sahte hisse eklenmez!
    if (!hasActiveAssets && !userId) {
        dbAssets = [
            { id: '1', symbol: 'THYAO.IS', quantity: 150, avg_cost: 295.0, asset_type: 'STOCK' },
            { id: '2', symbol: 'ASELS.IS', quantity: 300, avg_cost: 62.5, asset_type: 'STOCK' },
            { id: '3', symbol: 'TUPRS.IS', quantity: 180, avg_cost: 142.0, asset_type: 'STOCK' },
            { id: '4', symbol: 'BIMAS.IS', quantity: 90, avg_cost: 480.0, asset_type: 'STOCK' },
            { id: '5', symbol: 'ALTIN', quantity: 25, avg_cost: 2950.0, asset_type: 'COMMODITY' }
        ];
    }

    // 2. Fiyatları Çek
    const symbols = dbAssets.map(a => a.symbol);
    const [cachedLivePrices, historicalMonthData] = await Promise.all([
        getOrFetchCachedPrices(symbols),
        fetchRealMonthlyStartPrices(symbols, period.startDate, period.endDate)
    ]);

    const { startPrices, endPrices, bist100ReturnPct } = historicalMonthData;

    // 3. Varlık Hesaplamaları
    let totalPortfolioVal = 0;
    let totalPortfolioCost = 0;
    let totalMonthStartVal = 0;

    const computedAssets: MonthlyAssetMetric[] = dbAssets.map(a => {
        const rawSym = a.symbol;
        const cleanSym = rawSym.replace(/\.IS$/i, '').trim().toUpperCase();
        const quantity = Number(a.quantity) || 0;
        const avgCost = Number(a.avg_cost) || 0;

        const startPrice = startPrices[rawSym] || startPrices[cleanSym] || avgCost || 100;
        const currentPrice = period.isCurrentMonth
            ? (cachedLivePrices[rawSym] || cachedLivePrices[cleanSym] || endPrices[rawSym] || startPrice)
            : (endPrices[rawSym] || endPrices[cleanSym] || cachedLivePrices[rawSym] || startPrice);

        const totalValue = quantity * currentPrice;
        const totalCost = quantity * avgCost;
        const monthStartVal = quantity * startPrice;

        totalPortfolioVal += totalValue;
        totalPortfolioCost += totalCost;
        totalMonthStartVal += monthStartVal;

        const monthlyReturnPct = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0;
        const monthlyReturnTL = totalValue - monthStartVal;

        const cumulativeReturnPct = avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0;
        const cumulativeReturnTL = totalValue - totalCost;

        let sector = getAssetSector(cleanSym) || 'Diğer';
        if (cleanSym === 'ALTIN' || cleanSym === 'GUMUS') sector = 'Kıymetli Maden';

        let isAnomaly = false;
        let anomalyType: MonthlyAssetMetric['anomalyType'] = 'normal';
        let anomalyReason = '';

        if (monthlyReturnPct >= 18) {
            isAnomaly = true;
            anomalyType = 'high_gain';
            anomalyReason = `Aylık güçlü yükseliş ile genel piyasa ortalamasının çok üzerinde bir getiri sağladı.`;
        } else if (monthlyReturnPct <= -12) {
            isAnomaly = true;
            anomalyType = 'sharp_drop';
            anomalyReason = `Aylık geri çekilme ile portföy getirisi üzerinde baskı oluşturdu.`;
        }

        return {
            id: a.id || cleanSym,
            symbol: rawSym,
            cleanSymbol: cleanSym,
            name: cleanSym,
            sector,
            type: a.asset_type || 'STOCK',
            quantity,
            avgCost,
            startPrice: Number(startPrice.toFixed(2)),
            currentPrice: Number(currentPrice.toFixed(2)),
            totalValue: Number(totalValue.toFixed(2)),
            totalCost: Number(totalCost.toFixed(2)),
            monthlyReturnPct: Number(monthlyReturnPct.toFixed(2)),
            monthlyReturnTL: Number(monthlyReturnTL.toFixed(2)),
            cumulativeReturnPct: Number(cumulativeReturnPct.toFixed(2)),
            cumulativeReturnTL: Number(cumulativeReturnTL.toFixed(2)),
            weightPct: 0,
            contributionPct: 0,
            contributionTL: Number(monthlyReturnTL.toFixed(2)),
            isPositive: monthlyReturnTL >= 0,
            isAnomaly,
            anomalyType,
            anomalyReason
        };
    });

    computedAssets.forEach(ast => {
        ast.weightPct = totalPortfolioVal > 0 ? Number(((ast.totalValue / totalPortfolioVal) * 100).toFixed(2)) : 0;
        ast.contributionPct = Number(((ast.weightPct * ast.monthlyReturnPct) / 100).toFixed(2));
    });

    // 4. Sektörel Analiz (TL Bazlı)
    const sectorMap: Record<string, {
        totalVal: number;
        monthlyTL: number;
        symbols: string[];
        returns: number[];
    }> = {};

    computedAssets.forEach(a => {
        if (!sectorMap[a.sector]) {
            sectorMap[a.sector] = { totalVal: 0, monthlyTL: 0, symbols: [], returns: [] };
        }
        sectorMap[a.sector].totalVal += a.totalValue;
        sectorMap[a.sector].monthlyTL += a.monthlyReturnTL;
        sectorMap[a.sector].symbols.push(a.cleanSymbol);
        sectorMap[a.sector].returns.push(a.monthlyReturnPct);
    });

    const sectors: MonthlySectorPerformance[] = Object.entries(sectorMap).map(([name, data]) => {
        const weightPct = totalPortfolioVal > 0 ? (data.totalVal / totalPortfolioVal) * 100 : 0;
        const monthlyReturnPct = data.totalVal > 0 ? (data.monthlyTL / (data.totalVal - data.monthlyTL || 1)) * 100 : 0;

        const isAnomaly = monthlyReturnPct >= (bist100ReturnPct + 7);
        const anomalyNote = isAnomaly
            ? `${name} sektörü, BIST 100 genel getirisinden belirgin şekilde pozitif ayrıştı.`
            : undefined;

        return {
            name,
            weightPct: Number(weightPct.toFixed(1)),
            monthlyReturnPct: Number(monthlyReturnPct.toFixed(2)),
            monthlyReturnTL: Number(data.monthlyTL.toFixed(2)),
            assetCount: data.symbols.length,
            symbols: data.symbols,
            isPositive: data.monthlyTL >= 0,
            isAnomaly,
            anomalyNote
        };
    });

    sectors.sort((a, b) => b.monthlyReturnTL - a.monthlyReturnTL);

    // Varlık Bulunmayan Geçmiş Ay Kontrolü (Oturum açmış kullanıcının o tarihte varlığı yoksa erken dönüş)
    if (computedAssets.length === 0) {
        return {
            period,
            availableMonths,
            hasActiveAssets: false,
            summary: {
                totalValue: 0,
                totalCost: 0,
                monthlyNetProfitTL: 0,
                monthlyNetProfitPct: 0,
                twrPct: 0,
                netCapitalFlow: 0,
                cumulativeNetProfitTL: 0,
                cumulativeNetProfitPct: 0,
                bist100MonthlyReturnPct: bist100ReturnPct,
                relativeAlphaPct: 0,
                activeAssetCount: 0,
                healthScore: 80
            },
            assets: [],
            sectors: [],
            mentorSummary: {
                title: `${period.monthLabel} Değerlendirmesi`,
                userName: politeGreetingName,
                greetingSentence: `${politeGreetingName}, seçtiğiniz ${period.monthLabel} döneminde portföyünüzde henüz kayıtlı bir varlık bulunmamaktadır.`,
                narrativeParagraphs: [
                    `Bu dönemde portföyünüzde herhangi bir hisse senedi veya kıymetli maden pozisyonu bulunmadığı için aylık getiri veya kâr/zarar hesaplanmamıştır. Portföyünüze ait ilk işlem geçmişini ve sermaye hareketlerinizi İşlem Geçmişi sayfasından takip edebilirsiniz.`
                ],
                topGainingAsset: null,
                topGainingSector: null,
                topLosingAsset: null,
                topLosingSector: null,
                keyMovements: [],
                topContributors: [],
                negativeLearningMoment: null,
                sectorInsight: null,
                closingTakeaway: `Gelecek dönem değerlendirmeleriniz için portföyünüze varlık eklemeye devam edebilirsiniz.`
            },
            nextMonthExpectations: await generateNextMonthExpectations(period, [], [], politeGreetingName),
            generatedAt: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' })
        };
    }

    // 5. TWR ve Net Sermaye Akışı
    let netCapitalFlow = 0;
    if (transactions.length > 0) {
        netCapitalFlow = transactions.reduce((sum, t) => {
            const amount = Number(t.amount) || 0;
            if (t.transaction_type === 'DEPOSIT') return sum + amount;
            if (t.transaction_type === 'WITHDRAWAL') return sum - amount;
            return sum;
        }, 0);
    }

    let twrPct = calculateTWR(historySnapshots, transactions);
    const monthlyNetProfitTL = totalPortfolioVal - totalMonthStartVal;
    const monthlyNetProfitPct = totalMonthStartVal > 0 ? (monthlyNetProfitTL / totalMonthStartVal) * 100 : 0;

    if (twrPct === 0 && totalMonthStartVal > 0) {
        const adjustedProfit = monthlyNetProfitTL - netCapitalFlow;
        twrPct = Number(((adjustedProfit / totalMonthStartVal) * 100).toFixed(2));
    }

    // 6. KAZANÇ VE KAYIP TARAFLARI (TL BAZLI) & HEDEF HABER ARAMASI (Bloomberg HT, CNN Türk, Investing TR)
    const sortedAssetsByTL = [...computedAssets].sort((a, b) => b.monthlyReturnTL - a.monthlyReturnTL);
    const topGainingAsset = sortedAssetsByTL[0] || null;
    const topLosingAsset = sortedAssetsByTL[sortedAssetsByTL.length - 1] || null;

    const sortedSectorsByTL = [...sectors].sort((a, b) => b.monthlyReturnTL - a.monthlyReturnTL);
    const topGainingSector = sortedSectorsByTL[0] || null;
    const topLosingSector = sortedSectorsByTL[sortedSectorsByTL.length - 1] || null;

    // Düşüş araştırması: Sadece düşen hisse veya kendi sektörü taranır (Asla başka hisseler karıştırılmaz!)
    let fallingFinding: { title: string; source: string; date: string; url?: string } | null = null;
    let fallingSubject = topLosingAsset?.cleanSymbol || 'Hisseler';

    if (topLosingAsset && topLosingAsset.monthlyReturnTL < 0) {
        const losingNews = await searchTargetedFinancialNews(topLosingAsset.cleanSymbol);
        if (losingNews.length > 0) {
            fallingFinding = losingNews[0];
            fallingSubject = topLosingAsset.cleanSymbol;
        }
    }

    // Eğer hissede doğrudan bulunamadıysa yalnızca en çok kaybettiren kendi sektörü için ara
    if (!fallingFinding && topLosingSector && topLosingSector.monthlyReturnTL < 0) {
        const sectorLossNews = await searchTargetedFinancialNews(`${topLosingSector.name} sektörü`);
        if (sectorLossNews.length > 0) {
            fallingFinding = sectorLossNews[0];
            fallingSubject = `${topLosingSector.name} sektörü`;
        }
    }

    // Kazanan hisse için de hedef kaynaklardan haber tara
    let winningNews: { title: string; source: string; date: string; url?: string } | null = null;
    if (topGainingAsset && topGainingAsset.monthlyReturnTL > 0) {
        const gainNews = await searchTargetedFinancialNews(topGainingAsset.cleanSymbol);
        if (gainNews.length > 0) {
            winningNews = gainNews[0];
        }
    }

    // 7. BİLİŞSEL MENTÖRLÜK ANLATIMI (TAMAMEN TL BAZLI, SIFIR YÜZDE!)
    const isNetPositive = monthlyNetProfitTL >= 0;
    const profitTLFormatted = Math.abs(monthlyNetProfitTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 });

    const greetingSentence = isNetPositive
        ? `Geçtiğimiz ay genel borsa koşulları dalgalı bir seyir izlerken, FinAi ekibi olarak incelemelerimizde portföyünüzün değerini koruyarak ayı net ${profitTLFormatted} TL artışla tamamladığını görmekteyiz.`
        : `Geçtiğimiz ay genel piyasa koşulları temkinli ve dalgalı bir seyir izlerken, portföyünüz ayı net ${profitTLFormatted} TL seviyesinde bir geri çekilme ile kapattı.`;

    const paragraphs: string[] = [];

    // PARAGRAF 1: Giriş ve Kazanç Tarafı (Genel portföy net durumu ve lokomotif varlık)
    const p1Intro = Math.abs(netCapitalFlow) > 1000
        ? `${politeGreetingName}, portföyünüzdeki gerçek nakit hareketlerini incelediğimizde; ay boyunca yaptığınız ${Math.abs(netCapitalFlow).toLocaleString('tr-TR')} TL tutarındaki ${netCapitalFlow > 0 ? 'nakit para eklemesini' : 'para çıkışını'} piyasa kârından ayırdığımızda, doğrudan hisselerinizin kendi piyasa performansı ile portföyünüzün bu ayı net ${profitTLFormatted} TL ${isNetPositive ? 'kazançla' : 'farkla'} tamamladığını belirledik.`
        : `${politeGreetingName}, portföyünüzdeki nakit hareketlerini ve şirketlerinizin performansını incelediğimizde; herhangi bir dış para girişine gerek kalmadan, doğrudan seçtiğiniz şirketlerin performansı ile portföyünüzün bu ayı net ${profitTLFormatted} TL ${isNetPositive ? 'artışla' : 'değişimle'} tamamladığını görmekteyiz.`;

    let p1GainText = '';
    if (topGainingAsset) {
        const isActuallyGain = topGainingAsset.monthlyReturnTL > 0;
        const topGainTLFormatted = Math.abs(topGainingAsset.monthlyReturnTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
        const topSectorGainTLFormatted = topGainingSector 
            ? Math.abs(topGainingSector.monthlyReturnTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) 
            : null;

        const winningNewsSnippet = winningNews
            ? `Şirketin faaliyet gösterdiği alandaki güçlü kurumsal talep, ticari operasyonları ve yatırımcı ilgisi bu yükselişi doğrudan destekledi.`
            : `Şirketin faaliyet gösterdiği alandaki kurumsal talep ve yatırımcı ilgisi öne çıkan temel itici güç oldu.`;

        if (isActuallyGain) {
            const sectorGainText = topGainingSector
                ? `Sektörel bazda ise cüzdanınıza en güçlü desteği net **+${topSectorGainTLFormatted} TL** ile **${topGainingSector.name}** sektörü verdi.`
                : '';
            p1GainText = `Portföyünüzdeki büyümenin lokomotifi, tek başına portföyünüze net **+${topGainTLFormatted} TL** kazanç sağlayan **${topGainingAsset.cleanSymbol}** oldu. ${sectorGainText} ${winningNewsSnippet}`;
        } else {
            const sectorResistText = topGainingSector
                ? `Sektörel bazda ise en korunaklı duruşu **${topGainingSector.name}** sektörü sergiledi.`
                : '';
            p1GainText = `Genel piyasadaki dalgalanmalara rağmen cüzdanınızda değerini en dirayetli koruyan şirket, ayı sadece net **-${topGainTLFormatted} TL** sınırlı bir geri çekilme ile kapatan **${topGainingAsset.cleanSymbol}** oldu.${sectorResistText ? ' ' + sectorResistText : ''}`;
        }
    }

    const positiveAssets = computedAssets.filter(a => a.monthlyReturnTL > 0);
    const negativeAssets = computedAssets.filter(a => a.monthlyReturnTL < 0);
    let p1DiversificationText = '';
    if (positiveAssets.length > 0 && negativeAssets.length > 0) {
        p1DiversificationText = `Portföyünüzü çeşitlendirmeniz sayesinde, değer kaybeden hisselerin getiri üzerindeki negatif baskısı dengelenerek çok büyük bir dalgalanma olmadan bu ayı bu şekilde atlatmış bulunmaktayız.`;
    }

    const paragraph1 = [p1Intro, p1GainText, p1DiversificationText].filter(Boolean).join(' ');
    paragraphs.push(paragraph1);

    // PARAGRAF 2: Zarar Tablosu ve Teyitli Araştırma (Başlangıç: Zarar tablosuna baktığımızda ise...)
    if (topLosingAsset && topLosingAsset.monthlyReturnTL < 0) {
        const lossTLFormatted = Math.abs(topLosingAsset.monthlyReturnTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 });
        const sectorLossTLFormatted = topLosingSector && topLosingSector.monthlyReturnTL < 0
            ? Math.abs(topLosingSector.monthlyReturnTL).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
            : null;

        const sectorLossText = topLosingSector && sectorLossTLFormatted
            ? `Sektör bazında ise en belirgin geri çekilme net **${sectorLossTLFormatted} TL** gerilemeyle **${topLosingSector.name}** sektöründe gerçekleşti.`
            : '';

        let researchConclusion = '';
        if (fallingFinding && fallingFinding.title) {
            const titleLower = fallingFinding.title.toLowerCase();
            if (titleLower.includes('spk') || titleLower.includes('suç duyurusu') || titleLower.includes('tedbir') || titleLower.includes('yasak') || titleLower.includes('ceza') || titleLower.includes('soruşturma') || titleLower.includes('dava')) {
                researchConclusion = `Yaptığımız derinlemesine piyasa araştırmalarına göre; Sermaye Piyasası Kurulu (SPK) veya düzenleyici otoriteler tarafından ${fallingSubject} paylarına yönelik alınan idari tedbir, inceleme veya işlem kısıtlaması kararlarının düşüşte belirleyici olduğu görülmektedir. Finansal piyasalar açısından bu karar; hissede kredili alım ve açığa satış gibi kaldıraçlı işlem imkanlarını sınırlandırarak tahtadaki likidite akışını doğrudan daraltmakta, yatırımcıların artan belirsizlik karşısında teminat tamamlama ve riskten kaçınma refleksiyle satışa yönelmesine neden olmaktadır.`;
            } else if ((titleLower.includes('bilanço') || titleLower.includes('kâr') || titleLower.includes('kar') || titleLower.includes('gelir') || titleLower.includes('ciro')) && (titleLower.includes('zarar') || titleLower.includes('düştü') || titleLower.includes('geriledi') || titleLower.includes('kayıp') || titleLower.includes('altında') || titleLower.includes('baskı'))) {
                researchConclusion = `Yaptığımız derinlemesine finansal araştırmalara göre; şirketin kamuoyuna açıkladığı son dönem finansal sonuçlarında net kâr marjı veya operasyonel nakit akışının piyasa beklentilerinin gerisinde kalmasının fiyatlamayı baskıladığı anlaşılmaktadır. Temel analiz perspektifinden bu gelişme; artan finansman giderleri veya operasyonel maliyetler sebebiyle şirketin mevcut çarpan değerlemelerini pahalı hale getirmekte ve kurumsal fonlar dahil olmak üzere piyasa genelinde kâr realizasyonlarını tetiklemektedir.`;
            } else if (titleLower.includes('üretim durdurma') || titleLower.includes('bakım duruşu') || titleLower.includes('grev') || titleLower.includes('arıza') || titleLower.includes('yangın') || titleLower.includes('kaza')) {
                researchConclusion = `Yaptığımız operasyonel araştırmalara göre; şirketin ana üretim tesislerinde yürütülen bakım duruşu, kapasite kısıtlaması veya dönemsel aksamaların hisse performansı üzerinde doğrudan etkili olduğu görülmektedir. Bu tür operasyonel kesintiler; şirketin çeyreklik teslimat hacmini ve kapasite kullanım oranını geçici olarak düşürdüğü için, piyasa tarafından gelecekteki ciro ve nakit yaratma potansiyelinde dönemsel bir kayıp olarak fiyatlanarak satış baskısı yaratmaktadır.`;
            } else if (titleLower.includes('faiz') || titleLower.includes('finansman maliyet') || titleLower.includes('borç') || titleLower.includes('kredi')) {
                researchConclusion = `Yaptığımız makroekonomik araştırmalara göre; yükselen piyasa faizlerinin getirdiği finansman yükü ve borçlanma maliyetlerinin ${fallingSubject} üzerinde hissedildiği görülmektedir. Yüksek faiz ortamı; şirketin işletme sermayesi finansmanını zorlaştırıp net kârlılık potansiyelini baskıladığı için, yatırımcıların şirketin büyüme beklentilerini daha temkinli bir banda çekmesine yol açmaktadır.`;
            } else {
                researchConclusion = `Bizim tarafta sizlere doğrudan aktarabileceğimiz kesinleşmiş bir bulgu veya şirket bazlı somut bir neden tespit edilemediği için, dilerseniz bu varlık hakkında kendi araştırmanızı yaparak hareketin arka planı hakkında daha detaylı bilgi sahibi olabilirsiniz.`;
            }
        } else {
            researchConclusion = `Bizim tarafta sizlere doğrudan aktarabileceğimiz kesinleşmiş bir bulgu veya şirket bazlı somut bir neden tespit edilemediği için, dilerseniz bu varlık hakkında kendi araştırmanızı yaparak hareketin arka planı hakkında daha detaylı bilgi sahibi olabilirsiniz.`;
        }

        const paragraph2 = `Zarar tablosuna baktığımızda ise; portföy getirisini en çok gerileten hisse, net **-${lossTLFormatted} TL** kayıp yaşatan **${topLosingAsset.cleanSymbol}** oldu. ${sectorLossText} ${researchConclusion}`.trim();
        paragraphs.push(paragraph2);
    }

    // Key Movements Listesi (Katkı payı kaldırıldı, tamamen net TL değişimi)
    const keyMovements: KeyMovementItem[] = [];
    if (topGainingAsset) {
        keyMovements.push({
            symbol: topGainingAsset.cleanSymbol,
            sector: topGainingAsset.sector,
            returnTL: topGainingAsset.monthlyReturnTL,
            isGain: true,
            story: winningNews?.title || `${topGainingAsset.sector} sektöründeki genel talep artışı ile portföyü sırtladı.`,
            newsUrl: winningNews?.url
        });
    }
    if (topLosingAsset && topLosingAsset.cleanSymbol !== topGainingAsset?.cleanSymbol) {
        keyMovements.push({
            symbol: topLosingAsset.cleanSymbol,
            sector: topLosingAsset.sector,
            returnTL: topLosingAsset.monthlyReturnTL,
            isGain: false,
            story: fallingFinding?.title || `Piyasa genelindeki sektörel kâr realizasyonları fiyat üzerinde baskı oluşturdu.`,
            newsUrl: fallingFinding?.url
        });
    }

    const mentorSummary: MentorStorytellingBlock = {
        title: `${period.monthLabel} Performans ve Mentör Analizi`,
        userName: politeGreetingName,
        greetingSentence,
        narrativeParagraphs: paragraphs,
        topGainingAsset: topGainingAsset ? {
            symbol: topGainingAsset.cleanSymbol,
            sector: topGainingAsset.sector,
            gainTL: topGainingAsset.monthlyReturnTL,
            story: winningNews?.title || `${topGainingAsset.sector} sektöründeki güçlü talep ile portföyü sırtladı.`
        } : null,
        topGainingSector: topGainingSector ? {
            sectorName: topGainingSector.name,
            gainTL: topGainingSector.monthlyReturnTL
        } : null,
        topLosingAsset: topLosingAsset ? {
            symbol: topLosingAsset.cleanSymbol,
            sector: topLosingAsset.sector,
            lossTL: topLosingAsset.monthlyReturnTL,
            story: fallingFinding?.title || `Sektörel kâr realizasyonları fiyat üzerinde baskı oluşturdu.`,
            newsFinding: fallingFinding?.title
        } : null,
        topLosingSector: topLosingSector ? {
            sectorName: topLosingSector.name,
            lossTL: topLosingSector.monthlyReturnTL
        } : null,
        keyMovements,
        topContributors: computedAssets.slice(0, 3).map(a => ({
            symbol: a.cleanSymbol,
            sector: a.sector,
            returnPct: a.monthlyReturnPct,
            contributionPct: a.contributionPct,
            contributionTL: a.contributionTL,
            returnTL: a.monthlyReturnTL,
            isGain: a.monthlyReturnTL >= 0,
            story: a.cleanSymbol === topGainingAsset?.cleanSymbol && winningNews ? winningNews.title : `${a.sector} sektöründeki performansıyla portföyde yer aldı.`
        })),
        negativeLearningMoment: null,
        sectorInsight: null,
        closingTakeaway: ''
    };

    // 8. GELECEK AY BEKLENTİLERİ MOTORUNU ÇALIŞTIR
    const nextMonthExpectations = await generateNextMonthExpectations(
        period,
        computedAssets,
        sectors,
        politeGreetingName
    );

    const cumulativeNetProfitTL = totalPortfolioVal - totalPortfolioCost;
    const cumulativeNetProfitPct = totalPortfolioCost > 0 ? (cumulativeNetProfitTL / totalPortfolioCost) * 100 : 0;
    const relativeAlphaPct = Number((monthlyNetProfitPct - bist100ReturnPct).toFixed(2));

    const summary: MonthlyReportSummary = {
        totalValue: Number(totalPortfolioVal.toFixed(2)),
        totalCost: Number(totalPortfolioCost.toFixed(2)),
        monthlyNetProfitTL: Number(monthlyNetProfitTL.toFixed(2)),
        monthlyNetProfitPct: Number(monthlyNetProfitPct.toFixed(2)),
        twrPct,
        netCapitalFlow,
        cumulativeNetProfitTL: Number(cumulativeNetProfitTL.toFixed(2)),
        cumulativeNetProfitPct: Number(cumulativeNetProfitPct.toFixed(2)),
        bist100MonthlyReturnPct: bist100ReturnPct,
        relativeAlphaPct,
        activeAssetCount: computedAssets.length,
        healthScore: Math.min(100, Math.max(50, 70 + (sectors.length * 5)))
    };

    return {
        period,
        availableMonths,
        summary,
        mentorSummary,
        nextMonthExpectations,
        sectors,
        assets: computedAssets,
        hasActiveAssets: true,
        generatedAt: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' })
    };
}
