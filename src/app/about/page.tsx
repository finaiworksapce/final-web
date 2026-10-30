import type { Metadata } from "next";
import AboutPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "FinAi’nin amacı, değerleri ve kurucusu Salih Kavakcı hakkında bilgi edinin. BIST ve TEFAS yatırımlarını anlaşılır, veri odaklı analizlerle takip edin.",
  alternates: {
    canonical: "https://www.finai.net.tr/about",
  },
  openGraph: {
    title: "Hakkımızda | FinAI",
    description:
      "FinAi’nin amacı, değerleri ve kurucusu Salih Kavakcı hakkında bilgi edinin.",
    url: "https://www.finai.net.tr/about",
    siteName: "FinAI",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "FinAI logosu",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Hakkımızda | FinAI",
    description:
      "FinAi’nin amacı, değerleri ve kurucusu Salih Kavakcı hakkında bilgi edinin.",
    images: ["/icon-512.png"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
