"use client";

import React from "react";
import { Sparkles, TrendingUp, Zap, ArrowRight, Check, LucideIcon } from "lucide-react";
import { FinancialLiteracyLevel } from "@/config/onboarding-questions";

interface LiteracyStepProps {
  selectedLevel: FinancialLiteracyLevel | null;
  onSelect: (level: FinancialLiteracyLevel) => void;
  onNext: () => void;
}

const LEVELS: {
  id: FinancialLiteracyLevel;
  title: string;
  badge: string;
  badgeColor: string;
  icon: LucideIcon;
  description: string;
  features: string[];
}[] = [
  {
    id: "beginner",
    title: "Başlangıç Düzeyi",
    badge: "Yeni Başlayanlar İçin",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Sparkles,
    description: "Finansal piyasalarla yeni tanışıyorum. Temel kavramları öğrenmek, portföyümü sade ve güvenli adımlarla büyütmek istiyorum.",
    features: [
      "Sade ve anlaşılır yapay zeka açıklamaları",
      "Düşük riskli fon ve nakit yönetimi rehberliği",
      "Karmaşık terimlerden arındırılmış arayüz"
    ]
  },
  {
    id: "intermediate",
    title: "Orta Seviye",
    badge: "Aktif Yatırımcı",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: TrendingUp,
    description: "BIST hisselerinde veya TEFAS fonlarında alım-satım deneyimim var. Portföyümü daha profesyonel takip edip optimize etmek istiyorum.",
    features: [
      "Sektörel varlık dağılımı ve korelasyon analizi",
      "Temettü takvimi ve bilanço bildirimleri",
      "Stratejik fon ve hisse karşılaştırmaları"
    ]
  },
  {
    id: "advanced",
    title: "İleri Düzey",
    badge: "Profesyonel & Analitik",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Zap,
    description: "Piyasa dinamiklerine, finansal rasyolara (F/K, PD/DD, FD/FAVÖK) ve teknik göstergelere hakimim. Derinlemesine yapay zeka analizleri arıyorum.",
    features: [
      "Derin bilanço ve finansal rasyo geçmişi",
      "Gelişmiş teknik göstergeler ve TradingView grafikleri",
      "Yapay zeka duyarlılık analizi ve makroekonomik korelasyonlar"
    ]
  }
];

export function LiteracyStep({ selectedLevel, onSelect, onNext }: LiteracyStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Başlık Alanı */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Finansal Okuryazarlık Seviyenizi Seçin
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
          FinAi, yapay zeka analizlerini ve önerilerini yatırım tecrübenize özel olarak optimize edecektir.
        </p>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {LEVELS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedLevel === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 text-left group ${
                isSelected
                  ? "bg-white border-[#00008B] shadow-xl shadow-blue-900/10 scale-[1.02] ring-4 ring-blue-50"
                  : "bg-white/80 border-slate-200/80 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Seçim Rozeti (Sağ Üst) */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#00008B] text-white shadow-md shadow-blue-900/20"
                      : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#00008B] bg-[#00008B] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Başlık ve Rozet */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Özellikler */}
              <div className="pt-4 border-t border-slate-100 space-y-2 mt-auto">
                {item.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* İleri Butonu */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedLevel}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#00008B] text-white font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 group active:scale-98"
        >
          <span>Devam Et</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
