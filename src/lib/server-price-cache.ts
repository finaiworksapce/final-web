import { fetchLiveCommoditiesAndCrypto } from './commodities-crypto';

export interface CachedPrice {
    symbol: string;
    regularMarketPrice: number;
    currency?: string;
    updatedAt: number;
}

// In-Memory Global Price Storage
const globalPriceCache = new Map<string, CachedPrice>();
const CACHE_TTL_MS = 60 * 1000; // 1 Dakikalık Canlı Önbellek

/**
 * Sunucu önbelleğinden fiyatları getirir. Süresi dolanlar için canlı sorgu atar.
 */
export async function getOrFetchCachedPrices(symbols: string[]): Promise<Record<string, number>> {
    const now = Date.now();
    const result: Record<string, number> = {};
    const missingSymbols: string[] = [];

    // 1. Önbellekte geçerli olanları hemen topla
    symbols.forEach(sym => {
        const symUpper = sym.toUpperCase();
        const cached = globalPriceCache.get(symUpper);
        if (cached && (now - cached.updatedAt) < CACHE_TTL_MS) {
            result[symUpper] = cached.regularMarketPrice;
            if (symUpper.endsWith('.IS')) {
                result[symUpper.replace(/\.IS$/, '')] = cached.regularMarketPrice;
            }
        } else {
            missingSymbols.push(symUpper);
        }
    });

    // 2. Önbellekte eksik olanlar için toplu hızlı sorgu at
    if (missingSymbols.length > 0) {
        try {
            const fetchedPrices = await fetchLiveBatchPrices(missingSymbols);
            Object.entries(fetchedPrices).forEach(([sym, price]) => {
                const symUpper = sym.toUpperCase();
                result[symUpper] = price;
                if (symUpper.endsWith('.IS')) {
                    result[symUpper.replace(/\.IS$/, '')] = price;
                }

                // Önbelleği güncelle
                globalPriceCache.set(symUpper, {
                    symbol: symUpper,
                    regularMarketPrice: price,
                    updatedAt: now
                });
            });
        } catch (e) {
            console.error("Server price cache batch fetch error:", e);
        }
    }

    return result;
}

/**
 * Toplu Canlı Fiyat Çekme Yardımcısı (Yahoo Finance + Commodity + Crypto)
 */
async function fetchLiveBatchPrices(symbols: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    const uniqueSymbols = Array.from(new Set(symbols.map(s => s.trim().toUpperCase()))).filter(Boolean);

    if (uniqueSymbols.length === 0) return prices;

    // Cash
    prices['NAKİT'] = 1;
    prices['TRY'] = 1;
    prices['TL'] = 1;

    // Commodity & Crypto
    try {
        const liveMap = await fetchLiveCommoditiesAndCrypto();
        Object.entries(liveMap).forEach(([k, item]: [string, any]) => {
            if (item && item.regularMarketPrice) {
                prices[k.toUpperCase()] = item.regularMarketPrice;
            }
        });
    } catch (e) {
        console.error("Commodities fetch error in cache engine:", e);
    }

    // Stocks & Yahoo Finance via authenticated yahoo-finance2 client
    const stockSymbols = uniqueSymbols.filter(s => s !== 'NAKİT' && s !== 'TRY' && s !== 'TL');
    if (stockSymbols.length > 0) {
        const formattedSymbols = stockSymbols.map(s => s.endsWith('.IS') || s.includes('=') ? s : `${s}.IS`);
        try {
            // Lazy load / instantiate yahoo-finance2 to ensure reliable server-side crumb & cookie handling
            const yfModule = require('yahoo-finance2');
            const YahooFinanceClass = yfModule.YahooFinance || yfModule.default?.YahooFinance || yfModule.default;
            const yahooFinance = new YahooFinanceClass({ suppressNotices: ['yahooSurvey'] });

            const quotesResult = await yahooFinance.quote(formattedSymbols);
            const quotes = Array.isArray(quotesResult) ? quotesResult : (quotesResult ? [quotesResult] : []);

            quotes.forEach((q: any) => {
                if (q && q.symbol && typeof q.regularMarketPrice === 'number') {
                    const symUpper = q.symbol.toUpperCase();
                    prices[symUpper] = q.regularMarketPrice;
                    if (symUpper.endsWith('.IS')) {
                        prices[symUpper.replace(/\.IS$/, '')] = q.regularMarketPrice;
                    }
                }
            });
        } catch (e) {
            console.error("Batch Yahoo fetch error in cache engine:", e);
        }
    }

    return prices;
}
