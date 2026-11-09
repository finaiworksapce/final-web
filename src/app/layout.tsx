import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.finai.net.tr"),
  title: {
    default: "FinAI | Borsa İstanbul (BIST) Portföy Takibi & Analiz",
    template: "%s | FinAI"
  },
  description: "BIST hisselerinizi tek ekranda takip edin. FinAI ile portföyünüzü canlı seans verileri, kâr/zarar, maliyet analizi ve yapay zekâ destekli KAP bildirimleriyle inceleyin.",
  authors: [{ name: "Salih KAVAKCI", url: "https://www.finai.net.tr" }],
  creator: "Salih KAVAKCI",
  publisher: "FinAI",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: ["/icon-512.png"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "FinAI | Borsa İstanbul (BIST) Portföy Takibi & Analiz",
    description: "BIST hisselerinizi tek ekranda takip edin. Portföyünüzü canlı seans verileri, maliyet analizi ve yapay zekâ destekli KAP bildirimleriyle inceleyin.",
    url: "https://www.finai.net.tr",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "FinAI Logo",
      },
    ],
    siteName: "FinAI",
  },
  twitter: {
    card: "summary",
    title: "FinAI | Borsa İstanbul (BIST) Portföy Takibi & Analiz",
    description: "BIST hisselerinizi tek ekranda takip edin. Portföyünüzü canlı seans verileri, maliyet analizi ve yapay zekâ destekli KAP bildirimleriyle inceleyin.",
    images: ["/icon-512.png"],
  },
};

import { UserProvider } from "@/components/providers/UserProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { NetworkStatusProvider } from "@/components/providers/NetworkStatusProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased font-clash text-[#040989] dark:text-[#F5F7FA] bg-[#F5F7FA] dark:bg-[#02041A] selection:bg-[#004BFA]/20 selection:text-[#004BFA] min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <UserProvider>
            <ToastProvider>
              <NetworkStatusProvider>
                {children}
              </NetworkStatusProvider>
            </ToastProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
