import { describe, expect, it } from "vitest";
import { makeUser } from "./helpers";
import { prisma } from "@/server/db";
import { createMedication, logMedicationEvent, adherence, nextDue, medicationOverview, getMedication } from "@/server/services/medications";
import { logSymptoms, getEntryForDay, repeatYesterday, baselineChanges } from "@/server/services/symptoms";
import { interpretLog, confirmLog, cancelLog } from "@/server/services/naturalLog";
import { generateSummary, getSummary, createShareLink, readSharedSummary, revokeShareLink, updateSummaryQuestions } from "@/server/services/summary";
import { renderSummaryPdf } from "@/server/services/summaryPdf";
import { providerFor } from "@/server/ai";
import { setConsent } from "@/server/services/privacy";
import { submitQuestionnaire } from "@/server/services/questionnaires";
import { addDays, todayDay } from "@/lib/dates";

describe("medications", () => {
  it("supports any route/form and neutral adherence counts", async () => {
    const u = await makeUser();
    const enema = await createMedication(u.id, { name: "Mesalazine enema", dose: 1, unit: "g", route: "RECTAL", form: "ENEMA", intervalDays: 1 });
    const cream = await createMedication(u.id, { name: "Barrier cream", route: "TOPICAL", form: "CREAM", asNeeded: true });
    expect(enema.route).toBe("RECTAL");
    expect(cream.asNeeded).toBe(true);
    await logMedicationEvent(u.id, enema.id, { status: "TAKEN" });
    await logMedicationEvent(u.id, enema.id, { status: "SKIPPED", reason: "Travelling" });
    const m = await getMedication(u.id, enema.id);
    const a = adherence(m, m.events, new Date(Date.now() - 86400_000 * 7), new Date());
    expect(a).toMatchObject({ taken: 1, skipped: 1, delayed: 0 });
    const overview = await medicationOverview(u.id);
    expect(overview.find((x) => x.id === cream.id)?.nextDue).toBeNull();
  });

  it("computes the next dose from the last taken dose", () => {
    const last = new Date("2026-09-20T09:00:00Z");
    const due = nextDue({ asNeeded: false, intervalDays: 14, startDate: null, active: true }, last, new Date("2026-09-25T00:00:00Z"));
    expect(due?.toISOString().slice(0, 10)).toBe("2026-10-04");
  });
});

describe("symptom logging", () => {
  it("is additive per day and can repeat yesterday in one tap", async () => {
    const u = await makeUser();
    const today = todayDay();
    await logSymptoms(u.id, { date: addDays(today, -1), bowelMovements: 3, pain: 1, blood: 0 });
    await logSymptoms(u.id, { overall: 4 });
    await logSymptoms(u.id, { bowelMovements: 2 });
    const e = await getEntryForDay(u.id);
    expect(e).toMatchObject({ overall: 4, bowelMovements: 2 });
    expect(await prisma.symptomEntry.count({ where: { userId: u.id } })).toBe(2);
    await prisma.symptomEntry.deleteMany({ where: { userId: u.id, date: new Date(`${today}T00:00:00Z`) } });
    const rep = await repeatYesterday(u.id, today);
    expect(rep).toMatchObject({ bowelMovements: 3, pain: 1, blood: 0 });
  });

  it("reports a neutral change against the personal baseline", async () => {
    const u = await makeUser();
    const today = todayDay();
    for (let i = 40; i >= 0; i--) await logSymptoms(u.id, { date: addDays(today, -i), bowelMovements: i <= 2 ? 6 : 2 });
    const changes = await baselineChanges(u.id, today);
    expect(changes).toEqual([expect.objectContaining({ metric: "bowelMovements", consecutiveDays: 3 })]);
  });
});

describe("Tell VIVIA", () => {
  it("interprets without saving, then saves only what is confirmed", async () => {
    const u = await makeUser();
    const ada = await createMedication(u.id, { name: "Adalimumab", dose: 40, unit: "mg", route: "SUBCUTANEOUS", form: "INJECTION", intervalDays: 14 });
    const r = await interpretLog(u.id, "Went to the bathroom 5 times, no blood, pain 3/10, took my adalimumab");
    expect(r.parsed.bowelMovements).toBe(5);
    expect(await prisma.symptomEntry.count({ where: { userId: u.id } })).toBe(0);
    await confirmLog(u.id, r.runId, { ...r.parsed, pain: 4 });
    const e = await getEntryForDay(u.id);
    expect(e).toMatchObject({ bowelMovements: 5, blood: 0, pain: 4, sourceType: "AI_NATURAL_LANGUAGE", sourceId: r.runId });
    expect(e?.rawText).toContain("bathroom 5 times");
    const evs = await prisma.medicationEvent.findMany({ where: { medicationId: ada.id } });
    expect(evs).toHaveLength(1);
    const run = await prisma.aiRun.findUniqueOrThrow({ where: { id: r.runId } });
    expect(run.userConfirmed).toBe(true);
    await expect(confirmLog(u.id, r.runId, r.parsed)).rejects.toThrow(/already/);
  });

  it("cancel leaves no health data", async () => {
    const u = await makeUser();
    const r = await interpretLog(u.id, "4 stools, mild pain");
    await cancelLog(u.id, r.runId);
    expect(await prisma.symptomEntry.count({ where: { userId: u.id } })).toBe(0);
  });
});

describe("AI consent", () => {
  it("uses third-party AI only when configured AND consented", async () => {
    const u = await makeUser();
    const { resetAIConfigForTests } = await import("@/server/ai");
    process.env.AI_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "test-key";
    resetAIConfigForTests();
    try {
      expect((await providerFor(u.id, "AI_PROCESSING")).name).toBe("vivia-rules");
      await setConsent(u.id, "AI_PROCESSING", true);
      expect((await providerFor(u.id, "AI_PROCESSING")).name).toBe("anthropic");
      expect((await providerFor(u.id, "DOCUMENT_AI_PROCESSING")).name).toBe("vivia-rules");
      await setConsent(u.id, "AI_PROCESSING", false);
      expect((await providerFor(u.id, "AI_PROCESSING")).name).toBe("vivia-rules");
    } finally {
      process.env.AI_PROVIDER = "rules";
      delete process.env.ANTHROPIC_API_KEY;
      resetAIConfigForTests();
    }
  });
});

describe("care summary", () => {
  async function seeded() {
    const u = await makeUser();
    const today = todayDay();
    for (let i = 40; i >= 0; i--) await logSymptoms(u.id, { date: addDays(today, -i), bowelMovements: i <= 2 ? 6 : 2, pain: 2, blood: i === 1 ? 1 : 0 });
    const ada = await createMedication(u.id, { name: "Adalimumab", dose: 40, unit: "mg", route: "SUBCUTANEOUS", form: "INJECTION", intervalDays: 14 });
    await logMedicationEvent(u.id, ada.id, { status: "SKIPPED", reason: "Felt unwell" });
    await prisma.labResult.create({ data: { userId: u.id, testCode: "CRP", testName: "C-reactive protein (CRP)", value: 12.4, unit: "mg/L", takenAt: new Date(`${addDays(today, -10)}T00:00:00Z`), sourceType: "PATIENT_ENTERED" } });
    return u;
  }

  it("builds a sourced, safe summary with patient questions", async () => {
    const u = await seeded();
    const s = await generateSummary(u.id, { periodDays: 90, sections: ["symptoms", "medications", "adherence", "labs", "trends", "questions", "concerns"], concerns: "Tiredness at work" });
    const c = (await getSummary(u.id, s.id)).content;
    expect(c.symptoms?.changes[0]).toMatch(/above the patient's recent 30-day baseline for 3 days/);
    expect(c.medications?.[0].name).toBe("Adalimumab");
    expect(c.adherence?.[0]).toMatchObject({ skipped: 1, reasons: ["Felt unwell"] });
    expect(c.labs?.[0].value).toBe("12.4 mg/L");
    expect(c.questions!.length).toBeGreaterThan(2);
    expect(c.questions!.join(" ")).toMatch(/Tiredness at work/);
    expect(JSON.stringify(c)).not.toMatch(/you (have|are having) a flare/i);
    expect(c.patient).not.toHaveProperty("email");
    expect(c.sourceRefs.length).toBeGreaterThan(40);
    const run = await prisma.aiRun.findFirstOrThrow({ where: { id: s.aiRunId! } });
    expect(run.inputScope).toMatchObject({ identityDataSent: false, periodDays: 90 });
    const pdf = await renderSummaryPdf(c);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("respects the sections the patient chose", async () => {
    const u = await seeded();
    const s = await generateSummary(u.id, { periodDays: 30, sections: ["medications"] });
    const c = (await getSummary(u.id, s.id)).content;
    expect(c.symptoms).toBeUndefined();
    expect(c.labs).toBeUndefined();
    expect(c.questions).toBeUndefined();
  });

  it("lets the patient edit questions (guarded) and share with an expiring, revocable link", async () => {
    const u = await seeded();
    const s = await generateSummary(u.id, { periodDays: 30, sections: ["symptoms", "questions"] });
    await updateSummaryQuestions(u.id, s.id, ["What should I watch for?", "You should stop taking your medication."]);
    expect((await getSummary(u.id, s.id)).content.questions).toEqual(["What should I watch for?"]);
    const { token, link } = await createShareLink(u.id, s.id, 7);
    expect(link.tokenHash).not.toBe(token);
    const shared = await readSharedSummary(token);
    expect(shared?.content.questions).toEqual(["What should I watch for?"]);
    expect(await readSharedSummary("wrong-token")).toBeNull();
    await revokeShareLink(u.id, link.id);
    expect(await readSharedSummary(token)).toBeNull();
    const t2 = await createShareLink(u.id, s.id, 1);
    await prisma.shareLink.update({ where: { id: t2.link.id }, data: { expiresAt: new Date(Date.now() - 1) } });
    expect(await readSharedSummary(t2.token)).toBeNull();
    await expect(createShareLink(u.id, s.id, 400)).rejects.toThrow();
    expect(await prisma.auditLog.count({ where: { userId: u.id, action: "summary.share_link_accessed" } })).toBe(1);
  });
});

describe("validated questionnaires", () => {
  it("scores HBI patient items and validates answers", async () => {
    const u = await makeUser();
    const r = await submitQuestionnaire(u.id, "HBI", { wellbeing: 1, pain: 2, liquidStools: 3, complications: ["arthralgia"] });
    expect(r.score).toBe(7);
    expect(r.instrumentVersion).toBeTruthy();
    await expect(submitQuestionnaire(u.id, "HBI", { wellbeing: 9, pain: 0, liquidStools: 1 })).rejects.toThrow();
    await expect(submitQuestionnaire(u.id, "NOPE", {})).rejects.toThrow();
  });
});
