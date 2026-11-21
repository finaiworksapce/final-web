export interface AcademyTopic {
  id: string;
  weekNumber: number;
  title: string;
  shortTitle: string;
  status: 'active' | 'locked';
  description: string;
  readTime: string;
}

export interface UnitConfig {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  topics: AcademyTopic[];
}

export const UNIT_1_CONFIG: UnitConfig = {
  id: 'unit-1',
  unitNumber: 1,
  title: 'Kişisel Finans ve Yatırıma Niye İhtiyaç Vardır?',
  subtitle: 'Kendi bütçenizi yönetme, enflasyona karşı korunma ve sermaye biriktirme temelleri.',
  topics: [
    {
      id: '1-1',
      weekNumber: 1,
      title: '1.1 Gelir ve Gider Yönetimi: Ev Ekonomisi ve Nakit Akışı Nedir?',
      shortTitle: 'Gelir ve Gider Yönetimi (Nakit Akışı)',
      status: 'active',
      description: 'Zenginlik kazanılan parayla değil, ay sonunda elde kalan nakitle ölçülür.',
      readTime: '4 dk okuma + Simülasyon',
    },
    {
      id: '1-2',
      weekNumber: 2,
      title: '1.2 Tasarruf Nedir, Nasıl Yapılır? (Harcamaları Kısma Sanatı)',
      shortTitle: 'Tasarruf Nedir ve Nasıl Yapılır?',
      status: 'locked',
      description: 'Cimrilik değil, cüzdandaki görünmeyen kaçakları tespit etme bilinci.',
      readTime: 'Hafta 2',
    },
    {
      id: '1-3',
      weekNumber: 3,
      title: '1.3 Bütçe Kuralı (50/30/20): Geliri Rasyonel Dağıtmak',
      shortTitle: 'Bütçe Kuralı (50/30/20)',
      status: 'locked',
      description: 'Zorunlu ihtiyaçlar, kişisel istekler ve yatırımı dengelemenin altın oranı.',
      readTime: 'Hafta 3',
    },
    {
      id: '1-4',
      weekNumber: 4,
      title: '1.4 Borçluluk Nedir? Kötü Borç ile İyi Borç Ayrımı',
      shortTitle: 'Kötü Borç ile İyi Borç Ayrımı',
      status: 'locked',
      description: 'Tüketen borç köleleştirir, üreten borç kaldıraç yaratır.',
      readTime: 'Hafta 4',
    },
    {
      id: '1-5',
      weekNumber: 5,
      title: '1.5 Acil Durum Fonu (Güvenlik Yastığı): Yatırımdan Önceki İlk Zırh',
      shortTitle: 'Acil Durum Fonu (Güvenlik Yastığı)',
      status: 'locked',
      description: 'Borsada en dip fiyattan hisse satmamak için gereken nakit güvencesi.',
      readTime: 'Hafta 5',
    },
    {
      id: '1-6',
      weekNumber: 6,
      title: '1.6 Enflasyon Nedir? Satın Alma Gücü ve Paranın Sessizce Erimesi',
      shortTitle: 'Enflasyon ve Satın Alma Gücü',
      status: 'locked',
      description: 'Parayı nakitte tutmanın neden kesin bir kayıp olduğunu görmek.',
      readTime: 'Hafta 6',
    },
    {
      id: '1-7',
      weekNumber: 7,
      title: '1.7 Paranın Zaman Değeri ve Fırsat Maliyeti',
      shortTitle: 'Zaman Değeri ve Fırsat Maliyeti',
      status: 'locked',
      description: 'Bugün harcanan küçük paraların gelecekteki bileşik bedeli.',
      readTime: 'Hafta 7',
    },
    {
      id: '1-8',
      weekNumber: 8,
      title: '1.8 Neden Yatırım Yapmalıyım? (Tasarruftan Yatırıma Geçiş)',
      shortTitle: 'Neden Yatırım Yapmalıyım?',
      status: 'locked',
      description: 'Parayı sadece saklamak yerine üreten işletmelere ortak etmek.',
      readTime: 'Hafta 8',
    },
    {
      id: '1-9',
      weekNumber: 9,
      title: '1.9 Yatırım Nedir, Nasıl Yapılır? (Varlık Edinme Mantığı)',
      shortTitle: 'Yatırım Nedir ve Nasıl Yapılır?',
      status: 'locked',
      description: 'Fiyat tahmini yapmak ile varlığın nakit üretimine ortak olmak arasındaki fark.',
      readTime: 'Hafta 9',
    },
    {
      id: '1-10',
      weekNumber: 10,
      title: '1.10 Bileşik Getirinin Çarpan Gücü: Zaman ve Kartopu Etkisi',
      shortTitle: 'Bileşik Getirinin Çarpan Gücü',
      status: 'locked',
      description: 'Zamanın sermayeyi nasıl katladığını ve erken başlamanın gücünü kanıtlamak.',
      readTime: 'Hafta 10',
    },
    {
      id: '1-11',
      weekNumber: 11,
      title: '1.11 Pasif Gelir Nedir? Pasif Gelir Kaynakları ve Finansal Bağımsızlık',
      shortTitle: 'Pasif Gelir ve Finansal Bağımsızlık',
      status: 'locked',
      description: 'Varlık getirilerinin temel yaşam masraflarını karşıladığı özgürlük eşiği.',
      readTime: 'Hafta 11',
    },
    {
      id: '1-12',
      weekNumber: 12,
      title: '1.12 Resesyon ve Ekonomik Krizler Nedir? Fırtınalarda Ayakta Kalmak',
      shortTitle: 'Resesyon ve Ekonomik Krizler',
      status: 'locked',
      description: 'Durgunluk dönemlerinde güçlü şirketleri ve sermaye transferini okuma sanatı.',
      readTime: 'Hafta 12',
    },
  ],
};

export const LESSON_1_1_CONTENT = {
  title: '1.1 Gelir ve Gider Yönetimi: Ev Ekonomisi ve Nakit Akışı Nedir?',
  readTime: '3 dk okuma + Kişisel Analiz',
  introSubtitle: 'Zenginlik, kazandığınız toplam rakamla değil; ay sonunda elinizde tutabildiğiniz nakitle başlar.',
  blocks: [
    {
      id: 'block-1',
      title: 'Gelir Tek Başına Neden Bir Şey İfade Etmez?',
      paragraphs: [
        'Finansal dünyada insanların yaptığı en yaygın hata, zenginliği sadece kazanılan paranın büyüklüğüyle ölçmektir. Oysa ayda 100.000 ₺ kazanıp 105.000 ₺ harcayan biri finansal olarak uçurumun kenarındayken, 30.000 ₺ kazanıp 10.000 ₺ biriktirebilen biri gerçek sermaye sahibidir.',
        'Biz FinAi olarak gücünüzü ne kadar kazandığınızla değil, ay sonunda elinizde ne kaldığıyla ölçeriz.',
      ],
    },
    {
      id: 'block-2',
      title: 'Nakit Akışı Nedir? (Musluk ve Tekne Dengesi)',
      paragraphs: [
        'Nakit akışı; cebinize giren parayla cebinizden çıkan paranın zamana karşı dansıdır. Geliriniz teknenize su dolduran ana musluk, giderleriniz ise teknenin altındaki irili ufaklı deliklerdir.',
        'Eğer deliklerin nerede olduğunu bilmezseniz, musluğu ne kadar açarsanız açın teknenin batmasını engelleyemezsiniz.',
      ],
    },
    {
      id: 'block-3',
      title: 'İlk Adım Yüzleşmektir',
      paragraphs: [
        'Yatırım yapmaya, hisse seçmeye veya şirket bilançosu okumaya başlamadan önceki ilk zorunlu adım, kendi kişisel bilançonuzla dürüstçe yüzleşmektir. Harcamalarınızın nereye gittiğini tam olarak görmeden borsaya para yatırmak, gözü kapalı araba kullanmaktan farksızdır.',
        'Şimdi aşağıda, hiçbir zorlama ve şablon kısıtlaması olmadan kendi hayatınızın rakamlarını masaya yatırarak ilk adımı atacağız.',
      ],
    },
  ],
};
