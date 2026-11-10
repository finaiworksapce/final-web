"use client";

import React from "react";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function FinAiAkademiWidget() {
  const router = useRouter();

  const handleWidgetClick = () => {
    router.push("/dashboard/akademi");
  };

  return (
    <div
      onClick={handleWidgetClick}
      className="cursor-pointer bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white shadow-xl shadow-[#0E1E38]/20 relative overflow-hidden flex flex-col justify-between h-full group rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 min-h-[220px] min-[360px]:min-h-[250px] font-clash transition-all duration-300 hover:shadow-2xl"
    >
      {/* Ambient Background Gradient Circles (Toplam Varlık Kartı ile Birebir Aynı) */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#004BFA]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#004BFA]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle SVG Wave Background with Electric Sky Blue Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 500 160" className="w-full h-full opacity-40" preserveAspectRatio="none">
          <defs>
            <linearGradient id="akademiWaveLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#004BFA" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#5B80FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5B80FF" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
            fill="none"
            stroke="url(#akademiWaveLine)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="499" cy="24" r="3.5" fill="#5B80FF" opacity="1" className="animate-pulse" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* 1. Üst Başlık */}
        <div className="flex items-center justify-between gap-1.5 flex-wrap border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="clash-subtitle font-[325] text-white tracking-tight text-[11px] min-[360px]:text-xs sm:text-[13px]">
                FinAi Akademi
              </h3>
            </div>
          </div>

          {/* Sağ Üst Canlı Rozet (Toplam Varlık Widget'ı Stili) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004BFA] text-white font-medium shadow-sm shadow-[#004BFA]/30 clash-subtitle font-[325] text-[9px] min-[360px]:text-[10px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white">Çok Yakında Sizlerle</span>
          </div>
        </div>

        {/* 2. Orta Büyük Başlık & Tasarım */}
        <div className="my-auto py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl min-[360px]:text-3xl sm:text-4xl clash-title font-[500] text-white tracking-tight">
              FinAi Akademi
            </span>
          </div>
          <p className="text-xs clash-desc font-[225] text-white mt-1.5">
            Çok Yakında Sizlerle
          </p>
        </div>

        {/* 3. Alt Durum Çubuğu */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs clash-subtitle font-[325] text-white">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] text-white">Çok Yakında Sizlerle</span>
          </div>
          <span className="text-[11px] text-white font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>İncele</span>
            <ArrowRight className="w-3 h-3 text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}
