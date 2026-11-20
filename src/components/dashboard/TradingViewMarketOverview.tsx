"use client";

import React, { useEffect, useRef, memo } from "react";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = "";

        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container";
        widgetContainer.style.width = "100%";
        widgetContainer.style.height = "100%";

        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container__widget";
        widgetDiv.style.width = "100%";
        widgetDiv.style.height = "100%";

        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        copyrightDiv.style.display = "none";
        copyrightDiv.innerHTML = '<a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span class="blue-text">World markets</span></a><span class="trademark">&nbsp;by TradingView</span>';

        const config = {
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
                ["FX_IDC:EURTRY|1D"],
                ["FX:USDTRY|1D"],
                ["BITSTAMP:BTCUSD|1D"],
                ["SKILLING:US100|1D"]
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
            headerFontSize: "medium",
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

        widgetContainer.appendChild(widgetDiv);
        widgetContainer.appendChild(copyrightDiv);
        widgetContainer.appendChild(script);
        container.appendChild(widgetContainer);

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`w-full h-full min-h-[320px] relative overflow-hidden bg-[#0F0F0F] rounded-xl ${className}`}
            style={{ width: "100%", height: "100%" }}
        />
    );
}

export default memo(TradingViewMarketOverview);
