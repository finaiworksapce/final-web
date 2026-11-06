const fs = require('fs');
const path = require('path');

// 1. page.tsx welcome header
const pagePath = path.join(__dirname, '../src/app/dashboard/page.tsx');
let page = fs.readFileSync(pagePath, 'utf-8');

const oldHeader = `{/* Header Welcome Area (Referans Görsel Hiyerarşisi) */}
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

const newHeader = `{/* Header Welcome Area (Zodiak Hierarchy 500/325/225 + 60-30-10) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10 mb-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl zodiak-title font-[500] text-[#142B50] flex items-center gap-2 tracking-tight">
                            Hoş Geldiniz, {userName || userEmail?.split('@')[0] || "Salih KAVAKCI"}
                            <motion.span animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}>👋</motion.span>
                        </h1>
                        <p className="text-xs sm:text-sm zodiak-desc font-[225] text-[#142B50]/75 mt-0.5">
                            Piyasaları, verileri ve gelişmeleri tek bir yerden takip edin.
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

page = page.replace(oldHeader, newHeader);
fs.writeFileSync(pagePath, page, 'utf-8');
console.log("page.tsx refined header successfully.");

// 2. TopAssetDistributionCard.tsx
const cardPath = path.join(__dirname, '../src/components/dashboard/TopAssetDistributionCard.tsx');
let card = fs.readFileSync(cardPath, 'utf-8');

// Shorten TYPE_NAMES
card = card.replace(
    `const TYPE_NAMES: Record<string, string> = {
    STOCK: "Hisse Senetleri",
    FUND: "Fonlar",
    GOLD: "Altın & Emtia",
    CASH: "Nakit Varlıklar",
    CRYPTO: "Kripto Paralar",
};`,
    `const TYPE_NAMES: Record<string, string> = {
    STOCK: "Hisse",
    FUND: "Fon",
    GOLD: "Altın",
    CASH: "Nakit",
    CRYPTO: "Kripto",
};`
);

// Fix span max-w clipping
card = card.replace(
    'max-w-[85px] sm:max-w-[110px]',
    'flex-1'
);

fs.writeFileSync(cardPath, card, 'utf-8');
console.log("TopAssetDistributionCard.tsx refined successfully.");
