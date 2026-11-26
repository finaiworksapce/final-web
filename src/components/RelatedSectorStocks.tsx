"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { sectorMapping } from "@/data/sectorMapping";
import StockLogo from "./StockLogo";
import { Layers, ArrowRight } from "lucide-react";

interface RelatedSectorStocksProps {
  currentSymbol: string;
  className?: string;
  maxCount?: number;
}

// BIST 50 öncelikli hisseler (aynı sektörde daha çok arananları öne çıkarmak için)
const POPULAR_SYMBOLS = new Set([
  "THYAO", "PGSUS", "TAVHL", "ASELS", "EREGL", "KRDMD", "TUPRS", "PETKM", "SASA", "HEKTS",
  "GARAN", "AKBNK", "ISCTR", "YKBNK", "VAKBN", "HALKB", "KCHOL", "SAHOL", "BIMAS", "MGROS",
  "SOKM", "SISE", "FROTO", "TOASO", "TCELL", "TTKOM", "ENKAI", "ASTOR", "KONTR", "CWENE",
  "EUPWR", "GESAN", "ODAS", "ZOREN", "ALARK", "ARCLK", "OYAKC", "CIMSA", "ISMEN", "TKFEN",
  "EKGYO", "ENJSA", "CCOLA", "MIATK", "REEDR", "TABGD", "CANTE", "BRSAN", "VESTL", "KOZAL"
]);

export default function RelatedSectorStocks({
  currentSymbol,
  className = "",
  maxCount = 8
}: RelatedSectorStocksProps) {
  const symbol = (currentSymbol || "").toUpperCase().replace(".IS", "").trim();
  const sector = sectorMapping[symbol] || "Borsa İstanbul";

  const peerStocks = useMemo(() => {
    const rawSector = sectorMapping[symbol];
    if (!rawSector) {
      // Sektör bulunamazsa popüler hisselerden öner
      return Array.from(POPULAR_SYMBOLS)
        .filter((s) => s !== symbol)
        .slice(0, maxCount);
    }

    const peers = Object.keys(sectorMapping).filter(
      (s) => s !== symbol && sectorMapping[s] === rawSector
    );

    // Popüler hisseleri en başa al
    peers.sort((a, b) => {
      const aPop = POPULAR_SYMBOLS.has(a) ? 1 : 0;
      const bPop = POPULAR_SYMBOLS.has(b) ? 1 : 0;
      return bPop - aPop;
    });

    return peers.slice(0, maxCount);
  }, [symbol, maxCount]);

  if (peerStocks.length === 0) return null;

  return (
    <section className={`bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0E1E38] tracking-tight">
              {sector} Sektöründeki Diğer Hisseler
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {symbol} ile aynı sektörde yer alan şirketler ve bilanço karşılaştırmaları
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg self-start sm:self-auto">
          {sector}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-1">
        {peerStocks.map((peer) => (
          <Link
            key={peer}
            href={`/varlik/${peer}`}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-500 hover:shadow-md transition-all duration-200 text-center"
            title={`${peer} Hisse ve Bilanço Analizi`}
          >
            <StockLogo
              symbol={peer}
              className="w-10 h-10 rounded-full ring-2 ring-slate-100 group-hover:ring-blue-400 group-hover:scale-105 transition-all mb-2"
            />
            <span className="text-sm font-bold text-[#0E1E38] group-hover:text-blue-600 transition-colors">
              {peer}
            </span>
            <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600 truncate max-w-[80px]">
              Analiz & Grafik
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
