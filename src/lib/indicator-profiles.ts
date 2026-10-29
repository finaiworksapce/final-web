export interface TechnicalTermTooltip {
    term: string;
    label: string;
    definition: string;
}

export interface IndicatorProfile {
    id: string;
    name: string;
    country: string;
    flag: string;
    category: 'Enflasyon' | 'İstihdam' | 'Faiz & Para Politikası' | 'Büyüme & İmalat' | 'Dış Ticaret';
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    unit: string; // '%', 'K', 'B $', 'Puan'
    higherIsPositive: boolean; // Gösterge yönü
    definition: string; // 1. Tanım (5-8 Cümle, Jargonsuz)
    realLifeExample?: string; // 2. FinAi INTELLIGENCE (Günlük Hayattan Örnek, 5-8 Cümle)
    whatItMeasures: string; // 2. Ne ölçer?
    whyItMatters: string; // 3. Neden önemlidir?
    howToInterpret: string; // 4. Nasıl yorumlanır? (YENİ 7.1 SEVİYESİ)
    impactChannels: Array<{ step: string; title: string; desc: string }>; // Dinamik etki zinciri
    chartReadingCards: {
        direction: string; // 01 - Yön
        changeSpeed: string; // 02 - Değişim Hızı
        context: string; // 03 - Bağlam
    };
    whatWeCannotInfer: string; // Ne çıkaramayız?
    financialLiteracyItems: Array<{ title: string; content: string }>; // Finansal Okuryazarlık
    relatedIndicators: Array<{ name: string; id: string; category: string }>; // İlgili göstergeler
}

export const TECHNICAL_TERMS: Record<string, TechnicalTermTooltip> = {
    actual: {
        term: 'actual',
        label: 'Açıklanan Veri',
        definition: 'Ekonomik göstergenin ilgili dönem için resmi kurumlarca yayınlanan gerçekleşen nihai değeridir.'
    },
    forecast: {
        term: 'forecast',
        label: 'Beklenti',
        definition: 'Piyasa analistleri ve kurumsal kurumların veri açıklanmadan önceki tahmin ortalamasıdır.'
    },
    previous: {
        term: 'previous',
        label: 'Önceki',
        definition: 'Bir önceki açıklama döneminde yayınlanan (veya revize edilen) resmi referans değerdir.'
    },
    dezenflasyon: {
        term: 'dezenflasyon',
        label: 'Dezenflasyon',
        definition: 'Fiyatların düşmesi değil, enflasyon oranının (fiyat artış hızının) yavaşlaması sürecidir.'
    },
    baseEffect: {
        term: 'baseEffect',
        label: 'Baz Etkisi',
        definition: 'Bir önceki yılın aynı dönemindeki sıra dışı yüksek veya düşük değerlerin yıllık artış oranına olan etkisidir.'
    }
};

export const INDICATOR_PROFILES_DATABASE: Record<string, IndicatorProfile> = {
    "Aylık Tüketici Fiyat Endeksi (TÜFE)": {
        id: "tr_cpi_mom",
        name: "Aylık Tüketici Fiyat Endeksi (TÜFE)",
        country: "TR",
        flag: "🇹🇷",
        category: "Enflasyon",
        impactLevel: "critical",
        unit: "%",
        higherIsPositive: false,
        definition: "Tüketici Fiyat Endeksi (TÜFE), hanehalklarının tükettiği mal ve hizmet sepetinin aylık bazdaki ortalama fiyat değişimini ölçer.",
        whatItMeasures: "Hanehalkı harcama sepetindeki aylık fiyat artış hızını ve Türk Lirası'nın satın alma gücündeki aylık erimeyi ölçer.",
        whyItMatters: "TCMB faiz kararlarını, mevduat getirilerini, ev kiralarını ve maaş zam oranlarını doğrudan belirleyen en kritik makro veridir.",
        howToInterpret: "TÜFE'yi değerlendirirken yalnızca mevcut değere değil; önceki döneme, piyasa beklentisine, yıllık enflasyona ve çekirdek fiyat göstergelerine birlikte bakmak gerekir.",
        impactChannels: [
            { step: "VERİ", title: "Açıklanan TÜFE Oranı", desc: "Aylık fiyat artış hızı verisi açıklanır." },
            { step: "BEKLENTİLER", title: "Enflasyon Beklentileri", desc: "Piyasanın gelecek dönem enflasyon patikasına dair öngörüleri şekillenir." },
            { step: "PARA POLİTİKASI", title: "TCMB Duruşu", desc: "Merkez Bankası para politikasında sıkılaşma veya esnetme alanını değerlendirir." },
            { step: "FAİZLER", title: "Borçlanma & Mevduat", desc: "Politika faizine paralel olarak mevduat ve kredi faiz oranları dengelenir." },
            { step: "KREDİ / MEVDUAT", title: "Likidite Akışı", desc: "Hanehalkı ve şirketlerin harcama veya tasarruf tercihleri etkilenir." },
            { step: "FİNANSAL VARLIKLAR", title: "Borsa & Döviz", desc: "Reel getiriler doğrultusunda borsa şirketleri ve döviz kurları dengesini bulur." }
        ],
        chartReadingCards: {
            direction: "Grafikteki yukarı yönlü hareket aylık fiyat artışının hızlandığına, aşağı yönlü hareket ise dezenflasyon sürecine işaret eder.",
            changeSpeed: "Çizginin eğimindeki artış fiyat basamaklarının ne kadar sert veya kademeli tırmandığını ortaya koyar.",
            context: "Tek bir ayın sıçraması mevsimsel olabilir; bu nedenle en az 3 ile 6 aylık hareketli ortalamayla incelenmelidir."
        },
        whatWeCannotInfer: "Tek bir aylık TÜFE açıklamasından enflasyonun uzun vadeli trendinin kalıcı olarak kırıldığı sonucu çıkarılamaz. Sonraki aylar ve çekirdek göstergelerle birlikte değerlendirilmelidir.",
        financialLiteracyItems: [
            { title: "Aylık ve Yıllık Enflasyon Arasındaki Fark Nedir?", content: "Aylık enflasyon sadece son 30 gündeki fiyat değişimini, yıllık enflasyon ise son 12 ayın birikimli toplam artışını gösterir." },
            { title: "Çekirdek Enflasyon Nedir?", content: "Gıda ve enerji gibi oynak fiyatlı kalemlerin çıkarılmasıyla hesaplanan ana enflasyon eğilimi göstergesidir." }
        ],
        relatedIndicators: [
            { name: "Yıllık Enflasyon Oranı (TÜFE)", id: "tr_cpi_yoy", category: "Enflasyon" },
            { name: "Aylık Üretici Fiyat Endeksi (ÜFE)", id: "tr_ppi_mom", category: "Enflasyon" },
            { name: "TCMB Politika Faizi Kararı", id: "tr_cbrt_rate", category: "Faiz & Para Politikası" }
        ]
    },
    "Yıllık Enflasyon Oranı (TÜFE)": {
        id: "tr_cpi_yoy",
        name: "Yıllık Enflasyon Oranı (TÜFE)",
        country: "TR",
        flag: "🇹🇷",
        category: "Enflasyon",
        impactLevel: "critical",
        unit: "%",
        higherIsPositive: false,
        definition: "Yıllık TÜFE Enflasyonu, son 12 ay içerisindeki tüketici fiyat seviyesinin birikimli yıllık artış oranını gösterir.",
        whatItMeasures: "Ülkedeki genel fiyat düzeyinin 1 yıllık zaman ufku içerisindeki toplam artış hızını ölçer.",
        whyItMatters: "Kira artış tavanları, asgari ücret güncellemeleri ve memur/emekli zam oranları resmi olarak bu veriye dayanır.",
        howToInterpret: "Yıllık enflasyonu incelerken baz etkisinin (geçen yılın aynı ayındaki sıra dışı verilerin) oran üzerindeki yapay yükseltici veya düşürücü etkisini göz önüne almak şarttır.",
        impactChannels: [
            { step: "VERİ", title: "Yıllık TÜFE Verisi", desc: "Son 12 ayın birikimli artış oranı yayınlanır." },
            { step: "BEKLENTİLER", title: "Reel Faiz Beklentisi", desc: "Mevduat faizlerinin enflasyon karşısındaki koruma gücü ölçülür." },
            { step: "PARA POLİTİKASI", title: "Sıkılaşma Patikası", desc: "TCMB'nin enflasyon hedefleri doğrultusundaki kararlılığı değerlendirilir." },
            { step: "FAİZLER", title: "Uzun Vadeli Oranlar", desc: "Tahvil faizleri ve uzun vadeli konut kredileri şekillenir." },
            { step: "KREDİ / MEVDUAT", title: "Tasarruf Eğilimi", desc: "TL tasarruf ve enflasyondan korunma arayışı yön bulur." },
            { step: "FİNANSAL VARLIKLAR", title: "Varlık Değerlemeleri", desc: "Şirket değerlemeleri ve reel varlık fiyatları dengelenir." }
        ],
        chartReadingCards: {
            direction: "Grafikteki gerileme dezenflasyon sürecini temsil eder. Değerin düşmesi fiyatların ucuzladığı anlamına değil, artış hızının yavaşladığı anlamına gelir.",
            changeSpeed: "Yıllık eğrinin eğimindeki yumuşama enflasyon ivmesinin kırılma hızını gösterir.",
            context: "Geçen yılın yüksek aylık verileri endeksten çıktıkça oluşan baz etkisi trend analizinde ayırt edilmelidir."
        },
        whatWeCannotInfer: "Yıllık enflasyonun düşmesi market fiyatlarının ucuzladığı anlamına gelmez; fiyatların geçen yıla göre daha yavaş pahalandığını gösterir.",
        financialLiteracyItems: [
            { title: "Dezenflasyon ile Deflasyon Arasındaki Fark", content: "Dezenflasyon fiyat artış hızının yavaşlamasıdır. Deflasyon ise fiyatların genel olarak mutlak gerilemesidir." }
        ],
        relatedIndicators: [
            { name: "Aylık Tüketici Fiyat Endeksi (TÜFE)", id: "tr_cpi_mom", category: "Enflasyon" },
            { name: "TCMB Politika Faizi Kararı", id: "tr_cbrt_rate", category: "Faiz & Para Politikası" }
        ]
    },
    "Fed Politika Faizi Kararı": {
        id: "us_fed_rate",
        name: "Fed Politika Faizi Kararı",
        country: "ABD",
        flag: "🇺🇸",
        category: "Faiz & Para Politikası",
        impactLevel: "critical",
        unit: "%",
        higherIsPositive: true,
        definition: "Fed (ABD Merkez Bankası) politika faizi kararı, küresel finansal sistemdeki Dolar borçlanma maliyetinin taban seviyesidir.",
        whatItMeasures: "Küresel Dolar likiditesinin fiyatını ve borçlanma maliyetini ölçer.",
        whyItMatters: "Dünya borsaları, Ons Altın, gelişmekte olan ülke para birimleri ve küresel kredi mekanizması üzerinde birinci derecede etkilidir.",
        howToInterpret: "Fed kararını değerlendirirken yalnızca alınan faiz adımına değil; karar metnindeki şahin/güvercin ifadelere ve Fed Başkanı'nın yönlendirmelerine bakılmalıdır.",
        impactChannels: [
            { step: "VERİ", title: "Fed Faiz Kararı", desc: "Politika faiz oranı ve karar metni açıklanır." },
            { step: "BEKLENTİLER", title: "Küresel Dolar Gücü", desc: "Dolar endeksi (DXY) ve küresel likidite algısı değişir." },
            { step: "PARA POLİTİKASI", title: "Küresel Sıkılaşma/Gevşeme", desc: "Diğer merkez bankalarının hareket alanı etkilenir." },
            { step: "FAİZLER", title: "Tahvil Verimleri", desc: "ABD 10 Yıllık ve küresel borçlanma faizleri tepki verir." },
            { step: "KREDİ / MEVDUAT", title: "Küresel Sermaye Akışı", desc: "Gelişmekte olan ülkelere sermaye akışı veya çıkışı yaşanabilir." },
            { step: "FİNANSAL VARLIKLAR", title: "Altın & Küresel Borsalar", desc: "Ons Altın, Kripto ve küresel hisse senedi piyasaları yeniden fiyatlanır." }
        ],
        chartReadingCards: {
            direction: "Grafikteki merdiven basamakları para politikası döngülerini (sıkılaşma veya gevşeme patikalarını) temsil eder.",
            changeSpeed: "Pasif geçilen toplantılar ile 25/50 baz puanlık adımların sıklığı sıkılaşmanın dozunu gösterir.",
            context: "Faiz oranı kararıyla birlikte piyasa faiz patikası tahminlerini (Dot Plot) de incelemek şarttır."
        },
        whatWeCannotInfer: "Fed faiz indirdiği an tüm borsaların kesin yükseleceği çıkarılamaz; resesyon endişeleri varsa hisse piyasaları baskılanabilir.",
        financialLiteracyItems: [
            { title: "Fed Notları ve Dot Plot Nedir?", content: "Fed üyelerinin geleceğe dair faiz tahminlerini gösteren nokta grafiktir." }
        ],
        relatedIndicators: [
            { name: "Tarım Dışı İstihdam Değişimi (NFP)", id: "us_nfp", category: "İstihdam" },
            { name: "ISM İmalat PMI Endeksi", id: "us_ism_pmi", category: "Büyüme & İmalat" }
        ]
    },
    "İngiltere Merkez Bankası (BoE) Faiz Kararı": {
        id: "uk_boe_rate",
        name: "İngiltere Merkez Bankası (BoE) Faiz Kararı",
        country: "UK",
        flag: "🇬🇧",
        category: "Faiz & Para Politikası",
        impactLevel: "critical",
        unit: "%",
        higherIsPositive: true,
        definition: "İngiltere Merkez Bankası (BoE) Faiz Kararı, ülkedeki bankaların birbirine borç verirken uygulayacağı temel borçlanma maliyetinin resmi olarak belirlenmesidir. Bu kritik karar, Para Politikası Kurulu bünyesindeki 9 bağımsız uzmanın toplanıp oy kullanmasıyla iki ayda bir alınır. Kararın temel amacı, çarşı ve pazardaki fiyat artışlarını kontrol altında tutarak İngiliz Sterlini'nin alım gücünü korumaktır. Faiz yükseltildiğinde para harcamak yerine bankada biriktirmek daha cazip hale gelir ve genel tüketim yavaşlar. Faiz indirildiğinde ise kredi çekmek kolaylaşır, piyasaya sıcak para girer ve ekonomik çarklar hızlanır. Küresel finans dünyasının en köklü merkezlerinden biri olduğu için alınan bu faiz kararı hem Sterlin'in değerini hem de dünya piyasalarını doğrudan sarsar.",
        realLifeExample: "Yeni bir ev almak ya da arabanızı yenilemek için bankadan kredi çekmeyi düşündüğünüzü hayal edin. İngiltere Merkez Bankası faiz artırdığında, bankaların size sunduğu kredi faizleri de anında yükselir. Bu durum, her ay ödeyeceğiniz kredi taksitinin artması ve borçlanmanın çok daha masraflı hale gelmesi anlamına gelir. Taksitler yükselince insanlar büyük harcamalarını erteler, parasını harcamak yerine bankada biriktirmeyi seçer. Alışverişler azalıp dükkanlar müşteri çekmekte zorlanınca da çarşı pazardaki hızlı fiyat artışları yavaşlamaya başlar. Böylece bankanın aldığı tek bir karar, cebinizdeki harçlıktan ay sonundaki kredi kartı ekstrenize kadar tüm bütçenize doğrudan dokunur.",
        whatItMeasures: "İngiltere ekonomisindeki resmi borçlanma faizini ve para politikasının sıkılık düzeyini ölçer.",
        whyItMatters: "Küresel finansın merkezi Londra'daki sermaye akışlarını, Sterlin kurunu ve dünya borsalarını doğrudan belirler.",
        howToInterpret: "Kararla birlikte Para Politikası Kurulu üyelerinin oy dağılımı ve geleceğe dair enflasyon projeksiyonları incelenmelidir.",
        impactChannels: [
            { step: "MERKEZ BANKASI", title: "Faiz Oranı Açıklanır", desc: "İngiltere Merkez Bankası yeni faiz oranını kamuoyuyla paylaşır. Piyasa bu kararı önceki beklentilerle kıyaslayarak ilk tepkisini verir." },
            { step: "STERLİN", title: "Para Birimi Dalgalanır", desc: "Faiz artarsa İngiliz Sterlini yabancı yatırımcı için cazip hale gelip güçlenir. Faiz inerse Sterlin diğer para birimleri karşısında değer kaybeder." },
            { step: "BANKA KREDİLERİ", title: "Borçlanma Şartları Değişir", desc: "Ticari bankalar kredi faizlerini ve mevduat getirilerini yeni karara göre ayarlar. Vatandaşın ve şirketlerin borçlanma maliyeti doğrudan değişir." },
            { step: "TÜKETİM & TASARRUF", title: "Harcamalar Yön Değiştirir", desc: "Faizler yüksekken insanlar tasarrufa yönelip harcamaları kısar. Faizler düşükken ise tüketim artar ve şirketler yeni yatırımlara girişir." },
            { step: "BORSA & PİYASA", title: "Şirket Değerleri Dengelenir", desc: "Yüksek faiz şirket karlarını baskılayıp hisse piyasalarını sakinleştirir. Düşük faiz ise borsalara canlılık ve hareketlilik getirir." }
        ],
        chartReadingCards: {
            direction: "Grafikteki yukarı yönlü basamaklar parasal sıkılaşmayı, aşağı yönlü basamaklar ise faiz indirimi döngüsünü simgeler.",
            changeSpeed: "Toplantılardaki faiz artış veya indirim sıklığı ekonomideki aciliyet derecesini gösterir.",
            context: "Kararın yanı sıra Kurul tutanakları ve toplantı sonrası basın açıklaması dikkatle izlenmelidir."
        },
        whatWeCannotInfer: "Faiz kararından tek başına Sterlin'in aylarca hangi yöne gideceği kesin olarak çıkarılamaz; küresel jeopolitik ve büyüme verileri de etkilidir.",
        financialLiteracyItems: [
            { title: "BoE Para Politikası Kurulu (MPC) Kimlerden Oluşur?", content: "9 üyeden oluşur: Başkan, 3 Başkan Yardımcısı, Baş Ekonomist ve Hazine Bakanı tarafından atanan 4 bağımsız harici uzman." }
        ],
        relatedIndicators: [
            { name: "Fed Politika Faizi Kararı", id: "us_fed_rate", category: "Faiz & Para Politikası" },
            { name: "S&P Global İmalat PMI (Nihai)", id: "uk_pmi_final", category: "Büyüme & İmalat" }
        ]
    },
    "Default": {
        id: "default_indicator",
        name: "Ekonomik Gösterge",
        country: "TR",
        flag: "🌐",
        category: "Büyüme & İmalat",
        impactLevel: "medium",
        unit: "%",
        higherIsPositive: true,
        definition: "Makroekonomik piyasa takibinde kullanılan resmi ekonomik gösterge verisidir.",
        whatItMeasures: "Piyasadaki ekonomik aktivite düzeyini ve finansal dengeleri ölçer.",
        whyItMatters: "Yatırımcı kararlarını ve makroekonomik beklentileri yönlendirir.",
        howToInterpret: "Göstergeyi değerlendirirken geçmiş trendle uyumuna ve piyasa beklentileriyle olan farkına odaklanılmalıdır.",
        impactChannels: [
            { step: "VERİ", title: "Veri Açıklaması", desc: "Resmi makro veri yayınlanır." },
            { step: "BEKLENTİLER", title: "Piyasa Algısı", desc: "Makroekonomik beklentiler güncellenir." },
            { step: "PARA POLİTİKASI", title: "Politika Etkisi", desc: "Ekonomi yönetiminin kararlarına girdi sağlar." },
            { step: "FAİZLER", title: "Piyasa Faizleri", desc: "Borçlanma maliyetlerine yansır." },
            { step: "KREDİ / MEVDUAT", title: "Reel Kesim Etkisi", desc: "Şirketler ve hanehalklarının tercihlerini etkiler." },
            { step: "FİNANSAL VARLIKLAR", title: "Piyasa Dengeleme", desc: "Finansal asset fiyatlamaları dengelenir." }
        ],
        chartReadingCards: {
            direction: "Grafikteki yükseliş veya düşüş ilgili makro değişkenin dönemsel seyrini ifade eder.",
            changeSpeed: "Verinin değişim ivmesi kırılma anlarını gösterir.",
            context: "Tek veri yerine dönemsel ortalamalara odaklanılmalıdır."
        },
        whatWeCannotInfer: "Tek veri açıklamasından uzun vadeli piyasa yönü çıkarılamaz.",
        financialLiteracyItems: [
            { title: "Makro Veri Nedir?", content: "Ekonominin genel sağlık durumunu gösteren istatistiki göstergelerdir." }
        ],
        relatedIndicators: []
    }
};
