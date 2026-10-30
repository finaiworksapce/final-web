import { MetadataRoute } from 'next';
import { SEO_PUBLIC_STOCK_SYMBOLS } from '@/lib/seo-public-stock-symbols';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.finai.net.tr';

  const staticPages: MetadataRoute.Sitemap = [
    '/',
    '/about',
    '/haberler',
    '/haberler/ekonomi',
    '/haberler/bilanco',
    '/haberler/temettu',
    '/haberler/halka-arz',
    '/legal/terms',
    '/legal/kvkk',
  ].map((path) => ({ url: `${baseUrl}${path}` }));

  // Yalnızca editoryal olarak seçilmiş, şirket kimliği ve anlamlı içeriği olan sayfalar.
  const stockPages: MetadataRoute.Sitemap = SEO_PUBLIC_STOCK_SYMBOLS.map((symbol) => ({
    url: `${baseUrl}/varlik/${symbol}`,
  }));

  return [...staticPages, ...stockPages];
}
