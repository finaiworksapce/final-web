import type { Metadata } from "next";
import ResetPasswordPageClient from "./page-client";

export const metadata: Metadata = {
  title: "Şifre Yenile",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
