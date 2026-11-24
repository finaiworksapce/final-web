"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function TubelightNavbar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-4 sm:top-5 sm:bottom-auto left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-24px)]",
        className,
      )}
    >
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 border border-[#78B8F5]/30 bg-white/90 dark:bg-[#02041A]/90 dark:border-white/10 backdrop-blur-xl py-1.5 px-2.5 sm:px-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs lg:text-sm clash-subtitle font-[325] tracking-tight px-3 sm:px-3.5 lg:px-5 py-1.5 lg:py-2 rounded-full transition-colors duration-300 border-b-0",
                "text-slate-600 dark:text-slate-300 hover:text-[#0E1E38] dark:hover:text-white", // Inaktif renk
                isActive && "text-[#004BFA] dark:text-[#78B8F5] font-medium", // Aktif yazı rengi
              )}
              style={{ borderBottom: 'none' }}
            >
              <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-[#78B8F5]/20 dark:bg-[#004BFA]/30 rounded-full -z-10 border border-[#78B8F5]/40 dark:border-blue-400/40"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
