"use client";

import React, { useMemo } from "react";
import { 
    GraduationCap, 
    Brain 
} from "lucide-react";
import { getAssetSector } from "@/data/sectorMapping";

interface PortfolioDistributionTutorialProps {
    viewMode: 'donut' | 'heatmap' | 'sector';
    sortedAssets?: any[];
    chartTotalValue?: number;
    riskData?: {
        title: string;
        subtitle: string;
        score: number;
        level: string;
        text: string;
    };
    userName?: string | null;
}

export default function PortfolioDistributionTutorial({
    viewMode,
    sortedAssets = [],
    chartTotalValue = 0,
    riskData,
    userName
}: PortfolioDistributionTutorialProps) {
    const politeGreetingName = useMemo(() => {
        if (!userName) return "Değerli Yatırımcımız";
        const firstName = userName.trim().split(' ')[0] || '';
        const cleanFirst = firstName.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, '');
        return cleanFirst ? `${cleanFirst} Bey` : userName;
    }, [userName]);

    const topAsset = sortedAssets[0];
    const topSymbol = topAsset?.symbol || "Lider Hisse";
    const topWeight = chartTotalValue > 0 && topAsset 
        ? ((topAsset.marketVal / chartTotalValue) * 100).toFixed(1) 
        : "0.0";
    const isSingleOrHeavilyConcentrated = Number(topWeight) >= 40 || sortedAssets.length <= 2;

    const topSector = topAsset ? getAssetSector(topAsset.symbol) : "";
    const isCommodityOrFund = topSector === 'Emtia' || topSector === 'Kıymetli Madenler' || topSector === 'Yatırım Fonu' || topSymbol === 'ALTIN' || topSymbol === 'GRAM_ALTIN';
    const assetNoun = isCommodityOrFund ? "varlıkta" : "şirkette";
    const entityNoun = isCommodityOrFund ? "varlığınızın" : "şirketinizin";
    const shockReason = isCommodityOrFund ? "olumsuz bir piyasa gelişmesi" : "kötü bir bilanço";

    // Sektör hesaplaması (En büyük sektör)
    const { topSectorName, topSectorWeight, isSingleSectorConcentrated } = useMemo(() => {
        if (!sortedAssets.length || chartTotalValue === 0) {
            return { topSectorName: "Finans", topSectorWeight: "100.0", isSingleSectorConcentrated: true };
        }
        const weights: Record<string, number> = {};
        sortedAssets.forEach(a => {
            const sec = getAssetSector(a.symbol);
            weights[sec] = (weights[sec] || 0) + a.marketVal;
        });
        let maxSec = "";
        let maxVal = 0;
        Object.entries(weights).forEach(([sec, val]) => {
            if (val > maxVal) {
                maxVal = val;
                maxSec = sec;
            }
        });
        const pct = ((maxVal / chartTotalValue) * 100).toFixed(1);
        return {
            topSectorName: maxSec || "Finans",
            topSectorWeight: pct,
            isSingleSectorConcentrated: Number(pct) >= 50
        };
    }, [sortedAssets, chartTotalValue]);

    const score = riskData?.score ?? 10;
    const subtitle = riskData?.subtitle ?? (viewMode === 'donut' ? "Çeşitlendirme Skoru" : viewMode === 'heatmap' ? "Kârlılık Skoru" : "Sektörel Denge");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch w-full">
            {/* ------------------------------------------------------------- */}
            {/* SOL SÜTUN (%50): FİNAİ AKADEMİ (ÖĞRETİCİ METAFOR & MANTIK) */}
            {/* ------------------------------------------------------------- */}
            <div className="border border-sky-200/70 dark:border-white/10 bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 dark:from-white/[0.04] dark:via-white/[0.02] dark:to-transparent rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-start space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#004BFA] text-white flex items-center justify-center shadow-xs">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                FinAi Akademi
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 font-normal">
                    {viewMode === 'donut' && (
                        <>
                            <p className="leading-relaxed">
                                Bir dükkanınız olduğunu düşünün; sadece şemsiye satarsanız, yağmurlu günlerde harika kazanırsınız ama güneş açtığında dükkan sinek avlar. Oysa şemsiyenin yanına güneş gözlüğü ve dondurma da eklerseniz, hava nasıl olursa olsun kasanıza her gün para girmeye devam eder.
                            </p>
                            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                <strong>Borsada da mantık birebir aynıdır:</strong> Tüm paranızı tek bir hisseye bağlamak, dükkanda sadece tek bir ürün satmaya benzer. Farklı şirketlere ve sektörlere dağıldığınızda, piyasa hangi havada olursa olsun sepetiniz ayakta kalır.
                            </p>
                        </>
                    )}

                    {viewMode === 'heatmap' && (
                        <>
                            <p className="leading-relaxed">
                                Bir futbol takımı düşünün; forvetiniz harika oynayıp sürekli gol atıyor ama defanstaki oyuncular her maç daha fazla gol yediriyor. O tek forvetiniz sakatlandığında veya formdan düştüğünde takım maçı doğrudan kaybeder.
                            </p>
                            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                <strong>Isı haritası takımınızın performansıdır:</strong> Yeşil kutular gol atan forvetleriniz, kırmızı kutular ise sermayenizi aşağı çekenlerdir. Başarılı bir portföy için sadece bir hissenin iyi gitmesi yetmez; geride kalan zayıf halkaları da kontrol altında tutmak gerekir.
                            </p>
                        </>
                    )}

                    {viewMode === 'sector' && (
                        <>
                            <p className="leading-relaxed">
                                Bir çiftçi olduğunuzu ve tarlanıza sadece kuraklığı seven buğday ektiğinizi hayal edin. O yıl aşırı yağmur yağarsa tüm hasadınız çürür ve eliniz boş kalır. Ama tarlanızın bir kısmına yağmuru seven pirinç de ekerseniz, mevsim ne getirirse getirsin aç kalmazsınız.
                            </p>
                            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                <strong>Sektör çeşitlendirmesi bu tarladır:</strong> Faizler yükseldiğinde bankalar güçlenir ama borçlu sanayi şirketleri zorlanır. Durgunlukta ise gıda ve perakende ayakta kalır. Birbirine zıt çalışan sektörler seçmek, fırtınada portföyünüze doğal bir zırh takar.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SAĞ SÜTUN (%50): FİNAİ RAPORU (TABLOYA REFERANS + ÇITIRDAN UYARI) */}
            {/* ------------------------------------------------------------- */}
            <div className="bg-[#0E1E38] dark:bg-[#02041A] text-white border border-white/10 rounded-2xl p-5 sm:p-6 shadow-lg shadow-[#0E1E38]/20 flex flex-col justify-start space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/10 text-[#93C5FD] flex items-center justify-center border border-white/15">
                            <Brain className="w-4 h-4 text-current" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                FinAi Raporu
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/20 shadow-xs backdrop-blur-xs">
                        <span className="text-[10px] font-medium text-white/80">{subtitle}:</span>
                        <span className="text-xs font-bold text-white font-numbers tabular-nums">{score}/10</span>
                    </div>
                </div>

                <div className="text-xs sm:text-[13px] text-white/90 leading-relaxed space-y-3 font-normal">
                    {viewMode === 'donut' && (
                        <>
                            <p className="leading-relaxed">
                                <strong>{politeGreetingName},</strong> hemen yukarıda görmüş olduğunuz varlık dağılım tablosuna baktığımızda;{' '}
                                {isSingleOrHeavilyConcentrated ? (
                                    <>
                                        <strong>{topSymbol}</strong> diliminin sepetin neredeyse tamamını (%{topWeight}) kapladığını ve tüm paranızın tek bir {assetNoun} toplandığını görebilirsiniz. Grafikteki dilimlerin üzerine gelerek büyüklüklerinizi inceleyebilirsiniz.
                                    </>
                                ) : (
                                    <>
                                        varlıklarınızın sepet içinde homojen dağıldığını, en ağırlıklı {entityNoun} ise <strong>{topSymbol}</strong> (%{topWeight}) olduğunu görebilirsiniz. Grafikteki dilimlerin üzerine gelerek varlık büyüklüklerinizi inceleyebilirsiniz.
                                    </>
                                )}
                            </p>
                            <p className="leading-relaxed text-white/90">
                                {isSingleOrHeavilyConcentrated ? (
                                    <>Burada dikkat etmeniz gereken en kritik nokta; yarın bu {assetNoun} beklenmedik bir kriz, {shockReason} veya sert bir düşüş yaşandığı zaman, cüzdanınız çok büyük bir değer kaybıyla karşı karşıya kalabilir. Birikiminizi bu tür ani şoklardan korumak için, yatırımlarınızı tek bir {assetNoun} yığmak yerine farklı sektörlerden hisselere bölerek riski mutlaka dağıtmalısınız.</>
                                ) : (
                                    <>Mevcut dengeli yapınızı korurken, ağırlığı yüksek varlıklarınızdaki gelişmeleri ve haber akışlarını yakından izlemenizdir. Farklı sektörlerden hisselerle sepetinizi zenginleştirmek, cüzdanınızın şoklara karşı kalkanını her zaman güçlü tutacaktır.</>
                                )}
                            </p>
                        </>
                    )}

                    {viewMode === 'heatmap' && (
                        <>
                            <p className="leading-relaxed">
                                <strong>{politeGreetingName},</strong> yukarıdaki ısı haritasındaki kutuların renklerine ve boyutlarına baktığımızda; kazancınızın ve kaybınızın hangi hisselerde toplandığını net şekilde görebilirsiniz. Kutuların üzerine tıklayarak kâr ve zarar detaylarınızı inceleyebilirsiniz.
                            </p>
                            <p className="leading-relaxed text-white/90">
                                Buradaki kritik uyarı; kârda olan hisselerinizin kazancını korurken, derin kırmızıya dönen hisselerin tüm cüzdanın getirisini eritmesine izin vermemektir. Zararı derinleşen şirketlerin bilançolarını yakından izleyip gerektiğinde pozisyonları dengelemek, sermayenizi korumanın anahtarıdır.
                            </p>
                        </>
                    )}

                    {viewMode === 'sector' && (
                        <>
                            <p className="leading-relaxed">
                                <strong>{politeGreetingName},</strong> yukarıdaki sektörel pasta grafiğine baktığınızda;{' '}
                                {isSingleSectorConcentrated ? (
                                    <>dilimlerin neredeyse tamamının tek bir sektörde (<strong>{topSectorName}</strong>) toplandığını hemen görebilirsiniz. Dilimlerin üzerine gelerek sektörel ağırlıklarınızı detaylıca görebilirsiniz.</>
                                ) : (
                                    <>yatırımlarınızın farklı iş kollarına dağıldığını, en ağırlıklı sektörün ise <strong>{topSectorName}</strong> (%{topSectorWeight}) olduğunu görebilirsiniz. Dilimlerin üzerine gelerek sektörel paylarınızı inceleyebilirsiniz.</>
                                )}
                            </p>
                            <p className="leading-relaxed text-white/90">
                                Buradaki önemli uyarı; yarın bu sektörün karşılaşacağı bir faiz kararı veya makroekonomik kısıtlama, tüm portföyünüzün aynı anda aşağı çekilmesine neden olabilir. Olası sert dalgalanmalarda cüzdanınızı korumak için, sanayi, ulaştırma veya perakende gibi farklı döngüye sahip sektörleri de sepetinize ekleyerek denge kurmalısınız.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
