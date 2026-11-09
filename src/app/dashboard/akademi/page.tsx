"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  ArrowLeft, 
  Sparkles, 
  Brain, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  Send, 
  Layers, 
  BarChart3, 
  Cpu, 
  Flame,
  Award,
  Zap,
  TrendingUp,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function FinAiAkademiPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number>(0);

  const modules = [
    {
      id: 1,
      title: "Yapay Zekâ ile Modern Portföy Teorisi ve Dağılım",
      category: "Portföy Stratejisi",
      level: "Orta - İleri",
      duration: "6 Hafta / 18 Ders",
      progress: 85,
      description: "Markowitz portföy teorisi, Sharpe oranı maksimizasyonu ve FinAi algoritmasının otomatik yeniden dengeleme mantığını derinlemesine öğrenin.",
      topics: [
        "Varlık sınıfları korelasyon matrisi ve kovaryans hesabı",
        "Risk bütçelemesi ve maksimum düşüş (drawdown) koruması",
        "AI destekli dinamik varlık ağırlıklandırma formülü",
        "Gerçek zamanlı portföy simülasyonu ve backtest uygulamaları"
      ]
    },
    {
      id: 2,
      title: "BIST & Küresel Piyasalarda Temel & Çarpan Analizi",
      category: "Hisse Değerleme",
      level: "Başlangıç - Orta",
      duration: "4 Hafta / 12 Ders",
      progress: 90,
      description: "Bilanço, gelir tablosu ve nakit akış tablolarını profesyonel bir fon yöneticisi gibi okuyun; F/K, PD/DD, FD/FAVÖK çarpanlarını yorumlayın.",
      topics: [
        "Finansal tablolarda kritik uyarı işaretleri ve borçluluk analizi",
        "Sektörel çarpan karşılaştırmaları ve adil değerleme hesaplama",
        "KAP bildirimleri ve bilanço dönemlerinde AI ile hızlı tarama",
        "Temettü verimliliği ve nakit yaratma gücü analizi"
      ]
    },
    {
      id: 3,
      title: "TEFAS Fon Sepeti ve Pasif Varlık Yönetimi",
      category: "Fon Yönetimi",
      level: "Tüm Seviyeler",
      duration: "3 Hafta / 9 Ders",
      progress: 80,
      description: "Hisse, değişken, eurobond ve kıymetli maden fonları ile enflasyon üzeri düzenli getiri sağlayan fon sepeti mimarisini kurun.",
      topics: [
        "TEFAS fon kategorileri ve risk dereceleri (1-7)",
        "Yönetim ücreti ve net getiri optimizasyonu",
        "Stop-loss kuralları ve dönemsel fon rotasyonu",
        "FinAi fon skoru ile en iyi yönetilen fonları belirleme"
      ]
    },
    {
      id: 4,
      title: "Davranışsal Finans & Piyasa Psikolojisi",
      category: "Yatırımcı Disiplini",
      level: "Tüm Seviyeler",
      duration: "2 Hafta / 6 Ders",
      progress: 95,
      description: "FOMO, panik satış ve zararda bekleme yanılgılarını aşarak kriz anlarında soğukkanlı karar alabilen rasyonel yatırımcı refleksi kazanın.",
      topics: [
        "Kayıptan kaçınma dürtüsü ve bilişsel önyargılar",
        "Piyasa döngüleri: Öfori, panik ve toparlanma evreleri",
        "Kişisel risk toleransı ve uyku kaçırmayan portföy dengesi",
        "Duygudan arındırılmış algoritmik kural seti oluşturma"
      ]
    },
    {
      id: 5,
      title: "FinAi Copilot & Finansal Prompt Mühendisliği",
      category: "AI Araçları",
      level: "İleri Seviye",
      duration: "3 Hafta / 8 Ders",
      progress: 75,
      description: "FinAi yapay zekâ asistanına doğru soruları sorarak şirketler, makro veriler ve portföy riskleri hakkında anlık derinlemesine analizler üretin.",
      topics: [
        "FinAi analiz motorunun mimarisi ve veri kaynakları",
        "Bilanço ve KAP açıklamalarını özetleten özel promptlar",
        "Makro takvim ve enflasyon senaryolarında stres testi yaptırma",
        "Kişiselleştirilmiş haftalık piyasa brifingi oluşturma"
      ]
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F7FA] via-[#F5F7FA] to-[#D6E4FF]/25 dark:from-[#02041A] dark:via-[#02041A] dark:to-[#040989]/30 text-[#040989] dark:text-[#F5F7FA] w-full mx-auto relative overflow-x-hidden font-clash pb-16">
      {/* Sürekli AI Loop Ambient Glow Efektleri */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-[#004BFA]/20 via-[#D6E4FF]/30 to-transparent blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[35%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
      />

      {/* Ana Kapsayıcı: Kenarları Maksimum Kullanan Tam Genişlik */}
      <div className="w-full max-w-[2500px] mx-auto px-2 min-[360px]:px-3 sm:px-6 md:px-8 xl:px-10 py-3 sm:py-6 relative z-10 flex flex-col gap-5 sm:gap-7">
        
        {/* Üst Bar / Geri Dönüş & Durum */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#D6E4FF]/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-subtitle font-[325] text-[#040989] dark:text-[#F5F7FA] hover:bg-[#D6E4FF]/30 transition-colors shadow-2xs group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="h-4 w-px bg-[#D6E4FF] dark:bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D6E4FF]/40 dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm clash-title font-[500] tracking-tight">
                FinAi Akademi Portalı
              </span>
            </div>
          </div>

          {/* AI Canlı Motor Durumu */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs clash-subtitle font-[325]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Geliştirme Aşamasında • Yakında Kullanılacaktır</span>
            </div>
          </div>
        </div>

        {/* HERO BANNER: Görsel İştah & AI Loop Vurgusu */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#02041A] via-[#040989] to-[#02041A] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-white/10">
          {/* Hareketli Arka Plan Işık Efekti */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-[#004BFA]/40 via-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs clash-subtitle font-[325] text-[#D6E4FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#D6E4FF]" />
              <span>Geleceğin Finansal Eğitimi Yapay Zekâ ile Buluşuyor</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl clash-title font-[500] tracking-tight leading-tight text-white">
              Finansal Okuryazarlığı ve Portföy Yönetimini <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-[#D6E4FF] to-blue-200 bg-clip-text text-transparent">
                Yapay Zekâ ile Sıfırdan Zirveye Taşıyın
              </span>
            </h1>

            <p className="text-xs sm:text-base clash-desc font-[225] text-[#D6E4FF]/90 max-w-2xl leading-relaxed">
              FinAi Akademi; piyasa dinamiklerini, hisse & fon analizlerini ve algoritmik portföy optimizasyonunu interaktif simülatörler ve canlı yapay zekâ asistanı eşliğinde sunan yeni nesil eğitim platformudur.
            </p>

            {/* Dikkat Çeken Yakında Kullanılacaktır Rozeti */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm clash-title font-[500] flex items-center gap-2 backdrop-blur-sm">
                <Clock className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Bu sayfa yakında kullanılacaktır, geliştirme aşamasındadır.</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/20 text-white/90 text-xs clash-subtitle font-[325] flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Hazırlık Oranı: %82 Tamamlandı</span>
              </div>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="pt-2 max-w-xl">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-400 via-[#004BFA] to-emerald-400 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 SÜTUNLU ANA GÖVDE: Sol Müfredat, Sağ İnteraktif Detay & Ön Kayıt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full">
          
          {/* SOL TARAFI: Müfredat Modül Listesi (5 Kolon) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base sm:text-lg clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#004BFA]" />
                <span>Planlanan Akademi Müfredatı</span>
              </h2>
              <span className="text-xs clash-subtitle font-[325] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                5 Temel Modül
              </span>
            </div>

            <div className="space-y-2.5">
              {modules.map((mod, index) => {
                const isSelected = selectedModule === index;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setSelectedModule(index)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? "bg-white dark:bg-[#040989]/60 border-[#004BFA] shadow-md ring-1 ring-[#004BFA]/30"
                        : "bg-white/80 dark:bg-white/5 border-[#D6E4FF]/70 dark:border-white/10 hover:border-[#004BFA]/50 hover:bg-white dark:hover:bg-white/10"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#004BFA]" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] clash-subtitle font-[325] px-2 py-0.5 rounded-full bg-[#D6E4FF]/50 text-[#004BFA] dark:text-[#D6E4FF] border border-[#004BFA]/20">
                        {mod.category}
                      </span>
                      <span className="text-[10px] font-numbers font-[500] text-emerald-600 dark:text-emerald-400">
                        %{mod.progress} Hazır
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] leading-snug">
                      {mod.title}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-[10px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                      <span>{mod.level}</span>
                      <span>•</span>
                      <span>{mod.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAĞ TARAFI: Seçili Modül Detay Kartı & Erken Kayıt (7 Kolon) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Seçili Modül Ayrıntılı Bakış */}
            <div className="bg-white dark:bg-[#040989]/40 border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#D6E4FF]/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#004BFA]/10 flex items-center justify-center text-[#004BFA] dark:text-[#D6E4FF]">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] clash-subtitle font-[325] text-[#004BFA] dark:text-[#D6E4FF] block">
                      Modül #{modules[selectedModule].id}
                    </span>
                    <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                      {modules[selectedModule].title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs clash-subtitle font-[325] px-2.5 py-1 rounded-xl bg-[#D6E4FF]/40 text-[#004BFA] dark:text-[#F5F7FA] border border-[#004BFA]/20">
                    {modules[selectedModule].duration}
                  </span>
                </div>
              </div>

              <div className="py-4 space-y-4">
                <p className="text-xs sm:text-sm clash-desc font-[225] text-[#040989]/85 dark:text-[#F5F7FA]/85 leading-relaxed">
                  {modules[selectedModule].description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA] uppercase tracking-wider">
                    Öğreneceğiniz Başlıca Yetkinlikler
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modules[selectedModule].topics.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F5F7FA] dark:bg-white/5 border border-[#D6E4FF]/50 dark:border-white/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#004BFA] shrink-0 mt-0.5" />
                        <span className="text-xs clash-desc font-[225] text-[#040989] dark:text-[#F5F7FA] leading-tight">
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D6E4FF]/60 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs clash-subtitle font-[325] text-amber-700 dark:text-amber-300">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Ders içerikleri stüdyo kayıt ve kalite kontrol sürecindedir.</span>
                </div>
              </div>
            </div>

            {/* Erken Erişim & Ön Kayıt Formu */}
            <div className="bg-gradient-to-br from-white via-white to-[#D6E4FF]/30 dark:from-[#040989]/60 dark:to-[#02041A] border border-[#D6E4FF] dark:border-[#5B80FF]/30 rounded-3xl p-5 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">
                    Akademi Açıldığında İlk Siz Haberdar Olun
                  </h3>
                  <p className="text-xs clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70">
                    Ön kayıt yaptıran kullanıcılara özel ücretsiz ilk dersler ve portföy simülatörü erişim hakkı.
                  </p>
                </div>
              </div>

              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 mt-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs clash-subtitle font-[325]">
                    Tebrikler! Ön kayıt listenize alındınız. FinAi Akademi yayına girdiğinde bildirim alacaksınız.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresinizi girin..."
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-[#D6E4FF] dark:border-white/20 text-xs clash-desc font-[225] text-[#040989] dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#004BFA]/50"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#004BFA] hover:bg-[#004BFA]/90 text-white font-normal text-xs clash-subtitle font-[325] flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
                  >
                    <span>Ön Kayıt Ol</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* FinAi Akademi Avantajları Bento Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#D6E4FF]/70 dark:border-white/10 space-y-1.5">
                <div className="p-2 w-fit rounded-lg bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">Canlı Simülatör</h4>
                <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                  Sıfır riskle gerçek BIST & TEFAS verileri üzerinden portföy yönetimi deneyimi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#D6E4FF]/70 dark:border-white/10 space-y-1.5">
                <div className="p-2 w-fit rounded-lg bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">AI Mentör Desteği</h4>
                <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                  Takıldığınız her finansal kavramda 7/24 kişiselleştirilmiş açıklama üreten FinAi Copilot.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#D6E4FF]/70 dark:border-white/10 space-y-1.5">
                <div className="p-2 w-fit rounded-lg bg-[#004BFA]/10 text-[#004BFA] dark:text-[#D6E4FF]">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs clash-title font-[500] text-[#040989] dark:text-[#F5F7FA]">Sertifikalı Gelişim</h4>
                <p className="text-[11px] clash-desc font-[225] text-[#040989]/70 dark:text-[#F5F7FA]/70 leading-snug">
                  Modül tamamlama testleri ve seviyenizi belgeleyen dijital başarı sertifikası.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
