"use client";

import React from "react";
import Link from "next/link";

interface WikipediaEntityTextProps {
    text: string;
    className?: string;
    activeSymbols?: string[];
    variant?: 'light' | 'dark';
}

const KNOWN_TICKERS = new Set([
    'THYAO', 'ASELS', 'EREGL', 'TUPRS', 'FROTO', 'SISE', 'BIMAS', 'AKBNK', 'GARAN',
    'ISCTR', 'YKBNK', 'KCHOL', 'SAHOL', 'PETKM', 'EKGYO', 'ENKAI', 'HEKTS', 'SASA',
    'TTKOM', 'TCELL', 'TOASO', 'ARCLK', 'VESTL', 'KOZAL', 'KOZAA', 'ASTOR', 'KONTUR',
    'ALARK', 'ODAS', 'PGSUS', 'DOAS', 'GUBRF', 'MGROS', 'CIMSA', 'ISGYO', 'HALKB',
    'VAKBN', 'SOKM', 'AEFES', 'TABGD', 'REEDR', 'EUPWR', 'CWENE', 'ALFAS', 'MIATK'
]);

export default function WikipediaEntityText({ 
    text, 
    className = "", 
    activeSymbols = [],
    variant = 'light'
}: WikipediaEntityTextProps) {
    if (!text) return null;

    const symbolSet = new Set([
        ...KNOWN_TICKERS, 
        ...activeSymbols.map(s => (s || '').toUpperCase().trim()).filter(Boolean)
    ]);

    const isDark = variant === 'dark';

    // Tokenize text by markdown bold, quoted news headlines, bracketed calendar links, or ticker boundary
    const tokens = text.split(/(\*\*[^*]+\*\*|"[^"]+"|[“"][^”"]+[”"]|\[[^\]]+\]|\b[A-Z]{3,6}\b)/g);

    return (
        <span className={className}>
            {tokens.map((token, index) => {
                if (!token) return null;

                // Check quoted news headline: e.g. "THYAO Tahmini — 2027 için Fiyat Hedefi"
                if ((token.startsWith('"') && token.endsWith('"')) || 
                    (token.startsWith('“') && token.endsWith('”')) ||
                    (token.startsWith('"') && token.endsWith('"'))) {
                    const cleanQuote = token.replace(/^[“"']+|[”"']+$/g, '').trim();
                    // Check if quote mentions a known ticker
                    const words = cleanQuote.split(/\s+/);
                    const foundTicker = words.find(w => symbolSet.has(w.toUpperCase().replace(/[^A-Z]/g, '')));
                    const newsQuery = foundTicker ? foundTicker.toUpperCase().replace(/[^A-Z]/g, '') : cleanQuote;

                    return (
                        <Link
                            key={index}
                            href={`/dashboard/news?q=${encodeURIComponent(newsQuery)}`}
                            className={`inline-flex items-center font-medium underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                    ? "text-cyan-300 dark:text-cyan-300 hover:text-white decoration-cyan-400/50 hover:decoration-white"
                                    : "text-[#004BFA] dark:text-[#93C5FD] hover:text-blue-800 dark:hover:text-white decoration-[#004BFA]/40 hover:decoration-blue-800"
                            }`}
                            title={`"${cleanQuote}" haberini görüntüle`}
                        >
                            {token}
                        </Link>
                    );
                }


                // Check bracketed calendar reference: e.g. [Ekim 2026 Ajandası] or [ekonomi:ID|Başlık]
                if (token.startsWith('[') && token.endsWith(']')) {
                    const inner = token.slice(1, -1).trim();
                    let targetUrl = "/dashboard/calendar";
                    let displayText = inner;
                    if (inner.startsWith("ekonomi:")) {
                        const parts = inner.slice(8).split("|");
                        displayText = parts[1] || parts[0];
                        targetUrl = `/dashboard/calendar?event=${encodeURIComponent(displayText)}`;
                    } else if (inner.startsWith("takvim:")) {
                        const q = inner.slice(7);
                        displayText = q;
                        targetUrl = `/dashboard/calendar?event=${encodeURIComponent(q)}`;
                    }

                    return (
                        <Link
                            key={index}
                            href={targetUrl}
                            className={`inline-flex items-center font-semibold underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                    ? "text-cyan-300 dark:text-cyan-300 hover:text-white decoration-cyan-400/50 hover:decoration-white"
                                    : "text-[#004BFA] dark:text-[#93C5FD] hover:text-blue-800 dark:hover:text-white decoration-[#004BFA]/40 hover:decoration-blue-800"
                            }`}
                            title="İlgili ekonomik habere / takvim sayfasına git"
                        >
                            {displayText}
                        </Link>
                    );
                }

                // Check markdown bold
                if (token.startsWith('**') && token.endsWith('**')) {
                    const inner = token.slice(2, -2).trim();
                    const innerUpper = inner.toUpperCase();
                    if (symbolSet.has(innerUpper)) {
                        return (
                            <Link
                                key={index}
                                href={`/dashboard/analysis?q=${innerUpper}`}
                                className={`inline-flex items-center font-semibold underline underline-offset-2 transition-all cursor-pointer ${
                                    isDark
                                        ? "text-[#93C5FD] dark:text-[#93C5FD] decoration-[#93C5FD]/50 hover:text-white hover:decoration-white"
                                        : "text-[#004BFA] dark:text-[#93C5FD] decoration-[#004BFA]/50 hover:text-blue-800 dark:hover:text-white hover:decoration-[#004BFA]"
                                }`}
                                title={`${innerUpper} Şirket Analiz Sayfası`}
                            >
                                {inner}
                            </Link>
                        );
                    }
                    return <strong key={index} className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{inner}</strong>;
                }

                // Check ticker
                const upper = token.toUpperCase().trim();
                if (symbolSet.has(upper) && token.length >= 3 && token.length <= 6) {
                    return (
                        <Link
                            key={index}
                            href={`/dashboard/analysis?q=${upper}`}
                            className={`inline-flex items-center font-semibold underline underline-offset-2 transition-all cursor-pointer ${
                                isDark
                                    ? "text-[#93C5FD] dark:text-[#93C5FD] decoration-[#93C5FD]/50 hover:text-white hover:decoration-white"
                                    : "text-[#004BFA] dark:text-[#93C5FD] decoration-[#004BFA]/50 hover:text-blue-800 dark:hover:text-white hover:decoration-[#004BFA]"
                            }`}
                            title={`${upper} Şirket Analiz Sayfası`}
                        >
                            {token}
                        </Link>
                    );
                }

                return <React.Fragment key={index}>{token}</React.Fragment>;
            })}
        </span>
    );
}
