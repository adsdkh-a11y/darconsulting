/**
 * VIVIA LIFE MAP. Privacy: coordinates arrive per request, are used to sort
 * results, and are NEVER stored (no location history).
 */
import type { Location, LocationCategory, LocationFeature, Prisma } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { notFound } from "../errors";
import { externalProvider } from "../maps/providers";

export type Hours = { d: number; open: string; close: string }[];

export function haversineMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371e3;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Open-now in the location's local time (Europe/Rome for the MVP data set). Unknown hours → null. */
export function isOpenNow(loc: Pick<Location, "open24h" | "hoursJson">, now = new Date(), timeZone = "Europe/Rome"): boolean | null {
  if (loc.open24h) return true;
  const hours = loc.hoursJson as Hours | null;
  if (!hours || !Array.isArray(hours) || !hours.length) return null;
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")!.value);
  const hm = `${parts.find((p) => p.type === "hour")!.value.replace("24", "00")}:${parts.find((p) => p.type === "minute")!.value}`;
  return hours.some((h) => h.d === wd && (h.close > h.open ? hm >= h.open && hm < h.close : hm >= h.open || hm < h.close));
}

export type FeatureStatus = "VERIFIED" | "COMMUNITY_REPORTED" | "UNVERIFIED";

export type NearbyResult = Location & {
  distanceMeters: number;
  walkMinutes: number;
  openNow: boolean | null;
  reliability: number | null;
  reviewCount: number;
  features: LocationFeature[];
};

export async function nearby(opts: {
  lat: number;
  lng: number;
  category?: LocationCategory;
  features?: string[];
  verifiedOnly?: boolean;
  openNow?: boolean;
  limit: number;
  now?: Date;
}): Promise<NearbyResult[]> {
  let results: NearbyResult[] = [];
  // Expand the search radius until something is found (emergency UX: never "no results" if avoidable).
  for (const r of [3000, 10000, 50000]) {
    const dLat = r / 111_000;
    const dLng = r / (111_000 * Math.cos((opts.lat * Math.PI) / 180));
    const where: Prisma.LocationWhereInput = {
      latitude: { gte: opts.lat - dLat, lte: opts.lat + dLat },
      longitude: { gte: opts.lng - dLng, lte: opts.lng + dLng },
      ...(opts.category ? { category: opts.category } : {}),
      ...(opts.verifiedOnly ? { verificationType: { in: ["VIVIA_VERIFIED", "PARTNER_VERIFIED"] } } : {}),
    };
    const rows = await prisma.location.findMany({ where, include: { features: true, reviews: { select: { reliability: true } } }, take: 500 });
    results = rows
      .map(({ reviews, ...l }) => {
        const distanceMeters = Math.round(haversineMeters(opts.lat, opts.lng, l.latitude, l.longitude));
        return {
          ...l,
          distanceMeters,
          walkMinutes: Math.max(1, Math.round(distanceMeters / 80)),
          openNow: isOpenNow(l, opts.now),
          reliability: reviews.length ? Math.round((reviews.reduce((a, b) => a + b.reliability, 0) / reviews.length) * 10) / 10 : null,
          reviewCount: reviews.length,
        };
      })
      .filter((l) => l.distanceMeters <= r)
      .filter((l) => !opts.openNow || l.openNow !== false)
      .filter((l) => !opts.features?.length || opts.features.every((f) => l.features.some((x) => x.feature === f && x.status !== "UNVERIFIED")));
    if (results.length) break;
  }
  // Open places first, then unknown hours, then closed; within each, nearest first.
  const rank = (o: boolean | null) => (o === true ? 0 : o === null ? 1 : 2);
  return results.sort((a, b) => rank(a.openNow) - rank(b.openNow) || a.distanceMeters - b.distanceMeters).slice(0, opts.limit);
}

/** Pull candidate places from an external provider into VIVIA (tagged MAP_PROVIDER). */
export async function importExternal(lat: number, lng: number, category: LocationCategory) {
  const provider = externalProvider();
  if (!provider) return 0;
  const places = await provider.search(lat, lng, category, 3000).catch(() => []);
  for (const p of places) {
    const existing = await prisma.location.findFirst({ where: { externalId: p.externalId } });
    if (existing) continue;
    await prisma.location.create({
      data: { ...p, source: provider.name, verificationType: "MAP_PROVIDER", lastVerifiedAt: new Date(), open24h: p.open24h ?? false },
    });
  }
  return places.length;
}

export async function getLocation(id: string, userId?: string) {
  const loc = await prisma.location.findUnique({
    where: { id },
    include: { features: true, reviews: { orderBy: { createdAt: "desc" }, take: 20, select: { id: true, reliability: true, cleanliness: true, comment: true, features: true, createdAt: true, userId: true } } },
  });
  if (!loc) throw notFound("Place not found");
  const reliability = loc.reviews.length ? Math.round((loc.reviews.reduce((a, b) => a + b.reliability, 0) / loc.reviews.length) * 10) / 10 : null;
  // Reviewer identity is never exposed; only "you" is marked.
  const reviews = loc.reviews.map(({ userId: uid, ...r }) => ({ ...r, mine: uid === userId }));
  return { ...loc, reviews, reliability, openNow: isOpenNow(loc) };
}

export async function reviewLocation(userId: string, locationId: string, input: { reliability: number; cleanliness?: number | null; comment?: string | null; features: string[] }) {
  await getLocation(locationId);
  await prisma.locationReview.upsert({
    where: { locationId_userId: { locationId, userId } },
    create: { locationId, userId, reliability: input.reliability, cleanliness: input.cleanliness ?? null, comment: input.comment ?? null, features: input.features },
    update: { reliability: input.reliability, cleanliness: input.cleanliness ?? null, comment: input.comment ?? null, features: input.features },
  });
  // Community reports can raise UNVERIFIED → COMMUNITY_REPORTED, never → VERIFIED.
  for (const f of input.features) {
    const existing = await prisma.locationFeature.findUnique({ where: { locationId_feature: { locationId, feature: f } } });
    if (!existing) await prisma.locationFeature.create({ data: { locationId, feature: f, status: "COMMUNITY_REPORTED" } });
    else
      await prisma.locationFeature.update({
        where: { id: existing.id },
        data: { reportedBy: { increment: 1 }, ...(existing.status === "UNVERIFIED" ? { status: "COMMUNITY_REPORTED" } : {}) },
      });
  }
  await audit(userId, "location.reviewed", "Location", locationId);
}

export async function reportLocation(userId: string, locationId: string, input: { issue: string; details?: string | null }) {
  await getLocation(locationId);
  await prisma.locationReport.create({ data: { locationId, userId, issue: input.issue, details: input.details ?? null } });
  await audit(userId, "location.reported", "Location", locationId, { issue: input.issue });
}
