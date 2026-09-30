import Link from "next/link";
import { getT } from "@/server/locale";
import { Card, PageHeader, SectionTitle, Notice } from "@/components/ui";
import { TravelChecklist } from "@/components/TravelChecklist";

/** Travel Mode — foundation only (see docs/ROADMAP.md). */
export default async function Travel() {
  const { t } = await getT();
  const items = ["travel.c1", "travel.c2", "travel.c3", "travel.c4", "travel.c5", "travel.c6", "travel.c7"] as const;
  return (
    <div>
      <PageHeader title={t("travel.title")} subtitle={t("travel.subtitle")} back="/me" />
      <SectionTitle>{t("travel.checklist")}</SectionTitle>
      <TravelChecklist items={items.map((k) => ({ key: k, label: t(k) }))} />
      <SectionTitle>{t("travel.places")}</SectionTitle>
      <Card className="grid grid-cols-2 gap-2">
        {([["BATHROOM", "🚻"], ["PHARMACY", "💊"], ["HOSPITAL", "🏥"], ["IBD_CENTER", "🩺"], ["AIRPORT", "✈️"], ["STATION", "🚆"]] as const).map(([c, i]) => (
          <Link key={c} href={`/map?category=${c}`} className="tap flex items-center gap-2 rounded-2xl bg-surface-2 px-3 font-medium"><span aria-hidden>{i}</span>{t(`map.cat.${c}`)}</Link>
        ))}
        <Link href="/emergency-card" className="tap col-span-2 flex items-center gap-2 rounded-2xl bg-surface-2 px-3 font-medium">🆘 {t("ec.title")}</Link>
        <Link href="/visits" className="tap col-span-2 flex items-center gap-2 rounded-2xl bg-surface-2 px-3 font-medium">📋 {t("sum.title")}</Link>
      </Card>
      <div className="mt-4"><Notice>{t("travel.soon")}</Notice></div>
    </div>
  );
}
