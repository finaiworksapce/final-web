"use client";

import React, { useEffect, useCallback } from "react";
import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { Compass } from "lucide-react";

interface DashboardTourProps {
  hasActiveAssets: boolean;
  className?: string;
}

const STORAGE_KEY = "finai_dashboard_tour_seen";

export function DashboardTour({ hasActiveAssets, className = "" }: DashboardTourProps) {
  const startTour = useCallback(
    (isManual = false) => {
      // Sadece sayfada gerçekten bulunan elementleri filtrele
      const rawStepsWithAssets: DriveStep[] = [
        {
          element: "#finai-widget-summary",
          popover: {
            title: "Portföyünün Finansal Nabzı",
            description:
              "Sahip olduğun tüm hisse senedi, fon ve nakit varlıklarının güncel toplam değerini tek bakışta buradan izleyebilirsin. Günlük kâr/zarar durumunu ve genel getiri oranını anlık olarak takip ederek portföyünün performansını ölçebilirsin. Detaylı varlık listene ve işlem geçmişine ulaşmak için kartlara tıklayabilirsin.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#finai-widget-allocation",
          popover: {
            title: "Risk ve Varlık Dağılımı",
            description:
              "Portföyünün hisse, yatırım fonu, emtia ve nakit arasındaki oransal ağırlığını gösterir. Finansal okuryazarlığın temel kuralı tüm birikimi tek bir enstrümana bağlamamaktır; buradaki dağılım grafiği risk dengeni anında kontrol etmeni sağlar. Bu widget'ın üzerine bastığın zaman ise seni doğrudan detaylı Portföy sayfana yönlendirir.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#finai-widget-monthly-report",
          popover: {
            title: "FinAi Aylık Portföy Raporu",
            description:
              "Bu alan, yapay zekanın portföyünü detaylı inceleyerek oluşturduğu aylık performans ve strateji analizidir. Bu rapor aylık olarak hazırlandığından dolayı, ilk kapsamlı analizini portföyünü oluşturduktan 1 ay sonra burada görebileceksin. Her ayın sonunda yatırımlarının genel seyrini ve derinlemesine içgörülerini buradan takip edebilirsin.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#finai-widget-market",
          popover: {
            title: "Piyasa Genel Görünümü & Canlı Grafikler",
            description:
              "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#finai-widget-agenda",
          popover: {
            title: "Günlük Ajanda & Kritik Gelişmeler",
            description:
              "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
            side: "top",
            align: "end",
          },
        },
        {
          element: "#finai-widget-news",
          popover: {
            title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
            description:
              "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
            side: "top",
            align: "center",
          },
        },
      ];

      const rawStepsWithoutAssets: DriveStep[] = [
        {
          element: "#finai-widget-sample-portfolio",
          popover: {
            title: "Model Portföy Rehberi",
            description:
              "Henüz portföyüne varlık eklemediysen, FinAi uzmanları ve algoritmaları tarafından dengeli biçimde hazırlanmış BIST model portföyünü buradan inceleyebilirsin. Risk dağılımı yapılmış örnek bir hisse senedi sepetinin nasıl kurgulandığını görerek kendi portföyün için ilham alabilirsin.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#finai-widget-academy",
          popover: {
            title: "Finansal Okuryazarlık & Akademi",
            description:
              "Bütçe yönetiminden hisse senedi ve şirket ortaklığına uzanan adım adım interaktif eğitim haritandır. Her hafta yeni bir modülü tamamlayarak finansal okuryazarlığını geliştirebilir ve tasarruflarını bilinçli yatırımlara dönüştürmeyi öğrenebilirsin.",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#finai-widget-market",
          popover: {
            title: "Piyasa Genel Görünümü & Canlı Grafikler",
            description:
              "Borsa İstanbul endeksinin yanı sıra bu alandaki grafikten en popüler varlıklar olan Gram Altın, Gümüş, Döviz Kurları ve Bitcoin gibi grafiklere hızlıca bakabilirsin. Sekmeler arasında geçiş yaparak canlı fiyat hareketlerini ve teknik grafikleri anında inceleyebilirsin. Kendi yatırımlarının performansını genel piyasa trendleriyle kıyaslamak için en pratik izleme alanındır.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#finai-widget-agenda",
          popover: {
            title: "Günlük Ajanda & Kritik Gelişmeler",
            description:
              "Takvim sayfandaki bugün içerisinde açıklanacak önemli şirket ve ekonomi gelişmelerini senin için bu kısımda kısayol olarak özetler. Takip ettiğin şirketlerin bugünkü bilanço açıklamaları, temettü ödemeleri veya kritik KAP bildirimleri doğrudan bu karta düşer. Detaylı takvime gitmeden günün en kritik olaylarını anında yakalamanı sağlar.",
            side: "top",
            align: "end",
          },
        },
        {
          element: "#finai-widget-news",
          popover: {
            title: "Doğrulanmış Ekonomi ve Borsa Gündemi",
            description:
              "Borsa İstanbul, şirketler ve makroekonomiye dair en güncel haber akışını filtreleyerek sana sunar. Spekülasyonlardan uzak, doğrudan şirket KAP açıklamalarına ve resmi verilere dayalı haberlerle piyasayı ilk elden takip edebilirsin.",
            side: "top",
            align: "center",
          },
        },
      ];

      const candidateSteps = hasActiveAssets ? rawStepsWithAssets : rawStepsWithoutAssets;

      // Sayfada halihazırda var olan DOM elemanlarını seç
      const validSteps = candidateSteps.filter((step) => {
        if (typeof step.element === "string") {
          return document.querySelector(step.element) !== null;
        }
        return false;
      });

      if (validSteps.length === 0) return;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: "rgba(2, 4, 26, 0.88)",
        stagePadding: 8,
        stageRadius: 20,
        popoverClass: "finai-driver-popover",
        nextBtnText: "Sonraki →",
        prevBtnText: "← Önceki",
        doneBtnText: "Tamamla ✓",
        onDestroyStarted: () => {
          localStorage.setItem(STORAGE_KEY, "true");
          driverObj.destroy();
        },
        steps: validSteps,
      });

      driverObj.drive();
    },
    [hasActiveAssets]
  );

  // İlk ziyarette otomatik başlatma (1 saniyelik gecikmeyle sayfa tamamen oturduktan sonra)
  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const timer = setTimeout(() => {
          startTour(false);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage erişim kısıtı durumunda sessizce geç
    }
  }, [startTour]);

  return (
    <button
      type="button"
      onClick={() => startTour(true)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-slate-200/80 dark:border-white/15 text-xs font-semibold text-[#040989] dark:text-white shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer ${className}`}
      title="Sayfa Rehberini Başlat"
    >
      <Compass className="w-3.5 h-3.5 text-[#004BFA] dark:text-[#5B80FF]" />
      <span>Sayfa Rehberi</span>
    </button>
  );
}
