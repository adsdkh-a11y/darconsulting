import { describe, expect, it } from "vitest";
import { makeUser } from "./helpers";
import { prisma } from "@/server/db";
import { nearby, isOpenNow, reviewLocation, reportLocation, getLocation } from "@/server/services/locations";
import { exportUserData, deleteAccount, currentConsents, setConsent } from "@/server/services/privacy";
import { logSymptoms } from "@/server/services/symptoms";
import { createShareLink, generateSummary } from "@/server/services/summary";
import { uploadDocument } from "@/server/services/documents";
import { encryptTextPdf } from "./pdf";
import { existsSync } from "node:fs";

const DUOMO = { lat: 45.4642, lng: 9.19 };
const weekdays = [0, 1, 2, 3, 4, 5, 6];

async function seedPlaces() {
  const mk = (name: string, dLat: number, extra: Record<string, unknown> = {}, features: [string, string][] = []) =>
    prisma.location.create({
      data: {
        name, category: "BATHROOM", latitude: DUOMO.lat + dLat, longitude: DUOMO.lng, source: "test", verificationType: "USER_REPORTED", ...extra,
        features: { create: features.map(([feature, status]) => ({ feature, status })) },
      },
    });
  const near = await mk("Near, closed at night", 0.001, { hoursJson: weekdays.map((d) => ({ d, open: "08:00", close: "20:00" })) });
  const allDay = await mk("24h verified", 0.004, { open24h: true, verificationType: "VIVIA_VERIFIED" }, [["accessible", "VERIFIED"], ["sink", "VERIFIED"], ["disposal_bin", "VERIFIED"]]);
  const community = await mk("Community stoma", 0.002, { open24h: true }, [["accessible", "COMMUNITY_REPORTED"], ["sink", "UNVERIFIED"]]);
  const far = await mk("Far away", 0.3, { open24h: true });
  await prisma.location.create({ data: { name: "Pharmacy", category: "PHARMACY", latitude: DUOMO.lat, longitude: DUOMO.lng + 0.001, source: "test", verificationType: "MAP_PROVIDER" } });
  return { near, allDay, community, far };
}

describe("life map", () => {
  it("computes open-now in local time", () => {
    const loc = { open24h: false, hoursJson: weekdays.map((d) => ({ d, open: "08:00", close: "20:00" })) };
    expect(isOpenNow(loc, new Date("2026-09-30T10:00:00Z"))).toBe(true); // 12:00 in Rome
    expect(isOpenNow(loc, new Date("2026-09-30T20:30:00Z"))).toBe(false); // 22:30 in Rome
    expect(isOpenNow({ open24h: false, hoursJson: null })).toBeNull();
  });

  it("ranks the nearest OPEN bathroom first, with walking time", async () => {
    const p = await seedPlaces();
    const night = new Date("2026-09-30T21:00:00Z");
    const res = await nearby({ ...DUOMO, category: "BATHROOM", limit: 10, now: night });
    expect(res[0].id).toBe(p.community.id);
    expect(res.at(-1)?.id).toBe(p.near.id); // closed goes last
    expect(res.every((r) => r.category === "BATHROOM")).toBe(true);
    expect(res.find((r) => r.id === p.far.id)).toBeUndefined(); // outside the first radius that had results
    expect(res[0].walkMinutes).toBeGreaterThan(0);
    const openOnly = await nearby({ ...DUOMO, category: "BATHROOM", openNow: true, limit: 10, now: night });
    expect(openOnly.find((r) => r.id === p.near.id)).toBeUndefined();
  });

  it("filters stoma features and never counts UNVERIFIED as present", async () => {
    const p = await seedPlaces();
    const res = await nearby({ ...DUOMO, category: "BATHROOM", features: ["accessible", "sink"], limit: 10 });
    expect(res.map((r) => r.id)).toEqual([p.allDay.id]);
    const verified = await nearby({ ...DUOMO, category: "BATHROOM", verifiedOnly: true, limit: 10 });
    expect(verified.map((r) => r.id)).toEqual([p.allDay.id]);
  });

  it("community reviews raise features to COMMUNITY_REPORTED, never VERIFIED", async () => {
    const p = await seedPlaces();
    const u = await makeUser({ hasStoma: true });
    await reviewLocation(u.id, p.community.id, { reliability: 4, features: ["sink", "changing_area"] });
    const loc = await getLocation(p.community.id, u.id);
    const st = Object.fromEntries(loc.features.map((f) => [f.feature, f.status]));
    expect(st).toMatchObject({ sink: "COMMUNITY_REPORTED", changing_area: "COMMUNITY_REPORTED" });
    expect(loc.reliability).toBe(4);
    expect(loc.reviews[0]).not.toHaveProperty("userId");
    expect(loc.reviews[0].mine).toBe(true);
    await reportLocation(u.id, p.community.id, { issue: "wrong_hours" });
    expect(await prisma.locationReport.count()).toBe(1);
  });
});

describe("privacy", () => {
  it("records consent history and current state", async () => {
    const u = await makeUser();
    await setConsent(u.id, "AI_PROCESSING", true);
    await setConsent(u.id, "AI_PROCESSING", false);
    expect((await currentConsents(u.id)).AI_PROCESSING?.granted).toBe(false);
    expect(await prisma.consent.count({ where: { userId: u.id, type: "AI_PROCESSING" } })).toBe(3);
  });

  it("exports all user data", async () => {
    const u = await makeUser();
    await logSymptoms(u.id, { bowelMovements: 3 });
    const exp = await exportUserData(u.id);
    expect(exp.exportFormat).toBe("vivia-export-v1");
    expect(exp.symptomEntries).toHaveLength(1);
    expect(exp).not.toHaveProperty("passwordHash");
    expect(exp.consents.length).toBeGreaterThan(0);
  });

  it("deletes the account, files, summaries and share links", async () => {
    const u = await makeUser();
    const keep = await makeUser();
    await logSymptoms(u.id, { bowelMovements: 3 });
    await logSymptoms(keep.id, { bowelMovements: 1 });
    const doc = await uploadDocument(u.id, { fileName: "x.pdf", data: await encryptTextPdf("CRP 3 mg/L") });
    const s = await generateSummary(u.id, { periodDays: 30, sections: ["symptoms"] });
    await createShareLink(u.id, s.id);
    await deleteAccount(u.id, "test");
    expect(await prisma.user.findUnique({ where: { id: u.id } })).toBeNull();
    expect(await prisma.symptomEntry.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.visitSummary.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.shareLink.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.aiRun.count({ where: { userId: u.id } })).toBe(0);
    expect(await prisma.auditLog.count({ where: { userId: u.id } })).toBe(0);
    expect(existsSync(`${process.env.STORAGE_DIR}/${doc.storageKey}`)).toBe(false);
    expect(await prisma.deletionRecord.count()).toBe(1);
    expect(await prisma.symptomEntry.count({ where: { userId: keep.id } })).toBe(1);
  });
});
