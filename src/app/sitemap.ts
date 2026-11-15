import { MetadataRoute } from 'next';
import { SEO_PUBLIC_STOCK_SYMBOLS } from '@/lib/seo-public-stock-symbols';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.finai.net.tr';
  const now = new Date();

  // Ana Sayfa ve Statik Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/haberler`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/haberler/ekonomi`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/haberler/bilanco`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/haberler/temettu`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/haberler/halka-arz`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/legal/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/kvkk`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // BIST Hisse Sayfaları (Google SERP Öncelikli)
  const stockPages: MetadataRoute.Sitemap = SEO_PUBLIC_STOCK_SYMBOLS.map((symbol) => ({
    url: `${baseUrl}/varlik/${symbol}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticPages, ...stockPages];
}
