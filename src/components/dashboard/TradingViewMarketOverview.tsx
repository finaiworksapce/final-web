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
        copyrightContainer.innerHTML = '<a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span class="blue-text">World markets</span></a><span class="trademark">&nbsp;by TradingView</span>';
        container.appendChild(copyrightContainer);

        const config = {
            lineWidth: 2,
            lineType: 0,
            chartType: "area",
            fontColor: isDark ? "rgb(106, 109, 120)" : "#64748B",
            gridLineColor: isDark ? "rgba(242, 242, 242, 0.06)" : "rgba(226, 232, 240, 0.6)",
            volumeUpColor: "rgba(34, 171, 148, 0.5)",
            volumeDownColor: "rgba(247, 82, 95, 0.5)",
            backgroundColor: isDark ? "#0F0F0F" : "#FFFFFF",
            widgetFontColor: isDark ? "#DBDBDB" : "#0E1E38",
            upColor: "#22ab94",
            downColor: "#f7525f",
            borderUpColor: "#22ab94",
            borderDownColor: "#f7525f",
            wickUpColor: "#22ab94",
            wickDownColor: "#f7525f",
            colorTheme: isDark ? "dark" : "light",
            isTransparent: false,
            locale: "en",
            chartOnly: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            valuesTracking: "1",
            changeMode: "price-and-percent",
            symbols: [
                ["FX_IDC:XAUTRYG|1D"],
                ["FX_IDC:XAGTRYG|1D"],
                ["SKILLING:US100|1D"],
                ["BITSTAMP:BTCUSD|1D"]
            ],
            dateRanges: [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            fontSize: "9",
            headerFontSize: "small",
            autosize: true,
            width: "100%",
            height: "100%",
            noTimeScale: false,
            hideDateRanges: false,
            hideMarketStatus: false,
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
        <div className="w-full h-full relative overflow-hidden min-h-[310px]">
            <div 
                ref={containerRef}
                className={`tradingview-widget-container relative ${className}`}
                style={{ 
                    width: "166.6%", 
                    height: "166.6%", 
                    transform: "scale(0.6)", 
                    transformOrigin: "top left" 
                }}
            >
                <div className="tradingview-widget-container__widget h-full w-full" />
            </div>
        </div>
    );
}

export default memo(TradingViewMarketOverview);
