/**
 * FinAi KAP PDF Parser — Period & Column Period Nature Detector
 * Parses Turkish accounting date headers and determines period natures:
 * POINT_IN_TIME, DISCRETE_QUARTER, CUMULATIVE_INTERIM, ANNUAL, COMPARATIVE
 */

import { cleanWhitespace, turkishToLower } from './normalizer';
import type { FinancialPeriodNature } from '../../../types/kap-financials';
import type { PeriodResolution } from './types';

const TURKISH_MONTHS: Record<string, number> = {
  ocak: 1,
  oca: 1,
  subat: 2,
  şubat: 2,
  sub: 2,
  şub: 2,
  mart: 3,
  mar: 3,
  nisan: 4,
  nis: 4,
  mayis: 5,
  mayıs: 5,
  may: 5,
  haziran: 6,
  haz: 6,
  temmuz: 7,
  tem: 7,
  agustos: 8,
  ağustos: 8,
  agu: 8,
  ağu: 8,
  eylul: 9,
  eylül: 9,
  eyl: 9,
  ekim: 10,
  eki: 10,
  kasim: 11,
  kasım: 11,
  kas: 11,
  aralik: 12,
  aralık: 12,
  ara: 12,
};

/**
 * Format date components to YYYY-MM-DD
 */
export function formatIsoDate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Calculate quarter from month
 */
export function getQuarterFromMonth(month: number): number {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}

interface ParsedDatePart {
  day: number;
  month: number;
  year: number;
  iso: string;
}

/**
 * Parses a date string like "30 Haziran 2026" or "30.06.2026" or "30/06/2026"
 */
export function parseTurkishDate(dateStr: string, fallbackYear?: number): ParsedDatePart | null {
  if (!dateStr) return null;
  const cleaned = cleanWhitespace(dateStr);
  const lower = turkishToLower(cleaned);

  // 1. Text month match: "30 Haziran 2026" or "30 Haziran"
  const textMonthRegex = /(\d{1,2})\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)(?:\s+(\d{4}))?/;
  const textMatch = lower.match(textMonthRegex);
  if (textMatch) {
    const day = parseInt(textMatch[1], 10);
    const monthName = textMatch[2];
    const year = textMatch[3] ? parseInt(textMatch[3], 10) : fallbackYear;
    const month = TURKISH_MONTHS[monthName];

    if (month && year && day >= 1 && day <= 31) {
      return { day, month, year, iso: formatIsoDate(year, month, day) };
    }
  }

  // 2. Numeric date match: "30.06.2026" or "30/06/2026"
  const numericRegex = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/;
  const numMatch = cleaned.match(numericRegex);
  if (numMatch) {
    const day = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10);
    const year = parseInt(numMatch[3], 10);
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      return { day, month, year, iso: formatIsoDate(year, month, day) };
    }
  }

  // 3. Year only: "2026"
  const yearOnlyMatch = cleaned.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    const year = parseInt(yearOnlyMatch[1], 10);
    return { day: 31, month: 12, year, iso: formatIsoDate(year, 12, 31) };
  }

  return null;
}

/**
 * Analyzes a column header text to determine exact period nature, dates, duration, and comparative status.
 * 
 * Examples:
 * - "30 Haziran 2026" in Balance Sheet -> POINT_IN_TIME (Q2 2026)
 * - "31 Aralık 2025" in 2026 Balance Sheet -> POINT_IN_TIME (Q4 2025, comparative: true)
 * - "1 Ocak - 30 Haziran 2026" -> CUMULATIVE_INTERIM (6 months)
 * - "1 Nisan - 30 Haziran 2026" -> DISCRETE_QUARTER (3 months)
 * - "1 Ocak - 31 Aralık 2025" -> ANNUAL (12 months)
 */
export function parseColumnPeriod(
  rawHeaderText: string,
  statementType?: string,
  targetFiscalYear?: number
): PeriodResolution {
  const cleaned = cleanWhitespace(rawHeaderText);
  const lower = turkishToLower(cleaned);

  // Check for range: "1 Ocak - 30 Haziran 2026" or "01.01.2026 - 30.06.2026"
  const rangeSeparators = [' - ', ' – ', ' — ', ' / ', ' ila '];
  let isRange = false;
  let startPart = '';
  let endPart = '';

  for (const sep of rangeSeparators) {
    if (cleaned.includes(sep)) {
      const parts = cleaned.split(sep);
      if (parts.length === 2) {
        isRange = true;
        startPart = parts[0].trim();
        endPart = parts[1].trim();
        break;
      }
    }
  }

  if (isRange) {
    // Range detected (e.g. "1 Nisan - 30 Haziran 2026" or "1 Ocak - 30 Haziran 2026")
    const parsedEnd = parseTurkishDate(endPart);
    if (parsedEnd) {
      const parsedStart = parseTurkishDate(startPart, parsedEnd.year);
      const startMonth = parsedStart ? parsedStart.month : 1;
      const endMonth = parsedEnd.month;
      const year = parsedEnd.year;
      const quarter = getQuarterFromMonth(endMonth);

      // Duration calculation
      const durationMonths = parsedStart
        ? (endMonth - startMonth + 1)
        : endMonth;

      let periodType: FinancialPeriodNature = 'UNKNOWN';
      if (durationMonths === 12) {
        periodType = 'ANNUAL';
      } else if (durationMonths === 3 && startMonth > 1) {
        periodType = 'DISCRETE_QUARTER';
      } else if (durationMonths > 3 && durationMonths < 12 && startMonth === 1) {
        periodType = 'CUMULATIVE_INTERIM';
      } else if (durationMonths === 3 && startMonth === 1) {
        periodType = 'CUMULATIVE_INTERIM'; // Q1 is both discrete and cumulative
      }

      const isComparative = targetFiscalYear ? year < targetFiscalYear : false;

      return {
        fiscalYear: year,
        fiscalQuarter: quarter,
        periodStart: parsedStart ? parsedStart.iso : formatIsoDate(year, 1, 1),
        periodEnd: parsedEnd.iso,
        durationMonths,
        periodType,
        isComparative,
        rawHeaderText: cleaned,
        confidence: 0.95,
      };
    }
  }

  // Single date detected (Point in time, e.g. Balance Sheet "30 Haziran 2026")
  const singleDate = parseTurkishDate(cleaned);
  if (singleDate) {
    const isComparative = targetFiscalYear ? singleDate.year < targetFiscalYear : false;
    const quarter = getQuarterFromMonth(singleDate.month);

    return {
      fiscalYear: singleDate.year,
      fiscalQuarter: quarter,
      periodStart: null,
      periodEnd: singleDate.iso,
      durationMonths: 0,
      periodType: 'POINT_IN_TIME',
      isComparative,
      rawHeaderText: cleaned,
      confidence: 0.95,
    };
  }

  // Fallback / Unknown
  const currentYear = targetFiscalYear || new Date().getFullYear();
  return {
    fiscalYear: currentYear,
    fiscalQuarter: 0,
    periodStart: null,
    periodEnd: formatIsoDate(currentYear, 12, 31),
    durationMonths: 0,
    periodType: 'UNKNOWN',
    isComparative: false,
    rawHeaderText: cleaned,
    confidence: 0.3,
  };
}

/**
 * Specifically detects the primary document reporting period from document title or initial pages
 */
export function detectDocumentReportingPeriod(headerText: string): PeriodResolution {
  const cleaned = cleanWhitespace(headerText);
  const lower = turkishToLower(cleaned);

  // Match e.g. "30 Haziran 2026 tarihinde sona eren" or "30 Haziran 2026 tarihi itibarıyla"
  const reportingDateMatches = lower.matchAll(/(\d{1,2})\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)\s+(\d{4})/g);
  let bestCandidate: { day: number; month: number; year: number; raw: string } | null = null;

  for (const m of reportingDateMatches) {
    const day = parseInt(m[1], 10);
    const monthName = m[2];
    const year = parseInt(m[3], 10);
    const month = TURKISH_MONTHS[monthName];

    // Pick the most recent fiscal year (e.g. 2026 over 2024)
    if (month && year >= 2015 && year <= 2099 && day >= 1 && day <= 31) {
      if (!bestCandidate || year > bestCandidate.year) {
        bestCandidate = { day, month, year, raw: m[0] };
      }
    }
  }

  if (bestCandidate) {
    const { day, month, year, raw } = bestCandidate;
    const quarter = getQuarterFromMonth(month);
    const isAltıAylık = lower.includes('altı aylık') || lower.includes('alti aylik') || lower.includes('6 aylık') || quarter === 2;
    const isÜçAylık = lower.includes('üç aylık') || lower.includes('uc aylik') || lower.includes('3 aylık') || quarter === 1;
    const isDokuzAylık = lower.includes('dokuz aylık') || lower.includes('9 aylık') || quarter === 3;
    const isYıllık = lower.includes('yıllık') || lower.includes('yillik') || quarter === 4;

    let durationMonths = 0;
    let periodStart: string | null = null;

    if (isAltıAylık) {
      durationMonths = 6;
      periodStart = formatIsoDate(year, 1, 1);
    } else if (isDokuzAylık) {
      durationMonths = 9;
      periodStart = formatIsoDate(year, 1, 1);
    } else if (isÜçAylık) {
      durationMonths = 3;
      periodStart = formatIsoDate(year, month - 2, 1);
    } else if (isYıllık) {
      durationMonths = 12;
      periodStart = formatIsoDate(year, 1, 1);
    }

    return {
      fiscalYear: year,
      fiscalQuarter: quarter,
      periodStart,
      periodEnd: formatIsoDate(year, month, day),
      durationMonths,
      periodType: durationMonths > 0 ? (durationMonths === 12 ? 'ANNUAL' : 'CUMULATIVE_INTERIM') : 'POINT_IN_TIME',
      isComparative: false,
      rawHeaderText: raw,
      confidence: 0.98,
    };
  }

  return parseColumnPeriod(cleaned);
}

