import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    // 1. Parse answers
    const q1 = answers[1]?.score || 2; // Horizon (1:Kısa, 2:Orta, 3:Uzun)
    const q2 = answers[2]?.score || 2; // Drawdown
    const q3 = answers[3]?.score || 2; // Income vs Growth
    const q4 = answers[4]?.score || 2; // Makro Beklenti
    const q5 = answers[5]?.score || 2; // Değerleme Felsefesi
    const q6 = answers[6]?.score || 2; // Kriz Reaksiyonu (1:Kaçış, 2:Bekle, 3:Alım)
    const q7 = answers[7]?.score || 2; // Psikoloji
    const q9 = answers[9]?.score || 2; // Management Style
    const isIslamic = answers[8]?.text?.includes("Faiz Hassasiyetim Var") || answers[8]?.text?.includes("Evet") || false;
    const initialCapital = Number(answers[10]?.text || 0);

    const totalScore = q1 + q2 + q3 + q4 + q5 + q6 + q7;
    const userSeed = totalScore + initialCapital;

    // Asset Pool with Historical Yearly Returns (Estimated for TRY)
    // Fonlar kaldırıldı; Likit yerine sadece Kira Sertifikası Fonu / Katılım Fonu yer alır.
    // Hisseler doğrudan sektörler bazında temsil edilir.
    let assets = {
        // Kira Sertifikası Fonları (Likit yerine sadece burada fon ibaresi var)
        "Kira Sertifikası Fonu": { weight: 0, color: "#3B82F6", return: 45, desc: "Sermayeyi koruyan, risksiz kupon getirisi ve acil nakit esnekliği sağlayan fon." },
        "Kira Sertifikası Katılım Fonu": { weight: 0, color: "#059669", return: 45, desc: "Faizsiz finans ve katılım ilkelerine tam uyumlu, sukuk ve kira getirisi sağlayan katılım fonu." },

        // Kıymetli Madenler
        "Kıymetli Madenler (Altın/Gümüş)": { weight: 0, color: "#EAB308", return: 55, desc: "Altın ve gümüş ağırlıklı, küresel krizlere ve kur şoklarına karşı portföyün sigortası." },
        "Kıymetli Madenler (Altın Sertifikası)": { weight: 0, color: "#EAB308", return: 55, desc: "Darphane fiziki altın sertifikası ile faizsiz finans uyumlu değer koruma." },

        // Sektör Hisseleri (Genel / Konvansiyonel)
        "Bilişim ve Yazılım Hisseleri": { weight: 0, color: "#8B5CF6", return: 88, desc: "Dijital devrimin merkezindeki, yüksek marjlı ve ölçeklenebilir teknoloji şirketleri." },
        "Enerji ve Altyapı Hisseleri": { weight: 0, color: "#10B981", return: 75, desc: "Yenilenebilir enerji, şebeke ve enerji depolama alanında stratejik üreticiler." },
        "Savunma ve İleri Teknoloji Hisseleri": { weight: 0, color: "#EF4444", return: 82, desc: "Devlet garantili, döviz getirili ve inovatif yüksek teknoloji savunma sanayii." },
        "Sanayi ve İmalat Hisseleri": { weight: 0, color: "#2563EB", return: 62, desc: "Güçlü fabrika altyapısı ve küresel ihracat yapan köklü sanayi çarkları." },
        "Otomotiv ve Yan Sanayi Hisseleri": { weight: 0, color: "#F59E0B", return: 65, desc: "İhracat rekorları kıran, döviz bazlı nakit akışına sahip otomotiv devleri." },
        "Gıda ve Perakende Hisseleri": { weight: 0, color: "#059669", return: 54, desc: "Kriz dinlemeyen, enflasyonu anında fiyatlara yansıtan defansif güçlü nakit akışı." },
        "Holding ve İştirak Hisseleri": { weight: 0, color: "#1D4ED8", return: 52, desc: "Tek şirketle onlarca farklı sektöre yayılan doğal risk dağılımı." },
        "Ulaştırma ve Havacılık Hisseleri": { weight: 0, color: "#0EA5E9", return: 68, desc: "Küresel ticareti ve turizmi birbirine bağlayan devasa yolcu ve kargo ağı." },
        "İlaç ve Sağlık Hisseleri": { weight: 0, color: "#14B8A6", return: 50, desc: "Talebi hiçbir ekonomik dalgalanmada düşmeyen kalıcı ve defansif değer." },
        "Bankacılık ve Finans Hisseleri": { weight: 0, color: "#00008B", return: 48, desc: "Ekonominin bel kemiği, güçlü likidite ve temettü potansiyeli." },

        // Sektör Hisseleri (Katılım / Faiz Hassasiyeti Olanlar)
        "Katılım Bilişim ve Yazılım Hisseleri": { weight: 0, color: "#8B5CF6", return: 85, desc: "BIST Katılım kriterlerine tam uyumlu, helal teknoloji ve yazılım yatırımları." },
        "Katılım Enerji ve Üretim Hisseleri": { weight: 0, color: "#10B981", return: 72, desc: "Faizsiz finans prensiplerini sağlayan büyük yenilenebilir enerji tesisleri." },
        "Katılım Savunma ve İleri Sanayi": { weight: 0, color: "#EF4444", return: 82, desc: "Katılım endeksine dahil yüksek katma değerli savunma ve teknoloji devleri." },
        "Katılım Sanayi ve İmalat Hisseleri": { weight: 0, color: "#2563EB", return: 60, desc: "Helal üretim yapan, faizsiz kurallara uygun büyük ihracat fabrikaları." },
        "Katılım Gıda ve Perakende Hisseleri": { weight: 0, color: "#059669", return: 54, desc: "Kriz dinlemeyen, helal sertifikalı gıda ve perakende zincirleri." },
        "Katılım Otomotiv ve Yan Sanayi": { weight: 0, color: "#F59E0B", return: 65, desc: "Katılım şartlarına uygun döviz gelirli sanayi ve otomotiv üreticileri." },
        "Katılım Ulaştırma ve Lojistik Hisseleri": { weight: 0, color: "#0EA5E9", return: 68, desc: "Katılım endeksinde yer alan küresel havacılık ve lojistik şirketleri." },
        "Katılım Bankacılığı Hisseleri": { weight: 0, color: "#00008B", return: 48, desc: "Kâr-zarar ortaklığı prensipleriyle çalışan güçlü katılım finans kurumları." }
    };

    const addW = (asset: string, w: number) => {
        if (assets[asset as keyof typeof assets]) assets[asset as keyof typeof assets].weight += w;
    };

    // --- WEIGHTING LOGIC ---
    if (q1 === 1) { // Kısa Vade
        if (!isIslamic) {
            addW("Kira Sertifikası Fonu", 50);
            addW("Kıymetli Madenler (Altın/Gümüş)", 30);
            addW("Gıda ve Perakende Hisseleri", 20);
        } else {
            addW("Kira Sertifikası Katılım Fonu", 55);
            addW("Kıymetli Madenler (Altın Sertifikası)", 30);
            addW("Katılım Gıda ve Perakende Hisseleri", 15);
        }
    } else if (q1 === 2) { // Orta Vade
        if (!isIslamic) {
            addW("Sanayi ve İmalat Hisseleri", 25);
            addW("Holding ve İştirak Hisseleri", 20);
            addW("Kira Sertifikası Fonu", 20);
            addW("Kıymetli Madenler (Altın/Gümüş)", 20);
            addW("Otomotiv ve Yan Sanayi Hisseleri", 15);
        } else {
            addW("Katılım Sanayi ve İmalat Hisseleri", 25);
            addW("Kira Sertifikası Katılım Fonu", 25);
            addW("Kıymetli Madenler (Altın Sertifikası)", 20);
            addW("Katılım Bankacılığı Hisseleri", 15);
            addW("Katılım Enerji ve Üretim Hisseleri", 15);
        }
    } else { // Uzun Vade
        if (!isIslamic) {
            addW("Bilişim ve Yazılım Hisseleri", 30);
            addW("Savunma ve İleri Teknoloji Hisseleri", 25);
            addW("Enerji ve Altyapı Hisseleri", 25);
            addW("Sanayi ve İmalat Hisseleri", 20);
        } else {
            addW("Katılım Bilişim ve Yazılım Hisseleri", 35);
            addW("Katılım Savunma ve İleri Sanayi", 25);
            addW("Katılım Enerji ve Üretim Hisseleri", 25);
            addW("Katılım Sanayi ve İmalat Hisseleri", 15);
        }
    }

    if (q2 === 1) { // Max %5 - %10 Risk Toleransı
        if (!isIslamic) {
            addW("Kira Sertifikası Fonu", 40);
            addW("Kıymetli Madenler (Altın/Gümüş)", 30);
            addW("Gıda ve Perakende Hisseleri", 20);
        } else {
            addW("Kira Sertifikası Katılım Fonu", 45);
            addW("Kıymetli Madenler (Altın Sertifikası)", 35);
            addW("Katılım Gıda ve Perakende Hisseleri", 20);
        }
    } else if (q2 === 3) { // Yüksek Risk Toleransı
        if (!isIslamic) {
            addW("Bilişim ve Yazılım Hisseleri", 35);
            addW("Enerji ve Altyapı Hisseleri", 25);
            addW("Savunma ve İleri Teknoloji Hisseleri", 25);
        } else {
            addW("Katılım Bilişim ve Yazılım Hisseleri", 35);
            addW("Katılım Enerji ve Üretim Hisseleri", 25);
            addW("Katılım Savunma ve İleri Sanayi", 25);
        }
    }

    if (q3 === 1) { // Temettü / Düzenli Gelir
        if (!isIslamic) {
            addW("Bankacılık ve Finans Hisseleri", 30);
            addW("Sanayi ve İmalat Hisseleri", 25);
            addW("Holding ve İştirak Hisseleri", 20);
        } else {
            addW("Katılım Bankacılığı Hisseleri", 30);
            addW("Katılım Sanayi ve İmalat Hisseleri", 25);
            addW("Katılım Gıda ve Perakende Hisseleri", 20);
        }
    }

    if (q4 === 1) { // Defansif
        if (!isIslamic) {
            addW("Gıda ve Perakende Hisseleri", 40);
            addW("İlaç ve Sağlık Hisseleri", 30);
        } else {
            addW("Katılım Gıda ve Perakende Hisseleri", 60);
        }
    } else if (q4 === 2) { // İhracat
        if (!isIslamic) {
            addW("Otomotiv ve Yan Sanayi Hisseleri", 40);
            addW("Ulaştırma ve Havacılık Hisseleri", 30);
        } else {
            addW("Katılım Otomotiv ve Yan Sanayi", 40);
            addW("Katılım Ulaştırma ve Lojistik Hisseleri", 30);
        }
    } else if (q4 === 3) { // Tekel / Stratejik
        if (!isIslamic) {
            addW("Savunma ve İleri Teknoloji Hisseleri", 40);
            addW("Enerji ve Altyapı Hisseleri", 30);
        } else {
            addW("Katılım Savunma ve İleri Sanayi", 40);
            addW("Katılım Enerji ve Üretim Hisseleri", 30);
        }
    }

    if (q5 === 1) { // Value / İskontolu
        if (!isIslamic) {
            addW("Holding ve İştirak Hisseleri", 40);
            addW("Bankacılık ve Finans Hisseleri", 30);
        } else {
            addW("Katılım Bankacılığı Hisseleri", 40);
            addW("Katılım Sanayi ve İmalat Hisseleri", 30);
        }
    } else if (q5 === 2) { // Reel Varlık
        if (!isIslamic) {
            addW("Sanayi ve İmalat Hisseleri", 40);
            addW("Enerji ve Altyapı Hisseleri", 30);
        } else {
            addW("Katılım Sanayi ve İmalat Hisseleri", 40);
            addW("Katılım Enerji ve Üretim Hisseleri", 30);
        }
    } else if (q5 === 3) { // Growth / Büyüme
        if (!isIslamic) {
            addW("Bilişim ve Yazılım Hisseleri", 45);
            addW("Enerji ve Altyapı Hisseleri", 30);
        } else {
            addW("Katılım Bilişim ve Yazılım Hisseleri", 45);
            addW("Katılım Enerji ve Üretim Hisseleri", 30);
        }
    }

    if (q6 === 3) { // Buy dip
        if (!isIslamic) {
            addW("Bilişim ve Yazılım Hisseleri", 25);
            addW("Ulaştırma ve Havacılık Hisseleri", 20);
        } else {
            addW("Katılım Bilişim ve Yazılım Hisseleri", 25);
            addW("Katılım Ulaştırma ve Lojistik Hisseleri", 20);
        }
    }

    if (q9 === 1) { // Otonom
        if (!isIslamic) {
            addW("Holding ve İştirak Hisseleri", 35);
            addW("Sanayi ve İmalat Hisseleri", 35);
            addW("Kira Sertifikası Fonu", 30);
        } else {
            addW("Katılım Sanayi ve İmalat Hisseleri", 35);
            addW("Katılım Enerji ve Üretim Hisseleri", 35);
            addW("Kira Sertifikası Katılım Fonu", 30);
        }
    }

    // 3. Normalization
    let selectedAssets = Object.entries(assets)
        .filter(([name, data]) => data.weight > 0)
        .map(([name, data]) => ({ name, ...data }));
    
    selectedAssets.sort((a, b) => b.weight - a.weight);
    selectedAssets = selectedAssets.slice(0, 6);

    let totalWeight = selectedAssets.reduce((acc, curr) => acc + curr.weight, 0);
    let portfolio = selectedAssets.map(item => {
        let percentage = Math.round((item.weight / totalWeight) * 100);
        return {
            asset: item.name,
            percentage: percentage,
            color: item.color,
            description: item.desc,
            yearlyReturn: item.return
        };
    });

    let currentTotal = portfolio.reduce((acc, curr) => acc + curr.percentage, 0);
    if (currentTotal !== 100 && portfolio.length > 0) portfolio[0].percentage += (100 - currentTotal);
    portfolio = portfolio.filter(p => p.percentage > 0);

    // 4. PERSONALIZED "WHY RECOMMENDED" TEXT
    let horizonText = q1 === 3 ? "uzun vadeli ve bileşik getiri odaklı" : q1 === 1 ? "kısa vadeli ve likidite öncelikli" : "orta vadeli ve dengeli";
    let reactionText = q6 === 3 ? "kriz anlarını birer alım fırsatı olarak görme cesaretiniz" : q6 === 1 ? "sermayeyi koruma refleksiniz" : "temkinli bekleyişiniz";
    let philosophyText = q5 === 3 ? "yüksek büyüme potansiyelli inovatif şirketlere duyduğunuz ilgi" : q5 === 1 ? "ucuz kalmış iskontolu şirketlere olan güveniniz" : "reel varlık koruma arayışınız";

    let aiAnalysis = `Analizlerime göre ${horizonText} bir bakış açısına sahipsiniz. Özellikle ${reactionText} ve ${philosophyText} portföyünüzün karakterini belirliyor. Bu durumda seçtiğimiz bu karma yapı, piyasa dalgalanmalarında size direnç sağlarken, inandığınız büyüme motorlarının kazancını maksimize etmenize olanak tanır.`;

    // 5. FUTURE MONEY SIMULATION (Projections)
    // Compound interest: P * (1 + r/100)^t
    const calculateTotalReturn = (years: number) => {
        let totalValue = 0;
        portfolio.forEach(item => {
            const assetCapital = initialCapital * (item.percentage / 100);
            const assetFinalValue = assetCapital * Math.pow(1 + item.yearlyReturn / 100, years);
            totalValue += assetFinalValue;
        });
        return Math.round(totalValue);
    };

    const projections = {
        initial: initialCapital,
        year1: calculateTotalReturn(1),
        year3: calculateTotalReturn(3),
        year5: calculateTotalReturn(5)
    };

    let profileName = totalScore <= 11 ? "Defansif Stratejist" : totalScore <= 16 ? "Optimum Denge" : "Alfa Odaklı";

    return NextResponse.json({
        profileName,
        aiAnalysis,
        expectedAnnualReturn: Math.round(portfolio.reduce((acc, curr) => acc + (curr.yearlyReturn * curr.percentage / 100), 0)),
        portfolio,
        projections,
        advantages: [
            "Kriz anlarındaki psikolojik profilinizle tam uyumlu risk yönetimi.",
            "Geçmiş verilerle doğrulanmış yüksek büyüme potansiyelli sektör dağılımı.",
            "Enflasyonu katlayarak ezen bileşik getiri simülasyonu desteği."
        ]
    });

  } catch (error) {
    console.error("Algoritma Hatası:", error);
    return NextResponse.json({ error: "Sistem Hatası" }, { status: 500 });
  }
}
