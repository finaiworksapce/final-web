import { RawNewsItem } from '../types';

function cleanXmlText(str: string): string {
  if (!str) return '';
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/\s*-\s*Investing\.com\s*Türkiye$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchInvestingNews(query: string): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = [];
  const cleanQuery = query.trim();
  if (!cleanQuery) return items;

  try {
    // Seçenek A: Strictly scoped to site:tr.investing.com
    const scopedQuery = encodeURIComponent(`site:tr.investing.com ${cleanQuery}`);
    const searchUrl = `https://news.google.com/rss/search?q=${scopedQuery}&hl=tr&gl=TR&ceid=TR:tr`;

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*'
      },
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>(?:[\s\S]*?<description>([\s\S]*?)<\/description>)?[\s\S]*?<\/item>/g;
      
      let match;
      let count = 0;
      while ((match = itemRegex.exec(xml)) !== null && count < 15) {
        const rawTitle = match[1] || '';
        const title = cleanXmlText(rawTitle);
        // Exclude generic Google News aggregate titles
        if (!title || title.includes('"site:tr.investing.com') || title.toLowerCase() === 'google haberler') {
          continue;
        }

        const snippet = cleanXmlText(match[4] || title);
        const combined = `${title} ${snippet}`.toLowerCase();
        
        // Strict relevance check: Query or ticker must be mentioned in title or snippet
        if (!combined.includes(cleanQuery.toLowerCase())) {
          continue;
        }

        const link = match[2] || '';
        const date = match[3] || new Date().toISOString();

        items.push({
          id: `investing-${count}-${encodeURIComponent(title.slice(0, 30))}`,
          source: 'investing',
          sourceLabel: 'Investing.com TR',
          title,
          link,
          date,
          snippet
        });
        count++;
      }
    }
  } catch (err) {
    console.warn('[Investing.com Fetch Error]:', err instanceof Error ? err.message : err);
  }

  return items;
}
