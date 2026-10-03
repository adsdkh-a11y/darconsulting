"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { DISEASES, SYMPTOM_KEYS } from "@/lib/schemas";
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n";
import { Button, Field, Input, cx } from "./ui";

const DEFAULT_TRACK = ["bowelMovements", "stoolConsistency", "blood", "urgency", "pain", "fatigue", "mood", "stress"];

export function Onboarding() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [displayName, setName] = useState("");
  const [disease, setDisease] = useState<(typeof DISEASES)[number] | null>(null);
  const [year, setYear] = useState("");
  const [hasStoma, setStoma] = useState<boolean | null>(null);
  const [stomaType, setStomaType] = useState("");
  const [tracked, setTracked] = useState<string[]>(DEFAULT_TRACK);
  const [lang, setLang] = useState(locale);
  const [error, setError] = useState<string | null>(null);
  const total = 4;

  const choice = (active: boolean) => cx("tap w-full rounded-2xl border px-4 py-3 text-start font-medium", active ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface");

  async function finish() {
    setError(null);
    try {
      await api("/api/onboarding", "POST", {
        displayName, disease, diagnosedYear: year ? Number(year) : null, hasStoma, stomaType: stomaType || null, trackedSymptoms: tracked, locale: lang,
      });
      await api("/api/preferences", "POST", { locale: lang });
      router.push("/home");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <span className="text-xs text-muted">{t("onb.step", { n: step + 1, total })}</span>
      </div>

      <div className="flex-1">
        {step === 0 && (
          <>
            <h1 className="mb-2 font-display text-3xl">{t("onb.nameQ")}</h1>
            <p className="mb-6 text-ink-2">{t("onb.nameHint")}</p>
            <Input autoFocus value={displayName} onChange={(e) => setName(e.target.value)} maxLength={60} aria-label={t("onb.nameQ")} />
            <div className="mt-6">
              <Field label={t("onb.langQ")} htmlFor="lang">
                <select id="lang" className="tap w-full rounded-2xl border border-line bg-surface px-4" value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}>
                  {LOCALES.map((l) => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="mb-6 font-display text-3xl">{t("onb.diseaseQ")}</h1>
            <div className="space-y-2" role="radiogroup">
              {DISEASES.map((d) => (
                <button key={d} role="radio" aria-checked={disease === d} className={choice(disease === d)} onClick={() => setDisease(d)}>
                  {t(`onb.${d}`)}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <Field label={`${t("onb.yearQ")} (${t("common.optional")})`} htmlFor="year">
                <Input id="year" inputMode="numeric" pattern="[0-9]*" maxLength={4} value={year} onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))} />
              </Field>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="mb-2 font-display text-3xl">{t("onb.stomaQ")}</h1>
            <p className="mb-6 text-ink-2">{t("onb.stomaHint")}</p>
            <div className="space-y-2" role="radiogroup">
              <button role="radio" aria-checked={hasStoma === true} className={choice(hasStoma === true)} onClick={() => setStoma(true)}>{t("common.yes")}</button>
              <button role="radio" aria-checked={hasStoma === false} className={choice(hasStoma === false)} onClick={() => setStoma(false)}>{t("common.no")}</button>
              <button className="tap w-full py-3 text-muted" onClick={() => { setStoma(null); setStep(3); }}>{t("common.skip")}</button>
            </div>
            {hasStoma && (
              <div className="mt-4">
                <Field label={t("onb.stomaType")} htmlFor="stype">
                  <Input id="stype" value={stomaType} onChange={(e) => setStomaType(e.target.value)} placeholder="Ileostomy / colostomy" maxLength={40} />
                </Field>
              </div>
            )}
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="mb-2 font-display text-3xl">{t("onb.trackQ")}</h1>
            <p className="mb-6 text-ink-2">{t("onb.trackHint")}</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_KEYS.map((k) => {
                const on = tracked.includes(k);
                return (
                  <button key={k} aria-pressed={on} onClick={() => setTracked(on ? tracked.filter((x) => x !== k) : [...tracked, k])}
                    className={cx("tap rounded-full border px-4 py-2 text-sm font-medium", on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-ink-2")}>
                    {t(`sym.${k}`)}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
      <div className="flex gap-3">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>{t("common.back")}</Button>}
        {step < total - 1 ? (
          <Button className="flex-1" disabled={(step === 0 && !displayName.trim()) || (step === 1 && !disease)} onClick={() => setStep(step + 1)}>
            {t("common.next")}
          </Button>
        ) : (
          <Button className="flex-1" disabled={!tracked.length} onClick={finish}>{t("onb.finish")}</Button>
        )}
      </div>
    </main>
  );
}
