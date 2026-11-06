const fs = require('fs');
const path = require('path');

// 1. page.tsx
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');

// Normalize line endings
page = page.replace(/\r\n/g, '\n');

const targetPageHeader = `{/* Header Welcome Area (Referans Görsel Hiyerarşisi) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 relative z-10 mb-1">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0]}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                            Piyasaları, verileri ve gelişmeleri tek bir yerden takip edin.
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium self-end sm:self-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Son veri güncellemesi: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>`;

const newPageHeader = `{/* Header Welcome Area (Zodiak Hierarchy 500/325/225 + 60-30-10) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10 mb-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl zodiak-title font-[500] text-[#142B50] flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0] || "Salih KAVAKCI"}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                        <p className="text-xs sm:text-sm zodiak-desc font-[225] text-[#142B50]/75 mt-0.5">
                            Piyasaları, portföy hareketlerini ve yapay zeka analizlerini tek bir ekranda yönetin.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#78B8F5]/40 text-[#142B50] text-xs zodiak-subtitle font-[325] shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Son veri: {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <Link 
                            href="/dashboard/portfolio" 
                            className="px-3.5 py-1.5 rounded-xl bg-[#142B50] hover:bg-[#142B50]/90 text-white text-xs zodiak-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5"
                        >
                            <span>Portföy Detayı</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>`;

if (page.includes(targetPageHeader)) {
    page = page.replace(targetPageHeader, newPageHeader);
    console.log("Successfully replaced page header!");
} else {
    console.log("targetPageHeader not found, looking for substring");
    const idx = page.indexOf("{/* Header Welcome Area");
    const endIdx = page.indexOf("{/* DESKTOP LAYOUT");
    if (idx !== -1 && endIdx !== -1) {
        page = page.substring(0, idx) + newPageHeader + "\n\n                " + page.substring(endIdx);
        console.log("Replaced via index boundaries!");
    }
}
fs.writeFileSync(pagePath, page, 'utf-8');

// 2. TopAssetDistributionCard.tsx
const cardPath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let card = fs.readFileSync(cardPath, 'utf-8');
card = card.replace(/\r\n/g, '\n');

card = card.replace(
    'const RADIUS = 38;',
    'const RADIUS = 30;'
);

card = card.replace(
    '<div className="relative w-28 h-28 sm:w-30 sm:h-30 xl:w-32 xl:h-32 shrink-0 flex items-center justify-center">',
    '<div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">'
);

card = card.replace(
    `<span className="text-[10px] zodiak-desc font-[225] text-[#142B50]/70 leading-tight">
                                Toplam
                            </span>
                            <span className="text-xs sm:text-[13px] zodiak-title font-[500] text-[#142B50] tracking-tight mt-0.5 truncate max-w-[84px]">
                                {formatCurrency(totalValue)}
                            </span>`,
    `<span className="text-[9px] zodiak-desc font-[225] text-[#142B50]/70 leading-tight">
                                Toplam
                            </span>
                            <span className="text-[11px] sm:text-xs zodiak-title font-[500] text-[#142B50] tracking-tight mt-0.5 truncate max-w-[65px]">
                                {formatCurrency(totalValue)}
                            </span>`
);

card = card.replace(
    '<div className="flex-1 min-w-0 space-y-1.5">',
    '<div className="flex-1 min-w-0 space-y-2 pl-1">'
);

fs.writeFileSync(cardPath, card, 'utf-8');
console.log("TopAssetDistributionCard.tsx updated successfully!");
