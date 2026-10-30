import type { Metadata } from 'next';
import { NotFound } from "@/components/ui/not-found-2";

export const metadata: Metadata = {
  title: '404 Önizlemesi',
  robots: { index: false, follow: true },
};

export default function DemoPage() {
    return <NotFound />;
}
