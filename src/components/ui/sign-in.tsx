"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, BarChart3, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { LegalModal } from '@/components/ui/legal-modal';

// --- HELPER COMPONENTS ---

const TypingText = ({ text }: { text: string }) => {
  const characters = Array.from(text);
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  return (
    <motion.div
      className="flex overflow-hidden text-3xl md:text-5xl tracking-tight text-[#0E1E38] clash-title"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="ml-1 w-1 h-8 md:h-12 bg-[#004BFA] rounded-full"
      />
    </motion.div>
  );
};

// --- TYPE DEFINITIONS ---

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  features?: FeatureItem[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onResetPassword?: () => void;
  onToggleMode?: () => void;
  isLoginMode?: boolean;
  isVerifyingOtp?: boolean;
  isOtpSuccess?: boolean;
  onVerifyOtp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onResendOtp?: () => void;
  resendTimer?: number;
  emailError?: string;
  emailValue?: string;
  onEmailChange?: (val: string) => void;
  isForgotPasswordMode?: boolean;
  onForgotPassword?: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelForgotPassword?: () => void;
  isLoading?: boolean;
  isCheckingEmail?: boolean;
}

// --- SUB-COMPONENTS ---

const CleanInputWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-slate-200 bg-white transition-all duration-200 focus-within:border-[#004BFA] focus-within:ring-2 focus-within:ring-[#004BFA]/10 ${className}`}>
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title,
  description,
  heroImageSrc = "/logo.png",
  features = [],
  onSignIn,
  onResetPassword,
  onToggleMode,
  isLoginMode = true,
  isVerifyingOtp = false,
  isOtpSuccess = false,
  onVerifyOtp,
  onResendOtp,
  resendTimer = 0,
  emailError = "",
  emailValue = "",
  onEmailChange,
  isCheckingEmail = false,
  isForgotPasswordMode = false,
  onForgotPassword,
  onCancelForgotPassword,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // LEGAL MODAL STATE
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'kvkk'>('terms');

  // Şifre gücü hesaplama
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(passwordValue);
  const strengthColor = strength <= 25 ? "bg-rose-500" : strength <= 50 ? "bg-amber-500" : strength <= 75 ? "bg-emerald-500" : "bg-emerald-600";
  const strengthText = strength <= 25 ? "Zayıf" : strength <= 50 ? "Orta" : strength <= 75 ? "İyi" : "Güçlü";

  // AUTOMATED LEGAL FLOW LOGIC
  const [pendingSubmitEvent, setPendingSubmitEvent] = useState<React.FormEvent<HTMLFormElement> | null>(null);
  const [hasApprovedTerms, setHasApprovedTerms] = useState(false);
  const [hasApprovedKVKK, setHasApprovedKVKK] = useState(false);
  const [isAutoFlow, setIsAutoFlow] = useState(false);

  const openLegal = (tab: 'terms' | 'kvkk' = 'terms', auto: boolean = false) => {
      setLegalTab(tab);
      setIsAutoFlow(auto);
      setIsLegalModalOpen(true);
  };

  const handleActionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCheckingEmail) return;
    if (emailError) return;
    
    if (!isLoginMode && !termsAccepted) {
      setPendingSubmitEvent(e);
      if (!hasApprovedTerms) {
        openLegal('terms', true);
        return;
      }
      if (!hasApprovedKVKK) {
        openLegal('kvkk', true);
        return;
      }
    }

    onSignIn?.(e);
  };

  const handleLegalApprove = () => {
    if (legalTab === 'terms') {
      setHasApprovedTerms(true);
      if (isAutoFlow && !hasApprovedKVKK) {
          setLegalTab('kvkk');
          return;
      }
    } else {
      setHasApprovedKVKK(true);
      if (isAutoFlow && !hasApprovedTerms) {
          setLegalTab('terms');
          return;
      }
    }

    setIsLegalModalOpen(false);

    if ((legalTab === 'terms' ? true : hasApprovedTerms) && 
        (legalTab === 'kvkk' ? true : hasApprovedKVKK)) {
      setTermsAccepted(true);
      if (isAutoFlow && pendingSubmitEvent) {
          const event = pendingSubmitEvent;
          setTimeout(() => {
              onSignIn?.(event);
              setPendingSubmitEvent(null);
          }, 150);
      }
    }
  };

  const handleLegalReject = () => {
    setIsLegalModalOpen(false);
    setPendingSubmitEvent(null);
    setIsAutoFlow(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-clash w-full bg-white text-[#0E1E38] selection:bg-blue-100 selection:text-[#0E1E38]">
      
      {/* =========================================================================
          SOL KOLON: GİRİŞ / KAYIT FORMU (TEMİZ, BEYAZ, BORDERLESS)
          ========================================================================= */}
      <section className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 min-h-screen">
        
        {/* Üst Navigasyon / Geri Dön */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#0E1E38] uppercase tracking-wider transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>

        {/* Merkez: Form Alanı */}
        <div className="w-full max-w-md mx-auto my-auto py-6">
          <div className="space-y-6">
            
            {/* Başlık ve Açıklama */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-normal text-[#0E1E38] tracking-tight clash-title">
                {isForgotPasswordMode ? (
                  "Şifremi Unuttum"
                ) : isVerifyingOtp ? (
                  "E-postanızı Doğrulayın"
                ) : isLoginMode ? (
                  title || "FinAi'ye Hoş Geldiniz"
                ) : (
                  "Hesabınızı Oluşturun"
                )}
              </h1>
              
              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mt-2">
                {isForgotPasswordMode
                  ? "Yeni şifre oluşturmak için kayıtlı e-posta adresinizi girin."
                  : isVerifyingOtp
                  ? "E-posta adresinize gönderilen 8 haneli güvenlik kodunu girin."
                  : isLoginMode
                  ? (description || "Hesabınıza giriş yaparak Borsa İstanbul portföyünüzü anlık takip edin.")
                  : "1 dakikada ücretsiz üye olun, yatırımlarınızın tam kontrolünü elinize alın."}
              </p>
            </div>

            {/* FORMLAR */}
            {isForgotPasswordMode ? (
              <form key="forgot-password" className="space-y-4" onSubmit={onForgotPassword}>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    Kayıtlı E-Posta Adresi
                  </label>
                  <CleanInputWrapper>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="ornek@mail.com"
                      className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400"
                    />
                  </CleanInputWrapper>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#0E1E38] hover:bg-[#004BFA] py-3.5 sm:py-4 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#0E1E38]/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => onCancelForgotPassword?.()}
                    className="text-xs font-semibold text-slate-500 hover:text-[#0E1E38] transition-colors"
                  >
                    Geri Dön
                  </button>
                </div>
              </form>
            ) : isVerifyingOtp ? (
              <form key="otp" className="space-y-4" onSubmit={onVerifyOtp}>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    Doğrulama Kodu
                  </label>
                  <CleanInputWrapper>
                    <input
                      name="otpCode"
                      type="text"
                      maxLength={8}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-center text-2xl font-bold tracking-[0.25em] p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38]"
                    />
                  </CleanInputWrapper>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isOtpSuccess}
                  className="w-full rounded-xl bg-[#0E1E38] hover:bg-[#004BFA] py-3.5 sm:py-4 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#0E1E38]/10 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Doğrulanıyor..." : "Hesabı Onayla"}
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={onResendOtp}
                    disabled={isLoading || resendTimer > 0}
                    className="text-xs font-semibold text-[#004BFA] hover:underline disabled:text-slate-400 disabled:no-underline transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Kodu Tekrar Gönder</span>
                    {resendTimer > 0 && (
                      <span className="px-1.5 py-0.5 bg-blue-50 text-[#004BFA] rounded text-[10px] font-bold">
                        {resendTimer}s
                      </span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form key={isLoginMode ? "login" : "register"} className="space-y-4" onSubmit={handleActionSubmit}>
                
                {/* Ad & Soyad (Sadece Kayıt Modu) */}
                {!isLoginMode && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                        Ad
                      </label>
                      <CleanInputWrapper>
                        <input
                          name="firstName"
                          type="text"
                          required
                          placeholder="Adınız"
                          className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400"
                        />
                      </CleanInputWrapper>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                        Soyad
                      </label>
                      <CleanInputWrapper>
                        <input
                          name="lastName"
                          type="text"
                          required
                          placeholder="Soyadınız"
                          className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400"
                        />
                      </CleanInputWrapper>
                    </div>
                  </div>
                )}

                {/* E-Posta */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    E-Posta Adresi
                  </label>
                  <CleanInputWrapper className={emailError && !isLoginMode ? "border-rose-400 bg-rose-50/20" : ""}>
                    <input 
                      name="email" 
                      type="email" 
                      required 
                      placeholder="ornek@mail.com" 
                      value={emailValue}
                      onChange={(e) => onEmailChange?.(e.target.value)}
                      className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400" 
                    />
                  </CleanInputWrapper>
                  {emailError && !isLoginMode && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5">
                      ⚠️ {emailError}
                    </p>
                  )}
                </div>

                {/* Şifre */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                    Şifre
                  </label>
                  <CleanInputWrapper>
                    <div className="relative">
                      <input 
                        name="password" 
                        type={showPassword ? 'text' : 'password'} 
                        required 
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-transparent text-sm p-3.5 sm:p-4 pr-11 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </CleanInputWrapper>

                  {/* Şifre Güç Göstergesi (Sadece Kayıt) */}
                  {!isLoginMode && passwordValue && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[11px] font-medium">
                        <span className="text-slate-400">Şifre Gücü</span>
                        <span className={strength > 50 ? "text-emerald-600" : "text-amber-600"}>{strengthText}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${strength}%` }}
                          className={`h-full ${strengthColor} transition-all duration-300`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Şifre Tekrar (Kayıt Modu) */}
                {!isLoginMode && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
                      Şifre Tekrar
                    </label>
                    <CleanInputWrapper>
                      <input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm p-3.5 sm:p-4 rounded-xl focus:outline-none text-[#0E1E38] placeholder:text-slate-400"
                      />
                    </CleanInputWrapper>
                  </div>
                )}

                {/* KVKK ve Kullanım Koşulları (Kayıt Modu) */}
                {!isLoginMode && (
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        name="kvkk" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#004BFA] focus:ring-[#004BFA]" 
                      />
                      <span className="text-xs text-slate-600 leading-relaxed select-none">
                        <button type="button" onClick={() => openLegal('terms')} className="text-[#0E1E38] font-semibold underline underline-offset-2 hover:text-[#004BFA]">Kullanım Koşulları</button> ve <button type="button" onClick={() => openLegal('kvkk')} className="text-[#0E1E38] font-semibold underline underline-offset-2 hover:text-[#004BFA]">KVKK Aydınlatma Metnini</button> okudum, kabul ediyorum.
                      </span>
                    </label>
                  </div>
                )}

                {/* Beni Hatırla & Şifremi Unuttum (Giriş Modu) */}
                {isLoginMode && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        className="w-4 h-4 rounded border-slate-300 text-[#004BFA] focus:ring-[#004BFA]"
                      />
                      <span className="text-slate-600 font-medium">Beni hatırla</span>
                    </label>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); onResetPassword?.(); }}
                      className="text-[#004BFA] font-medium hover:underline"
                    >
                      Şifremi unuttum
                    </button>
                  </div>
                )}

                {/* Ana Buton */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#0E1E38] hover:bg-[#004BFA] py-3.5 sm:py-4 text-white text-sm font-semibold transition-all duration-200 active:scale-[0.99] shadow-md shadow-[#0E1E38]/10 hover:shadow-lg disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isLoading ? "İşlem Yapılıyor..." : (isLoginMode ? "Giriş Yap" : "Ücretsiz Hesap Oluştur")}
                </button>
              </form>
            )}

            {/* Mod Değiştirici */}
            {!isVerifyingOtp && !isForgotPasswordMode && (
              <div className="pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
                <span>{isLoginMode ? "Hesabınız yok mu?" : "Zaten bir hesabınız var mı?"}</span>
                <button
                  type="button"
                  onClick={() => onToggleMode?.()}
                  className="text-[#004BFA] font-semibold hover:underline ml-1.5"
                >
                  {isLoginMode ? "Ücretsiz Hesap Oluştur" : "Giriş Yap"}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} FinAi. Tüm hakları saklıdır.
        </div>
      </section>

      {/* =========================================================================
          SAĞ KOLON: DEEP NAVY MARKA VİTRİNİ & EDİTORYAL PANEL (ÇERÇEVESİZ, 0 AI SLOP)
          ========================================================================= */}
      <section className="hidden lg:flex flex-1 relative bg-[#0E1E38] text-white p-12 xl:p-16 flex-col justify-between overflow-hidden select-none">
        
        {/* Zarif Arka Plan Işıltısı */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#004BFA]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-[#78B8F5]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Üst: 3D Logo ve Rozet */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.img 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src="/logo.png" 
              alt="FinAi Logo" 
              className="w-12 h-12 object-contain drop-shadow-[0_10px_25px_rgba(0,75,250,0.35)]" 
            />
            <span className="text-2xl font-bold tracking-tight text-white clash-title">FinAi</span>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wider uppercase border border-white/10">
            Karar Destek Ekosistemi
          </span>
        </div>

        {/* Orta: Editoryal Manifesto ve Analitik Bloklar */}
        <div className="relative z-10 my-auto py-10 space-y-8 max-w-xl">
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-normal text-white tracking-tight leading-snug clash-title">
              "Piyasa gürültüsünü rasyonel verilere, yatırımlarınızı bilinçli kararlara dönüştürün."
            </h2>
            <p className="text-base text-white/70 font-normal leading-relaxed">
              Borsa İstanbul piyasasında hisse portföyünüzü canlı seans verileriyle takip edin, 
              matematiksel korelasyonlar ve yapay zeka analizleriyle kontrolü elinize alın.
            </p>
          </div>

          {/* Somut Analitik Kabiliyetler (Çerçevesiz, Doğrudan Bilgi) */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA] mt-2 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Canlı Portföy Konsolidasyonu</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                  BIST 100 hisselerinizi ve şirket çarpanlarınızı tek ekranda güncel fiyatlarla yönetin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA] mt-2 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Korelasyon & Risk Dağılımı</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                  Varlıklarınız arasındaki matematiksel ilişkileri ve senaryo dayanıklılıklarını analiz edin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004BFA] mt-2 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">Akıllı KAP & Bilanço Bildirimleri</h4>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">
                  Yatırımlarınızı doğrudan etkileyebilecek şirket bildirimlerini ve temettü takvimini anında yakalayın.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alt: Yasal Uyarı Notu */}
        <div className="relative z-10 pt-6 border-t border-white/10">
          <p className="text-[11px] text-white/50 leading-relaxed">
            ⚠️ 6362 sayılı Sermaye Piyasası Kanunu uyarınca yatırım danışmanlığı faaliyeti yürütülmemektedir. 
            Sunulan veriler ve analizler kullanıcıları bilgilendirme amaçlıdır.
          </p>
        </div>
      </section>

      {/* Yasal Modal */}
      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
        initialTab={legalTab} 
        onApprove={handleLegalApprove}
        onReject={handleLegalReject}
      />

      {/* Başarı Animasyon Katmanı */}
      <AnimatePresence>
        {isOtpSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-xl"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-20 h-20 bg-[#0E1E38] rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-[#0E1E38]/30 mb-8"
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>
              
              <TypingText text="FinAi'ye Hoş Geldiniz" />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-slate-500 font-medium"
              >
                Yatırım asistanınız hazırlanıyor...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
