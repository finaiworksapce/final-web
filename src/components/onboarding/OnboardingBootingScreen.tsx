"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ShieldCheck, Terminal } from "lucide-react";

interface OnboardingBootingScreenProps {
  modelTitle: string;
}

const BOOT_STAGES = [
  "Yatırımcı risk profili ve volatilite toleransı kalibre ediliyor...",
  "BIST & TEFAS varlık ağırlıkları modeliyle eşleştiriliyor...",
  "Kişiselleştirilmiş analitik göstergeler oluşturuluyor...",
  "FinAi Portföy Terminali başlatılıyor..."
];

export function OnboardingBootingScreen({ modelTitle }: OnboardingBootingScreenProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < BOOT_STAGES.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#03071E] text-slate-100 flex items-center justify-center p-6 select-none animate-fadeIn">
      {/* İnce teknik ızgara */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8">
        {/* Terminal İkon Başlığı */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Terminal className="w-4 h-4 text-blue-500" />
            <span>FINAI // PORTFOLIO INITIALIZER</span>
          </div>

          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
        </div>

        {/* Model Başlığı */}
        <div className="space-y-2 text-center">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800/60 inline-block">
            KALİBRE EDİLEN STRATEJİ
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white font-clash">
            {modelTitle}
          </h2>
        </div>

        {/* Adım Adım Terminal Başlatma Çizgisi */}
        <div className="space-y-3 font-mono text-xs">
          {BOOT_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isCompleted ? "text-slate-300" : isCurrent ? "text-blue-400 font-semibold" : "text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="truncate">{stage}</span>
              </div>
            );
          })}
        </div>

        {/* İlerleme Çubuğu */}
        <div className="space-y-1 pt-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStageIndex + 1) / BOOT_STAGES.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>SİSTEM DURUMU: AKTİF</span>
            <span>% {Math.round(((currentStageIndex + 1) / BOOT_STAGES.length) * 100)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
