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
    default: "FinAI | BIST ve TEFAS Portföy Takibi",
    template: "%s | FinAI"
  },
  description: "BIST hisselerinizi ve TEFAS fonlarınızı tek ekranda takip edin. FinAI ile portföyünüzü piyasa haberleri ve yapay zekâ destekli analizlerle inceleyin.",
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
    title: "FinAI | BIST ve TEFAS Portföy Takibi",
    description: "BIST hisselerinizi ve TEFAS fonlarınızı tek ekranda takip edin. Portföyünüzü haberler ve yapay zekâ destekli analizlerle inceleyin.",
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
    title: "FinAI | BIST ve TEFAS Portföy Takibi",
    description: "BIST hisselerinizi ve TEFAS fonlarınızı tek ekranda takip edin. Portföyünüzü haberler ve yapay zekâ destekli analizlerle inceleyin.",
    images: ["/icon-512.png"],
  },
};

import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import { UserProvider } from "@/components/providers/UserProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-space-grotesk' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased font-sans text-slate-900 bg-background selection:bg-brand-primary/20 selection:text-brand-primary min-h-screen">
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
