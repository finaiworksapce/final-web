"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";
import { FinAiLogo } from "@/components/ui/logo";
import { OnboardingProgressBar } from "@/components/onboarding/OnboardingProgressBar";
import { LiteracyStep } from "@/components/onboarding/LiteracyStep";
import { HasInvestmentsStep } from "@/components/onboarding/HasInvestmentsStep";
import { FastAssetEntryStep } from "@/components/onboarding/FastAssetEntryStep";
import { ProfilingQuestionsStep } from "@/components/onboarding/ProfilingQuestionsStep";
import { FinancialLiteracyLevel } from "@/config/onboarding-questions";
import { useToast } from "@/components/providers/ToastProvider";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function OnboardingPageClient() {
  const router = useRouter();
  const { user, isAuthenticated, completeOnboarding, refreshDashboardData } = useUser();
  const { addToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [selectedLiteracy, setSelectedLiteracy] = useState<FinancialLiteracyLevel | null>("intermediate");
  const [hasInvestments, setHasInvestments] = useState<boolean | null>(null);

  // Oturum kontrolü (Giriş yapılmamışsa login'e yönlendir)
  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  const stepsConfig = [
    { id: 1, title: "Finansal Seviye", shortTitle: "Seviye" },
    { id: 2, title: "Yatırım Durumu", shortTitle: "Durum" },
    {
      id: 3,
      title: hasInvestments === true ? "Varlık Tanımlama" : "Profil Soruları",
      shortTitle: hasInvestments === true ? "Varlıklar" : "Sorular"
    }
  ];

  // Yol A Tamamlama (Varlığı Olanlar)
  const handleFastAssetComplete = async () => {
    try {
      await completeOnboarding({
        financialLiteracyLevel: selectedLiteracy || "intermediate",
        hasExistingInvestments: true,
        onboardingAnswers: { flow: "has_assets" },
        recommendedStrategy: selectedLiteracy || "intermediate"
      });

      await refreshDashboardData();
      addToast("Portföyünüz başarıyla oluşturuldu! Panele yönlendiriliyorsunuz.", "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Onboarding tamamlama hatası:", err);
      addToast("Bir hata oluştu, lütfen tekrar deneyin.", "error");
    }
  };

  // Yol B Tamamlama (Varlığı Olmayanlar)
  const handleProfilingQuestionsComplete = async (answers: Record<string, string>, recommendedStrategy: string) => {
    try {
      await completeOnboarding({
        financialLiteracyLevel: selectedLiteracy || "beginner",
        hasExistingInvestments: false,
        onboardingAnswers: answers,
        recommendedStrategy: recommendedStrategy
      });

      await refreshDashboardData();
      addToast("Yapay zeka örnek portföyünüz hazırlandı! Panele yönlendiriliyorsunuz.", "success");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Onboarding tamamlama hatası:", err);
      addToast("Bir hata oluştu, lütfen tekrar deneyin.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#00008B] relative overflow-x-hidden flex flex-col justify-between selection:bg-blue-100">
      {/* Arka Plan Glow Efektleri */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 blur-[130px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-100/40 blur-[140px]" />
      </div>

      {/* Üst Bar (Logo ve Güvenlik Rozeti) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center">
          <FinAiLogo className="h-10 sm:h-12 w-auto" />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs text-[11px] font-bold text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Kişiselleştirilmiş Kurulum</span>
        </div>
      </header>

      {/* Ana Form Gövdesi */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Adım Göstergesi */}
        <OnboardingProgressBar currentStep={step} totalSteps={3} steps={stepsConfig} />

        {/* Adım 1: Finansal Okuryazarlık Seviyesi */}
        {step === 1 && (
          <LiteracyStep
            selectedLevel={selectedLiteracy}
            onSelect={(lvl) => setSelectedLiteracy(lvl)}
            onNext={() => setStep(2)}
          />
        )}

        {/* Adım 2: Hali Hazırda Yatırım Var mı? */}
        {step === 2 && (
          <HasInvestmentsStep
            hasInvestments={hasInvestments}
            onSelect={(hasInv) => setHasInvestments(hasInv)}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {/* Adım 3: Yol A (Varlık Tanımlama) veya Yol B (Profil Soruları) */}
        {step === 3 && (
          <>
            {hasInvestments === true ? (
              <FastAssetEntryStep
                onComplete={handleFastAssetComplete}
                onBack={() => setStep(2)}
              />
            ) : (
              <ProfilingQuestionsStep
                literacyLevel={selectedLiteracy || "beginner"}
                onComplete={handleProfilingQuestionsComplete}
                onBack={() => setStep(2)}
              />
            )}
          </>
        )}
      </main>

      {/* Alt Bilgi */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} FinAi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
