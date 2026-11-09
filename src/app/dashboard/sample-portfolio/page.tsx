"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  PieChart, 
  Percent, 
  PlusCircle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Compass, 
  Zap, 
  BarChart2, 
  Activity, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  Eye, 
  Award,
  Download,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StrategyModel {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  riskScore: number;
  riskLabel: string;
  expectedCagr: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility: number;
  rebalanceFreq: string;
  idealHorizon: string;
  rationale: string;
  backtest: {
    model: number;
    bist100: number;
    tufe: number;
    mevduat: number;
  };
  distribution: {
    name: string;
    percentage: number;
    color: string;
    category: string;
    sampleAssets: string[];
    role: string;
    risk: string;
  }[];
}

const STRATEGY_MODELS: StrategyModel[] = [
  {
    id: "islamic",
    name: "FinAi Katılım & Faizsiz Model",
    subtitle: "Faiz hassasiyetine tam uyumlu, BIST Katılım Endeksi ve kira sertifikası katılım fonu",
    tag: "Katılım Finans Uyumlu",
    riskScore: 3,
    riskLabel: "Dengeli Katılım (3/5)",
    expectedCagr: 52.0,
    sharpeRatio: 1.88,
    maxDrawdown: -7.8,
    volatility: 11.8,
    rebalanceFreq: "Aylık Katılım Taraması",
    idealHorizon: "6 - 12+ Ay",
    rationale: "İslami finans ve katılım standartlarına %100 uyumlu olarak; sukuk/kira sertifikası katılım fonu, fiziki karşılıklı Darphane altın sertifikası ve BIST Katılım Endeksi'ne dahil sanayi, havacılık ve gıda perakendesi şirketleriyle yapılandırılmıştır.",
    backtest: {
      model: 56.4,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Kira Sertifikası Katılım Fonu",
        percentage: 30,
        color: "#059669",
        category: "Faizsiz Sabit Getiri",
        sampleAssets: ["ZKP", "KRF", "KRS Katılım Fonları"],
        role: "Faizsiz sukuk getirisi ve likidite esnekliği",
        risk: "Düşük (1/5)"
      },
      {
        name: "Darphane Altın Sertifikası",
        percentage: 25,
        color: "#F59E0B",
        category: "Emtia / Değer Saklama",
        sampleAssets: ["ALTIN.S1", "Fiziki Gram Altın"],
        role: "Fiziki karşılıklı faizsiz altın güvencesi",
        risk: "Düşük-Orta (2/5)"
      },
      {
        name: "Katılım Sanayi & İhracat Hisseleri",
        percentage: 25,
        color: "#004BFA",
        category: "Sektör Hisseleri",
        sampleAssets: ["ASELS", "THYAO", "ASTOR", "KONTR"],
        role: "BIST Katılım Endeksi sanayi ve ihracat lokomotifleri",
        risk: "Orta-Yüksek (3/5)"
      },
      {
        name: "Katılım Defansif Perakende Hisseleri",
        percentage: 20,
        color: "#10B981",
        category: "Sektör Hisseleri",
        sampleAssets: ["BIMAS", "SOKM"],
        role: "Krizlere dayanıklı gıda ve temel tüketim nakit akışı",
        risk: "Orta (3/5)"
      }
    ]
  },
  {
    id: "balanced",
    name: "FinAi Dengeli Model",
    subtitle: "Enflasyona karşı korumalı, makro dengeli ve sürdürülebilir büyüme",
    tag: "En Çok Tercih Edilen",
    riskScore: 3,
    riskLabel: "Dengeli (3/5)",
    expectedCagr: 48.5,
    sharpeRatio: 1.84,
    maxDrawdown: -8.2,
    volatility: 12.4,
    rebalanceFreq: "Aylık AI Taraması",
    idealHorizon: "6 - 12+ Ay",
    rationale: "Mevcut makroekonomik beklentiler gözetilerek %30 kira sertifikası fonu ayrılmış, %25 altın ile kur riski dengelenmiş, %45 sanayi ve teknoloji sektörü hisseleriyle BIST reel getirisi hedeflenmiştir.",
    backtest: {
      model: 54.8,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Kira Sertifikası Fonu",
        percentage: 30,
        color: "#004BFA",
        category: "Sabit Getiri & Likidite",
        sampleAssets: ["KRF", "Kira Sertifikaları", "Kısa Vadeli Sukuk"],
        role: "Düzenli risksiz kupon getirisi ve likidite tamponu",
        risk: "Düşük (1/5)"
      },
      {
        name: "Kıymetli Madenler (Altın & Gümüş)",
        percentage: 25,
        color: "#F59E0B",
        category: "Emtia / Değer Saklama",
        sampleAssets: ["GLDTR", "ALTIN.S1", "Fiziki Gram Altın"],
        role: "Küresel riskler ve devalüasyon kalkanı",
        risk: "Düşük-Orta (2/5)"
      },
      {
        name: "Sanayi & İhracat Hisseleri",
        percentage: 25,
        color: "#6366F1",
        category: "Sektör Hisseleri",
        sampleAssets: ["THYAO", "ASELS", "TUPRS", "KCHOL"],
        role: "İhracatçı ve güçlü nakit akışına sahip lokomotif sanayi devleri",
        risk: "Orta-Yüksek (3/5)"
      },
      {
        name: "Teknoloji & Bilişim Hisseleri",
        percentage: 20,
        color: "#10B981",
        category: "Sektör Hisseleri",
        sampleAssets: ["MIATK", "KONTR", "LOGO", "ASELS"],
        role: "Dijitalleşme ve yüksek marjlı büyüme potansiyeli",
        risk: "Yüksek (4/5)"
      }
    ]
  },
  {
    id: "growth",
    name: "FinAi Büyüme & Teknoloji",
    subtitle: "Yüksek reel getiri ve küresel teknoloji trendlerine odaklı",
    tag: "Yüksek Potansiyel",
    riskScore: 4,
    riskLabel: "Dinamik Büyüme (4/5)",
    expectedCagr: 68.2,
    sharpeRatio: 1.95,
    maxDrawdown: -14.6,
    volatility: 19.8,
    rebalanceFreq: "2 Haftalık AI Taraması",
    idealHorizon: "12 - 24+ Ay",
    rationale: "Yapay zekâ devrimi, enerji dönüşümü ve BIST sanayi/teknoloji şirketlerinin çarpan genişlemesi hedeflenmiştir. Portföyün %70'i teknoloji, enerji ve sanayi sektör hisselerine ayrılarak maksimum sermaye artışı amaçlanır.",
    backtest: {
      model: 74.2,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Teknoloji & Bilişim Hisseleri",
        percentage: 35,
        color: "#004BFA",
        category: "Sektör Hisseleri",
        sampleAssets: ["ASELS", "MIATK", "KONTR", "LOGO"],
        role: "BIST endeks üstü inovasyon ve sipariş büyümesi",
        risk: "Yüksek (4/5)"
      },
      {
        name: "Enerji & Sürdürülebilirlik Hisseleri",
        percentage: 20,
        color: "#8B5CF6",
        category: "Sektör Hisseleri",
        sampleAssets: ["ASTOR", "ENJSA", "YEOTK", "CWENE"],
        role: "Yenilenebilir enerji, şebeke ve depolama yatırımları",
        risk: "Yüksek (4/5)"
      },
      {
        name: "Sanayi & Otomotiv Hisseleri",
        percentage: 15,
        color: "#6366F1",
        category: "Sektör Hisseleri",
        sampleAssets: ["FROTO", "TOASO", "KCHOL"],
        role: "Küresel ihracat ve döviz bazlı sanayi üretimi",
        risk: "Orta-Yüksek (3/5)"
      },
      {
        name: "Altın & Kıymetli Madenler",
        percentage: 15,
        color: "#F59E0B",
        category: "Emtia / Koruma",
        sampleAssets: ["GLDTR", "GMSTR", "ALTIN.S1"],
        role: "Teknoloji düzeltmelerinde dengeleyici tampon",
        risk: "Orta (3/5)"
      },
      {
        name: "Kira Sertifikası Fonu",
        percentage: 15,
        color: "#10B981",
        category: "Sabit Getiri & Likidite",
        sampleAssets: ["KRF", "Kira Sertifikaları"],
        role: "Dip seviyelerden ekleme yapma esnekliği ve risksiz getiri",
        risk: "Düşük (1/5)"
      }
    ]
  },
  {
    id: "income",
    name: "FinAi Temettü & Düzenli Nakit",
    subtitle: "Düzenli temettü akışı ve sermaye koruma dengesi",
    tag: "Düzenli Pasif Gelir",
    riskScore: 2,
    riskLabel: "Düşük - Orta (2/5)",
    expectedCagr: 42.0,
    sharpeRatio: 2.10,
    maxDrawdown: -6.4,
    volatility: 9.8,
    rebalanceFreq: "3 Aylık Temettü Dönemi",
    idealHorizon: "1 - 3+ Yıl",
    rationale: "Son 5 yılda kesintisiz temettü dağıtan sanayi devleri, holdingler ve kira sertifikası fonları ile düzenli nakit akışı ve sermaye değer artışı birleştirilmiştir.",
    backtest: {
      model: 49.3,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Sanayi & Temettü Hisseleri",
        percentage: 40,
        color: "#10B981",
        category: "Sektör Hisseleri",
        sampleAssets: ["TUPRS", "EREGL", "FROTO"],
        role: "Yıllık nakit temettü ve güçlü kârlılık",
        risk: "Orta (3/5)"
      },
      {
        name: "Holding & İştirak Hisseleri",
        percentage: 25,
        color: "#004BFA",
        category: "Sektör Hisseleri",
        sampleAssets: ["KCHOL", "SAHOL", "SISE"],
        role: "Çok sektörlü kurumsal güvence ve sermaye büyümesi",
        risk: "Düşük-Orta (2/5)"
      },
      {
        name: "Defansif Perakende Hisseleri",
        percentage: 15,
        color: "#6366F1",
        category: "Sektör Hisseleri",
        sampleAssets: ["BIMAS", "SOKM"],
        role: "Krizlere dayanıklı gıda ve perakende nakit akışı",
        risk: "Düşük-Orta (2/5)"
      },
      {
        name: "Altın & Kıymetli Madenler",
        percentage: 10,
        color: "#F59E0B",
        category: "Emtia / Güvenli Liman",
        sampleAssets: ["GLDTR", "ALTIN.S1"],
        role: "Kriz anlarında satın alma gücünü koruma",
        risk: "Düşük (1/5)"
      },
      {
        name: "Kira Sertifikası Fonu",
        percentage: 10,
        color: "#3B82F6",
        category: "Sabit Getiri & Likidite",
        sampleAssets: ["KRF", "Kira Sertifikaları"],
        role: "Temettülerin yeniden yatırımı için risksiz ara havuz",
        risk: "Düşük (1/5)"
      }
    ]
  },
  {
    id: "conservative",
    name: "FinAi Muhafazakar Korumacı",
    subtitle: "Minimum dalgalanma, sermaye güvencesi ve garanti getiri",
    tag: "Sıfıra Yakın Kayıp Riski",
    riskScore: 1,
    riskLabel: "Muhafazakar (1/5)",
    expectedCagr: 38.0,
    sharpeRatio: 2.35,
    maxDrawdown: -3.1,
    volatility: 5.6,
    rebalanceFreq: "Aylık",
    idealHorizon: "3 - 6+ Ay",
    rationale: "Sermaye kaybına sıfır toleransı olan yatırımcılar için kira sertifikası fonu ve altın ağırlıklı portföy kurgulanmıştır. BIST payı yalnızca %20 defansif hisselerle sınırlı tutulmuştur.",
    backtest: {
      model: 42.6,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Kira Sertifikası Fonu",
        percentage: 45,
        color: "#004BFA",
        category: "Sabit Getiri & Likidite",
        sampleAssets: ["KRF", "Sukuk Fonları", "Hazine Kira Sertifikaları"],
        role: "Düzenli kupon getirisi ve anapara koruması",
        risk: "En Düşük (1/5)"
      },
      {
        name: "Altın & Kıymetli Madenler",
        percentage: 35,
        color: "#F59E0B",
        category: "Emtia / Değer Saklama",
        sampleAssets: ["GLDTR", "ALTIN.S1", "Gram Altın"],
        role: "Kur şoklarına karşı fiziki koruma",
        risk: "Düşük (2/5)"
      },
      {
        name: "Defansif Perakende Hisseleri",
        percentage: 10,
        color: "#10B981",
        category: "Sektör Hisseleri",
        sampleAssets: ["BIMAS", "SOKM"],
        role: "Krizlere dayanıklı gıda ve temel tüketim nakit akışı",
        risk: "Düşük (1/5)"
      },
      {
        name: "Sanayi & İhracat Hisseleri",
        percentage: 10,
        color: "#6366F1",
        category: "Sektör Hisseleri",
        sampleAssets: ["KCHOL", "ASELS"],
        role: "Sembolik enflasyon üzeri getiri payı",
        risk: "Orta (3/5)"
      }
    ]
  },
  {
    id: "alpha",
    name: "FinAi Dinamik Agresif Alfa",
    subtitle: "Yüksek risk toleransı ile maksimum pazar üzeri getiri",
    tag: "Maksimum Alfa",
    riskScore: 5,
    riskLabel: "Agresif (5/5)",
    expectedCagr: 85.4,
    sharpeRatio: 1.72,
    maxDrawdown: -22.5,
    volatility: 26.4,
    rebalanceFreq: "Haftalık AI Taraması",
    idealHorizon: "18 - 36+ Ay",
    rationale: "Yüksek büyüme gösteren BIST teknoloji/sanayi sektör hisseleri, kripto varlıklar ve kira sertifikası tamponu bir araya getirilmiştir. Yüksek getiri arayışında olan tecrübeli yatırımcılar için uygundur.",
    backtest: {
      model: 92.5,
      bist100: 38.2,
      tufe: 44.1,
      mevduat: 41.0
    },
    distribution: [
      {
        name: "Teknoloji & Momentum Hisseleri",
        percentage: 45,
        color: "#004BFA",
        category: "Sektör Hisseleri",
        sampleAssets: ["THYAO", "ASELS", "PGSUS", "MIATK"],
        role: "Yüksek hacimli trend takibi ve güçlü alfa",
        risk: "Çok Yüksek (5/5)"
      },
      {
        name: "Enerji & İleri Sanayi Hisseleri",
        percentage: 25,
        color: "#10B981",
        category: "Sektör Hisseleri",
        sampleAssets: ["ASTOR", "KONTR", "YEOTK"],
        role: "Geleceğin sanayi ve enerji dönüşüm devleri",
        risk: "Yüksek (4/5)"
      },
      {
        name: "Kripto & Web3 Dijital Varlıklar",
        percentage: 20,
        color: "#8B5CF6",
        category: "Kripto Varlıklar",
        sampleAssets: ["Bitcoin (BTC)", "Ethereum (ETH)", "Solana (SOL)"],
        role: "Küresel likidite dalgalarından maksimum kazanç",
        risk: "Çok Yüksek (5/5)"
      },
      {
        name: "Kira Sertifikası Fonu",
        percentage: 10,
        color: "#F59E0B",
        category: "Sabit Getiri & Likidite",
        sampleAssets: ["KRF", "Sukuk Fonları"],
        role: "Sert piyasa düşüşlerinde hızlı alım rezervi",
        risk: "Düşük (1/5)"
      }
    ]
  }
];

export default function SamplePortfolioPage() {
  const [activeStrategyId, setActiveStrategyId] = useState<string>("balanced");
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const activeStrategy = STRATEGY_MODELS.find(m => m.id === activeStrategyId) || STRATEGY_MODELS[0];

  const RADIUS = 38;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~238.76
  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-16">
      {/* Sürekli AI Loop Ambient Efektleri */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none"
      />

      {/* Ana Kapsayıcı: Kenarları Maksimum Kullanan Tam Genişlik (Edge-to-Edge) */}
      <div className="w-full max-w-[2500px] mx-auto px-2 min-[360px]:px-3 sm:px-6 md:px-8 xl:px-10 py-3 sm:py-6 relative z-10 flex flex-col gap-5 sm:gap-7">
        
        {/* Üst Bar: Navigasyon & Canlı AI Motor Göstergesi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#D6E4FF]/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="h-4 w-px bg-[#D6E4FF] dark:bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm clash-title font-[500] tracking-tight">
                FinAi Örnek Portföy Laboratuvarı
              </span>
            </div>
          </div>

          {/* AI Canlı Loop Rozeti */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#004BFA]/10 border border-[#004BFA]/30 text-[#004BFA] dark:text-[#D6E4FF] text-xs clash-subtitle font-[325]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004BFA] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004BFA]" />
              </span>
              <span>Canlı AI Dağılım Optimizasyonu Aktif</span>
            </div>

            <Link
              href="/dashboard/portfolio?openAdd=true"
              className="px-3.5 py-1.5 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Varlık Ekle</span>
            </Link>
          </div>
        </div>

        {/* HERO BAŞLIK ALANI */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#D6E4FF]/60 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20 uppercase tracking-wider">
                Yapay Zekâ Strateji Motoru
              </span>
              <span className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                • 5 Farklı Risk & Hedef Profili
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight">
              Örnek Portföy & Varlık Dağılım Modelleri
            </h1>
            <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/80 dark:text-[#F5F7FA]/75 mt-1 max-w-3xl">
              Türkiye piyasaları, BIST endeksleri, TEFAS fonları ve kıymetli madenler için algoritmik risk-getiri optimizasyonu ile oluşturulan referans portföy yapıları.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#004BFA]" />
              <span>Modeli İndir</span>
            </button>
          </div>
        </div>

        {/* STRATEJİ SEÇİCİ SEKMELERİ (5 MODEL) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 w-full">
          {STRATEGY_MODELS.map((model) => {
            const isActive = model.id === activeStrategyId;
            return (
              <button
                key={model.id}
                onClick={() => setActiveStrategyId(model.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                  isActive
                    ? "bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white border-[#004BFA] shadow-lg ring-2 ring-[#004BFA]/40 scale-[1.01]"
                    : "bg-white dark:bg-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] border-[#D6E4FF] dark:border-white/10 hover:border-[#004BFA]/50 hover:bg-[#F5F7FA] dark:hover:bg-white/5 shadow-2xs"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeStrategyGlow"
                    className="absolute inset-0 bg-gradient-to-r from-[#004BFA]/20 to-transparent pointer-events-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <span className={`text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-[#D6E4FF]" : "bg-[#D6E4FF]/50 text-[#004BFA]"
                  }`}>
                    {model.tag}
                  </span>
                  <span className={`text-[10px] font-numbers font-[500] ${
                    isActive ? "text-emerald-300" : "text-emerald-600"
                  }`}>
                    +%{model.expectedCagr}
                  </span>
                </div>

                <div className="mt-1">
                  <h3 className="text-xs sm:text-[13px] clash-title font-[500] tracking-tight truncate">
                    {model.name}
                  </h3>
                  <span className={`text-[10px] clash-desc font-[225] block truncate mt-0.5 ${
                    isActive ? "text-[#D6E4FF]/80" : "text-[#040989]/60 dark:text-[#F5F7FA]/60"
                  }`}>
                    {model.riskLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ANA BENTO GRID BÖLÜMÜ (3 Kolonlu / Kenarları Kullanan Mimari) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
          
          {/* 1. KART: İNTERAKTİF DONUT GRAFİK & DAĞILIM ORANLARI (4 Kolon) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden group">
            {/* AI Loop Gradient */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.45, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-[#004BFA]/15 rounded-full blur-2xl pointer-events-none"
            />

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#D6E4FF]/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm clash-title font-[500] tracking-tight">
                      Hedef Dağılım Modeli
                    </h3>
                    <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                      %100 Ağırlık Dağılımı
                    </span>
                  </div>
                </div>

                <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Optimize Edildi
                </span>
              </div>

              {/* Donut Grafik Görseli */}
              <div className="flex flex-col items-center justify-center py-6 relative">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 filter drop-shadow-sm">
                    {activeStrategy.distribution.map((item, idx) => {
                      const strokeLength = (item.percentage / 100) * CIRCUMFERENCE;
                      const strokeDasharray = `${strokeLength} ${CIRCUMFERENCE - strokeLength}`;
                      const strokeDashoffset = -cumulativeOffset;
                      cumulativeOffset += strokeLength;

                      const isHovered = hoveredSlice === idx;

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r={RADIUS}
                          fill="none"
                          stroke={item.color}
                          strokeWidth={isHovered ? 13 : 10.5}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-200 cursor-pointer"
                          onMouseEnter={() => setHoveredSlice(idx)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Donut İçi Bilgi */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
                    <span className="text-[9px] clash-subtitle font-[325] uppercase tracking-wider text-[#004BFA] dark:text-[#D6E4FF] leading-tight">
                      {hoveredSlice !== null ? activeStrategy.distribution[hoveredSlice].name : "Hedef Getiri"}
                    </span>
                    <span className="text-xl sm:text-2xl font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] tracking-tight mt-0.5">
                      {hoveredSlice !== null ? `%${activeStrategy.distribution[hoveredSlice].percentage}` : `+%${activeStrategy.expectedCagr}`}
                    </span>
                    <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                      {hoveredSlice !== null ? "Varlık Ağırlığı" : "Yıllık Beklenti (CAGR)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dağılım Dilimleri Listesi */}
              <div className="space-y-2 pt-2">
                {activeStrategy.distribution.map((item, idx) => {
                  const isHovered = hoveredSlice === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        isHovered ? "bg-[#D6E4FF]/40 dark:bg-white/10 scale-[1.02]" : "hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0">
                          <span className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] truncate block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 truncate block">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA] ml-2 shrink-0">
                        %{item.percentage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alt Eylem Butonu */}
            <div className="pt-4 border-t border-[#D6E4FF]/60 dark:border-white/10 mt-4">
              <Link
                href="/dashboard/portfolio?openAdd=true"
                className="w-full py-2.5 px-4 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Bu Modeli Portföyüme Uygula</span>
              </Link>
            </div>
          </div>

          {/* 2. & 3. KARTLAR: SAĞ BÖLÜM METRİKLER, AI RASYONELİ & SİMÜLASYON (8 Kolon) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
            
            {/* KPI METRİK KARTLARI (4 Kutu) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Beklenen Getiri (CAGR)
                </span>
                <div className="text-xl sm:text-2xl font-numbers font-[500] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+%{activeStrategy.expectedCagr}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Yıllık bileşik tahmin
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Sharpe Oranı
                </span>
                <div className="text-xl sm:text-2xl font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF] mt-1 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>{activeStrategy.sharpeRatio}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Risk ayarlı üstün getiri
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Maksimum Kayıp (MaxDD)
                </span>
                <div className="text-xl sm:text-2xl font-numbers font-[500] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>%{activeStrategy.maxDrawdown}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Tarihsel en derin geri çekilme
                </span>
              </div>

              <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70 block">
                  Yeniden Dengeleme
                </span>
                <div className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] mt-1 flex items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-[#004BFA]" />
                  <span className="truncate">{activeStrategy.rebalanceFreq}</span>
                </div>
                <span className="text-[10px] clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60 mt-0.5 block">
                  Önerilen Vade: {activeStrategy.idealHorizon}
                </span>
              </div>
            </div>

            {/* AI STRATEJİ RASYONELİ (Sürekli AI Loop Şık Kartı) */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white p-5 sm:p-7 shadow-lg border border-white/10">
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#004BFA]/30 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-[#D6E4FF]">
                      <Sparkles className="w-4 h-4 text-[#D6E4FF]" />
                    </div>
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-white tracking-tight">
                      FinAi Yapay Zekâ Strateji Rasyoneli
                    </h3>
                  </div>

                  <span className="text-[10px] clash-subtitle font-[325] px-2.5 py-0.5 rounded-full bg-[#004BFA]/40 text-[#D6E4FF] border border-white/20">
                    Gerçek Zamanlı Analiz
                  </span>
                </div>

                <p className="text-xs sm:text-sm clash-desc font-[225] text-[#D6E4FF]/90 leading-relaxed">
                  {activeStrategy.rationale}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="text-[11px] clash-subtitle font-[325] text-white/90">
                      Enflasyon Kalkanı: Yüksek
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="text-[11px] clash-subtitle font-[325] text-white/90">
                      Kur Riski Koruması: Aktif
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                    <BarChart2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span className="text-[11px] clash-subtitle font-[325] text-white/90">
                      Likidite Esnekliği: Yüksek
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1 YILLIK BACKTEST KARŞILAŞTIRMA SİMÜLASYONU */}
            <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base clash-title font-[500] tracking-tight">
                    1 Yıllık Simülasyon & Backtest Getirileri
                  </h3>
                  <p className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                    Seçilen AI Modelinin BIST 100, TÜFE Enflasyonu ve Mevduat Faizi ile karşılaştırması
                  </p>
                </div>

                <span className="text-xs font-numbers font-[500] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  +%{ (activeStrategy.backtest.model - activeStrategy.backtest.bist100).toFixed(1) } Alfa
                </span>
              </div>

              {/* Karşılaştırma Barları */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="clash-title font-[500] text-[#004BFA] dark:text-[#D6E4FF] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {activeStrategy.name} (Seçilen Model)
                    </span>
                    <span className="font-numbers font-[500] text-[#004BFA] dark:text-[#D6E4FF]">
                      +%{activeStrategy.backtest.model}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#D6E4FF]/40 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeStrategy.backtest.model / 100) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#004BFA] to-blue-400 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="clash-subtitle font-[325] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      BIST 100 Endeksi
                    </span>
                    <span className="font-numbers font-[500] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      +%{activeStrategy.backtest.bist100}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D6E4FF]/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeStrategy.backtest.bist100 / 100) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-slate-400 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="clash-subtitle font-[325] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      TÜFE Yıllık Enflasyon
                    </span>
                    <span className="font-numbers font-[500] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      +%{activeStrategy.backtest.tufe}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D6E4FF]/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeStrategy.backtest.tufe / 100) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      className="h-full bg-amber-500/80 rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="clash-subtitle font-[325] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      Ortalama Mevduat Faizi
                    </span>
                    <span className="font-numbers font-[500] text-[#040989]/80 dark:text-[#F5F7FA]/80">
                      +%{activeStrategy.backtest.mevduat}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D6E4FF]/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeStrategy.backtest.mevduat / 100) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                      className="h-full bg-indigo-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* DETAYLI VARLIK SINIFLARI & ÖRNEK ENSTRÜMAN TABLOSU (Sayfanın Her Yanına Yayılan Full Width Tablo) */}
        <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg clash-title font-[500] tracking-tight">
                Varlık Dağılımı ve Temsili Yatırım Enstrümanları
              </h3>
              <p className="text-xs clash-desc font-[225] text-[#040989]/60 dark:text-[#F5F7FA]/60">
                Her varlık sınıfının portföydeki stratejik misyonu, örnek BIST/TEFAS sembolleri ve risk düzeyi
              </p>
            </div>

            <span className="text-xs clash-subtitle font-[325] px-3 py-1 rounded-xl bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20">
              {activeStrategy.distribution.length} Varlık Sınıfı
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6E4FF]/60 dark:border-white/10 text-[11px] clash-subtitle font-[325] text-[#040989]/60 dark:text-[#F5F7FA]/60 uppercase tracking-wider">
                  <th className="py-3 px-3">Varlık Sınıfı</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Hedef Ağırlık</th>
                  <th className="py-3 px-3">Örnek Semboller & Fonlar</th>
                  <th className="py-3 px-3">Stratejik Misyonu</th>
                  <th className="py-3 px-3">Risk Puanı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D6E4FF]/40 dark:divide-white/5 text-xs">
                {activeStrategy.distribution.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#D6E4FF]/20 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#040989]/70 dark:text-[#F5F7FA]/70 clash-desc font-[225]">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#D6E4FF]/50 dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <span className="font-numbers font-[500] text-[#040989] dark:text-[#F5F7FA]">
                          %{item.percentage}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {item.sampleAssets.map((sym, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-[#F5F7FA] dark:bg-white/10 border border-[#D6E4FF]/60 dark:border-white/20 text-[10px] clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA]"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[#040989]/80 dark:text-[#F5F7FA]/80 clash-desc font-[225] max-w-xs">
                      {item.role}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
