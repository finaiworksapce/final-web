"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
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
    url: "/dashboard/portfolio"
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
    url: "/dashboard/data"
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
    url: "/dashboard/calendar"
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
    url: "/dashboard/news"
  }
];

export function FeatureSteps({ title = "Özellikler" }: { title?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = FEATURES[activeIndex];

  return (
    <section id="features" className="w-full bg-white text-[#0E1E38] py-24 sm:py-32">
      {/* Sayfanın Tüm Genişliğini Kullanan Kapsayıcı (Hakkımızda Sayfası Standartı) */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        
        {/* =========================================================================
            BÖLÜM 1: TAM GENİŞLİK BAŞLIK VE EDİTORYAL GİRİŞ
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pb-12 sm:pb-16 border-b border-slate-200/80 mb-12 sm:mb-16">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block">
              Platform Mimarisi & Yetenekler
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-[1.15] clash-title">
              Yatırım kararlarınızı matematik ve şeffaf verilerle güçlendiren analitik bloklar.
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              BIST ve TEFAS piyasalarını karmaşık tablolardan çıkarıp, her biri özel bir amaca hizmet eden modern karar destek araçlarına dönüştürdük.
            </p>
          </div>
        </div>

        {/* =========================================================================
            BÖLÜM 2: TAM GENİŞLİK SEKME MENÜSÜ (ROZETSİZ, TEMİZ, YATAY SCROLL YOK)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {FEATURES.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#02041A] text-white border-[#02041A] shadow-lg shadow-[#02041A]/10"
                    : "bg-[#F5F7FA] text-slate-700 border-slate-200/70 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className={`text-xs font-mono font-bold tracking-widest ${isSelected ? "text-[#5B80FF]" : "text-slate-400"}`}>
                    {item.step}
                  </span>
                  <span className={`text-[10px] font-semibold tracking-wider uppercase ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {item.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className={`text-sm sm:text-base font-semibold leading-snug ${isSelected ? "text-white" : "text-[#0E1E38]"}`}>
                    {item.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            BÖLÜM 3: GENİŞ EKRAN VİTRİNİ (SOL: ANLATIM, SAĞ: GERÇEK WEBSİTESİ SNAPSHOT)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Sol Kolon: Editoryal Bilgi ve Vurgular (5 Kolon) */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-6"
              >
                <span className="text-xs font-mono font-bold text-[#004BFA] tracking-widest block">
                  {activeFeature.step} / {activeFeature.category}
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0E1E38] tracking-tight leading-tight clash-title">
                  {activeFeature.title}
                </h3>

                <p className="text-base sm:text-lg text-slate-700 font-medium leading-snug">
                  {activeFeature.subtitle}
                </p>

                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Vurgu Maddeleri */}
                <div className="pt-4 space-y-3 border-t border-slate-200/80">
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
                    <span>Bu özelliği kendi portföyünüzde deneyin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sağ Kolon: Gerçek Ekran Görüntüsü (7 Kolon, Geniş ve Büyüleyici) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-slate-200/60 bg-white"
              >
                {/* Minimal Tarayıcı Çubuğu */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#F5F7FA] border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                    finai.net.tr{activeFeature.url}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Canlı Sistem</span>
                </div>

                {/* Kullanıcının Yüklediği Birebir Gerçek Snapshot */}
                <div className="relative aspect-[16/10] w-full bg-slate-50">
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

        {/* =========================================================================
            BÖLÜM 4: 4'LÜ TAM GENİŞLİK İÇGÖRÜ MATRİSİ (HAKKIMIZDA DÜZENİ)
            ========================================================================= */}
        <div className="mt-20 pt-16 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1.5">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              %100
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Doğrulanmış Borsa Verisi
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Borsa İstanbul ve TEFAS sistemlerinden filtrelenmiş resmi piyasa matematiği.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              Tek
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Konsolide Konsol
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Hisseler, yatırım fonları, makro takvim ve haberler tek bir akıllı ekranda.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              10 Sn
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Hap Özetleme Hızı
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Sayfalarca KAP bildirimini ve bilançoyu saniyeler içinde anlaşılır kılan yapay zekâ.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
              24/7
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium block">
              Kesintisiz Analitik
            </span>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Piyasa kapanışlarında bile portföyünüzün stres testleri ve korelasyon hesapları hazır.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
