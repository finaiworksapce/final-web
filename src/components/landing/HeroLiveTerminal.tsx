"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2,
  PieChart,
  Activity
} from "lucide-react";

export function HeroLiveTerminal() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "kap" | "radar">("portfolio");

  return (
    <div className="relative w-full max-w-xl xl:max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-[#040989]/10 bg-white">
      
      {/* 1. Minimal Pencere Üst Çubuğu ve İnteraktif Sekmeler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#F5F7FA] border-b border-slate-200/80 gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 pl-2 hidden sm:inline">
            bist-terminal.finai.net.tr
          </span>
        </div>

        {/* Canlı Etkileşimli Sekmeler */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "portfolio"
                ? "bg-[#02041A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0E1E38]"
            }`}
          >
            <PieChart className="w-3 h-3 text-[#5B80FF]" />
            <span>Portföyüm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("kap")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "kap"
                ? "bg-[#02041A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0E1E38]"
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#5B80FF]" />
            <span>KAP İstihbaratı</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("radar")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "radar"
                ? "bg-[#02041A] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0E1E38]"
            }`}
          >
            <Activity className="w-3 h-3 text-[#5B80FF]" />
            <span>Bilanço Radarı</span>
          </button>
        </div>
      </div>

      {/* 2. Dinamik Konsol Gövdesi */}
      <div className="p-4 sm:p-5 bg-white min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PORTFÖYÜM (CANLI BIST POZİSYONLARI VE MALİYETLER) */}
          {activeTab === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Bakiye ve Seans Başlığı */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">
                    Borsa İstanbul Toplam Portföy Değeri
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-semibold text-[#0E1E38] tracking-tight font-numbers">
                      ₺351.949,20
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 font-numbers flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +₺8.420,50 (%2.45)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>BIST Seansı Açık</span>
                </div>
              </div>

              {/* 3 Canlı BIST Pozisyonu */}
              <div className="space-y-2">
                {/* THYAO */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#02041A] text-white flex items-center justify-center font-bold text-xs">
                      THY
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#0E1E38]">THYAO</span>
                        <span className="text-[10px] text-slate-400">Havacılık</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-numbers">
                        240 Adet • Ort. Maliyet: ₺294,00
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-xs text-[#0E1E38] font-numbers">
                      ₺312,50
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 font-numbers block">
                      +₺4.440,00 (+%6.29)
                    </span>
                  </div>
                </div>

                {/* ASELS */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#040989] text-white flex items-center justify-center font-bold text-xs">
                      ASE
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#0E1E38]">ASELS</span>
                        <span className="text-[10px] text-slate-400">Savunma</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-numbers">
                        450 Adet • Ort. Maliyet: ₺62,10
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-xs text-[#0E1E38] font-numbers">
                      ₺68,40
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 font-numbers block">
                      +₺2.835,00 (+%10.14)
                    </span>
                  </div>
                </div>

                {/* TUPRS */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#004BFA] text-white flex items-center justify-center font-bold text-xs">
                      TUP
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#0E1E38]">TUPRS</span>
                        <span className="text-[10px] text-slate-400">Petrol & Enerji</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-numbers">
                        180 Adet • Ort. Maliyet: ₺158,50
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-xs text-[#0E1E38] font-numbers">
                      ₺164,20
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 font-numbers block">
                      +₺1.026,00 (+%3.60)
                    </span>
                  </div>
                </div>
              </div>

              {/* Alt Analitik Notu */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#02041A] to-[#040989] text-white space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#D6E4FF]">
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#5B80FF]" /> FinAi Rasyonel Portföy Skoru
                  </span>
                  <span>Beta: 0.92 (Dengeli)</span>
                </div>
                <p className="text-xs text-slate-200 font-normal leading-relaxed">
                  Sanayi ve havacılık hisselerinizin güçlü nakit akışı, portföyünüzün piyasa dalgalanmalarına karşı dayanıklılığını artırıyor.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: KAP İSTİHBARATI (YAPAY ZEKÂ HAP ÖZET ÇÖZÜMLEMESİ) */}
          {activeTab === "kap" && (
            <motion.div
              key="kap"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#0E1E38]">THYAO</span>
                  <span className="text-[11px] text-slate-400">• Canlı KAP Analizi</span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">12 dk önce</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#0E1E38] leading-snug">
                  2026/1Ç Trafik ve Yolcu Taşıma Sonuçları Bildirimi
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Resmî KAP duyurusu FinAi yapay zekâ motoru tarafından çözümlendi:
                </p>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004BFA] shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Yolcu Doluluk Oranı:</strong> Toplam doluluk geçen yılın 2.1 puan üzerine çıkarak %84,2 seviyesine yükseldi.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004BFA] shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Birim Gelirler:</strong> Dış hat yolcu gelirleri döviz bazlı artış kaydederek operasyonel marjları korudu.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#004BFA] shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Hisseye Etki:</strong> Açıklanan veriler ilk çeyrek kârlılık beklentilerini yukarı yönlü revize ettirici nitelikte.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Pozitif Seans Momentumu
                </span>
                <span className="text-slate-400 text-[11px]">Doğrulanmış Resmî Kaynak: KAP</span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BİLANÇO RADARI (ÇARPANLAR VE TEMETTÜ TAKVİMİ) */}
          {activeTab === "radar" && (
            <motion.div
              key="radar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-[#0E1E38]">
                  BIST Şirket Değerleme & Temettü Radarı
                </span>
                <span className="text-[11px] text-slate-400">BIST 100 F/K Medyanı: 7.4x</span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0E1E38]">FROTO</span>
                    <span className="text-[11px] text-slate-400 block">Ford Otosan</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">F/K Oranı</span>
                      <span className="font-semibold text-[#0E1E38] font-numbers">6.8x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Temettü Verimi</span>
                      <span className="font-semibold text-emerald-700 font-numbers">%7.4</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Durum</span>
                      <span className="font-semibold text-blue-600">İskontolu</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0E1E38]">BIMAS</span>
                    <span className="text-[11px] text-slate-400 block">BİM Mağazalar</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">F/K Oranı</span>
                      <span className="font-semibold text-[#0E1E38] font-numbers">11.4x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Bilanço</span>
                      <span className="font-semibold text-indigo-600">4 Gün Kaldı</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Nakit Akışı</span>
                      <span className="font-semibold text-emerald-700">Güçlü</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#0E1E38]">EREGL</span>
                    <span className="text-[11px] text-slate-400 block">Ereğli Demir Çelik</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">PD/DD</span>
                      <span className="font-semibold text-[#0E1E38] font-numbers">0.88x</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Temettü Verimi</span>
                      <span className="font-semibold text-emerald-700 font-numbers">%8.1</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Döngü</span>
                      <span className="font-semibold text-amber-600">Toparlanma</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-700">
                  Açıklanacak bilanço ve temettü tarihlerini takvime otomatik işleyin.
                </span>
                <span className="font-semibold text-[#004BFA] flex items-center gap-1 shrink-0 ml-2">
                  Takvimi İncele <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
