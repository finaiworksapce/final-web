"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  UserCheck,
  ChevronRight
} from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";
import { STRATEGY_PROFILES } from "@/config/onboarding-questions";
import { useTheme } from "next-themes";

const DISTRIBUTION_COLORS_LIGHT = ["#040989", "#004BFA", "#5B80FF", "#02041A", "#8AA8FF"];
const DISTRIBUTION_COLORS_DARK = ["#5B80FF", "#004BFA", "#38BDF8", "#818CF8", "#A5B4FC"];

export default function SamplePortfolioPage() {
  const { userName, email, recommendedStrategy, financialLiteracyLevel } = useUser();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const DISTRIBUTION_COLORS = isDark ? DISTRIBUTION_COLORS_DARK : DISTRIBUTION_COLORS_LIGHT;

  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Kullanıcının wizardda verdiği cevaplara göre seçilmiş tekil strateji profili
  const strategyKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
  const strategy = STRATEGY_PROFILES[strategyKey] || STRATEGY_PROFILES.intermediate;

  const distributionItems = useMemo(() => {
    return strategy.distribution.map((item, idx) => ({
      name: item.name,
      percentage: item.percentage,
      type: item.type,
      description: item.description,
      color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length]
    }));
  }, [strategy, DISTRIBUTION_COLORS]);

  const RADIUS = 34;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~213.628
  let cumulativeOffset = 0;

  const displayName = userName || (email ? email.split("@")[0] : "Yatırımcı");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-16">
      
      {/* 1. Üst Bar: Navigasyon & Kişisel Rozet */}
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 py-4 border-b border-[#D6E4FF]/60 dark:border-white/10 flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004BFA]/10 border border-[#004BFA]/30 text-[#004BFA] dark:text-[#D6E4FF] text-xs clash-subtitle font-[325]">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Wizard Yanıtlarınıza Özel Oluşturuldu</span>
          </div>

          <Link
            href="/dashboard/portfolio?openAdd=true"
            className="px-3.5 py-1.5 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Varlık Ekle</span>
          </Link>
        </div>
      </div>

      {/* ANA KAPSAYICI */}
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 py-6 space-y-6">
        
        {/* Başlık Alanı: Kullanıcıya Özel Olduğunu Net Hissettiren Başlık */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#D6E4FF]/60 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 uppercase tracking-wider">
              {strategy.badge || "Kişiselleştirilmiş Model"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
            {displayName} İçin Özel AI Portföy Dağılımı
          </h1>

          <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-1 max-w-3xl leading-relaxed">
            Onboarding wizard adımlarında belirttiğiniz yatırım tercihleri ve risk toleransınız esas alınarak FinAi algoritması tarafından size özel hazırlanmıştır.
          </p>
        </div>

        {/* 2 SÜTUNLU ANA DÜZEN: Sol Donut Grafiği (Varlık Dağılımı ile Aynı), Sağ Profil Metrikleri & Açıklama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
          
          {/* SOL: Donut Dağılım Kartı (TopAssetDistributionCard ile Birebir Aynı Tasarım & Renkler) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#040989]/40 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-sm border border-[#D6E4FF]/60 dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4FF]/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D6E4FF]/30 dark:bg-white/10 border border-[#D6E4FF]/60 dark:border-white/20 flex items-center justify-center text-[#040989] dark:text-[#F5F7FA] shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#040989] dark:text-[#F5F7FA]" />
                </div>
                <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                  Hedef Varlık Dağılımı
                </h3>
              </div>

              <span className="text-[10px] clash-subtitle font-[325] text-[#004BFA] dark:text-[#5B80FF]">
                %100 Model
              </span>
            </div>

            {/* Donut Grafik ve Liste (Varlık Dağılımı ile %100 Uyumlu) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 my-auto py-4">
              {/* Donut Grafik */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
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
                  <span className="text-sm sm:text-base font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
                    %100
                  </span>
                </div>
              </div>

              {/* Dağılım Listesi */}
              <div className="flex-1 w-full min-w-0 space-y-2.5">
                {distributionItems.map((item) => {
                  const isHovered = hoveredSymbol === item.name;
                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredSymbol(item.name)}
                      onMouseLeave={() => setHoveredSymbol(null)}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className={`text-xs clash-desc font-[225] truncate ${
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

            <div className="pt-3 border-t border-[#D6E4FF]/50 dark:border-white/10 flex items-center justify-between text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
              <span>Risk ve getiri dengesi optimize edilmiştir</span>
            </div>
          </div>

          {/* SAĞ: Model Özeti & Strateji Açıklaması */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            
            {/* Metrik Kartları */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Hedef Yıllık Getiri
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{strategy.expectedReturn || "%50 - %75"}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Risk Toleransı
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-[#004BFA] dark:text-[#5B80FF] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{strategy.expectedRisk || "Dengeli"}</span>
                </div>
              </div>
            </div>

            {/* AI Strateji Açıklaması */}
            <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                    {strategy.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] clash-desc font-[225] text-[#040989]/85 dark:text-[#F5F7FA]/85 leading-relaxed">
                  {strategy.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D6E4FF]/50 dark:border-white/10 mt-4 flex items-center justify-between">
                <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                  Bu modeli uygulamak için varlık ekleyin
                </span>

                <Link
                  href="/dashboard/portfolio?openAdd=true"
                  className="px-4 py-2 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Varlık Ekle</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* DETAYLI DAĞILIM TABLOSU (Sade ve Net) */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
              Hedef Dağılım Detayları
            </h3>
            <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70">
              {distributionItems.length} Varlık Grubu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Varlık Sınıfı</th>
                  <th className="py-2.5 px-3">Hedef Ağırlık</th>
                  <th className="py-2.5 px-3">Stratejik Rolü</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                {distributionItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#D6E4FF]/50 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className="font-numbers font-medium text-[#040989] dark:text-[#F5F7FA]">
                          %{item.percentage}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[#040989]/80 dark:text-[#F5F7FA]/80 clash-desc font-[225]">
                      {item.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
