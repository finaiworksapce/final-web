"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, ArrowLeft, ArrowRight, Loader2, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { PortfolioService } from "@/lib/portfolio-service";

interface FastAsset {
  symbol: string;
  name: string;
  type: "STOCK" | "FUND" | "GOLD" | "CASH";
  quantity: number;
  avgCost: number;
}

interface FastAssetEntryStepProps {
  onComplete: () => Promise<void>;
  onBack: () => void;
}

export function FastAssetEntryStep({ onComplete, onBack }: FastAssetEntryStepProps) {
  // Arama ve Seçim State'leri
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  // Form State'leri
  const [assetType, setAssetType] = useState<"STOCK" | "FUND" | "GOLD" | "CASH">("STOCK");
  const [quantity, setQuantity] = useState<string>("");
  const [avgCost, setAvgCost] = useState<string>("");

  // Eklenen Varlıklar Listesi
  const [addedAssets, setAddedAssets] = useState<FastAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  // Canlı Varlık Arama (BIST & TEFAS)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Arama hatası:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Arama Sonucundan Varlık Seçimi
  const handleSelectResult = (item: any) => {
    setSelectedAsset(item);
    setSearchQuery(item.symbol || item.code || "");
    setSearchResults([]);
    const detectedType = item.type === "fund" || item.type === "FUND" ? "FUND" : "STOCK";
    setAssetType(detectedType);
    if (item.price) {
      setAvgCost(String(item.price));
    }
  };

  // Listeye Varlık Ekleme
  const handleAddToList = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const sym = (selectedAsset?.symbol || searchQuery).toUpperCase().trim();
    const qty = parseFloat(quantity);
    const cost = parseFloat(avgCost);

    if (!sym) {
      setErrorMsg("Lütfen hisse veya fon sembolü girin.");
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg("Lütfen geçerli bir adet girin.");
      return;
    }
    if (isNaN(cost) || cost <= 0) {
      setErrorMsg("Lütfen geçerli bir alış maliyeti girin.");
      return;
    }

    const newAsset: FastAsset = {
      symbol: sym,
      name: selectedAsset?.title || selectedAsset?.name || sym,
      type: assetType,
      quantity: qty,
      avgCost: cost
    };

    setAddedAssets((prev) => [...prev, newAsset]);

    // Formu temizle
    setSelectedAsset(null);
    setSearchQuery("");
    setQuantity("");
    setAvgCost("");
  };

  // Listeden Silme
  const handleRemoveItem = (index: number) => {
    setAddedAssets((prev) => prev.filter((_, i) => i !== index));
  };

  // Hızlı Nakit Ekleme
  const handleAddQuickCash = () => {
    const cashAmount = prompt("Eklemek istediğiniz nakit (TRY) tutarını girin:", "10000");
    if (!cashAmount) return;
    const num = parseFloat(cashAmount.replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num > 0) {
      setAddedAssets((prev) => [
        ...prev,
        {
          symbol: "TRY_CASH",
          name: "Türk Lirası Nakit",
          type: "CASH",
          quantity: num,
          avgCost: 1
        }
      ]);
    }
  };

  // Toplam Portföy Tutarı Hesaplama
  const totalValue = addedAssets.reduce((sum, item) => sum + item.quantity * item.avgCost, 0);

  // Tüm Varlıkları Kaydet ve Tamamla
  const handleFinalize = async () => {
    if (addedAssets.length === 0) {
      setErrorMsg("Lütfen en az bir varlık ekleyin veya geri dönüp 'Henüz Yatırımım Yok' seçeneğini seçin.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Varlıkları ardışık ekle
      for (const asset of addedAssets) {
        try {
          await PortfolioService.addAsset({
            symbol: asset.symbol,
            type: asset.type,
            quantity: asset.quantity,
            avgCost: asset.avgCost,
            dateAdded: new Date().toISOString()
          });
        } catch (err: any) {
          console.warn(`Varlık eklenirken hata (${asset.symbol}):`, err);
        }
      }

      await onComplete();
    } catch (err: any) {
      console.error("Portföy kaydı hatası:", err);
      setErrorMsg("Portföyünüz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Başlık */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hızlı Varlık Tanımlama
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
          Mevcut varlıklarınızı ekleyin; FinAi panelinizi anında bu verilerle hazırlasın.
        </p>
      </div>

      {/* Varlık Ekleme Form Alanı */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Yeni Varlık Ekle
            </h3>
          </div>

          <button
            type="button"
            onClick={handleAddQuickCash}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>+ Nakit Ekle</span>
          </button>
        </div>

        <form onSubmit={handleAddToList} className="space-y-4">
          {/* Varlık Arama Kutusu */}
          <div className="relative" ref={searchRef}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Hisse veya Fon Ara (Örn: THYAO, MAC, TUPRS)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Sembol veya şirket / fon adı yazın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Arama Sonuç Açılır Menüsü */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {searchResults.slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectResult(item)}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900 mr-2">
                        {item.symbol || item.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.title || item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.type || "BIST"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adet ve Maliyet Girişleri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adet / Pay Miktarı
              </label>
              <input
                type="number"
                step="any"
                min="0.0001"
                placeholder="Örn: 100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alış Maliyeti (₺)
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="Örn: 310.50"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Hata Mesajı */}
          {errorMsg && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Listeye Ekle Butonu */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Listeye Ekle</span>
          </button>
        </form>
      </div>

      {/* Eklenen Varlıklar Listesi */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Eklenecek Varlıklar ({addedAssets.length})
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Tahmini Toplam</span>
            <span className="text-sm font-black text-[#00008B] tabular-nums">
              ₺{totalValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {addedAssets.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-xs font-semibold">Henüz varlık eklemediniz.</p>
            <p className="text-[11px] mt-1 text-slate-400">
              Yukarıdaki formdan hisselerinizi, fonlarınızı veya nakit tutarınızı ekleyin.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {addedAssets.map((asset, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-blue-700 shadow-2xs">
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{asset.symbol}</h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {asset.quantity} adet × ₺{asset.avgCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    ₺{(asset.quantity * asset.avgCost).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Varlığı Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <button
          type="button"
          onClick={handleFinalize}
          disabled={isSubmitting || addedAssets.length === 0}
          className="px-8 py-3.5 rounded-2xl bg-[#00008B] text-white font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 group active:scale-98"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Portföyü Kaydet ve Panele Git</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
