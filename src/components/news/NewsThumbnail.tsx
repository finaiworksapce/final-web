"use client";

import React, { useState } from "react";
import { Newspaper } from "lucide-react";

interface NewsThumbnailProps {
    imageUrl?: string | null;
    title: string;
    className?: string;
    aspectRatio?: "square" | "video" | "wide" | "hero";
    caption?: string | null;
}

export function NewsThumbnail({ 
    imageUrl, 
    title, 
    className = "",
    aspectRatio = "square",
    caption
}: NewsThumbnailProps) {
    const [hasError, setHasError] = useState(false);

    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-[16/10]",
        hero: "aspect-[16/7]"
    };

    if (imageUrl && !hasError) {
        return (
            <div className={`overflow-hidden shrink-0 border border-slate-100 bg-slate-100 relative shadow-2xs group-hover:border-blue-100 transition-colors ${aspectClasses[aspectRatio]} ${className}`}>
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setHasError(true)}
                    loading="lazy"
                />
                {caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4 text-white/90 text-xs font-medium backdrop-blur-[2px]">
                        <span>{caption}</span>
                    </div>
                )}
            </div>
        );
    }

    // FinAi Fallback Placeholder
    return (
        <div className={`shrink-0 border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center text-slate-400 relative select-none shadow-2xs group-hover:border-blue-100 transition-colors ${aspectClasses[aspectRatio]} ${className}`}>
            <Newspaper className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1.5">FinAi Özel</span>
            {caption && (
                <div className="absolute bottom-2 left-3 right-3 text-slate-500 text-[10px] font-medium truncate text-center">
                    {caption}
                </div>
            )}
        </div>
    );
}
