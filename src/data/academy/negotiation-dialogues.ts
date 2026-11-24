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

// 1 ile 3 Cümlelik Öz, Net ve Yatırım Odaklı Diyalog Havuzu
export const NEGOTIATION_DIALOGUES = {
  // =========================================================================
  // GRUP 1: A KATEGORİSİ — SABİT MASRAFLAR (0 PAZARLIK, DOĞRUDAN ONAY) [1-3 Cümle]
  // =========================================================================
  categoryA_approval: [
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) zorunlu sabit yaşam giderin olduğu için bu kalemde kesinti yapmıyoruz. Temel güvenliğini koruyarak bu tutarı aynen onaylıyorum.`,

    (ctx: DialogueContext) =>
      `Bütçendeki ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) harcamasını doğrudan güvenli listemize alıyoruz. Yaşam kaliteni korumak adına bu kalemi olduğu gibi muhafaza edelim.`,

    (ctx: DialogueContext) =>
      `${ctx.itemName} için ayırdığın ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ sözleşmeli sabit harcamandır; bu rakama dokunmuyoruz. Bütçe dengeni sarsmamak için bu tutarı kilitleyip sonraki adıma geçiyoruz.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} harcamasını ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ olarak güvenli havuza alıyoruz. Sabit giderlerini koruyarak enerjimizi asıl tasarruf sağlayacağımız değişken kalemlere saklıyoruz.`,

    (ctx: DialogueContext) =>
      `${ctx.itemName} bütçenin temel direğidir; burada gereksiz bir kısıntıya gitmiyoruz. ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ tutarını güvenle onaylayarak yolumuza devam ediyoruz.`,
  ],

  // =========================================================================
  // GRUP 2: B KATEGORİSİ — 1. TUR TEKLİF / MAKUL TASARRUF [1-3 Cümle]
  // =========================================================================
  categoryB_round1: [
    (ctx: DialogueContext) =>
      `${ctx.itemName} için masada ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ duruyor ${ctx.userName}. Temel konforundan ödün vermeden, bu harcamayı kaça düşürebiliriz yaz bakalım.`,

    (ctx: DialogueContext) =>
      `Geçen hafta ${ctx.itemName} harcamana ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ yazmıştın. Kalitenden taviz vermeden ufak bir tasarruf yapabiliriz; sence bu tutarı kaça çekelim?`,

    (ctx: DialogueContext) =>
      `${ctx.itemName} tarafındaki ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ bütçende düzenli tasarruf üretebileceğimiz bir alan. Ne dersin ortak, bu kalemi kaça düşürebiliriz masaya gerçekçi bir rakam yaz.`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} kaleminde yapacağımız akıllı bir optimizasyon bütçene her ay taze nakit kazandırır. Bu harcamada aklındaki yeni tutar nedir, teklifini bekliyorum.`,

    (ctx: DialogueContext) =>
      `Masadaki ${ctx.itemName} tutarımız ${ctx.currentAmount.toLocaleString('tr-TR')} ₺. İhtiyaçlarını kısmadan tüketimini daha dengeli yönetmek için bu kalemi kaça indirelim?`,
  ],

  // =========================================================================
  // GRUP 3: B KATEGORİSİ — 2. TUR UZLAŞMA & KİLİT [1-3 Cümle]
  // =========================================================================
  categoryB_round2_settle: [
    (ctx: DialogueContext) =>
      `Harika bir karar ${ctx.userName}; ${ctx.itemName} harcamanı ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak onaylıyorum. Hem bütçeni korudun hem de taze bir tasarruf alanı açtın.`,

    (ctx: DialogueContext) =>
      `Teklifini kabul ettim ortak, ${ctx.itemName} artık ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitlendi. Yaşam standardını bozmadan çok dengeli bir tasarruf sağladın.`,

    (ctx: DialogueContext) =>
      `Son derece ölçülü bir uzlaşma oldu; ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak güncelledim. Finansal kontrolü eline aldığın için tebrikler, sıradaki kaleme geçebiliriz.`,

    (ctx: DialogueContext) =>
      `Sözünü aldım ${ctx.userName}; ${ctx.itemName} bütçene ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak işlendi. Bu kalemde yarattığın tasarruf yıl genelinde sana güçlü bir nakit kazandıracak.`,

    (ctx: DialogueContext) =>
      `Tebrikler; ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ kararın masanın hakkını verdi. Bu tutarı kaydediyorum, vakit kaybetmeden sonraki harcamaya geçelim.`,
  ],

  // =========================================================================
  // GRUP 4: C KATEGORİSİ — 1. TUR SERT TEKLİF (ASIL TASARRUF ALANI) [1-3 Cümle]
  // =========================================================================
  categoryC_round1: [
    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) harcaması bütçende asıl yatırım sermayesini üreteceğimiz yerdir. Gelecek haftalardaki borsa yatırımların için bu kalemi cesurca kaça düşürebilirsin yaz bakalım.`,

    (ctx: DialogueContext) =>
      `Masadaki ${ctx.itemName} harcaman ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ olarak duruyor ortak. Buradan kurtaracağımız her kuruş hisse senedi alımlarında öz sermayen olacak; sence bu kalemi kaça çekebiliriz?`,

    (ctx: DialogueContext) =>
      `Asıl tasarrufu üreteceğimiz en kritik başlık ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺). Tüketimi yatırıma dönüştürmek için masaya kararlı bir rakam koy; bu harcamayı kaça indirelim?`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, ${ctx.itemName} için ayırdığın ${ctx.currentAmount.toLocaleString('tr-TR')} ₺ gelecekteki hisse senedi portföyünün kaynağı olacak. Tüketim alışkanlıklarını disipline etmek adına ilk teklifini bekliyorum; bu tutarı kaça çekelim?`,

    (ctx: DialogueContext) =>
      `Geçen hafta masaya koyduğun ${ctx.itemName} (${ctx.currentAmount.toLocaleString('tr-TR')} ₺) kaleminde güçlü bir sermaye potansiyeli var. Gelecekteki finansal gücün için bu harcamayı kaça düşürebilirsin yaz bakalım ortak.`,
  ],

  // =========================================================================
  // GRUP 5: C KATEGORİSİ — 2. TUR İKİNCİ ISRAR [1-3 Cümle]
  // =========================================================================
  categoryC_round2: [
    (ctx: DialogueContext) =>
      `${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ iyi bir başlangıç ama asıl sermaye üreteceğimiz bu kalemde biraz daha cesur olabilirsin ${ctx.userName}. Gelecek haftalardaki hisse senedi alımların için masaya son ve kararlı rakamını yaz bakalım.`,

    (ctx: DialogueContext) =>
      `Teklifini aldım ortak, fakat bu kalemin tasarruf potansiyeli biraz daha yüksek. Gelecekteki portföyünü büyütmek adına bu harcamayı biraz daha aşağı çekebilir misin; son sözün nedir?`,

    (ctx: DialogueContext) =>
      `${ctx.userName}, anlık tüketimi ertelemek hisse senedi yatırımlarında sana dev bir güç katacak. Gel bu kalemde biraz daha gayret gösterelim; son olarak kaça kadar inebilirsin?`,

    (ctx: DialogueContext) =>
      `Masadaki ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ teklifin fena değil ama asıl tasarruf hedefimizin biraz gerisinde kaldı. Yatırım bütçeni güçlendirmek için bu harcamada son bir indirim daha yapalım; ne dersin?`,

    (ctx: DialogueContext) =>
      `Gelecek haftalarda hisse senedi alırken doğrudan buradan kurtardığın parayı kullanacaksın ${ctx.userName}. Bütçenin geleceğini düşünerek masaya son ve kesin teklifini bırak.`,
  ],

  // =========================================================================
  // GRUP 6: C KATEGORİSİ — 3. TUR NİHAİ UZLAŞMA & KİLİT [1-3 Cümle]
  // =========================================================================
  categoryC_round3_settle: [
    (ctx: DialogueContext) =>
      `Harika bir irade gösterdin ${ctx.userName}; ${ctx.itemName} kalemini ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak kilitliyorum. Tüketimden kurtardığın bu para gelecek haftalarda hisse senedi yatırımlarının ilk sermayesi olacak.`,

    (ctx: DialogueContext) =>
      `Anlaştık ortak; ${ctx.itemName} için belirlediğin ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ hedefini sisteme işledim. Asıl tasarruf alanında gösterdiğin bu disiplin bilançona seviye atlatacak.`,

    (ctx: DialogueContext) =>
      `Sözünü aldım ${ctx.userName}; ${ctx.itemName} artık ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak tescillendi. Paranın kontrolünü eline alıp güçlü bir yatırım sermayesi açığa çıkardın.`,

    (ctx: DialogueContext) =>
      `Tebrikler ortak, ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ kararın tam bir bilinçli yatırımcı duruşu oldu. Bu kalemi zaferle kapatıyorum; şimdi genel sonuçlarımıza geçebiliriz.`,

    (ctx: DialogueContext) =>
      `El sıkıştık; ${ctx.itemName} harcamanı ${ctx.offeredAmount?.toLocaleString('tr-TR')} ₺ olarak sisteme kaydettim. Kararlı duruşun için teşekkürler, tasarruf planımızın özetine ilerleyebiliriz.`,
  ],

  // =========================================================================
  // GRUP 7: ÖZEL DURUMLAR (SIFIR KISMA, AŞIRI KISMA, ISRAR) [1-3 Cümle]
  // =========================================================================
  special_responses: {
    zero_cut: [
      (ctx: DialogueContext) =>
        `Masaya hiç dokunmadan kalkmak olmaz ortak; pazarlık adettendir. Gelecek haftalardaki yatırımlarımız için sembolik de olsa bir indirim yaz bakalım, bu harcamayı kaça düşürebiliriz?`,
    ],
    extreme_cut: [
      (ctx: DialogueContext) =>
        `Yatırım hevesini takdir ediyorum ortak ama bu kadar sert bir kesinti günlük hayatını zorlaştırabilir. Sürdürülebilir bir bütçe için biraz daha dengeli ve makul bir rakam yaz bakalım.`,
    ],
    same_offer: [
      (ctx: DialogueContext) =>
        `Görüyorum ki ilk teklifinde ısrarcısın ${ctx.userName}. Masada bırakacağın her lira hisse senedi yatırımlarında sermayen olacak; gel son bir ufak esneklik göster ve rakamı biraz daha aşağı çekelim.`,
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
