'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useUser } from '@/components/providers/UserProvider';
import { getIndicatorScenario, IndicatorScenarioItem } from '@/lib/indicator-scenarios-data';
import { cn } from '@/lib/utils';

interface PossibleScenariosWidgetProps {
    eventName: string;
    country?: string;
    className?: string;
}

type ScenarioTabKey = 'above' | 'parallel' | 'below';

interface TabItem {
    id: ScenarioTabKey;
    label: string;
}

const TABS: TabItem[] = [
    { id: 'above', label: 'Beklentinin Üstünde' },
    { id: 'parallel', label: 'Beklentiye Paralel' },
    { id: 'below', label: 'Beklentinin Altında' }
];

export default function PossibleScenariosWidget({
    eventName,
    country,
    className = ''
}: PossibleScenariosWidgetProps) {
    const [activeTab, setActiveTab] = useState<ScenarioTabKey>('above');
    const { userName, user } = useUser();

    // Kullanıcının adını sade bir şekilde ayıkla (unvansız: "Bey", "Hanım" vb. olmadan)
    const cleanFirstName = useMemo(() => {
        const raw = userName || user?.user_metadata?.first_name || user?.user_metadata?.full_name || '';
        const trimmed = raw.trim();
        if (!trimmed) return '';
        const first = trimmed.split(/\s+/)[0] || '';
        return first.replace(/^(bey|hanım|sayın)\s*/i, '');
    }, [userName, user]);

    // Göstergeye özel 3 senaryoyu veritabanından çek
    const scenario: IndicatorScenarioItem = useMemo(() => {
        return getIndicatorScenario(eventName, country);
    }, [eventName, country]);

    const activeRawText = scenario[activeTab] || '';

    // Metni düz metin olarak işle: İsim varsa düz yazı olarak yerleştir (kutulama veya alt çizgi yok), yoksa akıcı şekilde temizle
    const renderedContent = useMemo(() => {
        if (!activeRawText) return '';

        if (cleanFirstName) {
            return activeRawText.replace(/\{userName\}/g, cleanFirstName);
        }

        return activeRawText
            .replace(/,\s*\{userName\}\s*,/g, ',')
            .replace(/\s*\{userName\},\s*/g, ' ')
            .replace(/,\s*\{userName\}/g, '')
            .replace(/\{userName\}/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }, [activeRawText, cleanFirstName]);

    return (
        <div className={cn("bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4", className)}>
            {/* BAŞLIK */}
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4 text-[#00008B]" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-[#00008B] tracking-tight">Olası Senaryolar</h2>
                </div>
            </div>

            {/* ANIMATED TABS (21ST.DEV ESİNTİLİ GEÇİŞLİ BUTONLAR) */}
            <div className="flex gap-2 flex-wrap bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer select-none",
                                isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-scenario-tab"
                                    className="absolute inset-0 bg-[#00008B] rounded-xl shadow-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAM METİN İÇERİĞİ (TANIM BÖLÜMÜ İLE AYNI TİPOGRAFİ, ÇİZGİSİZ, FOTOĞRAFSIZ) */}
            <div className="pt-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                            x: -6,
                            filter: "blur(4px)",
                        }}
                        animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.98, x: -6, filter: "blur(4px)" }}
                        transition={{
                            duration: 0.35,
                            ease: "circInOut",
                            type: "spring",
                        }}
                    >
                        <p className="text-xs sm:text-[13px] font-normal text-slate-800 leading-relaxed tracking-normal">
                            {renderedContent}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
