import { PeerBenchmarkResult } from '../types';
import { sectorMapping } from '@/data/sectorMapping';

const SECTOR_PEER_MAP: Record<string, string[]> = {
  // Havacılık & Ulaştırma
  THYAO: ['PGSUS', 'TAVHL', 'CLEBI'],
  PGSUS: ['THYAO', 'TAVHL', 'CLEBI'],
  TAVHL: ['THYAO', 'PGSUS', 'CLEBI'],

  // Demir Çelik & Temel Metaller
  EREGL: ['KRDMD', 'ISDMR', 'CEMTS'],
  KRDMD: ['EREGL', 'ISDMR', 'CEMTS'],
  ISDMR: ['EREGL', 'KRDMD', 'CEMTS'],

  // Bankacılık
  GARAN: ['AKBNK', 'YKBNK', 'ISCTR'],
  AKBNK: ['GARAN', 'YKBNK', 'ISCTR'],
  YKBNK: ['GARAN', 'AKBNK', 'ISCTR'],
  ISCTR: ['GARAN', 'AKBNK', 'YKBNK'],

  // Enerji & Rafineri
  TUPRS: ['PETKM', 'AYGAZ', 'AKSEN'],
  PETKM: ['TUPRS', 'SASA', 'HEKTS'],
  AKSEN: ['ENJSA', 'GWIND', 'ASTOR'],
  ASTOR: ['EUPWR', 'CWENE', 'ALFAS'],

  // Perakende & Gıda
  BIMAS: ['MGROS', 'SOKM', 'MAVI'],
  MGROS: ['BIMAS', 'SOKM', 'CRFSA'],
  SOKM: ['BIMAS', 'MGROS', 'TKNSA'],

  // Otomotiv
  FROTO: ['TOASO', 'TTRAK', 'DOAS'],
  TOASO: ['FROTO', 'TTRAK', 'DOAS'],
  DOAS: ['FROTO', 'TOASO', 'TTRAK'],

  // Telekom & Teknoloji
  TCELL: ['TTKOM'],
  TTKOM: ['TCELL'],
  ASELS: ['SDTTR', 'KFEIN', 'ARDYZ'],

  // Holdingler
  KCHOL: ['SAHOL', 'AGHOL', 'DOHOL'],
  SAHOL: ['KCHOL', 'AGHOL', 'DOHOL'],
  SISE: ['KCHOL', 'SAHOL', 'CMENT']
};

export function getSectorPeers(symbol: string): { sectorName: string; peerSymbols: string[] } {
  const cleanSymbol = symbol.toUpperCase().trim();
  const sectorName = sectorMapping[cleanSymbol] || 'BIST Şirket';
  let peers = SECTOR_PEER_MAP[cleanSymbol] || [];

  // Fallback: If not explicitly hardcoded, find peers sharing the same sector from sectorMapping
  if (peers.length === 0 && sectorName !== 'BIST Şirket') {
    peers = Object.entries(sectorMapping)
      .filter(([sym, sec]) => sec === sectorName && sym !== cleanSymbol)
      .slice(0, 3)
      .map(([sym]) => sym);
  }

  // Fallback: Default to major liquid benchmark tickers if sector has no peers
  if (peers.length === 0) {
    peers = ['BIST100'];
  }

  return { sectorName, peerSymbols: peers };
}

export function evaluatePeerBenchmark(
  symbol: string,
  targetMonthlyChange: number | undefined,
  peerNewsSummary: { symbol: string; newsCount: number; topHeadline?: string }[]
): PeerBenchmarkResult {
  const { sectorName, peerSymbols } = getSectorPeers(symbol);

  if (peerSymbols.length === 0) {
    return {
      symbol,
      sectorName,
      peers: [],
      divergenceType: 'INSUFFICIENT_PEER_DATA',
      explanation: `${sectorName} sektöründe doğrudan karşılaştırılabilir akran veri seti kısıtlıdır.`
    };
  }

  const mappedPeers = peerSymbols.map(pSym => {
    const found = peerNewsSummary.find(p => p.symbol === pSym);
    return {
      symbol: pSym,
      newsCount: found?.newsCount || 0,
      topHeadline: found?.topHeadline || `${pSym} akran izlemesi`
    };
  });

  // If monthly change is negative (e.g. -10%), check if peers also have negative news
  let divergenceType: PeerBenchmarkResult['divergenceType'] = 'IDIOSYNCRATIC_DIVERGENCE';
  let explanation = '';

  const totalPeerNews = mappedPeers.reduce((acc, p) => acc + p.newsCount, 0);

  if (totalPeerNews > 3) {
    divergenceType = 'SECTOR_WIDE_SELLOFF';
    explanation = `${sectorName} sektöründeki akranlar (${peerSymbols.join(', ')}) da bu ay yoğun haber akışına maruz kalmıştır. Düşüşün ana ekseni sektör genelini etkileyen ortak dinamiklerle paralellik göstermektedir.`;
  } else {
    divergenceType = 'IDIOSYNCRATIC_DIVERGENCE';
    explanation = `Sektör akranlarında (${peerSymbols.join(', ')}) belirgin bir kriz veya ortak haber baskısı görülmemektedir. Gelişmeler büyük ölçüde ${symbol} şirketinin kendi iç kararları veya bilançosu kaynaklıdır.`;
  }

  return {
    symbol,
    sectorName,
    peers: mappedPeers,
    divergenceType,
    explanation
  };
}
