"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Lock, 
  ChevronRight, 
  ArrowRight, 
  Play, 
  BookOpen
} from "lucide-react";
import { UNIT_1_CONFIG, getLessonContent } from "@/data/academy/unit-1";
import { CashFlowSimulator } from "@/components/academy/CashFlowSimulator";
import { ExpenseNegotiator } from "@/components/academy/ExpenseNegotiator";
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

  // URL senkronizasyonu
  const urlTopic = searchParams.get("ders");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(urlTopic);

  const lessonContent = useMemo(() => {
    return getLessonContent(selectedTopicId || "1-1", userName);
  }, [selectedTopicId, userName]);
  
  // Uygulama ekranı açık mı durumu
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLesson1Done, setIsLesson1Done] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        setIsLesson1Done(localStorage.getItem("finai_lesson_1_completed") === "true");
      }
    } catch {}
  }, []);

  useEffect(() => {
    setSelectedTopicId(urlTopic);
    if (!urlTopic) {
      setIsSimulatorOpen(false);
    }
  }, [urlTopic]);

  const handleOpenTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setIsSimulatorOpen(false);
    router.push(`/dashboard/akademi?ders=${topicId}`, { scroll: true });
  };

  const handleBackToOverview = () => {
    setSelectedTopicId(null);
    setIsSimulatorOpen(false);
    router.push("/dashboard/akademi", { scroll: true });
  };

  return (
    <div className="min-h-screen font-clash w-full bg-white text-[#0E1E38] selection:bg-blue-100 selection:text-[#0E1E38]">
      
      {/* =========================================================================
          DURUM 1: AKADEMİ MERKEZİ & YOL HARİTASI (FULL-VIEWPORT SIĞDIRILMIŞ DÜZEN)
          ========================================================================= */}
      {selectedTopicId === null ? (
        <div className="min-h-screen flex flex-col lg:flex-row w-full">
          
          {/* SOL KOLON: %70 BEYAZ ZEMİN */}
          <section className="w-full lg:w-[70%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 min-h-screen">
            <div className="w-full space-y-8 xl:space-y-10">

              {/* Başlık */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] tracking-tight clash-title">
                  FinAi Akademi
                </h1>
              </div>

              {/* AÇIKLAMA METNİ */}
              <div className="w-full max-w-6xl">
                <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-normal">
                  Finansal piyasaları öğrenmek isteyen çoğu insan, ezberletilen teorik formüller ve sonu gelmeyen teknik terimler yüzünden başlangıçta pes eder. Biz FinAi Akademi'de teoriyi bir kenara bırakıp, doğrudan bir şirketi ve piyasayı okuma mantığına odaklanıyoruz. Buradaki amacımız, kendi tasarruflarınızı yönetirken kimsenin tüyosuna ihtiyaç duymadan, neyi neden aldığınızı bilerek rasyonel kararlar verebilmenizi sağlamaktır.
                </p>
              </div>

              {/* BU HAFTANIN ODAK WIDGET'I (Kompakt ve zarif) */}
              <div className="w-full p-5 sm:p-6 xl:p-8 bg-[#0E1E38] text-white rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-[#0E1E38]/10 border border-white/10">
                <div className="space-y-1.5 flex-1 pr-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white clash-title tracking-tight">
                    {isLesson1Done ? "Tasarruf Nedir ve Nasıl Yapılır?" : "Gelir ve Gider Yönetimi"}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed font-normal">
                    {isLesson1Done 
                      ? "Cimrilik değil, cüzdandaki görünmeyen kaçakları tespit etme ve budama bilinci." 
                      : "Finansal gücün ne kadar kazandığınla değil; ay bittiğinde masada ne bırakabildiğinle başlar."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenTopic(isLesson1Done ? "1-2" : "1-1")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 xl:px-6 xl:py-3.5 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg shrink-0 cursor-pointer group"
                >
                  <span>{isLesson1Done ? "2. Haftanın Dersine Başla" : "1. Haftanın Dersine Başla"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* BİZ NEYİ FARKLI YAPIYORUZ? */}
              <div className="w-full pt-6 border-t border-slate-200 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#0E1E38] clash-title tracking-tight">
                    Biz Neyi Farklı Yapıyoruz?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 w-full">
                  
                  {/* Kart 01 */}
                  <div className="group p-6 xl:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#004BFA]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#004BFA] text-sm font-bold flex items-center justify-center">
                          01
                        </span>
                        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 group-hover:text-[#004BFA] transition-colors">
                          Ticari Mantık
                        </span>
                      </div>
                      <h4 className="text-lg xl:text-xl font-semibold text-[#0E1E38] tracking-tight">
                        Teori Yerine Ticari Mantık
                      </h4>
                      <p className="text-sm xl:text-base text-slate-600 leading-relaxed font-normal">
                        Kitaplardaki finansal terimleri ezberletmek yerine, o kavramların şirketin kasasına ve günlük operasyonuna nasıl yansıdığını gösteriyoruz. Bir rasyoya baktığınızda bunun sadece matematiksel bir işlem değil, şirketin hayatta kalma mücadelesi olduğunu anlamanızı sağlıyoruz.
                      </p>
                    </div>
                  </div>

                  {/* Kart 02 */}
                  <div className="group p-6 xl:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#004BFA]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#004BFA] text-sm font-bold flex items-center justify-center">
                          02
                        </span>
                        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 group-hover:text-[#004BFA] transition-colors">
                          Karar Refleksi
                        </span>
                      </div>
                      <h4 className="text-lg xl:text-xl font-semibold text-[#0E1E38] tracking-tight">
                        Ezber Sınavı Yok, Karar Var
                      </h4>
                      <p className="text-sm xl:text-base text-slate-600 leading-relaxed font-normal">
                        Bölüm sonlarında klasik test soruları çözdürmüyoruz. Anlatım bittiğinde size simüle bir bütçe vererek gerçek bir karar aldırıyoruz; böylece kendi paranızı riske atmadan piyasanın mantığını aldığınız kararların sonuçlarıyla görüyorsunuz.
                      </p>
                    </div>
                  </div>

                  {/* Kart 03 */}
                  <div className="group p-6 xl:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#004BFA]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#004BFA] text-sm font-bold flex items-center justify-center">
                          03
                        </span>
                        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 group-hover:text-[#004BFA] transition-colors">
                          Bütüncül Sistem
                        </span>
                      </div>
                      <h4 className="text-lg xl:text-xl font-semibold text-[#0E1E38] tracking-tight">
                        Birbirine Bağlanan Sistem
                      </h4>
                      <p className="text-sm xl:text-base text-slate-600 leading-relaxed font-normal">
                        Burada öğrendiğiniz hiçbir konu havada kalmaz. İlk aşamada öğrendiğiniz temel nakit akışı mantığı, bir sonraki aşamada bilanço okurken ve şirket seçerken doğrudan karşınıza çıkar. Her ders bir sonrakini besler ve zamanla eksiksiz bir yatırım bakış açısı oluşturur.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Alt Bilgi */}
            <div className="w-full pt-10 mt-12 border-t border-slate-200 text-center sm:text-left text-xs sm:text-sm text-slate-400">
              © {new Date().getFullYear()} FinAi Akademi. Bilinçli yatırımcılar için sıfırdan inşa edildi.
            </div>
          </section>

          {/* SAĞ KOLON: %30 DERİN LACİVERT VİTRİN & 12 HAFTALIK İLERLEME */}
          <section className="w-full lg:w-[30%] bg-[#0E1E38] text-white p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Üst: Konu Başlıkları */}
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA] animate-pulse" />
                <span className="text-lg font-bold tracking-tight text-white clash-title">
                  Konu Başlıkları
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

              {/* 12 HAFTALIK TÜM KONULAR */}
              <div className="space-y-2 pt-2">
                {UNIT_1_CONFIG.topics.map((topic) => {
                  const isActive = topic.status === "active";
                  return (
                    <div
                      key={topic.id}
                      onClick={() => isActive && handleOpenTopic(topic.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-[#004BFA]/25 border-[#004BFA]/70 text-white cursor-pointer hover:bg-[#004BFA]/35 hover:border-[#004BFA]"
                          : "bg-white/[0.02] border-white/5 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0">
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

                        <span className={`font-semibold truncate text-xs sm:text-sm ${isActive ? "text-white" : "text-white/60"}`}>
                          {topic.shortTitle}
                        </span>
                      </div>

                      <span className={`text-[10px] shrink-0 font-medium ${isActive ? "text-[#78B8F5] font-semibold" : "text-white/30"}`}>
                        {isActive ? "Derse Başla" : topic.readTime}
                      </span>
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

        </div>
      ) : (
        /* =========================================================================
            DURUM 2: KONU VE UYGULAMA ALANI
            - Kullanıcı uygulamaya geçtiğinde öğretici notlar ve başlık kalkar,
              sadece verimli uygulama tablosu kalır.
            ========================================================================= */
        <div className={`min-h-screen w-full bg-white flex flex-col justify-between ${isSimulatorOpen ? 'p-4 sm:p-6 lg:p-8' : 'p-6 sm:p-10 lg:p-12 xl:p-16'}`}>
          
          <div className={`w-full ${isSimulatorOpen ? 'flex-1 flex flex-col space-y-6' : 'space-y-8'}`}>
            
            {/* Üst Navigasyon Çubuğu */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 w-full">
              <button
                type="button"
                onClick={handleBackToOverview}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Akademi Haritasına Dön</span>
              </button>

              {isSimulatorOpen && (
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004BFA] hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ders Anlatımını Yeniden Oku</span>
                </button>
              )}
            </div>

            {/* FAZ 1: DERS OKUMA EKRANI (Tüm Ekranı Etkin Kullanan Editoryal Düzen) */}
            {!isSimulatorOpen ? (
              <div className="w-full space-y-10 py-2">
                
                {/* Başlık Silüeti */}
                <div className="border-b border-slate-200 pb-6 w-full">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] tracking-tight clash-title">
                    {lessonContent.title}
                  </h2>
                </div>

                {/* İÇERİK ANLATIMI: Bloklu veya Akıcı Paragraflar */}
                {lessonContent.blocks && lessonContent.blocks.length > 0 ? (
                  /* 1. HAFTA: 4 Editoryal Anlatım Bloğu */
                  <div className="space-y-12 w-full">
                    {lessonContent.blocks.map((block, bIdx) => (
                      <div key={block.id} className="space-y-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#004BFA] text-xs font-bold flex items-center justify-center border border-blue-100/80 shrink-0">
                            {String(bIdx + 1).padStart(2, '0')}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-semibold text-[#0E1E38] clash-title tracking-tight">
                            {block.title}
                          </h3>
                        </div>
                        <div className="space-y-3.5 pl-4 sm:pl-5 border-l-2 border-slate-200">
                          {block.paragraphs.map((p, pIdx) => (
                            <p key={pIdx} className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed font-normal">
                              {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 2. HAFTA: Bölmesiz, Alt Başlıksız, Akıcı Editoryal Paragraflar */
                  <div className="space-y-6 sm:space-y-8 w-full text-slate-700 font-normal leading-relaxed text-base sm:text-lg lg:text-xl">
                    {lessonContent.paragraphs?.slice(0, 3).map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {/* İki Kritik Soru (Widget YOK - Doğrudan Saf Metin Akışı) */}
                    {lessonContent.bulletQuestions && lessonContent.bulletQuestions.length > 0 && (
                      <div className="space-y-4 my-6 pl-2 sm:pl-4 border-l-2 border-[#004BFA]/30 py-1">
                        {lessonContent.bulletQuestions.map((q, qIdx) => (
                          <div key={qIdx} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-[#004BFA] mt-2 sm:mt-2.5 shrink-0" />
                            <p className="text-base sm:text-lg lg:text-xl font-medium text-[#0E1E38] italic">
                              {q}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {lessonContent.paragraphs?.slice(3).map((p, pIdx) => (
                      <p key={pIdx + 3}>{p}</p>
                    ))}
                  </div>
                )}

                {/* UYGULAMAYA GEÇİŞ BUTONU */}
                <div className="pt-8 border-t border-slate-200 w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSimulatorOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#004BFA] hover:bg-[#003ad1] text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>{lessonContent.actionButtonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            ) : (
              /* FAZ 2: SAF UYGULAMA MASASI
                 (Tüm sayfa genişliğinde, dikkat dağıtmayan doğrudan karar istasyonu) */
              <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-300 w-full">
                {selectedTopicId === "1-2" ? (
                  <ExpenseNegotiator />
                ) : (
                  <CashFlowSimulator />
                )}
              </div>
            )}

          </div>

          {/* Alt Bilgi */}
          <div className="pt-8 mt-12 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>© {new Date().getFullYear()} FinAi Akademi.</span>
            <button
              type="button"
              onClick={handleBackToOverview}
              className="text-[#004BFA] hover:underline font-semibold cursor-pointer"
            >
              Yol Haritasına Geri Dön ↑
            </button>
          </div>

        </div>
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
