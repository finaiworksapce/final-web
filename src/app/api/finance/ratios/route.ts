import { NextResponse } from 'next/server';
import { fetchStockFundamentals } from '@/lib/fundamentals-service';
import { calculateFinancialRatios } from '@/lib/financial-ratio-engine';
import { fetchTvScreenerRatios } from '@/lib/services/tv-screener-ratios.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolParam = searchParams.get('symbol');

    if (!symbolParam) {
      return NextResponse.json(
        { error: 'Symbol parameter is required (e.g. ?symbol=THYAO)' },
        { status: 400 }
      );
    }

    const cleanSymbol = symbolParam.toUpperCase().replace(/^BIST:/, '').replace(/\.IS$/, '').trim();

    // 1. Primary Background Engine: TradingView Turkey Stock Screener (7 Categories, 28 Ratios)
    const screenerRatios = await fetchTvScreenerRatios(cleanSymbol);
    if (screenerRatios) {
      return NextResponse.json({
        success: true,
        data: screenerRatios
      });
    }

    // 2. Fallback: Local Fundamentals & Financial Ratio Engine if ticker not found on Turkey Screener
    const fundamentals = await fetchStockFundamentals(cleanSymbol);

    let livePrice: number | null = null;
    try {
      const yfRes = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${cleanSymbol}.IS?range=1d&interval=1d`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }
      );
      if (yfRes.ok) {
        const yfJson = await yfRes.json();
        const close = yfJson?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (close != null && !isNaN(close) && close > 0) {
          livePrice = Number(close);
        }
      }
    } catch (e) {
      console.warn(`Yahoo live price lookup fallback failed for ${cleanSymbol}:`, e);
    }

    const ratioResults = calculateFinancialRatios(fundamentals, livePrice);

    return NextResponse.json({
      success: true,
      data: ratioResults
    });
  } catch (error: any) {
    console.error('Error in /api/finance/ratios:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to calculate financial ratios' },
      { status: 500 }
    );
  }
}
