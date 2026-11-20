"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { Loader2 } from "lucide-react";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            lineWidth: 1.5,
            lineType: 0,
            chartType: "area",
            fontColor: "#64748B",
            gridLineColor: "rgba(4, 9, 137, 0.05)",
            volumeUpColor: "rgba(4, 9, 137, 0.2)",
            volumeDownColor: "rgba(4, 9, 137, 0.2)",
            backgroundColor: "#FFFFFF",
            widgetFontColor: "#040989",
            upColor: "#040989",
            downColor: "#040989",
            borderUpColor: "#040989",
            borderDownColor: "#040989",
            wickUpColor: "#040989",
            wickDownColor: "#040989",
            colorTheme: "light",
            isTransparent: false,
            locale: "tr",
            chartOnly: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "'Zodiak', 'Zodiak-Variable', 'Expose-Medium', sans-serif",
            valuesTracking: "1",
            changeMode: "price-and-percent",
            symbols: [
                ["Gram Altın", "FX_IDC:XAUTRYG|1D"],
                ["Gram Gümüş", "FX_IDC:XAGTRYG|1D"],
                ["Euro / TL", "FX_IDC:EURTRY|1D"],
                ["Dolar / TL", "FX:USDTRY|1D"],
                ["Bitcoin", "BITSTAMP:BTCUSD|1D"],
                ["Nasdaq 100", "SKILLING:US100|1D"]
            ],
            dateRanges: [
                "1d|1",
                "1m|30",
                "12m|1D",
                "all|1M"
            ],
            fontSize: "8",
            headerFontSize: "small",
            autosize: true,
            width: "100%",
            height: "100%",
            noTimeScale: false,
            hideDateRanges: false,
            hideMarketStatus: false,
            hideSymbolLogo: true
        };

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.async = true;
        script.innerHTML = JSON.stringify(config);

        script.onload = () => {
            setIsLoading(false);
        };

        widgetContainer.appendChild(widgetDiv);
        widgetContainer.appendChild(copyrightDiv);
        widgetContainer.appendChild(script);
        container.appendChild(widgetContainer);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => {
            clearTimeout(timer);
            if (container) {
                container.innerHTML = "";
            }
        };
    }, []);

    return (
        <div className={`relative w-full h-full min-h-[310px] bg-white rounded-xl ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs gap-2">
                    <Loader2 className="w-5 h-5 text-[#040989] animate-spin" />
                    <span className="text-[11px] clash-desc font-[225] text-[#040989]/70">Piyasa grafiği hazırlanıyor...</span>
                </div>
            )}
            <div 
                ref={containerRef}
                className="w-full h-full min-h-[310px] relative overflow-hidden bg-white rounded-xl"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}

export default memo(TradingViewMarketOverview);
