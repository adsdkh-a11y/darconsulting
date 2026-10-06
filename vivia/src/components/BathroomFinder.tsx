"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "./I18n";
import { Button, Card, Notice, cx } from "./ui";
import { PlaceCard } from "./PlaceCard";
import { FALLBACK_CENTER, fetchNearby, locateOnce, type Place } from "@/lib/places";
import { Icon } from "./Icon";

const STOMA_DEFAULT = ["accessible", "sink", "disposal_bin"];

export function BathroomFinder({ signedIn, stoma }: { signedIn: boolean; stoma: boolean }) {
  const { t } = useI18n();
  const [state, setState] = useState<"locating" | "ready" | "error">("locating");
  const [places, setPlaces] = useState<Place[]>([]);
  const [usedFallback, setFallback] = useState(false);
  const [stomaOn, setStomaOn] = useState(stoma);
  const [card, setCard] = useState(false);

  const run = useCallback(async (withStoma: boolean) => {
    setState("locating");
    // The user tapped "Find a bathroom": that tap IS the location request.
    const pos = await locateOnce();
    setFallback(!pos);
    try {
      const res = await fetchNearby({ ...(pos ?? FALLBACK_CENTER), category: "BATHROOM", features: withStoma ? STOMA_DEFAULT : undefined, limit: 8 });
      setPlaces(res);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    run(stoma);
  }, [run, stoma]);

  if (card)
    return (
      <button className="fixed inset-0 z-50 flex items-center justify-center bg-surface p-8 text-center" onClick={() => setCard(false)} aria-label={t("common.close")}>
        <span>
          <Icon name="wc" className="mx-auto size-16" />
          <span className="mt-6 block font-display text-3xl leading-snug">{t("wc.cardText")}</span>
        </span>
      </button>
    );

  const nearest = places.find((p) => p.openNow !== false);
  const others = places.filter((p) => p !== nearest);

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-10 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <Link href={signedIn ? "/home" : "/welcome"} className="font-display text-xl font-semibold text-primary">VIVIA</Link>
        <Button variant="secondary" className="px-3 py-2 text-sm" onClick={() => setCard(true)}>{t("wc.card")}</Button>
      </div>
      <h1 className="font-display text-[2rem] font-extrabold tracking-[-0.035em]">{t("wc.title")}</h1>
      <p className="mb-4 text-sm text-muted">{t("wc.privacy")}</p>

      {stoma && (
        <button aria-pressed={stomaOn} onClick={() => { setStomaOn(!stomaOn); run(!stomaOn); }}
          className={cx("tap mb-3 w-full rounded-2xl border px-4 text-sm font-semibold", stomaOn ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface")}>
          {stomaOn ? "✓ " : ""}{t("map.stomaFilters")}
        </button>
      )}

      {state === "locating" && (
        <Card className="text-center" aria-live="polite">
          <Icon name="pin" className="mx-auto size-10 animate-pulse text-accent" />
          <p className="mt-2 font-medium">{t("wc.finding")}</p>
        </Card>
      )}
      {state === "error" && <Notice tone="warn">{t("common.error")}</Notice>}
      {state === "ready" && (
        <>
          {usedFallback && <div className="mb-3"><Notice tone="warn">{t("map.locationDenied")}</Notice></div>}
          {nearest ? (
            <Card className="rise border-2 border-accent">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{t("wc.nearest")}</p>
              <PlaceCard p={nearest} big detailHref={signedIn ? `/map/${nearest.id}` : undefined} />
            </Card>
          ) : (
            <Notice>{t("map.none")}</Notice>
          )}
          {others.length > 0 && (
            <>
              <h2 className="mb-1 mt-6 text-sm font-semibold uppercase tracking-wider text-muted">{t("wc.others")}</h2>
              <div className="space-y-3">{others.map((p) => <PlaceCard key={p.id} p={p} detailHref={signedIn ? `/map/${p.id}` : undefined} />)}</div>
            </>
          )}
          <Button variant="ghost" className="mt-3 w-full" onClick={() => run(stomaOn)}>↻ {t("map.useLocation")}</Button>
          <p className="mt-4 text-sm text-muted">{t("wc.tip")}</p>
        </>
      )}
      <p className="mt-6 text-center text-xs text-muted">{t("app.notDoctor")}</p>
    </main>
  );
}
