"use client";

import * as React from "react";
import { Button } from "@/components/ui/error-1-utils/button";
import { IconPlaceholder } from "@/components/ui/error-1-utils/icon-placeholder";
import { cn } from "@/lib/utils";

export interface ErrorBlockProps {
  code?: string | number;
  title?: string;
  description?: string;
  homeHref?: string;
  homeText?: string;
  backText?: string;
  onBack?: () => void;
  onHome?: () => void;
  onRetry?: () => void;
  retryText?: string;
  showHome?: boolean;
  showBack?: boolean;
  showRetry?: boolean;
  iconLucide?: string;
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function ErrorBlock({
  code = "404",
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved. Check the URL, or head back to safety.",
  homeHref = "/",
  homeText = "Go Home",
  backText = "Go Back",
  onBack,
  onHome,
  onRetry,
  retryText = "Tekrar Dene",
  showHome = true,
  showBack = true,
  showRetry = false,
  iconLucide,
  className,
  imageSrc,
  imageAlt = "Error illustration",
}: ErrorBlockProps = {}) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else if (typeof window !== "undefined") {
      window.location.href = homeHref;
    }
  };

  return (
    <section
      className={cn(
        "flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-background px-4 py-8 sm:px-6 sm:py-12 md:py-16 text-center text-foreground transition-all duration-300 selection:bg-primary/20",
        className
      )}
    >
      {/* Optional decorative stock illustration/image */}
      {imageSrc && (
        <div className="relative mb-2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 overflow-hidden rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-800">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Status Code / Error Identifier */}
      <div className="relative select-none">
        <p className="font-mono text-6xl font-black tracking-tighter text-foreground sm:text-7xl md:text-8xl drop-shadow-sm">
          {code}
        </p>
        <div
          aria-hidden="true"
          className="absolute -inset-4 -z-10 rounded-full bg-primary/5 blur-2xl pointer-events-none"
        />
      </div>

      {/* Heading & Explanatory Details */}
      <div className="flex flex-col items-center gap-2 max-w-lg px-2">
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {title}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground leading-relaxed sm:text-base">
          {description}
        </p>
      </div>

      {/* Action Buttons - Fully responsive across Mobile, Tablet, and Desktop */}
      <div className="flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:w-auto sm:flex-row">
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="w-full sm:w-auto shadow-sm active:scale-95 transition-all"
          >
            <IconPlaceholder
              lucide="RefreshCw"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {retryText}
          </Button>
        )}

        {showHome && (
          <Button
            render={
              <a
                href={homeHref}
                onClick={(e) => {
                  if (onHome) {
                    e.preventDefault();
                    onHome();
                  }
                }}
              />
            }
            nativeButton={false}
            className="w-full sm:w-auto shadow-sm active:scale-95 transition-all"
          >
            <IconPlaceholder
              lucide={iconLucide || "Compass"}
              tabler="IconCompass"
              hugeicons="CompassIcon"
              phosphor="Compass"
              remixicon="RiCompass3Line"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {homeText}
          </Button>
        )}

        {showBack && (
          <Button
            variant="outline"
            render={
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleBack();
                }}
              />
            }
            nativeButton={false}
            className="w-full sm:w-auto shadow-sm active:scale-95 transition-all"
          >
            <IconPlaceholder
              lucide="ArrowLeft"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeftIcon"
              phosphor="ArrowLeft"
              remixicon="RiArrowLeftLine"
              data-icon="inline-start"
              aria-hidden="true"
            />
            {backText}
          </Button>
        )}
      </div>
    </section>
  );
}
