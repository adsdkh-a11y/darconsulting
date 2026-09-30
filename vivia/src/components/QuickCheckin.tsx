"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { localDay } from "@/lib/clientDate";
import { Button, Card, Notice, Textarea } from "./ui";
import { Choice, Overall, Scale, Stepper } from "./inputs";
import type { DictKey } from "@/lib/i18n";

type Values = Record<string, number | null | string>;
const SCALES = ["pain", "fatigue", "bloating", "nausea", "appetite", "sleepQuality", "stress", "mood"] as const;
const COUNTS = ["bowelMovements", "nightBowelMovements"] as const;

export function QuickCheckin({ tracked, hasStoma }: { tracked: string[]; hasStoma: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [v, setV] = useState<Values>({});
  const [more, setMore] = useState(false);
  const [day, setDay] = useState<"today" | "yesterday">("today");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const set = (k: string) => (x: number | null | string) => setV((p) => ({ ...p, [k]: x }));
  const date = day === "today" ? localDay() : localDay(new Date(Date.now() - 86400_000));
  const all = [...COUNTS, "stoolConsistency", "blood", "urgency", ...SCALES];
  const visible = more ? all : all.filter((k) => tracked.includes(k));

  function control(k: string) {
    if ((COUNTS as readonly string[]).includes(k)) return <Stepper key={k} label={t(`sym.${k}` as DictKey)} value={(v[k] as number) ?? null} onChange={set(k)} />;
    if (k === "blood") return <Choice key={k} label={t("sym.blood")} value={(v.blood as number) ?? null} onChange={set("blood")} options={[0, 1, 2, 3].map((i) => ({ value: i, label: t(`sym.blood.${i}` as DictKey) }))} />;
    if (k === "urgency") return <Choice key={k} label={t("sym.urgency")} value={(v.urgency as number) ?? null} onChange={set("urgency")} options={[0, 1, 2, 3].map((i) => ({ value: i, label: t(`sym.urgency.${i}` as DictKey) }))} />;
    if (k === "stoolConsistency")
      return <Choice key={k} label={t("sym.stoolConsistency")} value={(v.stoolConsistency as number) ?? null} onChange={set("stoolConsistency")}
        options={[1, 2, 3, 4, 5, 6, 7].map((i) => ({ value: i, label: [1, 4, 7].includes(i) ? `${i} · ${t(`sym.consistency.${i}` as DictKey)}` : String(i) }))} />;
    return <Scale key={k} label={t(`sym.${k}` as DictKey)} value={(v[k] as number) ?? null} onChange={set(k)} />;
  }

  async function save(payload: Values) {
    setState("saving");
    setError(null);
    try {
      const clean = Object.fromEntries(Object.entries(payload).filter(([, x]) => x !== null && x !== ""));
      await api("/api/symptoms", "POST", { date, ...clean });
      setState("saved");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  }

  async function repeat() {
    setState("saving");
    try {
      await api("/api/symptoms/repeat", "POST", { date });
      setState("saved");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setState("error");
    }
  }

  if (state === "saved")
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>✓</p>
        <p className="mt-2 text-lg font-semibold" role="status">{t("log.saved")}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="secondary" onClick={() => { setV({}); setState("idle"); }}>{t("log.moreDetails")}</Button>
          <Button onClick={() => router.push("/home")}>{t("common.done")}</Button>
        </div>
      </Card>
    );

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="radiogroup" aria-label={t("log.forDay")}>
        {(["today", "yesterday"] as const).map((d) => (
          <button key={d} role="radio" aria-checked={day === d} onClick={() => setDay(d)} className={`tap rounded-full px-4 text-sm font-semibold ${day === d ? "bg-ink text-bg" : "bg-surface-2 text-ink-2"}`}>
            {t(d === "today" ? "common.today" : "common.yesterday")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="accent" disabled={state === "saving"} onClick={() => save({ overall: 5 })}>☀️ {t("log.goodDay")}</Button>
        <Button variant="secondary" disabled={state === "saving"} onClick={repeat}>↺ {t("log.repeat")}</Button>
      </div>

      <Card>
        <Overall label={t("sym.overall")} labels={[1, 2, 3, 4, 5].map((i) => t(`sym.overall.${i}` as DictKey))} value={(v.overall as number) ?? null} onChange={set("overall")} />
      </Card>

      <Card className="divide-y divide-line">
        {visible.map((k) => <div key={k} className="py-1">{control(k)}</div>)}
        {hasStoma && (
          <div className="py-3">
            <label className="mb-2 block font-medium" htmlFor="stoma">{t("sym.stomaOutput")}</label>
            <input id="stoma" className="tap w-full rounded-2xl border border-line bg-surface px-4" value={(v.stomaOutput as string) ?? ""} onChange={(e) => set("stomaOutput")(e.target.value)} maxLength={200} />
          </div>
        )}
        <button type="button" className="tap w-full pt-3 text-center font-semibold text-primary" aria-expanded={more} onClick={() => setMore(!more)}>
          {more ? t("common.less") : t("log.moreDetails")}
        </button>
      </Card>

      {more && (
        <Card>
          <label className="mb-2 block font-medium" htmlFor="notes">{t("sym.notes")}</label>
          <Textarea id="notes" value={(v.notes as string) ?? ""} onChange={(e) => set("notes")(e.target.value)} maxLength={2000} />
        </Card>
      )}

      {error && <Notice tone="warn">{error}</Notice>}
      <div className="sticky bottom-[4.5rem] z-10 -mx-4 bg-bg/95 px-4 pb-3 pt-2 backdrop-blur">
        <Button className="w-full shadow-lg" disabled={state === "saving" || Object.values(v).every((x) => x === null || x === "")} onClick={() => save(v)}>
          {t("common.save")}
        </Button>
      </div>
      <p className="text-center text-sm">
        {t("log.tellInstead")} <Link href="/log/tell" className="font-semibold text-primary">🎙 {t("home.tell")}</Link>
      </p>
    </div>
  );
}
