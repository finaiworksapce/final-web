"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, RefreshCw, Sparkles, X, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricSectorRanking, PeerRankingItem, SectorRankingResponse } from "@/lib/services/sector-ranking.service";

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

interface LeaderboardSlot {
  type: "peer" | "ellipsis";
  key: string;
  peer?: PeerRankingItem;
}

function getSmartLeaderboardSlots(
  leaderboard: PeerRankingItem[],
  currentSymbol: string
): LeaderboardSlot[] {
  const valid = leaderboard.filter((p) => p.rank > 0);
  if (valid.length <= 5) {
    return valid.map((p) => ({ type: "peer", key: p.symbol, peer: p }));
  }

  const cleanCurrent = currentSymbol.replace('.IS', '').trim().toUpperCase();
  const curIdx = valid.findIndex(
    (p) => p.isCurrent || p.symbol.trim().toUpperCase() === cleanCurrent
  );

  // Eğer seçili hisse ilk 5 sıradaysa (0, 1, 2, 3, 4) ya da bulunamadıysa: ilk 5'i direkt göster
  if (curIdx === -1 || curIdx <= 4) {
    return valid.slice(0, 5).map((p) => ({ type: "peer", key: p.symbol, peer: p }));
  }

  // Eğer hisse 6. veya daha gerideyse (index >= 5):
  // 1. ve 2. hisseleri göster, araya ••• koy, mevcut hissenin hemen önündekini ve mevcut hisseyi göster (tam 5 satır)
  return [
    { type: "peer", key: valid[0].symbol, peer: valid[0] },
    { type: "peer", key: valid[1].symbol, peer: valid[1] },
    { type: "ellipsis", key: "ellipsis-row" },
    { type: "peer", key: valid[curIdx - 1].symbol, peer: valid[curIdx - 1] },
    { type: "peer", key: valid[curIdx].symbol, peer: valid[curIdx] },
  ];
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

  // Akıllı 5'li liderlik tablosu (scrollsuz, bağlamsal sıralama)
  const leaderboardSlots = useMemo(() => {
    if (!activeRanking?.leaderboard) return [];
    return getSmartLeaderboardSlots(activeRanking.leaderboard, symbol);
  }, [activeRanking, symbol]);

  // Tooltip koordinatlarının container içinde güvenle kalmasını sağla
  const containerRect = containerRef.current?.getBoundingClientRect();
  const containerWidth = containerRect?.width || 600;
  const containerHeight = containerRect?.height || 460;
  const isRightSide = smoothPosition.x > containerWidth * 0.52;

  const tooltipWidth = 245;
  const tooltipHeight = 205;
  const clampedX = isRightSide
    ? Math.max(10, smoothPosition.x - tooltipWidth - 14)
    : Math.min(containerWidth - tooltipWidth - 10, smoothPosition.x + 14);
  const clampedY = Math.max(
    10,
    Math.min(containerHeight - tooltipHeight - 10, smoothPosition.y - 90)
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
          "pointer-events-none absolute z-50 w-[245px] rounded-2xl shadow-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-3 transition-all ease-out",
          isVisible && activeRanking ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{
          left: `${clampedX}px`,
          top: `${clampedY}px`,
          transition: "opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), scale 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.08s ease-out"
        }}
      >
        {activeRanking && activeMetricDef && (
          <div className="space-y-2">
            {/* BAŞLIK & SEKTÖR ADI (ZARİF & ESTETİK) */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-2">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5 text-[#00008B]" />
                  Sektör Kıyaslama
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5 line-clamp-1">
                  {activeMetricDef.fullName}
                </h4>
              </div>
              {sectorData?.sectorDisplayName && (
                <span className="text-[10px] font-medium text-slate-400 shrink-0 text-right">
                  {sectorData.sectorDisplayName}
                </span>
              )}
            </div>

            {/* SEÇİLİ HİSSE VS SEKTÖR ORTALAMASI (ZARİF 2 KUTU) */}
            <div className="grid grid-cols-2 gap-2">
              {/* Seçili Hisse */}
              <div className="bg-slate-50/90 rounded-xl p-2 border border-slate-200/60 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-slate-500 truncate">
                  {symbol.replace('.IS', '')} (Seçili)
                </span>
                <div className="text-sm font-black text-slate-900 tracking-tight my-0.5">
                  {activeRanking.formattedCurrentValue}
                </div>
                <span className="text-[9px] font-medium text-slate-500">
                  {activeRanking.currentRank ? `${activeRanking.currentRank}. sırada` : "—"}
                </span>
              </div>

              {/* Sektör Ortalaması (Lacivert Kutu) */}
              <div className="bg-[#00008B] text-white rounded-xl p-2 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-blue-200 truncate">
                  Sektör Ort.
                </span>
                <div className="text-sm font-black text-white tracking-tight my-0.5">
                  {activeRanking.formattedSectorAverage}
                </div>
                <span className="text-[9px] font-medium text-blue-200/80 truncate">
                  {activeRanking.totalRanked ? `${activeRanking.totalRanked} şirket` : "Medyan"}
                </span>
              </div>
            </div>

            {/* SEKTÖR SIRALAMASI: KUTUCUKSUZ, SADECE YAZILAR VE ESTETİK LİSTE */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Sıralama (En İyi → En Kötü)</span>
                <span>{activeRanking.totalRanked} Şirket</span>
              </div>

              <div className="space-y-1">
                {leaderboardSlots.map((slot) => {
                  if (slot.type === "ellipsis") {
                    return (
                      <div
                        key={slot.key}
                        className="flex items-center justify-center py-0.5 text-slate-300 font-bold tracking-widest text-[9px] select-none"
                      >
                        • • •
                      </div>
                    );
                  }

                  const peer = slot.peer!;
                  const cleanSym = symbol.replace('.IS', '').trim().toUpperCase();
                  const isCurrent =
                    peer.isCurrent || peer.symbol.trim().toUpperCase() === cleanSym;

                  return (
                    <div
                      key={slot.key}
                      className={cn(
                        "flex items-center justify-between text-[11px] transition-colors py-0.5",
                        isCurrent
                          ? "font-black text-[#00008B]"
                          : "text-slate-700 font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Sıra Numarası (Kutucuk yok, sadece şık sade yazı) */}
                        <span
                          className={cn(
                            "w-5 text-[10px] tabular-nums shrink-0 font-semibold",
                            isCurrent
                              ? "text-[#00008B] font-black"
                              : peer.rank <= 3
                                ? "text-slate-900 font-bold"
                                : "text-slate-400"
                          )}
                        >
                          {peer.rank > 0 ? `${peer.rank}.` : "—"}
                        </span>

                        {/* Hisse Kodu (Sade metin) */}
                        <span className="truncate">
                          {peer.symbol}
                          {isCurrent && (
                            <span className="ml-1 text-[9px] font-bold text-[#00008B]/80">
                              (Bu Hisse)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Değer (Tabular rakamlar, sade metin) */}
                      <span
                        className={cn(
                          "tabular-nums text-right ml-2 shrink-0 text-[11px]",
                          isCurrent ? "text-[#00008B] font-black" : "text-slate-900 font-semibold"
                        )}
                      >
                        {peer.formattedValue}
                      </span>
                    </div>
                  );
                })}
              </div>
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
