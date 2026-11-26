"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  TrendingUp, 
  RefreshCw, 
  Check, 
  X, 
  Sliders, 
  Zap, 
  Compass, 
  ChevronRight, 
  Layers,
  Calculator,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  HelpCircle,
  Coins,
  Building2,
  Percent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { 
  WIZARD_QUESTIONS, 
  calculateDynamicStrategy, 
  FinancialLiteracyLevel,
  STRATEGY_PROFILES,
  BIST_SECTORS_MEDIAN,
  BYF_FUNDS_MEDIAN,
  StrategySlice
} from "@/config/onboarding-questions";
import { useTheme } from "next-themes";

const DISTRIBUTION_COLORS_LIGHT = ["#004BFA", "#2563EB", "#3B82F6", "#10B981", "#059669", "#34D399", "#F59E0B", "#D97706"];
const DISTRIBUTION_COLORS_DARK = ["#5B80FF", "#38BDF8", "#818CF8", "#34D399", "#10B981", "#6EE7B7", "#FBBF24", "#F59E0B"];

export default function SamplePortfolioPage() {
  const { 
    user, 
    userName, 
    email, 
    userMetadata, 
    recommendedStrategy, 
    financialLiteracyLevel, 
    hasExistingInvestments,
    completeOnboarding 
  } = useUser();
  const { addToast } = useToast();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const DISTRIBUTION_COLORS = isDark ? DISTRIBUTION_COLORS_DARK : DISTRIBUTION_COLORS_LIGHT;

  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [activeScenario, setActiveScenario] = useState<'median' | 'average' | 'conservative'>('median');
  const [activeMatrixTab, setActiveMatrixTab] = useState<'sectors' | 'funds'>('sectors');
  const [customAmountInput, setCustomAmountInput] = useState<string>("10000");

  // Mevcut kullanıcı yanıtları veya varsayılanlar (10 Soru Entegrasyonu)
  const initialAnswers = useMemo(() => {
    const saved = userMetadata?.onboarding_answers || {};
    return {
      literacy_level: saved.literacy_level || financialLiteracyLevel || "intermediate",
      investment_horizon: saved.investment_horizon || "long_1_3y",
      liquidity_need: saved.liquidity_need || "monthly_dca_add",
      strategic_goal: saved.strategic_goal || "dividend_yield",
      volatility_reaction: saved.volatility_reaction || "uncomfortable_hold",
      interest_sensitivity: saved.interest_sensitivity || "conventional",
      rebalance_cycle: saved.rebalance_cycle || "freq_monthly",
      currency_gold_shield: saved.currency_gold_shield || "shield_moderate_20",
      sector_thematic_focus: saved.sector_thematic_focus || "sec_tech_energy",
      investment_budget_plan: saved.investment_budget_plan || "budget_10k_monthly"
    };
  }, [userMetadata, financialLiteracyLevel]);

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers]);

  // Kullanıcı wizard'da doğrudan "Varlığım var" seçip soru setini doldurmadıysa tespit et
  const hasSkippedQuestions = Boolean(
    hasExistingInvestments && 
    (!userMetadata?.onboarding_answers || Object.keys(userMetadata.onboarding_answers).length === 0)
  );

  // Dinamik Strateji Telemetrisi (Anlık 10 soruya göre hesaplanır)
  const currentTelemetry = useMemo(() => {
    return calculateDynamicStrategy(answers);
  }, [answers]);

  // Varlık Dağılım Grafiği dilimleri
  const distributionItems = useMemo(() => {
    if (currentTelemetry.slices && currentTelemetry.slices.length > 0) {
      return currentTelemetry.slices.map((slice, idx) => ({
        name: slice.name,
        shortName: slice.shortName,
        percentage: slice.value,
        color: slice.color || DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length],
        category: slice.category,
        group: slice.group,
        medianReturn1Y: slice.medianReturn1Y,
        medianReturn5Y: slice.medianReturn5Y
      }));
    }

    const fallbackKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
    const profile = STRATEGY_PROFILES[fallbackKey] || STRATEGY_PROFILES.intermediate;
    return profile.distribution.map((item, idx) => ({
      name: item.name,
      shortName: item.name.split(" ")[0],
      percentage: item.percentage,
      color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length],
      category: (item.type === 'STOCK' ? 'BIST Hisse' : item.type === 'FUND' ? 'Borsa Yatırım Fonu' : 'Kıymetli Maden') as StrategySlice['category'],
      group: (item.type === 'STOCK' ? 'BIST_HISSE' : item.type === 'FUND' ? 'BYF_FON' : 'ALTIN_NAKIT') as StrategySlice['group'],
      medianReturn1Y: -25.0,
      medianReturn5Y: 200.0
    }));
  }, [currentTelemetry, recommendedStrategy, financialLiteracyLevel, DISTRIBUTION_COLORS]);

  const RADIUS = 38;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~238.76
  let cumulativeOffset = 0;

  const displayName = userName || (email ? email.split("@")[0] : "Salih KAVAKCI");

  // Testteki seçenek seçimi
  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Testi kaydet ve profili güncelle
  const handleSaveAndApply = async () => {
    try {
      const rawLiteracy = answers["literacy_level"];
      const literacy: "beginner" | "intermediate" | "advanced" = 
        rawLiteracy === "expert" ? "advanced" : (rawLiteracy as any) || "intermediate";
      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: hasExistingInvestments ?? false,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });
      setIsQuizModalOpen(false);
      addToast("10 Soruluk AI Portföy stratejiniz ve projeksiyonunuz güncellendi!", "success");
    } catch (e) {
      console.error("Strateji güncelleme hatası:", e);
      addToast("Strateji güncellenirken bir sorun oluştu.", "error");
    }
  };

  const currentModalQuestion = WIZARD_QUESTIONS[quizStep];
  const activeProjectionScenario = currentTelemetry.projection.scenarios[activeScenario];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-20">
      
      {/* AI Loop Ambient Işık Efektleri */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent blur-[140px] pointer-events-none"
      />

      {/* 1. ÜST BAR: Navigasyon & Aksiyonlar */}
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 py-4 border-b border-[#D6E4FF]/60 dark:border-white/10 flex items-center justify-between gap-3 relative z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Sağ Butonlar: 10 Soruluk Testi Yeniden Yap + Varlık Ekle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuizStep(0);
              setIsQuizModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#004BFA]/30 hover:border-[#004BFA] text-[#004BFA] dark:text-[#D6E4FF] font-normal text-xs clash-subtitle font-[325] shadow-2xs transition-all flex items-center gap-1.5 active:scale-95 group"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#D6E4FF] group-hover:rotate-180 transition-transform duration-500" />
            <span>10 Soruluk Testi Yenile</span>
          </button>

          <Link
            href="/dashboard/portfolio?openAdd=true"
            className="px-3.5 py-1.5 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Varlık Ekle</span>
          </Link>
        </div>
      </div>

      {/* ANA GÖVDE */}
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 py-5 sm:py-6 space-y-6 relative z-10">

        {/* BİLGİLENDİRME BANNERI */}
        {hasSkippedQuestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-[#004BFA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#004BFA] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Compass className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                  10 Aşamalı Strateji Profiliniz Kalibre Edilmeyi Bekliyor
                </h4>
                <p className="text-xs clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                  Size en uygun BIST hisse, sektör ve fon dağılımını üretmek için 10 soruluk testi 1 dakikada tamamlayabilirsiniz.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setQuizStep(0);
                setIsQuizModalOpen(true);
              }}
              className="shrink-0 px-4 py-2 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Testi Şimdi Yap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* BAŞLIK & DÜZENLE BUTONU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
            {displayName} İçin Çok Katmanlı Portföy Modeli
          </h1>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              onClick={() => {
                setQuizStep(0);
                setIsQuizModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-all text-xs clash-subtitle font-[325] flex items-center gap-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#004BFA]" />
              <span>10 Soruyu Düzenle</span>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 1: 2 SÜTUNLU BENTO (Çok Katmanlı Donut + 4 Metrik & Rasyonel) */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
          
          {/* SOL: Çok Katmanlı Donut Dağılımı (Kutusuz Açık Canvas) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-1 sm:p-2">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] shrink-0">
                  <PieChart className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                  Çok Katmanlı Hedef Varlık Dağılımı
                </h3>
              </div>
            </div>

            {/* Donut Grafik ve Liste */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 my-auto py-2">
              {/* Donut SVG */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-xs">
                    {/* Varlık Dilimleri */}
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
                          strokeWidth={isHovered ? 13 : 10}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          style={{ transition: "stroke-width 200ms ease-out" }}
                        />
                      );
                    })}
                  </svg>

                  {/* Donut İçi Bilgi */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-1">
                    <span className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-tight">
                      Tam Sepet
                    </span>
                    <span className="text-base sm:text-lg font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
                      %100
                    </span>
                  </div>
                </div>

                {/* Makro Ağırlık Göstergeleri (Çizgisiz & Sade) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 text-xs clash-subtitle font-[325]">
                  <span className="text-[#004BFA] dark:text-[#5B80FF]">
                    Hisseler (%{currentTelemetry.macroWeights.stock})
                  </span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Fonlar (%{currentTelemetry.macroWeights.fund})
                  </span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    Kıymetli Madenler (%{currentTelemetry.macroWeights.goldAndCash})
                  </span>
                </div>
              </div>

              {/* Sektör ve Fon Kırılım Listesi */}
              <div className="flex-1 w-full min-w-0 space-y-2">
                {distributionItems.map((item) => {
                  const isHovered = hoveredSymbol === item.name;
                  return (
                    <div
                      key={item.name}
                      onMouseEnter={() => setHoveredSymbol(item.name)}
                      onMouseLeave={() => setHoveredSymbol(null)}
                      className={`flex items-center justify-between gap-2 p-1.5 rounded-lg transition-colors ${
                        isHovered ? "bg-[#D6E4FF]/30 dark:bg-white/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className={`text-xs clash-desc font-[225] truncate ${
                          isHovered ? "text-[#004BFA] dark:text-[#5B80FF] font-normal" : "text-[#040989]/90 dark:text-[#F5F7FA]/90"
                        }`}>
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-xs font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                          %{item.percentage}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SAĞ: 4 Bento Metrik Kartı & AI Strateji Rasyoneli */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            
            {/* 4 Bento Metrik Kartı */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Yıllık Reel Medyan Getiri
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>~%{activeProjectionScenario.annualRate}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Enflasyon üstü bileşik medyan
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Risk Toleransı Seviyesi
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-[#004BFA] dark:text-[#5B80FF] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentTelemetry.expectedRisk}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Maks. Çekilme: {currentTelemetry.maxDrawdownTolerance}
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Volatilite Bandı
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{currentTelemetry.volatilityBand}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Sharpe Oranı: {currentTelemetry.sharpeRatioEst}
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Dengeleme Takvimi
                </span>
                <div className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#004BFA]" />
                  <span className="truncate">{currentTelemetry.rebalanceCycle}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  AI Dinamik Takip
                </span>
              </div>
            </div>

            {/* AI Strateji Rasyoneli (Koyu Kart) */}
            <div className="bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D6E4FF]" />
                    <h3 className="text-sm clash-title font-[500] text-white">
                      FinAi 10-Aşamalı Strateji Rasyoneli
                    </h3>
                  </div>

                  <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-white/10 text-[#D6E4FF]">
                    Kişiye Özel
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                  {currentTelemetry.analystSummary}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ BIST Sektör Hisseleri
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ BYF Fon Sepeti
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ Bileşik Medyan Projeksiyonu
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between relative z-10">
                <span className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/80">
                  Modeli doğrudan portföyünüze uygulayın
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

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 2: GELECEK KAZANÇ & BİLEŞİK GETİRİ SİMÜLATÖRÜ (KOMPAKT & EFEKTİF TASARIM) */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D6E4FF]/50 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#004BFA] text-white flex items-center justify-center shadow-xs shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-tight">
                  Gelecek Kazanç & Bileşik Getiri Simülatörü
                </h3>
                <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                  Aylık {Number(answers["investment_budget_plan"]?.replace(/\D/g, '') || customAmountInput || '10000').toLocaleString('tr-TR')} ₺ Düzenli Tasarruf Planı (DCA)
                </span>
              </div>
            </div>

            {/* Senaryo Seçici Butonlar */}
            <div className="flex items-center gap-1 bg-[#F5F7FA] dark:bg-white/5 p-1 rounded-xl border border-[#D6E4FF]/50 dark:border-white/10 self-start sm:self-auto">
              {(['median', 'average', 'conservative'] as const).map((scKey) => {
                const sc = currentTelemetry.projection.scenarios[scKey];
                const isActive = activeScenario === scKey;
                return (
                  <button
                    key={scKey}
                    onClick={() => setActiveScenario(scKey)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] clash-subtitle font-[325] transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#004BFA] text-white shadow-xs'
                        : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                    }`}
                  >
                    <span>{sc.label.split(' ')[0]}</span>
                    <span className="opacity-80 font-numbers">(%{sc.annualRate})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6 Vade Kartı: Tek Satırda Efektif ve Kompakt Görünüm */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {[
              { title: "1 Ay", data: activeProjectionScenario.month1 },
              { title: "3 Ay", data: activeProjectionScenario.month3 },
              { title: "6 Ay", data: activeProjectionScenario.month6 },
              { title: "1 Yıl", data: activeProjectionScenario.year1 },
              { title: "3 Yıl", data: activeProjectionScenario.year3 },
              { title: "5 Yıl", data: activeProjectionScenario.year5 },
            ].map((card, idx) => {
              const profitPct = card.data.principal > 0 ? ((card.data.profit / card.data.principal) * 100).toFixed(1) : "0.0";
              const isLongTerm = idx >= 3;
              return (
                <div 
                  key={idx}
                  className={`rounded-xl p-3 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isLongTerm 
                      ? 'border-[#004BFA]/30 bg-gradient-to-b from-[#004BFA]/5 to-transparent' 
                      : 'border-[#D6E4FF]/50 dark:border-white/10 bg-white/70 dark:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] clash-subtitle font-[325] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      {card.title}
                    </span>
                    <span className={`text-[10px] font-numbers font-medium px-1.5 py-0.5 rounded ${
                      Number(profitPct) > 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                    }`}>
                      +{profitPct}%
                    </span>
                  </div>

                  <div className="my-1.5">
                    <div className="text-sm sm:text-base font-numbers font-bold text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                      {card.data.total.toLocaleString('tr-TR')} ₺
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#D6E4FF]/40 dark:border-white/5 space-y-0.5 text-[10px]">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-numbers">
                      <span>Anapara:</span>
                      <span>{card.data.principal.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-numbers font-semibold">
                      <span>Net Kâr:</span>
                      <span>+{card.data.profit.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 3: PİYASA GETİRİ PERFORMANSLARI */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                  Piyasa Getiri Performansları
                </h3>
              </div>
              <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-0.5">
                BIST sektörleri ve fon kategorilerinin dönemlik getiri oranları
              </p>
            </div>

            {/* Tab Değiştirici: Hisseler vs Fonlar */}
            <div className="flex items-center bg-[#F5F7FA] dark:bg-white/5 p-1 rounded-xl border border-[#D6E4FF]/60 dark:border-white/10">
              <button
                onClick={() => setActiveMatrixTab('sectors')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeMatrixTab === 'sectors'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                Hisseler
              </button>
              <button
                onClick={() => setActiveMatrixTab('funds')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeMatrixTab === 'funds'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                Fonlar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                  <th className="py-2.5 px-3">{activeMatrixTab === 'sectors' ? 'BIST Sektörü' : 'Fon Türü'}</th>
                  <th className="py-2.5 px-3">Kapsam</th>
                  <th className="py-2.5 px-3 text-right">1 Aylık</th>
                  <th className="py-2.5 px-3 text-right">3 Aylık</th>
                  <th className="py-2.5 px-3 text-right">6 Aylık</th>
                  <th className="py-2.5 px-3 text-right">1 Yıllık</th>
                  <th className="py-2.5 px-3 text-right">5 Yıllık (Kümülatif)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                {activeMatrixTab === 'sectors' ? (
                  BIST_SECTORS_MEDIAN.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[#040989] dark:text-[#F5F7FA]">
                        {sec.sector}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {sec.count} Hisse
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${sec.ret1M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {sec.ret1M >= 0 ? `+${sec.ret1M}%` : `${sec.ret1M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${sec.ret3M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {sec.ret3M >= 0 ? `+${sec.ret3M}%` : `${sec.ret3M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${sec.ret6M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {sec.ret6M >= 0 ? `+${sec.ret6M}%` : `${sec.ret6M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${sec.ret1Y >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {sec.ret1Y >= 0 ? `+${sec.ret1Y}%` : `${sec.ret1Y}%`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-numbers font-bold text-emerald-600 dark:text-emerald-400">
                        +{sec.ret5Y}%
                      </td>
                    </tr>
                  ))
                ) : (
                  BYF_FUNDS_MEDIAN.map((f, idx) => (
                    <tr key={idx} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[#040989] dark:text-[#F5F7FA]">
                        {f.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        Risk: {f.riskValue}/7
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${f.ret1M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {f.ret1M >= 0 ? `+${f.ret1M}%` : `${f.ret1M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${f.ret3M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {f.ret3M >= 0 ? `+${f.ret3M}%` : `${f.ret3M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${f.ret6M >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {f.ret6M >= 0 ? `+${f.ret6M}%` : `${f.ret6M}%`}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-numbers ${f.ret1Y >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {f.ret1Y >= 0 ? `+${f.ret1Y}%` : `${f.ret1Y}%`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-numbers font-bold text-emerald-600 dark:text-emerald-400">
                        +{f.ret5Y}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* İNTERAKTİF 10 SORULUK KALİBRASYON TESTİ: FİNAİ AKADEMİ MODELİ */}
      {/* (FinAi İmza Gradyanı, Ambient Işıma, SVG Trend Dalgası & Yaylanmalı İkili Panel) */}
      {/* ----------------------------------------------------------------------------------- */}
      <AnimatePresence>
        {isQuizModalOpen && currentModalQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-8 overflow-y-auto">
            {/* 1. FinAi İmza Gradyanlı Arka Plan Katmanı (Akademi ile Birebir) */}
            <motion.div
              key="quiz-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setIsQuizModalOpen(false)}
              className="fixed inset-0 bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] overflow-hidden cursor-pointer"
            >
              {/* Ambient Background Gradient Circles */}
              <div className="absolute -top-24 -right-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />

              {/* Subtle SVG Wave Background (Toplam Varlık Trend Çizgisi) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="quizHeroWave" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#004BFA" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#5B80FF" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#5B80FF" stopOpacity="0.95" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                    fill="none"
                    stroke="url(#quizHeroWave)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="499" cy="24" r="4" fill="#5B80FF" opacity="1" className="animate-pulse" />
                </svg>
              </div>
            </motion.div>

            {/* 2. HAREKETLİ BEYAZ KALİBRASYON KARTI (YAYLANMALI MERKEZE UÇUŞ) */}
            <motion.div
              key="quiz-card-container"
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 18,
                mass: 0.85
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-5xl xl:max-w-6xl max-h-[92vh] bg-white dark:bg-[#02041A] rounded-3xl border border-white/20 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col font-clash ring-1 ring-white/10 my-auto"
            >
              {/* Modal Üst Bar: Logo, Başlık, 10 Adımlı İlerleme Hapları & Kapat */}
              <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-[#02041A] shrink-0">
                <div className="flex items-center gap-3">
                  <img src="/icon.png" alt="FinAi" className="w-8 h-8 object-contain shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                      FinAi 10 Aşamalı Portföy Kalibrasyonu
                    </h3>
                    <span className="text-[11px] clash-desc font-[225] text-slate-400 block">
                      Kişiselleştirilmiş BIST Model Portföy & Dağılım Motoru
                    </span>
                  </div>
                </div>

                {/* Akademi Tarzı 10 Aşamalı İlerleme Bölmeleri (Step Pills) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {WIZARD_QUESTIONS.map((q, idx) => {
                    const isDone = Boolean(answers[q.id]);
                    const isCurrent = idx === quizStep;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setQuizStep(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCurrent
                            ? "w-8 bg-[#004BFA]"
                            : isDone
                            ? "w-4 bg-emerald-500"
                            : "w-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20"
                        }`}
                        title={`Adım ${idx + 1}: ${q.category}`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer ml-auto"
                  title="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* İlerleme Çizgisi */}
              <div className="w-full h-1 bg-slate-100 dark:bg-white/5 shrink-0">
                <div
                  className="h-full bg-gradient-to-r from-[#004BFA] to-blue-500 transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / WIZARD_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* İKİLİ GÖVDE: SOLDA SORU VE SEÇENEKLER (%64), SAĞDA CANLI TELEMETRİ / ETKİ (%36) */}
              <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/10">
                {/* SOL KOLON: SORU & SEÇENEK KARTLARI */}
                <div className="w-full lg:w-[64%] p-5 sm:p-7 space-y-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`question-content-${quizStep}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#004BFA]/10 dark:bg-[#004BFA]/20 text-[#004BFA] dark:text-[#5B80FF] text-[11px] font-semibold tracking-wide">
                          <span>{currentModalQuestion.category}</span>
                          <span className="text-slate-400 dark:text-slate-500">•</span>
                          <span>Adım {quizStep + 1} / {WIZARD_QUESTIONS.length}</span>
                        </div>
                        <h4 className="text-base sm:text-xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-snug pt-1">
                          {currentModalQuestion.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] clash-desc font-[225] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {currentModalQuestion.contextExplanation}
                        </p>
                      </div>

                      {/* Soru 10 İçin Özel Açık Uçlu Sayısal Giriş Alanı */}
                      {currentModalQuestion.isCustomInputAllowed && (
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-white/5 border border-blue-200/80 dark:border-white/10 space-y-2">
                          <label className="text-xs clash-subtitle font-[325] text-[#004BFA] dark:text-[#93C5FD] block">
                            Aylık Yatırım Bütçenizi Serbest Olarak Girin (₺):
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <input
                                type="number"
                                min="500"
                                step="500"
                                placeholder="Örn: 10000"
                                value={customAmountInput}
                                onChange={(e) => {
                                  setCustomAmountInput(e.target.value);
                                  handleOptionSelect(currentModalQuestion.id, e.target.value);
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#02041A] text-sm font-numbers text-[#040989] dark:text-white focus:outline-hidden focus:border-[#004BFA]"
                              />
                              <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">₺ / Ay</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            * Aşağıdaki hazır bütçe şablonlarından birini seçebilir veya buraya doğrudan kendi bütçenizi yazabilirsiniz.
                          </span>
                        </div>
                      )}

                      {/* Seçenek Kartları */}
                      <div className="space-y-2.5 pt-1">
                        {currentModalQuestion.options.map((option) => {
                          const isSelected = answers[currentModalQuestion.id] === option.id;
                          return (
                            <div
                              key={option.id}
                              onClick={() => {
                                handleOptionSelect(currentModalQuestion.id, option.id);
                                if (option.id === "budget_10k_monthly") setCustomAmountInput("10000");
                                else if (option.id === "budget_25k_monthly") setCustomAmountInput("25000");
                                else if (option.id === "budget_50k_monthly") setCustomAmountInput("50000");
                              }}
                              className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                                isSelected
                                  ? "bg-[#004BFA]/5 dark:bg-[#004BFA]/20 border-[#004BFA] ring-2 ring-[#004BFA]/30 shadow-xs"
                                  : "bg-slate-50/70 dark:bg-white/5 border-slate-200/80 dark:border-white/10 hover:border-[#004BFA]/40 hover:bg-white dark:hover:bg-white/10"
                              }`}
                            >
                              <div className="space-y-1">
                                <h5 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                                  {option.title}
                                </h5>
                                <p className="text-[11px] sm:text-xs clash-desc font-[225] text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {option.description}
                                </p>
                              </div>

                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                  isSelected
                                    ? "border-[#004BFA] bg-[#004BFA] text-white"
                                    : "border-slate-300 dark:border-white/20"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* SAĞ KOLON: AKADEMİ CANLI STRATEJİ ETKİSİ (%36) */}
                <div className="w-full lg:w-[36%] p-5 sm:p-7 bg-slate-50/60 dark:bg-white/[0.02] flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA]">
                          <Zap className="w-3.5 h-3.5 text-[#004BFA]" />
                        </div>
                        <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-white">
                          Canlı Kalibrasyon Etkisi
                        </h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                        Canlı AI
                      </span>
                    </div>

                    {/* Strateji Adı ve Risk */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#02041A] border border-slate-200/80 dark:border-white/10 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-normal">Belirlenen Profil</span>
                        <span className="font-semibold text-[#004BFA] dark:text-[#5B80FF]">
                          {currentTelemetry.expectedRisk} Risk
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold clash-title text-[#0E1E38] dark:text-white">
                        {currentTelemetry.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        {currentTelemetry.tagline}
                      </p>
                    </div>

                    {/* Canlı Dağılım Çubukları */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Dinamik Ağırlık Dağılımı
                      </span>

                      {/* Hisse Senedi */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-300">BIST Hisse Senedi</span>
                          <span className="font-numbers text-[#004BFA]">%{currentTelemetry.macroWeights.stock}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#004BFA] transition-all duration-300"
                            style={{ width: `${currentTelemetry.macroWeights.stock}%` }}
                          />
                        </div>
                      </div>

                      {/* Yatırım Fonları */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-300">Sektör & Yatırım Fonları</span>
                          <span className="font-numbers text-emerald-600">%{currentTelemetry.macroWeights.fund}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${currentTelemetry.macroWeights.fund}%` }}
                          />
                        </div>
                      </div>

                      {/* Kıymetli Maden & Likit */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-600 dark:text-slate-300">Kıymetli Maden & Likit Kalkan</span>
                          <span className="font-numbers text-amber-600">%{currentTelemetry.macroWeights.goldAndCash}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${currentTelemetry.macroWeights.goldAndCash}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tahmini Getiri Bandı */}
                    <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-white/5 border border-blue-100 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Beklenen Yıllık Getiri</span>
                      <span className="font-bold text-[#004BFA] dark:text-[#5B80FF]">
                        {currentTelemetry.expectedReturnRange}
                      </span>
                    </div>
                  </div>

                  {/* Alt Bilgi İpucu */}
                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 text-[10px] text-slate-400 leading-relaxed border border-slate-200/50 dark:border-white/5">
                    💡 Verdiğiniz her yanıt, BIST ve TEFAS medyan getiri katsayılarıyla portföyünüzün risk dengesini gerçek zamanlı olarak ayarlar.
                  </div>
                </div>
              </div>

              {/* Modal Alt Bar: Geri, İleri / Tamamla */}
              <div className="px-5 sm:px-7 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-white/5 shrink-0">
                <button
                  type="button"
                  disabled={quizStep === 0}
                  onClick={() => setQuizStep((prev) => Math.max(0, prev - 1))}
                  className={`px-4 py-2 rounded-xl text-xs clash-subtitle font-[325] transition-colors cursor-pointer ${
                    quizStep === 0
                      ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  Geri
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:inline-block">
                    Adım {quizStep + 1} / {WIZARD_QUESTIONS.length}
                  </span>

                  {quizStep < WIZARD_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuizStep((prev) => prev + 1)}
                      className="px-5 py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white font-medium text-xs sm:text-sm clash-subtitle shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>İleri ({quizStep + 1}/10)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveAndApply}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004BFA] to-blue-600 hover:opacity-95 text-white font-medium text-xs sm:text-sm clash-subtitle shadow-lg shadow-[#004BFA]/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Kaydet ve Modeli Uygula</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
