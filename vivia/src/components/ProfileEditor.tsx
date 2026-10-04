"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { DISEASES, SYMPTOM_KEYS } from "@/lib/schemas";
import { Button, Card, Field, Input, Select, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";

type P = { displayName: string; disease: string; diagnosedYear: number | null; hasStoma: boolean | null; stomaType: string | null; trackedSymptoms: string[] };

export function ProfileEditor({ initial }: { initial: P }) {
  const { t } = useI18n();
  const router = useRouter();
  const [p, setP] = useState(initial);
  const [saved, setSaved] = useState(false);
  const set = (x: Partial<P>) => { setP({ ...p, ...x }); setSaved(false); };
  return (
    <Card>
      <Field label={t("prof.displayName")} htmlFor="dn"><Input id="dn" value={p.displayName} onChange={(e) => set({ displayName: e.target.value })} maxLength={60} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("prof.condition")} htmlFor="dx"><Select id="dx" value={p.disease} onChange={(e) => set({ disease: e.target.value })}>{DISEASES.map((d) => <option key={d} value={d}>{t(`onb.${d}` as DictKey)}</option>)}</Select></Field>
        <Field label={t("onb.yearQ")} htmlFor="yr"><Input id="yr" inputMode="numeric" value={p.diagnosedYear ?? ""} onChange={(e) => set({ diagnosedYear: e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null })} /></Field>
      </div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span>
          <span className="block font-semibold">{t("prof.stoma")}</span>
          <span className="text-sm text-muted">{p.hasStoma ? t("prof.stomaOn") : t("prof.stomaOff")}</span>
        </span>
        <button role="switch" aria-checked={!!p.hasStoma} aria-label={t("prof.stoma")} onClick={() => set({ hasStoma: !p.hasStoma })}
          className={cx("tap relative h-8 w-14 rounded-full transition", p.hasStoma ? "bg-primary" : "bg-surface-2 border border-line")}>
          <span className={cx("absolute top-1 size-6 rounded-full bg-white shadow transition-all", p.hasStoma ? "start-7" : "start-1")} />
        </button>
      </div>
      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-semibold">{t("prof.tracked")}</legend>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_KEYS.map((k) => {
            const on = p.trackedSymptoms.includes(k);
            return <button key={k} aria-pressed={on} onClick={() => set({ trackedSymptoms: on ? p.trackedSymptoms.filter((x) => x !== k) : [...p.trackedSymptoms, k] })}
              className={cx("tap rounded-full border px-3 text-sm", on ? "border-primary bg-primary-soft text-primary" : "border-line text-ink-2")}>{t(`sym.${k}` as DictKey)}</button>;
          })}
        </div>
      </fieldset>
      <Button className="w-full" disabled={!p.displayName.trim() || !p.trackedSymptoms.length} onClick={async () => {
        await api("/api/profile", "PATCH", { displayName: p.displayName, disease: p.disease, diagnosedYear: p.diagnosedYear, hasStoma: p.hasStoma, stomaType: p.stomaType, trackedSymptoms: p.trackedSymptoms });
        setSaved(true); router.refresh();
      }}>{saved ? `✓ ${t("common.saved")}` : t("common.save")}</Button>
    </Card>
  );
}

export function Accessibility({ large, contrast }: { large: boolean; contrast: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const toggle = async (body: object) => { await api("/api/preferences", "POST", body); router.refresh(); };
  const row = (label: string, on: boolean, onClick: () => void) => (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium">{label}</span>
      <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={cx("tap relative h-8 w-14 rounded-full", on ? "bg-primary" : "bg-surface-2 border border-line")}>
        <span className={cx("absolute top-1 size-6 rounded-full bg-white shadow", on ? "start-7" : "start-1")} />
      </button>
    </div>
  );
  return (
    <Card>
      {row(t("prof.largeText"), large, () => toggle({ text: large ? "normal" : "large" }))}
      {row(t("prof.highContrast"), contrast, () => toggle({ contrast: contrast ? "normal" : "high" }))}
    </Card>
  );
}

export function Logout() {
  const { t } = useI18n();
  const router = useRouter();
  return <Button variant="ghost" className="mt-6 w-full" onClick={async () => { await api("/api/auth/logout"); router.push("/welcome"); router.refresh(); }}>{t("auth.logout")}</Button>;
}
