import { RawNewsItem } from '../types';

export async function fetchCnbceNews(query: string): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = [];
  const cleanQuery = query.trim();
  if (!cleanQuery) return items;

  try {
    const url = `https://www.cnbce.com/api/search?q=${encodeURIComponent(cleanQuery)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      const posts = Array.isArray(data?.posts) ? data.posts : [];

      for (const p of posts) {
        if (!p.title) continue;
        const link = p.link?.startsWith('http') ? p.link : `https://www.cnbce.com${p.link || ''}`;
        items.push({
          id: `cnbce-${p.link || p.title}`,
          source: 'cnbce',
          sourceLabel: 'CNBC-e',
          title: p.title.trim(),
          link,
          date: p.date ? p.date.trim() : new Date().toISOString(),
          snippet: p.title.trim()
        });
      }
    }
  } catch (err) {
    console.warn('[CNBC-e Fetch Error]:', err instanceof Error ? err.message : err);
  }

  return items;
}
