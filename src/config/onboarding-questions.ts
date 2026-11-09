// src/config/onboarding-questions.ts
// FinAi Onboarding Soru, Model ve Canlı Telemetri Konfigürasyonu
// Sade, profesyonel finansal mimari

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
  category: 'Sektör Hissesi' | 'Hisse' | 'Kıymetli Maden' | 'Kira Sertifikası Fonu' | 'Katılım Fonu' | 'Likit & PPF' | 'Yatırım Fonu';
  allocationWeight: number;
  reason: string;
  sector?: string;
}

export interface StrategySlice {
  name: string;
  shortName: string;
  value: number;
  color: string;
  glow?: string;
  category?: 'SECTOR_STOCK' | 'GOLD' | 'LEASE_FUND';
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
  isIslamic?: boolean;
  distribution: {
    stock: number;
    fund: number;
    gold: number;
    cash: number;
  };
  slices?: StrategySlice[];
  instruments?: RepresentativeInstrument[];
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
}

// 5 Aşamalı Sade ve Profesyonel Soru Seti (Faiz Hassasiyeti Dahil)
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'literacy_level',
    stepNumber: 1,
    category: 'Piyasa Deneyimi',
    title: 'Finansal piyasalardaki yatırım deneyiminizi nasıl tanımlarsınız?',
    contextExplanation: 'FinAi analiz derinliğini ve terminolojisini seviyenize göre optimize eder.',
    options: [
      {
        id: 'beginner',
        keyNumber: 1,
        title: 'Başlangıç Seviyesi',
        description: 'Finansal piyasalarla yeni tanışıyorum. Sade, anlaşılır ve güvenli bir portföy takibi arıyorum.',
        deltaWeights: { stock: 15, fund: 0, gold: 35, cash: 50 }
      },
      {
        id: 'intermediate',
        keyNumber: 2,
        title: 'Aktif Yatırımcı',
        description: 'Hisse ve piyasa alım-satım deneyimim var. Portföyümü daha profesyonel metriklerle takip etmek istiyorum.',
        deltaWeights: { stock: 45, fund: 0, gold: 25, cash: 30 }
      },
      {
        id: 'advanced',
        keyNumber: 3,
        title: 'İleri Düzey',
        description: 'Finansal tablolara, çarpanlara ve makro dinamiklere hakimim; derinlemesine analitik veriler arıyorum.',
        deltaWeights: { stock: 65, fund: 0, gold: 15, cash: 20 }
      }
    ]
  },
  {
    id: 'investment_horizon',
    stepNumber: 2,
    category: 'Zaman Ufku',
    title: 'Yatırımlarınızı hangi zaman ufkunda tutmayı planlıyorsunuz?',
    contextExplanation: 'Vade tercihiniz, portföyünüzün piyasa dalgalanmalarına karşı dayanım eşiğini belirler.',
    options: [
      {
        id: 'short',
        keyNumber: 1,
        title: 'Kısa Vade (1 - 6 Ay)',
        description: 'Esneklik ve likidite önceliğim. Kısa sürede nakde dönebilmek istiyorum.',
        deltaWeights: { stock: 15, fund: 0, gold: 30, cash: 55 }
      },
      {
        id: 'medium',
        keyNumber: 2,
        title: 'Orta Vade (6 Ay - 2 Yıl)',
        description: 'Dönemsel piyasa dalgalanmalarını tolere edebilir, belirli hedefler doğrultusunda büyüme hedeflerim.',
        deltaWeights: { stock: 45, fund: 0, gold: 25, cash: 30 }
      },
      {
        id: 'long',
        keyNumber: 3,
        title: 'Uzun Vade (2+ Yıl)',
        description: 'Bileşik getirinin gücünden faydalanarak uzun soluklu bir sermaye inşası planlıyorum.',
        deltaWeights: { stock: 65, fund: 0, gold: 15, cash: 20 }
      }
    ]
  },
  {
    id: 'volatility_reaction',
    stepNumber: 3,
    category: 'Risk Yaklaşımı',
    title: 'Genel bir piyasa düşüşünde portföyünüz gerilerse yaklaşımınız ne olur?',
    contextExplanation: 'Dalgalanmalara karşı duruşunuz, huzurlu bir yatırım deneyiminin temelidir.',
    options: [
      {
        id: 'conservative',
        keyNumber: 1,
        title: 'Pozisyonlarımı Korurum',
        description: 'Sermayemi korumak önceliğimdir; dalgalanmanın az olduğu güvenli varlıkları tercih ederim.',
        deltaWeights: { stock: 20, fund: 0, gold: 40, cash: 40 }
      },
      {
        id: 'balanced',
        keyNumber: 2,
        title: 'Piyasanın Toparlanmasını Beklerim',
        description: 'Dalgalanmaların piyasanın olağan bir parçası olduğunu bilir, planıma sadık kalırım.',
        deltaWeights: { stock: 45, fund: 0, gold: 25, cash: 30 }
      },
      {
        id: 'aggressive',
        keyNumber: 3,
        title: 'Kademeli Ek Alım Yaparım',
        description: 'Fiyat geri çekilmelerini iskontolu alım fırsatı olarak değerlendirip maliyetimi dengelerim.',
        deltaWeights: { stock: 65, fund: 0, gold: 15, cash: 20 }
      }
    ]
  },
  {
    id: 'strategic_goal',
    stepNumber: 4,
    category: 'Yatırım Hedefi',
    title: 'Portföyünüzün öncelikli finansal hedefi hangisidir?',
    contextExplanation: 'FinAi algoritması varlık ve sektör önerilerini bu ana eksen etrafında şekillendirir.',
    options: [
      {
        id: 'inflation_shield',
        keyNumber: 1,
        title: 'Alım Gücünü Korumak',
        description: 'Birikimlerimin reel değerini korumak ve enflasyon karşısında değer kaybını önlemek.',
        deltaWeights: { stock: 25, fund: 0, gold: 40, cash: 35 }
      },
      {
        id: 'dividend_yield',
        keyNumber: 2,
        title: 'Düzenli Nakit Akışı',
        description: 'Düzenli kâr payı dağıtan köklü sanayi şirketleriyle sürdürülebilir bir getiri oluşturmak.',
        deltaWeights: { stock: 50, fund: 0, gold: 25, cash: 25 }
      },
      {
        id: 'growth_alpha',
        keyNumber: 3,
        title: 'Sermaye Büyümesi',
        description: 'Yüksek büyüme ve ciro artışı potansiyeline sahip teknoloji ve sanayi hisseleriyle getiri hedeflemek.',
        deltaWeights: { stock: 65, fund: 0, gold: 15, cash: 20 }
      }
    ]
  },
  {
    id: 'interest_sensitivity',
    stepNumber: 5,
    category: 'Faiz & Katılım Hassasiyeti',
    title: 'Yatırımlarınızda faiz hassasiyetiniz (katılım finans ilkeleri) bulunuyor mu?',
    contextExplanation: 'FinAi, hisse seçimlerini ve portföy bileşenlerini İslami finans ve katılım standartlarına göre filtreler.',
    options: [
      {
        id: 'islamic_sensitive',
        keyNumber: 1,
        title: 'Faiz Hassasiyetim Var (Katılım Esaslı)',
        description: 'Portföyüm BIST Katılım Endeksi’ne uygun helal hisseler, altın ve kira sertifikası katılım fonundan oluşsun.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      },
      {
        id: 'conventional',
        keyNumber: 2,
        title: 'Faiz Hassasiyetim Yok (Genel Piyasa)',
        description: 'BIST genel hisseleri, sanayi, teknoloji ve standart kira sertifikası fonları dahil serbestçe değerlendirilsin.',
        deltaWeights: { stock: 0, fund: 0, gold: 0, cash: 0 }
      }
    ]
  }
];

// Yanıt kombinasyonuna göre dinamik telemetri hesaplayıcı
export function calculateDynamicStrategy(answers: Record<string, string>): DynamicStrategyTelemetry {
  const literacy = answers['literacy_level'] || 'intermediate';
  const horizon = answers['investment_horizon'] || 'medium';
  const reaction = answers['volatility_reaction'] || 'balanced';
  const goal = answers['strategic_goal'] || 'dividend_yield';
  const isIslamic = answers['interest_sensitivity'] === 'islamic_sensitive';

  // 1. Ana varlık grubu baz ağırlıkları (Hisse Sektörleri, Altın, Kira Sertifikası Fonu)
  // Fonlar kaldırıldı, sadece Likit yerine Kira Sertifikası Fonu / Katılım Fonu yer alır.
  let stock = 45;
  let gold = 25;
  let leaseFund = 30;

  if (literacy === 'beginner') {
    stock -= 15;
    leaseFund += 10;
    gold += 5;
  } else if (literacy === 'advanced') {
    stock += 15;
    leaseFund -= 10;
    gold -= 5;
  }

  if (horizon === 'short') {
    stock -= 15;
    leaseFund += 15;
  } else if (horizon === 'long') {
    stock += 10;
    leaseFund -= 10;
  }

  if (reaction === 'conservative') {
    stock -= 10;
    gold += 5;
    leaseFund += 5;
  } else if (reaction === 'aggressive') {
    stock += 10;
    gold -= 5;
    leaseFund -= 5;
  }

  if (goal === 'inflation_shield') {
    gold += 10;
    stock -= 5;
    leaseFund -= 5;
  } else if (goal === 'growth_alpha') {
    stock += 10;
    gold -= 5;
    leaseFund -= 5;
  }

  stock = Math.max(20, Math.min(70, stock));
  gold = Math.max(10, Math.min(35, gold));
  leaseFund = Math.max(10, Math.min(45, leaseFund));

  const total = stock + gold + leaseFund;
  stock = Math.round((stock / total) * 100);
  gold = Math.round((gold / total) * 100);
  leaseFund = 100 - (stock + gold);

  // 2. Hisselerden sektörler hissesini yazalım (Sektörel Dağılım)
  const leaseSliceName = isIslamic ? "Kira Sertifikası Katılım Fonu" : "Kira Sertifikası Fonu";
  const leaseShortName = isIslamic ? "Katılım Fonu" : "Kira Fonu";
  const goldSliceName = isIslamic ? "Darphane Altın Sertifikası" : "Kıymetli Madenler (Altın)";

  let slices: StrategySlice[] = [];
  let instruments: RepresentativeInstrument[] = [];

  if (stock >= 55) {
    // Yüksek Risk / Alfa Ağırlıklı
    const techWeight = Math.round(stock * 0.45);
    const indWeight = Math.round(stock * 0.35);
    const energyWeight = stock - (techWeight + indWeight);

    slices = [
      {
        name: isIslamic ? "Katılım Teknoloji & Bilişim Hisseleri" : "Teknoloji & Bilişim Hisseleri",
        shortName: "Teknoloji",
        value: techWeight,
        color: "#8B5CF6",
        glow: "rgba(139, 92, 246, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: isIslamic ? "Katılım Savunma & İleri Sanayi" : "Sanayi & İhracat Hisseleri",
        shortName: "Sanayi",
        value: indWeight,
        color: "#004BFA",
        glow: "rgba(0, 75, 250, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: isIslamic ? "Katılım Enerji Hisseleri" : "Enerji & Sürdürülebilirlik Hisseleri",
        shortName: "Enerji",
        value: energyWeight,
        color: "#10B981",
        glow: "rgba(16, 185, 129, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: goldSliceName,
        shortName: "Altın",
        value: gold,
        color: "#F59E0B",
        glow: "rgba(245, 158, 11, 0.5)",
        category: 'GOLD'
      },
      {
        name: leaseSliceName,
        shortName: leaseShortName,
        value: leaseFund,
        color: isIslamic ? "#059669" : "#60A5FA",
        glow: isIslamic ? "rgba(5, 150, 105, 0.5)" : "rgba(96, 165, 250, 0.5)",
        category: 'LEASE_FUND'
      }
    ];

    instruments = isIslamic ? [
      { symbol: 'ASELS', name: 'Aselsan', category: 'Sektör Hissesi', allocationWeight: 22, reason: 'Katılım Endeksi AR-GE ve döviz bazlı nakit akışı', sector: 'Savunma Sanayii' },
      { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'Sektör Hissesi', allocationWeight: 18, reason: 'Katılım uyumlu küresel pazar payı ve düşük F/K', sector: 'Havacılık & İhracat' },
      { symbol: 'KONTR', name: 'Kontrolmatik', category: 'Sektör Hissesi', allocationWeight: 15, reason: 'Yüksek teknoloji şebeke ve enerji depolama', sector: 'Teknoloji & Enerji' },
      { symbol: 'ALTIN.S1', name: 'Darphane Altın', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Fiziki karşılıklı faizsiz altın koruması' },
      { symbol: 'ZKP', name: 'Kira Sertifikası Katılım Fonu', category: 'Katılım Fonu', allocationWeight: leaseFund, reason: 'Faizsiz sukuk getirisi ve likidite güvencesi' }
    ] : [
      { symbol: 'ASELS', name: 'Aselsan', category: 'Sektör Hissesi', allocationWeight: 22, reason: 'AR-GE ve döviz bazlı nakit akışı', sector: 'Savunma Sanayii' },
      { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'Sektör Hissesi', allocationWeight: 18, reason: 'Küresel pazar payı ve düşük F/K', sector: 'Ulaştırma & Havacılık' },
      { symbol: 'TUPRS', name: 'Tüpraş', category: 'Sektör Hissesi', allocationWeight: 15, reason: 'Güçlü kârlılık ve yüksek temettü verimi', sector: 'Enerji & Rafineri' },
      { symbol: 'GLDTR', name: 'Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Portföy dengeleyici güvence' },
      { symbol: 'KRF', name: 'Kira Sertifikası Fonu', category: 'Kira Sertifikası Fonu', allocationWeight: leaseFund, reason: 'Risksiz kupon getirisi ve likit rezerv' }
    ];

    return {
      id: isIslamic ? 'advanced_islamic' : 'advanced_alpha',
      codeName: isIslamic ? 'ISLAMIC_DYNAMIC_ALPHA' : 'DYNAMIC_ALPHA',
      title: isIslamic ? 'Katılım Dinamik Alfa Portföyü' : 'Büyüme & Alfa Portföyü',
      tagline: isIslamic
        ? 'BIST Katılım Endeksi sektör hisseleri ve kira sertifikası katılım fonuyla endeks üstü helal getiri.'
        : 'Endeks üzeri getiri hedefleyen dinamik sanayi, teknoloji ve enerji sektörü hisseleri modeli.',
      expectedRisk: 'Yüksek',
      expectedReturnRange: '%65 - %90',
      volatilityBand: '±%22',
      maxDrawdownTolerance: '-%24',
      rebalanceCycle: 'Aylık Gözden Geçirme',
      sharpeRatioEst: '1.42',
      analystSummary: isIslamic
        ? 'Katılım kriterlerine tam uyumlu teknoloji ve sanayi hisseleri ile kira sertifikası katılım fonu üzerine kurgulanmıştır.'
        : 'Büyüme potansiyeli yüksek sektör hisseleri ve kira sertifikası fonu likiditesi üzerine kurgulanmıştır.',
      isIslamic,
      distribution: { stock, fund: 0, gold, cash: leaseFund },
      slices,
      instruments
    };
  } else if (stock >= 35) {
    // Dengeli / Optimum Sektörel
    const indWeight = Math.round(stock * 0.45);
    const techWeight = Math.round(stock * 0.35);
    const energyWeight = stock - (indWeight + techWeight);

    slices = [
      {
        name: isIslamic ? "Katılım Sanayi & İhracat Hisseleri" : "Sanayi & İhracat Hisseleri",
        shortName: "Sanayi",
        value: indWeight,
        color: "#004BFA",
        glow: "rgba(0, 75, 250, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: isIslamic ? "Katılım Teknoloji & Bilişim Hisseleri" : "Teknoloji & Bilişim Hisseleri",
        shortName: "Teknoloji",
        value: techWeight,
        color: "#8B5CF6",
        glow: "rgba(139, 92, 246, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: isIslamic ? "Katılım Enerji Hisseleri" : "Enerji Hisseleri",
        shortName: "Enerji",
        value: energyWeight,
        color: "#10B981",
        glow: "rgba(16, 185, 129, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: goldSliceName,
        shortName: "Altın",
        value: gold,
        color: "#F59E0B",
        glow: "rgba(245, 158, 11, 0.5)",
        category: 'GOLD'
      },
      {
        name: leaseSliceName,
        shortName: leaseShortName,
        value: leaseFund,
        color: isIslamic ? "#059669" : "#60A5FA",
        glow: isIslamic ? "rgba(5, 150, 105, 0.5)" : "rgba(96, 165, 250, 0.5)",
        category: 'LEASE_FUND'
      }
    ];

    instruments = isIslamic ? [
      { symbol: 'ASELS', name: 'Aselsan', category: 'Sektör Hissesi', allocationWeight: 18, reason: 'Katılım Endeksi sanayi ve teknoloji liderliği', sector: 'Savunma & İleri Sanayi' },
      { symbol: 'BIMAS', name: 'BİM Mağazalar', category: 'Sektör Hissesi', allocationWeight: 14, reason: 'Krizlere dayanıklı katılım uyumlu perakende nakit akışı', sector: 'Defansif Perakende' },
      { symbol: 'ASTOR', name: 'Astor Enerji', category: 'Sektör Hissesi', allocationWeight: 12, reason: 'Yüksek ihracatlı katılım uyumlu transformatör üretimi', sector: 'Enerji & Şebeke' },
      { symbol: 'ALTIN.S1', name: 'Darphane Altın', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Faizsiz fiziki altın koruması' },
      { symbol: 'ZKP', name: 'Kira Sertifikası Katılım Fonu', category: 'Katılım Fonu', allocationWeight: leaseFund, reason: 'Kira sertifikalarına dayalı faizsiz getiri' }
    ] : [
      { symbol: 'KCHOL', name: 'Koç Holding', category: 'Sektör Hissesi', allocationWeight: 18, reason: 'Çok sektörlü kurumsal sanayi yapısı', sector: 'Holding & Sanayi' },
      { symbol: 'FROTO', name: 'Ford Otosan', category: 'Sektör Hissesi', allocationWeight: 14, reason: 'Güçlü ihracat ve otomotiv sanayii liderliği', sector: 'Otomotiv Sanayii' },
      { symbol: 'ENJSA', name: 'Enerjisa Enerji', category: 'Sektör Hissesi', allocationWeight: 12, reason: 'Düzenli temettü ve şebeke dağıtım nakit akışı', sector: 'Enerji' },
      { symbol: 'ZGOLD', name: 'Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Değer koruma ve jeopolitik sigorta' },
      { symbol: 'KRF', name: 'Kira Sertifikası Fonu', category: 'Kira Sertifikası Fonu', allocationWeight: leaseFund, reason: 'Risksiz kupon getirisi ve günlük likidite' }
    ];

    return {
      id: isIslamic ? 'intermediate_islamic' : 'intermediate_balanced',
      codeName: isIslamic ? 'ISLAMIC_OPTIMAL_BALANCED' : 'OPTIMAL_BALANCED',
      title: isIslamic ? 'Katılım Dengeli Büyüme Portföyü' : 'Dengeli Sektörel Büyüme Portföyü',
      tagline: isIslamic
        ? 'Katılım endeksli sanayi liderleri, altın sertifikası ve kira sertifikası katılım fonu dengesi.'
        : 'Piyasa getirisi ile sermaye korumasını birleştiren sektörel dengeli model.',
      expectedRisk: 'Dengeli',
      expectedReturnRange: '%48 - %70',
      volatilityBand: '±%14',
      maxDrawdownTolerance: '-%15',
      rebalanceCycle: 'Çeyreklik Dengeleme',
      sharpeRatioEst: '1.68',
      analystSummary: isIslamic
        ? 'Köklü katılım endeksi şirketleri, altın sertifikası ve kira sertifikası katılım fonuyla dengelenmiştir.'
        : 'Köklü sanayi liderleri, enerji hisseleri ve kira sertifikası fonu dengesiyle istikrarlı getiri hedefler.',
      isIslamic,
      distribution: { stock, fund: 0, gold, cash: leaseFund },
      slices,
      instruments
    };
  } else {
    // Sermaye Koruma / Defansif
    const retailWeight = Math.round(stock * 0.60);
    const indWeight = stock - retailWeight;

    slices = [
      {
        name: isIslamic ? "Katılım Defansif Perakende Hisseleri" : "Defansif Perakende Hisseleri",
        shortName: "Perakende",
        value: retailWeight,
        color: "#10B981",
        glow: "rgba(16, 185, 129, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: isIslamic ? "Katılım Sanayi Hisseleri" : "Sanayi Hisseleri",
        shortName: "Sanayi",
        value: indWeight,
        color: "#004BFA",
        glow: "rgba(0, 75, 250, 0.5)",
        category: 'SECTOR_STOCK'
      },
      {
        name: goldSliceName,
        shortName: "Altın",
        value: gold,
        color: "#F59E0B",
        glow: "rgba(245, 158, 11, 0.5)",
        category: 'GOLD'
      },
      {
        name: leaseSliceName,
        shortName: leaseShortName,
        value: leaseFund,
        color: isIslamic ? "#059669" : "#60A5FA",
        glow: isIslamic ? "rgba(5, 150, 105, 0.5)" : "rgba(96, 165, 250, 0.5)",
        category: 'LEASE_FUND'
      }
    ];

    instruments = isIslamic ? [
      { symbol: 'ZKP', name: 'Kira Sertifikası Katılım Fonu', category: 'Katılım Fonu', allocationWeight: leaseFund, reason: 'Sukuk ve kira sertifikalarıyla faizsiz risksiz getiri' },
      { symbol: 'ALTIN.S1', name: 'Darphane Altın', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Enflasyona karşı fiziki altın koruması' },
      { symbol: 'BIMAS', name: 'BİM Mağazalar', category: 'Sektör Hissesi', allocationWeight: retailWeight, reason: 'Defansif gıda perakendesi nakit akışı', sector: 'Defansif Perakende' },
      { symbol: 'ASELS', name: 'Aselsan', category: 'Sektör Hissesi', allocationWeight: indWeight, reason: 'Devlet destekli stratejik savunma sanayii', sector: 'Savunma Sanayii' }
    ] : [
      { symbol: 'KRF', name: 'Kira Sertifikası Fonu', category: 'Kira Sertifikası Fonu', allocationWeight: leaseFund, reason: 'Kira sertifikaları ile risksiz düzenli getiri' },
      { symbol: 'ZGOLD', name: 'Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Enflasyona karşı değer koruma' },
      { symbol: 'BIMAS', name: 'BİM Mağazalar', category: 'Sektör Hissesi', allocationWeight: retailWeight, reason: 'Defansif perakende nakit akışı', sector: 'Defansif Perakende' },
      { symbol: 'KCHOL', name: 'Koç Holding', category: 'Sektör Hissesi', allocationWeight: indWeight, reason: 'Köklü sanayi ve ihracat koruması', sector: 'Holding & Sanayi' }
    ];

    return {
      id: isIslamic ? 'beginner_islamic' : 'beginner_capital_shield',
      codeName: isIslamic ? 'ISLAMIC_CAPITAL_SHIELD' : 'CAPITAL_SHIELD',
      title: isIslamic ? 'Katılım Sermaye Koruma Portföyü' : 'Sermaye Koruma Portföyü',
      tagline: isIslamic
        ? 'Düşük volatilite, kira sertifikası katılım fonu ve fiziki altın ile alım gücü koruma.'
        : 'Düşük volatilite, kira sertifikası fonu ve düzenli alım gücü koruma modeli.',
      expectedRisk: 'Düşük',
      expectedReturnRange: '%38 - %52',
      volatilityBand: '±%7',
      maxDrawdownTolerance: '-%7',
      rebalanceCycle: '6 Aylık İnceleme',
      sharpeRatioEst: '1.92',
      analystSummary: isIslamic
        ? 'Kira sertifikası katılım fonu ve altın sertifikası ağırlıklı olup faizsiz prensiplerle sermayeyi korur.'
        : 'Kira sertifikası fonu ve değerli madenler ağırlıklı olup piyasa dalgalanmalarına karşı korur.',
      isIslamic,
      distribution: { stock, fund: 0, gold, cash: leaseFund },
      slices,
      instruments
    };
  }
}

// Geriye Dönük Uyumluluk (Dashboard ve Örnek Portföy Bileşenleri için)
export const STRATEGY_PROFILES: Record<string, StrategyProfile> = {
  beginner: {
    id: 'beginner',
    title: 'Dengeli & Koruma Odaklı Başlangıç Portföyü',
    badge: 'Yeni Yatırımcı Tavsiyesi',
    description: 'Enflasyona karşı koruma sağlarken, kira sertifikası fonu ve defansif sektör hisseleriyle sermayeyi korumayı hedefler.',
    expectedRisk: 'Düşük',
    expectedReturn: '%35 - %50 Yıllık Hedef',
    distribution: [
      { name: 'Kira Sertifikası Fonu', percentage: 40, color: '#60A5FA', type: 'CASH', description: 'Risksiz kupon getirisi ve acil likidite havuzu' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 35, color: '#F59E0B', type: 'GOLD', description: 'Enflasyona karşı reel değer koruma' },
      { name: 'Defansif Perakende Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'Krizlere dayanıklı temel tüketim şirketleri' },
      { name: 'Sanayi & İhracat Hisseleri', percentage: 10, color: '#2563EB', type: 'STOCK', description: 'Güçlü ihracatçı köklü sanayi liderleri' },
    ]
  },
  intermediate: {
    id: 'intermediate',
    title: 'Büyüme & Sektörel Dengeli Portföy',
    badge: 'Optimum Büyüme',
    description: 'Öncü sanayi, teknoloji ve enerji sektörü hisseleriyle büyürken altın ve kira sertifikası fonu ile riski dengeler.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%50 - %75 Yıllık Hedef',
    distribution: [
      { name: 'Sanayi & İhracat Hisseleri', percentage: 30, color: '#2563EB', type: 'STOCK', description: 'İhracat payı yüksek, köklü sanayi liderleri' },
      { name: 'Teknoloji & Bilişim Hisseleri', percentage: 25, color: '#8B5CF6', type: 'STOCK', description: 'Yüksek marjlı yazılım ve dijital teknoloji devleri' },
      { name: 'Enerji & Altyapı Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'Stratejik enerji üretim ve dağıtım şirketleri' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 15, color: '#F59E0B', type: 'GOLD', description: 'Küresel dalgalanmalara karşı portföy sigortası' },
      { name: 'Kira Sertifikası Fonu', percentage: 15, color: '#60A5FA', type: 'CASH', description: 'Fırsat alımları ve risksiz kupon getirisi' },
    ]
  },
  advanced: {
    id: 'advanced',
    title: 'Dinamik & Yüksek Getiri Odaklı Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Büyüme potansiyeli yüksek teknoloji, savunma ve sanayi sektörü hisseleriyle agresif sermaye artışı hedefler.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%70+ Yıllık Hedef',
    distribution: [
      { name: 'Teknoloji & Bilişim Hisseleri', percentage: 35, color: '#8B5CF6', type: 'STOCK', description: 'Yüksek büyüme çarpanına sahip teknoloji şirketleri' },
      { name: 'Savunma & İleri Sanayi Hisseleri', percentage: 25, color: '#EF4444', type: 'STOCK', description: 'Yüksek katma değerli stratejik ihracat sanayii' },
      { name: 'Enerji & Sürdürülebilirlik Hisseleri', percentage: 20, color: '#10B981', type: 'STOCK', description: 'Yeşil enerji dönüşümü ve şebeke altyapısı' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Dönemsel emtia dengesi' },
      { name: 'Kira Sertifikası Fonu', percentage: 10, color: '#60A5FA', type: 'CASH', description: 'Piyasa geri çekilmelerinde taktiksel likit rezerv' },
    ]
  },
  beginner_islamic: {
    id: 'beginner_islamic',
    title: 'Katılım Sermaye Koruma Portföyü',
    badge: 'Katılım Finans',
    description: 'Faizsiz finans ilkelerine %100 uyumlu, kira sertifikası katılım fonu, altın ve katılım hisseleriyle koruma sağlar.',
    expectedRisk: 'Düşük',
    expectedReturn: '%35 - %48 Yıllık Hedef',
    distribution: [
      { name: 'Kira Sertifikası Katılım Fonu', percentage: 40, color: '#059669', type: 'CASH', description: 'Faizsiz sukuk ve kira getirisi' },
      { name: 'Darphane Altın Sertifikası', percentage: 35, color: '#F59E0B', type: 'GOLD', description: 'Fiziki karşılıklı faizsiz altın koruması' },
      { name: 'Katılım Defansif Perakende Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'BIST Katılım uyumlu temel gıda ve perakende' },
      { name: 'Katılım Sanayi Hisseleri', percentage: 10, color: '#2563EB', type: 'STOCK', description: 'Katılım kriterlerini sağlayan sanayi şirketleri' },
    ]
  },
  intermediate_islamic: {
    id: 'intermediate_islamic',
    title: 'Katılım Dengeli Büyüme Portföyü',
    badge: 'Katılım Finans',
    description: 'BIST Katılım Endeksi’ne dahil sanayi, bilişim ve enerji hisseleriyle kira sertifikası katılım fonunu birleştirir.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%50 - %70 Yıllık Hedef',
    distribution: [
      { name: 'Katılım Sanayi & İhracat Hisseleri', percentage: 30, color: '#2563EB', type: 'STOCK', description: 'Katılım endeksine uygun ihracatçı sanayi liderleri' },
      { name: 'Katılım Teknoloji & Bilişim Hisseleri', percentage: 25, color: '#8B5CF6', type: 'STOCK', description: 'İslami finans kriterlerine uyumlu teknoloji şirketleri' },
      { name: 'Katılım Enerji Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'Katılım esaslarına tam uyumlu yenilenebilir enerji' },
      { name: 'Darphane Altın Sertifikası', percentage: 15, color: '#F59E0B', type: 'GOLD', description: 'Faizsiz fiziki altın güvencesi' },
      { name: 'Kira Sertifikası Katılım Fonu', percentage: 15, color: '#059669', type: 'CASH', description: 'Sukuk ve kira sertifikalarına dayalı faizsiz getiri' },
    ]
  },
  advanced_islamic: {
    id: 'advanced_islamic',
    title: 'Katılım Dinamik Alfa Portföyü',
    badge: 'Katılım Finans',
    description: 'BIST Katılım Endeksi’ndeki yüksek potansiyelli büyüme, teknoloji ve savunma hisseleriyle maksimum helal getiri.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%65+ Yıllık Hedef',
    distribution: [
      { name: 'Katılım Teknoloji & Bilişim Hisseleri', percentage: 35, color: '#8B5CF6', type: 'STOCK', description: 'Katılım uyumlu inovatif teknoloji şirketleri' },
      { name: 'Katılım Savunma & İleri Sanayi', percentage: 25, color: '#EF4444', type: 'STOCK', description: 'BIST Katılım uyumlu stratejik üretim devleri' },
      { name: 'Katılım Enerji & Altyapı Hisseleri', percentage: 20, color: '#10B981', type: 'STOCK', description: 'Faizsiz finans uyumlu yeşil enerji yatırımları' },
      { name: 'Darphane Altın Sertifikası', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Emtia koruması' },
      { name: 'Kira Sertifikası Katılım Fonu', percentage: 10, color: '#059669', type: 'CASH', description: 'Taktiksel katılım fonu likiditesi' },
    ]
  },
  advanced_alpha: {
    id: 'advanced_alpha',
    title: 'Büyüme & Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Endeks üzeri getiri hedefleyen dinamik sanayi, teknoloji ve büyüme sektörü modeli.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%65 - %90',
    distribution: [
      { name: 'Teknoloji & Bilişim Hisseleri', percentage: 35, color: '#8B5CF6', type: 'STOCK', description: 'Yüksek büyüme potansiyelli teknoloji hisseleri' },
      { name: 'Sanayi & İhracat Hisseleri', percentage: 25, color: '#004BFA', type: 'STOCK', description: 'İhracat lideri köklü sanayi devleri' },
      { name: 'Enerji & Altyapı Hisseleri', percentage: 20, color: '#10B981', type: 'STOCK', description: 'Geleceğin yenilenebilir enerji şirketleri' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Altın güvencesi' },
      { name: 'Kira Sertifikası Fonu', percentage: 10, color: '#60A5FA', type: 'CASH', description: 'Kira sertifikası likit rezerv' },
    ]
  },
  intermediate_balanced: {
    id: 'intermediate_balanced',
    title: 'Dengeli Büyüme Portföyü',
    badge: 'Optimum Büyüme',
    description: 'Piyasa getirisi ile sermaye korumasını birleştiren sektörel dengeli model.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%48 - %70',
    distribution: [
      { name: 'Sanayi & İhracat Hisseleri', percentage: 30, color: '#004BFA', type: 'STOCK', description: 'Köklü sanayi liderleri' },
      { name: 'Teknoloji & Bilişim Hisseleri', percentage: 25, color: '#8B5CF6', type: 'STOCK', description: 'Yazılım ve teknoloji devleri' },
      { name: 'Enerji Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'Stratejik enerji yatırımları' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 15, color: '#F59E0B', type: 'GOLD', description: 'Portföy koruma sigortası' },
      { name: 'Kira Sertifikası Fonu', percentage: 15, color: '#60A5FA', type: 'CASH', description: 'Kira sertifikası risksiz getiri' },
    ]
  },
  beginner_capital_shield: {
    id: 'beginner_capital_shield',
    title: 'Sermaye Koruma Portföyü',
    badge: 'Reel Koruma',
    description: 'Düşük volatilite ve düzenli alım gücü koruma modeli.',
    expectedRisk: 'Düşük',
    expectedReturn: '%38 - %52',
    distribution: [
      { name: 'Kira Sertifikası Fonu', percentage: 40, color: '#60A5FA', type: 'CASH', description: 'Kira sertifikaları ile risksiz getiri' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 35, color: '#F59E0B', type: 'GOLD', description: 'Altın koruması' },
      { name: 'Defansif Perakende Hisseleri', percentage: 15, color: '#10B981', type: 'STOCK', description: 'Krizlere dayanıklı gıda ve perakende' },
      { name: 'Sanayi Hisseleri', percentage: 10, color: '#004BFA', type: 'STOCK', description: 'Sağlam bilançolu sanayi devleri' },
    ]
  }
};

export interface OnboardingQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: {
    id: string;
    label: string;
    description?: string;
  }[];
}

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'investment_horizon',
    title: 'Yatırımlarınızı ne kadar süreyle tutmayı planlıyorsunuz?',
    subtitle: 'Yatırım vadeniz, ideal varlık dağılımınızı doğrudan belirler.',
    options: [
      { id: 'short', label: 'Kısa Vade (1 - 6 Ay)', description: 'Acil ihtiyaç duyabileceğim parayı değerlendirmek istiyorum.' },
      { id: 'medium', label: 'Orta Vade (6 Ay - 2 Yıl)', description: 'Belirli bir hedef için birikim yapıyorum.' },
      { id: 'long', label: 'Uzun Vade (2+ Yıl)', description: 'Bileşik getiriden faydalanmak istiyorum.' }
    ]
  },
  {
    id: 'risk_reaction',
    title: 'Portföyünüz kısa vadede %15 değer kaybetse tepkiniz ne olurdu?',
    subtitle: 'Risk toleransınızı doğru belirlemek, huzurlu bir yatırım için şarttır.',
    options: [
      { id: 'panic', label: 'Endişelenip pozisyonlarımı kapatırım', description: 'Sermayemi kaybetme korkusu beni çok yıpratır.' },
      { id: 'wait', label: 'Beklerim, piyasanın toparlanmasını izlerim', description: 'Dalgalanmaların piyasanın doğasında olduğunu bilirim.' },
      { id: 'buy_more', label: 'Fırsat görür, maliyet düşürmek için ek alım yaparım', description: 'Düşüşleri indirimli fiyattan alış fırsatı olarak değerlendiririm.' }
    ]
  },
  {
    id: 'primary_goal',
    title: 'Yatırımlarınızdaki birincil amacınız nedir?',
    subtitle: 'Portföy stratejinizi bu hedefin etrafında inşa edeceğiz.',
    options: [
      { id: 'capital_preservation', label: 'Ana Parayı Korumak & Enflasyonu Yenmek', description: 'Önceliğim paramın alım gücünü muhafaza etmek.' },
      { id: 'balanced_growth', label: 'Dengeli Sermaye Büyümesi', description: 'Makul risk alarak enflasyonun üzerinde reel getiri sağlamak.' },
      { id: 'aggressive_growth', label: 'Maksimum Sermaye Artışı', description: 'Yüksek risk alarak portföyümü katlayarak büyütmek.' }
    ]
  },
  {
    id: 'interest_sensitivity',
    title: 'Yatırımlarınızda faiz hassasiyetiniz (katılım esasları) bulunuyor mu?',
    subtitle: 'Portföy seçimlerinizi İslami finans ve katılım standartlarına göre filtreleriz.',
    options: [
      { id: 'islamic_sensitive', label: 'Faiz Hassasiyetim Var (Katılım Esaslı)', description: 'Sadece BIST Katılım Endeksi’ne uygun helal hisseler, altın ve kira sertifikası katılım fonu dahil edilsin.' },
      { id: 'conventional', label: 'Faiz Hassasiyetim Yok (Genel Piyasa)', description: 'BIST genel hisseleri, sanayi, teknoloji ve standart kira sertifikası fonları serbestçe değerlendirilsin.' }
    ]
  }
];
