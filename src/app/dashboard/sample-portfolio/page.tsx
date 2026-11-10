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
  UserCheck, 
  Check, 
  X, 
  Calendar, 
  Sliders, 
  Zap, 
  Compass, 
  ChevronRight, 
  Layers,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/components/providers/UserProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { 
  WIZARD_QUESTIONS, 
  calculateDynamicStrategy, 
  FinancialLiteracyLevel,
  STRATEGY_PROFILES 
} from "@/config/onboarding-questions";
import { useTheme } from "next-themes";

const DISTRIBUTION_COLORS_LIGHT = ["#040989", "#004BFA", "#5B80FF", "#02041A", "#8AA8FF"];
const DISTRIBUTION_COLORS_DARK = ["#5B80FF", "#004BFA", "#38BDF8", "#818CF8", "#A5B4FC"];

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

  // Mevcut kullanıcı yanıtları veya varsayılanlar
  const initialAnswers = useMemo(() => {
    const saved = userMetadata?.onboarding_answers || {};
    return {
      literacy_level: saved.literacy_level || financialLiteracyLevel || "intermediate",
      investment_horizon: saved.investment_horizon || "medium",
      volatility_reaction: saved.volatility_reaction || "balanced",
      strategic_goal: saved.strategic_goal || "dividend_yield",
      interest_sensitivity: saved.interest_sensitivity || "conventional"
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

  // Dinamik Strateji Telemetrisi (Anlık cevaplara göre hesaplanır)
  const currentTelemetry = useMemo(() => {
    return calculateDynamicStrategy(answers);
  }, [answers]);

  // Varlık Dağılım Grafiği (TopAssetDistributionCard) ile birebir aynı donut parametreleri
  const distributionItems = useMemo(() => {
    if (currentTelemetry.slices && currentTelemetry.slices.length > 0) {
      return currentTelemetry.slices.map((slice, idx) => ({
        name: slice.name,
        percentage: slice.value,
        color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length],
        category: slice.category
      }));
    }

    const fallbackKey = recommendedStrategy || financialLiteracyLevel || "intermediate";
    const profile = STRATEGY_PROFILES[fallbackKey] || STRATEGY_PROFILES.intermediate;
    return profile.distribution.map((item, idx) => ({
      name: item.name,
      percentage: item.percentage,
      color: DISTRIBUTION_COLORS[idx % DISTRIBUTION_COLORS.length],
      category: item.type
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
      const literacy = (answers["literacy_level"] as FinancialLiteracyLevel) || "intermediate";
      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: hasExistingInvestments ?? false,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });
      setIsQuizModalOpen(false);
      addToast("AI Portföy stratejiniz başarıyla güncellendi!", "success");
    } catch (e) {
      console.error("Strateji güncelleme hatası:", e);
      addToast("Strateji güncellenirken bir sorun oluştu.", "error");
    }
  };

  const currentModalQuestion = WIZARD_QUESTIONS[quizStep];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-16">
      
      {/* Sürekli AI Loop Ambient Işık Efektleri */}
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

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[35%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
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
              Kişiselleştirilmiş AI Portföy Modeli
            </span>
          </div>
        </div>

        {/* Sağ Butonlar: Testi Yeniden Yap + Varlık Ekle */}
        <div className="flex items-center gap-2">
          {/* YENİDEN YAPMA DÜĞMESİ */}
          <button
            onClick={() => {
              setQuizStep(0);
              setIsQuizModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#004BFA]/30 hover:border-[#004BFA] text-[#004BFA] dark:text-[#D6E4FF] font-normal text-xs clash-subtitle font-[325] shadow-2xs transition-all flex items-center gap-1.5 active:scale-95 group"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#D6E4FF] group-hover:rotate-180 transition-transform duration-500" />
            <span>Testi Yeniden Yap</span>
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

      {/* ANA GÖVDE (Edge-to-Edge Container) */}
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-6 md:px-8 xl:px-10 py-5 sm:py-6 space-y-5 sm:space-y-6 relative z-10">

        {/* KULLANICI WIZARD'DA "VARLIĞIM VAR" DEDİĞİ İÇİN SORULARI GEÇMİŞSE GÖSTERİLEN BİLGİLENDİRME BANNERI */}
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
                  Strateji Profiliniz Henüz Kalibre Edilmedi
                </h4>
                <p className="text-xs clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                  Onboarding adımında doğrudan varlık eklemeyi seçtiniz. Size en uygun ve hassas dağılım modelini üretmek için 1 dakikalık testi tamamlayabilirsiniz.
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
                <span>Yapay Zekâ Kalibrasyonu Tamamlandı</span>
              </span>
              <span className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                • {currentTelemetry.title}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
              {displayName} İçin Özel AI Portföy Dağılımı
            </h1>

            <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-1 max-w-3xl leading-relaxed">
              {currentTelemetry.tagline || "Wizard yanıtlarınız doğrultusunda risk toleransınız, getiri beklentiniz ve piyasa dinamikleri gözetilerek yalnızca sizin için algoritmik olarak oluşturulmuştur."}
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
              <span>Yanıtları Düzenle</span>
            </button>
          </div>
        </div>

        {/* 2 SÜTUNLU ANA BENTO DÜZENİ */}
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

              <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Optimize Edildi
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
              <span>Wizard tercihlerinize göre hesaplandı</span>
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

          {/* SAĞ: Model Özeti, AI Telemetrisi & Strateji Açıklaması */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            
            {/* 4 Bento Metrik Kartı */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Hedef Yıllık Getiri Bandı
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{currentTelemetry.expectedReturnRange || "%50 - %75"}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Enflasyon üstü reel büyüme
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Risk Profili & Toleransı
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-[#004BFA] dark:text-[#5B80FF] mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{currentTelemetry.expectedRisk || "Dengeli"}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Maks. Çekilme: {currentTelemetry.maxDrawdownTolerance || "-%18"}
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Volatilite Bandı
                </span>
                <div className="text-lg sm:text-xl font-numbers font-medium text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>{currentTelemetry.volatilityBand || "±%16"}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Sharpe Oranı: {currentTelemetry.sharpeRatioEst || "1.65"}
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl p-4 shadow-xs">
                <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Dengeleme Döngüsü
                </span>
                <div className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#004BFA]" />
                  <span className="truncate">{currentTelemetry.rebalanceCycle || "Aylık Gözden Geçirme"}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  AI Dinamik Takip
                </span>
              </div>
            </div>

            {/* AI Strateji Rasyoneli (Toplam Varlık Tarzı Lüks Koyu Kart) */}
            <div className="bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">
              {/* Subtle SVG Wave */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
                <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                    fill="none"
                    stroke="#5B80FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D6E4FF]" />
                    <h3 className="text-sm clash-title font-[500] text-white">
                      FinAi Strateji Rasyoneli
                    </h3>
                  </div>

                  <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-white/10 text-[#D6E4FF]">
                    Kişiye Özel
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                  {currentTelemetry.analystSummary || "Yatırım vadeniz ve risk profiliniz doğrultusunda sermayenizi enflasyon şoklarına karşı korurken seçilmiş hisse sektörleri ile pazar üstü büyüme sağlamak hedeflenmiştir."}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ Enflasyon Koruması
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ Likidite Esnekliği
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/90 text-[10px] clash-subtitle font-[325]">
                    ✦ BIST Alfa Büyümesi
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between relative z-10">
                <span className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/80">
                  Bu modeli uygulamak için varlıklarınızı kaydedin
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

        {/* DETAYLI DAĞILIM VE TEMSİLİ ENSTRÜMAN TABLOSU */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF]/60 dark:border-white/10 rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                Hedef Varlık Grupları ve Dağılım Detayı
              </h3>
              <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                Portföyünüzdeki her varlık grubunun stratejik ağırlığı ve hedef fonksiyonu
              </p>
            </div>
            <span className="text-xs clash-subtitle font-[325] px-2.5 py-1 rounded-lg bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA]">
              {distributionItems.length} Varlık Grubu
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
                    inst => (inst.category as string) === (item.category as string) || inst.name.includes(item.name) || item.name.includes(inst.name)
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
                            <span className="text-[10px] text-slate-400">Piyasa Enstrümanları</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-[#040989]/80 dark:text-[#F5F7FA]/80 clash-desc font-[225]">
                        {item.name.includes("Altın") 
                          ? "Enflasyon ve kur şoklarına karşı güvenli liman koruması"
                          : item.name.includes("Likit") || item.name.includes("Kira")
                          ? "Risksiz kupon getirisi ve fırsat alımı likidite tamponu"
                          : item.name.includes("Teknoloji")
                          ? "Yüksek çarpanlı büyüme ve teknolojik katma değer"
                          : "Piyasa getirisi ve düzenli temettü nakit akışı"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* İNTERAKTİF "TESTİ YENİDEN YAP" MODALI (WIZARD OVERLAY) */}
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
                      AI Portföy Kalibrasyon Testi
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

                {/* Seçenek Kartları */}
                <div className="space-y-2.5">
                  {currentModalQuestion.options.map((option) => {
                    const isSelected = answers[currentModalQuestion.id] === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleOptionSelect(currentModalQuestion.id, option.id)}
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
                      <span>İleri</span>
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
