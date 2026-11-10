"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import { STRATEGY_PROFILES, calculateDynamicStrategy } from "@/config/onboarding-questions";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const DISTRIBUTION_COLORS_LIGHT = ["#040989", "#004BFA", "#5B80FF", "#02041A", "#8AA8FF"];
const DISTRIBUTION_COLORS_DARK = ["#5B80FF", "#004BFA", "#38BDF8", "#818CF8", "#A5B4FC"];

export function SamplePortfolioWidget() {
  const router = useRouter();
  const { recommendedStrategy, financialLiteracyLevel, userMetadata } = useUser();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const DISTRIBUTION_COLORS = isDark ? DISTRIBUTION_COLORS_DARK : DISTRIBUTION_COLORS_LIGHT;

  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Kullanıcının wizardda verdiği cevaplara göre seçilmiş strateji profili
  const strategyKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
  const strategy = STRATEGY_PROFILES[strategyKey] || STRATEGY_PROFILES.intermediate;

  const distributionItems = useMemo(() => {
    // Eğer kullanıcının özel wizard cevapları varsa telemetriden al
    if (userMetadata?.onboarding_answers && Object.keys(userMetadata.onboarding_answers).length > 0) {
      const telemetry = calculateDynamicStrategy(userMetadata.onboarding_answers);
      if (telemetry.slices && telemetry.slices.length > 0) {
        return telemetry.slices.map((slice, idx) => ({
          name: slice.name,
          percentage: slice.value,
          color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length]
        }));
      }
    }

    return strategy.distribution.map((item, idx) => ({
      name: item.name,
      percentage: item.percentage,
      color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length]
    }));
  }, [strategy, userMetadata?.onboarding_answers, DISTRIBUTION_COLORS]);

  const RADIUS = 34;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~213.628
  let cumulativeOffset = 0;

  const handleWidgetClick = () => {
    router.push("/dashboard/sample-portfolio");
  };

  return (
    <div
      onClick={handleWidgetClick}
      className="cursor-pointer bg-white dark:bg-[#040989]/40 rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group border border-[#D6E4FF]/60 dark:border-white/10 font-clash"
    >
      {/* 1. Üst Başlık (Varlık Dağılımı Widget'ı ile Birebir Aynı) */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/50 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#D6E4FF]/30 dark:bg-white/10 border border-[#D6E4FF]/60 dark:border-white/20 flex items-center justify-center text-[#040989] dark:text-[#F5F7FA] shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#040989] dark:text-[#F5F7FA]" />
          </div>
          <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
            Örnek Portföy Dağılımı
          </h3>
        </div>

        <div className="flex items-center gap-1 text-[#040989]/60 dark:text-[#F5F7FA]/60 group-hover:text-[#040989] dark:group-hover:text-white transition-colors">
          <span className="text-[10px] clash-subtitle font-[325] hidden sm:inline">Model Detayı</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 2. Orta İçerik: Donut Grafik + Dağılım Listesi (Varlık Dağılımı Kartının Aynısı) */}
      <div className="flex items-center gap-2 min-[360px]:gap-3.5 my-auto py-1.5 min-[360px]:py-2">
        {/* Donut Grafik */}
        <div className="relative w-24 h-24 min-[360px]:w-28 min-[360px]:h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-xs">
            {distributionItems.map((item) => {
              const strokeLength = (item.percentage / 100) * CIRCUMFERENCE;
              const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
              const strokeDashoffset = -cumulativeOffset;
              cumulativeOffset += strokeLength;

              const isHovered = hoveredSymbol === item.name;

              return (
                <circle
                  key={item.name}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHovered ? 11 : 9}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-width 200ms ease-out" }}
                />
              );
            })}
          </svg>

          {/* Donut İçi Bilgi */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
            <span className="text-[10px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-tight">
              Hedef
            </span>
            <span className="text-xs sm:text-[13px] font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
              %100
            </span>
          </div>
        </div>

        {/* Dağılım Listesi */}
        <div className="flex-1 min-w-0 space-y-2 pl-1">
          {distributionItems.map((item) => {
            const isHovered = hoveredSymbol === item.name;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setHoveredSymbol(item.name)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className="flex items-center justify-between gap-1.5"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`text-[11px] sm:text-xs clash-desc font-[225] truncate ${
                    isHovered ? "text-[#004BFA] dark:text-[#5B80FF] font-normal" : "text-[#040989]/80 dark:text-[#F5F7FA]/80"
                  }`}>
                    {item.name}
                  </span>
                </div>

                <span className="text-xs font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tabular-nums shrink-0 ml-1">
                  %{item.percentage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Alt Açıklama / Link */}
      <div className="pt-2 border-t border-[#D6E4FF]/50 dark:border-white/10 flex items-center justify-between text-[10px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
        <span>Wizard tercihleriniz doğrultusunda hazırlandı</span>
        <span className="text-[#004BFA] dark:text-[#5B80FF] clash-subtitle font-[325] group-hover:underline">
          İncele →
        </span>
      </div>
    </div>
  );
}
