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
      title: 'Gelir ve Gider Yönetimi: Kendi Nakit Akışının Farkına Varmak',
      shortTitle: 'Gelir ve Gider Yönetimi',
      status: 'active',
      description: 'Zenginlik ne kadar kazandığınla değil; ay bittiğinde masada ne bırakabildiğinle başlar.',
      readTime: '3 dk okuma + Kişisel Analiz',
    },
    {
      id: '1-2',
      weekNumber: 2,
      title: 'Tasarruf Nedir, Nasıl Yapılır? (Harcamaları Kısma Sanatı)',
      shortTitle: 'Tasarruf Nedir ve Nasıl Yapılır?',
      status: 'locked',
      description: 'Cimrilik değil, cüzdandaki görünmeyen kaçakları tespit etme bilinci.',
      readTime: 'Hafta 2',
    },
    {
      id: '1-3',
      weekNumber: 3,
      title: 'Bütçe Kuralı (50/30/20): Geliri Rasyonel Dağıtmak',
      shortTitle: 'Bütçe Kuralı (50/30/20)',
      status: 'locked',
      description: 'Zorunlu ihtiyaçlar, kişisel istekler ve yatırımı dengelemenin altın oranı.',
      readTime: 'Hafta 3',
    },
    {
      id: '1-4',
      weekNumber: 4,
      title: 'Borçluluk Nedir? Kötü Borç ile İyi Borç Ayrımı',
      shortTitle: 'Kötü Borç ile İyi Borç Ayrımı',
      status: 'locked',
      description: 'Tüketen borç köleleştirir, üreten borç kaldıraç yaratır.',
      readTime: 'Hafta 4',
    },
    {
      id: '1-5',
      weekNumber: 5,
      title: 'Acil Durum Fonu (Güvenlik Yastığı): Yatırımdan Önceki İlk Zırh',
      shortTitle: 'Acil Durum Fonu (Güvenlik Yastığı)',
      status: 'locked',
      description: 'Borsada en dip fiyattan hisse satmamak için gereken nakit güvencesi.',
      readTime: 'Hafta 5',
    },
    {
      id: '1-6',
      weekNumber: 6,
      title: 'Enflasyon Nedir? Satın Alma Gücü ve Paranın Sessizce Erimesi',
      shortTitle: 'Enflasyon ve Satın Alma Gücü',
      status: 'locked',
      description: 'Parayı nakitte tutmanın neden kesin bir kayıp olduğunu görmek.',
      readTime: 'Hafta 6',
    },
    {
      id: '1-7',
      weekNumber: 7,
      title: 'Paranın Zaman Değeri ve Fırsat Maliyeti',
      shortTitle: 'Zaman Değeri ve Fırsat Maliyeti',
      status: 'locked',
      description: 'Bugün harcanan küçük paraların gelecekteki bileşik bedeli.',
      readTime: 'Hafta 7',
    },
    {
      id: '1-8',
      weekNumber: 8,
      title: 'Neden Yatırım Yapmalıyım? (Tasarruftan Yatırıma Geçiş)',
      shortTitle: 'Neden Yatırım Yapmalıyım?',
      status: 'locked',
      description: 'Parayı sadece saklamak yerine üreten işletmelere ortak etmek.',
      readTime: 'Hafta 8',
    },
    {
      id: '1-9',
      weekNumber: 9,
      title: 'Yatırım Nedir, Nasıl Yapılır? (Varlık Edinme Mantığı)',
      shortTitle: 'Yatırım Nedir ve Nasıl Yapılır?',
      status: 'locked',
      description: 'Fiyat tahmini yapmak ile varlığın nakit üretimine ortak olmak arasındaki fark.',
      readTime: 'Hafta 9',
    },
    {
      id: '1-10',
      weekNumber: 10,
      title: 'Bileşik Getirinin Çarpan Gücü: Zaman ve Kartopu Etkisi',
      shortTitle: 'Bileşik Getirinin Çarpan Gücü',
      status: 'locked',
      description: 'Zamanın sermayeyi nasıl katladığını ve erken başlamanın gücünü kanıtlamak.',
      readTime: 'Hafta 10',
    },
    {
      id: '1-11',
      weekNumber: 11,
      title: 'Pasif Gelir Nedir? Pasif Gelir Kaynakları ve Finansal Bağımsızlık',
      shortTitle: 'Pasif Gelir ve Finansal Bağımsızlık',
      status: 'locked',
      description: 'Varlık getirilerinin temel yaşam masraflarını karşıladığı özgürlük eşiği.',
      readTime: 'Hafta 11',
    },
    {
      id: '1-12',
      weekNumber: 12,
      title: 'Resesyon ve Ekonomik Krizler Nedir? Fırtınalarda Ayakta Kalmak',
      shortTitle: 'Resesyon ve Ekonomik Krizler',
      status: 'locked',
      description: 'Durgunluk dönemlerinde güçlü şirketleri ve sermaye transferini okuma sanatı.',
      readTime: 'Hafta 12',
    },
  ],
};

export const getLesson1Content = (userName?: string | null) => {
  const name = userName ? userName.split(' ')[0] : 'Öğrencimiz';

  return {
    title: 'Gelir ve Gider Yönetimi: Kendi Nakit Akışının Farkına Varmak',
    readTime: '3 dk okuma + Kişisel Analiz',
    blocks: [
      {
        id: 'block-1',
        title: 'Gelir Yanılsaması',
        paragraphs: [
          `Finans dünyasına adım atarken cebe koymamız gereken ilk altın kural şudur ${name}: Çok para kazanmak, otomatik olarak zengin olmak anlamına gelmez. Çünkü ne kadar kazanırsan kazan, giden parayı kontrol edemiyorsan ay sonunda elinde koca bir sıfırla kalırsın.`,
          'Pek çok insan gelirini artırdığı anda aynı hızla harcamalarını da artırarak bitmek bilmeyen bir tüketim döngüsüne hapsolur. Oysa gerçek varlık, kazandığın rakamın büyüklüğünde değil; o paranın ne kadarını koruyup geleceğe taşıyabildiğinde saklıdır.',
          'FinAi Workspace ekibi olarak biz senin finansal gücünü ne kadar ciro yaptığınla değil, ay bittiğinde masada ne kadar net para bırakabildiğinle ölçeceğiz.',
        ],
      },
      {
        id: 'block-2',
        title: 'Nakit Akışı',
        paragraphs: [
          'İlk kuralı cebimize koyduysak, şimdi resmin kalbine, yani nakit akışının çalışma mantığına odaklanalım. Gelirini evine temiz su taşıyan ana musluk, harcamalarını ise bu suyun biriktiği teknenin altındaki irili ufaklı delikler gibi düşünebilirsin.',
          'Deliklerin nerede olduğunu bilmezsen, musluğu sonuna kadar açsan bile teknenin su almasını ve batmasını engelleyemezsin. Genellikle bütçemizi sarsan şeyler tek seferlik büyük harcamalar değil; fark etmeden her gün tekrarladığımız küçük sızıntılardır. Bir delik ne kadar küçük görünürse görünsün, zamanla koca bir gemiyi batıracak kadar su biriktirebilir.',
          'Tam da bu yüzden, bu metinleri bitirdiğinde kendi teknendeki kaçakları tek tek fark etmeni sağlayacak interaktif bir uygulama yapacağız; bu sayede paranın nereye sızdığını ilk kez kendi gözlerinle göreceksin.',
        ],
      },
      {
        id: 'block-3',
        title: 'Dürüst Bir Yüzleşme',
        paragraphs: [
          `Teknedeki delikleri kapatmanın ilk adımı ise, bu sayılarla dürüstçe yüzleşme cesaretini göstermektir ${name}. Burada kimse seni harcamaların yüzünden yargılamayacak; kira ödüyorsan yazacak, ödemiyorsan alanı boş bırakacak veya küçük keyif harcamaların varsa onları da dürüstçe masaya koyacaksın.`,
          'Finansal kontrol, harcamaktan korkmak veya kendini her şeyden mahrum bırakmak değil; her liranın nereye gittiğini bilerek bilinçli tercih yapmaktır. Nereye gittiğini bilmediğin bir parayı yönetemez ve asla yatırıma dönüştüremezsin.',
          'Birazdan yapacağımız çalışmada amacımız hayat standardını kısıtlamak değil; kazandığın paranın tam olarak nereye aktığını fark ederek kontrolü ilk kez gerçekten eline almanı sağlamaktır.',
        ],
      },
      {
        id: 'block-4',
        title: 'Serbest Nakit',
        paragraphs: [
          "Bütün bu resmi netleştirdikten sonra, şimdi işin en heyecan verici tarafına, yani geleceğini inşa edeceğimiz adıma geçiyoruz. Zorunlu tüm giderlerin çıktıktan sonra elinde kalan her bir liraya FinAi Workspace ekibi olarak biz 'serbest nakit' deriz.",
          'Bu kalan para, ilerleyen haftalarda şirketlere ortak edeceğimiz ve senin yerine gece gündüz çalıştıracağımız tohum sermayendir. Bugün masada bırakabildiğin her serbest nakit, gelecekte senin için çalışan ve sana zaman kazandıran sessiz birer çalışana dönüşecektir. Ne kadar küçük başlarsan başla, bu tohum doğru sulandığında finansal bağımsızlığının en sağlam kalesini oluşturur.',
          'Şimdi aşağıdaki masaya geçelim ve kendi gerçek sayılarını girerek bu tohumun büyüklüğünü birlikte keşfedelim.',
        ],
      },
    ],
  };
};
