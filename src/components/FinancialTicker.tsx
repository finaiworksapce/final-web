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
            ticker.style.width = "100%";
            ticker.style.height = "100%";
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
            className="w-full h-[50px] min-h-[50px] bg-[#040989] border-b border-[#040989]/60 relative overflow-hidden flex items-center"
        />
    );
}

export default FinancialTicker;
