/**
 * FinAi KAP System — FAZ 4 Canonical Mapping Engine
 * Standardizes raw financial labels against canonical catalog items (72 items).
 * Supports confidence metrics, mapping methods, and zero data loss for UNMAPPED / AMBIGUOUS rows.
 */

import { BASELINE_MAPPING_RULES } from '../parser/mapping-resolver';
import { normalizeItemLabel } from '../parser/normalizer';
import type { FinancialStatementType } from '../../../types/kap-financials';

export type MappingMethod =
  | 'EXACT'
  | 'NORMALIZED_EXACT'
  | 'ALIAS'
  | 'CONTEXTUAL'
  | 'MANUAL_REVIEW'
  | 'UNMAPPED'
  | 'AMBIGUOUS';

export type MappingStatus = 'MAPPED' | 'UNMAPPED' | 'AMBIGUOUS';

export interface EnhancedMappingResult {
  status: MappingStatus;
  canonicalItemCode: string | null;
  confidence: number;
  mappingMethod: MappingMethod;
  matchedRuleLabel?: string;
  notes?: string;
}

/**
 * Standardizes raw financial label to a canonical catalog item code
 */
export function mapRawLabelToCanonical(
  rawLabel: string,
  statementType: FinancialStatementType,
  context?: { tableName?: string; columnLabel?: string }
): EnhancedMappingResult {
  if (!rawLabel || typeof rawLabel !== 'string' || !rawLabel.trim()) {
    return {
      status: 'UNMAPPED',
      canonicalItemCode: null,
      confidence: 0,
      mappingMethod: 'UNMAPPED',
      notes: 'Etiket boş veya geçersiz',
    };
  }

  const cleanRaw = rawLabel.trim();
  const normalized = normalizeItemLabel(cleanRaw);

  // 1. EXACT match (case & whitespace match)
  const exactRule = BASELINE_MAPPING_RULES.find(
    (r) => r.statementType === statementType && r.rawLabel === cleanRaw
  );
  if (exactRule) {
    return {
      status: 'MAPPED',
      canonicalItemCode: exactRule.itemCode,
      confidence: 1.0,
      mappingMethod: 'EXACT',
      matchedRuleLabel: exactRule.rawLabel,
    };
  }

  // 2. NORMALIZED_EXACT match (normalized string match)
  const normExactMatches = BASELINE_MAPPING_RULES.filter(
    (r) => r.statementType === statementType && r.normalizedLabel === normalized
  );

  if (normExactMatches.length === 1) {
    const match = normExactMatches[0];
    return {
      status: 'MAPPED',
      canonicalItemCode: match.itemCode,
      confidence: 0.98,
      mappingMethod: 'NORMALIZED_EXACT',
      matchedRuleLabel: match.rawLabel,
    };
  }

  // 3. ALIAS & ALMOST EXACT ALIAS matching
  const aliasMatches = BASELINE_MAPPING_RULES.filter((r) => {
    if (r.statementType !== statementType) return false;
    const ruleNorm = r.normalizedLabel;
    return (
      normalized.includes(ruleNorm) ||
      ruleNorm.includes(normalized) ||
      (r.pattern && r.pattern.test(normalized))
    );
  });

  if (aliasMatches.length === 1) {
    const match = aliasMatches[0];
    return {
      status: 'MAPPED',
      canonicalItemCode: match.itemCode,
      confidence: Math.min(match.confidence, 0.9),
      mappingMethod: 'ALIAS',
      matchedRuleLabel: match.rawLabel,
    };
  }

  // 4. Check for AMBIGUOUS matches (multiple conflicting matches)
  if (aliasMatches.length > 1) {
    const uniqueItemCodes = Array.from(new Set(aliasMatches.map((m) => m.itemCode)));
    if (uniqueItemCodes.length > 1) {
      return {
        status: 'AMBIGUOUS',
        canonicalItemCode: null,
        confidence: 0.4,
        mappingMethod: 'AMBIGUOUS',
        notes: `Birden fazla olası kalem eşleşti: ${uniqueItemCodes.join(', ')}`,
      };
    } else {
      // All matches point to the same item code
      return {
        status: 'MAPPED',
        canonicalItemCode: uniqueItemCodes[0],
        confidence: 0.85,
        mappingMethod: 'CONTEXTUAL',
        matchedRuleLabel: aliasMatches[0].rawLabel,
      };
    }
  }

  // 5. UNMAPPED fallback (100% preservation of raw data)
  return {
    status: 'UNMAPPED',
    canonicalItemCode: null,
    confidence: 0,
    mappingMethod: 'UNMAPPED',
    notes: 'Katalog eşleşmesi bulunamadı, ham veri UNMAPPED olarak korundu.',
  };
}
