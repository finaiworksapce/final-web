"use client";

import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Filter,
  FolderKanban,
  RefreshCw,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BistScreenerStockItem } from "@/app/api/bist/screener/route";

export interface TradingViewScreenerWidgetProps {
  market?: string;
  screenerType?: string;
  columns?: ColumnTabId;
  screen?: ScreenPresetId;
  theme?: "light" | "dark";
  height?: number | string;
  className?: string;
  externalSector?: string | null;
  onSectorChange?: (sector: string | null) => void;
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

type ColumnTabId = "overview" | "performance" | "valuation" | "dividends" | "margins";
type ScreenPresetId =
  | "volume_leaders"
  | "value_traded"
  | "most_capitalized"
  | "top_gainers"
  | "top_losers"
  | "high_dividend";

type SortKey = keyof BistScreenerStockItem;

interface ColumnDef {
  key: SortKey;
  label: string;
  align?: "left" | "right";
  render: (item: BistScreenerStockItem, onSectorSelect: (sec: string) => void) => React.ReactNode;
}

const SCREEN_PRESETS: { id: ScreenPresetId; label: string; defaultSort: SortKey; defaultOrder: "asc" | "desc" }[] = [
  { id: "volume_leaders", label: "Hacim Liderleri", defaultSort: "volume", defaultOrder: "desc" },
  { id: "value_traded", label: "İşlem Hacmi (TL)", defaultSort: "valueTraded", defaultOrder: "desc" },
  { id: "most_capitalized", label: "Dev Şirketler (PD)", defaultSort: "marketCap", defaultOrder: "desc" },
  { id: "top_gainers", label: "En Çok Yükselenler", defaultSort: "changePercent", defaultOrder: "desc" },
  { id: "top_losers", label: "En Çok Düşenler", defaultSort: "changePercent", defaultOrder: "asc" },
  { id: "high_dividend", label: "Yüksek Temettü", defaultSort: "dividendYield", defaultOrder: "desc" }
];

const COLUMN_TABS: { id: ColumnTabId; label: string }[] = [
  { id: "overview", label: "Genel Bakış" },
  { id: "performance", label: "Performans" },
  { id: "valuation", label: "Değerleme" },
  { id: "dividends", label: "Temettüler" },
  { id: "margins", label: "Kârlılık" }
];

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

function formatPriceCell(val: number | null, currency: string = "TRY"): React.ReactNode {
  if (val == null || !Number.isFinite(val)) return <span className="text-slate-400">—</span>;
  return (
    <span className="whitespace-nowrap font-semibold text-slate-900">
      {val.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
      <span className="text-[10px] font-medium text-slate-400">{currency}</span>
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
        "whitespace-nowrap font-semibold",
        isPos ? "text-[#089981]" : isNeg ? "text-[#f23645]" : "text-slate-600"
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
    <span className={cn("whitespace-nowrap font-medium", val < 0 ? "text-[#f23645]" : "text-slate-800")}>
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
        "whitespace-nowrap font-medium",
        isPos ? "text-[#089981]" : isNeg ? "text-[#f23645]" : "text-slate-600"
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
      <span className="inline-flex items-center gap-0.5 text-[#2962ff] font-semibold whitespace-nowrap">
        <ChevronUp className="w-3.5 h-3.5 -mr-1.5" />
        <ChevronUp className="w-3.5 h-3.5" />
        Güçlü Al
      </span>
    );
  }
  if (score >= 0.1) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#089981] font-semibold whitespace-nowrap">
        <ChevronUp className="w-3.5 h-3.5" />
        Al
      </span>
    );
  }
  if (score <= -0.5) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#f23645] font-semibold whitespace-nowrap">
        <ChevronDown className="w-3.5 h-3.5 -mr-1.5" />
        <ChevronDown className="w-3.5 h-3.5" />
        Güçlü Sat
      </span>
    );
  }
  if (score <= -0.1) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[#f23645] font-medium whitespace-nowrap">
        <ChevronDown className="w-3.5 h-3.5" />
        Sat
      </span>
    );
  }
  return <span className="text-slate-500 font-medium whitespace-nowrap">Nötr</span>;
}

function StockLogoAvatar({ symbol, logoId }: { symbol: string; logoId: string | null }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (logoId && !imgFailed) {
    return (
      <img
        src={`https://s3-symbol-logo.tradingview.com/${logoId}.svg`}
        alt={symbol}
        loading="lazy"
        onError={() => setImgFailed(true)}
        className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200/80 bg-white"
      />
    );
  }

  return (
    <span className="w-6 h-6 rounded-full bg-[#00008B] text-white text-[10px] font-black flex items-center justify-center shrink-0">
      {symbol.slice(0, 2)}
    </span>
  );
}

function getColumnsForTab(tab: ColumnTabId): ColumnDef[] {
  switch (tab) {
    case "performance":
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "changePercent", label: "Değ % (1G)", align: "right", render: (it) => formatSignedPercentCell(it.changePercent) },
        { key: "perfW", label: "Haftalık %", align: "right", render: (it) => formatSignedPercentCell(it.perfW) },
        { key: "perf1M", label: "Aylık %", align: "right", render: (it) => formatSignedPercentCell(it.perf1M) },
        { key: "perf3M", label: "3 Aylık %", align: "right", render: (it) => formatSignedPercentCell(it.perf3M) },
        { key: "perf6M", label: "6 Aylık %", align: "right", render: (it) => formatSignedPercentCell(it.perf6M) },
        { key: "perfYTD", label: "YBB (YTD) %", align: "right", render: (it) => formatSignedPercentCell(it.perfYTD) },
        { key: "perf1Y", label: "1 Yıllık %", align: "right", render: (it) => formatSignedPercentCell(it.perf1Y) },
        { key: "volatilityD", label: "Volatilite", align: "right", render: (it) => formatPlainPercentCell(it.volatilityD) }
      ];
    case "valuation":
      return [
        {
          key: "marketCap",
          label: "Piyasa Değeri",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {formatCompactNumber(it.marketCap)} {it.marketCap != null && <span className="text-[10px] text-slate-400">{it.currency}</span>}
            </span>
          )
        },
        {
          key: "enterpriseValue",
          label: "Firma Değeri (FD)",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {formatCompactNumber(it.enterpriseValue)}{" "}
              {it.enterpriseValue != null && <span className="text-[10px] text-slate-400">{it.currency}</span>}
            </span>
          )
        },
        {
          key: "pe",
          label: "F/K",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {it.pe != null ? it.pe.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
            </span>
          )
        },
        {
          key: "evToEbitda",
          label: "FD/FAVÖK",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {it.evToEbitda != null ? it.evToEbitda.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
            </span>
          )
        },
        {
          key: "pb",
          label: "PD/DD",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {it.pb != null ? it.pb.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
            </span>
          )
        },
        {
          key: "ps",
          label: "PD/Satışlar",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800 font-medium">
              {it.ps != null ? it.ps.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
            </span>
          )
        },
        {
          key: "fcf",
          label: "Serbest Nakit Akışı",
          align: "right",
          render: (it) => (
            <span className={cn("whitespace-nowrap font-medium", it.fcf != null && it.fcf < 0 ? "text-[#f23645]" : "text-slate-800")}>
              {formatCompactNumber(it.fcf)} {it.fcf != null && <span className="text-[10px] text-slate-400">{it.currency}</span>}
            </span>
          )
        }
      ];
    case "dividends":
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "dividendYield", label: "Temettü Verimi %", align: "right", render: (it) => formatPlainPercentCell(it.dividendYield) },
        {
          key: "dps",
          label: "Temettü / Hisse",
          align: "right",
          render: (it) =>
            it.dps != null ? (
              <span className="whitespace-nowrap text-slate-800 font-medium">
                {it.dps.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                <span className="text-[10px] text-slate-400">{it.currency}</span>
              </span>
            ) : (
              <span className="text-slate-400">—</span>
            )
        },
        { key: "payoutRatio", label: "Dağıtım Oranı %", align: "right", render: (it) => formatPlainPercentCell(it.payoutRatio) },
        {
          key: "eps",
          label: "HBK (TTM)",
          align: "right",
          render: (it) =>
            it.eps != null ? (
              <span className="whitespace-nowrap text-slate-800 font-medium">
                {it.eps.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                <span className="text-[10px] text-slate-400">{it.currency}</span>
              </span>
            ) : (
              <span className="text-slate-400">—</span>
            )
        },
        {
          key: "sector",
          label: "Sektör",
          align: "left",
          render: (it, onSec) => (
            <button
              type="button"
              onClick={() => onSec(it.sector)}
              className="text-left text-xs text-slate-700 hover:text-[#00008B] hover:underline whitespace-nowrap"
            >
              {it.sector}
            </button>
          )
        }
      ];
    case "margins":
      return [
        { key: "grossMargin", label: "Brüt Kâr Marjı", align: "right", render: (it) => formatPlainPercentCell(it.grossMargin) },
        { key: "operatingMargin", label: "Faaliyet Marjı", align: "right", render: (it) => formatPlainPercentCell(it.operatingMargin) },
        { key: "ebitdaMargin", label: "FAVÖK Marjı", align: "right", render: (it) => formatPlainPercentCell(it.ebitdaMargin) },
        { key: "netMargin", label: "Net Kâr Marjı", align: "right", render: (it) => formatPlainPercentCell(it.netMargin) },
        { key: "roe", label: "ROE", align: "right", render: (it) => formatPlainPercentCell(it.roe) },
        { key: "roa", label: "ROA", align: "right", render: (it) => formatPlainPercentCell(it.roa) },
        { key: "roic", label: "ROIC", align: "right", render: (it) => formatPlainPercentCell(it.roic) }
      ];
    case "overview":
    default:
      return [
        { key: "price", label: "Fiyat", align: "right", render: (it) => formatPriceCell(it.price, it.currency) },
        { key: "changePercent", label: "Değişim %", align: "right", render: (it) => formatSignedPercentCell(it.changePercent) },
        { key: "changeAbs", label: "Değişim", align: "right", render: (it) => formatChangeAbsCell(it.changeAbs, it.currency) },
        { key: "ratingScore", label: "Teknik Derece", align: "left", render: (it) => formatTechnicalRating(it.ratingScore) },
        {
          key: "volume",
          label: "Hacim",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-slate-800">{formatCompactNumber(it.volume)}</span>
        },
        {
          key: "valueTraded",
          label: "Hacim * Fiyat",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-slate-800">{formatCompactNumber(it.valueTraded)}</span>
        },
        {
          key: "marketCap",
          label: "Piyasa Değeri",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800">
              {formatCompactNumber(it.marketCap)}{" "}
              {it.marketCap != null && <span className="text-[10px] text-slate-400">{it.currency}</span>}
            </span>
          )
        },
        {
          key: "pe",
          label: "F/K",
          align: "right",
          render: (it) => (
            <span className="whitespace-nowrap text-slate-800">
              {it.pe != null ? it.pe.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
            </span>
          )
        },
        {
          key: "eps",
          label: "HBK (TTM)",
          align: "right",
          render: (it) =>
            it.eps != null ? (
              <span className="whitespace-nowrap text-slate-800">
                {it.eps.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                <span className="text-[10px] text-slate-400">{it.currency}</span>
              </span>
            ) : (
              <span className="text-slate-400">—</span>
            )
        },
        {
          key: "employees",
          label: "Çalışanlar",
          align: "right",
          render: (it) => <span className="whitespace-nowrap text-slate-700">{formatCompactNumber(it.employees)}</span>
        },
        {
          key: "sector",
          label: "Sektör",
          align: "left",
          render: (it, onSec) => (
            <button
              type="button"
              onClick={() => onSec(it.sector)}
              title={`${it.sector} sektörünü filtrele`}
              className="text-left text-xs text-slate-700 hover:text-[#00008B] hover:underline whitespace-nowrap"
            >
              {it.sector}
            </button>
          )
        }
      ];
  }
}

function TradingViewScreenerWidget({
  columns: initialColumns = "overview",
  screen: initialScreen = "volume_leaders",
  className = "",
  externalSector,
  onSectorChange
}: TradingViewScreenerWidgetProps) {
  const router = useRouter();

  const [stocks, setStocks] = useState<BistScreenerStockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Sector Filter & Sector Grouping States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [groupBySector, setGroupBySector] = useState<boolean>(false);
  const [collapsedSectors, setCollapsedSectors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (externalSector === undefined) return;
    if (!externalSector) {
      setSelectedSector("");
      return;
    }
    const mapped = HEATMAP_TO_SCREENER_SECTOR[externalSector] ?? externalSector;
    setSelectedSector(mapped);
    setVisibleLimit(60);
  }, [externalSector]);

  const updateSectorFilter = useCallback(
    (nextSector: string) => {
      setSelectedSector(nextSector);
      setVisibleLimit(60);
      onSectorChange?.(nextSector || null);
    },
    [onSectorChange]
  );

  // Screen Preset, Column Set, Sort & Row Limit States
  const [activeScreen, setActiveScreen] = useState<ScreenPresetId>(initialScreen);
  const [activeColumnsTab, setActiveColumnsTab] = useState<ColumnTabId>(initialColumns);
  const [sortKey, setSortKey] = useState<SortKey>(
    SCREEN_PRESETS.find((p) => p.id === initialScreen)?.defaultSort || "volume"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    SCREEN_PRESETS.find((p) => p.id === initialScreen)?.defaultOrder || "desc"
  );
  const [visibleLimit, setVisibleLimit] = useState<number>(60);

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

  // Sector list with counts sorted by stock count descending
  const sectorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of stocks) {
      counts.set(s.sector, (counts.get(s.sector) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "tr"));
  }, [stocks]);

  const handleScreenPresetChange = (presetId: ScreenPresetId) => {
    setActiveScreen(presetId);
    const found = SCREEN_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSortKey(found.defaultSort);
      setSortOrder(found.defaultOrder);
    }
    setVisibleLimit(60);
  };

  const handleColumnSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortOrder(key === "symbol" || key === "sector" ? "asc" : "desc");
    }
  };

  // Filtered and Sorted Stocks
  const filteredAndSortedStocks = useMemo(() => {
    let list = stocks;

    // 1. Screen-level filter
    if (activeScreen === "top_gainers") {
      list = list.filter((s) => (s.changePercent ?? 0) > 0);
    } else if (activeScreen === "top_losers") {
      list = list.filter((s) => (s.changePercent ?? 0) < 0);
    } else if (activeScreen === "high_dividend") {
      list = list.filter((s) => (s.dividendYield ?? 0) > 0);
    }

    // 2. Sector filter
    if (selectedSector) {
      list = list.filter((s) => s.sector === selectedSector);
    }

    // 3. Direct Stock Search Engine (Ticker OR Company Name OR Sector)
    const q = searchQuery.trim().toLocaleLowerCase("tr-TR");
    if (q) {
      list = list.filter(
        (s) =>
          s.symbol.toLocaleLowerCase("tr-TR").includes(q) ||
          s.name.toLocaleLowerCase("tr-TR").includes(q) ||
          s.sector.toLocaleLowerCase("tr-TR").includes(q)
      );
    }

    // 4. Sort
    const sorted = [...list].sort((a, b) => {
      // Exact symbol prefix boost when searching
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

    return sorted;
  }, [stocks, activeScreen, selectedSector, searchQuery, sortKey, sortOrder]);

  // Grouped by Sector view
  const sectorGroups = useMemo(() => {
    if (!groupBySector) return [];
    const map = new Map<string, BistScreenerStockItem[]>();
    for (const item of filteredAndSortedStocks) {
      const arr = map.get(item.sector) || [];
      arr.push(item);
      map.set(item.sector, arr);
    }

    return Array.from(map.entries())
      .map(([sectorName, items]) => {
        const validChanges = items
          .map((i) => i.changePercent)
          .filter((c): c is number => c != null && Number.isFinite(c));
        const avgChange =
          validChanges.length > 0
            ? validChanges.reduce((acc, v) => acc + v, 0) / validChanges.length
            : 0;
        const totalValueTraded = items.reduce((acc, i) => acc + (i.valueTraded || 0), 0);

        return {
          sectorName,
          items,
          count: items.length,
          avgChange,
          totalValueTraded
        };
      })
      .sort((a, b) => b.totalValueTraded - a.totalValueTraded || b.count - a.count);
  }, [filteredAndSortedStocks, groupBySector]);

  const activeColumns = useMemo(() => getColumnsForTab(activeColumnsTab), [activeColumnsTab]);

  const displayedFlatStocks = useMemo(() => {
    if (searchQuery.trim() || selectedSector) return filteredAndSortedStocks;
    return filteredAndSortedStocks.slice(0, visibleLimit);
  }, [filteredAndSortedStocks, visibleLimit, searchQuery, selectedSector]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredAndSortedStocks.length > 0) {
      router.push(`/dashboard/varlik/${filteredAndSortedStocks[0].symbol}`);
    }
  };

  const toggleSectorCollapse = (sectorName: string) => {
    setCollapsedSectors((prev) => ({
      ...prev,
      [sectorName]: !prev[sectorName]
    }));
  };

  const renderStockRow = (item: BistScreenerStockItem) => (
    <tr
      key={item.symbol}
      className="hover:bg-blue-50/50 transition-colors group border-b border-slate-100 last:border-b-0"
    >
      {/* STICKY SYMBOL + LOGO + COMPANY NAME */}
      <td className="py-2.5 px-3.5 sticky left-0 bg-white group-hover:bg-[#F5F8FF] transition-colors z-10 min-w-[210px] max-w-[250px] border-r border-slate-100/80">
        <Link
          href={`/dashboard/varlik/${item.symbol}`}
          className="flex items-center gap-2.5 min-w-0"
        >
          <StockLogoAvatar symbol={item.symbol} logoId={item.logoId} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs text-[#00008B] group-hover:underline tracking-tight">
                {item.symbol}
              </span>
            </div>
            <span
              className="text-[11px] text-slate-500 font-medium truncate block max-w-[175px]"
              title={item.name}
            >
              {item.name}
            </span>
          </div>
        </Link>
      </td>

      {activeColumns.map((col) => (
        <td
          key={String(col.key)}
          className={cn(
            "py-2.5 px-3 text-xs",
            col.align === "right" ? "text-right" : "text-left"
          )}
        >
          {col.render(item, (sec) => {
            setSelectedSector((prev) => (prev === sec ? "" : sec));
            setGroupBySector(false);
          })}
        </td>
      ))}
    </tr>
  );

  return (
    <div className={cn("w-full bg-white flex flex-col space-y-3.5", className)}>
      {/* 1. ÜST ARAMA MOTORU & SEKTÖR FİLTRE / SEKTÖR GRUPLAMA ÇUBUĞU */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-1 pt-1">
        {/* DOĞRUDAN HİSSE ARAMA MOTORU */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Hisse Kodu veya Şirket Adı Ara (Örn: THYAO, ASELS, EREGL, GARAN... — Enter ile detaya git)"
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00008B] focus:ring-2 focus:ring-[#00008B]/15 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-lg bg-slate-200/70 hover:bg-slate-300 text-slate-600 transition-colors"
                title="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-blue-50 text-[#00008B] border border-blue-200/80">
              {filteredAndSortedStocks.length} Hisse
            </span>
          </div>
        </div>

        {/* SEKTÖR FİLTRESİ DROPDOWN + SEKTÖRE GÖRE GRUPLA BUTONU */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
          <div className="relative min-w-[230px] flex-1 sm:flex-initial">
            <Filter className="w-3.5 h-3.5 text-[#00008B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                setVisibleLimit(60);
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-blue-50/60 border border-blue-200/90 text-xs font-black text-[#00008B] appearance-none cursor-pointer focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00008B]/15 transition-all"
            >
              <option value="">Tüm Sektörler ({stocks.length})</option>
              {sectorOptions.map((sec) => (
                <option key={sec.name} value={sec.name}>
                  {sec.name} ({sec.count})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#00008B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {selectedSector && (
            <button
              type="button"
              onClick={() => setSelectedSector("")}
              className="px-2.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-all flex items-center gap-1 shrink-0"
              title="Sektör Filtresini Kaldır"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setGroupBySector((prev) => !prev)}
            className={cn(
              "px-3.5 py-2.5 rounded-2xl text-xs font-black border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0",
              groupBySector
                ? "bg-[#00008B] text-white border-[#00008B] shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            )}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Sektöre Göre Grupla</span>
          </button>
        </div>
      </div>

      {/* 2. TARAMA PRESETLERİ (VOLUME LEADERS VB.) & SÜTUN GÖRÜNÜMLERİ */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 px-1 border-b border-slate-100 pb-3">
        {/* EKRAN TARAMALARI */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {SCREEN_PRESETS.map((preset) => {
            const isActive = activeScreen === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleScreenPresetChange(preset.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border",
                  isActive
                    ? "bg-[#00008B] text-white border-[#00008B] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* SÜTUN SEKME SEÇİCİ */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 overflow-x-auto scrollbar-none self-start xl:self-auto">
          {COLUMN_TABS.map((tab) => {
            const isActive = activeColumnsTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveColumnsTab(tab.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-black transition-all whitespace-nowrap",
                  isActive
                    ? "bg-white text-[#00008B] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TABLO / SEKTÖR GRUPLU VERİ ALANI (SIFIR TRADINGVIEW LOGOSU / YAZISI) */}
      {loading ? (
        <div className="py-16 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-[#00008B]" />
          Canlı BIST hisse tarayıcısı yükleniyor...
        </div>
      ) : error ? (
        <div className="py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-xs font-black text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => loadScreenerData(false)}
            className="px-4 py-2 rounded-xl bg-[#00008B] text-white text-xs font-black"
          >
            Tekrar Dene
          </button>
        </div>
      ) : filteredAndSortedStocks.length === 0 ? (
        <div className="py-14 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-black text-slate-700">Eşleşen BIST Hissesi Bulunamadı</p>
          <p className="text-xs font-semibold text-slate-400">
            Arama terimini veya seçili sektör filtresini sıfırlayarak tüm hisseleri görüntüleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("");
              setActiveScreen("volume_leaders");
            }}
            className="px-4 py-2 rounded-xl bg-[#00008B] text-white text-xs font-black"
          >
            Filtreleri Temizle ({stocks.length} Hisse)
          </button>
        </div>
      ) : (
        <div className="w-full rounded-2xl border border-slate-200/90 overflow-hidden bg-white">
          <div className="overflow-x-auto max-h-[680px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 select-none">
                <tr>
                  <th
                    onClick={() => handleColumnSort("symbol")}
                    className="py-3 px-3.5 sticky left-0 z-30 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors border-r border-slate-200/70 min-w-[210px]"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>Sembol ({filteredAndSortedStocks.length})</span>
                      {sortKey === "symbol" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3 text-[#00008B]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-[#00008B]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {activeColumns.map((col) => (
                    <th
                      key={String(col.key)}
                      onClick={() => handleColumnSort(col.key)}
                      className={cn(
                        "py-3 px-3 hover:bg-slate-100 cursor-pointer transition-colors whitespace-nowrap",
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
                        {sortKey === col.key ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-[#00008B]" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-[#00008B]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {groupBySector
                  ? sectorGroups.map((group) => {
                      const isCollapsed = Boolean(collapsedSectors[group.sectorName]);
                      const isPosAvg = group.avgChange > 0;
                      const isNegAvg = group.avgChange < 0;
                      return (
                        <React.Fragment key={group.sectorName}>
                          <tr
                            onClick={() => toggleSectorCollapse(group.sectorName)}
                            className="bg-slate-100/90 hover:bg-blue-50/80 cursor-pointer border-y border-slate-200/90 transition-colors"
                          >
                            <td
                              colSpan={activeColumns.length + 1}
                              className="py-2.5 px-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {isCollapsed ? (
                                    <ChevronRight className="w-4 h-4 text-[#00008B]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#00008B]" />
                                  )}
                                  <span className="text-xs font-black text-slate-900">
                                    {group.sectorName}
                                  </span>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-[#00008B] border border-blue-200">
                                    {group.count} Şirket
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] font-bold">
                                  <span className="text-slate-500">
                                    Sektör Ort. Değişim:{" "}
                                    <strong
                                      className={cn(
                                        isPosAvg
                                          ? "text-[#089981]"
                                          : isNegAvg
                                            ? "text-[#f23645]"
                                            : "text-slate-700"
                                      )}
                                    >
                                      {isPosAvg ? "+" : ""}
                                      {group.avgChange.toLocaleString("tr-TR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })}
                                      %
                                    </strong>
                                  </span>
                                  <span className="text-slate-500">
                                    Toplam İşlem Hacmi:{" "}
                                    <strong className="text-slate-800">
                                      {formatCompactNumber(group.totalValueTraded)} TRY
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>

                          {!isCollapsed && group.items.map((item) => renderStockRow(item))}
                        </React.Fragment>
                      );
                    })
                  : displayedFlatStocks.map((item) => renderStockRow(item))}
              </tbody>
            </table>
          </div>

          {/* DAHA FAZLA HİSSE YÜKLE / TÜMÜNÜ GÖSTER ÇUBUĞU (SADECE DÜZ GÖRÜNÜMDE LİMİT VARSA) */}
          {!groupBySector &&
            !searchQuery.trim() &&
            !selectedSector &&
            filteredAndSortedStocks.length > visibleLimit && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-500">
                  Toplam <strong className="text-slate-900">{filteredAndSortedStocks.length}</strong> hisseden ilk{" "}
                  <strong className="text-slate-900">{visibleLimit}</strong> tanesi gösteriliyor
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVisibleLimit((prev) => prev + 100)}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-black transition-all"
                  >
                    +100 Daha Göster
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(filteredAndSortedStocks.length)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#00008B] hover:bg-blue-900 text-white font-black transition-all"
                  >
                    Tümünü Göster ({filteredAndSortedStocks.length})
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default memo(TradingViewScreenerWidget);
