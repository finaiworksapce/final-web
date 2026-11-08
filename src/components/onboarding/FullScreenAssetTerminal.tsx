"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Plus, Trash2, ArrowLeft, ArrowRight, Loader2, DollarSign, Coins, TrendingUp, Layers, CheckCircle2 } from "lucide-react";
import { PortfolioService } from "@/lib/portfolio-service";

export interface FastAsset {
  symbol: string;
  name: string;
  type: "STOCK" | "FUND" | "GOLD" | "CASH";
  quantity: number;
  avgCost: number;
}

interface FullScreenAssetTerminalProps {
  onComplete: () => Promise<void>;
  onBack: () => void;
}

export function FullScreenAssetTerminal({ onComplete, onBack }: FullScreenAssetTerminalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const [assetType, setAssetType] = useState<"STOCK" | "FUND" | "GOLD" | "CASH">("STOCK");
  const [quantity, setQuantity] = useState<string>("");
  const [avgCost, setAvgCost] = useState<string>("");

  const [addedAssets, setAddedAssets] = useState<FastAsset[]>([
    // Kolaylık olsun diye başlangıçta örnek bir satır veya boş
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Canlı Varlık Arama
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
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Dışarı tıklama kapatması
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleAddToList = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const sym = (selectedAsset?.symbol || searchQuery).toUpperCase().trim();
    const qty = parseFloat(quantity.replace(",", "."));
    const cost = parseFloat(avgCost.replace(",", "."));

    if (!sym) {
      setErrorMsg("Lütfen bir hisse veya fon sembolü belirleyin.");
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg("Lütfen geçerli bir adet girin.");
      return;
    }
    if (isNaN(cost) || cost <= 0) {
      setErrorMsg("Lütfen geçerli bir birim maliyet girin.");
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
    setSelectedAsset(null);
    setSearchQuery("");
    setQuantity("");
    setAvgCost("");
  };

  const handleQuickAdd = (sym: string, name: string, type: "STOCK" | "FUND" | "GOLD" | "CASH", qty: number, cost: number) => {
    setAddedAssets((prev) => [
      ...prev,
      { symbol: sym, name, type, quantity: qty, avgCost: cost }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setAddedAssets((prev) => prev.filter((_, i) => i !== index));
  };

  // Toplam Değer ve Dağılım Hesaplama
  const totalValue = addedAssets.reduce((sum, item) => sum + item.quantity * item.avgCost, 0);

  const stockTotal = addedAssets.filter(a => a.type === "STOCK").reduce((sum, a) => sum + a.quantity * a.avgCost, 0);
  const fundTotal = addedAssets.filter(a => a.type === "FUND").reduce((sum, a) => sum + a.quantity * a.avgCost, 0);
  const goldTotal = addedAssets.filter(a => a.type === "GOLD").reduce((sum, a) => sum + a.quantity * a.avgCost, 0);
  const cashTotal = addedAssets.filter(a => a.type === "CASH").reduce((sum, a) => sum + a.quantity * a.avgCost, 0);

  const stockRatio = totalValue > 0 ? Math.round((stockTotal / totalValue) * 100) : 0;
  const fundRatio = totalValue > 0 ? Math.round((fundTotal / totalValue) * 100) : 0;
  const goldRatio = totalValue > 0 ? Math.round((goldTotal / totalValue) * 100) : 0;
  const cashRatio = totalValue > 0 ? 100 - (stockRatio + fundRatio + goldRatio) : 0;

  // Onay ve Kayıt
  const handleFinalize = async () => {
    if (addedAssets.length === 0) {
      setErrorMsg("Lütfen en az bir varlık ekleyin veya 'Soru Ekranına Dön' diyerek örnek portföyü seçin.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      for (const asset of addedAssets) {
        try {
          await PortfolioService.addAsset({
            symbol: asset.symbol,
            type: asset.type,
            quantity: asset.quantity,
            avgCost: asset.avgCost,
            dateAdded: new Date().toISOString()
          });
        } catch (err) {
          console.warn(`Varlık eklenirken hata: ${asset.symbol}`, err);
        }
      }

      await onComplete();
    } catch (err) {
      console.error("Portföy kayıt hatası:", err);
      setErrorMsg("Varlıklar kaydedilirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-[#F5F7FA] text-[#040989] select-none">
      {/* SOL KOLON: Giriş Konsolu (55%) */}
      <section className="flex-1 lg:max-w-[55%] flex flex-col justify-between p-6 sm:p-8 lg:p-12 border-r border-slate-200/80 overflow-y-auto">
        <div className="space-y-6">
          {/* Üst Geri Tuşu ve Başlık */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-500 hover:text-blue-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sorulara Dön</span>
            </button>

            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              TAM EKRAN VARLIK GİRİŞ KONSOLU
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-clash">
              Mevcut Varlıklarınızı Tanımlayın
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Borsa İstanbul hisselerinizi, TEFAS yatırım fonlarınızı veya nakit birikiminizi ekleyin. FinAi panelinizi anında bu verilerle açacaktır.
            </p>
          </div>

          {/* Hızlı Kısayol Hapları */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Tek Tıkla Hızlı Ekle:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickAdd("TRY_CASH", "Türk Lirası Nakit", "CASH", 50000, 1)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-2xs"
              >
                + 50.000 ₺ Nakit
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("ZGOLD", "Ziraat Altın Fonu", "GOLD", 100, 42.5)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-600 transition-all shadow-2xs"
              >
                + ZGOLD Altın
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("THYAO", "Türk Hava Yolları", "STOCK", 100, 310)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-2xs"
              >
                + THYAO (100 Adet)
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd("TI2", "İş Portföy Fonu", "FUND", 500, 8.4)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-2xs"
              >
                + TI2 Fon
              </button>
            </div>
          </div>

          {/* Form Alanı */}
          <form onSubmit={handleAddToList} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            {/* Varlık Türü Seçici */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(["STOCK", "FUND", "GOLD", "CASH"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAssetType(t)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    assetType === t
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {t === "STOCK" ? "Hisse" : t === "FUND" ? "TEFAS" : t === "GOLD" ? "Altın" : "Nakit"}
                </button>
              ))}
            </div>

            {/* Arama Girişi */}
            <div className="space-y-1.5 relative" ref={searchContainerRef}>
              <label className="text-xs font-semibold text-slate-700">Sembol / İsim Arama</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Örn: THYAO, TUPRS, TI2, Altın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all uppercase"
                />
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-3 top-3" />
                )}
              </div>

              {/* Canlı Arama Sonuç Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectResult(item)}
                      className="w-full text-left p-3 hover:bg-blue-50/70 border-b border-slate-100 last:border-0 flex items-center justify-between transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-mono font-bold text-xs text-blue-700 mr-2">
                          {item.symbol || item.code}
                        </span>
                        <span className="text-xs text-slate-700 truncate">{item.title || item.name}</span>
                      </div>
                      {item.price && (
                        <span className="font-mono text-xs font-semibold text-slate-900 shrink-0 font-expose">
                          {item.price} ₺
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Adet ve Maliyet Kutuları */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Adet / Miktar</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Örn: 150"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Birim Alış Maliyeti (₺)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Örn: 285.50"
                  value={avgCost}
                  onChange={(e) => setAvgCost(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Varlığı Listeye Ekle</span>
            </button>
          </form>
        </div>

        {/* Alt Bilgi */}
        <div className="pt-4 text-[11px] text-slate-400 font-mono">
          <span>* Maliyet değerleri yaklaşık girilebilir; panel içerisinden dilediğiniz zaman güncelleyebilirsiniz.</span>
        </div>
      </section>

      {/* SAĞ KOLON: Portföy Manifestosu & Toplam Büyüklük (45%) */}
      <section className="flex-1 lg:max-w-[45%] bg-[#03071E] text-slate-100 flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-l border-slate-800">
        <div className="space-y-5">
          {/* Üst Canlı Toplam Tutarı */}
          <div className="border-b border-slate-800 pb-5 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Tanımlanan Toplam Portföy Büyüklüğü
            </span>
            <div className="text-2xl sm:text-4xl font-bold text-white font-expose tracking-tight tabular-nums">
              ₺ {totalValue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-slate-400">
              {addedAssets.length} adet farklı varlık tanımlandı
            </p>
          </div>

          {/* Dağılım Çubuğu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Varlık Sınıfı Dağılımı</span>
              <span className="text-[11px] text-slate-500">Otomatik Ağırlık</span>
            </div>

            <div className="h-3 w-full bg-slate-900 rounded-lg overflow-hidden flex p-0.5 gap-0.5 border border-slate-800">
              <div style={{ width: `${stockRatio}%` }} className="h-full bg-blue-600 rounded-sm transition-all duration-300" />
              <div style={{ width: `${fundRatio}%` }} className="h-full bg-indigo-500 rounded-sm transition-all duration-300" />
              <div style={{ width: `${goldRatio}%` }} className="h-full bg-amber-500 rounded-sm transition-all duration-300" />
              <div style={{ width: `${cashRatio}%` }} className="h-full bg-slate-400 rounded-sm transition-all duration-300" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span className="text-blue-400">Hisse %{stockRatio}</span>
              <span className="text-indigo-400">TEFAS %{fundRatio}</span>
              <span className="text-amber-400">Altın %{goldRatio}</span>
              <span className="text-slate-300">Nakit %{cashRatio}</span>
            </div>
          </div>

          {/* Varlık Tablosu */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Eklenen Varlıklar Manifestosu
            </span>

            <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
              {addedAssets.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2 text-slate-500">
                  <Layers className="w-6 h-6 mx-auto stroke-1" />
                  <p className="text-xs">Henüz bir varlık eklenmedi. Soldaki arama alanından hisse veya nakit ekleyin.</p>
                </div>
              ) : (
                addedAssets.map((item, idx) => {
                  const lineTotal = item.quantity * item.avgCost;
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/60">
                            {item.symbol}
                          </span>
                          <span className="text-xs text-slate-300 truncate font-medium">{item.name}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">
                          {item.quantity} Adet × ₺{item.avgCost.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-white font-expose tabular-nums">
                          ₺ {lineTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-600 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Alt Aksiyon Butonu */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleFinalize}
            disabled={isSubmitting || addedAssets.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              addedAssets.length > 0 && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Portföy Kaydediliyor...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Portföyümü Kaydet ve Paneli Başlat</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500 font-mono">
            Varlıklarınızı daha sonra dilediğiniz zaman portföy panelinden düzenleyebilirsiniz.
          </p>
        </div>
      </section>
    </div>
  );
}
