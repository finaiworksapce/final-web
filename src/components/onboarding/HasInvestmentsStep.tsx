"use client";

import React from "react";
import { Wallet, Compass, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface HasInvestmentsStepProps {
  hasInvestments: boolean | null;
  onSelect: (hasInvestments: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HasInvestmentsStep({ hasInvestments, onSelect, onNext, onBack }: HasInvestmentsStepProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Başlık Alanı */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hali Hazırda Bir Yatırımınız Var mı?
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto">
          Portföyünüzü hemen içeri aktarabilir veya sizin için sıfırdan yapay zeka destekli bir strateji oluşturabiliriz.
        </p>
      </div>

      {/* İki Seçenek Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* EVET KARTI */}
        <div
          onClick={() => onSelect(true)}
          className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 text-left group ${
            hasInvestments === true
              ? "bg-white border-[#00008B] shadow-xl shadow-blue-900/10 scale-[1.02] ring-4 ring-blue-50"
              : "bg-white/80 border-slate-200/80 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  hasInvestments === true
                    ? "bg-[#00008B] text-white shadow-lg shadow-blue-900/20"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                }`}
              >
                <Wallet className="w-7 h-7" />
              </div>

              {hasInvestments === true && (
                <div className="w-6 h-6 rounded-full bg-[#00008B] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 fill-current" />
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Varlığım Var
            </span>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
              Evet, Portföyüm Var
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Elimdeki BIST hisseleri, TEFAS fonları veya nakit varlıklarımı hemen kaydedip tek ekrandan analiz etmek istiyorum.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-blue-600">
            <span>Hızlı varlık ekleme ekranına git</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* HAYIR KARTI */}
        <div
          onClick={() => onSelect(false)}
          className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between border-2 text-left group ${
            hasInvestments === false
              ? "bg-white border-[#00008B] shadow-xl shadow-blue-900/10 scale-[1.02] ring-4 ring-blue-50"
              : "bg-white/80 border-slate-200/80 hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  hasInvestments === false
                    ? "bg-[#00008B] text-white shadow-lg shadow-blue-900/20"
                    : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                }`}
              >
                <Compass className="w-7 h-7" />
              </div>

              {hasInvestments === false && (
                <div className="w-6 h-6 rounded-full bg-[#00008B] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 fill-current" />
                </div>
              )}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Yeni Başlıyorum
            </span>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-3 mb-2">
              Hayır, Henüz Yatırımım Yok
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
              Henüz aktif bir yatırımım yok. Seviyeme ve hedeflerime uygun örnek bir yapay zeka portföy dağılımı görmek istiyorum.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <span>Profil sorularını yanıtla</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Navigasyon Butonları */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={hasInvestments === null}
          className="px-8 py-3.5 rounded-2xl bg-[#00008B] text-white font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 group active:scale-98"
        >
          <span>Devam Et</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
