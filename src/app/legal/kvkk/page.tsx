import React from 'react';

export default function KVKKPage() {
  return (
    <div className="space-y-10 not-prose">
      {/* Başlık ve Giriş */}
      <section className="border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          FinAi Kullanıcı Aydınlatma Metni
        </h1>
        <p className="text-slate-600 leading-relaxed text-base">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) m.10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, kişisel verilerinizin işlenmesine ilişkin bilgilendirme aşağıdadır.
        </p>
      </section>

      {/* 1. Veri Sorumlusu */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          1. Veri Sorumlusu
        </h2>
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-sm text-slate-700 space-y-1.5">
          <p><strong>Veri Sorumlusu:</strong> Salih Kavakcı (“Veri Sorumlusu”)</p>
          <p><strong>Adres:</strong> Denizli, Pamukkale, Bağbaşı Mahallesi, 1042. Sokak, No:2/ Daire:2</p>
          <p><strong>E-posta:</strong> <a href="mailto:finairesmi@gmail.com" className="text-blue-600 font-semibold hover:underline">finairesmi@gmail.com</a></p>
        </div>
      </section>

      {/* 2. İşlenen Kişisel Veriler */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          2. İşlenen Kişisel Veriler
        </h2>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <span><strong className="text-slate-900">Kimlik:</strong> ad, soyad</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <span><strong className="text-slate-900">İletişim:</strong> e-posta adresi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <span><strong className="text-slate-900">Finansal:</strong> sizin girdiğiniz portföy bilgileri (BIST hisseleri, TEFAS fonları ve yatırım tutarları)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <span><strong className="text-slate-900">İşlem güvenliği:</strong> IP adresi, giriş tarih ve saat kayıtları</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
            <span><strong className="text-slate-900">Kullanım:</strong> yapay zekâ asistanına yönelttiğiniz sorular ve asistanın ürettiği yanıtlar</span>
          </li>
        </ul>
      </section>

      {/* 3. İşleme Amaçları ve Hukuki Sebepler */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          3. İşleme Amaçları ve Hukuki Sebepler
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Üyeliğin oluşturulması ve yönetilmesi, platform hizmetlerinin sunulması, işleme amacıyla yürütülür; hukuki sebebi sözleşmenin kurulması veya ifasıdır (m.5/2-c).
          </p>
          <p>
            Portföy takibi, performans raporlaması ve yapay zekâ destekli analizlerin sunulması, işleme amacıyla yürütülür; hukuki sebebi sözleşmenin ifasıdır (m.5/2-c).
          </p>
          <p>
            Hesap ve bilgi güvenliğinin sağlanması, kötüye kullanımın önlenmesi, işleme amacıyla yürütülür; hukuki sebebi meşru menfaattir (m.5/2-f).
          </p>
          <p>
            IP ve giriş kayıtlarının tutulması, yetkili mercilerin taleplerinin karşılanması, işleme amacıyla yürütülür; hukuki sebebi hukuki yükümlülüktür (m.5/2-ç).
          </p>
        </div>
      </section>

      {/* 4. Toplama Yöntemi */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          4. Toplama Yöntemi
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Kişisel verileriniz web sitemiz üzerinden elektronik ortamda; üyelik formu, portföy giriş ekranları ve yapay zekâ asistanı aracılığıyla sizin girişinizle, IP ve giriş kayıtları ise otomatik yollarla toplanır.
        </p>
      </section>

      {/* 5. Verilerin Aktarımı */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          5. Verilerin Aktarımı
        </h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Kişisel verileriniz yalnızca yukarıdaki amaçlarla ve aşağıdaki alıcı gruplarına aktarılır:
          </p>
          <p>
            <strong>Barındırma ve veri tabanı hizmet sağlayıcısı:</strong> Verileriniz, Avrupa Birliği bölgesindeki sunucularda barındırılır. Hizmet sağlayıcının yurt dışında yerleşik olması nedeniyle bu işlem KVKK m.9 kapsamında yurt dışına aktarım niteliği taşır.
          </p>
          <p>
            Yurt dışına aktarımlar KVKK m.9 uyarınca; yeterlilik kararı bulunması hâlinde bu karara, bulunmaması hâlinde Kurulca öngörülen uygun güvencelerden (standart sözleşme vb.) birine dayanılarak yapılır.
          </p>
          <p>
            Kişisel verileriniz ticari amaçla satılmaz veya üçüncü kişilerle paylaşılmaz.
          </p>
        </div>
      </section>

      {/* 6. Saklama Süresi */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          6. Saklama Süresi
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Verileriniz üyeliğiniz süresince saklanır. Üyeliğin sona ermesinden sonra 10 yıl veya ilgili mevzuatın öngördüğü süre boyunca saklanır; sürenin dolmasının ardından silinir, yok edilir veya anonim hâle getirilir.
        </p>
      </section>

      {/* 7. Yapay Zekâ ile Yapılan Analizler */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          7. Yapay Zekâ ile Yapılan Analizler
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Platformdaki yapay zekâ asistanı portföy verilerinizi otomatik yollarla analiz eder. Bu analizler bilgilendirme amaçlıdır; yatırım tavsiyesi niteliği taşımaz ve hukuki sonuç doğuran veya sizi önemli ölçüde etkileyen bir karar mekanizması değildir. Analiz sonuçlarına itiraz hakkınız saklıdır.
        </p>
      </section>

      {/* 8. Haklarınız (KVKK m.11) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          8. Haklarınız (KVKK m.11)
        </h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>İşlenmişse buna ilişkin bilgi talep etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>Eksik veya yanlış işlenmişse düzeltilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>Düzeltme, silme ve yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>İşlenen verilerin otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonuç çıkmasına itiraz etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
            <span>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</span>
          </li>
        </ul>
      </section>

      {/* 9. Başvuru Yöntemi */}
      <section className="space-y-3 bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          9. Başvuru Yöntemi
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Haklarınıza ilişkin taleplerinizi <a href="mailto:finairesmi@gmail.com" className="text-blue-600 font-bold hover:underline">finairesmi@gmail.com</a> üzerinden yazılı olarak iletebilirsiniz. Başvurular, talebin niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
        </p>
      </section>
    </div>
  );
}
