"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Input, Notice } from "./ui";

export function MedicationActions({ id, manage, active }: { id: string; manage?: boolean; active?: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function log(status: "TAKEN" | "SKIPPED" | "DELAYED" | "NOT_APPLICABLE") {
    setBusy(true);
    await api(`/api/medications/${id}/events`, "POST", { status, reason: reason || null });
    setReason("");
    setDone(status);
    setBusy(false);
    router.refresh();
  }

  if (manage)
    return (
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/medications/${id}?edit=1`} className="tap inline-flex items-center rounded-2xl border border-line px-4 font-semibold">{t("common.edit")}</Link>
        <Button variant="ghost" onClick={async () => { await api(`/api/medications/${id}`, "PATCH", { active: !active }); router.refresh(); }}>
          {active ? t("med.stop") : t("med.resume")}
        </Button>
      </div>
    );

  return (
    <Card className="mt-4">
      <p className="mb-3 font-semibold">{t("med.logDose")}</p>
      <div className="grid grid-cols-3 gap-2">
        <Button disabled={busy} onClick={() => log("TAKEN")}>✓ {t("med.taken")}</Button>
        <Button disabled={busy} variant="secondary" onClick={() => log("DELAYED")}>{t("med.delayed")}</Button>
        <Button disabled={busy} variant="secondary" onClick={() => log("SKIPPED")}>{t("med.skipped")}</Button>
      </div>
      <Input className="mt-3" placeholder={t("med.reason")} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={200} aria-label={t("med.reason")} />
      {done && <div className="mt-3" role="status"><Notice tone="primary">{t("common.saved")}</Notice></div>}
    </Card>
  );
}
