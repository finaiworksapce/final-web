'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, RefreshCw, AlertCircle, Sparkles, Newspaper, ShieldCheck } from 'lucide-react';

export interface ProcessedNewsSummary {
  id: string;
  source: 'cnbce' | 'paramedya' | 'investing';
  sourceLabel: string;
  title: string;
  date: string;
  link: string;
  category: string;
  summary: string; // 2 ile 4 cümlelik doğrudan kaynak özeti
  sentenceCount: number;
  keyTakeaway?: string;
}

interface SymbolOption {
  symbol: string;
  cleanSymbol: string;
  name?: string;
}

interface FinAiMonthlyNewsFindingsProps {
  symbol?: string; // Örn: "THYAO", "TERA", "ASELS"
  availableSymbols?: SymbolOption[];
  userName?: string;
  customIntro?: string; // İsteğe bağlı: Üst kısma yazmak istediğiniz özel hitap metni
  className?: string;
}

/**
 * FinAi Aylık Rapor Doğrulanmış Haber Bulguları & Editoryal Anlatı Bileşeni
 * 
 * İzinli 3 finansal kaynaktan (CNBC-e, Investing.com TR, Paramedya) hisseye ait
 * maddi haberleri çeker; PR gürültüsünden arındırıp 2-4 cümlelik doğrudan editoryal özetler sunar.
 */
export default function FinAiMonthlyNewsFindings({
  symbol = 'THYAO',
  availableSymbols = [],
  userName,
  customIntro,
  className = ''
}: FinAiMonthlyNewsFindingsProps) {
  // İlk sembol tercihi: availableSymbols'ın ilk elemanı, yoksa symbol parametresi
  const initialSymbol = (availableSymbols.length > 0 ? availableSymbols[0].cleanSymbol : symbol).toUpperCase().trim();
  const [activeSymbol, setActiveSymbol] = useState<string>(initialSymbol);

  const [loading, setLoading] = useState<boolean>(true);
  const [summaries, setSummaries] = useState<ProcessedNewsSummary[]>([]);
  const [hasFindings, setHasFindings] = useState<boolean>(false);
  const [fallbackMessage, setFallbackMessage] = useState<string>('');

  useEffect(() => {
    if (availableSymbols.length > 0 && !availableSymbols.some(s => s.cleanSymbol === activeSymbol)) {
      setActiveSymbol(availableSymbols[0].cleanSymbol.toUpperCase().trim());
    }
  }, [availableSymbols, activeSymbol]);

  useEffect(() => {
    let isMounted = true;

    async function loadNews() {
      if (!activeSymbol) return;

      const cacheKey = `finai_cached_news_${activeSymbol}`;
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setSummaries(parsed.summaries || []);
            setHasFindings(parsed.hasFindings);
            setFallbackMessage(parsed.fallbackMessage || '');
            setLoading(false);
          } catch {}
        } else {
          setLoading(true);
        }
      }

      try {
        const res = await fetch(`/api/finai/news-summaries?symbol=${encodeURIComponent(activeSymbol)}`);
        const json = await res.json();

        if (isMounted && json.success && json.data) {
          const findings = json.data.hasFindings;
          const items = json.data.summaries || [];
          const fallback = json.data.fallbackMessage ||
            'Bizim araştırmalarımız ve izinli kaynak taramalarımız sonucunda hisseye dair teyitli bir bulguya rastlanmadı.';

          setHasFindings(findings);
          setSummaries(items);
          setFallbackMessage(fallback);

          if (typeof window !== 'undefined') {
            sessionStorage.setItem(cacheKey, JSON.stringify({
              hasFindings: findings,
              summaries: items,
              fallbackMessage: fallback
            }));
          }
        }
      } catch (err) {
        if (isMounted && summaries.length === 0) {
          setHasFindings(false);
          setFallbackMessage('Haber bulguları yüklenirken bir iletişim hatası oluştu.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNews();

    return () => {
      isMounted = false;
    };
  }, [activeSymbol]);

  // FinAi Kurumsal Editoryal Dili: Kullanıcıya hitap ve bağlam
  const displayName = userName ? userName.split('@')[0] : 'Yatırımcı';
  const editorialIntro = customIntro || (
    <>
      <span className="font-semibold text-slate-900 dark:text-white">Sayın {displayName},</span> portföyünüzde yer alan{' '}
      <span className="font-semibold text-[#004BFA] dark:text-[#93C5FD]">{activeSymbol}</span> varlığına ilişkin izinli finansal kaynaklardaki maddi gelişmeler ve operasyonel veriler, spekülatif PR gürültüsünden arındırılarak aşağıda 2-4 cümlelik doğrulanmış özetler halinde listelenmiştir.
    </>
  );

  return (
    <section 
      id="news-findings"
      className={`w-full bg-white dark:bg-[#02041A]/60 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800 dark:text-slate-100 transition-all ${className}`}
    >
      {/* 1. ÜST EDİTORYAL BAŞLIK & KAYNAK ROZETLERİ */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-white/10 border border-blue-100 dark:border-white/15 flex items-center justify-center text-[#004BFA] dark:text-[#93C5FD] shrink-0">
            <Newspaper className="w-4 h-4 text-[#004BFA] dark:text-[#93C5FD]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
              <span>{activeSymbol} — Doğrulanmış Haber Bulguları</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-white/10 text-[#004BFA] dark:text-[#93C5FD] border border-blue-100 dark:border-white/15 font-semibold">
                Aylık Rapor Özeti
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              İzinli Teyitli Kaynaklar: <span className="font-medium text-slate-700 dark:text-slate-300">CNBC-e</span> • <span className="font-medium text-slate-700 dark:text-slate-300">Investing.com TR</span> • <span className="font-medium text-slate-700 dark:text-slate-300">Paramedya</span>
            </p>
          </div>
        </div>

        {/* Durum Rozeti */}
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#004BFA]" />
              Kaynaklar taranıyor...
            </span>
          ) : (
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {summaries.length} Teyitli Gelişme
            </span>
          )}
        </div>
      </div>

      {/* 2. PORTFÖY VARLIKLARI SEÇİCİ SEKMELER (TABS) */}
      {availableSymbols.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none touch-pan-x">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 pr-1">
            Varlık Seçin:
          </span>
          {availableSymbols.map((s) => {
            const isSelected = s.cleanSymbol === activeSymbol;
            return (
              <button
                key={s.cleanSymbol}
                type="button"
                onClick={() => setActiveSymbol(s.cleanSymbol)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004BFA] text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-transparent'
                }`}
              >
                {s.cleanSymbol}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. FİNAİ KURUMSAL EDİTORYAL HİTAP ALANI */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {editorialIntro}
      </div>

      {/* 4. İÇERİK: YÜKLENİYOR / FALLBACK / HABER KARTLARI */}
      {loading ? (
        <div className="space-y-3 py-2 animate-pulse">
          <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl" />
          <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl" />
        </div>
      ) : !hasFindings || summaries.length === 0 ? (
        /* Dürüst Fallback: Sıfır Halüsinasyon İlkesi */
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block text-amber-950 dark:text-amber-300">
              Resmi ve Teyitli Bulguya Rastlanmadı
            </span>
            <p className="leading-relaxed opacity-90">{fallbackMessage}</p>
          </div>
        </div>
      ) : (
        /* 2-4 Cümlelik Doğrulanmış Bağımsız Özet Kartları */
        <div className="space-y-3">
          {summaries.map((item) => (
            <article
              key={item.id}
              className="p-4 sm:p-4.5 rounded-xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col gap-2.5"
            >
              {/* Üst Rozetler: Kaynak + Kategori + Cümle Sayısı */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded-md bg-white dark:bg-white/10 text-[11px] border border-slate-200 dark:border-white/10 shadow-2xs">
                    {item.sourceLabel}
                  </span>
                  <span className="text-[#004BFA] dark:text-[#93C5FD] px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[11px] border border-blue-100 dark:border-blue-900/40 font-medium">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                    {item.sentenceCount} Cümle
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{item.date}</span>
              </div>

              {/* Orijinal Başlık & Kaynak Bağlantısı */}
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-900 dark:text-white hover:text-[#004BFA] dark:hover:text-[#93C5FD] transition-colors text-xs sm:text-[13px] flex items-center justify-between gap-2 group/link"
              >
                <span className="line-clamp-1">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-[#004BFA] dark:group-hover/link:text-[#93C5FD] shrink-0 transition-colors" />
              </a>

              {/* 2-4 Cümlelik Doğrudan Kaynak Özeti */}
              <div className="p-3 rounded-lg bg-white dark:bg-[#02041A]/50 border border-slate-200/60 dark:border-white/10 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {item.summary}
              </div>

              {/* Vurucu Ana Çıkarım (Key Takeaway) */}
              {item.keyTakeaway && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Ana Çıkarım:</span>
                  <span className="italic truncate">{item.keyTakeaway}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* 5. ALT EDİTORYAL DİPNOT */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          FinAi Doğruluk Güvencesi: Yalnızca teyitli 3 bağımsız kaynaktan derlenmiştir.
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider">
          Sıfır Halüsinasyon Standardı
        </span>
      </div>
    </section>
  );
}
