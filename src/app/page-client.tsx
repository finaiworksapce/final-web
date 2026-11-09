"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FeatureSteps } from "@/components/ui/feature-section";
import { FAQAccordionSection } from "@/components/ui/accordion-feature-section";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
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

  // Oturumu açık kullanıcılar için doğrudan dashboard'a aktar
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
      {/* Sayfa Zemini */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-white" />

      {/* Navigasyon */}
      <Navbar />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        
        {/* =========================================================================
            BÖLÜM 1: TAM GENİŞLİK HERO (HAKKIMIZDA DÜZENİ — SAYFANIN HER YANINA HÂKİM)
            ========================================================================= */}
        <section
          id="hero"
          className="relative pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 w-full border-b border-slate-200/80"
        >
          {/* Gradyan Renk Paleti Arka Plan Işık Efekti */}
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#004BFA]/10 via-[#5B80FF]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-0" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D6E4FF]/40 blur-[130px] rounded-full pointer-events-none -z-0" />

          {/* Sayfanın Tüm Genişliğini Kullanan Kapsayıcı */}
          <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              {/* Sol Kolon: Büyük Başlık, Açıklama ve CTA (7 Kolon) */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3"
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[66px] font-normal tracking-tight text-[#0E1E38] leading-[1.08] clash-title">
                    Hiçbir şey bilmeseniz bile,{" "}
                    <span className="text-[#004BFA]">şirketleri günlük hayatın diliyle</span> anlayın.
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl"
                >
                  Korkutucu finans jargonu bitti. Borsa İstanbul şirketlerinin bilançolarını, kârlarını ve KAP haberlerini sokaktaki dükkan basitliğinde açıklıyoruz. Finansal okuryazarlığınızı sıfırdan, kolay ve eğlenceli şekilde geliştirin.
                </motion.p>

                {/* Eyleme Çağrı Butonları */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2"
                >
                  <Link
                    href="/login?tab=register"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#02041A] via-[#040989] to-[#004BFA] hover:opacity-95 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg shadow-[#040989]/20 transition-all duration-200 active:scale-98 group cursor-pointer"
                  >
                    <span>Ücretsiz Öğrenmeye Başla</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#F5F7FA] hover:bg-slate-200 text-[#0E1E38] text-sm sm:text-base font-semibold rounded-full border border-slate-200/80 transition-all duration-200 cursor-pointer"
                  >
                    <span>Özellikleri İncele</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </motion.div>

              </div>

              {/* Sağ Kolon: Saf Tipografi Metrik & Değer Matrisi (5 Kolon — Kutusuz, Rozetsiz, Sayfaya Hâkim) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10 lg:pl-10 lg:border-l lg:border-slate-200/80 pt-4 lg:pt-2"
              >
                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                    0 Jargon
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                    Günlük Hayat Dili
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                    Bilanço ve kârları mahalle fırını basitliğinde, herkesin ilk bakışta anlayabileceği metaforlarla açıklıyoruz.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                    %100
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                    Eğlenceli Okuryazarlık
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                    Hiç finans geçmişiniz olmasa bile şirketlerin para kazanma mantığını sıfırdan ve keyifle kavrayın.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                    Canlı
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                    Borsa İstanbul
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                    Spekülasyon değil; doğrulanmış BIST seans verileri ve resmi şirket bilançolarıyla şeffaf piyasa takibi.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                    10 Sn
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                    Hap KAP Özeti
                  </span>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                    Yüzlerce sayfalık resmi şirket duyurularını saniyeler içinde "Bu ne anlama gelir?" özetiyle sunan yapay zekâ.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 2: ÖZELLİKLER (TAM GENİŞLİK, 4 GERÇEK SNAPSHOT İLE)
            ========================================================================= */}
        <FeatureSteps title="Özellikler" />

        {/* =========================================================================
            BÖLÜM 3: MERAK ETTİKLERİNİZ (FAQ)
            ========================================================================= */}
        <FAQAccordionSection />

        {/* =========================================================================
            BÖLÜM 4: EYLEME ÇAĞRI (CALL TO ACTION)
            ========================================================================= */}
        <section className="w-full bg-white py-20 sm:py-28 border-t border-slate-200/80 relative z-20">
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
                className="px-8 py-4 bg-gradient-to-r from-[#02041A] via-[#040989] to-[#004BFA] hover:opacity-95 text-white text-sm font-semibold rounded-full shadow-lg shadow-[#040989]/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
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
