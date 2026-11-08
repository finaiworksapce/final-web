"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeatureSteps } from "@/components/ui/feature-section";
import { FAQAccordionSection } from "@/components/ui/accordion-feature-section";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Brain,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Lock,
  Globe2,
  BarChart3
} from "lucide-react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";

// Canlı Ticker Şeridi Verileri
const TICKER_ITEMS = [
  { symbol: "BIST 100", price: "10.428,50", change: "+%1.42", isPositive: true },
  { symbol: "THYAO", price: "₺312,50", change: "+%3.24", isPositive: true },
  { symbol: "TUPRS", price: "₺174,20", change: "+%1.82", isPositive: true },
  { symbol: "MAC (Yatırım Fonu)", price: "₺0,245", change: "+%2.15", isPositive: true },
  { symbol: "ASELS", price: "₺68,40", change: "+%0.88", isPositive: true },
  { symbol: "KCHOL", price: "₺218,00", change: "+%2.35", isPositive: true },
  { symbol: "TCMB Politika Faizi", price: "%50,00", change: "Sabit", isPositive: true },
  { symbol: "ALTIN (Gram)", price: "₺3.140", change: "+%0.64", isPositive: true },
];

export default function HomeClient() {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Oturumu açık kullanıcılar için sayfa içeriğini göstermeden doğrudan dashboard'a aktar
  if (isAuthenticated === true) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo.png"
            alt="FinAi Logo"
            width={64}
            height={64}
            className="animate-pulse object-contain"
            priority
          />
          <p className="text-sm font-semibold text-[#0E1E38] tracking-wide">
            Yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-white text-slate-800 relative font-clash overflow-x-hidden selection:bg-blue-100 selection:text-[#0E1E38]"
    >
      {/* FULL WHITE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-white" />

      {/* Navigasyon */}
      <Navbar />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        
        {/* =========================================================================
            BÖLÜM 1: YENİ NESİL HERO / ANA SAYFA BÖLÜMÜ (CANLI VE GÜÇLÜ)
            ========================================================================= */}
        <section
          id="hero"
          className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 w-full overflow-hidden"
        >
          {/* Atmosferik Işıklandırma ve Arka Plan Gradyanları */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[450px] bg-gradient-to-tr from-[#004BFA]/10 via-[#78B8F5]/15 to-transparent blur-[140px] rounded-full pointer-events-none -z-0" />
          <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none -z-0" />

          {/* Ana İçerik Kapsayıcısı */}
          <div className="max-w-6xl mx-auto w-full px-6 relative z-10">
            <div className="text-center space-y-5 sm:space-y-7 max-w-4xl mx-auto">
              
              {/* Üst Rozet / Live Status Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-[#0E1E38] tracking-wide shadow-2xs hover:bg-slate-200/60 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#004BFA] animate-pulse" />
                <span>BIST 100 & TEFAS Fonları Canlı Entegre • Yapay Zekâ Analiz Motoru</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#004BFA]/10 text-[#004BFA] uppercase">
                  v2.0
                </span>
              </motion.div>

              {/* Ana Başlık */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-[#0E1E38] leading-[1.05] clash-title"
              >
                Finansal Geleceğinizi{" "}
                <span className="text-[#004BFA]">Rasyonel Zekayla</span> Yönetin.
              </motion.h1>

              {/* Alt Açıklama */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-xl md:text-2xl text-slate-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
              >
                BIST pay senetlerinizi ve TEFAS fonlarınızı tek bir akıllı terminalde birleştirin.{" "}
                <span className="text-[#0E1E38] font-semibold">Stres testleri, korelasyon matrisi</span> ve anlık piyasa istihbaratıyla portföyünüzün mutlak kontrolünü elinize alın.
              </motion.p>

              {/* Eyleme Çağrı Butonları (Dual CTA) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2 sm:pt-4"
              >
                <Link
                  href="/login?tab=register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full shadow-lg shadow-[#0E1E38]/15 hover:shadow-xl transition-all duration-200 active:scale-98 group cursor-pointer"
                >
                  <span>Hemen Ücretsiz Başlayın</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-100 hover:bg-slate-200 text-[#0E1E38] text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer"
                >
                  <span>Özellikleri Keşfet</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </motion.div>

              {/* Güven ve Kolaylık Belirteçleri */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 font-medium pt-1"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kredi kartı gerekmez
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1 dakikada ücretsiz kurulum
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Canlı BIST & TEFAS verileri
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 99+ Stres senaryosu
                </span>
              </motion.div>
            </div>

            {/* =========================================================================
                CANLI PİYASA TICKER ŞERİDİ
                ========================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-12 sm:mt-16 w-full overflow-hidden bg-slate-50/80 border border-slate-200/70 rounded-2xl py-2.5 px-4 shadow-2xs"
            >
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-none text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Canlı Göstergeler:
                </span>
                {TICKER_ITEMS.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 shrink-0 font-medium">
                    <span className="font-bold text-[#0E1E38]">{item.symbol}</span>
                    <span className="font-numbers text-slate-700">{item.price}</span>
                    <span className="font-numbers font-bold text-emerald-600 text-[11px]">
                      {item.change}
                    </span>
                    {idx < TICKER_ITEMS.length - 1 && (
                      <span className="text-slate-300 ml-2">/</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* =========================================================================
                İNTERAKTİF FİNAİ KONSOL & TERMİNAL ÖNİZLEMESİ (MOCKUP COCKPIT)
                ========================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="mt-6 sm:mt-8 w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden"
            >
              {/* Konsol Üst Pencere Çubuğu */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 ml-2 hidden sm:inline-block">
                    FinAi Intelligence Terminal • Canlı Portföy Konsolu
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Piyasalar Canlı
                  </span>
                </div>
              </div>

              {/* Konsol İç Grid (3 Modüler Blok) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
                
                {/* 1. Blok: Net Portföy Özeti & Varlık Kompozisyonu (5 Kolon) */}
                <div className="md:col-span-5 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Toplam Portföy Değeri
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-normal text-[#0E1E38] font-numbers">
                        ₺645.050,00
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 font-numbers inline-flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +%3.84
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-5">
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                      <span>Varlık Dağılımı</span>
                      <span className="font-numbers">3 Sınıf</span>
                    </div>
                    {/* Dağılım Çubuğu */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-full flex overflow-hidden">
                      <div className="bg-[#0E1E38] h-full" style={{ width: "58%" }} title="BIST %58" />
                      <div className="bg-[#004BFA] h-full" style={{ width: "32%" }} title="TEFAS %32" />
                      <div className="bg-emerald-500 h-full" style={{ width: "10%" }} title="Nakit %10" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-[#0E1E38]">
                        <span className="w-2 h-2 rounded-full bg-[#0E1E38]" /> BIST %58
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#004BFA]">
                        <span className="w-2 h-2 rounded-full bg-[#004BFA]" /> TEFAS %32
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Rezerv %10
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Blok: Yapay Zekâ Stres & Dayanıklılık Özeti (4 Kolon) */}
                <div className="md:col-span-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Yapay Zekâ Analitiği
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100/70 text-[#004BFA]">
                        99 Senaryo
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0E1E38] pt-1">
                      Döviz Şoku ve Faiz Dayanıklılığı
                    </h4>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed">
                      İhracatçı sanayi hisseleriniz kur artışlarında kalkan oluşturarak portföy dalgalanmasını dengeliyor.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Direnç Skoru</span>
                      <span className="text-base font-bold text-emerald-700 font-numbers">88 / 100</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Yüksek Koruma
                    </span>
                  </div>
                </div>

                {/* 3. Blok: Anlık KAP & Takvim İstihbaratı (3 Kolon) */}
                <div className="md:col-span-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Piyasa İstihbaratı
                    </span>

                    <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-2xs">
                      <span className="text-[9px] font-bold text-[#004BFA] uppercase block">KAP • THYAO</span>
                      <p className="text-[11px] font-medium text-slate-800 line-clamp-2 mt-0.5">
                        2026/3Ç Kârı Beklentilerin %14 Üzerinde.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-2xs">
                      <span className="text-[9px] font-bold text-amber-600 uppercase block">Ekonomik Takvim</span>
                      <p className="text-[11px] font-medium text-slate-800 line-clamp-1 mt-0.5">
                        TCMB Faiz Kararı: Perşembe 14:00
                      </p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Link
                      href="/login?tab=register"
                      className="text-xs font-bold text-[#004BFA] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Terminali İncele</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 2: YENİ NESİL ÖZELLİKLER & ANALİTİK VİTRİN
            ========================================================================= */}
        <section id="features" className="w-full bg-white relative z-20">
          <FeatureSteps title="Özellikler" />
        </section>

        {/* =========================================================================
            BÖLÜM 3: MERAK ETTİKLERİNİZ (FAQ) — ÇERÇEVESİZ & EDİTORYAL
            ========================================================================= */}
        <FAQAccordionSection />

        {/* =========================================================================
            BÖLÜM 4: MINIMALIST VE GENİŞ CALL TO ACTION (EYLEME ÇAĞRI)
            ========================================================================= */}
        <section className="w-full bg-white py-16 sm:py-24 border-t border-slate-200/80 relative z-20">
          <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 block">
                Bilinçli Yatırıma Adım Atın
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0E1E38] tracking-tight leading-snug clash-title">
                Finansal geleceğinizi şansa değil, rasyonel verilere emanet edin.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/login?tab=register"
                className="px-8 py-4 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm cursor-pointer"
              >
                <span>Hemen Ücretsiz Başlayın</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-transparent hover:bg-slate-50 text-[#0E1E38] text-sm font-semibold rounded-full border border-slate-300 transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>Vizyonumuzu İnceleyin</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FOOTER
            ========================================================================= */}
        <div className="w-full relative z-10 bg-white">
          <Footer />
        </div>
      </main>
    </div>
  );
}
