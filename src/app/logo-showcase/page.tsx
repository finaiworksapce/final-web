import type { Metadata } from "next";
import LogoShowcasePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Logo Önizlemesi",
  robots: { index: false, follow: true },
};

export default function LogoShowcasePage() {
  return <LogoShowcasePageClient />;
}
