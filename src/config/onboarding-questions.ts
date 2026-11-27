// src/config/onboarding-questions.ts
// FinAi Çok Katmanlı Portföy, 10-Aşamalı Karar Motoru, Sektör/Fon Getirileri & Gelecek Kazanç Simülasyonu Mimarisi

export type FinancialLiteracyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SamplePortfolioAllocation {
  name: string;
  symbol?: string;
  percentage: number;
  color: string;
  type: 'STOCK' | 'FUND' | 'GOLD' | 'CASH';
  sector?: string;
  description: string;
}

export interface StrategyProfile {
  id: string;
  title: string;
  badge: string;
  description: string;
  expectedRisk: 'Düşük' | 'Dengeli' | 'Yüksek';
  expectedReturn: string;
  distribution: SamplePortfolioAllocation[];
}

export interface RepresentativeInstrument {
  symbol: string;
  name: string;
  category: 'BIST Hisse' | 'Sektör Hissesi' | 'Borsa Yatırım Fonu' | 'Katılım Fonu' | 'Kıymetli Maden' | 'TLREF / Likit Fon' | 'Temettü Fonu' | 'Teknoloji Fonu';
  allocationWeight: number;
  reason: string;
  sector?: string;
  expectedReturn5Y?: string;
}

export interface StrategySlice {
  name: string;
  shortName: string;
  value: number;
  color: string;
  glow?: string;
  category?: 'STOCK' | 'FUND' | 'GOLD' | 'CASH';
  group?: 'BIST_HISSE' | 'BYF_FON' | 'EMTIA_LIKIT';
  medianReturn1Y?: number;
  medianReturn5Y?: number;
}

export interface SectorReturnItem {
  sector: string;
  count: number;
  ret1M: number;
  ret3M: number;
  ret6M: number;
  ret1Y: number;
  ret5Y: number;
}

export interface FundReturnItem {
  code: string;
  name: string;
  category: string;
  riskValue: number;
  ret1M: number;
  ret3M: number;
  ret6M: number;
  ret1Y: number;
  ret3Y: number;
  ret5Y: number;
}

export interface CompoundProjectionScenario {
  label: string;
  annualRate: number; // Yıllıklaştırılmış bileşik getiri (CAGR)
  month1: { principal: number; profit: number; total: number };
  month3: { principal: number; profit: number; total: number };
  month6: { principal: number; profit: number; total: number };
  year1: { principal: number; profit: number; total: number };
  year3: { principal: number; profit: number; total: number };
  year5: { principal: number; profit: number; total: number };
}

export interface CompoundProjection {
  monthlyContribution: number;
  frequency: string;
  scenarios: {
    median: CompoundProjectionScenario;      // Tavsiye Edilen / Reel
    average: CompoundProjectionScenario;     // İyimser / Boğa
    conservative: CompoundProjectionScenario;// Korumacı / Taban (TLREF/Altın)
  };
}

export interface DynamicStrategyTelemetry {
  id: string;
  title: string;
  codeName: string;
  tagline: string;
  expectedRisk: 'Düşük' | 'Dengeli' | 'Yüksek';
  expectedReturnRange: string;
  volatilityBand: string;
  maxDrawdownTolerance: string;
  rebalanceCycle: string;
  sharpeRatioEst: string;
  analystSummary: string;
  investorPersona: string;
  allocationRationale: string;
  strategicRoadmap: string[];
  isIslamic?: boolean;
  distribution: {
    stock: number;
    fund: number;
    gold: number;
    cash: number;
  };
  macroWeights: {
    stock: number;
    fund: number;
    goldAndCash: number;
  };
  slices: StrategySlice[];
  instruments: RepresentativeInstrument[];
  projection: CompoundProjection;
  sectorStats: SectorReturnItem[];
  fundStats: FundReturnItem[];
}

export interface WizardQuestionOption {
  id: string;
  keyNumber: number;
  title: string;
  description: string;
  deltaWeights: {
    stock: number;
    fund: number;
    gold: number;
    cash: number;
  };
}

export interface WizardQuestion {
  id: string;
  stepNumber: number;
  category: string;
  title: string;
  contextExplanation: string;
  options: WizardQuestionOption[];
  isCustomInputAllowed?: boolean;
}

// -----------------------------------------------------------------------------------------
// 1. REEL VERİLER: BIST SEKTÖRLERİ MEDYAN GETİRİLERİ (625 Hisse Analiz Sonuçları)
// -----------------------------------------------------------------------------------------
export const BIST_SECTORS_MEDIAN: SectorReturnItem[] = [
  { sector: 'Taşımacılık / Havacılık', count: 13, ret1M: 6.99, ret3M: -26.94, ret6M: -25.69, ret1Y: -35.98, ret5Y: 249.77 },
  { sector: 'Elektronik Teknoloji & Savunma', count: 14, ret1M: -5.86, ret3M: -49.28, ret6M: -51.89, ret1Y: -38.48, ret5Y: 221.78 },
  { sector: 'Perakende Satış & Gıda', count: 17, ret1M: -6.88, ret3M: -30.89, ret6M: -28.44, ret1Y: -26.54, ret5Y: 210.37 },
  { sector: 'Finans, Holding & Bankacılık', count: 137, ret1M: -0.55, ret3M: -33.89, ret6M: -40.43, ret1Y: -36.53, ret5Y: 193.61 },
  { sector: 'Enerji-Dışı Mineraller & Çimento', count: 51, ret1M: 5.41, ret3M: -34.94, ret6M: -37.77, ret1Y: -31.99, ret5Y: 173.32 },
  { sector: 'İşlenebilen Endüstriler & Tekstil', count: 76, ret1M: 0.52, ret3M: -41.79, ret6M: -47.03, ret1Y: -37.69, ret5Y: 173.60 },
  { sector: 'Teknoloji & Yazılım Hizmetleri', count: 20, ret1M: -6.16, ret3M: -49.89, ret6M: -51.64, ret1Y: -39.02, ret5Y: 148.42 },
  { sector: 'Dayanıklı Tüketim & Otomotiv', count: 21, ret1M: 3.19, ret3M: -33.71, ret6M: -42.20, ret1Y: -36.32, ret5Y: 165.37 },
  { sector: 'Elektrik, Enerji & Altyapı', count: 41, ret1M: 0.85, ret3M: -42.13, ret6M: -43.57, ret1Y: -23.04, ret5Y: 81.49 },
  { sector: 'Üretici İmalatı & Ağır Sanayi', count: 68, ret1M: 1.31, ret3M: -43.90, ret6M: -50.69, ret1Y: -43.44, ret5Y: 72.26 }
];

// -----------------------------------------------------------------------------------------
// 2. REEL VERİLER: BYF FONLARI GETİRİ VERİLERİ (Tablodaki 38 Fon)
// -----------------------------------------------------------------------------------------
export const BYF_FUNDS_MEDIAN: FundReturnItem[] = [
  { code: 'TLREF', name: 'Para Piyasası / TLREF Fonları', category: 'Para Piyasası', riskValue: 2, ret1M: 2.91, ret3M: 9.39, ret6M: 19.96, ret1Y: 45.89, ret3Y: 160.0, ret5Y: 450.0 },
  { code: 'KTLREF', name: 'Katılım Para Piyasası Fonları', category: 'Katılım TLREF', riskValue: 2, ret1M: 2.92, ret3M: 9.38, ret6M: 19.82, ret1Y: 45.59, ret3Y: 160.0, ret5Y: 450.0 },
  { code: 'TEMETTU', name: 'Temettü Fonları', category: 'Temettü', riskValue: 6, ret1M: -1.29, ret3M: -13.89, ret6M: -10.23, ret1Y: 14.04, ret3Y: 83.59, ret5Y: 623.88 },
  { code: 'SANAYI', name: 'Sanayi ve İmalat Fonları', category: 'Sanayi', riskValue: 7, ret1M: -1.79, ret3M: -20.45, ret6M: -11.15, ret1Y: 28.13, ret3Y: 68.71, ret5Y: 765.28 },
  { code: 'BIST30', name: 'BIST 30 Endeks Fonları', category: 'BIST 30', riskValue: 6, ret1M: -0.81, ret3M: -15.93, ret6M: -11.07, ret1Y: 16.75, ret3Y: 71.09, ret5Y: 636.00 },
  { code: 'KATILIM', name: 'BIST Katılım Fonları', category: 'Katılım Hisse', riskValue: 6, ret1M: -3.20, ret3M: -31.13, ret6M: -20.84, ret1Y: 16.84, ret3Y: 61.32, ret5Y: 726.65 },
  { code: 'ALTIN', name: 'Altın Katılım Fonları', category: 'Kıymetli Maden', riskValue: 6, ret1M: -2.83, ret3M: -15.61, ret6M: -10.30, ret1Y: -2.56, ret3Y: 219.08, ret5Y: 790.88 },
  { code: 'GUMUS', name: 'Gümüş Katılım Fonları', category: 'Kıymetli Maden', riskValue: 7, ret1M: -18.47, ret3M: -33.70, ret6M: -38.07, ret1Y: 0.63, ret3Y: 206.13, ret5Y: 630.15 },
  { code: 'BANKA', name: 'Banka Sektörü Fonları', category: 'Banka', riskValue: 7, ret1M: 3.75, ret3M: -3.86, ret6M: 3.60, ret1Y: 5.44, ret3Y: 107.88, ret5Y: 1054.32 },
  { code: 'TEKNO', name: 'Teknoloji ve İletişim Fonları', category: 'Teknoloji', riskValue: 7, ret1M: -3.55, ret3M: -38.77, ret6M: -38.59, ret1Y: -7.88, ret3Y: 16.91, ret5Y: 308.12 },
  { code: 'ENERJI', name: 'Temiz Enerji Fonları', category: 'Temiz Enerji', riskValue: 7, ret1M: 1.12, ret3M: -58.31, ret6M: -59.18, ret1Y: -50.79, ret3Y: -47.17, ret5Y: 151.78 },
  { code: 'DOLAR', name: 'Dolar / Yabancı Varlık Fonları', category: 'Dolar / Yabancı', riskValue: 6, ret1M: 1.48, ret3M: 5.48, ret6M: 8.81, ret1Y: 19.35, ret3Y: 73.05, ret5Y: 305.41 }
];

// -----------------------------------------------------------------------------------------
// 3. 10 SORULUK YENİ FİNAİ ONBOARDING & MODEL PORTFÖY SORU SETİ
// -----------------------------------------------------------------------------------------
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  // Soru 1: Piyasa Deneyimi & Finansal Okuryazarlık
  {
    id: 'literacy_level',
    stepNumber: 1,
    category: '1. Piyasa Deneyimi',
    title: 'Finansal piyasalar ve yatırım araçlarındaki deneyim seviyenizi nasıl tanımlarsınız?',
    contextExplanation: 'Seviyenize göre portföyün doğrudan hisse ve profesyonel fon dengesi kalibre edilir.',
    options: [
      {
        id: 'beginner',
        keyNumber: 1,
        title: 'Yeni Başlayan',
        description: 'Piyasaya yeni girdim. Sade, güvenli ve profesyonelce yönetilen fon sepeti ağırlıklı olsun.',
        deltaWeights: { stock: -15, fund: 10, gold: 5, cash: 0 }
      },
      {
        id: 'intermediate',
        keyNumber: 2,
        title: 'Gelişmekte Olan',
        description: 'Hisse ve fon alım-satımı yapıyorum. Temel piyasa verilerini ve haber akışını düzenli takip ederim.',
        deltaWeights: { stock: -5, fund: 5, gold: 0, cash: 0 }
      },
      {
        id: 'advanced',
        keyNumber: 3,
        title: 'İleri Düzey',
        description: 'Şirket bilançolarına, çarpanlara (F/K, PD/DD) ve sektörel döngülere hakimim.',
        deltaWeights: { stock: 10, fund: -5, gold: -5, cash: 0 }
      },
      {
        id: 'expert',
        keyNumber: 4,
        title: 'Aktif & Uzman',
        description: 'Piyasayı anlık izlerim; tematik fonları ve yüksek büyüme vadeden hisseleri agresif yönetirim.',
        deltaWeights: { stock: 20, fund: -10, gold: -10, cash: 0 }
      }
    ]
  },
  // Soru 2: Yatırım Zaman Ufku (Vade)
  {
    id: 'investment_horizon',
    stepNumber: 2,
    category: '2. Yatırım Vadesi',
    title: 'Bu portföydeki birikiminizi ne kadarlık bir zaman ufkunda değerlendirmeyi planlıyorsunuz?',
    contextExplanation: 'Vadeniz kısaldıkça parayı risksiz TLREF fonları korur; uzadıkça bileşik getiri hisselere akar.',
    options: [
      {
        id: 'short_1_3m',
        keyNumber: 1,
        title: 'Çok Kısa Vade: 1 - 3 Ay',
        description: 'Kısa sürede nakde dönebilmek önceliğim. Riski minimum, likiditesi yüksek enstrümanlar olsun.',
        deltaWeights: { stock: -20, fund: 10, gold: 10, cash: 0 }
      },
      {
        id: 'medium_3_12m',
        keyNumber: 2,
        title: 'Kısa - Orta Vade: 3 - 12 Ay',
        description: 'Dönemsel piyasa fırsatlarını değerlendirmek ve dengeli getiri sağlamak istiyorum.',
        deltaWeights: { stock: -5, fund: 5, gold: 0, cash: 0 }
      },
      {
        id: 'long_1_3y',
        keyNumber: 3,
        title: 'Orta - Uzun Vade: 1 - 3 Yıl',
        description: 'Enflasyon üzeri reel büyüme hedefliyorum; dönemsel dalgalanmaları rahatlıkla tolere ederim.',
        deltaWeights: { stock: 10, fund: 0, gold: -10, cash: 0 }
      },
      {
        id: 'very_long_3y_plus',
        keyNumber: 4,
        title: 'Gerçek Uzun Vade: 3 Yıl ve Üzeri',
        description: 'Bileşik getirinin gücünden faydalanarak uzun soluklu büyük bir sermaye inşası planlıyorum.',
        deltaWeights: { stock: 20, fund: -5, gold: -15, cash: 0 }
      }
    ]
  },
  // Soru 3: Likidite & Nakit İhtiyacı
  {
    id: 'liquidity_need',
    stepNumber: 3,
    category: '3. Nakit İhtiyacı',
    title: 'Bu portföydeki paranızdan ara dönemlerde nakit çekme ihtiyacınız olabilir mi?',
    contextExplanation: 'Acil nakit ihtiyacı için portföydeki TLREF fonlarının asgari rezerv oranı belirlenir.',
    options: [
      {
        id: 'emergency_needed',
        keyNumber: 1,
        title: 'Acil Nakit İhtiyacım Olabilir',
        description: 'Her an bir miktar nakit çekmem gerekebilir; T+0/T+1 likit rezerv oranı yüksek olsun.',
        deltaWeights: { stock: -15, fund: 10, gold: 5, cash: 0 }
      },
      {
        id: 'rare_small',
        keyNumber: 2,
        title: 'Nadiren Küçük Miktarlar Çekebilirim',
        description: 'Belki yılda 1-2 kez planlı harcamalar için küçük tutarlar çekebilirim.',
        deltaWeights: { stock: -5, fund: 5, gold: 0, cash: 0 }
      },
      {
        id: 'locked_no_withdraw',
        keyNumber: 3,
        title: 'Kesinlikle Para Çekmeyeceğim',
        description: 'Vade sonuna kadar paraya dokunmayacağım; büyüme ve sektör fonlarına odaklanılsın.',
        deltaWeights: { stock: 10, fund: 0, gold: -10, cash: 0 }
      },
      {
        id: 'monthly_dca_add',
        keyNumber: 4,
        title: 'Para Çekmeyecek, Düzenli Ekleme Yapacağım',
        description: 'Her ay düzenli tasarruf aktararak maliyet düşürüp sepetimi büyüteceğim.',
        deltaWeights: { stock: 15, fund: -5, gold: -10, cash: 0 }
      }
    ]
  },
  // Soru 4: Birincil Getiri Modeli & Finansal Misyon
  {
    id: 'strategic_goal',
    stepNumber: 4,
    category: '4. Getiri Modeli',
    title: 'Bu portföyün ana getiri motoru hangi felsefeye dayanmalıdır?',
    contextExplanation: 'Temettü nakit akışı mı, teknoloji büyümesi mi, yoksa enflasyon kalkanı mı ana motor olacak?',
    options: [
      {
        id: 'dividend_yield',
        keyNumber: 1,
        title: 'Düzenli Kâr Payı ve Temettü',
        description: 'Düzenli kâr payı dağıtan BIST Temettü 25 şirketleri ve ZTM fonuyla sürdürülebilir nakit akışı.',
        deltaWeights: { stock: 5, fund: 5, gold: -10, cash: 0 }
      },
      {
        id: 'growth_alpha',
        keyNumber: 2,
        title: 'Sermaye Kazancı ve Yüksek Büyüme',
        description: 'Hızlı büyüyen teknoloji, savunma sanayii ve inovasyon hisseleriyle sermayeyi katlamak.',
        deltaWeights: { stock: 15, fund: 0, gold: -15, cash: 0 }
      },
      {
        id: 'inflation_shield',
        keyNumber: 3,
        title: 'Alım Gücünü Koruma',
        description: 'Enflasyona ve kur dalgalanmalarına karşı altın, kıymetli maden ve defansif gıda perakendesi.',
        deltaWeights: { stock: -10, fund: -5, gold: 15, cash: 0 }
      },
      {
        id: 'balanced_hybrid',
        keyNumber: 4,
        title: 'Dengeli Karma Model',
        description: 'Hem düzenli temettü hem de makul sermaye artışı sağlayan dengeli bir karma yapı.',
        deltaWeights: { stock: 5, fund: 5, gold: -10, cash: 0 }
      }
    ]
  },
  // Soru 5: Risk Toleransı & Düşüş Tepkisi
  {
    id: 'volatility_reaction',
    stepNumber: 5,
    category: '5. Risk Toleransı',
    title: 'Piyasalarda beklenmedik sert bir düzeltme yaşanıp portföyünüz %20 gerilediğinde ilk tepkiniz ne olur?',
    contextExplanation: 'Kayıp eşiğiniz, portföyün tavan risk derecesini ve savunma kalkanını belirler.',
    options: [
      {
        id: 'panic_flight_gold',
        keyNumber: 1,
        title: 'Çok Kaygılanırım, Nakit ve Altına Geçerim',
        description: 'Ana paramı kaybetme riski beni huzursuz eder; risk tavanım düşük olsun.',
        deltaWeights: { stock: -15, fund: 0, gold: 15, cash: 0 }
      },
      {
        id: 'uncomfortable_hold',
        keyNumber: 2,
        title: 'Rahatsız Olurum Ama Plana Sadık Kalırım',
        description: 'Dalgalanmalar canımı sıksa da stratejimi bozmam, piyasanın toparlanmasını izlerim.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'calm_accept_risk',
        keyNumber: 3,
        title: 'Sakinliğimi Korurum, Dalgalanma Olağandır',
        description: 'Fiyat hareketlerinin geçici olduğunu bilir, uzun vadeli hedeflerime odaklanırım.',
        deltaWeights: { stock: 10, fund: 0, gold: -10, cash: 0 }
      },
      {
        id: 'aggressive_buy_dip',
        keyNumber: 4,
        title: 'Fırsat Olarak Görürüm, Ek Alım Yaparım',
        description: 'Geri çekilmeleri iskontolu alış fırsatı olarak değerlendirip agresif maliyet düşürürüm.',
        deltaWeights: { stock: 20, fund: -5, gold: -15, cash: 0 }
      }
    ]
  },
  // Soru 6: Faiz & Katılım Hassasiyeti (İkili Filtre)
  {
    id: 'interest_sensitivity',
    stepNumber: 6,
    category: '6. Katılım Finans',
    title: 'Yatırımlarınızda katılım finans ilkelerine (faizsiz borsa ve helal getiri standartları) uygunluk hassasiyetiniz bulunuyor mu?',
    contextExplanation: 'Katılım tercihi, tüm konvansiyonel banka ve faizli TLREF fonlarını otomatik olarak filtreler.',
    options: [
      {
        id: 'islamic_sensitive',
        keyNumber: 1,
        title: 'Evet, Katılım Esaslı',
        description: '',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'conventional',
        keyNumber: 2,
        title: 'Hayır, Genel Piyasa',
        description: '',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      }
    ]
  },
  // Soru 7: Portföy Takip Sıklığı & Rebalance Döngüsü
  {
    id: 'rebalance_cycle',
    stepNumber: 7,
    category: '7. Takip Sıklığı',
    title: 'Portföyünüzün performansını ve piyasa dağılımını ne sıklıkla gözden geçirmek istersiniz?',
    contextExplanation: 'Sistemin size göndereceği dengeleme takvimini ve portföyün dinamizmini belirler.',
    options: [
      {
        id: 'freq_biweekly',
        keyNumber: 1,
        title: '15 Günlük Dinamik İnceleme',
        description: 'Piyasa hareketlerine karşı çevik kalmak ve fırsatları anlık değerlendirmek isterim.',
        deltaWeights: { stock: 10, fund: -5, gold: -5, cash: 0 }
      },
      {
        id: 'freq_monthly',
        keyNumber: 2,
        title: 'Aylık Düzenli Dengeleme',
        description: 'Her ay düzenli olarak ağırlıkları gözden geçirmek en ideal disiplindir.',
        deltaWeights: { stock: 5, fund: 0, gold: -5, cash: 0 }
      },
      {
        id: 'freq_quarterly',
        keyNumber: 3,
        title: 'Çeyreklik Bilanço Dönemleri',
        description: 'Şirketlerin finansal bilanço dönemlerine göre 3 ayda bir dengeleme yapmak bana yeterlidir.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'freq_passive_yearly',
        keyNumber: 4,
        title: 'Uzun Vadeli ve Pasif',
        description: 'Zamanım kısıtlı; sepeti kurup kendi haline bırakmak, bakım gerektirmeyen fonlara emanet etmek isterim.',
        deltaWeights: { stock: -10, fund: 10, gold: 0, cash: 0 }
      }
    ]
  },
  // Soru 8: Döviz & Kıymetli Maden Kalkanı Ağırlığı
  {
    id: 'currency_gold_shield',
    stepNumber: 8,
    category: '8. Döviz & Altın Kalkanı',
    title: 'Portföyünüzde Türk Lirası varlıkların yanında döviz ve kıymetli maden (altın, gümüş, dolar) kalkanının payı ne kadar olmalıdır?',
    contextExplanation: 'Tablonuzdaki FUS Dolar, ZGD Altın ve FGS Gümüş fonlarının sepet içindeki net payını kilitler.',
    options: [
      {
        id: 'shield_strong_35',
        keyNumber: 1,
        title: 'Güçlü Kalkan: %25 - %35',
        description: 'Kur şoklarına ve jeopolitik krizlere karşı paramın önemli bir kısmı altın, gümüş ve dolarda dursun.',
        deltaWeights: { stock: -10, fund: -5, gold: 15, cash: 0 }
      },
      {
        id: 'shield_moderate_20',
        keyNumber: 2,
        title: 'Makul Sigorta: %15 - %20',
        description: 'Olası piyasa çalkantılarına karşı makul bir altın ve kıymetli maden dengesi yeterlidir.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'shield_symbolic_10',
        keyNumber: 3,
        title: 'Sembolik Koruma: %5 - %10',
        description: 'Kıymetli madeni minimumda tutalım; asıl getiri şirketlerin büyümesinde gerçekleşir.',
        deltaWeights: { stock: 10, fund: 0, gold: -10, cash: 0 }
      },
      {
        id: 'shield_zero',
        keyNumber: 4,
        title: 'Sıfır veya Minimum Kalkan',
        description: 'Emtia veya döviz taşımak istemem; paramın tamamı borsa şirketlerinde ve hisse fonlarında çalışsın.',
        deltaWeights: { stock: 15, fund: 0, gold: -15, cash: 0 }
      }
    ]
  },
  // Soru 9: Sektörel & Tematik Tercih
  {
    id: 'sector_thematic_focus',
    stepNumber: 9,
    category: '9. Sektörel Öncelik',
    title: 'Portföyünüzün hisse ve fon tarafında önümüzdeki dönemde hangi sektörün lokomotif olmasını istersiniz?',
    contextExplanation: 'ZPT Teknoloji, BLH Banka, ZPP Sanayi, DJA Enerji ve OPK GYO fonlarının ağırlıklarını dağıtır.',
    options: [
      {
        id: 'sec_tech_energy',
        keyNumber: 1,
        title: 'Teknoloji, Bilişim ve Temiz Enerji',
        description: 'Yapay zekâ, yazılım ve yeşil enerji dönüşümü vadeden yüksek büyüme şirketleri ve ZPT/DJA fonları.',
        deltaWeights: { stock: 5, fund: 0, gold: -5, cash: 0 }
      },
      {
        id: 'sec_industry_export',
        keyNumber: 2,
        title: 'Sanayi, Üretim ve İhracat Liderleri',
        description: 'Reel üretim gücüne sahip köklü sanayi devleri, savunma sanayii ve ZPP banka dışı fonu.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'sec_banking_finance',
        keyNumber: 3,
        title: 'Bankacılık ve Finans Sektörü',
        description: 'Faiz ve likidite döngüsünden nemalanan büyük bankalar, holdingler ve BLH/ZBP likit banka fonu.',
        deltaWeights: { stock: 5, fund: 0, gold: -5, cash: 0 }
      },
      {
        id: 'sec_reit_dividend',
        keyNumber: 4,
        title: 'Gayrimenkul, Temettü ve Perakende',
        description: 'Her dönem nakit üreten temel gıda perakendesi, ZTM temettü fonu ve OPK kâr payı ödeyen GYO fonu.',
        deltaWeights: { stock: -5, fund: 5, gold: 0, cash: 0 }
      }
    ]
  },
  // Soru 10: Yatırım Sıklığı & Bütçe Planı
  {
    id: 'investment_budget_plan',
    stepNumber: 10,
    category: '10. Yatırım Sıklığı ve Bütçe',
    title: 'Bu portföy için yatırım sıklığınız ve ayırmayı düşündüğünüz bütçe nedir?',
    contextExplanation: 'FinAi bileşik getiri motoru bu tutarı baz alarak 1, 3 ve 5 yıllık gelecek kazanç simülasyonunu çizer.',
    isCustomInputAllowed: true,
    options: [
      {
        id: 'freq_single',
        keyNumber: 1,
        title: 'Tek Seferlik Yatırım',
        description: 'Tek seferde toplu sermaye girişi yaparak uzun vadeli büyümesini izleyeceğim.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'freq_weekly',
        keyNumber: 2,
        title: 'Her Hafta',
        description: 'Haftalık düzenli tasarruf ekleyerek disiplinli birikim yapacağım.',
        deltaWeights: { stock: 5, fund: 0, gold: -5, cash: 0 }
      },
      {
        id: 'freq_monthly',
        keyNumber: 3,
        title: 'Her Ay',
        description: 'Her ay düzenli ekleme yaparak maliyet düşüreceğim.',
        deltaWeights: { stock: 5, fund: 0, gold: -5, cash: 0 }
      },
      {
        id: 'freq_quarterly',
        keyNumber: 4,
        title: '3 Ayda Bir',
        description: 'Çeyreklik bilanço ve kâr payı dönemlerinde ek alım yapacağım.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'freq_semiannual',
        keyNumber: 5,
        title: '6 Ayda Bir',
        description: 'Yarıyıl periyotlarıyla planlı sermaye eklemesi gerçekleştireceğim.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      }
    ]
  }
];

// -----------------------------------------------------------------------------------------
// 4. BİLEŞİK GETİRİ VE GELECEK KAZANÇ SİMÜLASYON HESAPLAYICISI
// Formül: FV = PMT * [ ((1 + r)^n - 1) / r ]
// -----------------------------------------------------------------------------------------
export function calculateFutureCompoundWealth(
  monthlyContribution: number,
  annualReturnRate: number // Örn: 0.465 (Yıllık %46.5 Medyan Getiri)
) {
  const pmt = Math.max(500, monthlyContribution);
  // Aylık eşlenik getiri oranı
  const monthlyRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;

  function calcForMonths(months: number) {
    const fv = pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const principal = pmt * months;
    const profit = Math.max(0, fv - principal);
    return {
      principal: Math.round(principal),
      profit: Math.round(profit),
      total: Math.round(fv)
    };
  }

  return {
    month1: calcForMonths(1),
    month3: calcForMonths(3),
    month6: calcForMonths(6),
    year1: calcForMonths(12),
    year3: calcForMonths(36),
    year5: calcForMonths(60)
  };
}

// -----------------------------------------------------------------------------------------
// 5. DİNAMİK STRATEJİ VE TELEMETRİ HESAPLAYICI (10 Soru Entegrasyonu)
// -----------------------------------------------------------------------------------------
export function calculateDynamicStrategy(answers: Record<string, string>): DynamicStrategyTelemetry {
  const isIslamic = answers['interest_sensitivity'] === 'islamic_sensitive';

  // 1. BAŞLANGIÇ BİAS MATRİSİ (NÖTR NOKTA: %40 Hisse, %40 Fon, %20 Altın/Likit)
  let stock = 40;
  let fund = 40;
  let gold = 20;

  // 2. 10 SORUNUN DELTA AĞIRLIKLARININ KÜMÜLATİF EKLENMESİ
  WIZARD_QUESTIONS.forEach(question => {
    const answerId = answers[question.id];
    if (answerId) {
      const option = question.options.find(opt => opt.id === answerId);
      if (option && option.deltaWeights) {
        stock += option.deltaWeights.stock || 0;
        fund += option.deltaWeights.fund || 0;
        gold += option.deltaWeights.gold || 0;
      }
    }
  });

  // 3. GÜVENLİK BARİYERLERİ (CLAMP)
  stock = Math.max(15, Math.min(70, stock));
  fund = Math.max(15, Math.min(65, fund));
  gold = Math.max(5, Math.min(40, gold));

  // 4. %100 NORMALİZASYON
  const total = stock + fund + gold;
  stock = Math.round((stock / total) * 100);
  fund = Math.round((fund / total) * 100);
  gold = 100 - (stock + fund);

  // 5. SEKTÖREL VE FON TÜRÜ AĞIRLIKLARI (Soru 9 ve Soru 4 Tercihleri)
  const sectorFocus = answers['sector_thematic_focus'] || 'sec_tech_energy';
  const goalFocus = answers['strategic_goal'] || 'dividend_yield';
  const shieldFocus = answers['currency_gold_shield'] || 'shield_moderate_20';

  // Hisse içi sektör dilimleri
  let stockSector1Name = "Sanayi & Savunma Hisseleri";
  let stockSector1Weight = Math.round(stock * 0.40);
  let stockSector2Name = "Teknoloji & Bilişim Hisseleri";
  let stockSector2Weight = Math.round(stock * 0.35);
  let stockSector3Name = "Ulaştırma & Havacılık Hisseleri";
  let stockSector3Weight = stock - (stockSector1Weight + stockSector2Weight);

  if (sectorFocus === 'sec_banking_finance') {
    stockSector1Name = isIslamic ? "Katılım Finans & Holding Hisseleri" : "Bankacılık & Finans Hisseleri";
    stockSector2Name = "Holding & Sanayi Hisseleri";
    stockSector3Name = "Perakende & Tüketim Hisseleri";
  } else if (sectorFocus === 'sec_reit_dividend') {
    stockSector1Name = isIslamic ? "Katılım Temettü Hisseleri" : "Temettü 25 Hisseleri";
    stockSector2Name = "Gıda Perakendesi Hisseleri";
    stockSector3Name = "Gayrimenkul Yatırım Ortaklıkları (GYO)";
  } else if (sectorFocus === 'sec_industry_export') {
    stockSector1Name = isIslamic ? "Katılım Ağır Sanayi Liderleri" : "İhracatçı Sanayi Liderleri";
    stockSector2Name = "Savunma Sanayii & Teknoloji";
    stockSector3Name = "Otomotiv & Yan Sanayi Hisseleri";
  }

  // Fon içi tür dilimleri
  let fundSlice1Name = "Para Piyasası Fonları";
  let fundSlice1Weight = Math.round(fund * 0.35);
  let fundSlice2Name = "Temettü Fonları";
  let fundSlice2Weight = Math.round(fund * 0.35);
  let fundSlice3Name = "Sanayi & Büyüme Fonları";
  let fundSlice3Weight = fund - (fundSlice1Weight + fundSlice2Weight);

  if (isIslamic) {
    fundSlice1Name = "Katılım Para Piyasası Fonları";
    fundSlice2Name = "Katılım 30 Fonları";
    fundSlice3Name = "Katılım Eşit Ağırlık Fonları";
  } else if (sectorFocus === 'sec_tech_energy') {
    fundSlice1Name = "Teknoloji ve İletişim Fonları";
    fundSlice2Name = "Para Piyasası Fonları";
    fundSlice3Name = "Temiz Enerji Fonları";
  } else if (sectorFocus === 'sec_banking_finance') {
    fundSlice1Name = "Banka Sektörü Fonları";
    fundSlice2Name = "Para Piyasası Fonları";
    fundSlice3Name = "BIST 30 Endeks Fonları";
  }

  // Altın / Döviz Kalkanı Dilimi
  const goldSliceName = "Kıymetli Madenler";

  // Çok Katmanlı Daire Grafiği Dilimleri
  const slices: StrategySlice[] = [
    {
      name: stockSector1Name,
      shortName: stockSector1Name.split(" ")[0],
      value: stockSector1Weight,
      color: "#004BFA",
      glow: "rgba(0, 75, 250, 0.4)",
      group: 'BIST_HISSE',
      category: 'STOCK',
      medianReturn1Y: -35.98,
      medianReturn5Y: 249.77
    },
    {
      name: stockSector2Name,
      shortName: stockSector2Name.split(" ")[0],
      value: stockSector2Weight,
      color: "#5B80FF",
      glow: "rgba(91, 128, 255, 0.4)",
      group: 'BIST_HISSE',
      category: 'STOCK',
      medianReturn1Y: -38.48,
      medianReturn5Y: 221.78
    },
    {
      name: stockSector3Name,
      shortName: stockSector3Name.split(" ")[0],
      value: stockSector3Weight,
      color: "#818CF8",
      glow: "rgba(129, 140, 248, 0.4)",
      group: 'BIST_HISSE',
      category: 'STOCK',
      medianReturn1Y: -26.54,
      medianReturn5Y: 210.37
    },
    {
      name: fundSlice1Name,
      shortName: fundSlice1Name.split(" ")[0],
      value: fundSlice1Weight,
      color: "#10B981",
      glow: "rgba(16, 185, 129, 0.4)",
      group: 'BYF_FON',
      category: 'FUND',
      medianReturn1Y: 45.59,
      medianReturn5Y: 450.00
    },
    {
      name: fundSlice2Name,
      shortName: fundSlice2Name.split(" ")[0],
      value: fundSlice2Weight,
      color: "#059669",
      glow: "rgba(5, 150, 105, 0.4)",
      group: 'BYF_FON',
      category: 'FUND',
      medianReturn1Y: 14.04,
      medianReturn5Y: 623.88
    },
    {
      name: fundSlice3Name,
      shortName: fundSlice3Name.split(" ")[0],
      value: fundSlice3Weight,
      color: "#34D399",
      glow: "rgba(52, 211, 153, 0.4)",
      group: 'BYF_FON',
      category: 'FUND',
      medianReturn1Y: 28.13,
      medianReturn5Y: 765.28
    },
    {
      name: goldSliceName,
      shortName: "Altın/Emtia",
      value: gold,
      color: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.4)",
      group: 'EMTIA_LIKIT',
      category: 'GOLD',
      medianReturn1Y: -0.75,
      medianReturn5Y: 790.88
    }
  ];

  // Temsili Örnek Enstrümanlar
  const instruments: RepresentativeInstrument[] = isIslamic ? [
    { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'BIST Hisse', allocationWeight: 14, reason: 'Katılım Endeksi düşük F/K küresel ulaştırma lideri', sector: 'Taşımacılık' },
    { symbol: 'ASELS', name: 'Aselsan Elektronik', category: 'BIST Hisse', allocationWeight: 16, reason: 'Katılım uyumlu stratejik savunma ve AR-GE sanayii', sector: 'Savunma Sanayii' },
    { symbol: 'BIMAS', name: 'BİM Mağazalar', category: 'BIST Hisse', allocationWeight: 10, reason: 'Krizlere dayanıklı defansif nakit akışı', sector: 'Perakende & Gıda' },
    { symbol: 'ZTK', name: 'BIST TLREFK Katılım Fonu', category: 'Katılım Fonu', allocationWeight: fundSlice1Weight, reason: 'Faizsiz likit rezerv ve risksiz kupon getirisi' },
    { symbol: 'ZKP', name: 'BIST Katılım 30 Fonu', category: 'Katılım Fonu', allocationWeight: fundSlice2Weight, reason: 'BIST Katılım 30 endeksi piyasa getirisi' },
    { symbol: 'ZGD', name: 'Ziraat Portföy Altın Katılım', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Faizsiz fiziki altın koruması' }
  ] : [
    { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'BIST Hisse', allocationWeight: 14, reason: 'Küresel ulaştırma pazar payı ve döviz bazlı nakit akışı', sector: 'Taşımacılık' },
    { symbol: 'ASELS', name: 'Aselsan Elektronik', category: 'BIST Hisse', allocationWeight: 16, reason: 'Savunma sanayiinde yüksek teknoloji ve ihracat', sector: 'Savunma Sanayii' },
    { symbol: 'FROTO', name: 'Ford Otosan', category: 'BIST Hisse', allocationWeight: 10, reason: 'Güçlü ihracat geliri ve otomotiv sanayii liderliği', sector: 'Otomotiv Sanayi' },
    { symbol: 'ZTR', name: 'BIST TLREF Endeksi Fonu', category: 'TLREF / Likit Fon', allocationWeight: fundSlice1Weight, reason: 'Yıllık %45+ risksiz faiz getirisi ve anında likidite' },
    { symbol: 'ZTM', name: 'BIST Temettü 25 Fonu', category: 'Temettü Fonu', allocationWeight: fundSlice2Weight, reason: 'Düzenli kâr payı dağıtan sanayi liderleri sepeti' },
    { symbol: 'ZGD', name: 'Ziraat Altın Katılım Fonu', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Enflasyon ve jeopolitik şoklara karşı emtia zırhı' }
  ];

  // 6. 10. SORU BÜTÇESİ & BİLEŞİK GETİRİ SİMÜLASYONU
  let monthlyBudget = 10000;
  const rawBudgetAnswer = answers['investment_budget_plan'];
  const customBudgetVal = Number(answers['custom_amount_input'] || answers['investment_amount']);

  if (!isNaN(customBudgetVal) && customBudgetVal > 0) {
    monthlyBudget = Math.max(500, customBudgetVal);
  } else if (rawBudgetAnswer && !isNaN(Number(rawBudgetAnswer))) {
    monthlyBudget = Math.max(500, Number(rawBudgetAnswer));
  } else if (rawBudgetAnswer === 'budget_25k_monthly') {
    monthlyBudget = 25000;
  } else if (rawBudgetAnswer === 'budget_50k_monthly') {
    monthlyBudget = 50000;
  }

  let freqLabel = 'Her Ay Düzenli';
  if (rawBudgetAnswer === 'freq_single') freqLabel = 'Tek Seferlik';
  else if (rawBudgetAnswer === 'freq_weekly') freqLabel = 'Her Hafta Düzenli';
  else if (rawBudgetAnswer === 'freq_monthly') freqLabel = 'Her Ay Düzenli';
  else if (rawBudgetAnswer === 'freq_quarterly') freqLabel = '3 Ayda Bir Düzenli';
  else if (rawBudgetAnswer === 'freq_semiannual') freqLabel = '6 Ayda Bir Düzenli';

  // 3 Senaryo Bileşik Yıllıklandırılmış Oranları (CAGR):
  // 1. MEDYAN (Reel Senaryo): Portföy bileşenlerinin medyan bileşik getirisi ~ %46.5
  // 2. ORTALAMA (İyimser Boğa): Boğa piyasasında sektörlerin rallisi ~ %65.0
  // 3. KORUMACI (TLREF & Altın): Risksiz TLREF ve Altın kalkanı ~ %38.0
  const medianSim = calculateFutureCompoundWealth(monthlyBudget, 0.465);
  const averageSim = calculateFutureCompoundWealth(monthlyBudget, 0.650);
  const conservativeSim = calculateFutureCompoundWealth(monthlyBudget, 0.380);

  const projection: CompoundProjection = {
    monthlyContribution: monthlyBudget,
    frequency: freqLabel,
    scenarios: {
      median: {
        label: 'FinAi Reel Beklenti (Medyan)',
        annualRate: 46.5,
        month1: medianSim.month1,
        month3: medianSim.month3,
        month6: medianSim.month6,
        year1: medianSim.year1,
        year3: medianSim.year3,
        year5: medianSim.year5
      },
      average: {
        label: 'İyimser Boğa Senaryosu (Ortalama)',
        annualRate: 65.0,
        month1: averageSim.month1,
        month3: averageSim.month3,
        month6: averageSim.month6,
        year1: averageSim.year1,
        year3: averageSim.year3,
        year5: averageSim.year5
      },
      conservative: {
        label: 'Korumacı / Taban Senaryo (TLREF & Altın)',
        annualRate: 38.0,
        month1: conservativeSim.month1,
        month3: conservativeSim.month3,
        month6: conservativeSim.month6,
        year1: conservativeSim.year1,
        year3: conservativeSim.year3,
        year5: conservativeSim.year5
      }
    }
  };

  // Rebalance Döngüsü Metni
  const rebalanceKey = answers['rebalance_cycle'];
  const rebalanceCycleText = rebalanceKey === 'freq_biweekly' 
    ? '15 Günlük Dinamik Dengeleme'
    : rebalanceKey === 'freq_monthly'
    ? 'Aylık Düzenli Dengeleme'
    : rebalanceKey === 'freq_passive_yearly'
    ? '6 Ay - 1 Yıl (Pasif İnceleme)'
    : 'Çeyreklik (3 Aylık Bilanço Dengelemesi)';

  const isAggressive = stock >= 50;
  const isConservative = stock <= 30;

  // 1. KULLANICIYA KENDİSİNİ ANLATAN YATIRIMCI KİMLİĞİ (PSİKOLOJİK AYNA)
  const volKey = answers['volatility_reaction'];
  const horizonKey = answers['investment_horizon'];
  const goalKey = answers['strategic_goal'];

  let investorPersona = "";
  if (volKey === 'dip_buyer') {
    investorPersona = `Piyasanın kısa vadeli gürültüsüne ve dönemsel düzeltmelerine aldırış etmeyen, düşüşleri alım fırsatı olarak gören yüksek vizyonlu bir büyüme yatırımcısısınız. ${
      horizonKey === 'horizon_long' ? '3 yıldan uzun vadeniz' : 'Belirlediğiniz yatırım ufku'
    }, Borsa İstanbul'un reel bileşik büyüme gücünden azami faydalanmanız için en büyük stratejik kozunuzdur.`;
  } else if (volKey === 'panic_sell' || isConservative) {
    investorPersona = `Anapara güvenliğini ve finansal huzuru her şeyin üzerinde tutan, sert sermaye erimelerine karşı temkinli bir yatırımcısınız. Sizin için en doğru yatırım modeli, getiri peşinde koşarken uykunuzu kaçırmayan; likit fonlar ve kıymetli maden kalkanıyla şoklara karşı tam zırhlanmış bir portföydür.`;
  } else {
    investorPersona = `Sermayenizin reel değerini enflasyon karşısında korurken istikrarlı büyüme hedefleyen rasyonel ve dengeli bir yatırımcısınız. %15'in üzerindeki dalgalanmalarda psikolojik konfor arayışınız, hisse ve fon dengesini optimize etmeyi zorunlu kılar.`;
  }

  // 2. NEDEN BU DAĞILIM? (SEPET MÜHENDİSLİĞİ VE GEREKÇELERİ)
  const allocationRationale = isIslamic
    ? `Faizsiz finans ve katılım hassasiyetiniz gereği geleneksel faizli enstrümanlar tamamen elenmiştir. Portföyünüzün %${stock}'lik ana motoru BIST Katılım Endeksi'nin sağlam ve borçluluğu düşük şirketlerine tahsis edildi. Bireysel hisse riskini seyreltmek için %${fund}'lik dilim ZTK Katılım Likit ve ZKP Katılım 30 fonlarıyla çeşitlendirildi. Seçtiğiniz %${gold}'lik fiziki altın güvencesi ise piyasa türbülanslarında portföyünüzün psikolojik kalkanı olarak konumlandırıldı.`
    : `Bileşik getiri hedefinize ulaşabilmeniz için portföyün %${stock}'lik ana omurgası BIST'in lider sanayi, teknoloji ve ihracatçı hisselerine ayrıldı. Hisse senedi piyasasının dönemsel dalgalanmalarını yumuşatmak ve piyasa medyan getirisini sabitlemek adına %${fund}'lik bölüm borsa yatırım fonlarına (BYF) dağıtıldı. Portföyünüzdeki %${gold}'lik altın ve likit rezerv ise olası jeopolitik risklerde ve piyasa şoklarında anaparanızın güvence sigortasıdır.`;

  // 3. FİNAİ STRATEJİK YOL HARİTASI (NASIL BİR YOL İZLEMELİSİN?)
  const strategicRoadmap: string[] = [
    `Aylık ${monthlyBudget.toLocaleString('tr-TR')} ₺ Düzenli Tasarruf Disiplini (DCA): Piyasa yükselirken de düşerken de belirlediğiniz periyotta düzenli alım yaparak dalgalanmaları avantaja çevirin. Asla piyasa zamanlaması yapmaya çalışmayın.`,
    `Düşüş Refleksi ve Psikolojik Soğukkanlılık: BIST düzeltmelerinde asla panikle satış yapmayın. Portföyünüzdeki %${gold}'lik kıymetli maden ve fon tamponu bu dalgalanmaları emmek için tasarlandı.`,
    `${rebalanceCycleText}: Varlık sınıflarından biri aşırı değer kazandığında kâr realize edip geride kalan dilimi tamamlayarak sepetin %${stock}/%${fund}/%${gold} hedef oranlarını koruyun.`
  ];

  return {
    id: isIslamic 
      ? (isAggressive ? 'advanced_islamic' : isConservative ? 'beginner_islamic' : 'intermediate_islamic')
      : (isAggressive ? 'advanced_alpha' : isConservative ? 'beginner_capital_shield' : 'intermediate_balanced'),
    title: isIslamic 
      ? 'FinAi Katılım Çok Katmanlı Model Portföyü' 
      : 'FinAi Çok Katmanlı Hibrit Model Portföyü',
    codeName: isIslamic ? 'FINAI_ISLAMIC_MULTI_LAYER' : 'FINAI_HYBRID_MULTI_LAYER',
    tagline: `10 soruluk tercihlerinize göre; %${stock} BIST Hissesi, %${fund} Borsa Yatırım Fonu ve %${gold} Altın/Emtia ile optimize edildi.`,
    expectedRisk: isAggressive ? 'Yüksek' : isConservative ? 'Düşük' : 'Dengeli',
    expectedReturnRange: isAggressive ? '%55 - %85' : isConservative ? '%38 - %50' : '%45 - %68',
    volatilityBand: isAggressive ? '±%18' : isConservative ? '±%8' : '±%13',
    maxDrawdownTolerance: isAggressive ? '-%22' : isConservative ? '-%9' : '-%15',
    rebalanceCycle: rebalanceCycleText,
    sharpeRatioEst: isConservative ? '1.92' : isAggressive ? '1.45' : '1.74',
    analystSummary: `${investorPersona} ${allocationRationale}`,
    investorPersona,
    allocationRationale,
    strategicRoadmap,
    isIslamic,
    distribution: { stock, fund, gold, cash: 0 },
    macroWeights: { stock, fund, goldAndCash: gold },
    slices,
    instruments,
    projection,
    sectorStats: BIST_SECTORS_MEDIAN,
    fundStats: BYF_FUNDS_MEDIAN
  };
}

// -----------------------------------------------------------------------------------------
// 6. GERİYE DÖNÜK UYUMLULUK PROFİLLERİ (Legacy Fallback)
// -----------------------------------------------------------------------------------------
export const STRATEGY_PROFILES: Record<string, StrategyProfile> = {
  beginner: {
    id: 'beginner',
    title: 'Dengeli & Koruma Odaklı Başlangıç Portföyü',
    badge: 'Yeni Yatırımcı Tavsiyesi',
    description: 'Enflasyona karşı koruma sağlarken, TLREF fonu ve defansif sektör hisseleriyle sermayeyi korumayı hedefler.',
    expectedRisk: 'Düşük',
    expectedReturn: '%38 - %50 Yıllık Hedef',
    distribution: [
      { name: 'BIST TLREF Likit Fonu', percentage: 40, color: '#10B981', type: 'CASH', description: 'Risksiz getiri ve acil likidite havuzu' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 35, color: '#F59E0B', type: 'GOLD', description: 'Enflasyona karşı reel değer koruma' },
      { name: 'Defansif Perakende Hisseleri', percentage: 15, color: '#004BFA', type: 'STOCK', description: 'Krizlere dayanıklı temel tüketim şirketleri' },
      { name: 'Sanayi & İhracat Hisseleri', percentage: 10, color: '#5B80FF', type: 'STOCK', description: 'Güçlü ihracatçı köklü sanayi liderleri' }
    ]
  },
  intermediate: {
    id: 'intermediate',
    title: 'Büyüme & Sektörel Dengeli Portföy',
    badge: 'Optimum Büyüme',
    description: 'Öncü sanayi, teknoloji ve BIST 30 fonlarıyla büyürken altın ve TLREF fonu ile riski dengeler.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%45 - %68 Yıllık Hedef',
    distribution: [
      { name: 'BIST Doğrudan Hisseleri', percentage: 40, color: '#004BFA', type: 'STOCK', description: 'Sektör lideri kurumsal hisseler' },
      { name: 'Borsa Yatırım Fonları (BYF)', percentage: 40, color: '#10B981', type: 'FUND', description: 'Temettü, sanayi ve TLREF fon sepeti' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 20, color: '#F59E0B', type: 'GOLD', description: 'Küresel dalgalanmalara karşı portföy sigortası' }
    ]
  },
  advanced: {
    id: 'advanced',
    title: 'Dinamik & Yüksek Getiri Odaklı Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Büyüme potansiyeli yüksek teknoloji, savunma sanayii ve tematik fonlarla agresif sermaye artışı hedefler.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%55 - %85 Yıllık Hedef',
    distribution: [
      { name: 'Teknoloji & Bilişim Hisseleri', percentage: 35, color: '#004BFA', type: 'STOCK', description: 'Yüksek büyüme çarpanına sahip teknoloji şirketleri' },
      { name: 'Sanayi & Savunma Hisseleri', percentage: 25, color: '#5B80FF', type: 'STOCK', description: 'Yüksek katma değerli stratejik ihracat sanayii' },
      { name: 'Borsa Yatırım Fonları (ZPT/ZTM)', percentage: 30, color: '#10B981', type: 'FUND', description: 'Tematik ve temettü borsa fonları' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Dönemsel emtia dengesi' }
    ]
  }
};
