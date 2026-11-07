"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, ShieldCheck, Newspaper, Sliders, Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureSectionProps {
  title?: string;
  className?: string;
}

export function FeatureSteps({
  title = "Özellikler",
  className,
}: FeatureSectionProps) {
  return (
    <section
      id="features"
      className="w-full bg-white text-[#0E1E38] py-20 sm:py-28 overflow-hidden"
    >
      {/* Kenarlara Kadar Uzanan Geniş Kapsayıcı */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        {/* Üst Başlık Alanı */}
        <div className="max-w-4xl mb-14 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-500">
              {title} & Platform Ekosistemi
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight">
            Yatırım kararlarınızı matematik ve şeffaf verilerle güçlendiren analitik bloklar.
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-normal mt-4 max-w-2xl">
            BIST ve TEFAS piyasalarını karmaşık tablolardan çıkarıp, her biri özel bir amaca hizmet eden
            modern karar destek araçlarına dönüştürdük.
          </p>
        </div>

        {/* =========================================================================
            BENTO GRID MİMARİSİ (12 Kolonlu Asimetrik Veri Blokları — Çerçevesiz)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* =====================================================================
              BENTO 1: ANLIK PORTFÖY & CANLI VARLIK YÖNETİMİ (GENİŞ BLOK — 8 KOLON)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 bg-[#F8FAFC] rounded-3xl p-7 sm:p-10 flex flex-col justify-between hover:bg-[#F3F6FB] transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase">
                  01 / ÇEKİRDEK PORTFÖY
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[11px] font-semibold text-emerald-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Canlı Piyasa Fiyatları
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-normal text-[#0E1E38] tracking-tight">
                Anlık BIST & TEFAS Portföy Yönetimi
              </h3>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
                Borsa İstanbul hisselerinden yatırım fonlarına kadar tüm varlıklarınızı tek bir dinamik panoda toplayın.
                Saniyelik fiyat değişimleri, kar/zarar realizasyonları ve toplam portföy değeriniz anlık olarak güncellenir.
              </p>
            </div>

            {/* Veri / Simülasyon Arayüz Blokları (İç Kartlar — Temiz Beyaz Yüzeyler) */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">BIST Hisseleri</span>
                <span className="text-lg sm:text-xl font-normal text-[#0E1E38] font-numbers mt-1 block">
                  ₺384.250
                </span>
                <span className="text-xs font-semibold text-emerald-600 font-numbers inline-flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +%4.82 Günlük
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">TEFAS Fonları</span>
                <span className="text-lg sm:text-xl font-normal text-[#0E1E38] font-numbers mt-1 block">
                  ₺215.800
                </span>
                <span className="text-xs font-semibold text-emerald-600 font-numbers inline-flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +%1.15 Günlük
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Likit & Nakit</span>
                <span className="text-lg sm:text-xl font-normal text-[#0E1E38] font-numbers mt-1 block">
                  ₺45.000
                </span>
                <span className="text-xs font-semibold text-slate-500 font-numbers mt-0.5 block">
                  %7.5 Fırsat Rezervi
                </span>
              </div>
            </div>
          </motion.div>

          {/* =====================================================================
              BENTO 2: KORELASYON & RİSK MATRİSİ (DİKEY BLOK — 4 KOLON)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 bg-[#F8FAFC] rounded-3xl p-7 sm:p-10 flex flex-col justify-between hover:bg-[#F3F6FB] transition-all duration-300 group"
          >
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase block">
                02 / RİSK ANALİTİĞİ
              </span>

              <h3 className="text-2xl sm:text-3xl font-normal text-[#0E1E38] tracking-tight">
                Varlıklar Arası Korelasyon Matrisi
              </h3>

              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                Yatırımlarınızın birbirini nasıl etkilediğini matematiksel korelasyon katsayılarıyla analiz edin.
                Aşırı sektörel yoğunlaşmaları erkenden fark edin.
              </p>
            </div>

            {/* Mini Matris Önizlemesi */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Hisse / Emtia İlişkisi</span>
                <span className="text-emerald-700 font-numbers font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  -0.24 (Dengeli)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Sanayi / Teknoloji Bağı</span>
                <span className="text-blue-700 font-numbers font-bold bg-blue-50 px-2 py-0.5 rounded">
                  +0.41 (Ilımlı)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-tight">
                Portföyünüz piyasa düşüşlerine karşı %34 daha az dalgalanma riskine sahip.
              </p>
            </div>
          </motion.div>

          {/* =====================================================================
              BENTO 3: ANLIK HABER & KAP İSTİHBARATI (ORTA BLOK — 4 KOLON)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-4 bg-[#F8FAFC] rounded-3xl p-7 sm:p-10 flex flex-col justify-between hover:bg-[#F3F6FB] transition-all duration-300 group"
          >
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase block">
                03 / PİYASA İSTİHBARATI
              </span>

              <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                Sıcak Haber & KAP Filtresi
              </h3>

              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                Portföyünüzdeki şirketleri doğrudan ilgilendiren bilançoları, temettü kararlarını ve makro haberleri
                gürültüden arındırılmış hap özetlerle sunar.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 space-y-2.5">
              <div className="bg-white rounded-2xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">KAP Bildirimi · THYAO</span>
                <p className="text-xs font-medium text-slate-800 line-clamp-2 mt-0.5">
                  2026/3Ç Finansal Sonuçları Açıklandı: Net Kar Beklentileri Aştı.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Ekonomik Takvim</span>
                <p className="text-xs font-medium text-slate-800 line-clamp-1 mt-0.5">
                  TCMB Faiz Kararı: Perşembe 14:00
                </p>
              </div>
            </div>
          </motion.div>

          {/* =====================================================================
              BENTO 4: OLASI SENARYO & STRES TESTİ SİMÜLATÖRÜ (ORTA BLOK — 4 KOLON)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 bg-[#F8FAFC] rounded-3xl p-7 sm:p-10 flex flex-col justify-between hover:bg-[#F3F6FB] transition-all duration-300 group"
          >
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase block">
                04 / SİMÜLASYON
              </span>

              <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                Ekstrem Piyasa Senaryoları
              </h3>

              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                'Ya döviz kuru %15 fırlarsa veya faizler sert yükselirse?' gibi beklenmedik piyasa şoklarında
                portföyünüzün dayanıklılığını test edin.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Döviz Şoku (+%15)</span>
                <span className="text-emerald-600 font-bold font-numbers">+%6.2 Net Etki</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Faiz Artışı (+250 bps)</span>
                <span className="text-slate-600 font-bold font-numbers">-%1.4 Koruma</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block text-right pt-0.5">Dayanıklılık Skoru: 82/100</span>
            </div>
          </motion.div>

          {/* =====================================================================
              BENTO 5: YATIRIMCI PROFİL TESTİ & MODEL DAĞILIM (ORTA BLOK — 4 KOLON)
              ===================================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-4 bg-[#F8FAFC] rounded-3xl p-7 sm:p-10 flex flex-col justify-between hover:bg-[#F3F6FB] transition-all duration-300 group"
          >
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] uppercase block">
                05 / PROFİL & STRATEJİ
              </span>

              <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                Kişisel Yatırım Karakteri
              </h3>

              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                Risk toleransınızı ve yatırım vadenizi ölçen interaktif test ile size en uygun model varlık sepetini
                dakikalar içinde oluşturun.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 bg-white rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0E1E38]">Hedef Model Portföy</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Dengeli</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-2 rounded-full bg-blue-600 flex-[4]" title="Hisse %40" />
                <div className="h-2 rounded-full bg-indigo-500 flex-[3]" title="Fon %30" />
                <div className="h-2 rounded-full bg-amber-500 flex-[2]" title="Altın %20" />
                <div className="h-2 rounded-full bg-slate-300 flex-[1]" title="Nakit %10" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                <span>%40 Hisse</span>
                <span>%30 Fon</span>
                <span>%20 Altın</span>
                <span>%10 Nakit</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* =========================================================================
            ALT EYLEME ÇAĞRI (CALL TO ACTION)
            ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-base text-slate-600 font-normal text-center sm:text-left">
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
