// src/config/onboarding-questions.ts
// FinAi Onboarding Soru, Model ve Canlı Telemetri Konfigürasyonu
// Yüksek standartlı finansal mimari, BIST & TEFAS piyasalarına özel kalibrasyon

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
  category: 'BIST 30' | 'Büyüme Hissesi' | 'TEFAS Fonu' | 'Kıymetli Maden' | 'Likit & PPF';
  allocationWeight: number;
  tag: string;
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
  impactLabel: string;
  badge?: string;
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

// 4 Aşamalı Derinlikli Finansal Soru Seti (AI Slop içermeyen BIST & TEFAS soruları)
export const WIZARD_QUESTIONS: WizardQuestion[] = [
  {
    id: 'literacy_level',
    stepNumber: 1,
    category: 'Piyasa Deneyimi & Finansal Okuryazarlık',
    title: 'Finansal piyasalar ve yatırım araçlarındaki tecrübenizi nasıl tanımlarsınız?',
    contextExplanation: 'FinAi; teknik göstergeleri, çarpan analizlerini (F/K, PD/DD, FD/FAVÖK) ve arayüz derinliğini bu seviyeye göre optimize eder.',
    options: [
      {
        id: 'beginner',
        keyNumber: 1,
        title: 'Temel Düzey (Yeni Yatırımcı)',
        description: 'BIST ve fon piyasalarında yeni adımlar atıyorum. Karmaşık finansal terimlerden uzak, koruma ve sade fon rehberliği arıyorum.',
        impactLabel: 'Öncelik: Sermaye Koruma & Likit Rezerv',
        badge: 'Sade Arayüz',
        deltaWeights: { stock: 15, fund: 25, gold: 30, cash: 30 }
      },
      {
        id: 'intermediate',
        keyNumber: 2,
        title: 'Aktif Yatırımcı (Orta Seviye)',
        description: 'Borsa İstanbul hisselerinde veya TEFAS fonlarında düzenli işlem yapıyorum. Sektörel rasyolar, temettü verimi ve dengeli büyüme odaklıyım.',
        impactLabel: 'Öncelik: BIST 30 & Tematik Fon Kombinasyonu',
        badge: 'Dengeli Model',
        deltaWeights: { stock: 40, fund: 30, gold: 18, cash: 12 }
      },
      {
        id: 'advanced',
        keyNumber: 3,
        title: 'İleri Düzey (Analitik & Profesyonel)',
        description: 'Bilanço kalemlerine, çarpan iskontolarına ve makro piyasa korelasyonlarına hakimim. Dinamik hisse rotasyonu ve endeks üzeri getiri (alfa) arıyorum.',
        impactLabel: 'Öncelik: Yüksek BIST Büyüme & Alfa Arayışı',
        badge: 'Profesyonel Terminal',
        deltaWeights: { stock: 55, fund: 25, gold: 10, cash: 10 }
      }
    ]
  },
  {
    id: 'investment_horizon',
    stepNumber: 2,
    category: 'Zaman Ufku & Likidite İhtiyacı',
    title: 'Yatırımlarınızı hangi zaman ufkunda değerlendirmeyi planlıyorsunuz?',
    contextExplanation: 'Vade yapınız; portföyünüzün piyasa düzeltmelerine dayanma gücünü ve önerilen hisse senedi taşıma süresini belirler.',
    options: [
      {
        id: 'short',
        keyNumber: 1,
        title: 'Kısa Vade (1 - 6 Ay)',
        description: 'Yakın zamanda nakde dönüş ihtiyacı doğabilir. Ani fiyat salınımlarından kaçınmak ve ana paranın değerini muhafaza etmek şart.',
        impactLabel: 'Likit & Para Piyasası Fonu Ağırlığı Arttırılır',
        badge: 'Yüksek Likidite',
        deltaWeights: { stock: 10, fund: 20, gold: 25, cash: 45 }
      },
      {
        id: 'medium',
        keyNumber: 2,
        title: 'Orta Vade (6 Ay - 2 Yıl)',
        description: 'Belirli bir hedef için (araç, konut peşinatı vb.) birikim yapıyorum. Kısa vadeli dalgalanmaları tolere edebilir, dönemsel kâr realizasyonu yapabilirim.',
        impactLabel: 'BIST 30 & Çeyreklik Yeniden Dengeleme Modeli',
        badge: 'Hedef Odaklı',
        deltaWeights: { stock: 35, fund: 35, gold: 18, cash: 12 }
      },
      {
        id: 'long',
        keyNumber: 3,
        title: 'Uzun Vade (2+ Yıl)',
        description: 'Finansal özgürlük ve geleceğim için bileşik getiriden faydalanmak, kâr paylarını (temettüleri) yeniden yatırıma dönüştürmek istiyorum.',
        impactLabel: 'Maksimum Bileşik Getiri & Temettü İntibakı',
        badge: 'Bileşik Büyüme',
        deltaWeights: { stock: 55, fund: 25, gold: 12, cash: 8 }
      }
    ]
  },
  {
    id: 'volatility_reaction',
    stepNumber: 3,
    category: 'Risk Toleransı & Düşüş Psikolojisi',
    title: 'Genel bir piyasa düzeltmesinde portföyünüz %15 gerilese yaklaşımınız ne olur?',
    contextExplanation: 'Risk toleransı, piyasa fırtınalarında sakin kalmanızı sağlayan psikolojik emniyet sübabınızdır.',
    options: [
      {
        id: 'conservative',
        keyNumber: 1,
        title: 'Sermayemi Korur, Savunmaya Geçerim',
        description: 'Portföyümün kısa vadede dahi negatifte kalması huzurumu kaçırır. Nakit, likit fon ve altın gibi güvenli limanlara sığınmayı yeğlerim.',
        impactLabel: 'Düşük Volatilite Toleransı · Defansif Dağılım',
        badge: 'Savunmacı',
        deltaWeights: { stock: 15, fund: 20, gold: 35, cash: 30 }
      },
      {
        id: 'balanced',
        keyNumber: 2,
        title: 'Piyasanın Toparlanmasını Beklerim',
        description: 'Geri çekilmelerin hisse senedi piyasasının olağan döngüsü olduğunu bilirim. Vademi bozmadan stratejime sadık kalırım.',
        impactLabel: 'Orta Volatilite Toleransı · Döngüsel Disiplin',
        badge: 'Dengeli Sabır',
        deltaWeights: { stock: 38, fund: 32, gold: 18, cash: 12 }
      },
      {
        id: 'aggressive',
        keyNumber: 3,
        title: 'Fırsat Görür, Kademeli Alım Yaparım',
        description: 'Düşüşleri kaliteli şirketleri indirimli fiyattan toplama fırsatı olarak görür, nakit rezervimle ortalama maliyetimi düşürürüm.',
        impactLabel: 'Yüksek Risk Toleransı · Fırsat Likiditesi',
        badge: 'Maliyet İndirimi',
        deltaWeights: { stock: 52, fund: 28, gold: 10, cash: 10 }
      }
    ]
  },
  {
    id: 'strategic_goal',
    stepNumber: 4,
    category: 'Portföy Misyonu & Yatırım Hedefi',
    title: 'FinAi portföyünüzün öncelikli finansal misyonu hangisidir?',
    contextExplanation: 'Portföyünüzün ağırlık merkezi ve hisse filtreleme algoritmaları bu misyona göre filtrelenir.',
    options: [
      {
        id: 'inflation_shield',
        keyNumber: 1,
        title: 'Enflasyona Karşı Alım Gücünü Korumak',
        description: 'Önceliğim reel kayıp yaşamamak; birikimlerimi TÜFE üzerinde tutarak değer erimesini engellemek.',
        impactLabel: 'Reel Değer Kalkanı · Düşük Beta',
        badge: 'Reel Koruma',
        deltaWeights: { stock: 20, fund: 30, gold: 30, cash: 20 }
      },
      {
        id: 'dividend_yield',
        keyNumber: 2,
        title: 'Düzenli Pasif Gelir (Temettü Akışı)',
        description: 'Köklü, düzenli kâr payı dağıtan ihracatçı sanayi şirketlerine ortak olarak sürdürülebilir nakit akışı sağlamak.',
        impactLabel: 'BIST 30 Temettü Liderleri & Yüksek Nakit Akışı',
        badge: 'Temettü Büyümesi',
        deltaWeights: { stock: 45, fund: 25, gold: 20, cash: 10 }
      },
      {
        id: 'growth_alpha',
        keyNumber: 3,
        title: 'Maksimum Sermaye Büyümesi (Alfa Arayışı)',
        description: 'Yüksek büyüme potansiyeline ve teknoloji/sanayi üstünlüğüne sahip şirketlerle endeksin üzerinde getiri elde etmek.',
        impactLabel: 'Yüksek Çarpan İskontosu & Büyüme Hisseleri',
        badge: 'Maksimum Büyüme',
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
      codeName: 'MODEL: ALPHA_EQUITY_CORE_V2',
      title: 'Dinamik Büyüme & Alfa Portföyü',
      tagline: 'Endeks üzeri getiri hedefleyen dinamik BIST sanayi ve büyüme modeli.',
      expectedRisk: 'Yüksek',
      expectedReturnRange: '%65 - %90+ Yıllık Hedef',
      volatilityBand: '±%22.4 Volatilite',
      maxDrawdownTolerance: '-%24.0 Maksimum Düşüş',
      rebalanceCycle: 'Aylık Taktiksel İnceleme',
      sharpeRatioEst: '1.42 (Yüksek Risk/Getiri)',
      analystSummary: 'Portföyünüzün odağı; ihracat gücü ve kapasite artışıyla kâr marjını büyüten BIST şirketleri ile küresel tematik fonlar üzerine kurulmuştur. Piyasa düzeltmeleri maliyet avantajına dönüştürülür.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'ASELS', name: 'Aselsan Savunma Sanayii', category: 'Büyüme Hissesi', allocationWeight: 18, tag: 'Bakiye Sipariş 12 Milyar $', reason: 'Güçlü döviz bazlı nakit akışı ve AR-GE liderliği.' },
        { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'BIST 30', allocationWeight: 16, tag: 'F/K 4.8 Cazip İskonto', reason: 'Küresel pazar payı ve düşük F/K çarpanı.' },
        { symbol: 'TUPRS', name: 'Tüpraş Rafinerileri', category: 'BIST 30', allocationWeight: 14, tag: 'Temettü Verimi %9.4', reason: 'Yüksek rafineri marjı ve düzenli nakit temettü.' },
        { symbol: 'BUY', name: 'İş Portföy Yabancı Teknoloji', category: 'TEFAS Fonu', allocationWeight: fund, tag: 'Yapay Zeka & Yarı İletken', reason: 'Küresel teknoloji devleriyle coğrafi çeşitlendirme.' },
        { symbol: 'GLDTR', name: 'İstanbul Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, tag: 'Ons & Döviz Koruma', reason: 'Jeopolitik risk dengesi ve portföy sigortası.' },
        { symbol: 'PPF', name: 'Para Piyasası Likit Fon', category: 'Likit & PPF', allocationWeight: cash, tag: 'Fırsat Havuzu (T+0)', reason: 'Düşüşlerde anında alım yapabilmek için taktiksel rezerv.' },
      ]
    };
  } else if (stock >= 30) {
    return {
      id: 'intermediate_balanced',
      codeName: 'MODEL: OPTIMAL_GROWTH_BALANCED_V1',
      title: 'BIST 30 & Temettü Odaklı Dengeli Portföy',
      tagline: 'Piyasa üzeri getiri ile koruma refleksini harmanlayan dengeli omurga.',
      expectedRisk: 'Dengeli',
      expectedReturnRange: '%48 - %70 Yıllık Hedef',
      volatilityBand: '±%14.8 Volatilite',
      maxDrawdownTolerance: '-%15.0 Maksimum Düşüş',
      rebalanceCycle: 'Çeyreklik (3 Aylık) Dengeleme',
      sharpeRatioEst: '1.68 (Optimum Sharpe Oranı)',
      analystSummary: 'BIST 30 mavi çip şirketleri ve köklü TEFAS fonları portföyün çekirdeğini oluşturur. Altın ve nakit rezervi, piyasa türbülanslarında portföyü dengeler ve getiri istikrarı sağlar.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'KCHOL', name: 'Koç Holding Sanayi', category: 'BIST 30', allocationWeight: 15, tag: 'Net Aktif İskontosu %32', reason: 'Çok sektörlü çeşitlendirme ve kurumsal temettü.' },
        { symbol: 'FROTO', name: 'Ford Otomotiv Sanayi', category: 'BIST 30', allocationWeight: 13, tag: 'İhracat Şampiyonu', reason: 'Elektrikli araç yatırımı ve güçlü ihracat geliri.' },
        { symbol: 'TI2', name: 'İş Portföy BIST 30 Fonu', category: 'TEFAS Fonu', allocationWeight: Math.round(fund * 0.55), tag: 'Geniş Tabanlı Endeks', reason: 'Profesyonel portföy yöneticisiyle endeks takibi.' },
        { symbol: 'TTE', name: 'İş Portföy BIST Teknoloji', category: 'TEFAS Fonu', allocationWeight: Math.round(fund * 0.45), tag: 'BIST Teknoloji Ağırlık', reason: 'Yazılım ve bilişim sektörünün büyüme potansiyeli.' },
        { symbol: 'ZGOLD', name: 'Ziraat Portföy Altın BYF', category: 'Kıymetli Maden', allocationWeight: gold, tag: 'Fiziki Altın Karşılığı', reason: 'Enflasyona karşı birikim değerini koruma.' },
        { symbol: 'PPF', name: 'Likit Para Piyasası Fonu', category: 'Likit & PPF', allocationWeight: cash, tag: 'Günlük Bileşik Getiri', reason: 'Sıfır risk ile günlük faiz ve likidite güvencesi.' },
      ]
    };
  } else {
    return {
      id: 'beginner_capital_shield',
      codeName: 'MODEL: CAPITAL_SHIELD_DEFENSIVE_V1',
      title: 'Enflasyon Kalkanı & Sermaye Koruma Portföyü',
      tagline: 'Sıfıra yakın volatilite ve düzenli reel değer koruma modeli.',
      expectedRisk: 'Düşük',
      expectedReturnRange: '%38 - %52 Yıllık Hedef',
      volatilityBand: '±%7.5 Düşük Volatilite',
      maxDrawdownTolerance: '-%7.0 Maksimum Düşüş',
      rebalanceCycle: '6 Aylık Periyodik Gözden Geçirme',
      sharpeRatioEst: '1.92 (Düşük Risk, Yüksek Güvenlik)',
      analystSummary: 'Birikimlerinizin satın alma gücünü korumayı hedefler. Sermaye riski minimumda tutulur; likit fonlar ve fiziki altın kalkanı portföyün ana eksenini meydana getirir.',
      distribution: { stock, fund, gold, cash },
      instruments: [
        { symbol: 'PPF', name: 'Para Piyasası Likit Fon', category: 'Likit & PPF', allocationWeight: cash, tag: 'Günlük Risksiz Getiri', reason: 'Piyasa dalgalanmalarından sıfır etkilenme.' },
        { symbol: 'ZGOLD', name: 'Ziraat Altın Fonu', category: 'Kıymetli Maden', allocationWeight: gold, tag: 'Enflasyon Kalkanı', reason: 'Döviz ve altın bazında kalıcı alım gücü garantisi.' },
        { symbol: 'TI2', name: 'İş Portföy Hisse Fonu', category: 'TEFAS Fonu', allocationWeight: fund, tag: 'Seçici BIST 30 Fonu', reason: 'Risk almadan profesyonel hisse dağılımına ortak olma.' },
        { symbol: 'BIMAS', name: 'BİM Birleşik Mağazalar', category: 'BIST 30', allocationWeight: stock, tag: 'Defansif Perakende', reason: 'Krizlere ve enflasyona dayanıklı perakende nakit akışı.' }
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
    title: 'Dinamik Büyüme & Alfa Portföyü',
    badge: 'Aktif Yönetim',
    description: 'Endeks üzeri getiri hedefleyen dinamik BIST sanayi ve büyüme modeli.',
    expectedRisk: 'Yüksek',
    expectedReturn: '%65 - %90+ Yıllık Hedef',
    distribution: [
      { name: 'BIST Büyüme Hisseleri', percentage: 55, color: '#2563EB', type: 'STOCK', description: 'ASELS, THYAO, TUPRS ve sanayi liderleri' },
      { name: 'TEFAS Fonları', percentage: 25, color: '#8B5CF6', type: 'FUND', description: 'Küresel teknoloji ve tematik fonlar' },
      { name: 'Altın & Emtia', percentage: 10, color: '#F59E0B', type: 'GOLD', description: 'Ons ve jeopolitik koruma' },
      { name: 'Fırsat Likiditesi', percentage: 10, color: '#94A3B8', type: 'CASH', description: 'Taktiksel nakit rezervi' },
    ]
  },
  intermediate_balanced: {
    id: 'intermediate_balanced',
    title: 'BIST 30 & Temettü Odaklı Dengeli Portföy',
    badge: 'Optimum Büyüme',
    description: 'Piyasa üzeri getiri ile koruma refleksini harmanlayan dengeli omurga.',
    expectedRisk: 'Dengeli',
    expectedReturn: '%48 - %70 Yıllık Hedef',
    distribution: [
      { name: 'BIST 30 & Temettü', percentage: 40, color: '#2563EB', type: 'STOCK', description: 'KCHOL, FROTO ve temettü liderleri' },
      { name: 'TEFAS Fonları', percentage: 30, color: '#8B5CF6', type: 'FUND', description: 'TI2 ve TTE fonları' },
      { name: 'Kıymetli Madenler', percentage: 18, color: '#F59E0B', type: 'GOLD', description: 'ZGOLD ve fiziki altın' },
      { name: 'Likit / PPF', percentage: 12, color: '#94A3B8', type: 'CASH', description: 'Günlük faiz ve likidite' },
    ]
  },
  beginner_capital_shield: {
    id: 'beginner_capital_shield',
    title: 'Enflasyon Kalkanı & Sermaye Koruma Portföyü',
    badge: 'Reel Koruma',
    description: 'Sıfıra yakın volatilite ve düzenli reel değer koruma modeli.',
    expectedRisk: 'Düşük',
    expectedReturn: '%38 - %52 Yıllık Hedef',
    distribution: [
      { name: 'Likit & PPF', percentage: 35, color: '#94A3B8', type: 'CASH', description: 'Günlük faiz ve risksiz getiri' },
      { name: 'Altın & Kıymetli Maden', percentage: 30, color: '#F59E0B', type: 'GOLD', description: 'Enflasyon kalkanı' },
      { name: 'TEFAS Fonları', percentage: 20, color: '#8B5CF6', type: 'FUND', description: 'Profesyonel hisse ve karma fonlar' },
      { name: 'BIST 30 Defansif', percentage: 15, color: '#2563EB', type: 'STOCK', description: 'BIMAS ve kriz dayanıklı şirketler' },
    ]
  }
};

// ProfilingQuestionsStep için eski arayüz uyumluluğu
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
