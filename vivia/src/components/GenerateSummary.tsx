"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { SUMMARY_SECTIONS } from "@/lib/schemas";
import { Button, Card, Notice, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";
import { Icon } from "./Icon";

/** "Prepare my doctor visit" — one tap with sensible defaults, options one tap further. */
export function GenerateSummary({ visitId, concerns }: { visitId?: string; concerns?: string | null }) {
  const { t } = useI18n();
  const router = useRouter();
  const [periodDays, setPeriod] = useState(90);
  const [sections, setSections] = useState<string[]>([...SUMMARY_SECTIONS]);
  const [options, setOptions] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/api/summaries", "POST", { visitId: visitId ?? null, periodDays, sections, concerns: concerns ?? null });
      router.push(`/summaries/${r.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <Card className="border-none bg-primary-soft">
      <Button className="w-full text-lg" disabled={busy || !sections.length} onClick={go}><Icon name="pulse" className="size-5" /> {busy ? t("sum.generating") : t("visit.prepare")}</Button>
      <button className="tap mt-2 w-full text-sm font-semibold text-primary" aria-expanded={options} onClick={() => setOptions(!options)}>
        {t("sum.sections")} · {t("sum.period")}: {periodDays} {t("common.days")}
      </button>
      {options && (
        <div className="mt-2 space-y-3">
          <div className="flex gap-2">
            {[30, 90, 180].map((d) => (
              <button key={d} aria-pressed={periodDays === d} onClick={() => setPeriod(d)} className={cx("tap flex-1 rounded-2xl text-sm font-semibold", periodDays === d ? "bg-primary text-primary-ink" : "bg-surface")}>{d} {t("common.days")}</button>
            ))}
          </div>
          <p className="text-sm text-ink-2">{t("sum.youControl")}</p>
          <div className="flex flex-wrap gap-2">
            {SUMMARY_SECTIONS.map((s) => {
              const on = sections.includes(s);
              return (
                <button key={s} aria-pressed={on} onClick={() => setSections(on ? sections.filter((x) => x !== s) : [...sections, s])}
                  className={cx("tap rounded-full border px-3 text-sm font-medium", on ? "border-primary bg-surface text-primary" : "border-line bg-transparent text-muted line-through")}>
                  {t(`sum.section.${s}` as DictKey)}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <div className="mt-2"><Notice tone="warn">{error}</Notice></div>}
    </Card>
  );
}
