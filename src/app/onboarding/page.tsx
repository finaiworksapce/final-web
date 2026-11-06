import type { Metadata } from "next";
import OnboardingPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Hesap Kurulumu | FinAi",
  description: "Finansal okuryazarlık seviyenizi belirleyin ve size özel yapay zeka portföyünüzü oluşturun.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingPage() {
  return <OnboardingPageClient />;
}
