export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { FinAiNarrativeEngine } from '@/lib/narrative-engine/engine';
import { NarrativeEngineParams } from '@/lib/narrative-engine/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const symbol = (body.symbol || 'TERA').toString().toUpperCase().trim();
    const customIntent = body.customIntent ? String(body.customIntent) : undefined;

    const params: NarrativeEngineParams = {
      symbol,
      customIntent
    };

    const result = await FinAiNarrativeEngine.execute(params);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Narrative Simulator API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen simülasyon hatası'
      },
      { status: 500 }
    );
  }
}
