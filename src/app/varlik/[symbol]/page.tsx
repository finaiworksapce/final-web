import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import StockDetailClient from './stock-detail-client';
import halkarzAboutDb from '@/data/halkarz_about_db.json';
import { sectorMapping } from '@/data/sectorMapping';
import { FinAiArchiveReader } from '@/lib/api/finai-archive-reader';
import { SEO_PUBLIC_STOCK_SYMBOLS, SEO_PUBLIC_STOCK_SYMBOL_SET } from '@/lib/seo-public-stock-symbols';

// 1 saatte bir arka planda statik HTML'i güncelle (ISR)
export const revalidate = 3600;
export const dynamicParams = true;

// Build anında en aktif BIST hisselerini önceden statik olarak üret
export async function generateStaticParams() {
  return SEO_PUBLIC_STOCK_SYMBOLS.slice(0, 100).map((symbol) => ({
    symbol,
  }));
}

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
  "TKFEN": "Tekfen Holding A.Ş.",
  "ALTIN": "Gram Altın (24 Ayar Spot TL)",
  "GA": "Gram Altın (24 Ayar Spot TL)",
  "GRAM-ALTIN": "Gram Altın (24 Ayar Spot TL)",
  "ALTIN.S1": "Darphane Altın Sertifikası (BIST)",
  "GUMUS": "Gram Gümüş (Spot TL)",
  "ONS": "Ons Altın (XAU/USD)",
  "GLDTR": "QNB Finans Portföy Altın Borsa Yatırım Fonu",
  "ZGOLD": "Ziraat Portföy Altın Katılım Borsa Yatırım Fonu",
  "USDTRY": "Amerikan Doları / Türk Lirası (USD/TRY)",
  "EURTRY": "Euro / Türk Lirası (EUR/TRY)",
  "BTC": "Bitcoin (BTC/TRY)",
  "ETH": "Ethereum (ETH/TRY)"
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

  const cleanCompanyName = fullName !== symbol
    ? fullName.replace(/\s+(A\.Ş\.|A\.O\.|T\.A\.Ş\.|A\.S\.|Anonim Şirketi|Ortaklığı).*$/i, '').trim()
    : '';
  const title = cleanCompanyName
    ? `${cleanCompanyName} (${symbol}) Hisse Fiyatı, Grafik ve Bilanço Analizi`
    : `${symbol} Hisse Fiyatı, Grafik ve Bilanço Analizi`;
  const socialTitle = `${title} | FinAi`;
  const subject = fullName === symbol ? `${symbol} hissesi` : `${fullName} (${symbol})`;
  const description = `${subject} 2026 güncel hisse fiyatı, canlı grafik, son çeyrek bilanço ve rasyo analizleri (F/K, PD/DD), teknik göstergeler ve yapay zeka piyasa değerlendirmeleri FinAi'da. Detaylı analiz için tıklayın.`;

  return {
    title: `${title} | FinAi`,
    description,
    openGraph: {
      title: socialTitle,
      description,
      url: `https://www.finai.net.tr/varlik/${symbol}`,
      siteName: 'FinAi',
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: `${subject} FinAi logosu`,
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

  const sector = (sectorMapping as Record<string, string>)[symbol] || "Borsa İstanbul";
  const peers = Object.keys(sectorMapping)
    .filter((s) => s !== symbol && sectorMapping[s] === sector)
    .slice(0, 8);

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
      {
        "@type": "BreadcrumbList",
        "@id": `https://www.finai.net.tr/varlik/${symbol}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://www.finai.net.tr"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Varlıklar",
            "item": "https://www.finai.net.tr/varlik"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": symbol,
            "item": `https://www.finai.net.tr/varlik/${symbol}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.finai.net.tr/varlik/${symbol}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": `${fullName} (${symbol}) hangi sektörde faaliyet gösterir ve ne iş yapar?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${fullName}, Borsa İstanbul'da ${sector} sektöründe faaliyet göstermektedir. ${about ? about.slice(0, 260) : `${symbol} kodu ile işlem gören şirket hakkında detaylı kurumsal bilgiler ve bilanço raporları FinAi'da yer almaktadır.`}`
            }
          },
          {
            "@type": "Question",
            "name": `${symbol} güncel bilanço ve finansal sonuçlarına nereden bakılır?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${fullName} (${symbol}) hissesinin son çeyrek bilançosu, gelir tablosu, net kâr marjı, F/K ve PD/DD değerleme çarpanları FinAi varlık sayfasından canlı olarak takip edilebilir.`
            }
          },
          {
            "@type": "Question",
            "name": `${symbol} hisse fiyatı ve teknik grafiği nasıl incelenir?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${symbol} hissesinin anlık seans fiyatları, teknik osilatörler, destek-direnç noktaları ve yapay zeka analizleri FinAi üzerinde güncel olarak sunulmaktadır.`
            }
          }
        ]
      }
    ]
  } : null;

  const pageTitle = fullName !== symbol
    ? `${fullName} (${symbol}) Hisse Fiyatı, Bilanço ve Canlı Grafik Analizi`
    : `${symbol} Hisse Fiyatı, Bilanço ve Canlı Grafik Analizi`;
  const pageDescription = about
    ? `${about.slice(0, 240)}... ${symbol} güncel hisse fiyatı, bilanço verileri, gelir tablosu, net kâr ve teknik analiz grafikleri FinAi'da.`
    : `${fullName} (${symbol}) güncel hisse senedi fiyatı, bilanço verileri, gelir tablosu, net kâr marjı, F/K, PD/DD rasyoları, teknik analiz grafikleri ve yapay zeka destekli piyasa değerlendirmesi FinAi'da.`;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {/* Arama Motorları (Googlebot, Bingbot) için SSR Semantik Başlık, SSS ve Çapraz Linkleme Katmanı */}
      <header className="sr-only">
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
        <section aria-label="Finansal Sıkça Sorulan Sorular">
          <h2>{fullName} ({symbol}) Bilanço ve Hisse Sıkça Sorulan Sorular</h2>
          <dl>
            <dt>{fullName} ({symbol}) hangi sektörde faaliyet gösterir?</dt>
            <dd>{fullName}, Borsa İstanbul'da {sector} sektöründe işlem görmektedir.</dd>
            <dt>{symbol} bilanço ve mali tablolarına nasıl ulaşılır?</dt>
            <dd>FinAi üzerinden {symbol} çeyreklik bilançosu, gelir tablosu, F/K ve PD/DD rasyolarına ulaşabilirsiniz.</dd>
          </dl>
        </section>
        {peers.length > 0 && (
          <section aria-label="Sektör Hisseleri Çapraz Linkleme">
            <h2>{sector} Sektöründeki Diğer Hisseler</h2>
            <ul>
              {peers.map((peer) => (
                <li key={peer}>
                  <a href={`https://www.finai.net.tr/varlik/${peer}`}>
                    {peer} Hisse Fiyatı ve Bilanço Analizi
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <nav aria-label="Sayfa Haritası">
          <ol>
            <li><a href="https://www.finai.net.tr">Ana Sayfa</a></li>
            <li><a href="https://www.finai.net.tr/varlik">Borsa İstanbul Varlıklar</a></li>
            <li><span>{symbol} Bilanço ve Hisse Analizi</span></li>
          </ol>
        </nav>
      </header>
      <StockDetailClient symbol={symbol} />
    </>
  );
}
