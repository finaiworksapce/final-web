'use client';

import React, { useState } from 'react';
import {
  FileText,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Filter,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Building2,
  Code2,
  Sparkles
} from 'lucide-react';
import { NarrativeEngineResult } from '@/lib/narrative-engine/types';

export default function NarrativeEngineSimulatorPage() {
  const [symbol, setSymbol] = useState('TERA');
  const [customIntent, setCustomIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NarrativeEngineResult | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [showJson, setShowJson] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    setFeedbackGiven(null);
    try {
      const res = await fetch('/api/admin/narrative-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          customIntent: customIntent.trim() ? customIntent.trim() : undefined
        })
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        alert('Simülasyon Hatası: ' + json.error);
      }
    } catch (err) {
      alert('İstek başarısız oldu: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header - Editorial Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base">
              FA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-white">
                  FinAi Haber Özeti & Bulgu Çıkarım Motoru
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  2-4 Cümlelik Özet Motoru v1.3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                İzinli 3 Kaynak: <span className="text-slate-300">cnbce.com</span> • <span className="text-slate-300">tr.investing.com</span> • <span className="text-slate-300">paramedya.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showJson ? 'Görünüme Dön' : 'Sayfa Entegrasyon JSON'}
            </button>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
              ● Canlı Sayfalar Koruma Altında
            </span>
          </div>
        </div>
      </header>

      {/* Main Full-Viewport Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Simulation Control Console */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Symbol Input */}
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Araştırılacak Hisse Kodu (BIST)
              </label>
              <input
                type="text"
                value={symbol}
                onChange={e => setSymbol(e.target.value.toUpperCase())}
                placeholder="Örn: TERA, THYAO, ASELS"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold tracking-wider text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Optional Intent / Focus Input */}
            <div className="md:col-span-6">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Özel Araştırma Odağı (Opsiyonel)
              </label>
              <input
                type="text"
                value={customIntent}
                onChange={e => setCustomIntent(e.target.value)}
                placeholder="Tüm haberleri taramak için boş bırakın veya özel bir konu yazın..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Run Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={runSimulation}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    3 İzinli Sitede Taranıyor...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Haberleri Özetle (2-4 Cümle)
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Layout */}
        {result ? (
          showJson ? (
            /* Developer JSON View: Exactly what pages will receive */
            <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-mono text-emerald-400">
                  Sayfaların Tüketeceği Veri Paketi (FinAiNarrativeEngine.getNewsSummaries)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {result.summaries.length} Özetli Haber
                </span>
              </div>
              <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-lg overflow-x-auto max-h-[600px] border border-slate-800">
                {JSON.stringify(
                  {
                    symbol: result.symbol,
                    sector: result.sectorName,
                    hasFindings: !result.honestFallback,
                    newsCount: result.summaries.length,
                    summaries: result.summaries
                  },
                  null,
                  2
                )}
              </pre>
            </section>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* COLUMN 1: İzinli Sitelerden Çekilen Ham Akış */}
              <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800 rounded-lg p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-white">1. Ham Taranan Akış</h2>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {result.filteredNewsCount} / {result.rawNewsCount} Haber
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Şirket: <strong className="text-white">{result.symbol}</strong> ({result.sectorName})</span>
                </div>

                <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                  {result.newsItems.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-6 text-center">Haber bulunamadı.</p>
                  ) : (
                    result.newsItems.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-3 rounded-lg border text-xs transition-colors ${
                          item.isPrNoise
                            ? 'bg-amber-950/20 border-amber-800/40 opacity-70'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-slate-300 px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">
                            {item.sourceLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono truncate">{item.date}</span>
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-200 hover:text-white line-clamp-2 mb-1 flex items-start gap-1"
                        >
                          {item.title}
                          <ExternalLink className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* COLUMN 2: Her Bir Haber İçin 2-4 Cümlelik Bağımsız Özetler (Sayfaların Alacağı Nesneler) */}
              <div className="lg:col-span-8 bg-slate-900/30 border border-slate-800 rounded-lg p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-white">2. Her Haberin 2-4 Cümlelik Özeti</h2>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    {result.summaries.length} Özet • {result.durationMs}ms
                  </span>
                </div>

                {result.honestFallback ? (
                  <div className="p-5 rounded-lg bg-slate-950 border border-amber-700/40 text-amber-200/90 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{result.plainSummary}</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                    {result.summaries.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-2.5"
                      >
                        {/* Header Badge Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 px-2 py-0.5 rounded bg-slate-800 text-[10px] border border-slate-700">
                              {item.sourceLabel}
                            </span>
                            <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 text-[10px] border border-emerald-800/40 font-medium">
                              {item.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                              {item.sentenceCount} Cümle
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{item.date}</span>
                        </div>

                        {/* News Title */}
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-100 hover:text-emerald-400 transition-colors text-xs flex items-center justify-between gap-2"
                        >
                          <span className="line-clamp-1">{item.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </a>

                        {/* 2-4 Sentence Direct Summary */}
                        <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                          {item.summary}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Telemetry Micro Feedback (Madde 10) */}
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bu 2-4 cümlelik özetler hisseyi aktarmak için yeterli mi?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven('yes')}
                      className={`p-1.5 rounded transition-colors ${
                        feedbackGiven === 'yes'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Yeterli ve Açıklayıcı"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackGiven('no')}
                      className={`p-1.5 rounded transition-colors ${
                        feedbackGiven === 'no'
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                      title="Yetersiz veya Eksik"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {feedbackGiven && (
                  <p className="text-[10px] text-slate-400 text-right">
                    {feedbackGiven === 'yes' ? '✓ Geri bildiriminiz telemetriye kaydedildi.' : '⚠ Eksik bildirim telemetriye kaydedildi; self-tuning kalibrasyonuna iletildi.'}
                  </p>
                )}
              </div>

            </div>
          )
        ) : (
          <div className="border border-dashed border-slate-800 rounded-lg p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <Layers className="w-8 h-8 text-slate-600" />
            <p className="text-sm">
              Hisse kodunu yazdıktan sonra <strong className="text-slate-300">Haberleri Özetle (2-4 Cümle)</strong> butonuna basınız.
            </p>
            <p className="text-xs text-slate-600 max-w-md">
              Algoritma her bir haberi 2 ile 4 cümle arasında doğrudan özetler ve sayfalara hazır bir veri paketi halinde sunar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
