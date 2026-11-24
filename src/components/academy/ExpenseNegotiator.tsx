'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle,
  Maximize2,
  Minimize2
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

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inlineChatEndRef = useRef<HTMLDivElement>(null);

  // Otomatik olarak son mesaja kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inlineChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, currentIndex]);

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

    // Özel Durum Tespiti (Sıfır Kısma, Aşırı Kısma, Israr)
    let specialCondition: 'zero_cut' | 'extreme_cut' | 'same_offer' | undefined = undefined;
    if (category !== 'A') {
      if (offerAmount >= currentItem.originalAmount) {
        specialCondition = 'zero_cut';
      } else if (offerAmount <= currentItem.originalAmount * 0.25) {
        specialCondition = 'extreme_cut';
      } else if (currentItem.turns > 0 && offerAmount === currentItem.currentAmount) {
        specialCondition = 'same_offer';
      }
    }

    if (category === 'A') {
      isSettled = true;
      nextStatus = 'settled';
    } else if (category === 'B') {
      if (nextTurns >= 1 && !specialCondition) {
        isSettled = true;
        nextStatus = 'settled';
      }
    } else if (category === 'C') {
      if (nextTurns >= 2 && !specialCondition) {
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
      specialCondition,
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

  const [isSpotlightActive, setIsSpotlightActive] = useState(true);

  const isCurrentSettled = currentItem?.status === 'settled';
  const allItemsSettled = items.length > 0 && items.every((it) => it.status === 'settled');
  const showSummaryMetrics = allItemsSettled || isFinishedAll;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 flex-1 flex flex-col relative">
      
      {/* =========================================================================
          DERİN KARARTMA KATMANI:
          TOPLAM VARLIK DEĞERİ GRADYANI VE AMBIENT IŞIMALARI
          ========================================================================= */}
      <AnimatePresence>
        {isSpotlightActive && (
          <motion.div
            key="spotlight-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] overflow-hidden pointer-events-auto"
          >
            {/* Ambient Background Gradient Circles (Toplam Varlık Kartı ile Birebir Aynı) */}
            <div className="absolute -top-24 -right-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#004BFA]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle SVG Wave Background (Toplam Varlık Trend Çizgisi) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <svg viewBox="0 0 500 160" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spotlightHeroWave" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#004BFA" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#5B80FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#5B80FF" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,118 C 60,130 90,125 140,112 C 190,99 220,118 270,103 C 320,88 360,95 400,72 C 430,55 465,38 500,24"
                  fill="none"
                  stroke="url(#spotlightHeroWave)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="499" cy="24" r="4" fill="#5B80FF" opacity="1" className="animate-pulse" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          ANA ÇALIŞMA MASASI:
          ORİJİNAL İKİLİ DÜZEN (SOL %65 SOHBET, SAĞ %35 NAKİT AKIŞ TABLOSU)
          ========================================================================= */}
      <div className="w-full bg-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between min-h-[580px] space-y-7">
        
        {/* Üst Başlık & Adım Butonları */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title tracking-tight">
              Tasarruf Planlaması
            </h3>
          </div>

          <div className="flex items-center gap-3">
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
        </div>

        {/* =========================================================================
            İKİLİ DÜZEN (SOHBET %65, TABLO %35, BOY EŞİT):
            SOL: FinAi Workspace Ekibi Mesajlaşması (%65)
            SAĞ: 1. Hafta Nakit Akış Tablosu (%35)
            ========================================================================= */}
        {currentItem && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch flex-1 w-full pt-1">
            
            {/* =====================================================================
                SOL KOLON: FİNAİ WORKSPACE EKİBİ CANLI MESAJLAŞMA (%65 BOYUTUNDA)
                (Spotlight anında animasyonla merkeze uçar, bittiğinde geri döner)
                ===================================================================== */}
            <div className="w-full lg:w-[65%] min-h-[520px] relative flex flex-col">
              
              {/* Spotlight açıkken sol kolondaki yer tutucu */}
              {isSpotlightActive && (
                <div className="w-full h-full min-h-[500px] rounded-2xl border-2 border-dashed border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center space-y-2">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#004BFA]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA] animate-pulse" />
                  </div>
                  <h5 className="text-sm font-semibold text-[#0E1E38] clash-title">
                    FinAi Akıl Hocası Görüşmesi Devam Ediyor
                  </h5>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Kararınızı onayladığınızda masadaki bütçe dengeniz anlık olarak güncellenecektir.
                  </p>
                </div>
              )}

              {/* HAREKETLİ BEYAZ SOHBET KARTI (BÜYÜTÜLMÜŞ, SOLDAN ORTAYA YAYLANMALI UÇUŞ) */}
              {isSpotlightActive ? (
                <motion.div
                  key={`spotlight-card-${currentIndex}`}
                  initial={{ x: "-70vw", y: "-50%", opacity: 0.1, scale: 0.88 }}
                  animate={{ x: "-50%", y: "-50%", opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    mass: 0.85
                  }}
                  className="fixed z-50 top-1/2 left-1/2 w-[95%] sm:w-[90%] max-w-3xl lg:max-w-4xl bg-white text-[#0E1E38] shadow-2xl rounded-3xl p-7 sm:p-10 lg:p-12 border border-slate-100 ring-1 ring-slate-900/10 flex flex-col justify-between space-y-6"
                >
                  {/* Kart Üst Bilgisi */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5">
                    <div className="flex items-center gap-3.5">
                      <img src="/icon.png" alt="FinAi" className="w-9 h-9 object-contain shrink-0" />
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-[#0E1E38] tracking-wide clash-title">
                          FinAi Workspace Ekibi
                        </h4>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Kişisel Bütçe ve Sermaye Akıl Hocası • Şimdi
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Görüşülen Kalem</span>
                      <span className="text-sm sm:text-base font-bold text-[#004BFA]">
                        {currentItem.name} ({currentItem.currentAmount.toLocaleString('tr-TR')} ₺)
                      </span>
                    </div>
                  </div>

                  {/* Beyaz Kart Üzerinde Büyütülmüş ve Ferah Kesintisiz Diyalog Alanı */}
                  <div className="my-2 sm:my-3 flex-1 overflow-y-auto max-h-[46vh] sm:max-h-[50vh] pr-2 space-y-4">
                    {items.slice(0, currentIndex + 1).map((item, itemIdx) => {
                      const isCurrent = itemIdx === currentIndex;
                      return (
                        <div key={item.id} className="space-y-3">
                          {/* 1'den fazla kalem varsa her kalemin ayrım başlığı */}
                          {currentIndex > 0 && (
                            <div className="flex items-center gap-3 py-1">
                              <div className="h-px bg-slate-200 flex-1" />
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  isCurrent
                                    ? 'bg-blue-50 text-[#004BFA] border border-blue-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {isCurrent ? '📌 Görüşülen Kalem: ' : '✓ Tamamlandı: '}
                                {item.name} ({item.currentAmount.toLocaleString('tr-TR')} ₺)
                              </span>
                              <div className="h-px bg-slate-200 flex-1" />
                            </div>
                          )}

                          {/* Bu kaleme ait mesajlar */}
                          {item.chatHistory && item.chatHistory.length > 0 ? (
                            item.chatHistory.map((msg) => {
                              const isAi = msg.sender === 'ai';
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex gap-3 max-w-[95%] ${
                                    isAi ? 'self-start' : 'ml-auto justify-end'
                                  }`}
                                >
                                  <div
                                    className={`p-4 sm:p-6 rounded-2xl text-sm sm:text-base leading-relaxed ${
                                      isAi
                                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80 shadow-2xs'
                                        : 'bg-[#004BFA] text-white shadow-xs'
                                    }`}
                                  >
                                    <p className="font-normal font-clash">{msg.text}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 shadow-2xs">
                              <p className="text-sm sm:text-base text-slate-800 font-normal leading-relaxed font-clash">
                                {item.lastDialogue}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Alt Aksiyon Butonları & Karar Alanı */}
                  <div className="pt-4 sm:pt-6 border-t border-slate-100 space-y-4 mt-auto">
                    {!isCurrentSettled ? (
                      currentItem.category === 'A' ? (
                        <button
                          type="button"
                          onClick={() => {
                            handleOffer(currentItem.originalAmount);
                          }}
                          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-4.5 rounded-2xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                        >
                          <Check className="w-5 h-5" />
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
                              placeholder="Önerdiğin aylık tutarı yaz..."
                              className="w-full pl-5 pr-11 py-3.5 sm:py-4 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base font-semibold text-[#0E1E38] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#004BFA]/20 focus:border-[#004BFA] transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm sm:text-base text-slate-400 font-semibold">
                              ₺
                            </span>
                          </div>

                          <button
                            type="submit"
                            disabled={!userOfferInput || Number(userOfferInput) <= 0}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                          >
                            <span>Teklif Et</span>
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            handleReNegotiate(currentIndex);
                          }}
                          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#0E1E38] text-sm font-medium transition-all cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-4 h-4 text-slate-500" />
                          <span>Tekrar Pazarlık Et</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (currentIndex < items.length - 1) {
                              handleNextItem();
                            } else {
                              handleNextItem();
                              setIsSpotlightActive(false);
                            }
                          }}
                          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-md cursor-pointer"
                        >
                          <span>
                            {currentIndex < items.length - 1 ? 'Sonraki Pazarlığa Geç' : 'Sonuçları Gör'}
                          </span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* Alt Gezinme Barı */}
                    <div className="flex justify-between items-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handlePrevItem}
                        disabled={currentIndex === 0}
                        className="inline-flex items-center gap-1.5 hover:text-[#004BFA] disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Önceki Kalem</span>
                      </button>

                      <span className="font-medium text-slate-500">
                        Kalan Kalem: {items.length - (currentIndex + 1)}
                      </span>
                    </div>

                  </div>

                </motion.div>
              ) : (
                /* Spotlight kapandığında orijinal sol sütunda dinlenen kart */
                <div className="w-full h-full flex flex-col justify-between bg-white text-[#0E1E38] rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  {/* Kart Üst Bilgisi */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <img src="/icon.png" alt="FinAi" className="w-8 h-8 object-contain shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-[#0E1E38] tracking-wide clash-title">
                          FinAi Workspace Ekibi
                        </h4>
                        <span className="text-[11px] text-slate-400 block">
                          Kişisel Bütçe ve Sermaye Akıl Hocası • Şimdi
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Görüşülen Kalem</span>
                      <span className="text-xs sm:text-sm font-bold text-[#004BFA]">
                        {currentItem.name} ({currentItem.currentAmount.toLocaleString('tr-TR')} ₺)
                      </span>
                    </div>
                  </div>

                  <div className="my-4 flex-1 overflow-y-auto max-h-[380px] pr-2 space-y-4">
                    {items.slice(0, currentIndex + 1).map((item, itemIdx) => {
                      const isCurrent = itemIdx === currentIndex;
                      return (
                        <div key={item.id} className="space-y-3">
                          {currentIndex > 0 && (
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-px bg-slate-200 flex-1" />
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                  isCurrent
                                    ? 'bg-blue-50 text-[#004BFA] border border-blue-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {isCurrent ? '📌 Görüşülen: ' : '✓ '}
                                {item.name} ({item.currentAmount.toLocaleString('tr-TR')} ₺)
                              </span>
                              <div className="h-px bg-slate-200 flex-1" />
                            </div>
                          )}

                          {item.chatHistory && item.chatHistory.length > 0 ? (
                            item.chatHistory.map((msg) => {
                              const isAi = msg.sender === 'ai';
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex gap-2.5 max-w-[95%] ${
                                    isAi ? 'self-start' : 'ml-auto justify-end'
                                  }`}
                                >
                                  <div
                                    className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                                      isAi
                                        ? 'bg-slate-50 text-slate-800 border border-slate-200/80 shadow-2xs'
                                        : 'bg-[#004BFA] text-white shadow-2xs'
                                    }`}
                                  >
                                    <p className="font-normal font-clash">{msg.text}</p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 shadow-2xs">
                              <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed font-clash">
                                {item.lastDialogue}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={inlineChatEndRef} />
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4 mt-auto">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          handleReNegotiate(currentIndex);
                          setIsSpotlightActive(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                        <span>Tekrar Pazarlık Et</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (currentIndex < items.length - 1) {
                            handleNextItem();
                            setIsSpotlightActive(true);
                          } else {
                            handleNextItem();
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                      >
                        <span>
                          {currentIndex < items.length - 1 ? 'Sonraki Pazarlığa Geç' : 'Sonuçları Gör'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* =====================================================================
                SAĞ KOLON: 1. HAFTA NAKİT AKIŞ TABLON (%35 BOYUTUNDA - ORİJİNAL KONUM)
                TOPLAM VARLIK DEĞERİ GRADYANI & AMBIENT IŞIMALARI
                ===================================================================== */}
            <div className="w-full lg:w-[35%] flex flex-col justify-between space-y-4 min-h-[520px] bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl relative overflow-hidden">
              
              {/* Ambient Background Circles */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#004BFA]/25 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#004BFA]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Tablo Başlığı ve Hızlı Düzenle Butonu */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#5B80FF]" />
                  <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    1. Hafta Nakit Akış Tablon
                  </span>
                </div>

                {/* Hızlı Düzenle Butonu */}
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-semibold text-white transition-all cursor-pointer shadow-2xs"
                >
                  <Pencil className="w-3 h-3 text-[#5B80FF]" />
                  <span>Düzenle</span>
                </button>
              </div>

              {/* YAN YANA İKİ SÜTUN: SOL GELİR, SAĞ GİDER KALEMLERİ */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1 content-start pt-1">
                
                {/* SOL SÜTUN: GELİRLER */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                    Aylık Düzenli Gelirler
                  </span>

                  <div className="space-y-1.5">
                    {incomes.map((inc) => (
                      <div
                        key={inc.id}
                        className="py-1.5 border-b border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-white/80 truncate pr-2">
                          {inc.name}
                        </span>
                        <span className="font-semibold text-emerald-400 shrink-0">
                          +{inc.amount.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-white/50 font-semibold flex justify-between">
                    <span>Toplam Gelir:</span>
                    <span className="text-emerald-400 font-bold">+{totalIncome.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>

                {/* SAĞ SÜTUN: GİDER KALEMLERİ */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
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
                          onClick={() => {
                            setCurrentIndex(idx);
                            setIsSpotlightActive(true);
                          }}
                          className={`py-1.5 px-2 rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-between text-xs ${
                            isFocus
                              ? 'bg-white/15 text-white font-bold border-l-2 border-[#5B80FF] shadow-xs'
                              : 'text-white/60 hover:text-white/90 hover:bg-white/5 border-l-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate pr-1.5">
                            {isSettled ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isFocus ? 'bg-[#5B80FF]' : 'bg-white/30'
                                }`}
                              />
                            )}
                            <span className="truncate">{item.name}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {hasSaved && (
                              <span className="line-through text-[10px] text-white/40">
                                {item.originalAmount.toLocaleString('tr-TR')} ₺
                              </span>
                            )}
                            <span
                              className={`${
                                isFocus
                                  ? 'text-[#5B80FF] font-bold'
                                  : isSettled && hasSaved
                                  ? 'text-emerald-400 font-semibold'
                                  : 'text-white/90 font-medium'
                              }`}
                            >
                              {item.currentAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-[11px] text-white/50 font-semibold flex justify-between">
                    <span>Masadaki Gider:</span>
                    <span className="text-white/90 font-bold">-{totalCurrent.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>

              </div>

              {/* BİLANÇO DİP ÖZETİ (SOL İLE HİZALANMIŞ ALT TABAN) */}
              <div className="relative z-10 pt-3 border-t border-white/10 space-y-1.5 text-xs mt-auto">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-white/80">Kalan Serbest Nakit:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    +{remainingCashFlow.toLocaleString('tr-TR')} ₺ / ay
                  </span>
                </div>
              </div>

            </div>

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

            {/* Kart 4: Yıllık Yatırım Sermayesi */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-[#0E1E38] uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#004BFA]" />
                <span>Yıllık Yatırım Sermayesi</span>
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
                  2. Haftanın Tasarruf Planlamasını Tamamladın!
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
                    Tasarruf planlamasını başarıyla tamamladın. Hayat standardını bozmadan her ay masada tam <strong className="text-emerald-400 font-semibold">+{monthlySaved.toLocaleString('tr-TR')} ₺</strong> ek sermaye ürettin. Bu rakam yılda <strong className="text-emerald-400 font-semibold">+{yearlySaved.toLocaleString('tr-TR')} ₺</strong> değerinde üreten şirket hissesi demektir!
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
