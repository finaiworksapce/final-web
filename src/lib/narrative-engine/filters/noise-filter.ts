import { RawNewsItem, FilteredNewsItem } from '../types';

const PR_NOISE_KEYWORDS = [
  'sponsor', 'sponsorluk', 'maraton', 'sosyal sorumluluk', 'ödül aldı', 'ödül töreni',
  'reklam filmi', 'ziyaret etti', 'iftar', 'kutlama', 'çekiliş', 'konser',
  'fidan dikimi', 'açılış kokteyli', 'hafta sonu rehberi', 'magazin',
  'ziyaret gerçekleştirdi', 'plaket verildi', 'tebrik etti'
];

const MATERIAL_FINANCIAL_KEYWORDS = [
  'bilanço', 'kâr', 'kar', 'zarar', 'gelir', 'hasılat', 'favök', 'ebitda', 'ciro',
  'temettü', 'sermaye artırımı', 'bedelli', 'bedelsiz', 'tahsisli', 'ihale',
  'yeni iş', 'sözleşme', 'sipariş', 'ceza', 'dava', 'soruşturma', 'spk', 'kap',
  'istifa', 'ceo', 'genel müdür', 'atama', 'ortak satışı', 'pay satışı', 'hisse geri alım',
  'iflas', 'konkordato', 'grev', 'yangın', 'üretim durdu', 'bakım', 'revizyon',
  'regülasyon', 'vergi', 'faiz', 'akaryakıt', 'petrol', 'döviz', 'kur', 'enflasyon',
  'hedef fiyat', 'not indirimi', 'not artırımı', 'tavsiye', 'kredi', 'borç'
];

function normalizeTitleForDeduplication(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\sğüşıöç]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .sort()
    .join(' ');
}

// Simple Jaccard similarity between two word sets
function calculateWordSimilarity(titleA: string, titleB: string): number {
  const wordsA = new Set(titleA.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(titleB.toLowerCase().split(/\s+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersection++;
  });

  const union = new Set([...wordsA, ...wordsB]).size;
  return union > 0 ? intersection / union : 0;
}

export function filterAndDeduplicateNews(rawItems: RawNewsItem[]): {
  filtered: FilteredNewsItem[];
  discardedCount: number;
} {
  const result: FilteredNewsItem[] = [];
  const processedTitles: string[] = [];
  let discardedCount = 0;

  for (const item of rawItems) {
    const textToCheck = `${item.title} ${item.snippet || ''}`.toLowerCase();

    // 1. Check for Duplicate News across sources (>65% Jaccard word similarity)
    let isDuplicate = false;
    for (const prevTitle of processedTitles) {
      if (calculateWordSimilarity(item.title, prevTitle) > 0.65) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      discardedCount++;
      result.push({
        ...item,
        isPrNoise: true,
        materialityScore: 1,
        matchedKeywords: [],
        discardReason: 'Farklı kaynaktan mükerrer (kopya) haber olarak elendi'
      });
      continue;
    }

    // 2. Check for PR & Advertising Noise
    const foundPrKeywords = PR_NOISE_KEYWORDS.filter(kw => textToCheck.includes(kw));
    if (foundPrKeywords.length > 0) {
      discardedCount++;
      result.push({
        ...item,
        isPrNoise: true,
        materialityScore: 2,
        matchedKeywords: foundPrKeywords,
        discardReason: `Maddi değeri olmayan PR / Sponsorluk içeriği (${foundPrKeywords.join(', ')})`
      });
      continue;
    }

    // 3. Materiality Scoring
    const matchedMaterial = MATERIAL_FINANCIAL_KEYWORDS.filter(kw => textToCheck.includes(kw));
    let score = 5; // Base score for clean news

    if (matchedMaterial.length > 0) {
      score = Math.min(10, 5 + matchedMaterial.length * 1.5);
    }

    processedTitles.push(item.title);
    result.push({
      ...item,
      isPrNoise: false,
      materialityScore: score,
      matchedKeywords: matchedMaterial
    });
  }

  return {
    filtered: result,
    discardedCount
  };
}
