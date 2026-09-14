"use client";

import React from "react";
import Link from "next/link";
import { BarChart2, Droplets, DollarSign, TrendingUp, Globe, Coins, ArrowRight } from "lucide-react";

interface RelatedAssetsWidgetProps {
    assets: string[];
    className?: string;
}

function getAssetIcon(asset: string) {
    const lower = asset.toLowerCase();
    if (lower.includes("petrol") || lower.includes("brent") || lower.includes("crude") || lower.includes("enerji")) {
        return <Droplets className="w-3.5 h-3.5 text-blue-500" />;
    }
    if (lower.includes("eur") || lower.includes("usd") || lower.includes("dolar") || lower.includes("tl") || lower.includes("kur") || lower.includes("döviz")) {
        return <DollarSign className="w-3.5 h-3.5 text-blue-600" />;
    }
    if (lower.includes("btc") || lower.includes("kripto") || lower.includes("eth") || lower.includes("coin")) {
        return <Coins className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (lower.includes("bölge") || lower.includes("küresel") || lower.includes("avrupa") || lower.includes("abd")) {
        return <Globe className="w-3.5 h-3.5 text-indigo-500" />;
    }
    return <TrendingUp className="w-3.5 h-3.5 text-blue-600" />;
}

export function RelatedAssetsWidget({ assets, className = "" }: RelatedAssetsWidgetProps) {
    if (!assets || assets.length === 0) return null;

    return (
        <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs ${className}`}>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <BarChart2 className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-[#00008B] tracking-tight">
                        İlgili Varlıklar
                    </h3>
                </div>
                <Link 
                    href="/dashboard/varliklar" 
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 hover:underline"
                >
                    Tümünü Gör <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {assets.map((asset, idx) => {
                    const cleanSymbol = asset.replace('#', '').trim();
                    const href = cleanSymbol.length <= 6 && /^[A-Z0-9.]+$/i.test(cleanSymbol)
                        ? `/dashboard/varlik/${cleanSymbol}`
                        : `/dashboard/news`;

                    return (
                        <Link
                            key={idx}
                            href={href}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/70 hover:border-blue-200 text-slate-800 hover:text-[#00008B] text-xs font-bold transition-all"
                        >
                            {getAssetIcon(asset)}
                            <span>{asset}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
