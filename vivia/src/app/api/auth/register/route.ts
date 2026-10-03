import { NextResponse, type NextRequest } from "next/server";
import { registerSchema } from "@/lib/schemas";
import { registerUser, createSession } from "@/server/auth";
import { setSessionCookie } from "@/server/session";
import { handleError } from "@/server/http";
import { rateLimit } from "@/server/rateLimit";

export async function POST(req: NextRequest) {
  try {
    rateLimit(req, "register", 10);
    const input = registerSchema.parse(await req.json());
    const user = await registerUser(input);
    const s = await createSession(user.id);
    await setSessionCookie(s.token, s.expiresAt);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return handleError(e);
  }
}
