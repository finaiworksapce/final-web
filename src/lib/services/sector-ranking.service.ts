/**
 * FinAI Sector Ranking & Average Ratios Service
 * Queries TradingView Screener API for all peer companies in the target sector,
 * computes sector averages/medians, and ranks peers from best to worst for all 12 key metrics.
 */

import { SectorCategory } from '@/types/financials';
import { getSectorCategory, normalizeSymbol } from '@/lib/sector-categorizer';
import { SECTOR_PEER_MAP } from '@/lib/sector-comparison-engine';

export interface PeerRankingItem {
  rank: number;
  symbol: string;
  name: string;
  value: number | null;
  formattedValue: string;
  isCurrent: boolean;
  status: 'available' | 'negative' | 'not_applicable' | 'null';
}

export interface MetricSectorRanking {
  key: string;
  label: string;
  unitType: 'multiple' | 'percent' | 'signed_percent';
  sectorAverage: number | null;
  formattedSectorAverage: string;
  currentValue: number | null;
  formattedCurrentValue: string;
  currentRank: number | null;
  totalRanked: number;
  totalPeers: number;
  betterThanSector: boolean | null;
  differencePercent: number | null;
  summaryComment: string;
  leaderboard: PeerRankingItem[];
}

export interface SectorRankingResponse {
  symbol: string;
  sectorCategory: SectorCategory;
  sectorDisplayName: string;
  totalSectorPeers: number;
  fetchedAt: string;
  metrics: Record<string, MetricSectorRanking>;
}

const TV_SCREENER_COLUMNS = [
  'name',                                 // 0: Symbol
  'description',                          // 1: Name
  'price_earnings_ttm',                   // 2: PE
  'price_book_fq',                        // 3: PB
  'enterprise_value_ebitda_ttm',          // 4: EV/EBITDA
  'gross_margin_ttm',                     // 5: Gross Margin
  'net_margin_ttm',                       // 6: Net Margin
  'return_on_equity',                     // 7: ROE
  'net_debt_to_ebitda_fq',                // 8: Net Debt / EBITDA
  'current_ratio_fq',                     // 9: Current Ratio
  'price_free_cash_flow_ttm',             // 10: P/FCF
  'free_cash_flow_ttm',                   // 11: FCF
  'market_cap_basic',                     // 12: MCap
  'total_revenue_yoy_growth_ttm',         // 13: Rev Growth
  'ebitda_yoy_growth_ttm',                // 14: EBITDA Growth
  'net_income_yoy_growth_ttm'             // 15: Net Income Growth
];

// In-Memory Cache (3 minutes TTL)
interface CacheEntry {
  timestamp: number;
  data: Record<string, any>;
}
const sectorCache = new Map<SectorCategory, CacheEntry>();
const CACHE_TTL_MS = 3 * 60 * 1000;

function formatVal(val: number | null, unitType: 'multiple' | 'percent' | 'signed_percent'): string {
  if (val == null || !Number.isFinite(val)) return '—';
  if (unitType === 'multiple') {
    return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
  }
  if (unitType === 'percent') {
    const neg = val < 0 ? '-' : '';
    return `${neg}%${Math.abs(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  // signed_percent
  const sign = val > 0 ? '+' : val < 0 ? '-' : '';
  return `${sign}%${Math.abs(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function getSectorMetricsAndRankings(rawSymbol: string): Promise<SectorRankingResponse | null> {
  const cleanSymbol = normalizeSymbol(rawSymbol);
  const sectorInfo = getSectorCategory(cleanSymbol);
  const sectorCat: SectorCategory = sectorInfo.category || 'TRANSPORTATION';
  const sectorDisplayName = sectorInfo.displayName || 'Sektör';

  // 1. Get peer universe for this sector
  let peers = SECTOR_PEER_MAP[sectorCat] || [];
  if (!peers.includes(cleanSymbol)) {
    peers = [cleanSymbol, ...peers];
  }

  // Fallback defaults if peer map is minimal
  if (peers.length < 3) {
    peers = [cleanSymbol, 'THYAO', 'PGSUS', 'TAVHL', 'CLEBI', 'RYSAS'];
  }

  // 2. Query TradingView Turkey Screener for all peers in 1 batch request
  let rawPeerRows: any[] = [];
  const now = Date.now();
  const cached = sectorCache.get(sectorCat);

  if (cached && now - cached.timestamp < CACHE_TTL_MS && cached.data[cleanSymbol]) {
    rawPeerRows = Object.values(cached.data);
  } else {
    try {
      const tickers = peers.map((p) => `BIST:${p}`);
      const res = await fetch('https://scanner.tradingview.com/turkey/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FinAI/2.0'
        },
        body: JSON.stringify({
          symbols: { tickers },
          columns: TV_SCREENER_COLUMNS
        }),
        next: { revalidate: 180 }
      });

      if (res.ok) {
        const json = await res.json();
        rawPeerRows = json?.data || [];
        // Populate cache map
        const dataMap: Record<string, any> = {};
        for (const item of rawPeerRows) {
          const sym = String(item.d?.[0] || '').toUpperCase();
          if (sym) dataMap[sym] = item;
        }
        sectorCache.set(sectorCat, { timestamp: now, data: dataMap });
      }
    } catch (err) {
      console.warn(`[SectorRankingService] Peer batch query failed for ${sectorCat}:`, err);
    }
  }

  // 3. Parse each peer's values for the 12 metrics
  interface ParsedPeer {
    symbol: string;
    name: string;
    metrics: Record<string, number | null>;
  }

  const parsedPeers: ParsedPeer[] = [];

  for (const row of rawPeerRows) {
    const d = row?.d;
    if (!Array.isArray(d)) continue;
    const sym = String(d[0] || '').toUpperCase().trim();
    if (!sym) continue;
    const name = String(d[1] || sym).trim();

    // Helper to safely parse finite numbers
    const num = (v: any): number | null => {
      if (v == null) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // Calculate FCF yield from market cap and FCF or P/FCF
    const fcf = num(d[11]);
    const mcap = num(d[12]);
    const pfcf = num(d[10]);
    let fcfYield: number | null = null;
    if (fcf != null && mcap != null && mcap > 0) {
      fcfYield = (fcf / mcap) * 100;
    } else if (pfcf != null && pfcf > 0) {
      fcfYield = 100 / pfcf;
    }

    parsedPeers.push({
      symbol: sym,
      name,
      metrics: {
        pe: num(d[2]),
        pb: num(d[3]),
        evToEBITDA: num(d[4]),
        grossMargin: num(d[5]),
        netMargin: num(d[6]),
        roe: num(d[7]),
        netDebtToEBITDA: num(d[8]),
        currentRatio: num(d[9]),
        fcfYield,
        revenueGrowth: num(d[13]),
        ebitdaGrowth: num(d[14]),
        netIncomeGrowth: num(d[15])
      }
    });
  }

  // Ensure current stock is present in parsedPeers
  const hasCurrent = parsedPeers.some((p) => p.symbol === cleanSymbol);
  if (!hasCurrent && parsedPeers.length === 0) {
    return null;
  }

  // 4. Metric Configurations
  const METRIC_DEFS: {
    key: string;
    label: string;
    unitType: 'multiple' | 'percent' | 'signed_percent';
    sortOrder: 'asc_positive_first' | 'asc' | 'desc';
  }[] = [
    { key: 'pe', label: 'F/K', unitType: 'multiple', sortOrder: 'asc_positive_first' },
    { key: 'pb', label: 'PD/DD', unitType: 'multiple', sortOrder: 'asc_positive_first' },
    { key: 'evToEBITDA', label: 'FD/FAVÖK', unitType: 'multiple', sortOrder: 'asc_positive_first' },
    { key: 'grossMargin', label: 'Brüt Kâr Marjı', unitType: 'percent', sortOrder: 'desc' },
    { key: 'netMargin', label: 'Net Kâr Marjı', unitType: 'percent', sortOrder: 'desc' },
    { key: 'roe', label: 'Özsermaye Kârlılığı', unitType: 'percent', sortOrder: 'desc' },
    { key: 'netDebtToEBITDA', label: 'Net Borç / FAVÖK', unitType: 'multiple', sortOrder: 'asc' },
    { key: 'currentRatio', label: 'Cari Oran', unitType: 'multiple', sortOrder: 'desc' },
    { key: 'fcfYield', label: 'Serbest Nakit Verimi', unitType: 'percent', sortOrder: 'desc' },
    { key: 'revenueGrowth', label: 'Ciro Büyümesi', unitType: 'signed_percent', sortOrder: 'desc' },
    { key: 'ebitdaGrowth', label: 'FAVÖK Büyümesi', unitType: 'signed_percent', sortOrder: 'desc' },
    { key: 'netIncomeGrowth', label: 'Net Kâr Büyümesi', unitType: 'signed_percent', sortOrder: 'desc' }
  ];

  const results: Record<string, MetricSectorRanking> = {};

  for (const def of METRIC_DEFS) {
    // Collect peer items for this metric
    const itemsWithVal: { symbol: string; name: string; value: number | null }[] = [];

    for (const p of parsedPeers) {
      itemsWithVal.push({
        symbol: p.symbol,
        name: p.name,
        value: p.metrics[def.key] ?? null
      });
    }

    // Sort peers based on financial logic: En iyiden en kötüye
    const sorted = [...itemsWithVal].sort((a, b) => {
      const aVal = a.value;
      const bVal = b.value;

      // Nulls go to the very bottom
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (def.sortOrder === 'asc_positive_first') {
        // Multiples (F/K, PD/DD, FD/FAVÖK):
        // Lowest positive valuation is BEST. Negative values (loss/negative equity) go to bottom.
        const aPos = aVal > 0;
        const bPos = bVal > 0;
        if (aPos && bPos) return aVal - bVal; // 2.97x before 3.20x
        if (aPos && !bPos) return -1;
        if (!aPos && bPos) return 1;
        return bVal - aVal;
      } else if (def.sortOrder === 'asc') {
        // Net Debt / EBITDA: Lowest is best (lower debt or net cash is better)
        return aVal - bVal;
      } else {
        // desc: Margins, ROE, FCF Yield, Growth -> Higher is best
        return bVal - aVal;
      }
    });

    // Valid numeric values for calculating sector average
    const validNumericValues = sorted
      .map((s) => s.value)
      .filter((v): v is number => v != null && Number.isFinite(v));

    let sectorAverage: number | null = null;
    if (validNumericValues.length > 0) {
      // Calculate median for outlier-resistance
      const sortedNums = [...validNumericValues].sort((a, b) => a - b);
      const mid = Math.floor(sortedNums.length / 2);
      sectorAverage =
        sortedNums.length % 2 !== 0
          ? sortedNums[mid]
          : (sortedNums[mid - 1] + sortedNums[mid]) / 2;
    }

    // Build leaderboard with ranks
    let currentRank: number | null = null;
    let currentVal: number | null = null;
    let rankCounter = 1;

    const leaderboard: PeerRankingItem[] = sorted.map((item) => {
      const isCurrent = item.symbol === cleanSymbol;
      const val = item.value;
      const hasVal = val != null && Number.isFinite(val);
      const rank = hasVal ? rankCounter++ : 999;

      if (isCurrent) {
        currentRank = hasVal ? rank : null;
        currentVal = val;
      }

      let status: 'available' | 'negative' | 'not_applicable' | 'null' = 'available';
      if (!hasVal) {
        status = 'null';
      } else if (val < 0) {
        status = 'negative';
      }

      return {
        rank: hasVal ? rank : 0,
        symbol: item.symbol,
        name: item.name,
        value: val,
        formattedValue: formatVal(val, def.unitType),
        isCurrent,
        status
      };
    });

    // Re-order nulls to rank: 0 / bottom
    const totalRanked = rankCounter - 1;

    // Better than sector check
    let betterThanSector: boolean | null = null;
    let diffPct: number | null = null;

    if (currentVal != null && sectorAverage != null && sectorAverage !== 0) {
      if (def.sortOrder === 'asc_positive_first' || def.sortOrder === 'asc') {
        betterThanSector = currentVal < sectorAverage;
        diffPct = Math.round(((sectorAverage - currentVal) / sectorAverage) * 100);
      } else {
        betterThanSector = currentVal > sectorAverage;
        diffPct = Math.round(((currentVal - sectorAverage) / Math.abs(sectorAverage)) * 100);
      }
    }

    // Summary comment in Turkish
    let summaryComment = '';
    if (currentRank === 1) {
      summaryComment = `Sektörün en iyi ${def.label} oranına sahip (#1. Sırada)`;
    } else if (currentRank != null && currentRank <= 3) {
      summaryComment = `Sektörde ilk 3 lider arasında (#${currentRank}. Sırada / ${totalRanked} şirket)`;
    } else if (currentRank != null) {
      if (betterThanSector && diffPct != null && diffPct > 0) {
        summaryComment = `Sektör ortalamasından %${diffPct} daha avantajlı (${currentRank}. Sırada)`;
      } else {
        summaryComment = `Sektör sıralamasında ${currentRank}. Sırada (Toplam ${totalRanked} şirket)`;
      }
    } else {
      summaryComment = 'Bu hisse için sektör verisi hesaplanamadı';
    }

    results[def.key] = {
      key: def.key,
      label: def.label,
      unitType: def.unitType,
      sectorAverage,
      formattedSectorAverage: formatVal(sectorAverage, def.unitType),
      currentValue: currentVal,
      formattedCurrentValue: formatVal(currentVal, def.unitType),
      currentRank,
      totalRanked,
      totalPeers: sorted.length,
      betterThanSector,
      differencePercent: diffPct,
      summaryComment,
      leaderboard: leaderboard.slice(0, 10) // Top 10 peers for sleek, compact leaderboard
    };
  }

  return {
    symbol: cleanSymbol,
    sectorCategory: sectorCat,
    sectorDisplayName,
    totalSectorPeers: parsedPeers.length,
    fetchedAt: new Date().toISOString(),
    metrics: results
  };
}
