"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  shortTitle: string;
}

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export function OnboardingProgressBar({ currentStep, totalSteps, steps }: OnboardingProgressBarProps) {
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-12">
      {/* Üst İlerleme Çubuğu */}
      <div className="relative mb-6">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Adım Daireleri ve Başlıklar */}
      <div className="flex items-center justify-between relative">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                  isCompleted
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : isCurrent
                    ? "bg-[#00008B] text-white ring-4 ring-blue-100 shadow-indigo-500/20 scale-105"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : step.id}
              </div>

              <span
                className={`mt-2 text-[11px] sm:text-xs font-semibold tracking-tight text-center transition-colors ${
                  isCurrent
                    ? "text-[#00008B] font-bold"
                    : isCompleted
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.shortTitle}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
