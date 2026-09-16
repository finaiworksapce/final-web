/**
 * FinAI Fundamentals Service - Stage 5B
 * Resilient Historical Financial Repository, Multi-Period Statements, Quality Engine, & Adapter Orchestrator
 */

import { 
  FinancialPeriodData, 
  ValidatedFinancialData,
  HistoricalDividendRecord
} from '@/types/financials';
import { getSectorCategory, normalizeSymbol } from '@/lib/sector-categorizer';
import { validateFinancialData } from '@/lib/financial-validator';
import { calculateTTM } from '@/lib/ttm-calculator';
import { YahooFinanceAdapter } from '@/lib/adapters/yahoo-finance.adapter';
import { TradingViewAdapter } from '@/lib/adapters/tradingview.adapter';
import { supabase } from '@/lib/supabase';
import { FinAiArchiveReader } from '@/lib/api/finai-archive-reader';

// In-memory server cache (10 minutes TTL for active fundamentals)
const fundamentalsCache = new Map<string, { data: ValidatedFinancialData; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

const yahooAdapter = new YahooFinanceAdapter();
const tradingViewAdapter = new TradingViewAdapter();

/**
 * Persists normalized statements and provenance to Supabase historical archive asynchronously (non-blocking)
 */
async function persistToSupabaseArchive(data: ValidatedFinancialData, provenance: any[] = []): Promise<void> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return; // Skip if Supabase is not configured
    }

    const cleanSymbol = data.normalizedSymbol;
    const now = new Date().toISOString();

    // 1. Persist Raw Provenance Payloads
    for (const prov of provenance) {
      try {
        await supabase.from('raw_source_payloads').insert({
          source: prov.source,
          source_url: prov.sourceUrl || null,
          symbol: cleanSymbol,
          endpoint: prov.endpoint,
          response_hash: prov.responseHash,
          http_status: prov.httpStatus || 200,
          fetched_at: prov.fetchedAt || now,
          raw_payload: prov.rawPayload
        });
      } catch (e) {}
    }

    // 2. Persist Normalized Periods (Quarterly & Annual)
    const allPeriods = [
      ...data.quarters.map(q => ({ ...q, periodType: 'QUARTERLY' })),
      ...data.annuals.map(a => ({ ...a, periodType: 'ANNUAL' }))
    ];

    for (const item of allPeriods) {
      const p = item.period;
      const is = item.incomeStatement;
      const bs = item.balanceSheet;
      const cf = item.cashFlowStatement;
      const ps = item.perShare;

      try {
        // [FAZ 7 DEPRECATED] Writing to financial_statement_periods disabled. KAP system is source of truth.
        console.log(`[LEGACY_ARCHIVED] Write to financial_statement_periods bypassed for ${cleanSymbol}`);
      } catch (e) {}
    }

    // 3. Persist Historical Dividends
    if (data.dividends && data.dividends.length > 0) {
      for (const div of data.dividends) {
        try {
          await supabase.from('historical_dividends').upsert({
            symbol: cleanSymbol,
            company_name: data.companyName,
            ex_date: div.exDate,
            record_date: div.recordDate || null,
            payment_date: div.paymentDate || null,
            announcement_date: div.announcementDate || null,
            gross_amount: div.grossAmount,
            net_amount: div.netAmount || null,
            currency: div.currency || 'TRY',
            source: div.source || 'Yahoo Finance Events API',
            source_url: div.sourceUrl || null,
            validation_status: div.validationStatus || 'VALID',
            is_current: true,
            version: 1,
            fetched_at: now,
            last_verified_at: now,
            updated_at: now
          }, { onConflict: 'symbol,ex_date,source,version' });
        } catch (e) {}
      }
    }
  } catch (err: any) {
    console.warn(`[FundamentalsService] Supabase archive write error for ${data.symbol}:`, err?.message || err);
  }
}

/**
 * Main Entry Point: Fetches Multi-Period Stock Fundamentals, Statements, & Dividends
 */
export async function fetchStockFundamentals(rawSymbol: string): Promise<ValidatedFinancialData> {
  const cleanSymbol = normalizeSymbol(rawSymbol);
  const cacheKey = cleanSymbol;
  const now = Date.now();

  // 1. Check In-Memory Server Cache
  const cached = fundamentalsCache.get(cacheKey);
  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  // 2. Fetch via KAP System First (Source of Truth)
  const sectorInfo = getSectorCategory(cleanSymbol);
  try {
    const kapQuarters = await FinAiArchiveReader.getQuarterlyStatements(cleanSymbol);
    const kapAnnuals = await FinAiArchiveReader.getAnnualStatements(cleanSymbol);
    const hasKapData = kapQuarters?.some(q => q.isKapData) || kapAnnuals?.some(a => a.isKapData);

    if (hasKapData) {
      const mapKapPeriod = (kp: any): FinancialPeriodData => ({
        period: {
          periodType: kp.periodType,
          startDate: kp.periodEnd,
          endDate: kp.periodEnd,
          year: kp.fiscalYear,
          quarter: kp.fiscalQuarter,
          consolidated: true,
          isDiscreteQuarter: true,
          currency: kp.currency || 'TRY',
          sourceCurrency: kp.currency || 'TRY',
          reportedCurrency: kp.currency || 'TRY',
          isRestated: false,
          version: kp.provenance?.version || 1
        },
        incomeStatement: {
          revenue: kp.revenue,
          costOfRevenue: kp.costOfRevenue,
          grossProfit: kp.grossProfit,
          operatingIncome: kp.operatingIncome,
          ebitda: kp.ebitda,
          netIncome: kp.netIncome,
          netIncomeToParent: kp.netIncomeToParent
        },
        balanceSheet: {
          cashAndEquivalents: kp.cashAndEquivalents,
          financialDebt: null,
          shortTermDebt: null,
          longTermDebt: null,
          totalAssets: kp.totalAssets,
          totalLiabilities: kp.totalLiabilities,
          totalEquity: kp.totalEquity,
          parentEquity: kp.parentEquity,
          currentAssets: kp.totalCurrentAssets,
          currentLiabilities: kp.currentLiabilities,
          inventories: null,
          receivables: null,
          netDebt: kp.netDebt
        },
        cashFlowStatement: {
          operatingCashFlow: kp.operatingCashFlow,
          capitalExpenditures: kp.capitalExpenditure,
          freeCashFlow: kp.freeCashFlow
        },
        perShare: {
          basicEPS: null,
          dilutedEPS: null,
          bookValuePerShare: null,
          paidInCapital: null,
          totalShares: null,
          circulatingShares: null,
          freeFloatShares: null,
          freeFloatPercent: null,
          weightedAverageShares: null
        }
      });

      const quarters = (kapQuarters || []).map(mapKapPeriod);
      const annuals = (kapAnnuals || []).map(mapKapPeriod);
      const companyName = `${cleanSymbol} Sanayi ve Ticaret A.Ş.`;
      const ttm = calculateTTM(quarters);

      const quality = validateFinancialData(
        cleanSymbol,
        sectorInfo,
        quarters,
        annuals,
        'KAP Finansal Raporu',
        false,
        undefined,
        false
      );

      const payload: ValidatedFinancialData = {
        symbol: cleanSymbol,
        normalizedSymbol: cleanSymbol,
        companyName,
        source: 'KAP Finansal Raporu',
        sectorInfo,
        quality,
        ttm,
        quarters,
        annuals,
        dividends: [],
        lastUpdated: new Date().toISOString()
      };

      fundamentalsCache.set(cacheKey, { data: payload, timestamp: now });
      return payload;
    }
  } catch (e: any) {
    console.warn(`[FundamentalsService] KAP check error for ${cleanSymbol}:`, e?.message || e);
  }

  // 3. Fallback: External Source Adapter (Yahoo Finance) for unmigrated symbols
  let adapterStatements: any = null;
  let primarySourceFailed = false;

  try {
    adapterStatements = await yahooAdapter.getFinancialStatements(cleanSymbol);
  } catch (e: any) {
    primarySourceFailed = true;
    console.warn(`[FundamentalsService] Primary source failed for ${cleanSymbol}:`, e?.message || e);
  }

  // If primary adapter returned statements
  if (adapterStatements && (adapterStatements.quarters.length > 0 || adapterStatements.annuals.length > 0)) {
    const quarters: FinancialPeriodData[] = adapterStatements.quarters;
    const annuals: FinancialPeriodData[] = adapterStatements.annuals;
    const dividends: HistoricalDividendRecord[] = adapterStatements.dividends || [];
    const companyName = adapterStatements.metadata.companyName;

    // Calculate TTM over 4 discrete quarters
    let ttm = calculateTTM(quarters);

    // Cross-check with TradingView Scanner for live valuation & completeness check
    if (!ttm || !ttm.isVerified || ttm.incomeStatementTTM.revenue == null) {
      const tvSnapshot = await tradingViewAdapter.getCurrentSnapshot(cleanSymbol);
      if (tvSnapshot && tvSnapshot.ttmRevenue != null) {
        const fallbackBs = {
          cashAndEquivalents: ttm?.latestBalanceSheetSnapshot?.cashAndEquivalents ?? null,
          financialDebt: ttm?.latestBalanceSheetSnapshot?.financialDebt ?? tvSnapshot.totalDebt ?? null,
          shortTermDebt: ttm?.latestBalanceSheetSnapshot?.shortTermDebt ?? null,
          longTermDebt: ttm?.latestBalanceSheetSnapshot?.longTermDebt ?? null,
          totalAssets: ttm?.latestBalanceSheetSnapshot?.totalAssets ?? tvSnapshot.totalAssets ?? null,
          totalLiabilities: ttm?.latestBalanceSheetSnapshot?.totalLiabilities ?? null,
          totalEquity: ttm?.latestBalanceSheetSnapshot?.totalEquity ?? null,
          currentAssets: ttm?.latestBalanceSheetSnapshot?.currentAssets ?? null,
          currentLiabilities: ttm?.latestBalanceSheetSnapshot?.currentLiabilities ?? null,
          inventories: ttm?.latestBalanceSheetSnapshot?.inventories ?? null,
          receivables: ttm?.latestBalanceSheetSnapshot?.receivables ?? null,
          netDebt: ttm?.latestBalanceSheetSnapshot?.netDebt ?? null
        };

        const fallbackIncome = {
          revenue: ttm?.incomeStatementTTM?.revenue ?? tvSnapshot.ttmRevenue ?? null,
          costOfRevenue: ttm?.incomeStatementTTM?.costOfRevenue ?? null,
          grossProfit: ttm?.incomeStatementTTM?.grossProfit ?? null,
          operatingIncome: ttm?.incomeStatementTTM?.operatingIncome ?? null,
          ebitda: ttm?.incomeStatementTTM?.ebitda ?? null,
          pretaxIncome: ttm?.incomeStatementTTM?.pretaxIncome ?? null,
          taxExpense: ttm?.incomeStatementTTM?.taxExpense ?? null,
          netIncome: ttm?.incomeStatementTTM?.netIncome ?? tvSnapshot.ttmNetIncome ?? null,
          netIncomeToParent: ttm?.incomeStatementTTM?.netIncomeToParent ?? tvSnapshot.ttmNetIncome ?? null
        };

        ttm = {
          isVerified: quarters.length >= 4,
          periodsUsed: ttm?.periodsUsed || quarters.slice(0, 4).map(q => q.period),
          incomeStatementTTM: fallbackIncome,
          cashFlowTTM: ttm?.cashFlowTTM || {
            operatingCashFlow: null,
            capitalExpenditures: null,
            freeCashFlow: null
          },
          latestBalanceSheetSnapshot: fallbackBs,
          warnings: [
            ...(ttm?.warnings || []),
            ...(quarters.length < 4 ? ['Son 4 çeyreklik geçmiş tamamlanmadığı için TTM göstergeleri kısmi hesaplanmıştır.'] : [])
          ]
        };
      }
    }

    // Run Full Quality Validation Pipeline
    const quality = validateFinancialData(
      cleanSymbol,
      sectorInfo,
      quarters,
      annuals,
      'Yahoo Finance BIST Gateway',
      false,
      undefined,
      false
    );

    const payload: ValidatedFinancialData = {
      symbol: cleanSymbol,
      normalizedSymbol: cleanSymbol,
      companyName,
      sectorInfo,
      quality,
      ttm,
      quarters,
      annuals,
      dividends,
      lastUpdated: new Date().toISOString()
    };

    // Store in In-Memory Server Cache
    fundamentalsCache.set(cacheKey, { data: payload, timestamp: now });

    // Persist to Supabase Archive (non-blocking)
    persistToSupabaseArchive(payload, adapterStatements.provenance);

    return payload;
  }

  // Fallback: If primary source failed, try TradingView for basic profile (NEVER INVENT HISTORICAL SERIES)
  const tvSnapshot = await tradingViewAdapter.getCurrentSnapshot(cleanSymbol);
  const companyName = `${cleanSymbol} Sanayi ve Ticaret A.Ş.`;

  const emptyQuality = validateFinancialData(
    cleanSymbol,
    sectorInfo,
    [],
    [],
    tvSnapshot ? 'TradingView Scanner API (Fallback)' : 'FinAI Primary Data Gateway',
    tvSnapshot != null,
    tvSnapshot ? 'Primary source failed. Resolved current market snapshot via TradingView Scanner.' : 'All financial data sources returned empty.',
    primarySourceFailed
  );

  const fallbackPayload: ValidatedFinancialData = {
    symbol: cleanSymbol,
    normalizedSymbol: cleanSymbol,
    companyName,
    sectorInfo,
    quality: emptyQuality,
    ttm: tvSnapshot && tvSnapshot.ttmRevenue != null ? {
      isVerified: false,
      periodsUsed: [],
      incomeStatementTTM: {
        revenue: tvSnapshot.ttmRevenue,
        grossProfit: null,
        operatingIncome: null,
        ebitda: null,
        netIncome: tvSnapshot.ttmNetIncome
      },
      cashFlowTTM: {
        operatingCashFlow: null,
        capitalExpenditures: null,
        freeCashFlow: null
      },
      latestBalanceSheetSnapshot: {
        cashAndEquivalents: null,
        financialDebt: tvSnapshot.totalDebt,
        shortTermDebt: null,
        longTermDebt: null,
        totalAssets: tvSnapshot.totalAssets,
        totalLiabilities: null,
        totalEquity: null,
        currentAssets: null,
        currentLiabilities: null,
        inventories: null,
        receivables: null,
        netDebt: null
      },
      warnings: ['Tarihsel çeyreklik veriler bulunamadığı için TTM göstergesi salt anlık piyasa tarayıcısından alınmıştır.']
    } : null,
    quarters: [],
    annuals: [],
    dividends: [],
    lastUpdated: new Date().toISOString()
  };

  fundamentalsCache.set(cacheKey, { data: fallbackPayload, timestamp: now });
  return fallbackPayload;
}
