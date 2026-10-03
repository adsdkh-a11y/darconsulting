export type Place = {
  id: string; name: string; category: string; latitude: number; longitude: number; address: string | null;
  openingHours: string | null; open24h: boolean; openNow: boolean | null; accessible: boolean | null; free: boolean | null;
  distanceMeters: number; walkMinutes: number; reliability: number | null; reviewCount: number; verificationType: string;
  features: { feature: string; status: string }[];
};

/** Demo fallback when location is unavailable: Milan city centre. */
export const FALLBACK_CENTER = { lat: 45.4642, lng: 9.19 };

export function directionsUrl(lat: number, lng: number) {
  const ios = typeof navigator !== "undefined" && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
  return ios ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=w` : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

export function fmtDistance(m: number) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

export async function fetchNearby(params: { lat: number; lng: number; category?: string; features?: string[]; verifiedOnly?: boolean; openNow?: boolean; limit?: number }): Promise<Place[]> {
  const q = new URLSearchParams({ lat: String(params.lat), lng: String(params.lng), limit: String(params.limit ?? 10) });
  if (params.category) q.set("category", params.category);
  if (params.features?.length) q.set("features", params.features.join(","));
  if (params.verifiedOnly) q.set("verifiedOnly", "1");
  if (params.openNow) q.set("openNow", "1");
  const r = await fetch(`/api/locations/nearby?${q}`, { cache: "no-store" });
  if (!r.ok) throw new Error("Search failed");
  return (await r.json()).results;
}

/** One-shot location request. Never watchPosition, never stored. */
export function locateOnce(timeoutMs = 8000): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
