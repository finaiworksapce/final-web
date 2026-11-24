# FinAi Standart Sayfa Rehberi (Tutorial) Tasarım Sistemi & Mimari Standartları

Bu doküman, FinAi platformundaki tüm sayfalarda (Dashboard, Portföyüm, Analiz, Takvim, Haberler, Akademi vb.) uygulanacak **Rehber / Tutorial Sisteminin** değişmez kurallarını, animasyon fiziğini, tipografi ve yerleşim standartlarını içerir.

---

## 1. Temel Felsefe & Tasarım İlkeleri

1. **Kutusuz Tipografi (Zero-Box Philosophy):**
   - Popover kutusu, gri/koyu kart arka planı, kalın çerçeve ve ok (arrow) işaretleri kesinlikle kullanılmaz.
   - Tüm başlıklar, paragraflar ve kontrol butonları doğrudan FinAi imza gradyanı üzerinde serbest, berrak beyaz kontrastla yüzer.

2. **FinAi İmza Gradyanı & Ambient Işıma:**
   - Arka plan düz siyah veya gri opak karartma DEĞİLDİR.
   - `DashboardSummaryCards` (Toplam Varlık Değeri) bileşeniyle birebir aynı olan **`#02041A` → `#040989` → `#02041A`** lineer gradyanı kullanılır.
   - Ekranın köşelerinde `w-[540px] h-[540px] bg-[#004BFA]/20 rounded-full blur-[140px]` ambient ışıma küreleri bulunur.

3. **Işıklı Parlayan Odak Çerçevesi:**
   - Odaklanılan widget, SVG maskesindeki `rx="24"` yuvarlatılmış delikle saydam bırakılır.
   - Çevresinde `#5B80FF` renginde, `strokeWidth="2.5"` kalınlığında ve `animate-pulse` efektli ince mavi ışık halkası yer alır.

---

## 2. Animasyon & Geçiş Fiziği Standartları

1. **İlk Açılış Kuralı (`initial={false}`):**
   - Rehber ilk açıldığında sol üstten (0,0) uçarak gelme efekti KESİNLİKLE YAPILMAZ.
   - `<motion.rect initial={false} ... />` kullanılarak spotlight kesiti ve ışık çerçevesi ilk hedefin üzerinde **anında ve doğrudan** belirir.

2. **Adımlar Arası Yumuşak Morf Kayması (Soft Spring Morph):**
   - "Sonraki Adım" / "Önceki" veya adım noktalarına tıklandığında, ışıklı çerçeve ve SVG kesit deliği bir widget'tan diğerine sıçramaz; Framer Motion yay mekaniği ile ekranda süzülerek yeni widget'ın boyut ve konumuna morf olur:
     ```tsx
     transition={{
       type: "spring",
       stiffness: 95,
       damping: 18,
       mass: 0.9,
     }}
     ```

3. **Metin Geçişleri (`AnimatePresence mode="wait"`):**
   - Metinler adımlar arasında yumuşak `fade & slide` ile değişir (`duration: 0.4s`, `ease: [0.22, 1, 0.36, 1]`).
   - Önceki metin 200ms içinde zarifçe söner, yeni metin hafif dikey kaymayla pürüzsüzce belirir.

---

## 3. Akıllı Alan & Konumlandırma Motoru

Her widget'ın sayfa grid'indeki konumuna göre metin en geniş, en rahat boşluğa yerleşir:

- **`placement: "right"`:** Widget sol/orta sütunda ise, metin widget'ın sağ kenarından **~36px** mesafede başlar (`leftPos = targetRect.right + 36`).
- **`placement: "left"`:** Widget sağ sütunda ise, metin widget'ın sol kenarından **~36px** mesafede biter (`rightPos = winWidth - targetRect.left + 36`).
- **`placement: "bottom"`:** Varlık Dağılımı gibi orta/kare kartlarda, metin kartın altına oturur (`topPos = targetRect.bottom + 24`).
- **`placement: "top"`:** Son Haberler gibi tam genişlikli alt kartlarda, metin kartın üstünde konumlanır (`bottomPos = winHeight - targetRect.top + 28`).
- **Mobil Standart (<1024px veya <700px):** Yan boşluklar kalmadığında metin otomatik olarak widget'ın altına (`targetRect.bottom + 20`) veya üstüne geçer (`maxWidth: calc(100vw - 32px)`).

---

## 4. Kullanıcı Deneyimi & Otomatik Başlatma

1. **Yeni Kayıt Olan Kullanıcılar (İlk Karşılama):**
   - `localStorage.getItem("finai_{page}_tour_seen")` kontrol edilir.
   - Değer yoksa, sayfa DOM elemanları yüklendikten **750ms** sonra tur otomatik başlar.
   - Tur tamamlandığında veya kapatıldığında bu anahtar `"true"` olarak kaydedilir ve kullanıcı tekrar rahatsız edilmez.

2. **Manuel Tetikleme:**
   - Sayfa başlığının sağ yanında her zaman bir `Sayfa Rehberi` (`<Compass className="w-3.5 h-3.5" />`) butonu bulunur. Tıklandığında tur her an sıfırdan başlatılabilir.
   - Test ve önizleme için URL sonuna `?tour=true` eklendiğinde de otomatik tetiklenir.

3. **Klavye & Kapatma Kontrolleri:**
   - `ArrowRight`: Sonraki adım.
   - `ArrowLeft`: Önceki adım.
   - `Escape`: Turu kapatır.
   - Karartılmış arka plana tıklama: Turu kapatır (kesik alan içi tıklamalar hariç).

---

## 5. Gelecek Sayfalar İçin Yeniden Kullanılabilir Şablon

Yeni bir sayfaya (örneğin `/dashboard/portfolio` veya `/dashboard/analysis`) rehber eklenirken izlenecek 3 basit adım:

1. **DOM ID'leri Tanımla:** Sayfadaki kritik kartlara semantik ID ver (`id="finai-portfolio-summary"`, `id="finai-portfolio-table"` vb.).
2. **Adım Listesi Oluştur:**
   ```tsx
   const steps = [
     {
       element: "#finai-portfolio-summary",
       title: "Portföy Özeti & Net Bakiye",
       description: "...",
       placement: "right"
     },
     {
       element: "#finai-portfolio-table",
       title: "Detaylı Varlık Tablosu",
       description: "...",
       placement: "top"
     }
   ];
   ```
3. **Portal Katmanını Ekle:** `DashboardTour` mimarisini aynı SVG mask, yay fiziği ve kutusuz tipografiyle o sayfaya bağla.
