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

const TOP_SECTOR_ASSETS: Record<string, { symbol: string; name: string; tag: string }[]> = {
  "Sanayi & Savunma Hisseleri": [
    { symbol: "ASELS", name: "Aselsan Elektronik", tag: "Savunma" },
    { symbol: "FROTO", name: "Ford Otosan", tag: "Otomotiv" },
    { symbol: "TUPRS", name: "Tüpraş Rafineri", tag: "Petrol" },
    { symbol: "KCHOL", name: "Koç Holding", tag: "Holding" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", tag: "Çelik" }
  ],
  "İhracatçı Sanayi Liderleri": [
    { symbol: "FROTO", name: "Ford Otosan", tag: "Otomotiv" },
    { symbol: "TOASO", name: "Tofaş Oto", tag: "Otomotiv" },
    { symbol: "SISE", name: "Şişecam", tag: "Sanayi" },
    { symbol: "ARCLK", name: "Arçelik", tag: "Tüketim" },
    { symbol: "VESTL", name: "Vestel Elektronik", tag: "Elektronik" }
  ],
  "Teknoloji & Bilişim Hisseleri": [
    { symbol: "MIATK", name: "Mia Teknoloji", tag: "Yazılım" },
    { symbol: "LOGO", name: "Logo Yazılım", tag: "Kurumsal" },
    { symbol: "VBTYZ", name: "VBT Yazılım", tag: "Sistem" },
    { symbol: "REEDR", name: "Reeder Teknoloji", tag: "Donanım" },
    { symbol: "ARDYZ", name: "Ard Bilişim", tag: "Bilişim" }
  ],
  "Ulaştırma & Havacılık Hisseleri": [
    { symbol: "THYAO", name: "Türk Hava Yolları", tag: "Havacılık" },
    { symbol: "PGSUS", name: "Pegasus", tag: "Havacılık" },
    { symbol: "TAVHL", name: "TAV Havalimanları", tag: "Havalimanı" },
    { symbol: "CLEBI", name: "Çelebi Hava Servisi", tag: "Yer Hizmetleri" },
    { symbol: "RYSAS", name: "Reysaş Lojistik", tag: "Taşımacılık" }
  ],
  "Defansif Tüketim & Perakende Hisseleri": [
    { symbol: "BIMAS", name: "BİM Mağazalar", tag: "Gıda" },
    { symbol: "MGROS", name: "Migros Ticaret", tag: "Perakende" },
    { symbol: "SOKM", name: "Şok Marketler", tag: "Perakende" },
    { symbol: "CCOLA", name: "Coca-Cola İçecek", tag: "İçecek" },
    { symbol: "ULKER", name: "Ülker Bisküvi", tag: "Gıda" }
  ],
  "Temettü & Nakit Akışı Hisseleri": [
    { symbol: "TUPRS", name: "Tüpraş", tag: "Temettü" },
    { symbol: "FROTO", name: "Ford Otosan", tag: "Kâr Payı" },
    { symbol: "TTRAK", name: "Türk Traktör", tag: "Temettü" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", tag: "Kâr Payı" },
    { symbol: "BIMAS", name: "BİM Mağazalar", tag: "Defansif" }
  ],
  "Finans & Holding Hisseleri": [
    { symbol: "AKBNK", name: "Akbank", tag: "Banka" },
    { symbol: "ISCTR", name: "İş Bankası", tag: "Banka" },
    { symbol: "GARAN", name: "Garanti BBVA", tag: "Banka" },
    { symbol: "KCHOL", name: "Koç Holding", tag: "Holding" },
    { symbol: "SAHOL", name: "Sabancı Holding", tag: "Holding" }
  ],
  "Teknoloji ve İletişim Fonları": [
    { symbol: "TTE", name: "İş Portföy BIST Teknoloji", tag: "Teknoloji" },
    { symbol: "YAY", name: "Yapı Kredi Teknoloji", tag: "Yazılım" },
    { symbol: "TE3", name: "TEB Portföy BIST Teknoloji", tag: "Teknoloji" },
    { symbol: "ZTM", name: "Ziraat BIST 30", tag: "Endeks" },
    { symbol: "IKT", name: "İstanbul Portföy Bilişim", tag: "Bilişim" }
  ],
  "Para Piyasası Fonları": [
    { symbol: "ZTK", name: "Ziraat Katılım TLREF", tag: "Katılım Likit" },
    { symbol: "PPF", name: "Para Piyasası Fonu", tag: "Likit Faizsiz" },
    { symbol: "KRS", name: "Kuveyt Türk Kısa Vadeli", tag: "Kira Sertifikası" },
    { symbol: "TLY", name: "TLREF Para Piyasası Fonu", tag: "Gecelik" },
    { symbol: "ZTM", name: "Ziraat Likit Fon", tag: "Para Piyasası" }
  ],
  "Temiz Enerji Fonları": [
    { symbol: "AEY", name: "Ak Portföy Yenilenebilir Enerji", tag: "Temiz Enerji" },
    { symbol: "IEY", name: "İş Portföy Yenilenebilir Enerji", tag: "Yeşil Enerji" },
    { symbol: "ZRE", name: "Ziraat Sınai & Enerji", tag: "Enerji" },
    { symbol: "BIO", name: "Biotrend Enerji Fonu", tag: "Biyoenerji" },
    { symbol: "GNR", name: "Garanti Portföy Temiz Enerji", tag: "Güneş/Rüzgar" }
  ],
  "Kıymetli Madenler": [
    { symbol: "GLDTR", name: "QNB Portföy Altın BYF", tag: "Fiziki Altın" },
    { symbol: "ALTIN.S1", name: "Darphane Altın Sertifikası", tag: "Borsa Altın" },
    { symbol: "GMSTR", name: "QNB Portföy Gümüş BYF", tag: "Fiziki Gümüş" },
    { symbol: "USDTR", name: "QNB Portföy Dolar BYF", tag: "Döviz Kalkanı" },
    { symbol: "ZGD", name: "Ziraat Katılım Altın", tag: "Katılım Altın" }
  ],
  "Kıymetli Maden ve Nakit Kalkanı": [
    { symbol: "GLDTR", name: "QNB Portföy Altın BYF", tag: "Fiziki Altın" },
    { symbol: "ALTIN.S1", name: "Darphane Altın Sertifikası", tag: "Borsa Altın" },
    { symbol: "ZTK", name: "Ziraat Katılım TLREF", tag: "Para Piyasası" },
    { symbol: "USDTR", name: "QNB Portföy Dolar BYF", tag: "Döviz Kalkanı" },
    { symbol: "GMSTR", name: "QNB Portföy Gümüş BYF", tag: "Fiziki Gümüş" }
  ]
};

function getTargetSectorParam(sliceName: string): string {
  if (sliceName.includes("Savunma") || sliceName.includes("Sanayi")) return "Savunma Sanayii";
  if (sliceName.includes("Teknoloji") || sliceName.includes("Bilişim")) return "Teknoloji & Yazılım";
  if (sliceName.includes("Ulaştırma") || sliceName.includes("Havacılık")) return "Ulaştırma & Havacılık";
  if (sliceName.includes("Perakende") || sliceName.includes("Gıda") || sliceName.includes("Tüketim")) return "Perakende & Tüketim";
  if (sliceName.includes("Enerji")) return "Enerji & Elektrik";
  if (sliceName.includes("Banka") || sliceName.includes("Finans")) return "Bankacılık";
  return "BIST";
}

function getTopAssetsForSlice(sliceName: string) {
  if (TOP_SECTOR_ASSETS[sliceName]) {
    return TOP_SECTOR_ASSETS[sliceName];
  }
  for (const key of Object.keys(TOP_SECTOR_ASSETS)) {
    if (sliceName.includes(key) || key.includes(sliceName)) {
      return TOP_SECTOR_ASSETS[key];
    }
  }
  return TOP_SECTOR_ASSETS["Sanayi & Savunma Hisseleri"];
}

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
  const [hoveredSliceForPopup, setHoveredSliceForPopup] = useState<{ name: string; percentage: number; color: string } | null>(null);
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
      investment_budget_plan: saved.investment_budget_plan || "freq_monthly"
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

  const displayName = userName || (email ? email.split("@")[0] : "Salih KAVAKCI");

  // Dinamik Strateji Telemetrisi (Anlık 10 soruya ve kullanıcı adına göre hesaplanır)
  const currentTelemetry = useMemo(() => {
    return calculateDynamicStrategy(answers, displayName);
  }, [answers, displayName]);

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
              <div 
                className="flex-1 w-full min-w-0 space-y-2 relative"
                onMouseLeave={() => setHoveredSliceForPopup(null)}
              >
                {distributionItems.map((item) => {
                  const isHovered = hoveredSymbol === item.name || hoveredSliceForPopup?.name === item.name;
                  const targetSector = getTargetSectorParam(item.name);
                  return (
                    <Link
                      key={item.name}
                      href={`/dashboard/data?sector=${encodeURIComponent(targetSector)}`}
                      onMouseEnter={() => {
                        setHoveredSymbol(item.name);
                        setHoveredSliceForPopup(item);
                      }}
                      className={`flex items-center justify-between gap-2 p-2 rounded-xl transition-all cursor-pointer group ${
                        isHovered ? "bg-[#D6E4FF]/40 dark:bg-white/10 ring-1 ring-[#004BFA]/30" : "hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }} />
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
                        <ChevronRight className="w-3 h-3 text-[#004BFA]/50 group-hover:translate-x-0.5 transition-transform opacity-0 group-hover:opacity-100" />
                      </div>
                    </Link>
                  );
                })}

                {/* MOUSE İLE ÜZERİNE GELİNDİĞİNDE EN POPÜLER 5 HİSSEYİ GÖSTEREN KUTUCUK */}
                {hoveredSliceForPopup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="absolute left-0 right-0 sm:left-auto sm:right-0 top-0 sm:-top-2 z-40 w-full sm:w-72 bg-white/95 dark:bg-[#02041A]/95 backdrop-blur-md border border-[#004BFA]/30 rounded-2xl p-3.5 shadow-2xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/60 dark:border-white/10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: hoveredSliceForPopup.color }} />
                        <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] truncate">
                          {hoveredSliceForPopup.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-numbers font-semibold text-[#004BFA] dark:text-[#5B80FF] shrink-0">
                        %{hoveredSliceForPopup.percentage}
                      </span>
                    </div>

                    <div className="text-[10px] clash-subtitle font-[325] text-slate-400 uppercase tracking-wider">
                      En Popüler 5 Varlık & Örnekler
                    </div>

                    <div className="space-y-1.5">
                      {getTopAssetsForSlice(hoveredSliceForPopup.name).map((stock, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-[#D6E4FF]/30 dark:hover:bg-white/10 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-numbers font-bold text-[#004BFA] dark:text-[#5B80FF]">
                              {stock.symbol}
                            </span>
                            <span className="text-[11px] clash-desc font-[225] text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                              {stock.name}
                            </span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-500 font-mono">
                            {stock.tag}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/dashboard/data?sector=${encodeURIComponent(getTargetSectorParam(hoveredSliceForPopup.name))}`}
                      className="w-full py-2 px-3 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white text-xs clash-subtitle font-[325] flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 mt-1"
                    >
                      <span>Varlık Sayfasında Tümünü İncele</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* SAĞ: FinAi 10-Aşamalı Strateji Rasyoneli (Bento Kartlar Kaldırıldı, Rasyonel Yukarı Taşındı) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white rounded-2xl min-[360px]:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between space-y-4">
              <div className="relative z-10 space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D6E4FF]" />
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-white">
                      FinAi 10-Aşamalı Strateji Rasyoneli
                    </h3>
                  </div>

                  <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-white/10 text-[#D6E4FF] border border-white/10">
                    Kişiye Özel Terzilik
                  </span>
                </div>

                {/* 1. KULLANICIYA KENDİSİNİ ANLATAN YATIRIMCI KİMLİĞİ */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs clash-subtitle font-[325] text-[#D6E4FF]">
                    <Compass className="w-3.5 h-3.5 text-[#5B80FF]" />
                    <span>Yatırımcı Portreniz & Davranış Aynanız</span>
                  </div>
                  <p className="text-xs clash-desc font-[225] text-white/90 leading-relaxed">
                    {currentTelemetry.investorPersona}
                  </p>
                </div>

                {/* 2. NEDEN BU DAĞILIM? (SEPET MÜHENDİSLİĞİ) */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs clash-subtitle font-[325] text-[#D6E4FF]">
                    <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Neden Bu Dağılım? (%{currentTelemetry.macroWeights.stock} Hisse / %{currentTelemetry.macroWeights.fund} Fon / %{currentTelemetry.macroWeights.goldAndCash} Kalkan)</span>
                  </div>
                  <p className="text-xs clash-desc font-[225] text-white/90 leading-relaxed">
                    {currentTelemetry.allocationRationale}
                  </p>
                </div>

                {/* 3. FİNAİ STRATEJİK YOL HARİTASI */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs clash-subtitle font-[325] text-[#D6E4FF]">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>FinAi Stratejik Yol Haritanız (2 Altın Kural)</span>
                  </div>
                  <div className="space-y-1.5">
                    {currentTelemetry.strategicRoadmap.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-[11px] clash-desc font-[225] text-[#D6E4FF]/90 leading-snug">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white font-numbers font-medium text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between relative z-10">
                <span className="text-[11px] clash-desc font-[225] text-[#D6E4FF]/80">
                  Modeli doğrudan portföyünüze uygulayın
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setQuizStep(0);
                      setIsQuizModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D6E4FF] font-normal text-xs clash-subtitle font-[325] flex items-center gap-1 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Testi Düzenle</span>
                  </button>

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

        </div>

        {/* ----------------------------------------------------------------------------------- */}
        {/* BÖLÜM 2: GELECEK KAZANÇ & BİLEŞİK GETİRİ SİMÜLATÖRÜ (YUKARIDAN AŞAĞIYA - KUTUSUZ) */}
        {/* ----------------------------------------------------------------------------------- */}
        <div className="space-y-3 py-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#D6E4FF]/40 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-tight">
                  Gelecek Kazanç & Bileşik Getiri Simülatörü
                </h3>
                <span className="text-[11px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                  {currentTelemetry.projection.frequency} • {Number(answers["custom_amount_input"] || customAmountInput || '10000').toLocaleString('tr-TR')} ₺ Tasarruf Planı (DCA)
                </span>
              </div>
            </div>
          </div>

          {/* Yukarıdan Aşağıya Vade Akışı (Kutusuz, Sade Sayılar ve Metinler) */}
          <div className="divide-y divide-[#D6E4FF]/40 dark:divide-white/10">
            {[
              { title: "1 Ay Sonunda", data: activeProjectionScenario.month1, horizon: "Kısa Vade" },
              { title: "3 Ay Sonunda", data: activeProjectionScenario.month3, horizon: "Çeyreklik Dönem" },
              { title: "6 Ay Sonunda", data: activeProjectionScenario.month6, horizon: "Yarım Yıllık Vade" },
              { title: "1 Yıl Sonunda", data: activeProjectionScenario.year1, horizon: "Yıllık Hedef Vadesi" },
              { title: "3 Yıl Sonunda", data: activeProjectionScenario.year3, horizon: "Bileşik Büyüme Eşiği" },
              { title: "5 Yıl Sonunda", data: activeProjectionScenario.year5, horizon: "Maksimum Bileşik Servet" },
            ].map((row, idx) => {
              const profitPct = row.data.principal > 0 ? ((row.data.profit / row.data.principal) * 100).toFixed(1) : "0.0";
              const isLongTerm = idx >= 3;
              return (
                <div 
                  key={idx} 
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#D6E4FF]/10 dark:hover:bg-white/5 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div className={`w-2 h-2 rounded-full ${isLongTerm ? 'bg-emerald-500' : 'bg-[#004BFA]'}`} />
                    <div>
                      <span className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                        {row.title}
                      </span>
                      <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 block">
                        {row.horizon}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-14 w-full sm:w-auto">
                    <div>
                      <span className="text-[10px] clash-desc text-slate-400 dark:text-slate-500 block">Tahmini Toplam:</span>
                      <span className="text-sm sm:text-base font-numbers font-bold text-[#040989] dark:text-[#F5F7FA]">
                        {row.data.total.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] clash-desc text-slate-400 dark:text-slate-500 block">Cebinizden Çıkan Anapara:</span>
                      <span className="text-xs sm:text-sm font-numbers text-slate-600 dark:text-slate-300">
                        {row.data.principal.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>

                    <div className="text-right min-w-[130px]">
                      <span className="text-[10px] clash-desc text-slate-400 dark:text-slate-500 block">Bileşik Kazanç (Net Kâr):</span>
                      <span className="text-xs sm:text-sm font-numbers font-semibold text-emerald-600 dark:text-emerald-400">
                        +{row.data.profit.toLocaleString('tr-TR')} ₺
                        <span className="text-[10px] font-normal ml-1">({Number(profitPct) > 0 ? `+${profitPct}%` : '%0'})</span>
                      </span>
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

            {/* 2. HAREKETLİ BEYAZ VE LACİVERT KALİBRASYON KARTI (YAYLANMALI MERKEZE UÇUŞ) */}
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
              className="relative z-10 w-full max-w-5xl xl:max-w-6xl max-h-[92vh] bg-white dark:bg-[#02041A] rounded-3xl border border-white/20 dark:border-white/15 shadow-2xl overflow-hidden flex flex-col lg:flex-row font-clash ring-1 ring-white/10 my-auto"
            >
              {/* SOL TARAF (%64): ÜST BAR (LOGO+BAŞLIK+HAPLAR), SORULAR/SEÇENEKLER VE GERİ BUTONU */}
              <div className="w-full lg:w-[64%] flex flex-col justify-between bg-white dark:bg-[#02041A] overflow-hidden min-h-0">
                {/* Sol Üst Bar */}
                <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <img src="/icon.png" alt="FinAi" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                      FinAi Workspace Kişiye Özel Model Portföy
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 10 Step Pills */}
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
                                ? "w-6 sm:w-8 bg-[#004BFA]"
                                : isDone
                                ? "w-3 sm:w-4 bg-emerald-500"
                                : "w-2.5 sm:w-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20"
                            }`}
                            title={`Adım ${idx + 1}: ${q.category}`}
                          />
                        );
                      })}
                    </div>

                    {/* Mobilde Kapat Butonu */}
                    <button
                      type="button"
                      onClick={() => setIsQuizModalOpen(false)}
                      className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer ml-auto"
                      title="Kapat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* İlerleme Çizgisi */}
                <div className="w-full h-1 bg-slate-100 dark:bg-white/5 shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#004BFA] to-blue-500 transition-all duration-300"
                    style={{ width: `${((quizStep + 1) / WIZARD_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Soru & Seçenek Kartları (Kaydırılabilir Alan) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4 min-h-0">
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
                        <h4 className="text-base sm:text-xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-snug pt-1">
                          {currentModalQuestion.title}
                        </h4>
                      </div>

                      {/* Soru 10 İçin Özel Açık Uçlu Sayısal Giriş Alanı (Elegant FinAi Kartı) */}
                      {currentModalQuestion.isCustomInputAllowed && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#02041A] via-[#040989]/50 to-[#02041A] border border-blue-500/25 shadow-xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs clash-subtitle font-[400] text-blue-200 tracking-wide">
                              Yatırım Bütçesi
                            </label>
                            <span className="text-[10px] text-blue-300 font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20">
                              Simülasyon Tutarı
                            </span>
                          </div>
                          <div className="relative flex items-center">
                            <span className="absolute left-4 text-base font-bold text-[#5B80FF]">₺</span>
                            <input
                              type="number"
                              min="500"
                              step="500"
                              placeholder="10000"
                              value={customAmountInput}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomAmountInput(val);
                                handleOptionSelect('custom_amount_input', val);
                              }}
                              className="w-full pl-9 pr-14 py-3 rounded-xl bg-white/[0.07] border border-white/15 text-lg font-numbers font-medium text-white placeholder-white/30 focus:outline-hidden focus:border-[#5B80FF] focus:ring-2 focus:ring-[#5B80FF]/30 transition-all shadow-inner"
                            />
                            <span className="absolute right-4 text-xs font-medium text-slate-300 pointer-events-none">
                              TL
                            </span>
                          </div>
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
                                {option.description && (
                                  <p className="text-[11px] sm:text-xs clash-desc font-[225] text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {option.description}
                                  </p>
                                )}
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

                {/* Sol Alt Bar: Geri (ve mobilde İleri) */}
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

                  {/* Mobilde İleri Butonu */}
                  <div className="lg:hidden flex items-center">
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
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#004BFA] to-blue-600 hover:opacity-95 text-white font-medium text-xs sm:text-sm clash-subtitle shadow-lg shadow-[#004BFA]/30 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Kaydet ve Uygula</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SAĞ TARAF (%36): KESİNTİSİZ TAM BOY LACİVERT GRADYAN (ÜST VE ALT DAHİL) */}
              <div className="w-full lg:w-[36%] bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden text-white shrink-0">
                {/* Ambient Arka Plan Işık Küreleri */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#004BFA]/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#5B80FF]/25 rounded-full blur-3xl pointer-events-none" />

                {/* Sağ Üst Bar: Kapat (X) Butonu (Tamamen Lacivert Gradyan İçinde) */}
                <div className="hidden lg:flex items-center justify-end relative z-10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsQuizModalOpen(false)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
                    title="Kapat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sağ Orta: Dinamik Ağırlık Dağılımı (Dikey Olarak Mükemmel Ortalı) */}
                <div className="relative z-10 my-auto py-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">
                      Dinamik Ağırlık Dağılımı
                    </span>
                    <span className="text-[11px] font-numbers text-blue-300/80">
                      %100 Toplam
                    </span>
                  </div>

                  {/* Canlı Dağılım Çubukları */}
                  <div className="space-y-4">
                    {/* BIST Hisse Senedi */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">BIST Hisse Senedi</span>
                        <span className="font-numbers text-[#5B80FF] font-semibold text-sm">
                          %{currentTelemetry.macroWeights.stock}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#004BFA] to-[#5B80FF] transition-all duration-500 ease-out shadow-[0_0_12px_rgba(0,75,250,0.6)]"
                          style={{ width: `${currentTelemetry.macroWeights.stock}%` }}
                        />
                      </div>
                    </div>

                    {/* Sektör & Yatırım Fonları */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">Sektör & Yatırım Fonları</span>
                        <span className="font-numbers text-emerald-400 font-semibold text-sm">
                          %{currentTelemetry.macroWeights.fund}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                          style={{ width: `${currentTelemetry.macroWeights.fund}%` }}
                        />
                      </div>
                    </div>

                    {/* Kıymetli Maden & Likit Kalkan */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-200">Kıymetli Maden & Likit Kalkan</span>
                        <span className="font-numbers text-amber-400 font-semibold text-sm">
                          %{currentTelemetry.macroWeights.goldAndCash}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.6)]"
                          style={{ width: `${currentTelemetry.macroWeights.goldAndCash}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sağ Alt Bar: İleri / Uygula Butonu (Tamamen Lacivert Gradyan İçinde) */}
                <div className="hidden lg:flex items-center justify-end relative z-10 shrink-0">
                  {quizStep < WIZARD_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setQuizStep((prev) => prev + 1)}
                      className="w-full py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white font-medium text-xs sm:text-sm clash-subtitle shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>İleri ({quizStep + 1}/10)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveAndApply}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#004BFA] to-blue-600 hover:opacity-95 text-white font-medium text-xs sm:text-sm clash-subtitle shadow-lg shadow-[#004BFA]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
