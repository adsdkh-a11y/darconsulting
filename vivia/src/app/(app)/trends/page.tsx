import Link from "next/link";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { series, windowComparisons } from "@/server/services/symptoms";
import { computeBaseline, round1 } from "@/server/services/baseline";
import { labSeries } from "@/server/services/clinical";
import { INSTRUMENTS, listResponses } from "@/server/services/questionnaires";
import { getPrimaryDiagnosis } from "@/server/services/profile";
import { Card, PageHeader, SectionTitle, cx } from "@/components/ui";
import { DailyBars, LineChart } from "@/components/charts";
import { addDays, fmtDay, todayDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function Trends({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const { range } = await searchParams;
  const days = range === "90" ? 90 : 30;
  const today = todayDay();
  const [bm, pain, fatigue, cmp, labs, responses, dx] = await Promise.all([
    series(user.id, "bowelMovements", days, today),
    series(user.id, "pain", days, today),
    series(user.id, "fatigue", days, today),
    windowComparisons(user.id, today),
    labSeries(user.id),
    listResponses(user.id),
    getPrimaryDiagnosis(user.id),
  ]);
  const bm60 = await series(user.id, "bowelMovements", 60, today);
  const base = computeBaseline(bm60, addDays(today, -7), 30);
  const band = base ? { lo: Math.max(0, round1(base.mean - base.sd)), hi: round1(base.mean + base.sd), label: t("tr.baseline") } : null;

  const block = (key: "bowelMovements" | "pain" | "fatigue", title: DictKey, pts: typeof bm, withBand = false) => {
    const c = cmp[key];
    return (
      <Card className="mb-3">
        <h3 className="font-semibold">{t(title)}</h3>
        {c ? (
          <p className="mb-2 text-sm text-ink-2">{t("tr.last7vsPrior", { a: c.last7, b: c.prior30 })} — {t(c.direction === "higher" ? "tr.higher" : c.direction === "lower" ? "tr.lower" : "tr.similar")}</p>
        ) : (
          <p className="mb-2 text-sm text-muted">{t("tr.notEnough")}</p>
        )}
        {pts.length ? <DailyBars points={pts} title={t(title)} band={withBand ? band : null} fixedMax={key === "bowelMovements" ? undefined : 10} /> : null}
        {withBand && band && <p className="mt-1 flex items-center gap-2 text-xs text-muted"><span className="inline-block h-3 w-5 rounded-sm bg-[var(--chart-band)]" aria-hidden />{t("tr.baseline")}</p>}
      </Card>
    );
  };

  const instruments = INSTRUMENTS.filter((i) => !dx || dx.disease === "UNKNOWN" || dx.disease === "OTHER" || i.forDisease.includes(dx.disease as "CROHNS"));

  return (
    <div>
      <PageHeader title={t("tr.title")} subtitle={t("tr.subtitle")} />
      <div className="mb-4 flex gap-2">
        {(["30", "90"] as const).map((r) => (
          <Link key={r} href={`/trends?range=${r}`} aria-current={String(days) === r ? "page" : undefined}
            className={cx("tap rounded-full px-4 py-2 text-sm font-semibold", String(days) === r ? "bg-ink text-bg" : "bg-surface-2 text-ink-2")}>
            {t(r === "30" ? "tr.range30" : "tr.range90")}
          </Link>
        ))}
      </div>
      {block("bowelMovements", "tr.bm", bm, true)}
      {block("pain", "tr.pain", pain)}
      {block("fatigue", "tr.fatigue", fatigue)}

      <SectionTitle>{t("tr.labs")}</SectionTitle>
      {Object.keys(labs).length === 0 ? (
        <Card><p className="text-ink-2">{t("tr.noLabs")}</p></Card>
      ) : (
        Object.entries(labs).map(([code, s]) => {
          const pts = s.points.filter((p) => p.value !== null).map((p) => ({ day: p.day, value: p.value! }));
          return (
            <Card key={code} className="mb-3">
              <h3 className="font-semibold">{s.name} {s.unit && <span className="font-normal text-muted">({s.unit})</span>}</h3>
              {pts.length ? <LineChart points={pts} title={s.name} unit={s.unit ?? ""} /> : <p className="text-sm text-ink-2">{s.points.map((p) => `${p.day}: ${p.text}`).join(" · ")}</p>}
              <p className="text-xs text-muted">{s.points.some((p) => p.source === "DOCUMENT_EXTRACTION") ? t("source.DOCUMENT_EXTRACTION") : t("source.PATIENT_ENTERED")}</p>
            </Card>
          );
        })
      )}

      <SectionTitle>{t("tr.questionnaires")}</SectionTitle>
      <Card>
        <p className="mb-3 text-sm text-ink-2">{t("tr.qNote")}</p>
        {instruments.map((i) => {
          const last = responses.find((r) => r.instrument === i.code);
          return (
            <Link key={i.code} href={`/trends/q/${i.code}`} className="tap flex items-center justify-between border-t border-line py-3">
              <span>
                <span className="block font-medium">{i.name}</span>
                {last && <span className="text-sm text-muted">{t("tr.lastScore", { score: last.score ?? "–", date: fmtDay(last.completedAt, locale) })}</span>}
              </span>
              <span className="font-semibold text-primary">{t("tr.start")} ›</span>
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
