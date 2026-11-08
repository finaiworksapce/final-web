"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";
import { FinAiLogo } from "@/components/ui/logo";
import { useToast } from "@/components/providers/ToastProvider";
import {
  WIZARD_QUESTIONS,
  calculateDynamicStrategy,
  FinancialLiteracyLevel
} from "@/config/onboarding-questions";
import { FullScreenLiveTelemetry } from "@/components/onboarding/FullScreenLiveTelemetry";
import { FullScreenAssetTerminal } from "@/components/onboarding/FullScreenAssetTerminal";
import { OnboardingBootingScreen } from "@/components/onboarding/OnboardingBootingScreen";
import { ArrowLeft, ArrowRight, Check, X, PieChart, CornerDownLeft } from "lucide-react";

export default function OnboardingPageClient() {
  const router = useRouter();
  const { isAuthenticated, completeOnboarding, refreshDashboardData } = useUser();
  const { addToast } = useToast();

  // Aktif Soru Adımı (0-3: Sorular, 4: Başlangıç Modu)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Verilen Cevaplar Map'i
  const [answers, setAnswers] = useState<Record<string, string>>({
    literacy_level: "intermediate",
    investment_horizon: "medium",
    volatility_reaction: "balanced",
    strategic_goal: "dividend_yield"
  });

  // Ekran Durumları
  const [isAssetTerminalOpen, setIsAssetTerminalOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isMobileTelemetryOpen, setIsMobileTelemetryOpen] = useState(false);

  // Oturum kontrolü
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Dinamik Strateji Telemetrisi (Anlık hesaplanır)
  const currentTelemetry = calculateDynamicStrategy(answers);

  const totalQuestions = WIZARD_QUESTIONS.length;
  const isQuestionPhase = currentStepIndex < totalQuestions;
  const currentQuestion = isQuestionPhase ? WIZARD_QUESTIONS[currentStepIndex] : null;

  // Seçenek belirleme
  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  }, [currentQuestion]);

  // İleri Adım
  const handleNext = useCallback(() => {
    if (currentStepIndex < totalQuestions) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, totalQuestions]);

  // Geri Adım
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Klavye Kısayolları (1, 2, 3, Enter, Escape)
  useEffect(() => {
    if (isAssetTerminalOpen || isBooting) return;

    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (isQuestionPhase && currentQuestion) {
        if (e.key === "1" && currentQuestion.options[0]) {
          handleSelectOption(currentQuestion.options[0].id);
        } else if (e.key === "2" && currentQuestion.options[1]) {
          handleSelectOption(currentQuestion.options[1].id);
        } else if (e.key === "3" && currentQuestion.options[2]) {
          handleSelectOption(currentQuestion.options[2].id);
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleNext();
        } else if (e.key === "Escape" || e.key === "Backspace") {
          handleBack();
        }
      } else if (!isQuestionPhase) {
        if (e.key === "1") {
          setIsAssetTerminalOpen(true);
        } else if (e.key === "2" || e.key === "Enter") {
          handleFinishWithSampleModel();
        } else if (e.key === "Escape") {
          handleBack();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isAssetTerminalOpen,
    isBooting,
    isQuestionPhase,
    currentQuestion,
    handleSelectOption,
    handleNext,
    handleBack
  ]);

  // Örnek Model ile Onboarding Tamamlama
  const handleFinishWithSampleModel = async () => {
    setIsBooting(true);
    try {
      const literacy = (answers["literacy_level"] as FinancialLiteracyLevel) || "intermediate";

      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: false,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });

      await refreshDashboardData();
      addToast("Portföyünüz başarıyla kalibre edildi! FinAi Terminali açılıyor.", "success");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 1600);
    } catch (err) {
      console.error("Onboarding tamamlama hatası:", err);
      setIsBooting(false);
      addToast("Bir hata oluştu, lütfen tekrar deneyin.", "error");
    }
  };

  // Varlık Konsolu ile Onboarding Tamamlama
  const handleFinishWithCustomAssets = async () => {
    setIsBooting(true);
    try {
      const literacy = (answers["literacy_level"] as FinancialLiteracyLevel) || "intermediate";

      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: true,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });

      await refreshDashboardData();
      addToast("Portföy varlıklarınız kaydedildi! FinAi Terminali açılıyor.", "success");

      setTimeout(() => {
        router.replace("/dashboard");
      }, 1400);
    } catch (err) {
      console.error("Varlık konsolu tamamlama hatası:", err);
      setIsBooting(false);
      addToast("Kayıt sırasında bir hata oluştu.", "error");
    }
  };

  // Terminal Başlatma Ekranı
  if (isBooting) {
    return <OnboardingBootingScreen modelTitle={currentTelemetry.title} />;
  }

  // Tam Ekran Hızlı Varlık Konsolu
  if (isAssetTerminalOpen) {
    return (
      <div className="w-screen h-screen h-[100dvh] overflow-hidden">
        <FullScreenAssetTerminal
          onComplete={handleFinishWithCustomAssets}
          onBack={() => setIsAssetTerminalOpen(false)}
        />
      </div>
    );
  }

  const currentSelectedOptionId = currentQuestion ? answers[currentQuestion.id] : null;
  const progressRatio = ((currentStepIndex + 1) / (totalQuestions + 1)) * 100;

  return (
    <div className="w-screen h-screen h-[100dvh] bg-[#F5F7FA] text-[#040989] flex flex-col justify-between overflow-hidden select-none">
      {/* ÜST KOMUTA ÇUBUĞU (Header Bar) */}
      <header className="h-16 sm:h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 lg:px-10 flex items-center justify-between shrink-0 z-30">
        {/* Sol: Logo */}
        <div className="flex items-center gap-3">
          <FinAiLogo className="h-7 sm:h-9 w-auto" />
          <span className="hidden sm:inline-block w-px h-5 bg-slate-200" />
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Hesap Kurulum & Strateji Kalibrasyonu
          </span>
        </div>

        {/* Orta: Adım Rozeti & İnce İlerleme İzi */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-mono font-semibold text-slate-700">
            <span className="text-blue-700 font-bold">
              0{Math.min(currentStepIndex + 1, totalQuestions + 1)}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">0{totalQuestions + 1}</span>
          </div>

          <div className="w-20 sm:w-36 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {/* Sağ: Mobil Telemetri Açma Butonu ve Masaüstü Kısayolları */}
        <div className="flex items-center gap-2">
          {/* Mobil Telemetri Butonu (Sadece küçük ekranlarda görünür) */}
          <button
            type="button"
            onClick={() => setIsMobileTelemetryOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#03071E] text-slate-200 text-xs font-mono font-bold border border-slate-800"
          >
            <PieChart className="w-3.5 h-3.5 text-blue-400" />
            <span>Canlı Model</span>
          </button>

          {/* Masaüstü Tuş Göstergeleri */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600 text-[11px] font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold shadow-2xs">1</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold shadow-2xs">2</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold shadow-2xs">3</kbd>
            <span className="text-slate-400 text-[10px] ml-1">Seçim</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-slate-600 text-[11px] font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold shadow-2xs">↵</kbd>
            <span className="text-slate-400 text-[10px]">İlerle</span>
          </div>
        </div>
      </header>

      {/* ANA GÖVDE: ÇİFT KOLONLU PANORAMİK ÇALIŞMA ALANI */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* SOL PANEL: Etkileşimli Soru ve Karar Motoru (%56) */}
        <section className="flex-1 lg:max-w-[56%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
          {isQuestionPhase && currentQuestion ? (
            <div className="space-y-8 my-auto max-w-2xl">
              {/* Kategori Etiketi */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-md">
                  {currentQuestion.category}
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-clash leading-tight pt-1">
                  {currentQuestion.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed pt-1">
                  {currentQuestion.contextExplanation}
                </p>
              </div>

              {/* Seçenekler Listesi (Büyük Dokunmatik & Klavye Kartları) */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentSelectedOptionId === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 text-left group ${
                        isSelected
                          ? "bg-white border-[#004BFA] shadow-md shadow-blue-600/10 ring-2 ring-blue-100"
                          : "bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Numara Tuşu Rozeti [1], [2], [3] */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#004BFA] text-white shadow-sm"
                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
                        }`}
                      >
                        {isSelected ? <Check className="w-5 h-5 stroke-[2.5]" /> : option.keyNumber}
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-clash">
                            {option.title}
                          </h2>
                          {option.badge && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {option.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                          {option.description}
                        </p>

                        <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-blue-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{option.impactLabel}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ADIM 5: BAŞLANGIÇ YOLU SEÇİMİ (Varlık Girişi veya Model Portföy) */
            <div className="space-y-8 my-auto max-w-2xl">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-md">
                  Son Adım · Başlangıç Modeli
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-clash leading-tight pt-1">
                  FinAi&apos;yi Nasıl Kullanmak İstersiniz?
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed pt-1">
                  Mevcut hisse veya fon varlıklarınızı hemen portföyünüze ekleyebilir ya da kalibre ettiğimiz hazır yapay zeka model portföyü ile doğrudan başlayabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 1. SEÇENEK: MEVCUT PORTFÖYÜM VAR */}
                <div
                  onClick={() => setIsAssetTerminalOpen(true)}
                  className="rounded-2xl p-6 border-2 border-slate-200/80 bg-white hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono font-bold text-sm">
                        1
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Varlıklarım Var
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 font-clash">
                      Mevcut Varlıklarımı Ekleyeceğim
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Elimdeki BIST hisselerini, TEFAS fonlarını veya altın/nakit bakiyemi tam ekran hızlı konsoldan tek seferde girmek istiyorum.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Hızlı Konsolu Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. SEÇENEK: MODEL PORTFÖY BAŞLAT */}
                <div
                  onClick={handleFinishWithSampleModel}
                  className="rounded-2xl p-6 border-2 border-blue-600 bg-white shadow-md shadow-blue-600/10 ring-2 ring-blue-50 transition-all cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                        2
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Önerilen Hızlı Başlangıç
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 font-clash">
                      Yapay Zeka Portföyüyle Başla
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Sağ panelde kalibre edilen örnek varlık dağılımıyla paneli anında oluştur. Daha sonra dilediğin gibi özelleştir.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span>Paneli Doğrudan Başlat</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALT GEZİNME DOCK'U (Bottom Bar) */}
          <div className="pt-8 border-t border-slate-200/80 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className={`inline-flex items-center gap-2 text-xs font-mono font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                currentStepIndex === 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri (Esc)</span>
            </button>

            {isQuestionPhase ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span>İlerle (↵)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </section>

        {/* SAĞ PANEL: Canlı Telemetri & Strateji Matrisi (%44 - Masaüstü) */}
        <section className="hidden lg:block lg:w-[44%] h-full">
          <FullScreenLiveTelemetry
            telemetry={currentTelemetry}
            currentStep={currentStepIndex + 1}
            totalSteps={totalQuestions + 1}
          />
        </section>
      </main>

      {/* MOBİL TELEMETRİ MODAL / SLIDEOVER (Küçük Ekranlar İçin) */}
      {isMobileTelemetryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#03071E] animate-fadeIn">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 text-white">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Canlı Strateji Kalibratörü
            </span>
            <button
              type="button"
              onClick={() => setIsMobileTelemetryOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <FullScreenLiveTelemetry
              telemetry={currentTelemetry}
              currentStep={currentStepIndex + 1}
              totalSteps={totalQuestions + 1}
            />
          </div>
        </div>
      )}
    </div>
  );
}
