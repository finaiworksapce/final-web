"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function FinAiAkademiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash">
      {/* Üst Bar: Geri Dönüş */}
      <div className="w-full max-w-[2500px] mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-4 border-b border-[#D6E4FF]/60 dark:border-white/10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      {/* Merkez: FinAi Akademi - Yakında */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#004BFA]/10 border border-[#004BFA]/20 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF] mb-5 shadow-sm">
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
          FinAi Akademi
        </h1>

        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004BFA] text-white text-xs sm:text-sm clash-subtitle font-[325] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Yakında</span>
        </div>
      </div>
    </div>
  );
}
