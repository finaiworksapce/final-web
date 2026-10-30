import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import StockDetailClient from './stock-detail-client';
import halkarzAboutDb from '@/data/halkarz_about_db.json';
import { FinAiArchiveReader } from '@/lib/api/finai-archive-reader';
import { SEO_PUBLIC_STOCK_SYMBOL_SET } from '@/lib/seo-public-stock-symbols';

// BIST Şirket Adları Kataloğu
const STOCK_NAMES: Record<string, string> = {
  "ASELS": "Aselsan Elektronik San. ve Tic. A.Ş.",
  "THYAO": "Türk Hava Yolları A.O.",
  "EREGL": "Ereğli Demir ve Çelik Fabrikaları T.A.Ş.",
  "TUPRS": "Tüpraş Türkiye Petrol Rafinerileri A.Ş.",
  "KCHOL": "Koç Holding A.Ş.",
  "SAHOL": "Hacı Ömer Sabancı Holding A.Ş.",
  "GARAN": "Türkiye Garanti Bankası A.Ş.",
  "AKBNK": "Akbank T.A.Ş.",
  "ISCTR": "Türkiye İş Bankası A.Ş.",
  "YKBNK": "Yapı ve Kredi Bankası A.Ş.",
  "BIMAS": "BİM Birleşik Mağazalar A.Ş.",
  "MGROS": "Migros Ticaret A.Ş.",
  "SOKM": "Şok Marketler Ticaret A.Ş.",
  "SISE": "Türkiye Şişe ve Cam Fabrikaları A.Ş.",
  "FROTO": "Ford Otomotiv Sanayi A.Ş.",
  "TOASO": "Tofaş Türk Otomobil Fabrikası A.Ş.",
  "TTRAK": "Türk Traktör ve Ziraat Makineleri A.Ş.",
  "TCELL": "Turkcell İletişim Hizmetleri A.Ş.",
  "TTKOM": "Türk Telekomünikasyon A.Ş.",
  "SASA": "Sasa Polyester Sanayi A.Ş.",
  "HEKTS": "Hektaş Ticaret T.A.Ş.",
  "ASTOR": "Astor Enerji A.Ş.",
  "MIATK": "Mia Teknoloji A.Ş.",
  "PGSUS": "Pegasus Hava Taşımacılığı A.Ş.",
  "BIGEN": "Birleşim Grup Enerji Yatırımları A.Ş.",
  "TKFEN": "Tekfen Holding A.Ş."
};

interface PageProps {
  params: Promise<{ symbol: string }>;
}

const getCompanyProfile = cache(async (symbol: string) => {
  try {
    return await FinAiArchiveReader.getProfile(symbol);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSymbol = resolvedParams.symbol || 'ASELS';
  const symbol = rawSymbol.toUpperCase().replace('.IS', '').trim();
  const profile = await getCompanyProfile(symbol);
  const isKnownStock = SEO_PUBLIC_STOCK_SYMBOL_SET.has(symbol) || Boolean(profile?.companyName && (profile.businessSummary || profile.sector));
  const fullName = profile?.companyName || STOCK_NAMES[symbol] || symbol;

  const title = `${symbol} Hisse Senedi Fiyatı, Grafik ve Analiz`;
  const socialTitle = `${title} | FinAI`;
  const subject = fullName === symbol ? `${symbol} hissesi` : `${fullName} (${symbol})`;
  const description = `${subject} için hisse fiyatı, grafik ve finansal veriler; mevcutsa temettü ve KAP/haber akışı. Veri güncelliği kaynağa bağlıdır.`;

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: `https://www.finai.net.tr/varlik/${symbol}`,
      siteName: 'FinAI',
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: 'FinAI logosu',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
    },
    alternates: {
      canonical: `https://www.finai.net.tr/varlik/${symbol}`,
    },
    ...(!isKnownStock ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const rawSymbol = resolvedParams.symbol || 'ASELS';
  const symbol = rawSymbol.toUpperCase().replace('.IS', '').trim();
  if (rawSymbol !== symbol) permanentRedirect(`/varlik/${symbol}`);
  const profile = await getCompanyProfile(symbol);
  const fullName = profile?.companyName || STOCK_NAMES[symbol] || symbol;
  const about = profile?.businessSummary || (halkarzAboutDb as Record<string, string>)[symbol] || null;
  const hasCompanyIdentity = Boolean(profile?.companyName || STOCK_NAMES[symbol] || about);

  // Google JSON-LD Yapılandırılmış Veri (Schema.org)
  const jsonLd = hasCompanyIdentity ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Corporation",
        "@id": `https://www.finai.net.tr/varlik/${symbol}#corporation`,
        "name": fullName,
        "tickerSymbol": `BIST:${symbol}`,
        ...(about ? { "description": about.slice(0, 300) } : {}),
        "url": `https://www.finai.net.tr/varlik/${symbol}`
      },
    ]
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <StockDetailClient symbol={symbol} />
    </>
  );
}
