"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import { ONBOARDING_QUESTIONS, STRATEGY_PROFILES, StrategyProfile } from "@/config/onboarding-questions";

interface ProfilingQuestionsStepProps {
  onComplete: (answers: Record<string, string>, recommendedStrategy: string) => Promise<void>;
  onBack: () => void;
  literacyLevel: string;
}

export function ProfilingQuestionsStep({ onComplete, onBack, literacyLevel }: ProfilingQuestionsStepProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === ONBOARDING_QUESTIONS.length - 1;
  const currentAnswer = answers[currentQuestion.id];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = async () => {
    if (!currentAnswer) return;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Sorular tamamlandı, strateji belirle
      setIsFinishing(true);

      // Strateji tahmini: Okuryazarlık seviyesi ve risk yanıtına göre belirle
      let chosenStrategy = literacyLevel || "beginner";
      if (answers["risk_reaction"] === "panic" || answers["primary_goal"] === "capital_preservation") {
        chosenStrategy = "beginner";
      } else if (answers["risk_reaction"] === "buy_more" && answers["primary_goal"] === "aggressive_growth") {
        chosenStrategy = "advanced";
      } else {
        chosenStrategy = "intermediate";
      }

      try {
        await onComplete(answers, chosenStrategy);
      } catch (err) {
        console.error("Tamamlama hatası:", err);
        setIsFinishing(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  if (isFinishing) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-16 space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 mx-auto flex items-center justify-center text-blue-600 shadow-xl shadow-blue-500/10 relative">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Yapay Zeka Stratejiniz Hazırlanıyor...
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Verdiğiniz yanıtlara göre size özel örnek portföy dağılımı oluşturuluyor. Paneliniz açılıyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fadeIn">
      {/* Soru Sayaç Rozeti */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Soru {currentQuestionIndex + 1} / {ONBOARDING_QUESTIONS.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
          {currentQuestion.title}
        </h2>
        {currentQuestion.subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
            {currentQuestion.subtitle}
          </p>
        )}
      </div>

      {/* Şıklar */}
      <div className="space-y-3.5">
        {currentQuestion.options.map((option) => {
          const isSelected = currentAnswer === option.id;

          return (
            <div
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={`p-5 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between text-left group ${
                isSelected
                  ? "bg-white border-[#00008B] shadow-lg shadow-blue-900/10 ring-4 ring-blue-50 scale-[1.01]"
                  : "bg-white/80 border-slate-200/80 hover:border-blue-300 hover:bg-white"
              }`}
            >
              <div className="space-y-1 pr-4">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {option.label}
                </h4>
                {option.description && (
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "border-[#00008B] bg-[#00008B] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasyon Butonları */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={handlePreviousQuestion}
          className="px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!currentAnswer}
          className="px-8 py-3.5 rounded-2xl bg-[#00008B] text-white font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 group active:scale-98"
        >
          <span>{isLastQuestion ? "Tamamla ve Panele Git" : "Sonraki Soru"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
