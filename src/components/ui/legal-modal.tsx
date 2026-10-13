import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  initialTab?: 'terms' | 'kvkk';
}

export const LegalModal = ({ isOpen, onClose, onApprove, onReject, initialTab = 'terms' }: LegalModalProps) => {
  const [activeTab, setActiveTab] = React.useState<'terms' | 'kvkk'>(initialTab);

  // Modal her açıldığında gelen initialTab'e göre güncelle
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00008B] flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 tracking-tight text-lg">Yasal Bilgilendirme</h2>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('terms')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                        activeTab === 'terms'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      Kullanım Koşulları
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('kvkk')}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                        activeTab === 'kvkk'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      KVKK Aydınlatma Metni
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'terms' ? (
                  <motion.div 
                    key="terms"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-slate-700 text-sm leading-relaxed"
                  >
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                        FinAi Kullanım Koşulları
                      </h3>
                    </div>

                    {/* ÖNEMLİ YASAL UYARI BANNER */}
                    <div className="bg-amber-50 border-2 border-amber-200/90 rounded-2xl p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2 mb-2">
                        <span>⚠️</span> ÖNEMLİ YASAL UYARI
                      </h4>
                      <p className="text-amber-900 text-xs font-medium leading-relaxed m-0">
                        Platformumuzda yer alan bilgiler, tahminler, analizler ve yapay zeka tarafından sunulan raporlar kesinlikle yatırım danışmanlığı kapsamında değildir. FinAi, 6362 sayılı Sermaye Piyasası Kanunu ve ilgili mevzuat uyarınca yatırım danışmanlığı faaliyeti yürütmemektedir. Sunulan veriler kullanıcıları bilgilendirme amaçlı olup, yatırım kararları tamamen kullanıcının sorumluluğundadır.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">1. Taraflar ve Kabul</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Bu Kullanım Koşulları (“Koşullar”), https://www.finai.net.tr/ adresinde sunulan FinAi platformunu (“Platform”) işleten Salih Kavakcı (“FinAi”) ile Platforma üye olan veya Platformu kullanan kişi (“Kullanıcı”) arasındadır. Şirketleşme tamamlandığında hizmet sağlayıcı ticari unvan ve MERSİS numarasıyla güncellenecektir. Üyelik sırasında Koşulları onaylayarak bu Koşulları kabul etmiş olursunuz. Üyeliğin sona ermesinden sonra Koşulların kullanıcıyı ilgilendiren hükümleri (fikri mülkiyet, sorumluluk vb.) geçerliliğini korur.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">2. Hizmetin Tanımı</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platform; varlık takibi, portföy görüntüleme, ekonomik takvim, haber ve veri açıklamaları ile yapay zekâ destekli finansal bilgi açıklamaları sunan bir bilgilendirme ve finansal okuryazarlık aracıdır. Hizmet şu anda ücretsiz sunulmaktadır. FinAi, hizmetin kapsamını değiştirebilir veya ücretli özellikler ekleyebilir. Ücretli bir hizmete geçilmesi hâlinde bu, ayrıca ve önceden bildirilir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">3. Yatırım Danışmanlığı Değildir</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platformda yer alan bilgi, veri, analiz, yorum ve yapay zekâ tarafından üretilen açıklamalar yalnızca genel bilgilendirme amaçlıdır; yatırım danışmanlığı, alım-satım önerisi veya menkul kıymet teklifi niteliği taşımaz. Yatırım danışmanlığı faaliyeti, 6362 sayılı Sermaye Piyasası Kanunu uyarınca yetkilendirilmiş kuruluşlarca, müşteri ile imzalanan yatırım danışmanlığı sözleşmesi çerçevesinde sunulur. FinAi yetkilendirilmiş bir kuruluş değildir ve bu faaliyeti yürütmez. Platformdaki içerikler kişisel mali durumunuza, risk ve getiri tercihlerinize uygun olmayabilir. Yatırım kararlarınız ve bunların sonuçları tamamen size aittir. Yatırımlarınız kayıp riski taşır, geçmiş performans gelecek sonuçların göstergesi değildir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">4. Yapay Zekâ Destekli İçerik</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platformdaki yapay zekâ asistanının ürettiği açıklamalar otomatik olarak oluşturulur; hatalı, eksik veya güncel olmayan bilgi içerebilir. Bu içerikleri karar vermeden önce resmi kaynaklardan doğrulamak sizin sorumluluğunuzdadır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">5. Veriler ve Veri Kaynakları</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platformdaki piyasa ve fon verileri (BIST, TEFAS vb.) üçüncü taraf kaynaklardan sağlanır. Verilerin doğruluğu, eksiksizliği ve anlık olması garanti edilmez; veri sağlayıcılarından kaynaklanan gecikme, kesinti ve hatalardan FinAi sorumlu değildir. Veriler yalnızca kişisel kullanımınız içindir; izinsiz kopyalanamaz, yeniden dağıtılamaz veya ticari amaçla kullanılamaz. İlgili üçüncü tarafların marka ve hakları kendilerine aittir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">6. Üyelik ve Kullanıcı Yükümlülükleri</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Üye olmak için 18 yaşını doldurmuş olmanız ve eksiksiz, doğru bilgi vermeniz gerekir. Hesabınızın ve şifrenizin güvenliğinden siz sorumlusunuz; yetkisiz kullanımı fark ettiğinizde derhâl finairesmi@gmail.com adresine bildirin. Platformu yalnızca hukuka uygun amaçlarla kullanmayı kabul edersiniz. Otomatik araçlarla veri çekme (scraping), sistemi aşırı yükleme, güvenlik önlemlerini aşma, tersine mühendislik ve başkası adına hesap açma yasaktır. Platforma girdiğiniz portföy ve diğer verilerin sahibi sizsiniz. FinAi bu verileri yalnızca hizmeti sunmak için, Aydınlatma Metni ve Gizlilik Politikasında belirtilen şekilde işler.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">7. Fikri Mülkiyet</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platformun yazılımı, tasarımı, logosu, metin ve içerikleri, analiz yöntemleri FinAi’ye aittir ve ilgili mevzuat kapsamında korunur. Platformu kullanma hakkınız münhasır olmayan, devredilemeyen, kişisel bir kullanım hakkıdır. Önceden yazılı izin olmaksızın içeriklerin çoğaltılması, değiştirilmesi, dağıtılması veya ticari amaçla kullanılması yasaktır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">8. Sorumluluğun Sınırlandırılması</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          FinAi, Platformun kesintisiz ve hatasız çalışacağını garanti etmez. Yasaların izin verdiği ölçüde, Platformun kullanımından veya kullanılamamasından, yatırım kararlarınızdan ya da üçüncü taraf verilerinden doğan doğrudan veya dolaylı zararlardan sorumlu değildir. Bu sınırlandırma, FinAi’nin kast veya ağır kusurundan doğan zararlar ile kanunen sınırlandırılamayan sorumluluklar için geçerli değildir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">9. Hesabın Askıya Alınması ve Kapatılması</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Koşulları ihlal etmeniz hâlinde FinAi hesabınızı askıya alabilir veya kapatabilir. Siz de dilediğiniz zaman hesabınızı kapatabilirsiniz. Hesap kapatma ve veri silme talepleri Aydınlatma Metninde belirtilen yöntemle yapılır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">10. Kişisel Veriler ve Çerezler</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Kişisel verileriniz [Aydınlatma Metni] ve [Çerez Politikası] kapsamında işlenir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">11. Mücbir Sebep</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Doğal afet, savaş, salgın, elektrik/internet kesintisi, siber saldırı, üçüncü taraf hizmet sağlayıcıların kesintisi gibi FinAi’nin makul kontrolü dışındaki olaylar nedeniyle ortaya çıkan aksaklıklardan FinAi sorumlu tutulamaz.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">12. Değişiklikler</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          FinAi Koşulları güncelleyebilir. Esaslı değişiklikler yürürlüğe girmeden önce e-posta veya Platform üzerinden bildirilir. Değişiklikleri kabul etmiyorsanız yürürlük tarihinden önce hesabınızı kapatabilirsiniz; Platformu kullanmaya devam etmeniz güncel Koşulları kabul ettiğiniz anlamına gelir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">13. Uygulanacak Hukuk ve Uyuşmazlık</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Bu Koşullara Türk hukuku uygulanır. Uyuşmazlıklarda, kanunen yetkili olan mahkemeler ve icra daireleri yetkilidir. Tüketici sıfatını taşıyan kullanıcıların kanundan doğan başvuru hakları (tüketici hakem heyeti ve tüketici mahkemeleri) saklıdır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">14. Bölünebilirlik ve İletişim</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Koşulların bir hükmünün geçersiz sayılması diğer hükümleri etkilemez. Sorularınız için: <strong className="text-slate-800">finairesmi@gmail.com</strong>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="kvkk"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-slate-700 text-sm leading-relaxed"
                  >
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                        FinAi Kullanıcı Aydınlatma Metni
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) m.10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca, kişisel verilerinizin işlenmesine ilişkin bilgilendirme aşağıdadır.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">1. Veri Sorumlusu</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Salih Kavakcı (“Veri Sorumlusu”)<br/>
                          Adres: Denizli, Pamukkale, Bağbaşı Mahallesi, 1042. Sokak, No:2/ Daire:2<br/>
                          E-posta: finairesmi@gmail.com
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">2. İşlenen Kişisel Veriler</h4>
                        <ul className="text-slate-600 text-xs space-y-1 pl-4 list-disc">
                          <li><strong>Kimlik:</strong> ad, soyad</li>
                          <li><strong>İletişim:</strong> e-posta adresi</li>
                          <li><strong>Finansal:</strong> sizin girdiğiniz portföy bilgileri (BIST hisseleri, TEFAS fonları ve yatırım tutarları)</li>
                          <li><strong>İşlem güvenliği:</strong> IP adresi, giriş tarih ve saat kayıtları</li>
                          <li><strong>Kullanım:</strong> yapay zekâ asistanına yönelttiğiniz sorular ve asistanın ürettiği yanıtlar</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">3. İşleme Amaçları ve Hukuki Sebepler</h4>
                        <div className="text-slate-600 text-xs space-y-1.5 leading-relaxed">
                          <p>• Üyeliğin oluşturulması ve yönetilmesi, platform hizmetlerinin sunulması, işleme amacıyla yürütülür; hukuki sebebi sözleşmenin kurulması veya ifasıdır (m.5/2-c).</p>
                          <p>• Portföy takibi, performans raporlaması ve yapay zekâ destekli analizlerin sunulması, işleme amacıyla yürütülür; hukuki sebebi sözleşmenin ifasıdır (m.5/2-c).</p>
                          <p>• Hesap ve bilgi güvenliğinin sağlanması, kötüye kullanımın önlenmesi, işleme amacıyla yürütülür; hukuki sebebi meşru menfaattir (m.5/2-f).</p>
                          <p>• IP ve giriş kayıtlarının tutulması, yetkili mercilerin taleplerinin karşılanması, işleme amacıyla yürütülür; hukuki sebebi hukuki yükümlülüktür (m.5/2-ç).</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">4. Toplama Yöntemi</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Kişisel verileriniz web sitemiz üzerinden elektronik ortamda; üyelik formu, portföy giriş ekranları ve yapay zekâ asistanı aracılığıyla sizin girişinizle, IP ve giriş kayıtları ise otomatik yollarla toplanır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">5. Verilerin Aktarımı</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Kişisel verileriniz yalnızca yukarıdaki amaçlarla ve aşağıdaki alıcı gruplarına aktarılır:<br/>
                          <strong>Barındırma ve veri tabanı hizmet sağlayıcısı:</strong> Verileriniz, Avrupa Birliği bölgesindeki sunucularda barındırılır. Hizmet sağlayıcının yurt dışında yerleşik olması nedeniyle bu işlem KVKK m.9 kapsamında yurt dışına aktarım niteliği taşır. Yurt dışına aktarımlar KVKK m.9 uyarınca; yeterlilik kararı bulunması hâlinde bu karara, bulunmaması hâlinde Kurulca öngörülen uygun güvencelerden (standart sözleşme vb.) birine dayanılarak yapılır. Kişisel verileriniz ticari amaçla satılmaz veya üçüncü kişilerle paylaşılmaz.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">6. Saklama Süresi</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Verileriniz üyeliğiniz süresince saklanır. Üyeliğin sona ermesinden sonra 10 yıl veya ilgili mevzuatın öngördüğü süre boyunca saklanır; sürenin dolmasının ardından silinir, yok edilir veya anonim hâle getirilir.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">7. Yapay Zekâ ile Yapılan Analizler</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Platformdaki yapay zekâ asistanı portföy verilerinizi otomatik yollarla analiz eder. Bu analizler bilgilendirme amaçlıdır; yatırım tavsiyesi niteliği taşımaz ve hukuki sonuç doğuran veya sizi önemli ölçüde etkileyen bir karar mekanizması değildir. Analiz sonuçlarına itiraz hakkınız saklıdır.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">8. Haklarınız (KVKK m.11)</h4>
                        <ul className="text-slate-600 text-xs space-y-1 pl-4 list-disc">
                          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                          <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                          <li>KVKK m.7 kapsamında silinmesini veya yok edilmesini isteme</li>
                          <li>Düzeltme, silme ve yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</li>
                          <li>İşlenen verilerin otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonuç çıkmasına itiraz etme</li>
                          <li>Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">9. Başvuru Yöntemi</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          Haklarınıza ilişkin taleplerinizi <strong className="text-slate-800">finairesmi@gmail.com</strong> üzerinden yazılı olarak iletebilirsiniz. Başvurular, talebin niteliğine göre en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex gap-4 items-center justify-end bg-slate-50/50">
              <button 
                type="button"
                onClick={onReject || onClose}
                className="px-6 py-3 rounded-xl text-slate-500 font-bold text-sm hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
              >
                Kapat
              </button>
              {onApprove && (
                <button 
                  type="button"
                  onClick={onApprove}
                  className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Onaylıyorum
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
