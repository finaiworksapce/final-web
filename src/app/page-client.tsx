"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";
import { FeatureSteps } from "@/components/ui/feature-section";
import { FAQAccordionSection } from "@/components/ui/accordion-feature-section";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TrendingUp,
  Brain,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";

export default function HomeClient() {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const containerRef = useRef(null);

  // Oturumu açık kullanıcılar için sayfa içeriğini göstermeden doğrudan dashboard'a aktar
  if (isAuthenticated === true) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="FinAi Logo" width={64} height={64} className="animate-pulse object-contain" priority />
          <p className="text-sm font-semibold text-[#0E1E38] tracking-wide">Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  const testimonialsData = [
    {
      id: 1,
      initials: 'AY',
      name: 'Ahmet Yılmaz',
      role: 'Bireysel Yatırımcı',
      quote: "Hisse ve fonlarımı tek ekrandan takip ediyorum. Portföy yönetimi artık çok daha kolay.",
      tags: [{ text: 'BIST', type: 'featured' as const }, { text: 'Portföy', type: 'default' as const }],
      stats: [{ icon: TrendingUp, text: 'Aktif' }],
      avatarGradient: 'linear-gradient(135deg, #00008B, #1e3a8a)',
    },
    {
      id: 2,
      initials: 'ZK',
      name: 'Zeynep Kara',
      role: 'Fon Yatırımcısı',
      quote: "TEFAS fonlarını kolayca analiz edip portföyüme ekliyorum. Arayüzü çok sade ve kullanışlı.",
      tags: [{ text: 'Bireysel', type: 'featured' as const }, { text: 'TEFAS', type: 'default' as const }],
      stats: [{ icon: Brain, text: 'AI Asistan' }],
      avatarGradient: 'linear-gradient(135deg, #78B8F5, #0E1E38)',
    },
    {
      id: 3,
      initials: 'MT',
      name: 'Mehmet Tekin',
      role: 'Yatırımcı',
      quote: "AI asistan sayesinde korelasyon analizlerimi hızlıca yapıp portföyümü dengeliyorum.",
      tags: [{ text: 'Strateji', type: 'featured' as const }, { text: 'Korelasyon', type: 'default' as const }],
      stats: [{ icon: Target, text: 'Verimli' }],
      avatarGradient: 'linear-gradient(135deg, #0E1E38, #2E5894)',
    },
    {
      id: 4,
      initials: 'CD',
      name: 'Canan Demir',
      role: 'BIST Portföy Yöneticisi',
      quote: "Olası senaryo testleri sayesinde piyasadaki sert dalgalanmalara karşı önceden strateji geliştirebiliyorum.",
      tags: [{ text: 'Senaryo Analizi', type: 'featured' as const }],
      stats: [{ icon: ShieldCheck, text: 'Güvenli' }],
      avatarGradient: 'linear-gradient(135deg, #00008B, #2563eb)',
    },
    {
      id: 5,
      initials: 'BÇ',
      name: 'Burak Çelik',
      role: 'Hisse Senedi Yatırımcısı',
      quote: "KAP ve piyasa haberlerini yapay zeka süzgecinden geçirip anında bildirmesi harika bir zaman kazancı.",
      tags: [{ text: 'Anlık Haber', type: 'featured' as const }, { text: 'KAP', type: 'default' as const }],
      stats: [{ icon: Zap, text: 'Hızlı' }],
      avatarGradient: 'linear-gradient(135deg, #78B8F5, #2E5894)',
    },
    {
      id: 6,
      initials: 'EA',
      name: 'Elif Aydın',
      role: 'Uzun Vadeli Yatırımcı',
      quote: "Kişiye özel risk testi ile yatırım karakterimi netleştirip kendime en uygun varlık dağılımını keşfettim.",
      tags: [{ text: 'Risk Testi', type: 'featured' as const }, { text: 'Karakter', type: 'default' as const }],
      stats: [{ icon: Users, text: 'Kişisel' }],
      avatarGradient: 'linear-gradient(135deg, #0E1E38, #78B8F5)',
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-white text-slate-800 relative font-clash overflow-x-hidden selection:bg-blue-100 selection:text-[#0E1E38]">
      
      {/* FULL WHITE BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-white" />

      {/* Navigasyon */}
      <Navbar />

      <main className="flex-1 relative z-10 w-full overflow-hidden">
        {/* =========================================================================
            FIRST VIEWPORT (100vh) - Hero centered, Testimonials pinned at bottom edge
            ========================================================================= */}
        <div className="min-h-screen flex flex-col justify-between pt-20 sm:pt-24 pb-4 sm:pb-6 relative w-full overflow-hidden">
          
          {/* Subtle Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-full h-[400px] bg-[#78B8F5]/15 blur-[130px] rounded-full pointer-events-none -z-0" />

          {/* HERO SECTION */}
          <section
            id="hero"
            className="my-auto w-full flex flex-col justify-center relative py-4 sm:py-6"
          >
            <div className="max-w-6xl mx-auto w-full px-6 relative">
              <div className="text-center relative z-10 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
                
                {/* Logo / Başlık */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="clash-title text-[65px] sm:text-[90px] md:text-[120px] lg:text-[135px] leading-[1.0] tracking-tight text-[#0E1E38] py-2 sm:py-4 relative flex justify-center items-center w-full mx-auto"
                >
                  <span className="relative inline-block z-10">
                    <span className="text-[#040989] px-2 clash-title">
                      FinAi
                    </span>
                    <svg className="absolute w-full h-2 sm:h-3.5 -bottom-1 left-0 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="finaiUnderlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#004BFA" />
                          <stop offset="100%" stopColor="#5B80FF" />
                        </linearGradient>
                      </defs>
                      <path d="M0 5 Q 50 10 100 5" stroke="url(#finaiUnderlineGrad)" strokeWidth="6" strokeLinecap="round" fill="transparent" />
                    </svg>
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="clash-subtitle text-base sm:text-xl md:text-2xl text-[#0E1E38]/80 max-w-3xl mx-auto leading-relaxed mt-8 sm:mt-12 md:mt-14 px-4 sm:px-0 tracking-normal"
                >
                  Tüm Yatırımlarınızı Yapay Zeka Gücüyle Tek Ekrandan Yönetin, <b className="text-[#0E1E38] clash-title">Portföyünüzün Tam Kontrolünü</b> Elinize Alın.
                </motion.p>

                {/* Mobil CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex md:hidden flex-row gap-3 justify-center items-center pt-4 sm:pt-6"
                >
                  <Link href="/login?tab=register" className="flex items-center justify-center gap-1.5 px-6 py-3 bg-[#0E1E38] hover:bg-[#102240] text-white clash-subtitle rounded-full shadow-lg transition-all text-sm tracking-wide">
                    Ücretsiz Dene
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/login" className="flex items-center justify-center px-6 py-3 bg-[#78B8F5]/15 hover:bg-[#78B8F5]/25 text-[#0E1E38] clash-subtitle rounded-full border-2 border-[#78B8F5] shadow-sm transition-all text-sm tracking-wide">
                    Giriş Yap
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS (Pinned at the bottom edge of 100vh screen fold) */}
          <section className="w-full bg-white pt-2 pb-2 sm:pb-4 relative z-20 overflow-hidden shrink-0 mt-auto">
            <InfiniteMovingCards items={testimonialsData} direction="right" speed="slow" className="w-full max-w-none" />
          </section>
        </div>

        {/* =========================================================================
            BÖLÜM 2: ÖZELLİKLER & BENTO GRID
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#0E1E38] tracking-tight leading-snug">
                Finansal geleceğinizi şansa değil, rasyonel verilere emanet edin.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/login?tab=register"
                className="px-8 py-4 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
              >
                <span>Hemen Ücretsiz Başlayın</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-transparent hover:bg-slate-50 text-[#0E1E38] text-sm font-semibold rounded-full border border-slate-300 transition-colors flex items-center justify-center"
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
