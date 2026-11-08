"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeatureSteps } from "@/components/ui/feature-section";
import { FAQAccordionSection } from "@/components/ui/accordion-feature-section";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Check } from "lucide-react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";

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
      {/* Arka Plan */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-white" />

      {/* Navigasyon */}
      <Navbar />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        
        {/* =========================================================================
            BÖLÜM 1: ANA SAYFA HERO BÖLÜMÜ (ROZETSİZ, SADE, GERÇEK SNAPSHOT İLE)
            ========================================================================= */}
        <section
          id="hero"
          className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 w-full"
        >
          <div className="max-w-6xl mx-auto w-full px-6 relative z-10">
            
            {/* Metin ve Başlık Alanı */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              
              {/* Ana Başlık (Rozetsiz, saf editoryal tipografi) */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-[#0E1E38] leading-[1.06] clash-title"
              >
                Finansal Geleceğinizi{" "}
                <span className="text-[#004BFA]">Rasyonel Zekayla</span> Yönetin.
              </motion.h1>

              {/* Alt Açıklama */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-base sm:text-xl md:text-2xl text-slate-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed"
              >
                BIST hisselerinizi ve TEFAS fonlarınızı tek bir dinamik ekranda toplayın.{" "}
                <span className="text-[#0E1E38] font-semibold">Stres testleri, korelasyon analizleri</span> ve anlık piyasa istihbaratıyla portföyünüzün kontrolünü elinize alın.
              </motion.p>

              {/* Eyleme Çağrı Butonları */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2 sm:pt-4"
              >
                <Link
                  href="/login?tab=register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full shadow-lg shadow-[#0E1E38]/15 hover:shadow-xl transition-all duration-200 active:scale-98 group cursor-pointer"
                >
                  <span>Ücretsiz Hesap Oluştur</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#features"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-100 hover:bg-slate-200 text-[#0E1E38] text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer"
                >
                  <span>Özellikleri İncele</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </motion.div>

              {/* Güven ve Kolaylık Belirteçleri (Rozetsiz, sade metin) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 font-medium pt-2"
              >
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Kredi kartı gerekmez
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> 1 dakikada ücretsiz kurulum
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Canlı BIST ve TEFAS
                </span>
              </motion.div>
            </div>

            {/* =========================================================================
                GERÇEK UYGULAMA EKRAN GÖRÜNTÜSÜ (BROWSER MOCKUP - GERÇEK SNAPSHOT)
                ========================================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mt-12 sm:mt-16 w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-slate-300/40 bg-white"
            >
              {/* Tarayıcı Üst Çubuğu */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100/90 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
                <div className="bg-white px-4 py-1 rounded-md text-[11px] font-mono text-slate-500 border border-slate-200/80 max-w-sm w-full text-center truncate hidden sm:block">
                  https://finai.net.tr/dashboard/portfolio
                </div>
                <div className="w-12 text-right">
                  <span className="text-[11px] font-medium text-slate-400">Canlı</span>
                </div>
              </div>

              {/* Gerçek Web Sitesi Portföy Snapshot'ı */}
              <div className="relative aspect-[16/9] w-full bg-slate-50">
                <Image
                  src="/images/portfolio_tracking_white.jpg"
                  alt="FinAi Canlı Portföy Takip Ekranı"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 2: ÖZELLİKLER (GERÇEK SNAPSHOT'LAR VE EDİTORYAL DÜZEN)
            ========================================================================= */}
        <FeatureSteps title="Özellikler" />

        {/* =========================================================================
            BÖLÜM 3: MERAK ETTİKLERİNİZ (FAQ)
            ========================================================================= */}
        <FAQAccordionSection />

        {/* =========================================================================
            BÖLÜM 4: EYLEME ÇAĞRI (CALL TO ACTION)
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
