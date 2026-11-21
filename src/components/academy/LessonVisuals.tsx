"use client";

import React from "react";

export function LessonVisuals() {
  return (
    <div className="w-full space-y-6 select-none">
      <style jsx>{`
        @keyframes waterFlow {
          0% { transform: translateY(-10px); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateY(35px); opacity: 0; }
        }
        @keyframes leakDrip {
          0% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(24px); opacity: 0; }
        }
        @keyframes waveMotion {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
        }
        @keyframes scaleSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.96); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }
        @keyframes nodeTravel {
          0% { stroke-dashoffset: 120; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* 1. ŞEMA: TERAZİ / DENGE DİNAMİĞİ (Sıfır Yazı - Salt Görsel) */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center min-h-[170px]">
        <svg viewBox="0 0 320 130" className="w-full max-w-[280px] h-auto overflow-visible">
          {/* Taban & Merkez Direk */}
          <path d="M140 120 L180 120" stroke="#0E1E38" strokeWidth="4" strokeLinecap="round" />
          <path d="M160 120 L160 40" stroke="#0E1E38" strokeWidth="4" strokeLinecap="round" />
          <circle cx="160" cy="40" r="5" fill="#004BFA" />

          {/* Sallanan Terazi Kolu */}
          <g style={{ transformOrigin: "160px 40px", animation: "scaleSway 6s ease-in-out infinite" }}>
            <line x1="60" y1="40" x2="260" y2="40" stroke="#0E1E38" strokeWidth="3" strokeLinecap="round" />
            
            {/* Sol Kefe (Ağır / Tüketim Yükü) */}
            <line x1="60" y1="40" x2="40" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="60" y1="40" x2="80" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M30 75 Q60 90 90 75 Z" fill="#F43F5E" fillOpacity="0.2" stroke="#F43F5E" strokeWidth="2" />
            {/* Sol Kefe Yük Blokları */}
            <rect x="45" y="60" width="14" height="14" rx="2" fill="#F43F5E" />
            <rect x="61" y="63" width="12" height="11" rx="2" fill="#E11D48" />
            <rect x="52" y="47" width="15" height="12" rx="2" fill="#BE123C" />

            {/* Sağ Kefe (Kompakt / Değerli Sermaye Çekirdeği) */}
            <line x1="260" y1="40" x2="240" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="260" y1="40" x2="280" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M230 75 Q260 90 290 75 Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" />
            {/* Sağ Kefe Cevheri (Pırlanta / Zenginlik Çekirdeği) */}
            <polygon points="260,50 273,65 260,74 247,65" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
            <circle cx="260" cy="62" r="3" fill="#ECFDF5" />
          </g>
        </svg>
      </div>

      {/* 2. ŞEMA: NAKİT REZERVİ & KAÇAK MOTORU (Sıfır Yazı - Salt Görsel) */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center min-h-[220px]">
        <svg viewBox="0 0 280 200" className="w-full max-w-[260px] h-auto overflow-visible">
          {/* Üst Musluk / Giriş Borusu */}
          <path d="M120 15 L140 15 L140 35 L120 35" fill="none" stroke="#0E1E38" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M115 10 L125 10" stroke="#004BFA" strokeWidth="3" strokeLinecap="round" />

          {/* Düşen Su Damlaları (Akış) */}
          <circle cx="130" cy="45" r="3" fill="#004BFA" style={{ animation: "waterFlow 1.8s infinite ease-in" }} />
          <circle cx="130" cy="55" r="2.5" fill="#3B82F6" style={{ animation: "waterFlow 1.8s infinite 0.6s ease-in" }} />
          <circle cx="130" cy="65" r="2" fill="#60A5FA" style={{ animation: "waterFlow 1.8s infinite 1.2s ease-in" }} />

          {/* Ana Rezervuar / Cam Kasa Havuzu */}
          <rect x="70" y="70" width="120" height="85" rx="10" fill="#0E1E38" fillOpacity="0.04" stroke="#0E1E38" strokeWidth="2.5" />
          
          {/* Havuz İçi Su Kütlesi */}
          <g clipPath="url(#tankClip)">
            <rect x="72" y="98" width="116" height="55" fill="#004BFA" fillOpacity="0.25" />
            <path
              d="M50 98 Q75 92 100 98 T150 98 T200 98 T250 98 V160 H50 Z"
              fill="#004BFA"
              fillOpacity="0.55"
              style={{ animation: "waveMotion 4s ease-in-out infinite" }}
            />
          </g>
          
          <clipPath id="tankClip">
            <rect x="72" y="72" width="116" height="81" rx="8" />
          </clipPath>

          {/* Havuz Cam Yansıması */}
          <line x1="82" y1="78" x2="82" y2="145" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />

          {/* Yan Kaçak Çıkışları (Sızıntı Boruları) */}
          {/* Sol Kaçak */}
          <path d="M70 125 L50 125 L50 135" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="142" r="2" fill="#F43F5E" style={{ animation: "leakDrip 1.4s infinite ease-in" }} />

          {/* Sağ Kaçak */}
          <path d="M190 115 L210 115 L210 125" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="210" cy="132" r="2" fill="#F59E0B" style={{ animation: "leakDrip 1.6s infinite 0.5s ease-in" }} />

          {/* Alt Ana Temiz Çıkış (Sermaye Havuzu) */}
          <path d="M130 155 L130 175" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <circle cx="130" cy="183" r="5" fill="#10B981" style={{ animation: "pulseGlow 2.5s infinite" }} />
        </svg>
      </div>

      {/* 3. ŞEMA: SERMAYE BÜYÜME VE ORTAKLIK BORU HATTI (Sıfır Yazı - Salt Görsel) */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center min-h-[160px]">
        <svg viewBox="0 0 280 100" className="w-full max-w-[260px] h-auto overflow-visible">
          {/* Bağlantı Yolu */}
          <line x1="45" y1="50" x2="135" y2="50" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
          <line x1="145" y1="50" x2="235" y2="50" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />

          {/* Dinamik Işık Akışı */}
          <line
            x1="45"
            y1="50"
            x2="235"
            y2="50"
            stroke="#004BFA"
            strokeWidth="3"
            strokeDasharray="16 100"
            style={{ animation: "nodeTravel 3s linear infinite" }}
          />

          {/* 1. Düğüm: Başlangıç Tohumu */}
          <g>
            <circle cx="40" cy="50" r="14" fill="#EFF6FF" stroke="#004BFA" strokeWidth="2" />
            <circle cx="40" cy="50" r="5" fill="#004BFA" />
          </g>

          {/* 2. Düğüm: Koruyucu Kalkan / Rezerv */}
          <g>
            <circle cx="140" cy="50" r="16" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
            <path d="M140 42 L147 46 V53 Q147 57 140 60 Q133 57 133 53 V46 Z" fill="#64748B" fillOpacity="0.25" stroke="#475569" strokeWidth="1.5" />
          </g>

          {/* 3. Düğüm: Çarpan & Üreten Varlık Ağacı */}
          <g>
            <circle cx="240" cy="50" r="18" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" style={{ animation: "pulseGlow 2.5s infinite" }} />
            {/* Yükselen Grafik Çizgisi */}
            <path d="M232 56 L237 52 L242 54 L248 44" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="247,43 250,47 245,46" fill="#10B981" />
          </g>
        </svg>
      </div>

    </div>
  );
}
