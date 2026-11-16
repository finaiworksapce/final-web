import { NextResponse } from "next/server";
import halkarzSnapshot from "@/lib/halkarz-real-snapshot.json";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface HalkarzEarningsItem {
    symbol: string;
    companyName: string;
    link: string;
    earningsDate: string;
    period?: string;
    parsedDate?: string | null;
    timestamp: number;
    daysLeft: number;
}

function parseDateHelper(rawDate: string): { timestamp: number; daysLeft: number; parsedDateStr: string | null } {
    let timestamp = 0;
    let daysLeft = 0;
    let parsedDateStr: string | null = null;

    if (rawDate && rawDate.includes('.')) {
        const parts = rawDate.split('.');
        if (parts.length === 3) {
            const d = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const y = parseInt(parts[2], 10);
            if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d > 0 && d <= 31 && m > 0 && m <= 12 && y >= 2020) {
                const parsedDate = new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00.000Z`);
                if (!isNaN(parsedDate.getTime())) {
                    timestamp = parsedDate.getTime();
                    daysLeft = Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
                    parsedDateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                }
            }
        }
    }

    return { timestamp, daysLeft, parsedDateStr };
}

function toTrDate(unixSec: any): { tr: string; iso: string } | null {
    if (!unixSec || typeof unixSec !== 'number') return null;
    const iso = new Date(unixSec * 1000).toISOString().slice(0, 10);
    const [y, m, d] = iso.split('-');
    return { tr: `${d}.${m}.${y}`, iso };
}

export async function GET() {
    try {
        const uniqueItemsMap = new Map<string, HalkarzEarningsItem>();

        // 1. Öncelik: halkarz.com/bilanco-takvimi/ (bilanco.php)
        try {
            const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/bilanco.php?v=${Date.now()}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://halkarz.com/bilanco-takvimi/'
                },
                cache: 'no-store',
                signal: AbortSignal.timeout(3500)
            });

            if (response.ok) {
                const rawData = await response.json();
                if (Array.isArray(rawData)) {
                    rawData.forEach((item: any) => {
                        const symbol = (item.b_bistkod || '').toUpperCase().trim();
                        if (!symbol || symbol === '...' || symbol === '-') return;

                        const rawDate = (item.b_tarih || '').trim();
                        if (!rawDate || rawDate === '...' || rawDate === '-') return;

                        const key = `${symbol}_${rawDate}`;
                        if (!uniqueItemsMap.has(key)) {
                            const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(rawDate);
                            uniqueItemsMap.set(key, {
                                symbol,
                                companyName: item.b_sirket || symbol,
                                link: item.b_link && item.b_link !== '#' ? item.b_link : '',
                                earningsDate: rawDate,
                                period: item.b_donem || '2026/3Ç',
                                parsedDate: parsedDateStr,
                                timestamp,
                                daysLeft
                            });
                        }
                    });
                }
            }
        } catch {
            // halkarz.com yanıt vermezse veya boş şablon dönerse resmi BIST bilanço takvimi kullanılır
        }

        // 2. halkarz.com üzerinde aktif bilanço satırı yoksa ("..."), TradingView BIST resmi bilanço takviminden canlı çek
        if (uniqueItemsMap.size === 0) {
            try {
                const tvRes = await fetch('https://scanner.tradingview.com/turkey/scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filter: [{ left: 'type', operation: 'equal', right: 'stock' }],
                        columns: ['name', 'description', 'earnings_release_date', 'earnings_release_next_date', 'market_cap_basic'],
                        sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
                        range: [0, 120]
                    }),
                    cache: 'no-store',
                    signal: AbortSignal.timeout(4000)
                });

                if (tvRes.ok) {
                    const tvJson = await tvRes.json();
                    (tvJson.data || []).forEach((row: any) => {
                        const [sym, desc, prevSec, nextSec] = row.d || [];
                        if (!sym || sym === 'ISBTR' || sym === 'ISKUR' || sym === 'KRDMA' || sym === 'KRDMB') return;
                        const prevD = toTrDate(prevSec);
                        const nextD = toTrDate(nextSec);

                        if (prevD && prevD.iso >= '2026-10-20' && prevD.iso <= '2026-12-31') {
                            const key = `${sym}_${prevD.tr}`;
                            if (!uniqueItemsMap.has(key)) {
                                const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(prevD.tr);
                                uniqueItemsMap.set(key, {
                                    symbol: sym,
                                    companyName: desc || sym,
                                    link: `https://www.kap.org.tr/tr/arama?keyword=${sym}`,
                                    earningsDate: prevD.tr,
                                    period: '2026/3Ç',
                                    parsedDate: parsedDateStr,
                                    timestamp,
                                    daysLeft
                                });
                            }
                        }

                        if (nextD && nextD.iso >= '2026-11-15' && nextD.iso <= '2027-03-15') {
                            const key = `${sym}_${nextD.tr}`;
                            if (!uniqueItemsMap.has(key)) {
                                const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(nextD.tr);
                                uniqueItemsMap.set(key, {
                                    symbol: sym,
                                    companyName: desc || sym,
                                    link: `https://www.kap.org.tr/tr/arama?keyword=${sym}`,
                                    earningsDate: nextD.tr,
                                    period: nextD.iso <= '2026-12-31' ? '2026/3Ç' : '2026/4Ç',
                                    parsedDate: parsedDateStr,
                                    timestamp,
                                    daysLeft
                                });
                            }
                        }
                    });
                }
            } catch {
                // TradingView erişilemezse snapshot kullanılır
            }
        }

        // 3. Yedek: Doğrulanmış gerçek BIST bilanço snapshot'ı
        if (uniqueItemsMap.size === 0) {
            ((halkarzSnapshot as any).earnings || []).forEach((item: any) => {
                const key = `${item.symbol}_${item.earningsDate}`;
                if (!uniqueItemsMap.has(key)) {
                    const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(item.earningsDate);
                    uniqueItemsMap.set(key, {
                        symbol: item.symbol,
                        companyName: item.companyName || item.symbol,
                        link: item.link || '',
                        earningsDate: item.earningsDate,
                        period: item.period || '2026/3Ç',
                        parsedDate: parsedDateStr,
                        timestamp,
                        daysLeft
                    });
                }
            });
        }

        const items = Array.from(uniqueItemsMap.values());
        items.sort((a, b) => a.timestamp - b.timestamp);

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items,
            source: "https://halkarz.com/bilanco-takvimi/",
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("HalkArz Bilanço API hatası:", error);
        return NextResponse.json({ success: false, error: error.message || "Bilanço verisi çekilemedi." }, { status: 500 });
    }
}
