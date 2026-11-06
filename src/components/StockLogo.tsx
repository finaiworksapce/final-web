"use client";

import React, { useState } from "react";
import stockLogosData from "@/data/stock-logos.json";
import { cn } from "@/lib/utils";

const stockLogosMap: Record<string, { dosya: string }> = stockLogosData as any;

export interface StockLogoProps {
  symbol: string;
  className?: string;
  alt?: string;
  showFallbackText?: boolean;
}

/**
 * Returns the public URL path for a given stock symbol if present in catalog.
 */
export function getStockLogoUrl(rawSymbol: string): string | null {
  if (!rawSymbol) return null;
  const clean = rawSymbol
    .toUpperCase()
    .replace(/\.IS$/, "")
    .replace(/^BIST:/, "")
    .trim();

  const entry = stockLogosMap[clean];
  if (entry?.dosya) {
    return `/logos/${entry.dosya}`;
  }
  return null;
}

export function StockLogo({
  symbol,
  className = "w-10 h-10",
  alt,
  showFallbackText = true
}: StockLogoProps) {
  const [hasError, setHasError] = useState(false);
  const clean = (symbol || "")
    .toUpperCase()
    .replace(/\.IS$/, "")
    .replace(/^BIST:/, "")
    .trim();

  const logoUrl = getStockLogoUrl(clean);

  // When exact logo file exists and hasn't errored
  if (logoUrl && !hasError) {
    return (
      <div
        className={cn(
          "rounded-full overflow-hidden shrink-0 aspect-square flex items-center justify-center bg-white shadow-xs select-none",
          className
        )}
      >
        <img
          src={logoUrl}
          alt={alt || `${clean} Logo`}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  // Graceful circular fallback badge
  return (
    <div
      className={cn(
        "rounded-full shrink-0 aspect-square flex items-center justify-center font-black text-white bg-gradient-to-br from-[#142B50] to-blue-600 shadow-xs select-none",
        className
      )}
      title={clean}
    >
      {showFallbackText ? (
        <span className="text-[10px] font-black uppercase tracking-tight">
          {clean.slice(0, 2) || "•"}
        </span>
      ) : null}
    </div>
  );
}

export default StockLogo;
