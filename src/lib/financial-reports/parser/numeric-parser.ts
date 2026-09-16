/**
 * FinAi KAP PDF Parser — Numeric Value Parser
 * Parses Turkish financial number formats, parenthesized negatives, accounting dashes, and footnotes.
 */

import { cleanWhitespace, normalizeDash } from './normalizer';
import type { ExtractedValue, ScaleType, ExtractionConfidence } from './types';

export interface ParsedNumberResult {
  rawTextValue: string;
  isDashOrZero: boolean;
  isEmptyOrNull: boolean;
  parsedNumericValue: number | null;
  scaledNumericValue: number | null;
  signApplied: number; // +1 or -1
  footnoteOverride: string | null;
  parseConfidence: ExtractionConfidence;
}

/**
 * Checks if raw text is an accounting dash
 */
export function isAccountingDash(text: string): boolean {
  const normalized = normalizeDash(cleanWhitespace(text));
  return normalized === '-' || normalized === '--' || normalized === '—' || normalized === '–' || normalized === '.-';
}

/**
 * Parses a raw table cell string into a structured financial number.
 * 
 * Examples:
 * - "1.234.567" -> 1234567
 * - "(123.456)" -> -123456
 * - "-123.456" -> -123456
 * - "1.234.567,85" -> 1234567.85
 * - "—" or "-" -> isDashOrZero: true, parsedNumericValue: 0
 * - "0" -> isDashOrZero: true, parsedNumericValue: 0
 * - "" -> isEmptyOrNull: true, parsedNumericValue: null
 * - "45.000 [3]" -> parsedNumericValue: 45000, footnoteOverride: "3"
 */
export function parseFinancialNumber(
  rawInput: string | null | undefined,
  scale: ScaleType = 'EXACT',
  scaleMultiplier: number = 1,
  currency: string = 'TRY'
): ParsedNumberResult {
  const rawTextValue = rawInput != null ? String(rawInput).trim() : '';

  // 1. Empty or null check
  if (!rawTextValue || rawTextValue.length === 0) {
    return {
      rawTextValue,
      isDashOrZero: false,
      isEmptyOrNull: true,
      parsedNumericValue: null,
      scaledNumericValue: null,
      signApplied: 1,
      footnoteOverride: null,
      parseConfidence: 'HIGH',
    };
  }

  // 2. Dash check (accounting dash means 0 or nil, but distinguished by flag)
  if (isAccountingDash(rawTextValue)) {
    return {
      rawTextValue,
      isDashOrZero: true,
      isEmptyOrNull: false,
      parsedNumericValue: 0,
      scaledNumericValue: 0,
      signApplied: 1,
      footnoteOverride: null,
      parseConfidence: 'HIGH',
    };
  }

  // 3. Extract any footnote reference embedded in the cell e.g. "12.345 (2)" or "12.345 [a]"
  let cleaned = rawTextValue;
  let footnoteOverride: string | null = null;
  const footnoteMatch = cleaned.match(/\s*[\(\[]([0-9a-zA-Z]+)[\)\]]\s*$/);
  // Only treat as footnote if there's preceding numeric content and it's not a negative parenthesis "(123.456)"
  if (footnoteMatch && !cleaned.startsWith('(')) {
    footnoteOverride = footnoteMatch[1];
    cleaned = cleaned.replace(/\s*[\(\[]([0-9a-zA-Z]+)[\)\]]\s*$/, '').trim();
  }

  // 4. Check for parentheses indicating negative: "(123.456)" or "( 123.456 )"
  let signApplied = 1;
  const parenthesizedNegative = cleaned.match(/^\s*\(\s*(.*?)\s*\)\s*$/);
  if (parenthesizedNegative) {
    signApplied = -1;
    cleaned = parenthesizedNegative[1];
  } else if (cleaned.startsWith('-') || cleaned.startsWith('−')) {
    signApplied = -1;
    cleaned = cleaned.slice(1).trim();
  }

  // 5. Clean currency symbols and extra spaces
  cleaned = cleaned.replace(/(?:TL|TRY|USD|EUR|\$|€|₺)\s*/gi, '').trim();

  // 6. Handle explicit zero
  if (cleaned === '0' || cleaned === '0,0' || cleaned === '0.0' || cleaned === '0,00' || cleaned === '0.00') {
    return {
      rawTextValue,
      isDashOrZero: true,
      isEmptyOrNull: false,
      parsedNumericValue: 0,
      scaledNumericValue: 0,
      signApplied: 1,
      footnoteOverride,
      parseConfidence: 'HIGH',
    };
  }

  // 7. Parse number with thousand / decimal separators
  // In Turkish KAP:
  // Usually '.' is thousand separator and ',' is decimal separator: "1.234.567,89" or "1.234.567"
  // Occasionally US notation: "1,234,567.89" or "1,234,567"
  let standardNumberStr: string;

  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  if (hasDot && hasComma) {
    const lastDotIndex = cleaned.lastIndexOf('.');
    const lastCommaIndex = cleaned.lastIndexOf(',');

    if (lastCommaIndex > lastDotIndex) {
      // Turkish: "1.234.567,89" -> dots are thousands, comma is decimal
      standardNumberStr = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US: "1,234,567.89" -> commas are thousands, dot is decimal
      standardNumberStr = cleaned.replace(/,/g, '');
    }
  } else if (hasDot && !hasComma) {
    // "1.234.567" or "123.45"
    // If dot has exactly 3 digits following it repeatedly, it's thousand separator: "1.234.567"
    const parts = cleaned.split('.');
    if (parts.length > 1 && parts.slice(1).every((p) => p.length === 3)) {
      standardNumberStr = cleaned.replace(/\./g, '');
    } else if (parts.length === 2 && parts[1].length !== 3) {
      // "123.45" -> dot is decimal
      standardNumberStr = cleaned;
    } else {
      // Default standard Turkish integer: remove dots
      standardNumberStr = cleaned.replace(/\./g, '');
    }
  } else if (!hasDot && hasComma) {
    // "1,234,567" or "123,45"
    const parts = cleaned.split(',');
    if (parts.length > 1 && parts.slice(1).every((p) => p.length === 3)) {
      standardNumberStr = cleaned.replace(/,/g, '');
    } else {
      // Decimal comma: "123,45" -> "123.45"
      standardNumberStr = cleaned.replace(',', '.');
    }
  } else {
    // Plain integer without separator: "1234567"
    standardNumberStr = cleaned;
  }

  const parsedFloat = parseFloat(standardNumberStr);

  if (isNaN(parsedFloat)) {
    // Not a valid number (could be text or unparsable note)
    return {
      rawTextValue,
      isDashOrZero: false,
      isEmptyOrNull: false,
      parsedNumericValue: null,
      scaledNumericValue: null,
      signApplied: 1,
      footnoteOverride,
      parseConfidence: 'LOW',
    };
  }

  const parsedNumericValue = signApplied * parsedFloat;
  const scaledNumericValue = parsedNumericValue * scaleMultiplier;

  return {
    rawTextValue,
    isDashOrZero: parsedNumericValue === 0,
    isEmptyOrNull: false,
    parsedNumericValue,
    scaledNumericValue,
    signApplied,
    footnoteOverride,
    parseConfidence: 'HIGH',
  };
}

/**
 * Builds an ExtractedValue DTO object
 */
export function buildExtractedValue(
  columnOrder: number,
  rawTextValue: string,
  scale: ScaleType,
  scaleMultiplier: number,
  currency: string
): ExtractedValue {
  const parsed = parseFinancialNumber(rawTextValue, scale, scaleMultiplier, currency);

  return {
    columnOrder,
    rawTextValue: parsed.rawTextValue,
    isDashOrZero: parsed.isDashOrZero,
    isEmptyOrNull: parsed.isEmptyOrNull,
    parsedNumericValue: parsed.parsedNumericValue,
    scaledNumericValue: parsed.scaledNumericValue,
    currency,
    scale,
    scaleMultiplier,
    signApplied: parsed.signApplied,
    footnoteOverride: parsed.footnoteOverride,
    parseConfidence: parsed.parseConfidence,
  };
}
