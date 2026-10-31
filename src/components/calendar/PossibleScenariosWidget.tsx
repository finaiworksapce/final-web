'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    Scale, 
    Sparkles, 
    Compass,
    CheckCircle2,
    SlidersHorizontal,
    UserCircle2
} from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';
import { getIndicatorScenario, IndicatorScenarioItem } from '@/lib/indicator-scenarios-data';

interface PossibleScenariosWidgetProps {
    eventName: string;
    country?: string;
    className?: string;
}

type ScenarioTabKey = 'above' | 'parallel' | 'below';

interface TabConfig {
    key: ScenarioTabKey;
    label: string;
    subLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    glowColor: string;
}

const TABS: TabConfig[] = [
    {
        key: 'above',
        label: 'Beklentinin Üstünde',
        subLabel: 'Tahminleri Aşan Seyir',
        icon: TrendingUp,
        accentColor: '#00008B',
        badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badgeText: 'Yüksek Gerçekleşme',
        borderColor: 'border-emerald-200',
        glowColor: 'rgba(16, 185, 129, 0.08)'
    },
    {
        key: 'parallel',
        label: 'Beklentiye Paralel',
        subLabel: 'Piyasa Tahminiyle Uyumlu',
        icon: Scale,
        accentColor: '#00008B',
        badgeBg: 'bg-blue-50 border-blue-200 text-[#00008B]',
        badgeText: 'Sürprizsiz Denge',
        borderColor: 'border-blue-200',
        glowColor: 'rgba(0, 0, 139, 0.06)'
    },
    {
        key: 'below',
        label: 'Beklentinin Altında',
        subLabel: 'Tahminlerin Altında Seyir',
        icon: TrendingDown,
        accentColor: '#00008B',
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
        badgeText: 'Düşük Gerçekleşme',
        borderColor: 'border-amber-200',
        glowColor: 'rgba(245, 158, 11, 0.08)'
    }
];

export default function PossibleScenariosWidget({
    eventName,
    country,
    className = ''
}: PossibleScenariosWidgetProps) {
    const [activeTab, setActiveTab] = useState<ScenarioTabKey>('above');
    const { userName, user } = useUser();

    // Kullanıcının adını kibarca ve yalın şekilde ayıkla (Örn: "Salih KAVAKCI" -> "Salih")
    const cleanFirstName = useMemo(() => {
        const raw = userName || user?.user_metadata?.first_name || user?.user_metadata?.full_name || '';
        const trimmed = raw.trim();
        if (!trimmed) return '';
        const first = trimmed.split(/\s+/)[0] || '';
        // Unvanları temizle (Bey, Hanım vb. kesinlikle olmayacak kuralı)
        return first.replace(/^(bey|hanım|sayın)\s*/i, '');
    }, [userName, user]);

    // Göstergeye özel 3 senaryoyu veritabanından çek
    const scenario: IndicatorScenarioItem = useMemo(() => {
        return getIndicatorScenario(eventName, country);
    }, [eventName, country]);

    // Senaryo metnindeki {userName} etiketini doğal Türkçe akışıyla değiştir
    const activeRawText = scenario[activeTab] || '';
    
    // Metni parçalayıp kullanıcının adına özel vurgulu bir render hazırla
    const renderedContent = useMemo(() => {
        if (!activeRawText) return null;

        if (cleanFirstName) {
            // İsim varsa: {userName} etrafında böl ve kullanıcının ismini zarif bir vurguyla sun
            const parts = activeRawText.split('{userName}');
            if (parts.length > 1) {
                return (
                    <>
                        {parts[0]}
                        <span className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-blue-100/70 text-[#00008B] font-bold underline decoration-[#00008B]/30 decoration-2 underline-offset-2 transition-colors">
                            {cleanFirstName}
                        </span>
                        {parts.slice(1).join('')}
                    </>
                );
            }
            return activeRawText.replace(/\{userName\}/g, cleanFirstName);
        }

        // Kullanıcı giriş yapmamışsa veya isim yoksa akışı bozmadan {userName} ve çevresindeki virgülleri temizle
        const cleaned = activeRawText
            .replace(/,\s*\{userName\}\s*,/g, ',')
            .replace(/\s*\{userName\},\s*/g, ' ')
            .replace(/,\s*\{userName\}/g, '')
            .replace(/\{userName\}/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

        return cleaned;
    }, [activeRawText, cleanFirstName]);

    const currentTabConfig = TABS.find(t => t.key === activeTab) || TABS[0];
    const CurrentIcon = currentTabConfig.icon;

    return (
        <div className={`bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 ${className}`}>
            {/* BAŞLIK & ÜST BİLGİ ALANI */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-150">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                        <SlidersHorizontal className="w-5 h-5 text-[#00008B]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-[#00008B] tracking-tight">Olası Senaryolar</h2>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-[#00008B] border border-blue-200">
                                3 İhtimal Analizi
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold">
                            Veri Açıklandığında Bütçende ve Piyasada Neler Yaşanır?
                        </p>
                    </div>
                </div>

                {cleanFirstName ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold self-start sm:self-center">
                        <UserCircle2 className="w-4 h-4 text-[#00008B]" />
                        <span>Sana Özel: <strong className="text-[#00008B] font-extrabold">{cleanFirstName}</strong></span>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium self-start sm:self-center">
                        <Compass className="w-4 h-4 text-[#00008B]" />
                        <span>Kişiselleştirilmiş Reel Etki</span>
                    </div>
                )}
            </div>

            {/* 21ST.DEV ESİNTİLİ ETKİLEŞİMLİ SEGMENTED KONTROL (3 SEKME) */}
            <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 ${
                                isActive
                                    ? 'bg-white text-[#00008B] shadow-sm font-black border border-slate-200/70'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-bold'
                            }`}
                        >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isActive ? 'bg-blue-50 text-[#00008B]' : 'bg-slate-200/60 text-slate-500'
                            }`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs sm:text-[13px] leading-tight truncate">
                                    {tab.label}
                                </span>
                                <span className={`text-[10px] hidden sm:block truncate ${isActive ? 'text-slate-400 font-medium' : 'text-slate-400 font-normal'}`}>
                                    {tab.subLabel}
                                </span>
                            </div>

                            {isActive && (
                                <motion.div
                                    layoutId="activeScenarioIndicator"
                                    className="absolute -bottom-1 left-4 right-4 h-0.5 bg-[#00008B] rounded-full sm:hidden"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* AKTİF SENARYO KARTI */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="rounded-3xl border border-slate-200 p-6 md:p-7 bg-gradient-to-br from-white via-slate-50/40 to-slate-50/80 shadow-sm space-y-4"
                    >
                        {/* KART ÜST BİLGİ ŞERİDİ */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-150">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black border ${currentTabConfig.badgeBg}`}>
                                    <CurrentIcon className="w-3.5 h-3.5" />
                                    {currentTabConfig.label}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    {currentTabConfig.badgeText}
                                </span>
                            </div>

                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <Sparkles className="w-3.5 h-3.5 text-[#00008B]" />
                                FinAi Simülasyonu
                            </span>
                        </div>

                        {/* SENARYO METNİ (3-5 CÜMLE, REEL HAYAT -> MAKRO DENGE, JARGONSUZ) */}
                        <div className="pt-1">
                            <p className="text-[13px] sm:text-[14px] leading-relaxed text-slate-700 tracking-normal font-normal">
                                {renderedContent}
                            </p>
                        </div>

                        {/* ALT ÖZET BİLGİ ÇUBUĞU */}
                        <div className="pt-3 border-t border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Bireysel bütçe, kredi maliyetleri ve çarşı pazar dengesi dikkate alınmıştır.</span>
                            </div>
                            <span className="text-slate-400 font-medium">
                                Reel Hayat Analizi
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
