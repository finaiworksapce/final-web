"use client";

import React from "react";
import { ArrowDown, ShieldCheck, AlertTriangle, ArrowRight, Layers, HelpCircle } from "lucide-react";

export function LessonVisuals() {
  return (
    <div className="w-full space-y-6 select-none">
      
      {/* BAŞLIK & VİTRİN ETİKETİ */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <span className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#004BFA]" />
          <span>Finansal Şematik Harita</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          Editoryal Görselleştirme
        </span>
      </div>

      {/* 1. GÖRSEL: İKİ PROFİL KARŞILAŞTIRMA TERAZİSİ (Gelir Yanılsaması) */}
      <div className="p-5 xl:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
            1. Şema: Gelir Yanılsaması (Top Line vs. Masada Kalan)
          </h4>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Ders Paragrafı 1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* PROFİL A */}
          <div className="p-3.5 bg-rose-50/40 border border-rose-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Profil A (Yüksek Ciro)</span>
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Kırılgan</span>
              </span>
            </div>
            
            <div className="space-y-1.5 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Gelir</span>
                  <span className="font-semibold text-slate-900">120.000 ₺</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-slate-800 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Gider / Tüketim</span>
                  <span className="font-semibold text-rose-600">120.000 ₺</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-rose-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-500">Masada Kalan:</span>
              <span className="font-bold text-rose-700">0 ₺ (Sıfır Güç)</span>
            </div>
          </div>

          {/* PROFİL B */}
          <div className="p-3.5 bg-emerald-50/40 border border-emerald-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">Profil B (Disiplinli Kasa)</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Sağlam</span>
              </span>
            </div>
            
            <div className="space-y-1.5 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Gelir</span>
                  <span className="font-semibold text-slate-900">45.000 ₺</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[70%] h-full bg-slate-800 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-0.5">
                  <span>Gider / Tüketim</span>
                  <span className="font-semibold text-emerald-700">25.000 ₺</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 flex justify-between items-center text-xs">
              <span className="text-slate-500">Masada Kalan:</span>
              <span className="font-bold text-emerald-700">+20.000 ₺ Nakit</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. GÖRSEL: ŞEMATİK NAKİT AKIŞI MOTORU (Musluk & Kaçaklar) */}
      <div className="p-5 xl:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
            2. Şema: Nakit Akışı Motoru (Giriş → Havuz → Çıkış)
          </h4>
          <span className="text-[10px] font-semibold text-[#004BFA] bg-blue-50 px-2 py-0.5 rounded">
            Ders Paragrafı 2
          </span>
        </div>

        {/* Akış Şeması */}
        <div className="space-y-2.5 pt-1">
          
          {/* 1. Giriş Musluğu */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#004BFA]" />
              <span className="font-semibold text-[#0E1E38]">Aylık Gelir Akımı (Ana Musluk)</span>
            </div>
            <span className="text-[11px] font-bold text-[#004BFA]">+ Giriş</span>
          </div>

          {/* Akış Oku */}
          <div className="flex justify-center">
            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* 2. Merkez Kasa Havuzu */}
          <div className="p-3.5 bg-[#0E1E38] text-white rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-white/90">Kişisel Kasa Rezervi (Nakit Havuzu)</span>
              <span className="text-[11px] text-[#78B8F5] font-semibold">Aktif Denge</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-[#004BFA] rounded-full" />
            </div>
          </div>

          {/* Akış Oku */}
          <div className="flex justify-center">
            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* 3. Kaçaklar / Çıkışlar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-rose-50 border border-rose-200/80 rounded-lg text-center">
              <span className="text-[10px] font-bold text-rose-900 block truncate">Kira & Barınma</span>
              <span className="text-[9px] text-rose-600 block mt-0.5">Zorunlu Gider</span>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200/80 rounded-lg text-center">
              <span className="text-[10px] font-bold text-amber-900 block truncate">Faturalar & Gıda</span>
              <span className="text-[9px] text-amber-600 block mt-0.5">Yaşam Gideri</span>
            </div>

            <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-center">
              <span className="text-[10px] font-bold text-slate-800 block truncate">Görünmeyen Kaçak</span>
              <span className="text-[9px] text-slate-500 block mt-0.5">Keyfi Sızıntı</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. GÖRSEL: SERMAYE DÖNÜŞÜM YOLCULUĞU (4. Bölüm Köprüsü) */}
      <div className="p-5 xl:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wide">
            3. Şema: Serbest Nakdin Şirket Ortaklığına Dönüşümü
          </h4>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Ders Paragrafı 4
          </span>
        </div>

        {/* 3 Adımlı Yolculuk */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-[#004BFA] block">1. HAFTA (ŞU AN)</span>
            <span className="text-xs font-semibold text-[#0E1E38] block leading-tight">Nakit Akışı Tespiti</span>
            <span className="text-[10px] text-slate-500 block">Sıfır Noktası</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block">2. HAFTA</span>
            <span className="text-xs font-semibold text-slate-700 block leading-tight">Tasarruf Kalkanı</span>
            <span className="text-[10px] text-slate-500 block">Kaçakları Kesme</span>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block">İLERİ DÜZEY</span>
            <span className="text-xs font-semibold text-[#0E1E38] block leading-tight">Borsa Ortaklığı</span>
            <span className="text-[10px] text-slate-500 block">Üreten Varlıklar</span>
          </div>
        </div>
      </div>

    </div>
  );
}
