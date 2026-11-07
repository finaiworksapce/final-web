"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Feature {
  step: string;
  title: string;
  subtitle?: string;
  content: string;
  image: string;
  highlights?: string[];
  badge?: string;
}

interface FeatureStepsProps {
  features?: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
}

const DEFAULT_FEATURES: Feature[] = [
  {
    step: "01",
    badge: "Canlı Piyasa & Portföy",
    title: "Anlık Portföy ve Varlık Takibi",
    subtitle: "Tüm yatırımlarınızı tek bir rasyonel ekranda toplayın.",
    content: "Borsa İstanbul hisselerinden TEFAS fonlarına kadar elinizdeki tüm varlıkları tek ekranda canlı fiyatlarla takip edin. Saniyelik güncellemeler ve net kar/zarar analizleriyle portföyünüzün kontrolünü hiçbir an elden bırakmayın.",
    highlights: [
      "BIST ve TEFAS fonlarıyla tam senkronizasyon",
      "Saniyelik fiyat ve getiri değişim bildirimleri",
      "Gerçek zamanlı sektörel varlık dağılımı"
    ],
    image: "/images/portfolio_tracking_white.jpg"
  },
  {
    step: "02",
    badge: "Piyasa İstihbaratı",
    title: "Anlık Haber ve Gündem Takibi",
    subtitle: "Piyasadaki kritik gelişmeleri süzülmüş içgörülerle yakalayın.",
    content: "Yatırımlarınızı doğrudan etkileyebilecek flaş KAP bildirimlerini, bilanço açıklamalarını ve piyasa haberlerini binlerce kaynak arasından anında ayıklayıp anlaşılır bir dille önünüze getirir.",
    highlights: [
      "KAP bildirimleri ve bilanço açıklamaları",
      "Gereksiz bilgi kirliliğinden arındırılmış sıcak gündem",
      "Hisselerinize özel anlık haber filtreleme"
    ],
    image: "/images/news_tracking_white.jpg"
  },
  {
    step: "03",
    badge: "Risk & Stres Testi",
    title: "Olası Senaryo Simülasyonları",
    subtitle: "Piyasa dalgalanmalarına karşı önceden hazırlıklı olun.",
    content: "'Döviz yükselirse veya faizler inerse portföyüm nasıl tepki verir?' sorusunun yanıtını matematiksel modellerle test edin. Ekstrem piyasa şartlarında varlıklarınızın dayanıklılığını ölçerek stratejinizi güvenceye alın.",
    highlights: [
      "Faiz, kur ve enflasyon şok testleri",
      "Sektörel kriz ve düşüş simülasyonları",
      "Portföy dayanıklılık skoru"
    ],
    image: "/images/scenario_analysis_white.jpg"
  },
  {
    step: "04",
    badge: "Portföy Analitiği",
    title: "Varlıklar Arası Korelasyon Analizi",
    subtitle: "Yatırımlarınızın birbirini nasıl etkilediğini görün.",
    content: "Aynı yöne hareket eden veya birbirini dengeleyen varlıkları keşfedin. Portföyünüzün aşırı riskli tek bir sektöre sıkışmasını engelleyerek gerçek bir risk dağılımı oluşturmanıza rehberlik eder.",
    highlights: [
      "Matematiksel korelasyon matrisi",
      "Aşırı sektörel yoğunlaşma uyarıları",
      "Dengeleyici varlık önerileri"
    ],
    image: "/images/correlation_analysis_white.jpg"
  },
  {
    step: "05",
    badge: "Kişiselleştirme",
    title: "Yatırımcı Karakteri ve Profil Testi",
    subtitle: "Finansal hedefinize ve vadenize en uygun dağılımı keşfedin.",
    content: "Risk toleransınızı ve yatırım vadenizi belirleyen interaktif test ile sizin karakterinize en uygun model portföy yapısını saniyeler içinde ortaya koyun.",
    highlights: [
      "Kişiye özel risk toleransı ölçümü",
      "Hedef odaklı model varlık sepeti",
      "Seviyenize uyumlu yapay zeka dili"
    ],
    image: "/images/portfolio_test_white.jpg"
  }
];

export function FeatureSteps({
  features = DEFAULT_FEATURES,
  className,
  title = "Özellikler",
  autoPlayInterval = 7000
}: FeatureStepsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = features[activeIndex] || features[0];

  // İsteğe bağlı otomatik döngü (kullanıcı fare ile üzerine gelmediğinde)
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !autoPlayInterval) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [features.length, autoPlayInterval, isPaused]);

  return (
    <div
      className={cn("w-full bg-white text-[#0E1E38] py-20 sm:py-28 overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Kenarlara Kadar Uzanan Geniş Kapsayıcı */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        {/* Üst Başlık Alanı */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-500">
              {title}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight">
            Yatırımlarınızı profesyonelce yönetmeniz için geliştirilmiş bütünleşik araçlar.
          </h2>
        </div>

        {/* İnteraktif Sekme Navigasyonu (Çerçevesiz, Yatay Akıcı Liste) */}
        <div className="border-b border-slate-200/80 mb-12 sm:mb-16 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 sm:gap-10 min-w-max pb-4">
            {features.map((feature, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className="group relative flex items-center gap-2.5 pb-2 transition-all text-left"
                >
                  <span
                    className={cn(
                      "text-xs font-mono transition-colors",
                      isActive ? "text-[#004BFA] font-bold" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  >
                    {feature.step || `0${idx + 1}`}
                  </span>
                  <span
                    className={cn(
                      "text-sm sm:text-base tracking-tight transition-all",
                      isActive
                        ? "text-[#0E1E38] font-semibold"
                        : "text-slate-500 hover:text-slate-900 font-normal"
                    )}
                  >
                    {feature.title}
                  </span>

                  {/* Aktif Sekme Gösterge Çizgisi */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFeatureTabIndicator"
                      className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#004BFA]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vitrin İçeriği (İki Geniş Sütun — Çerçeve / Kutu Yok) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          {/* Sol Kolon: Açıklama, Vurgular ve Aksiyon */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                {activeFeature.badge && (
                  <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase block">
                    {activeFeature.badge}
                  </span>
                )}

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0E1E38] tracking-tight leading-tight">
                  {activeFeature.title}
                </h3>

                {activeFeature.subtitle && (
                  <p className="text-base sm:text-lg text-slate-700 font-medium leading-snug">
                    {activeFeature.subtitle}
                  </p>
                )}

                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {activeFeature.content}
                </p>

                {/* Vurgu Maddeleri */}
                {activeFeature.highlights && activeFeature.highlights.length > 0 && (
                  <div className="pt-2 space-y-3 border-t border-slate-100">
                    {activeFeature.highlights.map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#004BFA] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E1E38] hover:text-[#004BFA] transition-colors group"
                  >
                    <span>Hemen Deneyin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ Kolon: Çerçevesiz, Geniş Ekran Arayüz Önizlemesi */}
          <div className="lg:col-span-7 relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center"
              >
                <Image
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-2 sm:p-6 transition-all duration-500"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
