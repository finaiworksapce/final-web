"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
  className?: string;
  tabListClassName?: string;
  contentClassName?: string;
  activeTabClassName?: string;
}

export const AnimatedTabs = ({
  tabs = [],
  defaultTab,
  className,
  tabListClassName,
  contentClassName,
  activeTabClassName,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "");

  if (!tabs?.length) return null;

  return (
    <div className={cn("w-full flex flex-col gap-y-3", className)}>
      <div className={cn("flex gap-2 flex-wrap bg-slate-100 p-1.5 rounded-2xl w-full sm:w-fit", tabListClassName)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer select-none",
              activeTab === tab.id ? "text-white" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className={cn("absolute inset-0 bg-[#00008B] rounded-xl shadow-sm", activeTabClassName)}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={cn("w-full", contentClassName)}>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                  x: -8,
                  filter: "blur(4px)",
                }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, x: -8, filter: "blur(4px)" }}
                transition={{
                  duration: 0.35,
                  ease: "circInOut",
                  type: "spring",
                }}
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
};
