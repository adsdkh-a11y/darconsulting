import { NextResponse, type NextRequest } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { verifyCredentials, createSession } from "@/server/auth";
import { setSessionCookie } from "@/server/session";
import { handleError } from "@/server/http";
import { rateLimit } from "@/server/rateLimit";
import { prisma } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    rateLimit(req, "login", 20);
    const { email, password } = loginSchema.parse(await req.json());
    const user = await verifyCredentials(email, password);
    const s = await createSession(user.id);
    await setSessionCookie(s.token, s.expiresAt);
    const profile = await prisma.patientProfile.findUnique({ where: { userId: user.id }, select: { onboardingCompleted: true } });
    return NextResponse.json({ ok: true, next: profile?.onboardingCompleted ? "/home" : "/onboarding" });
  } catch (e) {
    return handleError(e);
  }
}
