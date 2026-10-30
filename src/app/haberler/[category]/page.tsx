import type { Metadata } from 'next';
import Link from 'next/link';
import { GET as getNews } from '@/app/api/news/route';
import { GET as getEarnings } from '@/app/api/halkarz-earnings/route';
import { GET as getDividends } from '@/app/api/halkarz-dividends/route';
import { GET as getIpos } from '@/app/api/halkarz-ipo/route';

const baseUrl = 'https://www.finai.net.tr';

const pages = {
  ekonomi: {
    title: 'Ekonomi Haberleri ve Borsa Gündemi',
    heading: 'Ekonomi Haberleri',
    description: 'Türkiye ekonomisi, para politikası ve Borsa İstanbul gündemindeki güncel gelişmeler. FinAI ekonomi haberleri akışında haber başlıklarını ve kaynaklarını takip edin.',
    type: 'news',
  },
  bilanco: {
    title: 'Bilanço Takvimi ve Şirket Finansal Sonuçları',
    heading: 'Bilanço Takvimi ve Haberleri',
    description: 'Borsa İstanbul şirketlerinin bilanço açıklama tarihlerini ve finansal sonuç gündemini takip edin. Tarihler ve şirket bilgileri kaynakta yayımlandığı şekildedir.',
    type: 'earnings',
  },
  temettu: {
    title: 'Temettü Takvimi ve Temettü Haberleri',
    heading: 'Temettü Takvimi ve Haberleri',
    description: 'BIST şirketlerinin temettü kararları, hisse başına açıklanan net ödeme tutarları, temettü verimi ve ödeme tarihleri.',
    type: 'dividends',
  },
  'halka-arz': {
    title: 'Halka Arz Takvimi ve Güncel Halka Arz Haberleri',
    heading: 'Halka Arz Takvimi ve Haberleri',
    description: 'Yaklaşan halka arzlar, talep toplama tarihleri ve tamamlanan halka arzlar için güncel takvim bilgileri.',
    type: 'ipos',
  },
} as const;

type NewsItem = {
  id: string; title: string; description?: string; link: string; source: string; pubDate: string;
};
type CalendarItem = {
  symbol: string; companyName: string; link?: string; earningsDate?: string; paymentDate?: string;
  netAmountFormatted?: string; yieldPercent?: number; status?: string; dateRange?: string;
  startDate?: string | null; endDate?: string | null; phase?: string | null;
};
type Category = keyof typeof pages;

function isCategory(value: string): value is Category {
  return Object.prototype.hasOwnProperty.call(pages, value);
}

export const revalidate = 1800;

export function generateStaticParams() {
  return Object.keys(pages).map((category) => ({ category }));
}

async function getCategoryItems(category: Category): Promise<NewsItem[] | CalendarItem[]> {
  try {
    if (category === 'ekonomi') {
      const [macroResponse, bistResponse] = await Promise.all([
        getNews(new Request('https://www.finai.net.tr/api/news?category=macro&limit=30')),
        getNews(new Request('https://www.finai.net.tr/api/news?category=bist&limit=30')),
      ]);
      const [macro, bist] = await Promise.all([macroResponse.json(), bistResponse.json()]);
      const stories = [...(macro.data || []), ...(bist.data || [])] as NewsItem[];
      return Array.from(new Map(stories.map((story) => [story.link, story])).values())
        .sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)).slice(0, 30);
    }

    const response = category === 'bilanco'
      ? await getEarnings()
      : category === 'temettu'
        ? await getDividends()
        : await getIpos();
    const result = await response.json();
    return Array.isArray(result.data) ? result.data as CalendarItem[] : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'Europe/Istanbul' }).format(parsed);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: 'Haber kategorisi bulunamadı', robots: { index: false, follow: false } };
  const page = pages[category];
  const url = `${baseUrl}/haberler/${category}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { title: `${page.title} | FinAI`, description: page.description, url, type: 'website', siteName: 'FinAI' },
    twitter: { card: 'summary', title: `${page.title} | FinAI`, description: page.description },
    robots: { index: true, follow: true },
  };
}

export default async function PublicNewsCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) {
    return <main className="mx-auto min-h-screen max-w-4xl px-5 py-12"><h1 className="text-3xl font-bold">Haber kategorisi bulunamadı</h1><Link className="mt-6 inline-block text-blue-700 underline" href="/haberler">Tüm haber kategorileri</Link></main>;
  }

  const page = pages[category];
  const items = await getCategoryItems(category);
  const url = `${baseUrl}/haberler/${category}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.heading,
    description: page.description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'FinAI', url: baseUrl },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 20).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: 'title' in item ? item.title : `${item.companyName} (${item.symbol})`,
        url: item.link || undefined,
      })),
    },
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12 text-slate-900 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav aria-label="İçerik yolu" className="text-sm text-slate-500"><Link href="/haberler" className="hover:text-blue-700">Haberler</Link><span className="px-2">/</span>{page.heading}</nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{page.heading}</h1>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600">{page.description}</p>
      <p className="mt-3 text-xs text-slate-500">Bilgiler kaynaklarında yayımlandığı şekildedir; tarih ve tutarlar değişiklik gösterebilir.</p>

      <section aria-labelledby="news-list-heading" className="mt-9">
        <h2 id="news-list-heading" className="text-xl font-semibold">{page.type === 'news' ? 'Güncel ekonomi ve piyasa haberleri' : 'Güncel takvim kayıtları'}</h2>
        {items.length === 0 ? (
          <p className="mt-4 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">Şu anda bu kategori için doğrulanmış güncel kayıt alınamıyor. Daha sonra tekrar kontrol edebilirsiniz.</p>
        ) : (
          <ol className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-5">
            {items.map((item, index) => {
              if ('title' in item) {
                return <li key={item.id || item.link || index} className="py-5">
                  <p className="text-xs text-slate-500">{item.source}{item.pubDate ? ` · ${formatDate(item.pubDate)}` : ''}</p>
                  <h3 className="mt-1 font-semibold leading-6">{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">{item.title}</a> : item.title}</h3>
                  {item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}
                </li>;
              }

              const title = item.companyName ? `${item.companyName} (${item.symbol})` : item.symbol;
              const date = formatDate(item.earningsDate || item.paymentDate || item.startDate || undefined) || item.dateRange;
              return <li key={`${item.symbol}-${item.earningsDate || item.paymentDate || item.startDate || index}`} className="py-5">
                <p className="text-xs text-slate-500">{date || 'Tarih açıklanmadı'}{item.status ? ` · ${item.status}` : ''}</p>
                <h3 className="mt-1 font-semibold leading-6">{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">{title}</a> : title}</h3>
                {item.netAmountFormatted && <p className="mt-1 text-sm text-slate-600">Hisse başına net temettü: {item.netAmountFormatted}{typeof item.yieldPercent === 'number' ? ` · Temettü verimi: %${item.yieldPercent}` : ''}</p>}
              </li>;
            })}
          </ol>
        )}
      </section>
      <aside className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-600">
        Diğer kategoriler: <Link className="text-blue-700 hover:underline" href="/haberler/ekonomi">Ekonomi</Link> · <Link className="text-blue-700 hover:underline" href="/haberler/bilanco">Bilanço</Link> · <Link className="text-blue-700 hover:underline" href="/haberler/temettu">Temettü</Link> · <Link className="text-blue-700 hover:underline" href="/haberler/halka-arz">Halka arz</Link>
      </aside>
    </main>
  );
}
