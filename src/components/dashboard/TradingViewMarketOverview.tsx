"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        const container = containerRef.current;
        if (!container) return;

        setIsLoading(true);
        // Önceki widget içeriğini temizle
        container.innerHTML = "";

        const widgetWrapper = document.createElement("div");
        widgetWrapper.className = "tradingview-widget-container";
        widgetWrapper.style.width = "100%";
        widgetWrapper.style.height = "100%";
        widgetWrapper.style.position = "relative";

        const widgetElement = document.createElement("div");
        widgetElement.className = "tradingview-widget-container__widget";
        widgetElement.style.width = "100%";
        widgetElement.style.height = "100%";

        const copyrightContainer = document.createElement("div");
        copyrightContainer.className = "tradingview-widget-copyright";
        copyrightContainer.style.opacity = "0";
        copyrightContainer.style.height = "1px";
        copyrightContainer.style.overflow = "hidden";
        copyrightContainer.style.pointerEvents = "none";
        copyrightContainer.innerHTML = `
            <a href="https://tr.tradingview.com/" rel="noopener nofollow" target="_blank">
                <span class="blue-text">Track all markets on TradingView</span>
            </a>
        `;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js?v=${Date.now()}`;
        script.async = true;
        script.innerHTML = JSON.stringify({
            lineWidth: 2,
            lineType: 0,
            chartType: "area",
            fontColor: isDark ? "#94A3B8" : "#64748B",
            widgetFontColor: isDark ? "#F5F7FA" : "#040989",
            gridLineColor: isDark ? "rgba(91, 128, 255, 0.15)" : "rgba(214, 228, 255, 0.45)",
            volumeUpColor: isDark ? "rgba(0, 75, 250, 0.35)" : "rgba(0, 75, 250, 0.18)",
            volumeDownColor: "rgba(239, 68, 68, 0.16)",
            backgroundColor: isDark ? "#040989" : "#FFFFFF",
            upColor: "#004BFA",
            downColor: "#EF4444",
            borderUpColor: "#004BFA",
            borderDownColor: "#EF4444",
            wickUpColor: "#004BFA",
            wickDownColor: "#EF4444",
            colorTheme: isDark ? "dark" : "light",
            isTransparent: true,
            locale: "tr",
            chartOnly: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "'Clash Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
            valuesTracking: "1",
            changeMode: "price-and-percent",
            symbols: [
                ["XAUTRYG", "FX_IDC:XAUTRYG|1D"],
                ["BTCTRY", "BINANCE:BTCTRY|1D"],
                ["EURTRY", "FX_IDC:EURTRY|1D"],
                ["USDTRY", "FX_IDC:USDTRY|1D"]
            ],
            dateRanges: [
                "1w|15",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            fontSize: "10",
            headerFontSize: "small",
            autosize: true,
            width: "100%",
            height: "100%",
            noTimeScale: false,
            hideDateRanges: false,
            hideMarketStatus: false,
            hideSymbolLogo: false
        });

        // DOM'a bağlı sırayla ekle
        container.appendChild(widgetWrapper);
        widgetWrapper.appendChild(widgetElement);
        widgetWrapper.appendChild(copyrightContainer);
        widgetWrapper.appendChild(script);

        // İframe yüklendiğinde yükleniyor durumunu kapat
        const checkIframe = setInterval(() => {
            if (widgetWrapper.querySelector("iframe")) {
                setIsLoading(false);
                clearInterval(checkIframe);
            }
        }, 300);

        const timeout = setTimeout(() => {
            setIsLoading(false);
            clearInterval(checkIframe);
        }, 4000);

        return () => {
            clearInterval(checkIframe);
            clearTimeout(timeout);
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [isMounted, isDark]);

    return (
        <div className={`w-full h-full relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-[#040989]/70 backdrop-blur-[2px] z-10 transition-opacity">
                    <Loader2 className="w-5 h-5 animate-spin text-[#004BFA]" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">
                        Piyasa grafiği yükleniyor...
                    </span>
                </div>
            )}
            <div 
                ref={containerRef} 
                className="w-full h-full relative"
            />
        </div>
    );
}

export default memo(TradingViewMarketOverview);
