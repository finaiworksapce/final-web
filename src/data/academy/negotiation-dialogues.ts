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

  // C Kategorisi: Esnek & Keyfi Tüketim (2 Defa Israr)
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

// 60+ Zengin ve Doğal Diyalog Havuzu
export const NEGOTIATION_DIALOGUES = {
  // =========================================================================
  // GRUP 1: A KATEGORİSİ — SABİT MASRAFLAR (0 PAZARLIK, DOĞRUDAN ONAY) [8 Adet]
  // =========================================================================
  categoryA_approval: [
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) senin temel sığınağın ve çatın. Hayat kaliteni ve iç huzurunu sarsacak yerlerden tasarruf yapılmaz; bu kalemi olduğu gibi koruyoruz.`,
    (ctx: DialogueContext) =>
      `İlk sırada ${ctx.itemName} var. Bu senin zorunlu temel giderin; bugünden yarına burayı kısmak gerçekçi bir hedef olmaz. Bu tutarı aynen masada tutuyoruz.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} masandaki en sağlam sabit harcama. Burada gereksiz bir pazarlık yapıp odağımızı dağıtmayacağız; bunu 12.000 ₺ olarak onaylayıp asıl sızıntılara odaklanalım.`,
    (ctx: DialogueContext) =>
      `Finansal disiplin demek kendini her şeyden mahrum etmek değildir. ${ctx.itemName} hayatının temel direğidir; bu kalemi dokunulmaz kabul edip koruyoruz.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} için ayırdığın ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ tutarını aynen kilitliyorum. Enerjimizi asıl fark yaratabileceğimiz değişken harcamalara saklayalım.`,
    (ctx: DialogueContext) =>
      `Temel barınma ve zorunlu yükümlülüklerde pazarlık yapılmaz. ${ctx.itemName} kalemi senin yaşam alanındır; bu rakamı aynen onaylayıp sonraki adıma geçiyorum.`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, bu kalemi doğrudan güvenli havuzumuza alıyoruz. Sabit giderlerin yerli yerinde durması, birazdan yapacağımız optimizasyonlar için bize sağlam bir zemin veriyor.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} kalemi bütçenin omurgasıdır. Bu tutara hiç dokunmuyoruz; sözleşmeli ve sabit giderleri koruyarak devam ediyoruz.`,
  ],

  // =========================================================================
  // GRUP 2: B KATEGORİSİ — 1. TUR ISRAR / MAKUL TEKLİF [12 Adet]
  // =========================================================================
  categoryB_round1: [
    (ctx: DialogueContext) =>
      `${ctx.itemName} harcaman ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ görünüyor. Temel beslenme veya konfordan kısmadan, sadece plansız veya hazır alımları gözden geçirsek burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekebilir miyiz?`,
    (ctx: DialogueContext) =>
      `Sıradaki kalemimiz ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺). Bu harcamada sepet kontrolü yaparak ve marka alternatiflerini değerlendirerek aylık ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ düzeyinde kalabilir miyiz ne dersin?`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} bütçede sessizce büyüyen bir kalem. İhtiyaçları ertelemeden, sadece kasada plansız sepete atılanları süzsek burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapabilir miyiz?`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} için ayrılan ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ üzerinde biraz esneklik var. Küçük bir planlamayla yaşam standardını hiç bozmadan bu kalemi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapmaya ne dersin?`,
    (ctx: DialogueContext) =>
      `Bu harcama hayatının vazgeçilmezi ama içinde kaçaklar barındırmaya çok müsait. ${ctx.itemName} tutarını ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine indirmeyi teklif ediyorum; masada mısın?`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} tarafında ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ harcıyoruz. Akıllı tercihlerle sadece birkaç yüz lirayı masada tutmak bile yıl sonunda ciddi bir sermaye tohumu bırakır. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ diyorum, ne düşünüyorsun?`,
    (ctx: DialogueContext) =>
      `Burada aç kalmak ya da kendini zorlamak yok ortak. Sadece ${ctx.itemName} fişindeki görünmeyen detayları gözden geçirip bütçeyi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine dengeleyebilir miyiz?`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} harcamanı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ bandına çekmek bütçene her ay taze bir nefes aldırır. Sen bu kalemi kaça çekebilirsin?`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} kaleminde ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ masada duruyor. Gereksiz israfı önleyip bu kalemi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesinde tutmak senin için makul mü?`,
    (ctx: DialogueContext) =>
      `Faturalar ve market gibi yarı-değişken harcamalar disiplinli yönetildiğinde en çok sermaye üreten yerdir. ${ctx.itemName} kalemini ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekmeyi öneriyorum.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} harcamasını ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ bandına oturtursak, her ay masada kalan para doğrudan hisse senedi tohumuna dönüşecek. Bir karşı teklifin var mı?`,
    (ctx: DialogueContext) =>
      `Bu kalemde küçük bir optimizasyon bile büyük bir fark yaratır. ${ctx.itemName} için ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ gibi dengeli bir rakam öneriyorum, sence gerçekçi mi?`,
  ],

  // =========================================================================
  // GRUP 3: B KATEGORİSİ — 2. TUR UZLAŞMA & KİLİT [8 Adet]
  // =========================================================================
  categoryB_round2_settle: [
    (ctx: DialogueContext) =>
      `Teklifini kabul ediyorum; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ çok dengeli ve sürdürülebilir bir rakam. Bu kalemi kilitledim, cebinde kalan tasarrufu havuzumuza ekledik.`,
    (ctx: DialogueContext) =>
      `Anlaştık ${ctx.userName}. ${ctx.itemName} için belirlediğin ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ hedefini masaya yazıyorum. Kendini zorlamadan akıllıca bir tasarruf ürettin.`,
    (ctx: DialogueContext) =>
      `Bu gayet makul bir orta yol. ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak güncelledim; her ay masada kalan bu taze nakit bizim şirket tohumumuz olacak.`,
    (ctx: DialogueContext) =>
      `El sıkıştık. ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ gayet dürüst ve gerçekçi bir karar. Bu adımla bütçendeki sızıntılardan birini başarıyla durdurmuş olduk.`,
    (ctx: DialogueContext) =>
      `Sözünü aldım; ${ctx.itemName} artık ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitlendi. Hayat kaliteni bozmadan tasarruf etmenin tam olarak anlamı buydu.`,
    (ctx: DialogueContext) =>
      `Harika bir uzlaşma. ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ tutarını kaydediyorum. Şimdi enerjimizi bir sonraki harcama kalemine taşıyalım.`,
    (ctx: DialogueContext) =>
      `Gayet rasyonel bir tercih. ${ctx.itemName} kalemi için ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ tutarını onaylıyorum; masada kalan her kuruş geleceğin için çalışacak.`,
    (ctx: DialogueContext) =>
      `Tamamdır, anlaştık. Bu kalemde yarattığın tasarruf yıllık bilançonda kendini hissettirecektir. Sonraki adıma geçiyorum.`,
  ],

  // =========================================================================
  // GRUP 4: C KATEGORİSİ — 1. TUR SERT ISRAR [12 Adet]
  // =========================================================================
  categoryC_round1: [
    (ctx: DialogueContext) =>
      `${ctx.itemName} için ayda ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ harcıyorsun. Burası tamamen keyfi ve esnek bir alan; teknedeki asıl görünmeyen sızıntı tam olarak burası. Bu kalemi yarı yarıya, yani ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekelim diyorum, ne dersin?`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} harcaman ${ctx.currentAmount.toLocaleString('tr-TR')} ₺. Bu harcama sana anlık bir keyif veriyor olabilir ama uzun vadede geleceğini eritiyor. Burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine indirmek için masaya oturuyoruz.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} kalemi bütçende en kolay budanabilecek yer. Dışarıdaki alışkanlıkları sadece biraz disipline ederek bu rakamı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapabiliriz. İlk teklifin nedir?`,
    (ctx: DialogueContext) =>
      `Burada dürüst olalım: ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) olmasa hayatın durur mu? Elbette hayır. Burayı ciddi şekilde optimize edip ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapmayı öneriyorum.`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, bu kaleme ayırdığın para doğrudan başkalarının kâr marjını besliyor. Kendi şirket ortaklığın için burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekelim. Var mısın?`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} harcamanda ayda ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ masadan uçup gidiyor. Bunu yarıya indirmek hayat standardını zedelemez ama cüzdanına dev bir nefes aldırır. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ teklif ediyorum.`,
    (ctx: DialogueContext) =>
      `Keyfi ve esnek tüketimler finansal bağımsızlığın en büyük düşmanıdır. ${ctx.itemName} kalemini ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekip kalanını şirket ortaklığı tohumu yapalım.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} tarafında ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ çok cömert bir bütçe. Burayı biraz dizginleyip ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapmaya ne dersin? Mazeret istemiyorum.`,
    (ctx: DialogueContext) =>
      `Bu harcama bütçendeki en büyük kaçaklardan biri. ${ctx.itemName} tutarını ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine indirmeden gerçek bir tasarruf yapmış sayılmayız.`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, bu tüketim alışkanlığını kontrol altına almazsan kazandığın para asla sana kalmaz. ${ctx.itemName} için ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ sınırını koyalım.`,
    (ctx: DialogueContext) =>
      `${ctx.itemName} kalemindeki ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ harcamayı doğrudan ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekmeyi öneriyorum; geleceğin için bu fedakarlığı yapmaya hazır mısın?`,
    (ctx: DialogueContext) =>
      `Bu harcama bir zorunluluk değil, sadece bir tercih. Tercihini gelecekteki özgürlüğünden yana kullanıp bu kalemi ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapalım.`,
  ],

  // =========================================================================
  // GRUP 5: C KATEGORİSİ — 2. TUR İKİNCİ ISRAR / DİRENÇ KIRMA [10 Adet]
  // =========================================================================
  categoryC_round2: [
    (ctx: DialogueContext) =>
      `${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ mi? ${ctx.userName}, bu kadar küçük bir adımla masadan kalkamayız. Buradan masada tutacağın her kuruş yarın Borsa İstanbul'da temettü dağıtan dev şirketlerin payına dönüşecek. Gel biraz daha cesur olalım, ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine inelim.`,
    (ctx: DialogueContext) =>
      `Kendimizi kandırmayalım ortak. Bu kalemde biraz daha dişini sıkabilirsin. Haftada bir kahve ya da dışarıda bir siparişi eksiltmek seni fakirleştirmez ama yatırımlarını devleştirir. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ diyorum, son teklifin ne?`,
    (ctx: DialogueContext) =>
      `Bu rakam bence hala fazla gevşek duruyor. Kendi geleceğin için biraz daha fedakarlık yapmaya değmez mi? ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekelim, masada güçlü bir tohum bırakalım.`,
    (ctx: DialogueContext) =>
      `${ctx.userName}, tüketimi ertelemek cimrilik değil, zamanını satın almaktır. Bu harcamayı biraz daha budayıp ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapalım; son sözünü söyle.`,
    (ctx: DialogueContext) =>
      `Teklifin başlangıç için iyi ama yeterli değil. Şirket ortaklığına giden yolda bu keyfi harcamadan biraz daha feragat edebilirsin. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine inelim, ne dersin?`,
    (ctx: DialogueContext) =>
      `Bu kalemde hala görünmeyen kaçaklar var. Birkaç küçük dürtüyü frenleyerek burayı ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine oturtabiliriz. Masaya dürüst bir rakam bırakalım.`,
    (ctx: DialogueContext) =>
      `Geleceğini başkalarının tüketim ürünlerine teslim etme. Buradan kurtaracağın her lira senin yerine çalışacak bir personele dönüşecek. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ için bir kez daha düşün.`,
    (ctx: DialogueContext) =>
      `${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ teklifin fena değil ama potansiyelinin altında. Biraz daha zorla kendini; ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ yapalım ve bu kalemi zaferle kapatalım.`,
    (ctx: DialogueContext) =>
      `Bu harcama kalemi seni köleleştirmesin, sen onu yönet. ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesine çekmeyi kabul edersen harika bir sermaye kurtaracağız.`,
    (ctx: DialogueContext) =>
      `Son bir hamle daha yapabilirsin ${ctx.userName}. Masada bıraktığın para senin özgürlüğündür; ${ctx.suggestedCut?.toLocaleString('tr-TR')} ₺ seviyesinde buluşalım.`,
  ],

  // =========================================================================
  // GRUP 6: C KATEGORİSİ — 3. TUR NİHAİ EL SIKIŞMA [8 Adet]
  // =========================================================================
  categoryC_round3_settle: [
    (ctx: DialogueContext) =>
      `Harika bir pazarlık oldu! ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitliyorum. Gösterdiğin bu irade, sıradan bir tüketici ile bilinçli bir şirket ortağı arasındaki farkı kanıtladı.`,
    (ctx: DialogueContext) =>
      `Anlaştık ${ctx.userName}. ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak masaya çiviliyorum. Burada kurtardığın para bilançona ilaç gibi gelecek.`,
    (ctx: DialogueContext) =>
      `Sözünü aldım; bu kalemi ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak onaylıyorum. Kolay olmadı ama tam bir finansal ortak gibi masada hakkını verdin.`,
    (ctx: DialogueContext) =>
      `Tebrikler. ${ctx.itemName} için belirlediğin ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ gayet kararlı bir rakam. Cebinde kalan ekstra nakdi hemen yatırım tohumu sayacımıza ekliyorum.`,
    (ctx: DialogueContext) =>
      `El sıkıştık. Tüketim dürtünü dizginleyip masada sermaye bırakmayı başardın; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kaydettim.`,
    (ctx: DialogueContext) =>
      `Bu çaba takdire şayan. ${ctx.itemName} artık ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitli. Masada kalan her liranın kıymetini ilerleyen haftalarda çok daha net göreceksin.`,
    (ctx: DialogueContext) =>
      `Harika bir orta yol bulduk. ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak bu kalemi tamamlıyorum; tasarruf disiplininin ilk somut zaferini kazandın.`,
    (ctx: DialogueContext) =>
      `Son kararımız bu olsun; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ tutarını sisteme kilitliyorum. Bir sonraki adıma gururla geçebiliriz.`,
  ],

  // =========================================================================
  // GRUP 7: ÖZEL DURUMLAR (SIFIR KISMA VEYA AŞIRI KISMA UYARILARI) [6 Adet]
  // =========================================================================
  special_responses: {
    zero_cut: [
      (ctx: DialogueContext) =>
        `Hiç kısmamak bir tercih olabilir ama unutma; teknedeki deliğe dokunmazsan su almaya devam edersin. Gel küçük de olsa masaya bir fedakarlık koyalım.`,
      (ctx: DialogueContext) =>
        `Sıfır tasarruf mu? ${ctx.userName}, bu masaya kendi alışkanlıklarımızla yüzleşmek için oturduk. En azından sembolik bir optimizasyonla başlayalım.`,
    ],
    extreme_cut: [
      (ctx: DialogueContext) =>
        `Bu kalemi tamamen sıfırlamak ya da aşırı kısmak hayatını yaşanmaz hale getirebilir. Amacımız kendini cezalandırmak değil, sürdürülebilir bir denge kurmak. Biraz daha gerçekçi bir rakam belirleyelim.`,
      (ctx: DialogueContext) =>
        `Aşırı kısıntılar genellikle 2 hafta sonra patlar ve daha büyük harcamalara yol açar. Sağduyulu olalım; sıfırlamak yerine makul bir tasarruf seviyesinde kalalım.`,
    ],
    same_offer: [
      (ctx: DialogueContext) =>
        `Aynı rakamda ısrar ediyorsun görüyorum. Madem kararın bu kadar kesin, sözünü alarak bu tutarı kilitliyorum ama diğer kalemlerde daha esnek olmanı bekliyorum.`,
      (ctx: DialogueContext) =>
        `Peki, bu kalemde senin iradene saygı duyuyorum. Bu rakamı masaya yazıyorum, diğer sızıntılarda daha kararlı olacağız.`,
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
}): string {
  const { category, round, isSettled, context } = params;

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
