import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getVisit } from "@/server/services/visits";
import { Card, ListLink, PageHeader, SectionTitle } from "@/components/ui";
import { GenerateSummary } from "@/components/GenerateSummary";
import { VisitConcerns } from "@/components/VisitConcerns";
import { fmtDay } from "@/lib/dates";

export default async function VisitDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { t, locale } = await getT();
  const v = await getVisit(user.id, id);
  return (
    <div>
      <PageHeader title={v.doctor?.name ?? v.reason ?? "Appointment"} back="/visits"
        subtitle={`${fmtDay(v.scheduledAt, locale)} · ${v.scheduledAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" })}${v.reason && v.doctor ? ` · ${v.reason}` : ""}`} />
      <VisitConcerns id={v.id} initial={v.patientConcerns ?? ""} completed={v.completed} />
      <div className="mt-4"><GenerateSummary visitId={v.id} concerns={v.patientConcerns} /></div>
      {v.summaries.length > 0 && (
        <>
          <SectionTitle>{t("visit.summaries")}</SectionTitle>
          <Card className="py-1">{v.summaries.map((s) => <ListLink key={s.id} href={`/summaries/${s.id}`} icon="📋" title={t("sum.title")} detail={fmtDay(s.createdAt, locale)} />)}</Card>
        </>
      )}
    </div>
  );
}
