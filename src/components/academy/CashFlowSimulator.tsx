"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, RotateCcw, CheckCircle2, AlertCircle, Activity, Sparkles, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface CashItem {
  id: string;
  name: string;
  amount: number;
}

const DEFAULT_INCOMES: CashItem[] = [
  { id: 'inc-1', name: 'Aylık Maaş / Ana Gelir', amount: 35000 },
];

const DEFAULT_EXPENSES: CashItem[] = [
  { id: 'exp-1', name: 'Kira / Barınma', amount: 12000 },
  { id: 'exp-2', name: 'Mutfak ve Market Gideri', amount: 6500 },
  { id: 'exp-3', name: 'Faturalar (Elektrik, Su, İnternet)', amount: 2200 },
  { id: 'exp-4', name: 'Ulaşım ve Seyahat', amount: 2500 },
];

const STORAGE_KEY = 'finai_cashflow_data_v2';

export function CashFlowSimulator() {
  const [incomes, setIncomes] = useState<CashItem[]>(DEFAULT_INCOMES);
  const [expenses, setExpenses] = useState<CashItem[]>(DEFAULT_EXPENSES);
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // LocalStorage senkronizasyonu
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.incomes && Array.isArray(parsed.incomes)) setIncomes(parsed.incomes);
        if (parsed.expenses && Array.isArray(parsed.expenses)) setExpenses(parsed.expenses);
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updatedIncomes: CashItem[], updatedExpenses: CashItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ incomes: updatedIncomes, expenses: updatedExpenses }));
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setIncomes(DEFAULT_INCOMES);
    setExpenses(DEFAULT_EXPENSES);
    saveToStorage(DEFAULT_INCOMES, DEFAULT_EXPENSES);
  };

  const totalIncome = useMemo(() => incomes.reduce((acc, item) => acc + (Number(item.amount) || 0), 0), [incomes]);
  const totalExpense = useMemo(() => expenses.reduce((acc, item) => acc + (Number(item.amount) || 0), 0), [expenses]);
  const netCashFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netCashFlow / totalIncome) * 100) : 0;
  const expenseRate = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 100;

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncomeName.trim() || !newIncomeAmount) return;
    const updated = [
      ...incomes,
      { id: 'inc-' + Date.now(), name: newIncomeName.trim(), amount: Math.abs(Number(newIncomeAmount)) || 0 },
    ];
    setIncomes(updated);
    saveToStorage(updated, expenses);
    setNewIncomeName('');
    setNewIncomeAmount('');
  };

  const handleDeleteIncome = (id: string) => {
    const updated = incomes.filter((item) => item.id !== id);
    setIncomes(updated);
    saveToStorage(updated, expenses);
  };

  const handleUpdateIncomeAmount = (id: string, value: string) => {
    const updated = incomes.map((item) => (item.id === id ? { ...item, amount: Number(value) || 0 } : item));
    setIncomes(updated);
    saveToStorage(updated, expenses);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName.trim() || !newExpenseAmount) return;
    const updated = [
      ...expenses,
      { id: 'exp-' + Date.now(), name: newExpenseName.trim(), amount: Math.abs(Number(newExpenseAmount)) || 0 },
    ];
    setExpenses(updated);
    saveToStorage(incomes, updated);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    saveToStorage(incomes, updated);
  };

  const handleUpdateExpenseAmount = (id: string, value: string) => {
    const updated = expenses.map((item) => (item.id === id ? { ...item, amount: Number(value) || 0 } : item));
    setExpenses(updated);
    saveToStorage(incomes, updated);
  };

  return (
    <div className="w-full space-y-10">
      
      {/* Özel CSS Animasyonları */}
      <style jsx>{`
        @keyframes streamDash {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseAura {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes shimmerBar {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .stream-line {
          stroke-dasharray: 12 8;
          animation: streamDash 2s linear infinite;
        }
        .stream-line-reverse {
          stroke-dasharray: 12 8;
          animation: streamDash 2.5s linear infinite reverse;
        }
        .shimmer-active {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmerBar 3s infinite linear;
        }
      `}</style>

      {/* ÜST İŞLEM ÇUBUĞU (Tam Genişlik) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3 w-full">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#004BFA] animate-pulse" />
          <span className="text-sm font-bold text-[#0E1E38] uppercase tracking-wider clash-title">
            Canlı Nakit Akışı ve Karar İstasyonu
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-[#0E1E38] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Varsayılan Verileri Geri Yükle</span>
        </button>
      </div>

      {/* =========================================================================
          ETKİN ANİMASYONLU SANKEY / AKIŞ DİNAMİĞİ (TÜM SAYFA GENİŞLİĞİNDE)
          ========================================================================= */}
      <div className="w-full bg-[#0E1E38] text-white p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative select-none">
        
        {/* Arka Plan Glow Efektleri */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#004BFA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Canlı SVG Akım Şeması */}
        <div className="w-full relative z-10">
          <svg viewBox="0 0 1000 180" className="w-full h-auto max-h-[220px] overflow-visible">
            
            <defs>
              <linearGradient id="incomeStream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#004BFA" />
              </linearGradient>
              <linearGradient id="expenseStream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0E1E38" />
                <stop offset="50%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              <linearGradient id="surplusStream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0E1E38" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* AKIŞ 1: SOL -> MERKEZ HAVUZ (GELİR AKIMI) */}
            <path
              d="M 120 90 C 260 90, 320 90, 460 90"
              fill="none"
              stroke="#004BFA"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 120 90 C 260 90, 320 90, 460 90"
              fill="none"
              stroke="url(#incomeStream)"
              strokeWidth="4"
              strokeLinecap="round"
              className="stream-line"
            />

            {/* AKIŞ 2: MERKEZ -> SAĞ ÜST (GİDER ÇIKIŞI) */}
            <path
              d="M 540 85 C 660 85, 720 45, 840 45"
              fill="none"
              stroke="#F43F5E"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 540 85 C 660 85, 720 45, 840 45"
              fill="none"
              stroke="url(#expenseStream)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="stream-line"
            />

            {/* AKIŞ 3: MERKEZ -> SAĞ ALT (SERBEST NAKİT / MASADA KALAN) */}
            <path
              d="M 540 95 C 660 95, 720 135, 840 135"
              fill="none"
              stroke={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 540 95 C 660 95, 720 135, 840 135"
              fill="none"
              stroke={netCashFlow >= 0 ? "url(#surplusStream)" : "url(#expenseStream)"}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="stream-line"
            />

            {/* DÜĞÜM 1: GELİR GİRİŞ MERKEZİ (SOL) */}
            <g transform="translate(60, 90)">
              <circle cx="0" cy="0" r="32" fill="#0E1E38" stroke="#3B82F6" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="24" fill="#1E3A8A" opacity="0.6" />
              <circle cx="0" cy="0" r="14" fill="#004BFA" style={{ animation: 'pulseAura 3s infinite ease-in-out' }} />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                GİRİŞ
              </text>
            </g>

            {/* DÜĞÜM 2: MERKEZ REZERV / KASA HAVUZU (ORTA) */}
            <g transform="translate(500, 90)">
              <circle cx="0" cy="0" r="44" fill="#0A1526" stroke="#004BFA" strokeWidth="3" />
              <circle cx="0" cy="0" r="36" fill="#004BFA" fillOpacity="0.2" />
              <circle cx="0" cy="0" r="28" fill="#004BFA" fillOpacity="0.4" style={{ animation: 'pulseAura 2.2s infinite ease-in-out' }} />
              <circle cx="0" cy="0" r="16" fill="#004BFA" />
              <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                REZERV
              </text>
            </g>

            {/* DÜĞÜM 3: GİDERLER (SAĞ ÜST) */}
            <g transform="translate(890, 45)">
              <circle cx="0" cy="0" r="28" fill="#0E1E38" stroke="#F43F5E" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="18" fill="#881337" opacity="0.6" />
              <circle cx="0" cy="0" r="10" fill="#F43F5E" style={{ animation: 'pulseAura 2.8s infinite ease-in-out' }} />
              <text x="0" y="4" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                GİDER
              </text>
            </g>

            {/* DÜĞÜM 4: SERBEST NAKİT (SAĞ ALT) */}
            <g transform="translate(890, 135)">
              <circle
                cx="0"
                cy="0"
                r="30"
                fill="#0E1E38"
                stroke={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                strokeWidth="2.5"
              />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill={netCashFlow >= 0 ? "#064E3B" : "#881337"}
                opacity="0.6"
              />
              <circle
                cx="0"
                cy="0"
                r="12"
                fill={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                style={{ animation: 'pulseAura 2s infinite ease-in-out' }}
              />
              <text x="0" y="4" textAnchor="middle" fill="#D1FAE5" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                {netCashFlow >= 0 ? 'KALAN' : 'AÇIK'}
              </text>
            </g>

          </svg>
        </div>

        {/* Akış Değerlerinin Alt Göstergeleri */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 text-center relative z-10 text-xs">
          <div>
            <span className="text-white/50 block text-[11px]">Toplam Giriş Akımı</span>
            <span className="text-sm sm:text-base font-bold text-[#78B8F5]">+{totalIncome.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div>
            <span className="text-white/50 block text-[11px]">Aylık Tüketim Çıkışı</span>
            <span className="text-sm sm:text-base font-bold text-rose-400">-{totalExpense.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div>
            <span className="text-white/50 block text-[11px]">Masada Kalan Net</span>
            <span className={`text-sm sm:text-base font-bold ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          2 SÜTUNLU VERİMLİ FİNANSAL TABLO MİMARİSİ (TAM SAYFA GENİŞLİĞİ)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 w-full items-start">
        
        {/* GELİR KALEMLERİ TABLOSU */}
        <div className="space-y-4 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-[#004BFA]/50 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gelir Kalemleri
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-600">
              +{totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {incomes.length === 0 ? (
              <div className="p-6 text-xs text-slate-400 italic text-center">Henüz gelir kalemi eklenmedi.</div>
            ) : (
              incomes.map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-center justify-between gap-4 p-3.5 text-xs hover:bg-emerald-50/20 transition-all duration-200 group"
                >
                  <span className="font-semibold text-[#0E1E38] truncate flex-1">{inc.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={inc.amount}
                      onChange={(e) => handleUpdateIncomeAmount(inc.id, e.target.value)}
                      className="w-32 text-right font-bold text-[#0E1E38] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#004BFA] focus:bg-white transition-colors"
                    />
                    <span className="text-slate-400 font-semibold">₺</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteIncome(inc.id)}
                      className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Kalemi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Yeni Gelir Ekleme Formu */}
          <form onSubmit={handleAddIncome} className="flex gap-2.5 pt-1">
            <input
              type="text"
              placeholder="Yeni gelir kalemi (örn. Freelance, Ek İş)"
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-[#004BFA] focus:bg-white transition-colors"
            />
            <input
              type="number"
              min="0"
              placeholder="Tutar"
              value={newIncomeAmount}
              onChange={(e) => setNewIncomeAmount(e.target.value)}
              className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-[#004BFA] focus:bg-white transition-colors font-semibold"
            />
            <button
              type="submit"
              className="bg-[#0E1E38] hover:bg-[#004BFA] text-white px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shrink-0 shadow-sm hover:shadow"
              title="Gelir Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* GİDER KALEMLERİ TABLOSU */}
        <div className="space-y-4 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400/50 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b-2 border-rose-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gider Kalemleri
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-rose-600">
              -{totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {expenses.length === 0 ? (
              <div className="p-6 text-xs text-slate-400 italic text-center">Henüz gider kalemi eklenmedi.</div>
            ) : (
              expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-4 p-3.5 text-xs hover:bg-rose-50/20 transition-all duration-200 group"
                >
                  <span className="font-semibold text-[#0E1E38] truncate flex-1">{exp.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={exp.amount}
                      onChange={(e) => handleUpdateExpenseAmount(exp.id, e.target.value)}
                      className="w-32 text-right font-bold text-[#0E1E38] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                    />
                    <span className="text-slate-400 font-semibold">₺</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Kalemi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Yeni Gider Ekleme Formu */}
          <form onSubmit={handleAddExpense} className="flex gap-2.5 pt-1">
            <input
              type="text"
              placeholder="Yeni gider kalemi (örn. Abonelikler, Spor)"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
            <input
              type="number"
              min="0"
              placeholder="Tutar"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors font-semibold"
            />
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shrink-0 shadow-sm hover:shadow"
              title="Gider Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* =========================================================================
          ANALİTİK METRİKLER & MENTÖR GERİ BİLDİRİMİ (TAM SAYFA GENİŞLİĞİNDE)
          ========================================================================= */}
      <div className="pt-8 border-t border-slate-200 space-y-6 w-full">
        
        {/* Dağılım İlerleme Göstergesi (Canlı Shimmer) */}
        <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs font-semibold text-[#0E1E38]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Gider Yükü: %{expenseRate}</span>
            </span>
            <span className={`flex items-center gap-1.5 ${savingsRate > 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full ${savingsRate > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>Tasarruf Kapasitesi: %{savingsRate > 0 ? savingsRate : 0}</span>
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex relative">
            <div
              className={`h-full transition-all duration-500 ${netCashFlow >= 0 ? 'bg-rose-400' : 'bg-rose-600'}`}
              style={{ width: `${Math.min(100, expenseRate)}%` }}
            />
            {netCashFlow > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all duration-500 relative"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              >
                <div className="absolute inset-0 shimmer-active" />
              </div>
            )}
          </div>
        </div>

        {/* 3 Ana Metrik Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Toplam Aylık Gelir
            </span>
            <span className="text-2xl sm:text-3xl font-medium text-[#0E1E38] clash-title mt-1.5 block">
              {totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Toplam Aylık Gider
            </span>
            <span className="text-2xl sm:text-3xl font-medium text-rose-600 clash-title mt-1.5 block">
              {totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className={`p-5 border rounded-2xl shadow-xs transition-all duration-300 ${
            netCashFlow > 0 
              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-emerald-500/5' 
              : netCashFlow < 0 
              ? 'bg-rose-50/60 border-rose-300 text-rose-950 shadow-rose-500/5' 
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
              Net Aylık Nakit Akışı
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              {netCashFlow > 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : netCashFlow < 0 ? (
                <ArrowDownRight className="w-6 h-6 text-rose-600 shrink-0" />
              ) : null}
              <span className="text-2xl sm:text-3xl font-medium clash-title">
                {netCashFlow > 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>
        </div>

        {/* FinAi Mentör Gözlemi (Canlı Vurgu) */}
        <div className="p-6 bg-white border-l-4 border-[#004BFA] border-y border-r border-slate-200 rounded-r-2xl shadow-xs w-full">
          <div className="flex items-start gap-4">
            {netCashFlow > 0 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                FinAi Mentör Tespiti
              </h5>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {netCashFlow > 0 ? (
                  <>
                    Tebrikler. Ay sonunda elinizde <strong>+{netCashFlow.toLocaleString('tr-TR')} ₺</strong> pozitif serbest nakit kalıyor (Gelirinizin %{savingsRate}'i). Bu rakam sizin sıfır noktanızdır; sonraki haftalarda bu sermayeyi enflasyona karşı korumayı ve üreten varlıklara dönüştürmeyi öğreneceğiz.
                  </>
                ) : netCashFlow < 0 ? (
                  <>
                    Dikkat: Ay sonunda <strong>{netCashFlow.toLocaleString('tr-TR')} ₺</strong> açık veriyorsunuz. Bu açık her ay ya borçlanarak ya da mevcut birikimlerinizi eriterek finanse ediliyor demektir. Yatırıma adım atmadan önce sonraki haftalarda bu gider kaçaklarını kontrol altına alacağız.
                  </>
                ) : (
                  <>
                    Gelir ve giderleriniz tam başa baş noktasında. Elinizde kalan serbest nakit sıfır olduğu için, en ufak bir beklenmedik harcamada borçlanma riski taşıyorsunuz. İkinci haftada bu dengeyi nasıl pozitife çevireceğimize odaklanacağız.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
