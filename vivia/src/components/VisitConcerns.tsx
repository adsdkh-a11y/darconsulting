"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Textarea } from "./ui";

export function VisitConcerns({ id, initial, completed }: { id: string; initial: string; completed: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <label htmlFor="concerns" className="mb-1 block font-semibold">{t("visit.concerns")}</label>
      <p className="mb-2 text-sm text-muted">{t("visit.concernsHint")}</p>
      <Textarea id="concerns" value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} maxLength={2000} />
      <div className="mt-2 flex gap-2">
        <Button variant="secondary" onClick={async () => { await api(`/api/visits/${id}`, "PATCH", { patientConcerns: text || null }); setSaved(true); router.refresh(); }}>{saved ? `✓ ${t("common.saved")}` : t("common.save")}</Button>
        {!completed && <Button variant="ghost" onClick={async () => { await api(`/api/visits/${id}`, "PATCH", { patientConcerns: text || null, completed: true }); router.refresh(); }}>{t("visit.done")}</Button>}
      </div>
    </Card>
  );
}
