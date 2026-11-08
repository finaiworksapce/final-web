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
          {/* Gradyan Renk Paleti PDF'ine Uygun Arka Plan Işık Efekti */}
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#004BFA]/10 via-[#5B80FF]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-0" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#D6E4FF]/40 blur-[130px] rounded-full pointer-events-none -z-0" />

          {/* Sayfanın Tüm Genişliğini Kullanan Kapsayıcı */}
          <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Sol Kolon: Başlık, Anlatı, CTA ve Temel Metrikler (6 Kolon) */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8">
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#004BFA] block">
                    BIST & TEFAS İçin Rasyonel Portföy Zekası
                  </span>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-normal tracking-tight text-[#0E1E38] leading-[1.08] clash-title">
                    Finansal Geleceğinizi{" "}
                    <span className="text-[#004BFA]">Rasyonel Zekayla</span> Yönetin.
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed"
                >
                  BIST hisselerinizi ve TEFAS fonlarınızı tek bir dinamik ekranda toplayın.{" "}
                  <span className="text-[#0E1E38] font-semibold">Stres testleri, korelasyon analizleri</span> ve anlık piyasa istihbaratıyla portföyünüzün kontrolünü elinize alın.
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
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-[#02041A] via-[#040989] to-[#004BFA] hover:opacity-95 text-white text-sm font-semibold rounded-full shadow-lg shadow-[#040989]/20 transition-all duration-200 active:scale-98 group cursor-pointer"
                  >
                    <span>Ücretsiz Hesap Oluştur</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#F5F7FA] hover:bg-slate-200 text-[#0E1E38] text-sm font-semibold rounded-full border border-slate-200/80 transition-all duration-200 cursor-pointer"
                  >
                    <span>Özellikleri İncele</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </motion.div>

                {/* Güven Notu */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium pt-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Kredi kartı gerekmez
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> 1 dakikada kurulum
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Canlı BIST & TEFAS
                  </span>
                </motion.div>

                {/* 3'lü Minimalist İstatistik Çubuğu (Hakkımızda Standartı) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80"
                >
                  <div className="space-y-0.5">
                    <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                      %100
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      Veri Odaklı ve Tarafsız
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                      Tek
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      Bütünleşik Ekran
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-2xl sm:text-3xl font-normal text-[#0E1E38] block tracking-tight font-numbers">
                      0
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      Karmaşık Jargon
                    </span>
                  </div>
                </motion.div>

              </div>

              {/* Sağ Kolon: Dengeli ve Kenarları Kesilmeyen Gerçek Konsol Snapshot'ı (6 Kolon) */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="lg:col-span-6 relative w-full flex justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-xl xl:max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-[#040989]/10 bg-white">
                  
                  {/* Minimal Tarayıcı Üst Çubuğu */}
                  <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#F5F7FA] border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>
                    <div className="bg-white px-3 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono text-slate-500 border border-slate-200/80 max-w-xs w-full text-center truncate">
                      finai.net.tr/dashboard
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-medium text-slate-400">
                        Canlı
                      </span>
                    </div>
                  </div>

                  {/* Gerçek Web Uygulaması Workspace Snapshot'ı (Kenarları Kesilmeden, 1024x560 Tam Çözünürlük) */}
                  <div className="relative w-full bg-slate-100/50 p-1 sm:p-2">
                    <div className="relative w-full aspect-[1024/560] overflow-hidden rounded-lg sm:rounded-xl border border-slate-200/60 shadow-2xs">
                      <Image
                        src="/images/landing/dashboard_workspace.jpg"
                        alt="FinAi Canlı Çalışma Alanı"
                        fill
                        unoptimized
                        priority
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
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
