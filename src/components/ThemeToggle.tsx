"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className={`w-8 h-8 rounded-xl bg-slate-100/50 flex items-center justify-center opacity-50 ${className}`}
                aria-hidden="true"
            >
                <div className="w-4 h-4 rounded-full bg-slate-300 animate-pulse" />
            </div>
        );
    }

    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Aydınlık Moda Geç" : "Koyu Moda Geç"}
            title={isDark ? "Aydınlık Moda Geç" : "Koyu Moda Geç"}
            className={`flex items-center gap-2 p-1.5 md:p-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004BFA]/50 cursor-pointer ${
                isDark 
                    ? "bg-[#040989]/50 hover:bg-[#040989] text-[#F5F7FA] border border-[#5B80FF]/30 shadow-xs shadow-blue-500/10" 
                    : "bg-[#F5F7FA] hover:bg-[#D6E4FF]/60 text-[#040989] border border-[#D6E4FF] shadow-2xs"
            } ${className}`}
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                {isDark ? (
                    <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200 rotate-0 hover:rotate-45" />
                ) : (
                    <Moon className="w-4 h-4 text-[#040989] transition-transform duration-200 -rotate-12 hover:rotate-0" />
                )}
            </div>
            {showLabel && (
                <span className={`text-xs clash-subtitle font-[325] truncate ${isDark ? "text-[#F5F7FA]" : "text-[#040989]"}`}>
                    {isDark ? "Aydınlık Mod" : "Koyu Mod"}
                </span>
            )}
        </button>
    );
}
