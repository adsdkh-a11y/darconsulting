"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { STOMA_FEATURES } from "@/lib/schemas";
import { Button, Card, Notice, Select, Textarea, cx } from "./ui";
import { Choice } from "./inputs";
import type { DictKey } from "@/lib/i18n";

const ISSUES = ["closed_permanently", "wrong_hours", "not_accessible", "wrong_location", "feature_missing", "other"] as const;

export function LocationActions({ id }: { id: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"review" | "report" | null>(null);
  const [reliability, setRel] = useState<number | null>(null);
  const [cleanliness, setClean] = useState<number | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [issue, setIssue] = useState<string>("wrong_hours");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const stars = [1, 2, 3, 4, 5].map((v) => ({ value: v, label: "★".repeat(v) }));

  return (
    <div className="mt-4 space-y-3">
      {done && <Notice tone="primary">{done}</Notice>}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" aria-expanded={mode === "review"} onClick={() => setMode(mode === "review" ? null : "review")}>★ {t("map.review")}</Button>
        <Button variant="ghost" aria-expanded={mode === "report"} onClick={() => setMode(mode === "report" ? null : "report")}>⚑ {t("map.report")}</Button>
      </div>
      {mode === "review" && (
        <Card>
          <Choice label={t("map.reviewReliability")} options={stars} value={reliability} onChange={setRel} />
          <Choice label={t("map.reviewCleanliness")} options={stars} value={cleanliness} onChange={setClean} />
          <fieldset className="py-2">
            <legend className="mb-2 font-medium">{t("map.reviewFeatures")}</legend>
            <div className="flex flex-wrap gap-2">
              {STOMA_FEATURES.map((f) => {
                const on = features.includes(f);
                return <button key={f} aria-pressed={on} onClick={() => setFeatures(on ? features.filter((x) => x !== f) : [...features, f])}
                  className={cx("tap rounded-full border px-3 text-sm", on ? "border-primary bg-primary-soft text-primary" : "border-line")}>{t(`feat.${f}` as DictKey)}</button>;
              })}
            </div>
          </fieldset>
          <Textarea aria-label={t("map.reviewComment")} placeholder={t("map.reviewComment")} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} />
          <Button className="mt-3 w-full" disabled={!reliability} onClick={async () => {
            await api(`/api/locations/${id}/review`, "POST", { reliability, cleanliness, comment: comment || null, features });
            setMode(null); setDone(t("map.reviewThanks")); router.refresh();
          }}>{t("common.save")}</Button>
        </Card>
      )}
      {mode === "report" && (
        <Card>
          <label className="mb-2 block font-medium" htmlFor="issue">{t("map.reportIssue")}</label>
          <Select id="issue" value={issue} onChange={(e) => setIssue(e.target.value)}>{ISSUES.map((i) => <option key={i} value={i}>{t(`map.issue.${i}` as DictKey)}</option>)}</Select>
          <Textarea className="mt-3" aria-label={t("sym.notes")} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} />
          <Button className="mt-3 w-full" onClick={async () => {
            await api(`/api/locations/${id}/report`, "POST", { issue, details: details || null });
            setMode(null); setDone(t("map.reportThanks"));
          }}>{t("common.confirm")}</Button>
        </Card>
      )}
    </div>
  );
}
