"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Notice, Pill, cx } from "./ui";
import type { DictKey } from "@/lib/i18n";

type F = { id: string; kind: string; key: string; label: string; value: string; unit: string | null; editedValue: string | null; confidence: number; sourceSnippet: string | null; status: string; applied: boolean };

export function ExtractionReview({ documentId, fields: initial }: { documentId: string; fields: F[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [fields, setFields] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<{ applied: string[]; conflicts: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function act(f: F, action: "confirm" | "edit" | "reject", editedValue?: string) {
    try {
      const r = await api<{ status: string }>(`/api/documents/${documentId}/fields/${f.id}`, "POST", { action, editedValue });
      setFields((fs) => fs.map((x) => (x.id === f.id ? { ...x, status: r.status, editedValue: editedValue ?? null } : x)));
      setEditing(null);
    } catch (e) { setError((e as Error).message); }
  }

  async function confirmAll() {
    for (const f of fields.filter((x) => x.status === "PENDING")) await act(f, "confirm");
  }

  async function apply() {
    setBusy(true);
    try {
      setResult(await api(`/api/documents/${documentId}/apply`));
      setFields((fs) => fs.map((x) => (x.status === "CONFIRMED" || x.status === "EDITED" ? { ...x, applied: true } : x)));
      router.refresh();
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  const conf = (c: number) => (c >= 0.85 ? { k: "rev.high", tone: "primary" as const } : c >= 0.6 ? { k: "rev.medium", tone: "neutral" as const } : { k: "rev.low", tone: "warn" as const });
  const pending = fields.filter((f) => f.status === "PENDING").length;
  const ready = fields.filter((f) => (f.status === "CONFIRMED" || f.status === "EDITED") && !f.applied).length;

  if (!fields.length) return <Card><p className="text-ink-2">{t("doc.noText")}</p></Card>;

  return (
    <div className="space-y-3">
      {fields.map((f) => {
        const c = conf(f.confidence);
        return (
          <Card key={f.id} className={cx(f.status === "REJECTED" && "opacity-60")}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted">{f.label}</p>
              <Pill tone={f.applied ? "primary" : f.status === "PENDING" ? "accent" : "neutral"}>{f.applied ? t("rev.inMemory") : t(`rev.status.${f.status}` as DictKey)}</Pill>
            </div>
            {editing === f.id ? (
              <div className="mt-2 flex gap-2">
                <input className="tap flex-1 rounded-xl border border-line bg-surface px-3" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label={f.label} autoFocus />
                <Button onClick={() => act(f, "edit", draft)} disabled={!draft.trim()}>{t("common.save")}</Button>
              </div>
            ) : (
              <p className={cx("mt-1 text-xl font-semibold", f.status === "EDITED" && "text-primary")}>{f.editedValue ?? f.value}{f.unit ? ` ${f.unit}` : ""}</p>
            )}
            {f.sourceSnippet && <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-sm text-ink-2"><span className="text-muted">{t("rev.fromText")}</span> “{f.sourceSnippet}”</p>}
            <p className="mt-2 text-xs text-muted">{t("rev.confidence")}: <Pill tone={c.tone}>{t(c.k as DictKey)}</Pill></p>
            {f.kind === "medication" && !f.applied && <p className="mt-2 text-xs text-muted">{t("rev.medNote")}</p>}
            {!f.applied && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button variant={f.status === "CONFIRMED" ? "primary" : "secondary"} className="px-2 text-sm" onClick={() => act(f, "confirm")}>✓ {t("rev.confirm")}</Button>
                <Button variant="secondary" className="px-2 text-sm" onClick={() => { setEditing(f.id); setDraft(f.editedValue ?? f.value); }}>✎ {t("rev.edit")}</Button>
                <Button variant={f.status === "REJECTED" ? "primary" : "secondary"} className="px-2 text-sm" onClick={() => act(f, "reject")}>✕ {t("rev.reject")}</Button>
              </div>
            )}
          </Card>
        );
      })}
      {error && <Notice tone="warn">{error}</Notice>}
      {result && (
        <div role="status" className="space-y-2">
          <Notice tone="primary">{t("rev.applied", { n: result.applied.length })}</Notice>
          {result.conflicts.length > 0 && <Link href="/conflicts" className="block"><Notice tone="warn">⚖️ {t("rev.conflicts", { n: result.conflicts.length })} →</Notice></Link>}
        </div>
      )}
      <div className="sticky bottom-[4.5rem] -mx-4 space-y-2 bg-bg/95 px-4 pb-3 pt-2 backdrop-blur">
        {pending > 0 && <Button variant="secondary" className="w-full" onClick={confirmAll}>{t("rev.confirmAll")} ({pending})</Button>}
        <Button className="w-full shadow-lg" disabled={!ready || busy} onClick={apply}>{t("rev.apply")}{ready ? ` (${ready})` : ""}</Button>
      </div>
    </div>
  );
}
