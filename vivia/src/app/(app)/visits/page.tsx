import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { listVisits } from "@/server/services/visits";
import { listSummaries } from "@/server/services/summary";
import { Card, ListLink, PageHeader, SectionTitle, Pill } from "@/components/ui";
import { AddVisit } from "@/components/AddVisit";
import { GenerateSummary } from "@/components/GenerateSummary";
import { fmtDay } from "@/lib/dates";

export default async function Visits() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const [visits, summaries] = await Promise.all([listVisits(user.id), listSummaries(user.id)]);
  const now = Date.now();
  return (
    <div>
      <PageHeader title={t("visit.title")} subtitle={t("visit.subtitle")} back="/me" />
      <GenerateSummary />
      <SectionTitle>{t("visit.title")}</SectionTitle>
      <AddVisit />
      <Card className="mt-3 py-1">
        {visits.length === 0 ? <p className="py-3 text-ink-2">{t("visit.none")}</p> : visits.map((v) => (
          <ListLink key={v.id} href={`/visits/${v.id}`} icon="pulse" title={v.doctor?.name ?? v.reason ?? "Appointment"} detail={fmtDay(v.scheduledAt, locale)}
            right={v.scheduledAt.getTime() > now ? <Pill tone="primary">{t("home.upcoming")}</Pill> : undefined} />
        ))}
      </Card>
      {summaries.length > 0 && (
        <>
          <SectionTitle>{t("visit.summaries")}</SectionTitle>
          <Card className="py-1">
            {summaries.map((s) => <ListLink key={s.id} href={`/summaries/${s.id}`} icon="clipboard" title={t("sum.title")} detail={`${fmtDay(s.periodStart, locale)} – ${fmtDay(s.periodEnd, locale)}`} />)}
          </Card>
        </>
      )}
    </div>
  );
}
