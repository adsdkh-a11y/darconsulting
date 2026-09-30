import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { medicationOverview, listMedications } from "@/server/services/medications";
import { ButtonLink, Card, ListLink, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { fmtDay, todayDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function Medications() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const [active, all] = await Promise.all([medicationOverview(user.id), listMedications(user.id, { includeInactive: true })]);
  const past = all.filter((m) => !m.active);
  const today = todayDay();
  return (
    <div>
      <PageHeader title={t("med.title")} action={<ButtonLink href="/medications/new" className="px-4 py-2">+ {t("common.add")}</ButtonLink>} />
      {active.length === 0 ? (
        <Card><p className="text-ink-2">{t("med.empty")}</p><ButtonLink href="/medications/new" className="mt-4 w-full">{t("med.add")}</ButtonLink></Card>
      ) : (
        <Card className="py-1">
          {active.map((m) => (
            <ListLink key={m.id} href={`/medications/${m.id}`} icon="💊"
              title={<>{m.name} {m.verificationStatus === "NEEDS_DOCTOR_CONFIRMATION" && <Pill tone="warn">{t("verification.NEEDS_DOCTOR_CONFIRMATION")}</Pill>}</>}
              detail={[m.dose ? `${m.dose} ${m.unit ?? ""}` : null, t(`route.${m.route}` as DictKey), m.asNeeded ? t("med.asNeeded") : m.intervalDays ? `${t("med.every")} ${m.intervalDays} ${t("med.days")}` : null].filter(Boolean).join(" · ")}
              right={m.nextDue ? <Pill tone={m.nextDue.toISOString().slice(0, 10) <= today ? "accent" : "neutral"}>{m.nextDue.toISOString().slice(0, 10) <= today ? t("med.dueToday") : fmtDay(m.nextDue, locale)}</Pill> : undefined} />
          ))}
        </Card>
      )}
      {past.length > 0 && (
        <>
          <SectionTitle>{t("med.inactive")}</SectionTitle>
          <Card className="py-1">{past.map((m) => <ListLink key={m.id} href={`/medications/${m.id}`} title={m.name} detail={m.endDate ? fmtDay(m.endDate, locale) : undefined} />)}</Card>
        </>
      )}
      <p className="mt-6 text-sm text-muted">{t("med.safety")}</p>
    </div>
  );
}
