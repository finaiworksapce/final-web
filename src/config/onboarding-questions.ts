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
  category: 'Hisse' | 'Yatırım Fonu' | 'Kıymetli Maden' | 'Likit & PPF';
  allocationWeight: number;
  reason: string;
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
  distribution: {
    stock: number;
    fund: number;
    gold: number;
    cash: number;
  };
  instruments: RepresentativeInstrument[];
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

// 4 Aşamalı Sade ve Profesyonel Soru Seti (Rozetsiz, saf estetik)
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
        deltaWeights: { stock: 15, fund: 25, gold: 30, cash: 30 }
      },
      {
        id: 'intermediate',
        keyNumber: 2,
        title: 'Aktif Yatırımcı',
        description: 'Hisse ve fon alım-satım deneyimim var. Portföyümü daha profesyonel metriklerle takip etmek istiyorum.',
        deltaWeights: { stock: 40, fund: 30, gold: 18, cash: 12 }
      },
      {
        id: 'advanced',
        keyNumber: 3,
        title: 'İleri Düzey',
        description: 'Finansal tablolara, çarpanlara ve makro dinamiklere hakimim; derinlemesine analitik veriler arıyorum.',
        deltaWeights: { stock: 55, fund: 25, gold: 10, cash: 10 }
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
        deltaWeights: { stock: 10, fund: 20, gold: 25, cash: 45 }
      },
      {
        id: 'medium',
        keyNumber: 2,
        title: 'Orta Vade (6 Ay - 2 Yıl)',
        description: 'Dönemsel piyasa dalgalanmalarını tolere edebilir, belirli hedefler doğrultusunda büyüme hedeflerim.',
        deltaWeights: { stock: 35, fund: 35, gold: 18, cash: 12 }
      },
      {
        id: 'long',
        keyNumber: 3,
        title: 'Uzun Vade (2+ Yıl)',
        description: 'Bileşik getirinin gücünden faydalanarak uzun soluklu bir sermaye inşası planlıyorum.',
        deltaWeights: { stock: 55, fund: 25, gold: 12, cash: 8 }
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
        deltaWeights: { stock: 15, fund: 20, gold: 35, cash: 30 }
      },
      {
        id: 'balanced',
        keyNumber: 2,
        title: 'Piyasanın Toparlanmasını Beklerim',
        description: 'Dalgalanmaların piyasanın olağan bir parçası olduğunu bilir, planıma sadık kalırım.',
        deltaWeights: { stock: 38, fund: 32, gold: 18, cash: 12 }
      },
      {
        id: 'aggressive',
        keyNumber: 3,
        title: 'Kademeli Ek Alım Yaparım',
        description: 'Fiyat geri çekilmelerini iskontolu alım fırsatı olarak değerlendirip maliyetimi dengelerim.',
        deltaWeights: { stock: 52, fund: 28, gold: 10, cash: 10 }
      }
    ]
  },
  {
    id: 'strategic_goal',
    stepNumber: 4,
    category: 'Yatırım Hedefi',
    title: 'Portföyünüzün öncelikli finansal hedefi hangisidir?',
    contextExplanation: 'FinAi algoritması varlık önerilerini bu ana eksen etrafında şekillendirir.',
    options: [
      {
        id: 'inflation_shield',
        keyNumber: 1,
        title: 'Alım Gücünü Korumak',
        description: 'Birikimlerimin reel değerini korumak ve enflasyon karşısında değer kaybını önlemek.',
        deltaWeights: { stock: 20, fund: 30, gold: 30, cash: 20 }
      },
      {
        id: 'dividend_yield',
        keyNumber: 2,
        title: 'Düzenli Nakit Akışı',
        description: 'Düzenli kâr payı dağıtan köklü şirketlerle sürdürülebilir bir pasif getiri oluşturmak.',
        deltaWeights: { stock: 45, fund: 25, gold: 20, cash: 10 }
      },
      {
        id: 'growth_alpha',
        keyNumber: 3,
        title: 'Sermaye Büyümesi',
        description: 'Yüksek büyüme ve ciro artışı potansiyeline sahip şirketlerle piyasa üzeri getiri hedeflemek.',
        deltaWeights: { stock: 55, fund: 30, gold: 5, cash: 10 }
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

  let stock = 35;
  let fund = 30;
  let gold = 20;
  let cash = 15;

  if (literacy === 'beginner') {
    stock -= 15;
    fund += 5;
    gold += 5;
    cash += 5;
  } else if (literacy === 'advanced') {
    stock += 15;
    cash -= 5;
    gold -= 10;
  }

  if (horizon === 'short') {
    stock -= 15;
    cash += 15;
  } else if (horizon === 'long') {
    stock += 10;
    cash -= 5;
    fund -= 5;
  }

  if (reaction === 'conservative') {
    stock -= 10;
    gold += 10;
  } else if (reaction === 'aggressive') {
    stock += 10;
    gold -= 5;
    cash -= 5;
  }

  if (goal === 'inflation_shield') {
    gold += 5;
    stock -= 5;
  } else if (goal === 'growth_alpha') {
    stock += 10;
    gold -= 5;
    cash -= 5;
  }

  stock = Math.max(10, Math.min(65, stock));
  fund = Math.max(15, Math.min(45, fund));
  gold = Math.max(5, Math.min(35, gold));
  cash = Math.max(5, Math.min(40, cash));

  const total = stock + fund + gold + cash;
  stock = Math.round((stock / total) * 100);
  fund = Math.round((fund / total) * 100);
  gold = Math.round((gold / total) * 100);
  cash = 100 - (stock + fund + gold);

  if (stock >= 50) {
    return {
      id: 'advanced_alpha',
      codeName: 'DYNAMIC_ALPHA',
      title: 'Büyüme & Alfa Portföyü',
      tagline: 'Endeks üzeri getiri hedefleyen dinamik sanayi ve büyüme modeli.',
      expectedRisk: 'Yüksek',
      expectedReturnRange: '%65 - %90',
      volatilityBand: '±%22',
      maxDrawdownTolerance: '-%24',
      rebalanceCycle: 'Aylık Gözden Geçirme',
      sharpeRatioEst: '1.42',
      analystSummary: 'Büyüme potansiyeli yüksek şirketler ve teknoloji fonları üzerine kurgulanmıştır.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'ASELS', name: 'Aselsan', category: 'Hisse', allocationWeight: 18, reason: 'AR-GE ve döviz bazlı nakit akışı' },
        { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'Hisse', allocationWeight: 16, reason: 'Küresel pazar payı ve düşük F/K' },
        { symbol: 'TUPRS', name: 'Tüpraş', category: 'Hisse', allocationWeight: 14, reason: 'Güçlü kârlılık ve temettü verimi' },
        { symbol: 'BUY', name: 'Teknoloji Fonu', category: 'Yatırım Fonu', allocationWeight: fund, reason: 'Küresel teknoloji çeşitlendirmesi' },
        { symbol: 'GLDTR', name: 'Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Portföy dengeleyici güvence' },
        { symbol: 'PPF', name: 'Likit Fon', category: 'Likit & PPF', allocationWeight: cash, reason: 'Taktiksel alım rezervi' },
      ]
    };
  } else if (stock >= 30) {
    return {
      id: 'intermediate_balanced',
      codeName: 'OPTIMAL_BALANCED',
      title: 'Dengeli Büyüme Portföyü',
      tagline: 'Piyasa getirisi ile sermaye korumasını birleştiren dengeli model.',
      expectedRisk: 'Dengeli',
      expectedReturnRange: '%48 - %70',
      volatilityBand: '±%14',
      maxDrawdownTolerance: '-%15',
      rebalanceCycle: 'Çeyreklik Dengeleme',
      sharpeRatioEst: '1.68',
      analystSummary: 'Köklü sanayi liderleri, yatırım fonları ve altın dengesiyle istikrarlı getiri hedefler.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'KCHOL', name: 'Koç Holding', category: 'Hisse', allocationWeight: 15, reason: 'Çok sektörlü kurumsal yapı' },
        { symbol: 'FROTO', name: 'Ford Otosan', category: 'Hisse', allocationWeight: 13, reason: 'Güçlü ihracat ve kârlılık' },
        { symbol: 'TI2', name: 'BIST 30 Fonu', category: 'Yatırım Fonu', allocationWeight: Math.round(fund * 0.55), reason: 'Geniş tabanlı endeks takibi' },
        { symbol: 'TTE', name: 'Teknoloji Fonu', category: 'Yatırım Fonu', allocationWeight: Math.round(fund * 0.45), reason: 'Sektörel büyüme potansiyeli' },
        { symbol: 'ZGOLD', name: 'Altın Fonu', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Değer koruma ve sigorta' },
        { symbol: 'PPF', name: 'Likit Fon', category: 'Likit & PPF', allocationWeight: cash, reason: 'Risksiz günlük likidite' },
      ]
    };
  } else {
    return {
      id: 'beginner_capital_shield',
      codeName: 'CAPITAL_SHIELD',
      title: 'Sermaye Koruma Portföyü',
      tagline: 'Düşük volatilite ve düzenli alım gücü koruma modeli.',
      expectedRisk: 'Düşük',
      expectedReturnRange: '%38 - %52',
      volatilityBand: '±%7',
      maxDrawdownTolerance: '-%7',
      rebalanceCycle: '6 Aylık İnceleme',
      sharpeRatioEst: '1.92',
      analystSummary: 'Likit enstrümanlar ve değerli madenler ağırlıklı olup piyasa dalgalanmalarına karşı korur.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'PPF', name: 'Likit Para Piyasası', category: 'Likit & PPF', allocationWeight: cash, reason: 'Günlük risksiz getiri' },
        { symbol: 'ZGOLD', name: 'Altın Fonu', category: 'Kıymetli Maden', allocationWeight: gold, reason: 'Enflasyona karşı koruma' },
        { symbol: 'TI2', name: 'BIST 30 Fonu', category: 'Yatırım Fonu', allocationWeight: fund, reason: 'Geniş piyasa katılımı' },
        { symbol: 'BIMAS', name: 'BİM Mağazalar', category: 'Hisse', allocationWeight: stock, reason: 'Defansif perakende nakit akışı' }
      ]
    };
  }
}

// Geriye Dönük Uyumluluk (Dashboard ve Mevcut Bileşenler için)
export const STRATEGY_PROFILES: Record<string, StrategyProfile> = {
  beginner: {
    id: 'beginner',
    title: 'Dengeli & Koruma Odaklı Başlangıç Portföyü',
    badge: 'Yeni Yatırımcı Tavsiyesi',
    description: 'Enflasyona karşı koruma sağlarken, risksiz nakit ve geniş tabanlı fonlarla piyasayı tanımanızı hedefler.',
    expectedRisk: 'Düşük',
    expectedReturn: '%35 - %50 Yıllık Hedef',
    distribution: [
      { name: 'Para Piyasası & Likit Fonlar', percentage: 35, color: '#94A3B8', type: 'CASH', description: 'Günlük faiz ve acil durum rezervi' },
      { name: 'Kıymetli Madenler (Altın/Gümüş)', percentage: 30, color: '#F59E0B', type: 'GOLD', description: 'Enflasyona karşı değer koruma' },
      { name: 'TEFAS Hisse & Değişken Fonlar', percentage: 20, color: '#8B5CF6', type: 'FUND', description: 'Profesyonel fon yöneticisi desteği' },
      { name: 'BIST 30 Güçlü Şirketler', percentage: 15, color: '#2563EB', type: 'STOCK', description: 'Temettü ve güvenilir mavi çip hisseler' },
    ]
  },
  intermediate: {
    id: 'intermediate',
    title: 'Büyüme & Temettü Odaklı Dengeli Portföy',
    badge: 'Optimum Büyüme',
    description: 'BIST şirketleri ve tematik fonlarla piyasa üzeri getiri hedeflerken, altın ve nakit ile riski dengeler.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%50 - %75 Yıllık Hedef',
    distribution: [
      { name: 'BIST 30 & Temettü Hisseleri', percentage: 40, color: '#2563EB', type: 'STOCK', description: 'İhracatçı ve temettü verimi yüksek hisseler' },
      { name: 'TEFAS Teknoloji & Eurobond Fonları', percentage: 30, color: '#8B5CF6', type: 'FUND', description: 'Döviz bazlı ve teknoloji fonları' },
      { name: 'Kıymetli Madenler (Altın)', percentage: 20, color: '#F59E0B', type: 'GOLD', description: 'Portföy sigortası ve jeopolitik denge' },
      { name: 'Nakit / Fırsat Havuzu (PPF)', percentage: 10, color: '#94A3B8', type: 'CASH', description: 'Düşüşlerde alım yapabilmek için nakit' },
    ]
  },
  advanced: {
    id: 'advanced',
    title: 'Dinamik & Yüksek Getiri Odaklı Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Derin bilanço analizleri, çarpan iskontoları ve büyüme hisseleriyle maksimum getiri hedefler.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%70+ Yıllık Hedef',
    distribution: [
      { name: 'BIST Büyüme & Sanayi Hisseleri', percentage: 55, color: '#2563EB', type: 'STOCK', description: 'Yüksek F/K iskontolu büyüme şirketleri' },
      { name: 'Tematik & Yabancı Hisse Fonları', percentage: 25, color: '#8B5CF6', type: 'FUND', description: 'Yapay zeka, yarı iletken ve küresel fonlar' },
      { name: 'Emtia & Değerli Madenler', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Dönemsel emtia döngüleri' },
      { name: 'Taktiksel Likit / Nakit', percentage: 10, color: '#94A3B8', type: 'CASH', description: 'Hızlı pozisyon alma marjı' },
    ]
  },
  advanced_alpha: {
    id: 'advanced_alpha',
    title: 'Büyüme & Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Endeks üzeri getiri hedefleyen dinamik sanayi ve büyüme modeli.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%65 - %90',
    distribution: [
      { name: 'BIST Hisseleri', percentage: 55, color: '#004BFA', type: 'STOCK', description: 'Sanayi ve büyüme hisseleri' },
      { name: 'Yatırım Fonları', percentage: 25, color: '#5B80FF', type: 'FUND', description: 'Teknoloji ve tematik fonlar' },
      { name: 'Kıymetli Madenler', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Altın güvencesi' },
      { name: 'Likit Rezerv', percentage: 10, color: '#D6E4FF', type: 'CASH', description: 'Nakit fırsat havuzu' },
    ]
  },
  intermediate_balanced: {
    id: 'intermediate_balanced',
    title: 'Dengeli Büyüme Portföyü',
    badge: 'Optimum Büyüme',
    description: 'Piyasa getirisi ile sermaye korumasını birleştiren dengeli model.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%48 - %70',
    distribution: [
      { name: 'BIST Hisseleri', percentage: 40, color: '#004BFA', type: 'STOCK', description: 'Köklü sanayi liderleri' },
      { name: 'Yatırım Fonları', percentage: 30, color: '#5B80FF', type: 'FUND', description: 'Geniş tabanlı fonlar' },
      { name: 'Kıymetli Madenler', percentage: 18, color: '#F59E0B', type: 'GOLD', description: 'Altın fonu' },
      { name: 'Likit Rezerv', percentage: 12, color: '#D6E4FF', type: 'CASH', description: 'Likit para piyasası' },
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
      { name: 'Likit Rezerv', percentage: 35, color: '#D6E4FF', type: 'CASH', description: 'Likit para piyasası' },
      { name: 'Kıymetli Madenler', percentage: 30, color: '#F59E0B', type: 'GOLD', description: 'Altın koruması' },
      { name: 'Yatırım Fonları', percentage: 20, color: '#5B80FF', type: 'FUND', description: 'Geniş fon dağılımı' },
      { name: 'Defansif Hisseler', percentage: 15, color: '#004BFA', type: 'STOCK', description: 'Defansif şirketler' },
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
  }
];
