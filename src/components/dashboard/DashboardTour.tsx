"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, ArrowLeft } from "lucide-react";

interface StepConfig {
  element: string;
  title: string;
  description: string;
  placement: "left" | "right" | "top" | "bottom";
}

interface DashboardTourProps {
  hasActiveAssets: boolean;
  news?: any[];
  className?: string;
}

const STORAGE_KEY = "finai_dashboard_tour_seen";

export function DashboardTour({ hasActiveAssets, className = "" }: DashboardTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 1440, height: 900 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Senaryo A (Portföyünde Varlık Olan Kullanıcı)
  const stepsWithAssets: StepConfig[] = useMemo(
    () => [
      {
        element: "#finai-widget-summary",
        title: "Portföyünün Finansal Nabzı",
        description:
          "Sahip olduğun tüm hisse senedi, fon ve nakit varlıklarının güncel toplam değerini tek bakışta buradan izleyebilirsin. Günlük kâr/zarar durumunu ve genel getiri oranını anlık olarak takip ederek portföyünün performansını ölçebilirsin. Detaylı varlık listene ve işlem geçmişine ulaşmak için kartlara tıklayabilirsin.",
        placement: "right", // Sağ taraftaki geniş alana yerleşir
      },
      {
        element: "#finai-widget-allocation",
        title: "Risk ve Varlık Dağılımı",
        description:
          "Portföyünün hisse, yatırım fonu, emtia ve nakit arasındaki oransal ağırlığını gösterir. Finansal okuryazarlığın temel kuralı tüm birikimi tek bir enstrümana bağlamamaktır; buradaki dağılım grafiği risk dengeni anında kontrol etmeni sağlar. Bu widget'ın üzerine bastığın zaman ise seni doğrudan detaylı Portföy sayfana yönlendirir.",
        placement: "bottom", // Salih Bey'in talebi: Kartın hemen altına yerleşecek
      },
      {
        element: "#finai-widget-monthly-report",
        title: "FinAi Aylık Portföy Raporu",
        description:
          "Bu alan, yapay zekanın portföyünü detaylı inceleyerek oluşturduğu aylık performans ve strateji analizidir. Bu rapor aylık olarak hazırlandığından dolayı, ilk kapsamlı analizini portföyünü oluşturduktan 1 ay sonra burada görebileceksin. Her ayın sonunda yatırımlarının genel seyrini ve derinlemesine içgörülerini buradan takip edebilirsin.",
        placement: "left", // Salih Bey'in talebi: Sol menünün sağından başlayacak
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
        placement: "bottom",
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

  // Doğrudan portföy durumuna göre adımları belirle (DOM mevcudiyeti öncelikli)
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

  // Window resize listener
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

  // Hedef elementi bul ve rect hesapla
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

  // Adım değiştiğinde yumuşak kaydır ve takip et
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;
    const step = steps[currentStepIndex];
    if (!step) return;

    const syncPosition = () => {
      const el = document.querySelector(step.element);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    const el = document.querySelector(step.element);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTargetRect(el.getBoundingClientRect());
    }

    let animationFrameId: number;
    let startTime = performance.now();
    const duration = 800; // ms

    const trackElement = (now: number) => {
      syncPosition();
      if (now - startTime < duration) {
        animationFrameId = requestAnimationFrame(trackElement);
      }
    };

    animationFrameId = requestAnimationFrame(trackElement);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isOpen, currentStepIndex, steps]);

  // Scroll ve Resize anında koordinat senkronizasyonu
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", updateTargetRect, { passive: true });
    window.addEventListener("resize", updateTargetRect);
    return () => {
      window.removeEventListener("scroll", updateTargetRect);
      window.removeEventListener("resize", updateTargetRect);
    };
  }, [isOpen, updateTargetRect]);

  // Klavye kontrolleri
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

  // Butona basıldığında anında açma ve ilk hedefe odaklanma
  const handleStart = () => {
    let activeSteps = steps;
    if (typeof document !== "undefined") {
      if (document.querySelector("#finai-widget-summary")) {
        activeSteps = stepsWithAssets;
      } else if (document.querySelector("#finai-widget-sample-portfolio")) {
        activeSteps = stepsWithoutAssets;
      }
    }

    setCurrentStepIndex(0);
    const firstStep = activeSteps[0];
    if (firstStep && typeof document !== "undefined") {
      const el = document.querySelector(firstStep.element);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTargetRect(el.getBoundingClientRect());
      }
    }
    setIsOpen(true);
  };

  // Tıklama spotlight kesik alanı içindeyse kapatma
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (targetRect) {
      const { clientX, clientY } = e;
      const isInsideCutout =
        clientX >= targetRect.left - 8 &&
        clientX <= targetRect.right + 8 &&
        clientY >= targetRect.top - 8 &&
        clientY <= targetRect.bottom + 8;
      if (isInsideCutout) {
        return;
      }
    }
    handleClose();
  };

  const currentStep = steps[currentStepIndex];

  // Kutusuz tipografi yerleşim koordinatları (Akıllı Boş Alan Hesaplaması)
  const textPositionStyles = useMemo(() => {
    const { width: winWidth, height: winHeight } = windowDimensions;
    const isDesktop = winWidth >= 1024;

    if (!targetRect || !currentStep) {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: 600,
      };
    }

    // Mobil ve dar ekranlar: Widget altına veya üstüne oturur
    if (!isDesktop) {
      const bottomSpace = winHeight - targetRect.bottom;
      if (bottomSpace > 280) {
        return {
          position: "fixed" as const,
          top: targetRect.bottom + 20,
          left: 16,
          right: 16,
          maxWidth: "calc(100vw - 32px)",
        };
      } else {
        return {
          position: "fixed" as const,
          bottom: winHeight - targetRect.top + 20,
          left: 16,
          right: 16,
          maxWidth: "calc(100vw - 32px)",
        };
      }
    }

    const placement = currentStep.placement;

    // 1. SAĞ YERLEŞİM (Toplam Varlık Değeri & Market Grafikleri İçin)
    if (placement === "right") {
      const rightAvailableSpace = winWidth - targetRect.right;
      if (rightAvailableSpace >= 340) {
        const leftPos = targetRect.right + 36;
        const availableWidth = Math.min(620, winWidth - leftPos - 36);
        const topPos = Math.max(80, Math.min(targetRect.top, winHeight - 380));
        return {
          position: "fixed" as const,
          top: topPos,
          left: leftPos,
          maxWidth: availableWidth,
        };
      } else {
        const topPos = Math.min(targetRect.bottom + 24, winHeight - 320);
        const leftPos = Math.max(24, Math.min(targetRect.left, winWidth - 650));
        return {
          position: "fixed" as const,
          top: topPos,
          left: leftPos,
          maxWidth: Math.min(650, winWidth - 48),
        };
      }
    }

    // 2. SOL YERLEŞİM (Aylık Rapor & Ajanda İçin: Sol Menü Kısayolunun Hemen Sağından Başlar)
    if (placement === "left") {
      const leftAvailableSpace = targetRect.left;
      if (leftAvailableSpace >= 340) {
        // Sol menü kısayolunun hemen sağından hizalanarak başlar (~96px)
        const leftPos = Math.max(40, isDesktop ? 96 : 24);
        const availableWidth = Math.min(620, targetRect.left - leftPos - 36);
        const topPos = Math.max(80, Math.min(targetRect.top, winHeight - 380));
        return {
          position: "fixed" as const,
          top: topPos,
          left: leftPos,
          maxWidth: availableWidth,
        };
      } else {
        const topPos = Math.min(targetRect.bottom + 24, winHeight - 320);
        const leftPos = Math.max(24, Math.min(targetRect.left, winWidth - 650));
        return {
          position: "fixed" as const,
          top: topPos,
          left: leftPos,
          maxWidth: Math.min(650, winWidth - 48),
        };
      }
    }

    // 3. ALT YERLEŞİM (Varlık Dağılımı İçin: Salih Bey'in Talebi)
    if (placement === "bottom") {
      const topPos = targetRect.bottom + 24;
      const leftPos = Math.max(32, Math.min(targetRect.left, winWidth - 680));
      return {
        position: "fixed" as const,
        top: topPos,
        left: leftPos,
        maxWidth: Math.min(680, winWidth - leftPos - 32),
      };
    }

    // 4. ÜST YERLEŞİM (Son Haberler %100 Genişlik İçin)
    if (placement === "top") {
      const availableTopSpace = targetRect.top;
      if (availableTopSpace >= 240) {
        const bottomPos = winHeight - targetRect.top + 28;
        const leftPos = Math.max(32, Math.min(targetRect.left, winWidth - 680));
        return {
          position: "fixed" as const,
          bottom: bottomPos,
          left: leftPos,
          maxWidth: Math.min(660, winWidth - leftPos - 32),
        };
      } else {
        const topPos = Math.min(targetRect.bottom + 28, winHeight - 320);
        const leftPos = Math.max(32, Math.min(targetRect.left, winWidth - 680));
        return {
          position: "fixed" as const,
          top: topPos,
          left: leftPos,
          maxWidth: Math.min(660, winWidth - leftPos - 32),
        };
      }
    }

    // Yedek Varsayılan
    const topPos = Math.min(targetRect.bottom + 28, winHeight - 320);
    const leftPos = Math.max(32, Math.min(targetRect.left, winWidth - 680));
    return {
      position: "fixed" as const,
      top: topPos,
      left: leftPos,
      maxWidth: Math.min(660, winWidth - leftPos - 32),
    };
  }, [targetRect, currentStep, windowDimensions]);

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
          PORTAL: BODY ÜZERİNDE EN ÜST KATMAN SPOTLIGHT (GRADYANLI & KUTUSUZ)
          ========================================================================= */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && currentStep && (
              <div className="fixed inset-0 z-[99999] pointer-events-auto overflow-hidden">
                {/* 1. FinAi İmza Gradyanlı SVG Cutout Mask (Yumuşak Morf Geçişli) */}
                <svg
                  className="fixed inset-0 w-full h-full pointer-events-none"
                  style={{ width: "100vw", height: "100vh" }}
                >
                  <defs>
                    <mask id="finai-portal-spotlight-mask">
                      <rect x="0" y="0" width="100%" height="100%" fill="white" />
                      {targetRect && (
                        <motion.rect
                          animate={{
                            x: targetRect.left - 6,
                            y: targetRect.top - 6,
                            width: targetRect.width + 12,
                            height: targetRect.height + 12,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 95,
                            damping: 18,
                            mass: 0.9,
                          }}
                          rx="24"
                          fill="black"
                        />
                      )}
                    </mask>

                    {/* Toplam Varlık Değeri ile Birebir Aynı Gradyan */}
                    <linearGradient id="finaiTourGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                    fill="url(#finaiTourGradient)"
                    mask="url(#finai-portal-spotlight-mask)"
                    className="pointer-events-auto cursor-pointer"
                    onClick={handleBackdropClick}
                  />

                  {/* Vurgulanan Widget Çevresindeki İnce Işıklı Çerçeve (Yumuşak Morf Geçişli) */}
                  {targetRect && (
                    <motion.rect
                      animate={{
                        x: targetRect.left - 6,
                        y: targetRect.top - 6,
                        width: targetRect.width + 12,
                        height: targetRect.height + 12,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 95,
                        damping: 18,
                        mass: 0.9,
                      }}
                      rx="24"
                      fill="none"
                      stroke="#5B80FF"
                      strokeWidth="2.5"
                      opacity="0.95"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* 2. Arka Plan Ambient Işık Halkaları */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-32 -right-32 w-[540px] h-[540px] bg-[#004BFA]/20 rounded-full blur-[140px]" />
                  <div className="absolute -bottom-32 -left-32 w-[540px] h-[540px] bg-[#004BFA]/20 rounded-full blur-[140px]" />
                </div>

                {/* 3. KUTUSUZ, DOĞRUDAN ALANA YERLEŞEN ZARİF TİPOGRAFİ METİN ALANI */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tour-step-${currentStepIndex}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={textPositionStyles}
                    onClick={(e) => e.stopPropagation()}
                    className="z-[100000] space-y-4 pointer-events-auto select-none"
                  >
                    {/* Başlık (Kutusuz, doğrudan gradyan üzerinde) */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-white clash-title tracking-tight leading-tight">
                      {currentStep.title}
                    </h3>

                    {/* Açıklama Paragrafı (Kutusuz, berrak beyaz kontrast) */}
                    <p className="text-sm sm:text-base lg:text-[17px] text-white/90 leading-relaxed font-normal font-clash">
                      {currentStep.description}
                    </p>

                    {/* Şık Gezinme Butonları */}
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
                    </div>

                    {/* İlerleme Çizgisi / Noktalar */}
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
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
