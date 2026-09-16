/**
 * FinAi KAP PDF Parser — Canonical Mapping Resolver
 * Matches raw financial labels against canonical catalog items & rules from Phase 1.
 * Supports exact match, normalized match, and regex rules.
 * Unmapped rows are strictly preserved as 'UNMAPPED' (ZERO DATA LOSS).
 */

import { normalizeItemLabel, turkishToLower } from './normalizer';
import type { FinancialStatementType } from '../../../types/kap-financials';
import type { MappingStatus } from './types';

export interface StaticMappingRule {
  statementType: FinancialStatementType;
  rawLabel: string;
  normalizedLabel: string;
  itemCode: string;
  confidence: number;
  pattern?: RegExp;
}

export interface MappingResolutionResult {
  status: MappingStatus;
  canonicalItemCode: string | null;
  canonicalItemId: string | null;
  confidence: number;
  matchedRule?: string;
  notes?: string;
}

/**
 * Baseline rules seeded in Phase 1 migration
 */
export const BASELINE_MAPPING_RULES: StaticMappingRule[] = [
  // INCOME STATEMENT
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Hasılat', normalizedLabel: 'hasılat', itemCode: 'REVENUE', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Satış Gelirleri', normalizedLabel: 'satış gelirleri', itemCode: 'REVENUE', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Satışların Maliyeti', normalizedLabel: 'satışların maliyeti', itemCode: 'COST_OF_REVENUE', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Satışların Maliyeti (-)', normalizedLabel: 'satışların maliyeti (-)', itemCode: 'COST_OF_REVENUE', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Brüt Kâr (Zarar)', normalizedLabel: 'brüt kâr (zarar)', itemCode: 'GROSS_PROFIT', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Brüt Kar (Zarar)', normalizedLabel: 'brüt kar (zarar)', itemCode: 'GROSS_PROFIT', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Esas Faaliyet Kârı (Zararı)', normalizedLabel: 'esas faaliyet kârı (zararı)', itemCode: 'OPERATING_PROFIT', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Esas Faaliyet Karı (Zararı)', normalizedLabel: 'esas faaliyet karı (zararı)', itemCode: 'OPERATING_PROFIT', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Faaliyet Kârı (Zararı)', normalizedLabel: 'faaliyet kârı (zararı)', itemCode: 'OPERATING_PROFIT', confidence: 0.95 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Dönem Kârı (Zararı)', normalizedLabel: 'dönem kârı (zararı)', itemCode: 'NET_INCOME', confidence: 0.95 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Dönem Net Kârı (Zararı)', normalizedLabel: 'dönem net kârı (zararı)', itemCode: 'NET_INCOME', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Dönem Net Karı (Zararı)', normalizedLabel: 'dönem net karı (zararı)', itemCode: 'NET_INCOME', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Ana Ortaklık Payları', normalizedLabel: 'ana ortaklık payları', itemCode: 'NET_INCOME_PARENT', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Pay Başına Kazanç', normalizedLabel: 'pay başına kazanç', itemCode: 'EPS_BASIC', confidence: 1.0 },
  { statementType: 'INCOME_STATEMENT', rawLabel: 'Hisse Başına Kazanç', normalizedLabel: 'hisse başına kazanç', itemCode: 'EPS_BASIC', confidence: 1.0 },

  // BALANCE SHEET — ASSETS
  { statementType: 'BALANCE_SHEET', rawLabel: 'TOPLAM VARLIKLAR', normalizedLabel: 'toplam varlıklar', itemCode: 'TOTAL_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'VARLIKLAR TOPLAMI', normalizedLabel: 'varlıklar toplamı', itemCode: 'TOTAL_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'DÖNEN VARLIKLAR', normalizedLabel: 'dönen varlıklar', itemCode: 'CURRENT_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'DÖNEN VARLIKLAR TOPLAMI', normalizedLabel: 'dönen varlıklar toplamı', itemCode: 'CURRENT_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'DURAN VARLIKLAR', normalizedLabel: 'duran varlıklar', itemCode: 'NON_CURRENT_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'DURAN VARLIKLAR TOPLAMI', normalizedLabel: 'duran varlıklar toplamı', itemCode: 'NON_CURRENT_ASSETS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Nakit ve Nakit Benzerleri', normalizedLabel: 'nakit ve nakit benzerleri', itemCode: 'CASH_AND_EQUIVALENTS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Ticari Alacaklar', normalizedLabel: 'ticari alacaklar', itemCode: 'TRADE_RECEIVABLES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Stoklar', normalizedLabel: 'stoklar', itemCode: 'INVENTORIES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Maddi Duran Varlıklar', normalizedLabel: 'maddi duran varlıklar', itemCode: 'PROPERTY_PLANT_EQUIPMENT', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'MADDİ DURAN VARLIKLAR (Net)', normalizedLabel: 'maddi duran varlıklar (net)', itemCode: 'PROPERTY_PLANT_EQUIPMENT', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'V. MADDİ DURAN VARLIKLAR (Net)', normalizedLabel: 'v. maddi duran varlıklar (net)', itemCode: 'PROPERTY_PLANT_EQUIPMENT', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Kullanım Hakkı Varlıkları', normalizedLabel: 'kullanım hakkı varlıkları', itemCode: 'RIGHT_OF_USE_ASSETS', confidence: 1.0 },

  // BALANCE SHEET — LIABILITIES & EQUITY
  { statementType: 'BALANCE_SHEET', rawLabel: 'TOPLAM YÜKÜMLÜLÜKLER', normalizedLabel: 'toplam yükümlülükler', itemCode: 'TOTAL_LIABILITIES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'YÜKÜMLÜLÜKLER TOPLAMI', normalizedLabel: 'yükümlülükler toplamı', itemCode: 'TOTAL_LIABILITIES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'KISA VADELİ YÜKÜMLÜLÜKLER', normalizedLabel: 'kısa vadeli yükümlülükler', itemCode: 'SHORT_TERM_LIABILITIES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Kısa Vadeli Borçlanmalar', normalizedLabel: 'kısa vadeli borçlanmalar', itemCode: 'SHORT_TERM_BORROWINGS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Ticari Borçlar', normalizedLabel: 'ticari borçlar', itemCode: 'TRADE_PAYABLES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'UZUN VADELİ YÜKÜMLÜLÜKLER', normalizedLabel: 'uzun vadeli yükümlülükler', itemCode: 'LONG_TERM_LIABILITIES', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Uzun Vadeli Borçlanmalar', normalizedLabel: 'uzun vadeli borçlanmalar', itemCode: 'LONG_TERM_BORROWINGS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'ÖZKAYNAKLAR', normalizedLabel: 'özkaynaklar', itemCode: 'TOTAL_EQUITY', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'XVI. ÖZKAYNAKLAR', normalizedLabel: 'xvi. özkaynaklar', itemCode: 'TOTAL_EQUITY', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'TOPLAM ÖZKAYNAKLAR', normalizedLabel: 'toplam özkaynaklar', itemCode: 'TOTAL_EQUITY', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'ÖZKAYNAKLAR TOPLAMI', normalizedLabel: 'özkaynaklar toplamı', itemCode: 'TOTAL_EQUITY', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Ana Ortaklığa Ait Özkaynaklar', normalizedLabel: 'ana ortaklığa ait özkaynaklar', itemCode: 'EQUITY_PARENT', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Ödenmiş Sermaye', normalizedLabel: 'ödenmiş sermaye', itemCode: 'PAID_IN_CAPITAL', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: '16.1 Ödenmiş Sermaye', normalizedLabel: '16.1 ödenmiş sermaye', itemCode: 'PAID_IN_CAPITAL', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Geçmiş Yıllar Kârları/Zararları', normalizedLabel: 'geçmiş yıllar kârları/zararları', itemCode: 'RETAINED_EARNINGS', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: 'Dönem Net Kârı/Zararı', normalizedLabel: 'dönem net kârı/zararı', itemCode: 'NET_INCOME_PERIOD', confidence: 1.0 },
  { statementType: 'BALANCE_SHEET', rawLabel: '16.6.2 Dönem Net Kâr veya Zararı', normalizedLabel: '16.6.2 dönem net kâr veya zararı', itemCode: 'NET_INCOME_PERIOD', confidence: 1.0 },

  // CASH FLOW
  { statementType: 'CASH_FLOW', rawLabel: 'İşletme Faaliyetlerinden Nakit Akışları', normalizedLabel: 'işletme faaliyetlerinden nakit akışları', itemCode: 'OPERATING_CASH_FLOW', confidence: 1.0 },
  { statementType: 'CASH_FLOW', rawLabel: 'Yatırım Faaliyetlerinden Nakit Akışları', normalizedLabel: 'yatırım faaliyetlerinden nakit akışları', itemCode: 'INVESTING_CASH_FLOW', confidence: 1.0 },
  { statementType: 'CASH_FLOW', rawLabel: 'Finansman Faaliyetlerinden Nakit Akışları', normalizedLabel: 'finansman faaliyetlerinden nakit akışları', itemCode: 'FINANCING_CASH_FLOW', confidence: 1.0 },
  { statementType: 'CASH_FLOW', rawLabel: 'Maddi ve Maddi Olmayan Duran Varlık Alımları', normalizedLabel: 'maddi ve maddi olmayan duran varlık alımları', itemCode: 'CAPITAL_EXPENDITURES', confidence: 1.0 },
  { statementType: 'CASH_FLOW', rawLabel: 'Ödenen Temettüler', normalizedLabel: 'ödenen temettüler', itemCode: 'DIVIDENDS_PAID', confidence: 1.0 },
  { statementType: 'CASH_FLOW', rawLabel: 'Nakit ve Nakit Benzerlerindeki Net Artış (Azalış)', normalizedLabel: 'nakit ve nakit benzerlerindeki net artış (azalış)', itemCode: 'NET_CHANGE_IN_CASH', confidence: 1.0 },
];

/**
 * Resolves canonical mapping for an item label
 */
export function resolveCanonicalMapping(
  rawLabel: string,
  statementType: FinancialStatementType,
  customRules?: StaticMappingRule[]
): MappingResolutionResult {
  if (!rawLabel) {
    return {
      status: 'UNMAPPED',
      canonicalItemCode: null,
      canonicalItemId: null,
      confidence: 0,
      notes: 'Etiket boş',
    };
  }

  const normalized = normalizeItemLabel(rawLabel);
  const rules = customRules || BASELINE_MAPPING_RULES;

  // 1. Direct normalized label exact match within statementType
  const exactMatches = rules.filter(
    (r) => r.statementType === statementType && r.normalizedLabel === normalized
  );

  if (exactMatches.length === 1) {
    const match = exactMatches[0];
    return {
      status: 'MAPPED',
      canonicalItemCode: match.itemCode,
      canonicalItemId: null,
      confidence: match.confidence,
      matchedRule: `EXACT: ${match.normalizedLabel} -> ${match.itemCode}`,
    };
  }

  // 2. Fuzzy / contains match within statementType
  const fuzzyMatches = rules.filter(
    (r) =>
      r.statementType === statementType &&
      (normalized.startsWith(r.normalizedLabel) ||
        r.normalizedLabel.startsWith(normalized) ||
        (r.pattern && r.pattern.test(normalized)))
  );

  if (fuzzyMatches.length === 1) {
    const match = fuzzyMatches[0];
    return {
      status: 'MAPPED',
      canonicalItemCode: match.itemCode,
      canonicalItemId: null,
      confidence: Math.min(match.confidence, 0.9),
      matchedRule: `PARTIAL: ${match.normalizedLabel} -> ${match.itemCode}`,
    };
  }

  // 3. Ambiguous check (multiple matching rules with conflicting item codes)
  if (fuzzyMatches.length > 1) {
    const uniqueItemCodes = Array.from(new Set(fuzzyMatches.map((m) => m.itemCode)));
    if (uniqueItemCodes.length > 1) {
      return {
        status: 'AMBIGUOUS',
        canonicalItemCode: null,
        canonicalItemId: null,
        confidence: 0.4,
        notes: `Birden fazla olası kalem eşleşti: ${uniqueItemCodes.join(', ')}`,
      };
    }
  }

  // 4. Guaranteed zero loss fallback: Unmapped
  return {
    status: 'UNMAPPED',
    canonicalItemCode: null,
    canonicalItemId: null,
    confidence: 0,
    notes: 'Katalogda eşleşen kural bulunamadı, ham veri korundu.',
  };
}
