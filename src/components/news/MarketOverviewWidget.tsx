"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MarketItem {
    symbol: string;
    label: string;
    price: string;
    change: string;
    isPositive: boolean;
}

const DEFAULT_MARKET_ITEMS: MarketItem[] = [
    { symbol: "BZ=F", label: "Brent Petrol", price: "92,34", change: "+1,28%", isPositive: true },
    { symbol: "EURUSD=X", label: "EUR/USD", price: "1,1024", change: "+0,38%", isPositive: true },
    { symbol: "XU100.IS", label: "BIST 100", price: "9.845", change: "+0,72%", isPositive: true },
    { symbol: "ALTIN", label: "Gram Altın", price: "2.890", change: "+0,64%", isPositive: true }
];

export function MarketOverviewWidget({ className = "" }: { className?: string }) {
    const [items, setItems] = useState<MarketItem[]>(DEFAULT_MARKET_ITEMS);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('/api/finance?symbols=BZ=F,EURUSD=X,XU100.IS,ALTIN');
                const json = await res.json();
                if (json && Array.isArray(json.results) && json.results.length > 0) {
                    const mapped = json.results.map((r: any) => {
                        const rawPrice = r.regularMarketPrice ?? r.price ?? r.fulldayPrice;
                        const rawChange = r.regularMarketChangePercent ?? r.changePercent ?? 0;
                        const changeNum = typeof rawChange === 'number' ? rawChange : parseFloat(rawChange || "0");
                        const isPos = changeNum >= 0;
                        const formattedPrice = typeof rawPrice === 'number' 
                            ? rawPrice.toLocaleString('tr-TR', { maximumFractionDigits: rawPrice < 10 ? 4 : 2 }) 
                            : (rawPrice || "—");
                        
                        let displayLabel = r.shortName || r.name || r.symbol;
                        if (r.symbol === 'BZ=F') displayLabel = 'Brent Petrol';
                        else if (r.symbol === 'EURUSD=X') displayLabel = 'EUR/USD';
                        else if (r.symbol === 'XU100.IS') displayLabel = 'BIST 100';
                        else if (r.symbol === 'ALTIN') displayLabel = 'Gram Altın';

                        return {
                            symbol: r.symbol,
                            label: displayLabel,
                            price: formattedPrice,
                            change: `${isPos ? '+' : ''}${changeNum.toFixed(2)}%`,
                            isPositive: isPos
                        };
                    });
                    const updated = DEFAULT_MARKET_ITEMS.map(def => {
                        const found = mapped.find((m: any) => m.symbol === def.symbol);
                        return found || def;
                    });
                    setItems(updated);
                }
            } catch (e) {
                // Keep default market items on fetch failure
            }
        };

        fetchPrices();
    }, []);

    return (
        <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs ${className}`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-[#00008B] tracking-tight">
                        Piyasa Genel Görünümü
                    </h3>
                </div>
                <Link 
                    href="/dashboard" 
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:underline"
                >
                    Tümünü Gör <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {items.map((item, idx) => (
                    <div 
                        key={idx}
                        className="bg-slate-50/70 border border-slate-100/90 rounded-xl p-2.5 flex flex-col justify-between hover:bg-slate-100/70 transition-colors"
                    >
                        <span className="text-[10px] font-bold text-slate-500 truncate" title={item.label}>
                            {item.label}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                            {item.price}
                        </span>
                        <div className={`flex items-center gap-0.5 text-[10px] font-bold mt-0.5 ${
                            item.isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                            {item.isPositive ? (
                                <ArrowUpRight className="w-3 h-3 shrink-0" />
                            ) : (
                                <ArrowDownRight className="w-3 h-3 shrink-0" />
                            )}
                            <span>{item.change}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
