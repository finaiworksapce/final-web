/**
 * FinAi KAP PDF Parser — Normalizer
 * Turkish locale-aware string manipulation and accounting text cleaning
 */

/**
 * Lowercase a string using Turkish locale rules ('İ' -> 'i', 'I' -> 'ı')
 */
export function turkishToLower(text: string): string {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase();
}

/**
 * Uppercase a string using Turkish locale rules ('i' -> 'İ', 'ı' -> 'I')
 */
export function turkishToUpper(text: string): string {
  if (!text) return '';
  return text
    .replace(/i/g, 'İ')
    .replace(/ı/g, 'I')
    .toUpperCase();
}

/**
 * Clean and collapse all whitespace (including non-breaking spaces \u00A0 and tabs)
 */
export function cleanWhitespace(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u00A0\u200B\u200E\u200F\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(\b20\d)\s+(\d\b)/g, (m, p1, p2) => p1 + p2)
    .trim();
}

/**
 * Normalize financial statement line item label for canonical catalog lookup:
 * - strips surrounding parentheses/brackets for footnotes e.g. "Hasılat (1)" -> "hasılat"
 * - collapses spaces
 * - converts to lowercase with Turkish rules
 * - trims trailing punctuation
 */
export function normalizeItemLabel(rawLabel: string): string {
  if (!rawLabel) return '';
  
  let cleaned = cleanWhitespace(rawLabel);

  // Remove footnote marks at the end like "(1)", "(Dipnot 4)", "[3]", "*"
  cleaned = cleaned.replace(/\s*\(\s*(?:dipnot\s*)?\d+\s*\)\s*$/i, '');
  cleaned = cleaned.replace(/\s*\[\s*(?:dipnot\s*)?\d+\s*\]\s*$/i, '');
  cleaned = cleaned.replace(/\s*\*+\s*$/, '');
  
  // Clean punctuation from borders
  cleaned = cleaned.replace(/^[:\-–—\.\s]+|[:\-–—\.\s]+$/g, '');

  return turkishToLower(cleaned);
}

/**
 * Normalize accounting dash symbols
 */
export function normalizeDash(char: string): string {
  if (!char) return '';
  return char.replace(/[\u2013\u2014\u2212\uFE63\uFF0D]/g, '-');
}
