"use client";

import { useEffect, useRef } from "react";

export function FinancialTicker() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // TradingView Ticker Tape Web Component modül scriptini güvenli olarak yükle
        const scriptId = "tradingview-ticker-tape-script";
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.type = "module";
            script.src = "https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js";
            document.head.appendChild(script);
        }

        const container = containerRef.current;
        if (container) {
            container.innerHTML = "";
            const ticker = document.createElement("tv-ticker-tape");
            ticker.setAttribute(
                "symbols",
                "FX_IDC:XAUTRYG,FX_IDC:XAGTRYG,FX_IDC:EURTRY,FX:USDTRY,COINBASE:BTCUSD,SKILLING:US100"
            );
            ticker.setAttribute("theme", "dark");
            ticker.setAttribute("item-size", "compact");
            ticker.setAttribute("transparent-background", "true");
            ticker.style.display = "block";
            ticker.style.width = "118%";
            ticker.style.height = "100%";
            ticker.style.transform = "scale(0.85)";
            ticker.style.transformOrigin = "left center";
            ticker.style.setProperty("--tv-widget-background-color", "transparent");
            ticker.style.setProperty("--tv-widget-hover-background-color", "rgba(255, 255, 255, 0.08)");
            ticker.style.setProperty("--ja", "rgba(255, 255, 255, 0.08)");
            ticker.style.setProperty("--tv-widget-text-color", "#ffffff");
            ticker.style.setProperty("--tv-widget-price-text-color", "#ffffff");
            ticker.style.setProperty("--tv-widget-font-family", "'Zodiak', 'Zodiak-Variable', 'Expose-Medium', sans-serif");
            container.appendChild(ticker);
        }

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full h-[42px] min-h-[42px] bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] border-b border-white/10 relative overflow-hidden flex items-center"
        />
    );
}

export default FinancialTicker;
