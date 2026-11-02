"use client";

import React, { useEffect, useRef, memo } from "react";

export interface TradingViewScreenerWidgetProps {
  market?: string;
  screenerType?: string;
  columns?: string;
  screen?: string;
  theme?: "light" | "dark";
  height?: number | string;
  className?: string;
}

const TV_SCREENER_SCRIPT_ID = "tv-screener-module-script";
const TV_SCREENER_SCRIPT_SRC = "https://widgets.tradingview-widget.com/w/tr/tv-screener.js";

function TradingViewScreenerWidget({
  market = "turkey",
  screenerType = "stock",
  columns = "overview",
  screen = "volume_leaders",
  theme = "light",
  height = 720,
  className = ""
}: TradingViewScreenerWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Load TradingView tv-screener ES module script once into document.head
    if (!document.getElementById(TV_SCREENER_SCRIPT_ID)) {
      const existing = document.querySelector(`script[src="${TV_SCREENER_SCRIPT_SRC}"]`);
      if (!existing) {
        const script = document.createElement("script");
        script.id = TV_SCREENER_SCRIPT_ID;
        script.type = "module";
        script.src = TV_SCREENER_SCRIPT_SRC;
        document.head.appendChild(script);
      }
    }

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const screenerEl = document.createElement("tv-screener");
    screenerEl.setAttribute("market", market);
    screenerEl.setAttribute("screener-type", screenerType);
    screenerEl.setAttribute("columns", columns);
    screenerEl.setAttribute("screen", screen);
    screenerEl.setAttribute("theme", theme);
    screenerEl.style.display = "block";
    screenerEl.style.width = "100%";
    screenerEl.style.height = "100%";

    container.appendChild(screenerEl);

    return () => {
      container.innerHTML = "";
    };
  }, [market, screenerType, columns, screen, theme]);

  return (
    <div
      ref={containerRef}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        colorScheme: theme
      }}
      className={`w-full relative overflow-hidden bg-white ${className}`}
    />
  );
}

export default memo(TradingViewScreenerWidget);
