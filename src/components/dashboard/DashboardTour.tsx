"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ArrowLeft, X } from "lucide-react";

// Dashboard Widgets
import { DashboardSummaryCards } from "@/components/DashboardSummaryCards";
import { TopAssetDistributionCard } from "@/components/dashboard/TopAssetDistributionCard";
import { FinAiYesterdayReportWidget } from "@/components/FinAiYesterdayReportWidget";
import { MarketOverviewWidget } from "@/components/dashboard/MarketOverviewWidget";
import { DailyAgendaWidget } from "@/components/dashboard/DailyAgendaWidget";
import { LatestNewsWidget } from "@/components/dashboard/LatestNewsWidget";
import { SamplePortfolioWidget } from "@/components/dashboard/SamplePortfolioWidget";
import { FinAiAkademiWidget } from "@/components/dashboard/FinAiAkademiWidget";

interface StepConfig {
  id:
    | "summary"
    | "allocation"
    | "monthly-report"
    | "market"
    | "agenda"
    | "news"
    | "sample-portfolio"
    | "academy";
  element: string;
  title: string;
  description: string;
}

interface DashboardTourProps {
  hasActiveAssets: boolean;
  news?: any[];
  className?: string;
}

const STORAGE_KEY = "finai_dashboard_tour_seen";

export function DashboardTour({ hasActiveAssets, news = [], className = "" }: DashboardTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [origin, setOrigin] = useState<{ deltaX: number; deltaY: number; scale: number }>({
    deltaX: 0,
    deltaY: 0,
    scale: 0.85,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal açıkken sayfa kaymasını kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Senaryo A (Portföyünde Varlık Olan Kullanıcı)
  const stepsWithAssets: StepConfig[] = useMemo(
    () => [
      {
        id: "summary",
        element: "#finai-widget-summary",
        title: "Portföyünün Finansal Nabzı",
        description:
          "Sahip olduğun tüm hisse senedi, fon ve nakit varlıklarının güncel toplam değerini tek bakışta buradan izleyebilirsin. Günlük kâr/zarar durumunu ve genel getiri oranını anlık olarak takip ederek portföyünün performansını ölçebilirsin. Detaylı varlık listene ve işlem geçmişine ulaşmak için kartlara tıklayabilirsin.",
      },
      {
        id: "allocation",
        element: "#finai-widget-allocation",
        title: "Risk ve Varlık Dağılımı",
        description:
          "Portföyünün hisse, yatırım fonu, emtia ve nakit arasındaki oransal ağırlığını gösterir. Finansal okuryazarlığın temel kuralı tüm birikimi tek bir enstrümana bağlamamaktır; buradaki dağılım grafiği risk dengeni anında kontrol etmeni sağlar. Bu widget'ın üzerine bastığın zaman ise seni doğrudan detaylı Portföy sayfana yönlendirir.",
      },
      {
        id: "monthly-report",
        element: "#finai-widget-monthly-report",
        title: "FinAi Aylık Portföy Raporu",
        description:
          "Bu alan, yapay zekanın portföyünü detaylı inceleyerek oluşturduğu aylık performans ve strateji analizidir. Bu rapor aylık olarak hazırlandığından dolayı, ilk kapsamlı analizini portföyünü oluşturduktan 1 ay sonra burada görebileceksin. Her ayın sonunda yatırımlarının genel seyrini ve derinlemesine içgörülerini buradan takip edebilirsin.",
      },
      {
        id: "market",
        element: "#finai-widget-market",
        title: "Piyasa Genel Görünümü & Canlı Grafikler",
        description:
          "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
      },
      {
        id: "agenda",
        element: "#finai-widget-agenda",
        title: "Günlük Ajanda & Kritik Gelişmeler",
        description:
          "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
      },
      {
        id: "news",
        element: "#finai-widget-news",
        title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
        description:
          "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
      },
    ],
    []
  );

  // Senaryo B (Henüz Varlık Eklememiş Kullanıcı)
  const stepsWithoutAssets: StepConfig[] = useMemo(
    () => [
      {
        id: "sample-portfolio",
        element: "#finai-widget-sample-portfolio",
        title: "Model Portföy Rehberi",
        description:
          "Henüz portföyüne varlık eklemediysen, FinAi uzmanları ve algoritmaları tarafından dengeli biçimde hazırlanmış BIST model portföyünü buradan inceleyebilirsin. Risk dağılımı yapılmış örnek bir hisse senedi sepetinin nasıl kurgulandığını görerek kendi portföyün için ilham alabilirsin.",
      },
      {
        id: "academy",
        element: "#finai-widget-academy",
        title: "Finansal Okuryazarlık & Akademi",
        description:
          "Bütçe yönetiminden hisse senedi ve şirket ortaklığına uzanan adım adım interaktif eğitim haritandır. Her hafta yeni bir modülü tamamlayarak finansal okuryazarlığını geliştirebilir ve tasarruflarını bilinçli yatırımlara dönüştürmeyi öğrenebilirsin.",
      },
      {
        id: "market",
        element: "#finai-widget-market",
        title: "Piyasa Genel Görünümü & Canlı Grafikler",
        description:
          "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
      },
      {
        id: "agenda",
        element: "#finai-widget-agenda",
        title: "Günlük Ajanda & Kritik Gelişmeler",
        description:
          "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
      },
      {
        id: "news",
        element: "#finai-widget-news",
        title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
        description:
          "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
      },
    ],
    []
  );

  // Aktif adımları belirle (DOM mevcudiyeti öncelikli)
  const steps = useMemo(() => {
    if (typeof document !== "undefined") {
      if (document.querySelector("#finai-widget-summary")) {
        return stepsWithAssets;
      }
      if (document.querySelector("#finai-widget-sample-portfolio")) {
        return stepsWithoutAssets;
      }
    }
    return hasActiveAssets ? stepsWithAssets : stepsWithoutAssets;
  }, [hasActiveAssets, stepsWithAssets, stepsWithoutAssets]);

  // Her widget'ın sayfadaki kendi gerçek konumunu hesapla (Ortaya sürüklenişin başlangıç noktası)
  const updateOriginForStep = useCallback((step: StepConfig) => {
    if (typeof window === "undefined") return;

    const el = document.querySelector(step.element);
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const isDesktop = winW >= 1024;

    if (!el) {
      setOrigin({ deltaX: -winW * 0.45, deltaY: 0, scale: 0.85 });
      return;
    }

    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;

    let targetWidth = 640;
    let widgetCenterX = winW / 2;
    let widgetCenterY = winH / 2;

    if (isDesktop) {
      const modalWidth = Math.min(1152, winW * 0.92);
      const modalLeft = (winW - modalWidth) / 2;
      targetWidth = modalWidth * 0.58;
      widgetCenterX = modalLeft + targetWidth / 2;
      widgetCenterY = winH / 2;
    } else {
      targetWidth = Math.min(winW - 48, 520);
      widgetCenterX = winW / 2;
      widgetCenterY = Math.max(160, winH * 0.32);
    }

    const deltaX = elCenterX - widgetCenterX;
    const deltaY = elCenterY - widgetCenterY;
    const scale = targetWidth > 0 ? Math.min(1, Math.max(0.4, rect.width / targetWidth)) : 0.85;

    setOrigin({ deltaX, deltaY, scale });
  }, []);

  // Adım değiştikçe hedef widget'ın başlangıç koordinatını güncelle
  useEffect(() => {
    if (!isOpen) return;
    const step = steps[currentStepIndex];
    if (step) {
      updateOriginForStep(step);
    }
  }, [isOpen, currentStepIndex, steps, updateOriginForStep]);

  // Klavye Kontrolleri
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setIsOpen(false);
  };

  const handleStart = () => {
    let activeSteps = steps;
    if (typeof document !== "undefined") {
      if (document.querySelector("#finai-widget-summary")) {
        activeSteps = stepsWithAssets;
      } else if (document.querySelector("#finai-widget-sample-portfolio")) {
        activeSteps = stepsWithoutAssets;
      }
    }
    const firstStep = activeSteps[0];
    if (firstStep) {
      updateOriginForStep(firstStep);
    }
    setCurrentStepIndex(0);
    setIsOpen(true);
  };

  const currentStep = steps[currentStepIndex];

  // Aktif Widget Bileşenini Render Et
  const renderActiveWidget = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case "summary":
        return (
          <div className="w-full">
            <DashboardSummaryCards />
          </div>
        );
      case "allocation":
        return (
          <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 min-h-[300px] flex items-center justify-center">
            <TopAssetDistributionCard />
          </div>
        );
      case "monthly-report":
        return (
          <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 max-h-[460px] overflow-y-auto">
            <FinAiYesterdayReportWidget />
          </div>
        );
      case "market":
        return (
          <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-[380px] sm:h-[420px]">
            <MarketOverviewWidget />
          </div>
        );
      case "agenda":
        return (
          <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 max-h-[440px] overflow-y-auto">
            <DailyAgendaWidget />
          </div>
        );
      case "news":
        return (
          <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 max-h-[440px] overflow-y-auto">
            <LatestNewsWidget news={news} />
          </div>
        );
      case "sample-portfolio":
        return (
          <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <SamplePortfolioWidget />
          </div>
        );
      case "academy":
        return (
          <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
            <FinAiAkademiWidget />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sayfa Başlığı Yanındaki Tetikleme Butonu */}
      <button
        id="finai-dashboard-tour-trigger"
        type="button"
        onClick={handleStart}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-200/80 dark:border-white/15 text-xs font-semibold text-[#040989] dark:text-white shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer ${className}`}
        title="Sayfa Rehberini Başlat"
      >
        <Compass className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#5B80FF]" />
        <span>Sayfa Rehberi</span>
      </button>

      {/* =========================================================================
          PORTAL: HER WIDGET'IN KENDİ YERİNDEN BAŞLAYIP ORTAYA DOĞRU SÜRÜKLENDİĞİ
          AKADEMİ 2. HAFTA YAYLANMALI MERKEZE UÇUŞ MİMARİSİ
          ========================================================================= */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && currentStep && (
              <div className="fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
                {/* 1. FinAi İmza Gradyanlı Arka Plan Katmanı (Akademi 2. Hafta ile Birebir) */}
                <motion.div
                  key="tour-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="fixed inset-0 bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] overflow-hidden cursor-pointer"
                  onClick={handleClose}
                >
                  {/* Ambient Background Gradient Circles */}
                  <div className="absolute -top-24 -right-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Subtle SVG Wave Background (Toplam Varlık Trend Çizgisi) */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                    <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="tourHeroWave" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#004BFA" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#5B80FF" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#5B80FF" stopOpacity="0.95" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                        fill="none"
                        stroke="url(#tourHeroWave)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="499" cy="24" r="4" fill="#5B80FF" opacity="1" className="animate-pulse" />
                    </svg>
                  </div>
                </motion.div>

                {/* 2. MERKEZE UÇUŞ VİTRİNİ: WIDGET KENDİ YERİNDEN BAŞLAYARAK ORTAYA SÜRÜKLENİR */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 w-full max-w-5xl xl:max-w-6xl my-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 pointer-events-auto"
                >
                  {/* SOL KOLON: SAYFADAKİ KENDİ GERÇEK YERİNDEN MERKEZE SÜRÜKLENEN ANİMASYONLU WIDGET */}
                  <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`widget-fly-${currentStep.id}`}
                        initial={{
                          x: origin.deltaX,
                          y: origin.deltaY,
                          scale: origin.scale,
                          opacity: 0.85,
                        }}
                        animate={{
                          x: 0,
                          y: 0,
                          scale: 1,
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.92,
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 110,
                          damping: 17,
                          mass: 0.85,
                        }}
                        className="w-full shadow-2xl rounded-3xl overflow-hidden ring-1 ring-white/20"
                      >
                        {renderActiveWidget()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* SAĞ KOLON: HEMEN YANINA GELEN KUTUSUZ ZARİF TİPOGRAFİ */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-step-${currentStep.id}`}
                      initial={{ opacity: 0, x: 28 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                      className="w-full lg:w-[42%] xl:w-[40%] flex flex-col space-y-5 text-white select-none"
                    >
                      {/* Adım Rozeti */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-white/80 uppercase tracking-widest backdrop-blur-md self-start">
                        <span className="w-2 h-2 rounded-full bg-[#5B80FF] animate-pulse" />
                        <span>
                          Widget Rehberi • Adım {currentStepIndex + 1} / {steps.length}
                        </span>
                      </div>

                      {/* Başlık (Kutusuz, doğrudan gradyan üzerinde) */}
                      <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-white clash-title tracking-tight leading-tight">
                        {currentStep.title}
                      </h3>

                      {/* Açıklama Paragrafı (Kutusuz, berrak beyaz) */}
                      <p className="text-sm sm:text-base lg:text-[16px] text-white/90 leading-relaxed font-normal font-clash">
                        {currentStep.description}
                      </p>

                      {/* Gezinme Butonları */}
                      <div className="flex items-center gap-3 pt-2 flex-wrap">
                        {currentStepIndex > 0 && (
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer backdrop-blur-md shadow-xs"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Önceki</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#004BFA]/30 hover:shadow-xl transition-all cursor-pointer group"
                        >
                          <span>{currentStepIndex < steps.length - 1 ? "Sonraki Adım" : "Turu Tamamla"}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Turu Kapat Butonu */}
                        <button
                          type="button"
                          onClick={handleClose}
                          className="ml-auto text-xs text-white/60 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Kapat (ESC)</span>
                        </button>
                      </div>

                      {/* İlerleme Çizgisi / Noktalar */}
                      <div className="flex items-center gap-1.5 pt-2">
                        {steps.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentStepIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === currentStepIndex
                                ? "w-8 bg-[#5B80FF]"
                                : idx < currentStepIndex
                                ? "w-4 bg-emerald-400/80"
                                : "w-3 bg-white/20 hover:bg-white/40"
                            }`}
                            title={`Adım ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
