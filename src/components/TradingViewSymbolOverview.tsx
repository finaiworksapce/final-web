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
import { RefreshCw, TrendingUp, TrendingDown, Clock, ShieldCheck } from "lucide-react";

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

// User specified date ranges mapping:
// "1d|5", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"
const DATE_RANGES = [
  { id: "1d", label: "1G", title: "1 Gün (5 Dakikalık)", isIntraday: true },
  { id: "1m", label: "1A", title: "1 Ay", isIntraday: false },
  { id: "3m", label: "3A", title: "3 Ay", isIntraday: false },
  { id: "1y", label: "1Y", title: "1 Yıl (12 Ay)", isIntraday: false },
  { id: "5y", label: "5Y", title: "5 Yıl (60 Ay)", isIntraday: false },
  { id: "all", label: "TÜMÜ", title: "Tüm Geçmiş", isIntraday: false }
];

export function TradingViewSymbolOverview({
  symbol,
  fullName,
  className = "",
  height = 500
}: TradingViewSymbolOverviewProps) {
  const cleanSymbol = symbol.toUpperCase().replace(".IS", "").trim();

  // Active Date Range / Timeframe
  const [activeRange, setActiveRange] = useState<string>("1d");
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

    const isIntraday = activeRangeConfig.isIntraday;

    // Chart Configuration matching the User's exact settings:
    // backgroundColor: "#0F0F0F"
    // widgetFontColor: "#DBDBDB"
    // fontColor: "rgb(106, 109, 120)"
    // gridLineColor: "rgba(242, 242, 242, 0.06)"
    // fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif"
    // fontSize: "10"
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: "#0F0F0F" },
        textColor: "rgb(106, 109, 120)",
        fontSize: 10,
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif"
      },
      localization: {
        locale: "tr-TR",
        dateFormat: "dd MMMM yyyy",
        timeFormatter: (time: number) => {
          const dateObj = new Date(time * 1000);
          return isIntraday
            ? dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })
            : dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", year: "numeric" });
        }
      },
      grid: {
        vertLines: { color: "rgba(242, 242, 242, 0.06)", style: LineStyle.Solid },
        horzLines: { color: "rgba(242, 242, 242, 0.06)", style: LineStyle.Solid }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(242, 242, 242, 0.25)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#2A2E39"
        },
        horzLine: {
          color: "rgba(242, 242, 242, 0.25)",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#2A2E39"
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
        timeVisible: isIntraday,
        secondsVisible: false,
        rightOffset: 3
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

    // Up Color: #22ab94, Down Color: #f7525f
    // Line Width: 2, Line Type: 0 (Simple Area)
    const lineColor = isUp ? "#22ab94" : "#f7525f";
    const topColor = isUp ? "rgba(34, 171, 148, 0.28)" : "rgba(247, 82, 95, 0.28)";
    const bottomColor = isUp ? "rgba(34, 171, 148, 0.00)" : "rgba(247, 82, 95, 0.00)";

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
    // volumeUpColor: "rgba(34, 171, 148, 0.5)", volumeDownColor: "rgba(247, 82, 95, 0.5)"
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(34, 171, 148, 0.5)",
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
        color: isBarUp ? "rgba(34, 171, 148, 0.5)" : "rgba(247, 82, 95, 0.5)"
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
      const timeText = isIntraday
        ? dateObj.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit" })
        : dateObj.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul", day: "2-digit", month: "short", year: "numeric" });

      setHoveredPoint({
        price: hoveredPrice,
        change: diff,
        changePercent: diffPercent,
        timeText
      });
    });

    // Auto-fit content
    chart.timeScale().fitContent();

    // Resize Observer for 100% responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartApiRef.current) return;
      const { width } = entries[0].contentRect;
      if (width > 0) {
        chartApiRef.current.applyOptions({ width });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartApiRef.current) {
        chartApiRef.current.remove();
        chartApiRef.current = null;
      }
    };
  }, [validPoints, isUp, activeRangeConfig, stockData?.previousClose]);

  return (
    <div 
      className={`bg-[#0F0F0F] text-[#DBDBDB] rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800/80 flex flex-col justify-between select-none ${className}`}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        minHeight: typeof height === "number" ? `${height}px` : height
      }}
    >
      {/* HEADER: SEMBOL, ŞİRKET BİLGİSİ, CANLI FİYAT & DEĞİŞİM & DATE RANGES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        
        {/* SOL: SEMBOL & FİYAT BİLGİSİ */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#1A1D26] border border-white/10 flex items-center justify-center font-black text-white text-lg shrink-0 shadow-inner">
            {cleanSymbol.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#DBDBDB] tracking-tight">{cleanSymbol}</span>
              <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                BIST
              </span>
              {/* Piyasa Durumu */}
              <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <span className={`w-2 h-2 rounded-full ${isMarketOpen ? "bg-[#22ab94] animate-pulse" : "bg-slate-500"}`} />
                {isMarketOpen ? "Piyasa Açık" : "Piyasa Kapalı"}
              </span>
            </div>
            {fullName && (
              <p className="text-[11px] font-normal text-slate-400 truncate max-w-[220px] sm:max-w-xs mt-0.5">
                {fullName}
              </p>
            )}
          </div>
        </div>

        {/* ORTA/SAĞ: CANLI / HOVER FİYAT & DATE RANGES */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
          
          {/* FİYAT & DEĞİŞİM (VALUES TRACKING) */}
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#DBDBDB] tracking-tight">
              {displayPrice != null ? `${displayPrice.toFixed(2)} ₺` : "— ₺"}
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold mt-0.5">
              <span className={isPositive ? "text-[#22ab94] flex items-center gap-0.5" : "text-[#f7525f] flex items-center gap-0.5"}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? "+" : ""}{displayChange.toFixed(2)} ₺ ({isPositive ? "+" : ""}{displayChangePercent.toFixed(2)}%)
              </span>
              {hoveredPoint?.timeText && (
                <span className="text-[10px] text-slate-400 font-normal border-l border-white/10 pl-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {hoveredPoint.timeText}
                </span>
              )}
            </div>
          </div>

          {/* DATE RANGES PİLL BAR ("1d|5", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M") */}
          <div className="flex items-center gap-1 bg-[#1A1D26] p-1 rounded-xl border border-white/5">
            {DATE_RANGES.map((range) => {
              const isActive = activeRange === range.id;
              return (
                <button
                  key={range.id}
                  onClick={() => setActiveRange(range.id)}
                  title={range.title}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                    isActive
                      ? "bg-[#2A2E39] text-[#DBDBDB] font-bold shadow-sm"
                      : "text-slate-400 hover:text-[#DBDBDB] font-medium"
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
      <div className="w-full relative min-h-[380px] my-2 flex-1">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#0F0F0F]/80 backdrop-blur-[2px] flex items-center justify-center text-slate-400 text-xs font-medium gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#22ab94]" />
            Yahoo Finance verisi güncelleniyor...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 bg-[#0F0F0F] flex flex-col items-center justify-center text-center p-4 space-y-2">
            <p className="text-xs text-rose-400 font-bold">{error}</p>
            <button
              onClick={() => fetchData(activeRange)}
              className="px-3 py-1 rounded-lg bg-[#1A1D26] hover:bg-[#2A2E39] text-xs font-bold text-white border border-white/10"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        <div ref={chartContainerRef} className="w-full h-[380px]" />
      </div>

      {/* FOOTER: VERİ BİLGİSİ VE ATIF */}
      <div className="flex items-center justify-between text-[10px] text-slate-400/80 pt-2 border-t border-white/5 font-normal">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22ab94]" />
          Veri Kaynağı: <strong>Yahoo Finance API</strong> (BIST Real-Time & Tarihsel Akış)
        </span>
        <span>
          TradingView Lightweight Engine • {cleanSymbol}
        </span>
      </div>
    </div>
  );
}

export default TradingViewSymbolOverview;
