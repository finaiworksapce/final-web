import type { Metadata } from 'next';
import Link from 'next/link';

const baseUrl = 'https://www.finai.net.tr';

const categories = [
  {
    href: '/haberler/ekonomi',
    title: 'Ekonomi Haberleri',
    description: 'Türkiye ekonomisi, para politikası ve Borsa İstanbul gündeminden güncel gelişmeler.',
  },
  {
    href: '/haberler/bilanco',
    title: 'Bilanço Takvimi ve Haberleri',
    description: 'BIST şirketlerinin finansal sonuç açıklama takvimi ve bilanço gündemi.',
  },
  {
    href: '/haberler/temettu',
    title: 'Temettü Haberleri',
    description: 'Şirketlerin temettü kararları, hisse başına ödeme tutarları ve ödeme tarihleri.',
  },
  {
    href: '/haberler/halka-arz',
    title: 'Halka Arz Haberleri',
    description: 'Yaklaşan, talep toplayan ve tamamlanan halka arzlara ilişkin takvim bilgileri.',
  },
];

export const metadata: Metadata = {
  title: 'Ekonomi, Bilanço, Temettü ve Halka Arz Haberleri',
  description: 'FinAI ile ekonomi ve Borsa İstanbul haberlerini; bilanço, temettü ve halka arz takvimlerini takip edin.',
  alternates: { canonical: `${baseUrl}/haberler` },
  openGraph: {
    title: 'FinAI Haberler | Ekonomi ve Borsa İstanbul',
    description: 'Ekonomi haberleri, şirket bilançoları, temettü kararları ve halka arz takvimi.',
    url: `${baseUrl}/haberler`,
    type: 'website',
  },
};

export default function PublicNewsIndexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'FinAI Ekonomi ve Borsa Haberleri',
    description: 'Ekonomi haberleri, bilanço, temettü ve halka arz takvimleri.',
    url: `${baseUrl}/haberler`,
    hasPart: categories.map((category) => ({
      '@type': 'WebPage',
      name: category.title,
      url: `${baseUrl}${category.href}`,
    })),
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12 text-slate-900 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <p className="text-sm font-semibold text-blue-700">FinAI Haberler</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Ekonomi ve Borsa İstanbul Haberleri</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">
        Türkiye ekonomisi ve finans piyasalarındaki gelişmeleri; şirketlerin bilanço açıklama, temettü ödeme ve halka arz süreçlerine ilişkin takvimlerle birlikte takip edin. Haberler ve takvim kayıtları kaynaklarında yayımlanan bilgilere dayanır.
      </p>
      <nav aria-label="Haber kategorileri" className="mt-9 grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300">
            <h2 className="text-lg font-semibold">{category.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
          </Link>
        ))}
      </nav>
    </main>
  );
}
