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
    strategic_goal: "dividend_yield",
    interest_sensitivity: "conventional"
  });

  // Ekran Durumları
  const [isAssetTerminalOpen, setIsAssetTerminalOpen] = useState(false);
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

  // Klavye Kısayolları (Arka planda çalışmaya devam eder)
  useEffect(() => {
    if (isAssetTerminalOpen) return;

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
    isQuestionPhase,
    currentQuestion,
    handleSelectOption,
    handleNext,
    handleBack
  ]);

  // Örnek Model ile Onboarding Tamamlama (Doğrudan yönlendirme - Yükleme kutusu kaldırıldı)
  const handleFinishWithSampleModel = async () => {
    try {
      const literacy = (answers["literacy_level"] as FinancialLiteracyLevel) || "intermediate";

      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: false,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });

      await refreshDashboardData();
      addToast("Portföyünüz başarıyla kalibre edildi! Panele yönlendiriliyorsunuz.", "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Onboarding tamamlama hatası:", err);
      addToast("Bir hata oluştu, lütfen tekrar deneyin.", "error");
    }
  };

  // Varlık Konsolu ile Onboarding Tamamlama
  const handleFinishWithCustomAssets = async () => {
    try {
      const literacy = (answers["literacy_level"] as FinancialLiteracyLevel) || "intermediate";

      await completeOnboarding({
        financialLiteracyLevel: literacy,
        hasExistingInvestments: true,
        onboardingAnswers: answers,
        recommendedStrategy: currentTelemetry.id
      });

      await refreshDashboardData();
      addToast("Portföy varlıklarınız kaydedildi! Panele yönlendiriliyorsunuz.", "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Varlık konsolu tamamlama hatası:", err);
      addToast("Kayıt sırasında bir hata oluştu.", "error");
    }
  };

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
      {/* ÜST KOMUTA ÇUBUĞU (Header Bar - Ortalı & Uzatılmış İlerleme Çubuğu) */}
      <header className="h-16 sm:h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-5 sm:px-8 lg:px-10 flex items-center justify-between shrink-0 z-30 relative">
        {/* Sol: Logo */}
        <div className="flex items-center gap-3">
          <FinAiLogo className="h-7 sm:h-9 w-auto" />
          <span className="hidden sm:inline-block w-px h-5 bg-slate-200" />
          <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Hesap Kurulum & Strateji Kalibrasyonu
          </span>
        </div>

        {/* ORTALANMIŞ VE UZATILMIŞ İLERLEME ÇUBUĞU (Masaüstü & Tablet) */}
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-mono font-semibold text-slate-700 shadow-2xs">
            <span className="text-[#004BFA] font-bold">
              0{Math.min(currentStepIndex + 1, totalQuestions + 1)}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">0{totalQuestions + 1}</span>
          </div>

          <div className="w-52 sm:w-64 md:w-80 lg:w-96 h-2 bg-slate-200/90 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#004BFA] to-[#5B80FF] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {/* Sağ: Sadece Mobilde Görünüm */}
        <div className="flex items-center">
          {/* Mobilde ilerleme */}
          <div className="sm:hidden flex items-center gap-2 mr-2">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-mono font-semibold text-slate-700">
              <span className="text-[#004BFA] font-bold">0{Math.min(currentStepIndex + 1, totalQuestions + 1)}</span>
              <span>/</span>
              <span>0{totalQuestions + 1}</span>
            </div>
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#004BFA] rounded-full transition-all duration-300"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileTelemetryOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#02041A] text-slate-200 text-xs font-mono font-bold border border-blue-900/40"
          >
            <PieChart className="w-3.5 h-3.5 text-[#004BFA]" />
            <span>Canlı Model</span>
          </button>
        </div>
      </header>

      {/* ANA GÖVDE: ÇİFT KOLONLU PANORAMİK ÇALIŞMA ALANI */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* SOL PANEL: Etkileşimli Soru ve Karar Motoru (%55) */}
        <section className="flex-1 lg:max-w-[55%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
          {isQuestionPhase && currentQuestion ? (
            <div className="space-y-8 my-auto max-w-2xl">
              {/* Soru Başlık Alanı */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#004BFA]">
                  {currentQuestion.category}
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-clash leading-tight pt-1">
                  {currentQuestion.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed pt-1">
                  {currentQuestion.contextExplanation}
                </p>
              </div>

              {/* Seçenekler Listesi (Temiz, Estetik ve Rozetsiz Profesyonel Kartlar) */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentSelectedOptionId === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer flex items-center justify-between text-left group ${
                        isSelected
                          ? "bg-white border-[#004BFA] shadow-sm shadow-[#004BFA]/10 ring-2 ring-blue-50"
                          : "bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Metin İçeriği */}
                      <div className="space-y-1 pr-4">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-clash">
                          {option.title}
                        </h2>

                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                          {option.description}
                        </p>
                      </div>

                      {/* Sağ Seçim Göstergesi */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? "bg-[#004BFA] border-[#004BFA] text-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
                <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-[#004BFA]">
                  Son Adım
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 font-clash leading-tight pt-1">
                  FinAi&apos;yi Nasıl Kullanmak İstersiniz?
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed pt-1">
                  Mevcut portföyünüzü hemen ekleyebilir ya da kalibre ettiğimiz hazır model portföy ile doğrudan başlayabilirsiniz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 1. SEÇENEK: MEVCUT PORTFÖYÜM VAR */}
                <div
                  onClick={() => setIsAssetTerminalOpen(true)}
                  className="rounded-2xl p-6 border-2 border-slate-200/80 bg-white hover:border-[#004BFA] hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 font-clash">
                      Mevcut Varlıklarımı Ekleyeceğim
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Elimdeki hisse, fon veya nakit birikimimi hızlı konsoldan sisteme girmek istiyorum.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs font-mono font-semibold text-[#004BFA] group-hover:translate-x-1 transition-transform">
                    <span>Konsolu Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* 2. SEÇENEK: MODEL PORTFÖY BAŞLAT */}
                <div
                  onClick={handleFinishWithSampleModel}
                  className="rounded-2xl p-6 border-2 border-[#004BFA] bg-white shadow-sm shadow-[#004BFA]/10 ring-2 ring-blue-50 transition-all cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 font-clash">
                      Model Portföy ile Başla
                    </h2>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Sağ panelde kalibre edilen örnek varlık dağılımıyla paneli anında oluştur.
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-2 text-xs font-mono font-semibold text-[#004BFA] group-hover:translate-x-1 transition-transform">
                    <span>Paneli Başlat</span>
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
              <span>Geri</span>
            </button>

            {isQuestionPhase ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-6 py-2.5 rounded-xl bg-[#004BFA] hover:bg-blue-600 text-white shadow-sm shadow-[#004BFA]/20 transition-all cursor-pointer"
              >
                <span>İlerle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </section>

        {/* SAĞ PANEL: Canlı Telemetri & Strateji Matrisi (%45 - Masaüstü) */}
        <section className="hidden lg:block lg:w-[45%] h-full">
          <FullScreenLiveTelemetry
            telemetry={currentTelemetry}
            currentStep={currentStepIndex + 1}
            totalSteps={totalQuestions + 1}
          />
        </section>
      </main>

      {/* MOBİL TELEMETRİ MODAL (Küçük Ekranlar İçin) */}
      {isMobileTelemetryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#02041A] animate-fadeIn">
          <div className="p-4 border-b border-blue-950 flex items-center justify-between bg-[#04082C] text-white">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D6E4FF]">
              Canlı Strateji Kalibratörü
            </span>
            <button
              type="button"
              onClick={() => setIsMobileTelemetryOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
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
