"use client";

import { TrendingUp } from "lucide-react";
import TradingViewMarketOverview from "@/components/dashboard/TradingViewMarketOverview";

export function MarketOverviewWidget() {
    return (
        <div className="bg-white rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 h-[380px] min-[360px]:h-[395px] xl:h-[420px] 2xl:h-[450px] flex flex-col justify-between group overflow-hidden">
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/50 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/30 border border-[#D6E4FF]/60 flex items-center justify-center text-[#040989] shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-[#040989]" />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] tracking-tight">
                            Piyasa Genel Görünümü
                        </h3>
                    </div>
                </div>
                <span className="text-[10px] clash-subtitle font-[325] text-white bg-[#004BFA] font-normal px-2.5 py-0.5 rounded-full shadow-xs">
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
