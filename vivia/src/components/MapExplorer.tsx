"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "./I18n";
import { Button, Card, Notice, cx } from "./ui";
import { PlaceCard } from "./PlaceCard";
import { FALLBACK_CENTER, fetchNearby, locateOnce, type Place } from "@/lib/places";
import { STOMA_FEATURES } from "@/lib/schemas";
import type { DictKey } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-3xl bg-surface-2" /> });

const CATEGORIES: readonly (readonly [string, IconName])[] = [
  ["BATHROOM", "wc"], ["PHARMACY", "pill"], ["HOSPITAL", "hospital"], ["IBD_CENTER", "pulse"], ["STATION", "train"], ["AIRPORT", "plane"], ["HOTEL", "bedh"],
] as const;

export function MapExplorer({ stoma, initialCategory }: { stoma: boolean; initialCategory: string }) {
  const { t } = useI18n();
  const [center, setCenter] = useState(FALLBACK_CENTER);
  const [located, setLocated] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [features, setFeatures] = useState<string[]>([]);
  const [verifiedOnly, setVerified] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");
  const [places, setPlaces] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const search = useCallback(async () => {
    setBusy(true);
    try {
      setPlaces(await fetchNearby({ ...center, category, features: category === "BATHROOM" ? features : [], verifiedOnly, openNow, limit: 25 }));
    } finally {
      setBusy(false);
    }
  }, [center, category, features, verifiedOnly, openNow]);

  useEffect(() => { search(); }, [search]);

  async function useMyLocation() {
    const pos = await locateOnce();
    if (pos) { setCenter(pos); setLocated(true); setNote(null); } else setNote(t("map.locationDenied"));
  }

  const chip = (on: boolean) => cx("tap inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold", on ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface text-ink-2");

  return (
    <div>
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1" role="radiogroup" aria-label="Category">
        {CATEGORIES.map(([c, icon]) => (
          <button key={c} role="radio" aria-checked={category === c} className={chip(category === c)} onClick={() => setCategory(c)}>
            <Icon name={icon} className="size-[18px]" /> {t(`map.cat.${c}` as DictKey)}
          </button>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Button variant={located ? "secondary" : "primary"} className="px-4 py-2 text-sm" onClick={useMyLocation}><Icon name="pin" className="size-4" /> {t("map.useLocation")}</Button>
        <button aria-pressed={openNow} className={chip(openNow)} onClick={() => setOpenNow(!openNow)}>{t("map.openNowOnly")}</button>
        <button aria-pressed={verifiedOnly} className={chip(verifiedOnly)} onClick={() => setVerified(!verifiedOnly)}>{t("map.verifiedOnly")}</button>
      </div>
      <p className="mb-3 text-xs text-muted">{t("map.locationNote")}</p>
      {note && <div className="mb-3"><Notice tone="warn">{note}</Notice></div>}

      {category === "BATHROOM" && (
        <details className="mb-3 rounded-2xl border border-line bg-surface px-4" open={stoma}>
          <summary className="tap flex cursor-pointer items-center font-semibold">{stoma ? t("map.stomaMode") : t("map.stomaFilters")}{features.length ? ` (${features.length})` : ""}</summary>
          <div className="flex flex-wrap gap-2 pb-3">
            {STOMA_FEATURES.map((f) => {
              const on = features.includes(f);
              return <button key={f} aria-pressed={on} className={chip(on)} onClick={() => setFeatures(on ? features.filter((x) => x !== f) : [...features, f])}>{t(`feat.${f}` as DictKey)}</button>;
            })}
          </div>
          <p className="pb-3 text-xs text-muted">{t("map.fs.VERIFIED")} · {t("map.fs.COMMUNITY_REPORTED")} · {t("map.fs.UNVERIFIED")} — {t("map.fs.UNVERIFIED").toLowerCase()} ≠ ✓</p>
        </details>
      )}

      <div className="mb-3 grid grid-cols-2 gap-1 rounded-2xl bg-surface-2 p-1" role="tablist">
        {(["list", "map"] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={cx("tap rounded-xl text-sm font-semibold", view === v ? "bg-surface shadow-sm" : "text-muted")} onClick={() => setView(v)}>
            {t(v === "list" ? "map.list" : "map.mapView")}
          </button>
        ))}
      </div>

      {view === "map" && <LeafletMap center={center} places={places} located={located} />}
      <Card className={cx("py-1", view === "map" && "mt-3")} aria-busy={busy}>
        {places.length === 0 && !busy ? <p className="py-4 text-ink-2">{t("map.none")}</p> : places.map((p) => <PlaceCard key={p.id} p={p} detailHref={`/map/${p.id}`} />)}
      </Card>
    </div>
  );
}
