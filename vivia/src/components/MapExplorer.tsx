"use client";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "./I18n";
import Link from "next/link";
import { Notice, cx } from "./ui";
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

  const chip = (on: boolean) => cx("tap inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold", on ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface text-ink-2");
  const Switch = ({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) => (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} className="tap inline-flex items-center gap-2 text-sm font-semibold text-ink-2">
      <span className={cx("relative h-6 w-10 rounded-full transition-colors", on ? "bg-primary" : "bg-surface-2")}>
        <span className={cx("absolute top-1 size-4 rounded-full bg-white transition-all", on ? "start-5" : "start-1")} />
      </span>
      {label}
    </button>
  );

  return (
    <div className="pb-24">
      <button type="button" onClick={useMyLocation} className="tap flex w-full items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 text-start text-lg font-semibold text-ink-2">
        <Icon name="pin" className={cx("size-5", located ? "text-primary" : "text-ink-2")} />
        <span className="flex-1">{located ? t("map.useLocation") + " ✓" : t("map.search")}</span>
      </button>
      <p className="mb-3 mt-2 px-2 text-xs text-muted">{t("map.locationNote")}</p>
      {note && <div className="mb-3"><Notice tone="warn">{note}</Notice></div>}

      <div className="mx-auto mb-4 grid w-fit grid-cols-2 gap-1 rounded-full bg-surface-2 p-1" role="tablist">
        {(["list", "map"] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={cx("tap min-w-24 rounded-full px-5 text-sm font-bold", view === v ? "bg-primary text-primary-ink" : "text-muted")} onClick={() => setView(v)}>
            {t(v === "list" ? "map.list" : "map.mapView")}
          </button>
        ))}
      </div>
      {view === "map" && <div className="mb-4"><LeafletMap center={center} places={places} located={located} /></div>}

      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1" role="radiogroup" aria-label="Category">
        {CATEGORIES.map(([c, icon]) => (
          <button key={c} role="radio" aria-checked={category === c} className={chip(category === c)} onClick={() => setCategory(c)}>
            <Icon name={icon} className="size-[18px]" /> {t(`map.cat.${c}` as DictKey)}
          </button>
        ))}
      </div>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1">
        <Switch on={openNow} onClick={() => setOpenNow(!openNow)} label={t("map.openNowOnly")} />
        <Switch on={verifiedOnly} onClick={() => setVerified(!verifiedOnly)} label={t("map.verifiedOnly")} />
      </div>

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

      <div className="space-y-3" aria-busy={busy}>
        {places.length === 0 && !busy ? <p className="rounded-3xl border border-line bg-surface p-5 text-ink-2">{t("map.none")}</p> : places.map((p) => <PlaceCard key={p.id} p={p} detailHref={`/map/${p.id}`} />)}
      </div>

      <div className="fixed inset-x-0 bottom-28 z-30 mx-auto max-w-md px-4">
        <Link href="/bathroom" className="tap flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-lg font-extrabold text-accent-ink shadow-[0_12px_30px_rgba(255,123,92,.35)] transition active:scale-[0.98]">
          <Icon name="wc" className="size-6" /> {t("map.cantWait")}
        </Link>
      </div>
    </div>
  );
}
