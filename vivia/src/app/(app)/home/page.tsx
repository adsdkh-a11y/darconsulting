import Link from "next/link";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { prisma } from "@/server/db";
import { getProfile } from "@/server/services/profile";
import { getEntryForDay, baselineChanges, series } from "@/server/services/symptoms";
import { medicationOverview } from "@/server/services/medications";
import { nextVisit } from "@/server/services/visits";
import { addDays, dayToDate, DAY, fmtDay, todayDay } from "@/lib/dates";
import { Card } from "@/components/ui";
import { MoodHero } from "@/components/MoodHero";
import type { DictKey } from "@/lib/i18n";
import type { BaselineMetric } from "@/server/services/baseline";

const METRIC_KEY: Record<string, DictKey> = {
  bowelMovements: "metric.bowelMovements", nightBowelMovements: "metric.nightBowelMovements", pain: "metric.pain", fatigue: "metric.fatigue", urgency: "metric.urgency", blood: "metric.blood",
};

const QA: { href: string; key: DictKey; icon: string; tone: "m" | "c" | "n" }[] = [
  { href: "/log/tell", key: "home.qa.tell", icon: "M9 3h6v8a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3", tone: "m" },
  { href: "/medications", key: "home.qa.medication", icon: "M10.5 3.5a4.5 4.5 0 0 1 6.4 6.4l-7 7a4.5 4.5 0 0 1-6.4-6.4zM7.7 7.7l6.6 6.6", tone: "n" },
  { href: "/bathroom", key: "home.qa.bathroom", icon: "M8 8.5v5.5M5.5 21 8 14l2.5 7M16 8.5v5.5M14 14h4l-2 7zM8 3.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM16 3.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z", tone: "c" },
  { href: "/documents", key: "home.qa.documents", icon: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4", tone: "n" },
  { href: "/visits", key: "home.qa.visit", icon: "M3 12h4l2-6 4 12 2-6h6", tone: "n" },
];

export default async function Home() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const today = todayDay();
  const [profile, entry, meds, changes, visit, conflicts, pendingDocs, entryCount, docCount] = await Promise.all([
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
  const sparks = await Promise.all(changes.map((c) => series(user.id, c.metric as BaselineMetric, 13, today)));
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Europe/Rome" }).format(new Date()));
  const greeting = hour < 12 ? t("home.morning") : hour < 18 ? t("home.afternoon") : t("home.evening");
  const zero = entryCount === 0 && meds.length === 0 && docCount === 0;
  const nextMed = meds.filter((m) => m.nextDue).sort((a, b) => a.nextDue!.getTime() - b.nextDue!.getTime())[0];
  const dateLabel = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Rome" }).format(new Date());

  let ring: { left: number; to: number; dueToday: boolean } | null = null;
  if (nextMed?.nextDue) {
    const interval = (nextMed.intervalDays ?? 1) * DAY;
    const left = Math.max(0, Math.ceil((nextMed.nextDue.getTime() - Date.now()) / DAY));
    const elapsed = nextMed.lastTaken ? Math.min(1, Math.max(0, (Date.now() - nextMed.lastTaken.getTime()) / interval)) : 0.5;
    ring = { left, to: 201 * (1 - elapsed), dueToday: left === 0 };
  }

  return (
    <div>
      <section className="hero-card rise relative mt-2 overflow-hidden rounded-[32px] px-5 pb-5 pt-[22px]" style={{ ["--i" as string]: 0 }}>
        <MoodHero dateLabel={dateLabel} doneToday={!!entry?.overall} />
      </section>
      <p className="mt-2 text-center text-xs text-muted">{greeting}, {profile?.displayName}</p>

      {(conflicts > 0 || pendingDocs > 0) && (
        <div className="rise mt-3 space-y-2" style={{ ["--i" as string]: 1 }}>
          {conflicts > 0 && <Link href="/conflicts" className="flex items-center justify-between rounded-2xl bg-warn-soft px-4 py-3 font-semibold text-warn">{t("home.conflicts", { n: conflicts })} <span aria-hidden>→</span></Link>}
          {pendingDocs > 0 && <Link href="/documents" className="flex items-center justify-between rounded-2xl bg-primary-soft px-4 py-3 font-semibold text-primary">{t("home.pendingDocs", { n: pendingDocs })} <span aria-hidden>→</span></Link>}
        </div>
      )}

      <div className="rise mt-5 grid grid-cols-5 gap-1.5" style={{ ["--i" as string]: 2 }}>
        {QA.map((q) => (
          <Link key={q.href} href={q.href} className="group flex min-w-0 flex-col items-center gap-2 text-center text-[11.5px] font-bold text-ink-2">
            <span className={`grid size-[54px] place-items-center rounded-full border border-line transition group-active:scale-90 ${q.tone === "m" ? "bg-primary-soft text-primary border-transparent" : q.tone === "c" ? "bg-accent-soft text-accent border-transparent" : "bg-surface text-ink"}`}>
              <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={q.icon} /></svg>
            </span>
            <span className="w-full truncate">{t(q.key)}</span>
          </Link>
        ))}
      </div>

      {zero ? (
        <Card className="rise mt-6" style={{ ["--i" as string]: 3 }}>
          <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em]">{t("home.zeroTitle")}</h2>
          <p className="mt-2 text-ink-2">{t("home.zeroBody")}</p>
          <ol className="mt-4 space-y-2">
            {([["/log", "home.zero.checkin"], ["/medications/new", "home.zero.meds"], ["/documents", "home.zero.doc"]] as const).map(([href, key], i) => (
              <li key={href}>
                <Link href={href} className="tap flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 font-bold">
                  <span className="grid size-8 place-items-center rounded-full bg-surface text-sm">{i + 1}</span>
                  <span className="flex-1">{t(key)}</span>
                  <span aria-hidden className="text-muted">›</span>
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      ) : (
        <>
          <h2 className="rise mb-3 mt-7 flex items-center justify-between px-0.5 text-[13px] font-bold uppercase tracking-[0.08em] text-muted" style={{ ["--i" as string]: 3 }}>
            {t("home.changes")}
            <Link href="/trends" className="text-[13px] font-bold normal-case tracking-normal text-primary">{t("common.seeAll")}</Link>
          </h2>
          <div className="rise -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" style={{ ["--i" as string]: 4 }}>
            {changes.length === 0 ? (
              <div className="w-full flex-none rounded-[26px] border border-line bg-surface p-[18px]">
                <p className="font-bold">{entryCount >= 14 ? t("home.noChanges") : t("home.notEnough")}</p>
              </div>
            ) : changes.map((c, idx) => {
              const pts = sparks[idx];
              const max = Math.max(...pts.map((p) => p.value), 1);
              return (
                <div key={c.metric} className="w-[78%] flex-none snap-start rounded-[26px] border border-line bg-surface p-[18px]">
                  <span className="inline-flex rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-bold text-ink-2">{t(METRIC_KEY[c.metric])}</span>
                  <p className="font-display mt-2 text-[40px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
                    {String(c.recentMean).replace(".", locale === "en" ? "." : ",")} <small className="text-[15px] font-bold tracking-normal text-muted">{c.metric === "bowelMovements" ? t("unit.perDay") : c.metric === "pain" || c.metric === "fatigue" ? "/ 10" : ""}</small>
                  </p>
                  <div className="mt-4 flex h-[46px] items-end gap-1" aria-hidden>
                    {pts.map((p, k) => (
                      <i key={p.day} className={`grow-bar flex-1 rounded-t bg-chart ${k < pts.length - c.consecutiveDays ? "opacity-45" : ""}`} style={{ ["--k" as string]: k, height: `${Math.max(10, (p.value / max) * 100)}%` }} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{t("home.change", { metric: t(METRIC_KEY[c.metric]), n: c.consecutiveDays })}</p>
                  <p className="mt-1 text-sm text-ink-2">{t("home.changeNote")}</p>
                </div>
              );
            })}
          </div>

          <h2 className="rise mb-3 mt-7 flex items-center justify-between px-0.5 text-[13px] font-bold uppercase tracking-[0.08em] text-muted" style={{ ["--i" as string]: 5 }}>
            {t("home.medication")}
            <Link href="/medications" className="text-[13px] font-bold normal-case tracking-normal text-primary">{t("common.seeAll")}</Link>
          </h2>
          <Card className="rise" style={{ ["--i" as string]: 6 }}>
            {nextMed && ring ? (
              <Link href={`/medications/${nextMed.id}`} className="flex items-center gap-4">
                <span className="relative size-[76px] flex-none">
                  <svg viewBox="0 0 76 76" className="size-full -rotate-90" aria-hidden>
                    <circle cx="38" cy="38" r="32" fill="none" strokeWidth="7" stroke="var(--surface-2)" />
                    <circle cx="38" cy="38" r="32" fill="none" strokeWidth="7" strokeLinecap="round" stroke="var(--primary)" strokeDasharray="201" strokeDashoffset="201"
                      style={{ ["--to" as string]: ring.to, animation: "ringfill 1.1s .3s cubic-bezier(.2,.8,.2,1) forwards" }} />
                  </svg>
                  <b className="absolute inset-0 grid place-items-center text-[17px] font-extrabold tabular-nums">{ring.dueToday ? "•" : t("home.daysLeft", { n: ring.left })}</b>
                </span>
                <span className="min-w-0">
                  <span className="block text-[17px] font-extrabold tracking-[-0.02em]">{nextMed.name}</span>
                  <span className="text-sm text-muted">{ring.dueToday ? t("home.doseToday") : t("home.nextTreatment", { name: fmtDay(nextMed.nextDue!, locale) })}</span>
                </span>
              </Link>
            ) : (
              <p className="text-ink-2">{meds.length ? meds.map((m) => m.name).join(", ") : t("home.noMeds")}</p>
            )}
          </Card>

          <h2 className="rise mb-3 mt-7 px-0.5 text-[13px] font-bold uppercase tracking-[0.08em] text-muted" style={{ ["--i" as string]: 7 }}>{t("home.upcoming")}</h2>
          <Card className="rise" style={{ ["--i" as string]: 8 }}>
            {visit ? (
              <Link href={`/visits/${visit.id}`} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-3.5">
                  <span className="grid h-[62px] w-[58px] flex-none place-items-center rounded-[18px] bg-primary-soft text-center leading-none text-primary">
                    <span><b className="block text-2xl font-extrabold">{visit.scheduledAt.getUTCDate()}</b><small className="text-[11px] font-extrabold uppercase tracking-wider">{new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(visit.scheduledAt)}</small></span>
                  </span>
                  <span className="min-w-0"><b className="block truncate text-[17px] font-extrabold">{visit.doctor?.name ?? visit.reason ?? "—"}</b><span className="text-sm text-muted">{visit.reason}</span></span>
                </span>
                <span className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-ink">{t("visit.prepareShort")}</span>
              </Link>
            ) : (
              <p className="text-ink-2">{t("home.noUpcoming")} <Link className="font-bold text-primary" href="/visits">{t("visit.add")}</Link></p>
            )}
          </Card>
        </>
      )}
      <p className="mt-8 text-center text-xs text-muted">{t("app.notDoctor")}</p>
    </div>
  );
}
