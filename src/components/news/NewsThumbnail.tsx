"use client";

import React, { useState } from "react";
import { Newspaper } from "lucide-react";

interface NewsThumbnailProps {
    imageUrl?: string | null;
    title: string;
    className?: string;
    aspectRatio?: "square" | "video" | "wide";
}

export function NewsThumbnail({ 
    imageUrl, 
    title, 
    className = "",
    aspectRatio = "square" 
}: NewsThumbnailProps) {
    const [hasError, setHasError] = useState(false);

    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-[16/10]"
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
            </div>
        );
    }

    // FinAi Fallback Placeholder
    return (
        <div className={`shrink-0 border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center text-slate-400 relative select-none shadow-2xs group-hover:border-blue-100 transition-colors ${aspectClasses[aspectRatio]} ${className}`}>
            <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1">FinAi</span>
        </div>
    );
}
