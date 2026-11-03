"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconPlaceholderProps extends React.SVGProps<SVGSVGElement> {
  lucide?: string;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
  className?: string;
  "data-icon"?: string;
}

export function IconPlaceholder({
  lucide,
  className,
  "data-icon": dataIcon,
  ...props
}: IconPlaceholderProps) {
  let LucideComponent: React.ComponentType<any> | null = null;

  if (lucide && (LucideIcons as Record<string, any>)[lucide]) {
    LucideComponent = (LucideIcons as Record<string, any>)[lucide];
  } else if (lucide) {
    const foundKey = Object.keys(LucideIcons).find(
      (k) => k.toLowerCase() === lucide.toLowerCase()
    );
    if (foundKey) {
      LucideComponent = (LucideIcons as Record<string, any>)[foundKey];
    }
  }

  const ComponentToRender = LucideComponent || LucideIcons.Compass;

  return (
    <ComponentToRender
      className={cn("size-4 shrink-0 inline-block", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
