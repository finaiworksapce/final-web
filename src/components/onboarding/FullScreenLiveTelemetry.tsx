"use client";

import React, { useMemo } from "react";
import { DynamicStrategyTelemetry } from "@/config/onboarding-questions";
import { TrendingUp, Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

interface FullScreenLiveTelemetryProps {
  telemetry: DynamicStrategyTelemetry;
  currentStep: number;
  totalSteps: number;
}

export function FullScreenLiveTelemetry({ telemetry }: FullScreenLiveTelemetryProps) {
  const { distribution, instruments } = telemetry;

  // Donut hesaplamaları
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~263.89

  const slices = useMemo(() => {
    const rawSlices = [
      { name: "Hisse", value: distribution.stock, color: "#004BFA", glow: "rgba(0, 75, 250, 0.4)" },
      { name: "Fon", value: distribution.fund, color: "#5B80FF", glow: "rgba(91, 128, 255, 0.4)" },
      { name: "Altın", value: distribution.gold, color: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)" },
      { name: "Likit", value: distribution.cash, color: "#D6E4FF", glow: "rgba(214, 228, 255, 0.4)" },
    ];

    let currentOffset = 0;
    return rawSlices.map((slice) => {
      const strokeLength = (slice.value / 100) * CIRCUMFERENCE;
      const dashArray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
      const dashOffset = -currentOffset;
      currentOffset += strokeLength;
      return { ...slice, dashArray, dashOffset };
    });
  }, [distribution, CIRCUMFERENCE]);

  return (
    <aside className="w-full h-full bg-gradient-to-br from-[#02041A] via-[#04082C] to-[#010314] text-slate-100 flex flex-col justify-between p-7 sm:p-9 lg:p-11 border-l border-blue-950/60 relative overflow-hidden select-none">
      {/* FinAi İmza Işık Huzmesi & İnce Izgara Deseni */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]" 
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #5B80FF 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#004BFA]/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#5B80FF]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ÜST BÖLÜM: Canlı Model Başlığı */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B80FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004BFA]" />
            </span>
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#D6E4FF]/70 font-semibold">
              Canlı Strateji Kalibratörü
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-[10px] font-mono text-[#D6E4FF]">
            <Activity className="w-3 h-3 text-[#5B80FF]" />
            <span>Risk: {telemetry.expectedRisk}</span>
          </div>
        </div>

        {/* Model Başlığı */}
        <div className="space-y-1 pt-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-clash transition-all duration-300">
            {telemetry.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-300/80 font-normal leading-relaxed line-clamp-2">
            {telemetry.tagline}
          </p>
        </div>
      </div>

      {/* ORTA BÖLÜM: Animasyonlu Donut & Varlık Dağılım Kartları */}
      <div className="relative z-10 my-auto py-4 space-y-6">
        {/* Donut Grafik ve Oranlar */}
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-blue-900/30 backdrop-blur-md">
          {/* Animasyonlu SVG Donut */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Arka plan halkası */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="9"
              />

              {/* Dinamik Dilimler */}
              {slices.map((slice, idx) => (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="9"
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              ))}
            </svg>

            {/* Halka İçi Değer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] font-mono text-[#D6E4FF]/70 uppercase tracking-wider">
                Dağılım
              </span>
              <span className="text-base sm:text-lg font-bold text-white font-expose">
                %100
              </span>
            </div>
          </div>

          {/* Varlık Oranları Grid */}
          <div className="flex-1 min-w-0 space-y-2">
            {slices.map((slice, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 transition-transform duration-300"
                      style={{ backgroundColor: slice.color, boxShadow: `0 0 8px ${slice.glow}` }}
                    />
                    <span>{slice.name === "Hisse" ? "Hisse Senetleri" : slice.name === "Fon" ? "Yatırım Fonları" : slice.name === "Altın" ? "Kıymetli Maden" : "Likit Rezerv"}</span>
                  </span>
                  <span className="font-expose font-bold text-white tabular-nums text-xs sm:text-sm">
                    %{slice.value}
                  </span>
                </div>
                {/* Animasyonlu Mikro Bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${slice.value}%`, backgroundColor: slice.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3'lü İnce Metrik Çubuğu */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white/[0.03] border border-blue-900/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-[#D6E4FF]/60 block mb-1">Hedef Getiri</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm font-expose">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{telemetry.expectedReturnRange}</span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-blue-900/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-[#D6E4FF]/60 block mb-1">Volatilite</span>
            <span className="text-white font-bold text-sm font-expose">
              {telemetry.volatilityBand}
            </span>
          </div>

          <div className="bg-white/[0.03] border border-blue-900/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-[#D6E4FF]/60 block mb-1">Max Düşüş</span>
            <span className="text-[#D6E4FF] font-bold text-sm font-expose">
              {telemetry.maxDrawdownTolerance}
            </span>
          </div>
        </div>

        {/* Temsili Varlıklar (Sadeleştirilmiş Ticker'lar) */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6E4FF]/60 block">
            Örnek Model Varlıkları
          </span>

          <div className="grid grid-cols-3 gap-2">
            {instruments.slice(0, 3).map((item) => (
              <div
                key={item.symbol}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-blue-900/30 hover:border-[#004BFA]/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-[#D6E4FF] group-hover:text-white transition-colors">
                    {item.symbol}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 font-expose tabular-nums">
                    %{item.allocationWeight}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALT BÖLÜM: Sade Analist Notu */}
      <div className="relative z-10 pt-4 border-t border-blue-900/40 flex items-center justify-between text-xs text-slate-400">
        <p className="text-[11px] text-slate-300/80 font-normal leading-relaxed line-clamp-2">
          {telemetry.analystSummary}
        </p>
      </div>
    </aside>
  );
}
