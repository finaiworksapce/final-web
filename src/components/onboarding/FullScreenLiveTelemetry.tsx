"use client";

import React, { useMemo } from "react";
import { DynamicStrategyTelemetry } from "@/config/onboarding-questions";
import { TrendingUp, Activity, ShieldCheck, ArrowUpRight, Sparkles } from "lucide-react";

interface FullScreenLiveTelemetryProps {
  telemetry: DynamicStrategyTelemetry;
  currentStep?: number;
  totalSteps?: number;
}

export function FullScreenLiveTelemetry({ telemetry }: FullScreenLiveTelemetryProps) {
  const { distribution, instruments } = telemetry;

  // Donut hesaplamaları
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~263.89

  const slices = useMemo(() => {
    let sourceSlices = telemetry.slices;
    if (!sourceSlices || sourceSlices.length === 0) {
      const isIslamic = telemetry.isIslamic;
      sourceSlices = [
        { name: isIslamic ? "Katılım Sanayi Hisseleri" : "Sanayi & İhracat Hisseleri", shortName: "Sanayi", value: Math.round(distribution.stock * 0.55), color: "#004BFA", glow: "rgba(0, 75, 250, 0.5)" },
        { name: isIslamic ? "Katılım Teknoloji Hisseleri" : "Teknoloji & Bilişim Hisseleri", shortName: "Teknoloji", value: distribution.stock - Math.round(distribution.stock * 0.55), color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.5)" },
        { name: isIslamic ? "Darphane Altın Sertifikası" : "Kıymetli Madenler (Altın)", shortName: "Altın", value: distribution.gold, color: "#F59E0B", glow: "rgba(245, 158, 11, 0.5)" },
        { name: isIslamic ? "Kira Sertifikası Katılım Fonu" : "Kira Sertifikası Fonu", shortName: isIslamic ? "Katılım Fonu" : "Kira Fonu", value: distribution.cash, color: isIslamic ? "#059669" : "#60A5FA", glow: isIslamic ? "rgba(5, 150, 105, 0.5)" : "rgba(96, 165, 250, 0.5)" },
      ];
    }

    let currentOffset = 0;
    return sourceSlices.map((slice) => {
      const strokeLength = (slice.value / 100) * CIRCUMFERENCE;
      const dashArray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
      const dashOffset = -currentOffset;
      currentOffset += strokeLength;
      return { ...slice, dashArray, dashOffset };
    });
  }, [telemetry, distribution, CIRCUMFERENCE]);

  return (
    <aside className="w-full h-full bg-gradient-to-br from-[#02041A] via-[#04082C] to-[#010314] text-slate-100 flex flex-col justify-between p-8 sm:p-10 lg:p-12 border-l border-blue-950/60 relative overflow-hidden select-none">
      {/* FinAi İmza Arka Plan Işıkları & Teknik Doku */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]" 
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #5B80FF 1px, transparent 0)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#004BFA]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5B80FF]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* ÜST BÖLÜM: Model Başlığı (Canlı Strateji Kalibratörü ve Risk Yüksek Yazıları Silindi) */}
      <div className="relative z-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-clash transition-all duration-300">
          {telemetry.title}
        </h2>
        <p className="text-sm sm:text-base text-[#D6E4FF]/80 font-normal leading-relaxed max-w-xl">
          {telemetry.tagline}
        </p>
      </div>

      {/* ORTA BÖLÜM: Bütün Alanı Estetik Dolduran Varlık Dağılım & Donut Alanı */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Donut Grafik ve Varlık Sınıfları Kartı */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-blue-900/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-7 sm:gap-9">
          {/* Animasyonlu Büyük SVG Donut */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Arka plan rotası */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="10"
              />

              {/* Dinamik Renkli Dilimler */}
              {slices.map((slice, idx) => (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="10"
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              ))}
            </svg>

            {/* Halka İçi Yüzde ve İkon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] sm:text-[11px] font-mono text-[#D6E4FF]/70 uppercase tracking-widest">
                Portföy
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white font-expose mt-0.5">
                %100
              </span>
            </div>
          </div>

          {/* Varlık Oranları ve Dinamik Çubuklar */}
          <div className="flex-1 w-full space-y-3.5">
            {slices.map((slice, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="flex items-center gap-2.5 text-slate-200 font-medium">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300"
                      style={{ backgroundColor: slice.color, boxShadow: `0 0 10px ${slice.glow}` }}
                    />
                    <span>{slice.name}</span>
                  </span>
                  <span className="font-expose font-bold text-white tabular-nums text-sm sm:text-base">
                    %{slice.value}
                  </span>
                </div>

                {/* Genişletilmiş Akıcı Mikro Çubuk */}
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${slice.value}%`,
                      backgroundColor: slice.color,
                      boxShadow: `0 0 12px ${slice.glow}`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3'lü Genişletilmiş Metrik Kartları */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/[0.03] border border-blue-900/35 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono text-[#D6E4FF]/60 block mb-2">
              Hedef Getiri
            </span>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base sm:text-lg font-expose">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>{telemetry.expectedReturnRange}</span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-blue-900/35 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono text-[#D6E4FF]/60 block mb-2">
              Volatilite
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg font-expose">
              <Activity className="w-4 h-4 text-[#5B80FF] shrink-0" />
              <span>{telemetry.volatilityBand}</span>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-blue-900/35 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono text-[#D6E4FF]/60 block mb-2">
              Max Düşüş
            </span>
            <div className="flex items-center gap-2 text-[#D6E4FF] font-bold text-base sm:text-lg font-expose">
              <ShieldCheck className="w-4 h-4 text-[#004BFA] shrink-0" />
              <span>{telemetry.maxDrawdownTolerance}</span>
            </div>
          </div>
        </div>

        {/* Örnek Model Varlıkları (Geniş 3'lü Ticker Kartları) */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#D6E4FF]/60 block">
            Örnek Model Varlıkları
          </span>

          <div className="grid grid-cols-3 gap-3">
            {(instruments || []).slice(0, 3).map((item) => (
              <div
                key={item.symbol}
                className="p-3.5 rounded-2xl bg-white/[0.025] border border-blue-900/35 hover:border-[#004BFA]/60 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs sm:text-sm font-bold text-[#D6E4FF] group-hover:text-white transition-colors">
                    {item.symbol}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white font-expose tabular-nums">
                    %{item.allocationWeight}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">{item.sector ? `${item.name} (${item.sector})` : item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALT BÖLÜM: Şık ve Dolgun Analist Notu Kartı */}
      <div className="relative z-10 pt-4 border-t border-blue-900/40">
        <div className="p-4 rounded-2xl bg-white/[0.025] border border-blue-900/30 text-xs text-slate-300/90 leading-relaxed font-normal">
          {telemetry.analystSummary}
        </div>
      </div>
    </aside>
  );
}
