"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { FORMS, ROUTES } from "@/lib/schemas";
import { Button, Field, Input, Notice, Select, Textarea, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";

export type MedicationDraft = {
  name: string; activeIngredient?: string | null; dose?: number | null; unit?: string | null; route: string; form: string;
  intervalDays?: number | null; timesPerDay?: number | null; asNeeded?: boolean; scheduleNote?: string | null;
  startDate?: string | null; endDate?: string | null; prescribingDoctor?: string | null; notes?: string | null;
};

const PRESETS = [
  { label: "1×/day", intervalDays: 1, timesPerDay: 1 },
  { label: "2×/day", intervalDays: 1, timesPerDay: 2 },
  { label: "3×/day", intervalDays: 1, timesPerDay: 3 },
  { label: "7 d", intervalDays: 7, timesPerDay: 1 },
  { label: "14 d", intervalDays: 14, timesPerDay: 1 },
  { label: "28 d", intervalDays: 28, timesPerDay: 1 },
  { label: "56 d", intervalDays: 56, timesPerDay: 1 },
];

export function MedicationForm({ id, initial }: { id?: string; initial?: MedicationDraft }) {
  const { t } = useI18n();
  const router = useRouter();
  const [m, setM] = useState<MedicationDraft>(initial ?? { name: "", route: "ORAL", form: "TABLET", intervalDays: 1, timesPerDay: 1 });
  const [more, setMore] = useState(!!initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const up = (k: keyof MedicationDraft) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setM({ ...m, [k]: e.target.value === "" ? null : e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = { ...m, dose: m.dose ? Number(m.dose) : null, intervalDays: m.asNeeded ? null : m.intervalDays ? Number(m.intervalDays) : null, timesPerDay: m.asNeeded ? null : m.timesPerDay ? Number(m.timesPerDay) : null };
      if (id) await api(`/api/medications/${id}`, "PUT", payload);
      else {
        const r = await api<{ id: string }>("/api/medications", "POST", payload);
        router.push(`/medications/${r.id}`);
      }
      router.refresh();
      if (id) router.push(`/medications/${id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <Field label={t("med.name")} htmlFor="name"><Input id="name" required value={m.name} onChange={up("name")} maxLength={120} placeholder="e.g. Adalimumab, Mesalazine…" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("med.dose")} htmlFor="dose"><Input id="dose" inputMode="decimal" value={m.dose ?? ""} onChange={up("dose")} /></Field>
        <Field label={t("med.unit")} htmlFor="unit"><Input id="unit" value={m.unit ?? ""} onChange={up("unit")} placeholder="mg" maxLength={20} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("med.route")} htmlFor="route">
          <Select id="route" value={m.route} onChange={up("route")}>{ROUTES.map((r) => <option key={r} value={r}>{t(`route.${r}` as DictKey)}</option>)}</Select>
        </Field>
        <Field label={t("med.form")} htmlFor="form">
          <Select id="form" value={m.form} onChange={up("form")}>{FORMS.map((f) => <option key={f} value={f}>{t(`form.${f}` as DictKey)}</option>)}</Select>
        </Field>
      </div>
      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-semibold">{t("med.schedule")}</legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const on = !m.asNeeded && Number(m.intervalDays) === p.intervalDays && Number(m.timesPerDay ?? 1) === p.timesPerDay;
            return (
              <button type="button" key={p.label} aria-pressed={on} onClick={() => setM({ ...m, asNeeded: false, intervalDays: p.intervalDays, timesPerDay: p.timesPerDay })}
                className={cx("tap rounded-2xl border px-3 text-sm font-medium", on ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface")}>
                {p.intervalDays > 1 ? `${t("med.every")} ${p.label}` : p.label}
              </button>
            );
          })}
          <button type="button" aria-pressed={!!m.asNeeded} onClick={() => setM({ ...m, asNeeded: !m.asNeeded })}
            className={cx("tap rounded-2xl border px-3 text-sm font-medium", m.asNeeded ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface")}>
            {t("med.asNeeded")}
          </button>
        </div>
        {!m.asNeeded && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label={`${t("med.every")} (${t("med.days")})`} htmlFor="interval"><Input id="interval" inputMode="numeric" value={m.intervalDays ?? ""} onChange={up("intervalDays")} /></Field>
            <Field label={t("med.timesPerDay")} htmlFor="tpd"><Input id="tpd" inputMode="numeric" value={m.timesPerDay ?? ""} onChange={up("timesPerDay")} /></Field>
          </div>
        )}
      </fieldset>
      <Field label={t("med.start")} htmlFor="start"><Input id="start" type="date" value={m.startDate ?? ""} onChange={up("startDate")} /></Field>
      <button type="button" className="tap mb-2 font-semibold text-primary" aria-expanded={more} onClick={() => setMore(!more)}>{more ? t("common.less") : t("common.more")}</button>
      {more && (
        <>
          <Field label={t("med.activeIngredient")} htmlFor="ai"><Input id="ai" value={m.activeIngredient ?? ""} onChange={up("activeIngredient")} /></Field>
          <Field label={t("med.scheduleNote")} htmlFor="sn"><Input id="sn" value={m.scheduleNote ?? ""} onChange={up("scheduleNote")} maxLength={200} /></Field>
          <Field label={t("med.end")} htmlFor="end"><Input id="end" type="date" value={m.endDate ?? ""} onChange={up("endDate")} /></Field>
          <Field label={t("med.doctor")} htmlFor="doc"><Input id="doc" value={m.prescribingDoctor ?? ""} onChange={up("prescribingDoctor")} /></Field>
          <Field label={t("med.notes")} htmlFor="notes"><Textarea id="notes" value={m.notes ?? ""} onChange={up("notes")} /></Field>
        </>
      )}
      {error && <Notice tone="warn">{error}</Notice>}
      <Button type="submit" className="mt-4 w-full" disabled={busy || !m.name.trim()}>{t("common.save")}</Button>
      <p className="mt-4 text-sm text-muted">{t("med.safety")}</p>
    </form>
  );
}
