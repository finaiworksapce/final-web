import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export interface FinAiReport {
    summary: string;
    whyImportant?: string;
    possibleImpacts?: string[];
    watchPoints?: string[];
    keyConcepts?: { term: string; explanation: string }[];
    metadata?: {
        model: string;
        promptVersion: string;
        generatedAt: string;
        contentFingerprint: string;
        status: 'success' | 'fallback';
    };
}

export interface ArticleResponseData {
    title: string;
    image?: string | null;
    paragraphs: string[];
    summary: string;
    report: FinAiReport;
    sourceUrl: string;
}

// In-memory cache: URL or Fingerprint -> cached report
const reportCache = new Map<string, { report: FinAiReport; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function decodeHtmlEntities(str: string): string {
    if (!str) return '';
    return str
        .replace(/&#8217;|&#39;|&apos;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&#8220;|&#8221;|&quot;/g, '"')
        .replace(/&#8230;/g, '...')
        .replace(/&#8211;|&#8212;/g, '-')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .trim();
}

function computeFingerprint(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(36);
}

// Validation & Sanitization function
function validateAndSanitizeReport(raw: any, fallbackSummary: string): FinAiReport {
    const disallowedPhrases = [
        'kesinlikle alınmalı', 'kesinlikle satılmalı', 'al tavsiyesi', 'sat tavsiyesi',
        'yatırım tavsiyesidir', 'kesin yükselecek', 'kesin düşecek'
    ];

    const cleanText = (t: any): string => {
        if (typeof t !== 'string') return '';
        let cleaned = decodeHtmlEntities(t.trim());
        for (const phrase of disallowedPhrases) {
            cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
        }
        return cleaned.trim();
    };

    let summary = cleanText(raw?.summary);
    if (!summary || summary.length < 20) {
        summary = fallbackSummary;
    }

    let whyImportant: string | undefined = cleanText(raw?.whyImportant);
    if (!whyImportant || whyImportant.length < 15) {
        whyImportant = undefined;
    }

    let possibleImpacts: string[] | undefined = undefined;
    if (Array.isArray(raw?.possibleImpacts)) {
        const filtered = raw.possibleImpacts
            .map((item: any) => cleanText(item))
            .filter((item: string) => item.length > 5 && item.length < 180);
        if (filtered.length > 0) {
            possibleImpacts = filtered.slice(0, 4);
        }
    }

    let watchPoints: string[] | undefined = undefined;
    if (Array.isArray(raw?.watchPoints)) {
        const filtered = raw.watchPoints
            .map((item: any) => cleanText(item))
            .filter((item: string) => item.length > 5 && item.length < 180);
        if (filtered.length > 0) {
            watchPoints = filtered.slice(0, 3);
        }
    } else if (typeof raw?.watchPoints === 'string') {
        const cleaned = cleanText(raw.watchPoints);
        if (cleaned.length > 10) {
            watchPoints = [cleaned];
        }
    }

    return {
        summary,
        whyImportant,
        possibleImpacts,
        watchPoints
    };
}

// Rule-based NLP fallback when AI is unavailable or rate-limited
function nlpFallbackReport(title: string, paragraphs: string[], description?: string, fingerprint: string = ''): FinAiReport {
    const p1 = paragraphs[0] || description || title;
    const p2 = paragraphs[1] || '';

    let summary = decodeHtmlEntities(p1.trim());
    if (summary.length < 80 && p2) {
        summary += ` ${decodeHtmlEntities(p2.trim())}`;
    }

    let whyImportant: string | undefined = undefined;
    if (p2 && p2.length > 40 && !summary.includes(p2)) {
        whyImportant = decodeHtmlEntities(p2.trim());
    }

    // Extract potential impacts conditionally from text if keywords present
    const impacts: string[] = [];
    const combined = `${title} ${paragraphs.join(' ')}`;
    if (/faiz|enflasyon|tcmb|fed|ecb/i.test(combined)) {
        impacts.push("Para politikası ve faiz beklentileri üzerinde etkili olabilir");
    }
    if (/dolar|euro|kur|döviz/i.test(combined)) {
        impacts.push("Döviz kurları ve volatilite dengesi");
    }
    if (/bist|hisse|borsa/i.test(combined)) {
        impacts.push("İlgili BIST sektör endeksleri ve hisse performansları");
    }
    if (/petrol|enerji|altın|emtia/i.test(combined)) {
        impacts.push("Emtia ve enerji maliyetleri dinamikleri");
    }

    return {
        summary,
        whyImportant,
        possibleImpacts: impacts.length > 0 ? impacts.slice(0, 3) : undefined,
        watchPoints: paragraphs.length > 2 
            ? ["Gelişmeye dair resmi kurum açıklamaları ve piyasa fiyatlamaları izlenmelidir."] 
            : undefined,
        metadata: {
            model: 'rule-based-nlp',
            promptVersion: 'v1.0',
            generatedAt: new Date().toISOString(),
            contentFingerprint: fingerprint,
            status: 'fallback'
        }
    };
}

// Gemini Structured FinAi Report Generator
async function generateFinAiReport(
    title: string, 
    paragraphs: string[], 
    description?: string, 
    fingerprint: string = ''
): Promise<FinAiReport> {
    const fallback = nlpFallbackReport(title, paragraphs, description, fingerprint);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return fallback;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2
            }
        });

        const isShortNews = paragraphs.length <= 1;

        const prompt = `Sen FinAi Kıdemli Finans ve Piyasa Editörüsün. Görevin, sağlanan haber metnini yatırımcıların hızlıca anlayabileceği yapılandırılmış bir "FinAi Raporu" haline getirmektir.

HABER BAŞLIĞI:
${title}

HABER İÇERİĞİ:
${paragraphs.slice(0, 6).join('\n\n')}

KESİN KURALLAR:
1. Asla haberde bulunmayan rakam, veri, kurum veya olay uydurma.
2. Kesinlikle "kesin artacak", "kesin düşecek", "alınmalı", "satılmalı", "yatırım tavsiyesidir" gibi ifadeler kullanma.
3. Koşullu, analitik ve tarafsız finansal dil kullan ("etkileyebilir", "baskı oluşturabilir", "yakından izlenmeli").
4. ${isShortNews ? 'Haber kısa olduğu için sadece "summary" ve varsa "whyImportant" üret. Zorlama veya yapay maddeler üretme.' : 'Gereksiz uzatmadan somut ve öz bilgiler ver.'}

Lütfen yanıtını tam olarak şu JSON şemasında ver:
{
  "summary": "Haberin özünü anlatan akıcı ve net 1-2 cümlelik özet (Zorunlu)",
  "whyImportant": "Haberin finans ve piyasa açısından neden önemli olduğu (1 cümle, opsiyonel)",
  "possibleImpacts": ["Haberin doğrudan etkileyebileceği varlık/sektör/gösterge 1", "Etki 2"],
  "watchPoints": ["Yatırımcıların bundan sonra takip etmesi gereken kritik nokta 1"]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        if (!text) {
            return fallback;
        }

        const parsed = JSON.parse(text);
        const validated = validateAndSanitizeReport(parsed, fallback.summary);

        return {
            ...validated,
            metadata: {
                model: 'gemini-1.5-flash',
                promptVersion: 'v2.0-structured',
                generatedAt: new Date().toISOString(),
                contentFingerprint: fingerprint,
                status: 'success'
            }
        };
    } catch (e) {
        console.warn("Gemini Structured Report generation error, using NLP fallback:", e);
        return fallback;
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');
        const fallbackDesc = searchParams.get('desc') || '';

        if (!url) {
            return NextResponse.json({ success: false, error: "URL parametresi gereklidir." }, { status: 400 });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error("Kaynak sayfaya ulaşılamadı.");

        const html = await response.text();
        const $ = cheerio.load(html);

        // 1. Reklam, menü ve gereksiz etiketleri kaldır
        $('script, style, iframe, nav, footer, header, aside, form, .ads, .sidebar, .comments, .social-share, .related, .tags, .author-info, [role="navigation"], [role="banner"]').remove();

        // 2. Başlık ve görsel
        let rawTitle = $('h1').first().text().trim() || 
                       $('meta[property="og:title"]').attr('content') || 
                       $('title').text().trim() || "FinAi Ekonomi Masası Özel Haberi";

        const title = decodeHtmlEntities(rawTitle);
        const image = $('meta[property="og:image"]').attr('content') || $('article img').first().attr('src') || null;

        // 3. Ham Paragrafları ve Tabloları ayıkla
        let paragraphs: string[] = [];

        // Tablo satırlarını düzenle
        $('table').each((_, tbl) => {
            const rows: string[] = [];
            $(tbl).find('tr').each((_, tr) => {
                const cells = $(tr).find('th, td').map((_, cell) => $(cell).text().trim().replace(/\s+/g, ' ')).get().filter(Boolean);
                if (cells.length >= 2) {
                    rows.push(`• ${decodeHtmlEntities(cells.join(' : '))}`);
                } else if (cells.length === 1 && cells[0].length > 10) {
                    rows.push(`📌 ${decodeHtmlEntities(cells[0])}`);
                }
            });
            if (rows.length > 0) {
                paragraphs.push(...rows);
            }
        });

        // Paragrafları tara
        $('article p, main p, .content p, .news-detail p, .news-content p, .story-body p, p').each((_, el) => {
            let text = $(el).text().trim().replace(/\s+/g, ' ');
            text = decodeHtmlEntities(text);

            text = text
                .replace(/isimli makale.*?tarafından hazırlanmış.*?yayınlanmıştır\.?/gi, '')
                .replace(/Haberin devamı için tıklayınız\.?/gi, '')
                .trim();

            if (text.length > 35 && !text.toLowerCase().includes('çerez') && !text.toLowerCase().includes('abone') && !text.toLowerCase().includes('tıklayın') && !paragraphs.includes(text)) {
                paragraphs.push(text);
            }
        });

        // Eğer hala çok kısaysa meta description fallback
        if (paragraphs.length === 0) {
            const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || fallbackDesc;
            if (metaDesc) {
                paragraphs.push(decodeHtmlEntities(metaDesc));
            } else {
                paragraphs.push("Bu haberin ayrıntıları FinAi masası tarafından hazırlanmaktadır.");
            }
        }

        // 4. Parmak İzi & Cache Kontrolü
        const fingerprint = computeFingerprint(`${title}_${paragraphs.slice(0, 2).join(' ')}`);
        const cacheKey = `${url}::${fingerprint}`;
        const now = Date.now();
        const cached = reportCache.get(cacheKey);

        let report: FinAiReport;
        if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
            report = cached.report;
        } else {
            report = await generateFinAiReport(title, paragraphs, fallbackDesc, fingerprint);
            reportCache.set(cacheKey, { report, timestamp: now });
        }

        const responseData: ArticleResponseData = {
            title,
            image,
            paragraphs,
            summary: report.summary,
            report,
            sourceUrl: url
        };

        return NextResponse.json({
            success: true,
            data: responseData
        });

    } catch (error: any) {
        console.error("Article Scraper Error:", error);
        return NextResponse.json({ success: false, error: "Haber içeriği yüklenemedi." }, { status: 500 });
    }
}
