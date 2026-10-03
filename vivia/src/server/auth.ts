import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { randomToken, sha256 } from "./crypto";
import { badRequest, HttpError } from "./errors";
import { audit } from "./audit";

export const SESSION_COOKIE = "vivia_session";
export const SESSION_TTL_DAYS = 30;

export const CONSENT_VERSION = "2026-09";

export async function registerUser(input: {
  email: string;
  password: string;
  locale?: string;
  consentHealthData: boolean;
  consentTerms: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw badRequest("Invalid email");
  if (input.password.length < 10) throw badRequest("Password must be at least 10 characters");
  // GDPR art. 9(2)(a): explicit consent is the legal basis for processing health data.
  if (!input.consentHealthData || !input.consentTerms)
    throw badRequest("Explicit consent is required to store health data");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An account with this email already exists", "conflict");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      locale: input.locale ?? "en",
      consents: {
        create: [
          { type: "TERMS_OF_SERVICE", granted: true, version: CONSENT_VERSION },
          { type: "HEALTH_DATA_PROCESSING", granted: true, version: CONSENT_VERSION },
          // AI & analytics are opt-in and off by default (privacy by default).
          { type: "AI_PROCESSING", granted: false, version: CONSENT_VERSION },
          { type: "DOCUMENT_AI_PROCESSING", granted: false, version: CONSENT_VERSION },
          { type: "PRODUCT_ANALYTICS", granted: false, version: CONSENT_VERSION },
        ],
      },
    },
  });
  await audit(user.id, "auth.register");
  return user;
}

export async function verifyCredentials(emailRaw: string, password: string) {
  const email = emailRaw.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  // Constant-ish work whether or not the user exists.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali");
  if (!user || !ok) throw new HttpError(401, "Invalid email or password", "invalid_credentials");
  return user;
}

export async function createSession(userId: string) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86400_000);
  await prisma.session.create({ data: { userId, tokenHash: sha256(token), expiresAt } });
  await audit(userId, "auth.login");
  return { token, expiresAt };
}

export async function userForToken(token: string | undefined | null) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function destroySession(token: string) {
  await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
}
