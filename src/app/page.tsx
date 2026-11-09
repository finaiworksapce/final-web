import type { Metadata } from "next";
import HomeClient from './page-client';

export const metadata: Metadata = {
  title: {
    absolute: "FinAI | Borsa İstanbul (BIST) Portföy Takibi & Analiz",
  },
  description:
    "Borsa İstanbul hisselerinizi canlı seans verileri, kâr/zarar ve maliyet analiziyle tek ekranda takip edin. FinAI ile KAP bildirimlerini yapay zekâ destekli analizlerle inceleyin.",
  alternates: {
    canonical: "https://www.finai.net.tr/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.finai.net.tr/#organization",
      name: "FinAI",
      alternateName: "FinAi",
      url: "https://www.finai.net.tr/",
      logo: "https://www.finai.net.tr/logo.png",
      description:
        "Borsa İstanbul hisselerini takip etmek ve portföy analizlerini incelemek için rasyonel finansal bilgi platformu.",
      founder: {
        "@type": "Person",
        name: "Salih Kavakcı",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.finai.net.tr/#website",
      name: "FinAI",
      alternateName: "FinAi",
      url: "https://www.finai.net.tr/",
      publisher: { "@id": "https://www.finai.net.tr/#organization" },
      inLanguage: "tr-TR",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
