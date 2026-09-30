import Link from "next/link";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { buildTimeline, type TimelineKind } from "@/server/services/timeline";
import { Card, PageHeader, Pill, cx } from "@/components/ui";
import { AddRecord } from "@/components/AddRecord";
import { fmtDay, todayDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

const FILTERS: { key: string; label: DictKey; kinds?: TimelineKind[] }[] = [
  { key: "all", label: "tl.filter.all" },
  { key: "symptoms", label: "tl.filter.symptoms", kinds: ["symptoms", "questionnaire"] },
  { key: "treatment", label: "tl.filter.treatment", kinds: ["medication", "medication_change"] },
  { key: "labs", label: "tl.filter.labs", kinds: ["lab"] },
  { key: "procedures", label: "tl.filter.procedures", kinds: ["procedure"] },
  { key: "events", label: "tl.filter.events", kinds: ["event", "visit"] },
  { key: "documents", label: "tl.filter.documents", kinds: ["document"] },
];
const ICON: Record<TimelineKind, string> = { symptoms: "✍️", medication: "💊", medication_change: "💊", lab: "🧪", procedure: "🔬", event: "🏥", document: "📄", visit: "🩺", questionnaire: "📋" };

export default async function Timeline({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const { f = "all" } = await searchParams;
  const filter = FILTERS.find((x) => x.key === f) ?? FILTERS[0];
  const items = await buildTimeline(user.id, { kinds: filter.kinds, from: new Date(Date.now() - 3 * 365 * 86400_000) });
  const today = todayDay();
  const upcoming = items.filter((i) => i.day > today).reverse();
  const past = items.filter((i) => i.day <= today);
  const groups = new Map<string, typeof past>();
  for (const i of past) {
    const k = new Date(i.at).toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(i);
  }
  const row = (i: (typeof items)[number]) => {
    const inner = (
      <div className="flex gap-3 py-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface-2" aria-hidden>{ICON[i.kind]}</span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{i.title}</p>
          {i.detail && <p className="text-sm text-ink-2">{i.detail}</p>}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <span>{fmtDay(i.day, locale)}</span>
            {i.source && <Pill>{t(`source.${i.source}` as DictKey)}</Pill>}
            {i.extraSources?.map((x) => <Pill key={x}>+ {t(`source.${x}` as DictKey)}</Pill>)}
            {i.verification === "NEEDS_DOCTOR_CONFIRMATION" && <Pill tone="warn">{t("verification.NEEDS_DOCTOR_CONFIRMATION")}</Pill>}
          </div>
        </div>
      </div>
    );
    return <li key={i.id} className="border-b border-line last:border-0">{i.href ? <Link href={i.href} className="block">{inner}</Link> : inner}</li>;
  };
  return (
    <div>
      <PageHeader title={t("tl.title")} subtitle={t("tl.subtitle")} />
      <nav aria-label="Filter" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((x) => (
          <Link key={x.key} href={x.key === "all" ? "/timeline" : `/timeline?f=${x.key}`} aria-current={x.key === filter.key ? "page" : undefined}
            className={cx("tap shrink-0 rounded-full px-4 py-2 text-sm font-semibold", x.key === filter.key ? "bg-ink text-bg" : "bg-surface-2 text-ink-2")}>
            {t(x.label)}
          </Link>
        ))}
      </nav>
      <AddRecord />
      {upcoming.length > 0 && (
        <>
          <h2 className="mb-1 mt-6 text-sm font-semibold uppercase tracking-wider text-muted">{t("tl.upcoming")}</h2>
          <Card className="py-0"><ul>{upcoming.map(row)}</ul></Card>
        </>
      )}
      {past.length === 0 && upcoming.length === 0 ? (
        <Card className="mt-4"><p className="text-ink-2">{t("tl.empty")}</p></Card>
      ) : (
        [...groups.entries()].map(([month, list]) => (
          <section key={month}>
            <h2 className="mb-1 mt-6 text-sm font-semibold uppercase tracking-wider text-muted">{month}</h2>
            <Card className="py-0"><ul>{list.map(row)}</ul></Card>
          </section>
        ))
      )}
    </div>
  );
}
