import { cookies } from "next/headers";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { prisma } from "@/server/db";
import { getProfile, getPrimaryDiagnosis } from "@/server/services/profile";
import { ListLink, Pill, SectionTitle } from "@/components/ui";
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
      <header className="mb-6 pt-2 text-center">
        <span className="mx-auto mb-4 grid size-24 place-items-center rounded-[2rem] bg-surface-2 font-display text-4xl font-extrabold text-primary" aria-hidden>{profile!.displayName.charAt(0).toUpperCase()}</span>
        <h1 className="font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.035em]">{profile!.displayName}</h1>
        <p className="mt-1 text-ink-2">{t("prof.subtitle")}</p>
      </header>
      <div className="space-y-3">
        <ListLink card href="/visits" icon="pulse" title={t("prof.links.visits")} />
        <ListLink card href="/documents" icon="file" title={t("prof.links.documents")} />
        <ListLink card href="/medications" icon="pill" title={t("prof.links.medications")} />
        <ListLink card href="/trends" icon="trend" title={t("prof.links.trends")} />
        <ListLink card href="/conflicts" icon="scale" title={t("prof.links.conflicts")} right={conflicts ? <Pill tone="warn">{conflicts}</Pill> : undefined} />
        <ListLink card href="/emergency-card" icon="alert" title={t("prof.links.emergency")} />
        <ListLink card href="/travel" icon="plane" title={t("prof.links.travel")} />
        <ListLink card href="/privacy" icon="lock" title={t("prof.links.privacy")} />
      </div>
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
