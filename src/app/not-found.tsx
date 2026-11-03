"use client";

import ErrorBlock from "@/components/ui/error-1";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <ErrorBlock
        code="404"
        title="Sayfa Bulunamadı"
        description="Aradığınız sayfa mevcut değil, silinmiş veya taşınmış olabilir. URL adresini kontrol edebilir ya da güvenle ana sayfaya dönebilirsiniz."
        homeHref="/"
        homeText="Ana Sayfa"
        backText="Geri Dön"
        showHome={true}
        showBack={true}
        iconLucide="Compass"
      />
    </main>
  );
}
