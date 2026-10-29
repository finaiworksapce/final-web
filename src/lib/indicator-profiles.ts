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
    howToInterpret: string; // 4. Nasıl yorumlanır?
    impactChannels: Array<{ step: string; title: string; desc: string }>; // Dinamik etki zinciri (5 Adım)
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
        "id": "tr_cpi_mom",
        "name": "Aylık Tüketici Fiyat Endeksi (TÜFE)",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Enflasyon",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "Aylık Tüketici Fiyat Endeksi (TÜFE), bir ailenin günlük yaşamında tükettiği gıda, giyim, kira ve ulaşım gibi yüzlerce temel ürünün fiyatlarının son 30 gün içinde ortalama ne kadar değiştiğini gösteren resmi ekonomik veridir. Bu veri, Türkiye İstatistik Kurumu (TÜİK) uzmanlarının her ay ülkenin dört bir yanındaki binlerce market, pazar ve mağazayı gezerek topladığı fiş ve etiket fiyatlarıyla hesaplanır. Endeksin temel görevi, halkın cebindeki paranın alım gücünün bir ay öncesine göre ne kadar eridiğini rakamlarla ortaya koymaktır. Verinin yüksek çıkması, çarşı pazardaki fiyatların hızla zamlandığını ve hayat pahalılığının bir önceki aya göre sert biçimde arttığını kanıtlar. Düşük çıkması ise aylık fiyat artışlarının yavaşladığına ve etiketlerin sakinleştiğine işaret eder. Merkez Bankası'nın faiz kararlarından şirketlerin fiyatlama politikalarına kadar tüm ekonomik adımlar öncelikle bu aylık veriye bakılarak şekillendirilir.",
        "realLifeExample": "Her ayın başında mahallenizdeki markete gidip aynı peyniri, sütü, deterjanı ve zeytinyağını sepete doldurduğunuzu düşünün. Kasiyere ödediğiniz toplam tutar bir önceki aya göre fark edilir şekilde arttıysa, cebinizden aynı sepet için daha çok para çıkmış demektir. İşte Aylık TÜFE, tek tek sizin market fişinizdeki bu fiyat farkının tüm Türkiye genelindeki ortalamasını simgeler. Açıklanan oran yüksek olduğunda, maaşınız aynı kalsa bile ay sonunu getirmekte daha çok zorlanır ve dışarıda yemek yemek gibi keyfi harcamalarınızı kısmak zorunda kalırsınız. Tersi durumda yani oran düştüğünde ise fiyatlar hemen ucuzlamaz ama en azından bir önceki ayki gibi kontrolsüzce fırlamaz. Böylece açıklanan tek bir aylık oran, o ay evinize alabileceğiniz ekmekten çocuğunuzun okul masrafına kadar mutfak bütçenizi anında belirler.",
        "whatItMeasures": "Hanehalkı harcama sepetindeki aylık fiyat artış hızını ve Türk Lirası'nın satın alma gücündeki aylık erimeyi ölçer.",
        "whyItMatters": "TCMB faiz kararlarını, mevduat getirilerini, ev kiralarını ve maaş zam oranlarını doğrudan belirleyen en kritik makro veridir.",
        "howToInterpret": "TÜFE'yi değerlendirirken yalnızca mevcut değere değil; önceki döneme, piyasa beklentisine, yıllık enflasyona ve çekirdek fiyat göstergelerine birlikte bakmak gerekir.",
        "impactChannels": [
            {
                "step": "TÜİK",
                "title": "Veri Açıklanır",
                "desc": "Aylık tüketici fiyat artış oranı her ayın başında resmi olarak ilan edilir. Piyasa analistleri veriyi beklentilerle kıyaslar."
            },
            {
                "step": "ALIM GÜCÜ",
                "title": "Cepteki Para",
                "desc": "Yüksek aylık enflasyon vatandaşın satın alma gücünü anında aşındırır. İnsanlar temel ihtiyaçlar dışındaki harcamalarını kısmaya başlar."
            },
            {
                "step": "MERKEZ BANKASI",
                "title": "Faiz Beklentisi",
                "desc": "Aylık fiyat artışları yüksek gelirse TCMB'nin faizleri artırması veya yüksek tutması beklenir. Bu beklenti borçlanma maliyetlerini yükseltir."
            },
            {
                "step": "KREDİ VE MEVDUAT",
                "title": "Bankalar",
                "desc": "Bankalar mevduat getirilerini ve kredi taksitlerini enflasyona göre ayarlar. Parası olanlar getiri arayışıyla vadeli mevduata veya altına yönelir."
            },
            {
                "step": "PİYASALAR",
                "title": "Borsa ve Kurlar",
                "desc": "Enflasyon verisi borsa şirketlerinin kar marjlarını ve döviz kurlarını yeniden fiyatlayarak piyasada denge oluşturur."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü hareket aylık fiyat artışının hızlandığına, aşağı yönlü hareket ise dezenflasyon sürecine işaret eder.",
            "changeSpeed": "Çizginin eğimindeki artış fiyat basamaklarının ne kadar sert veya kademeli tırmandığını ortaya koyar.",
            "context": "Tek bir ayın sıçraması mevsimsel olabilir; bu nedenle en az 3 ile 6 aylık hareketli ortalamayla incelenmelidir."
        },
        "whatWeCannotInfer": "Tek bir aylık TÜFE açıklamasından enflasyonun uzun vadeli trendinin kalıcı olarak kırıldığı sonucu çıkarılamaz. Sonraki aylar ve çekirdek göstergelerle birlikte değerlendirilmelidir.",
        "financialLiteracyItems": [
            {
                "title": "Aylık ve Yıllık Enflasyon Arasındaki Fark Nedir?",
                "content": "Aylık enflasyon sadece son 30 gündeki fiyat değişimini, yıllık enflasyon ise son 12 ayın birikimli toplam artışını gösterir."
            },
            {
                "title": "Çekirdek Enflasyon Nedir?",
                "content": "Gıda ve enerji gibi oynak fiyatlı kalemlerin çıkarılmasıyla hesaplanan ana enflasyon eğilimi göstergesidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Yıllık Enflasyon Oranı (TÜFE)",
                "id": "tr_cpi_yoy",
                "category": "Enflasyon"
            },
            {
                "name": "Aylık Üretici Fiyat Endeksi (ÜFE)",
                "id": "tr_ppi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "TCMB Politika Faizi Kararı",
                "id": "tr_cbrt_rate",
                "category": "Faiz & Para Politikası"
            }
        ]
    },
    "Yıllık Enflasyon Oranı (TÜFE)": {
        "id": "tr_cpi_yoy",
        "name": "Yıllık Enflasyon Oranı (TÜFE)",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Enflasyon",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "Yıllık Enflasyon Oranı (TÜFE), ülkede satılan mal ve hizmetlerin genel fiyat seviyesinin son 12 ay boyunca toplamda yüzde kaç arttığını gösteren birikimli hayat pahalılığı karnesidir. Bu oran, her ay açıklanan aylık tüketici fiyat endekslerinin geriye dönük son bir yıl boyunca birbiri ardına eklenmesiyle resmi istatistik kurumu tarafından hesaplanır. Oranın temel amacı, vatandaşın ve şirketlerin son bir yıl içerisinde ne kadar bir satın alma gücü kaybı yaşadığını bütüncül olarak ölçmektir. Yıllık enflasyonun yüksek olması, paranın değerini hızla yitirdiğini ve yaşam maliyetinin geçen yıla kıyasla katlandığını gösterir. Oranın gerilemesi ise fiyatların geriye doğru ucuzladığı anlamına gelmez, sadece son bir yıldaki fiyat artış hızının bir miktar yavaşladığını anlatır. Memur ve emekli maaş zamlarından kiralara uygulanacak yasal tavan artış oranına kadar milyonlarca insanı ilgilendiren tüm sözleşmeler bu veriye göre belirlenir.",
        "realLifeExample": "Tam bir yıl önce bugün kiraladığınız evin kira sözleşmesinin yenilenme zamanının geldiğini hayal edin. Ev sahibiniz kapınızı çaldığında veya bankadan kira artış mesajı geldiğinde, yasal olarak ödenecek yeni tutar doğrudan bu yıllık enflasyon oranına göre hesaplanır. Eğer yıllık enflasyon yüzde elli açıklandıysa, geçen yıl on bin lira ödediğiniz kiranız bir anda on beş bin liraya fırlar. Aynı şekilde geçen yıl doldurduğunuz yıllık kışlık yakıtınız, çocuklarınızın okul kaydı ve yıllık araba kaskonuz da tam bu oran kadar zamlanır. Yıllık enflasyon düşüşe geçtiğinde ise sevinirsiniz çünkü bir sonraki yıl kira ve aidatınız bir önceki yılki kadar sert artmaz. Yani bu veri, bir ayın geçici dalgalanmasını değil, evinizin ve hayatınızın bir yıllık kalıcı geçim yükünü temsil eder.",
        "whatItMeasures": "Ülkedeki genel fiyat düzeyinin 1 yıllık zaman ufku içerisindeki toplam artış hızını ölçer.",
        "whyItMatters": "Kira artış tavanları, asgari ücret güncellemeleri ve memur/emekli zam oranları resmi olarak bu veriye dayanır.",
        "howToInterpret": "Yıllık enflasyonu incelerken baz etkisinin (geçen yılın aynı ayındaki sıra dışı verilerin) oran üzerindeki yapay yükseltici veya düşürücü etkisini göz önüne almak şarttır.",
        "impactChannels": [
            {
                "step": "YILLIK VERİ",
                "title": "12 Aylık Birikim",
                "desc": "Son 12 ayın toplam enflasyon oranı kamuoyu ile paylaşılır. Ülkenin bir yıllık hayat pahalılığı tablosu netleşir."
            },
            {
                "step": "MAAŞ VE KİRALAR",
                "title": "Yasal Artışlar",
                "desc": "Asgari ücret, memur-emekli zamları ve konut-işyeri kira tavanları bu yıllık veriye göre güncellenir."
            },
            {
                "step": "REEL FAİZ",
                "title": "Paranın Koruması",
                "desc": "Yatırımcılar bankaların verdiği mevduat faizini yıllık enflasyonla karşılaştırır. Faiz enflasyonun altındaysa parayı korumak için döviz, altın veya gayrimenkule kaçış hızlanır."
            },
            {
                "step": "UZUN VADELİ BORÇLAR",
                "title": "Konut ve Taşıt",
                "desc": "Bankalar uzun vadeli konut ve taşıt kredisi faizlerini yıllık enflasyon beklentilerine göre yükseltir veya düşürür."
            },
            {
                "step": "ŞİRKET DEĞERLERİ",
                "title": "Borsa Dengesi",
                "desc": "Yıllık yüksek enflasyon şirketlerin maliyetlerini şişirirken, fiyatlarını enflasyona göre artırabilen güçlü hisseler borsada öne çıkar."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki gerileme dezenflasyon sürecini temsil eder. Değerin düşmesi fiyatların ucuzladığı anlamına değil, artış hızının yavaşladığı anlamına gelir.",
            "changeSpeed": "Yıllık eğrinin eğimindeki yumuşama enflasyon ivmesinin kırılma hızını gösterir.",
            "context": "Geçen yılın yüksek aylık verileri endeksten çıktıkça oluşan baz etkisi trend analizinde ayırt edilmelidir."
        },
        "whatWeCannotInfer": "Yıllık enflasyonun düşmesi market fiyatlarının ucuzladığı anlamına gelmez; fiyatların geçen yıla göre daha yavaş pahalandığını gösterir.",
        "financialLiteracyItems": [
            {
                "title": "Dezenflasyon ile Deflasyon Arasındaki Fark",
                "content": "Dezenflasyon fiyat artış hızının yavaşlamasıdır. Deflasyon ise fiyatların genel olarak mutlak gerilemesidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "tr_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "Aylık Üretici Fiyat Endeksi (ÜFE)",
                "id": "tr_ppi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "TCMB Politika Faizi Kararı",
                "id": "tr_cbrt_rate",
                "category": "Faiz & Para Politikası"
            }
        ]
    },
    "Aylık Üretici Fiyat Endeksi (ÜFE)": {
        "id": "tr_ppi_mom",
        "name": "Aylık Üretici Fiyat Endeksi (ÜFE)",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Enflasyon",
        "impactLevel": "high",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "Aylık Üretici Fiyat Endeksi (ÜFE), tarlada, madende ve fabrikalarda üretilen malların henüz tüketiciye ulaşmadan, fabrika çıkış kapısındaki toptan satış fiyatlarının aylık değişimini ölçen göstergedir. Bu gösterge, sanayi tesislerinden, enerji santrallerinden ve imalatçılardan toplanan hammadde, elektrik ve toptan ürün maliyetleri incelenerek her ay düzenli hesaplanır. Temel görevi, üreticilerin katlandığı maliyet baskısını ve imalat zincirindeki fiyat artışlarını tüketiciye ulaşmadan önceki ilk aşamasında tespit etmektir. ÜFE'nin sert yükselmesi, fabrikaların elektrik, yakıt ve hammaddeye daha fazla para ödediğini ve imalat maliyetlerinin fırladığını gösterir. Üreticiler bu maliyetleri kendi ceplerinden karşılayamayacağı için ÜFE artışları birkaç ay içinde kaçınılmaz olarak market raflarına ve tüketici fiyatlarına zam olarak yansır. Bu sebeple ekonomistler, gelecekte çarşı pazarda yaşanacak tüketici enflasyonunun erken uyarı sinyali olarak öncelikle ÜFE verisini dikkatle takip eder.",
        "realLifeExample": "Mahallenizdeki fırıncının her sabah taze ekmek pişirmek için un, maya, odun ve elektrik aldığını hayal edin. Fırıncının toptancıdan aldığı un çuvalının ve fırını çalıştırmak için ödediği elektrik faturasının toptan fiyatı iki katına çıktığında, fırıncı bu ek maliyeti tek başına üstlenemez. Birkaç hafta dişini sıksa bile en sonunda mecburen tezgahtaki ekmeğin etiketini artırmak ve zam yapmak zorunda kalır. İşte ÜFE tam olarak bu fırıncının, mobilyacının veya süt fabrikasının arka plandaki toptan maliyet artışını gösterir. ÜFE yüksek çıktığında, henüz markette görmediğiniz ürünlerin bile birkaç hafta sonra zamlanacağını önceden anlarsınız. Böylece bu veri, önümüzdeki aylarda mutfak masrafınızın ne kadar artacağını size fabrikaların kapısından fısıldayan bir erken haberci gibidir.",
        "whatItMeasures": "İmalat ve sanayi sektöründeki toptan üretim maliyetlerinin aylık değişim hızını ölçer.",
        "whyItMatters": "Tüketici enflasyonunun öncü göstergesidir ve sanayi şirketlerinin kar marjlarını doğrudan belirler.",
        "howToInterpret": "ÜFE ile TÜFE arasındaki makas incelenmeli; ÜFE yüksek kaldıkça tüketici fiyatları üzerindeki maliyet baskısının süreceği unutulmamalıdır.",
        "impactChannels": [
            {
                "step": "FABRİKA KAPISI",
                "title": "Toptan Maliyet",
                "desc": "Üreticilerin hammadde, enerji ve işçilik maliyetlerindeki aylık değişim ÜFE olarak açıklanır."
            },
            {
                "step": "MALİYET BASKISI",
                "title": "İmalatçı Yükü",
                "desc": "Üretim maliyeti yükselen fabrikalar ürünlerini toptancılara ve perakendecilere daha pahalıya satmaya başlar."
            },
            {
                "step": "MARKET RAFLARI",
                "title": "TÜFE'ye Geçiş",
                "desc": "Toptan fiyattaki artış birkaç hafta içinde çarşıdaki, pazardaki ve marketteki etiketlere zam olarak yansır."
            },
            {
                "step": "ŞİRKET KARLARI",
                "title": "Marjların Daralması",
                "desc": "Maliyetlerini tüketiciye anında yansıtamayan şirketlerin kar marjları erir ve yatırımları yavaşlar."
            },
            {
                "step": "MERKEZ BANKASI",
                "title": "Enflasyon Baskısı",
                "desc": "ÜFE'den gelen baskı tüketici enflasyonunu tetiklediğinde, Merkez Bankası para politikasını sıkı tutmaya devam eder."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü ivme fabrikaların üretim maliyetlerinin arttığını, aşağı yönlü ivme ise rahatlamayı gösterir.",
            "changeSpeed": "ÜFE eğrisindeki ani kırılmalar döviz kuru ve küresel emtia fiyatlarının üretime yansımasını simgeler.",
            "context": "Üretici fiyatlarının tüketici fiyatlarına geçişkenlik süresi genellikle 1 ile 3 ay arasında seyreder."
        },
        "whatWeCannotInfer": "ÜFE'nin aylık düşmesi mevcut çarşı pazar fiyatlarının ucuzlayacağını garanti etmez; sadece üreticinin maliyet artışının durulduğunu gösterir.",
        "financialLiteracyItems": [
            {
                "title": "Maliyet Enflasyonu Nedir?",
                "content": "Hammadde, enerji veya işçilik giderlerinin artması sonucu ürünlerin üretim maliyetinin yükselmesiyle oluşan enflasyon türüdür."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "tr_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "Yıllık Enflasyon Oranı (TÜFE)",
                "id": "tr_cpi_yoy",
                "category": "Enflasyon"
            }
        ]
    },
    "İngiltere Merkez Bankası (BoE) Faiz Kararı": {
        "id": "uk_boe_rate",
        "name": "İngiltere Merkez Bankası (BoE) Faiz Kararı",
        "country": "UK",
        "flag": "🇬🇧",
        "category": "Faiz & Para Politikası",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "İngiltere Merkez Bankası (BoE) Faiz Kararı, ülkedeki bankaların birbirine borç verirken uygulayacağı temel borçlanma maliyetinin resmi olarak belirlenmesidir. Bu kritik karar, Para Politikası Kurulu bünyesindeki 9 bağımsız uzmanın toplanıp oy kullanmasıyla iki ayda bir alınır. Kararın temel amacı, çarşı ve pazardaki fiyat artışlarını kontrol altında tutarak İngiliz Sterlini'nin alım gücünü korumaktır. Faiz yükseltildiğinde para harcamak yerine bankada biriktirmek daha cazip hale gelir ve genel tüketim yavaşlar. Faiz indirildiğinde ise kredi çekmek kolaylaşır, piyasaya sıcak para girer ve ekonomik çarklar hızlanır. Küresel finans dünyasının en köklü merkezlerinden biri olduğu için alınan bu faiz kararı hem Sterlin'in değerini hem de dünya piyasalarını doğrudan sarsar.",
        "realLifeExample": "Yeni bir ev almak ya da arabanızı yenilemek için bankadan kredi çekmeyi düşündüğünüzü hayal edin. İngiltere Merkez Bankası faiz artırdığında, bankaların size sunduğu kredi faizleri de anında yükselir. Bu durum, her ay ödeyeceğiniz kredi taksitinin artması ve borçlanmanın çok daha masraflı hale gelmesi anlamına gelir. Taksitler yükselince insanlar büyük harcamalarını erteler, parasını harcamak yerine bankada biriktirmeyi seçer. Alışverişler azalıp dükkanlar müşteri çekmekte zorlanınca da çarşı pazardaki hızlı fiyat artışları yavaşlamaya başlar. Böylece bankanın aldığı tek bir karar, cebinizdeki harçlıktan ay sonundaki kredi kartı ekstrenize kadar tüm bütçenize doğrudan dokunur.",
        "whatItMeasures": "İngiltere ekonomisindeki resmi borçlanma faizini ve para politikasının sıkılık düzeyini ölçer.",
        "whyItMatters": "Küresel finansın merkezi Londra'daki sermaye akışlarını, Sterlin kurunu ve dünya borsalarını doğrudan belirler.",
        "howToInterpret": "Kararla birlikte Para Politikası Kurulu üyelerinin oy dağılımı ve geleceğe dair enflasyon projeksiyonları incelenmelidir.",
        "impactChannels": [
            {
                "step": "MERKEZ BANKASI",
                "title": "Faiz Oranı Açıklanır",
                "desc": "İngiltere Merkez Bankası yeni faiz oranını kamuoyuyla paylaşır. Piyasa bu kararı önceki beklentilerle kıyaslayarak ilk tepkisini verir."
            },
            {
                "step": "STERLİN",
                "title": "Para Birimi Dalgalanır",
                "desc": "Faiz artarsa İngiliz Sterlini yabancı yatırımcı için cazip hale gelip güçlenir. Faiz inerse Sterlin diğer para birimleri karşısında değer kaybeder."
            },
            {
                "step": "BANKA KREDİLERİ",
                "title": "Borçlanma Şartları Değişir",
                "desc": "Ticari bankalar kredi faizlerini ve mevduat getirilerini yeni karara göre ayarlar. Vatandaşın ve şirketlerin borçlanma maliyeti doğrudan değişir."
            },
            {
                "step": "TÜKETİM & TASARRUF",
                "title": "Harcamalar Yön Değiştirir",
                "desc": "Faizler yüksekken insanlar tasarrufa yönelip harcamaları kısar. Faizler düşükken ise tüketim artar ve şirketler yeni yatırımlara girişir."
            },
            {
                "step": "BORSA & PİYASA",
                "title": "Şirket Değerleri Dengelenir",
                "desc": "Yüksek faiz şirket karlarını baskılayıp hisse piyasalarını sakinleştirir. Düşük faiz ise borsalara canlılık ve hareketlilik getirir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü basamaklar parasal sıkılaşmayı, aşağı yönlü basamaklar ise faiz indirimi döngüsünü simgeler.",
            "changeSpeed": "Toplantılardaki faiz artış veya indirim sıklığı ekonomideki aciliyet derecesini gösterir.",
            "context": "Kararın yanı sıra Kurul tutanakları ve toplantı sonrası basın açıklaması dikkatle izlenmelidir."
        },
        "whatWeCannotInfer": "Faiz kararından tek başına Sterlin'in aylarca hangi yöne gideceği kesin olarak çıkarılamaz; küresel jeopolitik ve büyüme verileri de etkilidir.",
        "financialLiteracyItems": [
            {
                "title": "BoE Para Politikası Kurulu (MPC) Kimlerden Oluşur?",
                "content": "9 üyeden oluşur: Başkan, 3 Başkan Yardımcısı, Baş Ekonomist ve Hazine Bakanı tarafından atanan 4 bağımsız harici uzman."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Fed Politika Faizi Kararı",
                "id": "us_fed_rate",
                "category": "Faiz & Para Politikası"
            },
            {
                "name": "S&P Global İmalat PMI (Nihai)",
                "id": "uk_pmi_final",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "TCMB Politika Faizi Kararı": {
        "id": "tr_cbrt_rate",
        "name": "TCMB Politika Faizi Kararı",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Faiz & Para Politikası",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Türkiye Cumhuriyet Merkez Bankası (TCMB) Politika Faizi Kararı, bankaların Merkez Bankası'ndan Türk Lirası borçlanırken veya fazla paralarını yatırırken esas alacakları bir haftalık repo faiz oranının belirlenmesidir. Bu hayati karar, Para Politikası Kurulu üyelerinin her ay düzenli olarak toplanıp oy kullanması neticesinde resmi olarak duyurulur. Kararın ana amacı, piyasadaki para bolluğunu veya kıtlığını ayarlayarak çarşıdaki fiyat artışlarını dizginlemek ve Türk Lirası'nın değerini korumaktır. Faiz artırıldığında borçlanma pahalılaşarak harcamalar frenlenir ve tasarruf yapmak daha kazançlı hale gelir. Faiz indirildiğinde ise krediye erişim ucuzlar, işletmeler yeni yatırımlar yapar ve piyasadaki nakit akışı canlanır. Türkiye ekonomisinde döviz kurlarından borsa şirketlerine kadar her türlü fiyatlamayı doğrudan belirleyen en temel makroekonomik karardır.",
        "realLifeExample": "Maaşınızdan artırdığınız birikiminizle yeni bir araba almak ya da paranızı mevduata yatırmak arasında kaldığınızı düşünün. Merkez Bankası politika faizini artırdığında, mahallenizdeki bankaların vadeli mevduat hesaplarına verdiği getiri anında yükselir. Aynı zamanda ihtiyaç ve taşıt kredisi faizleri de tırmanacağı için araba kredisi taksitleri bütçenizi zorlamaya başlar. Bu ortamda insanlar borçlanıp araba veya eşya almayı erteler, parasını bankada yüksek faizle değerlendirmeyi seçer. Herkes harcamasını kısıp beklemeye geçince de satıcılar etiket fiyatlarını sürekli yukarı çekemez ve enflasyonun hızı kesilir. Alınan bu tek bir karar, cebinizdeki harçlıktan ay sonundaki kredi kartı faizinize kadar evinizin tüm bütçesini doğrudan etkiler.",
        "whatItMeasures": "Türkiye'de Türk Lirası'nın resmi borçlanma maliyetini ve para politikasının sıkılık derecesini ölçer.",
        "whyItMatters": "Dolar/TL kuru, konut ve ihtiyaç kredisi faizleri, mevduat getirileri ve Borsa İstanbul şirketlerinin değerlemelerini doğrudan belirler.",
        "howToInterpret": "Kararla birlikte PPK karar metnindeki enflasyon değerlendirmeleri ve faiz patikasına dair yönlendirmeler analiz edilmelidir.",
        "impactChannels": [
            {
                "step": "MERKEZ BANKASI",
                "title": "Karar Açıklanır",
                "desc": "Para Politikası Kurulu faiz kararını ve gerekçe metnini yayınlar. Piyasa açıklanan oranı daha önceki beklentilerle kıyaslar."
            },
            {
                "step": "TÜRK LİRASI",
                "title": "Kur Dalgalanması",
                "desc": "Faiz artışı TL'yi güçlendirerek döviz kurlarını baskılar. Beklenmedik bir faiz indirimi ise yabancı para birimlerinin yükselmesine yol açabilir."
            },
            {
                "step": "BANKA FAİZLERİ",
                "title": "Kredi ve Mevduat",
                "desc": "Bankalar kredi faiz oranlarını ve vadeli hesap getirilerini yeni karara göre revize eder. Vatandaşın borçlanma maliyeti doğrudan değişir."
            },
            {
                "step": "TÜKETİM & TASARRUF",
                "title": "Harcama Dengesi",
                "desc": "Yüksek faiz ortamında insanlar harcamalarını kısarak paralarını bankada tutar. Düşük faiz döneminde ise alışverişler ve konut-araç talebi hızla artar."
            },
            {
                "step": "BORSA İSTANBUL",
                "title": "Hisselerin Fiyatlanması",
                "desc": "Mevduat getirisi çok yükseldiğinde borsa üzerindeki nakit baskısı artar. Faizler gevşediğinde ise ucuzlayan borçlanmayla birlikte şirket hisseleri değer kazanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yükseliş sıkı para politikasını, düşüş ise parasal gevşeme sürecini gösterir.",
            "changeSpeed": "Toplantılardaki baz puanlık adımların büyüklüğü Merkez Bankası'nın mücadele kararlılığını yansıtır.",
            "context": "Alınan kararların piyasa enflasyon beklentileriyle ne kadar uyumlu olduğu takip edilmelidir."
        },
        "whatWeCannotInfer": "Politika faizinin artması enflasyonun o ay hemen düşeceği anlamına gelmez; faiz kararlarının piyasaya yansıması birkaç ay sürer.",
        "financialLiteracyItems": [
            {
                "title": "Bir Haftalık Repo Faizi Nedir?",
                "content": "Bankaların ellerindeki tahvilleri teminat göstererek Merkez Bankası'ndan 1 haftalık vadeyle TL borçlandığı referans faiz oranıdır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "tr_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "Yıllık Enflasyon Oranı (TÜFE)",
                "id": "tr_cpi_yoy",
                "category": "Enflasyon"
            }
        ]
    },
    "Fed Politika Faizi Kararı": {
        "id": "us_fed_rate",
        "name": "Fed Politika Faizi Kararı",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Faiz & Para Politikası",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Fed Politika Faizi Kararı, ABD Merkez Bankası Federal Açık Piyasa Komitesi (FOMC) tarafından belirlenen ve küresel piyasalarda Dolar borçlanmanın taban maliyetini oluşturan faiz kararıdır. Bu stratejik oran, yılda sekiz defa toplanan komite üyelerinin ekonomik verileri masaya yatırıp oy birliği veya oy çokluğuyla karar almasıyla şekillenir. Kararın asli görevi, Amerika'da hem fiyat istikrarını sağlamak hem de istihdam piyasasının sağlıklı büyümesini temin etmektir. Fed faiz artırdığında dünyadaki Dolar likiditesi daralır, borçlanmak küresel çapta zorlaşır ve enflasyon baskılanmaya çalışılır. Faiz indirildiğinde ise küresel finansal sisteme ucuz likidite akar ve dünya çapında yatırım iştahı tetiklenir. ABD Doları dünya ticaretinin ana para birimi olduğu için bu karar Türkiye dahil tüm dünya ekonomilerini derinden sarsar.",
        "realLifeExample": "Yurt dışından ithal edilen cep telefonlarının, bilgisayarların veya benzin fiyatlarının neden aniden pahalandığını merak ettiğinizi varsayın. Amerika Merkez Bankası faiz artırdığında, dünyadaki tüm yatırımcılar paralarını Dolar'a çevirip güvenli Amerikan tahvillerine yatırmaya başlar. Bu durum Dolar'ın küresel çapta güçlenmesine ve diğer ülkelerin para birimleri karşısında tırmanmasına neden olur. Dolar yükselince Türkiye'ye ithal edilen her teknolojik ürünün ve ham petrolün raf fiyatı doğrudan artar. Fiyatlar artınca da ay sonu kredi kartı ekstreleriniz ve market alışverişi sepetiniz daha hızlı dolup taşar. Böylece okyanusun ötesinde alınan bir faiz kararı, Türkiye'deki bir vatandaşın günlük çarşı pazar masrafına kadar yansır.",
        "whatItMeasures": "Küresel Dolar likiditesinin fiyatını ve borçlanma maliyetini ölçer.",
        "whyItMatters": "Dünya borsaları, Ons Altın, gelişmekte olan ülke para birimleri ve küresel kredi mekanizması üzerinde birinci derecede etkilidir.",
        "howToInterpret": "Fed kararını değerlendirirken yalnızca alınan faiz adımına değil; karar metnindeki şahin/güvercin ifadelere ve Fed Başkanı'nın yönlendirmelerine bakılmalıdır.",
        "impactChannels": [
            {
                "step": "FED KOMİTESİ",
                "title": "Faiz Kararı",
                "desc": "Fed politika faiz oranını ve ekonomik tahmin özetini (Dot Plot) duyurur. Küresel piyasalar açıklanan karara göre anlık pozisyon alır."
            },
            {
                "step": "DOLAR ENDEKSİ",
                "title": "DXY ve Kurlar",
                "desc": "Faiz artışı küresel Dolar endeksini (DXY) yukarı taşırken gelişen ülke para birimlerini baskılar. Faiz indirimi ise Dolar'ı zayıflatır."
            },
            {
                "step": "ONS ALTIN & EMTİALAR",
                "title": "Emtia Fiyatlaması",
                "desc": "Dolar'ın faizi yükselince faiz getirisi olmayan Ons Altın baskılanır. Faiz düştüğünde ise altın ve gümüşe küresel talep artar."
            },
            {
                "step": "KÜRESEL SERMAYE",
                "title": "Fon Akışları",
                "desc": "Yüksek ABD faizleri sermayeyi Amerika'ya geri çeker. Düşük faiz döneminde ise Türkiye gibi gelişmekte olan ülkelere yabancı sıcak para akar."
            },
            {
                "step": "DÜNYA VE TÜRKİYE BORSALARI",
                "title": "Hisse Eğilimi",
                "desc": "Küresel faiz artışı Wall Street'ten Borsa İstanbul'a kadar risk iştahını frenler. Faiz gevşemesi ise dünya borsalarında ralliye zemin hazırlar."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki merdiven basamakları para politikası döngülerini (sıkılaşma veya gevşeme patikalarını) temsil eder.",
            "changeSpeed": "Pasif geçilen toplantılar ile 25/50 baz puanlık adımların sıklığı sıkılaşmanın dozunu gösterir.",
            "context": "Faiz oranı kararıyla birlikte piyasa faiz patikası tahminlerini (Dot Plot) de incelemek şarttır."
        },
        "whatWeCannotInfer": "Fed faiz indirdiği an tüm borsaların kesin yükseleceği çıkarılamaz; resesyon endişeleri varsa hisse piyasaları baskılanabilir.",
        "financialLiteracyItems": [
            {
                "title": "Fed Notları ve Dot Plot Nedir?",
                "content": "Fed üyelerinin geleceğe dair faiz tahminlerini gösteren nokta grafiktir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            },
            {
                "name": "ISM İmalat PMI Endeksi",
                "id": "us_ism_pmi",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Tarım Dışı İstihdam Değişimi (NFP)": {
        "id": "us_nfp",
        "name": "Tarım Dışı İstihdam Değişimi (NFP)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "İstihdam",
        "impactLevel": "critical",
        "unit": "K",
        "higherIsPositive": true,
        "definition": "Tarım Dışı İstihdam (NFP), tarım sektörü ve kamu personeli haricinde Amerika genelindeki şirketlerde son bir ayda kaç yeni kişinin işe alındığını veya işten çıkarıldığını gösteren en kritik istihdam verisidir. Bu dev veri, ABD Çalışma Bakanlığı tarafından her ayın ilk Cuma günü yüz binlerce işletme ve işyeri taranarak hesaplanır ve resmi olarak yayınlanır. Göstergenin temel amacı, dünyanın en büyük ekonomisi olan Amerika'da çarkların ne kadar hızlı döndüğünü ve şirketlerin eleman arayışının süratini ölçmektir. Verinin beklenenden çok yüksek gelmesi, şirketlerin işleri büyütüp bolca yeni personel istihdam ettiğini ve ekonominin aşırı canlı olduğunu gösterir. Verinin düşük veya eksi gelmesi ise şirketlerin küçülmeye gittiğini, işe alımları dondurduğunu ve ekonomik yavaşlama riskini işaret eder. Küresel piyasalarda Dolar'ın değerinden Ons Altın ve kripto paralara kadar tüm dünya fiyatlamalarını saniyeler içinde altüst eden en sert veridir.",
        "realLifeExample": "Çevrenizdeki fabrikaların, restoranların ve teknoloji firmalarının camlarına boy boy iş ilanı astığını hayal edin. Herkesin kolayca iş bulduğu ve maaşların arttığı bir dönemde insanların cebinde harcayacak bol parası olur ve hafta sonu alışveriş merkezleri tıklım tıklım dolar. İşte Tarım Dışı İstihdam verisi, Amerika'daki bu iş bulma kolaylığının ve cepteki nakit bolluğunun aylık resmi karnesidir. Eğer bu veri çok güçlü gelirse, Amerikan Merkez Bankası insanların aşırı para harcayıp fiyatları yükseltmesini engellemek için faizleri artırma kararı alabilir. Faizler artınca da tüm dünyada Dolar güçlenir ve Türkiye'deki döviz kurundan altın fiyatına kadar her şey anında dalgalanır. Yani Amerika'da yeni bir garsonun veya fabrika işçisinin işe girmesi, dakikalar sonra Türkiye'deki altın yatırımcısının cebine doğrudan etki eder.",
        "whatItMeasures": "Amerika'da tarım dışındaki sektörlerde net yeni istihdam edilen kişi sayısını ölçer.",
        "whyItMatters": "Küresel finans piyasalarının en çok oynaklık yaratan ve Fed'in kararlarını doğrudan etkileyen bir numaralı verisidir.",
        "howToInterpret": "Açıklanan verinin piyasa beklentisiyle farkına ve geçmiş aylara yapılan revizyonlara birlikte bakılmalıdır.",
        "impactChannels": [
            {
                "step": "İSTİHDAM RAPORU",
                "title": "Veri Açıklanır",
                "desc": "ABD Çalışma Bakanlığı her ayın ilk Cuma günü yeni istihdam edilen kişi sayısını duyurur. Piyasalar açıklanan rakamla beklentiyi saniyesinde kıyaslar."
            },
            {
                "step": "KÜRESEL DOLAR",
                "title": "DXY Tepkisi",
                "desc": "Güçlü istihdam Amerikan ekonomisinin kuvvetli olduğunu gösterir ve küresel Dolar endeksini (DXY) anında yukarı zıplatır."
            },
            {
                "step": "ONS ALTIN VE EMTİA",
                "title": "Dalgalanma",
                "desc": "Dolar güçlenip ABD faiz beklentileri yükselince, faiz getirisi olmayan Ons Altın sert bir geri çekilme yaşar."
            },
            {
                "step": "FED FAİZ POLİTİKASI",
                "title": "Faiz Patikası",
                "desc": "İstihdamın çok güçlü olması Fed'in faiz indirimlerini ertelemesine, zayıf gelmesi ise hızlı faiz indirimlerine kapı aralar."
            },
            {
                "step": "DÜNYA VE BİST BORSALARI",
                "title": "Risk İştahı",
                "desc": "İstihdam verisi küresel fonların riskli varlıklara mı yoksa nakit Dolar'a mı geçeceğini belirleyerek hisse piyasalarını yeniden fiyatlar."
            }
        ],
        "chartReadingCards": {
            "direction": "Sütunlardaki yüksek pozitif barlar güçlü istihdam artışını, sıfıra yakın veya eksi barlar ise istihdam kaybını gösterir.",
            "changeSpeed": "Aylar arasındaki sert zikzaklar mevsimsel etkilerden arındırılarak üç aylık ortalamalarla değerlendirilmelidir.",
            "context": "Tarım dışı istihdam verisi işsizlik oranı ve saatlik kazançlar verisiyle bir bütün olarak okunmalıdır."
        },
        "whatWeCannotInfer": "Tek başına NFP yüksek geldi diye faizin o ay kesin artacağı söylenemez; enflasyon verilerinin durumu da belirleyicidir.",
        "financialLiteracyItems": [
            {
                "title": "Neden Tarım Sektörü Hariç Tutulur?",
                "content": "Tarım sektöründeki mevsimlik dalgalanmalar geçici olduğu için ekonominin ana istihdam trendini bozmaması amacıyla hesaplamaya dahil edilmez."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD İşsizlik Oranı",
                "id": "us_unemp",
                "category": "İstihdam"
            },
            {
                "name": "Aylık Ortalama Saatlik Kazançlar",
                "id": "us_hourly_earnings",
                "category": "İstihdam"
            }
        ]
    },
    "ABD İşsizlik Oranı": {
        "id": "us_unemp",
        "name": "ABD İşsizlik Oranı",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "İstihdam",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "ABD İşsizlik Oranı, Amerika'da çalışma çağında olup aktif olarak iş aradığı halde iş bulamayan kişilerin toplam işgücüne olan yüzdelik oranını gösteren temel sosyal refah göstergesidir. Bu oran, her ay on binlerce farklı hanehalkıyla birebir yapılan anketler ve resmi kayıtlar analiz edilerek Çalışma İstatistikleri Bürosu tarafından belirlenir. Göstergenin en temel işlevi, ekonomik büyümenin tabana ve vatandaşa ne derece yansıdığını ve halkın ne kadarının düzenli bir gelire sahip olduğunu ölçmektir. İşsizlik oranının gerilemesi, toplumda daha fazla insanın maaş almaya başladığını ve ailelerin alım gücünün güçlendiğini ortaya koyar. Oranın yükselmesi ise şirketlerin çalışanları işten çıkardığını, ailelerin geçim sıkıntısının derinleştiğini ve genel tüketimin zayıflayacağını gösterir. Amerikan Merkez Bankası (Fed), faiz artırıp indirirken fiyat istikrarı kadar işsizlik oranının makul seviyelerde kalmasını da yasal bir zorunluluk olarak gözetir.",
        "realLifeExample": "Yaşadığınız mahallede veya akrabalarınız arasında her yüz kişiden kaçının düzenli bir işi olduğunu gözünüzün önüne getirin. İşsizliğin azaldığı bir dönemde komşunuz yeni bir işe girer, evinize her ay düzenli maaş girer ve güvenle evinizi taksitle yenileyebilirsiniz. Fakat işsizlik oranı tırmanışa geçtiğinde, insanlar yarın işten çıkarılma korkusuyla en ufak bir harcama yapmaktan bile çekinir ve parasını yastık altında saklamaya başlar. İşte ABD İşsizlik Oranı, dünyanın bir numaralı tüketici toplumunun ne kadar güvende olduğunu gösteren bir termometredir. Amerikalı işsiz kalırsa yurt dışından gelen telefonları, arabaları ve tatilleri satın alamaz; bu da tüm dünyadaki ihracatçı şirketlerin işlerinin durulmasına yol açar. Dolayısıyla açıklanan bu basit oran, dünyanın en büyük pazarının alışveriş yapacak parasının olup olmadığını tüm dünyaya söyler.",
        "whatItMeasures": "Amerika'da aktif iş arayan işsiz nüfusun toplam sivil işgücüne olan oranını ölçer.",
        "whyItMatters": "Fed'in maksimum istihdam hedefine ulaşılıp ulaşılmadığını kanıtlayan temel referans veridir.",
        "howToInterpret": "İşsizlik oranındaki düşüşün işgücüne katılım oranının artmasıyla mı yoksa iş aramaktan vazgeçenler sebebiyle mi yaşandığına bakılmalıdır.",
        "impactChannels": [
            {
                "step": "İŞSİZLİK ORANI",
                "title": "Resmi Duyuru",
                "desc": "Aktif iş arayan nüfusun yüzdesi tarım dışı istihdam verisiyle eşzamanlı olarak duyurulur."
            },
            {
                "step": "FED DENGESİ",
                "title": "İkili Görev",
                "desc": "İşsizlik yükselirse Fed ekonomiyi canlandırmak için faiz indirmeye zorlanır; işsizlik çok düşerse faizleri yüksek tutma gücü bulur."
            },
            {
                "step": "KÜRESEL TAHVİLLER",
                "title": "Getiri Eğrisi",
                "desc": "İşsizliğin artması resesyon endişelerini tetikler ve ABD tahvil faizlerinde sert düşüşlere sebep olur."
            },
            {
                "step": "DOLAR VE ALTIN",
                "title": "Ters Korelasyon",
                "desc": "İşsizliğin tırmandığı dönemlerde faiz indirimi beklentisiyle Dolar zayıflar, Ons Altın ve gümüş ise yükselişe geçer."
            },
            {
                "step": "KÜRESEL ŞİRKETLER",
                "title": "Borsa Gelirleri",
                "desc": "Tüketici güveni ve harcama gücü zayıflayan Amerikan piyasası, küresel dev şirketlerin hisse senetlerinde satış dalgası yaratabilir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü tırmanış işsizliğin yayıldığını, aşağı iniş ise işgücü piyasasının sıkılaştığını simgeler.",
            "changeSpeed": "Oranın yüzde 4 üzerine çıkış hızı resesyon uyarı kuralı olan Sahm Kuralı açısından kritik kabul edilir.",
            "context": "Doğal işsizlik oranı kabul edilen yüzde 4 ile 4.5 bandı ile karşılaştırılarak okunmalıdır."
        },
        "whatWeCannotInfer": "İşsizlik oranının düşük kalması ücretlerin de aynı hızla artacağını tek başına kanıtlamaz.",
        "financialLiteracyItems": [
            {
                "title": "U-3 ve U-6 İşsizlik Nedir?",
                "content": "U-3 resmi işsizlik oranıdır; U-6 ise iş bulmaktan umudunu kesenleri ve yarı zamanlı çalışanları da içeren geniş tanımlı işsizliktir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            },
            {
                "name": "Aylık Ortalama Saatlik Kazançlar",
                "id": "us_hourly_earnings",
                "category": "İstihdam"
            }
        ]
    },
    "Aylık Ortalama Saatlik Kazançlar": {
        "id": "us_hourly_earnings",
        "name": "Aylık Ortalama Saatlik Kazançlar",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "İstihdam",
        "impactLevel": "high",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "ABD Aylık Ortalama Saatlik Kazançlar, Amerika'daki özel sektör çalışanlarının saat başına kazandığı brüt ücretlerin bir önceki aya göre ortalama ne kadar arttığını ölçen ücret enflasyonu göstergesidir. Bu gösterge, milyonlarca bordrolu çalışanın maaş bordroları ve mesai ücretleri üzerinden her ay düzenli olarak istatistik kurumunca hesaplanır. Verinin temel misyonu, çalışanların gelirlerindeki artışın mal ve hizmet fiyatlarından daha hızlı mı yoksa daha yavaş mı yükseldiğini ortaya koymaktır. Saatlik kazançların beklentileri aşarak artması, şirketlerin çalışanlarına daha fazla maaş ödediğini ve insanların ellerine daha yüksek harcama gücü geçtiğini belgeler. Ancak ücretlerin hızla artması, şirketlerin bu maliyetleri telafi etmek için ürettikleri mallara zam yapmasına ve fiyatların tırmanmasına neden olur. Bu yüzden merkez bankaları, gelecekteki kalıcı hayat pahalılığı baskısını önceden sezinlemek için saatlik kazançlar verisini kritik bir pusula olarak izler.",
        "realLifeExample": "İş yerinizde patronunuzun size ve tüm çalışma arkadaşlarınıza güzel bir maaş zammı yaptığını ve saatlik çalışma ücretinizi artırdığını hayal edin. Cüzdanınıza giren para artınca sevinir, akşam ailenizi dışarıda yemeğe götürür ve uzun zamandır ertelediğiniz alışveriş planlarını yaparsınız. Fakat aynı zammı ülkedeki tüm işyerleri yaptığında, lokanta sahibi garsonun zamlı maaşını ödeyebilmek için menüdeki yemeklerin fiyatına anında zam koyar. Yani cebinize giren ek gelir, birkaç hafta sonra çarşı pazarda daha pahalı etiketler olarak karşınıza çıkar. İşte Saatlik Kazançlar verisi, maaşlara gelen zamların yeni bir hayat pahalılığı dalgası yaratıp yaratmayacağını ölçer. Eğer saatlik ücretler çok hızlı artarsa, Merkez Bankası enflasyon hortlamasın diye kredileri kısar ve bu durum sizin kredi kartı faizlerinize kadar yansır.",
        "whatItMeasures": "Özel sektör çalışanlarının saat başına düşen ortalama gelir artış hızını ölçer.",
        "whyItMatters": "Hizmet sektörü enflasyonunun ve ücret-fiyat sarmalının en erken ve en net öncü göstergesidir.",
        "howToInterpret": "Yıllık enflasyon oranıyla kıyaslanarak çalışanların reel olarak zenginleşip zenginleşmediği takip edilmelidir.",
        "impactChannels": [
            {
                "step": "ÜCRET VERİSİ",
                "title": "Açıklama",
                "desc": "Çalışanların saat başına elde ettiği brüt kazancın aylık ve yıllık artış oranı kamuoyuyla paylaşılır."
            },
            {
                "step": "MALİYET ARTIŞI",
                "title": "Ücret Baskısı",
                "desc": "Maaş giderleri artan şirketler ürün ve hizmetlerine zam yaparak fiyatları yukarı iter."
            },
            {
                "step": "FED POLİTİKASI",
                "title": "Şahin Duruş",
                "desc": "Saatlik ücretlerdeki kontrolsüz artış, Fed'in enflasyonu düşürmek için faizleri daha uzun süre yüksek tutmasına neden olur."
            },
            {
                "step": "DOLAR VE TAHVİL",
                "title": "Yukarı İvme",
                "desc": "Maaş enflasyonu sürpriz şekilde yükseldiğinde ABD tahvil faizleri tırmanır ve küresel Dolar değer kazanır."
            },
            {
                "step": "BORSA ŞİRKETLERİ",
                "title": "Kar Marjı Baskısı",
                "desc": "İşçilik maliyetleri artan ve yüksek faiz ortamıyla karşılaşan borsa şirketlerinin kar marjları daralır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı hareket maaş artış hızının ivmelendiğini, aşağı hareket ise ücret baskısının soğuduğunu gösterir.",
            "changeSpeed": "Aylık yüzde 0.3 ve üzeri artışlar enflasyon hedefi için sıcak kabul edilir.",
            "context": "Üretkenlik artışıyla desteklenmeyen ücret artışlarının kalıcı enflasyon yarattığı unutulmamalıdır."
        },
        "whatWeCannotInfer": "Saatlik kazançların yükselmesi her çalışanın aynı oranda zam aldığı anlamına gelmez; sektörler arası farklılıklar olabilir.",
        "financialLiteracyItems": [
            {
                "title": "Ücret-Enflasyon Sarmalı Nedir?",
                "content": "Maaş artışlarının şirket maliyetlerini yükseltmesi, yükselen maliyetlerin fiyatlara zam olarak yansıması ve bunun sonucunda yeniden maaş artışı talep edilmesiyle oluşan kısır döngüdür."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            },
            {
                "name": "ABD İşsizlik Oranı",
                "id": "us_unemp",
                "category": "İstihdam"
            }
        ]
    },
    "İşsizlik Haklarından Yararlanma Başvuruları": {
        "id": "us_jobless_claims",
        "name": "İşsizlik Haklarından Yararlanma Başvuruları",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "İstihdam",
        "impactLevel": "high",
        "unit": "K",
        "higherIsPositive": false,
        "definition": "İşsizlik Haklarından Yararlanma Başvuruları, Amerika'da son bir hafta içinde işini kaybedip devletten ilk kez işsizlik maaşı talep eden vatandaşların toplam sayısını gösteren haftalık öncü göstergedir. Bu veri, eyaletlerin çalışma bürolarından gelen resmi başvuru formları toplanarak ABD Çalışma Bakanlığı tarafından her Perşembe günü aksatılmadan açıklanır. Göstergenin en büyük ayrıcalığı, aylık verileri beklemeden işgücü piyasasında yaşanan anlık çatlakları ve işten çıkarmaları haftalık olarak yakalayabilmesidir. Başvuru sayısının beklenenden düşük çıkması, şirketlerin çalışanlarını ellerinde tuttuğunu ve işten çıkarmaların çok az olduğunu ispatlar. Başvuruların tırmanışa geçmesi ise şirketlerin maliyet kısmak amacıyla toplu işten çıkarmalara başladığını ve işlerin ters gittiğini haber verir. Finansal piyasalar, ekonomideki ani bir yavaşlamanın veya krizin ilk ayak seslerini bu haftalık başvuru rakamından anında okur.",
        "realLifeExample": "Çalıştığınız şirkette işlerin aniden durgunlaştığını ve patronun departmandan bazı arkadaşlarınızı mecburen işten çıkarmak zorunda kaldığını düşünün. İşsiz kalan bu arkadaşlarınız hayatlarını idame ettirebilmek için hemen ertesi gün İŞKUR benzeri devlet kurumuna gidip işsizlik ödeneğine başvurur. İşte Amerika'da her hafta açıklanan bu veri, tam olarak kaç kişinin aynı kaderi paylaşıp devletin kapısını çaldığını sayar. Eğer devletten işsizlik maaşı isteyenlerin sayısı haftadan haftaya fırlıyorsa, piyasada işlerin sarpa sardığını ve genel bir kriz dalgasının yaklaştığını anlarsınız. İnsanlar işini kaybedince araba alamaz, ev kiralamaz ve tasarruflarını tüketmemek için markette bile en ucuz ürünlere yönelir. Bu yüzden açıklanan haftalık başvuru rakamı, ekonominin ne kadar tıkırında gittiğini veya sendelediğini gösteren en taze uyarı ışığıdır.",
        "whatItMeasures": "Amerika'da bir hafta içerisinde işsizlik sigortasına ilk kez başvuran kişi sayısını ölçer.",
        "whyItMatters": "İşten çıkarmaların seyrini haftalık olarak en erken gösteren yüksek frekanslı makro veridir.",
        "howToInterpret": "Haftalık dalgalanmaları elemek için 4 haftalık hareketli ortalamaya odaklanılmalıdır.",
        "impactChannels": [
            {
                "step": "HAFTALIK BİLDİRİM",
                "title": "Başvurular Açıklanır",
                "desc": "Her Perşembe günü son bir haftanın resmi işsizlik başvurusu sayısı açıklanır."
            },
            {
                "step": "İŞTEN ÇIKARMA EĞİLİMİ",
                "title": "Şirketler Cephesi",
                "desc": "Başvuruların artması şirketlerin tasarruf için personel çıkardığını ortaya koyar."
            },
            {
                "step": "FED BEKLENTİLERİ",
                "title": "Faiz İndirimi İhtimali",
                "desc": "Başvurular sert artarsa Fed istihdamı korumak için faiz indirimlerini hızlandırabilir."
            },
            {
                "step": "DOLAR VE TAHVİL",
                "title": "Piyasa Tepkisi",
                "desc": "Yüksek gelen başvurular Dolar'ı zayıflatırken ABD tahvil faizlerini aşağı çeker."
            },
            {
                "step": "HİSSE SENETLERİ",
                "title": "Resesyon Kaygısı",
                "desc": "İşsizlik başvurularının tarihi yüksek seviyelere tırmanması borsa şirketlerinde kar kaygısı yaratır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü tırmanış işten çıkarmaların hızlandığını, aşağı seyir ise iş piyasasının sağlamlığını gösterir.",
            "changeSpeed": "Haftalık bazda 250 bin sınırının aşılması piyasalarda soğuma sinyali olarak kabul edilir.",
            "context": "Tatil dönemleri ve grevlerin yarattığı geçici haftalık sıçramalar göz önüne alınmalıdır."
        },
        "whatWeCannotInfer": "Tek bir haftanın yüksek çıkmasından ekonominin çöktüğü sonucu çıkarılamaz; devamlılık aranmalıdır.",
        "financialLiteracyItems": [
            {
                "title": "İlk Başvuru ile Süregelen Başvuru Farkı",
                "content": "İlk başvuru o hafta işini yeni kaybedenleri, süregelen başvuru ise hala iş bulamayıp maaş almaya devam edenlerin toplamını gösterir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            },
            {
                "name": "ABD İşsizlik Oranı",
                "id": "us_unemp",
                "category": "İstihdam"
            }
        ]
    },
    "Türkiye İşsizlik Oranı": {
        "id": "tr_unemp",
        "name": "Türkiye İşsizlik Oranı",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "İstihdam",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "Türkiye İşsizlik Oranı, Türkiye'de çalışma çağındaki nüfus içinde işi olmayan, son dört haftada aktif olarak iş arayan ve kısa sürede işbaşı yapabilecek durumdaki kişilerin toplam işgücüne oranını gösteren resmi makro veridir. Bu oran, Türkiye İstatistik Kurumu (TÜİK) tarafından hanehalkı işgücü araştırmaları ve saha anketleri yapılarak her ay düzenli duyurulur. Göstergenin temel amacı, ülkedeki fabrikaların, atölyelerin ve hizmet sektörünün ne ölçüde istihdam yaratabildiğini ve genç nüfusun üretime ne kadar katıldığını ölçmektir. İşsizliğin düşmesi, daha fazla haneye düzenli gelir girmesi, iç tüketimin canlanması ve sosyal refahın yükselmesi anlamına gelir. İşsizliğin artması ise gençlerin ve yetişkinlerin iş bulmakta zorlandığını, şirketlerin yeni yatırımları ertelediğini ve ekonomik durgunluğun derinleştiğini kanıtlar. Ekonomi yönetiminin asgari ücret tespitinden teşvik paketlerine kadar aldığı tüm sosyal ve ekonomik kararlar bu oranın seviyesine göre planlanır.",
        "realLifeExample": "Üniversiteden yeni mezun olan bir yakınınızın veya kardeşinizin aylardır onlarca yere özgeçmiş gönderip iş aradığını hayal edin. Eğer mahallenizde açılan yeni dükkanlar, fabrikalar eleman arıyor ve başvuranlar birkaç hafta içinde işe giriyorsa o ülkede işsizlik geriliyor demektir. Fakat tam tersine yeni mezunlar aylarca evde oturuyor ve tanıdıklarınız iş bulamadığından yakınıyorsa toplumda genel bir geçim kaygısı baş gösterir. İşte Türkiye İşsizlik Oranı, tek tek o evlerde yaşanan iş bulma telaşının tüm ülke çapındaki resmi sonucudur. İşi olan insanın cebinde düzenli maaşı vardır; bu da bakkaldan alışveriş yapabilmesi, evine eşya alabilmesi ve çarşı esnafının yüzünün gülmesi demektir. Bu nedenle açıklanan oran düştüğünde sadece rakamlar güzelleşmez, sokaktaki esnaftan aile sofralarına kadar herkesin yarınlara olan güveni artar.",
        "whatItMeasures": "Türkiye'de çalışma çağında olup iş arayan kişilerin işgücüne oranını ölçer.",
        "whyItMatters": "Sosyal refahın, iç talep gücünün ve hanehalkı gelir güvenliğinin temel aynasıdır.",
        "howToInterpret": "Manşet işsizliğin yanında genç nüfustaki işsizlik oranına ve geniş tanımlı atıl işgücü oranına bakılmalıdır.",
        "impactChannels": [
            {
                "step": "TÜİK",
                "title": "İşgücü Raporu",
                "desc": "Aylık hanehalkı işgücü istatistikleri ve resmi işsizlik oranı duyurulur."
            },
            {
                "step": "GELİR DÜZEYİ",
                "title": "Hane Gelirleri",
                "desc": "İşsizliğin gerilemesi maaşlı çalışan sayısını ve ailelerin satın alma gücünü artırır."
            },
            {
                "step": "İÇ TÜKETİM",
                "title": "Perakende Canlılığı",
                "desc": "Düzenli gelire sahip hanehalkları dayanıklı tüketim malları ve gıda harcamalarını artırır."
            },
            {
                "step": "EKONOMİ POLİTİKASI",
                "title": "Teşvikler ve İstihdam",
                "desc": "Hükümet ve ekonomi yönetimi istihdamı artırıcı teşvik paketleri ve faiz politikalarını şekillendirir."
            },
            {
                "step": "BORSA İSTANBUL",
                "title": "İç Piyasa Hisseleri",
                "desc": "İç tüketimin güçlenmesi perakende, gıda ve beyaz eşya şirketlerinin hisselerine olumlu yansır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki gerileme istihdamın güçlendiğini, yükseliş ise iş arayanların iş bulmakta zorlandığını simgeler.",
            "changeSpeed": "Mevsim etkisinden arındırılmış verilerdeki aylık yön değişimi trendin gücünü ortaya koyar.",
            "context": "Yaz aylarındaki tarım ve turizm istihdamı kaynaklı mevsimsel düşüşler hesaba katılmalıdır."
        },
        "whatWeCannotInfer": "İşsizlik oranının gerilemesi her çalışanın yüksek maaşla çalıştığı anlamına gelmez; kayıt dışılık da incelenmelidir.",
        "financialLiteracyItems": [
            {
                "title": "Geniş Tanımlı İşsizlik (Atıl İşgücü) Nedir?",
                "content": "İş aramaktan umudunu kesmiş ancak çalışmaya hazır olanları ve eksik istihdam edilenleri de kapsayan genişletilmiş işsizlik oranıdır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Sanayi Üretim Endeksi",
                "id": "tr_ind_prod",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Yıllık Enflasyon Oranı (TÜFE)",
                "id": "tr_cpi_yoy",
                "category": "Enflasyon"
            }
        ]
    },
    "Türkiye Konut Satış İstatistikleri": {
        "id": "tr_house_sales",
        "name": "Türkiye Konut Satış İstatistikleri",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "Adet",
        "higherIsPositive": true,
        "definition": "Türkiye Konut Satış İstatistikleri, yurt genelinde bir ay içerisinde tapu dairelerinde el değiştiren sıfır ve ikinci el konutların toplam adetini ve kredili satış payını gösteren gayrimenkul sektörü verisidir. Bu veri, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı Tapu ve Kadastro Genel Müdürlüğü'nün resmi tapu tescil kayıtları derlenerek her ay TÜİK tarafından açıklanır. Göstergenin temel amacı, halkın ve yatırımcıların gayrimenkul alma iştahını, konut kredisi kullanım oranlarını ve inşaat sektörünün canlılığını ölçmektir. Satış adetlerinin yüksek olması, vatandaşın birikimlerini gayrimenkule yönlendirdiğini, konuta talebin güçlü kaldığını ve inşaat çarklarının döndüğünü gösterir. Satışların sert düşmesi ise yükselen konut kredisi faizleri veya fahiş fiyatlar sebebiyle vatandaşın ev almaktan vazgeçtiğini ve piyasanın tıkandığını belgeler. İnşaat sektörü demirden çimentoya, boyadan mobilyaya kadar yüzlerce alt sektörü beslediği için bu veri tüm sanayinin nabzını tutar.",
        "realLifeExample": "Yıllardır biriktirdiğiniz birikiminizin üzerine bankadan konut kredisi çekip kendi evinize taşınma hayali kurduğunuzu düşünün. Eğer bankaların sunduğu konut kredisi faizleri aşırı yüksekse, aylık taksitleri ödeyemeyeceğinizi görüp ev alma hayalinizi mecburen birkaç yıl sonraya ertelersiniz. Sizin gibi milyonlarca insan aynı kararı verdiğinde, satılık ev ilanları aylarca panolarda asılı kalır ve müteahhitler yeni inşaat başlatamaz. Müteahhit iş yapamayınca mahallenizdeki boyacı, elektrikçi, fayansçı ve mobilyacı da işsiz kalır. İşte Konut Satış İstatistikleri tam olarak bu döngünün kaç ailenin hayatına dokunduğunu sayılarla belgeler. Açıklanan satışlar patlama yaptığında, tapu harçlarından mahalledeki mobilyacıya kadar tüm ekonomiye muazzam bir sıcak para dalgası yayılır.",
        "whatItMeasures": "Türkiye genelinde bir ayda el değiştiren toplam konut sayısını ve ipotekli satış oranını ölçer.",
        "whyItMatters": "İnşaat ve ona bağlı yüzlerce yan sektörün canlılığını ve bankacılık kredi hacmini doğrudan yansıtır.",
        "howToInterpret": "Toplam satışların yanı sıra ilk el (sıfır) konut satışları ve yabancılara yapılan satış adetleri incelenmelidir.",
        "impactChannels": [
            {
                "step": "TAPU VERİSİ",
                "title": "Satışlar Duyurulur",
                "desc": "TÜİK aylık satılan konut adedini ve ipotekli satış payını kamuoyuyla paylaşır."
            },
            {
                "step": "KREDİ FAİZLERİ",
                "title": "Finansman Maliyeti",
                "desc": "Bankaların konut kredisi faizlerindeki değişim ipotekli satışları doğrudan etkiler."
            },
            {
                "step": "İNŞAAT ZİNCİRİ",
                "title": "Yan Sektörler",
                "desc": "Konut satışları arttıkça çimento, demir, seramik, mobilya ve beyaz eşya talebi canlanır."
            },
            {
                "step": "FİYAT BEKLENTİSİ",
                "title": "Konut Fiyat Endeksi",
                "desc": "Talep canlı kaldığı sürece konut fiyatlarındaki artış trendi devam eder."
            },
            {
                "step": "BORSA İSTANBUL",
                "title": "GYO ve Çimento Hisseleri",
                "desc": "Güçlü konut satışları gayrimenkul yatırım ortaklıkları ve çimento-demir şirketlerinin hisselerine prim yaptırır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı hareket gayrimenkul talebinin canlandığını, aşağı hareket ise alım gücünün baskılandığını gösterir.",
            "changeSpeed": "İpotekli (kredili) satış payındaki değişim hızı bankacılık faizlerinin sektöre etkisini belgeler.",
            "context": "Yıl sonlarında tapu harcı avantajları ve kampanyalar sebebiyle oluşan dönemsel sıçramalar dikkate alınmalıdır."
        },
        "whatWeCannotInfer": "Konut satış sayısının artması konut fiyatlarının ucuzladığı anlamına gelmez; yüksek fiyata rağmen talep sürebilir.",
        "financialLiteracyItems": [
            {
                "title": "İpotekli Satış Nedir?",
                "content": "Konutun banka kredisi kullanılarak ve üzerine banka ipoteği konularak satın alınması işlemidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "TCMB Politika Faizi Kararı",
                "id": "tr_cbrt_rate",
                "category": "Faiz & Para Politikası"
            },
            {
                "name": "Yıllık Enflasyon Oranı (TÜFE)",
                "id": "tr_cpi_yoy",
                "category": "Enflasyon"
            }
        ]
    },
    "Aylık Sanayi Üretim Endeksi": {
        "id": "tr_ind_prod",
        "name": "Aylık Sanayi Üretim Endeksi",
        "country": "TR",
        "flag": "🇹🇷",
        "category": "Büyüme & İmalat",
        "impactLevel": "high",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Aylık Sanayi Üretim Endeksi, Türkiye'deki imalat sanayi, madencilik, elektrik ve gaz sektörlerinde faaliyet gösteren fabrikaların bir ayda fiziksel olarak ne kadar mal ürettiğini ölçen büyüme barometresidir. Bu veri, organize sanayi bölgelerindeki binlerce tesisten toplanan üretim miktarları ve faturalandırılmış çıktılar incelenerek TÜİK tarafından her ay hesaplanır. Endeksin en büyük gücü, Türkiye'nin çeyreklik resmi büyüme (GSYH) rakamı açıklanmadan aylar önce ekonominin büyüdüğünü mü yoksa küçüldüğünü mü net biçimde göstermesidir. Endeksin artması, fabrikaların daha fazla hammadde işlediğini, vardiyaların arttığını ve sanayi çarklarının tam kapasiteye yakın döndüğünü gösterir. Endeksin gerilemesi ise fabrikalarda üretimin yavaşladığını, siparişlerin kesildiğini ve genel bir ekonomik durgunluğun başladığını kanıtlar. Borsa İstanbul'daki yüzlerce dev sanayi şirketinin gelecekteki karlılıkları ve hisse performansları doğrudan bu üretim endeksine bağlıdır.",
        "realLifeExample": "Şehrinizin kenarındaki organize sanayi bölgesinin önünden geçerken fabrikaların bacalarının aralıksız tüttüğünü ve gece vardiyalarında ışıkların yandığını hayal edin. Fabrikalar tam gaz çalıştığında yeni işçiler alınır, kamyonlar yurt içine ve limanlara durmaksızın mal taşır ve sanayi kenti canlanır. Fakat kriz dönemlerinde veya siparişler kesildiğinde fabrikalar bantları durdurur, fazla mesaileri iptal eder ve makineler sessizliğe gömülür. İşte Sanayi Üretim Endeksi, ülkedeki tüm fabrikaların toplamda ne kadar mal çıkardığını ölçen resmi üretim karnesidir. Üretim arttığında şirketler para kazanır, çalışanlarına prim dağıtır ve ülkenin toplam zenginliği çoğalır. Böylece açıklanan tek bir endeks verisi, bindiğiniz otomobilden marketteki bisküviye kadar üretilen her şeyin hacmini doğrudan gözler önüne serer.",
        "whatItMeasures": "Sanayi ve imalat sektörünün reel üretim miktarındaki aylık ve yıllık değişim oranını ölçer.",
        "whyItMatters": "Çeyreklik milli gelir (GSYH) büyümesinin en güvenilir ve en güçlü öncü göstergesidir.",
        "howToInterpret": "Takvim etkisinden ve mevsimsellikten arındırılmış serilerin yönü incelenmelidir.",
        "impactChannels": [
            {
                "step": "TÜİK RAPORU",
                "title": "Üretim Açıklanır",
                "desc": "Aylık sanayi üretim endeksi ve alt sektörlerin büyüme oranları duyurulur."
            },
            {
                "step": "KAPASİTE KULLANIMI",
                "title": "Fabrika Çarkları",
                "desc": "Üretimdeki artış fabrikaların kapasite kullanım oranlarını ve elektrik tüketimini yukarı çeker."
            },
            {
                "step": "İHRACAT VE CİRO",
                "title": "Satış Gelirleri",
                "desc": "Üretilen mallar ihraç edilerek ve iç piyasaya satılarak şirket bilançolarını büyütür."
            },
            {
                "step": "GSYH BÜYÜMESİ",
                "title": "Ekonomik Büyüme",
                "desc": "Sanayideki canlılık çeyreklik milli gelir büyümesini yukarı yönlü destekler."
            },
            {
                "step": "BORSA İSTANBUL",
                "title": "Sanayi Endeksi (XUSIN)",
                "desc": "Üretimi artan sanayi devlerinin hisseleri borsada güçlü alımlarla değer kazanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü tırmanış sanayi çıktısının arttığını, aşağı yönlü eğim ise fabrikaların yavaşladığını simgeler.",
            "changeSpeed": "Aylık bazda artıdan eksiye geçişler ekonomik büyümede soğuma sinyali kabul edilir.",
            "context": "Bayram tatilleri ve çalışma günü farkları sebebiyle takvim etkisinden arındırılmış veriye odaklanılmalıdır."
        },
        "whatWeCannotInfer": "Sanayi üretiminin artması her sektörün para kazandığı anlamına gelmez; yüksek enerji maliyeti kar marjını baskılayabilir.",
        "financialLiteracyItems": [
            {
                "title": "Arındırılmış Veri Ne Demektir?",
                "content": "Ramazan ve Kurban bayramı gibi hareketli tatillerin ve ay içerisindeki işgünü sayısı farklarının yarattığı yapay dalgalanmaların temizlenmesidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "S&P Global İmalat PMI (Nihai)",
                "id": "tr_pmi_final",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Türkiye İşsizlik Oranı",
                "id": "tr_unemp",
                "category": "İstihdam"
            }
        ]
    },
    "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)": {
        "id": "us_cpi_mom",
        "name": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Enflasyon",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE), Amerika'daki hanehalklarının tükettiği mal ve hizmetlerin fiyatlarının son bir ay içinde ortalama ne kadar değiştiğini ölçen aylık tüketici enflasyon verisidir. Bu veri, ABD Çalışma İstatistikleri Bürosu (BLS) tarafından ülke genelindeki binlerce mağaza, benzinlik ve kira sözleşmesi taranarak her ay hesaplanır. Göstergenin en temel işlevi, Amerikan Doları'nın satın alma gücünün son 30 gün içinde ne kadar zayıfladığını veya korunduğunu saptamaktır. Verinin beklentileri aşarak yüksek çıkması, hayat pahalılığının hızlandığını ve fiyat artışlarının kontrolden çıktığını gösterir. Beklentilerin altında kalması ise enflasyonun soğuduğuna ve market etiketlerinin durulduğuna işaret eder. Amerikan Merkez Bankası'nın (Fed) faiz artırma veya indirme kararlarını doğrudan belirleyen dünyanın en kritik aylık fiyat göstergesidir.",
        "realLifeExample": "Amerika'daki bir süpermarkette kahve, süt, yumurta ve benzin alırken kasanın her ay ne kadar yazdığını düşünün. Amerikan halkının market fişi kabardığında, Amerikan Merkez Bankası faizleri yükselterek harcamaları kısmaya çalışır. Fed faiz artırınca dünyadaki Dolar değer kazanır ve Türkiye'deki Dolar/TL kuru anında yukarı fırlar. Kur fırlayınca Türkiye'deki ithal telefonların ve benzin istasyonundaki fiyatların etiketi zamlanır. Yani Amerika'daki bir market sepetinin aylık enflasyonu, dönüp dolaşıp Türkiye'deki vatandaşın kendi market arabasına yansır. Açıklanan bu tek bir oran, küresel çapta milyarlarca insanın günlük yaşam maliyetini ve döviz kurlarını anında etkiler.",
        "whatItMeasures": "Amerika'daki kentsel tüketicilerin harcama sepetindeki aylık fiyat artış hızını ölçer.",
        "whyItMatters": "Fed'in faiz patikasını ve küresel Dolar likiditesinin yönünü belirleyen en sıcak veridir.",
        "howToInterpret": "Gıda ve enerji fiyatlarını dışarıda bırakan Çekirdek TÜFE ile birlikte incelenmelidir.",
        "impactChannels": [
            {
                "step": "BLS RAPORU",
                "title": "Aylık TÜFE Açıklanır",
                "desc": "Amerika'da bir önceki ayın tüketici fiyat artış oranı tüm dünyaya duyurulur."
            },
            {
                "step": "FED FAİZ BEKLENTİSİ",
                "title": "Sıkılaşma Algısı",
                "desc": "Yüksek gelen aylık enflasyon Fed'in faizleri yüksek tutacağı beklentisini güçlendirir."
            },
            {
                "step": "DOLAR VE TAHVİL",
                "title": "Küresel Güç",
                "desc": "Dolar endeksi (DXY) ve ABD tahvil getirileri tırmanışa geçerken diğer paralar baskılanır."
            },
            {
                "step": "ONS ALTIN",
                "title": "Fiyat Baskısı",
                "desc": "Faiz getirisi olmayan Ons Altın, güçlenen Dolar karşısında satış baskısıyla karşılaşır."
            },
            {
                "step": "DÜNYA BORSALARI",
                "title": "Hisse Değerlemeleri",
                "desc": "Yüksek enflasyon ve faiz ortamı teknoloji şirketleri başta olmak üzere küresel hisseleri baskılar."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü sıçrama aylık fiyat baskısının hızlandığını, aşağı seyir ise fiyatların yatıştığını gösterir.",
            "changeSpeed": "Aylık yüzde 0.3 ve üzeri rakamlar enflasyonun inatçı kaldığına işaret eder.",
            "context": "Petrol fiyatlarındaki geçici aylık dalgalanmaların manşet veriyi saptırabileceği unutulmamalıdır."
        },
        "whatWeCannotInfer": "Tek bir ayın düşük gelmesi enflasyon sorununun tamamen çözüldüğünü kanıtlamaz; birkaç aylık eğilim aranmalıdır.",
        "financialLiteracyItems": [
            {
                "title": "Çekirdek TÜFE Neden Önemlidir?",
                "content": "Hava şartlarına ve jeopolitiğe bağlı oynak benzin ve gıda fiyatlarını hariç tutarak enflasyonun gerçek ana eğilimini ölçtüğü için Fed tarafından daha çok önemsenir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Yıllık Enflasyon Oranı (TÜFE)",
                "id": "us_cpi_yoy",
                "category": "Enflasyon"
            },
            {
                "name": "Fed Politika Faizi Kararı",
                "id": "us_fed_rate",
                "category": "Faiz & Para Politikası"
            }
        ]
    },
    "ABD Yıllık Enflasyon Oranı (TÜFE)": {
        "id": "us_cpi_yoy",
        "name": "ABD Yıllık Enflasyon Oranı (TÜFE)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Enflasyon",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "ABD Yıllık Enflasyon Oranı (TÜFE), Amerika'daki genel tüketici fiyat seviyesinin son 12 ay boyunca toplamda yüzde kaç arttığını gösteren birikimli hayat pahalılığı karnesidir. Bu oran, her ay açıklanan aylık endekslerin geriye dönük bir yıllık toplam değişimi hesaplanarak Çalışma İstatistikleri Bürosu tarafından duyurulur. Göstergenin en temel görevi, Amerikan Doları'nın son bir yılda ne kadar satın alma gücü kaybı yaşadığını bütüncül olarak ölçmektir. Yıllık enflasyonun yüksek seyretmesi, Amerikan halkının geçim maliyetinin katlandığını ve tasarrufların reel olarak eridiğini ortaya koyar. Oranın gerilemesi ise fiyatların geriye doğru ucuzladığını değil, sadece son bir yıldaki zamlanma hızının bir miktar yavaşladığını anlatır. Amerikan Merkez Bankası'nın resmi yüzde iki enflasyon hedefine olan mesafesini ölçen dünyanın en temel ekonomik göstergesidir.",
        "realLifeExample": "Amerika'da yaşayan bir ailenin geçen yıl ödediği ev kirasını, çocuklarının yıllık okul masrafını ve kasko primlerini bir yıl sonra yeniden hesapladığını hayal edin. Yıllık enflasyon yüksek olduğunda, bu ailenin tüm yıllık bütçesi altüst olur ve birikim yapma kabiliyeti tamamen yok olur. İnsanlar geçim sıkıntısı çekmeye başladığında ise Amerikan hükümeti ve Fed hemen alarma geçerek piyasadaki para musluklarını kısar. Para muslukları kısılınca küresel piyasalarda altın, borsa ve kripto paralardan kaçış başlar. Yani Amerika'daki bir ailenin bir yıllık kira artışı, küresel çapta milyarlarca dolarlık yatırımın yer değiştirmesine yol açar. Sonuç olarak bu oran, tüm dünyada paranın maliyetini ve yatırımcıların risk iştahını belirler.",
        "whatItMeasures": "Amerika'da son bir yılda tüketici fiyatlarının kümülatif artış oranını ölçer.",
        "whyItMatters": "Fed'in resmi yüzde 2 hedefiyle kıyaslanan ve küresel piyasaların ana yönünü çizen temel göstergedir.",
        "howToInterpret": "Geçmiş yılın aynı ayındaki sıra dışı verilerden kaynaklanan baz etkisi mutlaka hesaba katılmalıdır.",
        "impactChannels": [
            {
                "step": "YILLIK TÜFE",
                "title": "Oran Açıklanır",
                "desc": "Amerika'nın son 12 aylık birikimli resmi enflasyon rakamı kamuoyuna duyurulur."
            },
            {
                "step": "FED HEDEFİ",
                "title": "%2 Patikası",
                "desc": "Oranın Fed'in yüzde 2 hedefinden ne kadar uzakta kaldığı değerlendirilir."
            },
            {
                "step": "REEL GETİRİ",
                "title": "Tahvil Faizi Farkı",
                "desc": "Yatırımcılar ABD tahvil faizlerini yıllık enflasyonla kıyaslayarak reel getiri hesaplar."
            },
            {
                "step": "EMTİA VE ALTIN",
                "title": "Korunma Güdüsü",
                "desc": "Enflasyon kalıcı olursa paranın değerini korumak için altına hücum edilir; faiz yükselirse altın baskılanır."
            },
            {
                "step": "KÜRESEL VARLIKLAR",
                "title": "Yeniden Denge",
                "desc": "Küresel portföy yöneticileri Dolar cinsi varlıklar ile gelişen ülke piyasaları arasındaki dağılımı günceller."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki aşağı yönlü eğri dezenflasyon sürecini, yukarı yönlü eğri ise enflasyon dalgasını simgeler.",
            "changeSpeed": "Yıllık oranın yüzde 2 hedefine doğru iniş sürati Fed'in faiz indirim takvimini belirler.",
            "context": "Baz etkisinin aylık bazda yarattığı optik yükseliş ve düşüşler ayırt edilmelidir."
        },
        "whatWeCannotInfer": "Yıllık oranın düşmesi market fiyatlarının ucuzladığı anlamına gelmez; fiyatların geçen yıla göre daha yavaş arttığını gösterir.",
        "financialLiteracyItems": [
            {
                "title": "Baz Etkisi Nedir?",
                "content": "Geçen yılın aynı ayında yaşanan olağanüstü fiyat artışlarının endeksten çıkmasıyla yıllık oranda görülen matematiksel düşüş veya yükseliştir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "us_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "Fed Politika Faizi Kararı",
                "id": "us_fed_rate",
                "category": "Faiz & Para Politikası"
            }
        ]
    },
    "ABD Aylık Üretici Fiyat Endeksi (ÜFE)": {
        "id": "us_ppi_mom",
        "name": "ABD Aylık Üretici Fiyat Endeksi (ÜFE)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Enflasyon",
        "impactLevel": "high",
        "unit": "%",
        "higherIsPositive": false,
        "definition": "ABD Aylık Üretici Fiyat Endeksi (ÜFE), Amerika'daki imalatçıların, fabrikaların ve enerji üreticilerinin ürettikleri malları toptan satarken uyguladıkları fabrika çıkış fiyatlarının aylık değişimini ölçer. BLS tarafından toptan ticaret kanalları ve sanayi tesisleri incelenerek her ay hesaplanır. Göstergenin amacı üreticilerin maruz kaldığı hammadde ve enerji maliyet baskısını ilk elden saptamaktır. ÜFE'nin hızlı artması, fabrikaların üretim yaparken çok daha fazla masrafla karşılaştığını belgeler. Fabrikalar bu toptan maliyet artışını kendi ceplerinden ödeyemeyeceği için tüketiciye satılan ürünlere mecburen zam yaparlar. Bu yüzden küresel piyasalar, tüketici enflasyonunun birkaç ay sonra nereye gideceğini önceden tahmin etmek için ABD ÜFE verisini dikkatle izler.",
        "realLifeExample": "Amerika'da dev bir otomobil fabrikasının araba üretmek için çelik, boya, çip ve kauçuk satın aldığını düşünün. Toptan çelik ve enerji fiyatları aniden fırladığında, araba üreticisi her bir otomobili üretmek için fabrikadan çıkarken binlerce dolar daha fazla harcamak zorunda kalır. Üretici bu farkı kurtarabilmek için bayilere gönderdiği arabaların satış fiyatını hemen artırır. Bayilerdeki bu artış da tüketiciye zam olarak yansır ve araba almak isteyen sıradan vatandaşın kredi taksitleri kabarır. İşte ABD ÜFE, üreticilerin fabrikada karşılaştığı bu ilk maliyet şokunu ölçerek tüm dünyaya yaklaşan zam dalgasını haber verir. Böylece bu veri, birkaç ay sonra vitrinde göreceğiniz etiketlerin öncü habercisidir.",
        "whatItMeasures": "Amerika'da üreticilerin ürettikleri mallar için aldıkları toptan satış fiyatlarının aylık değişimini ölçer.",
        "whyItMatters": "Tüketici enflasyonunun (TÜFE) en güçlü öncü göstergesidir ve şirket kar marjlarını doğrudan etkiler.",
        "howToInterpret": "ÜFE ile TÜFE arasındaki makas takip edilerek şirketlerin maliyetleri fiyatlara ne hızla yansıtabildiği anlaşılır.",
        "impactChannels": [
            {
                "step": "ÜRETİCİ MALİYETİ",
                "title": "ÜFE Açıklanır",
                "desc": "Amerika'daki fabrikaların toptan satış fiyatlarındaki aylık değişim kamuoyuna duyurulur."
            },
            {
                "step": "TÜFE'YE GEÇİŞ",
                "title": "Raf Fiyatları",
                "desc": "Fabrikalardaki maliyet artışı birkaç ay içinde market raflarına ve tüketici etiketlerine zam olarak yansır."
            },
            {
                "step": "ŞİRKET KARLARI",
                "title": "Marj Daralması",
                "desc": "Maliyet artışını müşteriye yansıtamayan sanayi şirketlerinin kar marjları baskı altına girer."
            },
            {
                "step": "FED ENFLASYON BEKLENTİSİ",
                "title": "Politika Duruşu",
                "desc": "Üretici fiyatları yüksek seyrederse Fed enflasyonun düşmeyeceğini görerek sıkı duruşunu korur."
            },
            {
                "step": "KÜRESEL EMTİA",
                "title": "Fiyatlama",
                "desc": "Üretici maliyetlerindeki gevşeme küresel emtia ve hammadde fiyatlarında sakinleşme sağlar."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü ivme üretim hattındaki maliyet tırmanışını, aşağı ivme ise rahatlamayı gösterir.",
            "changeSpeed": "Aylık bazdaki sert sıçramalar emtia ve enerji fiyatlarındaki şoklardan kaynaklanabilir.",
            "context": "Üretici fiyatlarının tüketici fiyatlarına yansıma gecikmesi 1 ile 3 ay arasında değişir."
        },
        "whatWeCannotInfer": "ÜFE'nin aylık bazda düşmesi nihai tüketici ürünlerinin o ay hemen ucuzlayacağı anlamına gelmez.",
        "financialLiteracyItems": [
            {
                "title": "Nihai Talep ÜFE Nedir?",
                "content": "Kişisel tüketime, sermaye yatırımına ve ihracata giden nihai ürünlerin toptan fiyat değişimini ölçen ana ÜFE göstergesidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "us_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "ISM İmalat Fiyat Endeksi",
                "id": "us_ism_prices",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "ABD Aylık Perakende Satışlar": {
        "id": "us_retail_sales",
        "name": "ABD Aylık Perakende Satışlar",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "high",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "ABD Aylık Perakende Satışlar, Amerika genelindeki mağazalarda, marketlerde, restoranlarda ve internet sitelerinde tüketicilerin bir ayda yaptığı toplam perakende harcamaların değişimini ölçen canlı tüketim verisidir. ABD Nüfus Sayım Bürosu tarafından her ay on binlerce perakende işletmesinden toplanan ciro verileriyle hesaplanır. Göstergenin temel amacı, Amerikan ekonomisinin yaklaşık yüzde yetmişini oluşturan bireysel tüketim harcamalarının ne kadar iştahlı olduğunu ortaya koymaktır. Perakende satışların güçlü artması, vatandaşın cebinde para olduğunu, güvenle harcadığını ve ekonomik büyümenin çok kuvvetli ilerlediğini gösterir. Satışların eksiye düşmesi ise tüketicilerin harcamayı kestiğini, mağazaların boş kaldığını ve durgunluk başladığını kanıtlar. Dünyanın en büyük tüketim pazarının nabzını tuttuğu için küresel şirket hisseleri üzerinde doğrudan yönlendirici etkiye sahiptir.",
        "realLifeExample": "Maaşınızı aldığınız gün ailenizle birlikte AVM'ye gidip kıyafet aldığınızı, teknoloji mağazasını gezdiğinizi ve restoranda yemek yediğinizi düşünün. Sizin gibi milyonlarca insan aynı hafta cüzdanını açıp harcama yaptığında esnafın kasası dolar, mağazalar yeni siparişler verir ve ekonomide muazzam bir canlılık oluşur. Fakat gelecekten endişe duyduğunuzda alışverişi tamamen kesip sadece en ucuz ekmeği ve suyu alırsanız dükkanlar sinek avlamaya başlar. İşte ABD Perakende Satışlar verisi, dünyanın en büyük alışveriş çılgınlığının devam edip etmediğini ölçen devasa bir kasa fişidir. Amerikalılar mağazalardan bolca harcama yaptıkça dünyanın geri kalanından mal sipariş eder ve Türkiye'deki tekstilciden Çin'deki elektronikçiye kadar herkesin işi açılır. Bu nedenle bu veri, dünya ticaretinin can damarıdır.",
        "whatItMeasures": "Amerika'da tüketicilerin perakende mal ve yeme-içme hizmetlerine yaptığı harcamaların aylık değişimini ölçer.",
        "whyItMatters": "Amerikan ekonomisinin yüzde 70'ini sırtlayan tüketici talebinin gücünü doğrudan kanıtlar.",
        "howToInterpret": "Oynak otomobil ve benzin satışlarını dışarıda bırakan Çekirdek Perakende Satışlar ile birlikte değerlendirilmelidir.",
        "impactChannels": [
            {
                "step": "SATIŞ RAPORU",
                "title": "Ciro Açıklanır",
                "desc": "Amerika genelindeki perakende mağazalarının aylık toplam satış performansı duyurulur."
            },
            {
                "step": "TÜKETİCİ TALEBİ",
                "title": "Harcama İştahı",
                "desc": "Satışların artması tüketicilerin harcamaya istekli olduğunu ve nakit durumlarının iyi olduğunu gösterir."
            },
            {
                "step": "BÜYÜME TAHMİNLERİ",
                "title": "GSYH Katkısı",
                "desc": "Güçlü perakende satışlar çeyreklik ekonomik büyüme beklentilerini yukarı taşır."
            },
            {
                "step": "FED FAİZ ALGISI",
                "title": "Ekonomik Sıcaklık",
                "desc": "Tüketim çok canlı kalırsa Fed enflasyonu dizginlemek için faizleri indirmekte acele etmez."
            },
            {
                "step": "KÜRESEL BORSALAR",
                "title": "Perakende Hisseleri",
                "desc": "Tüketici harcamalarındaki kuvvet Amazon, Walmart gibi dev şirketlerin hisselerini yukarı taşır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü hareket tüketim iştahının kabardığını, aşağı yönlü hareket ise harcamaların kısıldığını gösterir.",
            "changeSpeed": "Enflasyondan arındırılmamış nominal bir veri olduğu için fiyat artışlarının yarattığı yapay ciro büyümesi gözetilmelidir.",
            "context": "Kara Cuma (Black Friday) ve Noel alışveriş sezonu gibi dönemlerin mevsimsel etkisi dikkate alınmalıdır."
        },
        "whatWeCannotInfer": "Perakende satışların artması vatandaşın reel olarak daha fazla adet mal aldığı anlamına gelmeyebilir; ürünler zamlandığı için de ciro artmış olabilir.",
        "financialLiteracyItems": [
            {
                "title": "Çekirdek Perakende Satışlar Nedir?",
                "content": "Aylık bazda aşırı dalgalanan otomobil, inşaat malzemeleri ve akaryakıt satışlarının hariç tutulduğu ve temel tüketim eğilimini gösteren veridir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Michigan Tüketici Duyarlılık Endeksi (Öncü)",
                "id": "us_michigan_sentiment",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "us_cpi_mom",
                "category": "Enflasyon"
            }
        ]
    },
    "S&P Global İmalat PMI (Nihai)": {
        "id": "sp_pmi_final",
        "name": "S&P Global İmalat PMI (Nihai)",
        "country": "EU",
        "flag": "🇪🇺",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "S&P Global İmalat PMI (Nihai), ülkedeki yüzlerce büyük imalat fabrikasının satın alma yöneticileriyle yapılan anketlere dayanan, sanayide büyüme mi yoksa daralma mı olduğunu gösteren öncü endekstir. S&P Global tarafından her ay fabrika müdürlerine yeni siparişler, istihdam ve hammadde stokları sorularak hesaplanır. Endekste 50 puan seviyesi tam nötr sınır kabul edilir; 50'nin üzeri sanayide büyümeyi, 50'nin altı ise daralmayı simgeler. Göstergenin temel avantajı, resmi üretim rakamları çıkmadan haftalar önce fabrikaların sipariş alıp almadığını anında göstermesidir. Endeksin yüksek çıkması fabrikaların harıl harıl çalıştığını ve ekonominin güçlendiğini ispatlar. Düşük çıkması ise siparişlerin bıçak gibi kesildiğini ve sanayide resesyon riskinin belirdiğini gösterir.",
        "realLifeExample": "Mahallenizdeki büyük bir tekstil fabrikasının müdürünün masasında yeni sipariş dosyalarının biriktiğini veya tam tersine dosyaların boş kaldığını hayal edin. Fabrika müdürü yeni siparişler aldığında hemen depocuyu arayıp daha çok kumaş ve iplik siparişi verir, yeni işçiler işe alır ve makinelerin hızını artırır. Siparişler azaldığında ise müdür yeni hammadde alımını hemen durdurur ve fabrikayı rölantiye alır. İşte İmalat PMI, tam olarak bu fabrika müdürlerinin verdikleri siparişlere bakarak sanayinin gidişatını erkenden anlayan bir ankettir. Eğer PMI 50'nin altına düşerse, fabrikaların teker teker frene bastığını ve birkaç ay sonra genel bir işsizlik dalgası gelebileceğini anlarsınız. Bu nedenle açıklanan bu endeks, sanayinin geleceğine tutulan en parlak ışıktır.",
        "whatItMeasures": "İmalat fabrikalarının yeni sipariş, üretim, istihdam ve tedarikçi teslimat sürelerini ölçer.",
        "whyItMatters": "Sanayi üretiminin ve ekonomik büyümenin haftalar öncesinden yönünü gösteren en popüler öncü veridir.",
        "howToInterpret": "50 puan eşiği referans alınmalı; 50 üzeri büyüme, 50 altı daralma olarak okunmalıdır.",
        "impactChannels": [
            {
                "step": "PMI ANKETİ",
                "title": "Endeks Açıklanır",
                "desc": "Satın alma yöneticilerinin anket sonuçlarından derlenen nihai imalat endeksi duyurulur."
            },
            {
                "step": "SİPARİŞ VE ÜRETİM",
                "title": "Fabrika Nabzı",
                "desc": "Endeksin 50 üzerinde olması fabrikaların yeni sipariş alarak kapasite artırdığını belgeler."
            },
            {
                "step": "İSTİHDAM ETKİSİ",
                "title": "İşgücü Talebi",
                "desc": "Fabrikalarda siparişler arttıkça yeni mavi yakalı personel alımları hızlanır."
            },
            {
                "step": "MERKEZ BANKASI",
                "title": "Büyüme Desteği",
                "desc": "Sanayi zayıflarsa merkez bankaları üretimi desteklemek için faiz indirimlerine yönelebilir."
            },
            {
                "step": "HİSSE SENETLERİ",
                "title": "Sanayi Sektörü",
                "desc": "PMI verisinin güçlü gelmesi sanayi ve ihracat şirketlerinin hisse performansını yukarı iter."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikte 50 çizgisinin üzerine doğru tırmanış sanayide genişlemeyi, altına iniş ise daralmayı gösterir.",
            "changeSpeed": "50 seviyesinden uzaklaşma hızı sanayideki ivmelenmenin veya çöküşün şiddetini simgeler.",
            "context": "Küresel tedarik zinciri aksamalarının teslimat sürelerini uzatarak endeksi yapay yükseltebileceği dikkate alınmalıdır."
        },
        "whatWeCannotInfer": "PMI'ın 50 üzerinde olması her fabrikanın kar ettiği anlamına gelmez; maliyet artışları karlılığı eritebilir.",
        "financialLiteracyItems": [
            {
                "title": "PMI Nasıl Hesaplanır?",
                "content": "Satın alma müdürlerine yöneltilen 'Yeni siparişleriniz geçen aya göre arttı mı, azaldı mı, aynı mı kaldı?' sorularının ağırlıklı endeks haline getirilmesidir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Sanayi Üretim Endeksi",
                "id": "tr_ind_prod",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "S&P Global Hizmet PMI (Nihai)",
                "id": "sp_services_pmi",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "ISM İmalat PMI Endeksi": {
        "id": "us_ism_pmi",
        "name": "ISM İmalat PMI Endeksi",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "critical",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "ISM İmalat PMI Endeksi, Amerika'daki imalat sanayisinin genel sağlığını ve fabrika siparişlerini ölçen, ABD Tedarik Yönetim Enstitüsü (ISM) tarafından hazırlanan en köklü öncü göstergedir. Ülke çapındaki 300'den fazla dev imalat firmasının satın alma başkanlarına yöneltilen detaylı anketlerle her ayın ilk iş günü yayınlanır. Endekste 50 puan eşik seviyesidir; 50'nin üzerindeki değerler Amerikan sanayisinde genişlemeyi, 50'nin altındaki değerler ise daralmayı ifade eder. Verinin en kritik yönü, Amerika'nın ekonomik büyümesinin ivme mi kazandığını yoksa yavaşlamaya mı başladığını en hızlı haber veren gösterge olmasıdır. Yüksek ISM verisi şirketlerin yeni yatırımlar yaptığını ve Dolar'ın küresel bazda güçleneceğini gösterir. Düşük ISM verisi ise fabrikaların sipariş alamadığını ve Amerikan Merkez Bankası'nın faiz indirmeye yaklaşabileceğini sinyaller.",
        "realLifeExample": "Amerika'daki dev fabrikaların hammadde satın almaktan sorumlu müdürlerinin yeni hammadde sipariş etmek için sıraya girdiğini hayal edin. Fabrikalar ne kadar çok çelik, plastik ve elektronik parça sipariş ederse, dünyadaki tüm tedarikçi ülkelerin ihracatı o kadar coşar. Fakat bu satın alma müdürleri önlerini göremediklerini söyleyip siparişleri durdurduğunda, dünya genelindeki hammadde taşımacılığı anında bıçak gibi kesilir. İşte ISM İmalat Endeksi, bu kilit müdürlerin ekonomiye duyduğu güveni ve verdikleri siparişlerin hacmini ölçer. Endeks zayıfladığında küresel petrol ve emtia fiyatları geriler, çünkü fabrikaların hammaddeye olan açlığı azalmıştır. Bu basit puan, dünya sanayisinin gaz pedalına mı yoksa frenine mi basıldığını herkese gösterir.",
        "whatItMeasures": "Amerika'daki imalat sektörünün genel aktivite, yeni sipariş, istihdam ve stok durumunu ölçer.",
        "whyItMatters": "Wall Street ve küresel piyasaların ayın ilk işlem gününde takip ettiği en eski ve en saygın sanayi barometresidir.",
        "howToInterpret": "50 eşiği izlenmeli; özellikle Yeni Siparişler ve İstihdam alt endekslerindeki ayrışmalara dikkat edilmelidir.",
        "impactChannels": [
            {
                "step": "ISM AÇIKLAMASI",
                "title": "Rapor Yayınlanır",
                "desc": "Her ayın ilk iş gününde Amerika'nın resmi imalat sanayi karnesi duyurulur."
            },
            {
                "step": "DOLAR VE GETİRİLER",
                "title": "Tahvil Tepkisi",
                "desc": "Güçlü ISM verisi Amerikan ekonomisinin sağlamlığını kanıtlayarak ABD tahvil faizlerini ve Dolar'ı yükseltir."
            },
            {
                "step": "KÜRESEL EMTİA",
                "title": "Sanayi Metalleri",
                "desc": "Amerikan fabrikalarının canlılığı bakır, alüminyum ve petrol gibi sanayi emtialarına talep getirir."
            },
            {
                "step": "FED POLİTİKASI",
                "title": "Büyüme Desteği",
                "desc": "ISM'in 50'nin altına çakılması Fed'in faiz indirimlerini hızlandırmasına zemin hazırlar."
            },
            {
                "step": "HİSSE SENETLERİ",
                "title": "Sanayi Devleri",
                "desc": "Caterpillar, Boeing gibi küresel sanayi devlerinin hisseleri ISM endeksinin yönüne göre sert tepki verir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikte 50 puanın üzerine tırmanış sanayide canlılığı, altına iniş ise fabrikaların sipariş kaybettiğini gösterir.",
            "changeSpeed": "Endeksteki 2 puandan büyük aylık sıçrama veya düşüşler piyasada sert dalga yaratır.",
            "context": "Tarihsel olarak ISM endeksinin 42 puanın altına inmesi genel bir ekonomik resesyonla örtüşür."
        },
        "whatWeCannotInfer": "ISM endeksinin düşmesi şirketlerin kesinlikle iflas edeceği anlamına gelmez; geçim döngüsündeki bir yavaşlamayı temsil eder.",
        "financialLiteracyItems": [
            {
                "title": "Yeni Siparişler Alt Endeksi Neden Kritik?",
                "content": "Mevcut üretimi değil, fabrikaların gelecekteki iş potansiyelini doğrudan gösterdiği için ISM raporundaki en kritik bileşendir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ISM İmalat Dışı (Hizmet) PMI",
                "id": "us_ism_services",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            }
        ]
    },
    "ISM İmalat Fiyat Endeksi": {
        "id": "us_ism_prices",
        "name": "ISM İmalat Fiyat Endeksi",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "high",
        "unit": "Puan",
        "higherIsPositive": false,
        "definition": "ISM İmalat Fiyat Endeksi, Amerika'daki imalat fabrikalarının üretim yapabilmek için satın aldıkları hammadde, enerji ve ara mallara ödedikleri fiyatların aylık artış hızını ölçen alt göstergedir. ISM İmalat Raporu bünyesinde her ay satın alma yöneticilerine girdilerinin o ay zamlanıp zamlanmadığı sorularak derlenir. Endekste 50 puan sınırı fiyatların sabit kaldığını, 50'nin üzeri hammadde fiyatlarının zamlandığını, 50'nin altı ise ucuzladığını gösterir. Göstergenin ana işlevi, fabrikaların katlandığı girdi maliyetlerinin tüketiciye yansımadan önceki ilk kıvılcımını erkenden yakalamaktır. Yüksek çıkan bir fiyat endeksi, üreticilerin çok pahalıya hammadde aldığını ve yakında son tüketici ürünlerine zam yapacaklarını haber verir. Düşük çıkması ise fabrikaların maliyet baskısından kurtulduğuna ve küresel enflasyonun yatışacağına işaret eder.",
        "realLifeExample": "Bir ayakkabı imalatçısının ayakkabı dikmek için kullandığı deri, taban lastiği ve yapıştırıcının toptan fiyatlarının iki katına çıktığını düşünün. İmalatçı hammaddeleri zamlı fiyattan satın almak zorunda kaldığında, ürettiği her bir çift ayakkabının maliyeti tavan yapar. İmalatçı bu masrafı karşılayabilmek için mağazalara gönderdiği ayakkabıların toptan etiketine derhal zam koyar. Mağaza sahibi de o ayakkabıyı vitrine koyduğunda siz onu geçen aya göre çok daha pahalıya satın almak zorunda kalırsınız. İşte ISM Fiyat Endeksi, tam olarak bu derinin, plastiğin ve demirin fabrikaya giriş fiyatındaki artış hızını ölçer. Yani fabrikaların ödediği girdi fiyatı yükseldiğinde, birkaç ay sonra vitrinde göreceğiniz ayakkabının fiyatının cep yakacağını anlarsınız. Böylece bu endeks, gelecekteki zam fırtınasının erken habercisidir.",
        "whatItMeasures": "Amerikan imalat fabrikalarının satın aldıkları hammadde ve girdilere ödedikleri fiyatların yönünü ve hızını ölçer.",
        "whyItMatters": "Toptan maliyet enflasyonunun en hızlı ve en erken uyarı sistemidir.",
        "howToInterpret": "50 eşiği takip edilmeli; 50 üzerindeki dik tırmanışlar üretici maliyet şokunu ifade eder.",
        "impactChannels": [
            {
                "step": "GİRDİ MALİYETİ",
                "title": "Fiyat Endeksi",
                "desc": "Fabrikaların hammadde alımında karşılaştığı fiyat değişim endeksi duyurulur."
            },
            {
                "step": "ENFLASYON BEKLENTİSİ",
                "title": "TÜFE Baskısı",
                "desc": "Girdi maliyetlerindeki artış tüketici enflasyonunun inatçı kalacağına dair kaygıları körükler."
            },
            {
                "step": "TAHVİL FAİZLERİ",
                "title": "Getiri Tırmanışı",
                "desc": "Enflasyon endişesiyle ABD 10 yıllık tahvil faizleri yukarı fırlar."
            },
            {
                "step": "FED ŞAHİNLEŞMESİ",
                "title": "Faiz Duruşu",
                "desc": "Fabrika maliyetleri düşmedikçe Fed faiz indirimlerini rafa kaldırabilir."
            },
            {
                "step": "ŞİRKET KARLARI",
                "title": "Borsa Tepkisi",
                "desc": "Pahalı hammadde alan sanayi şirketlerinin kar marjları eriyeceği için borsa hisseleri baskılanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikte 50 seviyesinin üzerine çıkış hammadde maliyetlerinin zamlandığını, altına iniş ise ucuzladığını gösterir.",
            "changeSpeed": "Petrol ve emtia şoklarında endekste 10 puana varan sert aylık zıplamalar görülebilir.",
            "context": "Dolar kurundaki güçlenmenin ithal hammadde fiyatlarını nasıl etkilediği göz önüne alınmalıdır."
        },
        "whatWeCannotInfer": "Endeksin yüksek çıkması şirketlerin hemen iflas edeceği anlamına gelmez; güçlü şirketler maliyeti müşteriye aktarabilir.",
        "financialLiteracyItems": [
            {
                "title": "Girdi Maliyeti Nedir?",
                "content": "Bir ürünün fabrikada üretilebilmesi için satın alınması zorunlu olan hammadde, elektrik, su, doğalgaz ve ambalaj masraflarının tamamıdır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Aylık Üretici Fiyat Endeksi (ÜFE)",
                "id": "us_ppi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "ISM İmalat PMI Endeksi",
                "id": "us_ism_pmi",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "S&P Global Hizmet PMI (Nihai)": {
        "id": "sp_services_pmi",
        "name": "S&P Global Hizmet PMI (Nihai)",
        "country": "EU",
        "flag": "🇪🇺",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "S&P Global Hizmet PMI (Nihai), bankacılık, turizm, lojistik, sağlık ve restoran gibi hizmet sektöründe faaliyet gösteren şirketlerin aylık iş hacmini ve aktivite düzeyini ölçen öncü endekstir. S&P Global tarafından her ay binlerce hizmet sektörü yöneticisiyle yapılan anket sonuçları toplanarak hesaplanır. Endekste 50 puan dengedir; 50 üzeri hizmet sektöründe canlılığı ve genişlemeyi, 50 altı ise durgunluğu simgeler. Modern ekonomilerin yaklaşık yüzde yetmiş beşini hizmet sektörü oluşturduğu için bu veri genel ekonomik sağlığın en büyük aynasıdır. Endeksin yüksek gelmesi insanların seyahat ettiğini, restoranlara gittiğini ve hizmet harcamalarının güçlü kaldığını belgeler. Düşük gelmesi ise tüketicilerin dışarıda harcama yapmaktan kaçındığını ve hizmet sektörünün küçüldüğünü gösterir.",
        "realLifeExample": "Hafta sonu ailenizle bir kafeye gittiğinizde masaların dolu olduğunu, otellerde rezervasyonların taştığını ve kuaförlerin randevu yetiştiremediğini hayal edin. İnsanlar hizmet sektörüne para akıttığında otel çalışanları, garsonlar ve kuryeler para kazanır ve şehirde büyük bir nakit dönüşü yaşanır. Fakat ekonomik sıkıntı başladığında insanlar ilk olarak dışarıda yemek yemeyi, tatile gitmeyi ve kuaför harcamalarını keser. İşte Hizmet PMI, tam olarak bu otellerin, berberlerin, havayolu şirketlerinin ve lokantaların kapısındaki müşteri yoğunluğunu ölçer. Endeksin 50'nin altına inmesi, insanların artık lüks ve keyfi harcamaları tamamen kıstığını ve evine çekildiğini tüm çıplaklığıyla ortaya koyar. Bu nedenle endeks, toplumun cebindeki harçlığın ne kadar rahat olduğunu doğrudan yansıtır.",
        "whatItMeasures": "Hizmet sektöründeki şirketlerin iş aktivitesi, yeni siparişler ve istihdam eğilimini ölçer.",
        "whyItMatters": "Gelişmiş ekonomilerin milli gelirinin ezici çoğunluğunu oluşturan hizmet çarklarının hızını gösterir.",
        "howToInterpret": "50 eşik seviyesidir; imalat PMI ile karşılaştırılarak ekonomideki lokomotif sektörün hangisi olduğu anlaşılır.",
        "impactChannels": [
            {
                "step": "HİZMET ANKETİ",
                "title": "Endeks Duyurulur",
                "desc": "Hizmet sektörü yöneticilerinin aylık iş hacmi ve beklenti sonuçları kamuoyuna açıklanır."
            },
            {
                "step": "TÜKETİM GÜCÜ",
                "title": "Müşteri Trafiği",
                "desc": "50 üzeri değerler otellerin, restoranların ve taşımacılık firmalarının cirolarının arttığını belgeler."
            },
            {
                "step": "HİZMET ENFLASYONU",
                "title": "Ücret Baskısı",
                "desc": "Hizmet talebinin aşırı canlı olması garson, berber ve usta ücretlerinin tırmanmasına yol açar."
            },
            {
                "step": "MERKEZ BANKALARI",
                "title": "Faiz Kararları",
                "desc": "İnatçı hizmet enflasyonu merkez bankalarının faiz indirimlerini ertelemesine neden olur."
            },
            {
                "step": "HİZMET HİSSELERİ",
                "title": "Borsa Sektörleri",
                "desc": "Havacılık, turizm ve perakende hisseleri hizmet PMI'ın gücüne paralel olarak prim yapar."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikte 50 seviyesinin üzerine tırmanış hizmet sektörünün büyüdüğünü, altına iniş ise daraldığını gösterir.",
            "changeSpeed": "Hizmet endeksindeki ani düşüşler tüketici güveninin aniden kırıldığını haber verir.",
            "context": "Yaz aylarındaki turizm patlamasının yarattığı mevsimsel iyimserlik göz önüne alınmalıdır."
        },
        "whatWeCannotInfer": "Hizmet PMI'ın yüksek olması fabrikaların da iyi çalıştığı anlamına gelmez; imalat sektörü durgun kalabilir.",
        "financialLiteracyItems": [
            {
                "title": "Hizmet Enflasyonu Neden İnatçıdır?",
                "content": "Hizmet sektöründe ana maliyet insan emeği ve kira olduğu için, ücretler bir kez arttığında hizmet fiyatlarını aşağı çekmek çok zordur."
            }
        ],
        "relatedIndicators": [
            {
                "name": "S&P Global İmalat PMI (Nihai)",
                "id": "sp_pmi_final",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Euro Bölgesi Çeyreklik Büyüme (GSYH)",
                "id": "eu_gdp_qoq",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "ISM İmalat Dışı (Hizmet) PMI": {
        "id": "us_ism_services",
        "name": "ISM İmalat Dışı (Hizmet) PMI",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "critical",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "ISM İmalat Dışı (Hizmet) PMI, Amerika'daki dev hizmet sektörünün genel performansını, yeni siparişlerini ve istihdam durumunu ölçen en prestijli Amerikan hizmet barometresidir. ABD Tedarik Yönetim Enstitüsü tarafından perakende, sağlık, finans, konaklama ve teknoloji sektöründeki yüzlerce üst düzey yöneticiyle görüşülerek her ay hazırlanır. Endekste 50 puan seviyesi büyüme ile küçülme arasındaki kritik sınır çizgisidir. Amerika ekonomisinin ezici çoğunluğu hizmet faaliyetlerine dayandığı için bu endeks doğrudan Amerikan milli gelirinin gidişatını yansıtır. Verinin 50'nin üzerinde kalması Amerikalıların hizmet tüketmeye devam ettiğini ve istihdamın korunduğunu gösterir. 50'nin altına gerilemesi ise Amerikan ekonomisinin resesyona sürüklendiğine dair en net alarm zillerini çaldırır.",
        "realLifeExample": "Amerika'daki dev bankaların, yazılım firmalarının, kargo şirketlerinin ve hastanelerin yeni müşterilerle sözleşme imzalama hızını düşünün. Bu dev hizmet şirketleri ne kadar çok iş alırsa, o kadar çok yazılımcı, muhasebeci ve ofis çalışanı işe alır ve piyasaya devasa maaş ödemeleri akar. Fakat şirketler yeni proje alamayıp müşteri kaybetmeye başladığında hemen ofis harcamalarını ve personel alımlarını dondururlar. İşte ISM Hizmet Endeksi, Amerika'daki bu devasa ofis ve hizmet dünyasının çarklarının ne kadar hızlı döndüğünü tespit eder. Eğer bu endeks güçlü gelirse Amerikan ekonomisinin dimdik ayakta olduğunu anlar ve küresel piyasalarda risk iştahının arttığını görürsünüz. Bu nedenle bu endeks, Amerikan ekonomisinin ana omurgasıdır.",
        "whatItMeasures": "Amerika'da hizmet sektöründeki iş aktivitesi, yeni siparişler, istihdam ve teslimat sürelerini ölçer.",
        "whyItMatters": "Amerikan ekonomisinin kalbini oluşturan hizmet sektörünün en güvenilir ve en hızlı büyüme göstergesidir.",
        "howToInterpret": "50 seviyesi referanstır; özellikle Yeni Siparişler ve Ödenen Fiyatlar alt endeksleri piyasa tarafından dikkatle izlenir.",
        "impactChannels": [
            {
                "step": "ISM HİZMET",
                "title": "Veri Açıklanır",
                "desc": "Amerika'nın hizmet sektörü büyüme karnesi her ayın üçüncü iş gününde piyasaya sunulur."
            },
            {
                "step": "DOLAR VE GETİRİ",
                "title": "Piyasa Reaksiyonu",
                "desc": "Hizmet sektörünün canlı çıkması Dolar endeksini ve ABD tahvil faizlerini yukarı taşır."
            },
            {
                "step": "FED KARARLARI",
                "title": "Hizmet Enflasyonu",
                "desc": "Hizmet aktivitesinin çok sıcak olması Fed'in faiz indirimlerini ertelemesine yol açar."
            },
            {
                "step": "ONS ALTIN",
                "title": "Ters Hareket",
                "desc": "Güçlü gelen ISM hizmet verisi Dolar'ı yükselttiği için Ons Altın üzerinde baskı kurar."
            },
            {
                "step": "WALL STREET",
                "title": "Hisse Piyasaları",
                "desc": "Amerikan hizmet devlerinin hisseleri ekonomik büyümenin gücüne paralel olarak yükselir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikte 50 puanın üzeri hizmet sektöründe genişlemeyi, altı ise küçülmeyi simgeler.",
            "changeSpeed": "50 seviyesinin altına ani kırılmalar Amerikan ekonomisinde durgunluk riskini tırmandırır.",
            "context": "İmalat PMI verisinden çok daha büyük bir ekonomik ağırlığı temsil ettiği unutulmamalıdır."
        },
        "whatWeCannotInfer": "Endeksin yüksek çıkması her eyalette veya her küçük esnafta durumun mükemmel olduğunu göstermez.",
        "financialLiteracyItems": [
            {
                "title": "İmalat Dışı Sektör Hangi Alanları Kapsar?",
                "content": "Gayrimenkul, finans, sigortacılık, sağlık, eğitim, turizm, eğlence, perakende ve bilişim gibi fabrika üretimi dışındaki tüm ekonomik faaliyetleri kapsar."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ISM İmalat PMI Endeksi",
                "id": "us_ism_pmi",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "ABD Aylık Perakende Satışlar",
                "id": "us_retail_sales",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Aylık Fabrika Siparişleri": {
        "id": "us_factory_orders",
        "name": "Aylık Fabrika Siparişleri",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Aylık Fabrika Siparişleri, Amerika'daki imalat sanayisinde faaliyet gösteren fabrikaların hem dayanıksız tüketim malları hem de ağır sanayi makineleri için yurt içi ve yurt dışından aldığı yeni siparişlerin toplam değerini gösteren veridir. ABD Nüfus Sayım Bürosu tarafından her ay üretici tesislerden toplanan resmi fatura ve sipariş bildirimleriyle hesaplanır. Göstergenin en önemli işlevi, fabrikaların önümüzdeki aylarda ne kadar yoğun çalışacağını ve üretim kapasitesinin ne derece dolacağını önceden bildirmesidir. Siparişlerin artması, şirketlerin yeni fabrikalar açtığını, makine ve teçhizat yatırımı yaptığını ve işlerin büyüdüğünü gösterir. Siparişlerin azalması ise talebin durulduğunu, fabrikaların mevcut siparişleri bitirdikten sonra boş kalacağını ve istihdamın tehdit altında olduğunu anlatır. Dünyanın sanayi yatırımlarını izlemek isteyen küresel analistler bu veriyi büyümenin en sağlam temeli olarak kabul eder.",
        "realLifeExample": "Bir makine üreticisinin fabrikasında telefonların susmadığını ve yeni traktör, vinç veya jeneratör siparişlerinin ardı ardına yazıldığını düşünün. Fabrika sahibi aylar sonrasına kadar sipariş defterini doldurduğunda neşelenir, hemen yeni teknisyenler işe alır ve iş yerini genişletir. Fakat telefonlar çalmaz ve haftalarca tek bir yeni sipariş bile gelmezse, fabrika sahibi mecburen vardiyaları azaltır ve kemer sıkma politikasına geçer. İşte Fabrika Siparişleri verisi, Amerika'daki binlerce fabrikanın sipariş defterinin kalınlığını ölçen resmi bir bilançodur. Siparişler tırmandığında küresel sanayi zincirine büyük bir enerji yayılırken, siparişler kesildiğinde dünya çapında bir ekonomik yavaşlamanın sinyali verilir. Bu yüzden siparişler, gelecekteki istihdamın garantisidir.",
        "whatItMeasures": "Amerikan imalat fabrikalarına gelen yeni siparişlerin Dolar cinsinden aylık artış hızını ölçer.",
        "whyItMatters": "Gelecekteki sanayi üretiminin ve kurumsal sermaye yatırımlarının en güvenilir öncü verisidir.",
        "howToInterpret": "Uçak ve savunma gibi aşırı dalgalı kalemleri hariç tutan çekirdek sipariş rakamları incelenmelidir.",
        "impactChannels": [
            {
                "step": "SİPARİŞ VERİSİ",
                "title": "Rapor Açıklanır",
                "desc": "Amerika genelindeki fabrikalara gelen yeni sipariş hacmi resmi olarak kamuoyuyla paylaşılır."
            },
            {
                "step": "KAPASİTE KULLANIMI",
                "title": "Gelecek Üretim",
                "desc": "Sipariş artışı fabrikaların önümüzdeki aylarda kapasitelerini sonuna kadar kullanacağını belgeler."
            },
            {
                "step": "SERMAYE YATIRIMI",
                "title": "Büyüme İştahı",
                "desc": "Şirketlerin yeni makine sipariş etmesi ekonomiye olan güvenlerini ve büyüme niyetlerini kanıtlar."
            },
            {
                "step": "DOLAR GÜCÜ",
                "title": "Piyasa Algısı",
                "desc": "Güçlü fabrika siparişleri Amerikan sanayisinin kuvvetini göstererek Dolar'ı destekler."
            },
            {
                "step": "SANAYİ HİSSELERİ",
                "title": "Borsa Performansı",
                "desc": "Sipariş defterleri dolan ağır sanayi ve teknoloji şirketlerinin hisseleri borsada değer kazanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı hareket sanayi yatırımlarının hızlandığını, aşağı hareket ise fabrikaların sipariş kaybettiğini gösterir.",
            "changeSpeed": "Uçak siparişlerinin yoğun olduğu aylarda görülen aşırı sıçramalar çekirdek veriyle dengelenmelidir.",
            "context": "Dayanıklı mallar öncü verisi ile karşılaştırılarak teyit edilmelidir."
        },
        "whatWeCannotInfer": "Siparişlerin artması o ay hemen teslimat yapıldığı veya paranın kasaya girdiği anlamına gelmez.",
        "financialLiteracyItems": [
            {
                "title": "Dayanıklı ve Dayanıksız Mal Nedir?",
                "content": "Dayanıklı mal en az 3 yıl kullanım ömrü olan araba, buzdolabı, makinedir; dayanıksız mal ise gıda, giyim ve kimyasal gibi hızlı tüketilen ürünlerdir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ISM İmalat PMI Endeksi",
                "id": "us_ism_pmi",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Aylık Sanayi Üretim Endeksi",
                "id": "tr_ind_prod",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Michigan Tüketici Duyarlılık Endeksi (Öncü)": {
        "id": "us_michigan_sentiment",
        "name": "Michigan Tüketici Duyarlılık Endeksi (Öncü)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "Michigan Tüketici Duyarlılık Endeksi, Amerika'daki sıradan tüketicilerin kendi mevcut aile bütçelerine ve ülkenin genel ekonomik geleceğine ne kadar güvendiğini ölçen en ünlü tüketici güven endeksidir. Michigan Üniversitesi tarafından her ay yüzlerce farklı Amerikalı aileyle yapılan telefon anketleri sonucunda önce öncü, sonra nihai olarak kamuoyuna duyurulur. Endeksin temel görevi, insanların geleceğe dair umutlu mu yoksa karamsar mı olduğunu ve önümüzdeki dönemde alışveriş yapmaya istekli olup olmadığını tespit etmektir. Endeksin yüksek çıkması, vatandaşların işlerinden ve gelirlerinden emin olduğunu, korkusuzca harcama yapacağını ve ekonomiyi büyüteceğini gösterir. Düşük çıkması ise ailelerin gelecekten endişe duyduğunu, harcamalarını kısarak tasarrufa çekileceğini ve tüketimin yavaşlayacağını belgeler. Tüketici harcamaları Amerikan ekonomisinin can damarı olduğu için bu psikolojik güven endeksi piyasalarda fırtınalar koparabilir.",
        "realLifeExample": "Gelecek ay işinizden çıkarılmayacağınıza ve maaşınıza güzel bir zam geleceğine yürekten inandığınız bir anı düşünün. Kendinizi maddi olarak güvende hissettiğinizde hiç çekinmeden yeni bir televizyon satın alır, ailenizle tatile çıkar ve para harcamaktan korkmazsınız. Ancak yarın şirketin batabileceğini veya hayat pahalılığının dayanılmaz olacağını düşünürseniz en ufak keyfi harcamayı bile iptal eder, sadece temel ihtiyaçlarınızı alıp kenara para koyarsınız. İşte Michigan Tüketici Güven Endeksi, tam olarak bu iç huzurunun ve harcama cesaretinin Amerika genelindeki psikolojik ölçümüdür. İnsanların güveni yüksek olduğunda mağazalar dolup taşar, güven kırıldığında ise tüketim anında donar ve ekonomi durma noktasına gelir. Bu yüzden güven, paranın harcanma hızını belirleyen anahtardır.",
        "whatItMeasures": "Amerikan hanehalklarının kişisel mali durumları ve genel ekonomik gidişata dair güven düzeyini ölçer.",
        "whyItMatters": "Tüketici harcamalarının yönünü belirleyen ve anketteki enflasyon beklentileri sebebiyle Fed'in çok önem verdiği bir veridir.",
        "howToInterpret": "Endeksin yanı sıra raporda yer alan 1 yıllık ve 5 yıllık Tüketici Enflasyon Beklentisi rakamlarına odaklanılmalıdır.",
        "impactChannels": [
            {
                "step": "GÜVEN ANKETİ",
                "title": "Öncü Rapor",
                "desc": "Michigan Üniversitesi Amerikalı tüketicilerin aylık güven puanını ve enflasyon beklentilerini açıklar."
            },
            {
                "step": "HARCAMA EĞİLİMİ",
                "title": "Cüzdan Kararı",
                "desc": "Tüketici güveninin yükselmesi ailelerin büyük ev eşyası ve otomobil alma isteğini tetikler."
            },
            {
                "step": "ENFLASYON BEKLENTİSİ",
                "title": "Fed Pusulası",
                "desc": "Tüketicilerin geleceğe dair enflasyon beklentisi yükselirse Fed faizleri sıkı tutmak zorunda kalır."
            },
            {
                "step": "DOLAR VE GETİRİ",
                "title": "Tahvil Hareketi",
                "desc": "Güven endeksi beklentileri aşarsa Dolar güçlenir, güven çökerse tahvil faizleri geriler."
            },
            {
                "step": "BORSALAR",
                "title": "Perakende Eğilimi",
                "desc": "Tüketicinin morali yüksek olduğunda borsa hisseleri güçlü talep beklentisiyle değer kazanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı tırmanış tüketicinin moralinin düzeldiğini, aşağı seyir ise karamsarlığı gösterir.",
            "changeSpeed": "Benzin fiyatlarındaki ani artışların tüketici güvenini çok hızlı aşağı çektiği bilinmelidir.",
            "context": "Tarihsel ortalaması olan 85-90 puan seviyeleriyle karşılaştırılarak okunmalıdır."
        },
        "whatWeCannotInfer": "Tüketicinin moralinin yüksek olması hemen o gün alışveriş çılgınlığı yapacağını mutlak garanti etmez.",
        "financialLiteracyItems": [
            {
                "title": "Tüketici Enflasyon Beklentisi Neden Önemlidir?",
                "content": "Halk enflasyonun artacağına inanırsa 'Yarın daha pahalı olacak' diyerek bugünden alışverişe koşar ve bu davranış enflasyonu gerçekten patlatır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Aylık Perakende Satışlar",
                "id": "us_retail_sales",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "ABD Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "us_cpi_mom",
                "category": "Enflasyon"
            }
        ]
    },
    "Euro Bölgesi Tüketici Güven Endeksi (Öncü)": {
        "id": "eu_consumer_confidence",
        "name": "Euro Bölgesi Tüketici Güven Endeksi (Öncü)",
        "country": "EU",
        "flag": "🇪🇺",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "Puan",
        "higherIsPositive": true,
        "definition": "Euro Bölgesi Tüketici Güven Endeksi, Avrupa Birliği'ne üye Euro Bölgesi ülkelerinde yaşayan hanehalklarının genel ekonomik durum, işsizlik beklentileri ve tasarruf eğilimlerine dair duygu durumunu ölçen güven endeksidir. Avrupa Komisyonu tarafından her ay binlerce Avrupalı tüketiciyle anketler yapılarak eksi yüz ile artı yüz puan arasında bir endeks olarak yayınlanır. Göstergenin en önemli işlevi, Avrupa kıtasındaki tüketicilerin önümüzdeki aylarda ne kadar mal ve hizmet satın alacağını önceden tahmin etmektir. Endeksin yükselmesi Avrupalı ailelerin ekonomik geleceklerine güvendiğini, harcama yapmaktan çekinmeyeceğini ve Avrupa iç pazarının canlanacağını gösterir. Endeksin derin eksi seviyelere gerilemesi ise hayat pahalılığı ve enerji krizleri sebebiyle ailelerin paniklediğini ve tüketimi kıstığını ortaya koyar. Türkiye'nin en büyük ihracat pazarı Avrupa olduğu için Avrupalı tüketicinin güveni doğrudan Türk ihracatçısının siparişlerini belirler.",
        "realLifeExample": "Almanya'da veya Fransa'da yaşayan sıradan bir ailenin kış aylarında doğalgaz ve elektrik faturalarını düşünerek endişelendiğini hayal edin. Avrupalı aile gelecekte faturasını ödeyememekten korkarsa yeni araba almaz, mobilyalarını yenilemez ve Türkiye gibi ülkelerden gelen tekstil ürünlerine para harcamaz. Fakat güvenleri yerine geldiğinde hemen yaz tatili planı yapar ve mağazalardan bol bol alışveriş yapmaya başlar. İşte Euro Bölgesi Tüketici Güven Endeksi, Avrupalı tüketicinin cebindeki cüzdanı açmaya ne kadar hevesli olduğunu gösterir. Avrupalı güven duyup harcama yaptıkça Türkiye'den daha çok beyaz eşya ve giyim ithal edilir; güven çöktüğünde ise Türk sanayicisinin Avrupa'ya yaptığı satışlar sekteye uğrar. Yani Avrupalı ailenin morali, Türk ihracatçısının gelirini doğrudan etkiler.",
        "whatItMeasures": "Euro Bölgesi'ndeki hanehalklarının gelecek 12 aya dair ekonomik beklentilerini ve güven seviyesini ölçer.",
        "whyItMatters": "Avrupa kıtasındaki iç tüketim harcamalarının ve ekonomik büyümenin en erken psikolojik sinyalidir.",
        "howToInterpret": "Endeksin tarihsel ortalamasına ve eksi bölgedeki toparlanma hızına bakılmalıdır.",
        "impactChannels": [
            {
                "step": "GÜVEN VERİSİ",
                "title": "Avrupa Komisyonu",
                "desc": "Euro Bölgesi genelinde tüketicilerin aylık güven puanı kamuoyuna duyurulur."
            },
            {
                "step": "TÜKETİM HARCAMALARI",
                "title": "Avrupa Pazarı",
                "desc": "Güvenin toparlanması Avrupalıların dayanıklı tüketim malları ve seyahat harcamalarını artırır."
            },
            {
                "step": "TÜRKİYE İHRACATI",
                "title": "Sipariş Akışı",
                "desc": "Avrupa'da tüketim canlandıkça Türkiye'nin tekstil, otomotiv ve beyaz eşya ihracatı hız kazanır."
            },
            {
                "step": "ECB FAİZ BEKLENTİSİ",
                "title": "Euro Gücü",
                "desc": "Tüketici güveninin kuvvetlenmesi Avrupa Merkez Bankası'nın faiz indirim baskısını hafifletir."
            },
            {
                "step": "EURO/DOLAR (EURUSD)",
                "title": "Parite Hareketi",
                "desc": "Avrupa ekonomisine duyulan güven Euro'yu küresel para birimleri karşısında destekler."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı yönlü tırmanış Avrupalı ailelerin moral bulduğunu, aşağı seyir ise kemer sıktıklarını gösterir.",
            "changeSpeed": "Enerji fiyatlarındaki düşüşlerin güven endeksini hızla toparladığı bilinmelidir.",
            "context": "Genellikle sıfırın altındaki negatif bölgede seyreden endeksin tarihsel dip seviyelerle mesafesi izlenmelidir."
        },
        "whatWeCannotInfer": "Endeksin yükselmesi her Avrupa ülkesinde aynı anda refah patlaması yaşandığı anlamına gelmez.",
        "financialLiteracyItems": [
            {
                "title": "Neden Negatif Değer Alır?",
                "content": "Anketteki karamsar cevapların sayısı iyimser cevapların sayısını aştığında endeks matematiksel olarak eksi değer alır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Euro Bölgesi Çeyreklik Büyüme (GSYH)",
                "id": "eu_gdp_qoq",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "S&P Global Hizmet PMI (Nihai)",
                "id": "sp_services_pmi",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Euro Bölgesi Çeyreklik Büyüme (GSYH)": {
        "id": "eu_gdp_qoq",
        "name": "Euro Bölgesi Çeyreklik Büyüme (GSYH)",
        "country": "EU",
        "flag": "🇪🇺",
        "category": "Büyüme & İmalat",
        "impactLevel": "critical",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Euro Bölgesi Çeyreklik Büyüme (GSYH), Euro para birimini kullanan Avrupa ülkelerinin ortaklaşa ürettiği tüm mal ve hizmetlerin toplam ekonomik değerindeki üç aylık büyüme veya daralma yüzdesidir. Avrupa İstatistik Ofisi (Eurostat) tarafından üye devletlerin milli gelir verileri konsolide edilerek her çeyrek dönem sonrasında resmi olarak duyurulur. Göstergenin temel amacı, Avrupa ekonomisinin büyüyerek zenginleştiğini mi yoksa küçülerek resesyona mı girdiğini kesin rakamlarla ilan etmektir. Verinin pozitif ve yüksek gelmesi, Avrupa kıtasında fabrikaların çalıştığını, istihdamın arttığını ve refahın yükseldiğini ispatlar. Verinin eksi gelmesi veya sıfıra yakın kalması ise Avrupa'nın durgunluğa saplandığını ve ekonomik kriz tehlikesinin kapıda olduğunu gösterir. Avrupa Merkez Bankası (ECB) faiz kararlarını ve parasal politikalarını doğrudan bu büyüme karnesine göre belirler.",
        "realLifeExample": "Şehrinizdeki tüm dükkanların, fabrikaların ve çalışanların son üç ayda bir önceki üç aya göre daha fazla para kazanıp zenginleştiğini düşünün. Ülke genelinde pastanın büyümesi demek daha fazla iş imkanı, daha yüksek maaşlar ve herkesin refah seviyesinin bir basamak yukarı çıkması demektir. Ancak tam aksine ekonomi küçüldüğünde pastadan herkese düşen pay azalır, şirketler küçülür ve insanlar geçim derdine düşer. İşte Euro Bölgesi Büyüme Rakamı, Avrupa kıtasındaki bu ekonomik pastanın büyüyüp büyümediğini belgeleyen en büyük resmi karnedir. Avrupa pastası büyüdüğünde Türkiye'den daha çok mal ve turist çeker; pasta küçüldüğünde ise Türkiye'nin en büyük ticaret kapısında işler durulur. Bu nedenle Avrupa'nın büyümesi, komşumuzun zenginleşerek bize alışverişe gelmesidir.",
        "whatItMeasures": "Euro Bölgesi ekonomisinin toplam çıktısındaki çeyreklik reel büyüme hızını ölçer.",
        "whyItMatters": "Avrupa kıtasının resesyona girip girmediğini tescilleyen nihai makro ekonomik veridir.",
        "howToInterpret": "İki çeyrek üst üste eksi büyümenin teknik resesyon anlamına geldiği unutulmamalıdır.",
        "impactChannels": [
            {
                "step": "GSYH VERİSİ",
                "title": "Eurostat Raporu",
                "desc": "Avrupa'nın çeyreklik milli gelir büyüme oranı resmi olarak ilan edilir."
            },
            {
                "step": "RESESYON KONTROLÜ",
                "title": "Ekonomik Sağlık",
                "desc": "Verinin eksi gelmesi Avrupa genelinde resesyon alarmı verilmesine yol açar."
            },
            {
                "step": "ECB PARA POLİTİKASI",
                "title": "Faiz İndirimi",
                "desc": "Büyüme zayıf kalırsa Avrupa Merkez Bankası ekonomiyi canlandırmak için faizleri indirir."
            },
            {
                "step": "EURO KURU (EUR)",
                "title": "Parite Dengesi",
                "desc": "Büyüme güçlü çıkarsa Euro değer kazanır, zayıf çıkarsa Euro diğer para birimleri karşısında erir."
            },
            {
                "step": "AVRUPA VE TÜRKİYE BORSALARI",
                "title": "Hisse İştahı",
                "desc": "Avrupa büyümesi Türk ihracatçı şirketlerinin hisse değerlemelerine doğrudan pozitif yansır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki pozitif barlar Avrupa'nın büyüdüğünü, sıfırın altındaki barlar ise daralmayı simgeler.",
            "changeSpeed": "Almanya gibi dev ekonomilerin büyüme hızındaki yavaşlama tüm kıtanın ortalamasını aşağı çeker.",
            "context": "Çeyreklik verinin yıllıklandırılmış büyüme oranlarıyla birlikte okunması gerekir."
        },
        "whatWeCannotInfer": "Avrupa'nın büyümesi her üye ülkenin aynı hızda zenginleştiğini göstermez; güney ve kuzey ülkeleri arasında farklar olabilir.",
        "financialLiteracyItems": [
            {
                "title": "Teknik Resesyon Nedir?",
                "content": "Bir ülke veya bölge ekonomisinin üst üste iki çeyrek boyunca negatif büyüme (küçülme) kaydetmesi durumudur."
            }
        ],
        "relatedIndicators": [
            {
                "name": "S&P Global İmalat PMI (Nihai)",
                "id": "sp_pmi_final",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Euro Bölgesi Tüketici Güven Endeksi (Öncü)",
                "id": "eu_consumer_confidence",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "ABD Yapı Ruhsatları": {
        "id": "us_building_permits",
        "name": "ABD Yapı Ruhsatları",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "K",
        "higherIsPositive": true,
        "definition": "ABD Yapı Ruhsatları, Amerika'da yeni konut ve bina inşaatına başlayabilmek için yerel belediyelerden alınan resmi inşaat izinlerinin aylık toplam sayısını gösteren öncü gayrimenkul verisidir. ABD Nüfus Sayım Bürosu tarafından her ay ülke genelindeki binlerce ruhsat bürosunun kayıtları toplanarak hesaplanır ve açıklanır. Göstergenin en benzersiz yanı, henüz temeli bile atılmamış gelecekteki inşaat faaliyetlerini aylar öncesinden kesin bir şekilde haber vermesidir. Ruhsat sayısının artması, inşaat firmalarının geleceğe güvenle baktığını, yeni konut projeleri başlatacağını ve sektöre büyük nakit akışı olacağını gösterir. Ruhsatların sert düşüşe geçmesi ise yükselen faizler yüzünden müteahhitlerin yeni proje başlatmaktan korktuğunu ve inşaat sektörünün durma noktasına geleceğini belgeler. İnşaat sektörü yüzlerce farklı sanayi kolunu beslediği için bu veri tüm Amerikan ekonomisinin gelecekteki büyüme hızını müjdeler.",
        "realLifeExample": "Bir müteahhidin yeni bir apartman veya site inşa etmek için belediyenin kapısına gidip inşaat ruhsatı harcını yatırdığını gözünüzün önüne getirin. Müteahhit bu izni aldığı an geleceğe güveniyor demektir; birkaç hafta sonra tonlarca çimento, demir, tuğla ve cam siparişi verecektir. Aynı zamanda yüzlerce inşaat işçisi, mimar ve mühendis o şantiyede iş bularak evine ekmek götürecektir. Fakat faizler yükselip evler satılamaz hale geldiğinde müteahhitler belediyeden ruhsat almayı derhal keser ve projelerini rafa kaldırır. İşte ABD Yapı Ruhsatları verisi, tam olarak kaç yeni inşaatın temelinin atılacağını önceden sayarak gelecekteki ekonomik canlılığı erkenden gözler önüne serer. Dolayısıyla bu ruhsatlar, gelecekteki istihdamın ve malzeme alımlarının habercisidir.",
        "whatItMeasures": "Amerika genelinde yeni konut inşaatları için yerel otoritelerden alınan resmi izin sayısını ölçer.",
        "whyItMatters": "Gelecekteki konut başlangıçlarının ve inşaat yatırımlarının en güvenilir öncü göstergesidir.",
        "howToInterpret": "İpotek (Mortgage) faizlerinin seviyesi ile yapı ruhsatları arasındaki ters ilişki takip edilmelidir.",
        "impactChannels": [
            {
                "step": "RUHSAT VERİSİ",
                "title": "İzinler Açıklanır",
                "desc": "Amerika genelinde alınan yeni konut inşaatı izin sayısı resmi olarak ilan edilir."
            },
            {
                "step": "MORTGAGE FAİZLERİ",
                "title": "Kredi Maliyeti",
                "desc": "Konut kredisi faizleri düştükçe müteahhitlerin yeni ruhsat alma iştahı hızla katlanır."
            },
            {
                "step": "ŞANTİYE ÇALIŞMALARI",
                "title": "Malzeme Talebi",
                "desc": "Ruhsatların artması birkaç ay sonra çimento, kereste ve demir talebini yukarı çeker."
            },
            {
                "step": "İSTİHDAM YARATIMI",
                "title": "İnşaat İşçileri",
                "desc": "Yeni projeler mimarlardan ustalara kadar devasa bir istihdam kapısı açar."
            },
            {
                "step": "GAYRİMENKUL HİSSELERİ",
                "title": "Borsa Hareketi",
                "desc": "Konut üreticisi ve inşaat malzemesi satan dev şirketlerin hisseleri primlenir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yukarı hareket konut sektörünün canlanacağını, aşağı hareket ise inşaatın durulacağını gösterir.",
            "changeSpeed": "Yıllıklandırılmış 1.5 milyon adet seviyesinin altı Amerikan inşaat piyasasında durgunluk sayılır.",
            "context": "Hava muhalefetinin yoğun olduğu kış aylarındaki dönemsel düşüşler göz önüne alınmalıdır."
        },
        "whatWeCannotInfer": "Ruhsat alınan her projenin hemen o ay inşaatına başlanacağı garanti değildir; piyasa şartlarına göre beklenebilir.",
        "financialLiteracyItems": [
            {
                "title": "Yapı Ruhsatı ile Konut Başlangıcı Farkı",
                "content": "Yapı ruhsatı belediyeden alınan yasal izindir; konut başlangıcı ise şantiyede kazmanın vurulup temelin fiilen atılmasıdır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık İnşaat Harcamaları",
                "id": "us_const_spending",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Fed Politika Faizi Kararı",
                "id": "us_fed_rate",
                "category": "Faiz & Para Politikası"
            }
        ]
    },
    "Aylık İnşaat Harcamaları": {
        "id": "us_const_spending",
        "name": "Aylık İnşaat Harcamaları",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Büyüme & İmalat",
        "impactLevel": "low",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Aylık İnşaat Harcamaları, Amerika'da hem kamu sektörünün yollar, köprüler, okullar için hem de özel sektörün konut ve fabrikalar için son bir ayda inşaatlara harcadığı toplam Dolar tutarının değişimini ölçer. ABD Nüfus Sayım Bürosu tarafından kamu ihaleleri ve özel gayrimenkul projelerindeki aylık nakit akışları incelenerek düzenli olarak yayınlanır. Göstergenin temel amacı, ülkedeki altyapı ve üstyapı yatırımlarının hızını ve inşaat sahalarına pompalanan reel sermaye miktarını ölçmektir. İnşaat harcamalarının artması, devletin ve şirketlerin geleceğe büyük yatırımlar yaptığını, çimento ve çelik tüketiminin arttığını ve ekonominin canlandığını kanıtlar. Harcamaların gerilemesi ise bütçelerin kısıldığını, projelerin yavaşlatıldığını ve gayrimenkul yatırımlarının fren yaptığını gösterir. Amerikan gayrimenkul ve altyapı piyasasının büyüklüğü sebebiyle küresel emtia ve iş makineleri sektörü bu harcama tutarını yakından izler.",
        "realLifeExample": "Şehrinizde yeni otoyolların, hastanelerin, metro hatlarının ve dev konut sitelerinin aynı anda yükseldiğini ve her yerde vinçlerin çalıştığını hayal edin. Her gün bu şantiyelere yüzlerce kamyon hafriyat döker, beton mikserleri vızır vızır çalışır ve binlerce usta ve mühendis alın teri döker. İnşaatlara bu devasa nakit aktıkça demir çelik fabrikalarından nakliyecilere kadar tüm sektörler büyük paralar kazanır. Ancak para bittiğinde veya faizler fırladığında şantiyeler yarım bırakılır, vinçler paslanmaya terk edilir ve işçiler evlerine gönderilir. İşte İnşaat Harcamaları verisi, inşaat sahalarına bir ayda kaç milyar Dolar nakit para aktığını kuruşu kuruşuna ölçen resmi bir yatırım bilançosudur. Bu harcamalar arttığında ekonominin damarlarına sıcak para pompalanır.",
        "whatItMeasures": "Amerika'da konut, ticari bina ve kamu altyapı inşaatlarına harcanan toplam tutarın aylık değişimini ölçer.",
        "whyItMatters": "Sabit sermaye yatırımlarının büyüklüğünü ve inşaat sektörünün GSYH'ye doğrudan katkısını belgeler.",
        "howToInterpret": "Özel sektör konut harcamaları ile devletin kamu altyapı harcamaları arasındaki dağılım ayrıştırılmalıdır.",
        "impactChannels": [
            {
                "step": "HARCAMA BİLGİSİ",
                "title": "Rapor Açıklanır",
                "desc": "İnşaat sektörüne son bir ayda harcanan toplam nakit miktarı kamuoyuna duyurulur."
            },
            {
                "step": "KAMU YATIRIMLARI",
                "title": "Altyapı Projeleri",
                "desc": "Devletin yol, köprü ve enerji hatlarına ayırdığı bütçe sanayi tesislerine iş imkanı sağlar."
            },
            {
                "step": "KONUT SEKTÖRÜ",
                "title": "Özel Girişim",
                "desc": "Özel sektörün yeni bina inşaat harcamaları gayrimenkul arzını artırır."
            },
            {
                "step": "EMTİA TÜKETİMİ",
                "title": "Hammadde Talebi",
                "desc": "İnşaat harcamalarındaki yükseliş bakır, kereste, çimento ve çelik talebini besler."
            },
            {
                "step": "BORSALAR",
                "title": "İş Makinesi Hisseleri",
                "desc": "Caterpillar gibi ağır iş makinesi üreticileri ve inşaat şirketleri bu harcamalardan doğrudan nemalanır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yükseliş inşaat sahalarına giren paranın arttığını, düşüş ise kemer sıkıldığını simgeler.",
            "changeSpeed": "Kamu teşvik paketlerinin devreye girdiği dönemlerde harcamalarda hızlı zıplamalar görülür.",
            "context": "Enflasyon sebebiyle artan inşaat maliyetlerinin harcama tutarını yapay olarak şişirebileceği unutulmamalıdır."
        },
        "whatWeCannotInfer": "Harcamaların artması o ay daha fazla yeni binanın bittiği anlamına gelmez; maliyet artışları da harcamayı yükseltir.",
        "financialLiteracyItems": [
            {
                "title": "Altyapı Harcaması Nedir?",
                "content": "Devletin kamu yararı için köprü, baraj, otoyol, havalimanı ve demiryolu gibi uzun vadeli tesislere yaptığı yatırımlardır."
            }
        ],
        "relatedIndicators": [
            {
                "name": "ABD Yapı Ruhsatları",
                "id": "us_building_permits",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Aylık Fabrika Siparişleri",
                "id": "us_factory_orders",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Dış Ticaret Dengesi (Öncü)": {
        "id": "us_trade_balance",
        "name": "Dış Ticaret Dengesi (Öncü)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Dış Ticaret",
        "impactLevel": "medium",
        "unit": "B $",
        "higherIsPositive": true,
        "definition": "Dış Ticaret Dengesi (Öncü), bir ülkenin yurt dışına sattığı toplam ihracat mallarının değeri ile yurt dışından satın aldığı toplam ithalat mallarının değeri arasındaki net parasal farkı gösteren resmi ticaret karnesidir. ABD Ticaret Bakanlığı tarafından gümrük kayıtları ve sınır ticaret beyannameleri taranarak her ay öncü ve nihai olarak kamuoyuna ilan edilir. İhracatın ithalattan fazla olması ticaret fazlası, ithalatın ihracattan fazla olması ise ülkenin dış ticaret açığı verdiğini simgeler. Göstergenin temel işlevi, ülkeye giren yabancı para miktarı ile ülkeden çıkan döviz miktarının dengesini ve dış rekabet gücünü ölçmektir. Ticaret açığının rekor kırması, ülkenin kendi ürettiğinden fazlasını dışarıdan tükettiğini ve dış finansmana ihtiyaç duyduğunu belgeler. Dış ticaret fazlası veya dengenin iyileşmesi ise ülkenin para birimini güçlendirir ve milli gelire doğrudan pozitif katkı sağlar.",
        "realLifeExample": "Bir ailenin evine her ay giren toplam maaş ve gelir ile evin dışarıya, markete ve dükkanlara yaptığı toplam harcamayı kıyasladığınızı düşünün. Eğer ailenin harcamaları kazandığı geliri fersah fersah aşıyorsa, aile her ay borçlanmak ve açığını kapatmak için kredi çekmek zorunda kalır. Tam tersine aile ürettiğinden fazlasını satıp gelir elde ediyorsa kasasında döviz birikir ve ekonomik olarak çok güçlü bir konuma yükselir. İşte Dış Ticaret Dengesi, koca bir ülkenin tüm dünyaya mal satarak kazandığı para ile dışarıya ödediği fatura arasındaki farkı hesaplar. Açık büyüdüğünde ülkenin para birimi baskı altında kalır, açık küçüldüğünde ise ülke ekonomik bağımsızlığını ve finansal gücünü perçinler. Bu denge, ülkenin dünyaya borçlu mu yoksa alacaklı mı olduğunu gösterir.",
        "whatItMeasures": "Ülkenin mal ve hizmet ihracatı ile ithalatı arasındaki net parasal farkı (açık veya fazla) ölçer.",
        "whyItMatters": "Milli gelir hesaplamasındaki net dış talep katkısını ve döviz rezervlerinin dengesini doğrudan belirler.",
        "howToInterpret": "İthalattaki artışın hammadde ve yatırım mallarından mı yoksa lüks tüketimden mi kaynaklandığına bakılmalıdır.",
        "impactChannels": [
            {
                "step": "TİCARET RAPORU",
                "title": "Veri Açıklanır",
                "desc": "Aylık ihracat ve ithalat rakamları ile net dış ticaret açığı veya fazlası kamuoyuna duyurulur."
            },
            {
                "step": "DÖVİZ DENGESİ",
                "title": "Para Akışı",
                "desc": "Dış ticaret açığı büyüdükçe ülkenin döviz ihtiyacı artar ve yerel para birimi üzerinde baskı oluşur."
            },
            {
                "step": "GSYH KATKISI",
                "title": "Net Büyüme",
                "desc": "İhracatın ithalattan hızlı büyümesi çeyreklik ekonomik büyümeye doğrudan pozitif puan ekler."
            },
            {
                "step": "GÜMRÜK VE TARİFELER",
                "title": "Ticaret Politikası",
                "desc": "Büyük ticaret açıkları hükümetlerin ithalata ek gümrük vergileri koymasına yol açabilir."
            },
            {
                "step": "LİMAN VE LOJİSTİK",
                "title": "Taşımacılık Hisseleri",
                "desc": "Ticaret hacminin büyümesi deniz taşımacılığı ve lojistik şirketlerinin gelirlerini artırır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki aşağı yönlü derinleşme dış ticaret açığının büyüdüğünü, yukarı hareket ise dengenin iyileştiğini gösterir.",
            "changeSpeed": "Petrol fiyatlarındaki sert artışların enerji ithalatçısı ülkelerde dış ticaret açığını anında patlattığı unutulmamalıdır.",
            "context": "İhracatın ithalatı karşılama oranı ile birlikte incelenmelidir."
        },
        "whatWeCannotInfer": "Dış ticaret açığı veren bir ülkenin hemen batacağı söylenemez; yabancı sermaye ve turizm gelirleriyle bu açık finanse edilebilir.",
        "financialLiteracyItems": [
            {
                "title": "Dış Ticaret Açığı ile Cari Açık Arasındaki Fark",
                "content": "Dış ticaret açığı sadece mal alım satımını kapsar; cari açık ise turizm, navlun, faiz ödemeleri gibi tüm döviz giriş çıkışlarını içerir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Sanayi Üretim Endeksi",
                "id": "tr_ind_prod",
                "category": "Büyüme & İmalat"
            },
            {
                "name": "Euro Bölgesi Çeyreklik Büyüme (GSYH)",
                "id": "eu_gdp_qoq",
                "category": "Büyüme & İmalat"
            }
        ]
    },
    "Haftalık Ham Petrol Stokları": {
        "id": "us_crude_oil_inventories",
        "name": "Haftalık Ham Petrol Stokları",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Dış Ticaret",
        "impactLevel": "medium",
        "unit": "M Varil",
        "higherIsPositive": false,
        "definition": "Haftalık Ham Petrol Stokları, Amerika'daki ticari petrol depolama tesislerinde ve rafinerilerde bulunan ham petrol varillerinin son bir hafta içinde kaç milyon varil arttığını veya azaldığını gösteren enerji göstergesidir. ABD Enerji Enformasyon İdaresi (EIA) tarafından her Çarşamba günü ülkedeki tüm petrol sahaları ve boru hatları taranarak düzenli açıklanır. Göstergenin asli görevi, dünyanın bir numaralı petrol tüketicisi olan Amerika'da akaryakıt ve enerji talebinin ne durumda olduğunu ortaya koymaktır. Stokların beklenenden fazla azalması, fabrikaların ve araçların harıl harıl petrol tükettiğini, talebin çok güçlü olduğunu ve petrol fiyatlarının tırmanabileceğini gösterir. Stokların yığılması ve artması ise petrolün depolarda kaldığını, tüketimin azaldığını ve küresel petrol fiyatlarının düşebileceğini belgeler. Ham petrol dünya ticaretinin ana yakıtı olduğu için bu haftalık veri benzin istasyonlarından küresel enflasyona kadar her şeyi anında etkiler.",
        "realLifeExample": "Aracınızın deposunu doldurmak için benzinliğe yanaştığınızda tabeladaki pompa fiyatının sürekli neden değiştiğini merak ettiğinizi varsayın. Dünyanın en çok petrol tüketen ülkesi olan Amerika'da rafinerilerdeki petrol stokları azaldığında, küresel çapta bir petrol kıtlığı endişesi doğar ve ham petrolün varil fiyatı anında fırlar. Petrol fiyatı fırladığında ise Türkiye'deki rafineriler ham petrolü daha pahalıya ithal etmek zorunda kalır ve ertesi gün benzine ve motorine zam gelir. Akaryakıta zam geldiğinde kamyonlar tarladaki domatesi pazara daha pahalı taşır ve sofranızdaki yemeğin maliyeti bile artar. İşte Haftalık Ham Petrol Stokları, depolardaki petrol seviyesini ölçerek cebinizdeki benzin ve gıda masrafının önümüzdeki günlerde nasıl değişeceğini fısıldayan küresel bir vanadır. Bu yüzden depodaki her varil petrol, cebinizdeki parayla yakından ilgilidir.",
        "whatItMeasures": "Amerika'daki ticari depolarda bulunan ham petrol miktarının haftalık değişimini ölçer.",
        "whyItMatters": "Brent ve WTI ham petrol fiyatlarını dakikalar içinde hareket ettiren en etkili enerji verisidir.",
        "howToInterpret": "Stokların azalması (eksi veri) petrol fiyatlarını yükseltir; stokların artması (artı veri) petrol fiyatlarını düşürür.",
        "impactChannels": [
            {
                "step": "EIA RAPORU",
                "title": "Stoklar Açıklanır",
                "desc": "Her Çarşamba TSİ 17:30'da ABD resmi petrol stok değişimi kamuoyuna duyurulur."
            },
            {
                "step": "PETROL FİYATLARI",
                "title": "Brent ve WTI",
                "desc": "Stoklardaki beklenmedik düşüş küresel ham petrol fiyatlarını saniyeler içinde yukarı zıplatır."
            },
            {
                "step": "AKARYAKIT POMPASI",
                "title": "Benzin ve Mazot",
                "desc": "Küresel petrolün pahalanması Türkiye'deki akaryakıt pompa fiyatlarına zam olarak yansır."
            },
            {
                "step": "ENFLASYON BASKISI",
                "title": "Taşıma Maliyeti",
                "desc": "Benzin zammı lojistik maliyetlerini artırarak çarşı pazardaki gıda fiyatlarını yukarı iter."
            },
            {
                "step": "ENERJİ HİSSELERİ",
                "title": "Tüpraş ve Rafineriler",
                "desc": "Petrol fiyatlarındaki dalgalanma Tüpraş gibi dev rafineri şirketlerinin hisselerinde hareket yaratır."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki negatif barlar depolardan petrol çekildiğini (güçlü talep), pozitif barlar ise stok fazlasını gösterir.",
            "changeSpeed": "Haftalık 5 milyon varili aşan stok erimeleri veya yığılmaları petrol fiyatında sert kırılma yaratır.",
            "context": "Stratejik Petrol Rezervi (SPR) alım veya satımlarının ticari stoklar üzerindeki etkisi ayrıştırılmalıdır."
        },
        "whatWeCannotInfer": "Stokların bir hafta artması dünyada petrol krizinin bittiği anlamına gelmez; rafineri bakım dönemleri geçici stok yığılması yapabilir.",
        "financialLiteracyItems": [
            {
                "title": "WTI ile Brent Petrol Arasındaki Fark Nedir?",
                "content": "WTI Amerika'da Teksas merkezli üretilen hafif petroldür; Brent ise Kuzey Denizi'nden çıkarılan ve uluslararası piyasalarda referans alınan küresel petrol türüdür."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Aylık Tüketici Fiyat Endeksi (TÜFE)",
                "id": "tr_cpi_mom",
                "category": "Enflasyon"
            },
            {
                "name": "Dış Ticaret Dengesi (Öncü)",
                "id": "us_trade_balance",
                "category": "Dış Ticaret"
            }
        ]
    },
    "FOMC Toplantı Tutanakları (Fed)": {
        "id": "us_fomc_minutes",
        "name": "FOMC Toplantı Tutanakları (Fed)",
        "country": "ABD",
        "flag": "🇺🇸",
        "category": "Faiz & Para Politikası",
        "impactLevel": "critical",
        "unit": "Metin",
        "higherIsPositive": true,
        "definition": "FOMC Toplantı Tutanakları, Amerikan Merkez Bankası Federal Açık Piyasa Komitesi'nin (FOMC) gerçekleştirdiği faiz toplantısından tam üç hafta sonra yayınlanan, toplantıdaki tüm gizli tartışmaları ve üye görüşlerini içeren resmi tutanak belgesidir. Fed tarafından her faiz kararının ardından harfi harfine redakte edilerek kamuoyunun incelemesine sunulur. Tutanakların temel amacı, kapalı kapılar ardında hangi Fed üyelerinin faiz artırımını veya indirimini savunduğunu ve geleceğe dair riskleri nasıl gördüklerini kelimesi kelimesine açıklamaktır. Tutanaklarda üyelerin enflasyondan çok korktuğu ve faizleri uzun süre yüksek tutmak istediği anlaşılırsa bu durum piyasada şahin algılanır ve Dolar güçlenir. Üyelerin ekonomik durgunluktan endişelenip faiz indirimine sıcak baktığı görülürse bu durum güvercin olarak nitelendirilir ve altın ile borsalara can suyu olur. Finansal piyasalar, Fed'in bir sonraki toplantıda ne yapacağını çözmek için bu tutanaklardaki her bir kelimeyi büyüteçle inceler.",
        "realLifeExample": "Bir ailenin anne, baba ve büyüklerinin evin salonunda toplanıp aile bütçesi ve borçlar hakkında tartıştığı gizli bir aile meclisi düşünün. Bu toplantının kapısı kapalıdır ama üç hafta sonra toplantıda kimin 'Harcamaları kısalım', kimin 'Kredi çekip rahatlayalım' dediğini anlatan detaylı bir günlük ortaya çıkar. İşte Fed Tutanakları, dünyanın en güçlü para yöneticilerinin o toplantı odasında Dolar'ın geleceği hakkında tam olarak ne konuştuklarını açığa çıkaran resmi günlüktür. Bu günlüğü okuyan yatırımcılar, bankacıların gelecekte parayı kısıp kısmayacağını anlar ve yatırımlarına ona göre yön verir. Tutanaklardan sıkılaşma kokusu çıktığında dünyadaki krediler pahalılaşır ve bu durum sizin kredi kartınızdan ev kredinize kadar tüm finans dünyasını sarar. Yani bu tutanaklar, dünya parasını yönetenlerin zihin haritasıdır.",
        "whatItMeasures": "Fed üyelerinin para politikası, enflasyon ve büyüme risklerine dair kapalı kapılar ardındaki görüş ayrılıklarını ve konsensüsünü ölçer.",
        "whyItMatters": "Gelecek Fed toplantılarında alınacak faiz kararlarının ipuçlarını taşıyan en kapsamlı resmi belgedir.",
        "howToInterpret": "Metindeki 'şahin' (sıkılaştırıcı) ve 'güvercin' (gevşetici) kelimelerin sıklığı ve tonlaması analiz edilmelidir.",
        "impactChannels": [
            {
                "step": "TUTANAK YAYINI",
                "title": "Metin Açıklanır",
                "desc": "Toplantıdan 3 hafta sonra saat 21:00 TSİ'de tüm tutanaklar kelimesi kelimesine yayınlanır."
            },
            {
                "step": "KELİME ANALİZİ",
                "title": "Şahin/Güvercin Ton",
                "desc": "Piyasa algoritmaları enflasyon ve faiz kelimelerinin tonunu saniyeler içinde tarar."
            },
            {
                "step": "FAİZ BEKLENTİLERİ",
                "title": "Gelecek Toplantı",
                "desc": "Fed'in bir sonraki toplantıda faiz indirip indirmeyeceğine dair olasılıklar güncellenir."
            },
            {
                "step": "DOLAR VE GETİRİLER",
                "title": "Küresel Denge",
                "desc": "Şahin tutanaklar Dolar'ı yükseltirken, güvercin tutanaklar tahvil faizlerini aşağı çeker."
            },
            {
                "step": "ALTIN VE BORSALAR",
                "title": "Risk Fiyatlaması",
                "desc": "Faiz indirimi sinyali veren tutanaklar Ons Altın ve teknoloji hisselerine ralli yaptırır."
            }
        ],
        "chartReadingCards": {
            "direction": "Metindeki faiz artışı veya indirimi savunan üye sayısının dengesi piyasa yönünü tayin eder.",
            "changeSpeed": "Önceki toplantı tutanaklarına göre eklenen veya çıkarılan anahtar kelimeler politika değişim hızını gösterir.",
            "context": "Tutanakların 3 hafta önceki görüşleri yansıttığı, aradan geçen süredeki yeni verilerin durumu değiştirebileceği unutulmamalıdır."
        },
        "whatWeCannotInfer": "Tutanaklarda konuşulan her şeyin kesinlikle gerçekleşeceği söylenemez; yeni gelen veriler üyelerin fikrini değiştirebilir.",
        "financialLiteracyItems": [
            {
                "title": "Şahin ve Güvercin Ne Demektir?",
                "content": "Şahin, enflasyonu düşürmek için faiz artışını savunan sıkı para politikası yanlısı; Güvercin ise büyümeyi ve istihdamı desteklemek için düşük faizi savunan üyedir."
            }
        ],
        "relatedIndicators": [
            {
                "name": "Fed Politika Faizi Kararı",
                "id": "us_fed_rate",
                "category": "Faiz & Para Politikası"
            },
            {
                "name": "Tarım Dışı İstihdam Değişimi (NFP)",
                "id": "us_nfp",
                "category": "İstihdam"
            }
        ]
    },
    "Default": {
        "id": "default_indicator",
        "name": "Ekonomik Gösterge",
        "country": "TR",
        "flag": "🌐",
        "category": "Büyüme & İmalat",
        "impactLevel": "medium",
        "unit": "%",
        "higherIsPositive": true,
        "definition": "Bu gösterge, resmi ekonomi ve istatistik kurumları tarafından piyasa takibi amacıyla yayınlanan makroekonomik veridir. Gösterge, ilgili sektördeki dönemsel aktivite düzeyini ve finansal dengeleri ölçerek kamuoyuyla paylaşılır. Temel amacı yatırımcı kararlarını, kurumsal planlamaları ve piyasadaki genel güven eğilimini aydınlatmaktır. Verinin beklentilerden iyi gelmesi ekonomik canlılığa, zayıf gelmesi ise sektördeki yavaşlamaya işaret eder. Piyasa analistleri veriyi geçmiş dönem trendleriyle ve genel konjonktürle kıyaslayarak değerlendirir.",
        "realLifeExample": "Gündelik hayatınızda çarşı pazara çıktığınızda veya banka işlemlerinizi yaparken ekonomideki genel havanın bütçenize yansıdığını hissedersiniz. İşlerin iyi gittiği dönemlerde esnafın yüzü güler, alışverişler artar ve hanehalkları geleceğe daha umutla bakar. Ancak piyasada genel bir durgunluk olduğunda harcamalar kısılır ve insanlar parasını güvenceye almak için temkinli davranır. İşte bu ekonomik gösterge, sokaktaki bu canlılığın veya yavaşlamanın resmi rakamlara dökülmüş halidir. Verinin seyrine göre finansal piyasalardaki borçlanma şartları ve fiyatlamalar yeniden dengelenir.",
        "whatItMeasures": "Piyasadaki ekonomik aktivite düzeyini ve finansal dengeleri ölçer.",
        "whyItMatters": "Yatırımcı kararlarını ve makroekonomik beklentileri yönlendirir.",
        "howToInterpret": "Göstergeyi değerlendirirken geçmiş trendle uyumuna ve piyasa beklentileriyle olan farkına odaklanılmalıdır.",
        "impactChannels": [
            {
                "step": "VERİ",
                "title": "Veri Açıklaması",
                "desc": "Resmi makro veri yayınlanır."
            },
            {
                "step": "BEKLENTİLER",
                "title": "Piyasa Algısı",
                "desc": "Makroekonomik beklentiler güncellenir."
            },
            {
                "step": "PARA POLİTİKASI",
                "title": "Politika Etkisi",
                "desc": "Ekonomi yönetiminin kararlarına girdi sağlar."
            },
            {
                "step": "FAİZLER",
                "title": "Piyasa Faizleri",
                "desc": "Borçlanma maliyetlerine yansır."
            },
            {
                "step": "KREDİ / MEVDUAT",
                "title": "Reel Kesim Etkisi",
                "desc": "Şirketler ve hanehalklarının tercihlerini etkiler."
            },
            {
                "step": "FİNANSAL VARLIKLAR",
                "title": "Piyasa Dengeleme",
                "desc": "Finansal asset fiyatlamaları dengelenir."
            }
        ],
        "chartReadingCards": {
            "direction": "Grafikteki yükseliş veya düşüş ilgili makro değişkenin dönemsel seyrini ifade eder.",
            "changeSpeed": "Verinin değişim ivmesi kırılma anlarını gösterir.",
            "context": "Tek veri yerine dönemsel ortalamalara odaklanılmalıdır."
        },
        "whatWeCannotInfer": "Tek veri açıklamasından uzun vadeli piyasa yönü çıkarılamaz.",
        "financialLiteracyItems": [
            {
                "title": "Makro Veri Nedir?",
                "content": "Ekonominin genel sağlık durumunu gösteren istatistiki göstergelerdir."
            }
        ],
        "relatedIndicators": []
    }
};
