"use client";
import Link from "next/link";
import { useI18n } from "./I18n";
import { Pill } from "./ui";
import { directionsUrl, fmtDistance, type Place } from "@/lib/places";
import type { DictKey } from "@/lib/i18n";

export function OpenStatus({ p }: { p: Pick<Place, "open24h" | "openNow"> }) {
  const { t } = useI18n();
  if (p.open24h) return <Pill tone="primary">● {t("map.open24")}</Pill>;
  if (p.openNow === true) return <Pill tone="primary">● {t("map.open")}</Pill>;
  if (p.openNow === false) return <Pill>○ {t("map.closed")}</Pill>;
  return <Pill>? {t("map.hoursUnknown")}</Pill>;
}

export function PlaceCard({ p, detailHref, big }: { p: Place; detailHref?: string; big?: boolean }) {
  const { t } = useI18n();
  const feats = p.features.filter((f) => f.status !== "UNVERIFIED");
  return (
    <div className={big ? "" : "border-b border-line py-3 last:border-0"}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {detailHref ? <Link href={detailHref} className={`${big ? "text-2xl font-display" : "font-semibold"} block`}>{p.name}</Link> : <p className={big ? "font-display text-2xl" : "font-semibold"}>{p.name}</p>}
          {big ? null : <p className="text-sm text-ink-2">{t("map.walk", { min: p.walkMinutes })} · {fmtDistance(p.distanceMeters)}</p>}
        </div>
        {big ? (
          <p className="font-display flex-none text-end text-[54px] font-extrabold leading-[.9] tracking-[-0.05em] text-accent tabular-nums">
            {p.walkMinutes}
            <small className="mt-1 block text-[13px] font-bold tracking-normal text-muted">{t("wc.minWalk")}<br />{fmtDistance(p.distanceMeters)}</small>
          </p>
        ) : (
          <a href={directionsUrl(p.latitude, p.longitude)} target="_blank" rel="noreferrer" className="tap inline-flex shrink-0 items-center rounded-2xl bg-primary px-4 text-sm font-bold text-primary-ink">
            {t("map.directions")} ↗
          </a>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <OpenStatus p={p} />
        {p.accessible && <Pill>♿ {t("feat.accessible")}</Pill>}
        {p.reliability !== null ? <Pill>★ {t("map.reliability", { r: p.reliability, n: p.reviewCount })}</Pill> : <Pill>{t("map.noReviews")}</Pill>}
        <Pill tone={p.verificationType === "VIVIA_VERIFIED" || p.verificationType === "PARTNER_VERIFIED" ? "primary" : "neutral"}>{t(`map.ver.${p.verificationType}` as DictKey)}</Pill>
      </div>
      {feats.length > 0 && (
        <p className="mt-1 text-xs text-muted">{feats.map((f) => `${t(`feat.${f.feature}` as DictKey)} (${t(`map.fs.${f.status}` as DictKey).toLowerCase()})`).join(" · ")}</p>
      )}
      {p.openingHours && !p.open24h && <p className="mt-1 text-xs text-muted">{p.openingHours}</p>}
      {big && (
        <a href={directionsUrl(p.latitude, p.longitude)} target="_blank" rel="noreferrer" className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-lg font-bold text-accent-ink transition active:scale-[0.98]">
          {t("map.directions")} ↗
        </a>
      )}
    </div>
  );
}
