import { NextRequest, NextResponse } from 'next/server';
import { generateFinAiReport } from '@/lib/finai-report-service';
import { generateWeeklyPerformanceReport } from '@/lib/finai-weekly-report-service';
import { generateMonthlyPerformanceReport } from '@/lib/finai-monthly-report-service';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId') || undefined;
        const userName = request.nextUrl.searchParams.get('userName') || undefined;
        const tfParam = request.nextUrl.searchParams.get('timeframe') as any;
        const timeframe = (tfParam === 'monthly' || tfParam === 'all-time') ? tfParam : 'weekly';
        const weekIndex = parseInt(request.nextUrl.searchParams.get('weekIndex') || '0', 10);
        const monthIndex = parseInt(request.nextUrl.searchParams.get('monthIndex') || '0', 10);

        // Aylık ve Haftalık Rapor Servislerini Eşzamanlı Çalıştır
        const [monthlyReport, weeklyReport, legacyReport] = await Promise.all([
            generateMonthlyPerformanceReport(userId, isNaN(monthIndex) ? 0 : monthIndex, userName).catch(e => {
                console.error("Monthly report generator error:", e);
                return null;
            }),
            generateWeeklyPerformanceReport(userId, isNaN(weekIndex) ? 0 : weekIndex).catch(e => {
                console.error("Weekly report generator error:", e);
                return null;
            }),
            generateFinAiReport(timeframe, userId).catch(() => null)
        ]);

        const combinedData = {
            ...(legacyReport || {}),
            weeklyReport,
            monthlyReport,
            narrativeText: monthlyReport?.mentorSummary?.narrativeParagraphs?.join(' ') || weeklyReport?.aiLiteracyBlocks?.lastWeekSummary?.text || legacyReport?.narrativeText || "",
            diffValue: monthlyReport?.summary?.monthlyNetProfitTL ?? weeklyReport?.summary?.weeklyNetProfitTL ?? legacyReport?.diffValue ?? 0,
            diffPercent: monthlyReport?.summary?.monthlyNetProfitPct ?? weeklyReport?.summary?.weeklyNetProfitPct ?? legacyReport?.diffPercent ?? 0,
            currentTotal: monthlyReport?.summary?.totalValue ?? weeklyReport?.summary?.totalValue ?? legacyReport?.currentTotal ?? 0
        };

        return NextResponse.json({ 
            success: true, 
            data: combinedData,
            monthlyReport,
            weeklyReport 
        });
    } catch (error: any) {
        console.error("FinAi report route error:", error);
        return NextResponse.json({ success: false, error: "Rapor üretilemedi" }, { status: 500 });
    }
}
