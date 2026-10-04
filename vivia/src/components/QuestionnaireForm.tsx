"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Notice } from "./ui";
import { Choice, Stepper } from "./inputs";
import type { Instrument } from "@/server/services/questionnaires";

export function QuestionnaireForm({ instrument }: { instrument: Omit<Instrument, "score"> }) {
  const { t } = useI18n();
  const router = useRouter();
  const [a, setA] = useState<Record<string, unknown>>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const complete = instrument.questions.every((q) => q.type === "multi" || a[q.id] !== undefined);

  if (score !== null)
    return (
      <Card className="text-center">
        <p className="text-sm text-muted">{instrument.code}</p>
        <p className="font-display text-5xl">{score}</p>
        <p className="mt-2 text-ink-2">{t("tr.qNote")}</p>
        <Button className="mt-4" onClick={() => router.push("/trends")}>{t("common.done")}</Button>
      </Card>
    );

  return (
    <div className="space-y-3">
      {instrument.questions.map((q) => (
        <Card key={q.id}>
          {q.type === "choice" && <Choice label={q.text} options={q.options} value={(a[q.id] as number) ?? null} onChange={(v) => setA({ ...a, [q.id]: v ?? undefined })} />}
          {q.type === "number" && <Stepper label={q.text} value={(a[q.id] as number) ?? null} onChange={(v) => setA({ ...a, [q.id]: v })} max={q.max} />}
          {q.type === "multi" && (
            <fieldset>
              <legend className="mb-2 font-medium">{q.text}</legend>
              {q.options.map((o) => {
                const sel = ((a[q.id] as string[]) ?? []).includes(o.value);
                return (
                  <label key={o.value} className="tap flex items-center gap-3 py-1">
                    <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={sel}
                      onChange={() => { const cur = (a[q.id] as string[]) ?? []; setA({ ...a, [q.id]: sel ? cur.filter((x) => x !== o.value) : [...cur, o.value] }); }} />
                    {o.label}
                  </label>
                );
              })}
            </fieldset>
          )}
        </Card>
      ))}
      {error && <Notice tone="warn">{error}</Notice>}
      <Button className="w-full" disabled={!complete} onClick={async () => {
        try { const r = await api<{ score: number }>("/api/questionnaires", "POST", { code: instrument.code, answers: a }); setScore(r.score); router.refresh(); }
        catch (e) { setError((e as Error).message); }
      }}>{t("common.save")}</Button>
    </div>
  );
}
