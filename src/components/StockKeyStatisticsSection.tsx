"use client";

import React, { useMemo } from "react";
import { HelpCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricConfig {
  key: string;
  label: string;
  unitType: "multiple" | "percent" | "signed_percent";
}

// 1. SÜTUN: Değerleme & Kârlılık Göstergeleri (F/K, PD/DD, FD/FAVÖK, Brüt kâr marjı, net kâr marjı, özsermaye kârlılığı)
const COLUMN_1_METRICS: MetricConfig[] = [
  { key: "pe", label: "F/K", unitType: "multiple" },
  { key: "pb", label: "PD/DD", unitType: "multiple" },
  { key: "evToEBITDA", label: "FD/FAVÖK", unitType: "multiple" },
  { key: "grossMargin", label: "Brüt Kâr Marjı", unitType: "percent" },
  { key: "netMargin", label: "Net Kâr Marjı", unitType: "percent" },
  { key: "roe", label: "Özsermaye Kârlılığı", unitType: "percent" },
];

// 2. SÜTUN: Borçluluk, Likidite & Büyüme Göstergeleri (Net borç/FAVÖK, cari oran, serbest nakit verimi, Ciro, FAVÖK ve net kâr büyümesi)
const COLUMN_2_METRICS: MetricConfig[] = [
  { key: "netDebtToEBITDA", label: "Net Borç / FAVÖK", unitType: "multiple" },
  { key: "currentRatio", label: "Cari Oran", unitType: "multiple" },
  { key: "fcfYield", label: "Serbest Nakit Verimi", unitType: "percent" },
  { key: "revenueGrowth", label: "Ciro Büyümesi", unitType: "signed_percent" },
  { key: "ebitdaGrowth", label: "FAVÖK Büyümesi", unitType: "signed_percent" },
  { key: "netIncomeGrowth", label: "Net Kâr Büyümesi", unitType: "signed_percent" },
];

interface StockKeyStatisticsSectionProps {
  symbol: string;
  ratiosData?: any;
  stockData?: any;
  fundamentalsData?: any;
  loading?: boolean;
  className?: string;
}

function formatFallback(val: number, unitType: "multiple" | "percent" | "signed_percent"): string {
  if (unitType === "multiple") {
    return `${val.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
  }
  if (unitType === "percent") {
    const neg = val < 0 ? "-" : "";
    return `${neg}%${Math.abs(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  // signed_percent
  const sign = val > 0 ? "+" : val < 0 ? "-" : "";
  return `${sign}%${Math.abs(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StockKeyStatisticsSection({
  symbol,
  ratiosData,
  stockData,
  fundamentalsData,
  loading = false,
  className = ""
}: StockKeyStatisticsSectionProps) {
  // Helper to extract and format metric values robustly across Screener and Fundamentals engines
  const resolveMetric = useMemo(() => {
    return (metric: MetricConfig) => {
      // 1. Search in ratiosData (screenerCategories or categories from TradingView engine)
      const categories = ratiosData?.screenerCategories || ratiosData?.categories;
      if (categories) {
        for (const catKey of Object.keys(categories)) {
          const cat = categories[catKey];
          const found = cat?.ratios?.find((r: any) => r.key === metric.key);
          if (found) {
            if (found.status === "not_applicable") {
              return { formatted: "Sektör Dışı", isNegative: false, isNotApplicable: true, isNull: false };
            }
            if (found.status === "negative_input") {
              return { formatted: "Negatif Girdi", isNegative: true, isNotApplicable: false, isNull: false };
            }
            if (found.value != null && Number.isFinite(found.value)) {
              return {
                formatted: found.formattedValue || formatFallback(found.value, metric.unitType),
                isNegative: found.value < 0,
                isNotApplicable: false,
                isNull: false
              };
            }
          }
        }
      }

      // 2. Direct flat map lookup from ratiosData.flat
      if (ratiosData?.flat && ratiosData.flat[metric.key] != null) {
        const val = ratiosData.flat[metric.key];
        if (Number.isFinite(val)) {
          return {
            formatted: formatFallback(val, metric.unitType),
            isNegative: val < 0,
            isNotApplicable: false,
            isNull: false
          };
        }
      }

      // 3. Profitability shorthand lookup
      if (ratiosData?.profitability && ratiosData.profitability[metric.key] != null) {
        const val = ratiosData.profitability[metric.key];
        if (Number.isFinite(val)) {
          return {
            formatted: formatFallback(val, metric.unitType),
            isNegative: val < 0,
            isNotApplicable: false,
            isNull: false
          };
        }
      }

      // 4. Fallback from stockData / fundamentalsData
      if (metric.key === "pe") {
        const pe = stockData?.pe ?? fundamentalsData?.valuation?.pe;
        if (pe != null && pe > 0) {
          return { formatted: `${pe.toFixed(2)}x`, isNegative: false, isNotApplicable: false, isNull: false };
        }
      }
      if (metric.key === "pb") {
        const pb = stockData?.pb ?? fundamentalsData?.valuation?.pb;
        if (pb != null && pb > 0) {
          return { formatted: `${pb.toFixed(2)}x`, isNegative: false, isNotApplicable: false, isNull: false };
        }
      }
      if (metric.key === "evToEBITDA") {
        const ev = fundamentalsData?.valuation?.evToEbitda;
        if (ev != null && ev > 0) {
          return { formatted: `${ev.toFixed(2)}x`, isNegative: false, isNotApplicable: false, isNull: false };
        }
      }

      return { formatted: "—", isNegative: false, isNotApplicable: false, isNull: true };
    };
  }, [ratiosData, stockData, fundamentalsData]);

  return (
    <div
      className={cn(
        "bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col justify-between select-none min-h-[460px] h-full",
        className
      )}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif"
      }}
    >
      {/* BAŞLIK VE KAPSAM ÇUBUĞU */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            Önemli İstatistikler
          </h3>
          <div className="group relative cursor-help">
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2.5 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none leading-relaxed">
              BIST ve TradingView doğrulanmış finansallarından hesaplanan temel değerleme, kârlılık, likidite ve büyüme göstergeleri.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <span className="flex items-center gap-1 text-[11px] text-[#00008B] font-medium animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Veri Alınıyor
            </span>
          )}
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
            TTM / Konsolide
          </span>
        </div>
      </div>

      {/* METRİK LİSTESİ: 2 SÜTUN (KUTUSUZ, DÜZ METİN VE SATIR ÇİZGİLERİ İLE) */}
      {loading && !ratiosData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12 flex-1 my-auto py-2">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100">
              <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12 flex-1 my-auto">
          {/* 1. SÜTUN: DEĞERLEME & KÂRLILIK (F/K, PD/DD, FD/FAVÖK, Brüt Kâr Marjı, Net Kâr Marjı, ROE) */}
          <div className="flex flex-col justify-between">
            {COLUMN_1_METRICS.map((metric) => {
              const { formatted, isNegative, isNotApplicable, isNull } = resolveMetric(metric);
              return (
                <div
                  key={metric.key}
                  className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 last:border-b-0"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {metric.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm tracking-tight text-right",
                      isNotApplicable || isNull
                        ? "text-slate-400 font-medium"
                        : isNegative
                          ? "text-rose-600 font-bold"
                          : "text-slate-900 font-bold"
                    )}
                  >
                    {formatted}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. SÜTUN: BORÇLULUK, LİKİDİTE & BÜYÜME (Net Borç/FAVÖK, Cari Oran, Serbest Nakit Verimi, Ciro, FAVÖK, Net Kâr Büyümesi) */}
          <div className="flex flex-col justify-between">
            {COLUMN_2_METRICS.map((metric) => {
              const { formatted, isNegative, isNotApplicable, isNull } = resolveMetric(metric);
              return (
                <div
                  key={metric.key}
                  className="flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 last:border-b-0"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {metric.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs sm:text-sm tracking-tight text-right",
                      isNotApplicable || isNull
                        ? "text-slate-400 font-medium"
                        : isNegative
                          ? "text-rose-600 font-bold"
                          : "text-[#00008B] font-bold"
                    )}
                  >
                    {formatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALT BİLGİ DİPNOTU */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-2">
        <span>* Veriler TradingView ve BIST finansal tablolarından derlenmiştir.</span>
        <span className="font-semibold text-[#00008B]">FinAi Intelligence</span>
      </div>
    </div>
  );
}
