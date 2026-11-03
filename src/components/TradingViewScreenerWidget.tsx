"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import StockLogo from "@/components/StockLogo";
import type { BistScreenerStockItem } from "@/app/api/bist/screener/route";

export type ColumnTabId =
  | "overview"
  | "performance"
  | "valuation"
  | "dividends"
  | "margins"
  | "income_statement"
  | "balance_sheet"
  | "oscillators"
  | "moving_averages";

export type ScreenPresetId =
  | "general"
  | "top_gainers"
  | "top_losers"
  | "ath"
  | "atl"
  | "above_52wk_high"
  | "below_52wk_low"
  | "monthly_high"
  | "monthly_low"
  | "most_volatile"
  | "most_capitalized"
  | "volume_leaders"
  | "unusual_volume"
  | "high_dividend"
  | "overbought"
  | "oversold"
  | "outperforming_SMA50"
  | "underperforming_SMA50";

export interface TradingViewScreenerWidgetProps {
  market?: string;
  screenerType?: string;
  columns?: ColumnTabId | (string & {});
  screen?: ScreenPresetId | (string & {});
  theme?: "light" | "dark";
  height?: number | string;
  className?: string;
  externalSector?: string | null;
  onSectorChange?: (sector: string | null) => void;
}

type SortKey = keyof BistScreenerStockItem;

interface ColumnDef {
  key: SortKey;
  label: string;
  align?: "left" | "right";
  render: (item: BistScreenerStockItem) => React.ReactNode;
}

const HEATMAP_TO_SCREENER_SECTOR: Record<string, string> = {
  "Teknoloji & Yazılım": "Teknoloji Hizmetleri",
  "Savunma Sanayii": "Elektronik Teknoloji",
  "Enerji & Yenilenebilir": "Elektrik, Su, Gaz Hizmetleri",
  "Holdingler & Yatırım": "Finans",
  "Demir Çelik & Sanayi": "Enerji-Dışı Mineraller",
  "Perakende & Gıda": "Perakende Satış",
  "Gayrimenkul (GYO)": "Finans",
  "Bankacılık & Finans": "Finans",
  "Otomotiv Sanayi": "Dayanıklı Tüketim Malları",
  "Havacılık & Ulaştırma": "Taşımacılık"
};

// Önceki tarayıcıdaki birebir 9 Sütun Görünüm Seti
const COLUMN_TABS: { id: ColumnTabId; label: string }[] = [
  { id: "overview", label: "Genel Bakış" },
  { id: "performance", label: "Performans" },
  { id: "valuation", label: "Değerleme" },
  { id: "dividends", label: "Temettüler" },
  { id: "margins", label: "Marjlar" },
  { id: "income_statement", label: "Gelir Tablosu" },
  { id: "balance_sheet", label: "Bilanço" },
  { id: "oscillators", label: "Osilatörler" },
  { id: "moving_averages", label: "Trend Takibi" }
];

// Önceki tarayıcıdaki birebir 18 Hazır Ekran Filtresi
const SCREEN_PRESETS: {
  id: ScreenPresetId;
  label: string;
  defaultSort: SortKey;
  defaultOrder: "asc" | "desc";
  match: (s: BistScreenerStockItem) => boolean;
}[] = [
  {
    id: "general",
    label: "Genel",
    defaultSort: "symbol",
    defaultOrder: "asc",
    match: () => true
  },
  {
    id: "top_gainers",
    label: "En Çok Kazananlar",
    defaultSort: "changePercent",
    defaultOrder: "desc",
    match: (s) => (s.changePercent ?? 0) > 0
  },
  {
    id: "top_losers",
    label: "En Çok Kaybedenler",
    defaultSort: "changePercent",
    defaultOrder: "asc",
    match: (s) => (s.changePercent ?? 0) < 0
  },
  {
    id: "ath",
    label: "En Yüksek Fiyat",
    defaultSort: "symbol",
    defaultOrder: "asc",
    match: (s) => s.high != null && s.highAll != null && s.high >= s.highAll * 0.999
  },
  {
    id: "atl",
    label: "Diptekiler",
    defaultSort: "symbol",
    defaultOrder: "asc",
    match: (s) => s.low != null && s.lowAll != null && s.low <= s.lowAll * 1.001
  },
  {
    id: "above_52wk_high",
    label: "Yeni 52 Hafta Yükseği",
    defaultSort: "changePercent",
    defaultOrder: "desc",
    match: (s) => s.high != null && s.high52w != null && s.high >= s.high52w * 0.998
  },
  {
    id: "below_52wk_low",
    label: "Yeni 52 Hafta Düşüğü",
    defaultSort: "changePercent",
    defaultOrder: "asc",
    match: (s) => s.low != null && s.low52w != null && s.low <= s.low52w * 1.002
  },
  {
    id: "monthly_high",
    label: "Yeni Aylık Yüksek",
    defaultSort: "changePercent",
    defaultOrder: "desc",
    match: (s) => s.high != null && s.high1M != null && s.high >= s.high1M * 0.999
  },
  {
    id: "monthly_low",
    label: "Yeni Aylık Düşük",
    defaultSort: "changePercent",
    defaultOrder: "asc",
    match: (s) => s.low != null && s.low1M != null && s.low <= s.low1M * 1.001
  },
  {
    id: "most_volatile",
    label: "En Volatil",
    defaultSort: "volatilityD",
    defaultOrder: "desc",
    match: (s) => s.volatilityD != null
  },
  {
    id: "most_capitalized",
    label: "En Kapitalize",
    defaultSort: "marketCap",
    defaultOrder: "desc",
    match: () => true
  },
  {
    id: "volume_leaders",
    label: "Hacim Liderleri",
    defaultSort: "volume",
    defaultOrder: "desc",
    match: () => true
  },
  {
    id: "unusual_volume",
    label: "Olağandışı Hacim",
    defaultSort: "relVolume10d",
    defaultOrder: "desc",
    match: (s) => (s.relVolume10d ?? 0) > 1.2
  },
  {
    id: "high_dividend",
    label: "Yüksek-temettü",
    defaultSort: "dividendYield",
    defaultOrder: "desc",
    match: (s) => (s.dividendYield ?? 0) > 0
  },
  {
    id: "overbought",
    label: "Fazla Alınmış",
    defaultSort: "rsi",
    defaultOrder: "desc",
    match: (s) => (s.rsi ?? 0) > 70
  },
  {
    id: "oversold",
    label: "Fazla Satılmış",
    defaultSort: "rsi",
    defaultOrder: "asc",
    match: (s) => s.rsi != null && s.rsi < 30
  },
  {
    id: "outperforming_SMA50",
    label: "Yüksek Performanslı BHO50",
    defaultSort: "changePercent",
    defaultOrder: "desc",
    match: (s) => s.price != null && s.sma50 != null && s.price > s.sma50
  },
  {
    id: "underperforming_SMA50",
    label: "Düşük Performanslı BHO50",
    defaultSort: "changePercent",
    defaultOrder: "asc",
    match: (s) => s.price != null && s.sma50 != null && s.price < s.sma50
  }
];

// "Filtreler" Diyaloğu Kategorileri ve Alan Tanımları (Tümü | Tanımlayıcı | Finansal | Teknikler)
type FilterCategory = "all" | "descriptive" | "financial" | "technical";
type RatingBucket = "" | "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";

interface NumericRangeFilter {
  min: string;
  max: string;
}

interface RangeFilterFieldConfig {
  id: string;
  label: string;
  category: Exclude<FilterCategory, "all">;
  field: keyof BistScreenerStockItem;
  unit?: string;
  scale?: number; // örn: Milyar TL girişi için 1_000_000_000 veya Milyon için 1_000_000
  placeholderMin?: string;
  placeholderMax?: string;
}

const RANGE_FILTER_FIELDS: RangeFilterFieldConfig[] = [
  // Tanımlayıcı
  { id: "price", label: "Fiyat (TRY)", category: "descriptive", field: "price", placeholderMin: "Min", placeholderMax: "Maks" },
  { id: "changePercent", label: "Değişim % (1G)", category: "descriptive", field: "changePercent", unit: "%", placeholderMin: "-10", placeholderMax: "10" },
  { id: "volumeM", label: "Hacim (Milyon Lot)", category: "descriptive", field: "volume", scale: 1_000_000, placeholderMin: "Min M", placeholderMax: "Maks M" },
  { id: "valueTradedM", label: "Hacim * Fiyat (Milyon TRY)", category: "descriptive", field: "valueTraded", scale: 1_000_000, placeholderMin: "Min M", placeholderMax: "Maks M" },
  { id: "marketCapB", label: "Piyasa Değeri (Milyar TRY)", category: "descriptive", field: "marketCap", scale: 1_000_000_000, placeholderMin: "Min B", placeholderMax: "Maks B" },
  { id: "employees", label: "Çalışan Sayısı", category: "descriptive", field: "employees", placeholderMin: "Min", placeholderMax: "Maks" },

  // Finansal
  { id: "pe", label: "Fiyat / Kazanç (F/K)", category: "financial", field: "pe", placeholderMin: "0", placeholderMax: "30" },
  { id: "evToEbitda", label: "FD / FAVÖK", category: "financial", field: "evToEbitda", placeholderMin: "0", placeholderMax: "20" },
  { id: "pb", label: "PD / DD", category: "financial", field: "pb", placeholderMin: "0", placeholderMax: "5" },
  { id: "priceRevenue", label: "Fiyat / Gelir", category: "financial", field: "priceRevenue", placeholderMin: "0", placeholderMax: "10" },
  { id: "epsBasic", label: "HBK (TTM, TRY)", category: "financial", field: "epsBasic", placeholderMin: "Min", placeholderMax: "Maks" },
  { id: "dividendYield", label: "Temettü Verimi %", category: "financial", field: "dividendYield", unit: "%", placeholderMin: "0", placeholderMax: "15" },
  { id: "grossMargin", label: "Brüt Kâr Marjı %", category: "financial", field: "grossMargin", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "operatingMargin", label: "Faaliyet Kâr Marjı %", category: "financial", field: "operatingMargin", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "netMargin", label: "Net Kâr Marjı %", category: "financial", field: "netMargin", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "roe", label: "Özsermaye Kârlılığı (ROE %)", category: "financial", field: "roe", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "currentRatio", label: "Cari Oran", category: "financial", field: "currentRatio", placeholderMin: "1", placeholderMax: "5" },
  { id: "quickRatio", label: "Asit-Test (Likidite) Oranı", category: "financial", field: "quickRatio", placeholderMin: "0.5", placeholderMax: "5" },
  { id: "debtToEquity", label: "Borç / Özsermaye", category: "financial", field: "debtToEquity", placeholderMin: "0", placeholderMax: "2" },

  // Teknikler
  { id: "rsi", label: "Göreceli Güç Endeksi (RSI 14)", category: "technical", field: "rsi", placeholderMin: "30", placeholderMax: "70" },
  { id: "volatilityD", label: "Volatilite %", category: "technical", field: "volatilityD", unit: "%", placeholderMin: "0", placeholderMax: "10" },
  { id: "relVolume10d", label: "Göreceli Hacim (10G)", category: "technical", field: "relVolume10d", placeholderMin: "1", placeholderMax: "10" },
  { id: "perfW", label: "Haftalık Performans %", category: "technical", field: "perfW", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "perf1M", label: "Aylık Performans %", category: "technical", field: "perf1M", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "perf1Y", label: "1 Yıllık Performans %", category: "technical", field: "perf1Y", unit: "%", placeholderMin: "Min %", placeholderMax: "Maks %" },
  { id: "adx", label: "Ortalama Yönsel Endeks (ADX 14)", category: "technical", field: "adx", placeholderMin: "20", placeholderMax: "100" },
  { id: "cci20", label: "Emtia Kanal Endeksi (CCI 20)", category: "technical", field: "cci20", placeholderMin: "-100", placeholderMax: "100" }
];

function matchesRatingBucket(score: number | null, bucket: RatingBucket): boolean {
  if (!bucket) return true;
  if (score == null || !Number.isFinite(score)) return false;
  switch (bucket) {
    case "strong_buy":
      return score >= 0.5;
    case "buy":
      return score >= 0.1 && score < 0.5;
    case "neutral":
      return score > -0.1 && score < 0.1;
    case "sell":
      return score <= -0.1 && score > -0.5;
    case "strong_sell":
      return score <= -0.5;
    default:
      return true;
  }
}

function formatCompactNumber(val: number | null, suffix: string = ""): string {
  if (val == null || !Number.isFinite(val)) return "—";
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} T${suffix}`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} B${suffix}`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} M${suffix}`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} K${suffix}`;
  }
  return `${sign}${abs.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}${suffix}`;
}

function formatCurrencyCompactCell(val: number | null, currency: string = "TRY"): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  return (
    <span className={cn("whitespace-nowrap", val < 0 ? "text-[#f23645]" : "text-[#131722]")}>
      {formatCompactNumber(val)} <span className="text-[10px] text-slate-400">{currency}</span>
    </span>
  );
}

function formatPriceCell(val: number | null, currency: string = "TRY"): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  return (
    <span className="whitespace-nowrap font-medium text-[#131722]">
      {val.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
      <span className="text-[10px] text-slate-400">{currency}</span>
    </span>
  );
}

function formatDecimalCell(val: number | null, digits: number = 2): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  return (
    <span className="whitespace-nowrap text-[#131722]">
      {val.toLocaleString("tr-TR", { minimumFractionDigits: digits, maximumFractionDigits: digits })}
    </span>
  );
}

function formatSignedPercentCell(val: number | null): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  const isPos = val > 0;
  const isNeg = val < 0;
  const sign = isPos ? "+" : isNeg ? "-" : "";
  return (
    <span
      className={cn(
        "whitespace-nowrap font-medium",
        isPos ? "text-[#089981]" : isNeg ? "text-[#f23645]" : "text-[#131722]"
      )}
    >
      {sign}
      {Math.abs(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
    </span>
  );
}

function formatPlainPercentCell(val: number | null): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  const neg = val < 0 ? "-" : "";
  return (
    <span className={cn("whitespace-nowrap", val < 0 ? "text-[#f23645]" : "text-[#131722]")}>
      {neg}
      {Math.abs(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
    </span>
  );
}

function formatChangeAbsCell(val: number | null, currency: string = "TRY"): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  const isPos = val > 0;
  const isNeg = val < 0;
  const sign = isPos ? "+" : isNeg ? "-" : "";
  return (
    <span
      className={cn(
        "whitespace-nowrap",
        isPos ? "text-[#089981]" : isNeg ? "text-[#f23645]" : "text-[#131722]"
      )}
    >
      {sign}
      {Math.abs(val).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
      <span className="text-[10px] opacity-75">{currency}</span>
    </span>
  );
}

function formatTechnicalRating(score: number | null): React.ReactNode {
  if (score == null || !Number.isFinite(score)) return <span className="text-slate-400">—</span>;
  if (score >= 0.5) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#2962ff] font-medium whitespace-nowrap">
        <ChevronUp className="w-3.5 h-3.5 -mr-1.5" />
        <ChevronUp className="w-3.5 h-3.5" />
        Güçlü Al
      </span>
    );
  }
  if (score >= 0.1) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#089981] font-medium whitespace-nowrap">
        <ChevronUp className="w-3.5 h-3.5" />
        Al
      </span>
    );
  }
  if (score <= -0.5) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#f23645] font-medium whitespace-nowrap">
        <ChevronDown className="w-3.5 h-3.5 -mr-1.5" />
        <ChevronDown className="w-3.5 h-3.5" />
        Güçlü Sat
      </span>
    );
  }
  if (score <= -0.1) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#f23645] whitespace-nowrap">
        <ChevronDown className="w-3.5 h-3.5" />
        Sat
      </span>
    );
  }
  return <span className="text-slate-500 whitespace-nowrap">Nötr</span>;
}

function StockLogoAvatar({ symbol }: { symbol: string; logoId?: string | null }) {
  return <StockLogo symbol={symbol} className="w-8 h-8 ring-1 ring-slate-200/60 shadow-xs" />;
}

function getColumnsForTab(tab: ColumnTabId): ColumnDef[] {
  switch (tab) {
    case "performance":
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "changePercent", label: "Değişim %", align: "right", render: (it) => formatSignedPercentCell(it.changePercent) },
        { key: "perfW", label: "Haftalık Perf", align: "right", render: (it) => formatSignedPercentCell(it.perfW) },
        { key: "perf1M", label: "1-Aylık Perf", align: "right", render: (it) => formatSignedPercentCell(it.perf1M) },
        { key: "perf3M", label: "3-Aylık Perf", align: "right", render: (it) => formatSignedPercentCell(it.perf3M) },
        { key: "perf6M", label: "6-Aylık Perf", align: "right", render: (it) => formatSignedPercentCell(it.perf6M) },
        { key: "perfYTD", label: "YBB Perf", align: "right", render: (it) => formatSignedPercentCell(it.perfYTD) },
        { key: "perf1Y", label: "1-Yıllık Perf", align: "right", render: (it) => formatSignedPercentCell(it.perf1Y) },
        { key: "perf5Y", label: "5Y Performans", align: "right", render: (it) => formatSignedPercentCell(it.perf5Y) },
        { key: "beta1Y", label: "1-Yıllık Beta", align: "right", render: (it) => formatDecimalCell(it.beta1Y) },
        { key: "volatilityD", label: "Volatilite", align: "right", render: (it) => formatPlainPercentCell(it.volatilityD) }
      ];
    case "valuation":
      return [
        { key: "marketCap", label: "Piyasa Değeri", align: "right", render: (it) => formatCurrencyCompactCell(it.marketCap, it.currency) },
        { key: "pe", label: "F/K", align: "right", render: (it) => formatDecimalCell(it.pe) },
        { key: "priceRevenue", label: "Fiyat / Gelir", align: "right", render: (it) => formatDecimalCell(it.priceRevenue) },
        { key: "pb", label: "PD / DD", align: "right", render: (it) => formatDecimalCell(it.pb) },
        { key: "epsBasic", label: "HBK (TTM)", align: "right", render: (it) => formatPriceCell(it.epsBasic, it.currency) },
        { key: "lastAnnualEps", label: "Son Yıllık HBK", align: "right", render: (it) => formatPriceCell(it.lastAnnualEps, it.currency) },
        { key: "evToEbitda", label: "FD / FAVÖK", align: "right", render: (it) => formatDecimalCell(it.evToEbitda) },
        { key: "enterpriseValue", label: "Firma Değeri", align: "right", render: (it) => formatCurrencyCompactCell(it.enterpriseValue, it.currency) },
        { key: "totalShares", label: "Toplam Hisse", align: "right", render: (it) => <span className="whitespace-nowrap text-[#131722]">{formatCompactNumber(it.totalShares)}</span> }
      ];
    case "dividends":
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "dividendYield", label: "Temettü Verimi %", align: "right", render: (it) => formatPlainPercentCell(it.dividendYield) },
        { key: "dps", label: "Hisse Başına Temettü", align: "right", render: (it) => formatPriceCell(it.dps, it.currency) },
        { key: "dividendsPaid", label: "Ödenen Temettüler", align: "right", render: (it) => formatCurrencyCompactCell(it.dividendsPaid != null ? Math.abs(it.dividendsPaid) : null, it.currency) },
        { key: "payoutRatio", label: "Dağıtım Oranı %", align: "right", render: (it) => formatPlainPercentCell(it.payoutRatio) }
      ];
    case "margins":
      return [
        { key: "grossMargin", label: "Brüt Kâr Marjı", align: "right", render: (it) => formatPlainPercentCell(it.grossMargin) },
        { key: "operatingMargin", label: "Faaliyet Marjı", align: "right", render: (it) => formatPlainPercentCell(it.operatingMargin) },
        { key: "preTaxMargin", label: "Vergi Öncesi Marj", align: "right", render: (it) => formatPlainPercentCell(it.preTaxMargin) },
        { key: "netMargin", label: "Net Kâr Marjı", align: "right", render: (it) => formatPlainPercentCell(it.netMargin) },
        { key: "fcfMargin", label: "SNA Marjı", align: "right", render: (it) => formatPlainPercentCell(it.fcfMargin) }
      ];
    case "income_statement":
      return [
        { key: "totalRevenue", label: "Toplam Gelir (TTM)", align: "right", render: (it) => formatCurrencyCompactCell(it.totalRevenue, it.currency) },
        { key: "lastAnnualRevenue", label: "Son Yıllık Gelir", align: "right", render: (it) => formatCurrencyCompactCell(it.lastAnnualRevenue, it.currency) },
        { key: "grossProfit", label: "Brüt Kâr (TTM)", align: "right", render: (it) => formatCurrencyCompactCell(it.grossProfit, it.currency) },
        { key: "ebitda", label: "FAVÖK (TTM)", align: "right", render: (it) => formatCurrencyCompactCell(it.ebitda, it.currency) },
        { key: "netIncome", label: "Net Gelir (TTM)", align: "right", render: (it) => formatCurrencyCompactCell(it.netIncome, it.currency) },
        { key: "epsBasic", label: "HBK (TTM)", align: "right", render: (it) => formatPriceCell(it.epsBasic, it.currency) },
        { key: "epsDiluted", label: "Seyreltilmiş HBK", align: "right", render: (it) => formatPriceCell(it.epsDiluted, it.currency) },
        { key: "lastAnnualEps", label: "Son Yıllık HBK", align: "right", render: (it) => formatPriceCell(it.lastAnnualEps, it.currency) }
      ];
    case "balance_sheet":
      return [
        { key: "totalAssets", label: "Toplam Varlıklar", align: "right", render: (it) => formatCurrencyCompactCell(it.totalAssets, it.currency) },
        { key: "totalCurrentAssets", label: "Dönen Varlıklar", align: "right", render: (it) => formatCurrencyCompactCell(it.totalCurrentAssets, it.currency) },
        { key: "cashAndShortTerm", label: "Nakit & K.V. Yat.", align: "right", render: (it) => formatCurrencyCompactCell(it.cashAndShortTerm, it.currency) },
        { key: "totalDebt", label: "Toplam Borç", align: "right", render: (it) => formatCurrencyCompactCell(it.totalDebt, it.currency) },
        { key: "netDebt", label: "Net Borç", align: "right", render: (it) => formatCurrencyCompactCell(it.netDebt, it.currency) },
        { key: "totalEquity", label: "Toplam Özsermaye", align: "right", render: (it) => formatCurrencyCompactCell(it.totalEquity, it.currency) },
        { key: "currentRatio", label: "Cari Oran", align: "right", render: (it) => formatDecimalCell(it.currentRatio) },
        { key: "quickRatio", label: "Asit-Test Oranı", align: "right", render: (it) => formatDecimalCell(it.quickRatio) },
        { key: "debtToEquity", label: "Borç / Özsermaye", align: "right", render: (it) => formatDecimalCell(it.debtToEquity) }
      ];
    case "oscillators":
      return [
        { key: "ratingOscillators", label: "Osilatörler Derecesi", align: "left", render: (it) => formatTechnicalRating(it.ratingOscillators) },
        { key: "rsi", label: "RSI (14)", align: "right", render: (it) => formatDecimalCell(it.rsi) },
        { key: "stochK", label: "Stokastik %K", align: "right", render: (it) => formatDecimalCell(it.stochK) },
        { key: "stochD", label: "Stokastik %D", align: "right", render: (it) => formatDecimalCell(it.stochD) },
        { key: "cci20", label: "CCI (20)", align: "right", render: (it) => formatDecimalCell(it.cci20) },
        { key: "adx", label: "ADX (14)", align: "right", render: (it) => formatDecimalCell(it.adx) },
        { key: "ao", label: "Müthiş Osilatör", align: "right", render: (it) => formatDecimalCell(it.ao) },
        { key: "mom", label: "Momentum (10)", align: "right", render: (it) => formatDecimalCell(it.mom) },
        { key: "macdLevel", label: "MACD Seviyesi", align: "right", render: (it) => formatDecimalCell(it.macdLevel) },
        { key: "macdSignal", label: "MACD Sinyali", align: "right", render: (it) => formatDecimalCell(it.macdSignal) }
      ];
    case "moving_averages":
      return [
        { key: "ratingMA", label: "Hareketli Ort. Derecesi", align: "left", render: (it) => formatTechnicalRating(it.ratingMA) },
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "sma20", label: "BHO (20)", align: "right", render: (it) => formatDecimalCell(it.sma20) },
        { key: "sma50", label: "BHO (50)", align: "right", render: (it) => formatDecimalCell(it.sma50) },
        { key: "sma200", label: "BHO (200)", align: "right", render: (it) => formatDecimalCell(it.sma200) },
        { key: "ema20", label: "ÜHO (20)", align: "right", render: (it) => formatDecimalCell(it.ema20) },
        { key: "ema50", label: "ÜHO (50)", align: "right", render: (it) => formatDecimalCell(it.ema50) },
        { key: "ema200", label: "ÜHO (200)", align: "right", render: (it) => formatDecimalCell(it.ema200) },
        { key: "bbUpper", label: "Bollinger Üst", align: "right", render: (it) => formatDecimalCell(it.bbUpper) },
        { key: "bbLower", label: "Bollinger Alt", align: "right", render: (it) => formatDecimalCell(it.bbLower) }
      ];
    case "overview":
    default:
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "changePercent", label: "Değişim %", align: "right", render: (it) => formatSignedPercentCell(it.changePercent) },
        { key: "changeAbs", label: "Değişim", align: "right", render: (it) => formatChangeAbsCell(it.changeAbs, it.currency) },
        { key: "ratingAll", label: "Teknik Derece", align: "left", render: (it) => formatTechnicalRating(it.ratingAll) },
        {
          key: "volume",
          label: "Hacim",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-[#131722]">{formatCompactNumber(it.volume)}</span>
        },
        {
          key: "valueTraded",
          label: "Hacim * Fiyat",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-[#131722]">{formatCompactNumber(it.valueTraded)}</span>
        },
        {
          key: "marketCap",
          label: "Piyasa Değeri",
          align: "right",
          render: (it) => formatCurrencyCompactCell(it.marketCap, it.currency)
        },
        { key: "pe", label: "F/K", align: "right", render: (it) => formatDecimalCell(it.pe) },
        { key: "epsBasic", label: "HBK (TTM)", align: "right", render: (it) => formatPriceCell(it.epsBasic, it.currency) },
        {
          key: "employees",
          label: "Çalışanlar",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-[#131722]">{formatCompactNumber(it.employees)}</span>
        },
        {
          key: "sector",
          label: "Sektör",
          align: "left",
          render: (it) => <span className="whitespace-nowrap text-xs text-[#131722]">{it.sector}</span>
        }
      ];
  }
}

function TradingViewScreenerWidget({
  columns: initialColumnsProp = "overview",
  screen: initialScreenProp = "volume_leaders",
  height = 720,
  className = "",
  externalSector,
  onSectorChange
}: TradingViewScreenerWidgetProps) {
  const router = useRouter();

  const resolvedInitialColumns: ColumnTabId = COLUMN_TABS.some((c) => c.id === initialColumnsProp)
    ? (initialColumnsProp as ColumnTabId)
    : "overview";

  const resolvedInitialScreen: ScreenPresetId = SCREEN_PRESETS.some((s) => s.id === initialScreenProp)
    ? (initialScreenProp as ScreenPresetId)
    : "volume_leaders";

  const [stocks, setStocks] = useState<BistScreenerStockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Üst Araç Çubuğu: Arama Motoru + Orijinal Görünüm / Sütun / Ekran / Filtreler Kontrolleri
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeColumnsTab, setActiveColumnsTab] = useState<ColumnTabId>(resolvedInitialColumns);
  const [activeScreen, setActiveScreen] = useState<ScreenPresetId>(resolvedInitialScreen);

  const [sortKey, setSortKey] = useState<SortKey>(
    SCREEN_PRESETS.find((p) => p.id === resolvedInitialScreen)?.defaultSort || "volume"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    SCREEN_PRESETS.find((p) => p.id === resolvedInitialScreen)?.defaultOrder || "desc"
  );
  const [visibleLimit, setVisibleLimit] = useState<number>(100);

  // Sütun Görünürlük Ayarları ([...])
  const [hiddenColumns, setHiddenColumns] = useState<Record<string, boolean>>({});

  // Açılır Menü & Filtreler Diyaloğu Durumları
  const [openPopover, setOpenPopover] = useState<"fieldSets" | "columnPicker" | "screens" | null>(null);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);
  const [filterModalCategory, setFilterModalCategory] = useState<FilterCategory>("all");
  const [filterModalSearch, setFilterModalSearch] = useState<string>("");

  // "Filtreler" Diyaloğu İçindeki Uygulanan Filtreler
  const [filterSector, setFilterSector] = useState<string>("");
  const [filterRatingAll, setFilterRatingAll] = useState<RatingBucket>("");
  const [filterRatingOsc, setFilterRatingOsc] = useState<RatingBucket>("");
  const [filterRatingMA, setFilterRatingMA] = useState<RatingBucket>("");
  const [rangeFilters, setRangeFilters] = useState<Record<string, NumericRangeFilter>>({});

  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (externalSector === undefined) return;
    if (!externalSector) {
      setFilterSector("");
      return;
    }
    const mapped = HEATMAP_TO_SCREENER_SECTOR[externalSector] ?? externalSector;
    setFilterSector(mapped);
  }, [externalSector]);

  const loadScreenerData = useCallback(async (isSilent: boolean = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bist/screener");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setStocks(json.data);
      } else {
        throw new Error(json.error || "Tarayıcı verisi yüklenemedi");
      }
    } catch (e: any) {
      setError(e?.message || "Veri bağlantısı kurulamadı");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScreenerData(false);
    const interval = setInterval(() => loadScreenerData(true), 60_000);
    return () => clearInterval(interval);
  }, [loadScreenerData]);

  const sectorList = useMemo(() => {
    const set = new Set<string>();
    for (const s of stocks) set.add(s.sector);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [stocks]);

  // Uygulanan aktif filtre sayacı
  const appliedFilterCount = useMemo(() => {
    let count = 0;
    if (filterSector) count++;
    if (filterRatingAll) count++;
    if (filterRatingOsc) count++;
    if (filterRatingMA) count++;
    for (const val of Object.values(rangeFilters)) {
      if ((val.min && val.min.trim() !== "") || (val.max && val.max.trim() !== "")) {
        count++;
      }
    }
    return count;
  }, [filterSector, filterRatingAll, filterRatingOsc, filterRatingMA, rangeFilters]);

  const resetAllDialogFilters = () => {
    setFilterSector("");
    setFilterRatingAll("");
    setFilterRatingOsc("");
    setFilterRatingMA("");
    setRangeFilters({});
    onSectorChange?.(null);
  };

  const handleScreenPresetChange = (presetId: ScreenPresetId) => {
    setActiveScreen(presetId);
    const found = SCREEN_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSortKey(found.defaultSort);
      setSortOrder(found.defaultOrder);
    }
    setVisibleLimit(100);
    setOpenPopover(null);
  };

  const handleColumnTabChange = (tabId: ColumnTabId) => {
    setActiveColumnsTab(tabId);
    setHiddenColumns({});
    setOpenPopover(null);
  };

  const handleColumnSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortOrder(key === "symbol" || key === "sector" ? "asc" : "desc");
    }
  };

  const allTabColumns = useMemo(() => getColumnsForTab(activeColumnsTab), [activeColumnsTab]);
  const visibleColumns = useMemo(
    () => allTabColumns.filter((c) => !hiddenColumns[String(c.key)]),
    [allTabColumns, hiddenColumns]
  );

  const filteredAndSortedStocks = useMemo(() => {
    const preset = SCREEN_PRESETS.find((p) => p.id === activeScreen);
    let list = preset ? stocks.filter(preset.match) : stocks;

    // 1. "Filtreler" Diyaloğu Filtreleri
    if (filterSector) {
      list = list.filter((s) => s.sector === filterSector);
    }
    if (filterRatingAll) {
      list = list.filter((s) => matchesRatingBucket(s.ratingAll, filterRatingAll));
    }
    if (filterRatingOsc) {
      list = list.filter((s) => matchesRatingBucket(s.ratingOscillators, filterRatingOsc));
    }
    if (filterRatingMA) {
      list = list.filter((s) => matchesRatingBucket(s.ratingMA, filterRatingMA));
    }

    for (const cfg of RANGE_FILTER_FIELDS) {
      const rf = rangeFilters[cfg.id];
      if (!rf) continue;
      const rawMin = rf.min?.trim().replace(",", ".");
      const rawMax = rf.max?.trim().replace(",", ".");
      const hasMin = rawMin !== "" && rawMin !== undefined && !Number.isNaN(Number(rawMin));
      const hasMax = rawMax !== "" && rawMax !== undefined && !Number.isNaN(Number(rawMax));
      if (!hasMin && !hasMax) continue;

      const scale = cfg.scale ?? 1;
      const minVal = hasMin ? Number(rawMin) * scale : -Infinity;
      const maxVal = hasMax ? Number(rawMax) * scale : Infinity;

      list = list.filter((s) => {
        const v = s[cfg.field];
        if (typeof v !== "number" || !Number.isFinite(v)) return false;
        return v >= minVal && v <= maxVal;
      });
    }

    // 2. Doğrudan Hisse Arama Motoru
    const q = searchQuery.trim().toLocaleLowerCase("tr-TR");
    if (q) {
      list = list.filter(
        (s) =>
          s.symbol.toLocaleLowerCase("tr-TR").includes(q) ||
          s.name.toLocaleLowerCase("tr-TR").includes(q)
      );
    }

    // 3. Sıralama
    return [...list].sort((a, b) => {
      if (q) {
        const aExact = a.symbol.toLocaleLowerCase("tr-TR") === q;
        const bExact = b.symbol.toLocaleLowerCase("tr-TR") === q;
        if (aExact !== bExact) return aExact ? -1 : 1;

        const aStarts = a.symbol.toLocaleLowerCase("tr-TR").startsWith(q);
        const bStarts = b.symbol.toLocaleLowerCase("tr-TR").startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
      }

      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      if (typeof va === "string" && typeof vb === "string") {
        return sortOrder === "asc" ? va.localeCompare(vb, "tr") : vb.localeCompare(va, "tr");
      }
      return sortOrder === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
    });
  }, [
    stocks,
    activeScreen,
    filterSector,
    filterRatingAll,
    filterRatingOsc,
    filterRatingMA,
    rangeFilters,
    searchQuery,
    sortKey,
    sortOrder
  ]);

  const displayedStocks = useMemo(() => {
    if (searchQuery.trim() || appliedFilterCount > 0) return filteredAndSortedStocks;
    return filteredAndSortedStocks.slice(0, visibleLimit);
  }, [filteredAndSortedStocks, visibleLimit, searchQuery, appliedFilterCount]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredAndSortedStocks.length > 0) {
      router.push(`/dashboard/varlik/${filteredAndSortedStocks[0].symbol}`);
    }
  };

  const activeColumnsLabel = COLUMN_TABS.find((t) => t.id === activeColumnsTab)?.label || "Genel Bakış";
  const activeScreenLabel = SCREEN_PRESETS.find((p) => p.id === activeScreen)?.label || "Hacim Liderleri";

  const visibleDialogRangeFields = useMemo(() => {
    const q = filterModalSearch.trim().toLocaleLowerCase("tr-TR");
    return RANGE_FILTER_FIELDS.filter((f) => {
      if (filterModalCategory !== "all" && f.category !== filterModalCategory) return false;
      if (q && !f.label.toLocaleLowerCase("tr-TR").includes(q)) return false;
      return true;
    });
  }, [filterModalCategory, filterModalSearch]);

  const showSectorInModal = useMemo(() => {
    if (filterModalCategory !== "all" && filterModalCategory !== "descriptive") return false;
    const q = filterModalSearch.trim().toLocaleLowerCase("tr-TR");
    return !q || "sektör".includes(q);
  }, [filterModalCategory, filterModalSearch]);

  const showRatingsInModal = useMemo(() => {
    if (filterModalCategory !== "all" && filterModalCategory !== "technical") return false;
    const q = filterModalSearch.trim().toLocaleLowerCase("tr-TR");
    return !q || "teknik derece osilatör hareketli ortalama".includes(q);
  }, [filterModalCategory, filterModalSearch]);

  const numericHeight = typeof height === "number" ? height : 720;

  return (
    <div className={cn("w-full bg-white flex flex-col border border-slate-200/80 rounded-xl relative", className)}>
      {/* ===================================================================== */}
      {/* TEK SATIR ORİJİNAL TARAYICI ÜST ÇUBUĞU + HİSSE ARAMA MOTORU           */}
      {/* ===================================================================== */}
      <div
        ref={toolbarRef}
        className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-3 py-2 bg-white border-b border-slate-200 rounded-t-xl relative z-30"
      >
        {/* SOL KONTROLLER: SÜTUN GÖRÜNÜMÜ (Genel Bakış ▾) + SÜTUN AYARLARI ([...]) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Görünüm Seti Açılır Menüsü */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPopover((prev) => (prev === "fieldSets" ? null : "fieldSets"))}
              className={cn(
                "h-8 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors",
                openPopover === "fieldSets"
                  ? "bg-slate-100 border-slate-300 text-[#131722]"
                  : "bg-white border-slate-200/90 text-[#131722] hover:bg-slate-50"
              )}
              title="Sütun görünümü seçin"
            >
              <span>{activeColumnsLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {openPopover === "fieldSets" && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                {COLUMN_TABS.map((tab) => {
                  const selected = tab.id === activeColumnsTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleColumnTabChange(tab.id)}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors",
                        selected
                          ? "bg-[#2962ff]/10 text-[#2962ff] font-semibold"
                          : "text-[#131722] hover:bg-slate-50"
                      )}
                    >
                      <span>{tab.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sütun Ayarları ([...]) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPopover((prev) => (prev === "columnPicker" ? null : "columnPicker"))}
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center border transition-colors",
                openPopover === "columnPicker"
                  ? "bg-slate-100 border-slate-300 text-[#131722]"
                  : "bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50 hover:text-[#131722]"
              )}
              title="Sütun ayarları"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {openPopover === "columnPicker" && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-1 flex items-center justify-between border-b border-slate-100 mb-1">
                  <span className="text-[11px] font-semibold text-slate-500">Görünür Sütunlar</span>
                  {Object.keys(hiddenColumns).length > 0 && (
                    <button
                      type="button"
                      onClick={() => setHiddenColumns({})}
                      className="text-[11px] font-medium text-[#2962ff] hover:underline"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>
                {allTabColumns.map((col) => {
                  const isVisible = !hiddenColumns[String(col.key)];
                  return (
                    <button
                      key={String(col.key)}
                      type="button"
                      onClick={() =>
                        setHiddenColumns((prev) => ({
                          ...prev,
                          [String(col.key)]: !prev[String(col.key)]
                        }))
                      }
                      className="w-full px-3 py-1.5 text-left text-xs text-[#131722] hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>{col.label}</span>
                      <span
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center",
                          isVisible ? "bg-[#2962ff] border-[#2962ff] text-white" : "border-slate-300 bg-white"
                        )}
                      >
                        {isVisible && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ORTA ALAN: SADECE HİSSE ARAMA MOTORU */}
        <div className="relative flex-1 min-w-[200px] max-w-md mx-auto sm:mx-2 order-last sm:order-none w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Hisse ara (Örn: THYAO, ASELS, EREGL, GARAN...)"
            className="w-full h-8 pl-8 pr-7 rounded-md bg-slate-50 border border-slate-200/90 text-xs text-[#131722] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#2962ff] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              title="Aramayı temizle"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* SAĞ KONTROLLER: ORİJİNAL EKRAN FİLTRELERİ (Hacim Liderleri ▾) + FİLTRELER BUTONU */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Ekranlar Açılır Menüsü (18 Orijinal Ekran) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPopover((prev) => (prev === "screens" ? null : "screens"))}
              className={cn(
                "h-8 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors",
                openPopover === "screens"
                  ? "bg-slate-100 border-slate-300 text-[#131722]"
                  : "bg-white border-slate-200/90 text-[#131722] hover:bg-slate-50"
              )}
              title="Ekranlar"
            >
              <span>{activeScreenLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {openPopover === "screens" && (
              <div className="absolute right-0 top-full mt-1 w-60 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 max-h-80 overflow-y-auto">
                {SCREEN_PRESETS.map((preset) => {
                  const selected = preset.id === activeScreen;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleScreenPresetChange(preset.id)}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors",
                        selected
                          ? "bg-[#2962ff]/10 text-[#2962ff] font-semibold"
                          : "text-[#131722] hover:bg-slate-50"
                      )}
                    >
                      <span>{preset.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Orijinal "Filtreler" Diyaloğu Butonu */}
          <button
            type="button"
            onClick={() => {
              setOpenPopover(null);
              setIsFiltersModalOpen(true);
            }}
            className={cn(
              "h-8 px-2.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors",
              appliedFilterCount > 0
                ? "bg-[#2962ff]/10 border-[#2962ff]/40 text-[#2962ff]"
                : "bg-white border-slate-200/90 text-[#131722] hover:bg-slate-50"
            )}
            title="Filtreleri düzenle"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtreler</span>
            {appliedFilterCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#2962ff] text-white text-[10px] font-bold leading-4">
                {appliedFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VERİ TABLOSU (TRADINGVIEW SEMBOLLERİ VE ALT YAZILARI TAMAMEN YOK)     */}
      {/* ===================================================================== */}
      {loading ? (
        <div
          style={{ height: `${numericHeight - 50}px` }}
          className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500"
        >
          <RefreshCw className="w-4 h-4 animate-spin text-[#2962ff]" />
          Veriler yükleniyor...
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-xs font-semibold text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => loadScreenerData(false)}
            className="px-3.5 py-1.5 rounded-md bg-[#2962ff] text-white text-xs font-medium"
          >
            Tekrar Dene
          </button>
        </div>
      ) : filteredAndSortedStocks.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-sm font-semibold text-[#131722]">Eşleşen sembol bulunamadı</p>
          <p className="text-xs text-slate-500">
            Arama terimini veya seçili filtre kriterlerini değiştirerek tekrar deneyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              resetAllDialogFilters();
              handleScreenPresetChange("volume_leaders");
            }}
            className="px-3.5 py-1.5 rounded-md bg-[#2962ff] text-white text-xs font-medium"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      ) : (
        <div className="w-full bg-white flex flex-col rounded-b-xl overflow-hidden min-h-[360px]">
          <div
            style={{ maxHeight: `${numericHeight - 48}px` }}
            className="overflow-x-auto overflow-y-auto"
          >
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-white border-b border-slate-200 text-[11px] font-medium text-slate-500 select-none">
                <tr>
                  <th
                    onClick={() => handleColumnSort("symbol")}
                    className="py-2.5 px-3.5 sticky left-0 z-30 bg-white hover:bg-slate-50 cursor-pointer transition-colors border-r border-slate-100 min-w-[215px]"
                  >
                    <div className="flex items-center gap-1">
                      <span className="uppercase tracking-wide text-[11px] text-slate-500">
                        Sembol
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({filteredAndSortedStocks.length})
                      </span>
                      {sortKey === "symbol" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-[#2962ff]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-[#2962ff]" />
                        ))}
                    </div>
                  </th>

                  {visibleColumns.map((col) => (
                    <th
                      key={String(col.key)}
                      onClick={() => handleColumnSort(col.key)}
                      className={cn(
                        "py-2.5 px-3 hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-flex items-center gap-1",
                          col.align === "right" && "justify-end"
                        )}
                      >
                        <span>{col.label}</span>
                        {sortKey === col.key &&
                          (sortOrder === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-[#2962ff]" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-[#2962ff]" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {displayedStocks.map((item) => (
                  <tr
                    key={item.symbol}
                    className="hover:bg-[#f0f3fa]/70 transition-colors group border-b border-slate-100 last:border-b-0"
                  >
                    <td className="py-2.5 px-3.5 sticky left-0 bg-white group-hover:bg-[#f4f6fb] transition-colors z-10 min-w-[215px] max-w-[260px] border-r border-slate-100/80">
                      <Link
                        href={`/dashboard/varlik/${item.symbol}`}
                        className="flex items-center gap-3 min-w-0"
                      >
                        <StockLogoAvatar symbol={item.symbol} logoId={item.logoId} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 leading-tight">
                            <span className="font-bold text-xs text-[#2962ff] group-hover:underline">
                              {item.symbol}
                            </span>
                            <span className="text-[10px] font-bold text-[#ba68c8]">
                              GS
                            </span>
                          </div>
                          <span
                            className="text-[11px] text-slate-500 truncate block max-w-[185px] leading-tight mt-0.5"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {visibleColumns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn(
                          "py-2 px-3 text-xs",
                          col.align === "right" ? "text-right" : "text-left"
                        )}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {!searchQuery.trim() &&
              appliedFilterCount === 0 &&
              filteredAndSortedStocks.length > visibleLimit && (
                <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {filteredAndSortedStocks.length} sembolden {visibleLimit} tanesi gösteriliyor
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibleLimit((prev) => prev + 150)}
                      className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-[#131722] font-medium"
                    >
                      Daha Fazla Yükle
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleLimit(filteredAndSortedStocks.length)}
                      className="px-3 py-1 rounded bg-[#2962ff] hover:bg-[#1e53e5] text-white font-medium"
                    >
                      Tümünü Göster ({filteredAndSortedStocks.length})
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ORİJİNAL "FİLTRELER" DİYALOĞU (Tümü | Tanımlayıcı | Finansal | Teknik) */}
      {/* ===================================================================== */}
      {isFiltersModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center p-4"
          onClick={() => setIsFiltersModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Başlık & Alan Arama */}
            <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-[#131722]">Filtreler</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {filteredAndSortedStocks.length} Eşleşme
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filterModalSearch}
                    onChange={(e) => setFilterModalSearch(e.target.value)}
                    placeholder="Alanları ara..."
                    className="w-full h-8 pl-8 pr-7 rounded-md bg-slate-50 border border-slate-200 text-xs text-[#131722] focus:outline-none focus:bg-white focus:border-[#2962ff]"
                  />
                  {filterModalSearch && (
                    <button
                      type="button"
                      onClick={() => setFilterModalSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetAllDialogFilters}
                  className="h-8 px-2.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tümünü Sıfırla</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFiltersModalOpen(false)}
                  className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Kategori Sekmeleri: Tümü | Tanımlayıcı | Finansal | Teknikler */}
            <div className="px-5 border-b border-slate-200 flex items-center gap-5 bg-slate-50/60">
              {(
                [
                  { id: "all", label: "Tümü" },
                  { id: "descriptive", label: "Tanımlayıcı" },
                  { id: "financial", label: "Finansal" },
                  { id: "technical", label: "Teknikler" }
                ] as { id: FilterCategory; label: string }[]
              ).map((cat) => {
                const active = filterModalCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFilterModalCategory(cat.id)}
                    className={cn(
                      "py-2.5 text-xs font-semibold border-b-2 transition-colors",
                      active
                        ? "border-[#2962ff] text-[#2962ff]"
                        : "border-transparent text-slate-500 hover:text-[#131722]"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Filtre Alanları Izgarası */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
              {/* Sektör Seçici (Tanımlayıcı) */}
              {showSectorInModal && (
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                  <span className="text-xs font-medium text-[#131722]">Sektör</span>
                  <select
                    value={filterSector}
                    onChange={(e) => {
                      setFilterSector(e.target.value);
                      onSectorChange?.(e.target.value || null);
                    }}
                    className="h-8 w-52 px-2.5 rounded-md border border-slate-200 bg-white text-xs text-[#131722] focus:outline-none focus:border-[#2962ff]"
                  >
                    <option value="">Herhangi</option>
                    {sectorList.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Teknik Derecelendirmeler (Teknikler) */}
              {showRatingsInModal && (
                <>
                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-medium text-[#131722]">Teknik Derece</span>
                    <select
                      value={filterRatingAll}
                      onChange={(e) => setFilterRatingAll(e.target.value as RatingBucket)}
                      className="h-8 w-52 px-2.5 rounded-md border border-slate-200 bg-white text-xs text-[#131722] focus:outline-none focus:border-[#2962ff]"
                    >
                      <option value="">Herhangi</option>
                      <option value="strong_buy">Güçlü Al</option>
                      <option value="buy">Al</option>
                      <option value="neutral">Nötr</option>
                      <option value="sell">Sat</option>
                      <option value="strong_sell">Güçlü Sat</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-medium text-[#131722]">Osilatörler Derecesi</span>
                    <select
                      value={filterRatingOsc}
                      onChange={(e) => setFilterRatingOsc(e.target.value as RatingBucket)}
                      className="h-8 w-52 px-2.5 rounded-md border border-slate-200 bg-white text-xs text-[#131722] focus:outline-none focus:border-[#2962ff]"
                    >
                      <option value="">Herhangi</option>
                      <option value="strong_buy">Güçlü Al</option>
                      <option value="buy">Al</option>
                      <option value="neutral">Nötr</option>
                      <option value="sell">Sat</option>
                      <option value="strong_sell">Güçlü Sat</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100">
                    <span className="text-xs font-medium text-[#131722]">Hareketli Ort. Derecesi</span>
                    <select
                      value={filterRatingMA}
                      onChange={(e) => setFilterRatingMA(e.target.value as RatingBucket)}
                      className="h-8 w-52 px-2.5 rounded-md border border-slate-200 bg-white text-xs text-[#131722] focus:outline-none focus:border-[#2962ff]"
                    >
                      <option value="">Herhangi</option>
                      <option value="strong_buy">Güçlü Al</option>
                      <option value="buy">Al</option>
                      <option value="neutral">Nötr</option>
                      <option value="sell">Sat</option>
                      <option value="strong_sell">Güçlü Sat</option>
                    </select>
                  </div>
                </>
              )}

              {/* Sayısal Aralık Filtreleri */}
              {visibleDialogRangeFields.map((cfg) => {
                const current = rangeFilters[cfg.id] || { min: "", max: "" };
                return (
                  <div
                    key={cfg.id}
                    className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100"
                  >
                    <span className="text-xs font-medium text-[#131722] truncate" title={cfg.label}>
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={current.min}
                        onChange={(e) =>
                          setRangeFilters((prev) => ({
                            ...prev,
                            [cfg.id]: { ...current, min: e.target.value }
                          }))
                        }
                        placeholder={cfg.placeholderMin || "Min"}
                        className="h-8 w-24 px-2 rounded-md border border-slate-200 bg-white text-xs text-right text-[#131722] focus:outline-none focus:border-[#2962ff]"
                      />
                      <span className="text-slate-400 text-xs">—</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={current.max}
                        onChange={(e) =>
                          setRangeFilters((prev) => ({
                            ...prev,
                            [cfg.id]: { ...current, max: e.target.value }
                          }))
                        }
                        placeholder={cfg.placeholderMax || "Maks"}
                        className="h-8 w-24 px-2 rounded-md border border-slate-200 bg-white text-xs text-right text-[#131722] focus:outline-none focus:border-[#2962ff]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Alt Kapat / Uygula Çubuğu */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Aktif filtre sayısı: <strong className="text-[#131722]">{appliedFilterCount}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsFiltersModalOpen(false)}
                className="px-4 py-1.5 rounded-md bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-semibold transition-colors"
              >
                Sonuçları Göster ({filteredAndSortedStocks.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TradingViewScreenerWidget);
