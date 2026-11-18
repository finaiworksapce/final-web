"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const isDark = resolvedTheme === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    const iframeSrc = useMemo(() => {
        const config = {
            symbols: [
                ["XAUTRYG", "FX_IDC:XAUTRYG|1D"],
                ["BTCTRY", "BINANCE:BTCTRY|1D"],
                ["EURTRY", "FX_IDC:EURTRY|1D"],
                ["USDTRY", "FX_IDC:USDTRY|1D"]
            ],
            chartOnly: false,
            width: "100%",
            height: "100%",
            locale: "tr",
            colorTheme: isDark ? "dark" : "light",
            gridLineColor: isDark ? "rgba(91, 128, 255, 0.15)" : "rgba(214, 228, 255, 0.45)",
            fontColor: isDark ? "#94A3B8" : "#64748B",
            widgetFontColor: isDark ? "#F5F7FA" : "#040989",
            upColor: "#004BFA",
            downColor: "#EF4444",
            borderUpColor: "#004BFA",
            borderDownColor: "#EF4444",
            wickUpColor: "#004BFA",
            wickDownColor: "#EF4444",
            showVolume: false,
            hideDateRanges: false,
            hideMarketStatus: false,
            hideSymbolLogo: false,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "'Clash Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: "10",
            headerFontSize: "small",
            noTimeScale: false,
            valuesTracking: "1",
            changeMode: "price-and-percent",
            chartType: "area",
            lineWidth: 2,
            lineType: 0,
            dateRanges: [
                "1w|15",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ]
        };

        return `https://s.tradingview.com/embed-widget/symbol-overview/?locale=tr#${encodeURIComponent(
            JSON.stringify(config)
        )}`;
    }, [isDark]);

    if (!mounted) {
        return (
            <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-2xl ${className}`}>
                <Loader2 className="w-5 h-5 animate-spin text-[#004BFA]" />
                <span className="text-[11px] font-medium text-slate-500">
                    Piyasa grafiği yükleniyor...
                </span>
            </div>
        );
    }

    return (
        <div className={`w-full h-full relative overflow-hidden min-h-[300px] ${className}`}>
            {!loaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 dark:bg-[#040989]/80 backdrop-blur-[2px] z-10 transition-opacity">
                    <Loader2 className="w-5 h-5 animate-spin text-[#004BFA]" />
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">
                        Piyasa grafiği yükleniyor...
                    </span>
                </div>
            )}
            <iframe
                key={isDark ? "dark" : "light"}
                title="Piyasa Genel Görünümü"
                src={iframeSrc}
                className="w-full h-full border-0 absolute inset-0 rounded-xl"
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="eager"
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}

export default memo(TradingViewMarketOverview);
