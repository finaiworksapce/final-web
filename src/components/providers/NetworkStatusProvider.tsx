"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import ErrorBlock from "@/components/ui/error-1";

interface NetworkStatusContextType {
  isOnline: boolean;
  checkConnection: () => Promise<boolean>;
}

const NetworkStatusContext = createContext<NetworkStatusContextType>({
  isOnline: true,
  checkConnection: async () => true,
});

export const useNetworkStatus = () => useContext(NetworkStatusContext);

export function NetworkStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkConnection = async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/cron/refresh-market-data", {
        method: "HEAD",
        cache: "no-store",
      }).catch(() => null);

      const online = navigator.onLine || (response !== null);
      setIsOnline(online);
      return online;
    } catch {
      const fallback = navigator.onLine;
      setIsOnline(fallback);
      return fallback;
    } finally {
      setIsChecking(false);
    }
  };

  const handleRetry = async () => {
    const success = await checkConnection();
    if (success && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <NetworkStatusContext.Provider value={{ isOnline, checkConnection }}>
      {/* If offline, display the adapted ErrorBlock */}
      {!isOnline ? (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background/95 backdrop-blur-md px-4 overflow-y-auto">
          <ErrorBlock
            code="OFFLINE"
            title="İnternet Bağlantısı Yok"
            description="Sunucularımız veya internet ağı ile bağlantınız kesildi. Lütfen Wi-Fi ya da hücresel veri bağlantınızı kontrol edip tekrar deneyiniz."
            showRetry={true}
            onRetry={handleRetry}
            retryText={isChecking ? "Kontrol Ediliyor..." : "Yeniden Dene"}
            showHome={true}
            homeText="Ana Sayfa"
            homeHref="/"
            showBack={true}
            backText="Geri Dön"
            iconLucide="Compass"
          />
        </div>
      ) : null}
      {children}
    </NetworkStatusContext.Provider>
  );
}
