"use client";

import React from "react";
import { DynamicStrategyTelemetry } from "@/config/onboarding-questions";
import { ShieldAlert, TrendingUp, Activity, PieChart, Layers, ArrowUpRight } from "lucide-react";

interface FullScreenLiveTelemetryProps {
  telemetry: DynamicStrategyTelemetry;
  currentStep: number;
  totalSteps: number;
}

export function FullScreenLiveTelemetry({ telemetry, currentStep, totalSteps }: FullScreenLiveTelemetryProps) {
  const { distribution, instruments } = telemetry;

  return (
    <aside className="w-full h-full bg-[#03071E] text-slate-100 flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-l border-slate-800/80 relative overflow-hidden select-none">
      {/* İnce Geometrik Grid & Işık Çizgisi (AI slop olmayan, hassas teknik terminal deseni) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Üst Başlık ve Protokol Kodu */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-slate-400">
              Canlı Strateji Kalibratörü
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-400 border border-blue-800/50">
              {telemetry.codeName}
            </span>
          </div>
        </div>

        {/* Model Başlığı ve Dinamik Tagline */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-blue-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Aktif Risk Rejimi: {telemetry.expectedRisk}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-clash">
            {telemetry.title}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed line-clamp-2">
            {telemetry.tagline}
          </p>
        </div>
      </div>

      {/* Orta Alan: Dinamik Dağılım Çubuğu & Yüzdeler */}
      <div className="relative z-10 my-auto py-5 space-y-6">
        {/* Dağılım Çubuğu */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-blue-400" />
              <span>Öngörülen Varlık Dağılımı</span>
            </span>
            <span className="text-[11px] text-slate-500">100% Toplam</span>
          </div>

          <div className="h-3.5 w-full bg-slate-900 rounded-lg overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
            <div
              style={{ width: `${distribution.stock}%` }}
              className="h-full bg-blue-600 rounded-sm transition-all duration-500 ease-out relative group"
              title={`BIST Hisseleri: %${distribution.stock}`}
            />
            <div
              style={{ width: `${distribution.fund}%` }}
              className="h-full bg-indigo-500 rounded-sm transition-all duration-500 ease-out"
              title={`TEFAS Fonları: %${distribution.fund}`}
            />
            <div
              style={{ width: `${distribution.gold}%` }}
              className="h-full bg-amber-500 rounded-sm transition-all duration-500 ease-out"
              title={`Kıymetli Madenler: %${distribution.gold}`}
            />
            <div
              style={{ width: `${distribution.cash}%` }}
              className="h-full bg-slate-400 rounded-sm transition-all duration-500 ease-out"
              title={`Likit & PPF: %${distribution.cash}`}
            />
          </div>

          {/* Dağılım Değerleri (Metrik Kartları) */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium truncate">BIST</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white font-expose tabular-nums">
                %{distribution.stock}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium truncate">FON</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white font-expose tabular-nums">
                %{distribution.fund}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium truncate">ALTIN</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white font-expose tabular-nums">
                %{distribution.gold}
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                <span className="text-[10px] text-slate-400 font-medium truncate">LİKİT</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-white font-expose tabular-nums">
                %{distribution.cash}
              </span>
            </div>
          </div>
        </div>

        {/* Sayısal Kantitatif Metrikler Tablosu (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Hedef Getiri Bandı</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm font-expose">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{telemetry.expectedReturnRange}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Volatilite Bandı</span>
            <span className="text-slate-200 font-bold text-sm font-expose">
              {telemetry.volatilityBand}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Max Düşüş (MDD) Eşiği</span>
            <span className="text-amber-400/90 font-bold text-sm font-expose">
              {telemetry.maxDrawdownTolerance}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Dengeleme Frekansı</span>
            <span className="text-slate-200 font-medium text-xs font-mono">
              {telemetry.rebalanceCycle}
            </span>
          </div>
        </div>

        {/* Temsili Enstrüman Havuzu (Gerçek BIST & TEFAS Ticker'ları) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Seçilen Modele Uygun Örnek Varlıklar</span>
            </span>
            <span className="text-[10px] text-slate-500">Canlı Eşleşme</span>
          </div>

          <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
            {instruments.slice(0, 3).map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/50 shrink-0">
                    {item.symbol}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.tag}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-300 font-expose tabular-nums">
                    %{item.allocationWeight}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Bilgi & Analist Notu */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-3">
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/60">
          <strong className="text-slate-300 font-medium">FinAi Analist Notu: </strong>
          {telemetry.analystSummary}
        </p>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-slate-500" />
            <span>Simülatif Model Dağılımı</span>
          </span>
          <span>BIST & TEFAS Senkron</span>
        </div>
      </div>
    </aside>
  );
}
