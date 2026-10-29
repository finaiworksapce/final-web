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
        definition: "Fed Politika Faizi Kararı, ABD Merkez Bankası Federal Açık Piyasa Komitesi (FOMC) tarafından belirlenen ve küresel piyasalarda Dolar borçlanmanın taban maliyetini oluşturan faiz kararıdır. Bu stratejik oran, yılda sekiz defa toplanan komite üyelerinin ekonomik verileri masaya yatırıp oy birliği veya oy çokluğuyla karar almasıyla şekillenir. Kararın asli görevi, Amerika'da hem fiyat istikrarını sağlamak hem de istihdam piyasasının sağlıklı büyümesini temin etmektir. Fed faiz artırdığında dünyadaki Dolar likiditesi daralır, borçlanmak küresel çapta zorlaşır ve enflasyon baskılanmaya çalışılır. Faiz indirildiğinde ise küresel finansal sisteme ucuz likidite akar ve dünya çapında yatırım iştahı tetiklenir. ABD Doları dünya ticaretinin ana para birimi olduğu için bu karar Türkiye dahil tüm dünya ekonomilerini derinden sarsar.",
        realLifeExample: "Yurt dışından ithal edilen cep telefonlarının, bilgisayarların veya benzin fiyatlarının neden aniden pahalandığını merak ettiğinizi varsayın. Amerika Merkez Bankası faiz artırdığında, dünyadaki tüm yatırımcılar paralarını Dolar'a çevirip güvenli Amerikan tahvillerine yatırmaya başlar. Bu durum Dolar'ın küresel çapta güçlenmesine ve diğer ülkelerin para birimleri karşısında tırmanmasına neden olur. Dolar yükselince Türkiye'ye ithal edilen her teknolojik ürünün ve ham petrolün raf fiyatı doğrudan artar. Fiyatlar artınca da ay sonu kredi kartı ekstreleriniz ve market alışverişi sepetiniz daha hızlı dolup taşar. Böylece okyanusun ötesinde alınan bir faiz kararı, Türkiye'deki bir vatandaşın günlük çarşı pazar masrafına kadar yansır.",
        whatItMeasures: "Küresel Dolar likiditesinin fiyatını ve borçlanma maliyetini ölçer.",
        whyItMatters: "Dünya borsaları, Ons Altın, gelişmekte olan ülke para birimleri ve küresel kredi mekanizması üzerinde birinci derecede etkilidir.",
        howToInterpret: "Fed kararını değerlendirirken yalnızca alınan faiz adımına değil; karar metnindeki şahin/güvercin ifadelere ve Fed Başkanı'nın yönlendirmelerine bakılmalıdır.",
        impactChannels: [
            { step: "FED KOMİTESİ", title: "Faiz Kararı", desc: "Fed politika faiz oranını ve ekonomik tahmin özetini (Dot Plot) duyurur. Küresel piyasalar açıklanan karara göre anlık pozisyon alır." },
            { step: "DOLAR ENDEKSİ", title: "DXY ve Kurlar", desc: "Faiz artışı küresel Dolar endeksini (DXY) yukarı taşırken gelişen ülke para birimlerini baskılar. Faiz indirimi ise Dolar'ı zayıflatır." },
            { step: "ONS ALTIN & EMTİALAR", title: "Emtia Fiyatlaması", desc: "Dolar'ın faizi yükselince faiz getirisi olmayan Ons Altın baskılanır. Faiz düştüğünde ise altın ve gümüşe küresel talep artar." },
            { step: "KÜRESEL SERMAYE", title: "Fon Akışları", desc: "Yüksek ABD faizleri sermayeyi Amerika'ya geri çeker. Düşük faiz döneminde ise Türkiye gibi gelişmekte olan ülkelere yabancı sıcak para akar." },
            { step: "DÜNYA VE TÜRKİYE BORSALARI", title: "Hisse Eğilimi", desc: "Küresel faiz artışı Wall Street'ten Borsa İstanbul'a kadar risk iştahını frenler. Faiz gevşemesi ise dünya borsalarında ralliye zemin hazırlar." }
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
    "TCMB Politika Faizi Kararı": {
        id: "tr_cbrt_rate",
        name: "TCMB Politika Faizi Kararı",
        country: "TR",
        flag: "🇹🇷",
        category: "Faiz & Para Politikası",
        impactLevel: "critical",
        unit: "%",
        higherIsPositive: true,
        definition: "Türkiye Cumhuriyet Merkez Bankası (TCMB) Politika Faizi Kararı, bankaların Merkez Bankası'ndan Türk Lirası borçlanırken veya fazla paralarını yatırırken esas alacakları bir haftalık repo faiz oranının belirlenmesidir. Bu hayati karar, Para Politikası Kurulu üyelerinin her ay düzenli olarak toplanıp oy kullanması neticesinde resmi olarak duyurulur. Kararın ana amacı, piyasadaki para bolluğunu veya kıtlığını ayarlayarak çarşıdaki fiyat artışlarını dizginlemek ve Türk Lirası'nın değerini korumaktır. Faiz artırıldığında borçlanma pahalılaşarak harcamalar frenlenir ve tasarruf yapmak daha kazançlı hale gelir. Faiz indirildiğinde ise krediye erişim ucuzlar, işletmeler yeni yatırımlar yapar ve piyasadaki nakit akışı canlanır. Türkiye ekonomisinde döviz kurlarından borsa şirketlerine kadar her türlü fiyatlamayı doğrudan belirleyen en temel makroekonomik karardır.",
        realLifeExample: "Maaşınızdan artırdığınız birikiminizle yeni bir araba almak ya da paranızı mevduata yatırmak arasında kaldığınızı düşünün. Merkez Bankası politika faizini artırdığında, mahallenizdeki bankaların vadeli mevduat hesaplarına verdiği getiri anında yükselir. Aynı zamanda ihtiyaç ve taşıt kredisi faizleri de tırmanacağı için araba kredisi taksitleri bütçenizi zorlamaya başlar. Bu ortamda insanlar borçlanıp araba veya eşya almayı erteler, parasını bankada yüksek faizle değerlendirmeyi seçer. Herkes harcamasını kısıp beklemeye geçince de satıcılar etiket fiyatlarını sürekli yukarı çekemez ve enflasyonun hızı kesilir. Alınan bu tek bir karar, cebinizdeki harçlıktan ay sonundaki kredi kartı faizinize kadar evinizin tüm bütçesini doğrudan etkiler.",
        whatItMeasures: "Türkiye'de Türk Lirası'nın resmi borçlanma maliyetini ve para politikasının sıkılık derecesini ölçer.",
        whyItMatters: "Dolar/TL kuru, konut ve ihtiyaç kredisi faizleri, mevduat getirileri ve Borsa İstanbul şirketlerinin değerlemelerini doğrudan belirler.",
        howToInterpret: "Kararla birlikte PPK karar metnindeki enflasyon değerlendirmeleri ve faiz patikasına dair yönlendirmeler analiz edilmelidir.",
        impactChannels: [
            { step: "MERKEZ BANKASI", title: "Karar Açıklanır", desc: "Para Politikası Kurulu faiz kararını ve gerekçe metnini yayınlar. Piyasa açıklanan oranı daha önceki beklentilerle kıyaslar." },
            { step: "TÜRK LİRASI", title: "Kur Dalgalanması", desc: "Faiz artışı TL'yi güçlendirerek döviz kurlarını baskılar. Beklenmedik bir faiz indirimi ise yabancı para birimlerinin yükselmesine yol açabilir." },
            { step: "BANKA FAİZLERİ", title: "Kredi ve Mevduat", desc: "Bankalar kredi faiz oranlarını ve vadeli hesap getirilerini yeni karara göre revize eder. Vatandaşın borçlanma maliyeti doğrudan değişir." },
            { step: "TÜKETİM & TASARRUF", title: "Harcama Dengesi", desc: "Yüksek faiz ortamında insanlar harcamalarını kısarak paralarını bankada tutar. Düşük faiz döneminde ise alışverişler ve konut-araç talebi hızla artar." },
            { step: "BORSA İSTANBUL", title: "Hisselerin Fiyatlanması", desc: "Mevduat getirisi çok yükseldiğinde borsa üzerindeki nakit baskısı artar. Faizler gevşediğinde ise ucuzlayan borçlanmayla birlikte şirket hisseleri değer kazanır." }
        ],
        chartReadingCards: {
            direction: "Grafikteki yükseliş sıkı para politikasını, düşüş ise parasal gevşeme sürecini gösterir.",
            changeSpeed: "Toplantılardaki baz puanlık adımların büyüklüğü Merkez Bankası'nın mücadele kararlılığını yansıtır.",
            context: "Alınan kararların piyasa enflasyon beklentileriyle ne kadar uyumlu olduğu takip edilmelidir."
        },
        whatWeCannotInfer: "Politika faizinin artması enflasyonun o ay hemen düşeceği anlamına gelmez; faiz kararlarının piyasaya yansıması birkaç ay sürer.",
        financialLiteracyItems: [
            { title: "Bir Haftalık Repo Faizi Nedir?", content: "Bankaların ellerindeki tahvilleri teminat göstererek Merkez Bankası'ndan 1 haftalık vadeyle TL borçlandığı referans faiz oranıdır." }
        ],
        relatedIndicators: [
            { name: "Aylık Tüketici Fiyat Endeksi (TÜFE)", id: "tr_cpi_mom", category: "Enflasyon" },
            { name: "Yıllık Enflasyon Oranı (TÜFE)", id: "tr_cpi_yoy", category: "Enflasyon" }
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
