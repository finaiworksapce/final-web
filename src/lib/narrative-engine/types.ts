export type WhitelistedSource = 'cnbce' | 'paramedya' | 'investing';

export interface RawNewsItem {
  id: string;
  source: WhitelistedSource;
  sourceLabel: string;
  title: string;
  link: string;
  date: string;
  content?: string;
  snippet?: string;
  author?: string;
}

export interface FilteredNewsItem extends RawNewsItem {
  isPrNoise: boolean;
  materialityScore: number;
  matchedKeywords: string[];
  discardReason?: string;
}

/**
 * Her bir haber için üretilen 2 ila 4 cümlelik bağımsız özet modeli.
 * Eklenen sayfalar bu nesneyi alıp dilediği gibi kullanıcıya hitapla birleştirebilir.
 */
export interface ProcessedNewsSummary {
  id: string;
  source: WhitelistedSource;
  sourceLabel: string;
  title: string;
  date: string;
  link: string;
  category: string;
  summary: string; // 2 ile 4 cümlelik net ve doğrudan haber özeti
  sentenceCount: number; // 2-4 arası
  keyTakeaway: string; // 1 cümlelik vurucu nokta
}

export interface PeerBenchmarkResult {
  symbol: string;
  sectorName: string;
  peers: {
    symbol: string;
    companyName?: string;
    newsCount: number;
    topHeadline?: string;
  }[];
  divergenceType: 'SECTOR_WIDE_SELLOFF' | 'IDIOSYNCRATIC_DIVERGENCE' | 'INSUFFICIENT_PEER_DATA';
  explanation: string;
}

export interface InverseLogicResult {
  hasAnomaly: boolean;
  verifiedPattern?: 'PRICED_IN_EXPECTATION' | 'CASHFLOW_OR_ONE_OFF' | 'MACRO_OVERSHADOW' | 'UNEXPLAINED';
  rationale?: string;
  sourceReference?: string;
}

export type NarrativeEngineMode = 'MONTHLY_REPORT' | 'ANALYSIS_INTENT';

export interface NarrativeEngineParams {
  symbol: string;
  mode?: NarrativeEngineMode;
  dateRange?: {
    from: string;
    to: string;
  };
  customIntent?: string;
}

export interface CitationItem {
  source: WhitelistedSource;
  sourceLabel: string;
  title: string;
  date: string;
  link: string;
  snippet: string;
}

export interface NarrativeEngineResult {
  symbol: string;
  mode: NarrativeEngineMode;
  sectorName: string;
  rawNewsCount: number;
  filteredNewsCount: number;
  discardedNoiseCount: number;
  newsItems: FilteredNewsItem[];
  summaries: ProcessedNewsSummary[]; // Her haber için 2-4 cümlelik bağımsız özetler
  peerBenchmark: PeerBenchmarkResult;
  inverseLogic: InverseLogicResult;
  plainSummary: string; // Toplu konsolide özet
  honestFallback: boolean;
  citations: CitationItem[];
  telemetryId: string;
  durationMs: number;
}
