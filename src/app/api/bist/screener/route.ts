import { NextResponse } from 'next/server';

export interface BistScreenerStockItem {
  symbol: string;
  name: string;
  logoId: string | null;
  sector: string;
  currency: string;
  price: number | null;
  changePercent: number | null;
  changeAbs: number | null;
  ratingScore: number | null;
  volume: number | null;
  valueTraded: number | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  pe: number | null;
  evToEbitda: number | null;
  pb: number | null;
  ps: number | null;
  fcf: number | null;
  eps: number | null;
  employees: number | null;
  perfW: number | null;
  perf1M: number | null;
  perf3M: number | null;
  perf6M: number | null;
  perfYTD: number | null;
  perf1Y: number | null;
  volatilityD: number | null;
  dividendYield: number | null;
  dps: number | null;
  payoutRatio: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  ebitdaMargin: number | null;
  netMargin: number | null;
  roe: number | null;
  roa: number | null;
  roic: number | null;
}

const SCREENER_COLUMNS = [
  'logoid',                          // 0
  'name',                            // 1
  'description',                     // 2
  'close',                           // 3
  'currency',                        // 4
  'change',                          // 5
  'change_abs',                      // 6
  'Recommend.All',                   // 7
  'volume',                          // 8
  'Value.Traded',                    // 9
  'market_cap_basic',                // 10
  'enterprise_value_current',        // 11
  'price_earnings_ttm',              // 12
  'enterprise_value_ebitda_ttm',     // 13
  'price_book_fq',                   // 14
  'price_sales_current',             // 15
  'free_cash_flow_ttm',              // 16
  'earnings_per_share_diluted_ttm',  // 17
  'number_of_employees',             // 18
  'sector',                          // 19
  'sector.tr',                       // 20
  'Perf.W',                          // 21
  'Perf.1M',                         // 22
  'Perf.3M',                         // 23
  'Perf.6M',                         // 24
  'Perf.YTD',                        // 25
  'Perf.Y',                          // 26
  'Volatility.D',                    // 27
  'dividends_yield_current',         // 28
  'dps_common_stock_prim_issue_fy',  // 29
  'dividend_payout_ratio_ttm',       // 30
  'gross_margin_ttm',                // 31
  'operating_margin_ttm',            // 32
  'ebitda_margin_ttm',               // 33
  'net_margin_ttm',                  // 34
  'return_on_equity',                // 35
  'return_on_assets',                // 36
  'return_on_invested_capital'       // 37
] as const;

let cachedPayload: { items: BistScreenerStockItem[]; sectors: string[]; fetchedAt: string; ts: number } | null = null;
const CACHE_TTL_MS = 45 * 1000; // 45s live cache

function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatTurkishSectorTitle(rawTr: unknown, rawEn: unknown): string {
  const str = (typeof rawTr === 'string' && rawTr.trim() ? rawTr.trim() : typeof rawEn === 'string' ? rawEn.trim() : '');
  if (!str) return 'Diğer';
  return str
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map((part) => (part ? part.charAt(0).toLocaleUpperCase('tr-TR') + part.slice(1) : part))
        .join('-')
    )
    .join(' ');
}

export async function GET() {
  try {
    const now = Date.now();
    if (cachedPayload && now - cachedPayload.ts < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        totalCount: cachedPayload.items.length,
        sectors: cachedPayload.sectors,
        fetchedAt: cachedPayload.fetchedAt,
        data: cachedPayload.items
      });
    }

    const res = await fetch('https://scanner.tradingview.com/turkey/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FinAI/2.0'
      },
      body: JSON.stringify({
        filter: [
          { left: 'type', operation: 'in_range', right: ['stock', 'dr'] },
          { left: 'typespecs', operation: 'has_none_of', right: ['preferred'] }
        ],
        options: { lang: 'tr' },
        markets: ['turkey'],
        symbols: { query: { types: [] }, tickers: [] },
        columns: [...SCREENER_COLUMNS],
        sort: { sortBy: 'volume', sortOrder: 'desc' },
        range: [0, 800]
      }),
      next: { revalidate: 45 }
    });

    if (!res.ok) {
      throw new Error(`Screener upstream error: HTTP ${res.status}`);
    }

    const json = await res.json();
    const rows: any[] = Array.isArray(json?.data) ? json.data : [];

    const sectorSet = new Set<string>();
    const items: BistScreenerStockItem[] = [];

    for (const row of rows) {
      const d = row?.d;
      if (!Array.isArray(d)) continue;
      const symbol = String(d[1] || '').trim().toUpperCase();
      if (!symbol) continue;

      const sector = formatTurkishSectorTitle(d[20], d[19]);
      sectorSet.add(sector);

      items.push({
        symbol,
        name: typeof d[2] === 'string' && d[2].trim() ? d[2].trim() : symbol,
        logoId: typeof d[0] === 'string' && d[0].trim() ? d[0].trim() : null,
        sector,
        currency: typeof d[4] === 'string' && d[4].trim() ? d[4].trim() : 'TRY',
        price: toNum(d[3]),
        changePercent: toNum(d[5]),
        changeAbs: toNum(d[6]),
        ratingScore: toNum(d[7]),
        volume: toNum(d[8]),
        valueTraded: toNum(d[9]),
        marketCap: toNum(d[10]),
        enterpriseValue: toNum(d[11]),
        pe: toNum(d[12]),
        evToEbitda: toNum(d[13]),
        pb: toNum(d[14]),
        ps: toNum(d[15]),
        fcf: toNum(d[16]),
        eps: toNum(d[17]),
        employees: toNum(d[18]),
        perfW: toNum(d[21]),
        perf1M: toNum(d[22]),
        perf3M: toNum(d[23]),
        perf6M: toNum(d[24]),
        perfYTD: toNum(d[25]),
        perf1Y: toNum(d[26]),
        volatilityD: toNum(d[27]),
        dividendYield: toNum(d[28]),
        dps: toNum(d[29]),
        payoutRatio: toNum(d[30]),
        grossMargin: toNum(d[31]),
        operatingMargin: toNum(d[32]),
        ebitdaMargin: toNum(d[33]),
        netMargin: toNum(d[34]),
        roe: toNum(d[35]),
        roa: toNum(d[36]),
        roic: toNum(d[37])
      });
    }

    const sectors = Array.from(sectorSet).sort((a, b) => a.localeCompare(b, 'tr'));
    const fetchedAt = new Date().toISOString();

    cachedPayload = { items, sectors, fetchedAt, ts: now };

    return NextResponse.json({
      success: true,
      totalCount: items.length,
      sectors,
      fetchedAt,
      data: items
    });
  } catch (error: any) {
    console.error('[BIST Screener API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Hisse tarayıcı verisi alınamadı' },
      { status: 500 }
    );
  }
}
