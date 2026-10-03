import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getMedication, adherence, nextDue } from "@/server/services/medications";
import { Card, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { MedicationActions } from "@/components/MedicationActions";
import { MedicationForm } from "@/components/MedicationForm";
import { dateToDay, fmtDay, DAY } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function MedicationDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ edit?: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { edit } = await searchParams;
  const { t, locale } = await getT();
  const m = await getMedication(user.id, id);
  const now = new Date();
  const a = adherence(m, m.events, new Date(now.getTime() - 30 * DAY), now);
  const lastTaken = m.events.find((e) => e.status === "TAKEN" || e.status === "DELAYED")?.occurredAt ?? null;
  const due = nextDue(m, lastTaken, now);
  if (edit)
    return (
      <div>
        <PageHeader title={m.name} back={`/medications/${m.id}`} />
        <MedicationForm id={m.id} initial={{ ...m, startDate: m.startDate ? dateToDay(m.startDate) : null, endDate: m.endDate ? dateToDay(m.endDate) : null }} />
      </div>
    );
  return (
    <div>
      <PageHeader title={m.name} back="/medications" subtitle={[m.dose ? `${m.dose} ${m.unit ?? ""}` : null, t(`route.${m.route}` as DictKey), t(`form.${m.form}` as DictKey)].filter(Boolean).join(" · ")} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill>{t(`source.${m.sourceType}` as DictKey)}</Pill>
        {m.verificationStatus === "NEEDS_DOCTOR_CONFIRMATION" && <Pill tone="warn">{t("verification.NEEDS_DOCTOR_CONFIRMATION")}</Pill>}
        {!m.active && <Pill>{t("med.inactive")}</Pill>}
      </div>
      <Card>
        <p className="text-sm text-muted">{t("med.schedule")}</p>
        <p className="font-semibold">{m.asNeeded ? t("med.asNeeded") : m.intervalDays ? `${t("med.every")} ${m.intervalDays} ${t("med.days")}${m.timesPerDay && m.timesPerDay > 1 ? ` · ${m.timesPerDay}×` : ""}` : m.scheduleNote ?? "—"}</p>
        {due && <p className="mt-2 text-ink-2">{t("med.next", { date: fmtDay(due, locale) })}</p>}
        {m.notes && <p className="mt-3 text-sm text-ink-2">{m.notes}</p>}
      </Card>
      {m.active && <MedicationActions id={m.id} />}
      <SectionTitle>{t("med.last30")}</SectionTitle>
      <Card>
        <p className="font-medium">{t("med.adherence", { taken: a.taken, delayed: a.delayed, skipped: a.skipped })}</p>
        {a.expected !== null && <p className="text-sm text-muted">{t("med.expected", { n: a.expected })}</p>}
      </Card>
      <SectionTitle>{t("med.history")}</SectionTitle>
      <Card className="py-1">
        {m.events.length === 0 ? <p className="py-3 text-ink-2">—</p> : m.events.map((e) => (
          <div key={e.id} className="flex items-center justify-between border-b border-line py-3 last:border-0">
            <span>{fmtDay(e.occurredAt, locale)} <span className="text-muted">{e.occurredAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</span></span>
            <span className="text-end">
              <Pill tone={e.status === "TAKEN" ? "primary" : "neutral"}>{t(e.status === "TAKEN" ? "med.taken" : e.status === "SKIPPED" ? "med.skipped" : e.status === "DELAYED" ? "med.delayed" : "med.na")}</Pill>
              {e.reason && <span className="block text-xs text-muted">{e.reason}</span>}
            </span>
          </div>
        ))}
      </Card>
      <MedicationActions id={m.id} active={m.active} manage />
      <p className="mt-6 text-sm text-muted">{t("med.safety")}</p>
    </div>
  );
}
