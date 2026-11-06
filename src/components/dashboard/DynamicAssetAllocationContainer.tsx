"use client";

import React, { useMemo } from "react";
import { useUser } from "@/components/providers/UserProvider";
import { TopAssetDistributionCard } from "@/components/dashboard/TopAssetDistributionCard";
import { SamplePortfolioWidget } from "@/components/dashboard/SamplePortfolioWidget";
import { motion, AnimatePresence } from "framer-motion";

export function DynamicAssetAllocationContainer() {
  const { myAssets = [], prices = {}, isDataLoaded } = useUser();

  // Aktif bakiyeli varlık olup olmadığını kontrol et
  const hasActiveAssets = useMemo(() => {
    if (!myAssets || myAssets.length === 0) return false;

    return myAssets.some((asset: any) => {
      const qty = Number(asset.quantity) || 0;
      if (qty <= 0) return false;
      const rawSymbol = asset.symbol ? asset.symbol.toUpperCase().trim() : "";
      const cleanSymbol = rawSymbol.replace(/\.IS$/, "");
      const isCash = asset.type === "CASH" || cleanSymbol === "NAKİT" || cleanSymbol === "TRY_CASH";
      const currentPrice = isCash
        ? asset.avgCost || 1
        : prices[rawSymbol] ?? prices[cleanSymbol] ?? prices[`${cleanSymbol}.IS`] ?? asset.avgCost ?? 0;
      return currentPrice * qty > 0;
    });
  }, [myAssets, prices]);

  if (!isDataLoaded) {
    return (
      <div className="bg-white border border-slate-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 min-h-[250px] flex flex-col justify-between animate-pulse">
        <div className="h-5 w-28 bg-slate-100 rounded-lg" />
        <div className="flex items-center justify-center my-auto">
          <div className="w-28 h-28 rounded-full border-8 border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {hasActiveAssets ? (
        <motion.div
          key="real-distribution"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <TopAssetDistributionCard />
        </motion.div>
      ) : (
        <motion.div
          key="sample-portfolio"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <SamplePortfolioWidget />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
