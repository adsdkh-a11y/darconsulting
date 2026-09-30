"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Field, Input, Notice, Select, Textarea } from "./ui";
import { localDay } from "@/lib/clientDate";

const LABS = [
  { code: "CRP", name: "C-reactive protein (CRP)", unit: "mg/L" },
  { code: "CALPROTECTIN", name: "Fecal calprotectin", unit: "µg/g" },
  { code: "HB", name: "Hemoglobin", unit: "g/dL" },
  { code: "FERRITIN", name: "Ferritin", unit: "ng/mL" },
  { code: "WBC", name: "White blood cells", unit: "x10^9/L" },
  { code: "PLT", name: "Platelets", unit: "x10^9/L" },
  { code: "ALBUMIN", name: "Albumin", unit: "g/dL" },
  { code: "VITD", name: "Vitamin D", unit: "ng/mL" },
];
const EVENTS = ["HOSPITALIZATION", "URGENT_VISIT", "EMERGENCY_ROOM", "MAJOR_SYMPTOM_EVENT", "SURGERY", "STOMA_CREATED", "STOMA_REVERSED", "OTHER"] as const;

/** Manual entry of labs and clinical events (hospitalisation, urgent visits, surgery…). */
export function AddRecord() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState<"lab" | "event" | null>(null);
  const [lab, setLab] = useState({ code: "CRP", value: "", takenAt: localDay() });
  const [ev, setEv] = useState({ type: "HOSPITALIZATION", title: "", startedAt: localDay(), endedAt: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  async function saveLab() {
    const def = LABS.find((l) => l.code === lab.code)!;
    try {
      await api("/api/labs", "POST", { testCode: def.code, testName: def.name, value: Number(lab.value.replace(",", ".")), unit: def.unit, takenAt: lab.takenAt });
      setOpen(null);
      router.refresh();
    } catch (e) { setError((e as Error).message); }
  }
  async function saveEvent() {
    try {
      await api("/api/events", "POST", { ...ev, endedAt: ev.endedAt || null, title: ev.title || ev.type.replace(/_/g, " ").toLowerCase() });
      setOpen(null);
      router.refresh();
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1 text-sm" aria-expanded={open === "event"} onClick={() => setOpen(open === "event" ? null : "event")}>+ {t("tl.addEvent")}</Button>
        <Button variant="secondary" className="flex-1 text-sm" aria-expanded={open === "lab"} onClick={() => setOpen(open === "lab" ? null : "lab")}>+ {t("tl.addLab")}</Button>
      </div>
      {open === "lab" && (
        <div className="mt-3 rounded-3xl border border-line bg-surface p-4">
          <Field label="Test" htmlFor="lab"><Select id="lab" value={lab.code} onChange={(e) => setLab({ ...lab, code: e.target.value })}>{LABS.map((l) => <option key={l.code} value={l.code}>{l.name} ({l.unit})</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value" htmlFor="lv"><Input id="lv" inputMode="decimal" value={lab.value} onChange={(e) => setLab({ ...lab, value: e.target.value })} /></Field>
            <Field label="Date" htmlFor="ld"><Input id="ld" type="date" value={lab.takenAt} onChange={(e) => setLab({ ...lab, takenAt: e.target.value })} /></Field>
          </div>
          <Button className="w-full" disabled={!lab.value} onClick={saveLab}>{t("common.save")}</Button>
        </div>
      )}
      {open === "event" && (
        <div className="mt-3 rounded-3xl border border-line bg-surface p-4">
          <Field label="Type" htmlFor="et"><Select id="et" value={ev.type} onChange={(e) => setEv({ ...ev, type: e.target.value })}>{EVENTS.map((x) => <option key={x} value={x}>{x.replace(/_/g, " ").toLowerCase()}</option>)}</Select></Field>
          <Field label="Title" htmlFor="eti"><Input id="eti" value={ev.title} onChange={(e) => setEv({ ...ev, title: e.target.value })} maxLength={120} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From" htmlFor="es"><Input id="es" type="date" value={ev.startedAt} onChange={(e) => setEv({ ...ev, startedAt: e.target.value })} /></Field>
            <Field label="To" htmlFor="ee"><Input id="ee" type="date" value={ev.endedAt} onChange={(e) => setEv({ ...ev, endedAt: e.target.value })} /></Field>
          </div>
          <Field label={t("sym.notes")} htmlFor="ed"><Textarea id="ed" value={ev.description} onChange={(e) => setEv({ ...ev, description: e.target.value })} /></Field>
          <Button className="w-full" onClick={saveEvent}>{t("common.save")}</Button>
        </div>
      )}
      {error && <div className="mt-2"><Notice tone="warn">{error}</Notice></div>}
    </div>
  );
}
