import { NextRequest, NextResponse } from 'next/server';
import { generateFinAiReport } from '@/lib/finai-report-service';
import { generateWeeklyPerformanceReport } from '@/lib/finai-weekly-report-service';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId') || undefined;
        const tfParam = request.nextUrl.searchParams.get('timeframe') as any;
        const timeframe = (tfParam === 'monthly' || tfParam === 'all-time') ? tfParam : 'weekly';
        const weekIndex = parseInt(request.nextUrl.searchParams.get('weekIndex') || '0', 10);

        // PDF İsterlerine Göre Haftalık Özet ve Sektörel Performans Servisi
        const [weeklyReport, legacyReport] = await Promise.all([
            generateWeeklyPerformanceReport(userId, isNaN(weekIndex) ? 0 : weekIndex),
            generateFinAiReport(timeframe, userId).catch(() => null)
        ]);

        const combinedData = {
            ...(legacyReport || {}),
            weeklyReport,
            // Fallback narrative ve metrikler haftalık rapordan öncelikli beslenir
            narrativeText: weeklyReport?.aiLiteracyBlocks?.lastWeekSummary?.text || legacyReport?.narrativeText || "",
            diffValue: weeklyReport?.summary?.weeklyNetProfitTL ?? legacyReport?.diffValue ?? 0,
            diffPercent: weeklyReport?.summary?.weeklyNetProfitPct ?? legacyReport?.diffPercent ?? 0,
            currentTotal: weeklyReport?.summary?.totalValue ?? legacyReport?.currentTotal ?? 0
        };

        return NextResponse.json({ 
            success: true, 
            data: combinedData,
            weeklyReport 
        });
    } catch (error: any) {
        console.error("FinAi report route error:", error);
        return NextResponse.json({ success: false, error: "Rapor üretilemedi" }, { status: 500 });
    }
}
