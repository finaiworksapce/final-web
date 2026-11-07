"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

interface Quote {
    symbol: string;
    regularMarketPrice: number;
    regularMarketChangePercent: number;
    shortName?: string;
}

const FIXED_SYMBOLS = ["XU100.IS", "TRY=X", "EURTRY=X", "ALTIN", "BTC-TRY"];

const SYMBOL_NAMES: Record<string, string> = {
    "XU100.IS": "BIST 100",
    "TRY=X": "Dolar/TL",
    "EURTRY=X": "Euro/TL",
    "ALTIN": "Gram Altın",
    "XAUTRY=X": "Gram Altın",
    "BTC-TRY": "Bitcoin",
    "BTC": "Bitcoin"
};

export function FinancialTicker() {
    const [data, setData] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/finance?symbols=${FIXED_SYMBOLS.join(",")}`);
                const json = await res.json();
                if (json.results) {
                    setData(json.results.filter((r: any) => r && r.symbol));
                }
            } catch (error) {
                console.error("Failed to fetch financial ticker data", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && data.length === 0) {
        return (
            <div className="w-full h-12 flex items-center justify-center space-x-4 bg-white border-b border-[#D6E4FF]/50">
                <Activity className="w-4 h-4 text-[#040989] animate-pulse" />
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70">Piyasa verileri yükleniyor...</span>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border-b border-[#D6E4FF]/50 relative h-9 min-[360px]:h-10 md:h-12 flex items-center overflow-x-auto scrollbar-none touch-pan-x overscroll-x-contain">
            <div className="flex items-center justify-start md:justify-evenly px-2.5 min-[360px]:px-4 py-1.5 min-[360px]:py-2 min-w-max md:w-full gap-3 min-[360px]:gap-4 md:gap-1.5 min-[360px]:gap-2">
                {FIXED_SYMBOLS.map((sym, index) => {
                    const quote = data.find(q => 
                        q.symbol.toUpperCase() === sym.toUpperCase() || 
                        q.symbol.toUpperCase().replace(/\.IS$/, '') === sym.toUpperCase() ||
                        (sym === 'ALTIN' && (q.symbol.includes('XAU') || q.symbol.includes('ALTIN')))
                    ) || {
                        symbol: sym,
                        regularMarketPrice: 0,
                        regularMarketChangePercent: 0
                    };

                    const isPositive = quote.regularMarketChangePercent >= 0;
                    const name = SYMBOL_NAMES[sym] || quote.shortName || sym;

                    let price = quote.regularMarketPrice;
                    if (sym === "XAUTRY=X" || (sym === "ALTIN" && price > 50000)) {
                        price = price / 31.1034768;
                    }

                    return (
                        <div key={sym} className="flex items-center gap-2">
                            {index > 0 && <div className="w-px h-4 bg-[#D6E4FF] -ml-1 hidden md:block" />}
                            <span className="text-[10px] clash-subtitle font-[325] text-[#040989]/70 whitespace-nowrap uppercase tracking-widest">{name}</span>
                            <span className="text-xs md:text-sm font-numbers font-normal text-[#040989] whitespace-nowrap">
                                {price > 0 ? `₺${price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Canlı...'}
                            </span>
                            <div className={`flex items-center text-[10px] md:text-xs font-numbers font-normal whitespace-nowrap ${isPositive ? "text-emerald-700" : "text-rose-700"}`}>
                                {isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                                %{Math.abs(quote.regularMarketChangePercent || 0).toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
