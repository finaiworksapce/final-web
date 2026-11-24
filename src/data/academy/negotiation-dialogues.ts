export type ExpenseCategory = 'A' | 'B' | 'C';

export interface PredefinedExpense {
  id: string;
  name: string;
  category: ExpenseCategory;
  defaultAmount: number;
  description: string;
}

export const PREDEFINED_EXPENSES: PredefinedExpense[] = [
  // A Kategorisi: Sabit Masraflar (0 Pazarlık)
  {
    id: 'exp-rent',
    name: 'Kira / Barınma',
    category: 'A',
    defaultAmount: 12000,
    description: 'Temel barınma ve yaşam sığınağı',
  },
  {
    id: 'exp-loan',
    name: 'Kredi / Borç Taksiti',
    category: 'A',
    defaultAmount: 4000,
    description: 'Yasal yükümlülük taşıyan sabit taksitler',
  },
  {
    id: 'exp-dues',
    name: 'Bina Aidatı & Sabit Yönetim',
    category: 'A',
    defaultAmount: 900,
    description: 'Zorunlu bina ve çevre yönetim gideri',
  },

  // B Kategorisi: Yarı-Değişken Yaşam Masrafları (1 Defa Israr)
  {
    id: 'exp-groceries',
    name: 'Mutfak ve Market Gideri',
    category: 'B',
    defaultAmount: 6500,
    description: 'Temel gıda, temizlik ve ev ihtiyaçları',
  },
  {
    id: 'exp-bills',
    name: 'Faturalar (Elektrik, Su, İnternet, Gaz)',
    category: 'B',
    defaultAmount: 2200,
    description: 'Ev enerjisi ve iletişim tüketimi',
  },
  {
    id: 'exp-transport',
    name: 'Ulaşım ve Akaryakıt',
    category: 'B',
    defaultAmount: 2500,
    description: 'İşe gidiş-geliş, toplu taşıma veya araç yakıtı',
  },

  // C Kategorisi: Asıl Tasarruf & Sermaye Üretim Alanı (2 Defa Israr)
  {
    id: 'exp-dining',
    name: 'Dışarıda Yeme-İçme & Kahve',
    category: 'C',
    defaultAmount: 3000,
    description: 'Kafeler, hazır siparişler ve restoran tüketimi',
  },
  {
    id: 'exp-subs',
    name: 'Dijital Abonelikler & Eğlence',
    category: 'C',
    defaultAmount: 900,
    description: 'Yayın platformları, müzik, oyun üyelikleri',
  },
  {
    id: 'exp-shopping',
    name: 'Kıyafet & Kişisel Alışveriş',
    category: 'C',
    defaultAmount: 2000,
    description: 'Mevsimsel giyim, elektronik ve kişisel tüketim',
  },
  {
    id: 'exp-other',
    name: 'Diğer (Özel Kalem)',
    category: 'C',
    defaultAmount: 1500,
    description: 'Kullanıcının belirleyeceği serbest gider kalemi',
  },
];

export interface DialogueContext {
  userName: string;
  itemName: string;
  currentAmount: number;
  offeredAmount?: number;
  suggestedCut?: number;
  savedSoFar?: number;
}

// 4 ile 6 Cümlelik Zengin Finansal Okuryazarlık ve Yatırım Odaklı Diyalog Havuzu (Benzetmesiz)
export const NEGOTIATION_DIALOGUES = {
  // =========================================================================
  // GRUP 1: A KATEGORİSİ — SABİT MASRAFLAR (0 PAZARLIK, DOĞRUDAN ONAY) [5 Varyasyon, 4-5 Cümle]
  // =========================================================================
  categoryA_approval: [
    (ctx: DialogueContext) =>
      `${ctx.userName}, nakit akış tablomuzda ${ctx.itemName} için ayırdığın ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ tutarını inceliyoruz. Burası senin barınma, yaşam güvenliği ve sözleşmeli yasal yükümlülük alanındır. Finansal okuryazarlığın temel kuralı, hayat kaliteni ve temel güvenliğini olumsuz etkileyecek harcamalardan tasarruf aranmamasıdır. Sabit giderlerin yerli yerinde ve koruma altında olması, birazdan optimize edeceğimiz diğer harcamalar için bize sağlam bir temel sağlıyor. Bu kaleme hiç dokunmuyor, ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ tutarını doğrudan onaylayarak sonraki adıma geçiyoruz.`,

    (ctx: DialogueContext) =>
      `Masadaki ilk sabit harcamamız ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺). Bu harcama senin bütçendeki zorunlu sabit harcamandır ve bugünden yarına burayı kısmak gerçekçi bir hedef olmaz. Finansal disiplin demek kendini temel ihtiyaçlardan mahrum bırakmak veya yaşam standartlarını düşürmek değildir. Burada gereksiz bir pazarlık yaparak odağımızı dağıtmayacak, bütçenin dengesini aynen muhafaza edeceğiz. Enerjimizi asıl fark yaratabileceğimiz harcama başlıklarına saklayarak bu kalemi olduğu gibi onaylıyorum.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} kalemi senin yaşam alanının ve finansal düzeninin temel harcamasıdır. Sözleşmeli ve sabit harcamalar bütçede öngörülebilirliği sağlayan en değerli unsurlardır. Bu tutarda bir kısıntı yapmaya çalışmak uzun vadede daha büyük finansal streslere yol açabilir. FinAi Workspace ekibi olarak bu rakamı aynen koruyor ve bütçe dengeni güvenceye alıyoruz. ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ tutarını sisteme kilitledim; şimdi asıl tasarruf sağlayacağımız diğer kalemlere geçebiliriz.`,

    (ctx: DialogueContext) =>
      `Bütçendeki ${ctx.itemName} harcamasını doğrudan güvenli listemize dahil ediyoruz. Hayat standardını ayakta tutan zorunlu masraflarda pazarlık yapılmaz. Bütçe optimizasyonu yaparken en büyük hata, temel yaşam giderlerini kısıp motivasyonu kaybetmektir. Biz stratejimizi temel giderleri koruyup değişken harcamalardaki tasarrufları yatırıma dönüştürmek üzerine kuruyoruz. Bu kalemi ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ olarak tescilleyip bir sonraki harcama başlığına ilerliyoruz.`,

    (ctx: DialogueContext) =>
      `${ctx.itemName} için ayırdığın ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ bütçenin en sağlam dengesini oluşturuyor. Yasal ve zorunlu yükümlülükleri eksiksiz karşılamak finansal sağlığın birinci şartıdır. Bu tutarı hiç değiştirmeden korumak, birazdan yapacağımız sermaye üretiminde bütçemizi çok rahatlatacak. Kararımızı bu yönde veriyor ve bu kalemi güvenle kilitleyerek yolumuza devam ediyoruz.`,
  ],

  // =========================================================================
  // GRUP 2: B KATEGORİSİ — 1. TUR TEKLİF / MAKUL TASARRUF [5 Varyasyon, 4-5 Cümle]
  // =========================================================================
  categoryB_round1: [
    (ctx: DialogueContext) =>
      `Geçen hafta nakit akış tablonu oluştururken ${ctx.itemName} harcamana ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ yazmıştın ortak. Burası temel yaşam giderin olsa da ay içerisinde plansız alımların ve fazla harcamaların en çok biriktiği yerdir. FinAi Workspace ekibi olarak amacımız seni temel konforundan mahrum bırakmak değil, bütçeni bilinçli yönetmektir. Akıllı tercihler ve ihtiyaç listesine sadık kalarak bu kalemi aylık ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ bandına çekmeyi öneriyoruz. Burada sağlayacağın tasarruf bütçene her ay taze bir nakit kazandıracak; ne dersin, sence bu harcamayı kaça düşürebiliriz yaz bakalım.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, 1. haftada ${ctx.itemName} kalemi için sisteme ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ girmiştik. Bu harcama hayatının vazgeçilmezi gibi görünse de içinde kontrolsüzce büyüyen tüketim alışkanlıkları barındırabilir. Kaliteden ödün vermeden yalnızca alternatifleri değerlendirerek bile düzenli bir tasarruf üretebilirsin. Masada bu kalemi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine optimize etmek yıllık bilançonda ciddi bir birikim farkı yaratacaktır. Gel burada bütçeni rasyonel bir dengeye oturtalım; sence bu harcamayı kaça çekebilirsin, teklifini bekliyorum.`,

    (ctx: DialogueContext) =>
      `Sıradaki kalemimiz geçen hafta masaya koyduğun ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺). Market ve fatura gibi harcamalar disiplinli yönetildiğinde bütçede en düzenli nakit akışını serbest bırakan yerdir. Tüketimini tamamen kısmak yerine sadece plansız alışverişleri ayıklamayı hedefliyoruz. Bizim bu harcama için önerdiğimiz dengeli ve sürdürülebilir hedef aylık ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺. Kararı tamamen senin iradene bırakıyoruz; ne dersin ortak, bu kalemi kaça düşürebiliriz yaz bakalım.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} tarafında her ay ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ masada duruyor. Finansal okuryazarlık gereksiz yere harcanan her tutarın farkına varıp onu korumayı gerektirir. Buradan kurtaracağımız her miktar, gelecekte senin adına değer kazanacak yatırımların temel sermayesi olacak. Yaşam standardını sarsmadan bu harcamayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekmek son derece makul bir adımdır. Sen bu harcamada nereye kadar inebilirsin; masaya aklındaki gerçekçi rakamı yaz bakalım.`,

    (ctx: DialogueContext) =>
      `Geçen hafta bütçene yazdığın ${ctx.itemName} tutarı olan ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ üzerinde biraz tasarruf alanı görüyoruz. Temel ihtiyaçlarını kısıtlamadan sadece tüketim verimliliğini artırarak bütçene güç kazandırabiliriz. FinAi Workspace ekibi olarak burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine dengelemeyi tavsiye ediyoruz. Bütçenin kontrolünü eline almak için ilk adımını at; sence bu kalemi kaça çekelim ortak?`,
  ],

  // =========================================================================
  // GRUP 3: B KATEGORİSİ — 2. TUR UZLAŞMA & KİLİT [5 Varyasyon, 4-5 Cümle]
  // =========================================================================
  categoryB_round2_settle: [
    (ctx: DialogueContext) =>
      `Harika bir rasyonel karar; teklifini masada onaylıyorum ${ctx.userName}. ${ctx.itemName} için belirlediğin ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ tutarı hem son derece gerçekçi hem de bütçeni disipline sokacak dengeli bir hedef oldu. Yaşam standardından hiçbir şey kaybetmeden her ay bütçene net bir tasarruf kazandırmayı başardın. Masada kalan bu taze nakit, yıl genelinde bilançona çok ciddi bir finansal güç katacak. Bu tutarı sisteme kaydediyorum; şimdi enerjimizi bir sonraki harcama kalemine taşıyalım.`,

    (ctx: DialogueContext) =>
      `Teklifini sisteme kilitledim ${ctx.userName}, el sıkıştık. ${ctx.itemName} harcamasını ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ seviyesine çekerek bütçendeki kontrolsüz harcamaları durdurmuş oldun. Finansal okuryazarlık tam olarak budur; kendini mahrum bırakmadan harcamalarını yönetebilmek. Cebinde kalan bu düzenli tasarruf birazdan göreceğin genel nakit akışını doğrudan güçlendirecek. Kararlı duruşun için seni tebrik ediyorum; sonraki adıma güvenle geçebiliriz.`,

    (ctx: DialogueContext) =>
      `Son derece ölçülü ve sürdürülebilir bir uzlaşma sağladık. ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak güncelledim ve yeni bütçene işledim. Bu kalemde yarattığın tasarruf, küçük optimizasyonların birleştiğinde ne kadar büyük bir sermayeye dönüştüğünü kanıtlıyor. Finansal kontrolün tamamen sende olduğunu gösteren çok doğru bir adım attın. Şimdi masadaki bir sonraki harcama kalemini ele alarak tasarruf planlamamızı sürdürelim.`,

    (ctx: DialogueContext) =>
      `Sözünü aldım; ${ctx.itemName} artık bütçende ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak tescillendi. Bütçeni zorlamadan böyle bir tasarruf üretmen finansal disiplin kazandığının en somut işaretidir. Her ay cebinde kalacak olan bu fark, gelecekteki yatırım havuzunun düzenli sermayesi olacak. Bu kalemi başarıyla tamamladık, sıradaki harcamaya odaklanabiliriz.`,

    (ctx: DialogueContext) =>
      `Tebrikler ${ctx.userName}; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ kararın tam bir ortak gibi masanın hakkını verdi. Günlük yaşam konforunu bozmadan bütçende somut bir iyileştirme gerçekleştirdin. Bu tutarı kilitliyorum; her ay masada tuttuğun bu miktar yıllık bilançonda büyük fark yaratacaktır. Vakit kaybetmeden sonraki harcama başlığına geçiyoruz.`,
  ],

  // =========================================================================
  // GRUP 4: C KATEGORİSİ — 1. TUR SERT TEKLİF (ASIL TASARRUF ALANI) [5 Varyasyon, 5 Cümle]
  // =========================================================================
  categoryC_round1: [
    (ctx: DialogueContext) =>
      `Geçen hafta nakit akış tablonu oluştururken ${ctx.itemName} harcamana ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ yazmıştın ortak. FinAi Workspace ekibi olarak açık ve net konuşalım: Masada asıl tasarruf yapacağımız ve sermaye üreteceğimiz ana gider başlıkları tam olarak bu ve benzeri kalemler olacak. Gelecek haftalarda öğreneceğin yatırım kısmında doğrudan bu tasarruflarını hisse senedi alımlarında sermaye olarak kullanacaksın. Bu kalemi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine optimize etmek hayatını kesinlikle zorlaştırmaz ama sana güçlü bir yatırım bütçesi kazandırır. Gelecekteki yatırımların için ilk kararlı adımı atalım; ne dersin, bu harcamayı kaça düşürebiliriz yaz bakalım.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, geçen hafta sisteme girdiğin ${ctx.itemName} harcaman ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ olarak masada duruyor. Bütçende en somut ve en yüksek sermayeyi üreteceğimiz yer tam olarak bu harcama kalemidir. Gelecek haftalarda hisse senedi yatırımı yapmayı öğrendiğinde, hisse alabilmek için doğrudan bu tasarruflarına ihtiyacımız olacak. Tüketim alışkanlıklarını biraz disipline ederek burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ bandına çekmeyi teklif ediyoruz. Tercihini gelecekteki finansal gücünden yana kullan ortak; sence bu kalemi kaça çekebiliriz, rakamını yaz.`,

    (ctx: DialogueContext) =>
      `Asıl tasarruf yapacağımız harcama başlıklarının başında ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) geliyor. Buraya giden nakit şu anda doğrudan tüketime gidiyor ve sana hiçbir getiri sağlamadan harcanıyor. Oysa gelecek haftalarda borsa ve şirket ortaklığını öğrendiğinde, bu para senin hisse senedi yatırımlarındaki öz sermayen olacak. Hayat kalitenden ödün vermeden bu harcamayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine dengelemek büyük bir yatırım bütçesi bırakır. Masaya dürüst ve kararlı bir rakam koymanı bekliyorum; bu harcamayı kaça indirelim yaz bakalım.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} harcamanda her ay masadan ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ çıkıyor. Asıl tasarrufu bu gider başlıklarında üretemezsek, gelecek haftalarda yatırıma aktarabileceğimiz düzenli bir kaynak bulamayız. Gelecek haftalarda öğreneceğin yatırım eğitiminde yöneteceğin portföyün büyüklüğü, bugün burada göstereceğin iradeye bağlıdır. Bizim önerimiz bu harcamayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekerek güçlü bir sermaye açığa çıkarmak. Gelecekteki yatırımların için bu adımı atmaya hazır mısın; kaça düşürebileceğini masaya yaz.`,

    (ctx: DialogueContext) =>
      `Geçen hafta belirlediğin ${ctx.itemName} bütçesi olan ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ masada duruyor. Finansal okuryazarlığın temeli burasıdır; anlık tüketimleri geleceğin üretken hisse senedi yatırımlarına dönüştürmek. Gelecek haftalarda şirket yatırımlarına adım atarken tam olarak buradan kurtardığın tasarrufları kullanacaksın. Burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine indirmek bütçende dev bir yatırım sermayesi yaratacaktır. İlk teklifini masaya bırak; sence bu harcamayı kaça çekebiliriz ortak?`,
  ],

  // =========================================================================
  // GRUP 5: C KATEGORİSİ — 2. TUR İKİNCİ ISRAR [5 Varyasyon, 4-5 Cümle]
  // =========================================================================
  categoryC_round2: [
    (ctx: DialogueContext) =>
      `${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ teklifini aldım ancak asıl tasarruf yapacağımız bu ana kalemde biraz daha cesur olmalıyız ${ctx.userName}. Unutma; gelecek haftalarda öğreneceğin yatırım kısmında hisse senedi alırken doğrudan bu tasarruflarını kullanacaksın. Günlük bazı harcama alışkanlıklarını kontrol altına almak seni hiçbir şeyden mahrum etmez, aksine kendi sermayeni büyütmeni sağlar. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine inmek, her ay Borsa İstanbul şirketlerinin hisselerine aktarabileceğimiz taze bir bütçe demektir. Gel bu kalemde potansiyelini sonuna kadar kullanalım; masaya son ve kararlı bir rakam yaz bakalım.`,

    (ctx: DialogueContext) =>
      `${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ başlangıç için iyi bir adım olsa da bu kalemin potansiyelinin biraz altında kalıyor. Burası bütçende en yüksek sermaye üreteceğimiz başlık olduğu için biraz daha gayret göstermeye değer. Gelecek haftalarda şirket ortağı olmayı ve portföy yönetimini öğrendiğinde iyi ki bu parayı masada tutmuşum diyeceksin. Bu harcamayı biraz daha optimize edip ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekmek sana hiçbir şey kaybettirmez. Masaya daha güçlü bir tasarruf hedefi bırakalım; son sözünü söyle ortak.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, anlık tüketimi ertelemek bir kısıtlama değil, gelecekteki finansal bağımsızlığını inşa etmektir. Gelecek haftalardaki yatırım derslerinde öğreneceğin gibi, her ay düzenli hisse senedi almak en sağlam varlık edinme yöntemidir. O hisseleri satın alacak bütçeyi tam olarak bu harcama kaleminden kurtaracağımız tasarrufla oluşturacağız. Gel bu kalemde taviz vermeyelim ve bütçeyi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ bandına oturtalım. Kararlı bir adım at; sence son olarak kaça kadar inebiliriz?`,

    (ctx: DialogueContext) =>
      `Masadaki ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ teklifin fena değil ama asıl tasarruf hedefimizin biraz gerisinde. Gelecek haftalarda yapacağımız hisse senedi alımlarında yatırım sermayemizin güçlü olmasını istiyorsan burada biraz daha irade göstermelisin. Tüketim harcamalarını kontrol altına almak yarın senin adına değer üretecek bir portföyün temeli demektir. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ hedefine ulaşırsak bu kalemi gerçek bir başarıyla tamamlamış olacağız. Kendine güven ve masaya nihai bir rakam bırak ortak; ne diyorsun?`,

    (ctx: DialogueContext) =>
      `Gelecek haftalarda öğreneceğin yatırım kısmında doğrudan bu tasarruflarını kullanacaksın ${ctx.userName}. Tüketime giden parayı sermayeye çevirmek için asıl tasarruf yapacağımız bu alanda son bir adım daha atabilirsin. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine inmeyi kabul edersen harika bir yatırım bütçesi açığa çıkaracağız. Bütçenin geleceğini düşünerek masaya son ve kesin bir teklif yaz bakalım.`,
  ],

  // =========================================================================
  // GRUP 6: C KATEGORİSİ — 3. TUR NİHAİ UZLAŞMA & KİLİT [5 Varyasyon, 4-5 Cümle]
  // =========================================================================
  categoryC_round3_settle: [
    (ctx: DialogueContext) =>
      `Harika bir irade gösterdin; ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak sisteme kilitliyorum. Asıl tasarruf sağlayacağımız bu kritik başlıkta gösterdiğin kararlılık, bütçendeki en büyük sermaye üretimini sağladı. Gelecek haftalarda öğreneceğin yatırım kısmında hisse senedi alırken doğrudan bu tasarruflarını kullanacaksın. Bugün tüketimden kurtardığın her miktar, yarın senin adına değer kazanacak bir portföyün ilk yatırımı oldu. Finansal okuryazarlık yolculuğunda ilk büyük zaferini kazandın; bir sonraki adıma gururla geçebiliriz.`,

    (ctx: DialogueContext) =>
      `Anlaştık ${ctx.userName}, ${ctx.itemName} için belirlediğin ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ hedefini tescilledim. Asıl tasarruf yapacağımız bu harcamayı başarıyla optimize ederek tam bir bilinçli yatırımcı duruşu sergiledin. Cebinde kalan bu ekstra nakit, gelecek haftalarda hisse senedi alımlarında kullanılmak üzere havuzumuza eklendi. Masada kurtardığın bu paranın değerini önümüzdeki derslerde yatırım yaparken çok daha net göreceksin. Bu önemli adımı tamamladık; şimdi tasarruf planlamamızın sonuçlarına ilerleyebiliriz.`,

    (ctx: DialogueContext) =>
      `Sözünü aldım; ${ctx.itemName} artık bütçende ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitlendi. Kolay bir pazarlık olmadı ama asıl tasarruf yapacağımız bu alanda gösterdiğin disiplin takdire şayan. Gelecek haftalarda öğreneceğin yatırım eğitimlerinde bu tasarruflarını doğrudan öz sermaye olarak değerlendireceksin. Bütçendeki gereksiz harcamaları durdurup paranın kontrolünü eline aldığını kanıtladın. FinAi Workspace ekibi olarak seni tebrik ediyoruz; gururla sonraki adıma geçiyoruz.`,

    (ctx: DialogueContext) =>
      `Tebrikler ${ctx.userName}; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ kararınla bu harcamayı muazzam bir yatırım sermayesine dönüştürdün. Tüketime teslim olmak yerine iradeni ortaya koyup masada güçlü bir tasarruf bıraktın. Gelecek haftalarda hisse senedi yatırımlarına adım attığında bu kararın ne kadar hayati olduğunu anlayacaksın. Yıllık bazda yaratacağın bu birikim bilançona seviye atlatacak. Bu kalemi zaferle kapatıyorum; şimdi genel sonuçlarımızı görelim.`,

    (ctx: DialogueContext) =>
      `El sıkıştık; ${ctx.itemName} kalemi için ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ tutarını sisteme işliyorum. Asıl tasarruf sağlayacağımız bu başlıkta elde ettiğin başarı bütçene yeni bir soluk kazandırdı. Kurtardığımız her tutarı gelecek haftalardaki yatırım eğitimlerimizde değerlendirmek üzere korumaya aldık. Kararlı duruşun için teşekkürler; şimdi haftalık tasarruf tablomuzun özetine geçebiliriz.`,
  ],

  // =========================================================================
  // GRUP 7: ÖZEL DURUMLAR (SIFIR KISMA, AŞIRI KISMA, ISRAR) [4-5 Cümle]
  // =========================================================================
  special_responses: {
    zero_cut: [
      (ctx: DialogueContext) =>
        `Yapma ortak, masaya hiç dokunmadan öylece kalkmak olmaz; hadi birazcık kısabiliriz bu kısımları. Pazarlık adettendir, gel düşürelim bu rakamı ve bütçene nefes aldıracak taze bir adım atalım. Asıl tasarrufu bu kalemlerde üretemezsek, gelecek haftalarda öğreneceğin yatırım kısmında kullanacağımız sermayemiz oluşmaz. FinAi Workspace ekibi olarak seni gereksiz zorlamak istemiyoruz ama sembolik de olsa masaya bir indirim koymalıyız. Aklındaki o ufak indirimi yaz bakalım, bu harcamayı kaça düşürebiliriz?`,
    ],
    extreme_cut: [
      (ctx: DialogueContext) =>
        `Oo, görüyorum ki gelecekte yatırım yapmaya bayağı bir heveslisin ortak! Fakat bu kalemi bu kadar sert kısmak günlük hayatını fazlasıyla etkileyip sonrasında bizim kulaklarımızı çınlatmanı istemiyoruz. Finansal okuryazarlıkta en kritik kural sürdürülebilirliktir; aşırı kısıntılar genellikle birkaç hafta sonra pes etmeye ve daha büyük harcamalara yol açar. Dilersen bu kalemi teklif ettiğin bu aşırı düşük rakamdan birazcık yükseltelim ve dengeli bir orta yolda buluşalım. Hem hayatını rahatça sürdürebileceğin hem de yatırım sermayesi üretebileceğin daha makul bir rakam yaz bakalım.`,
    ],
    same_offer: [
      (ctx: DialogueContext) =>
        `Görüyorum ki ilk söylediğin rakamda hala diretiyorsun ${ctx.userName}. Ama pazarlık adettendir ortak, gel bunu birazcık daha düşürelim! Burada masada bırakacağın her lira, gelecek haftalarda öğreneceğin yatırım kısmında doğrudan senin hisse senedi yatırımlarında kullanacağın sermayen olacak. Kendini zorlamadan verebileceğin ufak bir esneklik bile genel tasarruf tablomuzda çok büyük bir fark yaratır. Hadi son bir hamle yap ve bu kalemi biraz daha aşağı çekelim; yeni teklifini bekliyorum.`,
    ],
  },
};

/**
 * Duruma ve kategoriye göre en uygun diyalog metnini seçer
 */
export function getNegotiationDialogue(params: {
  category: ExpenseCategory;
  round: number; // 0, 1, 2
  isSettled: boolean;
  context: DialogueContext;
  specialCondition?: 'zero_cut' | 'extreme_cut' | 'same_offer';
}): string {
  const { category, round, isSettled, context, specialCondition } = params;

  if (specialCondition && NEGOTIATION_DIALOGUES.special_responses[specialCondition]) {
    const list = NEGOTIATION_DIALOGUES.special_responses[specialCondition];
    const idx = Math.floor(Math.random() * list.length);
    return list[idx](context);
  }

  if (category === 'A') {
    const list = NEGOTIATION_DIALOGUES.categoryA_approval;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx](context);
  }

  if (category === 'B') {
    if (isSettled || round >= 1) {
      const list = NEGOTIATION_DIALOGUES.categoryB_round2_settle;
      const idx = Math.floor(Math.random() * list.length);
      return list[idx](context);
    }
    const list = NEGOTIATION_DIALOGUES.categoryB_round1;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx](context);
  }

  // C Kategorisi
  if (isSettled || round >= 2) {
    const list = NEGOTIATION_DIALOGUES.categoryC_round3_settle;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx](context);
  }

  if (round === 1) {
    const list = NEGOTIATION_DIALOGUES.categoryC_round2;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx](context);
  }

  // round === 0
  const list = NEGOTIATION_DIALOGUES.categoryC_round1;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx](context);
}
