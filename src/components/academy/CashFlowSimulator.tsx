"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, RotateCcw, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

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

  // En çok harcanılan kalem analizi
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
  }, [expenses]);

  const topExpense = sortedExpenses.length > 0 && (sortedExpenses[0].amount || 0) > 0 ? sortedExpenses[0] : null;
  const isHousing = topExpense ? /kira|barınma|ev|konut|mortgage|aidat/i.test(topExpense.name) : false;
  const secondTopExpense = sortedExpenses.length > 1 && (sortedExpenses[1].amount || 0) > 0 ? sortedExpenses[1] : null;
  const topExpenseRatio = totalExpense > 0 && topExpense ? Math.round((topExpense.amount / totalExpense) * 100) : 0;

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
    <div className="w-full space-y-8 select-none font-clash">
      
      {/* Özel CSS Animasyonları */}
      <style jsx>{`
        @keyframes streamFlow {
          0% { stroke-dashoffset: 80; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes nodeBreathing {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes shimmerEffect {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .stream-active {
          stroke-dasharray: 10 6;
          animation: streamFlow 2.4s linear infinite;
        }
        .shimmer-bar {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmerEffect 2.8s infinite linear;
        }
      `}</style>

      {/* =========================================================================
          1. ÜST: ULTRA-PROFESYONEL CANLI NAKİT AKIMI (SANKEY / CAPITAL STREAM)
          ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#0E1E38] via-[#102445] to-[#0A1628] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Arka Plan Ortam Işığı */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#004BFA]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Üst Reset Butonu (Sağa Hizalı, Sade) */}
        <div className="flex items-center justify-end relative z-10 mb-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılan Verileri Geri Yükle</span>
          </button>
        </div>

        {/* Kurumsal Vektör Akış Kanalları */}
        <div className="w-full relative z-10">
          <svg viewBox="0 0 1000 160" className="w-full h-auto max-h-[200px] overflow-visible">
            
            <defs>
              <linearGradient id="streamInflow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#004BFA" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="streamExpense" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#004BFA" />
                <stop offset="40%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
              <linearGradient id="streamSurplus" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#004BFA" />
                <stop offset="40%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Arka Plan Statik Kılavuz Kanalları */}
            <path d="M 120 80 C 260 80, 320 80, 480 80" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeOpacity="0.06" strokeLinecap="round" />
            <path d="M 520 75 C 660 75, 720 40, 860 40" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeOpacity="0.06" strokeLinecap="round" />
            <path d="M 520 85 C 660 85, 720 120, 860 120" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeOpacity="0.06" strokeLinecap="round" />

            {/* 1. GELİR AKIŞI (Sol -> Merkez) */}
            <path
              d="M 120 80 C 260 80, 320 80, 480 80"
              fill="none"
              stroke="url(#streamInflow)"
              strokeWidth="4"
              strokeLinecap="round"
              className="stream-active"
            />

            {/* 2. GİDER ÇIKIŞI (Merkez -> Sağ Üst) */}
            <path
              d="M 520 75 C 660 75, 720 40, 860 40"
              fill="none"
              stroke="url(#streamExpense)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="stream-active"
            />

            {/* 3. SERBEST NAKİT ÇIKIŞI (Merkez -> Sağ Alt) */}
            <path
              d="M 520 85 C 660 85, 720 120, 860 120"
              fill="none"
              stroke={netCashFlow >= 0 ? "url(#streamSurplus)" : "url(#streamExpense)"}
              strokeWidth="3.5"
              strokeLinecap="round"
              className="stream-active"
            />

            {/* DÜĞÜM 1: GELİR PORTU (SOL) */}
            <g transform="translate(60, 80)">
              <rect x="-45" y="-22" width="90" height="44" rx="12" fill="#0E1E38" stroke="#3B82F6" strokeWidth="1.5" />
              <circle cx="-25" cy="0" r="4" fill="#3B82F6" style={{ animation: 'nodeBreathing 2.5s infinite ease-in-out' }} />
              <text x="2" y="-3" fill="#94A3B8" fontSize="9" fontWeight="bold" letterSpacing="0.5">GELİR</text>
              <text x="2" y="11" fill="#FFFFFF" fontSize="11" fontWeight="bold">%{100}</text>
            </g>

            {/* DÜĞÜM 2: MERKEZ REZERV / KASA HAVUZU (ORTA) */}
            <g transform="translate(500, 80)">
              <circle cx="0" cy="0" r="32" fill="#0A1526" stroke="#004BFA" strokeWidth="2" />
              <circle cx="0" cy="0" r="22" fill="#004BFA" fillOpacity="0.25" style={{ animation: 'nodeBreathing 2s infinite ease-in-out' }} />
              <circle cx="0" cy="0" r="8" fill="#004BFA" />
            </g>

            {/* DÜĞÜM 3: GİDER PORTU (SAĞ ÜST) */}
            <g transform="translate(915, 40)">
              <rect x="-45" y="-20" width="90" height="40" rx="12" fill="#0E1E38" stroke="#F43F5E" strokeWidth="1.5" />
              <circle cx="-25" cy="0" r="4" fill="#F43F5E" style={{ animation: 'nodeBreathing 2.2s infinite ease-in-out' }} />
              <text x="2" y="-2" fill="#FB7185" fontSize="9" fontWeight="bold" letterSpacing="0.5">TÜKETİM</text>
              <text x="2" y="11" fill="#FFFFFF" fontSize="11" fontWeight="bold">%{expenseRate}</text>
            </g>

            {/* DÜĞÜM 4: SERBEST NAKİT PORTU (SAĞ ALT) */}
            <g transform="translate(915, 120)">
              <rect
                x="-45"
                y="-20"
                width="90"
                height="40"
                rx="12"
                fill="#0E1E38"
                stroke={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                strokeWidth="1.5"
              />
              <circle
                cx="-25"
                cy="0"
                r="4"
                fill={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                style={{ animation: 'nodeBreathing 2s infinite ease-in-out' }}
              />
              <text
                x="2"
                y="-2"
                fill={netCashFlow >= 0 ? "#6EE7B7" : "#FB7185"}
                fontSize="9"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                {netCashFlow >= 0 ? 'SERBEST' : 'AÇIK'}
              </text>
              <text x="2" y="11" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                %{savingsRate > 0 ? savingsRate : (totalIncome > 0 ? Math.round((Math.abs(netCashFlow)/totalIncome)*100) : 0)}
              </text>
            </g>

          </svg>
        </div>

        {/* Akış Değerleri Göstergesi */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center relative z-10">
          <div>
            <span className="text-white/40 block text-[11px] font-medium tracking-wider uppercase">Toplam Giriş Akımı</span>
            <span className="text-base sm:text-lg font-semibold text-[#78B8F5] clash-title">+{totalIncome.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div>
            <span className="text-white/40 block text-[11px] font-medium tracking-wider uppercase">Aylık Tüketim Çıkışı</span>
            <span className="text-base sm:text-lg font-semibold text-rose-400 clash-title">-{totalExpense.toLocaleString('tr-TR')} ₺</span>
          </div>
          <div>
            <span className="text-white/40 block text-[11px] font-medium tracking-wider uppercase">Masada Kalan Net</span>
            <span className={`text-base sm:text-lg font-semibold clash-title ${netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          2. ORTA: 2 SÜTUNLU VERİMLİ FİNANSAL TABLO (TAM SAYFA GENİŞLİĞİ)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 w-full items-start">
        
        {/* GELİR KALEMLERİ TABLOSU */}
        <div className="space-y-4 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-[#004BFA]/40 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gelir Kalemleri
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-emerald-600 clash-title">
              +{totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
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
              placeholder="Yeni gelir kalemi (örn. Freelance, Ek Gelir)"
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
        <div className="space-y-4 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-rose-400/40 transition-all duration-300">
          <div className="flex items-center justify-between pb-3 border-b-2 border-rose-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gider Kalemleri
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-rose-600 clash-title">
              -{totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
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
          3. ALT: LACİVERT GRADYANLI PROFESYONEL ANALİTİK KONSOLU
          ========================================================================= */}
      <div className="w-full bg-gradient-to-br from-[#0E1E38] via-[#122444] to-[#091527] text-white p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Ortam Işıkları */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#004BFA]/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

        {/* 1. Canlı Dağılım Çubuğu */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-2 text-rose-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Gider Yükü: %{expenseRate}</span>
            </span>
            <span className={`flex items-center gap-2 ${savingsRate > 0 ? 'text-emerald-300 font-semibold' : 'text-white/50'}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${savingsRate > 0 ? 'bg-emerald-400' : 'bg-white/30'}`} />
              <span>Tasarruf Kapasitesi: %{savingsRate > 0 ? savingsRate : 0}</span>
            </span>
          </div>
          
          <div className="w-full h-3.5 bg-white/10 rounded-full overflow-hidden flex relative border border-white/10 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${netCashFlow >= 0 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, expenseRate)}%` }}
            />
            {netCashFlow > 0 && (
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              >
                <div className="absolute inset-0 shimmer-bar" />
              </div>
            )}
          </div>
        </div>

        {/* 2. Üç Ana Finansal Metrik Kartı (Lacivert Konsol İçinde) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10 w-full">
          
          {/* Toplam Gelir */}
          <div className="p-5 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
              Toplam Aylık Gelir
            </span>
            <span className="text-2xl sm:text-3xl font-medium text-white clash-title mt-1.5 block">
              {totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Toplam Gider */}
          <div className="p-5 bg-white/[0.04] border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all">
            <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">
              Toplam Aylık Gider
            </span>
            <span className="text-2xl sm:text-3xl font-medium text-rose-400 clash-title mt-1.5 block">
              {totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Net Nakit Akışı */}
          <div className={`p-5 rounded-2xl border transition-all ${
            netCashFlow > 0 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : netCashFlow < 0 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : 'bg-white/[0.04] border-white/10 text-white'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              Net Aylık Nakit Akışı
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              {netCashFlow > 0 ? (
                <ArrowUpRight className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : netCashFlow < 0 ? (
                <ArrowDownRight className="w-6 h-6 text-rose-400 shrink-0" />
              ) : null}
              <span className="text-2xl sm:text-3xl font-medium clash-title">
                {netCashFlow > 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>

        </div>

        {/* 3. FinAi Mentör Tespiti & Dinamik Harcama Analizi */}
        <div className="p-6 sm:p-7 bg-white/[0.03] border border-white/15 rounded-2xl relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              netCashFlow >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {netCashFlow >= 0 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider clash-title">
                FinAi Mentör Tespiti & Nakit Akışı Analizi
              </h5>
              <span className="text-[11px] text-white/50">Objektif Finansal Durum & Düşünme Refleksi</span>
            </div>
          </div>

          <div className="space-y-3.5 text-sm sm:text-base text-white/85 leading-relaxed font-normal pt-1">
            
            {/* Paragraf 1: Objektif Genel Durum (Biz Diliyle) */}
            <p>
              {netCashFlow > 0 ? (
                <>
                  Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; her ay eline geçen toplam gelirin <strong>%{savingsRate}</strong>'sini masada bırakabildiğini, yani <strong>+{netCashFlow.toLocaleString('tr-TR')} ₺</strong> pozitif serbest nakit ürettiğini görüyoruz. Bu rakam senin finansal bağımsızlık yolculuğundaki temel sıfır noktandır; sonraki haftalarda bu sermayeyi enflasyona ezdirmeyip üreten ortaklıklara dönüştürmenin adımlarını atacağız.
                </>
              ) : netCashFlow < 0 ? (
                <>
                  Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; mevcut gelirinin aylık harcamalarını karşılamaya yetmediğini ve her ay <strong>{Math.abs(netCashFlow).toLocaleString('tr-TR')} ₺</strong> açık verdiğini görüyoruz. Bu açık, farkında olmadan borçlanarak ya da mevcut birikimlerini eriterek finanse ediliyor demektir. Yatırım dünyasına adım atmadan önceki ilk ve en kritik görevimiz, bu sızıntıyı durdurmaktır.
                </>
              ) : (
                <>
                  Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; gelir ve giderlerinin tam başa baş noktasında olduğunu görüyoruz. Masada hiç nakit bırakamamak, beklenmedik ilk acil harcamada seni borçlanmaya itebilir. Önceliğimiz bu dengeyi hızla artıya çevirmek olacaktır.
                </>
              )}
            </p>

            {/* Paragraf 2: En Çok Harcanılan Kalem & Düşündürücü Soru */}
            {topExpense && (
              <div className="p-4 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white/90 space-y-1.5">
                {isHousing ? (
                  <>
                    <p>
                      Giderlerinin en büyük payını <strong>{topExpense.amount.toLocaleString('tr-TR')} ₺</strong> ile <strong>"{topExpense.name}"</strong> oluşturuyor (Tüm harcamalarının %{topExpenseRatio}'i). Kira ve barınma gibi temel sabit giderleri kısa vadede kısmak her zaman mümkün olmayabilir.
                    </p>
                    <p className="text-emerald-300 font-medium">
                      Peki listendeki ikinci en büyük harcama kalemin olan <strong>"{secondTopExpense ? secondTopExpense.name : 'diğer harcamaların'}"</strong> ({secondTopExpense ? secondTopExpense.amount.toLocaleString('tr-TR') + ' ₺' : ''}) sence hayat standardını düşürmeden optimize edilebilir mi? Bir sonraki hafta tam olarak bu görünmeyen kaçakları nasıl budayabileceğimizi konuşacağız.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Gider kalemlerinin içinde en yüksek payı <strong>{topExpense.amount.toLocaleString('tr-TR')} ₺</strong> ile <strong>"{topExpense.name}"</strong> alıyor (Toplam giderinin %{topExpenseRatio}'i).
                    </p>
                    <p className="text-[#78B8F5] font-medium">
                      Biz FinAi Workspace ekibi olarak sana şu soruyu sormak istiyoruz: Sence bu harcama kalemini hayat kalitenden ödün vermeden kısmanın veya daha verimli bir alternatife dönüştürmenin bir yolu var mıdır? İkinci haftadaki tasarruf kalkanı dersimizde doğrudan bu tür harcamaları yönetme refleksini kazanacağız.
                    </p>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
