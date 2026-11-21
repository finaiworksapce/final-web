"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

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
        @keyframes streamFlowLight {
          0% { stroke-dashoffset: 70; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulseNodeLight {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .stream-light-active {
          stroke-dasharray: 8 6;
          animation: streamFlowLight 2.2s linear infinite;
        }
      `}</style>

      {/* =========================================================================
          ÜST BÖLÜM: %60 CANLI AKIŞ ŞEMASI | %40 DEĞERLENDİRMEMİZ (BEYAZ ZEMİN)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
        
        {/* SOL TARAF (%60): PROFESYONEL BEYAZ SANKEY / AKIM ŞEMASI */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          
          {/* Üst Reset Butonu */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-[#0E1E38] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılan Verileri Geri Yükle</span>
            </button>
          </div>

          {/* Vektör Akım Şeması (Beyaz Temalı) */}
          <div className="w-full">
            <svg viewBox="0 0 1000 160" className="w-full h-auto max-h-[190px] overflow-visible">
              
              <defs>
                <linearGradient id="lightInflow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#004BFA" />
                </linearGradient>
                <linearGradient id="lightExpense" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#004BFA" />
                  <stop offset="50%" stopColor="#FB7185" />
                  <stop offset="100%" stopColor="#E11D48" />
                </linearGradient>
                <linearGradient id="lightSurplus" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#004BFA" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Kılavuz Kanallar */}
              <path d="M 120 80 C 260 80, 320 80, 480 80" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
              <path d="M 520 75 C 660 75, 720 40, 860 40" fill="none" stroke="#F1F5F9" strokeWidth="7" strokeLinecap="round" />
              <path d="M 520 85 C 660 85, 720 120, 860 120" fill="none" stroke="#F1F5F9" strokeWidth="7" strokeLinecap="round" />

              {/* Akış Çizgileri */}
              <path
                d="M 120 80 C 260 80, 320 80, 480 80"
                fill="none"
                stroke="url(#lightInflow)"
                strokeWidth="4"
                strokeLinecap="round"
                className="stream-light-active"
              />
              <path
                d="M 520 75 C 660 75, 720 40, 860 40"
                fill="none"
                stroke="url(#lightExpense)"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="stream-light-active"
              />
              <path
                d="M 520 85 C 660 85, 720 120, 860 120"
                fill="none"
                stroke={netCashFlow >= 0 ? "url(#lightSurplus)" : "url(#lightExpense)"}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="stream-light-active"
              />

              {/* DÜĞÜM 1: GELİR PORTU (SOL) */}
              <g transform="translate(60, 80)">
                <rect x="-45" y="-22" width="90" height="44" rx="12" fill="#F8FAFC" stroke="#004BFA" strokeWidth="1.5" />
                <circle cx="-25" cy="0" r="4" fill="#004BFA" style={{ animation: 'pulseNodeLight 2.5s infinite ease-in-out' }} />
                <text x="2" y="-3" fill="#64748B" fontSize="9" fontWeight="bold" letterSpacing="0.5">GELİR</text>
                <text x="2" y="11" fill="#0E1E38" fontSize="11" fontWeight="bold">%{100}</text>
              </g>

              {/* DÜĞÜM 2: REZERV KASA (ORTA) */}
              <g transform="translate(500, 80)">
                <circle cx="0" cy="0" r="32" fill="#F8FAFC" stroke="#004BFA" strokeWidth="2" />
                <circle cx="0" cy="0" r="22" fill="#004BFA" fillOpacity="0.1" style={{ animation: 'pulseNodeLight 2s infinite ease-in-out' }} />
                <circle cx="0" cy="0" r="8" fill="#004BFA" />
              </g>

              {/* DÜĞÜM 3: GİDER PORTU (SAĞ ÜST) */}
              <g transform="translate(915, 40)">
                <rect x="-45" y="-20" width="90" height="40" rx="12" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1.5" />
                <circle cx="-25" cy="0" r="4" fill="#F43F5E" style={{ animation: 'pulseNodeLight 2.2s infinite ease-in-out' }} />
                <text x="2" y="-2" fill="#E11D48" fontSize="9" fontWeight="bold" letterSpacing="0.5">GİDER</text>
                <text x="2" y="11" fill="#9F1239" fontSize="11" fontWeight="bold">%{expenseRate}</text>
              </g>

              {/* DÜĞÜM 4: SERBEST PORTU (SAĞ ALT) */}
              <g transform="translate(915, 120)">
                <rect
                  x="-45"
                  y="-20"
                  width="90"
                  height="40"
                  rx="12"
                  fill={netCashFlow >= 0 ? "#ECFDF5" : "#FFF1F2"}
                  stroke={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                  strokeWidth="1.5"
                />
                <circle
                  cx="-25"
                  cy="0"
                  r="4"
                  fill={netCashFlow >= 0 ? "#10B981" : "#F43F5E"}
                  style={{ animation: 'pulseNodeLight 2s infinite ease-in-out' }}
                />
                <text
                  x="2"
                  y="-2"
                  fill={netCashFlow >= 0 ? "#047857" : "#E11D48"}
                  fontSize="9"
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {netCashFlow >= 0 ? 'SERBEST' : 'AÇIK'}
                </text>
                <text x="2" y="11" fill="#0E1E38" fontSize="11" fontWeight="bold">
                  %{savingsRate > 0 ? savingsRate : (totalIncome > 0 ? Math.round((Math.abs(netCashFlow)/totalIncome)*100) : 0)}
                </text>
              </g>

            </svg>
          </div>

          {/* Alt Sayısal Özet Çubuğu */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">Toplam Giriş</span>
              <span className="text-sm sm:text-base font-semibold text-[#004BFA] clash-title">+{totalIncome.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">Aylık Çıkış</span>
              <span className="text-sm sm:text-base font-semibold text-rose-600 clash-title">-{totalExpense.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-medium uppercase">Masada Kalan</span>
              <span className={`text-sm sm:text-base font-semibold clash-title ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>

        </div>

        {/* SAĞ TARAF (%40): DEĞERLENDİRMEMİZ (SALT YAZI & BAĞLANTILI METİN) */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Sade Başlık (Emoji / Sembol Yok) */}
            <div className="pb-3 border-b border-slate-100">
              <h4 className="text-base sm:text-lg font-semibold text-[#0E1E38] clash-title">
                Değerlendirmemiz
              </h4>
            </div>

            {/* Salt Akıcı Metin (Kutu / Widget Yok, Paragraflar Birbiriyle Bağlantılı) */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              
              {/* 1. Paragraf: Genel Durum Değerlendirmesi */}
              <p>
                {netCashFlow > 0 ? (
                  <>
                    Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; her ay eline geçen toplam gelirin <strong>%{savingsRate}</strong>'sini masada bırakabildiğini, yani <strong>+{netCashFlow.toLocaleString('tr-TR')} ₺</strong> pozitif serbest nakit ürettiğini görüyoruz. Bu rakam senin finansal bağımsızlık yolculuğundaki temel sıfır noktandır; sonraki haftalarda bu sermayeyi enflasyona ezdirmeyip üreten ortaklıklara dönüştürmenin temellerini atacağız.
                  </>
                ) : netCashFlow < 0 ? (
                  <>
                    Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; mevcut gelirinin aylık harcamalarını karşılamaya yetmediğini ve her ay <strong>{Math.abs(netCashFlow).toLocaleString('tr-TR')} ₺</strong> açık verdiğini görüyoruz. Bu açık, farkında olmadan borçlanarak ya da mevcut birikimlerini eriterek finanse ediliyor demektir. Yatırıma adım atmadan önceki ilk ve en kritik görevimiz, bu kanamayı durdurmaktır.
                  </>
                ) : (
                  <>
                    Biz FinAi Workspace ekibi olarak tablonu incelediğimizde; gelir ve giderlerinin tam başa baş noktasında olduğunu görüyoruz. Masada hiç nakit bırakamamak, beklenmedik ilk acil harcamada seni borçlanmaya itebilir. Önceliğimiz bu dengeyi hızla artıya çevirmektir.
                  </>
                )}
              </p>

              {/* 2. Paragraf: Doğrudan Bağlanan En Çok Harcanan Kalem Analizi */}
              {topExpense && (
                <p>
                  {isHousing ? (
                    <>
                      Giderlerinin en büyük payını <strong>{topExpense.amount.toLocaleString('tr-TR')} ₺</strong> ile <strong>"{topExpense.name}"</strong> oluşturuyor (tüm harcamalarının %{topExpenseRatio}'i). Kira ve barınma gibi temel sabit giderleri kısa vadede kısmak her zaman mümkün olmayabilir; ancak listendeki ikinci en büyük harcama kalemin olan <strong>"{secondTopExpense ? secondTopExpense.name : 'diğer giderlerin'}"</strong> ({secondTopExpense ? secondTopExpense.amount.toLocaleString('tr-TR') + ' ₺' : ''}) sence hayat standardını düşürmeden optimize edilebilir mi? Bir sonraki hafta tam olarak bu görünmeyen kaçakları nasıl budayabileceğimizi konuşacağız.
                    </>
                  ) : (
                    <>
                      Gider kalemlerinin içinde en yüksek payı <strong>{topExpense.amount.toLocaleString('tr-TR')} ₺</strong> ile <strong>"{topExpense.name}"</strong> alıyor (tüm harcamalarının %{topExpenseRatio}'i). Biz FinAi Workspace ekibi olarak sana şu soruyu sormak istiyoruz: Sence bu harcama kalemini hayat kalitenden ödün vermeden kısmanın veya daha verimli bir alternatife dönüştürmenin bir yolu var mıdır? İkinci haftadaki tasarruf kalkanı dersimizde doğrudan bu tür harcamaları yönetme refleksini kazanacağız.
                    </>
                  )}
                </p>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          ALT BÖLÜM: 2 SÜTUNLU VERİMLİ FİNANSAL TABLO (TAM SAYFA GENİŞLİĞİ)
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

    </div>
  );
}
