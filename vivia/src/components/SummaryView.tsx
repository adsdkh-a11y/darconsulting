import type { SummaryContent } from "@/server/services/summary";
import type { T } from "@/lib/i18n";
import { DailyBars, LineChart } from "./charts";
import { Card, Pill, SectionTitle } from "./ui";

/** Read-only Care Summary. Used by the patient view, print, and the shared link. */
export function SummaryView({ c, t, hideQuestions = false }: { c: SummaryContent; t: T; hideQuestions?: boolean }) {
  const a = c.symptoms?.averages;
  return (
    <article className="space-y-1">
      <Card>
        <p className="font-display text-2xl">{c.patient.displayName}</p>
        <p className="text-ink-2">
          {c.patient.disease ? t(`onb.${c.patient.disease}` as never) : ""}
          {c.patient.diagnosedYear ? ` · ${c.patient.diagnosedYear}` : ""}
          {c.patient.hasStoma ? ` · ${t("ec.stoma")}` : ""}
        </p>
        <p className="mt-2 text-sm text-muted">{t("sum.basedOn", { from: c.period.start, to: c.period.end })}</p>
        {c.overview && <p className="mt-3">{c.overview}</p>}
      </Card>

      {c.concerns && (
        <>
          <SectionTitle>{t("visit.concerns")}</SectionTitle>
          <Card><p className="whitespace-pre-line">{c.concerns}</p></Card>
        </>
      )}

      {c.symptoms && a && (
        <>
          <SectionTitle>{t("sum.since")}</SectionTitle>
          <Card>
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={t("sum.daysLogged")} value={c.symptoms.daysLogged} />
              <Stat label={t("sum.avgBm")} value={a.bowelMovements ?? "–"} />
              <Stat label={t("sum.avgPain")} value={a.pain ?? "–"} />
              <Stat label={t("sum.bloodDays")} value={c.symptoms.daysWithBlood} />
              <Stat label={t("sum.urgencyDays")} value={c.symptoms.daysWithUrgency} />
            </dl>
            {c.symptoms.changes.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-line pt-3">
                {c.symptoms.changes.map((x) => <li key={x} className="text-sm">• {x}</li>)}
              </ul>
            )}
          </Card>
        </>
      )}

      {c.trends && c.trends.bowelMovements.length > 0 && (
        <>
          <SectionTitle>{t("tr.bm")}</SectionTitle>
          <Card><DailyBars points={c.trends.bowelMovements} title={t("tr.bm")} /></Card>
        </>
      )}
      {c.trends && Object.entries(c.trends.labs).filter(([, p]) => p.length > 1).map(([code, pts]) => (
        <div key={code}>
          <SectionTitle>{code}</SectionTitle>
          <Card><LineChart points={pts} title={code} /></Card>
        </div>
      ))}

      {c.medications && (
        <>
          <SectionTitle>{t("sum.section.medications")}</SectionTitle>
          <Card className="py-1">
            {c.medications.length === 0 ? <p className="py-3 text-ink-2">—</p> : c.medications.map((m) => (
              <div key={m.id} className="border-b border-line py-3 last:border-0">
                <p className="font-semibold">{m.name} {m.verification === "NEEDS_DOCTOR_CONFIRMATION" && <Pill tone="warn">{t("verification.NEEDS_DOCTOR_CONFIRMATION")}</Pill>}</p>
                <p className="text-sm text-ink-2">{m.dose} · {m.schedule} · {m.route}{m.since ? ` · ${m.since}` : ""}</p>
              </div>
            ))}
          </Card>
        </>
      )}

      {c.adherence && c.adherence.length > 0 && (
        <>
          <SectionTitle>{t("sum.section.adherence")}</SectionTitle>
          <Card className="py-1">
            {c.adherence.map((x) => (
              <div key={x.name} className="border-b border-line py-3 last:border-0">
                <p className="font-semibold">{x.name}</p>
                <p className="text-sm text-ink-2">{t("med.adherence", { taken: x.taken, delayed: x.delayed, skipped: x.skipped })}{x.expected !== null ? ` · ${t("med.expected", { n: x.expected })}` : ""}</p>
                {x.reasons.map((r) => <p key={r} className="text-sm text-muted">“{r}”</p>)}
              </div>
            ))}
          </Card>
        </>
      )}

      {c.labs && c.labs.length > 0 && (
        <>
          <SectionTitle>{t("sum.section.labs")}</SectionTitle>
          <Card className="py-1">
            {c.labs.map((l) => (
              <div key={l.id} className="flex justify-between gap-2 border-b border-line py-2 last:border-0">
                <span><span className="font-medium">{l.name}</span> <span className="text-sm text-muted">{l.date}</span></span>
                <span className="text-end font-semibold tabular-nums">{l.value}{l.source === "DOCUMENT_EXTRACTION" && <span className="block text-xs font-normal text-muted">{t("sum.fromDoc")}</span>}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {c.procedures && c.procedures.length > 0 && (
        <>
          <SectionTitle>{t("sum.section.procedures")}</SectionTitle>
          <Card className="py-1">
            {c.procedures.map((p) => (
              <div key={p.id} className="border-b border-line py-3 last:border-0">
                <p className="font-semibold">{p.type.toLowerCase().replace(/_/g, " ")} · {p.date}</p>
                {p.findings && <p className="whitespace-pre-line text-sm text-ink-2">{p.findings}</p>}
              </div>
            ))}
          </Card>
        </>
      )}

      {c.events && c.events.length > 0 && (
        <>
          <SectionTitle>{t("sum.section.events")}</SectionTitle>
          <Card className="py-1">{c.events.map((e) => <p key={e.id} className="border-b border-line py-3 last:border-0"><span className="font-semibold">{e.title}</span> · {e.date}{e.description ? ` — ${e.description}` : ""}</p>)}</Card>
        </>
      )}

      {c.documents && c.documents.length > 0 && (
        <>
          <SectionTitle>{t("sum.section.documents")}</SectionTitle>
          <Card className="py-1">{c.documents.map((d) => <p key={d.id} className="border-b border-line py-2 last:border-0">📄 {d.title} <span className="text-sm text-muted">{d.date ?? ""}</span></p>)}</Card>
        </>
      )}

      {!hideQuestions && c.questions && c.questions.length > 0 && (
        <>
          <SectionTitle>{t("sum.questions")}</SectionTitle>
          <Card><ol className="list-decimal space-y-2 ps-5">{c.questions.map((q) => <li key={q}>{q}</li>)}</ol></Card>
        </>
      )}
      <p className="pt-4 text-xs text-muted">{c.disclaimer}</p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-display text-2xl tabular-nums">{value}</dd>
    </div>
  );
}
