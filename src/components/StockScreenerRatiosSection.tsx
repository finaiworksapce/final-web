"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  Calculator,
  Coins,
  HelpCircle,
  Layers,
  PieChart,
  RefreshCw,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StockScreenerRatiosSectionProps {
  symbol: string;
  ratiosData: any;
  loading: boolean;
  onSelectTooltip?: (item: any) => void;
  defaultCategory?: string;
}

const CANONICAL_CATEGORY_META: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "pricing", label: "Fiyatlama", icon: Calculator },
  { id: "profitability", label: "Kârlılık", icon: PieChart },
  { id: "leverageAndLiquidity", label: "Borçluluk ve Likidite", icon: ShieldCheck },
  { id: "growth", label: "Büyüme", icon: TrendingUp },
  { id: "cashFlow", label: "Nakit Akışı", icon: Coins },
  { id: "perShare", label: "Hisse Başına Göstergeler", icon: Layers },
  { id: "qualityAndEfficiency", label: "Kalite ve Verimlilik", icon: Activity }
];

const SIGNED_METRIC_KEYS = new Set([
  "revenueGrowth",
  "ebitdaGrowth",
  "netIncomeGrowth",
  "epsGrowth",
  "freeCashFlow",
  "fcfYield"
]);

function formatCompactMoneyTRY(amount: number | null | undefined): string | null {
  if (amount == null || !Number.isFinite(amount)) return null;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000) {
    return `${sign}₺${(abs / 1_000_000_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} Trilyon`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}₺${(abs / 1_000_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} Milyar`;
  }
  if (abs >= 1_000_000) {
    return `${sign}₺${(abs / 1_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })} Milyon`;
  }
  return `${sign}₺${abs.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`;
}

function getRatioBadge(status: string) {
  switch (status) {
    case "available":
    case "VALID":
      return {
        label: "Doğrulandı",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200"
      };
    case "not_applicable":
      return {
        label: "Sektör Dışı",
        className: "bg-zinc-100 text-zinc-600 border-zinc-200"
      };
    case "negative_input":
      return {
        label: "Negatif Girdi",
        className: "bg-purple-50 text-purple-700 border-purple-200"
      };
    case "insufficient_history":
      return {
        label: "Yetersiz Geçmiş",
        className: "bg-amber-50 text-amber-700 border-amber-200"
      };
    case "insufficient_data":
    default:
      return {
        label: "Eksik Veri",
        className: "bg-slate-50 text-slate-600 border-slate-200"
      };
  }
}

export default function StockScreenerRatiosSection({
  symbol,
  ratiosData,
  loading,
  onSelectTooltip,
  defaultCategory = "all"
}: StockScreenerRatiosSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);

  const resolvedCategories = useMemo(() => {
    if (!ratiosData) return [];

    // Primary 7-category TradingView Screener structure
    if (ratiosData.screenerCategories) {
      return CANONICAL_CATEGORY_META.map((meta) => {
        const cat = ratiosData.screenerCategories[meta.id];
        if (!cat) return null;
        return {
          id: meta.id,
          label: cat.categoryName || meta.label,
          description: cat.description || "",
          icon: meta.icon,
          ratios: Array.isArray(cat.ratios) ? cat.ratios : []
        };
      }).filter(Boolean) as {
        id: string;
        label: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
        ratios: any[];
      }[];
    }

    // Legacy fallback structure if screenerCategories not present
    if (ratiosData.categories) {
      const legacyMap: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: "valuation", label: "Fiyatlama", icon: Calculator },
        { id: "profitability", label: "Kârlılık", icon: PieChart },
        { id: "leverage", label: "Borçluluk", icon: ShieldCheck },
        { id: "liquidity", label: "Likidite", icon: ShieldCheck },
        { id: "perShare", label: "Hisse Başına Göstergeler", icon: Layers },
        { id: "operational", label: "Kalite ve Verimlilik", icon: Activity }
      ];
      return legacyMap
        .map((meta) => {
          const cat = ratiosData.categories[meta.id];
          if (!cat) return null;
          return {
            id: meta.id,
            label: cat.categoryName || meta.label,
            description: cat.description || "",
            icon: meta.icon,
            ratios: Array.isArray(cat.ratios) ? cat.ratios : []
          };
        })
        .filter(Boolean) as {
        id: string;
        label: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
        ratios: any[];
      }[];
    }

    return [];
  }, [ratiosData]);

  const totalRatioCount = useMemo(
    () => resolvedCategories.reduce((acc, c) => acc + c.ratios.length, 0),
    [resolvedCategories]
  );

  const visibleCategories = useMemo(() => {
    if (selectedCategory === "all") return resolvedCategories;
    const found = resolvedCategories.find((c) => c.id === selectedCategory);
    return found ? [found] : resolvedCategories;
  }, [resolvedCategories, selectedCategory]);

  const marketCapFormatted = formatCompactMoneyTRY(ratiosData?.marketCap);
  const evFormatted = formatCompactMoneyTRY(ratiosData?.enterpriseValue);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-6">
      {/* ÜST BAŞLIK VE ÖZET ETİKETLERİ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0E1E38] border border-blue-200 flex items-center justify-center shadow-sm shrink-0">
            <Calculator className="w-5 h-5 text-[#0E1E38]" />
          </div>
          <div>
            <h3 className="text-lg font-normal text-[#0E1E38] tracking-tight">
              {symbol} Finansal Rasyolar & Temel Göstergeler
            </h3>
            <p className="text-xs font-bold text-slate-400">
              Fiyatlama, Kârlılık, Borçluluk & Likidite, Büyüme, Nakit Akışı, Hisse Başına ve Verimlilik Analizi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-normal self-start lg:self-auto">
          {marketCapFormatted && (
            <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-xl">
              PD: {marketCapFormatted}
            </span>
          )}
          {evFormatted && (
            <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-xl">
              FD: {evFormatted}
            </span>
          )}
          {ratiosData?.quality && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
              Aktif Rasyo: {ratiosData.quality.availableRatioCount} / {ratiosData.quality.totalRatioCount}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center text-slate-400 font-bold text-xs gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#0E1E38]" />
          {symbol} için finansal rasyolar yükleniyor...
        </div>
      ) : resolvedCategories.length > 0 ? (
        <div className="space-y-6">
          {/* KATEGORİ FİLTRE BUTONLARI */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-3.5 py-2 text-xs font-normal rounded-xl transition-all border whitespace-nowrap flex items-center gap-1.5",
                selectedCategory === "all"
                  ? "bg-[#0E1E38] text-white border-[#78B8F5] shadow-md"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#0E1E38]"
              )}
            >
              <span>Tümü ({totalRatioCount})</span>
            </button>

            {resolvedCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-2 text-xs font-normal rounded-xl transition-all border whitespace-nowrap flex items-center gap-1.5",
                    isActive
                      ? "bg-[#0E1E38] text-white border-[#78B8F5] shadow-md"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#0E1E38]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-white" : "text-[#0E1E38]")} />
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-md font-normal",
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                    )}
                  >
                    {cat.ratios.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* KATEGORİ GRUPLARI VE RASYO KARTLARI */}
          <div className="space-y-6">
            {visibleCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#0E1E38] border border-blue-200 flex items-center justify-center shadow-xs shrink-0">
                        <CategoryIcon className="w-4 h-4 text-[#0E1E38]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-normal text-[#0E1E38] tracking-tight">
                          {category.label}
                        </h4>
                        {category.description && (
                          <p className="text-[11px] font-semibold text-slate-500">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {category.ratios.map((item: any) => {
                      const badge = getRatioBadge(item.status);
                      const isSignedMetric = SIGNED_METRIC_KEYS.has(item.key);
                      const isAvailable = item.status === "available" && item.value != null;

                      let valueColorClass = "text-slate-400 text-base";
                      if (isAvailable) {
                        if (isSignedMetric) {
                          valueColorClass =
                            item.value > 0
                              ? "text-emerald-700"
                              : item.value < 0
                                ? "text-rose-600"
                                : "text-[#0E1E38]";
                        } else if (item.value < 0 && item.key !== "netDebtToEBITDA") {
                          valueColorClass = "text-rose-600";
                        } else {
                          valueColorClass = "text-[#0E1E38]";
                        }
                      }

                      return (
                        <div
                          key={item.key}
                          className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-normal text-slate-800 leading-tight">
                                {item.name}
                              </span>
                              {onSelectTooltip && (
                                <button
                                  type="button"
                                  onClick={() => onSelectTooltip(item)}
                                  className="p-1 rounded-lg bg-blue-50 text-[#0E1E38] hover:bg-blue-100 transition-colors shrink-0"
                                  title="FinAI Eğitici Not & Metodoloji"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-baseline justify-between gap-2 pt-1">
                              <span
                                className={cn(
                                  "text-2xl font-normal tracking-tight",
                                  valueColorClass
                                )}
                              >
                                {isAvailable
                                  ? item.formattedValue
                                  : item.status === "not_applicable"
                                    ? "Sektör Dışı"
                                    : "Veri Mevcut Değil"}
                              </span>

                              <span
                                title={item.reason}
                                className={cn(
                                  "text-[9px] font-normal px-2 py-0.5 rounded-md border uppercase tracking-wider cursor-help shrink-0",
                                  badge.className
                                )}
                              >
                                {badge.label}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px] text-slate-400 font-bold">
                            <span className="truncate" title={item.methodology}>
                              {item.methodology}
                            </span>
                            {item.periodLabel && (
                              <span className="text-[#0E1E38] bg-blue-50 px-1.5 py-0.5 rounded font-normal shrink-0">
                                {item.periodLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 font-bold text-xs">
          {symbol} için finansal rasyo verisi temin edilemedi.
        </div>
      )}
    </div>
  );
}
