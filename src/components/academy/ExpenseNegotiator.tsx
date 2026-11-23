'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  ArrowLeft,
  Building2,
  Flame,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';
import { 
  PREDEFINED_EXPENSES, 
  ExpenseCategory, 
  PredefinedExpense,
  getNegotiationDialogue,
  DialogueContext
} from '@/data/academy/negotiation-dialogues';

interface NegotiatedItem extends PredefinedExpense {
  originalAmount: number;
  currentAmount: number;
  targetCutAmount: number;
  status: 'pending' | 'in_progress' | 'settled';
  turns: number; // kaç kez konuşuldu
  lastDialogue: string;
}

const STORAGE_KEY = 'finai_cash_flow_data';
const LESSON_2_KEY = 'finai_lesson_2_completed';

function detectCategory(name: string): ExpenseCategory {
  const lower = name.toLowerCase();
  if (/kira|barınma|kredi|borç|aidat|ev taksiti/i.test(lower)) return 'A';
  if (/market|mutfak|gıda|fatura|elektrik|su|gaz|internet|ulaşım|yakıt|benzin/i.test(lower)) return 'B';
  return 'C';
}

export function ExpenseNegotiator() {
  const userCtx = useUser();
  const userName = userCtx?.userName ? userCtx.userName.split(' ')[0] : 'Öğrencimiz';

  const [items, setItems] = useState<NegotiatedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userOfferInput, setUserOfferInput] = useState('');
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isFinishedAll, setIsFinishedAll] = useState(false);

  // 1. Hafta Verisini veya Varsayılanları Yükle
  useEffect(() => {
    try {
      const completed = localStorage.getItem(LESSON_2_KEY);
      if (completed === 'true') {
        setIsLessonCompleted(true);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      let loadedExpenses: { name: string; amount: number }[] = [];

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expenses && Array.isArray(parsed.expenses) && parsed.expenses.length > 0) {
          loadedExpenses = parsed.expenses.map((e: any) => ({
            name: e.name || 'Özel Kalem',
            amount: Number(e.amount) || 1000,
          }));
        }
      }

      // Eğer 1. haftada gider kaydedilmediyse varsayılan 4 kalemi alalım
      if (loadedExpenses.length === 0) {
        loadedExpenses = PREDEFINED_EXPENSES.slice(0, 4).map((p) => ({
          name: p.name,
          amount: p.defaultAmount,
        }));
      }

      // Her kalemi akıllı olarak A, B, C olarak eşle
      const initialItems: NegotiatedItem[] = loadedExpenses.map((exp, idx) => {
        const category = detectCategory(exp.name);
        const amount = exp.amount;

        // Önerilen kısıntı hedefi
        let targetCut = amount;
        if (category === 'A') targetCut = amount; // 0 kesinti
        if (category === 'B') targetCut = Math.round((amount * 0.85) / 100) * 100; // %15 kesinti
        if (category === 'C') targetCut = Math.round((amount * 0.5) / 100) * 100; // %50 kesinti

        const ctx: DialogueContext = {
          userName,
          itemName: exp.name,
          currentAmount: amount,
          suggestedCut: targetCut,
        };

        const initialDialogue = getNegotiationDialogue({
          category,
          round: 0,
          isSettled: category === 'A',
          context: ctx,
        });

        return {
          id: `item-${idx}`,
          name: exp.name,
          category,
          defaultAmount: amount,
          originalAmount: amount,
          currentAmount: amount,
          targetCutAmount: targetCut,
          status: idx === 0 ? (category === 'A' ? 'settled' : 'in_progress') : 'pending',
          turns: 0,
          lastDialogue: initialDialogue,
          description: '',
        };
      });

      setItems(initialItems);
    } catch {
      // ignore
    }
  }, [userName]);

  const currentItem = items[currentIndex];

  // Toplam İstatistikler
  const totalOriginal = useMemo(
    () => items.reduce((acc, it) => acc + it.originalAmount, 0),
    [items]
  );
  const totalCurrent = useMemo(
    () => items.reduce((acc, it) => acc + it.currentAmount, 0),
    [items]
  );
  const monthlySaved = totalOriginal - totalCurrent;
  const yearlySaved = monthlySaved * 12;

  // Kullanıcının Teklif Sunması / Pazarlık Hamlesi
  const handleOffer = (offerAmount: number) => {
    if (!currentItem) return;

    const category = currentItem.category;
    const nextTurns = currentItem.turns + 1;
    let nextStatus: 'in_progress' | 'settled' = 'in_progress';
    let isSettled = false;

    // Kural Kontrolü:
    // A Kategorisi: 0 ısrar (zaten anında kilitlenir)
    // B Kategorisi: 1 ısrar (1 tur direnir, 2. turda el sıkışır)
    // C Kategorisi: 2 ısrar (2 tur direnir, 3. turda el sıkışır)
    if (category === 'A') {
      isSettled = true;
      nextStatus = 'settled';
    } else if (category === 'B') {
      if (nextTurns >= 1) {
        isSettled = true;
        nextStatus = 'settled';
      }
    } else if (category === 'C') {
      if (nextTurns >= 2) {
        isSettled = true;
        nextStatus = 'settled';
      }
    }

    const ctx: DialogueContext = {
      userName,
      itemName: currentItem.name,
      currentAmount: currentItem.originalAmount,
      offeredAmount: offerAmount,
      suggestedCut: currentItem.targetCutAmount,
      savedSoFar: monthlySaved,
    };

    const newDialogue = getNegotiationDialogue({
      category,
      round: nextTurns,
      isSettled,
      context: ctx,
    });

    const updated = items.map((it, idx) => {
      if (idx === currentIndex) {
        return {
          ...it,
          currentAmount: offerAmount,
          turns: nextTurns,
          status: nextStatus,
          lastDialogue: newDialogue,
        };
      }
      return it;
    });

    setItems(updated);
    setUserOfferInput('');
  };

  // Sonraki Kaleme Geçiş
  const handleNextItem = () => {
    if (currentIndex < items.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Sonraki kalemi aktif yap
      setItems((prev) =>
        prev.map((it, idx) => {
          if (idx === nextIdx) {
            return {
              ...it,
              status: it.category === 'A' ? 'settled' : 'in_progress',
            };
          }
          return it;
        })
      );
    } else {
      setIsFinishedAll(true);
    }
  };

  // Önceki Kaleme Dönüş
  const handlePrevItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 2. Haftayı Tamamlama Aksiyonu
  const handleCompleteLesson = () => {
    setIsLessonCompleted(true);
    try {
      localStorage.setItem(LESSON_2_KEY, 'true');

      // Güncellenmiş optimize giderleri finai_cash_flow_data içine kaydet
      const saved = localStorage.getItem(STORAGE_KEY);
      let incomes = [{ id: 'inc-1', name: 'Aylık Gelir', amount: 35000 }];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.incomes) incomes = parsed.incomes;
      }

      const updatedExpenses = items.map((it) => ({
        id: it.id,
        name: it.name,
        amount: it.currentAmount,
      }));

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          incomes,
          expenses: updatedExpenses,
        })
      );
    } catch {
      // ignore
    }
  };

  const isCurrentSettled = currentItem?.status === 'settled';

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================================
          ÜST GÖSTERGE & CANLI TASARRUF SAYACI
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Önceki Aylık Gider
          </span>
          <div className="text-xl sm:text-2xl font-bold text-[#0E1E38] clash-title mt-1">
            {totalOriginal.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-[11px] text-slate-400">1. Haftadaki Sıfır Noktan</span>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100">
          <span className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider block">
            Yeni Optimize Gider
          </span>
          <div className="text-xl sm:text-2xl font-bold text-[#004BFA] clash-title mt-1">
            {totalCurrent.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-[11px] text-blue-500/80">Pazarlık Sonrası Masadaki Bütçe</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aylık Kurtarılan Net</span>
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 clash-title mt-1">
            +{monthlySaved.toLocaleString('tr-TR')} ₺ / ay
          </div>
          <span className="text-[11px] text-emerald-600/80">Tüketimden Kurtarılan Taze Nakit</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1E38] text-white border border-white/10 shadow-md">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yıllık Ortaklık Tohumu</span>
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white clash-title mt-1">
            +{yearlySaved.toLocaleString('tr-TR')} ₺ / yıl
          </div>
          <span className="text-[11px] text-white/60">BIST Şirketlerine Yatırım Gücü</span>
        </div>
      </div>

      {/* =========================================================================
          ADIM ÇUBUĞU (Hangi Kalemdeyiz?)
          ========================================================================= */}
      <div className="w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-[#0E1E38] clash-title">
              Harcama Masası & Pazarlık İstasyonu
            </h4>
            <p className="text-xs text-slate-500">
              Kalem {currentIndex + 1} / {items.length} — FinAi Koçu ile karşılıklı uzlaşarak sızıntıları buduyoruz.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[#004BFA]'
                    : it.status === 'settled'
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`${it.name} (${it.status === 'settled' ? 'Tamamlandı' : 'Bekliyor'})`}
              />
            ))}
          </div>
        </div>

        {/* =========================================================================
            ODAKLANILAN GİDER KARTI VE DİYALOG ALANI
            ========================================================================= */}
        {currentItem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            
            {/* SOL: ODAK KALEM KARTI (4 Kolon) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      currentItem.category === 'A'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : currentItem.category === 'B'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {currentItem.category === 'A' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {currentItem.category === 'B' && <Building2 className="w-3.5 h-3.5" />}
                    {currentItem.category === 'C' && <Flame className="w-3.5 h-3.5" />}
                    <span>
                      {currentItem.category === 'A' && 'A Kategorisi (Sabit Yaşam)'}
                      {currentItem.category === 'B' && 'B Kategorisi (Yarı-Değişken)'}
                      {currentItem.category === 'C' && 'C Kategorisi (Esnek / Keyfi)'}
                    </span>
                  </span>

                  {isCurrentSettled && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>Anlaşıldı</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold text-[#0E1E38] clash-title">
                  {currentItem.name}
                </h3>

                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>1. Hafta Tutarın:</span>
                    <span className="font-semibold text-slate-700">
                      {currentItem.originalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Masa Tutarı:</span>
                    <span className="text-base font-bold text-[#004BFA]">
                      {currentItem.currentAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  {currentItem.originalAmount > currentItem.currentAmount && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold pt-1 border-t border-slate-200/60">
                      <span>Kurtarılan Tasarruf:</span>
                      <span>
                        +{(currentItem.originalAmount - currentItem.currentAmount).toLocaleString('tr-TR')} ₺ / ay
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hızlı Kısma Seçenekleri (Kullanıcıya Kolaylık) */}
              {!isCurrentSettled && currentItem.category !== 'A' && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Hızlı Öneri Seçenekleri:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.9))}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] transition-all cursor-pointer text-center"
                    >
                      -%10 Budama
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.75))}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] transition-all cursor-pointer text-center"
                    >
                      -%25 Akıllı
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.5))}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] transition-all cursor-pointer text-center"
                    >
                      -%50 Cesur
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SAĞ: FİNAİ KOÇU VE PAZARLIK ALANI (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* FinAi Koçunun Konuşma Balonu */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#004BFA] flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                    FA
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#0E1E38] leading-tight">
                      FinAi Tasarruf Koçu (İş Ortağın)
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {currentItem.category === 'A'
                        ? '0 Pazarlık (Korumalı Sabit Gider)'
                        : currentItem.category === 'B'
                        ? `${1 - currentItem.turns > 0 ? '1 Karşı Teklif Hakkı Kaldı' : 'Son Uzlaşma Turu'}`
                        : `${2 - currentItem.turns > 0 ? `${2 - currentItem.turns} Israr Turu Kaldı` : 'Son Uzlaşma Turu'}`}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-3 relative overflow-hidden shadow-lg border border-slate-800">
                  <div className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal">
                    {currentItem.lastDialogue}
                  </div>
                </div>
              </div>

              {/* Kullanıcı Karşı Hamle / Cevap Girişi */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                {!isCurrentSettled ? (
                  currentItem.category === 'A' ? (
                    <button
                      type="button"
                      onClick={() => handleOffer(currentItem.originalAmount)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Onaylıyorum, Bu Sabit Gideri Aynen Koruyalım</span>
                    </button>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = Number(userOfferInput.replace(/\D/g, ''));
                        if (val > 0) handleOffer(val);
                      }}
                      className="flex flex-col sm:flex-row items-center gap-3 w-full"
                    >
                      <div className="relative flex-1 w-full">
                        <input
                          type="number"
                          value={userOfferInput}
                          onChange={(e) => setUserOfferInput(e.target.value)}
                          placeholder="Teklif ettiğin yeni tutar (örn: 5500)"
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0E1E38] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#004BFA]/20 focus:border-[#004BFA]"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
                          ₺
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!userOfferInput || Number(userOfferInput) <= 0}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer disabled:cursor-not-allowed shrink-0"
                      >
                        Pazarlık Et / Teklif Ver
                      </button>
                    </form>
                  )
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bu kalemde uzlaşma sağlandı ({currentItem.currentAmount.toLocaleString('tr-TR')} ₺).</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextItem}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer shrink-0"
                    >
                      <span>
                        {currentIndex < items.length - 1 ? 'Sonraki Kaleme Geç' : 'Sonuçları Gör'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Önceki Kalem Butonu */}
                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={handlePrevItem}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1 hover:text-[#004BFA] disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Önceki Kalem</span>
                  </button>

                  <span>
                    Kalan Kalem: {items.length - (currentIndex + 1)}
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          DERSİ BİTİR VEYA TEBRİKLER & BİLGİLENDİRME KARTI
          ========================================================================= */}
      {isFinishedAll && !isLessonCompleted ? (
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="space-y-0.5 text-center sm:text-left">
            <h5 className="text-sm font-semibold text-[#0E1E38]">2. Haftanın Çalışmasını Tamamla</h5>
            <p className="text-xs text-slate-500">
              Tüm harcama süzgecini tamamladın; kurtardığın +{monthlySaved.toLocaleString('tr-TR')} ₺/ay tasarrufu kaydederek haftalık dersi bitirebilirsin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCompleteLesson}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>2. Haftayı Bitir ve Tasarrufu Kaydet</span>
          </button>
        </div>
      ) : isLessonCompleted ? (
        <div className="p-8 sm:p-10 bg-gradient-to-br from-[#0E1E38] via-[#122444] to-[#0A1628] text-white rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 w-full">
          {/* Arka plan ışıltıları */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#004BFA]/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="space-y-3 text-center sm:text-left">
              <h3 className="text-3xl sm:text-4xl font-normal clash-title text-white tracking-tight">
                Tebrikler!
              </h3>

              <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed font-normal">
                Harcama süzgecini ve pazarlık masasını başarıyla tamamladın. Hayat standardını bozmadan her ay masada tam <strong className="text-emerald-400 font-semibold">+{monthlySaved.toLocaleString('tr-TR')} ₺</strong> ek tohum bıraktın. Bu rakam yılda <strong className="text-emerald-400 font-semibold">+{yearlySaved.toLocaleString('tr-TR')} ₺</strong> değerinde üreten şirket hissesi demektir!
              </p>

              <div className="pt-1">
                <p className="text-emerald-300 font-semibold text-sm sm:text-base">
                  Sıradaki ders haftaya Pazartesi gelecektir.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/dashboard/akademi';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Akademi Haritasına Dön</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      ) : null}

    </div>
  );
}
