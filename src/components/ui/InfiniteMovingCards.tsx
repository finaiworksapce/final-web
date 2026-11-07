"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}: {
    items: {
        id: string | number;
        initials: string;
        name: string;
        role: string;
        quote: string;
        tags: { text: string; type: 'featured' | 'default' }[];
        stats: { icon: any; text: string; }[];
        avatarGradient: string;
    }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow";
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);

    const [start, setStart] = useState(false);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            // Duplicate items twice to ensure unbroken stream across wide screens
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "25s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "45s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "90s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_4%,white_96%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-5 py-3 w-max flex-nowrap will-change-transform",
                    start && "animate-scroll",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[85vw] sm:w-[360px] md:w-[400px] max-w-full relative rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all duration-300 px-6 py-5 shrink-0"
                        key={`${item.name}-${idx}`}
                    >
                        <blockquote>
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-2xs"
                                    style={{ background: item.avatarGradient }}
                                >
                                    {item.initials}
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-[#0E1E38]">
                                        {item.name}
                                    </span>
                                    <span className="block text-xs text-slate-500 font-normal">
                                        {item.role}
                                    </span>
                                </div>
                            </div>

                            <span className="relative z-20 text-sm leading-[1.6] text-slate-700 font-normal block mb-4">
                                "{item.quote}"
                            </span>

                            <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                                <div className="flex gap-2">
                                    {item.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className={cn(
                                            "text-[10px] px-2.5 py-0.5 rounded-full font-semibold",
                                            tag.type === 'featured' ? "bg-white text-[#004BFA] shadow-2xs" : "bg-white/80 text-slate-600"
                                        )}>
                                            {tag.text}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                    {item.stats.map((stat, sIdx) => {
                                        const Icon = stat.icon;
                                        return (
                                            <span key={sIdx} className="flex items-center gap-1">
                                                {Icon && <Icon className="w-3 h-3" />}
                                                {stat.text}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};
