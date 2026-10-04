/**
 * External map/places providers. VIVIA's own Location table is the source the
 * app reads from; external providers only IMPORT candidate places, always
 * tagged verificationType=MAP_PROVIDER with source + lastVerifiedAt.
 * Directions are handed off to the user's maps app (no routing vendor lock-in).
 */
import type { LocationCategory } from "@prisma/client";

export type ExternalPlace = {
  externalId: string;
  name: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  openingHours?: string;
  accessible?: boolean;
  free?: boolean;
  open24h?: boolean;
};

export interface PlacesProvider {
  readonly name: string;
  search(lat: number, lng: number, category: LocationCategory, radiusMeters: number): Promise<ExternalPlace[]>;
}

const OSM_TAGS: Partial<Record<LocationCategory, string>> = {
  BATHROOM: '["amenity"="toilets"]',
  PHARMACY: '["amenity"="pharmacy"]',
  HOSPITAL: '["amenity"="hospital"]',
};

/** OpenStreetMap (Overpass API). Enabled with MAP_EXTERNAL_PROVIDER=overpass. */
export class OverpassProvider implements PlacesProvider {
  readonly name = "osm";
  constructor(private endpoint = process.env.OVERPASS_URL ?? "https://overpass-api.de/api/interpreter") {}
  async search(lat: number, lng: number, category: LocationCategory, radiusMeters: number) {
    const tag = OSM_TAGS[category];
    if (!tag) return [];
    const q = `[out:json][timeout:10];node${tag}(around:${Math.min(radiusMeters, 5000)},${lat},${lng});out 50;`;
    const res = await fetch(this.endpoint, { method: "POST", body: new URLSearchParams({ data: q }), signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const json = (await res.json()) as { elements: { id: number; lat: number; lon: number; tags?: Record<string, string> }[] };
    return json.elements.map((e) => ({
      externalId: `osm:node:${e.id}`,
      name: e.tags?.name ?? (category === "BATHROOM" ? "Public toilet" : category.toLowerCase()),
      category,
      latitude: e.lat,
      longitude: e.lon,
      openingHours: e.tags?.opening_hours,
      open24h: e.tags?.opening_hours === "24/7",
      accessible: e.tags?.wheelchair === "yes" ? true : e.tags?.wheelchair === "no" ? false : undefined,
      free: e.tags?.fee === "no" ? true : e.tags?.fee === "yes" ? false : undefined,
    }));
  }
}

export function externalProvider(): PlacesProvider | null {
  return process.env.MAP_EXTERNAL_PROVIDER === "overpass" ? new OverpassProvider() : null;
}
