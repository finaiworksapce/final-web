import Link from "next/link";
import { Instagram, Twitter, Mail } from "lucide-react";
import { FinAiLogo } from "@/components/ui/logo";

export default function Footer() {
    return (
        <footer className="bg-[#0E1E38] mt-auto text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FinAiLogo className="h-12 w-auto [&_span]:text-white" />
                        </div>
                        <p className="text-sm text-white/80 font-medium leading-relaxed">
                            Borsa İstanbul portföyünüzü yapay zekâ ve canlı verilerle
                            tek bir panoda yönetin.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-white">Ürün</h3>
                        <ul className="space-y-2 text-sm text-white/80 font-medium">
                            <li><Link href="#features" className="hover:underline transition-colors text-white/80 hover:text-[#78B8F5]">Özellikler</Link></li>
                            <li><Link href="/login" className="hover:underline transition-colors text-white/80 hover:text-[#78B8F5]">Giriş Yap</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-white">Şirket</h3>
                        <ul className="space-y-2 text-sm text-white/80 font-medium">
                            <li><Link href="/about" className="hover:underline transition-colors text-white/80 hover:text-[#78B8F5]">Hakkımızda</Link></li>
                            <li><Link href="/legal/terms" className="hover:underline transition-colors text-white/80 hover:text-[#78B8F5]">Kullanım Şartları</Link></li>
                            <li><Link href="/legal/kvkk" className="hover:underline transition-colors text-white/80 hover:text-[#78B8F5]">KVKK Aydınlatma Metni</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-white">İletişim & Takip</h3>
                        <div className="flex items-center space-x-3">
                            {/* Instagram */}
                            <Link 
                                href="https://www.instagram.com/finaiworkspace/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="transition-all hover:scale-110"
                                aria-label="Instagram"
                            >
                                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md shadow-[#ee2a7b]/20">
                                    <Instagram className="w-5 h-5" />
                                </div>
                            </Link>

                            {/* Twitter (X) */}
                            <Link 
                                href="https://x.com/ResmiFinAi" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="transition-all hover:scale-110"
                                aria-label="Twitter (X)"
                            >
                                <div className="p-2 rounded-xl bg-[#1DA1F2] text-white shadow-md shadow-[#1DA1F2]/20">
                                    <Twitter className="w-5 h-5 fill-current" />
                                </div>
                            </Link>

                            {/* Mail Butonu */}
                            <a 
                                href="mailto:finairesmi@gmail.com" 
                                className="transition-all hover:scale-110"
                                aria-label="E-posta"
                                title="finairesmi@gmail.com"
                            >
                                <div className="p-2 rounded-xl bg-white/10 hover:bg-[#004BFA] text-white shadow-md transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                            </a>
                        </div>

                        {/* Ekstra Mail Adresi */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <a 
                                href="mailto:finairesmi@gmail.com"
                                className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-white transition-colors group"
                            >
                                <Mail className="w-4 h-4 text-[#78B8F5] group-hover:text-white transition-colors flex-shrink-0" />
                                <span className="font-mono break-all">finairesmi@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ÖNEMLİ YASAL UYARI */}
            <div className="border-t border-white/10 mt-8 pt-8 pb-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs text-white/70 leading-relaxed font-normal">
                        <strong className="text-white font-semibold">⚠️ ÖNEMLİ YASAL UYARI:</strong> Platformumuzda yer alan bilgiler, tahminler, analizler ve yapay zeka tarafından sunulan raporlar kesinlikle yatırım danışmanlığı kapsamında değildir. FinAi, 6362 sayılı Sermaye Piyasası Kanunu ve ilgili mevzuat uyarınca yatırım danışmanlığı faaliyeti yürütmemektedir. Sunulan veriler kullanıcıları bilgilendirme amaçlı olup, yatırım kararları tamamen kullanıcının sorumluluğundadır.
                    </p>
                </div>
            </div>

            {/* Alt Telif Yazısı (İnce Çizgisiz, Bütünleşik Mavi Arka Plan) */}
            <div className="py-6 px-4 text-center text-xs text-white/60 font-bold uppercase tracking-widest bg-[#0E1E38]">
                © {new Date().getFullYear()} FinAi. Tüm hakları saklıdır.
            </div>
        </footer>
    );
}
