import Link from "next/link";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { prisma } from "@/server/db";
import { getProfile } from "@/server/services/profile";
import { getEntryForDay, baselineChanges } from "@/server/services/symptoms";
import { medicationOverview } from "@/server/services/medications";
import { nextVisit } from "@/server/services/visits";
import { addDays, dayToDate, fmtDay, todayDay } from "@/lib/dates";
import { Card, ButtonLink, SectionTitle, Notice } from "@/components/ui";
import { GoodDayButton } from "@/components/GoodDayButton";
import type { DictKey } from "@/lib/i18n";

const METRIC_KEY: Record<string, DictKey> = {
  bowelMovements: "metric.bowelMovements", nightBowelMovements: "metric.nightBowelMovements", pain: "metric.pain", fatigue: "metric.fatigue", urgency: "metric.urgency", blood: "metric.blood",
};

export default async function Home() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const today = todayDay();
  const [profile, entry, meds, changes, visit, conflicts, pendingDocs, entryCount30, docCount] = await Promise.all([
    getProfile(user.id),
    getEntryForDay(user.id, today),
    medicationOverview(user.id),
    baselineChanges(user.id, today),
    nextVisit(user.id),
    prisma.dataConflict.count({ where: { userId: user.id, status: "OPEN" } }),
    prisma.medicalDocument.count({ where: { userId: user.id, status: "NEEDS_REVIEW" } }),
    prisma.symptomEntry.count({ where: { userId: user.id, date: { gte: dayToDate(addDays(today, -37)) } } }),
    prisma.medicalDocument.count({ where: { userId: user.id } }),
  ]);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Rome" }).format(new Date()));
  const greeting = hour < 12 ? t("home.morning") : hour < 18 ? t("home.afternoon") : t("home.evening");
  const zero = entryCount30 === 0 && meds.length === 0 && docCount === 0;
  const nextMed = meds.filter((m) => m.nextDue).sort((a, b) => a.nextDue!.getTime() - b.nextDue!.getTime())[0];

  return (
    <div>
      <h1 className="mt-2 font-display text-[2rem] leading-tight">
        {greeting}, {profile?.displayName}
      </h1>

      {(conflicts > 0 || pendingDocs > 0) && (
        <div className="mt-4 space-y-2">
          {conflicts > 0 && <Link href="/conflicts" className="block"><Notice tone="warn">⚖️ {t("home.conflicts", { n: conflicts })} →</Notice></Link>}
          {pendingDocs > 0 && <Link href="/documents" className="block"><Notice tone="primary">📄 {t("home.pendingDocs", { n: pendingDocs })} →</Notice></Link>}
        </div>
      )}

      <Card className="mt-5 bg-primary text-primary-ink border-none">
        <p className="text-lg font-semibold">{entry ? t("home.checkedIn") : t("home.howFeeling")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {!entry && <GoodDayButton className="col-span-2" />}
          <ButtonLink href="/log" variant="secondary" className="border-none px-3">{t("home.quickCheckin")}</ButtonLink>
          <ButtonLink href="/log/tell" variant="secondary" className="border-none px-3">🎙 {t("home.tell")}</ButtonLink>
        </div>
      </Card>

      {zero ? (
        <Card className="mt-5">
          <h2 className="font-display text-2xl">{t("home.zeroTitle")}</h2>
          <p className="mt-2 text-ink-2">{t("home.zeroBody")}</p>
          <ol className="mt-4 space-y-2">
            {([["/log", "home.zero.checkin", "✍️"], ["/medications/new", "home.zero.meds", "💊"], ["/documents", "home.zero.doc", "📄"]] as const).map(([href, key, icon], i) => (
              <li key={href}>
                <Link href={href} className="tap flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 font-medium">
                  <span className="grid size-8 place-items-center rounded-full bg-surface text-sm" aria-hidden>{i + 1}</span>
                  <span className="flex-1">{t(key)}</span>
                  <span aria-hidden>{icon}</span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      ) : (
        <>
          <SectionTitle action={<Link href="/medications" className="text-sm font-semibold text-primary">{t("common.seeAll")}</Link>}>{t("home.medication")}</SectionTitle>
          <Card>
            {nextMed ? (
              <Link href={`/medications/${nextMed.id}`} className="block">
                <p className="font-semibold">{t("home.nextTreatment", { name: nextMed.name })}</p>
                <p className="text-ink-2">{nextMed.nextDue!.toISOString().slice(0, 10) <= today ? t("med.dueToday") : fmtDay(nextMed.nextDue!, locale)}</p>
              </Link>
            ) : (
              <p className="text-ink-2">{meds.length ? meds.map((m) => m.name).join(", ") : t("home.noMeds")}</p>
            )}
          </Card>

          <SectionTitle action={<Link href="/trends" className="text-sm font-semibold text-primary">{t("common.seeAll")}</Link>}>{t("home.changes")}</SectionTitle>
          <Card>
            {changes.length ? (
              <ul className="space-y-3">
                {changes.map((c) => (
                  <li key={c.metric}>
                    <p className="font-medium">{t("home.change", { metric: t(METRIC_KEY[c.metric]), n: c.consecutiveDays })}</p>
                    <p className="mt-1 text-sm text-ink-2">{t("home.changeHint")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-2">{entryCount30 >= 14 ? t("home.noChanges") : t("home.notEnough")}</p>
            )}
          </Card>

          <SectionTitle>{t("home.upcoming")}</SectionTitle>
          <Card>
            {visit ? (
              <Link href={`/visits/${visit.id}`} className="flex items-center justify-between gap-3">
                <span>
                  <span className="block font-semibold">{visit.doctor?.name ?? visit.reason ?? "Appointment"}</span>
                  <span className="text-ink-2">{fmtDay(visit.scheduledAt, locale)}</span>
                </span>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">{t("visit.prepare")}</span>
              </Link>
            ) : (
              <p className="text-ink-2">{t("home.noUpcoming")} <Link className="font-semibold text-primary" href="/visits">{t("visit.add")}</Link></p>
            )}
          </Card>
        </>
      )}

      <SectionTitle>{t("home.quickActions")}</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {([["/log", "home.qa.log", "✍️"], ["/medications", "home.qa.medication", "💊"], ["/bathroom", "home.qa.bathroom", "🚻"], ["/documents", "home.qa.documents", "📄"], ["/visits", "home.qa.summary", "🩺"], ["/emergency-card", "prof.links.emergency", "🆘"]] as const).map(([href, key, icon]) => (
          <Link key={href} href={href} className="tap flex flex-col items-center gap-1 rounded-2xl border border-line bg-surface px-2 py-3 text-center text-sm font-medium">
            <span className="text-2xl" aria-hidden>{icon}</span>
            {t(key)}
          </Link>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted">{t("app.notDoctor")}</p>
    </div>
  );
}
