import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.finai.net.tr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/varlik/',
          '/haberler/',
          '/about',
          '/hakkimizda',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/onboarding/',
          '/reset-password/',
          '/3d-login-dev/',
          '/font-demo/',
          '/logo-showcase/',
          '/logos/',
        ],
      },
      // Yapay Zeka Arama Motorları (GEO / AI-SEO İzinleri)
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: [
          '/',
          '/varlik/',
          '/haberler/',
          '/llms.txt',
        ],
        disallow: [
          '/api/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
