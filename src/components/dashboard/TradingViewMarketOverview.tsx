"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { Loader2 } from "lucide-react";

export interface TradingViewMarketOverviewProps {
    className?: string;
}

const ASSETS = [
    { id: "gold", name: "Gram Altın", symbol: "FX_IDC:XAUTRYG" },
    { id: "silver", name: "Gram Gümüş", symbol: "FX_IDC:XAGTRYG" },
    { id: "eur", name: "Euro / TL", symbol: "FX_IDC:EURTRY" },
    { id: "usd", name: "Dolar / TL", symbol: "FX:USDTRY" },
    { id: "btc", name: "Bitcoin", symbol: "BITSTAMP:BTCUSD" },
    { id: "us100", name: "Nasdaq 100", symbol: "SKILLING:US100" }
];

const TIME_RANGES = [
    { label: "1G", range: "1d|1" },
    { label: "1A", range: "1m|30" },
    { label: "1Y", range: "12m|1D" },
    { label: "Tümü", range: "all|1M" }
];

export function TradingViewMarketOverview({ className = "" }: TradingViewMarketOverviewProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [activeAssetIdx, setActiveAssetIdx] = useState(0);
    const [activeRange, setActiveRange] = useState("1d|1");
    const [isLoading, setIsLoading] = useState(true);

    const activeAsset = ASSETS[activeAssetIdx] || ASSETS[0];

    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        setIsLoading(true);
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

        const config = {
            lineWidth: 1.5,
            lineType: 0,
            chartType: "area",
            fontColor: "#64748B",
            gridLineColor: "rgba(4, 9, 137, 0.05)",
            volumeUpColor: "rgba(4, 9, 137, 0.15)",
            volumeDownColor: "rgba(4, 9, 137, 0.15)",
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
            chartOnly: true,
            scalePosition: "right",
            scaleMode: "Normal",
            fontFamily: "'Zodiak', 'Zodiak-Variable', 'Expose-Medium', sans-serif",
            valuesTracking: "1",
            changeMode: "price-and-percent",
            symbols: [
                [activeAsset.name, `${activeAsset.symbol}|${activeRange.split('|')[1] || '1D'}`]
            ],
            autosize: true,
            width: "100%",
            height: "100%",
            noTimeScale: false,
            hideDateRanges: true,
            hideMarketStatus: true,
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
        }, 1200);

        return () => {
            clearTimeout(timer);
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [activeAssetIdx, activeRange]);

    return (
        <div className={`flex flex-col w-full h-full bg-white rounded-xl ${className}`}>
            {/* Üst Eksen: Solda Varlık İsmi & Sekmeler, Sağda Aynı Yatay Eksende Zaman Seçimi */}
            <div className="flex items-center justify-between gap-2 pb-2 pt-1 border-b border-[#D6E4FF]/40 px-1 shrink-0">
                {/* Sol Taraf: Türkçe Varlık Seçici */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-[70%]">
                    {ASSETS.map((asset, idx) => (
                        <button
                            key={asset.id}
                            onClick={() => setActiveAssetIdx(idx)}
                            className={`text-[10px] min-[360px]:text-[11px] clash-subtitle font-[325] px-2 py-0.5 rounded-md transition-all whitespace-nowrap ${
                                activeAssetIdx === idx
                                    ? "bg-[#040989] text-white font-medium shadow-xs"
                                    : "text-[#040989]/70 hover:bg-[#D6E4FF]/30"
                            }`}
                        >
                            {asset.name}
                        </button>
                    ))}
                </div>

                {/* Sağ Taraf: İsmin Hemen Karşısında Aynı Yatay Eksende Zaman Butonları */}
                <div className="flex items-center gap-1 shrink-0">
                    {TIME_RANGES.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => setActiveRange(t.range)}
                            className={`text-[9px] min-[360px]:text-[10px] font-numbers px-1.5 py-0.5 rounded transition-all ${
                                activeRange === t.range
                                    ? "bg-[#004BFA] text-white font-medium shadow-xs"
                                    : "text-[#040989]/60 hover:text-[#040989] hover:bg-[#D6E4FF]/30"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alt Alan: TradingView Chart-Only Grafiği */}
            <div className="flex-1 w-full min-h-[260px] relative overflow-hidden bg-white pt-1">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs gap-1.5">
                        <Loader2 className="w-4 h-4 text-[#040989] animate-spin" />
                        <span className="text-[10px] clash-desc font-[225] text-[#040989]/70">Piyasa grafiği hazırlanıyor...</span>
                    </div>
                )}
                <div 
                    ref={chartContainerRef}
                    className="w-full h-full min-h-[260px] relative overflow-hidden bg-white"
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        </div>
    );
}

export default memo(TradingViewMarketOverview);
