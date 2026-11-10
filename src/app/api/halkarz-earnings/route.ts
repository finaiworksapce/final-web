import { NextResponse } from "next/server";

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

export async function GET() {
    try {
        const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/bilanco.php?v=${Date.now()}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "HalkArz Bilanço API yanıt vermedi." }, { status: 500 });
        }

        const rawData = await response.json();

        if (!Array.isArray(rawData)) {
            return NextResponse.json({ success: false, error: "Geçersiz bilanço verisi alındı." }, { status: 500 });
        }

        const uniqueItemsMap = new Map<string, HalkarzEarningsItem>();

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

        const items = Array.from(uniqueItemsMap.values());

        // Kronolojik sıralama (En yakın tarihten en uzağa)
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
