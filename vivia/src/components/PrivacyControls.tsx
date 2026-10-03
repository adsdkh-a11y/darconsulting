"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Input, SectionTitle, cx } from "./ui";

export function ConsentToggle({ type, granted, locked, label, description }: { type: string; granted: boolean; locked?: boolean; label: string; description: string }) {
  const router = useRouter();
  const [on, setOn] = useState(granted);
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-3 last:border-0">
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="text-sm text-ink-2">{description}</span>
      </span>
      <button role="switch" aria-checked={on} aria-label={label} disabled={locked}
        onClick={async () => { await api("/api/consents", "POST", { type, granted: !on }); setOn(!on); router.refresh(); }}
        className={cx("tap relative h-8 w-14 shrink-0 rounded-full disabled:opacity-60", on ? "bg-primary" : "bg-surface-2 border border-line")}>
        <span className={cx("absolute top-1 size-6 rounded-full bg-white shadow", on ? "start-7" : "start-1")} />
      </button>
    </div>
  );
}

export function DataRights() {
  const { t } = useI18n();
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <SectionTitle>{t("priv.export")}</SectionTitle>
      <Card>
        <p className="mb-3 text-sm text-ink-2">{t("priv.exportHint")}</p>
        <a href="/api/privacy/export" className="tap inline-flex w-full items-center justify-center rounded-2xl border border-line font-semibold">⬇ {t("priv.export")}</a>
      </Card>
      <SectionTitle>{t("priv.delete")}</SectionTitle>
      <Card>
        <p className="mb-3 text-sm text-ink-2">{t("priv.deleteHint")}</p>
        <Input aria-label={t("priv.deleteConfirm")} placeholder={t("priv.deleteConfirm")} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <Button variant="danger" className="mt-3 w-full" disabled={confirm !== "DELETE"} onClick={async () => {
          try { await api("/api/privacy/delete", "POST", { confirm }); try { localStorage.removeItem("vivia.emergencyCard"); } catch {} router.push("/welcome"); router.refresh(); }
          catch (e) { setError((e as Error).message); }
        }}>{t("priv.delete")}</Button>
      </Card>
    </>
  );
}
