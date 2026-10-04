"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Field, Input, Notice, Textarea } from "./ui";

export function AddVisit() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState({ scheduledAt: "", doctorName: "", reason: "", patientConcerns: "" });
  const [error, setError] = useState<string | null>(null);
  if (!open) return <Button variant="secondary" className="w-full" onClick={() => setOpen(true)}>+ {t("visit.add")}</Button>;
  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <Field label={t("visit.when")} htmlFor="when"><Input id="when" type="datetime-local" value={v.scheduledAt} onChange={(e) => setV({ ...v, scheduledAt: e.target.value })} /></Field>
      <Field label={t("visit.doctor")} htmlFor="doc"><Input id="doc" value={v.doctorName} onChange={(e) => setV({ ...v, doctorName: e.target.value })} maxLength={120} /></Field>
      <Field label={t("visit.reason")} htmlFor="reason"><Input id="reason" value={v.reason} onChange={(e) => setV({ ...v, reason: e.target.value })} maxLength={300} /></Field>
      <Field label={t("visit.concerns")} hint={t("visit.concernsHint")} htmlFor="concerns"><Textarea id="concerns" value={v.patientConcerns} onChange={(e) => setV({ ...v, patientConcerns: e.target.value })} maxLength={2000} /></Field>
      {error && <Notice tone="warn">{error}</Notice>}
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
        <Button className="flex-1" disabled={!v.scheduledAt} onClick={async () => {
          try {
            const r = await api<{ id: string }>("/api/visits", "POST", { ...v, scheduledAt: new Date(v.scheduledAt).toISOString() });
            router.push(`/visits/${r.id}`);
            router.refresh();
          } catch (e) { setError((e as Error).message); }
        }}>{t("common.save")}</Button>
      </div>
    </div>
  );
}
