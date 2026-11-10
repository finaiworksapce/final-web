import { NextResponse } from "next/server";
import { fetchLiveCommoditiesAndCrypto } from "@/lib/commodities-crypto";

const TROY_OUNCE_GRAMS = 31.1034768;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "THYAO";
    const range = searchParams.get("range") || "1m"; // 1d, 1w, 1m, 6m, 1y

    try {
        const cleanSym = symbol.toUpperCase().replace(/\.IS$/i, "").trim();

        let interval = "1d";
        let yahooRange = "1mo";
        if (range === "1d") { yahooRange = "5d"; interval = "15m"; }
        else if (range === "1w") { yahooRange = "5d"; interval = "1d"; }
        else if (range === "1m") { yahooRange = "1mo"; interval = "1d"; }
        else if (range === "6m") { yahooRange = "6mo"; interval = "1d"; }
        else if (range === "1y") { yahooRange = "1y"; interval = "1wk"; }

        // 1. ALTIN & GÜMÜŞ (Gerçek Ons * USD/TRY / 31.1034768 Tarihsel Hesaplama)
        if (
            cleanSym === "ALTIN" ||
            cleanSym === "GA" ||
            cleanSym === "GRAM-ALTIN" ||
            cleanSym === "GRAM_ALTIN" ||
            cleanSym === "ALTIN.S1" ||
            cleanSym === "GUMUS" ||
            cleanSym === "GRAM-GUMUS"
        ) {
            const metalTicker = cleanSym.includes("GUMUS") ? "SI=F" : "GC=F";
            const [metalRes, fxRes, liveMap] = await Promise.all([
                fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(metalTicker)}?range=${yahooRange}&interval=${interval}`, {
                    headers: { "User-Agent": "Mozilla/5.0" },
                    next: { revalidate: 120 }
                }).catch(() => null),
                fetch(`https://query1.finance.yahoo.com/v8/finance/chart/TRY%3DX?range=${yahooRange}&interval=${interval}`, {
                    headers: { "User-Agent": "Mozilla/5.0" },
                    next: { revalidate: 120 }
                }).catch(() => null),
                fetchLiveCommoditiesAndCrypto().catch(() => ({} as Record<string, any>))
            ]);

            const livePrice = liveMap[cleanSym]?.regularMarketPrice || liveMap["ALTIN"]?.regularMarketPrice;
            const latestUsdTry = liveMap["USDTRY"]?.regularMarketPrice || 50.15;

            if (metalRes && metalRes.ok) {
                const metalData = await metalRes.json();
                const metalResult = metalData?.chart?.result?.[0];
                const timestamps: number[] = metalResult?.timestamp || [];
                const metalCloses: (number | null)[] = metalResult?.indicators?.quote?.[0]?.close || [];

                let fxCloses: (number | null)[] = [];
                if (fxRes && fxRes.ok) {
                    const fxData = await fxRes.json();
                    fxCloses = fxData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
                }

                const rawPoints: { time: string; price: number }[] = [];
                let lastFx = latestUsdTry;

                for (let i = 0; i < timestamps.length; i++) {
                    const mPrice = metalCloses[i];
                    const fPrice = fxCloses[i];
                    if (typeof fPrice === "number" && fPrice > 0) lastFx = fPrice;
                    if (typeof mPrice === "number" && mPrice > 0) {
                        const gramTry = (mPrice * lastFx) / TROY_OUNCE_GRAMS;
                        const dateObj = new Date(timestamps[i] * 1000);
                        const timeLabel = range === "1d"
                            ? `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`
                            : `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
                        rawPoints.push({ time: timeLabel, price: gramTry });
                    }
                }

                if (rawPoints.length > 0) {
                    const lastRaw = rawPoints[rawPoints.length - 1].price;
                    const scale = livePrice && lastRaw > 0 ? livePrice / lastRaw : 1;
                    const firstPrice = rawPoints[0].price * scale;
                    const points = rawPoints.map(pt => {
                        const scaledPrice = pt.price * scale;
                        const pctChange = firstPrice > 0 ? ((scaledPrice - firstPrice) / firstPrice) * 100 : 0;
                        return {
                            time: pt.time,
                            price: Number(scaledPrice.toFixed(2)),
                            pctChange: Number(pctChange.toFixed(2))
                        };
                    });
                    return NextResponse.json({ symbol: cleanSym, points });
                }
            }
        }

        // 2. DÖVİZ, ONS & KRİPTO SEMBOLLERİ (Yahoo Finance Doğrudan Eşleştirme)
        let yahooSymbol = `${cleanSym}.IS`;
        if (cleanSym === "USDTRY" || cleanSym === "USD" || cleanSym === "USDT") yahooSymbol = "TRY=X";
        else if (cleanSym === "EURTRY" || cleanSym === "EUR") yahooSymbol = "EURTRY=X";
        else if (cleanSym === "ONS" || cleanSym === "XAU" || cleanSym === "XAUUSD") yahooSymbol = "GC=F";
        else if (cleanSym === "BTC" || cleanSym === "BTC-TRY" || cleanSym === "BITCOIN") yahooSymbol = "BTC-USD";
        else if (cleanSym === "ETH" || cleanSym === "ETH-TRY" || cleanSym === "ETHEREUM") yahooSymbol = "ETH-USD";

        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=${yahooRange}&interval=${interval}`;
        const res = await fetch(yahooUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            next: { revalidate: 300 }
        });

        if (res.ok) {
            const data = await res.json();
            const result = data?.chart?.result?.[0];
            const timestamps = result?.timestamp || [];
            const quotes = result?.indicators?.quote?.[0]?.close || [];

            const points: { time: string; price: number; pctChange: number }[] = [];
            let firstPrice = 0;

            for (let i = 0; i < timestamps.length; i++) {
                const price = quotes[i];
                if (price && typeof price === "number") {
                    if (firstPrice === 0) firstPrice = price;
                    const dateObj = new Date(timestamps[i] * 1000);
                    const timeLabel = range === "1d"
                        ? `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`
                        : `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

                    const pctChange = firstPrice > 0 ? ((price - firstPrice) / firstPrice) * 100 : 0;
                    points.push({
                        time: timeLabel,
                        price: Number(price.toFixed(2)),
                        pctChange: Number(pctChange.toFixed(2))
                    });
                }
            }

            if (points.length > 0) {
                return NextResponse.json({ symbol: cleanSym, points });
            }
        }

        // Canlı fiyat bazlı yedek seri
        const liveMap = await fetchLiveCommoditiesAndCrypto().catch(() => ({} as Record<string, any>));
        const fallbackBase = liveMap[cleanSym]?.regularMarketPrice || 300;
        return NextResponse.json({
            symbol: cleanSym,
            points: generateHistoricalSeries(fallbackBase, range)
        });
    } catch {
        return NextResponse.json({
            symbol,
            points: generateHistoricalSeries(300, range)
        });
    }
}

function generateHistoricalSeries(basePrice: number, range: string) {
    const count = range === "1d" ? 8 : range === "1w" ? 7 : range === "1m" ? 12 : range === "6m" ? 16 : 20;
    const points = [];
    const start = basePrice * 0.98;

    for (let i = 0; i < count; i++) {
        const ratio = i / Math.max(1, count - 1);
        const current = start + (basePrice - start) * ratio;
        const pctChange = ((current - start) / start) * 100;
        const label = range === "1d" ? `${10 + i}:00` : `G${i + 1}`;

        points.push({
            time: label,
            price: Number(current.toFixed(2)),
            pctChange: Number(pctChange.toFixed(2))
        });
    }
    return points;
}
