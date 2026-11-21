"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  ArrowRight, 
  Play, 
} from "lucide-react";
import { UNIT_1_CONFIG, getLesson1Content } from "@/data/academy/unit-1";
import { CashFlowSimulator } from "@/components/academy/CashFlowSimulator";
import { useUser } from "@/components/providers/UserProvider";

function AkademiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Kullanıcı adı bilgisi
  let userName: string | null = null;
  try {
    const userCtx = useUser();
    userName = userCtx?.userName || null;
  } catch {
    // UserProvider dışı koruma
  }

  const lessonContent = useMemo(() => getLesson1Content(userName), [userName]);

  // URL senkronizasyonu
  const urlTopic = searchParams.get("ders");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(urlTopic);
  const [hasCompletedReading, setHasCompletedReading] = useState(false);

  useEffect(() => {
    setSelectedTopicId(urlTopic);
  }, [urlTopic]);

  const handleOpenTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setHasCompletedReading(false);
    router.push(`/dashboard/akademi?ders=${topicId}`, { scroll: true });
  };

  const handleBackToOverview = () => {
    setSelectedTopicId(null);
    router.push("/dashboard/akademi", { scroll: true });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-clash w-full bg-white text-[#0E1E38] selection:bg-blue-100 selection:text-[#0E1E38]">
      
      {/* =========================================================================
          DURUM 1: AKADEMİ MERKEZİ & YOL HARİTASI (VARSAYILAN AÇILIŞ GÖRÜNÜMÜ)
          ========================================================================= */}
      {selectedTopicId === null ? (
        <>
          {/* SOL KOLON: %70 BEYAZ ZEMİN */}
          <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
            <div className="space-y-8 max-w-4xl">

              {/* Başlık Alanı */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-normal text-[#0E1E38] tracking-tight clash-title">
                  FinAi Akademi
                </h1>
              </div>

              {/* BU HAFTANIN ODAK KARTI (Kullanıcı talebiyle en üste taşındı) */}
              <div className="p-6 sm:p-7 bg-[#0E1E38] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-[#0E1E38]/10">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Bu Hafta Yayında • 1. Hafta</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-normal text-white clash-title">
                    1.1 Gelir ve Gider Yönetimi: Kendi Nakit Akışının Farkına Varmak
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                    Finansal gücün ne kadar kazandığınla değil; ay bittiğinde masada ne bırakabildiğinle başlar.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenTopic("1-1")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg shrink-0 cursor-pointer group"
                >
                  <span>1. Haftanın Dersine Başla</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* AÇIKLAMA METNİ (Kutudan tamamen arındırıldı, salt editoryal yazı) */}
              <div className="pt-2">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  Finansal piyasaları öğrenmek isteyen çoğu insan, ezberletilen teorik formüller ve sonu gelmeyen teknik terimler yüzünden başlangıçta pes eder. Biz FinAi Akademi'de teoriyi bir kenara bırakıp, doğrudan bir şirketi ve piyasayı okuma mantığına odaklanıyoruz. Buradaki amacımız, kendi tasarruflarınızı yönetirken kimsenin tüyosuna ihtiyaç duymadan, neyi neden aldığınızı bilerek rasyonel kararlar verebilmenizi sağlamaktır.
                </p>
              </div>

              {/* BİZ NEYİ FARKLI YAPIYORUZ? (Okunaklı, ferah, editoryal yeni tasarım) */}
              <div className="pt-8 border-t border-slate-200 space-y-6">
                <div>
                  <h2 className="text-2xl font-normal text-[#0E1E38] clash-title">
                    Biz Neyi Farklı Yapıyoruz?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                    <span className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider block">
                      01 • Ticari Mantık
                    </span>
                    <h4 className="text-base font-semibold text-[#0E1E38]">
                      Teori Yerine Ticari Mantık
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      Kitaplardaki finansal terimleri ezberletmek yerine, o kavramların şirketin kasasına ve günlük operasyonuna nasıl yansıdığını gösteriyoruz. Bir rasyoya baktığınızda bunun sadece matematiksel bir işlem değil, şirketin hayatta kalma mücadelesi olduğunu anlamanızı sağlıyoruz.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      02 • Karar Refleksi
                    </span>
                    <h4 className="text-base font-semibold text-[#0E1E38]">
                      Ezber Sınavı Yok, Karar Var
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      Bölüm sonlarında klasik test soruları çözdürmüyoruz. Anlatım bittiğinde size simüle bir bütçe vererek gerçek bir karar aldırıyoruz; böylece kendi paranızı riske atmadan piyasanın mantığını aldığınız kararların sonuçlarıyla görüyorsunuz.
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      03 • Bütüncül Sistem
                    </span>
                    <h4 className="text-base font-semibold text-[#0E1E38]">
                      Birbirine Bağlanan Sistem
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      Burada öğrendiğiniz hiçbir konu havada kalmaz. İlk aşamada öğrendiğiniz temel nakit akışı mantığı, bir sonraki aşamada bilanço okurken ve şirket seçerken doğrudan karşınıza çıkar. Her ders bir sonrakini besler ve zamanla eksiksiz bir yatırım bakış açısı oluşturur.
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Alt Bilgi */}
            <div className="pt-10 mt-10 border-t border-slate-200 text-center sm:text-left text-xs text-slate-400">
              © {new Date().getFullYear()} FinAi Akademi. Bilinçli yatırımcılar için sıfırdan inşa edildi.
            </div>
          </section>

          {/* SAĞ KOLON: %30 DERİN LACİVERT VİTRİN & 12 HAFTALIK İLERLEME (SCROLLSUZ TAM LİSTE) */}
          <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Üst: FinAi Marka Başlığı */}
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA] animate-pulse" />
                <span className="text-lg font-bold tracking-tight text-white clash-title">
                  FinAi Akademi
                </span>
              </div>

              {/* Ünite Bilgisi */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
                  1. Ünite
                </span>
                <h3 className="text-base sm:text-lg font-normal text-white clash-title leading-snug">
                  {UNIT_1_CONFIG.title}
                </h3>
              </div>

              {/* 12 HAFTALIK TÜM KONULAR LİSTESİ (Scroll kaldırıldı, tüm konular tam boy) */}
              <div className="space-y-2 pt-2">
                {UNIT_1_CONFIG.topics.map((topic) => {
                  const isActive = topic.status === "active";
                  return (
                    <div
                      key={topic.id}
                      onClick={() => isActive && handleOpenTopic(topic.id)}
                      className={`p-2.5 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                        isActive
                          ? "bg-[#004BFA]/25 border-[#004BFA]/70 text-white cursor-pointer hover:bg-[#004BFA]/35 hover:border-[#004BFA]"
                          : "bg-white/[0.02] border-white/5 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isActive ? (
                          <div className="w-4 h-4 rounded-full bg-[#004BFA] flex items-center justify-center text-white">
                            <Play className="w-2 h-2 fill-white text-white ml-0.5" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-semibold truncate ${isActive ? "text-white" : "text-white/60"}`}>
                            {topic.shortTitle}
                          </span>
                          <span className={`text-[10px] shrink-0 ${isActive ? "text-[#78B8F5] font-semibold" : "text-white/30"}`}>
                            {isActive ? "Derse Başla" : topic.readTime}
                          </span>
                        </div>
                        <p className={`text-[11px] line-clamp-1 ${isActive ? "text-white/80" : "text-white/30"}`}>
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Sağ Kolon Alt Bilgi */}
            <div className="relative z-10 pt-5 mt-5 border-t border-white/10">
              <p className="text-[11px] text-white/50 leading-relaxed">
                Her hafta yeni bir kavram ve simülasyon aktif hale gelir.
              </p>
            </div>

          </section>
        </>
      ) : (
        /* =========================================================================
            DURUM 2: SADECE BU HAFTANIN İÇERİĞİ (DERS & SİMÜLASYON ÇALIŞMA MASASI)
            ========================================================================= */
        <>
          {/* SOL KOLON: %70 BEYAZ ZEMİN */}
          <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
            <div>
              
              {/* Üst Navigasyon: Yalnızca Haritaya Dönüş */}
              <div className="border-b border-slate-200 pb-4 mb-6">
                <button
                  type="button"
                  onClick={handleBackToOverview}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Akademi Haritasına Dön</span>
                </button>
              </div>

              {/* Ders Başlığı (Kullanıcı talebiyle ölçülü boyuta indirildi) */}
              <div className="space-y-2 max-w-4xl">
                <h2 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight clash-title">
                  {lessonContent.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {lessonContent.introSubtitle}
                </p>
              </div>

              {/* 1.1 EDİTORYAL ANLATIM METİNLERİ (4 Blok) */}
              <div className="mt-8 space-y-8">
                {lessonContent.blocks.map((block) => (
                  <div key={block.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
                      <h3 className="text-base sm:text-lg font-semibold text-[#0E1E38]">
                        {block.title}
                      </h3>
                    </div>
                    <div className="space-y-2 pl-3.5 border-l-2 border-slate-200">
                      {block.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* SİMÜLATÖRÜ AÇAN BUTON */}
              {!hasCompletedReading ? (
                <div className="mt-10 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setHasCompletedReading(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#0E1E38] hover:bg-[#004BFA] text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Anlatımı Okudum, Nakit Akışımla Yüzleşmek İstiyorum</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              ) : null}

              {/* AÇILAN İNTERAKTİF KARAR ARACI */}
              {hasCompletedReading && (
                <div className="mt-10 pt-8 border-t-2 border-[#004BFA] space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>İnteraktif Alan Devrede</span>
                      </span>
                      <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title mt-1">
                        Şimdi Sıra Sende: Kendi Sayılarını Masaya Yatır
                      </h3>
                    </div>
                  </div>

                  <CashFlowSimulator />

                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Gelecek Hafta (2. Hafta)
                      </span>
                      <h5 className="text-sm font-semibold text-[#0E1E38]">
                        1.2 Tasarruf Nedir, Nasıl Yapılır? (Harcamaları Kısma Sanatı)
                      </h5>
                      <p className="text-xs text-slate-500">
                        Bu hafta tespit ettiğin serbest nakdi veya açığı nasıl yöneteceğini öğreneceğiz.
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
            <div className="pt-10 mt-10 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>© {new Date().getFullYear()} FinAi Akademi.</span>
              <button
                type="button"
                onClick={handleBackToOverview}
                className="text-[#004BFA] hover:underline font-semibold cursor-pointer"
              >
                Yol Haritasına Geri Dön ↑
              </button>
            </div>
          </section>

          {/* SAĞ KOLON: %30 DERİN LACİVERT VİTRİN */}
          <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-7">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-semibold tracking-wide text-white uppercase">
                    Ders Odak Modu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBackToOverview}
                  className="text-xs text-[#78B8F5] hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Haritaya Dön
                </button>
              </div>

              <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[11px] font-semibold text-[#78B8F5] uppercase tracking-wider block">
                  1. Haftanın Ana Fikri
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  "Finansal gücün ne kadar kazandığınla değil; ay bittiğinde masada ne bırakabildiğinle başlar."
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
                  Dersin Anahtar Terimleri
                </span>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                    <h5 className="text-xs font-semibold text-white">Nakit Akışı (Cash Flow)</h5>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Belirli bir zaman diliminde cüzdana giren ve cüzdandan çıkan tüm paranın net farkı.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                    <h5 className="text-xs font-semibold text-white">Serbest Nakit (Free Cash)</h5>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Tüm zorunlu yaşam harcamaları ödendikten sonra yatırıma dönüştürülebilecek kalan para.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                    <h5 className="text-xs font-semibold text-white">Tasarruf Kapasitesi (%)</h5>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Kazanılan toplam gelirin yüzde kaçının sermaye olarak kenara ayrılabildiği oranı.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            <div className="relative z-10 pt-5 mt-5 border-t border-white/10">
              <button
                type="button"
                onClick={handleBackToOverview}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Akademi Ana Haritasına Dön</span>
              </button>
            </div>

          </section>
        </>
      )}

    </div>
  );
}

export default function FinAiAkademiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-white text-[#0E1E38] font-clash">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-[#004BFA] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">FinAi Akademi Yükleniyor...</p>
        </div>
      </div>
    }>
      <AkademiContent />
    </Suspense>
  );
}
