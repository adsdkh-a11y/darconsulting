import { NextResponse, type NextRequest } from "next/server";
import { nearbySchema } from "@/lib/schemas";
import { nearby, importExternal } from "@/server/services/locations";
import { handleError } from "@/server/http";

// PUBLIC on purpose: the emergency bathroom flow must work without an account.
// Coordinates are used for this response only; they are not logged or stored.
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = nearbySchema.parse({
      lat: sp.get("lat"),
      lng: sp.get("lng"),
      category: sp.get("category") ?? undefined,
      features: sp.get("features")?.split(",").filter(Boolean),
      verifiedOnly: sp.get("verifiedOnly") === "1",
      openNow: sp.get("openNow") === "1",
      limit: sp.get("limit") ?? undefined,
    });
    let results = await nearby(q);
    if (results.length < 3 && q.category && (await importExternal(q.lat, q.lng, q.category))) results = await nearby(q);
    return NextResponse.json(
      {
        results: results.map((r) => ({
          id: r.id, name: r.name, category: r.category, latitude: r.latitude, longitude: r.longitude, address: r.address,
          openingHours: r.openingHours, open24h: r.open24h, openNow: r.openNow, accessible: r.accessible, free: r.free,
          distanceMeters: r.distanceMeters, walkMinutes: r.walkMinutes, reliability: r.reliability, reviewCount: r.reviewCount,
          verificationType: r.verificationType, features: r.features.map((f) => ({ feature: f.feature, status: f.status })),
        })),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (e) {
    return handleError(e);
  }
}
