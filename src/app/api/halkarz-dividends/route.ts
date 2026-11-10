import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface HalkarzDividendItem {
    symbol: string;
    companyName: string;
    link: string;
    netAmountPerShare: number;
    netAmountFormatted: string;
    yieldPercent: number;
    paymentDate: string;
    parsedDate?: string | null;
    timestamp: number;
}

export async function GET() {
    try {
        const response = await fetch(`https://halkarz.com/wp-content/themes/halkarz/api/temettu.php?v=${Date.now()}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json({ success: false, error: "HalkArz API yanıt vermedi." }, { status: 500 });
        }

        const rawData = await response.json();

        if (!Array.isArray(rawData)) {
            return NextResponse.json({ success: false, error: "Geçersiz veri formatı alındı." }, { status: 500 });
        }

        const uniqueItemsMap = new Map<string, HalkarzDividendItem>();

        rawData.forEach((item: any) => {
            const symbol = (item.t_bistkod || '').toUpperCase().trim();
            if (!symbol || symbol === '...' || symbol === '-') return;

            const rawDate = (item.t_tarih || '').trim();
            const netAmount = parseFloat(item.t_net || '0');
            const yieldVal = parseFloat(item.t_verim || '0');

            // Tutar veya verimi 0 olan kayıtları filtrele
            if (netAmount <= 0 && yieldVal <= 0) return;

            const key = `${symbol}_${rawDate}_${netAmount}`;

            if (!uniqueItemsMap.has(key)) {
                let timestamp = 0;
                let parsedDateStr: string | null = null;
                if (rawDate && rawDate !== '...' && rawDate.includes('.')) {
                    const parts = rawDate.split('.');
                    if (parts.length === 3) {
                        const d = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        const y = parseInt(parts[2], 10);
                        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d > 0 && d <= 31 && m > 0 && m <= 12 && y >= 2020) {
                            const parsedDate = new Date(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00.000Z`);
                            if (!isNaN(parsedDate.getTime())) {
                                timestamp = parsedDate.getTime();
                                parsedDateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                            }
                        }
                    }
                }

                uniqueItemsMap.set(key, {
                    symbol,
                    companyName: item.t_sirket || '',
                    link: item.t_link || '',
                    netAmountPerShare: netAmount,
                    netAmountFormatted: `${netAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ₺`,
                    yieldPercent: yieldVal,
                    paymentDate: rawDate === '...' || !rawDate ? 'Açıklanmadı' : rawDate,
                    parsedDate: parsedDateStr,
                    timestamp
                });
            }
        });

        const items = Array.from(uniqueItemsMap.values());

        // Tarihi belli olanlar en yakın tarihten uzağa, tarihi açıklanmayanlar en altta
        items.sort((a, b) => {
            if (a.timestamp > 0 && b.timestamp === 0) return -1;
            if (a.timestamp === 0 && b.timestamp > 0) return 1;
            if (a.timestamp > 0 && b.timestamp > 0) return a.timestamp - b.timestamp;
            return a.symbol.localeCompare(b.symbol);
        });

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items,
            source: "https://halkarz.com/temettu-takvimi/",
            updatedAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("HalkArz Temettü API hatası:", error);
        return NextResponse.json({ success: false, error: error.message || "Temettü verisi çekilemedi." }, { status: 500 });
    }
}
