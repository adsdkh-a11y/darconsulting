"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CardDisplay, CARD_STORAGE_KEY, type CardView } from "./EmergencyCard";
import { useI18n } from "./I18n";

export function OfflineCard() {
  const { t } = useI18n();
  const [data, setData] = useState<{ view: CardView; labels: Record<string, string>; savedAt: string } | null | undefined>(undefined);
  useEffect(() => {
    try { const raw = localStorage.getItem(CARD_STORAGE_KEY); setData(raw ? JSON.parse(raw) : null); } catch { setData(null); }
  }, []);
  return (
    <main className="mx-auto max-w-md px-4 py-6">
      {data === undefined ? null : data ? (
        <>
          <CardDisplay view={data.view} labels={data.labels} />
          <p className="mt-3 text-center text-xs text-muted">{new Date(data.savedAt).toLocaleString()}</p>
        </>
      ) : (
        <p className="text-ink-2">{t("ec.none")}</p>
      )}
      <p className="mt-6 text-center text-sm"><Link className="font-semibold text-primary" href="/emergency-card">{t("ec.title")}</Link> · <Link className="font-semibold text-primary" href="/bathroom">🚻</Link></p>
    </main>
  );
}
