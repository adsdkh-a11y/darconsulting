import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodTypeAny, type z } from "zod";
import { currentUser } from "./session";
import { HttpError, unauthorized, forbidden } from "./errors";

type Ctx<P> = { params: Promise<P> };

/** Reject cross-site state-changing requests (defence in depth on top of SameSite=Lax). */
function checkOrigin(req: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const origin = req.headers.get("origin");
  if (!origin) return; // same-origin fetches from older browsers / server-side calls
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (new URL(origin).host !== host) throw forbidden("Cross-origin request rejected");
}

export function handleError(err: unknown) {
  if (err instanceof HttpError)
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  if (err instanceof ZodError)
    return NextResponse.json({ error: "Invalid input", code: "validation", issues: err.issues }, { status: 400 });
  console.error(err);
  return NextResponse.json({ error: "Something went wrong", code: "internal" }, { status: 500 });
}

/** Authenticated route handler. The user id comes ONLY from the session. */
export function withUser<P = Record<string, string>>(
  fn: (args: { req: NextRequest; userId: string; params: P }) => Promise<unknown>,
) {
  return async (req: NextRequest, ctx: Ctx<P>) => {
    try {
      checkOrigin(req);
      const user = await currentUser();
      if (!user) throw unauthorized();
      const params = ctx?.params ? await ctx.params : ({} as P);
      const out = await fn({ req, userId: user.id, params });
      if (out instanceof Response) return out;
      return NextResponse.json(out ?? { ok: true });
    } catch (err) {
      return handleError(err);
    }
  };
}

export async function body<S extends ZodTypeAny>(req: NextRequest, schema: S): Promise<z.infer<S>> {
  const json = await req.json().catch(() => ({}));
  return schema.parse(json);
}
