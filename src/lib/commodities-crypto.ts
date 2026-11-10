export interface LivePriceData {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  previousClose?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  threeMonthHigh?: number;
  threeMonthLow?: number;
  shortName: string;
  currency: string;
}

const TROY_OUNCE_GRAMS = 31.1034768;

let cacheData: Record<string, LivePriceData> = {};
let lastFetchTime = 0;
const CACHE_TTL_MS = 15 * 1000; // 15 Saniye Canlı Yenileme

function parseTurkishNumber(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    .replace(/[₺$€%\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * Truncgil JSON yanıtının son kısmı zaman zaman yarım kaldığı (SyntaxError: Unterminated string)
 * için tüm metni JSON.parse yapmak yerine ilgili anahtarın nesnesini güvenli şekilde ayrıştırır.
 */
function extractTruncgilItem(rawText: string, key: string): { satis?: number; alis?: number; degisim?: number } | null {
  try {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"${escapedKey}"\\s*:\\s*\\{([^}]+)\\}`, 'i');
    const match = rawText.match(regex);
    if (!match || !match[1]) return null;

    const obj = JSON.parse(`{${match[1]}}`);
    const satis = parseTurkishNumber(obj['Satış'] ?? obj['satis'] ?? obj['Satis']);
    const alis = parseTurkishNumber(obj['Alış'] ?? obj['alis'] ?? obj['Alis']);
    const degisim = parseTurkishNumber(obj['Değişim'] ?? obj['degisim'] ?? obj['Degisim']);

    return {
      satis: satis ?? undefined,
      alis: alis ?? undefined,
      degisim: degisim ?? undefined,
    };
  } catch {
    return null;
  }
}

interface TvTickerQuote {
  close: number;
  changePercent: number;
  changeAbs: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
}

async function fetchTradingViewGlobalQuotes(): Promise<Record<string, TvTickerQuote>> {
  const quotes: Record<string, TvTickerQuote> = {};
  try {
    const res = await fetch('https://scanner.tradingview.com/global/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        symbols: {
          tickers: [
            'OANDA:XAUUSD',
            'TVC:GOLD',
            'TVC:SILVER',
            'FX_IDC:USDTRY',
            'FX_IDC:EURTRY',
            'BIST:ALTIN',
            'BIST:GLDTR',
            'BIST:ZGOLD',
            'BTCTURK:BTCTRY',
            'BTCTURK:ETHTRY',
          ],
          query: { types: [] },
        },
        columns: [
          'name',
          'close',
          'change',
          'change_abs',
          'high',
          'low',
          'price_52_week_high',
          'price_52_week_low',
        ],
      }),
      next: { revalidate: 15 },
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data)) {
        for (const row of json.data) {
          const ticker = String(row?.s || '').toUpperCase();
          const d = row?.d;
          if (ticker && Array.isArray(d) && typeof d[1] === 'number' && d[1] > 0) {
            const close = Number(d[1]);
            const changePercent = typeof d[2] === 'number' ? Number(d[2]) : 0;
            const changeAbs = typeof d[3] === 'number' ? Number(d[3]) : 0;
            const high = typeof d[4] === 'number' && d[4] > 0 ? Number(d[4]) : close;
            const low = typeof d[5] === 'number' && d[5] > 0 ? Number(d[5]) : close;
            const high52 = typeof d[6] === 'number' && d[6] > 0 ? Number(d[6]) : high;
            const low52 = typeof d[7] === 'number' && d[7] > 0 ? Number(d[7]) : low;

            quotes[ticker] = {
              close,
              changePercent,
              changeAbs,
              high,
              low,
              high52: Math.max(high52, close),
              low52: Math.min(low52, close),
            };
          }
        }
      }
    }
  } catch (e) {
    console.warn('TradingView Global Scanner fetch warning:', e);
  }
  return quotes;
}

interface YahooChartMetaQuote {
  price: number;
  prevClose: number;
  changePercent: number;
  high52: number;
  low52: number;
  high3m: number;
  low3m: number;
}

async function fetchYahooChartSummary(yahooTicker: string): Promise<YahooChartMetaQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?range=3mo&interval=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta || typeof meta.regularMarketPrice !== 'number' || meta.regularMarketPrice <= 0) {
      return null;
    }

    const price = Number(meta.regularMarketPrice);
    const quote = result?.indicators?.quote?.[0] || {};
    const closes = (quote.close || []).filter((x: unknown): x is number => typeof x === 'number' && x > 0);
    const highs = (quote.high || []).filter((x: unknown): x is number => typeof x === 'number' && x > 0);
    const lows = (quote.low || []).filter((x: unknown): x is number => typeof x === 'number' && x > 0);

    const prevClose =
      closes.length >= 2
        ? closes[closes.length - 2]
        : typeof meta.chartPreviousClose === 'number' && meta.chartPreviousClose > 0
          ? Number(meta.chartPreviousClose)
          : price;

    const changePercent = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;
    const high3m = highs.length > 0 ? Math.max(...highs, price) : price;
    const low3m = lows.length > 0 ? Math.min(...lows, price) : price;
    const high52 = typeof meta.fiftyTwoWeekHigh === 'number' && meta.fiftyTwoWeekHigh > 0 ? Math.max(meta.fiftyTwoWeekHigh, high3m) : high3m;
    const low52 = typeof meta.fiftyTwoWeekLow === 'number' && meta.fiftyTwoWeekLow > 0 ? Math.min(meta.fiftyTwoWeekLow, low3m) : low3m;

    return {
      price,
      prevClose,
      changePercent,
      high52,
      low52,
      high3m,
      low3m,
    };
  } catch {
    return null;
  }
}

export async function fetchLiveCommoditiesAndCrypto(): Promise<Record<string, LivePriceData>> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && Object.keys(cacheData).length > 0) {
    return cacheData;
  }

  const newPrices: Record<string, LivePriceData> = {};

  // 1. PARALEL BİRİNCİL VERİ KAYNAKLARI: TradingView Global Scanner + Yahoo Finance (3 Aylık & 52 Haftalık) + Truncgil + BTCTurk
  const [tvQuotes, yfGold, yfSilver, yfUsdTry, yfEurTry, truncgilRaw, btcturkJson] = await Promise.all([
    fetchTradingViewGlobalQuotes(),
    fetchYahooChartSummary('GC=F'),
    fetchYahooChartSummary('SI=F'),
    fetchYahooChartSummary('TRY=X'),
    fetchYahooChartSummary('EURTRY=X'),
    fetch('https://finans.truncgil.com/today.json', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 15 },
    })
      .then(r => (r.ok ? r.text() : null))
      .catch(() => null),
    fetch('https://api.btcturk.com/api/v2/ticker', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      next: { revalidate: 15 },
    })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null),
  ]);

  // 2. DÖVİZ KURLARI (USD/TRY & EUR/TRY)
  const tvUsd = tvQuotes['FX_IDC:USDTRY'];
  const tvEur = tvQuotes['FX_IDC:EURTRY'];
  const truncUsd = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'USD') : null;
  const truncEur = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'EUR') : null;

  const usdTryPrice = tvUsd?.close || yfUsdTry?.price || truncUsd?.satis || 50.15;
  const usdTryChangePct = tvUsd?.changePercent ?? yfUsdTry?.changePercent ?? truncUsd?.degisim ?? 0;
  const usdTryHigh52 = tvUsd?.high52 || yfUsdTry?.high52 || usdTryPrice * 1.05;
  const usdTryLow52 = tvUsd?.low52 || yfUsdTry?.low52 || usdTryPrice * 0.82;
  const usdTryHigh3m = yfUsdTry?.high3m || usdTryHigh52;
  const usdTryLow3m = yfUsdTry?.low3m || Math.max(usdTryLow52, usdTryPrice * 0.94);

  const usdData: LivePriceData = {
    symbol: 'USDTRY',
    regularMarketPrice: Number(usdTryPrice.toFixed(4)),
    regularMarketChangePercent: Number(usdTryChangePct.toFixed(2)),
    fiftyTwoWeekHigh: Number(usdTryHigh52.toFixed(4)),
    fiftyTwoWeekLow: Number(usdTryLow52.toFixed(4)),
    threeMonthHigh: Number(usdTryHigh3m.toFixed(4)),
    threeMonthLow: Number(usdTryLow3m.toFixed(4)),
    shortName: 'Amerikan Doları (USD/TRY)',
    currency: 'TRY',
  };
  ['USDTRY', 'USDTRY=X', 'TRY=X', 'USD', 'USDT'].forEach(sym => {
    newPrices[sym] = { ...usdData, symbol: sym };
  });

  const eurTryPrice = tvEur?.close || yfEurTry?.price || truncEur?.satis || 56.35;
  const eurTryChangePct = tvEur?.changePercent ?? yfEurTry?.changePercent ?? truncEur?.degisim ?? 0;
  const eurTryHigh52 = tvEur?.high52 || yfEurTry?.high52 || eurTryPrice * 1.06;
  const eurTryLow52 = tvEur?.low52 || yfEurTry?.low52 || eurTryPrice * 0.84;
  const eurTryHigh3m = yfEurTry?.high3m || eurTryHigh52;
  const eurTryLow3m = yfEurTry?.low3m || Math.max(eurTryLow52, eurTryPrice * 0.94);

  const eurData: LivePriceData = {
    symbol: 'EURTRY',
    regularMarketPrice: Number(eurTryPrice.toFixed(4)),
    regularMarketChangePercent: Number(eurTryChangePct.toFixed(2)),
    fiftyTwoWeekHigh: Number(eurTryHigh52.toFixed(4)),
    fiftyTwoWeekLow: Number(eurTryLow52.toFixed(4)),
    threeMonthHigh: Number(eurTryHigh3m.toFixed(4)),
    threeMonthLow: Number(eurTryLow3m.toFixed(4)),
    shortName: 'Euro (EUR/TRY)',
    currency: 'TRY',
  };
  ['EURTRY', 'EURTRY=X', 'EUR'].forEach(sym => {
    newPrices[sym] = { ...eurData, symbol: sym };
  });

  // 3. ONS ALTIN (XAU/USD) VE REEL 24 AYAR GRAM ALTIN (TRY) HESAPLAMASI
  const tvXau = tvQuotes['OANDA:XAUUSD'] || tvQuotes['TVC:GOLD'];
  const truncGramGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'gram-altin') : null;
  const truncOnsGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'ons') : null;
  const truncCeyrekGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'ceyrek-altin') : null;
  const truncYarimGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'yarim-altin') : null;
  const truncTamGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'tam-altin') : null;
  const truncCumhuriyetGold = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'cumhuriyet-altini') : null;

  const onsUsdPrice = tvXau?.close || yfGold?.price || truncOnsGold?.satis || 4075;
  const onsUsdChangePct = tvXau?.changePercent ?? yfGold?.changePercent ?? truncOnsGold?.degisim ?? 0;
  const onsUsdHigh52 = tvXau?.high52 || yfGold?.high52 || onsUsdPrice * 1.25;
  const onsUsdLow52 = tvXau?.low52 || yfGold?.low52 || onsUsdPrice * 0.85;
  const onsUsdHigh3m = yfGold?.high3m || onsUsdHigh52;
  const onsUsdLow3m = yfGold?.low3m || onsUsdLow52;

  const onsData: LivePriceData = {
    symbol: 'ONS',
    regularMarketPrice: Number(onsUsdPrice.toFixed(2)),
    regularMarketChangePercent: Number(onsUsdChangePct.toFixed(2)),
    fiftyTwoWeekHigh: Number(onsUsdHigh52.toFixed(2)),
    fiftyTwoWeekLow: Number(onsUsdLow52.toFixed(2)),
    threeMonthHigh: Number(onsUsdHigh3m.toFixed(2)),
    threeMonthLow: Number(onsUsdLow3m.toFixed(2)),
    shortName: 'Ons Altın (XAU/USD)',
    currency: 'USD',
  };
  ['ONS', 'XAU', 'XAUUSD', 'XAUUSD=X', 'GC=F'].forEach(sym => {
    newPrices[sym] = { ...onsData, symbol: sym };
  });

  // Gram Altın (TL) = (Ons Altın USD * USD/TRY) / 31.1034768 veya Truncgil Kapalıçarşı/Serbest Piyasa Spot Fiyatı
  const computedGramGold = (onsUsdPrice * usdTryPrice) / TROY_OUNCE_GRAMS;
  const liveGramGoldPrice =
    truncGramGold?.satis && truncGramGold.satis > 2000 && Math.abs(truncGramGold.satis - computedGramGold) / computedGramGold < 0.08
      ? truncGramGold.satis
      : computedGramGold;

  const gramGoldChangePct =
    truncGramGold?.degisim ??
    (tvXau && tvUsd ? tvXau.changePercent + tvUsd.changePercent : onsUsdChangePct);

  const rawGramHigh52 = (onsUsdHigh52 * usdTryHigh52) / TROY_OUNCE_GRAMS;
  const rawGramLow52 = (onsUsdLow52 * usdTryLow52) / TROY_OUNCE_GRAMS;
  const rawGramHigh3m = (onsUsdHigh3m * usdTryHigh3m) / TROY_OUNCE_GRAMS;
  const rawGramLow3m = (onsUsdLow3m * usdTryLow3m) / TROY_OUNCE_GRAMS;

  const gramGoldHigh52 = Math.max(rawGramHigh52, liveGramGoldPrice * 1.02);
  const gramGoldLow52 = Math.min(rawGramLow52, liveGramGoldPrice * 0.95);
  const gramGoldHigh3m = Math.max(rawGramHigh3m, liveGramGoldPrice * 1.01);
  const gramGoldLow3m = Math.min(rawGramLow3m, liveGramGoldPrice * 0.97);
  const gramGoldPrevClose = liveGramGoldPrice / (1 + (gramGoldChangePct || 0) / 100);

  const gramGoldData: LivePriceData = {
    symbol: 'ALTIN',
    regularMarketPrice: Number(liveGramGoldPrice.toFixed(2)),
    regularMarketChange: Number((liveGramGoldPrice - gramGoldPrevClose).toFixed(2)),
    regularMarketChangePercent: Number((gramGoldChangePct || 0).toFixed(2)),
    previousClose: Number(gramGoldPrevClose.toFixed(2)),
    fiftyTwoWeekHigh: Number(gramGoldHigh52.toFixed(2)),
    fiftyTwoWeekLow: Number(gramGoldLow52.toFixed(2)),
    threeMonthHigh: Number(gramGoldHigh3m.toFixed(2)),
    threeMonthLow: Number(gramGoldLow3m.toFixed(2)),
    shortName: 'Gram Altın (24 Ayar Spot TL)',
    currency: 'TRY',
  };

  ['ALTIN', 'GA', 'GRAM-ALTIN', 'GRAM_ALTIN', 'GLD'].forEach(sym => {
    newPrices[sym] = { ...gramGoldData, symbol: sym };
  });

  // Çeyrek, Yarım, Tam ve Cumhuriyet Altını
  const ceyrekPrice = truncCeyrekGold?.satis || Number((liveGramGoldPrice * 1.635).toFixed(2));
  newPrices['CEYREK-ALTIN'] = {
    ...gramGoldData,
    symbol: 'CEYREK-ALTIN',
    regularMarketPrice: ceyrekPrice,
    fiftyTwoWeekHigh: Number((gramGoldHigh52 * 1.635).toFixed(2)),
    fiftyTwoWeekLow: Number((gramGoldLow52 * 1.635).toFixed(2)),
    shortName: 'Çeyrek Altın',
  };
  const yarimPrice = truncYarimGold?.satis || Number((liveGramGoldPrice * 3.27).toFixed(2));
  newPrices['YARIM-ALTIN'] = {
    ...gramGoldData,
    symbol: 'YARIM-ALTIN',
    regularMarketPrice: yarimPrice,
    fiftyTwoWeekHigh: Number((gramGoldHigh52 * 3.27).toFixed(2)),
    fiftyTwoWeekLow: Number((gramGoldLow52 * 3.27).toFixed(2)),
    shortName: 'Yarım Altın',
  };
  const tamPrice = truncTamGold?.satis || Number((liveGramGoldPrice * 6.54).toFixed(2));
  newPrices['TAM-ALTIN'] = {
    ...gramGoldData,
    symbol: 'TAM-ALTIN',
    regularMarketPrice: tamPrice,
    fiftyTwoWeekHigh: Number((gramGoldHigh52 * 6.54).toFixed(2)),
    fiftyTwoWeekLow: Number((gramGoldLow52 * 6.54).toFixed(2)),
    shortName: 'Tam Altın',
  };
  const cumhuriyetPrice = truncCumhuriyetGold?.satis || Number((liveGramGoldPrice * 6.72).toFixed(2));
  newPrices['CUMHURIYET-ALTINI'] = {
    ...gramGoldData,
    symbol: 'CUMHURIYET-ALTINI',
    regularMarketPrice: cumhuriyetPrice,
    fiftyTwoWeekHigh: Number((gramGoldHigh52 * 6.72).toFixed(2)),
    fiftyTwoWeekLow: Number((gramGoldLow52 * 6.72).toFixed(2)),
    shortName: 'Cumhuriyet Altını',
  };

  // 4. BIST ALTIN SERTİFİKASI (ALTIN.S1) VE ALTIN BORSA YATIRIM FONLARI (GLDTR, ZGOLD)
  const tvAltinS1 = tvQuotes['BIST:ALTIN'];
  if (tvAltinS1) {
    const s1Data: LivePriceData = {
      symbol: 'ALTIN.S1',
      regularMarketPrice: Number(tvAltinS1.close.toFixed(2)),
      regularMarketChange: Number(tvAltinS1.changeAbs.toFixed(2)),
      regularMarketChangePercent: Number(tvAltinS1.changePercent.toFixed(2)),
      fiftyTwoWeekHigh: Number(tvAltinS1.high52.toFixed(2)),
      fiftyTwoWeekLow: Number(tvAltinS1.low52.toFixed(2)),
      shortName: 'Darphane Altın Sertifikası (ALTIN.S1)',
      currency: 'TRY',
    };
    ['ALTIN.S1', 'ALTINS1'].forEach(sym => {
      newPrices[sym] = { ...s1Data, symbol: sym };
    });
  } else {
    // 1 adet ALTIN.S1 = 0.01 gram altın bazlı BIST sertifikası
    const fallbackS1 = Number((liveGramGoldPrice * 0.0109).toFixed(2));
    ['ALTIN.S1', 'ALTINS1'].forEach(sym => {
      newPrices[sym] = {
        symbol: sym,
        regularMarketPrice: fallbackS1,
        regularMarketChangePercent: gramGoldData.regularMarketChangePercent,
        fiftyTwoWeekHigh: Number((gramGoldHigh52 * 0.012).toFixed(2)),
        fiftyTwoWeekLow: Number((gramGoldLow52 * 0.01).toFixed(2)),
        shortName: 'Darphane Altın Sertifikası (ALTIN.S1)',
        currency: 'TRY',
      };
    });
  }

  const tvGldtr = tvQuotes['BIST:GLDTR'];
  if (tvGldtr) {
    newPrices['GLDTR'] = {
      symbol: 'GLDTR',
      regularMarketPrice: Number(tvGldtr.close.toFixed(2)),
      regularMarketChange: Number(tvGldtr.changeAbs.toFixed(2)),
      regularMarketChangePercent: Number(tvGldtr.changePercent.toFixed(2)),
      fiftyTwoWeekHigh: Number(tvGldtr.high52.toFixed(2)),
      fiftyTwoWeekLow: Number(tvGldtr.low52.toFixed(2)),
      shortName: 'QNB Finans Portföy Altın BYF (GLDTR)',
      currency: 'TRY',
    };
  }

  const tvZgold = tvQuotes['BIST:ZGOLD'];
  if (tvZgold) {
    newPrices['ZGOLD'] = {
      symbol: 'ZGOLD',
      regularMarketPrice: Number(tvZgold.close.toFixed(2)),
      regularMarketChange: Number(tvZgold.changeAbs.toFixed(2)),
      regularMarketChangePercent: Number(tvZgold.changePercent.toFixed(2)),
      fiftyTwoWeekHigh: Number(tvZgold.high52.toFixed(2)),
      fiftyTwoWeekLow: Number(tvZgold.low52.toFixed(2)),
      shortName: 'Ziraat Portföy Altın Katılım BYF (ZGOLD)',
      currency: 'TRY',
    };
  }

  // 5. GÜMÜŞ (GRAM GÜMÜŞ TRY & ONS GÜMÜŞ USD)
  const tvSilver = tvQuotes['TVC:SILVER'];
  const truncGum = truncgilRaw ? extractTruncgilItem(truncgilRaw, 'gumus') : null;
  const onsSilverUsd = tvSilver?.close || yfSilver?.price || 52.3;
  const onsSilverChangePct = tvSilver?.changePercent ?? yfSilver?.changePercent ?? truncGum?.degisim ?? 0;
  const onsSilverHigh52 = tvSilver?.high52 || yfSilver?.high52 || onsSilverUsd * 1.35;
  const onsSilverLow52 = tvSilver?.low52 || yfSilver?.low52 || onsSilverUsd * 0.85;
  const onsSilverHigh3m = yfSilver?.high3m || onsSilverHigh52;
  const onsSilverLow3m = yfSilver?.low3m || onsSilverLow52;

  const computedGramSilver = (onsSilverUsd * usdTryPrice) / TROY_OUNCE_GRAMS;
  const liveGramSilverPrice =
    truncGum?.satis && truncGum.satis > 15 && Math.abs(truncGum.satis - computedGramSilver) / computedGramSilver < 0.1
      ? truncGum.satis
      : computedGramSilver;

  const gramSilverHigh52 = Math.max((onsSilverHigh52 * usdTryHigh52) / TROY_OUNCE_GRAMS, liveGramSilverPrice * 1.02);
  const gramSilverLow52 = Math.min((onsSilverLow52 * usdTryLow52) / TROY_OUNCE_GRAMS, liveGramSilverPrice * 0.95);
  const gramSilverHigh3m = Math.max((onsSilverHigh3m * usdTryHigh3m) / TROY_OUNCE_GRAMS, liveGramSilverPrice * 1.01);
  const gramSilverLow3m = Math.min((onsSilverLow3m * usdTryLow3m) / TROY_OUNCE_GRAMS, liveGramSilverPrice * 0.97);

  const gramSilverData: LivePriceData = {
    symbol: 'GUMUS',
    regularMarketPrice: Number(liveGramSilverPrice.toFixed(2)),
    regularMarketChangePercent: Number(onsSilverChangePct.toFixed(2)),
    fiftyTwoWeekHigh: Number(gramSilverHigh52.toFixed(2)),
    fiftyTwoWeekLow: Number(gramSilverLow52.toFixed(2)),
    threeMonthHigh: Number(gramSilverHigh3m.toFixed(2)),
    threeMonthLow: Number(gramSilverLow3m.toFixed(2)),
    shortName: 'Gram Gümüş (Spot TL)',
    currency: 'TRY',
  };
  ['GUMUS', 'GRAM-GUMUS', 'XAG', 'XAGUSD', 'XAGUSD=X', 'SI=F'].forEach(sym => {
    newPrices[sym] = { ...gramSilverData, symbol: sym };
  });

  // 6. KRİPTO PARALAR (BTCTurk + TradingView 52H Dip/Zirve)
  const tvBtc = tvQuotes['BTCTURK:BTCTRY'];
  const tvEth = tvQuotes['BTCTURK:ETHTRY'];

  if (btcturkJson && Array.isArray(btcturkJson.data)) {
    for (const item of btcturkJson.data) {
      if (item.pair === 'BTCTRY' && Number(item.last) > 0) {
        const btcPrice = Number(item.last);
        const btcDailyPct = typeof item.dailyPercent === 'number' ? Number(item.dailyPercent) : tvBtc?.changePercent;
        const btcHigh52 = tvBtc?.high52 || Math.max(Number(item.high || btcPrice), btcPrice * 1.15);
        const btcLow52 = tvBtc?.low52 || Math.min(Number(item.low || btcPrice), btcPrice * 0.75);
        const btcData: LivePriceData = {
          symbol: 'BTC',
          regularMarketPrice: btcPrice,
          regularMarketChangePercent: btcDailyPct,
          fiftyTwoWeekHigh: btcHigh52,
          fiftyTwoWeekLow: btcLow52,
          shortName: 'Bitcoin (BTC/TRY)',
          currency: 'TRY',
        };
        ['BTC', 'BTC-TRY', 'BTC-USD', 'BITCOIN'].forEach(sym => {
          newPrices[sym] = { ...btcData, symbol: sym };
        });
      }
      if (item.pair === 'ETHTRY' && Number(item.last) > 0) {
        const ethPrice = Number(item.last);
        const ethDailyPct = typeof item.dailyPercent === 'number' ? Number(item.dailyPercent) : tvEth?.changePercent;
        const ethHigh52 = tvEth?.high52 || Math.max(Number(item.high || ethPrice), ethPrice * 1.2);
        const ethLow52 = tvEth?.low52 || Math.min(Number(item.low || ethPrice), ethPrice * 0.7);
        const ethData: LivePriceData = {
          symbol: 'ETH',
          regularMarketPrice: ethPrice,
          regularMarketChangePercent: ethDailyPct,
          fiftyTwoWeekHigh: ethHigh52,
          fiftyTwoWeekLow: ethLow52,
          shortName: 'Ethereum (ETH/TRY)',
          currency: 'TRY',
        };
        ['ETH', 'ETH-TRY', 'ETH-USD', 'ETHEREUM'].forEach(sym => {
          newPrices[sym] = { ...ethData, symbol: sym };
        });
      }
    }
  }

  // TradingView veya Coinbase Kripto Yedeği
  if (!newPrices['BTC'] && tvBtc) {
    const btcData: LivePriceData = {
      symbol: 'BTC',
      regularMarketPrice: tvBtc.close,
      regularMarketChangePercent: tvBtc.changePercent,
      fiftyTwoWeekHigh: tvBtc.high52,
      fiftyTwoWeekLow: tvBtc.low52,
      shortName: 'Bitcoin (BTC/TRY)',
      currency: 'TRY',
    };
    ['BTC', 'BTC-TRY', 'BTC-USD', 'BITCOIN'].forEach(sym => {
      newPrices[sym] = { ...btcData, symbol: sym };
    });
  }

  if (!newPrices['ETH'] && tvEth) {
    const ethData: LivePriceData = {
      symbol: 'ETH',
      regularMarketPrice: tvEth.close,
      regularMarketChangePercent: tvEth.changePercent,
      fiftyTwoWeekHigh: tvEth.high52,
      fiftyTwoWeekLow: tvEth.low52,
      shortName: 'Ethereum (ETH/TRY)',
      currency: 'TRY',
    };
    ['ETH', 'ETH-TRY', 'ETH-USD', 'ETHEREUM'].forEach(sym => {
      newPrices[sym] = { ...ethData, symbol: sym };
    });
  }

  if (Object.keys(newPrices).length > 0) {
    cacheData = newPrices;
    lastFetchTime = now;
  }

  return cacheData;
}
