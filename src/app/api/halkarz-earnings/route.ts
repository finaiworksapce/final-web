import { NextResponse } from "next/server";
import fallbackEarnings from "@/lib/earnings-db.json";

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
    let timestamp = Date.now();
    let daysLeft = 0;
    let parsedDateStr: string | null = null;

    if (rawDate && rawDate.includes('.')) {
        const parts = rawDate.split('.');
        if (parts.length === 3) {
            const parsedDate = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T00:00:00.000Z`);
            if (!isNaN(parsedDate.getTime())) {
                timestamp = parsedDate.getTime();
                daysLeft = Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
                parsedDateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }
    }

    return { timestamp, daysLeft, parsedDateStr };
}

export async function GET() {
    try {
        const uniqueItemsMap = new Map<string, HalkarzEarningsItem>();

        try {
            const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/bilanco.php?v=${Date.now()}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                },
                next: { revalidate: 3600 } // 1 saat önbellek
            });

            if (response.ok) {
                const rawData = await response.json();
                if (Array.isArray(rawData)) {
                    rawData.forEach((item: any) => {
                        const symbol = (item.b_bistkod || '').toUpperCase().trim();
                        if (!symbol || symbol === '...') return;

                        const rawDate = item.b_tarih || '';
                        if (!rawDate || rawDate === '...') return;

                        const key = `${symbol}_${rawDate}`;
                        if (!uniqueItemsMap.has(key)) {
                            const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(rawDate);
                            uniqueItemsMap.set(key, {
                                symbol,
                                companyName: item.b_sirket || symbol,
                                link: item.b_link || '',
                                earningsDate: rawDate,
                                period: item.b_donem || undefined,
                                parsedDate: parsedDateStr,
                                timestamp,
                                daysLeft
                            });
                        }
                    });
                }
            }
        } catch (fetchErr) {
            console.warn("HalkArz Bilanço canlı veri çekilemedi, yerleşik veri seti kullanılacak:", fetchErr);
        }

        // Eğer harici API'den gelen veri boş veya 5'ten az ise yerleşik BIST Bilanço Takvimi veritabanı ile zenginleştir/fallback sağla
        if (uniqueItemsMap.size < 5) {
            (fallbackEarnings as any[]).forEach((item) => {
                const symbol = (item.symbol || '').toUpperCase().trim();
                const rawDate = item.earningsDate || '';
                const key = `${symbol}_${item.period || ''}_${rawDate}`;

                if (!uniqueItemsMap.has(key)) {
                    const { timestamp, daysLeft, parsedDateStr } = parseDateHelper(rawDate);
                    uniqueItemsMap.set(key, {
                        symbol,
                        companyName: item.companyName || symbol,
                        link: item.link || '',
                        earningsDate: rawDate,
                        period: item.period || '2026/3Ç',
                        parsedDate: parsedDateStr,
                        timestamp,
                        daysLeft
                    });
                }
            });
        }

        const items = Array.from(uniqueItemsMap.values());

        // En yakından uzağa sıralama
        items.sort((a, b) => a.timestamp - b.timestamp);

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items,
            source: uniqueItemsMap.size >= 5 ? "https://halkarz.com/bilanco-takvimi/" : "FinAi BIST Bilanço Veritabanı",
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("Bilanço API hatası:", error);
        return NextResponse.json({ success: false, error: error.message || "Bilanço verisi çekilemedi." }, { status: 500 });
    }
}
