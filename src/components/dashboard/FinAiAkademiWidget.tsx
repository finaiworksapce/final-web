"use client";

import React from "react";
import { GraduationCap, ArrowRight, Sparkles, BookOpen, Brain, Clock, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function FinAiAkademiWidget() {
  const router = useRouter();

  const handleWidgetClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push("/dashboard/akademi");
  };

  return (
    <div
      onClick={handleWidgetClick}
      className="cursor-pointer bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 hover:border-[#004BFA] rounded-2xl min-[360px]:rounded-3xl p-3 min-[360px]:p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 min-h-[250px] h-full flex flex-col justify-between group relative overflow-hidden font-clash"
    >
      {/* Sürekli AI Loop Arka Plan Parıltısı */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/40 to-transparent rounded-full blur-2xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/15 rounded-full blur-xl pointer-events-none"
      />

      {/* 1. Üst Başlık & Rozet */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D6E4FF]/60 dark:border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#040989] dark:text-[#F5F7FA] shrink-0">
            <GraduationCap className="w-4 h-4 text-[#004BFA] dark:text-[#D6E4FF]" />
          </div>
          <div>
            <h3 className="text-xs sm:text-[13px] clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight flex items-center gap-1.5">
              <span>FinAi Akademi</span>
              <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-[#D6E4FF]/50 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20">
                AI Eğitim Modülü
              </span>
            </h3>
          </div>
        </div>

        {/* AI Loop Pulsing Status Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] clash-subtitle font-[325]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span>Geliştirme Aşamasında</span>
        </div>
      </div>

      {/* 2. Orta İçerik: İnteraktif Kurs & Simülatör Kart Önizlemeleri */}
      <div className="my-auto py-2.5 relative z-10 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
            <Brain className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-tight">
            Yapay Zekâ ile Finansal Okuryazarlık ve Portföy Yönetimi
          </h4>
        </div>

        <p className="text-[11px] sm:text-xs clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 leading-relaxed line-clamp-2">
          Algoritmik stratejiler, BIST ve TEFAS piyasa modelleri, risk-getiri optimizasyonu ve canlı vaka simülatörleri yakında burada!
        </p>

        {/* Mini Müfredat Hapları */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#F5F7FA] dark:bg-white/5 border border-[#D6E4FF]/60 dark:border-white/10 text-[10px] clash-subtitle font-[325] text-[#040989] dark:text-[#D6E4FF]">
            <BookOpen className="w-3 h-3 text-[#004BFA] shrink-0" />
            <span className="truncate">Portföy Optimizasyonu</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#F5F7FA] dark:bg-white/5 border border-[#D6E4FF]/60 dark:border-white/10 text-[10px] clash-subtitle font-[325] text-[#040989] dark:text-[#D6E4FF]">
            <Sparkles className="w-3 h-3 text-[#004BFA] shrink-0" />
            <span className="truncate">BIST & TEFAS Analizi</span>
          </div>
        </div>
      </div>

      {/* 3. Alt Durum Çubuğu & Sayfaya Gitme Aksiyonu */}
      <div className="pt-2 border-t border-[#D6E4FF]/60 dark:border-white/10 relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] clash-desc font-[225] text-amber-700 dark:text-amber-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">Yakında Kullanılacaktır • Geliştirme Aşamasında</span>
        </div>

        <button
          onClick={() => router.push("/dashboard/akademi")}
          className="shrink-0 px-2.5 py-1 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-[11px] clash-subtitle font-[325] transition-all flex items-center gap-1 shadow-xs group-hover:translate-x-0.5 duration-200"
        >
          <span>Akademiye Git</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
}
