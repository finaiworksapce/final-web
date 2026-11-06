"use client";

import { TrendingUp } from "lucide-react";
import TradingViewMarketOverview from "@/components/dashboard/TradingViewMarketOverview";

export function MarketOverviewWidget() {
    return (
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 h-[395px] flex flex-col justify-between group overflow-hidden">
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0E1E38]/5 border border-[#0E1E38]/10 flex items-center justify-center text-[#0E1E38] shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-[#0E1E38]" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#0E1E38] tracking-tight">
                            Piyasa Genel Görünümü
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] zodiak-subtitle font-[325] text-white bg-[#0E1E38] font-normal px-2.5 py-0.5 rounded-full shadow-xs">
                    Canlı
                </span>
            </div>

            {/* 2. TradingView Symbol Overview Entegrasyonu */}
            <div className="flex-1 min-h-0 w-full pt-1 overflow-hidden">
                <TradingViewMarketOverview />
            </div>
        </div>
    );
}
