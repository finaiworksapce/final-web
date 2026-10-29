"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Layers, Pause, Play } from "lucide-react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTitle,
  StepperDescription,
  StepperTrigger,
} from "@/components/ui/stepper";

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

  // Manuel seçim yapıldığında timer'ı sıfırla
  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
    setProgressKey((k) => k + 1);
  };

  if (!channels || channels.length === 0) return null;

  return (
    <aside
      className={cn(
        "w-full xl:w-[14%] 2xl:w-[12%] xl:min-w-[170px] xl:max-w-[215px] shrink-0 xl:sticky xl:top-6 self-start",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-white border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3.5 relative overflow-hidden">
        {/* Üst Başlık & Durum İndikatörü */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-150">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 text-[#00008B]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-[#00008B] leading-tight truncate">
                Etki Zinciri
              </h3>
              <p className="text-[9px] text-slate-400 font-bold truncate">
                Neden → Sonuç
              </p>
            </div>
          </div>

          {/* Otomatik Akış / Duraklatma Göstergesi */}
          <div
            className="flex items-center gap-1 text-[9px] font-bold text-slate-400"
            title={isPaused ? "Döngü Duraklatıldı (Fare Üzerinde)" : "5s Otomatik Döngü Aktif"}
          >
            {isPaused ? (
              <Pause className="w-3 h-3 text-amber-500 animate-pulse" />
            ) : (
              <Play className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
            )}
          </div>
        </div>

        {/* Stepper Dikey Akış (Animasyonlu & Büyütülen) */}
        <Stepper
          value={activeStep}
          onValueChange={handleStepChange}
          orientation="vertical"
          className="w-full space-y-2"
        >
          {channels.map((channel, idx) => {
            const isActive = activeStep === idx;
            const isCompleted = idx < activeStep;
            const isLast = idx === channels.length - 1;

            return (
              <StepperItem
                key={idx}
                step={idx}
                completed={isCompleted}
                className={cn(
                  "relative w-full rounded-2xl transition-all duration-500 ease-out p-2.5 border",
                  isActive
                    ? "scale-[1.04] z-10 opacity-100 shadow-md ring-2 ring-[#00008B]/20 " +
                        (idx === 0
                          ? "bg-[#00008B] text-white border-[#00008B]"
                          : isLast
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-blue-50/90 text-slate-900 border-blue-200")
                    : "scale-[0.98] opacity-40 hover:opacity-75 bg-slate-50 border-slate-200 text-slate-700"
                )}
              >
                <StepperTrigger className="w-full text-left items-start gap-2.5 cursor-pointer">
                  <StepperIndicator
                    className={cn(
                      "size-5.5 text-[10px] font-black transition-all shrink-0 mt-0.5",
                      isActive
                        ? idx === 0
                          ? "bg-white text-[#00008B] shadow-sm"
                          : isLast
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "bg-[#00008B] text-white shadow-sm"
                        : "bg-slate-200 text-slate-600"
                    )}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={cn(
                          "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded transition-colors",
                          isActive
                            ? idx === 0
                              ? "bg-blue-800 text-blue-100"
                              : isLast
                              ? "bg-emerald-700 text-emerald-100"
                              : "bg-blue-100 text-[#00008B]"
                            : "bg-slate-200 text-slate-500"
                        )}
                      >
                        {channel.step}
                      </span>
                      <span
                        className={cn(
                          "text-[8px] font-black",
                          isActive
                            ? idx === 0 || isLast
                              ? "text-blue-100"
                              : "text-[#00008B]"
                            : "text-slate-400"
                        )}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    <StepperTitle
                      className={cn(
                        "text-[11px] font-black leading-snug transition-colors",
                        isActive
                          ? idx === 0 || isLast
                            ? "text-white"
                            : "text-[#00008B]"
                          : "text-slate-700"
                      )}
                    >
                      {channel.title}
                    </StepperTitle>

                    <StepperDescription
                      className={cn(
                        "text-[9px] font-medium leading-relaxed mt-0.5 transition-colors line-clamp-3",
                        isActive
                          ? idx === 0
                            ? "text-blue-100"
                            : isLast
                            ? "text-emerald-50"
                            : "text-slate-600 font-semibold"
                          : "text-slate-400"
                      )}
                    >
                      {channel.desc}
                    </StepperDescription>
                  </div>
                </StepperTrigger>

                {/* Aktif Aşama İçin 5 Saniyelik İlerleme Çubuğu */}
                {isActive && !isPaused && (
                  <div className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                      key={progressKey}
                      className={cn(
                        "h-full rounded-full transition-all duration-[5000ms] ease-linear w-full",
                        idx === 0 || isLast ? "bg-white/80" : "bg-[#00008B]"
                      )}
                      style={{
                        animation: "progressFill " + intervalMs + "ms linear forwards",
                      }}
                    />
                  </div>
                )}
              </StepperItem>
            );
          })}
        </Stepper>

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
