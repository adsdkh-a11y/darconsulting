"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Field, Input, Notice, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";

export type CardView = {
  name: string; condition: string | null; medications: string[] | null; allergies: string | null; surgeries: string[] | null;
  stoma: string | null; contact: { name: string; phone: string | null } | null; extraNote: string | null;
  settings: { showCondition: boolean; showMedications: boolean; showAllergies: boolean; showSurgeries: boolean; showStoma: boolean; showContact: boolean; allergies: string | null; surgeriesNote: string | null; contactName: string | null; contactPhone: string | null; extraNote: string | null };
};

export const CARD_STORAGE_KEY = "vivia.emergencyCard";

/** Stored ONLY on the patient's own device, at their explicit request. */
function saveLocal(view: CardView, labels: Record<string, string>) {
  try {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify({ savedAt: new Date().toISOString(), view, labels }));
    return true;
  } catch {
    return false;
  }
}

export function CardDisplay({ view, labels }: { view: Omit<CardView, "settings">; labels: Record<string, string> }) {
  const row = (label: string, value: React.ReactNode) => (
    <div className="border-b border-white/20 py-2 last:border-0">
      <dt className="text-xs uppercase tracking-wider opacity-80">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
  return (
    <div className="rounded-3xl bg-[#a33a2b] p-5 text-white shadow-lg">
      <p className="text-sm font-semibold uppercase tracking-widest">✚ {labels.title}</p>
      <p className="mt-1 font-display text-3xl">{view.name}</p>
      <dl className="mt-3">
        {view.condition && row(labels.condition, labels[`c.${view.condition}`] ?? view.condition)}
        {view.medications && view.medications.length > 0 && row(labels.medications, view.medications.join(", "))}
        {view.allergies && row(labels.allergies, view.allergies)}
        {view.surgeries && view.surgeries.length > 0 && row(labels.surgeries, view.surgeries.join("; "))}
        {view.stoma && row(labels.stoma, view.stoma)}
        {view.contact && row(labels.contact, <>{view.contact.name}{view.contact.phone && <> · <a className="underline" href={`tel:${view.contact.phone}`}>{view.contact.phone}</a></>}</>)}
        {view.extraNote && row("ℹ", view.extraNote)}
      </dl>
    </div>
  );
}

export function EmergencyCardEditor({ initial }: { initial: CardView }) {
  const { t } = useI18n();
  const [view, setView] = useState(initial);
  const [s, setS] = useState(initial.settings);
  const [saved, setSaved] = useState(false);
  const [offline, setOffline] = useState(false);
  const labels: Record<string, string> = {
    title: t("ec.cardTitle"), condition: t("ec.condition"), medications: t("ec.medications"), allergies: t("ec.allergies"), surgeries: t("ec.surgeries"), stoma: t("ec.stoma"), contact: t("ec.contact"),
    "c.CROHNS": t("onb.CROHNS"), "c.ULCERATIVE_COLITIS": t("onb.ULCERATIVE_COLITIS"), "c.IBD_UNCLASSIFIED": t("onb.IBD_UNCLASSIFIED"), "c.OTHER": t("onb.OTHER"), "c.UNKNOWN": t("onb.UNKNOWN"),
  };
  useEffect(() => { try { setOffline(!!localStorage.getItem(CARD_STORAGE_KEY)); } catch {} }, []);

  async function save() {
    const v = await api<CardView>("/api/emergency-card", "PUT", s);
    setView(v);
    setSaved(true);
    if (offline) saveLocal(v, labels); // keep the device copy in sync
  }

  const toggle = (k: keyof typeof s, label: DictKey) => (
    <label className="tap flex items-center justify-between gap-3 py-1">
      <span>{t(label)}</span>
      <input type="checkbox" className="size-6 accent-[var(--primary)]" checked={!!s[k]} onChange={(e) => { setS({ ...s, [k]: e.target.checked }); setSaved(false); }} aria-label={`${t("ec.show")}: ${t(label)}`} />
    </label>
  );

  return (
    <div className="space-y-4">
      <CardDisplay view={view} labels={labels} />
      <Card>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">{t("ec.show")}</p>
        {toggle("showCondition", "ec.condition")}
        {toggle("showMedications", "ec.medications")}
        {toggle("showAllergies", "ec.allergies")}
        {toggle("showSurgeries", "ec.surgeries")}
        {toggle("showStoma", "ec.stoma")}
        {toggle("showContact", "ec.contact")}
      </Card>
      <Card>
        <Field label={t("ec.allergies")} htmlFor="al"><Input id="al" value={s.allergies ?? ""} onChange={(e) => setS({ ...s, allergies: e.target.value || null })} maxLength={300} /></Field>
        <Field label={t("ec.surgeries")} htmlFor="su"><Input id="su" value={s.surgeriesNote ?? ""} onChange={(e) => setS({ ...s, surgeriesNote: e.target.value || null })} maxLength={500} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("ec.contactName")} htmlFor="cn"><Input id="cn" value={s.contactName ?? ""} onChange={(e) => setS({ ...s, contactName: e.target.value || null })} maxLength={120} /></Field>
          <Field label={t("ec.contactPhone")} htmlFor="cp"><Input id="cp" type="tel" value={s.contactPhone ?? ""} onChange={(e) => setS({ ...s, contactPhone: e.target.value || null })} maxLength={40} /></Field>
        </div>
        <Field label={t("ec.extra")} htmlFor="ex"><Input id="ex" value={s.extraNote ?? ""} onChange={(e) => setS({ ...s, extraNote: e.target.value || null })} maxLength={300} /></Field>
        <Button className="w-full" onClick={save}>{saved ? `✓ ${t("common.saved")}` : t("common.save")}</Button>
      </Card>
      <Card>
        {offline ? (
          <>
            <Notice tone="primary">{t("ec.savedOffline")}</Notice>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/card" className={cx("tap inline-flex items-center justify-center rounded-2xl bg-primary font-semibold text-primary-ink")}>{t("ec.view")}</Link>
              <Button variant="ghost" onClick={() => { try { localStorage.removeItem(CARD_STORAGE_KEY); } catch {} setOffline(false); }}>{t("ec.removeOffline")}</Button>
            </div>
          </>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => setOffline(saveLocal(view, labels))}>📲 {t("ec.saveOffline")}</Button>
        )}
      </Card>
    </div>
  );
}
