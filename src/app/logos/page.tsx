import type { Metadata } from "next";
import LogosPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Logo Varyantları",
  robots: { index: false, follow: true },
};

export default function LogosPage() {
  return <LogosPageClient />;
}
