"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Layers, Check } from "lucide-react";

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
  const [progressKey, setProgressKey] = useState<number>(0);

  const totalSteps = channels?.length || 0;

  // 5 Saniyelik Kesintisiz Otomatik Döngü (Kısır Döngü)
  useEffect(() => {
    if (totalSteps <= 1) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % totalSteps);
      setProgressKey((k) => k + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [totalSteps, intervalMs]);

  // Manuel tıklama ile ilgili basamağa geçiş
  const handleStepClick = (newStep: number) => {
    setActiveStep(newStep);
    setProgressKey((k) => k + 1);
  };

  if (!channels || channels.length === 0) return null;

  return (
    <aside
      className={cn(
        "w-full",
        className
      )}
    >
      {/* KUTUSUZ: Dış çerçeve ve kart kutusu kaldırıldı, direkt sayfa zemininde saf tipografi */}
      <div className="space-y-4 px-1 sm:px-2 pt-1">
        {/* Üst Başlık (Duraklatıldı vb. metinler kaldırıldı) */}
        <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-[#00008B]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-[#00008B] tracking-tight truncate">
              Etki Zinciri
            </h3>
            <p className="text-[10px] text-slate-500 font-bold truncate">
              Neden → Sonuç Akışı
            </p>
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

                {/* Basamak Noktası / İndikatör (Dairesel Numara Noktası) */}
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
                      : "opacity-40 group-hover:opacity-70"
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
                        : "text-xs font-bold text-slate-500"
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
