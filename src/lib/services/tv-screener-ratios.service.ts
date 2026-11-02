/**
 * FinAI TradingView Turkey Stock Screener Background Ratio Service
 * Background execution layer for:
 *   <tv-screener market="turkey" screener-type="stock" columns="overview" screen="most_capitalized">
 *
 * Queries TradingView's official Turkey Stock Screener API (`https://scanner.tradingview.com/turkey/scan`)
 * on the server for a given BIST stock symbol (`BIST:<SYMBOL>`) and computes all 28 ratios across
 * the 7 canonical categories requested for each asset's dedicated page.
 */

import { RatioStatus } from '@/types/financials';
import { getSectorCategory } from '@/lib/sector-categorizer';
import { CategoryRatios, EducationalTooltip, RatioItem } from '@/lib/financial-ratio-engine';

export type ScreenerCategoryKey =
  | 'pricing'
  | 'profitability'
  | 'leverageAndLiquidity'
  | 'growth'
  | 'cashFlow'
  | 'perShare'
  | 'qualityAndEfficiency';

export interface TvScreenerRatiosResult {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string | null;
  asOf: string;
  livePrice: number | null;
  marketCap: number | null;
  enterpriseValue: number | null;
  orderedCategoryKeys: ScreenerCategoryKey[];
  screenerCategories: Record<ScreenerCategoryKey, CategoryRatios>;
  // Backwards-compatible alias map so any legacy tab/consumer continues working seamlessly
  categories: Record<string, CategoryRatios>;
  flat: Record<string, number | null>;
  profitability: {
    grossMargin: number | null;
    operatingMargin: number | null;
    ebitdaMargin: number | null;
    netMargin: number | null;
    roe: number | null;
    roa: number | null;
    roic: number | null;
  };
  quality: {
    status: string;
    completeness: number;
    warnings: string[];
    availableRatioCount: number;
    applicableRatioCount: number;
    totalRatioCount: number;
  };
  sourceMetadata: {
    source: string;
    market: 'turkey';
    screenerType: 'stock';
    fetchedAt: string;
    verifiedAt: string;
    quality: string;
  };
}

const TV_SCREENER_COLUMNS = [
  'name',
  'description',
  'sector',
  'industry',
  'currency',
  'fundamental_currency_code',
  'close',
  'market_cap_basic',
  'enterprise_value_current',
  'enterprise_value_fq',
  // 1. Fiyatlama: F/K, FD/FAVÖK, PD/DD, PD/Satışlar, temettü verimi
  'price_earnings_ttm',
  'enterprise_value_ebitda_ttm',
  'enterprise_value_ebitda_current',
  'price_book_fq',
  'price_book_current',
  'price_book_ratio',
  'price_sales_current',
  'price_revenue_ttm',
  'price_sales_ratio',
  'dividends_yield_current',
  'dividends_yield',
  'dividend_yield_recent',
  // 2. Kârlılık: Brüt kâr marjı, faaliyet kâr marjı, net kâr marjı, ROE, ROA, ROIC
  'gross_margin_ttm',
  'gross_margin',
  'operating_margin_ttm',
  'operating_margin',
  'ebitda_margin_ttm',
  'net_margin_ttm',
  'net_margin',
  'after_tax_margin',
  'return_on_equity',
  'return_on_equity_fq',
  'return_on_assets',
  'return_on_assets_fq',
  'return_on_invested_capital',
  'return_on_invested_capital_fq',
  // 3. Borçluluk ve likidite: Net borç/FAVÖK, borç/özsermaye, cari oran, likidite oranı
  'net_debt_to_ebitda_fq',
  'net_debt_fq',
  'ebitda_ttm',
  'debt_to_equity_fq',
  'debt_to_equity',
  'current_ratio_fq',
  'current_ratio',
  'quick_ratio_fq',
  'quick_ratio',
  // 4. Büyüme: Ciro büyümesi, FAVÖK büyümesi, net kâr büyümesi, hisse başına kâr büyümesi
  'total_revenue_yoy_growth_ttm',
  'total_revenue_yoy_growth_fq',
  'total_revenue_yoy_growth_fy',
  'ebitda_yoy_growth_ttm',
  'ebitda_yoy_growth_fq',
  'ebitda_yoy_growth_fy',
  'net_income_yoy_growth_ttm',
  'net_income_yoy_growth_fq',
  'net_income_yoy_growth_fy',
  'earnings_per_share_diluted_yoy_growth_ttm',
  'earnings_per_share_diluted_yoy_growth_fq',
  'earnings_per_share_diluted_yoy_growth_fy',
  // 5. Nakit akışı: Serbest nakit akışı, faaliyet nakit akışı/net kâr, FCF verimi
  'free_cash_flow_ttm',
  'free_cash_flow_fy',
  'cash_f_operating_activities_ttm',
  'cash_f_operating_activities_fy',
  'net_income_ttm',
  'net_income_fy',
  'price_free_cash_flow_ttm',
  'price_free_cash_flow_current',
  // 6. Hisse başına göstergeler: EPS, BVPS, temettü/hisse
  'earnings_per_share_basic_ttm',
  'earnings_per_share_diluted_ttm',
  'book_value_per_share_fq',
  'book_value_per_share_current',
  'dps_common_stock_prim_issue_ttm',
  'dps_common_stock_prim_issue_fy',
  'dividend_amount_recent',
  'indicated_annual_dividend',
  // 7. Kalite ve verimlilik: Stok devir hızı, alacak tahsil süresi, aktif devir hızı
  'invent_turnover_current',
  'invent_turnover_fy',
  'receivables_turnover_fq',
  'receivables_turnover_fy',
  'asset_turnover_current',
  'asset_turnover_fy',
  'total_revenue_ttm',
  'total_assets_fq'
] as const;

type TvColumnName = (typeof TV_SCREENER_COLUMNS)[number];
type TvRawMap = Record<TvColumnName, any>;

type FormatStyle =
  | 'multiple'       // e.g. 35,81x
  | 'ratio'          // e.g. 1,45x
  | 'percent'        // e.g. %31,89
  | 'signed_percent' // e.g. +%61,23 / -%12,40
  | 'currency'       // e.g. 9,56 ₺
  | 'compact_money'  // e.g. ₺11,62 Milyar
  | 'days';          // e.g. 80,8 Gün

const screenerCache = new Map<string, { data: TvScreenerRatiosResult; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function toFiniteNumber(val: unknown): number | null {
  if (val == null) return null;
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

function firstNumber(...candidates: unknown[]): number | null {
  for (const c of candidates) {
    const n = toFiniteNumber(c);
    if (n != null) return n;
  }
  return null;
}

function formatMetricValue(val: number | null, style: FormatStyle, currencySymbol: string = '₺'): string {
  if (val == null || !Number.isFinite(val)) return '—';

  switch (style) {
    case 'multiple':
    case 'ratio':
      return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
    case 'percent':
      return `%${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'signed_percent': {
      const sign = val > 0 ? '+' : val < 0 ? '-' : '';
      return `${sign}%${Math.abs(val).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    case 'currency':
      return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}`;
    case 'compact_money': {
      const abs = Math.abs(val);
      const sign = val < 0 ? '-' : '';
      if (abs >= 1_000_000_000_000) {
        return `${sign}${currencySymbol}${(abs / 1_000_000_000_000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Trilyon`;
      }
      if (abs >= 1_000_000_000) {
        return `${sign}${currencySymbol}${(abs / 1_000_000_000).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Milyar`;
      }
      if (abs >= 1_000_000) {
        return `${sign}${currencySymbol}${(abs / 1_000_000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Milyon`;
      }
      if (abs >= 1_000) {
        return `${sign}${currencySymbol}${(abs / 1_000).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Bin`;
      }
      return `${sign}${currencySymbol}${abs.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    case 'days':
      return `${val.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Gün`;
  }
}

async function queryTradingViewTurkeyScreener(cleanSymbol: string): Promise<TvRawMap | null> {
  // Primary direct ticker lookup on TradingView Turkey Stock Screener
  const directPayload = {
    symbols: {
      tickers: [`BIST:${cleanSymbol}`],
      query: { types: [] }
    },
    columns: [...TV_SCREENER_COLUMNS]
  };

  try {
    const res = await fetch('https://scanner.tradingview.com/turkey/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FinAI/2.0'
      },
      body: JSON.stringify(directPayload),
      next: { revalidate: 120 }
    });

    if (res.ok) {
      const json = await res.json();
      const row = json?.data?.[0]?.d;
      if (Array.isArray(row) && row.length === TV_SCREENER_COLUMNS.length) {
        const mapped = {} as TvRawMap;
        TV_SCREENER_COLUMNS.forEach((col, i) => {
          mapped[col] = row[i];
        });
        return mapped;
      }
    }

    // Fallback: filter by exact stock name on Turkey market screener
    const filterPayload = {
      filter: [{ left: 'name', operation: 'equal', right: cleanSymbol }],
      options: { lang: 'tr' },
      markets: ['turkey'],
      symbols: { query: { types: ['stock', 'dr', 'fund'] }, tickers: [] },
      columns: [...TV_SCREENER_COLUMNS],
      sort: { sortBy: 'market_cap_basic', sortOrder: 'desc' },
      range: [0, 1]
    };

    const fallbackRes = await fetch('https://scanner.tradingview.com/turkey/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) FinAI/2.0'
      },
      body: JSON.stringify(filterPayload),
      next: { revalidate: 120 }
    });

    if (fallbackRes.ok) {
      const json = await fallbackRes.json();
      const row = json?.data?.[0]?.d;
      if (Array.isArray(row) && row.length === TV_SCREENER_COLUMNS.length) {
        const mapped = {} as TvRawMap;
        TV_SCREENER_COLUMNS.forEach((col, i) => {
          mapped[col] = row[i];
        });
        return mapped;
      }
    }
  } catch (err) {
    console.warn(`[TvScreenerRatiosService] Screener fetch failed for ${cleanSymbol}:`, err);
  }

  return null;
}

/**
 * Fetches and computes all 28 requested financial ratios across 7 categories
 * from TradingView Turkey Stock Screener in the background.
 */
export async function fetchTvScreenerRatios(rawSymbol: string): Promise<TvScreenerRatiosResult | null> {
  const cleanSymbol = rawSymbol.toUpperCase().replace(/^BIST:/, '').replace(/\.IS$/, '').trim();
  if (!cleanSymbol) return null;

  const now = Date.now();
  const cached = screenerCache.get(cleanSymbol);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const raw = await queryTradingViewTurkeyScreener(cleanSymbol);
  if (!raw) return null;

  const tvSector = typeof raw.sector === 'string' ? raw.sector : '';
  const tvIndustry = typeof raw.industry === 'string' ? raw.industry : null;
  const sectorInfo = getSectorCategory(cleanSymbol, tvSector || undefined);

  const industryLower = `${tvSector} ${tvIndustry || ''}`.toLowerCase();
  const isBank = sectorInfo.category === 'BANK' || industryLower.includes('bank');
  const isInsurance = sectorInfo.category === 'INSURANCE' || industryLower.includes('insurance');
  const isREIT = sectorInfo.category === 'REIT' || industryLower.includes('real estate investment trust');

  const currencyCode = typeof raw.fundamental_currency_code === 'string' ? raw.fundamental_currency_code : 'TRY';
  const currencySymbol = currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : '₺';

  const livePrice = toFiniteNumber(raw.close);
  const marketCap = toFiniteNumber(raw.market_cap_basic);
  const enterpriseValue = firstNumber(raw.enterprise_value_current, raw.enterprise_value_fq);
  const companyName = typeof raw.description === 'string' && raw.description.trim()
    ? raw.description.trim()
    : `${cleanSymbol} A.Ş.`;

  const netIncomeTTM = firstNumber(raw.net_income_ttm, raw.net_income_fy);
  const ebitdaTTM = toFiniteNumber(raw.ebitda_ttm);
  const ocfTTM = firstNumber(raw.cash_f_operating_activities_ttm, raw.cash_f_operating_activities_fy);
  const fcfTTM = firstNumber(raw.free_cash_flow_ttm, raw.free_cash_flow_fy);
  const bvpsRaw = firstNumber(raw.book_value_per_share_fq, raw.book_value_per_share_current);

  let availableCount = 0;
  let applicableCount = 0;
  let totalCount = 0;
  const flat: Record<string, number | null> = {};

  function buildRatio(opts: {
    key: string;
    name: string;
    value: number | null;
    style: FormatStyle;
    unit: string;
    periodLabel: string;
    methodology: string;
    tooltip: EducationalTooltip;
    sectorNotApplicableIfNull?: boolean;
    sectorNotApplicableReason?: string;
    negativeReason?: string | null;
  }): RatioItem {
    totalCount++;
    let val = opts.value;
    let status: RatioStatus = 'available';
    let reason = 'TradingView Türkiye Hisse Tarayıcısı üzerinden doğrulandı.';

    if (val != null && Number.isFinite(val)) {
      availableCount++;
      applicableCount++;
    } else if (opts.negativeReason) {
      status = 'negative_input';
      reason = opts.negativeReason;
      val = null;
      applicableCount++;
    } else if (opts.sectorNotApplicableIfNull) {
      status = 'not_applicable';
      reason = opts.sectorNotApplicableReason || 'Bu sektör muhasebe yapısında ilgili rasyo hesaplanmaz.';
      val = null;
    } else {
      status = 'insufficient_data';
      reason = 'İlgili dönem için doğrulanmış veri bulunamadı.';
      val = null;
      applicableCount++;
    }

    flat[opts.key] = val;

    return {
      key: opts.key,
      name: opts.name,
      value: val,
      formattedValue: formatMetricValue(val, opts.style, currencySymbol),
      unit: opts.unit,
      status,
      reason,
      methodology: opts.methodology,
      periodLabel: opts.periodLabel,
      educationalTooltip: opts.tooltip
    };
  }

  // ============================================================================
  // 1. FİYATLAMA (F/K, FD/FAVÖK, PD/DD, PD/Satışlar, Temettü Verimi)
  // ============================================================================
  const peVal = toFiniteNumber(raw.price_earnings_ttm) ?? (
    livePrice != null && toFiniteNumber(raw.earnings_per_share_basic_ttm) != null && Number(raw.earnings_per_share_basic_ttm) > 0
      ? livePrice / Number(raw.earnings_per_share_basic_ttm)
      : null
  );
  const evEbitdaVal = firstNumber(raw.enterprise_value_ebitda_ttm, raw.enterprise_value_ebitda_current) ?? (
    !isBank && !isInsurance && enterpriseValue != null && ebitdaTTM != null && ebitdaTTM > 0
      ? enterpriseValue / ebitdaTTM
      : null
  );
  const pbVal = firstNumber(raw.price_book_fq, raw.price_book_current, raw.price_book_ratio) ?? (
    livePrice != null && bvpsRaw != null && bvpsRaw > 0 ? livePrice / bvpsRaw : null
  );
  const psVal = firstNumber(raw.price_sales_current, raw.price_revenue_ttm, raw.price_sales_ratio) ?? (
    marketCap != null && toFiniteNumber(raw.total_revenue_ttm) != null && Number(raw.total_revenue_ttm) > 0
      ? marketCap / Number(raw.total_revenue_ttm)
      : null
  );
  const divYieldVal = firstNumber(raw.dividends_yield_current, raw.dividends_yield, raw.dividend_yield_recent);

  const pricing: CategoryRatios = {
    categoryKey: 'pricing',
    categoryName: 'Fiyatlama',
    description: 'Hissenin piyasa fiyatının kâr, FAVÖK, defter değeri, satışlar ve temettüye göre çarpan seviyesini gösterir.',
    ratios: [
      buildRatio({
        key: 'pe',
        name: 'F/K (Fiyat / Kazanç)',
        value: peVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'Hisse Fiyatı / TTM Hisse Başına Kâr',
        negativeReason: peVal == null && netIncomeTTM != null && netIncomeTTM <= 0
          ? 'Son 12 aylık (TTM) net kâr negatif veya sıfır olduğu için F/K hesaplanmaz.'
          : null,
        tooltip: {
          whatItMeasures: 'Şirketin 1 TL yıllık net kârına karşılık piyasanın ödediği fiyat çarpanını ölçer.',
          howToInterpret: 'Sektör ortalamasına göre düşük F/K iskontoya işaret edebilir; beklenen büyüme hızıyla birlikte yorumlanmalıdır.',
          sectorCaution: 'Zarar açıklayan dönemlerde F/K hesaplanmaz; döngüsel sektörlerde kâr zirvesinde F/K düşük görünebilir.',
          finaiFormula: 'F/K = Hisse Fiyatı / Hisse Başına Kâr (TTM)'
        }
      }),
      buildRatio({
        key: 'evToEBITDA',
        name: 'FD/FAVÖK',
        value: evEbitdaVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'Firma Değeri (FD) / TTM FAVÖK',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık sektörlerinde FAVÖK ve FD/FAVÖK çarpanı uygulanmaz.',
        negativeReason: !isBank && !isInsurance && evEbitdaVal == null && ebitdaTTM != null && ebitdaTTM <= 0
          ? 'Son 12 aylık (TTM) FAVÖK negatif veya sıfır olduğu için FD/FAVÖK hesaplanmaz.'
          : null,
        tooltip: {
          whatItMeasures: 'Net borç dahil toplam şirket değerinin (Firma Değeri) operasyonel nakit kârına (FAVÖK) oranını ölçer.',
          howToInterpret: 'Sermaye yapısı ve borçluluk farklarını dikkate aldığı için F/K oranına göre şirketler arası daha dengeli kıyaslama sağlar.',
          sectorCaution: 'Banka ve sigorta şirketlerinde kullanılmaz; sanayi ve hizmet şirketlerinde ana değerleme çarpanıdır.',
          finaiFormula: 'FD/FAVÖK = (Piyasa Değeri + Net Borç) / FAVÖK (TTM)'
        }
      }),
      buildRatio({
        key: 'pb',
        name: 'PD/DD',
        value: pbVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'Son Çeyrek',
        methodology: 'Piyasa Değeri / Toplam Özsermaye',
        negativeReason: pbVal == null && bvpsRaw != null && bvpsRaw <= 0
          ? 'Özsermaye negatif veya sıfır olduğu için PD/DD hesaplanmaz.'
          : null,
        tooltip: {
          whatItMeasures: 'Şirketin piyasa değerinin bilanço üzerindeki net defter değerine (özsermaye) oranını gösterir.',
          howToInterpret: '1,00x altı şirketin defter değerinin altında fiyatlandığını gösterir; yüksek ROE üreten şirketlerde daha yüksek PD/DD normaldir.',
          sectorCaution: 'Bankacılık, holding ve GYO sektörlerinde birincil değerleme göstergesidir.',
          finaiFormula: 'PD/DD = Hisse Fiyatı / Hisse Başına Defter Değeri (BVPS)'
        }
      }),
      buildRatio({
        key: 'ps',
        name: 'PD/Satışlar',
        value: psVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'Piyasa Değeri / TTM Toplam Satışlar',
        tooltip: {
          whatItMeasures: 'Şirketin piyasa değerinin son 12 aylık toplam ciroya (satış gelirlerine) oranını ölçer.',
          howToInterpret: 'Özellikle marjları geçici olarak baskılanan veya yüksek büyüme aşamasındaki şirketleri kıyaslamada kullanılır.',
          sectorCaution: 'Düşük marjlı perakende şirketlerinde doğal olarak düşük (0,3x-0,8x), yüksek marjlı teknoloji şirketlerinde daha yüksektir.',
          finaiFormula: 'PD/Satışlar = Piyasa Değeri / TTM Satış Gelirleri'
        }
      }),
      buildRatio({
        key: 'dividendYield',
        name: 'Temettü Verimi',
        value: divYieldVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'Güncel',
        methodology: '(Hisse Başına Temettü / Hisse Fiyatı) × 100',
        tooltip: {
          whatItMeasures: 'Şirketin dağıttığı nakit temettünün güncel hisse fiyatına oranla sağladığı nakit getiri yüzdesini gösterir.',
          howToInterpret: 'Düzenli ve yüksek temettü verimi güçlü nakit akışı ve yatırımcı dostu kâr dağıtım politikasına işaret eder.',
          sectorCaution: 'Agresif yatırım ve büyüme dönemindeki şirketler kârı yatırıma yönlendirip temettü dağıtmayabilir (%0).',
          finaiFormula: 'Temettü Verimi (%) = (Hisse Başına Temettü / Hisse Fiyatı) × 100'
        }
      })
    ]
  };

  // ============================================================================
  // 2. KÂRLILIK (Brüt kâr marjı, faaliyet kâr marjı, net kâr marjı, ROE, ROA, ROIC)
  // ============================================================================
  const grossMarginVal = firstNumber(raw.gross_margin_ttm, raw.gross_margin);
  const operatingMarginVal = firstNumber(raw.operating_margin_ttm, raw.operating_margin);
  const ebitdaMarginVal = toFiniteNumber(raw.ebitda_margin_ttm);
  const netMarginVal = firstNumber(raw.net_margin_ttm, raw.net_margin, raw.after_tax_margin);
  const roeVal = firstNumber(raw.return_on_equity, raw.return_on_equity_fq);
  const roaVal = firstNumber(raw.return_on_assets, raw.return_on_assets_fq);
  const roicVal = firstNumber(raw.return_on_invested_capital, raw.return_on_invested_capital_fq);

  const profitability: CategoryRatios = {
    categoryKey: 'profitability',
    categoryName: 'Kârlılık',
    description: 'Şirketin satışlarından, toplam varlıklarından ve yatırılan sermayesinden ürettiği kâr marjı ve getiri oranlarını ölçer.',
    ratios: [
      buildRatio({
        key: 'grossMargin',
        name: 'Brüt Kâr Marjı',
        value: grossMarginVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Brüt Kâr / TTM Satışlar) × 100',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık bilançolarında satılan malın maliyeti / brüt kâr marjı ayrımı uygulanmaz.',
        tooltip: {
          whatItMeasures: 'Satış gelirlerinden doğrudan üretim/tedarik maliyetleri düşüldükten sonra kalan kâr yüzdesini ölçer.',
          howToInterpret: 'Yüksek ve istikrarlı brüt marj, şirketin fiyatlama gücünü ve maliyet kontrol rekabet avantajını gösterir.',
          sectorCaution: 'Yazılım/savunma sektörlerinde yüksek, gıda perakendesi ve emtia ticaretinde daha düşüktür.',
          finaiFormula: 'Brüt Kâr Marjı (%) = (Brüt Kâr / Satış Gelirleri) × 100'
        }
      }),
      buildRatio({
        key: 'operatingMargin',
        name: 'Faaliyet Kâr Marjı',
        value: operatingMarginVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Esas Faaliyet Kârı / TTM Satışlar) × 100',
        tooltip: {
          whatItMeasures: 'Finansman ve vergi etkileri öncesinde ana faaliyetlerden elde edilen kârlılık oranını ölçer.',
          howToInterpret: 'Operasyonel gider yönetiminin kalitesini ve ana iş kolunun kâr üretme kapasitesini yansıtır.',
          sectorCaution: 'Yüksek Ar-Ge veya pazarlama yatırımı yapılan dönemlerde geçici olarak gerileyebilir.',
          finaiFormula: 'Faaliyet Kâr Marjı (%) = (Esas Faaliyet Kârı / Satış Gelirleri) × 100'
        }
      }),
      buildRatio({
        key: 'netMargin',
        name: 'Net Kâr Marjı',
        value: netMarginVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Net Dönem Kârı / TTM Satışlar) × 100',
        tooltip: {
          whatItMeasures: 'Tüm faaliyet giderleri, finansman maliyetleri ve vergiler düşüldükten sonra cirodan geriye kalan net kâr payını ölçer.',
          howToInterpret: 'Pozitif ve yükselen net kâr marjı cironun hissedarlar için gerçek kazanca dönüştüğünü gösterir.',
          sectorCaution: 'Kur farkı gelir/giderleri, enflasyon muhasebesi veya tek seferlik varlık satışları net marjı etkileyebilir.',
          finaiFormula: 'Net Kâr Marjı (%) = (Net Dönem Kârı / Satış Gelirleri) × 100'
        }
      }),
      buildRatio({
        key: 'roe',
        name: 'ROE (Özkaynak Kârlılığı)',
        value: roeVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Net Kâr / Ortalama Özsermaye) × 100',
        tooltip: {
          whatItMeasures: 'Hissedarların şirkete koyduğu özsermayenin yıllık yüzde kaç oranında net kâr ürettiğini gösterir.',
          howToInterpret: 'Sermaye maliyetinin ve enflasyonun üzerinde sürdürülebilir ROE, değer yaratan şirketlerin temel özelliğidir.',
          sectorCaution: 'Yüksek finansal kaldıraç ROE’yi yapay olarak yükseltebileceğinden Borç/Özsermaye ve ROIC ile birlikte okunmalıdır.',
          finaiFormula: 'ROE (%) = (TTM Net Kâr / Ortalama Özsermaye) × 100'
        }
      }),
      buildRatio({
        key: 'roa',
        name: 'ROA (Aktif Kârlılığı)',
        value: roaVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Net Kâr / Ortalama Toplam Varlıklar) × 100',
        tooltip: {
          whatItMeasures: 'Şirketin borç ve özsermaye ile finanse edilen tüm varlıklarından (aktiflerinden) ürettiği kâr oranını gösterir.',
          howToInterpret: 'Aynı sektördeki rakiplere kıyasla yüksek ROA, varlıkların çok daha verimli işletildiğine işaret eder.',
          sectorCaution: 'Bankacılık sektöründe bilanço büyüklüğü mevduat/kredi kaynaklı olduğundan %2-%4 ROA güçlü kabul edilir.',
          finaiFormula: 'ROA (%) = (TTM Net Kâr / Ortalama Toplam Varlıklar) × 100'
        }
      }),
      buildRatio({
        key: 'roic',
        name: 'ROIC (Yatırılan Sermaye Getirisi)',
        value: roicVal,
        style: 'percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(NOPAT / Yatırılan Toplam Sermaye) × 100',
        tooltip: {
          whatItMeasures: 'Şirketin faaliyetlerine yatırılan borç + özsermaye toplamından vergi sonrası ürettiği gerçek operasyonel getiriyi ölçer.',
          howToInterpret: 'ROIC > Sermaye Maliyeti (WACC) olduğunda şirket büyüdükçe ekonomik katma değer üretir.',
          sectorCaution: 'Ağır yatırım dönemlerinde yatırılan sermaye hemen arttığı ama kâr sonradan devreye girdiği için geçici düşüş görülebilir.',
          finaiFormula: 'ROIC (%) = (Vergi Sonrası Esas Faaliyet Kârı [NOPAT] / Yatırılan Sermaye) × 100'
        }
      })
    ]
  };

  // ============================================================================
  // 3. BORÇLULUK VE LİKİDİTE (Net borç/FAVÖK, borç/özsermaye, cari oran, likidite oranı)
  // ============================================================================
  const netDebtFq = toFiniteNumber(raw.net_debt_fq);
  const netDebtToEbitdaVal = toFiniteNumber(raw.net_debt_to_ebitda_fq) ?? (
    !isBank && !isInsurance && netDebtFq != null && ebitdaTTM != null && ebitdaTTM > 0
      ? netDebtFq / ebitdaTTM
      : null
  );
  const debtToEquityVal = firstNumber(raw.debt_to_equity_fq, raw.debt_to_equity);
  const currentRatioVal = firstNumber(raw.current_ratio_fq, raw.current_ratio);
  const quickRatioVal = firstNumber(raw.quick_ratio_fq, raw.quick_ratio);

  const leverageAndLiquidity: CategoryRatios = {
    categoryKey: 'leverageAndLiquidity',
    categoryName: 'Borçluluk ve Likidite',
    description: 'Şirketin finansal kaldıraç düzeyini, net borç çevirme kapasitesini ve kısa vadeli yükümlülüklerini karşılama gücünü ölçer.',
    ratios: [
      buildRatio({
        key: 'netDebtToEBITDA',
        name: 'Net Borç / FAVÖK',
        value: netDebtToEbitdaVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'Son Çeyrek / TTM',
        methodology: '(Finansal Borçlar - Nakit) / TTM FAVÖK',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık sektörlerinde Net Borç / FAVÖK rasyosu uygulanmaz.',
        negativeReason: !isBank && !isInsurance && netDebtToEbitdaVal == null && ebitdaTTM != null && ebitdaTTM <= 0
          ? 'FAVÖK negatif veya sıfır olduğu için Net Borç / FAVÖK hesaplanmaz.'
          : null,
        tooltip: {
          whatItMeasures: 'Şirketin net finansal borcunu mevcut yıllık FAVÖK üretimiyle kaç yılda kapatabileceğini gösterir.',
          howToInterpret: 'Negatif değer şirketin net nakit pozisyonunda olduğunu, 2,0x altı sağlıklı borçluluğu, 3,5x üzeri yüksek kaldıraç riskini simgeler.',
          sectorCaution: 'Altyapı, enerji ve havacılık gibi uzun vadeli varlık finansmanı kullanan sektörlerde üst eşik daha yüksektir.',
          finaiFormula: 'Net Borç / FAVÖK = (Toplam Finansal Borç - Nakit ve Benzerleri) / FAVÖK (TTM)'
        }
      }),
      buildRatio({
        key: 'debtToEquity',
        name: 'Borç / Özsermaye',
        value: debtToEquityVal,
        style: 'ratio',
        unit: 'x',
        periodLabel: 'Son Çeyrek',
        methodology: 'Toplam Finansal Borç / Toplam Özsermaye',
        tooltip: {
          whatItMeasures: 'Şirketin kullandığı finansal borçların hissedar özsermayesine oranını (finansal kaldıraç seviyesini) ölçer.',
          howToInterpret: '1,00x altı özsermayenin finansal borçtan büyük olduğunu gösterir; düşük oran faiz artışlarına karşı dayanıklılık sağlar.',
          sectorCaution: 'Finans kurumlarında ve sermaye yoğun sanayide sektör ortalamasıyla birlikte değerlendirilmelidir.',
          finaiFormula: 'Borç / Özsermaye = Toplam Finansal Borç / Toplam Özsermaye'
        }
      }),
      buildRatio({
        key: 'currentRatio',
        name: 'Cari Oran',
        value: currentRatioVal,
        style: 'ratio',
        unit: 'x',
        periodLabel: 'Son Çeyrek',
        methodology: 'Dönen Varlıklar / Kısa Vadeli Yükümlülükler',
        sectorNotApplicableIfNull: isBank || isInsurance || isREIT,
        sectorNotApplicableReason: 'Banka, sigorta ve GYO bilançolarında cari oran klasik sanayi formatında hesaplanmaz.',
        tooltip: {
          whatItMeasures: 'Bir yıl içinde nakde dönebilecek dönen varlıkların kısa vadeli borçları karşılama katsayısını gösterir.',
          howToInterpret: '1,20x - 2,00x aralığı dengeli işletme sermayesine işaret eder; 1,00x altı kısa vadeli likidite takibi gerektirir.',
          sectorCaution: 'Peşin tahsilat yapan gıda perakendeciliğinde 0,9x-1,1x seviyeleri sağlıklı kabul edilebilir.',
          finaiFormula: 'Cari Oran = Dönen Varlıklar / Kısa Vadeli Yükümlülükler'
        }
      }),
      buildRatio({
        key: 'quickRatio',
        name: 'Likidite Oranı',
        value: quickRatioVal,
        style: 'ratio',
        unit: 'x',
        periodLabel: 'Son Çeyrek',
        methodology: '(Dönen Varlıklar - Stoklar) / Kısa Vadeli Yükümlülükler',
        sectorNotApplicableIfNull: isBank || isInsurance || isREIT,
        sectorNotApplicableReason: 'Bankacılık, sigorta ve GYO bilançolarında likidite (asit-test) oranı uygulanmaz.',
        tooltip: {
          whatItMeasures: 'Stoklar dışarıda bırakıldığında nakit ve hızla tahsil edilebilir varlıkların kısa vadeli borçları karşılama gücünü ölçer.',
          howToInterpret: '1,00x ve üzeri şirketin stok satışı yapmadan dahi kısa vadeli borçlarını ödeyebilecek likiditeye sahip olduğunu gösterir.',
          sectorCaution: 'Yüksek stokla çalışan üretim ve savunma şirketlerinde Cari Oran ile Likidite Oranı arasındaki fark açılabilir.',
          finaiFormula: 'Likidite (Asit-Test) Oranı = (Dönen Varlıklar - Stoklar) / Kısa Vadeli Yükümlülükler'
        }
      })
    ]
  };

  // ============================================================================
  // 4. BÜYÜME (Ciro büyümesi, FAVÖK büyümesi, net kâr büyümesi, hisse başına kâr büyümesi)
  // ============================================================================
  const revGrowthVal = firstNumber(
    raw.total_revenue_yoy_growth_ttm,
    raw.total_revenue_yoy_growth_fq,
    raw.total_revenue_yoy_growth_fy
  );
  const ebitdaGrowthVal = firstNumber(
    raw.ebitda_yoy_growth_ttm,
    raw.ebitda_yoy_growth_fq,
    raw.ebitda_yoy_growth_fy
  );
  const netIncomeGrowthVal = firstNumber(
    raw.net_income_yoy_growth_ttm,
    raw.net_income_yoy_growth_fq,
    raw.net_income_yoy_growth_fy
  );
  const epsGrowthVal = firstNumber(
    raw.earnings_per_share_diluted_yoy_growth_ttm,
    raw.earnings_per_share_diluted_yoy_growth_fq,
    raw.earnings_per_share_diluted_yoy_growth_fy
  );

  const growth: CategoryRatios = {
    categoryKey: 'growth',
    categoryName: 'Büyüme',
    description: 'Şirketin satış, FAVÖK, net kâr ve hisse başına kâr kalemlerindeki yıllık (YoY) büyüme ivmesini gösterir.',
    ratios: [
      buildRatio({
        key: 'revenueGrowth',
        name: 'Ciro Büyümesi',
        value: revGrowthVal,
        style: 'signed_percent',
        unit: '%',
        periodLabel: 'YoY (TTM)',
        methodology: '((Güncel TTM Ciro - Önceki Yıl TTM Ciro) / Önceki Yıl TTM Ciro) × 100',
        tooltip: {
          whatItMeasures: 'Şirketin toplam satış gelirlerinin bir önceki yılın aynı dönemine göre yüzde kaç büyüdüğünü ölçer.',
          howToInterpret: 'Enflasyonun üzerinde reel ciro büyümesi şirketin pazar payı kazandığını veya talep artışı yakaladığını gösterir.',
          sectorCaution: 'Kapasite yatırımlarının devreye girdiği dönemlerde sıçrama yapabilir; mevsimsellikten arındırmak için TTM baz alınır.',
          finaiFormula: 'Ciro Büyümesi (%) = ((TTM Satışlar / Önceki Yıl TTM Satışlar) - 1) × 100'
        }
      }),
      buildRatio({
        key: 'ebitdaGrowth',
        name: 'FAVÖK Büyümesi',
        value: ebitdaGrowthVal,
        style: 'signed_percent',
        unit: '%',
        periodLabel: 'YoY (TTM)',
        methodology: '((Güncel TTM FAVÖK - Önceki Yıl TTM FAVÖK) / |Önceki Yıl TTM FAVÖK|) × 100',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık sektörlerinde FAVÖK büyümesi hesaplanmaz.',
        tooltip: {
          whatItMeasures: 'Operasyonel nakit kârın (FAVÖK) yıllık bazda yüzde kaç arttığını veya daraldığını ölçer.',
          howToInterpret: 'FAVÖK büyümesinin ciro büyümesini aşması operasyonel kaldıracın çalıştığını ve marjların genişlediğini gösterir.',
          sectorCaution: 'Baz dönemde çok düşük FAVÖK varsa yüzdesel büyüme yüksek görünebilir; marj seviyesiyle birlikte okunmalıdır.',
          finaiFormula: 'FAVÖK Büyümesi (%) = ((TTM FAVÖK - Önceki Yıl TTM FAVÖK) / |Önceki Yıl TTM FAVÖK|) × 100'
        }
      }),
      buildRatio({
        key: 'netIncomeGrowth',
        name: 'Net Kâr Büyümesi',
        value: netIncomeGrowthVal,
        style: 'signed_percent',
        unit: '%',
        periodLabel: 'YoY (TTM)',
        methodology: '((Güncel TTM Net Kâr - Önceki Yıl TTM Net Kâr) / |Önceki Yıl TTM Net Kâr|) × 100',
        tooltip: {
          whatItMeasures: 'Ana ortaklığa ait net dönem kârının yıllık bazda yüzdesel değişimini gösterir.',
          howToInterpret: 'Sürdürülebilir net kâr büyümesi hisse değerlemesini ve temettü kapasitesini doğrudan destekler.',
          sectorCaution: 'Ertelenmiş vergi veya parasal kazanç/kayıp kalemleri yıllık değişimi etkileyebileceğinden FAVÖK büyümesiyle teyit edilmelidir.',
          finaiFormula: 'Net Kâr Büyümesi (%) = ((TTM Net Kâr - Önceki Yıl TTM Net Kâr) / |Önceki Yıl TTM Net Kâr|) × 100'
        }
      }),
      buildRatio({
        key: 'epsGrowth',
        name: 'Hisse Başına Kâr Büyümesi',
        value: epsGrowthVal,
        style: 'signed_percent',
        unit: '%',
        periodLabel: 'YoY (TTM)',
        methodology: '((Güncel TTM EPS - Önceki Yıl TTM EPS) / |Önceki Yıl TTM EPS|) × 100',
        tooltip: {
          whatItMeasures: 'Pay sulanması (sermaye artırımı) etkileri dikkate alındıktan sonra tek bir hisseye düşen kârın yıllık büyümesini ölçer.',
          howToInterpret: 'Hisse geri alımı yapan şirketlerde EPS büyümesi net kâr büyümesinden daha yüksek gerçekleşebilir.',
          sectorCaution: 'Tahsisli veya bedelli sermaye artırımlarında hisse adedi arttığı için EPS büyümesi net kâr büyümesinin gerisinde kalabilir.',
          finaiFormula: 'HBK Büyümesi (%) = ((TTM EPS - Önceki Yıl TTM EPS) / |Önceki Yıl TTM EPS|) × 100'
        }
      })
    ]
  };

  // ============================================================================
  // 5. NAKİT AKIŞI (Serbest nakit akışı, faaliyet nakit akışı/net kâr, FCF verimi)
  // ============================================================================
  const ocfToNetIncomeVal =
    ocfTTM != null && netIncomeTTM != null && netIncomeTTM > 0
      ? ocfTTM / netIncomeTTM
      : null;

  const pfcfTTM = firstNumber(raw.price_free_cash_flow_ttm, raw.price_free_cash_flow_current);
  const fcfYieldVal =
    fcfTTM != null && marketCap != null && marketCap > 0
      ? (fcfTTM / marketCap) * 100
      : pfcfTTM != null && pfcfTTM !== 0
        ? 100 / pfcfTTM
        : null;

  const cashFlow: CategoryRatios = {
    categoryKey: 'cashFlow',
    categoryName: 'Nakit Akışı',
    description: 'Şirketin yatırımlar sonrası ürettiği serbest nakdi, kârın nakde dönüşüm kalitesini ve piyasa değerine oranla nakit getirisini gösterir.',
    ratios: [
      buildRatio({
        key: 'freeCashFlow',
        name: 'Serbest Nakit Akışı',
        value: fcfTTM,
        style: 'compact_money',
        unit: currencySymbol,
        periodLabel: 'TTM',
        methodology: 'TTM Faaliyet Nakit Akışı - TTM Yatırım Harcamaları (CapEx)',
        tooltip: {
          whatItMeasures: 'Şirketin faaliyetlerinden ürettiği nakitten sabit sermaye yatırımları (CapEx) düşüldükten sonra serbest kalan nakit tutarını gösterir.',
          howToInterpret: 'Pozitif ve büyüyen serbest nakit akışı; borç azaltımı, temettü ödemesi ve hisse geri alımının ana kaynağıdır.',
          sectorCaution: 'Büyük kapasite yatırımı yapan sanayi/enerji şirketlerinde yatırım döneminde geçici olarak negatif çıkabilir.',
          finaiFormula: 'Serbest Nakit Akışı (FCF) = İşletme Faaliyetlerinden Nakit Akışı - Yatırım Harcamaları (CapEx)'
        }
      }),
      buildRatio({
        key: 'ocfToNetIncome',
        name: 'Faaliyet Nakit Akışı / Net Kâr',
        value: ocfToNetIncomeVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'TTM İşletme Faaliyetlerinden Nakit Akışı / TTM Net Kâr',
        negativeReason: ocfToNetIncomeVal == null && netIncomeTTM != null && netIncomeTTM <= 0
          ? 'Net kâr negatif veya sıfır olduğu için Faaliyet Nakit Akışı / Net Kâr rasyosu hesaplanmaz.'
          : null,
        tooltip: {
          whatItMeasures: 'Muhasebe kârının ne kadarının gerçek işletme nakit girişiyle desteklendiğini (kâr kalitesini) ölçer.',
          howToInterpret: '1,00x ve üzeri değerler açıklanan net kârın kasaya nakit olarak girdiğini teyit eden güçlü bir kalite sinyalidir.',
          sectorCaution: 'Hızlı büyüyen şirketlerde artan stok ve alacak ihtiyacı nedeniyle işletme nakit akışı geçici olarak net kârın altında kalabilir.',
          finaiFormula: 'Nakit Dönüşüm Kalitesi = TTM Faaliyet Nakit Akışı / TTM Net Kâr'
        }
      }),
      buildRatio({
        key: 'fcfYield',
        name: 'FCF Verimi',
        value: fcfYieldVal,
        style: 'signed_percent',
        unit: '%',
        periodLabel: 'TTM',
        methodology: '(TTM Serbest Nakit Akışı / Piyasa Değeri) × 100',
        tooltip: {
          whatItMeasures: 'Şirketin son 12 ayda ürettiği serbest nakit akışının güncel borsa piyasa değerine oranını ölçer.',
          howToInterpret: 'Yüksek pozitif FCF verimi, hisse fiyatına kıyasla güçlü nakit üretim kapasitesini gösteren en önemli değerleme ölçütlerindendir.',
          sectorCaution: 'Yoğun yatırım döngüsündeki şirketlerde negatif FCF verimi görülebilir; yatırımın tamamlanma takvimiyle birlikte incelenmelidir.',
          finaiFormula: 'FCF Verimi (%) = (TTM Serbest Nakit Akışı / Piyasa Değeri) × 100'
        }
      })
    ]
  };

  // ============================================================================
  // 6. HİSSE BAŞINA GÖSTERGELER (EPS, BVPS, Temettü/Hisse)
  // ============================================================================
  const epsVal = firstNumber(raw.earnings_per_share_basic_ttm, raw.earnings_per_share_diluted_ttm);
  const bvpsVal = bvpsRaw;
  const dpsFy = toFiniteNumber(raw.dps_common_stock_prim_issue_fy);
  const dpsVal = firstNumber(
    raw.dps_common_stock_prim_issue_ttm,
    dpsFy != null && dpsFy > 0 ? dpsFy : null,
    raw.indicated_annual_dividend,
    raw.dividend_amount_recent,
    dpsFy
  );

  const perShare: CategoryRatios = {
    categoryKey: 'perShare',
    categoryName: 'Hisse Başına Göstergeler',
    description: 'Tek bir paya (1 adet hisse senedine) düşen yıllık net kâr, özsermaye defter değeri ve nakit temettü tutarını gösterir.',
    ratios: [
      buildRatio({
        key: 'eps',
        name: 'EPS (Hisse Başına Kâr)',
        value: epsVal,
        style: 'currency',
        unit: currencySymbol,
        periodLabel: 'TTM',
        methodology: 'TTM Ana Ortaklık Net Kârı / Ağırlıklı Ortalama Pay Adedi',
        tooltip: {
          whatItMeasures: 'Şirketin son 12 ayda tek bir hisse senedi başına ürettiği net kâr tutarını gösterir.',
          howToInterpret: 'Düzenli artan EPS, hisse fiyat performansının uzun vadedeki temel sürükleyicisidir.',
          sectorCaution: 'Bedelsiz bölünme sonrasında geçmiş dönem EPS tutarları yeni pay adedine göre düzeltilerek karşılaştırılır.',
          finaiFormula: 'EPS = TTM Net Kâr / Ağırlıklı Ortalama Hisse Adedi'
        }
      }),
      buildRatio({
        key: 'bvps',
        name: 'BVPS (Hisse Başına Defter Değeri)',
        value: bvpsVal,
        style: 'currency',
        unit: currencySymbol,
        periodLabel: 'Son Çeyrek',
        methodology: 'Toplam Ana Ortaklık Özsermayesi / Toplam Pay Adedi',
        tooltip: {
          whatItMeasures: 'Bilançodaki net özsermayenin her bir hisse senedine düşen muhasebe değerini gösterir.',
          howToInterpret: 'Şirket kâr edip özsermayesini büyüttükçe BVPS artar; Hisse Fiyatı / BVPS oranı PD/DD çarpanını verir.',
          sectorCaution: 'Yeniden değerleme yapan gayrimenkul ve sanayi şirketlerinde yıl sonu değerlemeleri BVPS’i yukarı taşıyabilir.',
          finaiFormula: 'BVPS = Toplam Özsermaye / Toplam Hisse Adedi'
        }
      }),
      buildRatio({
        key: 'dps',
        name: 'Temettü / Hisse',
        value: dpsVal,
        style: 'currency',
        unit: currencySymbol,
        periodLabel: 'Yıllık / Son Dağıtım',
        methodology: 'Dağıtılan Toplam Brüt Nakit Temettü / Toplam Pay Adedi',
        tooltip: {
          whatItMeasures: '1 adet hisse senedi sahibine ödenen brüt nakit kâr payı (temettü) tutarını gösterir.',
          howToInterpret: 'Temettü/Hisse tutarının EPS’e oranı temettü dağıtım oranını (payout ratio), fiyata oranı ise Temettü Verimini verir.',
          sectorCaution: 'Taksitli temettü ödeyen şirketlerde yıllık toplam ile tek taksit tutarı KAP kâr dağıtım tablosundan teyit edilmelidir.',
          finaiFormula: 'Temettü / Hisse = Dağıtılan Brüt Nakit Temettü / Toplam Pay Adedi'
        }
      })
    ]
  };

  // ============================================================================
  // 7. KALİTE VE VERİMLİLİK (Stok devir hızı, alacak tahsil süresi, aktif devir hızı)
  // ============================================================================
  const inventoryTurnoverVal = firstNumber(raw.invent_turnover_current, raw.invent_turnover_fy);
  const receivablesTurnoverVal = firstNumber(raw.receivables_turnover_fq, raw.receivables_turnover_fy);
  const dsoVal =
    receivablesTurnoverVal != null && receivablesTurnoverVal > 0
      ? 365 / receivablesTurnoverVal
      : null;
  const assetTurnoverVal = firstNumber(raw.asset_turnover_current, raw.asset_turnover_fy) ?? (
    toFiniteNumber(raw.total_revenue_ttm) != null && toFiniteNumber(raw.total_assets_fq) != null && Number(raw.total_assets_fq) > 0
      ? Number(raw.total_revenue_ttm) / Number(raw.total_assets_fq)
      : null
  );

  const qualityAndEfficiency: CategoryRatios = {
    categoryKey: 'qualityAndEfficiency',
    categoryName: 'Kalite ve Verimlilik',
    description: 'Şirketin stoklarını ne hızla çevirdiğini, ticari alacaklarını kaç günde tahsil ettiğini ve varlıklarından ciro üretme verimliliğini ölçer.',
    ratios: [
      buildRatio({
        key: 'inventoryTurnover',
        name: 'Stok Devir Hızı',
        value: inventoryTurnoverVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'TTM Satılan Malın Maliyeti / Ortalama Stoklar',
        sectorNotApplicableIfNull: isBank || isInsurance || isREIT,
        sectorNotApplicableReason: 'Banka, sigorta ve hizmet/GYO modellerinde ticari stok devir hızı uygulanmaz.',
        tooltip: {
          whatItMeasures: 'Şirketin stoklarını bir yıl içinde kaç kez satıp yenilediğini gösterir.',
          howToInterpret: 'Yüksek stok devir hızı düşük stok tutma maliyetine ve güçlü talep akışına işaret eder (365 / Stok Devir Hızı = Stokta Kalma Süresi).',
          sectorCaution: 'Perakendede 10x-20x seviyeleri görülürken uzun üretim döngülü savunma/proje şirketlerinde 1x-3x normaldir.',
          finaiFormula: 'Stok Devir Hızı = TTM Satılan Malın Maliyeti / Ortalama Stoklar'
        }
      }),
      buildRatio({
        key: 'daysSalesOutstanding',
        name: 'Alacak Tahsil Süresi',
        value: dsoVal,
        style: 'days',
        unit: 'Gün',
        periodLabel: 'TTM',
        methodology: '365 / Alacak Devir Hızı ((Ortalama Ticari Alacaklar / TTM Satışlar) × 365)',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık sektörlerinde ticari alacak tahsil süresi uygulanmaz.',
        tooltip: {
          whatItMeasures: 'Şirketin vadeli satışlarından doğan ticari alacaklarını ortalama kaç günde nakit olarak tahsil ettiğini gösterir.',
          howToInterpret: 'Tahsil süresinin kısalması işletme sermayesi ihtiyacını azaltır ve nakit akışını hızlandırır.',
          sectorCaution: 'Kamu/savunma projeleri ve B2B sanayi satışlarında vade doğal olarak perakende sektöründen daha uzundur.',
          finaiFormula: 'Alacak Tahsil Süresi (Gün) = 365 / Alacak Devir Hızı'
        }
      }),
      buildRatio({
        key: 'assetTurnover',
        name: 'Aktif Devir Hızı',
        value: assetTurnoverVal,
        style: 'multiple',
        unit: 'x',
        periodLabel: 'TTM',
        methodology: 'TTM Toplam Satışlar / Ortalama Toplam Varlıklar',
        sectorNotApplicableIfNull: isBank || isInsurance,
        sectorNotApplicableReason: 'Bankacılık ve sigortacılık sektörlerinde klasik aktif devir hızı uygulanmaz.',
        tooltip: {
          whatItMeasures: 'Şirketin 1 TL tutarındaki toplam varlığıyla yılda kaç TL satış (ciro) ürettiğini ölçer.',
          howToInterpret: 'Yüksek aktif devir hızı varlık tabanının etkin ve yüksek kapasiteyle kullanıldığını gösterir (DuPont ROE analizinin ana bileşenidir).',
          sectorCaution: 'Varlık hafif (asset-light) ticaret/yazılım şirketlerinde yüksek, enerji ve ağır sanayide daha düşüktür.',
          finaiFormula: 'Aktif Devir Hızı = TTM Satış Gelirleri / Ortalama Toplam Varlıklar'
        }
      })
    ]
  };

  if (ebitdaMarginVal != null) {
    flat.ebitdaMargin = ebitdaMarginVal;
  }

  const orderedCategoryKeys: ScreenerCategoryKey[] = [
    'pricing',
    'profitability',
    'leverageAndLiquidity',
    'growth',
    'cashFlow',
    'perShare',
    'qualityAndEfficiency'
  ];

  const screenerCategories: Record<ScreenerCategoryKey, CategoryRatios> = {
    pricing,
    profitability,
    leverageAndLiquidity,
    growth,
    cashFlow,
    perShare,
    qualityAndEfficiency
  };

  const completeness = applicableCount > 0
    ? Math.round((availableCount / applicableCount) * 100)
    : 100;

  const nowIso = new Date().toISOString();

  const result: TvScreenerRatiosResult = {
    symbol: cleanSymbol,
    companyName,
    sector: sectorInfo.displayName,
    industry: tvIndustry,
    asOf: nowIso,
    livePrice,
    marketCap,
    enterpriseValue,
    orderedCategoryKeys,
    screenerCategories,
    // Keep legacy aliases mapped too so nothing in the app ever misses a category key
    categories: {
      ...screenerCategories,
      valuation: pricing,
      leverage: leverageAndLiquidity,
      liquidity: leverageAndLiquidity,
      operational: qualityAndEfficiency
    },
    flat,
    profitability: {
      grossMargin: flat.grossMargin ?? null,
      operatingMargin: flat.operatingMargin ?? null,
      ebitdaMargin: ebitdaMarginVal,
      netMargin: flat.netMargin ?? null,
      roe: flat.roe ?? null,
      roa: flat.roa ?? null,
      roic: flat.roic ?? null
    },
    quality: {
      status: availableCount >= 18 ? 'verified' : availableCount >= 8 ? 'partial' : 'warning',
      completeness,
      warnings: [],
      availableRatioCount: availableCount,
      applicableRatioCount: applicableCount,
      totalRatioCount: totalCount
    },
    sourceMetadata: {
      source: 'TradingView Türkiye Hisse Tarayıcısı',
      market: 'turkey',
      screenerType: 'stock',
      fetchedAt: nowIso,
      verifiedAt: nowIso,
      quality: 'high'
    }
  };

  screenerCache.set(cleanSymbol, { data: result, timestamp: now });
  return result;
}
