import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getSummary } from "@/server/services/summary";
import { PageHeader, SectionTitle } from "@/components/ui";
import { SummaryView } from "@/components/SummaryView";
import { SummaryActions, EditQuestions } from "@/components/SummaryActions";

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { t } = await getT();
  const s = await getSummary(user.id, id);
  return (
    <div>
      <PageHeader title={t("sum.title")} back={s.visitId ? `/visits/${s.visitId}` : "/visits"} />
      <SummaryActions id={s.id} links={s.shareLinks.map((l) => ({ id: l.id, expiresAt: l.expiresAt.toISOString(), revoked: !!l.revokedAt, accessCount: l.accessCount }))} />
      <SummaryView c={s.content} t={t} hideQuestions={s.content.sections.includes("questions")} />
      {s.content.sections.includes("questions") && (
        <>
          <SectionTitle>{t("sum.questions")}</SectionTitle>
          <EditQuestions id={s.id} initial={s.content.questions ?? []} />
        </>
      )}
    </div>
  );
}
