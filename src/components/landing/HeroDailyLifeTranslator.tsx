"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown, Lightbulb, CheckCircle2 } from "lucide-react";

interface ExampleCard {
  id: string;
  tabLabel: string;
  icon: string;
  title: string;
  jargonText: string;
  jargonHint: string;
  everydayText: string;
  takeaway: string;
}

const EXAMPLES: ExampleCard[] = [
  {
    id: "firin",
    tabLabel: "Mahalle Fırını & Bilanço",
    icon: "🥐",
    title: "Şirket Bilançosu (FAVÖK) Nedir?",
    jargonText: "Konsolide FAVÖK marjı %18 daralarak negatif serbest nakit akışı oluşturdu.",
    jargonHint: "Kafanız mı karıştı? Çoğu insan bu terimler yüzünden borsadan uzak duruyor.",
    everydayText:
      "Şirketi mahallenizdeki fırın gibi düşünün: Un ve elektrik zamlandı ama ekmek fiyatını hemen artıramadı. Bu ay kasada nakit azalsa da fırın tıkır tıkır çalışıyor ve ekmek satmaya devam ediyor.",
    takeaway: "FAVÖK: Şirketin un, maya ve elektrik gibi asıl dükkân masraflarından sonra cebinde kalan gerçek ana kazançtır."
  },
  {
    id: "sepet",
    tabLabel: "Market Sepeti & Enflasyon",
    icon: "🛒",
    title: "TÜFE ve Enflasyon Ne Anlatır?",
    jargonText: "Manşet TÜFE baz etkisiyle dezenflasyonist patikada gerileme eğilimini sürdürdü.",
    jargonHint: "Karmaşık ekonomik raporlarda kaybolmanıza gerek yok.",
    everydayText:
      "Fiyatlar düşmedi; sadece market arabasını doldururken kasadaki fişin kabarma hızı geçen yıla göre biraz yavaşladı. Peynir hâlâ pahalı ama zamlar eskisi kadar peş peşe gelmiyor.",
    takeaway: "Enflasyonun düşmesi fiyatların ucuzlaması değil, zamların sadece fren yapması anlamına gelir."
  },
  {
    id: "kap",
    tabLabel: "KAP Bildirimi",
    icon: "📢",
    title: "Şirket Açıklamaları (KAP) Nasıl Okunur?",
    jargonText: "ÖDA: Maddi duran varlık elden çıkarma kârının sermayeye tevsii ve fon tahsisi hk.",
    jargonHint: "Yüzlerce sayfalık resmi belgelerde boğulmayın.",
    everydayText:
      "Şirket kenarda boş yatan eski arsasını sattı. Gelen nakitle bankaya olan kredi borcunu kapattı ve yeni fabrikası için yeni makineler aldı. Borç bitti, üretim artıyor.",
    takeaway: "Boş arsadan kurtulup borç kapatmak, şirketin sırtındaki faiz yükünü indirdiği için genelde iyiye işarettir."
  }
];

export function HeroDailyLifeTranslator() {
  const [activeId, setActiveId] = useState("firin");
  const activeItem = EXAMPLES.find((item) => item.id === activeId) || EXAMPLES[0];

  return (
    <div className="relative w-full max-w-xl xl:max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl shadow-[#040989]/10 bg-white">
      
      {/* Pencere Üst Çubuğu ve Sekmeler */}
      <div className="px-4 py-3 bg-[#F5F7FA] border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-[11px] font-mono text-slate-500 pl-2">
            FinAi Finans Çevirici
          </span>
        </div>

        {/* 3 Örnek Sekmesi */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto overflow-x-auto max-w-full">
          {EXAMPLES.map((ex) => {
            const isSelected = activeId === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setActiveId(ex.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#02041A] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#0E1E38]"
                }`}
              >
                <span>{ex.icon}</span>
                <span>{ex.tabLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kart İçeriği */}
      <div className="p-5 sm:p-6 bg-white space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#004BFA]">
                {activeItem.title}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Finansal Okuryazarlık Notu
              </span>
            </div>

            {/* 1. JARGON KUTUSU */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-rose-600 uppercase tracking-wide">
                  ✕ Korkutucu Finans Jargonu:
                </span>
                <span className="text-slate-400 text-[10px] hidden sm:inline">Klasik Rapor Dili</span>
              </div>
              <p className="text-xs text-slate-700 italic font-mono leading-relaxed">
                "{activeItem.jargonText}"
              </p>
              <span className="text-[10px] text-slate-400 block pt-0.5">
                {activeItem.jargonHint}
              </span>
            </div>

            {/* Dönüştürücü Ayracı */}
            <div className="flex items-center justify-center gap-2 py-0.5 text-xs text-[#004BFA] font-medium">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>FinAi Günlük Hayat Diliyle Açıkladı</span>
            </div>

            {/* 2. GÜNLÜK HAYAT DİLİ KUTUSU */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#02041A] to-[#040989] text-white space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D6E4FF]">
                <Sparkles className="w-3.5 h-3.5 text-[#5B80FF]" />
                <span>Günlük Hayattan Basit Örnek:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed">
                {activeItem.everydayText}
              </p>
            </div>

            {/* 3. NE ÖĞRENDİNİZ BİLGİSİ */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-2.5 text-xs">
              <Lightbulb className="w-4 h-4 text-[#004BFA] shrink-0 mt-0.5" />
              <div className="text-slate-700 leading-snug">
                <strong className="text-[#0E1E38] block mb-0.5">Öğrendiğiniz Ders:</strong>
                {activeItem.takeaway}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
