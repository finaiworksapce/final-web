# 🚀 FinAI — Yapay Zeka Destekli Finansal Analiz & Portföy Yönetim Platformu

FinAI, Borsa İstanbul (BIST) hisse senetleri, TEFAS yatırım fonları, emtialar ve kripto varlıklar için gelişmiş temel analiz, portföy takip ve yapay zeka destekli yatırım içgörüleri sunan yeni nesil bir finans teknolojisi platformudur.

---

## 🏗️ Mimari Yapı (Architecture)

Proje, **Next.js 15 App Router** tabanlı modern bir **Full-Stack (Tam Yığın)** mimari üzerine inşa edilmiştir:

```
final-web/
├── 🌐 FRONTEND (Kullanıcı Arayüzü)
│   ├── src/app/
│   │   ├── (auth)/              # Giriş (Login), Kayıt, Şifre Sıfırlama ve Onboarding
│   │   ├── dashboard/           # Portföy, Analizler, Takip Listesi ve Raporlama Paneli
│   │   ├── varlik/[symbol]/     # Hisse, Fon ve Emtia Detay Sayfaları (BIST 650+ SEO & ISR)
│   │   ├── haberler/            # Finansal Haberler ve KAP Duyuru Akışı
│   │   ├── hakkimizda/          # Kurumsal Tanıtım ve Vizyon Sayfaları
│   │   └── legal/               # Kullanım Şartları ve Gizlilik Politikası
│   ├── src/components/
│   │   ├── dashboard/           # Portföy özet kartları, grafikler, varlık dağılım donut'ları
│   │   ├── landing/             # Açılış sayfası modern bileşenleri (Hero, Feature, FAQ)
│   │   ├── finai/               # FinAI Sohbet Modalı ve Günlük Analiz Widget'ları
│   │   ├── calendar/            # Canlı Ekonomik Takvim ve Etki Matrisi
│   │   └── ui/                  # Buton, input, modal ve kart gibi temel UI elementleri
│   └── public/                  # Statik görseller, şirket logoları, manifest ve PWA ikonları
│
├── ⚙️ BACKEND (Sunucu, API & Veri Katmanı)
│   ├── src/app/api/             # Next.js Serverless Route Handlers:
│   │   ├── cron/                # Zamanlanmış görevler (Günlük özet, portföy snapshot, bildirimler)
│   │   ├── finai/               # AI model motorları, değerleme ve şirket kalite metrikleri
│   │   ├── bist/                # BIST canlı fiyat, sektör ve tarama (screener) uç noktaları
│   │   ├── tefas/               # TEFAS fon detay, dağılım ve getiri servisleri
│   │   ├── calendar/            # Ekonomik takvim ve açıklanan veri analizi
│   │   ├── notifications/       # Web Push ve Resend e-posta bildirim uç noktaları
│   │   └── admin/               # Yetkili bakım ve veri onarım servisleri
│   ├── src/lib/                 # Temel Algoritmik Motorlar & Servisler:
│   │   ├── finai-analytics-engine.ts       # FinAI puanlama ve analiz motoru
│   │   ├── financial-ratio-engine.ts       # F/K, PD/DD, FD/FAVÖK ve rasyo hesaplamaları
│   │   ├── behavioral-engine.ts            # Yatırımcı psikolojisi ve risk profilleme
│   │   ├── server-price-cache.ts           # Yüksek performanslı sunucu içi fiyat önbelleği
│   │   └── supabase.ts                     # Supabase PostgreSQL istemcisi
│   ├── supabase/migrations/     # PostgreSQL tabloları, RLS güvenlik politikaları ve RPC'ler
│   ├── scripts/                 # Arka plan veri robotları (dividend-robot.js, backfill worker vb.)
│   └── src/middleware.ts        # Edge Rate Limiting, Hostname standardizasyonu ve Bot koruması
│
└── 📋 KONFİGÜRASYON & DOKÜMANTASYON
    ├── .env.example             # Gerekli tüm ortam değişkenleri şablonu
    ├── next.config.ts           # Security Headers (CSP, HSTS, X-Frame-Options)
    ├── vercel.json              # Vercel Cron zamanlama konfigürasyonu
    └── docs/                    # Mimari ve güvenlik yol haritası dokümanları
```

---

## 🛠️ Teknoloji Yığını (Tech Stack)

- **Framework:** Next.js 15 (App Router, Server Actions, React 19)
- **Dil:** TypeScript (Tam tip güvenliği)
- **Stil & Tasarım:** Tailwind CSS v4, Motion (Framer Motion), Lucide Icons
- **Veritabanı & Kimlik Doğrulama:** Supabase (PostgreSQL, Row Level Security, Auth)
- **Yapay Zeka:** Google Generative AI (Gemini Flash & Pro modelleri)
- **Grafikler & Veri Görselleştirme:** Lightweight Charts (TradingView), Recharts
- **Bildirimler:** Web Push API (VAPID) & Resend (E-Posta)
- **Veri Kaynakları:** Yahoo Finance, KAP (Kamuyu Aydınlatma Platformu), TEFAS

---

## ⚡ Kurulum ve Başlangıç

### 1. Ön Gereksinimler
- **Node.js:** v20 veya üzeri
- **npm** veya **pnpm**

### 2. Projeyi Klonlayın ve Bağımlılıkları Yükleyin
```bash
git clone https://github.com/finaiworksapce/final-web.git
cd final-web
npm install
```

### 3. Ortam Değişkenlerini Tanımlayın
`.env.example` dosyasını kopyalayarak `.env.local` oluşturun:
```bash
cp .env.example .env.local
```
Oluşturduğunuz `.env.local` dosyasına kendi Supabase, Google AI Studio ve VAPID anahtarlarınızı girin.

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

---

## 🔒 Güvenlik Mimarisi (Security Standards)

- **Fail-Closed API Koruması:** Cron ve admin uç noktaları (`/api/cron/*`, `/api/admin/*`) Vercel Cron başlığı (`x-vercel-cron`) veya `CRON_SECRET` Bearer token olmadan erişilemez (401 Unauthorized).
- **Edge Rate Limiting:** `src/middleware.ts` üzerinden IP tabanlı istek sınırlaması uygulanır; AI Chat uç noktası için dakika başına sıkı kota uygulanarak kota tükenmesi (token exhaustion) önlenir.
- **Kötü Niyetli Bot Engelleme:** Otomatik güvenlik tarayıcıları (`sqlmap`, `nikto`, `acunetix`, `nmap` vb.) doğrudan Edge katmanında (403 Forbidden) düşürülür.
- **Güvenlik Başlıkları:** `next.config.ts` üzerinde Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options: DENY ve X-Content-Type-Options: nosniff aktif edilmiştir.
- **Gizli Bilgi İzolasyonu:** Tüm API anahtarları sunucu tarafında tutulur; istemci tarafına asla gizli anahtar iletilmez.

---

## ⏰ Zamanlanmış Görevler (Cron Jobs)

`vercel.json` üzerinde tanımlanmış zamanlanmış görevler:
- `0 6 * * 1-5` → **Günlük Sabah Özeti:** Piyasa açılışı öncesi bülten derlemesi.
- `0 19 * * 1-5` → **Günlük Portföy Snapshot:** Kapanış sonrası kullanıcı portföy bakiye arşivlemesi.
- `*/15 7-16 * * 1-5` → **Takvim & Fiyat Güncelleme:** Seans saatlerinde ekonomik takvim ve anlık veri senkronizasyonu.
- `0 8 * * 1` → **Haftalık Özet Raporu:** Pazartesi sabahları kullanıcılara haftalık portföy e-postası.

---

## 📦 Üretim Derlemesi (Production Build)

```bash
npm run build
npm run start
```
Vercel üzerine doğrudan GitHub entegrasyonu ile otomatik dağıtım (CI/CD) desteklenir.
