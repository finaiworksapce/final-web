"use client";

import React from "react";
import { Sparkles, FileText, BarChart2, ShieldCheck } from "lucide-react";

interface StockSeoSummaryCardProps {
  symbol: string;
  fullName: string;
  sector: string;
  about?: string | null;
  currentPrice?: number | null;
  changePercent?: number | null;
  peRatio?: number | null;
  pbRatio?: number | null;
  className?: string;
}

export default function StockSeoSummaryCard({
  symbol,
  fullName,
  sector,
  about,
  currentPrice,
  changePercent,
  peRatio,
  pbRatio,
  className = ""
}: StockSeoSummaryCardProps) {
  const cleanName = fullName !== symbol ? fullName : `${symbol} A.Ş.`;
  const priceText = currentPrice ? `${currentPrice.toFixed(2)} TL` : "güncel piyasa fiyatı";
  const peText = peRatio && peRatio > 0 ? `hissenin F/K (Fiyat/Kazanç) oranı ${peRatio.toFixed(2)}` : null;
  const pbText = pbRatio && pbRatio > 0 ? `PD/DD (Piyasa Değeri / Defter Değeri) oranı ${pbRatio.toFixed(2)}` : null;

  return (
    <div className={`bg-gradient-to-br from-[#0E1E38] to-[#152a4e] text-white border border-blue-900/60 rounded-3xl p-6 md:p-8 shadow-xl space-y-4 ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-400/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {cleanName} ({symbol}) Bilanço ve Hisse Analizi Özeti
          </h2>
          <p className="text-xs text-blue-200/80 font-normal">
            Borsa İstanbul {sector} sektörü yapay zekâ destekli finansal değerlendirmesi
          </p>
        </div>
      </div>

      <div className="text-sm leading-relaxed text-slate-200 space-y-2.5">
        <p>
          <strong className="text-white font-semibold">{cleanName} ({symbol})</strong>, Borsa İstanbul bünyesinde{" "}
          <span className="text-blue-300 font-medium">{sector}</span> sektöründe işlem görmektedir. Şirket payları son seans itibarıyla{" "}
          <strong className="text-white">{priceText}</strong> seviyesinden işlem görmüş olup, çeyreklik bilanço kârlılığı, özsermaye büyümesi ve nakit akım tabloları FinAi algoritmaları tarafından düzenli olarak analiz edilmektedir.
        </p>
        <p>
          Temel analiz göstergelerinde {peText ? `${peText} ve ` : ""}{pbText ? `${pbText} ` : "değerleme çarpanları "}sektörel ortalamalarla kıyaslanarak hissenin çarpan bazlı iskontosu hesaplanmaktadır. {about ? `${about.slice(0, 180)}... ` : ""}Sayfadaki sekmelerden şirketin gelir tablosu, bilanço kalemleri, KAP bildirimleri ve teknik grafik göstergelerine ulaşabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-300 text-xs mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Mali Tablolar</span>
          </div>
          <span className="text-xs font-semibold text-white">Çeyreklik Bilanço</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-300 text-xs mb-1">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Rasyolar</span>
          </div>
          <span className="text-xs font-semibold text-white">F/K & PD/DD</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-300 text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Veri Doğrulama</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">KAP Doğrulandı</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-blue-300 text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Piyasa Analizi</span>
          </div>
          <span className="text-xs font-semibold text-blue-300">Yapay Zekâ Skoru</span>
        </div>
      </div>
    </div>
  );
}
