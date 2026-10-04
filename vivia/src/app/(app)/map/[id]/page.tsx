import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getLocation } from "@/server/services/locations";
import { Card, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { LocationActions } from "@/components/LocationActions";
import { fmtDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function LocationDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { t, locale } = await getT();
  const l = await getLocation(id, user.id);
  const fsTone = (s: string) => (s === "VERIFIED" ? "primary" : s === "COMMUNITY_REPORTED" ? "neutral" : "warn") as "primary" | "neutral" | "warn";
  return (
    <div>
      <PageHeader title={l.name} back="/map" subtitle={[t(`map.cat.${l.category}` as DictKey), l.address].filter(Boolean).join(" · ")} />
      <div className="mb-4 flex flex-wrap gap-2">
        {l.open24h ? <Pill tone="primary">{t("map.open24")}</Pill> : l.openNow === true ? <Pill tone="primary">{t("map.open")}</Pill> : l.openNow === false ? <Pill>{t("map.closed")}</Pill> : <Pill>{t("map.hoursUnknown")}</Pill>}
        <Pill tone={l.verificationType.endsWith("VERIFIED") ? "primary" : "neutral"}>{t(`map.ver.${l.verificationType}` as DictKey)}</Pill>
        {l.reliability !== null && <Pill>★ {t("map.reliability", { r: l.reliability, n: l.reviews.length })}</Pill>}
      </div>
      <Card>
        {l.openingHours && <p>{l.openingHours}</p>}
        <p className="mt-1 text-sm text-muted">{t("common.source")}: {l.source}{l.lastVerifiedAt ? ` · ${t("map.lastVerified", { date: fmtDay(l.lastVerifiedAt, locale) })}` : ""}</p>
        <a className="tap mt-3 inline-flex items-center rounded-2xl bg-primary px-5 font-semibold text-primary-ink" target="_blank" rel="noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${l.latitude},${l.longitude}&travelmode=walking`}>{t("map.openInMaps")} ↗</a>
      </Card>
      {l.features.length > 0 && (
        <>
          <SectionTitle>{t("map.stomaFilters")}</SectionTitle>
          <Card>
            <ul className="space-y-2">
              {l.features.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <span>{t(`feat.${f.feature}` as DictKey)}</span>
                  <Pill tone={fsTone(f.status)}>{t(`map.fs.${f.status}` as DictKey)}{f.status === "COMMUNITY_REPORTED" ? ` · ${f.reportedBy}` : ""}</Pill>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
      <LocationActions id={l.id} />
      {l.reviews.filter((r) => r.comment).length > 0 && (
        <>
          <SectionTitle>★</SectionTitle>
          <Card className="py-1">
            {l.reviews.filter((r) => r.comment).map((r) => (
              <p key={r.id} className="border-b border-line py-3 last:border-0"><span className="font-semibold">{"★".repeat(r.reliability)}</span> {r.comment} <span className="text-xs text-muted">{fmtDay(r.createdAt, locale)}</span></p>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
