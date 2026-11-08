"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Sliders,
  Target,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Layers,
  Sparkles,
  PieChart,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureSectionProps {
  title?: string;
  className?: string;
}

// 4 Ana Sekme İçeriği (Interactive Tab Showcase)
const CORE_PILLARS = [
  {
    id: "portfolio",
    tabTitle: "Canlı Portföy Terminali",
    icon: PieChart,
    badge: "Çekirdek Altyapı",
    headline: "BIST Hisseleri ve TEFAS Fonları Tek Dinamik Ekranda",
    description:
      "Borsa İstanbul'daki pay senetlerinizi ve TEFAS'taki tüm yatırım fonlarınızı tek bir konsolda birleştirin. Saniyelik piyasa fiyatlarıyla toplam varlık değerinizi, kâr/zarar durumunuzu ve ağırlık dağılımınızı anlık takip edin.",
    highlights: [
      "Canlı BIST 100 & Tüm Pay Piyasası Fiyatları",
      "TEFAS Yatırım Fonları & Günlük Getiri Takibi",
      "Otomatik Ağırlıklı Ortalama Maliyet & Net Kâr",
      "Kıymetli Maden & TL Nakit Rezerv Konsolidasyonu"
    ],
    metricValue: "₺645.050",
    metricLabel: "Konsolide Portföy Değeri",
    metricChange: "+%3.84 Bugün",
    visualType: "portfolio"
  },
  {
    id: "scenarios",
    tabTitle: "Olası Senaryo Simülatörü",
    icon: Sliders,
    badge: "Stres Testi",
    headline: "Piyasa Şoklarında Portföyünüzün Dayanıklılığını Test Edin",
    description:
      "Döviz kuru sıçraması, ani faiz artışı veya jeopolitik gerginlik gibi 99+ farklı piyasa senaryosunda portföyünüzün nasıl tepki vereceğini matematiksel simülasyon modelleriyle önceden görün.",
    highlights: [
      "99+ Hazır Makro & Sektörel Kriz Senaryosu",
      "Döviz Kuru & Faiz Değişimi Duyarlılık Testi",
      "Portföy Dayanıklılık Skoru (0-100)",
      "Olası Kayıp/Kazanç Matrisi ve Koruma Önerileri"
    ],
    metricValue: "88 / 100",
    metricLabel: "Portföy Dayanıklılık Skoru",
    metricChange: "Yüksek Koruma Seviyesi",
    visualType: "scenarios"
  },
  {
    id: "correlation",
    tabTitle: "Korelasyon & Risk Matrisi",
    icon: Layers,
    badge: "Risk Yönetimi",
    headline: "Varlıklar Arası Gizli Bağımlılıkları Keşfedin",
    description:
      "Farklı hisse ve fonlarınızın birbiriyle olan korelasyon katsayılarını hesaplayarak portföyünüzün sahte çeşitlendirme tuzağına düşmesini engelleyin; riskinizi rasyonel şekilde dağıtın.",
    highlights: [
      "Çapraz Varlık Korelasyon Katsayıları (-1 ile +1)",
      "Sektörel Yoğunlaşma ve Beta Risk Analizi",
      "Dalgalanma (Volatilite) Azaltıcı Varlık Önerileri",
      "Etkin Sınır (Efficient Frontier) Portföy Dengesi"
    ],
    metricValue: "-0.24",
    metricLabel: "Hisse / Fon Korelasyonu",
    metricChange: "İdeal Negatif Ayrışma",
    visualType: "correlation"
  },
  {
    id: "intelligence",
    tabTitle: "Yapay Zekâ Piyasa İstihbaratı",
    icon: Sparkles,
    badge: "Haber & İstihbarat",
    headline: "Gürültüden Arındırılmış KAP ve Makro Özetleri",
    description:
      "Portföyünüzdeki şirketleri doğrudan etkileyen bilanço açıklamalarını, temettü kararlarını ve makroekonomik gelişmeleri yapay zekâ süzgecinden geçmiş net hap notlar olarak okuyun.",
    highlights: [
      "KAP Bildirimlerinin Yapay Zekâ ile Anlık Özeti",
      "Ekonomik Takvim & Beklenti/Gerçekleşen Analizi",
      "Temettü, Bilanço ve Halka Arz Takvimi",
      "Şirket Bazlı Duyarlılık ve Haber Etki Puanı"
    ],
    metricValue: "12 Saniyelik",
    metricLabel: "KAP Özetleme Hızı",
    metricChange: "Tam Filtrelenmiş Veri",
    visualType: "intelligence"
  }
];

export function FeatureSteps({
  title = "Özellikler",
  className,
}: FeatureSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const activeFeature = CORE_PILLARS[activeTab];

  return (
    <section
      id="features"
      className="w-full bg-white text-[#0E1E38] py-20 sm:py-28 overflow-hidden relative"
    >
      {/* İnce Arka Plan Işık Efekti */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#004BFA]/5 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-[#78B8F5]/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 relative z-10">
        
        {/* =========================================================================
            BÖLÜM BAŞLIĞI: MODERN EDİTORYAL HİYERARŞİ
            ========================================================================= */}
        <div className="max-w-4xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-xs font-semibold text-[#0E1E38] tracking-wide mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#004BFA] animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] font-bold text-slate-600">
              {title} & Analitik Terminal
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight clash-title">
            Yatırım kararlarınızı matematik ve şeffaf verilerle güçlendiren analitik bloklar.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal mt-4 max-w-2xl leading-relaxed">
            BIST ve TEFAS piyasalarını karmaşık tablolardan çıkarıp, her biri amaca hizmet eden
            modern bir karar destek sistemine dönüştürdük.
          </p>
        </div>

        {/* =========================================================================
            İNTERAKTİF SEKME NAVİGASYONU (TAB CONTROLLER)
            ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80 mb-10">
          {CORE_PILLARS.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`relative px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "text-[#0E1E38] bg-slate-100/90 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isSelected ? "text-[#004BFA]" : "text-slate-400"}`} />
                <span>{item.tabTitle}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeFeatureIndicator"
                    className="absolute -bottom-[9px] left-0 right-0 h-[2.5px] bg-[#004BFA] rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            AKTİF ÖZELLİK VİTRİNİ (INTERACTIVE SHOWCASE HERO CARD)
            ========================================================================= */}
        <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-3xl p-6 sm:p-10 md:p-12 mb-16 shadow-xs">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Sol Taraf: Açıklama ve Özellik Maddeleri */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#004BFA] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activeFeature.badge}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0E1E38] tracking-tight leading-snug clash-title">
                  {activeFeature.headline}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Öne Çıkanlar Listesi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeFeature.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#004BFA] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Aksiyon Linki */}
                <div className="pt-4">
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E1E38] hover:text-[#004BFA] transition-colors group"
                  >
                    <span>Bu özelliği kendi portföyünüzde deneyin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Sağ Taraf: İnteraktif Görsel / Mockup Kartı */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-sm relative overflow-hidden">
                  
                  {/* Başlık Çubuğu */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span className="text-xs font-semibold text-slate-700">{activeFeature.tabTitle}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Canlı Sistem
                    </span>
                  </div>

                  {/* Görsel Çeşitlerine Göre İçerik */}
                  {activeFeature.visualType === "portfolio" && (
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-medium block">Toplam Portföy</span>
                          <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] font-numbers mt-0.5 block">
                            ₺645.050,00
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 font-numbers inline-flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +%3.84 Günlük
                        </span>
                      </div>

                      {/* Dağılım Çubuğu */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                          <span>Varlık Kompozisyonu</span>
                          <span className="font-numbers">3 Varlık Grubu</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                          <div className="bg-[#0E1E38] h-full" style={{ width: "58%" }} title="BIST %58" />
                          <div className="bg-[#004BFA] h-full" style={{ width: "32%" }} title="TEFAS %32" />
                          <div className="bg-emerald-500 h-full" style={{ width: "10%" }} title="Nakit %10" />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0E1E38]" /> BIST Payları %58</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#004BFA]" /> TEFAS Fonları %32</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Rezerv Nakit %10</span>
                        </div>
                      </div>

                      {/* Örnek 2 Varlık Satırı */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0E1E38]">THYAO</span>
                            <span className="text-[10px] text-slate-400">BIST 30</span>
                          </div>
                          <div className="text-right">
                            <span className="font-numbers font-medium text-slate-800">₺312.50</span>
                            <span className="text-[11px] font-semibold text-emerald-600 block">+%3.2</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#004BFA]">MAC</span>
                            <span className="text-[10px] text-slate-400">Marmara Cap. Fonu</span>
                          </div>
                          <div className="text-right">
                            <span className="font-numbers font-medium text-slate-800">₺0.245</span>
                            <span className="text-[11px] font-semibold text-emerald-600 block">+%2.1</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature.visualType === "scenarios" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-medium block">Aktif Stres Senaryosu</span>
                          <span className="text-lg font-bold text-[#0E1E38]">Döviz Kuru Şoku (+%15 Kur Artışı)</span>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                          Dayanıklı
                        </span>
                      </div>

                      {/* Dayanıklılık Metriği */}
                      <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700">Tahmini Net Portföy Etkisi</span>
                          <span className="font-numbers font-bold text-emerald-600">+%4.82 Kazanç</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88%" }} />
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          İhracatçı paylarınız döviz şokunu pozitif avantaja dönüştürmektedir.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Faiz Artışı (+250 bps)</span>
                          <span className="font-numbers font-bold text-slate-700">-%1.20 (Hafif Baskı)</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Emtia Rallisi</span>
                          <span className="font-numbers font-bold text-emerald-600">+%2.40 (Korunaklı)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeature.visualType === "correlation" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-medium block">Korelasyon Skoru</span>
                          <span className="text-xl font-bold text-[#0E1E38] font-numbers">-0.24 (Dengeli Ayrışma)</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Düşük Risk
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-700">Sanayi Payları & Altın Fonu</span>
                          <span className="font-numbers font-bold text-emerald-600">-0.42 (Ters Hareket)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-700">Teknoloji & Bankacılık</span>
                          <span className="font-numbers font-bold text-blue-600">+0.28 (Bağımsız)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                          <span className="font-semibold text-slate-700">TEFAS Değişken Fon & BIST 100</span>
                          <span className="font-numbers font-bold text-slate-700">+0.55 (Ilımlı Uyum)</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight">
                        Negatif korelasyonlu varlıklar sayesinde piyasa düşüşlerinde portföyünüzün dalgalanma riski %34 daha düşüktür.
                      </p>
                    </div>
                  )}

                  {activeFeature.visualType === "intelligence" && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[#004BFA] uppercase tracking-wider">KAP Bildirimi • THYAO</span>
                          <span className="text-[10px] text-slate-400">14 dk önce</span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 line-clamp-2">
                          2026/3Ç Finansal Sonuçları Açıklandı: Net Kâr Beklentileri %14 Aşarak Güçlü Performans Gösterdi.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Ekonomik Takvim</span>
                          <span className="text-[10px] text-slate-400">Perşembe 14:00</span>
                        </div>
                        <p className="text-xs font-medium text-slate-800">
                          TCMB Para Politikası Kurulu (PPK) Faiz Kararı: Beklenti Sabit (%50).
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> Yapay zekâ analiz özeti hazır
                        </span>
                        <span className="font-semibold text-[#0E1E38]">Anlık Bildirim Açık</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =========================================================================
            İKİNCİ KATMAN: 3'LÜ YARDIMCI ANALİTİK KARTLAR (BENTO COMPACT)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Kart 1: Model Dağılım */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-7 border border-slate-200/60 flex flex-col justify-between hover:bg-[#F3F6FB] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0E1E38] shadow-2xs">
                <Target className="w-5 h-5 text-[#004BFA]" />
              </div>
              <h4 className="text-lg font-bold text-[#0E1E38] tracking-tight clash-title">
                Yatırım Karakteri & Profil Testi
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Risk toleransınızı ve yatırım vadenizi ölçen interaktif test ile kişisel hedefinize en uygun varlık sepetini keşfedin.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Hedef Model: Dengeli Sepet</span>
              <span className="text-[#004BFA] font-bold">Testi Yap →</span>
            </div>
          </div>

          {/* Kart 2: Finansal Takvim */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-7 border border-slate-200/60 flex flex-col justify-between hover:bg-[#F3F6FB] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0E1E38] shadow-2xs">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-[#0E1E38] tracking-tight clash-title">
                Şirket & Makro Olay Takvimi
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Temettü dağıtım tarihleri, bilanço açıklama günleri ve halka arz takvimi tek bir senkronize akışta önünüzde.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Temettü & Bilanço Senkron</span>
              <span className="text-emerald-700 font-bold">Takvimi İncele →</span>
            </div>
          </div>

          {/* Kart 3: Şeffaflık & Güven */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-7 border border-slate-200/60 flex flex-col justify-between hover:bg-[#F3F6FB] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-[#0E1E38] shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold text-[#0E1E38] tracking-tight clash-title">
                Şeffaf Veri & Yüksek Güvenlik
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Tüm verileriniz uçtan uca şifrelemeyle korunur. Yatırım tavsiyesi değil, bağımsız ve objektif matematiksel karar desteği.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>KVKK & AB Standartları</span>
              <span className="text-indigo-600 font-bold">Güvenlik Raporu →</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            ALT EYLEME ÇAĞRI (CALL TO ACTION)
            ========================================================================= */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base text-slate-600 font-normal text-center sm:text-left">
            Tüm bu analitik araçları ücretsiz olarak hemen kendi portföyünüzde deneyimleyin.
          </p>

          <Link
            href="/login?tab=register"
            className="px-8 py-3.5 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full transition-all flex items-center gap-2 shadow-sm active:scale-98 shrink-0"
          >
            <span>Hemen Ücretsiz Başlayın</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
