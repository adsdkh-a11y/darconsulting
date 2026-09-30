"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { localDay } from "@/lib/clientDate";
import { Button, Card, Notice, Textarea, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";

type Parsed = {
  date?: string;
  bowelMovements?: number; nightBowelMovements?: number; liquidStools?: number; stoolConsistency?: number; stoolVariation?: boolean;
  blood?: number; urgency?: number; pain?: number; fatigue?: number; nausea?: number; bloating?: number; sleepQuality?: number; stress?: number;
  medicationsMentioned?: { name: string; status: "TAKEN" | "SKIPPED" | "DELAYED" }[];
  foods?: string[];
  estimated?: string[];
  unparsed?: string[];
};
const NUM_FIELDS: { key: keyof Parsed; max: number }[] = [
  { key: "bowelMovements", max: 40 }, { key: "nightBowelMovements", max: 20 }, { key: "stoolConsistency", max: 7 }, { key: "blood", max: 3 },
  { key: "urgency", max: 3 }, { key: "pain", max: 10 }, { key: "fatigue", max: 10 }, { key: "nausea", max: 10 }, { key: "bloating", max: 10 },
  { key: "sleepQuality", max: 10 }, { key: "stress", max: 10 },
];
const SPEECH_LANG: Record<string, string> = { en: "en-GB", it: "it-IT", fr: "fr-FR", es: "es-ES", de: "de-DE", ar: "ar" };

type SR = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

export function TellVivia() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [voice, setVoice] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ runId: string; provider: string; parsed: Parsed } | null>(null);
  const [draft, setDraft] = useState<Parsed>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const rec = useRef<SR | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    setVoice(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  function toggleVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    if (listening) {
      rec.current?.stop();
      return;
    }
    const r = new Ctor();
    r.lang = SPEECH_LANG[locale] ?? "en-GB";
    r.interimResults = true;
    r.continuous = true;
    const base = text ? `${text} ` : "";
    r.onresult = (e) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      setText(base + s);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    r.start();
    setListening(true);
  }

  async function interpret() {
    setBusy(true);
    setError(null);
    try {
      rec.current?.stop();
      const r = await api<{ runId: string; provider: string; parsed: Parsed }>("/api/log/interpret", "POST", { text, today: localDay() });
      setResult(r);
      setDraft(r.parsed);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!result) return;
    setBusy(true);
    try {
      const { estimated: _e, unparsed: _u, ...payload } = draft;
      void _e; void _u;
      await api("/api/log/confirm", "POST", { runId: result.runId, parsed: payload, today: localDay() });
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (result) await api("/api/log/cancel", "POST", { runId: result.runId }).catch(() => undefined);
    setResult(null);
    setDraft({});
  }

  if (saved)
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>✓</p>
        <p className="mt-2 text-lg font-semibold" role="status">{t("log.saved")}</p>
        <Button className="mt-4" onClick={() => router.push("/home")}>{t("common.done")}</Button>
      </Card>
    );

  if (result) {
    const recognized = NUM_FIELDS.filter((f) => draft[f.key] !== undefined && draft[f.key] !== null);
    return (
      <div className="space-y-4">
        <Card>
          <h2 className="font-display text-2xl">{t("tell.understood")}</h2>
          {draft.date && <p className="mt-1 text-sm text-ink-2">{t("log.forDay")} {draft.date}</p>}
          {recognized.length === 0 && !draft.medicationsMentioned?.length && !draft.stoolVariation && <Notice tone="warn">{t("tell.nothing")}</Notice>}
          <ul className="mt-3 divide-y divide-line">
            {recognized.map((f) => (
              <li key={f.key} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="font-medium">{t(`sym.${f.key}` as DictKey)}</p>
                  {draft.estimated?.includes(f.key) && <p className="text-xs text-warn">{t("tell.estimated")}</p>}
                </div>
                <input type="number" min={0} max={f.max} inputMode="numeric" aria-label={t(`sym.${f.key}` as DictKey)}
                  className="tap w-20 rounded-xl border border-line bg-surface px-3 text-center text-lg font-semibold"
                  value={draft[f.key] as number}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value === "" ? undefined : Math.max(0, Math.min(f.max, Number(e.target.value))) })} />
                <button className="tap text-muted" aria-label={`${t("common.delete")} ${t(`sym.${f.key}` as DictKey)}`} onClick={() => setDraft({ ...draft, [f.key]: undefined })}>✕</button>
              </li>
            ))}
            {draft.stoolVariation && (
              <li className="flex items-center justify-between py-3">
                <span className="font-medium">{t("tell.stoolVariation")}</span>
                <button className="tap text-muted" aria-label={t("common.delete")} onClick={() => setDraft({ ...draft, stoolVariation: undefined })}>✕</button>
              </li>
            )}
            {draft.medicationsMentioned?.map((m, i) => (
              <li key={m.name} className="flex items-center justify-between py-3">
                <span className="font-medium">💊 {m.name}: {t(m.status === "TAKEN" ? "tell.medTaken" : m.status === "SKIPPED" ? "tell.medSkipped" : "tell.medDelayed")}</span>
                <button className="tap text-muted" aria-label={t("common.delete")} onClick={() => setDraft({ ...draft, medicationsMentioned: draft.medicationsMentioned!.filter((_, j) => j !== i) })}>✕</button>
              </li>
            ))}
            {draft.foods?.map((f, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <span>🍽 {t("tell.foods")}: {f}</span>
                <button className="tap text-muted" aria-label={t("common.delete")} onClick={() => setDraft({ ...draft, foods: draft.foods!.filter((_, j) => j !== i) })}>✕</button>
              </li>
            ))}
          </ul>
          {!!draft.unparsed?.length && <p className="mt-2 text-sm text-muted">{t("tell.unparsed")} “{draft.unparsed.join(" · ")}”</p>}
          <p className="mt-3 text-xs text-muted">{result.provider === "vivia-rules" ? t("tell.offline") : t("tell.ai")}</p>
        </Card>
        {error && <Notice tone="warn">{error}</Notice>}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" onClick={cancel}>{t("common.cancel")}</Button>
          <Button variant="secondary" onClick={() => { setResult(null); }}>{t("common.edit")}</Button>
          <Button disabled={busy} onClick={confirm}>{t("common.confirm")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <Textarea aria-label={t("tell.title")} placeholder={t("tell.placeholder")} value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} className="min-h-40 text-lg" />
        <div className="mt-3 flex gap-2">
          <Button type="button" variant={listening ? "accent" : "secondary"} onClick={toggleVoice} disabled={voice === false} aria-pressed={listening} className={cx("flex-1", listening && "animate-pulse")}>
            🎙 {listening ? t("tell.listening") : t("tell.speak")}
          </Button>
          <Button className="flex-1" disabled={!text.trim() || busy} onClick={interpret}>{busy ? t("common.loading") : t("tell.understand")}</Button>
        </div>
        {voice === false && <p className="mt-2 text-sm text-muted">{t("tell.noVoice")}</p>}
      </Card>
      {error && <Notice tone="warn">{error}</Notice>}
    </div>
  );
}
