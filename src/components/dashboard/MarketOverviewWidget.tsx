"use client";

import { TrendingUp } from "lucide-react";
import TradingViewMarketOverview from "@/components/dashboard/TradingViewMarketOverview";

export function MarketOverviewWidget() {
    return (
        <div className="bg-white rounded-2xl min-[360px]:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 h-[380px] min-[360px]:h-[395px] xl:h-[420px] 2xl:h-[450px] flex flex-col justify-between group overflow-hidden border border-slate-100">
            {/* 1. Üst Başlık */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2.5 sm:px-5 sm:pt-5 border-b border-[#D6E4FF]/40 shrink-0">
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
            </div>

            {/* 2. TradingView Symbol Overview Entegrasyonu (Tam Oranlı) */}
            <div className="flex-1 w-full min-h-0 overflow-hidden relative">
                <TradingViewMarketOverview />
            </div>
        </div>
    );
}
