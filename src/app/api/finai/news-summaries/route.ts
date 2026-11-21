export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { FinAiNarrativeEngine } from '@/lib/narrative-engine/engine';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = (searchParams.get('symbol') || 'THYAO').toUpperCase().trim();

    const data = await FinAiNarrativeEngine.getNewsSummaries(symbol);

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[FinAi News Summaries API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Haber özetleri alınamadı'
      },
      { status: 500 }
    );
  }
}
