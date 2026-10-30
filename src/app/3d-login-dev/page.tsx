import type { Metadata } from "next";
import LoginDemoPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Giriş Ekranı Önizlemesi",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginDemoPage() {
  return <LoginDemoPageClient />;
}
