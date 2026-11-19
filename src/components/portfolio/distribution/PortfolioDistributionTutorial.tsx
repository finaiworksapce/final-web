"use client";

import React, { useState } from "react";
import { 
    GraduationCap, 
    Sparkles, 
    ShieldAlert, 
    TrendingDown, 
    Scale, 
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioDistributionTutorialProps {
    viewMode: 'donut' | 'heatmap' | 'sector';
    sortedAssets?: any[];
    chartTotalValue?: number;
}

export default function PortfolioDistributionTutorial({
    viewMode,
    sortedAssets = [],
    chartTotalValue = 0
}: PortfolioDistributionTutorialProps) {
    // 1. Donut Şok Simülasyonu Durumu
    const [shockSimulated, setShockSimulated] = useState<boolean>(false);

    // 2. Heatmap Asimetri Cetveli Aktif Kademesi
    const [activeLossIndex, setActiveLossIndex] = useState<number>(2); // Varsayılan -%50

    // 3. Sektör Terazisi Aktif Döngü
    const [activeCycle, setActiveCycle] = useState<'rate_hike' | 'recession' | 'export_boom'>('rate_hike');

    const topAsset = sortedAssets[0];
    const topSymbol = topAsset?.symbol || "Lider Hisse";

    return (
        <div className="border border-sky-200/60 dark:border-white/10 bg-gradient-to-br from-sky-50/60 via-white to-blue-50/40 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-transparent rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 transition-all">
            
            {/* ÜST BAŞLIK & AKADEMİ ROZETİ */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sky-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#004BFA] text-white flex items-center justify-center shadow-sm shadow-[#004BFA]/20">
                        <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#004BFA] dark:text-[#93C5FD]">
                                FinAi Finansal Okuryazarlık Akademisi
                            </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                            {viewMode === 'donut' && "Şirket Riski vs. Piyasa Riski (Markowitz İlkesi)"}
                            {viewMode === 'heatmap' && "Zararın Asimetrisi & Maliyet Çukuru Tuzağı"}
                            {viewMode === 'sector' && "Sektörel Döngüler & Negatif Korelasyon Kalkanı"}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100/80 dark:bg-white/10 text-sky-800 dark:text-sky-300 text-[11px] font-medium border border-sky-200/50 dark:border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Uygulamalı Strateji Dersi</span>
                </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* GÖRÜNÜM 1: VARLIK (DONUT) - ŞİRKET RİSKİ & ŞOK SİMÜLASYONU */}
            {/* ------------------------------------------------------------- */}
            {viewMode === 'donut' && (
                <div className="space-y-4">
                    {/* BIST Tarihinden Reel Vaka */}
                    <div className="bg-white/90 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-[#004BFA]"></span>
                            <span>BIST Tarihinden Reel Vaka (2022 - 2023 Dönemi)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            Geçmişte popüler hisselere tüm birikimini bağlayan yatırımcılar, bu hisselerin uzun süren sert geri çekilme ve yatay dinlenme evrelerinde sermayelerinin tamamen kilitlendiğini yaşayarak gördü. Oysa tek bir hisseye bel bağlamak yerine; havacılık, rafineri ve bankacılık gibi farklı alanlardan şirketleri katan dengeli bir sepet kuranlar, tek bir şirketteki dalgalanmaya rağmen portföylerinin genel kârlılığını ve büyümesini korumayı başardı.
                        </p>
                    </div>

                    {/* İnteraktif Şok Simülatörü */}
                    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-3.5 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-rose-400" />
                                <span className="text-xs font-semibold text-white tracking-wide">
                                    Canlı Stres Simülasyonu: Beklenmedik Şirket Şoku
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShockSimulated(prev => !prev)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                                    shockSimulated 
                                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-xs" 
                                        : "bg-white/15 hover:bg-white/25 text-white"
                                )}
                            >
                                <RefreshCw className={cn("w-3 h-3 transition-transform", shockSimulated && "rotate-180")} />
                                <span>{shockSimulated ? "Şoku Sıfırla" : "Hisseye Şok Yaşat (-%40)"}</span>
                            </button>
                        </div>

                        {/* Karşılaştırma Izgarası */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Kutu 1: Tek Hisseye Yığılma */}
                            <div className={cn(
                                "border rounded-xl p-3.5 space-y-2.5 transition-all",
                                shockSimulated 
                                    ? "bg-rose-950/40 border-rose-500/50" 
                                    : "bg-white/5 border-white/10"
                            )}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-300">A. Tek Hisseye Yığılma (%80)</span>
                                    <span className={shockSimulated ? "text-rose-400 font-bold" : "text-slate-400"}>
                                        {shockSimulated ? "Sermaye Felci" : "Riskli"}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                                        <div 
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                shockSimulated ? "bg-rose-500 w-[48%]" : "bg-emerald-500 w-[80%]"
                                            )}
                                        />
                                        <div className="h-full bg-slate-600 flex-1" />
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-400">
                                        <span>Ana Varlık: {topSymbol}</span>
                                        <span>{shockSimulated ? "Portföyün ~%32'si Silindi!" : "Aşırı Yoğun"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Kutu 2: Dengeli Sepet */}
                            <div className={cn(
                                "border rounded-xl p-3.5 space-y-2.5 transition-all",
                                shockSimulated 
                                    ? "bg-emerald-950/40 border-emerald-500/50" 
                                    : "bg-white/5 border-white/10"
                            )}>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-300">B. Dengeli Sepet (6-8 Varlık)</span>
                                    <span className={shockSimulated ? "text-emerald-400 font-bold" : "text-emerald-300"}>
                                        {shockSimulated ? "Kalkan Korudu" : "İdeal"}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                                        <div className={cn("h-full transition-all duration-500", shockSimulated ? "bg-rose-500 w-[8%]" : "bg-emerald-500 w-[15%]")} />
                                        <div className="h-full bg-emerald-500 w-[18%]" />
                                        <div className="h-full bg-emerald-500 w-[18%]" />
                                        <div className="h-full bg-emerald-500 w-[18%]" />
                                        <div className="h-full bg-emerald-500 w-[18%]" />
                                        <div className="h-full bg-emerald-500 flex-1" />
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-400">
                                        <span>Diğer 5 Varlık Sağlam</span>
                                        <span>{shockSimulated ? "Kayıp Yalnızca ~%6 (Telafi Edildi)" : "Korumalı"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sonuç Özeti */}
                        <div className="text-[12px] text-slate-300 bg-white/10 p-2.5 rounded-lg flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                <strong>Akademi Kuralı:</strong> 8-10 dengeli varlık bulundurmak, şirkete özgü (CEO, bilanço, dava vb.) beklenmedik krizlerin tüm portföyünüzü batırmasını engeller.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* GÖRÜNÜM 2: KAZANÇ (HEATMAP) - ZARAR ASİMETRİSİ CETVELİ */}
            {/* ------------------------------------------------------------- */}
            {viewMode === 'heatmap' && (
                <div className="space-y-4">
                    {/* BIST Tarihinden Reel Vaka */}
                    <div className="bg-white/90 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>BIST Tarihinden Reel Vaka (Dipten Dönüş Matematiği)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            Borsada dipten dönüş matematiği doğrusal değildir; kayıplar derinleştikçe telafisi katlanarak zorlaşır. Bir hisse yarı yarıya değer kaybettiğinde zararınız yüzde ellidir; fakat aynı hissenin yalnızca eski paranızı kurtarabilmesi için dip fiyattan iki katına çıkması (yüzde yüz prim yapması) gerekir. Bu asimetri kuralı nedeniyle profesyoneller, zarardaki hisselere inatla bağlanmak yerine risk limitlerine sadık kalır.
                        </p>
                    </div>

                    {/* İnteraktif Asimetri Merdiveni */}
                    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-rose-400" />
                                <span>İnteraktif Cetvel: Düşüş Derinleştikçe Gereken Yükseliş</span>
                            </span>
                            <span className="text-[11px] text-slate-400">Kademelere tıklayın</span>
                        </div>

                        {/* 4 Kademe Butonları */}
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                            {[
                                { drop: "-%10", needed: "+%11.1", label: "Hafif Düzeltme", color: "emerald", width: "11%" },
                                { drop: "-%30", needed: "+%42.8", label: "Kritik Eşik", color: "amber", width: "43%" },
                                { drop: "-%50", needed: "+%100.0", label: "2 Kat Ralli", color: "rose", width: "75%" },
                                { drop: "-%70", needed: "+%233.3", label: "Sermaye Felci", color: "purple", width: "100%" }
                            ].map((step, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveLossIndex(idx)}
                                    className={cn(
                                        "p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1",
                                        activeLossIndex === idx
                                            ? "bg-white/15 border-white text-white shadow-xs"
                                            : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
                                    )}
                                >
                                    <span className="text-xs font-bold text-rose-400">{step.drop} Kayıp</span>
                                    <span className="text-[11px] font-semibold text-emerald-400">{step.needed} Gerekir</span>
                                </button>
                            ))}
                        </div>

                        {/* Görsel Bar Karşılaştırması */}
                        {(() => {
                            const steps = [
                                { dropPct: 10, recoveryPct: 11.1, desc: "Normal piyasa dalgalanmasıdır, birkaç haftada kolayca telafi edilir." },
                                { dropPct: 30, recoveryPct: 42.8, desc: "Ciddi bir düzeltmedir; güçlü bir şirket hikayesi veya bilanço artışı gerektirir." },
                                { dropPct: 50, recoveryPct: 100.0, desc: "Hissenin eski maliyetinize gelebilmesi için tam 2 KAT (yüzde yüz) prim yapması şarttır!" },
                                { dropPct: 70, recoveryPct: 233.3, desc: "Sermaye kilitlenmiştir; paranın çıkması için şirketin mucizevi bir ralli yaşaması gerekir." }
                            ];
                            const cur = steps[activeLossIndex];
                            return (
                                <div className="space-y-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Yaşanan Kayıp:</span>
                                            <span className="font-bold text-rose-400">-%{cur.dropPct}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-rose-500 transition-all duration-500" 
                                                style={{ width: `${cur.dropPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Yalnızca Başabaş (Maliyete) Ulaşmak İçin Gereken Prim:</span>
                                            <span className="font-bold text-emerald-400">+{cur.recoveryPct}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 transition-all duration-500" 
                                                style={{ width: `${Math.min(100, (cur.recoveryPct / 233.3) * 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <p className="text-[12px] text-slate-300 pt-1 leading-relaxed">
                                        {cur.desc}
                                    </p>
                                </div>
                            );
                        })()}

                        {/* Sonuç Özeti */}
                        <div className="text-[12px] text-slate-300 bg-white/10 p-2.5 rounded-lg flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                                <strong>Akademi Kuralı:</strong> Düşen hissede beklemek kârı artırmaz, telafi zorluğunu katlar. Profesyoneller zararı erkenden sınırlandırarak (Stop-Loss) sermayeyi korur.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* GÖRÜNÜM 3: SEKTÖR DAĞILIMI - SEKTÖREL TERAZİ & DÖNGÜLER */}
            {/* ------------------------------------------------------------- */}
            {viewMode === 'sector' && (
                <div className="space-y-4">
                    {/* BIST Tarihinden Reel Vaka */}
                    <div className="bg-white/90 dark:bg-white/5 border border-sky-100 dark:border-white/10 rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            <span>BIST Tarihinden Reel Vaka (2020 Pandemi & Faiz Artış Döngüsü)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            Küresel krizlerde uçuşlar durduğu için havacılık şirketleri sert değer kaybederken; evde tüketim patlamasıyla gıda ve perakende hisseleri tarihi kâr rekorları kırdı. Faiz artış dönemlerinde borçlu sanayi şirketleri zorlanırken, yüksek nakit zengini şirketler ve bankacılık pozitif ayrıştı. Birbirine zıt çalışan sektörlere sahip olmak, bir sektör fırtınaya yakalandığında diğerinin portföyü sırtlamasını sağlar.
                        </p>
                    </div>

                    {/* İnteraktif Sektörel Terazi Simülasyonu */}
                    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-4 shadow-md">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
                                <Scale className="w-4 h-4 text-[#93C5FD]" />
                                <span>Canlı Sektör Terazisi: Makro Döngü Seçimi</span>
                            </span>
                            <span className="text-[11px] text-slate-400">Döngüye tıklayın</span>
                        </div>

                        {/* 3 Döngü Butonu */}
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveCycle('rate_hike')}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center",
                                    activeCycle === 'rate_hike'
                                        ? "bg-white/20 border-white text-white shadow-xs"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                📈 Faiz Artışı
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCycle('recession')}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center",
                                    activeCycle === 'recession'
                                        ? "bg-white/20 border-white text-white shadow-xs"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                ❄️ Kriz / Durgunluk
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCycle('export_boom')}
                                className={cn(
                                    "px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center",
                                    activeCycle === 'export_boom'
                                        ? "bg-white/20 border-white text-white shadow-xs"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
                                )}
                            >
                                🚀 Sanayi & İhracat Rallisi
                            </button>
                        </div>

                        {/* Canlı Terazi Görseli */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                {/* Küfe 1: Pozitif Ayrışan */}
                                <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl space-y-1.5">
                                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                                        <span>⬆️ Pozitif Ayrışan</span>
                                        <span>Yükselişte</span>
                                    </div>
                                    <div className="font-semibold text-white text-sm">
                                        {activeCycle === 'rate_hike' && "Banka & Nakit Zengini Şirketler"}
                                        {activeCycle === 'recession' && "Gıda, Perakende & Sağlık (Defansif)"}
                                        {activeCycle === 'export_boom' && "Otomotiv, Beyaz Eşya & İhracat"}
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                        {activeCycle === 'rate_hike' && "Yüksek mevduat ve kredi marjları sayesinde kârlılığını artırır."}
                                        {activeCycle === 'recession' && "İnsanlar krizde bile yemeye, içmeye ve tedavi olmaya devam eder."}
                                        {activeCycle === 'export_boom' && "Küresel talep canlandığında döviz ciro hacmi katlanır."}
                                    </p>
                                </div>

                                {/* Küfe 2: Baskılanan */}
                                <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl space-y-1.5">
                                    <div className="flex items-center justify-between text-amber-400 font-bold">
                                        <span>⬇️ Baskılanan</span>
                                        <span>Durgun</span>
                                    </div>
                                    <div className="font-semibold text-white text-sm">
                                        {activeCycle === 'rate_hike' && "Borçlu Sanayi & GYO Şirketleri"}
                                        {activeCycle === 'recession' && "Havacılık, Turizm & Lüks Tüketim"}
                                        {activeCycle === 'export_boom' && "İç Pazara Bağımlı Durgun Alanlar"}
                                    </div>
                                    <p className="text-[11px] text-slate-300">
                                        {activeCycle === 'rate_hike' && "Kredi ve finansman faiz giderleri kâr marjını doğrudan eritir."}
                                        {activeCycle === 'recession' && "İlk kısılan bütçeler tatil ve seyahat harcamaları olur."}
                                        {activeCycle === 'export_boom' && "Yurtiçi daralma döviz kazandıramayan sektörleri yavaşlatır."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                                <span>Terazi Durumu: <strong>Zıt Kutuplar Dengede</strong></span>
                                <span className="text-emerald-400 font-medium">Portföy Kalkanı Aktif</span>
                            </div>
                        </div>

                        {/* Sonuç Özeti */}
                        <div className="text-[12px] text-slate-300 bg-white/10 p-2.5 rounded-lg flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>
                                <strong>Akademi Kuralı:</strong> Aynı döngüde birlikte düşen sektörlere yığılmak yerine; zıt yönlü çalışan sektörleri (Negatif Korelasyon) sepete eklemek fırtınalarda portföyünüzü korur.
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
