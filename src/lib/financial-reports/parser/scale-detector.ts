/**
 * FinAi KAP PDF Parser — Unit & Scale Detector
 * Detects currency and reporting scale (EXACT, THOUSAND, MILLION, BILLION)
 */

import { cleanWhitespace, turkishToLower } from './normalizer';
import type { ScaleType, ScaleResolution } from './types';

export const SCALE_MULTIPLIERS: Record<ScaleType, number> = {
  EXACT: 1,
  THOUSAND: 1_000,
  MILLION: 1_000_000,
  BILLION: 1_000_000_000,
};

/**
 * Detect currency from text
 */
export function detectCurrency(text: string, defaultCurrency: string = 'TRY'): string {
  if (!text) return defaultCurrency;
  const lower = turkishToLower(text);

  if (lower.includes('usd') || lower.includes('dolar') || lower.includes('$')) {
    return 'USD';
  }
  if (lower.includes('eur') || lower.includes('avro') || lower.includes('euro') || lower.includes('€')) {
    return 'EUR';
  }
  if (lower.includes('gbp') || lower.includes('sterlin') || lower.includes('£')) {
    return 'GBP';
  }
  if (lower.includes('tl') || lower.includes('türk lirası') || lower.includes('try') || lower.includes('₺')) {
    return 'TRY';
  }

  return defaultCurrency;
}

/**
 * Detect scale from document headers, tables or footnote texts
 */
export function detectScale(
  text: string,
  source: ScaleResolution['source'] = 'DOCUMENT_HEADER',
  defaultScale: ScaleType = 'THOUSAND',
  defaultCurrency: string = 'TRY'
): ScaleResolution {
  if (!text) {
    return {
      currency: defaultCurrency,
      scale: defaultScale,
      scaleMultiplier: SCALE_MULTIPLIERS[defaultScale],
      rawScaleText: '',
      source: 'DEFAULT',
    };
  }

  const cleaned = cleanWhitespace(text);
  const lower = turkishToLower(cleaned);
  const detectedCurrency = detectCurrency(lower, defaultCurrency);

  // 1. Billions check
  if (lower.includes('milyar') || lower.includes('billion')) {
    return {
      currency: detectedCurrency,
      scale: 'BILLION',
      scaleMultiplier: SCALE_MULTIPLIERS.BILLION,
      rawScaleText: cleaned,
      source,
    };
  }

  // 2. Millions check
  if (lower.includes('milyon') || lower.includes('million')) {
    return {
      currency: detectedCurrency,
      scale: 'MILLION',
      scaleMultiplier: SCALE_MULTIPLIERS.MILLION,
      rawScaleText: cleaned,
      source,
    };
  }

  // 3. Thousands check
  if (
    lower.includes('bin tl') ||
    lower.includes('bin türk lirası') ||
    lower.includes('bin try') ||
    lower.includes('bin usd') ||
    lower.includes('bin euro') ||
    lower.includes('bin eur') ||
    lower.includes('thousand') ||
    lower.includes('000 tl') ||
    lower.includes('aksi belirtilmedikçe bin')
  ) {
    return {
      currency: detectedCurrency,
      scale: 'THOUSAND',
      scaleMultiplier: SCALE_MULTIPLIERS.THOUSAND,
      rawScaleText: cleaned,
      source,
    };
  }

  // 4. Explicit exact check
  if (
    lower.includes('tam tl') ||
    lower.includes('(tl)') ||
    lower.includes('(try)') ||
    lower.includes('(usd)') ||
    lower.includes('(eur)') ||
    lower.includes('kuruş') ||
    lower.includes('tam türk lirası')
  ) {
    return {
      currency: detectedCurrency,
      scale: 'EXACT',
      scaleMultiplier: SCALE_MULTIPLIERS.EXACT,
      rawScaleText: cleaned,
      source,
    };
  }

  // Fallback to default
  return {
    currency: detectedCurrency,
    scale: defaultScale,
    scaleMultiplier: SCALE_MULTIPLIERS[defaultScale],
    rawScaleText: cleaned,
    source: 'DEFAULT',
  };
}
