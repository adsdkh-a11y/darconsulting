import type { Metadata } from "next";
import { OfflineCard } from "@/components/OfflineCard";

export const metadata: Metadata = { title: "VIVIA — Medical card", robots: { index: false } };

/** Static, public page that renders the card saved on THIS device. Works offline (service worker). */
export default function CardPage() {
  return <OfflineCard />;
}
