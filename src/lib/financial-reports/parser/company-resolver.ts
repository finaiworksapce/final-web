/**
 * FinAi KAP PDF Parser — Company Resolver
 * Resolves company identity from PDF header texts using known symbol mappings.
 * Strict matching prevents guessing or assigning to wrong ticker.
 */

import { cleanWhitespace, turkishToLower } from './normalizer';
import type { CompanyResolution } from './types';

export interface KnownSymbolEntry {
  symbol: string;
  finaiSymbol: string;
  companyName: string;
  aliases?: string[];
}

/**
 * Built-in baseline registry (can be extended dynamically via DB or options)
 */
export const DEFAULT_KNOWN_SYMBOLS: KnownSymbolEntry[] = [
  {
    symbol: 'GLCVY',
    finaiSymbol: 'GLCVY',
    companyName: 'GELECEK VARLIK YÖNETİMİ ANONİM ŞİRKETİ',
    aliases: [
      'gelecek varlık yönetimi',
      'gelecek varlik yonetimi',
      'gelecek varlık',
      'gelecek varlik',
      'gelecek varlık yönetimi a.ş.',
      'glcvy',
    ],
  },
  {
    symbol: 'THYAO',
    finaiSymbol: 'THYAO',
    companyName: 'TÜRK HAVA YOLLARI ANONİM ORTAKLIĞI',
    aliases: [
      'türk hava yolları',
      'turk hava yollari',
      'türk hava yolları a.o.',
      'turk hava yollari a.o.',
      'thy a.o.',
      'turkish airlines',
      'thyao',
    ],
  },
  {
    symbol: 'GARAN',
    finaiSymbol: 'GARAN',
    companyName: 'TÜRKİYE GARANTİ BANKASI A.Ş.',
    aliases: ['garanti bbva', 'türkiye garanti bankası', 'turkiye garanti bankasi', 'garan'],
  },
  {
    symbol: 'KCHOL',
    finaiSymbol: 'KCHOL',
    companyName: 'KOÇ HOLDİNG A.Ş.',
    aliases: ['koç holding', 'koc holding', 'kchol'],
  },
  {
    symbol: 'ASELS',
    finaiSymbol: 'ASELS',
    companyName: 'ASELSAN ELEKTRONİK SANAYİ VE TİCARET A.Ş.',
    aliases: ['aselsan', 'asels'],
  },
  {
    symbol: 'EREGL',
    finaiSymbol: 'EREGL',
    companyName: 'EREĞLİ DEMİR VE ÇELİK FABRİKALARI T.A.Ş.',
    aliases: ['ereğli demir çelik', 'erdemir', 'eregl'],
  },
  {
    symbol: 'SISE',
    finaiSymbol: 'SISE',
    companyName: 'TÜRKİYE ŞİŞE VE CAM FABRİKALARI A.Ş.',
    aliases: ['şişecam', 'sisecam', 'türkiye şişe ve cam', 'sise'],
  },
  {
    symbol: 'TUPRS',
    finaiSymbol: 'TUPRS',
    companyName: 'TÜPRAŞ-TÜRKİYE PETROL RAFİNERİLERİ A.Ş.',
    aliases: ['tüpraş', 'tupras', 'tuprs'],
  },
];

/**
 * Resolves company identity from text snippet (first page or document title)
 */
export function resolveCompanyFromText(
  text: string,
  customRegistry?: KnownSymbolEntry[]
): CompanyResolution {
  if (!text) {
    return {
      status: 'UNRESOLVED',
      confidence: 0,
      notes: 'Girdi metni boş, şirket tespit edilemedi.',
    };
  }

  const cleaned = cleanWhitespace(text);
  const lower = turkishToLower(cleaned);
  const registry = customRegistry && customRegistry.length > 0 ? customRegistry : DEFAULT_KNOWN_SYMBOLS;

  const matches: Array<{ entry: KnownSymbolEntry; matchedPattern: string; score: number }> = [];

  for (const entry of registry) {
    // 1. Direct symbol code exact match e.g. "THYAO"
    const symbolLower = entry.symbol.toLowerCase();
    const symbolRegex = new RegExp(`\\b${symbolLower}\\b`, 'i');
    if (symbolRegex.test(lower)) {
      matches.push({
        entry,
        matchedPattern: entry.symbol,
        score: 1.0,
      });
      continue;
    }

    // 2. Exact full company name match
    const nameLower = turkishToLower(entry.companyName);
    if (lower.includes(nameLower)) {
      matches.push({
        entry,
        matchedPattern: entry.companyName,
        score: 0.98,
      });
      continue;
    }

    // 3. Alias matches
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        const aliasLower = turkishToLower(alias);
        if (lower.includes(aliasLower)) {
          matches.push({
            entry,
            matchedPattern: alias,
            score: 0.92,
          });
          break;
        }
      }
    }
  }

  if (matches.length === 1) {
    const match = matches[0];
    return {
      status: 'RESOLVED',
      symbol: match.entry.symbol,
      finaiSymbol: match.entry.finaiSymbol,
      companyName: match.entry.companyName,
      matchedPattern: match.matchedPattern,
      confidence: match.score,
      rawText: cleaned,
      notes: `Şirket başarıyla tespit edildi: ${match.entry.symbol} (${match.entry.companyName})`,
    };
  }

  if (matches.length > 1) {
    // Check if all matches refer to the same symbol
    const uniqueSymbols = Array.from(new Set(matches.map((m) => m.entry.symbol)));
    if (uniqueSymbols.length === 1) {
      const best = matches[0];
      return {
        status: 'RESOLVED',
        symbol: best.entry.symbol,
        finaiSymbol: best.entry.finaiSymbol,
        companyName: best.entry.companyName,
        matchedPattern: best.matchedPattern,
        confidence: best.score,
        rawText: cleaned,
        notes: `Şirket birden fazla desen ile doğrulandı: ${best.entry.symbol}`,
      };
    }

    return {
      status: 'AMBIGUOUS',
      confidence: 0.5,
      rawText: cleaned,
      notes: `Metin birden fazla farklı şirketle eşleşti (${uniqueSymbols.join(', ')}). Güvenlik gereği unresolved bırakıldı.`,
    };
  }

  return {
    status: 'UNRESOLVED',
    confidence: 0,
    rawText: cleaned,
    notes: 'Metin içerisinde kayıtlı herhangi bir BIST şirketi bulunamadı.',
  };
}
