// src/config/onboarding-questions.ts
// FinAi Onboarding Soru ve Strateji Konfigürasyonu
// İleride kullanıcı özel sorular verdiğinde doğrudan bu dosya güncellenecektir.

export type FinancialLiteracyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  weight?: {
    stock?: number;
    fund?: number;
    gold?: number;
    cash?: number;
    crypto?: number;
  };
}

export interface OnboardingQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

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

// Seviyelere ve soru profiline göre varsayılan Örnek Portföy Dağılımları
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
  }
};

// İleride verilecek sorular için varsayılan soru seti
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'investment_horizon',
    title: 'Yatırımlarınızı ne kadar süreyle tutmayı planlıyorsunuz?',
    subtitle: 'Yatırım vadeniz, ideal varlık dağılımınızı doğrudan belirler.',
    options: [
      { id: 'short', label: 'Kısa Vade (1 - 6 Ay)', description: 'Acil ihtiyaç duyabileceğim parayı değerlendirmek istiyorum.' },
      { id: 'medium', label: 'Orta Vade (6 Ay - 2 Yıl)', description: 'Belirli bir hedef için (araba, ev peşinatı vb.) birikim yapıyorum.' },
      { id: 'long', label: 'Uzun Vade (2+ Yıl)', description: 'Geleceğim ve finansal özgürlüğüm için bileşik getiriden faydalanmak istiyorum.' }
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
