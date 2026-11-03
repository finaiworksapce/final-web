"use client";

import * as React from "react";
import ErrorBlock from "@/components/ui/error-1";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Kritik Sistem Arızası / Global Error:", error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="antialiased bg-background text-foreground min-h-screen">
        <main className="min-h-screen w-full flex items-center justify-center">
          <ErrorBlock
            code="500"
            title="Kritik Sistem Arızası"
            description="Kritik bir sunucu veya arayüz hatası meydana geldi. Sayfayı yeniden yüklemeyi deneyebilir veya ana sayfaya dönebilirsiniz."
            showRetry={true}
            onRetry={() => reset()}
            retryText="Yeniden Başlat"
            showHome={true}
            homeHref="/"
            homeText="Ana Sayfa"
            showBack={true}
            backText="Geri Dön"
          />
        </main>
      </body>
    </html>
  );
}
