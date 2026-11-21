"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  Target, 
  Compass, 
  Play, 
  Award, 
  Lightbulb,
  Sparkles
} from "lucide-react";
import { UNIT_1_CONFIG, LESSON_1_1_CONTENT } from "@/data/academy/unit-1";
import { CashFlowSimulator } from "@/components/academy/CashFlowSimulator";

function AkademiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL senkronizasyonu: ?ders=1-1 ise doğrudan ders açılır; yoksa ana harita açılır
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
          {/* SOL KOLON: %70 BEYAZ ZEMİN (AKADEMİ MANİFESTOSU VE FELSEFESİ) */}
          <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
            <div>
              {/* Üst Navigasyon */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 mb-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Dashboard'a Dön</span>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-[#004BFA] border border-blue-100">
                    Sıfırdan İleri Seviyeye
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    12 Haftalık Program
                  </span>
                </div>
              </div>

              {/* Ana Başlık ve Alt Başlık */}
              <div className="space-y-3 max-w-4xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004BFA] uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Finansal Sezgi ve Karar Alma Laboratuvarı</span>
                </div>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-normal text-[#0E1E38] tracking-tight clash-title leading-tight">
                  FinAi Akademi'ye Hoş Geldiniz
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                  Finansal piyasaları anlamak bir ezber işi değil; rasyonel düşünme ve sermayeyi doğru yönlendirme refleksidir.
                </p>
              </div>

              {/* MANİFESTO (Söz Verilen Dürüst ve Rasyonel Açıklama - 3 Cümle) */}
              <div className="mt-8 p-5 sm:p-6 bg-slate-50 border-l-4 border-[#004BFA] rounded-r-2xl space-y-2">
                <h3 className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider">
                  Neden Buradasınız?
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  Finansal piyasaları öğrenmek isteyen çoğu insan, ezberletilen teorik formüller ve sonu gelmeyen teknik terimler yüzünden başlangıçta pes eder. Biz FinAi Akademi'de teoriyi bir kenara bırakıp, doğrudan bir şirketi ve piyasayı okuma mantığına odaklanıyoruz. Buradaki amacımız, kendi tasarruflarınızı yönetirken kimsenin tüyosuna ihtiyaç duymadan, neyi neden aldığınızı bilerek rasyonel kararlar verebilmenizi sağlamaktır.
                </p>
              </div>

              {/* BİZ NEYİ FARKLI YAPIYORUZ? (3 Temel Sütun) */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-normal text-[#0E1E38] clash-title">
                    Biz Neyi Farklı Yapıyoruz?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Bu sayfadaki metodolojiyi klasik eğitim sitelerinden ayıran 3 temel ilkemiz:
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

              {/* BU SAYFADA NASIL İLERLEYECEKSİNİZ? (İşleyiş Kuralı) */}
              <div className="mt-10 pt-8 border-t border-slate-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#0E1E38]">
                    Bu Sayfada Nasıl İlerleyeceksiniz?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider block">
                      1. Adım: Oku ve Özümse
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Her hafta açılan konunun editoryal metnini ve şemalarını dikkatle inceleyin.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider block">
                      2. Adım: Kararını Ver
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Anlatım bitiminde açılan simülatörde kendi sayılarınızla gerçek bir finansal karar alın.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <span className="text-xs font-semibold text-[#004BFA] uppercase tracking-wider block">
                      3. Adım: Biriktir ve Büyüt
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Her haftanın dersi kümülatif olarak birikir ve sizi bağımsız bilanço okuma seviyesine taşır.
                    </p>
                  </div>
                </div>
              </div>

              {/* BU HAFTANIN ODAK KARTI & EYLEME ÇAĞRI BUTONU */}
              <div className="mt-10 p-6 bg-[#0E1E38] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-[#0E1E38]/10">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Bu Hafta Yayında • 1. Hafta</span>
                  </div>
                  <h4 className="text-xl font-normal text-white clash-title mt-1">
                    1.1 Gelir ve Gider Yönetimi: Ev Ekonomisi ve Nakit Akışı Nedir?
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Zenginlik ne kadar kazandığınızla değil, ay sonunda elinizde ne kaldığıyla ölçülür. Kendi nakit akışınızla yüzleşmek için ilk adıma başlayın.
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

            </div>

            {/* Alt Bilgi */}
            <div className="pt-10 mt-10 border-t border-slate-200 text-center sm:text-left text-xs text-slate-400">
              © {new Date().getFullYear()} FinAi Akademi. Bilinçli yatırımcılar için sıfırdan inşa edildi.
            </div>
          </section>

          {/* SAĞ KOLON: %30 DERİN LACİVERT VİTRİN & 12 HAFTALIK İLERLEME AĞACI */}
          <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
            
            {/* Ambient Arka Plan Işıltısı */}
            <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-7">
              
              {/* Üst: FinAi Marka Başlığı */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA] animate-pulse" />
                  <span className="text-lg font-bold tracking-tight text-white clash-title">
                    FinAi Akademi
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#78B8F5] bg-[#004BFA]/20 border border-[#004BFA]/40 px-2 py-0.5 rounded">
                  Yol Haritası
                </span>
              </div>

              {/* Ünite Bilgisi */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
                  1. Ünite
                </span>
                <h3 className="text-lg sm:text-xl font-normal text-white clash-title leading-snug">
                  {UNIT_1_CONFIG.title}
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

              {/* 12 HAFTALIK LİSTE */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
                  Haftalık İlerleme Listesi
                </span>

                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {UNIT_1_CONFIG.topics.map((topic) => {
                    const isActive = topic.status === "active";
                    return (
                      <div
                        key={topic.id}
                        onClick={() => isActive && handleOpenTopic(topic.id)}
                        className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                          isActive
                            ? "bg-[#004BFA]/20 border-[#004BFA]/60 text-white cursor-pointer hover:bg-[#004BFA]/30 hover:border-[#004BFA]"
                            : "bg-white/[0.02] border-white/5 text-white/40 cursor-not-allowed"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isActive ? (
                            <div className="w-5 h-5 rounded-full bg-[#004BFA] flex items-center justify-center text-white">
                              <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                              <Lock className="w-3 h-3" />
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

            </div>

            {/* Sağ Kolon Alt */}
            <div className="relative z-10 pt-5 mt-5 border-t border-white/10">
              <p className="text-[11px] text-white/50 leading-relaxed">
                Her hafta yeni bir kavram ve simülasyon aktif hale gelir. Sırayla ilerlemek finansal refleksinizi pekiştirir.
              </p>
            </div>

          </section>
        </>
      ) : (
        /* =========================================================================
            DURUM 2: SADECE BU HAFTANIN İÇERİĞİ (DERS & SİMÜLASYON ÇALIŞMA MASASI)
            ========================================================================= */
        <>
          {/* SOL KOLON: %70 BEYAZ ZEMİN (YALNIZCA 1.1 DERSİ + SİMÜLASYON) */}
          <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen">
            <div>
              
              {/* Üst Navigasyon: Haritaya Dönüş */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5 mb-8">
                <button
                  type="button"
                  onClick={handleBackToOverview}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Akademi Haritasına Dön</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    1. Hafta Dersi
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {LESSON_1_1_CONTENT.readTime}
                  </span>
                </div>
              </div>

              {/* Ders Başlığı ve Giriş Açıklaması */}
              <div className="space-y-3 max-w-4xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#004BFA] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Ünite 1 • Konu 1.1</span>
                </div>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-normal text-[#0E1E38] tracking-tight clash-title leading-tight">
                  {LESSON_1_1_CONTENT.title}
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                  {LESSON_1_1_CONTENT.introSubtitle}
                </p>
              </div>

              {/* 1.1 EDİTORYAL ANLATIM METİNLERİ (3 Blok) */}
              <div className="mt-10 space-y-8">
                {LESSON_1_1_CONTENT.blocks.map((block) => (
                  <div key={block.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
                      <h3 className="text-lg sm:text-xl font-semibold text-[#0E1E38]">
                        {block.title}
                      </h3>
                    </div>
                    <div className="space-y-2.5 pl-4 border-l-2 border-slate-200">
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

              {/* AÇILAN İNTERAKTİF KARAR ARACI (CASH FLOW SIMULATOR) */}
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

                  {/* Simülatör Bileşeni */}
                  <CashFlowSimulator />

                  {/* Gelecek Hafta Kartı */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Gelecek Hafta (2. Hafta)
                      </span>
                      <h5 className="text-sm font-semibold text-[#0E1E38]">
                        1.2 Tasarruf Nedir, Nasıl Yapılır? (Harcamaları Kısma Sanatı)
                      </h5>
                      <p className="text-xs text-slate-500">
                        Bu hafta tespit ettiğiniz serbest nakdi veya açığı nasıl yöneteceğinizi öğreneceğiz.
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

          {/* SAĞ KOLON: %30 DERİN LACİVERT VİTRİN (DERS ODAK MODU) */}
          <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-7">
              
              {/* Tepe Başlık */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
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

              {/* Ders Özeti Kartı */}
              <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[11px] font-semibold text-[#78B8F5] uppercase tracking-wider block">
                  1. Haftanın Ana Fikri
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  "Zenginlik, ne kadar kazandığınız değil; ay sonunda ne kadar nakdi elinizde tutabildiğinizdir."
                </p>
              </div>

              {/* Anahtar Terimler */}
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

              {/* Gelecek Hafta Bilgisi */}
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold text-[#78B8F5] uppercase tracking-wider block">
                  Sırada Ne Var?
                </span>
                <p className="text-[11px] text-white/70 leading-relaxed">
                  Haftaya bu serbest nakdi koruma ve lüzumsuz kaçakları kesme sanatını (1.2 Tasarruf) inceleyeceğiz.
                </p>
              </div>

            </div>

            {/* Alt Buton */}
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
