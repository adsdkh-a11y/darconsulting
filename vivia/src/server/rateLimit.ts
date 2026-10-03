import type { NextRequest } from "next/server";
import { HttpError } from "./errors";

// In-memory fixed-window limiter for auth endpoints. Production: shared store (Redis) at the edge.
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimit(req: NextRequest, bucket: string, perMinute: number) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + 60_000 });
    return;
  }
  if (++h.n > perMinute) throw new HttpError(429, "Too many attempts. Please wait a minute.", "rate_limited");
}
