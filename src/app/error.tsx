"use client";

import { useEffect } from "react";
import ErrorBlock from "@/components/ui/error-1";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uygulama Arızası / App Runtime Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background">
      <ErrorBlock
        code={error?.digest ? "500" : "HATA"}
        title="Sistem Arızası Tespit Edildi"
        description={
          error?.message && !error.message.includes("digest")
            ? error.message
            : "Beklenmedik bir teknik arıza meydana geldi. Mühendislerimiz durumdan haberdar edildi. Lütfen tekrar deneyiniz."
        }
        showRetry={true}
        onRetry={() => reset()}
        retryText="Tekrar Dene"
        showHome={true}
        homeHref="/"
        homeText="Ana Sayfaya Dön"
        showBack={true}
        backText="Geri Git"
      />
    </main>
  );
}
