"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Award, ChevronRight, RefreshCw, Sparkles, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricSectorRanking, SectorRankingResponse } from "@/lib/services/sector-ranking.service";

interface MetricConfig {
  key: string;
  label: string;
  fullName: string;
  unitType: "multiple" | "percent" | "signed_percent";
}

// 1. SÜTUN: Değerleme & Kârlılık Göstergeleri (F/K, PD/DD, FD/FAVÖK, Brüt kâr marjı, net kâr marjı, özsermaye kârlılığı)
const COLUMN_1_METRICS: MetricConfig[] = [
  { key: "pe", label: "F/K", fullName: "Fiyat / Kazanç Oranı (F/K)", unitType: "multiple" },
  { key: "pb", label: "PD/DD", fullName: "Piyasa Değeri / Defter Değeri (PD/DD)", unitType: "multiple" },
  { key: "evToEBITDA", label: "FD/FAVÖK", fullName: "Firma Değeri / FAVÖK (FD/FAVÖK)", unitType: "multiple" },
  { key: "grossMargin", label: "Brüt Kâr Marjı", fullName: "Brüt Kâr Marjı (%)", unitType: "percent" },
  { key: "netMargin", label: "Net Kâr Marjı", fullName: "Net Kâr Marjı (%)", unitType: "percent" },
  { key: "roe", label: "Özsermaye Kârlılığı", fullName: "Özsermaye Kârlılığı (ROE)", unitType: "percent" },
];

// 2. SÜTUN: Borçluluk, Likidite & Büyüme Göstergeleri (Net borç/FAVÖK, cari oran, serbest nakit verimi, Ciro, FAVÖK ve net kâr büyümesi)
const COLUMN_2_METRICS: MetricConfig[] = [
  { key: "netDebtToEBITDA", label: "Net Borç / FAVÖK", fullName: "Net Borç / FAVÖK Çarpanı", unitType: "multiple" },
  { key: "currentRatio", label: "Cari Oran", fullName: "Cari Oran (Likidite)", unitType: "multiple" },
  { key: "fcfYield", label: "Serbest Nakit Verimi", fullName: "Serbest Nakit Akışı Verimi (FCF Yield)", unitType: "percent" },
  { key: "revenueGrowth", label: "Ciro Büyümesi", fullName: "Yıllık Ciro Büyümesi (YoY)", unitType: "signed_percent" },
  { key: "ebitdaGrowth", label: "FAVÖK Büyümesi", fullName: "Yıllık FAVÖK Büyümesi (YoY)", unitType: "signed_percent" },
  { key: "netIncomeGrowth", label: "Net Kâr Büyümesi", fullName: "Yıllık Net Kâr Büyümesi (YoY)", unitType: "signed_percent" },
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
  // Sektör ortalamaları ve liderlik sıralaması verisi
  const [sectorData, setSectorData] = useState<SectorRankingResponse | null>(null);
  const [sectorLoading, setSectorLoading] = useState<boolean>(true);

  // Mouse position and smooth lerp tracking (project-showcase mimarisi)
  const [hoveredMetricKey, setHoveredMetricKey] = useState<string | null>(null);
  const [pinnedMetricKey, setPinnedMetricKey] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Sektör verisini arka planda hızlıca çek
  useEffect(() => {
    let isCancelled = false;
    setSectorLoading(true);

    fetch(`/api/finance/sector-ranking?symbol=${symbol}`)
      .then((r) => r.json())
      .then((res) => {
        if (!isCancelled && res.success && res.data) {
          setSectorData(res.data);
        }
      })
      .catch((err) => {
        if (!isCancelled) console.warn("Sector ranking fetch failed:", err);
      })
      .finally(() => {
        if (!isCancelled) setSectorLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [symbol]);

  // Lerp animasyon döngüsü (Smooth Cursor Follow)
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.16),
        y: lerp(prev.y, mousePosition.y, 0.16)
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseEnter = useCallback((metricKey: string) => {
    setHoveredMetricKey(metricKey);
    setIsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!pinnedMetricKey) {
      setHoveredMetricKey(null);
      setIsVisible(false);
    }
  }, [pinnedMetricKey]);

  // Mobil veya tıklama ile sabitleme desteği
  const handleMetricClick = useCallback((metricKey: string) => {
    if (pinnedMetricKey === metricKey) {
      setPinnedMetricKey(null);
      setHoveredMetricKey(null);
      setIsVisible(false);
    } else {
      setPinnedMetricKey(metricKey);
      setHoveredMetricKey(metricKey);
      setIsVisible(true);
    }
  }, [pinnedMetricKey]);

  // Seçili metrik rasyo hesaplayıcısı
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

      // 3. Fallback from stockData / fundamentalsData
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

  // Aktif incelenen sektör sıralaması metriği
  const activeMetricKey = pinnedMetricKey || hoveredMetricKey;
  const activeRanking: MetricSectorRanking | null =
    activeMetricKey && sectorData?.metrics?.[activeMetricKey]
      ? sectorData.metrics[activeMetricKey]
      : null;

  const activeMetricDef = useMemo(() => {
    if (!activeMetricKey) return null;
    return (
      COLUMN_1_METRICS.find((m) => m.key === activeMetricKey) ||
      COLUMN_2_METRICS.find((m) => m.key === activeMetricKey) ||
      null
    );
  }, [activeMetricKey]);

  // Tooltip koordinatlarının container içinde güvenle kalmasını sağla
  const containerRect = containerRef.current?.getBoundingClientRect();
  const containerWidth = containerRect?.width || 600;
  const containerHeight = containerRect?.height || 460;
  const isRightSide = smoothPosition.x > containerWidth * 0.52;

  const tooltipWidth = 330;
  const tooltipHeight = 340;
  const clampedX = isRightSide
    ? Math.max(12, smoothPosition.x - tooltipWidth - 20)
    : Math.min(containerWidth - tooltipWidth - 12, smoothPosition.x + 20);
  const clampedY = Math.max(
    12,
    Math.min(containerHeight - tooltipHeight - 12, smoothPosition.y - 140)
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col justify-between select-none min-h-[460px] h-full",
        className
      )}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif"
      }}
    >
      {/* ========================================================================= */}
      {/* FLOATING SECTOR SHOWCASE POPOVER (PROJECT-SHOWCASE MİMARİSİ İLE İMİRLEŞİK) */}
      {/* ========================================================================= */}
      <div
        className={cn(
          "pointer-events-none absolute z-50 w-[330px] rounded-2xl shadow-2xl border border-slate-200/95 bg-white/95 backdrop-blur-md p-4 transition-all ease-out",
          isVisible && activeRanking ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{
          left: `${clampedX}px`,
          top: `${clampedY}px`,
          transition: "opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), scale 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.08s ease-out"
        }}
      >
        {activeRanking && activeMetricDef && (
          <div className="space-y-3">
            {/* BAŞLIK & SEKTÖR ETİKETİ */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00008B]" />
                  Sektör Karşılaştırması
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {activeMetricDef.fullName}
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#00008B] border border-blue-200 shrink-0">
                {sectorData?.sectorDisplayName || "Sektör"}
              </span>
            </div>

            {/* SEÇİLİ HİSSE VS SEKTÖR ORTALAMASI ÖZETİ */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80">
              {/* Seçili Hisse */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  {symbol} (Seçili)
                </span>
                <div className="text-base font-black text-[#00008B]">
                  {activeRanking.formattedCurrentValue}
                </div>
                {activeRanking.currentRank != null && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded bg-[#00008B] text-white">
                    <Trophy className="w-2.5 h-2.5" />
                    #{activeRanking.currentRank}. Sırada
                  </span>
                )}
              </div>

              {/* Sektör Ortalaması */}
              <div className="space-y-0.5 border-l border-slate-200/80 pl-2.5">
                <span className="text-[10px] font-semibold text-slate-500">
                  Sektör Ortalaması
                </span>
                <div className="text-base font-black text-slate-800">
                  {activeRanking.formattedSectorAverage}
                </div>
                {activeRanking.betterThanSector != null && (
                  <span
                    className={cn(
                      "inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded",
                      activeRanking.betterThanSector
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {activeRanking.betterThanSector ? "Avantajlı" : "Ortalama Altı"}
                  </span>
                )}
              </div>
            </div>

            {/* AÇIKLAMA YORUMU */}
            <p className="text-[11px] font-medium text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100/60 leading-tight">
              {activeRanking.summaryComment}
            </p>

            {/* SEKTÖR LİDER TABLOSU: EN İYİDEN EN KÖTÜYE SIRALAMA */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#00008B]" />
                  Sektör Lider Tablosu (En İyi ⟶ En Kötü)
                </span>
                <span>{activeRanking.totalRanked} Şirket</span>
              </div>

              <div className="max-h-[145px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {activeRanking.leaderboard.map((peer) => {
                  const isCurrentPeer = peer.isCurrent;
                  const isTop3 = peer.rank > 0 && peer.rank <= 3;
                  return (
                    <div
                      key={peer.symbol}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                        isCurrentPeer
                          ? "bg-[#00008B] text-white font-bold shadow-sm"
                          : isTop3
                            ? "bg-slate-100/90 text-slate-900 font-semibold hover:bg-slate-200/70"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Sıra Numarası */}
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                            isCurrentPeer
                              ? "bg-white text-[#00008B]"
                              : peer.rank === 1
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : peer.rank === 2
                                  ? "bg-slate-200 text-slate-700 border border-slate-300"
                                  : peer.rank === 3
                                    ? "bg-orange-100 text-orange-800 border border-orange-300"
                                    : "bg-slate-200/70 text-slate-500"
                          )}
                        >
                          {peer.rank > 0 ? `#${peer.rank}` : "—"}
                        </span>

                        <span className="truncate">
                          {peer.symbol}
                          {isCurrentPeer && (
                            <span className="ml-1 text-[9px] bg-white/20 px-1 rounded font-normal">
                              (Bu Hisse)
                            </span>
                          )}
                        </span>
                      </div>

                      <span
                        className={cn(
                          "tabular-nums text-right font-bold ml-2 shrink-0",
                          isCurrentPeer ? "text-white" : "text-slate-900"
                        )}
                      >
                        {peer.formattedValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DİPNOT */}
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
              <span>* Sektör ortalaması & sıralaması</span>
              <span className="font-semibold text-[#00008B]">FinAi Sektörel Analiz</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PANEL BAŞLIĞI */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Önemli İstatistikler
          </h3>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
            (Sektör ortalaması ve sıralaması için oranların üzerine gelin)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(loading || sectorLoading) && (
            <span className="flex items-center gap-1 text-[11px] text-[#00008B] font-medium animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Sektör Hesaplanıyor
            </span>
          )}
          {pinnedMetricKey && (
            <button
              onClick={() => setPinnedMetricKey(null)}
              className="text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Kapat
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* METRİK LİSTESİ: 2 SÜTUN (KUTUSUZ, DÜZ METİN VE SATIR ÇİZGİLERİ İLE) */}
      {/* ========================================================================= */}
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
              const isHovered = hoveredMetricKey === metric.key || pinnedMetricKey === metric.key;

              return (
                <div
                  key={metric.key}
                  onMouseEnter={() => handleMouseEnter(metric.key)}
                  onClick={() => handleMetricClick(metric.key)}
                  className="group relative flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-all"
                >
                  {/* Hover background highlight (Project-Showcase stili) */}
                  <div
                    className={cn(
                      "absolute inset-0 -mx-2 px-2 bg-blue-50/70 rounded-xl transition-all duration-200 ease-out pointer-events-none",
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                  />

                  <div className="relative flex items-center gap-1.5 z-10">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold transition-colors",
                        isHovered ? "text-[#00008B] font-bold" : "text-slate-800"
                      )}
                    >
                      {metric.label}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 text-[#00008B] transition-all duration-200",
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                      )}
                    />
                  </div>

                  <span
                    className={cn(
                      "relative z-10 text-xs sm:text-sm tracking-tight text-right transition-colors",
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
              const isHovered = hoveredMetricKey === metric.key || pinnedMetricKey === metric.key;

              return (
                <div
                  key={metric.key}
                  onMouseEnter={() => handleMouseEnter(metric.key)}
                  onClick={() => handleMetricClick(metric.key)}
                  className="group relative flex items-center justify-between py-2.5 sm:py-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-all"
                >
                  {/* Hover background highlight (Project-Showcase stili) */}
                  <div
                    className={cn(
                      "absolute inset-0 -mx-2 px-2 bg-blue-50/70 rounded-xl transition-all duration-200 ease-out pointer-events-none",
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                  />

                  <div className="relative flex items-center gap-1.5 z-10">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold transition-colors",
                        isHovered ? "text-[#00008B] font-bold" : "text-slate-800"
                      )}
                    >
                      {metric.label}
                    </span>
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 text-[#00008B] transition-all duration-200",
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                      )}
                    />
                  </div>

                  <span
                    className={cn(
                      "relative z-10 text-xs sm:text-sm tracking-tight text-right transition-colors",
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
    </div>
  );
}
