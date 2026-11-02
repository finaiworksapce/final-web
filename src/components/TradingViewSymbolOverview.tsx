"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewSymbolOverviewProps {
  symbol: string;
  className?: string;
  height?: number | string;
}

function TradingViewSymbolOverviewComponent({
  symbol,
  className = "",
  height = 500
}: TradingViewSymbolOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const cleanSymbol = symbol.toUpperCase().replace(".IS", "").trim();
    // BIST format for TradingView
    const tvSymbol = cleanSymbol === "XU100" ? "BIST:XU100" : `BIST:${cleanSymbol}`;

    const widgetWrapper = document.createElement("div");
    widgetWrapper.className = "tradingview-widget-container";
    widgetWrapper.style.width = "100%";
    widgetWrapper.style.height = "100%";

    const widgetElement = document.createElement("div");
    widgetElement.className = "tradingview-widget-container__widget";
    widgetElement.style.width = "100%";
    widgetElement.style.height = "calc(100% - 28px)";

    const copyrightContainer = document.createElement("div");
    copyrightContainer.className = "tradingview-widget-copyright";
    copyrightContainer.style.fontSize = "11px";
    copyrightContainer.style.textAlign = "center";
    copyrightContainer.style.color = "#888";
    copyrightContainer.style.padding = "4px 0";
    copyrightContainer.innerHTML = `
      <span class="trademark">TradingView tarafından</span>
      <a href="https://tr.tradingview.com/symbols/${tvSymbol.replace(':', '-')}/" rel="noopener nofollow" target="_blank" style="color: #2962FF; margin-left: 4px; text-decoration: underline;">
        <span class="blue-text">${cleanSymbol} hisse fiyatı</span>
      </a>
    `;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      lineWidth: 2,
      lineType: 0,
      chartType: "area",
      fontColor: "rgb(106, 109, 120)",
      gridLineColor: "rgba(242, 242, 242, 0.06)",
      volumeUpColor: "rgba(34, 171, 148, 0.5)",
      volumeDownColor: "rgba(247, 82, 95, 0.5)",
      backgroundColor: "#0F0F0F",
      widgetFontColor: "#DBDBDB",
      upColor: "#22ab94",
      downColor: "#f7525f",
      borderUpColor: "#22ab94",
      borderDownColor: "#f7525f",
      wickUpColor: "#22ab94",
      wickDownColor: "#f7525f",
      colorTheme: "dark",
      isTransparent: false,
      locale: "tr",
      chartOnly: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      valuesTracking: "1",
      changeMode: "price-and-percent",
      symbols: [
        [cleanSymbol, `${tvSymbol}|1D`]
      ],
      dateRanges: [
        "1d|5",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
      ],
      fontSize: "10",
      headerFontSize: "medium",
      autosize: true,
      width: "100%",
      height: "100%",
      noTimeScale: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false
    });

    widgetWrapper.appendChild(widgetElement);
    widgetWrapper.appendChild(copyrightContainer);
    widgetWrapper.appendChild(script);
    container.appendChild(widgetWrapper);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        height, 
        minHeight: typeof height === "number" ? `${height}px` : height, 
        width: "100%" 
      }}
    />
  );
}

export const TradingViewSymbolOverview = memo(TradingViewSymbolOverviewComponent);
export default TradingViewSymbolOverview;
