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
  Wallet,
  Send,
  Pencil,
  Plus,
  Trash2,
  X,
  HelpCircle
} from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
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

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface NegotiatedItem extends PredefinedExpense {
  originalAmount: number;
  currentAmount: number;
  targetCutAmount: number;
  status: 'pending' | 'in_progress' | 'settled';
  turns: number;
  lastDialogue: string;
  chatHistory: ChatMessage[];
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

  // Hızlı Tablo Düzenleme Modalı
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [editIncomes, setEditIncomes] = useState<CashItem[]>([]);
  const [editExpenses, setEditExpenses] = useState<{ id: string; name: string; amount: number }[]>([]);

  // 1. Hafta Verisini veya Varsayılanları Yükle
  useEffect(() => {
    try {
      const completed = localStorage.getItem(LESSON_2_KEY);
      if (completed === 'true') {
        setIsLessonCompleted(true);
      }

      let loadedIncomes: CashItem[] = [];
      let loadedExpenses: { name: string; amount: number }[] = [];

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

      if (loadedExpenses.length === 0) {
        loadedExpenses = PREDEFINED_EXPENSES.slice(0, 4).map((p) => ({
          name: p.name,
          amount: p.defaultAmount,
        }));
      }

      const initialItems: NegotiatedItem[] = loadedExpenses.map((exp, idx) => {
        const category = detectCategory(exp.name);
        const amount = exp.amount;

        let targetCut = amount;
        if (category === 'A') targetCut = amount;
        if (category === 'B') targetCut = Math.round((amount * 0.85) / 100) * 100;
        if (category === 'C') targetCut = Math.round((amount * 0.5) / 100) * 100;

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

        const initialHistory: ChatMessage[] = [
          {
            id: `msg-${idx}-0`,
            sender: 'ai',
            text: initialDialogue,
            time: 'Şimdi',
          },
        ];

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
          chatHistory: initialHistory,
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

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: `${offerAmount.toLocaleString('tr-TR')} ₺ olarak güncellemeyi teklif ediyorum.`,
      time: 'Şimdi',
    };

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now() + 1}`,
      sender: 'ai',
      text: newDialogue,
      time: 'Şimdi',
    };

    const updated = items.map((it, idx) => {
      if (idx === currentIndex) {
        return {
          ...it,
          currentAmount: offerAmount,
          turns: nextTurns,
          status: nextStatus,
          lastDialogue: newDialogue,
          chatHistory: [...it.chatHistory, userMsg, aiMsg],
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
            chatHistory: [
              ...it.chatHistory,
              {
                id: `re-${Date.now()}`,
                sender: 'ai',
                text: initialDialogue,
                time: 'Şimdi',
              },
            ],
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

  // Düzenleme Modalı Aç
  const handleOpenEditModal = () => {
    setEditIncomes(JSON.parse(JSON.stringify(incomes)));
    setEditExpenses(
      items.map((it) => ({
        id: it.id,
        name: it.name,
        amount: it.originalAmount,
      }))
    );
    setIsEditingTable(true);
  };

  // Düzenlemeleri Kaydet
  const handleSaveEditedTable = () => {
    const validIncomes = editIncomes.filter((inc) => inc.name.trim() && inc.amount > 0);
    const validExpenses = editExpenses.filter((exp) => exp.name.trim() && exp.amount > 0);

    if (validIncomes.length === 0 || validExpenses.length === 0) {
      alert('Lütfen en az bir geçerli gelir ve gider kalemi giriniz.');
      return;
    }

    setIncomes(validIncomes);

    const newItems: NegotiatedItem[] = validExpenses.map((exp, idx) => {
      const existing = items.find((it) => it.name.toLowerCase() === exp.name.toLowerCase());
      const category = detectCategory(exp.name);
      const amount = exp.amount;

      let targetCut = amount;
      if (category === 'A') targetCut = amount;
      if (category === 'B') targetCut = Math.round((amount * 0.85) / 100) * 100;
      if (category === 'C') targetCut = Math.round((amount * 0.5) / 100) * 100;

      if (existing) {
        return {
          ...existing,
          name: exp.name,
          originalAmount: amount,
          currentAmount: existing.status === 'settled' ? existing.currentAmount : amount,
          targetCutAmount: targetCut,
        };
      }

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
        id: `item-${Date.now()}-${idx}`,
        name: exp.name,
        category,
        defaultAmount: amount,
        originalAmount: amount,
        currentAmount: amount,
        targetCutAmount: targetCut,
        status: idx === 0 ? (category === 'A' ? 'settled' : 'in_progress') : 'pending',
        turns: 0,
        lastDialogue: initialDialogue,
        chatHistory: [
          {
            id: `msg-${idx}-init`,
            sender: 'ai',
            text: initialDialogue,
            time: 'Şimdi',
          },
        ],
        description: '',
      };
    });

    setItems(newItems);
    if (currentIndex >= newItems.length) {
      setCurrentIndex(0);
    }

    try {
      const payload = JSON.stringify({
        incomes: validIncomes,
        expenses: validExpenses,
      });
      for (const key of POSSIBLE_STORAGE_KEYS) {
        localStorage.setItem(key, payload);
      }
    } catch {}

    setIsEditingTable(false);
  };

  // 2. Haftayı Tamamlama Aksiyonu
  const handleCompleteLesson = () => {
    setIsLessonCompleted(true);
    try {
      localStorage.setItem(LESSON_2_KEY, 'true');

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

  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);

  // Driver.js Bire Bir Akıl Hocası Spotlight (Odaklama) Turu
  const runSpotlightTour = (force = false) => {
    try {
      if (typeof window === 'undefined') return;
      if (!force && localStorage.getItem('finai_negotiator_spotlight_seen') === 'true') {
        return;
      }

      const driverObj = driver({
        showProgress: false,
        animate: true,
        overlayColor: 'rgba(14, 30, 56, 0.78)',
        stagePadding: 10,
        stageRadius: 16,
        popoverClass: 'finai-driver-popover',
        steps: [
          {
            element: '#finai-consultation-stage',
            popover: {
              title: 'FinAi Akıl Hocası Masası',
              description: 'Bu masada harcamaların tek tek seninle birlikte değerlendirilir. Sabit giderlerini koruyup, gereksiz tüketim sızıntılarını birlikte optimize edeceğiz.',
              nextBtnText: 'Masaya Başla →',
            },
          },
        ],
        onDestroyed: () => {
          try {
            localStorage.setItem('finai_negotiator_spotlight_seen', 'true');
          } catch {}
        },
      });

      setTimeout(() => {
        driverObj.drive();
      }, 350);
    } catch (err) {
      console.warn('Driver.js spotlight başlatılamadı:', err);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      runSpotlightTour(false);
    }
  }, [items.length]);

  const isCurrentSettled = currentItem?.status === 'settled';
  const allItemsSettled = items.length > 0 && items.every((it) => it.status === 'settled');
  const showSummaryMetrics = allItemsSettled || isFinishedAll;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 flex-1 flex flex-col">
      
      {/* =========================================================================
          ANA ÇALIŞMA MASASI:
          BİRE BİR DANIŞMANLIK İSTASYONU (SAYFANIN MERKEZİNDE ODAKLI MİZANPAJ)
          ========================================================================= */}
      <div className="w-full flex-1 flex flex-col space-y-6">
        
        {/* Üst Navigasyon & Durum Barı */}
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title tracking-tight">
                Harcama Masası & Pazarlık İstasyonu
              </h3>
              {currentItem && (
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                  currentItem.category === 'A'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : currentItem.category === 'B'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {currentItem.category === 'A' ? 'Sabit Gider' : currentItem.category === 'B' ? 'Temel Yaşam' : 'Esnek Sızıntı'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Gereksiz pazarlıklarla vakit kaybetmeden doğrudan nakit sızıntılarını masaya yatırıyoruz.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Spotlight Rehberi Butonu */}
            <button
              type="button"
              onClick={() => runSpotlightTour(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
              title="Akıl hocası odaklama turunu yeniden başlat"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Rehberi Aç</span>
            </button>

            {/* İlerleme Bölmeleri */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-[#004BFA]'
                      : it.status === 'settled'
                      ? 'w-4 bg-emerald-500'
                      : 'w-4 bg-slate-200 hover:bg-slate-300'
                  }`}
                  title={`${it.name} (${it.status === 'settled' ? 'Uzlaşıldı' : 'Sırada'})`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SAYFANIN TAM ORTASINDA: FİNAİ AKIL HOCASI BİRE BİR DANIŞMANLIK SAHNESİ
            ========================================================================= */}
        {currentItem && (
          <div className="w-full max-w-4xl mx-auto space-y-5">
            
            {/* ODAK SAHNESİ: BİRE BİR DİYALOG KARTI */}
            <div 
              id="finai-consultation-stage"
              className="w-full bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl shadow-[#0E1E38]/10 border border-white/10 flex flex-col justify-between space-y-6"
            >
              
              {/* Diyalog Üst Başlığı (Akıl Hocası Kimliği) */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <img src="/icon.png" alt="FinAi" className="w-8 h-8 object-contain shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-wide">
                      FinAi Workspace Ekibi
                    </h4>
                    <span className="text-[11px] text-white/50 block">
                      Kişisel Bütçe ve Sermaye Akıl Hocası • Şimdi
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-white/60 block">Görüşülen Kalem</span>
                  <span className="text-sm sm:text-base font-semibold text-[#78B8F5]">
                    {currentItem.name} ({currentItem.currentAmount.toLocaleString('tr-TR')} ₺)
                  </span>
                </div>
              </div>

              {/* Diyalog Metni (Bire Bir Konuşma Alanı) */}
              <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                {currentItem.chatHistory && currentItem.chatHistory.length > 0 ? (
                  <div className="space-y-3">
                    {currentItem.chatHistory.map((msg) => {
                      const isAi = msg.sender === 'ai';
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 max-w-[95%] ${
                            isAi ? 'self-start' : 'ml-auto justify-end'
                          }`}
                        >
                          <div
                            className={`p-4 sm:p-5 rounded-xl text-sm sm:text-base leading-relaxed ${
                              isAi
                                ? 'bg-white/10 text-white border border-white/10'
                                : 'bg-[#004BFA] text-white shadow-sm'
                            }`}
                          >
                            <p className="font-normal font-clash">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-xl bg-white/10 border border-white/10">
                    <p className="text-sm sm:text-base lg:text-lg text-white font-normal leading-relaxed font-clash">
                      {currentItem.lastDialogue}
                    </p>
                  </div>
                )}
              </div>

              {/* Eylem Butonları & Teklif Alanı */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                {!isCurrentSettled ? (
                  currentItem.category === 'A' ? (
                    <button
                      type="button"
                      onClick={() => handleOffer(currentItem.originalAmount)}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
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
                          placeholder="Önerdiğin aylık tutarı yaz (örn: 5500 ₺)..."
                          className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-slate-900/80 border border-white/20 text-sm sm:text-base font-semibold text-white placeholder:text-white/40 focus:outline-hidden focus:ring-2 focus:ring-[#004BFA] transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/50 font-semibold">
                          ₺
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!userOfferInput || Number(userOfferInput) <= 0}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] disabled:bg-white/10 disabled:text-white/40 text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                      >
                        <span>Teklif Et</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => handleReNegotiate(currentIndex)}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-300" />
                      <span>Tekrar Pazarlık Et</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextItem}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <span>
                        {currentIndex < items.length - 1 ? 'Sonraki Pazarlığa Geç' : 'Sonuçları Gör'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Alt Gezinme Barı */}
                <div className="flex justify-between items-center text-xs text-white/50 pt-1">
                  <button
                    type="button"
                    onClick={handlePrevItem}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-1 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 cursor-pointer disabled:cursor-not-allowed transition-colors"
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

            {/* HIZLI NAKİT AKIŞ VE BÜTÇE ŞERİDİ (MASANIN HEMEN ALTINDA DENGEYİ GÖSTERİR) */}
            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Mevcut Gider:</span>
                  <span className="font-semibold text-[#0E1E38]">-{totalCurrent.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Kalan Serbest Nakit:</span>
                  <span className="font-bold text-emerald-600">+{remainingCashFlow.toLocaleString('tr-TR')} ₺ / ay</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTableDrawerOpen(!isTableDrawerOpen)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004BFA] hover:text-[#003ad1] cursor-pointer self-start sm:self-auto"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>{isTableDrawerOpen ? 'Bütçe Tablosunu Gizle ▲' : 'Bütçe Tablosunu İncele ▼'}</span>
              </button>
            </div>

            {/* AÇILIR BÜTÇE & NAKİT AKIŞ TABLOSU PANELİ */}
            {isTableDrawerOpen && (
              <div className="w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#004BFA]" />
                    <span className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wider">
                      1. Hafta Nakit Akış Tablon
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenEditModal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-600 hover:text-[#004BFA] hover:border-[#004BFA] transition-all cursor-pointer shadow-2xs"
                  >
                    <Pencil className="w-3 h-3 text-[#004BFA]" />
                    <span>Düzenle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                  {/* Gelirler */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Aylık Düzenli Gelirler
                    </span>
                    <div className="space-y-1.5">
                      {incomes.map((inc) => (
                        <div
                          key={inc.id}
                          className="py-1.5 border-b border-slate-100 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-700 truncate pr-2">{inc.name}</span>
                          <span className="font-semibold text-emerald-700 shrink-0">+{inc.amount.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 font-semibold flex justify-between">
                      <span>Toplam Gelir:</span>
                      <span className="text-slate-800">+{totalIncome.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </div>

                  {/* Giderler */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Aylık Harcama Kalemleri
                    </span>
                    <div className="space-y-1">
                      {items.map((item, idx) => {
                        const isFocus = idx === currentIndex;
                        const isSettled = item.status === 'settled';
                        const hasSaved = item.originalAmount > item.currentAmount;

                        return (
                          <div
                            key={item.id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`py-1.5 px-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-between text-xs ${
                              isFocus
                                ? 'bg-blue-50 text-[#0E1E38] font-bold border-l-2 border-[#004BFA]'
                                : 'text-slate-600 opacity-60 hover:opacity-100 border-l-2 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate pr-1.5">
                              {isSettled ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : (
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isFocus ? 'bg-[#004BFA]' : 'bg-slate-300'}`} />
                              )}
                              <span className="truncate">{item.name}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {hasSaved && (
                                <span className="line-through text-[10px] text-slate-400">
                                  {item.originalAmount.toLocaleString('tr-TR')} ₺
                                </span>
                              )}
                              <span className={isFocus ? 'text-[#004BFA] font-bold' : isSettled && hasSaved ? 'text-emerald-700 font-semibold' : 'text-slate-800 font-medium'}>
                                {item.currentAmount.toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 font-semibold flex justify-between">
                      <span>Masadaki Gider:</span>
                      <span className="text-slate-800">-{totalCurrent.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* =========================================================================
          ALT GÖSTERGE & CANLI TASARRUF SAYACI:
          (YALNIZCA TÜM PAZARLIKLAR BİTTİĞİNDE GÖSTERİLECEK)
          ========================================================================= */}
      {showSummaryMetrics && (
        <div className="space-y-6 pt-2 animate-in fade-in zoom-in-95 duration-400">
          
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
          {!isLessonCompleted ? (
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
          ) : (
            <div className="p-8 sm:p-10 bg-gradient-to-br from-[#0E1E38] via-[#122444] to-[#0A1628] text-white rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 w-full">
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
          )}

        </div>
      )}

      {/* =========================================================================
          HIZLI TABLO DÜZENLEME MODALI (POPUP)
          ========================================================================= */}
      {isEditingTable && (
        <div className="fixed inset-0 z-50 bg-[#0E1E38]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h4 className="text-lg font-semibold text-[#0E1E38] clash-title">
                  Nakit Akış Kalemlerini Düzenle
                </h4>
                <p className="text-xs text-slate-500">
                  Gelir ve gider kalemlerini güncelleyebilir, yeni kalem ekleyip çıkarabilirsin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingTable(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GELİRLER DÜZENLEME */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wider">
                  Gelir Kalemleri
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEditIncomes((prev) => [
                      ...prev,
                      { id: `inc-${Date.now()}`, name: 'Ek Gelir', amount: 5000 },
                    ])
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#004BFA] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gelir Ekle</span>
                </button>
              </div>

              <div className="space-y-2">
                {editIncomes.map((inc, i) => (
                  <div key={inc.id || i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inc.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditIncomes((prev) =>
                          prev.map((item, idx) => (idx === i ? { ...item, name: val } : item))
                        );
                      }}
                      placeholder="Gelir Adı"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#0E1E38]"
                    />
                    <div className="relative w-36">
                      <input
                        type="number"
                        value={inc.amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditIncomes((prev) =>
                            prev.map((item, idx) => (idx === i ? { ...item, amount: val } : item))
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0E1E38]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                        ₺
                      </span>
                    </div>
                    {editIncomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditIncomes((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GİDERLER DÜZENLEME */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wider">
                  Harcama Kalemleri
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEditExpenses((prev) => [
                      ...prev,
                      { id: `exp-${Date.now()}`, name: 'Yeni Harcama', amount: 3000 },
                    ])
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#004BFA] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gider Ekle</span>
                </button>
              </div>

              <div className="space-y-2">
                {editExpenses.map((exp, i) => (
                  <div key={exp.id || i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={exp.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditExpenses((prev) =>
                          prev.map((item, idx) => (idx === i ? { ...item, name: val } : item))
                        );
                      }}
                      placeholder="Gider Adı"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#0E1E38]"
                    />
                    <div className="relative w-36">
                      <input
                        type="number"
                        value={exp.amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditExpenses((prev) =>
                            prev.map((item, idx) => (idx === i ? { ...item, amount: val } : item))
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0E1E38]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                        ₺
                      </span>
                    </div>
                    {editExpenses.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditExpenses((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="p-2 text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL AKSİYONLARI */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingTable(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSaveEditedTable}
                className="px-6 py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                Kaydet ve Masaya Dön
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
