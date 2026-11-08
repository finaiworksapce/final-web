"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureItem {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "portfolio",
    step: "01",
    title: "Anlık Portföy ve Varlık Takibi",
    subtitle: "Tüm yatırımlarınızı tek bir ekranda canlı fiyatlarla toplayın.",
    description:
      "Borsa İstanbul hisselerinden TEFAS yatırım fonlarına kadar tüm varlıklarınızı tek dinamik panoda toplayın. Saniyelik piyasa fiyatları, kâr/zarar dengesi ve toplam portföy değeriniz anlık olarak güncellenir.",
    highlights: [
      "Canlı BIST pay piyasası ve TEFAS fon senkronizasyonu",
      "Otomatik ağırlıklı ortalama maliyet ve net kâr/zarar hesaplama",
      "Konsolide varlık dağılımı ve nakit rezerv takibi"
    ],
    image: "/images/portfolio_tracking_white.jpg"
  },
  {
    id: "scenarios",
    step: "02",
    title: "Olası Senaryo Simülasyonları",
    subtitle: "Piyasa şoklarında portföyünüzün dayanıklılığını önceden test edin.",
    description:
      "'Döviz kuru fırlarsa veya politika faizi artarsa yatırımlarım nasıl etkilenir?' sorusunun cevabını matematiksel modellerle test edin. Ekstrem dalgalanmalarda varlıklarınızın dayanıklılığını ölçün.",
    highlights: [
      "99+ Hazır makroekonomik ve sektörel stres testi senaryosu",
      "Döviz kuru, faiz ve emtia şoklarına karşı hassasiyet analizi",
      "Portföy direnç puanı ve olası kayıp/kazanç simülasyonu"
    ],
    image: "/images/scenario_analysis_white.jpg"
  },
  {
    id: "correlation",
    step: "03",
    title: "Varlıklar Arası Korelasyon Analizi",
    subtitle: "Yatırımlarınızın birbirini nasıl etkilediğini matematiksel olarak görün.",
    description:
      "Farklı hisse ve fonlarınızın birbiriyle olan korelasyon katsayılarını analiz edin. Portföyünüzün sahte çeşitlendirme tuzağına düşmesini engelleyin ve riskinizi rasyonel şekilde dağıtın.",
    highlights: [
      "Matematiksel korelasyon katsayıları (-1 ile +1)",
      "Sektörel yoğunlaşma ve gizli risk uyarıları",
      "Piyasa düşüşlerine karşı dalgalanmayı azaltıcı denge önerileri"
    ],
    image: "/images/correlation_analysis_white.jpg"
  },
  {
    id: "news",
    step: "04",
    title: "Piyasa ve KAP Haberleri Takibi",
    subtitle: "Gürültüden arındırılmış, doğrudan hisselerinize özel sıcak istihbarat.",
    description:
      "Portföyünüzdeki şirketleri doğrudan ilgilendiren KAP bildirimlerini, bilanço açıklamalarını ve makro gelişmeleri yapay zekâ süzgecinden geçmiş net özetlerle takip edin.",
    highlights: [
      "KAP açıklamaları ve çeyreklik bilanço duyuruları",
      "Hisselerinize özel anlık haber filtreleme",
      "Ekonomik takvim ve merkez bankası faiz kararları"
    ],
    image: "/images/news_tracking_white.jpg"
  },
  {
    id: "profile",
    step: "05",
    title: "Yatırımcı Karakteri ve Profil Testi",
    subtitle: "Risk toleransınıza ve hedeflerinize en uygun varlık sepetini belirleyin.",
    description:
      "Yatırım vadenizi ve dalgalanma toleransınızı ölçen interaktif test ile kişisel yapınıza en uygun model portföy yapısını dakikalar içinde ortaya koyun.",
    highlights: [
      "Kişiye özel rasyonel risk toleransı ölçümü",
      "Dengeli ve hedef odaklı model varlık dağılımı",
      "Yatırım psikolojisi ve stratejik rehberlik"
    ],
    image: "/images/portfolio_test_white.jpg"
  }
];

interface FeatureSectionProps {
  title?: string;
}

export function FeatureSteps({ title = "Özellikler" }: FeatureSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = FEATURES[activeIndex];

  return (
    <section id="features" className="w-full bg-white text-[#0E1E38] py-20 sm:py-28">
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        
        {/* Üst Başlık Alanı (Rozet yok, temiz editoryal hiyerarşi) */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-3">
            Platform Yetenekleri
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight clash-title">
            Yatırım kararlarınızı matematik ve şeffaf verilerle güçlendiren analitik bloklar.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal mt-4 max-w-2xl leading-relaxed">
            BIST ve TEFAS piyasalarını karmaşık tablolardan çıkarıp, her biri amaca hizmet eden modern karar destek araçlarına dönüştürdük.
          </p>
        </div>

        {/* Sekme Seçici (Yatay kaydırma yok, doğal wrap düzeni) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4 mb-12">
          {FEATURES.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-[#0E1E38] text-white font-semibold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span className={`text-[11px] font-mono ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                  {item.step}
                </span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Özellik Vitrini (Sol: Metin & Detaylar, Sağ: Gerçek Web Sitesi Ekran Görüntüsü) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Sol Kolon */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <span className="text-xs font-mono font-bold text-[#004BFA] tracking-widest block">
                  {activeFeature.step} / FİNAİ ANALİTİK
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0E1E38] tracking-tight leading-snug clash-title">
                  {activeFeature.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                  {activeFeature.subtitle}
                </p>

                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Vurgu Maddeleri */}
                <div className="pt-3 space-y-3 border-t border-slate-100">
                  {activeFeature.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#004BFA] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E1E38] hover:text-[#004BFA] transition-colors group cursor-pointer"
                  >
                    <span>Kendi portföyünüzde deneyin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ Kolon: Gerçek Web Sitesi Snapshot'ı */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-50"
              >
                {/* Üst Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 ml-2">
                    finai.net.tr/dashboard
                  </span>
                </div>

                {/* Gerçek Ekran Resmi */}
                <div className="relative aspect-[16/9] w-full bg-white">
                  <Image
                    src={activeFeature.image}
                    alt={activeFeature.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
