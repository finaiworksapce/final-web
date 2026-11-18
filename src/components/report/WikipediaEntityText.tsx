"use client";

import React from "react";
import Link from "next/link";

interface WikipediaEntityTextProps {
    text: string;
    className?: string;
    activeSymbols?: string[];
}

const KNOWN_TICKERS = new Set([
    'THYAO', 'ASELS', 'EREGL', 'TUPRS', 'FROTO', 'SISE', 'BIMAS', 'AKBNK', 'GARAN',
    'ISCTR', 'YKBNK', 'KCHOL', 'SAHOL', 'PETKM', 'EKGYO', 'ENKAI', 'HEKTS', 'SASA',
    'TTKOM', 'TCELL', 'TOASO', 'ARCLK', 'VESTL', 'KOZAL', 'KOZAA', 'ASTOR', 'KONTUR',
    'ALARK', 'ODAS', 'PGSUS', 'DOAS', 'GUBRF', 'MGROS', 'CIMSA', 'ISGYO', 'HALKB',
    'VAKBN', 'SOKM', 'AEFES', 'TABGD', 'REEDR', 'EUPWR', 'CWENE', 'ALFAS', 'MIATK'
]);

export default function WikipediaEntityText({ text, className = "", activeSymbols = [] }: WikipediaEntityTextProps) {
    if (!text) return null;

    const symbolSet = new Set([
        ...KNOWN_TICKERS, 
        ...activeSymbols.map(s => (s || '').toUpperCase().trim()).filter(Boolean)
    ]);

    // Tokenize text by markdown bold or ticker boundary
    const tokens = text.split(/(\*\*[^*]+\*\*|\b[A-Z]{3,6}\b)/g);

    return (
        <span className={className}>
            {tokens.map((token, index) => {
                if (!token) return null;

                // Check markdown bold
                if (token.startsWith('**') && token.endsWith('**')) {
                    const inner = token.slice(2, -2).trim();
                    const innerUpper = inner.toUpperCase();
                    if (symbolSet.has(innerUpper)) {
                        return (
                            <Link
                                key={index}
                                href={`/dashboard/analysis?q=${innerUpper}`}
                                className="inline-flex items-center font-semibold text-[#004BFA] dark:text-[#93C5FD] underline decoration-[#004BFA]/50 dark:decoration-[#93C5FD]/50 underline-offset-2 hover:text-blue-800 dark:hover:text-white hover:decoration-[#004BFA] transition-all"
                                title={`${innerUpper} Şirket Analiz Sayfası`}
                            >
                                {inner}
                            </Link>
                        );
                    }
                    return <strong key={index} className="font-semibold text-slate-900 dark:text-white">{inner}</strong>;
                }

                // Check ticker
                const upper = token.toUpperCase().trim();
                if (symbolSet.has(upper) && token.length >= 3 && token.length <= 6) {
                    return (
                        <Link
                            key={index}
                            href={`/dashboard/analysis?q=${upper}`}
                            className="inline-flex items-center font-semibold text-[#004BFA] dark:text-[#93C5FD] underline decoration-[#004BFA]/50 dark:decoration-[#93C5FD]/50 underline-offset-2 hover:text-blue-800 dark:hover:text-white hover:decoration-[#004BFA] transition-all"
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
