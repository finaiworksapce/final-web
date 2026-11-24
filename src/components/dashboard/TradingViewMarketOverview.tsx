"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget h-full w-full";
        container.appendChild(widgetContainer);

        const copyrightContainer = document.createElement("div");
        copyrightContainer.className = "tradingview-widget-copyright";
        copyrightContainer.style.display = "none";
        copyrightContainer.innerHTML = '<span class="trademark">&nbsp;TradingView tarafından</span> <a href="https://tr.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span class="blue-text">dünya piyasaları</span></a>';
        container.appendChild(copyrightContainer);

        const config = {
            lineWidth: 2,
            lineType: 0,
            chartType: "area",
            fontColor: "rgb(106, 109, 120)",
            gridLineColor: isDark ? "rgba(242, 242, 242, 0.06)" : "rgba(46, 46, 46, 0.06)",
            volumeUpColor: "rgba(34, 171, 148, 0.5)",
            volumeDownColor: "rgba(247, 82, 95, 0.5)",
            backgroundColor: isDark ? "#0F0F0F" : "#ffffff",
            widgetFontColor: isDark ? "#DBDBDB" : "#0F0F0F",
            upColor: "#22ab94",
            downColor: "#f7525f",
            borderUpColor: "#22ab94",
            borderDownColor: "#f7525f",
            wickUpColor: "#22ab94",
            wickDownColor: "#f7525f",
            colorTheme: isDark ? "dark" : "light",
            isTransparent: false,
            locale: "tr",
            chartOnly: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "Trebuchet MS, sans-serif",
            valuesTracking: "1",
            changeMode: "price-and-percent",
            symbols: [
                ["FX_IDC:XAUTRYG|3M"],
                ["FX_IDC:XAGTRYG|3M"],
                ["FX:USDTRY|3M"],
                ["FX_IDC:EURTRY|3M"],
                ["BITSTAMP:BTCUSD|3M"],
                ["IG:NASDAQ|3M"]
            ],
            dateRanges: [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            fontSize: "10",
            headerFontSize: "small",
            autosize: false,
            dateFormat: "dd MMM 'yy",
            width: "100%",
            height: "100%",
            noTimeScale: false,
            hideDateRanges: false,
            hideMarketStatus: true,
            hideSymbolLogo: false
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.async = true;
        script.innerHTML = JSON.stringify(config);
        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [isDark]);

    return (
        <div 
            ref={containerRef}
            className={`tradingview-widget-container w-full h-full relative overflow-hidden ${className}`}
            style={{ width: "100%", height: "100%" }}
        >
            <div className="tradingview-widget-container__widget h-full w-full" />
        </div>
    );
}

export default memo(TradingViewMarketOverview);
