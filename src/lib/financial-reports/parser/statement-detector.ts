/**
 * FinAi KAP PDF Parser — Financial Statement & Table Detector
 * Identifies table titles, statement types (BALANCE_SHEET, INCOME_STATEMENT, etc.),
 * and handles multi-table statements (e.g. Assets and Liabilities in Balance Sheet).
 */

import { cleanWhitespace, turkishToLower } from './normalizer';
import type { FinancialStatementType } from '../../../types/kap-financials';

export interface DetectedStatementHeader {
  statementType: FinancialStatementType;
  tableTitle: string;
  confidence: number;
  isPartTwo?: boolean;
}

/**
 * Statement title classification rules
 */
const COMMON_NOTE_EXCLUSIONS = ['dipnot', 'dipnotlar', 'açıklama', 'notlar', 'notes to'];

const STATEMENT_PATTERNS: Array<{
  type: FinancialStatementType;
  patterns: string[];
  exclusions?: string[];
  isPartTwo?: boolean;
}> = [
  {
    type: 'BALANCE_SHEET',
    patterns: [
      'finansal durum tablosu',
      'bilanço',
      'bilanco',
      'yükümlülükler ve özkaynaklar',
      'statement of financial position',
      'balance sheet',
      'kaynaklar',
      'varlıklar',
    ],
    exclusions: COMMON_NOTE_EXCLUSIONS,
  },
  {
    type: 'COMPREHENSIVE_INCOME',
    patterns: [
      'diğer kapsamlı gelir tablosu',
      'diger kapsamli gelir',
      'kapsamlı gelir tablosu',
      'statement of comprehensive income',
    ],
    exclusions: COMMON_NOTE_EXCLUSIONS,
  },
  {
    type: 'INCOME_STATEMENT',
    patterns: [
      'kâr veya zarar tablosu',
      'kar veya zarar tablosu',
      'gelir tablosu',
      'kâr ve zarar tablosu',
      'kâr/zarar tablosu',
      'income statement',
      'statement of profit or loss',
      'statement of income',
    ],
    exclusions: [...COMMON_NOTE_EXCLUSIONS, 'kapsamlı gelir'],
  },
  {
    type: 'CASH_FLOW',
    patterns: [
      'nakit akış tablosu',
      'nakit akis tablosu',
      'nakit akımları tablosu',
      'nakit akim tablosu',
      'statement of cash flows',
      'cash flow statement',
    ],
    exclusions: COMMON_NOTE_EXCLUSIONS,
  },
  {
    type: 'EQUITY_CHANGES',
    patterns: [
      'özkaynak değişim tablosu',
      'özkaynaklar değişim tablosu',
      'ozkaynak degisim tablosu',
      'statement of changes in equity',
    ],
    exclusions: COMMON_NOTE_EXCLUSIONS,
  },
  {
    type: 'OTHER',
    patterns: [
      'finansal tablolara ilişkin dipnotlar',
      'finansal tablolara ait dipnotlar',
      'finansal tablolara ilişkin açıklayıcı notlar',
      'notes to the financial statements',
      'dipnot',
      'açıklama',
    ],
  },
];

/**
 * Classifies a title or page header into a FinancialStatementType
 */
export function classifyStatementType(headerText: string): DetectedStatementHeader {
  if (!headerText) {
    return {
      statementType: 'OTHER',
      tableTitle: 'Bilinmeyen Tablo',
      confidence: 0,
    };
  }

  const cleaned = cleanWhitespace(headerText);
  const lower = turkishToLower(cleaned);
  const collapsed = lower.replace(/\s+/g, '');

  for (const rule of STATEMENT_PATTERNS) {
    if (rule.type === 'OTHER') continue;

    for (const pattern of rule.patterns) {
      const collapsedPattern = pattern.replace(/\s+/g, '');
      if (lower.includes(pattern) || collapsed.includes(collapsedPattern)) {
        if (rule.exclusions && rule.exclusions.some((exc) => lower.includes(exc) || collapsed.includes(exc.replace(/\s+/g, '')))) {
          // Do not exclude if it's a primary statement header containing "tablo" or "finansaldurum" or "bilanço" or "bilanco"
          if (!collapsed.includes('tablo') && !collapsed.includes('finansaldurum') && !collapsed.includes('bilanço') && !collapsed.includes('bilanco')) {
            continue;
          }
        }

        const isPartTwo = lower.includes('kaynaklar') || lower.includes('yükümlülükler');
        const truncatedTitle = cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned;
        return {
          statementType: rule.type,
          tableTitle: truncatedTitle,
          confidence: 0.95,
          isPartTwo,
        };
      }
    }
  }

  const truncatedTitle = cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned;
  return {
    statementType: 'OTHER',
    tableTitle: truncatedTitle,
    confidence: 0.2,
  };
}

/**
 * Generates a unique, deterministic table identifier
 */
export function generateTableIdentifier(
  statementType: FinancialStatementType,
  tableOrder: number,
  pageNumber: number
): string {
  return `${statementType.toLowerCase()}_t${tableOrder}_p${pageNumber}`;
}
