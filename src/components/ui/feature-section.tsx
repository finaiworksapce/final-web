"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureItem {
  id: string;
  step: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  url: string;
  aspectRatio: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "workspace",
    step: "01",
    category: "PORTFÖY & KONSOL",
    title: "Bütünleşik Portföy & Canlı Konsol",
    subtitle: "Tüm BIST hisseleri ve TEFAS fonları tek dinamik çalışma alanında.",
    description:
      "Borsa İstanbul'daki pay senetlerinizi ve TEFAS fonlarınızı tek bir akıllı ekranda birleştirin. Toplam varlık değerinizi, günlük getirinizi, varlık dağılımınızı ve piyasa genel görünümünü anlık olarak takip edin.",
    highlights: [
      "Canlı BIST 100 ve TEFAS fonlarıyla tam senkronizasyon",
      "Varlık sınıflarına göre otomatik dağılım grafiği ve net kâr/zarar",
      "Günlük ajanda, sıcak piyasa gelişmeleri ve TradingView grafikleri"
    ],
    image: "/images/landing/dashboard_workspace.jpg",
    url: "/dashboard/portfolio",
    aspectRatio: "aspect-[1024/560]"
  },
  {
    id: "sectors",
    step: "02",
    category: "PİYASA & SEKTÖRLER",
    title: "Sektörel Getiriler & Detaylı Piyasa Tablosu",
    subtitle: "Borsa İstanbul sektörlerinin performansını ve hisse çarpanlarını inceleyin.",
    description:
      "Teknoloji, savunma, enerji ve sanayi gibi sektörlerin yıllık getirilerini karşılaştırın. Günün en çok kazandıran, kaybeden ve hacim lideri hisselerini derinlemesine filtreleyin.",
    highlights: [
      "Sektör bazlı yıllık getiri oranları ve sektörel ağırlıklar",
      "Günün Enleri: Kazandıranlar, kaybedenler ve hacim liderleri",
      "F/K, piyasa değeri, teknik dereceler ve hacimlerle zengin hisse tablosu"
    ],
    image: "/images/landing/market_sectors.jpg",
    url: "/dashboard/data",
    aspectRatio: "aspect-[1024/564]"
  },
  {
    id: "economic",
    step: "03",
    category: "MAKRO ANALİZ",
    title: "Ekonomik Takvim & Makro Etki Zinciri",
    subtitle: "Enflasyon, faiz ve büyüme verilerinin piyasaya yansımasını adım adım izleyin.",
    description:
      "TÜFE, ÜFE ve politika faizi kararlarını geçmiş veri grafikleriyle inceleyin. FinAi Intelligence motoru, açıklanan verinin hanehalkından borsaya kadar uzanan zincirleme etkisini anlaşılır bir Türkçe ile açıklar.",
    highlights: [
      "Aylık TÜFE, faiz ve makro göstergelerin geçmiş dönem grafikleri",
      "FinAi Intelligence: Verinin vatandaş ve piyasa için sade anlatımı",
      "Neden-Sonuç Etki Zinciri: Alım gücünden hisse senetlerine doğrudan etki"
    ],
    image: "/images/landing/economic_tufe.jpg",
    url: "/dashboard/calendar",
    aspectRatio: "aspect-[1024/497]"
  },
  {
    id: "news",
    step: "04",
    category: "YAPAY ZEKÂ İSTİHBARAT",
    title: "Yapay Zekâ Destekli Haber & KAP Analizi",
    subtitle: "Gürültüden arındırılmış, hap özetler ve rasyonel piyasa içgörüleri.",
    description:
      "Piyasa bültenlerini ve şirket açıklamalarını binlerce sayfa okumak yerine yapay zekâ süzgecinden geçmiş hap özetlerle yakalayın. 'Kısa Özet', 'Neden Önemli?' ve 'Neleri Etkileyebilir?' başlıklarıyla kararlarınızı hızlandırın.",
    highlights: [
      "KAP ve piyasa haberlerinin 10 saniyelik odaklanmış hap özetleri",
      "'Neden Önemli?' ve 'Neleri Etkileyebilir?' etki dökümleri",
      "İlgili şirketler, varlıklar ve sektörlerle anlık ilişkilendirme"
    ],
    image: "/images/landing/news_detail.jpg",
    url: "/dashboard/news",
    aspectRatio: "aspect-[1024/592]"
  }
];

export function FeatureSteps({ title = "Özellikler" }: { title?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = FEATURES[activeIndex];

  return (
    <section id="features" className="w-full bg-white text-[#0E1E38] py-20 sm:py-28">
      {/* Sayfanın Tüm Genişliğini Kullanan Kapsayıcı */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        
        {/* =========================================================================
            BÖLÜM 1: TAM GENİŞLİK BAŞLIK VE EDİTORYAL GİRİŞ
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pb-10 sm:pb-14 border-b border-slate-200/80 mb-10 sm:mb-12">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-[1.15] clash-title">
              Yatırım kararlarınızı matematik ve şeffaf verilerle güçlendiren analitik bloklar.
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              BIST ve TEFAS piyasalarını karmaşık tablolardan çıkarıp, her biri özel bir amaca hizmet eden modern karar destek araçlarına dönüştürdük.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BÖLÜM 2: EDİTORYAL MİNİMALİST SEKME NAVİGASYONU (KUTUSUZ, RAFİNE, ÇİZGİSEL İNDİKATÖR)
            ========================================================================= */}
        <div className="border-t border-slate-200/80 mb-10 sm:mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {FEATURES.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className="group relative pt-4 pb-2 text-left transition-all duration-200 cursor-pointer focus:outline-none"
                >
                  {/* Aktif İndikatör Çizgisi */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                      isSelected
                        ? "bg-[#004BFA] shadow-[0_1px_8px_rgba(0,75,250,0.4)]"
                        : "bg-transparent group-hover:bg-slate-300"
                    }`}
                  />

                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-mono font-bold tracking-wider transition-colors ${
                        isSelected ? "text-[#004BFA]" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {item.step}
                    </span>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${
                        isSelected ? "text-slate-700" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-normal tracking-tight transition-colors line-clamp-1 ${
                      isSelected
                        ? "text-[#0E1E38] font-semibold"
                        : "text-slate-500 group-hover:text-[#0E1E38]"
                    }`}
                  >
                    {item.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BÖLÜM 3: VİTRİN — SOLDA AÇIKLAMA, SAĞDA TAM VE KESİNTİSİZ GERÇEK SNAPSHOT
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Sol Kolon: Editoryal Bilgi ve Maddeler (5 Kolon) */}
          <div className="lg:col-span-5 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-2xl sm:text-3xl font-normal text-[#0E1E38] tracking-tight leading-tight clash-title">
                  {activeFeature.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 font-medium leading-snug">
                  {activeFeature.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Vurgu Maddeleri */}
                <div className="pt-3 space-y-2.5 border-t border-slate-200/80">
                  {activeFeature.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#004BFA] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0E1E38] hover:text-[#004BFA] transition-colors group cursor-pointer"
                  >
                    <span>Bu özelliği kendi portföyünüzde deneyin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ Kolon: Dengeli Boyutlandırılmış, Kenarları Kesilmeyen Gerçek Snapshot (7 Kolon) */}
          <div className="lg:col-span-7 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white"
              >
                {/* Minimal Pencere Çubuğu */}
                <div className="flex items-center px-4 py-2.5 bg-[#F5F7FA] border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                </div>

                {/* Fotoğrafın Tüm Kenarlarını Koruyan ve Yüksek Çözünürlüklü Gösteren Alan */}
                <div className="relative w-full bg-slate-100/50 p-1 sm:p-2">
                  <div className={`relative w-full ${activeFeature.aspectRatio} overflow-hidden rounded-lg border border-slate-200/60 shadow-2xs`}>
                    <Image
                      src={activeFeature.image}
                      alt={activeFeature.title}
                      fill
                      unoptimized
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* =========================================================================
            BÖLÜM 4: 4'LÜ EDİTORYAL METRİK MATRİSİ (HAKKIMIZDA STANDARTI)
            ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              %100
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Doğrulanmış Borsa Verisi
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
              Borsa İstanbul ve TEFAS sistemlerinden filtrelenmiş resmi piyasa matematiği.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              Tek
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Konsolide Konsol
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
              Hisseler, yatırım fonları, makro takvim ve haberler tek bir akıllı ekranda.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              10 Sn
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Hap Özetleme Hızı
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
              Sayfalarca KAP bildirimini ve bilançoyu saniyeler içinde anlaşılır kılan yapay zekâ.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              24/7
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Kesintisiz Analitik
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
              Piyasa kapanışlarında bile portföyünüzün stres testleri ve korelasyon hesapları hazır.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
