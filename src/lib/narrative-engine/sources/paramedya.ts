import { RawNewsItem } from '../types';

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchParamedyaNews(query: string): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = [];
  const cleanQuery = query.trim();
  if (!cleanQuery) return items;

  try {
    const url = `https://www.paramedya.com/wp-json/wp/v2/posts?search=${encodeURIComponent(cleanQuery)}&per_page=15`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const post of data) {
          const rawTitle = post.title?.rendered || '';
          const cleanTitle = stripHtml(rawTitle);
          if (!cleanTitle) continue;

          const rawSnippet = post.excerpt?.rendered || post.content?.rendered || '';
          const cleanSnippet = stripHtml(rawSnippet).slice(0, 300);

          items.push({
            id: `paramedya-${post.id}`,
            source: 'paramedya',
            sourceLabel: 'Paramedya',
            title: cleanTitle,
            link: post.link || '',
            date: post.date || new Date().toISOString(),
            snippet: cleanSnippet
          });
        }
      }
    }
  } catch (err) {
    console.warn('[Paramedya Fetch Error]:', err instanceof Error ? err.message : err);
  }

  return items;
}
