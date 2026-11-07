"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#0E1E38] font-sans flex flex-col selection:bg-blue-100 selection:text-[#0E1E38]">
      {/* Üst Navigasyon */}
      <Navbar />

      <main className="flex-grow pt-32 sm:pt-40 pb-28">
        {/* =========================================================================
            BÖLÜM 1: TAM GENİŞLİK MANİFESTO & GİRİŞ (EDGE-TO-EDGE HERO)
            ========================================================================= */}
        <section className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 mb-24 sm:mb-32">


          {/* Ana Başlık — Rafine Zodiak Tipografisi */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-normal tracking-tight text-[#0E1E38] leading-[1.2] max-w-5xl mb-10 sm:mb-12"
          >
            Yatırım dünyasında karmaşaya son. <br className="hidden sm:inline" />
            <span className="text-slate-500">
              Her birey için rasyonel, şeffaf ve anlaşılır bir finansal gelecek.
            </span>
          </motion.h1>

          {/* İki Kolonlu Geniş Anlatı ve Metrikler */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 pt-8 border-t border-slate-200/80">
            {/* Sol Kolon: Manifestonun Özü */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-7 space-y-6 text-lg sm:text-xl md:text-2xl text-slate-700 font-normal leading-relaxed"
            >
              <p>
                FinAi; finansal okuryazarlık seviyesi ne olursa olsun her bireyin kendi yatırımlarını
                kulaktan dolma tüyolar veya anlamsız jargonlar yerine, rasyonel veriler ve anlaşılır analizlerle
                yönetebilmesi için kuruldu.
              </p>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal">
                Borsa İstanbul (BIST) hisselerinden TEFAS fonlarına kadar tüm piyasayı tek bir akıllı ekranda topluyor;
                şirketlerin bilançolarını, çarpanlarını ve risk faktörlerini herkesin anlayabileceği sade bir Türkçe ile
                yatırımcının kararlarına rehber kılıyoruz.
              </p>
            </motion.div>

            {/* Sağ Kolon: Minimalist Veri Göstergeleri (Çerçevesiz, Saf Tipografi) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 grid grid-cols-2 gap-8 sm:gap-10 lg:pl-10 lg:border-l lg:border-slate-200/80"
            >
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight">
                  %100
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  Veri Odaklı ve Tarafsız
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                  Spekülasyondan uzak, doğrulanmış BIST & TEFAS piyasa matematiği.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight">
                  Tek
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  Bütünleşik Ekran
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                  Hisseler, fonlar, temettüler ve ajanda tek bir akıllı panoda.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight">
                  0
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  Karmaşık Jargon
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                  Yapay zekanın ürettiği anlaşılır, yalın ve eğitici finans dili.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0E1E38] block tracking-tight">
                  24/7
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">
                  Kesintisiz İçgörü
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 leading-snug pt-1">
                  Portföyün dinamik takibi ve anlık yapay zeka asistanı desteği.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 2: KURUCUNUN NOTU — EDİTORYAL & İNSAN ODAKLI (SALİH KAVAKCI)
            Kutu/çerçeve yok; geniş, saf tipografik bir anlatım mektubu.
            ========================================================================= */}
        <section className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 mb-24 sm:mb-32">
          <div className="pt-16 sm:pt-20 border-t border-slate-200/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 items-start">
              {/* Sol: Kurucu Kimliği */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 space-y-3"
              >
                <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 block">
                  Kurucu Perspektifi
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0E1E38] tracking-tight">
                  Salih KAVAKCI
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Founder & CEO
                </p>
                <div className="pt-4">
                  <a
                    href="mailto:finairesmi@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004BFA] hover:underline"
                  >
                    <span>finairesmi@gmail.com</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>

              {/* Sağ: Mektup / Samimi Anlatı */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-8 space-y-6 text-base sm:text-lg md:text-xl text-slate-700 font-normal leading-relaxed"
              >
                <p className="text-xl sm:text-2xl md:text-3xl text-[#0E1E38] font-normal leading-snug">
                  "FinAi; bir gecede tasarlanmış jenerik bir teknoloji projesi değil.
                  Tasarruf eden, emeğini korumak isteyen insanların piyasada hissettiği
                  derin yalnızlığa ve bilgi kirliliğine verilmiş bilinçli bir yanıttır."
                </p>

                <p>
                  Ülkemizde her gün yüz binlerce insan alın terini enflasyona karşı korumak ve çocuklarının geleceğine
                  sağlam bir birikim bırakmak umuduyla finansal piyasalara adım atıyor. Ancak karşılaştıkları ilk manzara;
                  anlaşılması güç aracı kurum ekranları, ezbere finansal terimler ve nereye savrulduğu belli olmayan
                  sosyal medya dedikoduları oluyor.
                </p>

                <p>
                  FinAi’yi hayata geçirirken tek bir temel soru sorduk:{" "}
                  <strong className="font-medium text-[#0E1E38]">
                    'Her seviyeden yatırımcı, elindeki varlığın gerçekte ne olduğunu, arkasındaki şirketin ne ürettiğini
                    ve piyasa dalgalanmalarının somut nedenlerini kendi dilinde nasıl öğrenebilir?'
                  </strong>
                </p>

                <p>
                  Yapay zekayı parıltılı bir pazarlama süsü olarak değil; bilançoları sadeleştiren,
                  rasyoları anlamlı kılan ve kullanıcının finansal okuryazarlığını her gün bir adım ileriye taşıyan
                  tarafsız bir karar destek ortağı olarak tasarladık. Amacımız kimseye ne alıp satacağını söylemek değil;
                  herkesin kendi kararlarını güvenle ve bilinçle alabileceği berrak bir zemin sunmaktır.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 3: 3 TEMEL İLKE — ÇERÇEVESİZ, GENİŞ 3 SÜTUN
            ========================================================================= */}
        <section className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44 mb-24 sm:mb-32">
          <div className="pt-16 sm:pt-20 border-t border-slate-200/80">
            {/* Bölüm Başlığı */}
            <div className="max-w-3xl mb-12 sm:mb-16">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 block mb-3">
                Nasıl Çalışıyoruz?
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight">
                Geliştirdiğimiz her algoritmada bağlı kaldığımız üç değişmez ilke.
              </h2>
            </div>

            {/* 3 Geniş Sütun — Kutu/Border Yok */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 lg:gap-20">
              {/* İlke 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] block">
                  01 / VERİYE DAYALI RASYONELLİK
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                  Spekülasyon Değil, Matematik
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Duygusal yönlendirmeler ve fısıltı gazetesi yerine; net şirket bilançolarına, nakit akışlarına,
                  fiyat/kazanç oranlarına ve teyitli makroekonomik verilere dayanıyoruz.
                </p>
              </motion.div>

              {/* İlke 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] block">
                  02 / ORGANİK OKURYAZARLIK
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                  Kullandıkça Büyüyen Bilinç
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Platform sadece portföy büyüklüğünüzü göstermez. Bir hissenin neden değer kazandığını, bir fonun
                  nasıl dağıldığını ve piyasa döngülerini açıklayarak sizi piyasada yetkinleştirir.
                </p>
              </motion.div>

              {/* İlke 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <span className="text-xs font-mono font-bold tracking-widest text-[#004BFA] block">
                  03 / BAĞIMSIZLIK & ŞEFFAFLIK
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-[#0E1E38] tracking-tight">
                  Kendi Geleceğinizin Sahibi Olun
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  Kullanıcıyı hiçbir kuruma veya üçüncü şahsa bağımlı kılmadan; kendi birikimini özgürce, şeffafça
                  ve tam denetimle yönetebileceği bağımsız bir teknolojik zemin sunuyoruz.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BÖLÜM 4: GENİŞ VE MİNİMALİST KAPANIŞ / EYLEME ÇAĞRI
            Kutu/kart yok; ekran boyunca uzanan ferah bir satır.
            ========================================================================= */}
        <section className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
          <div className="pt-16 sm:pt-20 border-t border-slate-200/80 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 block">
                Yolculuğa Katılın
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight">
                Finansal geleceğinizi rasyonel verilerle yönetmeye bugün başlayın.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/login?tab=register"
                className="px-8 py-4 bg-[#0E1E38] hover:bg-black text-white text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
              >
                <span>Hemen Ücretsiz Başlayın</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-transparent hover:bg-slate-50 text-[#0E1E38] text-sm font-semibold rounded-full border border-slate-300 transition-colors flex items-center justify-center"
              >
                <span>Ana Sayfaya Dön</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Alt Bilgi */}
      <Footer />
    </div>
  );
}
