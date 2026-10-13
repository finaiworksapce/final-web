import React from 'react';
import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div className="space-y-10 not-prose">
      {/* Başlık */}
      <section className="border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          FinAi Kullanım Koşulları
        </h1>
        <p className="text-slate-600 leading-relaxed text-base">
          Lütfen FinAi platformunu kullanmadan önce işbu Kullanım Koşullarını dikkatlice okuyunuz.
        </p>
      </section>

      {/* ÖNEMLİ YASAL UYARI BANNERI */}
      <section className="bg-amber-50 border-2 border-amber-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2 mb-3">
          <span>⚠️</span> ÖNEMLİ YASAL UYARI
        </h2>
        <p className="text-amber-900 text-sm font-medium leading-relaxed m-0">
          Platformumuzda yer alan bilgiler, tahminler, analizler ve yapay zeka tarafından sunulan raporlar kesinlikle yatırım danışmanlığı kapsamında değildir. FinAi, 6362 sayılı Sermaye Piyasası Kanunu ve ilgili mevzuat uyarınca yatırım danışmanlığı faaliyeti yürütmemektedir. Sunulan veriler kullanıcıları bilgilendirme amaçlı olup, yatırım kararları tamamen kullanıcının sorumluluğundadır.
        </p>
      </section>

      {/* 1. Taraflar ve Kabul */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          1. Taraflar ve Kabul
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Bu Kullanım Koşulları (“Koşullar”), <a href="https://www.finai.net.tr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.finai.net.tr/</a> adresinde sunulan FinAi platformunu (“Platform”) işleten Salih Kavakcı (“FinAi”) ile Platforma üye olan veya Platformu kullanan kişi (“Kullanıcı”) arasındadır. Şirketleşme tamamlandığında hizmet sağlayıcı ticari unvan ve MERSİS numarasıyla güncellenecektir. Üyelik sırasında Koşulları onaylayarak bu Koşulları kabul etmiş olursunuz. Üyeliğin sona ermesinden sonra Koşulların kullanıcıyı ilgilendiren hükümleri (fikri mülkiyet, sorumluluk vb.) geçerliliğini korur.
        </p>
      </section>

      {/* 2. Hizmetin Tanımı */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          2. Hizmetin Tanımı
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platform; varlık takibi, portföy görüntüleme, ekonomik takvim, haber ve veri açıklamaları ile yapay zekâ destekli finansal bilgi açıklamaları sunan bir bilgilendirme ve finansal okuryazarlık aracıdır. Hizmet şu anda ücretsiz sunulmaktadır. FinAi, hizmetin kapsamını değiştirebilir veya ücretli özellikler ekleyebilir. Ücretli bir hizmete geçilmesi hâlinde bu, ayrıca ve önceden bildirilir.
        </p>
      </section>

      {/* 3. Yatırım Danışmanlığı Değildir */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          3. Yatırım Danışmanlığı Değildir
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platformda yer alan bilgi, veri, analiz, yorum ve yapay zekâ tarafından üretilen açıklamalar yalnızca genel bilgilendirme amaçlıdır; yatırım danışmanlığı, alım-satım önerisi veya menkul kıymet teklifi niteliği taşımaz. Yatırım danışmanlığı faaliyeti, 6362 sayılı Sermaye Piyasası Kanunu uyarınca yetkilendirilmiş kuruluşlarca, müşteri ile imzalanan yatırım danışmanlığı sözleşmesi çerçevesinde sunulur. FinAi yetkilendirilmiş bir kuruluş değildir ve bu faaliyeti yürütmez. Platformdaki içerikler kişisel mali durumunuza, risk ve getiri tercihlerinize uygun olmayabilir. Yatırım kararlarınız ve bunların sonuçları tamamen size aittir. Yatırımlarınız kayıp riski taşır, geçmiş performans gelecek sonuçların göstergesi değildir.
        </p>
      </section>

      {/* 4. Yapay Zekâ Destekli İçerik */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          4. Yapay Zekâ Destekli İçerik
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platformdaki yapay zekâ asistanının ürettiği açıklamalar otomatik olarak oluşturulur; hatalı, eksik veya güncel olmayan bilgi içerebilir. Bu içerikleri karar vermeden önce resmi kaynaklardan doğrulamak sizin sorumluluğunuzdadır.
        </p>
      </section>

      {/* 5. Veriler ve Veri Kaynakları */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          5. Veriler ve Veri Kaynakları
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platformdaki piyasa ve fon verileri (BIST, TEFAS vb.) üçüncü taraf kaynaklardan sağlanır. Verilerin doğruluğu, eksiksizliği ve anlık olması garanti edilmez; veri sağlayıcılarından kaynaklanan gecikme, kesinti ve hatalardan FinAi sorumlu değildir. Veriler yalnızca kişisel kullanımınız içindir; izinsiz kopyalanamaz, yeniden dağıtılamaz veya ticari amaçla kullanılamaz. İlgili üçüncü tarafların marka ve hakları kendilerine aittir.
        </p>
      </section>

      {/* 6. Üyelik ve Kullanıcı Yükümlülükleri */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          6. Üyelik ve Kullanıcı Yükümlülükleri
        </h2>
        <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
          <p>
            Üye olmak için 18 yaşını doldurmuş olmanız ve eksiksiz, doğru bilgi vermeniz gerekir.
          </p>
          <p>
            Hesabınızın ve şifrenizin güvenliğinden siz sorumlusunuz; yetkisiz kullanımı fark ettiğinizde derhâl <a href="mailto:finairesmi@gmail.com" className="text-blue-600 font-semibold hover:underline">finairesmi@gmail.com</a> adresine bildirin.
          </p>
          <p>
            Platformu yalnızca hukuka uygun amaçlarla kullanmayı kabul edersiniz. Otomatik araçlarla veri çekme (scraping), sistemi aşırı yükleme, güvenlik önlemlerini aşma, tersine mühendislik ve başkası adına hesap açma yasaktır.
          </p>
          <p>
            Platforma girdiğiniz portföy ve diğer verilerin sahibi sizsiniz. FinAi bu verileri yalnızca hizmeti sunmak için, <Link href="/legal/kvkk" className="text-blue-600 font-semibold hover:underline">Aydınlatma Metni</Link> ve Gizlilik Politikasında belirtilen şekilde işler.
          </p>
        </div>
      </section>

      {/* 7. Fikri Mülkiyet */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          7. Fikri Mülkiyet
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platformun yazılımı, tasarımı, logosu, metin ve içerikleri, analiz yöntemleri FinAi’ye aittir ve ilgili mevzuat kapsamında korunur. Platformu kullanma hakkınız münhasır olmayan, devredilemeyen, kişisel bir kullanım hakkıdır. Önceden yazılı izin olmaksızın içeriklerin çoğaltılması, değiştirilmesi, dağıtılması veya ticari amaçla kullanılması yasaktır.
        </p>
      </section>

      {/* 8. Sorumluluğun Sınırlandırılması */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          8. Sorumluluğun Sınırlandırılması
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FinAi, Platformun kesintisiz ve hatasız çalışacağını garanti etmez. Yasaların izin verdiği ölçüde, Platformun kullanımından veya kullanılamamasından, yatırım kararlarınızdan ya da üçüncü taraf verilerinden doğan doğrudan veya dolaylı zararlardan sorumlu değildir. Bu sınırlandırma, FinAi’nin kast veya ağır kusurundan doğan zararlar ile kanunen sınırlandırılamayan sorumluluklar için geçerli değildir.
        </p>
      </section>

      {/* 9. Hesabın Askıya Alınması ve Kapatılması */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          9. Hesabın Askıya Alınması ve Kapatılması
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Koşulları ihlal etmeniz hâlinde FinAi hesabınızı askıya alabilir veya kapatabilir. Siz de dilediğiniz zaman hesabınızı kapatabilirsiniz. Hesap kapatma ve veri silme talepleri Aydınlatma Metninde belirtilen yöntemle yapılır.
        </p>
      </section>

      {/* 10. Kişisel Veriler ve Çerezler */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          10. Kişisel Veriler ve Çerezler
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Kişisel verileriniz <Link href="/legal/kvkk" className="text-blue-600 font-semibold hover:underline">[Aydınlatma Metni]</Link> ve Çerez Politikası kapsamında işlenir.
        </p>
      </section>

      {/* 11. Mücbir Sebep */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          11. Mücbir Sebep
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Doğal afet, savaş, salgın, elektrik/internet kesintisi, siber saldırı, üçüncü taraf hizmet sağlayıcıların kesintisi gibi FinAi’nin makul kontrolü dışındaki olaylar nedeniyle ortaya çıkan aksaklıklardan FinAi sorumlu tutulamaz.
        </p>
      </section>

      {/* 12. Değişiklikler */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          12. Değişiklikler
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          FinAi Koşulları güncelleyebilir. Esaslı değişiklikler yürürlüğe girmeden önce e-posta veya Platform üzerinden bildirilir. Değişiklikleri kabul etmiyorsanız yürürlük tarihinden önce hesabınızı kapatabilirsiniz; Platformu kullanmaya devam etmeniz güncel Koşulları kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      {/* 13. Uygulanacak Hukuk ve Uyuşmazlık */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          13. Uygulanacak Hukuk ve Uyuşmazlık
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Bu Koşullara Türk hukuku uygulanır. Uyuşmazlıklarda, kanunen yetkili olan mahkemeler ve icra daireleri yetkilidir. Tüketici sıfatını taşıyan kullanıcıların kanundan doğan başvuru hakları (tüketici hakem heyeti ve tüketici mahkemeleri) saklıdır.
        </p>
      </section>

      {/* 14. Bölünebilirlik ve İletişim */}
      <section className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          14. Bölünebilirlik ve İletişim
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Koşulların bir hükmünün geçersiz sayılması diğer hükümleri etkilemez.
        </p>
        <p className="text-sm text-slate-700 font-medium">
          Sorularınız için: <a href="mailto:finairesmi@gmail.com" className="text-blue-600 font-bold hover:underline">finairesmi@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
