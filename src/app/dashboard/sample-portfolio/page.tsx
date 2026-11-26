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

  const RADIUS = 34;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~213.628
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

          <div className="h-4 w-px bg-[#D6E4FF] dark:bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm clash-title font-[500] tracking-tight">
              Çok Katmanlı AI Portföy Modeli & Simülasyonu
            </span>
          </div>
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

        {/* BAŞLIK & KİŞİSELLEŞTİRME VURGUSU */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#D6E4FF]/60 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA] animate-pulse" />
                <span>10 Aşamalı Faktör Algoritması Devrede</span>
              </span>
              <span className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                • {currentTelemetry.title}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
              {displayName} İçin Çok Katmanlı Portföy Modeli
            </h1>

            <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-1 max-w-4xl leading-relaxed">
              {currentTelemetry.tagline} BIST sektörlerinin ve TEFAS/BYF fonlarının reel <strong>Medyan Getiri</strong> verileriyle geçmişi incelenmiş ve geleceğe dönük bileşik getiri projeksiyonu çıkarılmıştır.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
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
          
          {/* SOL: Çok Katmanlı Donut Dağılım Kartı */}
          <div className="lg:col-span-6 bg-white dark:bg-[#040989]/40 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-sm border border-[#D6E4FF]/60 dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4FF]/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D6E4FF]/30 dark:bg-white/10 border border-[#D6E4FF]/60 dark:border-white/20 flex items-center justify-center text-[#040989] dark:text-[#F5F7FA] shrink-0">
                  <PieChart className="w-3.5 h-3.5 text-[#004BFA]" />
                </div>
                <h3 className="text-xs sm:text-[13px] clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
                  Çok Katmanlı Hedef Varlık Dağılımı
                </h3>
              </div>

              {/* 3 Ana Varlık Sınıfı Özeti */}
              <div className="flex items-center gap-2 text-[10px] clash-subtitle font-[325]">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Hisse: %{currentTelemetry.macroWeights.stock}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Fon: %{currentTelemetry.macroWeights.fund}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Altın: %{currentTelemetry.macroWeights.goldAndCash}
                </span>
              </div>
            </div>

            {/* Donut Grafik ve Liste */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 my-auto py-4">
              {/* Donut SVG */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 flex items-center justify-center">
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
                        strokeWidth={isHovered ? 12 : 9}
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
                    Tam Sepet
                  </span>
                  <span className="text-sm sm:text-base font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
                    %100
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
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-mono">
                          {item.group === 'BIST_HISSE' ? 'Hisse' : item.group === 'BYF_FON' ? 'Fon' : 'Emtia'}
                        </span>
                        <span className="text-xs font-numbers font-medium text-[#040989] dark:text-[#F5F7FA] tabular-nums">
                          %{item.percentage}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#D6E4FF]/50 dark:border-white/10 flex items-center justify-between text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
              <span>Hisse (%{currentTelemetry.macroWeights.stock}) + Fon (%{currentTelemetry.macroWeights.fund}) + Altın (%{currentTelemetry.macroWeights.goldAndCash})</span>
              <button
                onClick={() => {
                  setQuizStep(0);
                  setIsQuizModalOpen(true);
                }}
                className="text-[#004BFA] dark:text-[#5B80FF] clash-subtitle font-[325] hover:underline flex items-center gap-1"
              >
                <span>Yeniden Kalibre Et</span>
                <ChevronRight className="w-3 h-3" />
              </button>
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
        {/* BÖLÜM 2: GELECEK KAZANÇ & BİLEŞİK GETİRİ SİMÜLATÖRÜ (10. Soru Entegrasyonu) */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6E4FF]/50 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#004BFA] text-white flex items-center justify-center shadow-xs">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                  Gelecek Kazanç & Bileşik Getiri Simülatörü
                </h3>
              </div>
              <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-1">
                10. soruda belirlediğiniz <strong>{currentTelemetry.projection.monthlyContribution.toLocaleString('tr-TR')} ₺ / Ay</strong> düzenli tasarruf planınıza göre bileşik getiri projeksiyonu
              </p>
            </div>

            {/* 3 Senaryo Seçici */}
            <div className="flex items-center bg-[#F5F7FA] dark:bg-white/5 p-1 rounded-xl border border-[#D6E4FF]/60 dark:border-white/10 self-start sm:self-auto">
              <button
                onClick={() => setActiveScenario('median')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeScenario === 'median'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                Reel Medyan (%46.5)
              </button>
              <button
                onClick={() => setActiveScenario('average')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeScenario === 'average'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                İyimser Boğa (%65.0)
              </button>
              <button
                onClick={() => setActiveScenario('conservative')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeScenario === 'conservative'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                Korumacı Taban (%38.0)
              </button>
            </div>
          </div>

          {/* 3 Projeksiyon Kartı: 1 Yıl, 3 Yıl, 5 Yıl */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1 Yıl */}
            <div className="bg-gradient-to-br from-blue-50/70 via-white to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent border border-[#004BFA]/20 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs clash-subtitle font-[325] text-[#004BFA] dark:text-[#5B80FF] uppercase tracking-wider">
                  1 Yıl Sonunda (12 Ay)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-white/10 text-blue-700 dark:text-blue-300 font-mono">
                  12 Taksit
                </span>
              </div>

              <div>
                <span className="text-xs clash-desc font-[225] text-slate-500">Tahmini Toplam Portföy:</span>
                <div className="text-2xl font-numbers font-bold text-[#040989] dark:text-[#F5F7FA] mt-0.5">
                  {activeProjectionScenario.year1.total.toLocaleString('tr-TR')} ₺
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="clash-desc font-[225] text-slate-500">Cebinizden Çıkan Anapara:</span>
                  <span className="font-numbers font-medium text-slate-700 dark:text-slate-200">
                    {activeProjectionScenario.year1.principal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="clash-desc font-[225]">Bileşik Kazanç (Kâr):</span>
                  <span className="font-numbers">
                    +{activeProjectionScenario.year1.profit.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Yıl */}
            <div className="bg-gradient-to-br from-indigo-50/70 via-white to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent border border-indigo-500/25 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs clash-subtitle font-[325] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  3 Yıl Sonunda (36 Ay)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-white/10 text-indigo-700 dark:text-indigo-300 font-mono">
                  36 Taksit
                </span>
              </div>

              <div>
                <span className="text-xs clash-desc font-[225] text-slate-500">Tahmini Toplam Portföy:</span>
                <div className="text-2xl font-numbers font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {activeProjectionScenario.year3.total.toLocaleString('tr-TR')} ₺
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="clash-desc font-[225] text-slate-500">Cebinizden Çıkan Anapara:</span>
                  <span className="font-numbers font-medium text-slate-700 dark:text-slate-200">
                    {activeProjectionScenario.year3.principal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="clash-desc font-[225]">Bileşik Kazanç (Kâr):</span>
                  <span className="font-numbers">
                    +{activeProjectionScenario.year3.profit.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Yıl */}
            <div className="bg-gradient-to-br from-emerald-50/70 via-white to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent border border-emerald-500/25 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs clash-subtitle font-[325] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  5 Yıl Sonunda (60 Ay)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-white/10 text-emerald-700 dark:text-emerald-300 font-mono">
                  Bileşik Güç
                </span>
              </div>

              <div>
                <span className="text-xs clash-desc font-[225] text-slate-500">Tahmini Toplam Portföy:</span>
                <div className="text-2xl font-numbers font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeProjectionScenario.year5.total.toLocaleString('tr-TR')} ₺
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="clash-desc font-[225] text-slate-500">Cebinizden Çıkan Anapara:</span>
                  <span className="font-numbers font-medium text-slate-700 dark:text-slate-200">
                    {activeProjectionScenario.year5.principal.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="clash-desc font-[225]">Bileşik Kazanç (Kâr):</span>
                  <span className="font-numbers">
                    +{activeProjectionScenario.year5.profit.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs clash-desc font-[225] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#004BFA] shrink-0" />
              <span>
                Simülasyon, portföyünüzdeki BIST hisselerinin ve BYF fonlarının reel <strong>Medyan Getiri</strong> eğrileri ve bileşik getiri faiziyle (FV = PMT × [((1+r)^n - 1) / r]) hesaplanmıştır.
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 3: SEKTÖREL VE FON GETİRİ MATRİSİ (Reel Veriler: 1A, 3A, 6A, 1Y, 5Y) */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA]">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                  Reel Sektör & Fon Getiri Matrisi (Medyan Analizleri)
                </h3>
              </div>
              <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 mt-0.5">
                Varlık sayfasındaki 625 BIST hissesinin ve 38 Borsa Yatırım Fonunun dönemlik reel performansları
              </p>
            </div>

            {/* Tab Değiştirici: BIST Sektörleri vs BYF Fonları */}
            <div className="flex items-center bg-[#F5F7FA] dark:bg-white/5 p-1 rounded-xl border border-[#D6E4FF]/60 dark:border-white/10">
              <button
                onClick={() => setActiveMatrixTab('sectors')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeMatrixTab === 'sectors'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                BIST Sektörleri (625 Hisse)
              </button>
              <button
                onClick={() => setActiveMatrixTab('funds')}
                className={`px-3 py-1.5 rounded-lg text-xs clash-subtitle font-[325] transition-all ${
                  activeMatrixTab === 'funds'
                    ? 'bg-[#004BFA] text-white shadow-xs'
                    : 'text-[#040989]/70 dark:text-[#F5F7FA]/70 hover:text-[#004BFA]'
                }`}
              >
                BYF Fon Türleri (38 Fon)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                  <th className="py-2.5 px-3">{activeMatrixTab === 'sectors' ? 'BIST Sektörü' : 'Fon Türü / Kodu'}</th>
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
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-white/10 text-[#004BFA] dark:text-[#93C5FD] font-mono font-bold text-[11px]">
                            {f.code}
                          </span>
                          <span className="font-medium text-[#040989] dark:text-[#F5F7FA] truncate max-w-xs">
                            {f.name}
                          </span>
                        </div>
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

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 4: DETAYLI DAĞILIM VE TEMSİLİ ENSTRÜMAN TABLOSU */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                Hedef Varlık Grupları ve Temsili Örnekler
              </h3>
              <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                Portföyünüzdeki her varlık grubunun stratejik ağırlığı ve hedef fonksiyonu
              </p>
            </div>
            <span className="text-xs clash-subtitle font-[325] px-2.5 py-1 rounded-lg bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA]">
              {distributionItems.length} Dilim
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Varlık Sınıfı</th>
                  <th className="py-2.5 px-3">Hedef Ağırlık</th>
                  <th className="py-2.5 px-3">Temsili Örnekler</th>
                  <th className="py-2.5 px-3">Stratejik Fonksiyonu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                {distributionItems.map((item, idx) => {
                  const matchingInstruments = currentTelemetry.instruments?.filter(
                    inst => (inst.category as string) === (item.category as string) || inst.name.includes(item.shortName) || item.name.includes(inst.symbol)
                  );

                  return (
                    <tr key={idx} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
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

                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {matchingInstruments && matchingInstruments.length > 0 ? (
                            matchingInstruments.map((m, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded-md bg-[#F5F7FA] dark:bg-white/10 border border-[#D6E4FF]/60 dark:border-white/20 text-[10px] clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA]"
                              >
                                {m.symbol}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">Piyasa Sektör Hisseleri / Fonları</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-[#040989]/80 dark:text-[#F5F7FA]/80 clash-desc font-[225]">
                        {item.name.includes("Altın") 
                          ? "Enflasyon ve kur şoklarına karşı güvenli liman koruması"
                          : item.name.includes("Likit") || item.name.includes("TLREF")
                          ? "Yıllık %45+ risksiz kupon getirisi ve fırsat alımı likidite tamponu"
                          : item.name.includes("Teknoloji")
                          ? "Yüksek çarpanlı büyüme ve teknolojik katma değer"
                          : item.name.includes("Temettü")
                          ? "Düzenli kâr payı nakit akışı ve köklü şirket ortaklığı"
                          : "Piyasa liderliği ve sürdürülebilir sermaye kazancı"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ----------------------------------------------------------------------------------- */}
      {/* İNTERAKTİF 10 SORULUK KALİBRASYON TESTİ MODALI (WIZARD OVERLAY) */}
      {/* ----------------------------------------------------------------------------------- */}
      <AnimatePresence>
        {isQuizModalOpen && currentModalQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-[#02041A] rounded-3xl border border-[#D6E4FF] dark:border-white/15 shadow-2xl overflow-hidden flex flex-col font-clash"
            >
              {/* Modal Üst Bar */}
              <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                      FinAi 10 Aşamalı Portföy Kalibrasyonu
                    </h3>
                    <span className="text-[10px] clash-desc font-[225] text-slate-400">
                      Adım {quizStep + 1} / {WIZARD_QUESTIONS.length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* İlerleme Çizgisi */}
              <div className="w-full h-1 bg-slate-100 dark:bg-white/5">
                <div
                  className="h-full bg-[#004BFA] transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / WIZARD_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Soru İçeriği */}
              <div className="p-5 sm:p-7 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1">
                  <span className="text-[10px] clash-subtitle font-[325] text-[#004BFA] dark:text-[#5B80FF] uppercase tracking-wider block">
                    {currentModalQuestion.category}
                  </span>
                  <h4 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-snug">
                    {currentModalQuestion.title}
                  </h4>
                  <p className="text-xs clash-desc font-[225] text-slate-500 dark:text-slate-400">
                    {currentModalQuestion.contextExplanation}
                  </p>
                </div>

                {/* Soru 10 İçin Özel Açık Uçlu Sayısal Giriş Alanı */}
                {currentModalQuestion.isCustomInputAllowed && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-white/5 border border-blue-200/80 dark:border-white/10 space-y-2">
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
                      * Aşağıdaki hazır paketlerden birini seçebilir veya buraya doğrudan kendi bütçenizi yazabilirsiniz.
                    </span>
                  </div>
                )}

                {/* Seçenek Kartları */}
                <div className="space-y-2.5">
                  {currentModalQuestion.options.map((option) => {
                    const isSelected = answers[currentModalQuestion.id] === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => {
                          handleOptionSelect(currentModalQuestion.id, option.id);
                          if (option.id === 'budget_10k_monthly') setCustomAmountInput("10000");
                          else if (option.id === 'budget_25k_monthly') setCustomAmountInput("25000");
                          else if (option.id === 'budget_50k_monthly') setCustomAmountInput("50000");
                        }}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                          isSelected
                            ? "bg-[#004BFA]/5 dark:bg-[#004BFA]/20 border-[#004BFA] ring-1 ring-[#004BFA]/40 shadow-xs"
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

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "border-[#004BFA] bg-[#004BFA] text-white"
                            : "border-slate-300 dark:border-white/20"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Alt Bar: Geri, İleri / Tamamla */}
              <div className="px-5 sm:px-7 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <button
                  disabled={quizStep === 0}
                  onClick={() => setQuizStep(prev => Math.max(0, prev - 1))}
                  className={`px-4 py-2 rounded-xl text-xs clash-subtitle font-[325] transition-colors ${
                    quizStep === 0
                      ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/10"
                  }`}
                >
                  Geri
                </button>

                <div className="flex items-center gap-2">
                  {quizStep < WIZARD_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setQuizStep(prev => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>İleri ({quizStep + 1}/10)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveAndApply}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#004BFA] to-blue-600 hover:opacity-90 text-white font-normal text-xs clash-subtitle font-[325] shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
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
