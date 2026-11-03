import { NextResponse } from 'next/server';
import { getSectorMetricsAndRankings } from '@/lib/services/sector-ranking.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get('symbol');

    if (!symbolParam) {
      return NextResponse.json(
        { success: false, error: 'Symbol parameter is required (e.g. ?symbol=THYAO)' },
        { status: 400 }
      );
    }

    const cleanSymbol = symbolParam.toUpperCase().replace(/\.IS$/, '').trim();

    const data = await getSectorMetricsAndRankings(cleanSymbol);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Sector data not available for this symbol' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('Error in /api/finance/sector-ranking:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to calculate sector rankings' },
      { status: 500 }
    );
  }
}
