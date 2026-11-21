"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Sparkles, ChevronRight, BookOpen, Layers, Target, Compass } from "lucide-react";
import { UNIT_1_CONFIG, LESSON_1_1_CONTENT } from "@/data/academy/unit-1";
import { CashFlowSimulator } from "@/components/academy/CashFlowSimulator";

export default function FinAiAkademiPage() {
  const [activeTab, setActiveTab] = useState<"lesson" | "overview">("lesson");
  const [hasCompletedReading, setHasCompletedReading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-clash w-full bg-white text-[#0E1E38] selection:bg-blue-100 selection:text-[#0E1E38]">
      
      {/* =========================================================================
          SOL KOLON: %70 BEYAZ EDİTORYAL PANEL (ANLATIM + İNTERAKTİF KARAR MASASI)
          ========================================================================= */}
      <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
        
        {/* Üst Navigasyon & Durum Çubuğu */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Dashboard'a Dön</span>
            </Link>

            {/* Ünite ve Hafta Etiketi */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-[#004BFA] border border-blue-100">
                Ünite 1 • 1. Hafta
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {LESSON_1_1_CONTENT.readTime}
              </span>
            </div>
          </div>

          {/* Başlık ve Alt Başlık */}
          <div className="space-y-3 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004BFA] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>FinAi Akademi Temelleri</span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-normal text-[#0E1E38] tracking-tight clash-title leading-tight">
              {LESSON_1_1_CONTENT.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {LESSON_1_1_CONTENT.introSubtitle}
            </p>
          </div>

          {/* GİRİŞ MANİFESTOSU (Söz Verilen Düzeltilmiş Slogansız Metin) */}
          <div className="mt-8 p-5 sm:p-6 bg-slate-50 border-l-4 border-[#004BFA] rounded-r-2xl space-y-2">
            <h3 className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider">
              FinAi Yaklaşımı & Başlangıç İlkemiz
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Finansal piyasaları öğrenmek isteyen çoğu insan, ezberletilen teorik formüller ve sonu gelmeyen teknik terimler yüzünden başlangıçta pes eder. Biz FinAi Akademi'de teoriyi bir kenara bırakıp, doğrudan bir şirketi ve piyasayı okuma mantığına odaklanıyoruz. Buradaki amacımız, kendi tasarruflarınızı yönetirken kimsenin tüyosuna ihtiyaç duymadan, neyi neden aldığınızı bilerek rasyonel kararlar verebilmenizi sağlamaktır.
            </p>
          </div>

          {/* "BİZ NEYİ FARKLI YAPIYORUZ?" BÖLÜMÜ (3 Temel Sütun, 2-4 Cümle) */}
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title">
                Biz Neyi Farklı Yapıyoruz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Eğitim anlayışımızı sıradan finans kurslarından ayıran 3 temel prensibimiz:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2 border-l-2 border-[#004BFA] pl-4">
                <span className="text-[11px] font-semibold text-[#004BFA] uppercase tracking-wider block">
                  01 • Ticari Mantık
                </span>
                <h4 className="text-sm font-semibold text-[#0E1E38]">
                  Teori Yerine Ticari Mantık
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Kitaplardaki finansal terimleri ezberletmek yerine, o kavramların şirketin kasasına ve günlük operasyonuna nasıl yansıdığını gösteriyoruz. Bir rasyoya baktığınızda bunun sadece matematiksel bir işlem değil, şirketin hayatta kalma mücadelesi olduğunu anlamanızı sağlıyoruz.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-slate-300 pl-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  02 • Karar Refleksi
                </span>
                <h4 className="text-sm font-semibold text-[#0E1E38]">
                  Ezber Sınavı Yok, Karar Var
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Bölüm sonlarında klasik test soruları çözdürmüyoruz. Anlatım bittiğinde size simüle bir bütçe vererek gerçek bir karar aldırıyoruz; böylece kendi paranızı riske atmadan piyasanın mantığını aldığınız kararların sonuçlarıyla görüyorsunuz.
                </p>
              </div>

              <div className="space-y-2 border-l-2 border-slate-300 pl-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  03 • Bütüncül Sistem
                </span>
                <h4 className="text-sm font-semibold text-[#0E1E38]">
                  Birbirine Bağlanan Sistem
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Burada öğrendiğiniz hiçbir konu havada kalmaz. İlk aşamada öğrendiğiniz temel nakit akışı mantığı, bir sonraki aşamada bilanço okurken ve şirket seçerken doğrudan karşınıza çıkar. Her ders bir sonrakini besler ve zamanla eksiksiz bir yatırım bakış açısı oluşturur.
                </p>
              </div>

            </div>
          </div>

          {/* 1.1 EDİTORYAL ANLATIM EVRESİ (3 Blok) */}
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#004BFA] block">
                1. Hafta Dersi
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-[#0E1E38] clash-title mt-1">
                Nakit Akışının Gücü ve Ev Ekonomisi
              </h2>
            </div>

            <div className="space-y-6">
              {LESSON_1_1_CONTENT.blocks.map((block, idx) => (
                <div key={block.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA]" />
                    <h3 className="text-base sm:text-lg font-semibold text-[#0E1E38]">
                      {block.title}
                    </h3>
                  </div>
                  <div className="space-y-2 pl-3.5 border-l border-slate-200">
                    {block.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* İnteraktif Uygulamaya Geçiş Butonu / Tetikleyici */}
            {!hasCompletedReading ? (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setHasCompletedReading(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0E1E38] hover:bg-[#004BFA] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Anlatımı Okudum, Nakit Akışımla Yüzleşmek İstiyorum</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* UYGULAMA EVRESİ (KİŞİSEL NAKİT AKIŞI MASASI) */}
          {hasCompletedReading && (
            <div className="mt-12 pt-8 border-t-2 border-[#004BFA] space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Uygulama Alanı Açıldı</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title mt-1">
                    Şimdi Sıra Sende: Kendi Sayılarını Masaya Yatır
                  </h3>
                </div>
              </div>

              {/* Esnek, Zorunsuz Kişisel Nakit Akış Simülatörü */}
              <CashFlowSimulator />

              {/* Bir Sonraki Haftanın Duyurusu */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Gelecek Hafta (2. Hafta)
                  </span>
                  <h5 className="text-sm font-semibold text-[#0E1E38]">
                    1.2 Tasarruf Nedir, Nasıl Yapılır? (Harcamaları Kısma Sanatı)
                  </h5>
                  <p className="text-xs text-slate-500">
                    Bu hafta tespit ettiğin nakit açığını veya serbest nakdi korumanın formüllerini inceleyeceğiz.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 font-medium shrink-0">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Haftaya Yayında</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Alt Bilgi */}
        <div className="pt-12 mt-12 border-t border-slate-200 text-center sm:text-left text-xs text-slate-400">
          © {new Date().getFullYear()} FinAi Akademi. Bilinçli yatırımcılar için sıfırdan inşa edildi.
        </div>
      </section>


      {/* =========================================================================
          SAĞ KOLON: %30 DERİN LACİVERT VİTRİN & 12 HAFTALIK YOL HARİTASI
          ========================================================================= */}
      <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
        
        {/* Ambient Arka Plan Işıltısı (Giriş Sayfası ile Birebir) */}
        <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Üst: FinAi Marka Başlığı */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA] animate-pulse" />
              <span className="text-lg font-bold tracking-tight text-white clash-title">
                FinAi Akademi
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#78B8F5] bg-[#004BFA]/20 border border-[#004BFA]/40 px-2 py-0.5 rounded">
              Haftalık İlerleme
            </span>
          </div>

          {/* Ünite Bilgisi */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
              Mevcut Ünite
            </span>
            <h3 className="text-lg sm:text-xl font-normal text-white clash-title leading-snug">
              Ünite 1: {UNIT_1_CONFIG.title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-normal">
              {UNIT_1_CONFIG.subtitle}
            </p>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="space-y-2 p-3.5 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between text-xs text-white/80">
              <span className="font-medium">Ünite 1 İlerlemesi</span>
              <span className="font-semibold text-[#78B8F5]">%8 Tamamlandı</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[8%] h-full bg-[#004BFA] rounded-full" />
            </div>
            <span className="text-[10px] text-white/50 block">
              12 konunun 1'i aktif • Her hafta 1 konu eklenir
            </span>
          </div>

          {/* 12 HAFTALIK YOL HARİTASI LİSTESİ */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">
              12 Haftalık Müfredat
            </span>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {UNIT_1_CONFIG.topics.map((topic) => {
                const isActive = topic.status === 'active';
                return (
                  <div
                    key={topic.id}
                    className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#004BFA]/15 border-[#004BFA]/50 text-white'
                        : 'bg-white/[0.02] border-white/5 text-white/40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isActive ? (
                        <div className="w-5 h-5 rounded-full bg-[#004BFA] flex items-center justify-center text-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-semibold truncate ${isActive ? 'text-white' : 'text-white/60'}`}>
                          {topic.shortTitle}
                        </span>
                        <span className={`text-[10px] shrink-0 ${isActive ? 'text-[#78B8F5]' : 'text-white/30'}`}>
                          {topic.readTime}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 ${isActive ? 'text-white/70' : 'text-white/30'}`}>
                        {topic.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sağ Kolon Alt: Bilgilendirme Notu */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
          <p className="text-[11px] text-white/50 leading-relaxed">
            FinAi Akademi; haftalık interaktif kararlarla finansal sezgi kazandırır. Her hafta açılan yeni adımlarla portföy ve bilanço seviyesine ulaşılır.
          </p>
        </div>

      </section>

    </div>
  );
}
