const fs = require('fs');
const path = require('path');

const agendaPath = path.join(__dirname, '../src/components/dashboard/DailyAgendaWidget.tsx');
let agenda = fs.readFileSync(agendaPath, 'utf-8');

const targetBlock = agenda.substring(agenda.indexOf("    return (\n        <div className=\"bg-[linear-gradient"));

const replacementBlock = `    return (
        <div className="bg-white border-2 border-[#78B8F5]/40 hover:border-[#78B8F5] rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[395px] group relative overflow-hidden">
            {/* 1. Üst Başlık & Kategori Filtreleri */}
            <div className="relative z-10 shrink-0">
                {/* Başlık Satırı */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#78B8F5]/20">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#78B8F5]/20 border border-[#78B8F5]/40 flex items-center justify-center text-[#142B50] shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#142B50]" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-xs sm:text-[13px] zodiak-subtitle font-[325] text-[#142B50] tracking-tight">
                                Günlük Ajanda
                            </h3>
                            <span className="text-[11px] zodiak-desc font-[225] text-[#142B50]/60">
                                ({todayFormattedDate})
                            </span>
                        </div>
                    </div>

                    <Link
                        href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                        className="inline-flex items-center gap-1 text-xs zodiak-subtitle font-[325] text-[#142B50] hover:text-[#78B8F5] transition-colors group/link"
                    >
                        <span>Tümünü Gör</span>
                        <ArrowRight className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Kategori Filtre Sekmeleri */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 custom-scrollbar">
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeCategory === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id)}
                                className={\`px-3 py-1 text-xs zodiak-subtitle font-[325] rounded-lg transition-all shrink-0 \${
                                    isActive
                                        ? "bg-[#142B50] text-white shadow-xs"
                                        : "bg-[#78B8F5]/15 text-[#142B50] hover:bg-[#78B8F5]/30"
                                }\`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Ajanda Satırları */}
            <div className="relative z-10 flex-1 min-h-0 my-2 overflow-y-auto pr-1.5 custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#78B8F5]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#78B8F5]/50">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
                        <Loader2 className="w-5 h-5 text-[#142B50] animate-spin" />
                        <span className="text-xs zodiak-desc font-[225] text-[#142B50]/60">Günün gelişmeleri yükleniyor...</span>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="divide-y divide-[#78B8F5]/20 space-y-0.5">
                        {filteredItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.link || '/dashboard/calendar'}
                                className="flex items-center justify-between gap-2.5 py-2 px-1.5 hover:bg-[#78B8F5]/10 rounded-xl transition-colors group/item block"
                            >
                                {/* Sol: Saat + Ülke / Sembol */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.category === 'economic' && item.time ? (
                                        <span className="text-xs font-mono zodiak-subtitle font-[325] text-[#142B50]/70 w-11 shrink-0">
                                            {item.time}
                                        </span>
                                    ) : null}
                                    {item.category === 'economic' ? (
                                        <span className="text-xs zodiak-subtitle font-[325] text-[#142B50] px-2 py-0.5 rounded-md bg-[#78B8F5]/20 border border-[#78B8F5]/40 shrink-0 min-w-[32px] text-center">
                                            {item.symbolOrCountry}
                                        </span>
                                    ) : (
                                        <div className="flex items-center justify-center shrink-0">
                                            <StockLogo symbol={item.symbolOrCountry} className="w-8 h-8 ring-1 ring-[#78B8F5]/40 shadow-xs" />
                                        </div>
                                    )}
                                </div>

                                {/* Orta: Başlık ve Yardımcı Değer */}
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="text-xs zodiak-subtitle font-[325] text-[#142B50] truncate group-hover/item:text-[#142B50]">
                                        {item.title}
                                    </div>
                                    {item.auxiliaryText && (
                                        <div className="text-[10px] zodiak-desc font-[225] text-[#142B50]/60 truncate mt-0.5">
                                            {item.auxiliaryText}
                                        </div>
                                    )}
                                </div>

                                {/* Sağ: Etki + Kategori Badge */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {renderImpactBars(item.impact)}
                                    <span className="text-[10px] zodiak-subtitle font-[325] px-2 py-0.5 rounded-md shrink-0 bg-[#78B8F5]/20 text-[#142B50] border border-[#78B8F5]/30">
                                        {item.categoryLabel}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Boş Durum (Empty State) */
                    <div className="py-10 flex flex-col items-center justify-center text-center gap-1.5 px-4">
                        <div className="w-8 h-8 rounded-xl bg-[#78B8F5]/10 border border-[#78B8F5]/30 flex items-center justify-center text-[#142B50]/60 mb-1">
                            <AlertCircle className="w-4 h-4 text-[#142B50]/60" />
                        </div>
                        <p className="text-xs zodiak-subtitle font-[325] text-[#142B50]">
                            Bugün bu kategoride planlanmış bir gelişme bulunmuyor.
                        </p>
                        <p className="text-[10px] zodiak-desc font-[225] text-[#142B50]/60 max-w-[240px]">
                            Gelecek günlerin takvimi ve tüm şirket olayları için takvim sayfasına göz atabilirsiniz.
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Alt Bilgi & Yönlendirme */}
            <div className="relative z-10 shrink-0 pt-2.5 border-t border-[#78B8F5]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#142B50]" />
                    <span className="text-[11px] zodiak-desc font-[225] text-[#142B50]/70">Bugünün piyasa ve şirket gelişmeleri</span>
                </div>

                <Link
                    href={activeCategory !== 'all' ? \`/dashboard/calendar?type=\${activeCategory === 'dividends' ? 'dividend' : activeCategory}\` : "/dashboard/calendar"}
                    className="text-[11px] zodiak-subtitle font-[325] text-[#142B50] hover:text-[#78B8F5] transition-colors inline-flex items-center gap-1"
                >
                    <span>Tüm Takvim</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
`;

agenda = agenda.replace(targetBlock, replacementBlock);
fs.writeFileSync(agendaPath, agenda, 'utf-8');
console.log("DailyAgendaWidget successfully updated!");
