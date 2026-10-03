import { describe, expect, it } from "vitest";
import { registerUser, verifyCredentials, createSession, userForToken, destroySession } from "@/server/auth";
import { prisma } from "@/server/db";

const base = { password: "a long password", consentHealthData: true, consentTerms: true };

describe("authentication", () => {
  it("registers with explicit consent and privacy-by-default AI consents", async () => {
    const u = await registerUser({ email: "Anna@Example.test", ...base });
    expect(u.email).toBe("anna@example.test");
    expect(u.passwordHash).not.toContain("a long password");
    const consents = await prisma.consent.findMany({ where: { userId: u.id } });
    expect(consents.find((c) => c.type === "HEALTH_DATA_PROCESSING")?.granted).toBe(true);
    expect(consents.find((c) => c.type === "AI_PROCESSING")?.granted).toBe(false);
    expect(consents.find((c) => c.type === "PRODUCT_ANALYTICS")?.granted).toBe(false);
  });

  it("refuses registration without health-data consent", async () => {
    await expect(registerUser({ email: "x@example.test", ...base, consentHealthData: false })).rejects.toThrow(/consent/i);
  });

  it("rejects weak passwords and duplicate emails", async () => {
    await expect(registerUser({ email: "y@example.test", ...base, password: "short" })).rejects.toThrow();
    await registerUser({ email: "z@example.test", ...base });
    await expect(registerUser({ email: "Z@example.test", ...base })).rejects.toThrow(/exists/);
  });

  it("verifies credentials and manages hashed session tokens", async () => {
    const u = await registerUser({ email: "s@example.test", ...base });
    await expect(verifyCredentials("s@example.test", "wrong password")).rejects.toThrow();
    expect((await verifyCredentials("S@example.test", base.password)).id).toBe(u.id);
    const { token } = await createSession(u.id);
    const stored = await prisma.session.findFirst({ where: { userId: u.id } });
    expect(stored?.tokenHash).not.toBe(token);
    expect((await userForToken(token))?.id).toBe(u.id);
    expect(await userForToken("forged")).toBeNull();
    await destroySession(token);
    expect(await userForToken(token)).toBeNull();
  });

  it("rejects expired sessions", async () => {
    const u = await registerUser({ email: "e@example.test", ...base });
    const { token } = await createSession(u.id);
    await prisma.session.updateMany({ where: { userId: u.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    expect(await userForToken(token)).toBeNull();
  });
});
