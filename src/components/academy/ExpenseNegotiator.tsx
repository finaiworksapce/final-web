'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingDown, 
  ArrowRight, 
  Check, 
  ArrowLeft,
  CheckCircle2,
  Coins,
  RotateCcw,
  Wallet
} from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';
import { 
  PREDEFINED_EXPENSES, 
  ExpenseCategory, 
  PredefinedExpense,
  getNegotiationDialogue,
  DialogueContext
} from '@/data/academy/negotiation-dialogues';

interface CashItem {
  id: string;
  name: string;
  amount: number;
}

interface NegotiatedItem extends PredefinedExpense {
  originalAmount: number;
  currentAmount: number;
  targetCutAmount: number;
  status: 'pending' | 'in_progress' | 'settled';
  turns: number;
  lastDialogue: string;
}

const POSSIBLE_STORAGE_KEYS = [
  'finai_cashflow_data_v2',
  'finai_cashflow_data',
  'finai_cash_flow_data',
  'finai_cash_flow',
];
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

  const [incomes, setIncomes] = useState<CashItem[]>([
    { id: 'inc-1', name: 'Aylık Maaş / Ana Gelir', amount: 35000 },
  ]);
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

      let loadedIncomes: CashItem[] = [];
      let loadedExpenses: { name: string; amount: number }[] = [];

      // 1. Haftada kaydedilmiş olabilecek tüm olası anahtarları sırayla tara
      for (const key of POSSIBLE_STORAGE_KEYS) {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed) {
              if (Array.isArray(parsed.incomes) && parsed.incomes.length > 0 && loadedIncomes.length === 0) {
                loadedIncomes = parsed.incomes.map((inc: any, i: number) => ({
                  id: inc.id || `inc-${i}`,
                  name: inc.name || 'Ana Gelir',
                  amount: Number(inc.amount) || 0,
                })).filter((inc: any) => inc.amount > 0 || inc.name);
              }
              if (Array.isArray(parsed.expenses) && parsed.expenses.length > 0 && loadedExpenses.length === 0) {
                loadedExpenses = parsed.expenses.map((e: any) => ({
                  name: e.name || 'Özel Kalem',
                  amount: Number(e.amount) || 0,
                })).filter((e: any) => e.amount > 0 || e.name);
              }
            }
          } catch {
            // continue
          }
        }
      }

      if (loadedIncomes.length > 0) {
        setIncomes(loadedIncomes);
      }

      // Eğer 1. haftada hiçbir gider bulunamadıysa varsayılan 4 kalemi alalım
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
  const totalIncome = useMemo(
    () => incomes.reduce((acc, it) => acc + (Number(it.amount) || 0), 0),
    [incomes]
  );
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
  const remainingCashFlow = totalIncome - totalCurrent;

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

  // Tekrar Pazarlık Et (Uzlaşmayı yeniden açma)
  const handleReNegotiate = (itemIndex: number) => {
    setItems((prev) =>
      prev.map((it, idx) => {
        if (idx === itemIndex) {
          const initialDialogue = getNegotiationDialogue({
            category: it.category,
            round: 0,
            isSettled: false,
            context: {
              userName,
              itemName: it.name,
              currentAmount: it.originalAmount,
              suggestedCut: it.targetCutAmount,
            },
          });
          return {
            ...it,
            status: 'in_progress',
            turns: 0,
            currentAmount: it.originalAmount,
            lastDialogue: initialDialogue,
          };
        }
        return it;
      })
    );
    setCurrentIndex(itemIndex);
    setUserOfferInput('');
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

      // Güncellenmiş optimize giderleri hem v2 hem legacy anahtarlarına kaydet
      const updatedExpenses = items.map((it) => ({
        id: it.id,
        name: it.name,
        amount: it.currentAmount,
      }));

      const payload = JSON.stringify({
        incomes,
        expenses: updatedExpenses,
      });

      for (const key of POSSIBLE_STORAGE_KEYS) {
        localStorage.setItem(key, payload);
      }
    } catch {
      // ignore
    }
  };

  const isCurrentSettled = currentItem?.status === 'settled';
  const allItemsSettled = items.length > 0 && items.every((it) => it.status === 'settled');

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300">
      
      {/* =========================================================================
          ÜST ALAN: PAZARLIK MASASI & CANLI GELİR-GİDER TABLOSU (EN ÜSTTE)
          ========================================================================= */}
      <div className="w-full bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-7">
        
        {/* Üst Başlık & İlerleme Bölmeleri */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title tracking-tight">
              Harcama Masası & Pazarlık İstasyonu
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Kalem {currentIndex + 1} / {items.length} — FinAi Workspace Ekibi ile karşılıklı uzlaşarak sızıntıları buduyoruz.
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
            İKİLİ ÇALIŞMA ALANI: 
            SOL KOLON: 1. Hafta Gelir & Gider Tablosu (Akış / Spotlight Ticker)
            SAĞ KOLON: FinAi Workspace Ekibi Diyalog & Pazarlık Masası
            ========================================================================= */}
        {currentItem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-1 items-start">
            
            {/* SOL KOLON: 1. HAFTA CANLI GELİR - GİDER TABLOSU (5 Kolon) */}
            <div className="lg:col-span-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 p-5 sm:p-6 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#004BFA]" />
                  <span className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wider">
                    1. Hafta Nakit Akış Tablon
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Canlı Bilanço
                </span>
              </div>

              {/* GELİRLER BÖLÜMÜ */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Aylık Düzenli Gelirler
                </span>
                <div className="space-y-1.5">
                  {incomes.map((inc) => (
                    <div
                      key={inc.id}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/60 text-xs shadow-2xs"
                    >
                      <span className="font-medium text-slate-700 truncate pr-2">
                        {inc.name}
                      </span>
                      <span className="font-semibold text-emerald-700 shrink-0">
                        +{inc.amount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GİDERLER BÖLÜMÜ (SPOTLIGHT / TİCKER ETKİSİ) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Aylık Harcama Kalemleri
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    (İlgili kaleme tıkla)
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => {
                    const isFocus = idx === currentIndex;
                    const isSettled = item.status === 'settled';
                    const hasSaved = item.originalAmount > item.currentAmount;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`p-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
                          isFocus
                            ? 'bg-blue-50/90 border-2 border-[#004BFA] shadow-md shadow-[#004BFA]/10 scale-[1.01] opacity-100'
                            : 'bg-white/70 border border-slate-200/60 opacity-40 hover:opacity-85 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {isSettled ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <div
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  isFocus ? 'bg-[#004BFA] animate-pulse' : 'bg-slate-300'
                                }`}
                              />
                            )}
                            <span
                              className={`truncate text-xs sm:text-sm ${
                                isFocus ? 'font-bold text-[#0E1E38]' : 'font-medium text-slate-700'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          {isFocus && (
                            <span className="inline-flex items-center text-[10px] font-bold text-[#004BFA] bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                              ● Masada
                            </span>
                          )}
                        </div>

                        {/* Rakam Alanı */}
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/40">
                          <span className="text-[11px] text-slate-400">
                            {hasSaved ? 'Optimize Tutar' : 'Mevcut Tutar'}
                          </span>
                          <div className="flex items-center gap-2">
                            {hasSaved && (
                              <span className="line-through text-[11px] text-slate-400">
                                {item.originalAmount.toLocaleString('tr-TR')} ₺
                              </span>
                            )}
                            <span
                              className={`font-semibold ${
                                isFocus
                                  ? 'text-[#004BFA] text-sm font-bold'
                                  : isSettled && hasSaved
                                  ? 'text-emerald-700'
                                  : 'text-slate-800'
                              }`}
                            >
                              {item.currentAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BİLANÇO DİP TOPLAMI */}
              <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Toplam Gelir:</span>
                  <span className="font-semibold text-slate-700">
                    +{totalIncome.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Masadaki Güncel Gider:</span>
                  <span className="font-semibold text-slate-700">
                    -{totalCurrent.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/50 font-semibold">
                  <span className="text-[#0E1E38]">Kalan Serbest Nakit:</span>
                  <span className="text-emerald-600 font-bold">
                    +{remainingCashFlow.toLocaleString('tr-TR')} ₺ / ay
                  </span>
                </div>
              </div>

            </div>

            {/* SAĞ KOLON: FİNAİ WORKSPACE EKİBİ & DİYALOG ALANI (7 Kolon) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* FinAi Workspace Ekibi Başlığı ve Odak Kalem Bilgisi */}
              <div className="space-y-4">
                
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img src="/icon.png" alt="FinAi" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-[#0E1E38] tracking-tight">
                        FinAi Workspace Ekibi
                      </h4>
                      <span className="text-xs text-slate-400">
                        Giderleri Budama ve Tasarruf Masası
                      </span>
                    </div>
                  </div>
                </div>

                {/* Masadaki Kalemin Özet Şeridi */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Görüşülen Harcama Kalemi
                    </span>
                    <h5 className="text-lg sm:text-xl font-medium text-[#0E1E38] clash-title">
                      {currentItem.name}
                    </h5>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        1. Hafta Tutarın
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {currentItem.originalAmount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                    <div className="h-6 w-px bg-slate-200" />
                    <div>
                      <span className="text-[10px] text-[#004BFA] uppercase tracking-wider block font-semibold">
                        Masadaki Tutar
                      </span>
                      <span className="text-lg font-bold text-[#004BFA] clash-title">
                        {currentItem.currentAmount.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>

                {/* FinAi Workspace Ekibi Mesaj Kutusu (Derin Lacivert, Yüksek Kontrast, Görsel Odak) */}
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0E1E38] via-[#122444] to-[#0A1628] text-white shadow-xl shadow-[#0E1E38]/15 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-56 h-56 bg-[#004BFA]/15 rounded-full blur-[70px] pointer-events-none" />
                  <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-100 font-normal relative z-10">
                    {currentItem.lastDialogue}
                  </p>
                </div>

              </div>

              {/* Kullanıcı Karşı Hamle / Teklif / Uzlaşma Alanı */}
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

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      {/* Tekrar Pazarlık Et Butonu */}
                      <button
                        type="button"
                        onClick={() => handleReNegotiate(currentIndex)}
                        className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#0E1E38] hover:bg-slate-50 text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tekrar Pazarlık Et</span>
                      </button>

                      {/* Sonraki Pazarlığa Geç Butonu */}
                      <button
                        type="button"
                        onClick={handleNextItem}
                        className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs cursor-pointer shrink-0"
                      >
                        <span>
                          {currentIndex < items.length - 1 ? 'Sonraki Pazarlığa Geç' : 'Sonuçları Gör'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
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
          ALT GÖSTERGE & CANLI TASARRUF SAYACI (PAZARLIK BİTTİĞİNDE / ALT KISIMDA)
          ========================================================================= */}
      <div className="space-y-6 pt-2">
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

        {/* Dersi Bitir Butonu veya Tebrikler Kartı */}
        {(allItemsSettled || isFinishedAll) && !isLessonCompleted ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="space-y-1 text-center sm:text-left">
              <h5 className="text-base font-semibold text-[#0E1E38]">
                2. Haftanın Pazarlık Masasını Tamamladın!
              </h5>
              <p className="text-xs sm:text-sm text-slate-600">
                Tüm harcama süzgecini tamamladın; kurtardığın <strong className="text-emerald-600">+{monthlySaved.toLocaleString('tr-TR')} ₺/ay</strong> tasarrufu kaydederek haftalık dersi bitirebilirsin.
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

    </div>
  );
}
