/**
 * FinAi KAP PDF Parser — Row Parser
 * Extracts tabular financial rows, preserves 100% of raw labels, indent levels,
 * subtotals, and footnote references.
 */

import { cleanWhitespace, normalizeItemLabel, turkishToLower } from './normalizer';
import type { ExtractedRow, ExtractedValue, MappingStatus } from './types';

export interface RawRowInput {
  lineIndex: number;
  rawLabel: string;
  rawValues: string[];
  pdfPageNumber: number;
  indentLevel?: number;
  footnoteRef?: string | null;
}

/**
 * Checks whether a row represents a summary, total, or subtotal
 */
export function isSubtotalLabel(rawLabel: string): boolean {
  if (!rawLabel) return false;
  const lower = turkishToLower(rawLabel);

  return (
    lower.startsWith('toplam') ||
    lower.includes('toplamı') ||
    lower.includes('toplami') ||
    lower.startsWith('net kâr') ||
    lower.startsWith('net kar') ||
    lower.startsWith('brüt kâr') ||
    lower.startsWith('brut kar') ||
    lower.startsWith('faaliyet kârı') ||
    lower.startsWith('faaliyet kari') ||
    lower.startsWith('vergi öncesi kâr') ||
    lower.startsWith('dönem kârı') ||
    lower.startsWith('donem kari')
  );
}

/**
 * Extracts footnote reference if appended to label e.g. "Nakit ve Nakit Benzerleri 4" -> footnote: "4"
 */
export function extractFootnoteFromLabel(rawLabel: string): { cleanedLabel: string; footnoteRef: string | null } {
  if (!rawLabel) return { cleanedLabel: '', footnoteRef: null };

  // Match e.g. "Hasılat (Dipnot 22)" or "Hasılat 22" or "Hasılat [22]"
  const matchWithParentheses = rawLabel.match(/\s*[\(\[](?:dipnot\s*)?(\d+)[\]\)]\s*$/i);
  if (matchWithParentheses) {
    return {
      cleanedLabel: rawLabel.replace(/\s*[\(\[](?:dipnot\s*)?(\d+)[\]\)]\s*$/i, '').trim(),
      footnoteRef: matchWithParentheses[1],
    };
  }

  // Standalone trailing digit if separated by space e.g. "Ticari Alacaklar 7"
  const trailingDigitMatch = rawLabel.match(/^(.*?)\s+(\d{1,2})$/);
  if (trailingDigitMatch) {
    return {
      cleanedLabel: trailingDigitMatch[1].trim(),
      footnoteRef: trailingDigitMatch[2],
    };
  }

  return { cleanedLabel: rawLabel.trim(), footnoteRef: null };
}

/**
 * Parses and constructs an ExtractedRow object with guaranteed ZERO DATA LOSS
 */
export function parseFinancialRow(
  input: RawRowInput,
  tableIdentifier: string,
  values: ExtractedValue[],
  mappingStatus: MappingStatus = 'UNMAPPED',
  canonicalItemId: string | null = null,
  canonicalItemCode: string | null = null,
  mappingRule?: string,
  mappingConfidence: number = 0
): ExtractedRow {
  const { cleanedLabel, footnoteRef: extractedFootnote } = extractFootnoteFromLabel(input.rawLabel);
  const footnoteRef = input.footnoteRef || extractedFootnote;
  const normalizedLabel = normalizeItemLabel(cleanedLabel || input.rawLabel);
  const isSubtotal = isSubtotalLabel(input.rawLabel);
  const rowOrder = input.lineIndex + 1;
  const rowIdentifier = `${tableIdentifier}_r${rowOrder}`;

  return {
    rowOrder,
    rowIdentifier,
    rawLabel: input.rawLabel, // 100% untouched raw text
    normalizedLabel,
    footnoteRef,
    pdfPageNumber: input.pdfPageNumber,
    indentLevel: input.indentLevel ?? (isSubtotal ? 0 : 1),
    isSubtotal,
    canonicalItemId,
    canonicalItemCode,
    mappingStatus,
    mappingRule,
    mappingConfidence,
    values,
  };
}
