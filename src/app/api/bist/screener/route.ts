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
  high: number | null;
  low: number | null;
  ratingAll: number | null;
  ratingOscillators: number | null;
  ratingMA: number | null;
  volume: number | null;
  valueTraded: number | null;
  relVolume10d: number | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  pe: number | null;
  priceRevenue: number | null;
  pb: number | null;
  ps: number | null;
  evToEbitda: number | null;
  epsBasic: number | null;
  epsDiluted: number | null;
  lastAnnualEps: number | null;
  totalShares: number | null;
  employees: number | null;
  perfW: number | null;
  perf1M: number | null;
  perf3M: number | null;
  perf6M: number | null;
  perfYTD: number | null;
  perf1Y: number | null;
  perf5Y: number | null;
  perfAll: number | null;
  beta1Y: number | null;
  volatilityD: number | null;
  dividendYield: number | null;
  dividendsPaid: number | null;
  dps: number | null;
  payoutRatio: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  preTaxMargin: number | null;
  netMargin: number | null;
  fcfMargin: number | null;
  roe: number | null;
  totalRevenue: number | null;
  grossProfit: number | null;
  ebitda: number | null;
  netIncome: number | null;
  lastAnnualRevenue: number | null;
  totalAssets: number | null;
  totalCurrentAssets: number | null;
  cashAndShortTerm: number | null;
  totalDebt: number | null;
  netDebt: number | null;
  totalEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
  debtToEquity: number | null;
  rsi: number | null;
  stochK: number | null;
  stochD: number | null;
  cci20: number | null;
  adx: number | null;
  ao: number | null;
  mom: number | null;
  macdLevel: number | null;
  macdSignal: number | null;
  sma20: number | null;
  sma50: number | null;
  sma200: number | null;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  bbUpper: number | null;
  bbLower: number | null;
  highAll: number | null;
  lowAll: number | null;
  high52w: number | null;
  low52w: number | null;
  high1M: number | null;
  low1M: number | null;
}

const SCREENER_COLUMNS = [
  'logoid',                               // 0
  'name',                                 // 1
  'description',                          // 2
  'close',                                // 3
  'currency',                             // 4
  'change',                               // 5
  'change_abs',                           // 6
  'high',                                 // 7
  'low',                                  // 8
  'Recommend.All',                        // 9
  'Recommend.Other',                      // 10
  'Recommend.MA',                         // 11
  'volume',                               // 12
  'Value.Traded',                         // 13
  'relative_volume_10d_calc',             // 14
  'market_cap_basic',                     // 15
  'enterprise_value_current',             // 16
  'price_earnings_ttm',                   // 17
  'price_revenue_ttm',                    // 18
  'price_book_fq',                        // 19
  'price_sales_current',                  // 20
  'enterprise_value_ebitda_ttm',          // 21
  'earnings_per_share_basic_ttm',         // 22
  'earnings_per_share_diluted_ttm',       // 23
  'last_annual_eps',                      // 24
  'total_shares_outstanding_fundamental', // 25
  'number_of_employees',                  // 26
  'sector',                               // 27
  'sector.tr',                            // 28
  'Perf.W',                               // 29
  'Perf.1M',                              // 30
  'Perf.3M',                              // 31
  'Perf.6M',                              // 32
  'Perf.YTD',                             // 33
  'Perf.Y',                               // 34
  'Perf.5Y',                              // 35
  'Perf.All',                             // 36
  'beta_1_year',                          // 37
  'Volatility.D',                         // 38
  'dividends_yield_current',              // 39
  'dividends_paid',                       // 40
  'dps_common_stock_prim_issue_fy',       // 41
  'dividend_payout_ratio_ttm',            // 42
  'gross_margin_ttm',                     // 43
  'operating_margin_ttm',                 // 44
  'pre_tax_margin_ttm',                   // 45
  'net_margin_ttm',                       // 46
  'free_cash_flow_margin_ttm',            // 47
  'return_on_equity',                     // 48
  'total_revenue_ttm',                    // 49
  'gross_profit_ttm',                     // 50
  'ebitda',                               // 51
  'net_income_ttm',                       // 52
  'last_annual_revenue',                  // 53
  'total_assets_fq',                      // 54
  'total_current_assets_fq',              // 55
  'cash_n_short_term_invest_fq',          // 56
  'total_debt_fq',                        // 57
  'net_debt_fq',                          // 58
  'total_equity_fq',                      // 59
  'current_ratio_fq',                     // 60
  'quick_ratio_fq',                       // 61
  'debt_to_equity_fq',                    // 62
  'RSI',                                  // 63
  'Stoch.K',                              // 64
  'Stoch.D',                              // 65
  'CCI20',                                // 66
  'ADX',                                  // 67
  'AO',                                   // 68
  'Mom',                                  // 69
  'MACD.macd',                            // 70
  'MACD.signal',                          // 71
  'SMA20',                                // 72
  'SMA50',                                // 73
  'SMA200',                               // 74
  'EMA20',                                // 75
  'EMA50',                                // 76
  'EMA200',                               // 77
  'BB.upper',                             // 78
  'BB.lower',                             // 79
  'High.All',                             // 80
  'Low.All',                              // 81
  'price_52_week_high',                   // 82
  'price_52_week_low',                    // 83
  'High.1M',                              // 84
  'Low.1M'                                // 85
] as const;

let cachedPayload: { items: BistScreenerStockItem[]; sectors: string[]; fetchedAt: string; ts: number } | null = null;
const CACHE_TTL_MS = 45 * 1000;

function toNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatTurkishSectorTitle(rawTr: unknown, rawEn: unknown): string {
  const str = typeof rawTr === 'string' && rawTr.trim() ? rawTr.trim() : typeof rawEn === 'string' ? rawEn.trim() : '';
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

      const sector = formatTurkishSectorTitle(d[28], d[27]);
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
        high: toNum(d[7]),
        low: toNum(d[8]),
        ratingAll: toNum(d[9]),
        ratingOscillators: toNum(d[10]),
        ratingMA: toNum(d[11]),
        volume: toNum(d[12]),
        valueTraded: toNum(d[13]),
        relVolume10d: toNum(d[14]),
        marketCap: toNum(d[15]),
        enterpriseValue: toNum(d[16]),
        pe: toNum(d[17]),
        priceRevenue: toNum(d[18]),
        pb: toNum(d[19]),
        ps: toNum(d[20]),
        evToEbitda: toNum(d[21]),
        epsBasic: toNum(d[22]),
        epsDiluted: toNum(d[23]),
        lastAnnualEps: toNum(d[24]),
        totalShares: toNum(d[25]),
        employees: toNum(d[26]),
        perfW: toNum(d[29]),
        perf1M: toNum(d[30]),
        perf3M: toNum(d[31]),
        perf6M: toNum(d[32]),
        perfYTD: toNum(d[33]),
        perf1Y: toNum(d[34]),
        perf5Y: toNum(d[35]),
        perfAll: toNum(d[36]),
        beta1Y: toNum(d[37]),
        volatilityD: toNum(d[38]),
        dividendYield: toNum(d[39]),
        dividendsPaid: toNum(d[40]),
        dps: toNum(d[41]),
        payoutRatio: toNum(d[42]),
        grossMargin: toNum(d[43]),
        operatingMargin: toNum(d[44]),
        preTaxMargin: toNum(d[45]),
        netMargin: toNum(d[46]),
        fcfMargin: toNum(d[47]),
        roe: toNum(d[48]),
        totalRevenue: toNum(d[49]),
        grossProfit: toNum(d[50]),
        ebitda: toNum(d[51]),
        netIncome: toNum(d[52]),
        lastAnnualRevenue: toNum(d[53]),
        totalAssets: toNum(d[54]),
        totalCurrentAssets: toNum(d[55]),
        cashAndShortTerm: toNum(d[56]),
        totalDebt: toNum(d[57]),
        netDebt: toNum(d[58]),
        totalEquity: toNum(d[59]),
        currentRatio: toNum(d[60]),
        quickRatio: toNum(d[61]),
        debtToEquity: toNum(d[62]),
        rsi: toNum(d[63]),
        stochK: toNum(d[64]),
        stochD: toNum(d[65]),
        cci20: toNum(d[66]),
        adx: toNum(d[67]),
        ao: toNum(d[68]),
        mom: toNum(d[69]),
        macdLevel: toNum(d[70]),
        macdSignal: toNum(d[71]),
        sma20: toNum(d[72]),
        sma50: toNum(d[73]),
        sma200: toNum(d[74]),
        ema20: toNum(d[75]),
        ema50: toNum(d[76]),
        ema200: toNum(d[77]),
        bbUpper: toNum(d[78]),
        bbLower: toNum(d[79]),
        highAll: toNum(d[80]),
        lowAll: toNum(d[81]),
        high52w: toNum(d[82]),
        low52w: toNum(d[83]),
        high1M: toNum(d[84]),
        low1M: toNum(d[85])
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
