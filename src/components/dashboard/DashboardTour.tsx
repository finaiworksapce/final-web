"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ArrowLeft, X } from "lucide-react";

interface StepConfig {
  element: string;
  title: string;
  description: string;
  placement: "left" | "right" | "top" | "bottom";
}

interface DashboardTourProps {
  hasActiveAssets: boolean;
  className?: string;
}

const STORAGE_KEY = "finai_dashboard_tour_seen";

export function DashboardTour({ hasActiveAssets, className = "" }: DashboardTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 1440, height: 900 });

  // Senaryo A (Portföyü Olan Kullanıcı)
  const stepsWithAssets: StepConfig[] = useMemo(
    () => [
      {
        element: "#finai-widget-summary",
        title: "Portföyünün Finansal Nabzı",
        description:
          "Sahip olduğun tüm hisse senedi, fon ve nakit varlıklarının güncel toplam değerini tek bakışta buradan izleyebilirsin. Günlük kâr/zarar durumunu ve genel getiri oranını anlık olarak takip ederek portföyünün performansını ölçebilirsin. Detaylı varlık listene ve işlem geçmişine ulaşmak için kartlara tıklayabilirsin.",
        placement: "right", // Salih Bey'in talebi: Sağ taraftaki geniş alana yerleşecek
      },
      {
        element: "#finai-widget-allocation",
        title: "Risk ve Varlık Dağılımı",
        description:
          "Portföyünün hisse, yatırım fonu, emtia ve nakit arasındaki oransal ağırlığını gösterir. Finansal okuryazarlığın temel kuralı tüm birikimi tek bir enstrümana bağlamamaktır; buradaki dağılım grafiği risk dengeni anında kontrol etmeni sağlar. Bu widget'ın üzerine bastığın zaman ise seni doğrudan detaylı Portföy sayfana yönlendirir.",
        placement: "left", // Solundaki özet kartları alanında gösterilecek
      },
      {
        element: "#finai-widget-monthly-report",
        title: "FinAi Aylık Portföy Raporu",
        description:
          "Bu alan, yapay zekanın portföyünü detaylı inceleyerek oluşturduğu aylık performans ve strateji analizidir. Bu rapor aylık olarak hazırlandığından dolayı, ilk kapsamlı analizini portföyünü oluşturduktan 1 ay sonra burada görebileceksin. Her ayın sonunda yatırımlarının genel seyrini ve derinlemesine içgörülerini buradan takip edebilirsin.",
        placement: "left",
      },
      {
        element: "#finai-widget-market",
        title: "Piyasa Genel Görünümü & Canlı Grafikler",
        description:
          "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
        placement: "right",
      },
      {
        element: "#finai-widget-agenda",
        title: "Günlük Ajanda & Kritik Gelişmeler",
        description:
          "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
        placement: "left",
      },
      {
        element: "#finai-widget-news",
        title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
        description:
          "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
        placement: "top",
      },
    ],
    []
  );

  // Senaryo B (Henüz Varlık Eklememiş Kullanıcı)
  const stepsWithoutAssets: StepConfig[] = useMemo(
    () => [
      {
        element: "#finai-widget-sample-portfolio",
        title: "Model Portföy Rehberi",
        description:
          "Henüz portföyüne varlık eklemediysen, FinAi uzmanları ve algoritmaları tarafından dengeli biçimde hazırlanmış BIST model portföyünü buradan inceleyebilirsin. Risk dağılımı yapılmış örnek bir hisse senedi sepetinin nasıl kurgulandığını görerek kendi portföyün için ilham alabilirsin.",
        placement: "right",
      },
      {
        element: "#finai-widget-academy",
        title: "Finansal Okuryazarlık & Akademi",
        description:
          "Bütçe yönetiminden hisse senedi ve şirket ortaklığına uzanan adım adım interaktif eğitim haritandır. Her hafta yeni bir modülü tamamlayarak finansal okuryazarlığını geliştirebilir ve tasarruflarını bilinçli yatırımlara dönüştürmeyi öğrenebilirsin.",
        placement: "left",
      },
      {
        element: "#finai-widget-market",
        title: "Piyasa Genel Görünümü & Canlı Grafikler",
        description:
          "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
        placement: "right",
      },
      {
        element: "#finai-widget-agenda",
        title: "Günlük Ajanda & Kritik Gelişmeler",
        description:
          "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
        placement: "left",
      },
      {
        element: "#finai-widget-news",
        title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
        description:
          "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
        placement: "top",
      },
    ],
    []
  );

  const steps = useMemo(() => {
    const list = hasActiveAssets ? stepsWithAssets : stepsWithoutAssets;
    if (typeof window === "undefined") return list;
    return list.filter((s) => document.querySelector(s.element) !== null);
  }, [hasActiveAssets, stepsWithAssets, stepsWithoutAssets]);

  // Window dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update target rect
  const updateTargetRect = useCallback(() => {
    if (!isOpen || steps.length === 0) return;
    const step = steps[currentStepIndex];
    if (!step) return;
    const el = document.querySelector(step.element);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [isOpen, steps, currentStepIndex]);

  // Sayfa kaydırma ve odaklama
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;
    const step = steps[currentStepIndex];
    if (!step) return;
    const el = document.querySelector(step.element);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Animasyon süresince rect'i güncelle
      const interval = setInterval(updateTargetRect, 60);
      const timer = setTimeout(() => {
        clearInterval(interval);
        updateTargetRect();
      }, 600);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isOpen, currentStepIndex, steps, updateTargetRect]);

  // Scroll and Resize event listeners
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updateTargetRect, { passive: true });
    window.addEventListener("resize", updateTargetRect);
    return () => {
      window.removeEventListener("scroll", updateTargetRect);
      window.removeEventListener("resize", updateTargetRect);
    };
  }, [isOpen, updateTargetRect]);

  // Klavye Kontrolleri (ESC, Ok tuşları)
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
    setCurrentStepIndex(0);
    setIsOpen(true);
  };

  // İlk girişte otomatik tetikleme
  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const currentStep = steps[currentStepIndex];

  // Yazıların Yerleşimi (Kutu olmadan, açık alana zarif tipografi olarak)
  const textPositionStyles = useMemo(() => {
    if (!targetRect || !currentStep) return {};
    const { width: winWidth, height: winHeight } = windowDimensions;
    const isDesktop = winWidth >= 1024;

    if (!isDesktop) {
      // Mobil & Tablet: Hedefin altına veya üstüne tam genişlikte yerleştir
      const topSpace = targetRect.top;
      const bottomSpace = winHeight - targetRect.bottom;
      if (bottomSpace > 280) {
        return {
          position: "fixed" as const,
          top: targetRect.bottom + 24,
          left: 16,
          right: 16,
          maxWidth: "calc(100vw - 32px)",
        };
      } else {
        return {
          position: "fixed" as const,
          bottom: winHeight - targetRect.top + 24,
          left: 16,
          right: 16,
          maxWidth: "calc(100vw - 32px)",
        };
      }
    }

    // Masaüstü: Belirlenen yerleşim alanına kutusuz, doğrudan tipografi olarak konumlandır
    const placement = currentStep.placement;

    if (placement === "right") {
      const leftPos = targetRect.right + 40;
      const availableWidth = Math.min(620, winWidth - leftPos - 40);
      const topPos = Math.max(80, targetRect.top + (targetRect.height > 200 ? 10 : -20));
      return {
        position: "fixed" as const,
        top: topPos,
        left: leftPos,
        maxWidth: availableWidth,
      };
    }

    if (placement === "left") {
      const rightPos = winWidth - targetRect.left + 40;
      const availableWidth = Math.min(620, targetRect.left - 60);
      const topPos = Math.max(80, targetRect.top + (targetRect.height > 200 ? 10 : -20));
      return {
        position: "fixed" as const,
        top: topPos,
        right: rightPos,
        maxWidth: availableWidth,
      };
    }

    if (placement === "top") {
      const bottomPos = winHeight - targetRect.top + 28;
      const leftPos = Math.max(40, targetRect.left);
      return {
        position: "fixed" as const,
        bottom: bottomPos,
        left: leftPos,
        maxWidth: Math.min(700, winWidth - leftPos - 40),
      };
    }

    // placement === 'bottom'
    const topPos = targetRect.bottom + 28;
    const leftPos = Math.max(40, targetRect.left);
    return {
      position: "fixed" as const,
      top: topPos,
      left: leftPos,
      maxWidth: Math.min(700, winWidth - leftPos - 40),
    };
  }, [targetRect, currentStep, windowDimensions]);

  return (
    <>
      {/* Sayfa Başlığı Yanındaki Manuel Tetikleme Butonu */}
      <button
        type="button"
        onClick={handleStart}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-200/80 dark:border-white/15 text-xs font-semibold text-[#040989] dark:text-white shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer ${className}`}
        title="Sayfa Rehberini Başlat"
      >
        <Compass className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#5B80FF]" />
        <span>Sayfa Rehberi</span>
      </button>

      {/* =========================================================================
          SPOTLIGHT OVERLAY & SADE TİPOGRAFİ METİN ALANI (KUTUSUZ, GRADYANLI)
          ========================================================================= */}
      <AnimatePresence>
        {isOpen && targetRect && currentStep && (
          <div className="fixed inset-0 z-[100] pointer-events-auto">
            {/* 1. FinAi İmza Gradyanlı SVG Cutout Mask */}
            <svg
              className="fixed inset-0 w-full h-full pointer-events-none"
              style={{ width: "100vw", height: "100vh" }}
            >
              <defs>
                <mask id="finai-spotlight-mask">
                  {/* Beyaz: Tüm ekranı gradyanla kapla */}
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {/* Siyah: Açıklanan widget'ın olduğu yeri pürüzsüzce del */}
                  <rect
                    x={targetRect.left - 6}
                    y={targetRect.top - 6}
                    width={targetRect.width + 12}
                    height={targetRect.height + 12}
                    rx="22"
                    fill="black"
                  />
                </mask>

                {/* Toplam Varlık Değeri ile Birebir Aynı Gradyan */}
                <linearGradient id="finaiBackdropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#02041A" stopOpacity="0.94" />
                  <stop offset="45%" stopColor="#040989" stopOpacity="0.88" />
                  <stop offset="100%" stopColor="#02041A" stopOpacity="0.94" />
                </linearGradient>
              </defs>

              {/* Arka Plan Gradyan Maskesi */}
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#finaiBackdropGradient)"
                mask="url(#finai-spotlight-mask)"
                className="pointer-events-auto"
                onClick={handleClose}
              />

              {/* Vurgulanan Widget Çevresindeki İnce Işıklı Çerçeve */}
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="22"
                fill="none"
                stroke="#5B80FF"
                strokeWidth="2.5"
                opacity="0.95"
                className="animate-pulse"
              />
            </svg>

            {/* 2. Arka Plan Ambient Işık Halkaları */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -right-32 w-[540px] h-[540px] bg-[#004BFA]/20 rounded-full blur-[140px]" />
              <div className="absolute -bottom-32 -left-32 w-[540px] h-[540px] bg-[#004BFA]/20 rounded-full blur-[140px]" />
            </div>

            {/* 3. KUTUSUZ, DOĞRUDAN ALANA YERLEŞEN ZARİF TİPOGRAFİ METİN ALANI */}
            <motion.div
              key={`tour-step-${currentStepIndex}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={textPositionStyles}
              className="z-[110] space-y-4 pointer-events-auto select-none"
            >
              {/* Adım Rozeti */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-white/80 uppercase tracking-widest backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#5B80FF] animate-pulse" />
                <span>
                  Widget Rehberi • Adım {currentStepIndex + 1} / {steps.length}
                </span>
              </div>

              {/* Başlık (Kutusuz, doğrudan gradyan üzerinde) */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white clash-title tracking-tight leading-tight">
                {currentStep.title}
              </h3>

              {/* Açıklama Paragrafı (Kutusuz, berrak beyaz kontrast) */}
              <p className="text-sm sm:text-base lg:text-[17px] text-white/90 leading-relaxed font-normal font-clash">
                {currentStep.description}
              </p>

              {/* Şık Gezinme Butonları */}
              <div className="flex items-center gap-3 pt-3">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer backdrop-blur-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Önceki</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <span>{currentStepIndex < steps.length - 1 ? "Sonraki Adım" : "Turu Tamamla"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Turu Kapat Butonu */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="ml-auto text-xs text-white/50 hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Kapat (ESC)</span>
                </button>
              </div>

              {/* İlerleme Çizgisi */}
              <div className="flex items-center gap-1.5 pt-1">
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
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
