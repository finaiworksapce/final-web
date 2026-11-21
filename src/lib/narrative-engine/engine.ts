import { NarrativeEngineParams, NarrativeEngineResult, RawNewsItem, ProcessedNewsSummary } from './types';
import { fetchCnbceNews } from './sources/cnbce';
import { fetchParamedyaNews } from './sources/paramedya';
import { fetchInvestingNews } from './sources/investing';
import { filterAndDeduplicateNews } from './filters/noise-filter';
import { getSectorPeers, evaluatePeerBenchmark } from './attribution/peer-benchmark';
import { evaluateInverseLogic } from './attribution/inverse-logic';
import { synthesizeNarrative } from './synthesizer/gemini-synthesizer';

export class FinAiNarrativeEngine {
  public static readonly VERSION = '1.3.0-itemized-summaries';
  public static readonly WHITELISTED_DOMAINS = [
    'cnbce.com',
    'tr.investing.com',
    'paramedya.com'
  ];

  /**
   * Main Execution Pipeline - Full Analysis Package
   */
  public static async execute(params: NarrativeEngineParams): Promise<NarrativeEngineResult> {
    const startTime = Date.now();
    const cleanSymbol = params.symbol.toUpperCase().trim();
    const mode = params.mode || 'MONTHLY_REPORT';
    const { sectorName, peerSymbols } = getSectorPeers(cleanSymbol);

    // 1. Fetch raw news in parallel from the 3 Whitelisted Sources
    const query = cleanSymbol;
    const [cnbceNews, paramedyaNews, investingNews] = await Promise.all([
      fetchCnbceNews(query),
      fetchParamedyaNews(query),
      fetchInvestingNews(query)
    ]);

    const allRawNews: RawNewsItem[] = [
      ...cnbceNews,
      ...paramedyaNews,
      ...investingNews
    ];

    // 2. Semantik Gürültü ve PR Filtresi (Madde 5)
    const { filtered, discardedCount } = filterAndDeduplicateNews(allRawNews);

    // 3. Akran Kıyaslamalı Çapraz Kontrol (Madde 2)
    const peerMetrics = peerSymbols.map(peerSym => {
      const matchCount = allRawNews.filter(n => n.title.toUpperCase().includes(peerSym)).length;
      return {
        symbol: peerSym,
        newsCount: matchCount
      };
    });

    const peerBenchmark = evaluatePeerBenchmark(
      cleanSymbol,
      undefined,
      peerMetrics
    );

    // 4. Tersine Mantık Denetçisi
    const inverseLogic = evaluateInverseLogic(
      cleanSymbol,
      undefined,
      filtered
    );

    // 5. Her Bir Haber İçin 2-4 Cümlelik Bağımsız Özetler & Toplu Sentez
    const { plainSummary, summaries, honestFallback, citations } = await synthesizeNarrative({
      symbol: cleanSymbol,
      mode,
      sectorName,
      customIntent: params.customIntent,
      cleanNews: filtered,
      peerBenchmark,
      inverseLogic
    });

    const durationMs = Date.now() - startTime;
    const telemetryId = `narrative-${cleanSymbol}-${Date.now()}`;

    return {
      symbol: cleanSymbol,
      mode,
      sectorName,
      rawNewsCount: allRawNews.length,
      filteredNewsCount: filtered.filter(f => !f.isPrNoise).length,
      discardedNoiseCount: discardedCount,
      newsItems: filtered,
      summaries,
      peerBenchmark,
      inverseLogic,
      plainSummary,
      honestFallback,
      citations,
      telemetryId,
      durationMs
    };
  }

  /**
   * Sayfaların tek satırda çağırabileceği hafif ve hızlı özet sağlayıcı
   * Örnek: const { summaries } = await FinAiNarrativeEngine.getNewsSummaries('THYAO');
   */
  public static async getNewsSummaries(symbol: string): Promise<{
    symbol: string;
    hasFindings: boolean;
    summaries: ProcessedNewsSummary[];
    fallbackMessage?: string;
  }> {
    const res = await this.execute({ symbol });
    return {
      symbol: res.symbol,
      hasFindings: !res.honestFallback && res.summaries.length > 0,
      summaries: res.summaries,
      fallbackMessage: res.honestFallback ? res.plainSummary : undefined
    };
  }
}
