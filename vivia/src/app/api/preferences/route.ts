import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { handleError } from "@/server/http";

// Device-level display preferences (no health data): language before sign-in, text size, contrast.
const schema = z.object({ locale: z.enum(["en", "it", "fr", "es", "de", "ar"]).optional(), text: z.enum(["normal", "large"]).optional(), contrast: z.enum(["normal", "high"]).optional() });

export async function POST(req: NextRequest) {
  try {
    const p = schema.parse(await req.json());
    const res = NextResponse.json({ ok: true });
    const opts = { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" as const };
    if (p.locale) res.cookies.set("vivia_locale", p.locale, opts);
    if (p.text) res.cookies.set("vivia_text", p.text, opts);
    if (p.contrast) res.cookies.set("vivia_contrast", p.contrast, opts);
    return res;
  } catch (e) {
    return handleError(e);
  }
}
