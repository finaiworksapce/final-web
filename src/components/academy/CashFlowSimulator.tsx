"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="w-full space-y-8">
      
      {/* Üst İşlem Çubuğu (Örneğe Dön) */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA]" />
          <span className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wider">
            Nakit Akışı Tablosu
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-[#0E1E38] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Örnek Verileri Yükle</span>
        </button>
      </div>

      {/* 2 SÜTUNLU VERİMLİ FİNANSAL TABLO MİMARİSİ (FinAi Renkleri ile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GELİR KALEMLERİ TABLOSU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gelir Kalemleri
              </span>
            </div>
            <span className="text-sm font-bold text-emerald-600">
              +{totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {incomes.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 italic text-center">Henüz gelir kalemi eklenmedi.</div>
            ) : (
              incomes.map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-center justify-between gap-3 p-3 text-xs hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-medium text-[#0E1E38] truncate flex-1">{inc.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={inc.amount}
                      onChange={(e) => handleUpdateIncomeAmount(inc.id, e.target.value)}
                      className="w-28 text-right font-semibold text-[#0E1E38] bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#004BFA] focus:bg-white"
                    />
                    <span className="text-slate-400 font-medium">₺</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteIncome(inc.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Yeni Gelir Ekleme Formu */}
          <form onSubmit={handleAddIncome} className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni gelir kalemi (örn. Freelance, Kira)"
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
              className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-[#004BFA]"
            />
            <input
              type="number"
              min="0"
              placeholder="Tutar"
              value={newIncomeAmount}
              onChange={(e) => setNewIncomeAmount(e.target.value)}
              className="w-28 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-[#004BFA]"
            />
            <button
              type="submit"
              className="bg-[#0E1E38] hover:bg-[#004BFA] text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Gelir Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* GİDER KALEMLERİ TABLOSU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-rose-500">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
                Aylık Gider Kalemleri
              </span>
            </div>
            <span className="text-sm font-bold text-rose-600">
              -{totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          {/* Satırlar */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            {expenses.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 italic text-center">Henüz gider kalemi eklenmedi.</div>
            ) : (
              expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between gap-3 p-3 text-xs hover:bg-slate-50/70 transition-colors"
                >
                  <span className="font-medium text-[#0E1E38] truncate flex-1">{exp.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="0"
                      value={exp.amount}
                      onChange={(e) => handleUpdateExpenseAmount(exp.id, e.target.value)}
                      className="w-28 text-right font-semibold text-[#0E1E38] bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-rose-500 focus:bg-white"
                    />
                    <span className="text-slate-400 font-medium">₺</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Yeni Gider Ekleme Formu */}
          <form onSubmit={handleAddExpense} className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni gider kalemi (örn. Abonelikler, Aidat)"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
            />
            <input
              type="number"
              min="0"
              placeholder="Tutar"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-28 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[#0E1E38] placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Gider Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* ANALİTİK ÖZET VE SONUÇ KARTLARI (FinAi Tasarımı) */}
      <div className="pt-6 border-t border-slate-200 space-y-5">
        
        {/* Dağılım İlerleme Göstergesi */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#0E1E38]">
            <span>Gider Yükü: %{expenseRate}</span>
            <span className={savingsRate > 0 ? 'text-emerald-600' : 'text-slate-500'}>
              Tasarruf / Serbest Nakit Kapasitesi: %{savingsRate > 0 ? savingsRate : 0}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${netCashFlow >= 0 ? 'bg-rose-400' : 'bg-rose-600'}`}
              style={{ width: `${Math.min(100, expenseRate)}%` }}
            />
            {netCashFlow > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, savingsRate)}%` }}
              />
            )}
          </div>
        </div>

        {/* 3 Ana Metrik Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Toplam Aylık Gelir
            </span>
            <span className="text-xl font-normal text-[#0E1E38] clash-title mt-1 block">
              {totalIncome.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Toplam Aylık Gider
            </span>
            <span className="text-xl font-normal text-rose-600 clash-title mt-1 block">
              {totalExpense.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className={`p-4 border rounded-xl shadow-2xs ${
            netCashFlow > 0 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : netCashFlow < 0 
              ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider block">
              Net Aylık Nakit Akışı
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {netCashFlow > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : netCashFlow < 0 ? (
                <ArrowDownRight className="w-5 h-5 text-rose-600 shrink-0" />
              ) : null}
              <span className="text-xl font-normal clash-title">
                {netCashFlow > 0 ? '+' : ''}{netCashFlow.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>
        </div>

        {/* FinAi Mentör Gözlemi */}
        <div className="p-5 bg-white border-l-4 border-[#004BFA] border-y border-r border-slate-200 rounded-r-xl shadow-2xs">
          <div className="flex items-start gap-3.5">
            {netCashFlow > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-[#0E1E38] uppercase tracking-wide">
                FinAi Mentör Tespiti
              </h5>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
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
