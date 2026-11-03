"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  LineStyle,
  AreaSeries,
  HistogramSeries
} from "lightweight-charts";
import { RefreshCw, TrendingUp, TrendingDown, Clock } from "lucide-react";
import StockLogo from "@/components/StockLogo";

export interface ChartPoint {
  timestamp: number;
  time: string;
  date: string;
  displayLabel: string;
  open: number;
  high: number;
  low: number;
  close: number;
  price: number;
  volume: number;
}

export interface StockApiResponse {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume?: string;
  chartPoints: ChartPoint[];
  source?: string;
  lastUpdated?: string;
}

interface TradingViewSymbolOverviewProps {
  symbol: string;
  fullName?: string;
  className?: string;
  height?: number | string;
}

// User specified date ranges mapping from TradingView config:
// "1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"
const DATE_RANGES = [
  { id: "1d|1", label: "1G", title: "1 Gün (1 Dakikalık)", isIntraday: true },
  { id: "1m|30", label: "1A", title: "1 Ay (30 Dakikalık)", isIntraday: false },
  { id: "3m|60", label: "3A", title: "3 Ay (60 Dakikalık)", isIntraday: false },
  { id: "12m|1D", label: "1Y", title: "1 Yıl (Günlük)", isIntraday: false },
  { id: "60m|1W", label: "5Y", title: "5 Yıl (Haftalık)", isIntraday: false },
  { id: "all|1M", label: "TÜMÜ", title: "Tüm Zamanlar (Aylık)", isIntraday: false }
];

export function TradingViewSymbolOverview({
  symbol,
  fullName,
  className = "",
  height = 500
}: TradingViewSymbolOverviewProps) {
  const cleanSymbol = symbol.toUpperCase().replace(".IS", "").trim();

  // Active Date Range / Timeframe
  const [activeRange, setActiveRange] = useState<string>("1d|1");
  const [stockData, setStockData] = useState<StockApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Crosshair tracking state (valuesTracking: "1", changeMode: "price-and-percent")
  const [hoveredPoint, setHoveredPoint] = useState<{
    price: number;
    change: number;
    changePercent: number;
    timeText: string;
  } | null>(null);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // Dynamic canvas height based on component height prop
  const chartHeight = typeof height === "number" ? Math.max(280, height - 110) : 340;

  // Fetch Yahoo Finance data via /api/bist/stock
  const fetchData = useCallback(async (range: string, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bist/stock?symbol=${cleanSymbol}&timeframe=${range}`, { signal });
      if (!res.ok) {
        throw new Error(`Yahoo Finance verisi alınamadı (HTTP ${res.status})`);
      }
      const data: StockApiResponse = await res.json();
      setStockData(data);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Veri yüklenirken hata oluştu");
      }
    } finally {
      setLoading(false);
    }
  }, [cleanSymbol]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(activeRange, controller.signal);
    return () => controller.abort();
  }, [cleanSymbol, activeRange, fetchData]);

  // Clean, sorted, deduplicated points strictly in Unix seconds
  const validPoints = useMemo(() => {
    if (!stockData?.chartPoints || stockData.chartPoints.length === 0) return [];

    const pts = stockData.chartPoints.map((pt) => {
      const tsSec = pt.timestamp > 1e11 ? Math.floor(pt.timestamp / 1000) : pt.timestamp;
      return { ...pt, timestamp: tsSec };
    });

    pts.sort((a, b) => a.timestamp - b.timestamp);

    const map = new Map<number, typeof pts[0]>();
    pts.forEach((pt) => {
      if (pt.timestamp && pt.close && !isNaN(pt.close) && pt.close > 0) {
        map.set(pt.timestamp, pt);
      }
    });

    return Array.from(map.values());
  }, [stockData?.chartPoints]);

  // Overall direction of data for area line colors (up: #22ab94, down: #f7525f)
  const isUp = useMemo(() => {
    if (stockData?.changePercent != null) {
      return stockData.changePercent >= 0;
    }
    if (validPoints.length >= 2) {
      return validPoints[validPoints.length - 1].close >= validPoints[0].close;
    }
    return true;
  }, [stockData?.changePercent, validPoints]);

  const activeRangeConfig = useMemo(() => {
    return DATE_RANGES.find(r => r.id === activeRange) || DATE_RANGES[0];
  }, [activeRange]);

  // BIST Market Status Check (09:55 - 18:10 Istanbul Time)
  const isMarketOpen = useMemo(() => {
    try {
      const trDate = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
      const day = trDate.getDay();
      if (day === 0 || day === 6) return false;
      const mins = trDate.getHours() * 60 + trDate.getMinutes();
      return mins >= 595 && mins <= 1090;
    } catch {
      return false;
    }
  }, []);

  // Display Price Values (Live or Crosshair Hovered)
  const displayPrice = hoveredPoint?.price ?? stockData?.currentPrice ?? (validPoints.length > 0 ? validPoints[validPoints.length - 1].close : null);
  const displayChange = hoveredPoint?.change ?? stockData?.change ?? 0;
  const displayChangePercent = hoveredPoint?.changePercent ?? stockData?.changePercent ?? 0;
  const isPositive = displayChangePercent >= 0;

  // Initialize and update Lightweight Chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    // Reset crosshair hover
    setHoveredPoint(null);

    // Destroy existing chart instance
    if (chartApiRef.current) {
      chartApiRef.current.remove();
      chartApiRef.current = null;
      areaSeriesRef.current = null;
      volumeSeriesRef.current = null;
    }

    if (validPoints.length === 0) return;

    const hasIntradayTime = activeRange === "1d|1" || activeRange === "1m|30" || activeRange === "3m|60";

    // Chart Configuration matching the User's exact settings:
    // backgroundColor: "#0F0F0F"
    // widgetFontColor: "#DBDBDB"
    // fontColor: "rgb(106, 109, 120)"
    // gridLineColor: "rgba(242, 242, 242, 0.06)"
    // fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif"
    // fontSize: "10"
    const chart = createChart(container, {
      width: container.clientWidth,
      height: chartHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#64748B",
        fontSize: 10,
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        attributionLogo: false
      },
      localization: {
        locale: "tr-TR",
        dateFormat: "dd MMMM yyyy",
        timeFormatter: (time: number) => {
          const dateObj = new Date(time * 1000);
          const nowStr = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
          const dateStr = dateObj.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
          const isToday = dateStr === nowStr;

          if (activeRange === "1d|1") {
            if (isToday) {
              return dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" });
            }
            return dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short" });
          }
          if (activeRange === "1m|30" || activeRange === "3m|60") {
            return `${dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short" })} ${dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })}`;
          }
          return dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", year: "numeric" });
        }
      },
      grid: {
        vertLines: { color: "rgba(241, 245, 249, 0.9)", style: LineStyle.Solid },
        horzLines: { color: "rgba(241, 245, 249, 0.9)", style: LineStyle.Solid }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(148, 163, 184, 0.5)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#0F172A"
        },
        horzLine: {
          color: "rgba(148, 163, 184, 0.5)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#0F172A"
        }
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.08,
          bottom: 0.22
        }
      },
      timeScale: {
        borderVisible: false,
        timeVisible: hasIntradayTime,
        secondsVisible: false,
        rightOffset: 3,
        fixLeftEdge: true, // KİLİTLEME: En eski veriden daha sola kaydırmayı kilitler
        lockVisibleTimeRangeOnResize: true
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true
      }
    });

    chartApiRef.current = chart;

    // Up Color: #00008B (FinAi Lacivert), Down Color: #EF4444
    // Line Width: 2, Line Type: 0 (Simple Area)
    const lineColor = isUp ? "#00008B" : "#EF4444";
    const topColor = isUp ? "rgba(0, 0, 139, 0.18)" : "rgba(239, 68, 68, 0.18)";
    const bottomColor = isUp ? "rgba(0, 0, 139, 0.00)" : "rgba(239, 68, 68, 0.00)";

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor,
      bottomColor,
      lineColor,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: "#FFFFFF",
      crosshairMarkerBackgroundColor: lineColor
    });

    const areaData = validPoints.map((pt) => ({
      time: pt.timestamp as UTCTimestamp,
      value: pt.close
    }));
    areaSeries.setData(areaData);
    areaSeriesRef.current = areaSeries;

    // Volume Histogram Series at bottom
    // Up: rgba(0, 0, 139, 0.35), Down: rgba(239, 68, 68, 0.28)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(0, 0, 139, 0.35)",
      priceFormat: { type: "volume" },
      priceScaleId: ""
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.82,
        bottom: 0
      }
    });

    const volumeData = validPoints.map((pt, idx) => {
      const prevClose = idx > 0 ? validPoints[idx - 1].close : pt.close;
      const isBarUp = pt.close >= prevClose;
      return {
        time: pt.timestamp as UTCTimestamp,
        value: pt.volume || 0,
        color: isBarUp ? "rgba(0, 0, 139, 0.35)" : "rgba(239, 68, 68, 0.28)"
      };
    });
    volumeSeries.setData(volumeData);
    volumeSeriesRef.current = volumeSeries;

    // Values Tracking (valuesTracking: "1", changeMode: "price-and-percent")
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoveredPoint(null);
        return;
      }

      const pointVal = param.seriesData.get(areaSeries) as { value?: number } | undefined;
      if (!pointVal || pointVal.value == null) {
        setHoveredPoint(null);
        return;
      }

      const hoveredPrice = pointVal.value;
      const basePrice = stockData?.previousClose || (validPoints.length > 0 ? validPoints[0].close : hoveredPrice);
      const diff = hoveredPrice - basePrice;
      const diffPercent = basePrice > 0 ? (diff / basePrice) * 100 : 0;

      const dateObj = new Date((param.time as number) * 1000);
      const nowStr = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
      const pointDateStr = dateObj.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
      const isToday = pointDateStr === nowStr;

      let timeText = "";
      if (activeRange === "1d|1") {
        if (isToday) {
          timeText = dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" });
        } else {
          timeText = `${dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", year: "numeric" })} ${dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })}`;
        }
      } else if (activeRange === "1m|30" || activeRange === "3m|60") {
        timeText = `${dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short" })} ${dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })}`;
      } else {
        timeText = dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", year: "numeric" });
      }

      setHoveredPoint({
        price: hoveredPrice,
        change: diff,
        changePercent: diffPercent,
        timeText
      });
    });

    // Frame initial view based on active range, with deep historical runway preserved to the left
    if (validPoints.length > 0) {
      const lastPt = validPoints[validPoints.length - 1];

      if (activeRange === "1d|1") {
        // Frame to the latest day's session
        const lastDateStr = new Date(lastPt.timestamp * 1000).toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
        const dayStartIdx = validPoints.findIndex(pt => {
          const dStr = new Date(pt.timestamp * 1000).toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
          return dStr === lastDateStr;
        });
        const from = dayStartIdx !== -1 ? dayStartIdx : Math.max(0, validPoints.length - 120);
        chart.timeScale().setVisibleLogicalRange({ from, to: validPoints.length + 5 });
      } else if (activeRange === "1m|30") {
        // Frame to the last 30 days
        const oneMonthAgo = lastPt.timestamp - 30 * 24 * 3600;
        const mStartIdx = validPoints.findIndex(pt => pt.timestamp >= oneMonthAgo);
        const from = mStartIdx !== -1 ? mStartIdx : Math.max(0, validPoints.length - 350);
        chart.timeScale().setVisibleLogicalRange({ from, to: validPoints.length + 3 });
      } else if (activeRange === "3m|60") {
        // Frame to the last 90 days (3 months)
        const threeMonthsAgo = lastPt.timestamp - 90 * 24 * 3600;
        const mStartIdx = validPoints.findIndex(pt => pt.timestamp >= threeMonthsAgo);
        const from = mStartIdx !== -1 ? mStartIdx : Math.max(0, validPoints.length - 550);
        chart.timeScale().setVisibleLogicalRange({ from, to: validPoints.length + 3 });
      } else if (activeRange === "12m|1D") {
        // Frame to the last 365 days (1 year, ~250 trading bars)
        const oneYearAgo = lastPt.timestamp - 365 * 24 * 3600;
        const yStartIdx = validPoints.findIndex(pt => pt.timestamp >= oneYearAgo);
        const from = yStartIdx !== -1 ? yStartIdx : Math.max(0, validPoints.length - 252);
        chart.timeScale().setVisibleLogicalRange({ from, to: validPoints.length + 3 });
      } else if (activeRange === "60m|1W") {
        // Frame to the last 5 years (~260 weekly bars)
        const fiveYearsAgo = lastPt.timestamp - 5 * 365 * 24 * 3600;
        const wStartIdx = validPoints.findIndex(pt => pt.timestamp >= fiveYearsAgo);
        const from = wStartIdx !== -1 ? wStartIdx : Math.max(0, validPoints.length - 260);
        chart.timeScale().setVisibleLogicalRange({ from, to: validPoints.length + 2 });
      } else {
        // "all|1M": Fit all available monthly candles
        chart.timeScale().fitContent();
      }

      // Dinamik Bar Spacing: Veri setinin toplam genişliğinin ekranın gerisinde kalıp sol tarafın boş kalmasını engeller
      const containerWidth = container.clientWidth || 800;
      const totalPoints = validPoints.length;
      const safeMinBarSpacing = totalPoints > 0 ? Math.max(0.2, containerWidth / (totalPoints + 4)) : 0.5;

      chart.timeScale().applyOptions({
        fixLeftEdge: true,
        minBarSpacing: safeMinBarSpacing
      });
    }

    // Sol Kenar Kilit Muhafızı (Strict Left Boundary Lock Guard)
    // En eski veriden (index 0) öncesini kesinlikle göstermemek için sola gitmeyi ve aşırı küçültmeyi kilitler
    let isClamping = false;
    const onVisibleLogicalRangeChanged = (logicalRange: { from: number; to: number } | null) => {
      if (!logicalRange || isClamping) return;
      if (logicalRange.from < 0) {
        isClamping = true;
        const currentSpan = logicalRange.to - logicalRange.from;
        chart.timeScale().setVisibleLogicalRange({
          from: 0,
          to: Math.min(validPoints.length + 3, Math.max(10, currentSpan))
        });
        requestAnimationFrame(() => {
          isClamping = false;
        });
      }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);

    const handleMouseLeave = () => setHoveredPoint(null);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Resize Observer for 100% responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartApiRef.current) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        chartApiRef.current.applyOptions({ width });
        // Pencere yeniden boyutlandığında minBarSpacing'i tekrar güvenli seviyede tut
        if (validPoints.length > 0) {
          const safeMin = Math.max(0.2, width / (validPoints.length + 4));
          chartApiRef.current.timeScale().applyOptions({ minBarSpacing: safeMin, fixLeftEdge: true });
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
      container.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
      if (chartApiRef.current) {
        chartApiRef.current.remove();
        chartApiRef.current = null;
      }
    };
  }, [validPoints, isUp, activeRangeConfig, stockData?.previousClose]);

  return (
    <div 
      className={`bg-white text-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 flex flex-col justify-between select-none ${className}`}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        minHeight: typeof height === "number" ? `${height}px` : height
      }}
    >
      {/* HEADER: SEMBOL, ŞİRKET BİLGİSİ, CANLI FİYAT & DEĞİŞİM & DATE RANGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        
        {/* SOL: SEMBOL & FİYAT BİLGİSİ */}
        <div className="flex items-center gap-3.5">
          <StockLogo symbol={cleanSymbol} className="w-11 h-11 border border-slate-200/80 shadow-xs" />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">{cleanSymbol}</span>
              <span className="text-[10px] font-bold text-[#ba68c8] bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60">
                GS
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                BIST
              </span>
              {/* Piyasa Durumu */}
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span className={`w-2 h-2 rounded-full ${isMarketOpen ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {isMarketOpen ? "Piyasa Açık" : "Piyasa Kapalı"}
              </span>
            </div>
            {fullName && (
              <p className="text-[11px] font-normal text-slate-500 truncate max-w-[220px] sm:max-w-xs mt-0.5">
                {fullName}
              </p>
            )}
          </div>
        </div>

        {/* ORTA/SAĞ: CANLI / HOVER FİYAT & DATE RANGES */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-5">
          
          {/* FİYAT & DEĞİŞİM (VALUES TRACKING) */}
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {displayPrice != null ? `${displayPrice.toFixed(2)} ₺` : "— ₺"}
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold mt-0.5">
              <span className={isPositive ? "text-[#00008B] flex items-center gap-0.5" : "text-rose-600 flex items-center gap-0.5"}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? "+" : ""}{displayChange.toFixed(2)} ₺ ({isPositive ? "+" : ""}{displayChangePercent.toFixed(2)}%)
              </span>
              {hoveredPoint?.timeText && (
                <span className="text-[10px] text-slate-400 font-normal border-l border-slate-200 pl-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hoveredPoint.timeText}
                </span>
              )}
            </div>
          </div>

          {/* DATE RANGES PİLL BAR ("1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M") */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
            {DATE_RANGES.map((range) => {
              const isActive = activeRange === range.id;
              return (
                <button
                  key={range.id}
                  onClick={() => setActiveRange(range.id)}
                  title={range.title}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-slate-900 font-bold shadow-sm border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/60 font-medium"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* GRAFİK CANVAS ALANI */}
      <div 
        className="w-full relative my-2 flex-1 [&_a#tv-attr-logo]:!hidden [&_a#tv-attr-logo]:!opacity-0 [&_a#tv-attr-logo]:!pointer-events-none"
        style={{ minHeight: `${chartHeight}px` }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex items-center justify-center text-slate-600 text-xs font-medium gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#00008B]" />
            Yahoo Finance verisi güncelleniyor...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center text-center p-4 space-y-2">
            <p className="text-xs text-rose-500 font-bold">{error}</p>
            <button
              onClick={() => fetchData(activeRange)}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-200"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full" style={{ height: `${chartHeight}px` }} />
      </div>
    </div>
  );
}

export default TradingViewSymbolOverview;
