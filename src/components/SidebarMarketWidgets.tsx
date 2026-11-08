"use client";

import { useEffect, useState, memo } from "react";
import { TrendingUp, Coins, DollarSign, Euro, Bitcoin } from "lucide-react";

interface MarketItem {
    id: string;
    symbol: string;
    label: string;
    price: number;
    changePercent: number;
    currencySuffix?: string;
    icon: typeof TrendingUp;
}

const DEFAULT_MARKET_ITEMS: MarketItem[] = [
    { id: "bist", symbol: "XU100.IS", label: "BIST 100", price: 14000, changePercent: 0, currencySuffix: "", icon: TrendingUp },
    { id: "gold", symbol: "ALTIN", label: "Gram Altın", price: 6800, changePercent: 0, currencySuffix: " ₺", icon: Coins },
    { id: "usd", symbol: "TRY=X", label: "USD/TRY", price: 48.4, changePercent: 0, currencySuffix: " ₺", icon: DollarSign },
    { id: "eur", symbol: "EURTRY=X", label: "EUR/TRY", price: 56.2, changePercent: 0, currencySuffix: " ₺", icon: Euro },
    { id: "btc", symbol: "BTC-USD", label: "BTC/USD", price: 80000, changePercent: 0, currencySuffix: " $", icon: Bitcoin },
];

function formatPrice(val: number, maxDecimals: number = 2): string {
    if (!val || isNaN(val)) return "—";
    return val.toLocaleString("tr-TR", {
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
    });
}

function SidebarMarketWidgetsComponent() {
    const [items, setItems] = useState<MarketItem[]>(DEFAULT_MARKET_ITEMS);

    useEffect(() => {
        let isMounted = true;

        async function fetchMarketData() {
            try {
                const res = await fetch("/api/finance?symbols=XU100.IS,ALTIN,TRY=X,EURTRY=X,BTC-USD");
                if (!res.ok) return;
                const json = await res.json();
                if (!json.results || !Array.isArray(json.results) || !isMounted) return;

                const results = json.results;

                setItems(prev => prev.map(item => {
                    const match = results.find((r: any) => {
                        if (!r || !r.symbol) return false;
                        const s = r.symbol.toUpperCase();
                        if (item.symbol === "ALTIN") {
                            return s === "ALTIN" || s === "GA" || s.includes("XAU");
                        }
                        return s === item.symbol.toUpperCase() || s.replace(".IS", "") === item.symbol.toUpperCase();
                    });

                    if (match && typeof match.regularMarketPrice === "number" && match.regularMarketPrice > 0) {
                        return {
                            ...item,
                            price: match.regularMarketPrice,
                            changePercent: typeof match.regularMarketChangePercent === "number" 
                                ? match.regularMarketChangePercent 
                                : item.changePercent,
                        };
                    }
                    return item;
                }));
            } catch (err) {
                console.error("Sidebar market widgets fetch error:", err);
            }
        }

        fetchMarketData();
        const timer = setInterval(fetchMarketData, 45000); // 45 saniyede bir otomatik yenile
        return () => {
            isMounted = false;
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="mx-2 md:mx-3 p-3 rounded-2xl bg-[#F5F7FA] dark:bg-[#02041A] border border-[#D6E4FF] dark:border-[#5B80FF]/30 text-[#040989] dark:text-[#F5F7FA] shadow-md select-none relative overflow-hidden">
            {/* Ambient subtle light-blue glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#D6E4FF]/40 rounded-full blur-xl pointer-events-none" />

            {/* Başlık & Canlı Rozeti */}
            <div className="flex items-center justify-between px-1 mb-2 relative z-10 border-b border-[#D6E4FF]/60 pb-1.5">
                <span className="text-[10px] clash-subtitle font-[325] tracking-widest uppercase text-[#040989]/80">
                    PİYASA
                </span>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-[#004BFA] tracking-tight">Canlı</span>
                </div>
            </div>

            {/* 5 Adet Mini Gösterge Satırı */}
            <div className="space-y-1 relative z-10">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isPositive = item.changePercent >= 0;
                    const decimals = 2;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-[#D6E4FF]/30 transition-colors duration-150"
                        >
                            {/* Sol: İkon & Varlık Adı */}
                            <div className="flex items-center gap-2 min-w-0">
                                <Icon className="w-3.5 h-3.5 text-[#004BFA] shrink-0" />
                                <span className="text-[11px] clash-subtitle font-[325] text-[#040989] truncate tracking-tight">
                                    {item.label}
                                </span>
                            </div>

                            {/* Sağ: Değer & Yüzde Değişimi */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[11px] font-numbers font-medium text-[#040989] tabular-nums">
                                    {formatPrice(item.price, decimals)}{item.currencySuffix}
                                </span>
                                <span
                                    className={`text-[10px] font-numbers font-medium tabular-nums flex items-center px-1 py-0.5 rounded ${
                                        isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                                    }`}
                                >
                                    {isPositive ? "+" : ""}
                                    {item.changePercent.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export const SidebarMarketWidgets = memo(SidebarMarketWidgetsComponent);
