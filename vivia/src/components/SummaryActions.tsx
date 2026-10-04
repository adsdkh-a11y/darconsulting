"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Card, Input, Notice, Pill } from "./ui";
import { Icon } from "./Icon";

type Link = { id: string; expiresAt: string; revoked: boolean; accessCount: number };

export function SummaryActions({ id, links }: { id: string; links: Link[] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [share, setShare] = useState(false);
  const [days, setDays] = useState(7);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="mb-4 print:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a href={`/api/summaries/${id}/pdf`} className="tap inline-flex items-center justify-center rounded-2xl bg-primary px-2 text-sm font-semibold text-primary-ink">⬇ {t("sum.pdf")}</a>
        <Button variant="secondary" className="px-2 text-sm" onClick={() => window.print()}><Icon name="print" className="size-4" /> {t("sum.print")}</Button>
        <Button variant="secondary" className="px-2 text-sm" aria-expanded={share} onClick={() => setShare(!share)}><Icon name="link" className="size-4" /> {t("sum.share")}</Button>
      </div>
      {share && (
        <Card className="mt-3">
          <p className="text-sm text-ink-2">{t("sum.shareHint")}</p>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm font-medium" htmlFor="days">{t("sum.shareDays")}</label>
            <select id="days" className="tap rounded-xl border border-line bg-surface px-3" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {[1, 3, 7, 14, 30].map((d) => <option key={d} value={d}>{d} {t("common.days")}</option>)}
            </select>
            <Button className="flex-1" onClick={async () => { const r = await api<{ url: string }>(`/api/summaries/${id}/share`, "POST", { days }); setUrl(r.url); router.refresh(); }}>{t("sum.createLink")}</Button>
          </div>
          {url && (
            <div className="mt-3 space-y-2" role="status">
              <Notice tone="warn">{t("sum.linkReady")}</Notice>
              <Input readOnly value={url} onFocus={(e) => e.target.select()} aria-label="Link" />
              <Button variant="secondary" className="w-full" onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); }}>{copied ? `✓ ${t("sum.copied")}` : t("sum.copy")}</Button>
            </div>
          )}
          {links.length > 0 && (
            <ul className="mt-4 divide-y divide-line">
              {links.map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{t("sum.expires", { date: new Date(l.expiresAt).toLocaleDateString(locale) })} · {t("sum.views", { n: l.accessCount })}</span>
                  {l.revoked ? <Pill>{t("sum.revoked")}</Pill> : <Button variant="ghost" className="px-3 py-1 text-sm" onClick={async () => { await api(`/api/share-links/${l.id}`, "DELETE"); router.refresh(); }}>{t("sum.revoke")}</Button>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}

export function EditQuestions({ id, initial }: { id: string; initial: string[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [qs, setQs] = useState(initial);
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <p className="mb-3 text-sm text-muted">{t("sum.questionsHint")}</p>
      <ol className="space-y-2">
        {qs.map((q, i) => (
          <li key={i} className="flex gap-2">
            <textarea className="min-h-16 flex-1 rounded-2xl border border-line bg-surface px-3 py-2" value={q} aria-label={`${t("sum.questions")} ${i + 1}`}
              onChange={(e) => { setQs(qs.map((x, j) => (j === i ? e.target.value : x))); setSaved(false); }} />
            <button className="tap text-muted" aria-label={t("common.delete")} onClick={() => { setQs(qs.filter((_, j) => j !== i)); setSaved(false); }}>✕</button>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <Button variant="secondary" onClick={() => setQs([...qs, ""])}>+ {t("sum.addQuestion")}</Button>
        <Button className="flex-1" onClick={async () => { await api(`/api/summaries/${id}`, "PATCH", { questions: qs.filter((q) => q.trim()) }); setSaved(true); router.refresh(); }}>
          {saved ? `✓ ${t("common.saved")}` : t("sum.saveQuestions")}
        </Button>
      </div>
    </Card>
  );
}
