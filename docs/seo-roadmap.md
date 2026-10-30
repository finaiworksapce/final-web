# FinAI SEO çalışma planı

**Güncelleme:** 30 Ekim 2026  
**Durum:** Taslak ve kod düzenlemeleri çalışma kopyasında; canlıya alınmadı.
**Kapsam tercihi:** Kullanıcıya görünen sayfa metni ve tasarım korunacak; bu çalışma yalnızca teknik SEO ve arama görünürlüğüne yönelik metadata düzenlemelerini kapsıyor.

**Doğrulama notu:** Next.js üretim derlemesi, Supabase anahtarları yerelde bulunmadığı için yalnızca derleme sırasında geçici örnek değişkenlerle tamamlandı; derleme ve TypeScript kontrolü geçti. Gerçek Supabase/Vercel ortamıyla canlı dağıtım doğrulaması henüz yapılmadı. Next.js ayrıca üst klasördeki başka bir `package-lock.json` nedeniyle workspace kökü uyarısı verdi. `git diff --check` boşluk hatası göstermedi; Windows satır sonu uyarıları var.

Canlı siteye yapılan metin tabanlı taramada ana sayfada mevcut başlık ve müşteri alıntıları görüldü. Çalışma kopyasında da kullanıcıya görünen metin ve tasarım korunuyor. Tarayıcı aracı `robots.txt`, `sitemap.xml` ve hisse URL'lerini okuyamadığı için bu adresler canlıda doğrulanmış sayılmıyor.

## Birlikte uygulama sırası

Her turda önce değişiklikleri bu çalışma kopyasında yapacağız, sonra sana anlaşılır şekilde özetleyeceğim. GitHub'a gönderme veya canlıya alma bu planın dışında; sen istediğinde ayrıca ele alırız.

1. **Teknik temel (kodda ilk tur yapıldı):** canonical alan adı, apex → www kalıcı yönlendirmesi, robots, sitemap ve yanlışlıkla indekslenmemesi gereken sayfalar. Sonraki doğrulama: uygulama derlemesi, hosting tarafında iki alan adının da uygulamaya bağlı olduğunun kontrolü ve canlı URL testi.
2. **Arama sonuçlarında doğru görünüm (kodda ilk tur yapıldı):** sayfalara uygun title/description, canonical ve sosyal paylaşım metadata'sı. Hisse H1'leri ve sayfa metinleri korunuyor. Sonraki doğrulama: canlı sayfanın kaynak/metadata kontrolü.
3. **Sayfa metinleri ve içerik mimarisi (değişiklik yapılmadı):** mevcut görünür metin ve tasarım korunuyor. Arama sorgusu/konu kümeleri Search Console verisiyle analiz edilip raporlanacak; sayfa metni veya tasarım revizyonu bu çalışmanın kapsamında değil.
4. **Arama niyeti ve yeni içerik:** Search Console sorguları geldikten sonra sayfa kümelerini ve öncelikleri düzelt. Gerçek kullanıcı faydası ve doğrulanabilir veri varsa TEFAS rehberi/detayı veya yatırım eğitimi içeriği tasarla; hacim tahminine dayanarak toplu sayfa üretme.
5. **Ölçüm ve iyileştirme:** mobil deneyim ve hız ölçümleri al; Search Console'da sitemap, indeksleme, sorgu, tıklama ve dönüşümleri izle. Her değişiklikten sonra aynı metriklerle karşılaştır.

**Şu anki sonraki iş:** yalnızca teknik SEO değişikliklerini kod ve dağıtım ayarları açısından doğrulamak; Search Console'a erişim olduğunda sorgu/indeksleme raporlarını değerlendirmek. Görünür sayfa metinleri ve tasarım değiştirilmedi.

Bu plan, FinAI'nin mevcut ürün özelliklerine göre hazırlandı. Search Console verisi olmadığı için arama ifadeleri aşağıda **doğrulanmamış konu/arama niyeti varsayımlarıdır**; arama hacmi veya sıralama iddiası değildir.

## 1. Teknik tarama ve indeksleme — ilk tur tamamlandı, dağıtım sonrası doğrulama bekliyor

- `www.finai.net.tr` adresi canonical host olarak kullanılıyor. Canlı DNS/hosting yönlendirmesinin bu tercihle aynı olduğu dağıtım sonrasında doğrulanmalı.
- Sitemap ana sayfa, Hakkımızda, yasal sayfalar ve editoryal listede bulunan 27 hisse sayfasını listeliyor.
- Uygulama/panel, giriş, şifre yenileme ve tasarım önizleme sayfaları `noindex` olarak işaretlendi.
- Tek robots kaynağı olarak Next.js `app/robots.ts` kullanılıyor; yinelenen `public/robots.txt` kaldırıldı.
- `/hakkimizda`, asıl sayfa olan `/about` adresine kalıcı yönleniyor.
- Site haritasında değişmemiş sayfaları güncel gösteren tarihler ve Google'ın yok saydığı `priority`/`changefreq` alanları yok.

## 2. Sayfa başlıkları, açıklamalar ve yapılandırılmış veri — ilk tur tamamlandı

- Ana sayfa ve Hakkımızda için sayfaya özel title, description ve canonical eklendi.
- Hisse detay sayfalarında başlık şablonu, açıklama ve canonical adres ticker bazında oluşturuluyor.
- Hisse sayfalarında dinamik title, description, canonical ve indeksleme kararı tanımlı. Yapılandırılmış şirket bilgisi yalnızca isim/profil bilgisi mevcutsa üretiliyor. THYAO başlığı “THYAO Hisse Senedi Fiyatı, Grafik ve Analiz” arama niyetini hedefliyor.
- Kullanım koşulları ve KVKK sayfalarına sayfaya özel başlık, açıklama ve canonical eklendi.
- Ana sayfaya FinAI ve web sitesini tanımlayan `Organization`/`WebSite` JSON-LD eklendi.
- Hisse sayfalarındaki görünür içerikle eşleşmeyen SSS ve giriş gerektiren panele bağlanan breadcrumb işaretlemeleri kaldırıldı.
- Sitemap ve hisse sayfası indeksleme kararı, geniş sektör sembolü listesinden editoryal SEO izin listesine taşındı. Bu listeye yeni sembol ancak sayfa kapsamı doğrulandıktan sonra eklenmeli.
- Hisse sayfası yapılandırılmış verisi yalnızca bilinen şirketler için üretiliyor; gerçeği yansıtmayan yedek şirket açıklamaları kaldırıldı.
- Yasal metin sayfalarındaki ortak şablon başlığı H2 yapıldı; her belge sayfasında yalnızca belge başlığı H1 olarak kalıyor. Hisse JSON-LD içeriği HTML script etiketi içinde güvenli biçimde kaçışlanıyor.
- `public/llms.txt` canonical adreslere ve ürünün bilgilendirme amaçlı kullanımına göre yenilendi.

## 3. Arama niyeti ve sayfa mimarisi — Search Console ile doğrulanacak

| Küme | İlk arama niyeti varsayımı | Hedef sayfa | Mevcut durum / yapılacak |
|---|---|---|---|
| Ürün ve portföy takibi | BIST portföy takibi, TEFAS fon takibi, yatırım portföyü takip uygulaması | Ana sayfa | Özellikler mevcut. Arama sorgularından hangilerinin gösterim aldığı Search Console'da incelenecek. |
| Hisse ve şirket | `[ticker] hisse`, `[şirket] hisse fiyatı`, `[ticker] temettü`, `[ticker] KAP haberleri` | `/varlik/[symbol]` | Sayfa şablonu mevcut. Her sembolde içerik kapsamı, güncellik ve veri kaynakları ayrıca kontrol edilecek. |
| FinAI markası | FinAI, FinAi portföy, FinAI yapay zekâ | Ana sayfa ve `/about` | Marka ve ürün açıklamaları var. Search Console sorgularıyla marka dışı fırsatlardan ayrılacak. |
| TEFAS fon bilgisi | TEFAS fonu, fon karşılaştırma/takip | İleride herkese açık fon sayfaları veya rehber | İlgili araçlar şu anda giriş gerektiren alanda. Kamuya açık sayfa ancak veriler ve açıklamalar kullanıcıya anlamlı değer sunuyorsa planlanacak. |
| Finansal okuryazarlık | Temel yatırım/portföy kavramları | İleride kaynaklı rehber merkezi | Konu ve yazar uzmanlığı netleştikten sonra; toplu ve otomatik içerik üretimi yapılmayacak. |

İlk somut hedef sorgu `THYAO`; hedef URL `https://www.finai.net.tr/varlik/THYAO`. Çalışma kopyasında bu URL sitemap izin listesinde ve sayfa metadata'sı ticker odaklı. Canlı indeksleme Search Console URL Inspection ile doğrulanmalı.

Öncelik sırası; gösterim, tıklama, dönüşüm ve sayfa kalitesi görüldükten sonra güncellenecek. Google da arama motoru için değil, insanlara fayda sağlayan ve güvenilir içerik oluşturmayı; finansal istikrarı etkileyebilecek konularda güçlü doğruluk ve güven göstermeyi vurguluyor: [people-first içerik rehberi](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Hisse sayfaları sembole göre değişen içerik içeriyor. `/varlik` için kamuya açık şirket dizini ve TEFAS fonları için açık detay sayfaları; veri kalitesi ve kullanıcıya kattıkları doğrulanmadan oluşturulmayacak. İlk inceleme, yüzeysel çok sayıda sayfa yerine özgün ve işe yarar sayfa üretmeye odaklanacak.

## 4. Güven ve finansal içerik kalitesi — sonraki içerik turu

- Piyasa/veri sayfalarında kullanılan veri sağlayıcılarını, gecikme durumunu ve hesaplama yöntemlerini kullanıcıya açıkla.
- İçeriklerde yazar, kaynak ve anlamlı güncelleme tarihini göster; yapay zekâ katkısı varsa bunu uygun yerde belirt.
- Yatırım danışmanlığı yapılmadığına ilişkin mevcut uyarıyı önemli analiz ve bilgi sayfalarında görünür tut.
- Hisse sayfalarında şirket bilgisi, piyasa verisi ve analiz yorumunu birbirinden ayır; otomatik üretilen açıklamaları doğrulanmış gerçek gibi sunma.

## 5. Hız ve mobil deneyim — kod turundan sonra ölçülecek

- Mobil kullanılabilirlik ve Core Web Vitals/PageSpeed ölçümleri alınacak.
- Öncelikli olarak ana sayfa ve hisse detay sayfaları incelenecek; görsel yükleme, JavaScript miktarı ve ilk içerik görünümü sorunlarına göre düzeltme yapılacak.
- Ölçüm öncesinde hız iyileştirmesi varsayılmayacak; önce gerçek rapor alınacak.

## 6. Search Console kurulumu ve ölçüm

1. Search Console'da `finai.net.tr` için **Domain property** ekle. Bu mülk `www` ve diğer alt alan adlarını kapsar; doğrulama DNS sağlayıcısına TXT kaydı eklemeyi gerektirir. DNS erişimi yoksa `https://www.finai.net.tr/` URL-prefix mülkü kullanılabilir.
2. Mülk doğrulandıktan sonra `https://www.finai.net.tr/sitemap.xml` adresini Sitemaps bölümüne gönder.
3. Ana sayfa, `/about` ve bir hisse sayfası için URL Inspection çalıştır; canonical ve indekslenebilirlik sonuçlarını kaydet.
4. İlk rapor için son 3 ayın Search results verisini sorgu ve sayfa bazında dışa aktar. Gösterim, tıklama, CTR, ortalama konum, ülke ve cihaz kırılımlarını kullan.
5. Page indexing ve sitemap işleme raporlarındaki hataları kod değişikliğinden ayrı olarak takip et.

Search Console erişimi veya raporu bu çalışma kopyasında henüz yok. Google, Domain property'nin tüm alt alan adlarını ve protokolleri kapsadığını, URL-prefix property'nin ise yalnızca girilen tam öneki kapsadığını belirtiyor: [property türleri ve doğrulama](https://support.google.com/webmasters/answer/34592?hl=en).

## Kodda değiştirilen başlıca dosyalar

- `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/middleware.ts` (apex alan adından `www` canonical adrese kalıcı yönlendirme)
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/page-client.tsx`
- `src/app/about/page.tsx`, `src/app/about/page-client.tsx`, `src/app/hakkimizda/page.tsx`
- `src/app/varlik/[symbol]/page.tsx`
- `src/lib/seo-public-stock-symbols.ts`
- `src/components/ui/accordion-feature-section.tsx`
- `src/app/legal/layout.tsx` (başlık hiyerarşisi)
- `src/app/legal/terms/page.tsx`, `src/app/legal/kvkk/page.tsx`
- `src/app/dashboard/layout.tsx`, `src/app/login/page.tsx`, `src/app/reset-password/page.tsx`, `src/app/3d-login-dev/page.tsx`
- `src/app/font-demo/page.tsx`, `src/app/demo-not-found/page.tsx`, `src/app/logo-showcase/page.tsx`, `src/app/logos/page.tsx`
- `public/llms.txt`
- `docs/seo-roadmap.md`

