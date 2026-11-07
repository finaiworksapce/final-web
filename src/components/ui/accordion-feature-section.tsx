"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "FinAi tam olarak ne işe yarar ve nasıl çalışır?",
    answer:
      "FinAi; Borsa İstanbul (BIST) hisseleriniz ve TEFAS yatırım fonlarınızı tek bir dinamik ekranda toplar. Canlı piyasa fiyatlarıyla portföyünüzün toplam değerini, kar/zarar dengesini saniyelik günceller ve yapay zeka destekli analizlerle varlıklarınızın risk durumunu, korelasyonunu ve olası senaryolara karşı dayanıklılığını şeffafça önünüze getirir."
  },
  {
    id: 2,
    question: "Hangi varlık türlerini ekleyip takip edebilirim?",
    answer:
      "BIST 100 ve tüm BIST pay senetlerini, TEFAS'ta işlem gören yerli/yabancı tüm yatırım fonlarını, altın/kıymetli madenleri ve Türk Lirası nakit rezervinizi portföyünüze ekleyebilirsiniz. Tüm varlıklarınız tek bir varlık dağılımı modelinde konsolide edilir."
  },
  {
    id: 3,
    question: "FinAi yatırım tavsiyesi verir mi?",
    answer:
      "Kesinlikle hayır. FinAi, 6362 sayılı Sermaye Piyasası Kanunu uyarınca bir yatırım danışmanlığı faaliyeti yürütmez. Platformumuzun amacı kimseye ne alıp satacağını söylemek değil; matematiksel modeller, bilanço rasyoları ve doğrulanmış piyasa verileriyle yatırımcının kendi kararlarını bilinçle alabilmesini sağlayan bir karar destek ekosistemi sunmaktır."
  },
  {
    id: 4,
    question: "Kişisel ve finansal verilerim güvende mi?",
    answer:
      "Evet. Verileriniz Avrupa Birliği standartlarındaki güvenli bulut altyapısında (Supabase) uçtan uca şifrelemeyle korunur. Portföy ve kimlik verileriniz hiçbir üçüncü tarafla ticari amaçla paylaşılmaz ve KVKK mevzuatına tam uyumlu şekilde saklanır."
  },
  {
    id: 5,
    question: "Platformu kullanmak ücretli mi?",
    answer:
      "FinAi şu anda tüm bireysel yatırımcılara ücretsiz olarak sunulmaktadır. Amacımız ülkemizdeki finansal okuryazarlık seviyesini büyütmek ve her seviyeden yatırımcının rasyonel analiz gücüne erişmesini sağlamaktır."
  }
];

export function FAQAccordionSection() {
  const [activeItem, setActiveItem] = useState<string>("item-1");

  return (
    <section id="faq" className="w-full bg-white text-[#0E1E38] py-20 sm:py-28 overflow-hidden">
      {/* Kenarlara Kadar Uzanan Geniş Kapsayıcı */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-44">
        {/* Üst Ayraç */}
        <div className="pt-16 sm:pt-20 border-t border-slate-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
            
            {/* Sol Kolon: Başlık ve İletişim Notu (Çerçevesiz, Geniş) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
                <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-500">
                  Merak Ettikleriniz & Destek
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-normal text-[#0E1E38] tracking-tight leading-tight">
                Sıkça Sorulan Sorular ve Şeffaf Yanıtlar
              </h2>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                Platformun çalışma prensipleri, veri güvenliği ve analitik modellerimiz hakkında merak ettiğiniz tüm detaylar.
              </p>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Başka bir sorunuz mu var?
                </p>
                <a
                  href="mailto:finairesmi@gmail.com"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#004BFA] hover:underline"
                >
                  <span>finairesmi@gmail.com üzerinden bize ulaşın</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sağ Kolon: Çerçevesiz, Saf Tipografik Akordeon */}
            <div className="lg:col-span-7 divide-y divide-slate-200/80">
              <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
                value={activeItem}
                onValueChange={(val) => setActiveItem(val)}
                className="w-full"
              >
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={`item-${item.id}`}
                    className="border-b border-slate-200/80 py-2 first:pt-0 last:border-b-0"
                  >
                    <AccordionTrigger className="cursor-pointer py-5 sm:py-6 text-left hover:no-underline group">
                      <span className="text-lg sm:text-xl font-normal text-[#0E1E38] group-hover:text-[#004BFA] transition-colors pr-4">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pr-6">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
