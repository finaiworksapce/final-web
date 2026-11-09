"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, PlusCircle, HelpCircle, Eye } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import { STRATEGY_PROFILES } from "@/config/onboarding-questions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function SamplePortfolioWidget() {
  const router = useRouter();
  const { recommendedStrategy, financialLiteracyLevel, userMetadata } = useUser();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Kullanıcının profiline ve faiz hassasiyetine göre örnek stratejiyi seç
  const isIslamic = userMetadata?.isIslamicFinance || userMetadata?.onboarding_answers?.interest_sensitivity === "islamic_sensitive" || recommendedStrategy?.includes("islamic");
  let strategyKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
  if (isIslamic && !strategyKey.includes("islamic")) {
    const islamicKey = `${strategyKey}_islamic`;
    if (STRATEGY_PROFILES[islamicKey]) {
      strategyKey = islamicKey;
    }
  }
  const strategy = STRATEGY_PROFILES[strategyKey] || STRATEGY_PROFILES.intermediate;

  const RADIUS = 38;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~238.76

  let cumulativeOffset = 0;

  const handleWidgetClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push("/dashboard/sample-portfolio");
  };

  return (
    <div
      onClick={handleWidgetClick}
      className="cursor-pointer bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 hover:border-[#004BFA] rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group relative overflow-hidden font-clash"
    >
      {/* Sürekli AI Loop Arka Plan Parıltısı */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/40 to-transparent rounded-full blur-2xl pointer-events-none"
      />

      {/* 1. Üst Başlık & Rozet */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/60 dark:border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#040989] dark:text-[#F5F7FA] shrink-0">
            <Sparkles className="w-4 h-4 text-[#004BFA] dark:text-[#D6E4FF]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-[13px] clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight flex items-center gap-1.5">
              <span>Örnek Portföy</span>
              <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                AI Model
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] clash-subtitle font-[325] text-[#004BFA] dark:text-[#D6E4FF] hover:underline flex items-center gap-1"
            title="Örnek Portföy Detay Sayfasını Aç"
          >
            <span>Model Detayı</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* 2. Donut Grafik & Dağılım Listesi */}
      <div className="flex items-center gap-2 min-[360px]:gap-3.5 my-auto py-1.5 min-[360px]:py-2 relative z-10">
        {/* Donut Grafik */}
        <div className="relative w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-26 sm:h-26 xl:w-28 xl:h-28 shrink-0 flex items-center justify-center">
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
            <span className="text-[8px] min-[380px]:text-[9px] clash-subtitle font-[325] uppercase tracking-wider text-[#004BFA] dark:text-[#D6E4FF] leading-tight">
              Hedef Model
            </span>
            <span className="text-xs sm:text-[13px] font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
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
                className={`flex items-center justify-between gap-1.5 py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? "bg-[#D6E4FF]/40 dark:bg-white/10" : ""
                }`}
                title={item.description}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <div className="w-2 h-2 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] sm:text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] truncate block leading-tight">
                    {item.name}
                  </span>
                </div>

                <span className="text-[11px] sm:text-xs font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tabular-nums shrink-0 ml-1.5">
                  %{item.percentage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Alt Çağrı (CTA) Butonu */}
      <div className="pt-2 border-t border-[#D6E4FF]/60 dark:border-white/10 relative z-10 flex items-center justify-between gap-2">
        <span className="text-[10px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 truncate min-w-0 flex-1">
          İlk varlığınızı ekleyin, dağılım aktifleşsin
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/dashboard/portfolio?openAdd=true"
            onClick={(e) => e.stopPropagation()}
            className="px-2.5 py-1 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-[10px] min-[340px]:text-[11px] clash-subtitle font-[325] transition-all flex items-center gap-1 shadow-xs hover:shadow active:scale-95 whitespace-nowrap"
          >
            <PlusCircle className="w-3 h-3 shrink-0" />
            <span>Varlık Ekle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
