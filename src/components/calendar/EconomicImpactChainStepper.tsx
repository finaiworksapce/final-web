"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Layers, Pause, Play, Check } from "lucide-react";

interface ImpactChannelItem {
  step: string;
  title: string;
  desc: string;
}

interface EconomicImpactChainStepperProps {
  channels: ImpactChannelItem[];
  className?: string;
  intervalMs?: number; // Varsayılan: 5000ms (5 saniye)
}

export default function EconomicImpactChainStepper({
  channels,
  className,
  intervalMs = 5000,
}: EconomicImpactChainStepperProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progressKey, setProgressKey] = useState<number>(0);

  const totalSteps = channels?.length || 0;

  // 5 Saniyelik Otomatik Döngü (Kısır Döngü)
  useEffect(() => {
    if (totalSteps <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % totalSteps);
      setProgressKey((k) => k + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [totalSteps, isPaused, intervalMs]);

  // Manuel tıklama ile ilgili basamağa geçiş
  const handleStepClick = (newStep: number) => {
    setActiveStep(newStep);
    setProgressKey((k) => k + 1);
  };

  if (!channels || channels.length === 0) return null;

  return (
    <aside
      className={cn(
        "w-full lg:w-[260px] xl:w-[290px] shrink-0 lg:sticky lg:top-6 self-start",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Üst Başlık & Akış Durumu */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-150">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-[#00008B]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-[#00008B] tracking-tight truncate">
                Etki Zinciri
              </h3>
              <p className="text-[10px] text-slate-400 font-bold truncate">
                Neden → Sonuç Akışı
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-150 text-[9px] font-bold text-slate-500"
            title={isPaused ? "Döngü Duraklatıldı (İncelemek için)" : "5s Otomatik Döngü Devam Ediyor"}
          >
            {isPaused ? (
              <>
                <Pause className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                <span className="text-amber-600">Duraklatıldı</span>
              </>
            ) : (
              <>
                <Play className="w-2 h-2 text-emerald-500 fill-emerald-500" />
                <span className="text-emerald-700">Canlı Akış</span>
              </>
            )}
          </div>
        </div>

        {/* KUTUSUZ SAF TİPOGRAFİK DİKEY TİMELİNE (SADECE SIRASI GELEN YAZI ÖNE ÇIKAR) */}
        <div className="relative flex flex-col space-y-4 pt-1">
          {channels.map((channel, idx) => {
            const isActive = activeStep === idx;
            const isCompleted = idx < activeStep;
            const isLast = idx === totalSteps - 1;

            return (
              <div
                key={idx}
                onClick={() => handleStepClick(idx)}
                className="relative flex items-start gap-3.5 cursor-pointer group select-none"
              >
                {/* Dikey Bağlantı Çizgisi (Separator Track) */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[13px] top-[26px] bottom-[-16px] w-[2px] transition-colors duration-500 z-0",
                      isCompleted ? "bg-[#00008B]" : "bg-slate-200"
                    )}
                  />
                )}

                {/* Basamak Noktası / İndikatör (Kutucuk Değil, Dairesel Numara Noktası) */}
                <div
                  className={cn(
                    "relative z-10 size-7 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 transition-all duration-500",
                    isActive
                      ? "bg-[#00008B] text-white ring-4 ring-blue-100 shadow-sm scale-110"
                      : isCompleted
                      ? "bg-blue-100 text-[#00008B]"
                      : "bg-slate-100 border border-slate-200/90 text-slate-400 group-hover:border-slate-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>

                {/* Metin Alanı (KUTUSUZ: Arka planı, kenarlığı yok; sadece sırası gelen yazı öne çıkar) */}
                <div
                  className={cn(
                    "flex-1 min-w-0 transition-all duration-500",
                    isActive
                      ? "opacity-100 scale-[1.02] origin-left"
                      : "opacity-45 group-hover:opacity-75"
                  )}
                >
                  {/* Basamak Etiketi */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={cn(
                        "text-[9px] font-black uppercase tracking-wider transition-colors",
                        isActive ? "text-blue-600" : "text-slate-400"
                      )}
                    >
                      {channel.step}
                    </span>
                  </div>

                  {/* Başlık (Sırası gelen yazı koyulaşır ve öne çıkar) */}
                  <h4
                    className={cn(
                      "transition-all duration-500 leading-snug tracking-tight",
                      isActive
                        ? "text-[13px] font-black text-[#00008B]"
                        : "text-xs font-bold text-slate-600"
                    )}
                  >
                    {channel.title}
                  </h4>

                  {/* Açıklama */}
                  <p
                    className={cn(
                      "transition-colors duration-500 mt-0.5 leading-relaxed",
                      isActive
                        ? "text-[11px] font-semibold text-slate-600"
                        : "text-[10px] font-normal text-slate-400 line-clamp-2"
                    )}
                  >
                    {channel.desc}
                  </p>

                  {/* Sırası gelen yazı için zarif 5 saniyelik alttan ilerleme çizgisi */}
                  {isActive && !isPaused && (
                    <div className="mt-2 h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        key={progressKey}
                        className="h-full bg-[#00008B] rounded-full"
                        style={{
                          animation: "progressFill " + intervalMs + "ms linear forwards",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes progressFill {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </aside>
  );
}
