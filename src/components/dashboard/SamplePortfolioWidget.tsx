"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, PlusCircle, HelpCircle } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import { STRATEGY_PROFILES } from "@/config/onboarding-questions";
import Link from "next/link";

export function SamplePortfolioWidget() {
  const { recommendedStrategy, financialLiteracyLevel } = useUser();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Kullanıcının profiline göre örnek stratejiyi seç
  const strategyKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
  const strategy = STRATEGY_PROFILES[strategyKey] || STRATEGY_PROFILES.intermediate;

  const RADIUS = 38;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~238.76

  let cumulativeOffset = 0;

  return (
    <div className="bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f5f8ff_100%)] border border-blue-200/80 hover:border-blue-300 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group relative overflow-hidden">
      {/* Sağ üst hafif parıltı efekti */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* 1. Üst Başlık & Rozet */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/90 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Örnek Portföy</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200/80">
                AI Model
              </span>
            </h3>
          </div>
        </div>

        <span
          className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 cursor-help"
          title="Finansal seviyenize ve hedefinize göre hazırlanmış örnek dağılım modeli."
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </span>
      </div>

      {/* 2. Donut Grafik & Dağılım Listesi */}
      <div className="flex items-center gap-3.5 my-auto py-2 relative z-10">
        {/* Donut Grafik */}
        <div className="relative w-28 h-28 sm:w-30 sm:h-30 xl:w-32 xl:h-32 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-2xs">
            {strategy.distribution.map((item, idx) => {
              const strokeLength = (item.percentage / 100) * CIRCUMFERENCE;
              const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
              const strokeDashoffset = -cumulativeOffset;
              cumulativeOffset += strokeLength;

              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? 13 : 10.5}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Donut İçi Bilgi */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 leading-tight">
              Hedef Model
            </span>
            <span className="text-xs sm:text-[13px] font-black text-slate-900 tracking-tight mt-0.5">
              %100
            </span>
          </div>
        </div>

        {/* Dağılım Listesi */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {strategy.distribution.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between gap-1 py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? "bg-blue-50/70" : ""
                }`}
                title={item.description}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate max-w-[90px] sm:max-w-[115px]">
                    {item.name}
                  </span>
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-slate-900 tabular-nums shrink-0">
                  %{item.percentage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Alt Çağrı (CTA) Butonu */}
      <div className="pt-2 border-t border-slate-100 relative z-10 flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-500 font-medium truncate">
          İlk varlığınızı ekleyin, dağılım aktifleşsin
        </span>

        <Link
          href="/dashboard/portfolio?openAdd=true"
          className="shrink-0 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-xs hover:shadow active:scale-95"
        >
          <PlusCircle className="w-3 h-3" />
          <span>Varlık Ekle</span>
        </Link>
      </div>
    </div>
  );
}
