import { cookies } from "next/headers";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { prisma } from "@/server/db";
import { getProfile, getPrimaryDiagnosis } from "@/server/services/profile";
import { Card, ListLink, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { ProfileEditor, Accessibility, Logout } from "@/components/ProfileEditor";
import { LanguagePicker } from "@/components/LanguagePicker";
import { normalizeLocale } from "@/lib/i18n";

export default async function Me() {
  const user = await requirePageUser();
  const { t } = await getT();
  const [profile, dx, conflicts] = await Promise.all([
    getProfile(user.id),
    getPrimaryDiagnosis(user.id),
    prisma.dataConflict.count({ where: { userId: user.id, status: { in: ["OPEN", "NEEDS_DOCTOR_CONFIRMATION"] } } }),
  ]);
  const c = await cookies();
  return (
    <div>
      <PageHeader title={t("prof.title")} />
      <Card className="py-1">
        <ListLink href="/visits" icon="pulse" title={t("prof.links.visits")} />
        <ListLink href="/documents" icon="file" title={t("prof.links.documents")} />
        <ListLink href="/medications" icon="pill" title={t("prof.links.medications")} />
        <ListLink href="/trends" icon="trend" title={t("prof.links.trends")} />
        <ListLink href="/conflicts" icon="scale" title={t("prof.links.conflicts")} right={conflicts ? <Pill tone="warn">{conflicts}</Pill> : undefined} />
        <ListLink href="/emergency-card" icon="alert" title={t("prof.links.emergency")} />
        <ListLink href="/travel" icon="plane" title={t("prof.links.travel")} />
        <ListLink href="/privacy" icon="lock" title={t("prof.links.privacy")} />
      </Card>
      <SectionTitle>{t("prof.profile")}</SectionTitle>
      <ProfileEditor initial={{ displayName: profile!.displayName, disease: dx?.disease ?? "UNKNOWN", diagnosedYear: dx?.diagnosedAt?.getUTCFullYear() ?? null, hasStoma: profile!.hasStoma, stomaType: profile!.stomaType, trackedSymptoms: profile!.trackedSymptoms }} />
      <SectionTitle>{t("prof.language")}</SectionTitle>
      <LanguagePicker current={normalizeLocale(user.locale)} persistToProfile />
      <SectionTitle>{t("prof.accessibility")}</SectionTitle>
      <Accessibility large={c.get("vivia_text")?.value === "large"} contrast={c.get("vivia_contrast")?.value === "high"} />
      <Logout />
      <p className="mt-6 text-center text-xs text-muted">{user.email}</p>
    </div>
  );
}
