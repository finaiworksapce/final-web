import { NextRequest, NextResponse } from "next/server";
import { runAdaptiveLiveSync } from "@/lib/calendar-adaptive-engine";
import { processNotificationEngine } from "@/lib/notification-engine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Adaptive Server-Side Otomatik Ekonomik Takvim Senkronizasyon Rotası
 * Yaklaşan olayların saatlerine göre canlı verileri tarar ve Supabase veritabanına işler.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Güvenlik Doğrulaması
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        const isVercelCron = request.headers.get('x-vercel-cron') === '1';
        if (!isVercelCron) {
            return NextResponse.json({ success: false, error: "Yetkisiz istek" }, { status: 401 });
        }
    }

    try {
        // Adaptive Live Sync Motorunu Çalıştır (Ekonomik Takvim İşleyişine Dokunulmaz)
        const stats = await runAdaptiveLiveSync();

        // Web Push Bildirim Motorunu Tetikle
        const notifStats = await processNotificationEngine();

        // HalkArz Canlı Takvim Verilerini Güncelle (Temettü, Bilanço, Halka Arz - Her gün 12:00 TRT)
        let halkarzStatus = { temettu: false, bilanco: false, ipo: false };
        try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
            const [divRes, earnRes, ipoRes] = await Promise.allSettled([
                fetch(`${baseUrl}/api/halkarz-dividends`, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } }),
                fetch(`${baseUrl}/api/halkarz-earnings`, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } }),
                fetch(`${baseUrl}/api/halkarz-ipo`, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } }),
            ]);
            halkarzStatus = {
                temettu: divRes.status === 'fulfilled' && divRes.value.ok,
                bilanco: earnRes.status === 'fulfilled' && earnRes.value.ok,
                ipo: ipoRes.status === 'fulfilled' && ipoRes.value.ok,
            };
        } catch (hErr) {
            console.warn("[CRON HALKARZ SYNC WARNING]", hErr);
        }

        return NextResponse.json({
            success: stats.status === 'success' || stats.status === 'concurrency_locked',
            message: "Adaptive Live Sync, Notification Engine ve HalkArz takvim senkronizasyonu tamamlandı.",
            stats,
            notifStats,
            halkarzStatus
        });
    } catch (error: any) {
        console.error("[ADAPTIVE CRON SYNC ERROR]", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
