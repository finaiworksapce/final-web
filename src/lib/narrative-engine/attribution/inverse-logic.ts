import { FilteredNewsItem, InverseLogicResult } from '../types';

const POSITIVE_CATALYST_KEYWORDS = [
  'rekor kâr', 'kârını artırdı', 'yeni iş ilişkisi', 'ihale kazandı',
  'büyük sipariş', 'gelir patlaması', 'üretim rekoru', 'temettü dağıtacak',
  'hedef fiyat yükseltti', 'al tavsiyesi'
];

const PRICED_IN_KEYWORDS = [
  'beklenti bitti', 'kâr satışı', 'kar satışı', 'fiyatlanmıştı',
  'beklenti dahilinde', 'kâr realizasyonu', 'kar realizasyonu'
];

const CASHFLOW_ONE_OFF_KEYWORDS = [
  'nakit akışı zayıf', 'tek seferlik', 'operasyonel zarar', 'borçluluk arttı',
  'esas faaliyet zararı', 'finansman gideri', 'kur farkı zararı'
];

const MACRO_OVERSHADOW_KEYWORDS = [
  'bist genelinde satış', 'faiz artışı', 'küresel piyasalar düştü',
  'jeopolitik gerilim', 'satış baskısı', 'yabancı satışı'
];

export function evaluateInverseLogic(
  symbol: string,
  monthlyChange: number | undefined,
  cleanNews: FilteredNewsItem[]
): InverseLogicResult {
  // If price didn't drop or isn't simulated as negative, inverse logic doesn't trigger
  if (monthlyChange === undefined || monthlyChange >= 0) {
    return { hasAnomaly: false };
  }

  // Look for confirmed positive news
  const positiveNews = cleanNews.filter(item => {
    const text = `${item.title} ${item.snippet || ''}`.toLowerCase();
    return POSITIVE_CATALYST_KEYWORDS.some(kw => text.includes(kw));
  });

  if (positiveNews.length === 0) {
    // Normal situation: stock fell and there is either negative news or neutral news
    return { hasAnomaly: false };
  }

  // Anomaly detected: Positive news exists, but stock is negative
  const allCorpusText = cleanNews.map(n => `${n.title} ${n.snippet || ''}`).join(' ').toLowerCase();

  // Pattern 1: Priced in / Sell the news
  const matchedPricedIn = PRICED_IN_KEYWORDS.filter(kw => allCorpusText.includes(kw));
  if (matchedPricedIn.length > 0) {
    return {
      hasAnomaly: true,
      verifiedPattern: 'PRICED_IN_EXPECTATION',
      rationale: `Şirketin açıkladığı olumlu haber (${positiveNews[0].title}), izinli finans basını kaynaklarında 'beklentilerin önceden fiyatlanması ve kâr realizasyonu' ile açıklanmıştır.`,
      sourceReference: positiveNews[0].sourceLabel
    };
  }

  // Pattern 2: Cashflow or One-off income
  const matchedCashflow = CASHFLOW_ONE_OFF_KEYWORDS.filter(kw => allCorpusText.includes(kw));
  if (matchedCashflow.length > 0) {
    return {
      hasAnomaly: true,
      verifiedPattern: 'CASHFLOW_OR_ONE_OFF',
      rationale: `Manşetteki kâr artışına rağmen, metinlerde operasyonel nakit akışındaki zayıflık veya finansman giderlerinin kâr marjını baskıladığı belirtilmiştir.`,
      sourceReference: positiveNews[0].sourceLabel
    };
  }

  // Pattern 3: Macro / General Market Overshadowing
  const matchedMacro = MACRO_OVERSHADOW_KEYWORDS.filter(kw => allCorpusText.includes(kw));
  if (matchedMacro.length > 0) {
    return {
      hasAnomaly: true,
      verifiedPattern: 'MACRO_OVERSHADOW',
      rationale: `Şirket olumlu haber akışı sağlamış olsa da, piyasa genelindeki satış baskısı ve faiz ortamı şirketin bireysel pozitifliğini gölgelemiştir.`,
      sourceReference: positiveNews[0].sourceLabel
    };
  }

  // Guardrail Safe Fallback: Do NOT guess or invent conspiracy theories!
  return {
    hasAnomaly: true,
    verifiedPattern: 'UNEXPLAINED',
    rationale: `Şirket bu ay olumlu haber akışına (${positiveNews[0].title}) sahip olmasına rağmen hisse ayı gerileyerek tamamlamıştır. İzinli kaynaklarımızda bu tezatı doğrudan açıklayan teyitli bir gerekçe bulunmamaktadır; genel piyasa koşulları etkili olmuş olabilir.`,
    sourceReference: positiveNews[0].sourceLabel
  };
}
