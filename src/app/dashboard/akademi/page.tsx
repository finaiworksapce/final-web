"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function FinAiAkademiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white w-full mx-auto relative overflow-x-hidden font-clash">
      {/* Ambient Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Bar: Geri Dönüş */}
      <div className="w-full max-w-[2500px] mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-4 border-b border-white/10 relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs clash-subtitle font-[325] text-white hover:bg-white/20 transition-colors shadow-2xs group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-white group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-white">Ana Sayfaya Dön</span>
        </Link>
      </div>

      {/* Merkez: FinAi Akademi - Çok Yakında Sizlerle */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-5 shadow-sm">
          <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl clash-title font-[500] text-white tracking-tight">
          FinAi Akademi
        </h1>

        <p className="mt-3 text-lg sm:text-xl clash-subtitle font-[325] text-white tracking-tight">
          Çok Yakında Sizlerle
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004BFA] border border-white/20 text-white text-xs sm:text-sm clash-subtitle font-[325] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white">Çok Yakında Sizlerle</span>
        </div>
      </div>
    </div>
  );
}
