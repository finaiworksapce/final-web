'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  TrendingDown, 
  ArrowRight, 
  Check, 
  ArrowLeft,
  Building2,
  Flame,
  CheckCircle2,
  Coins,
  Sparkles
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
          ÜST GÖSTERGE & CANLI TASARRUF SAYACI (Minimalist ve Rafine Kartlar)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        
        {/* Kart 1: Önceki Gider */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            1. Hafta Sıfır Noktan
          </span>
          <div className="text-2xl sm:text-3xl font-normal text-[#0E1E38] clash-title mt-2">
            {totalOriginal.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-xs text-slate-500 mt-1">Önceki Aylık Toplam Gider</span>
        </div>

        {/* Kart 2: Yeni Optimize Gider */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#004BFA] uppercase tracking-wider block">
            Yeni Masadaki Bütçe
          </span>
          <div className="text-2xl sm:text-3xl font-normal text-[#004BFA] clash-title mt-2">
            {totalCurrent.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-xs text-slate-500 mt-1">Optimize Edilmiş Aylık Gider</span>
        </div>

        {/* Kart 3: Aylık Kurtarılan Net */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aylık Kurtarılan Net</span>
          </span>
          <div className="text-2xl sm:text-3xl font-normal text-emerald-600 clash-title mt-2">
            +{monthlySaved.toLocaleString('tr-TR')} ₺ / ay
          </div>
          <span className="text-xs text-slate-500 mt-1">Tüketimden Kurtarılan Taze Nakit</span>
        </div>

        {/* Kart 4: Yıllık Ortaklık Tohumu */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-[#0E1E38] uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#004BFA]" />
            <span>Yıllık Ortaklık Tohumu</span>
          </span>
          <div className="text-2xl sm:text-3xl font-normal text-[#0E1E38] clash-title mt-2">
            +{yearlySaved.toLocaleString('tr-TR')} ₺ / yıl
          </div>
          <span className="text-xs text-slate-500 mt-1">BIST Şirketlerine Yatırım Gücü</span>
        </div>

      </div>

      {/* =========================================================================
          ANA ÇALIŞMA ALANI & PAZARLIK MASASI
          ========================================================================= */}
      <div className="w-full bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Üst Başlık & İlerleme Çubuğu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title tracking-tight">
              Kişisel Harcama Masası & Pazarlık
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Kalem {currentIndex + 1} / {items.length} — FinAi Koçu ile karşılıklı uzlaşarak sızıntıları buduyoruz.
            </p>
          </div>

          {/* İlerleme Bölmeleri */}
          <div className="flex items-center gap-1.5 shrink-0">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-8 bg-[#004BFA]'
                    : it.status === 'settled'
                    ? 'w-5 bg-emerald-500'
                    : 'w-5 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`${it.name} (${it.status === 'settled' ? 'Uzlaşıldı' : 'Sırada'})`}
              />
            ))}
          </div>
        </div>

        {/* =========================================================================
            ODAKLANILAN GİDER KARTI VE DİYALOG ALANI
            ========================================================================= */}
        {currentItem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-2">
            
            {/* SOL KOLON: ODAK KALEM KARTI (5 Kolon) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      currentItem.category === 'A'
                        ? 'bg-slate-200/80 text-slate-700 border border-slate-300/60'
                        : currentItem.category === 'B'
                        ? 'bg-blue-50 text-[#004BFA] border border-blue-100'
                        : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}
                  >
                    {currentItem.category === 'A' && <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />}
                    {currentItem.category === 'B' && <Building2 className="w-3.5 h-3.5 text-[#004BFA]" />}
                    {currentItem.category === 'C' && <Flame className="w-3.5 h-3.5 text-purple-600" />}
                    <span>
                      {currentItem.category === 'A' && 'Sabit Yaşam Gideri'}
                      {currentItem.category === 'B' && 'Yarı-Değişken Gider'}
                      {currentItem.category === 'C' && 'Esnek / Keyfi Tüketim'}
                    </span>
                  </span>

                  {isCurrentSettled && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>Uzlaşıldı</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-medium text-[#0E1E38] clash-title tracking-tight">
                    {currentItem.name}
                  </h4>
                </div>

                {/* Sayısal Göstergeler */}
                <div className="pt-2 space-y-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>1. Hafta Tutarın</span>
                    <span className="font-semibold text-slate-700">
                      {currentItem.originalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Masa Tutarı</span>
                    <span className="text-lg sm:text-xl font-bold text-[#004BFA] clash-title">
                      {currentItem.currentAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                  {currentItem.originalAmount > currentItem.currentAmount && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold pt-1 border-t border-slate-200/40">
                      <span>Kurtarılan Tasarruf</span>
                      <span>
                        +{(currentItem.originalAmount - currentItem.currentAmount).toLocaleString('tr-TR')} ₺ / ay
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hızlı Kısma Seçenekleri (Kullanıcıya Kolaylık) */}
              {!isCurrentSettled && currentItem.category !== 'A' && (
                <div className="space-y-2 pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Hızlı Seçenekler:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.9))}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] hover:bg-blue-50/20 transition-all cursor-pointer text-center"
                    >
                      -%10 Kıs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.75))}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] hover:bg-blue-50/20 transition-all cursor-pointer text-center"
                    >
                      -%25 Budama
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOffer(Math.round(currentItem.originalAmount * 0.5))}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#004BFA] hover:text-[#004BFA] hover:bg-blue-50/20 transition-all cursor-pointer text-center"
                    >
                      -%50 Cesur
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SAĞ KOLON: FİNAİ KOÇU VE DİYALOG ALANI (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* FinAi Koçunun Konuşma Kartı (Rafine Lacivert Gradyan Kart) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0E1E38] text-white text-xs font-bold flex items-center justify-center border border-slate-200 shadow-xs shrink-0">
                    FA
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-[#0E1E38]">
                      FinAi Tasarruf Koçu
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {currentItem.category === 'A'
                        ? '0 Pazarlık (Korumalı Sabit Gider)'
                        : currentItem.category === 'B'
                        ? `${1 - currentItem.turns > 0 ? '1 Karşı Teklif Hakkı' : 'Son Uzlaşma Turu'}`
                        : `${2 - currentItem.turns > 0 ? `${2 - currentItem.turns} Israr Turu` : 'Son Uzlaşma Turu'}`}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0E1E38] via-[#122444] to-[#0A1628] text-white shadow-xl shadow-[#0E1E38]/10 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#004BFA]/10 rounded-full blur-[60px] pointer-events-none" />
                  <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal relative z-10">
                    {currentItem.lastDialogue}
                  </p>
                </div>
              </div>

              {/* Kullanıcı Karşı Hamle / Teklif Alanı */}
              <div className="space-y-3 pt-2">
                {!isCurrentSettled ? (
                  currentItem.category === 'A' ? (
                    <button
                      type="button"
                      onClick={() => handleOffer(currentItem.originalAmount)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Bu Sabit Gideri Aynen Koru ve Devam Et →</span>
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
                          placeholder="Önerdiğin yeni aylık tutar (örn: 5500)"
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm font-semibold text-[#0E1E38] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#004BFA]/20 focus:border-[#004BFA] transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
                          ₺
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!userOfferInput || Number(userOfferInput) <= 0}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed shrink-0"
                      >
                        Teklif Et →
                      </button>
                    </form>
                  )
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-medium">
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

                {/* Alt Gezinme Barı */}
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
