/**
 * User A must NEVER access User B's health data.
 * Every service that takes an entity id is called with the wrong user.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { makeUser } from "./helpers";
import { createMedication, getMedication, logMedicationEvent, updateMedication, setMedicationActive, listMedications } from "@/server/services/medications";
import { logSymptoms, listEntries } from "@/server/services/symptoms";
import { uploadDocument, getDocument, downloadDocument, reviewField, applyReviewedFields, deleteDocument, listDocuments } from "@/server/services/documents";
import { generateSummary, getSummary, createShareLink, revokeShareLink, updateSummaryQuestions } from "@/server/services/summary";
import { createVisit, getVisit, deleteVisit } from "@/server/services/visits";
import { resolveConflict, listConflicts } from "@/server/services/conflicts";
import { buildTimeline } from "@/server/services/timeline";
import { confirmLog, interpretLog } from "@/server/services/naturalLog";
import { exportUserData } from "@/server/services/privacy";
import { prisma } from "@/server/db";
import { encryptTextPdf } from "./pdf";

const med = { name: "Adalimumab", dose: 40, unit: "mg", route: "SUBCUTANEOUS" as const, form: "INJECTION" as const, intervalDays: 7 };

describe("patient isolation", () => {
  it("blocks every cross-user read and write", async () => {
    const a = await makeUser();
    const b = await makeUser();

    const mA = await createMedication(a.id, med);
    await logSymptoms(a.id, { bowelMovements: 4, pain: 2 });
    const doc = await uploadDocument(a.id, { fileName: "labs.pdf", data: await encryptTextPdf(readFileSync("tests/fixtures/bloodtest.txt", "utf8")) });
    const field = doc.extractions[0].fields[0];
    const visit = await createVisit(a.id, { scheduledAt: "2026-10-14T09:00:00Z", doctorName: "Dr. Demo" });
    const summary = await generateSummary(a.id, { periodDays: 30, sections: ["symptoms", "medications", "questions"] });
    const { link } = await createShareLink(a.id, summary.id);
    const nl = await interpretLog(a.id, "5 times to the bathroom");

    await expect(getMedication(b.id, mA.id)).rejects.toThrow(/not found/i);
    await expect(updateMedication(b.id, mA.id, med)).rejects.toThrow(/not found/i);
    await expect(setMedicationActive(b.id, mA.id, false)).rejects.toThrow(/not found/i);
    await expect(logMedicationEvent(b.id, mA.id, { status: "TAKEN" })).rejects.toThrow(/not found/i);
    await expect(getDocument(b.id, doc.id)).rejects.toThrow(/not found/i);
    await expect(downloadDocument(b.id, doc.id)).rejects.toThrow(/not found/i);
    await expect(reviewField(b.id, field.id, "confirm")).rejects.toThrow(/not found/i);
    await expect(applyReviewedFields(b.id, doc.id)).rejects.toThrow(/not found/i);
    await expect(deleteDocument(b.id, doc.id)).rejects.toThrow(/not found/i);
    await expect(getVisit(b.id, visit.id)).rejects.toThrow(/not found/i);
    await expect(deleteVisit(b.id, visit.id)).rejects.toThrow(/not found/i);
    await expect(getSummary(b.id, summary.id)).rejects.toThrow(/not found/i);
    await expect(updateSummaryQuestions(b.id, summary.id, ["x"])).rejects.toThrow(/not found/i);
    await expect(createShareLink(b.id, summary.id)).rejects.toThrow(/not found/i);
    await expect(revokeShareLink(b.id, link.id)).rejects.toThrow(/not found/i);
    await expect(generateSummary(b.id, { visitId: visit.id, periodDays: 30, sections: ["symptoms"] })).rejects.toThrow(/not found/i);
    await expect(confirmLog(b.id, nl.runId, nl.parsed)).rejects.toThrow(/not found/i);

    // Lists and aggregates for B contain none of A's data.
    expect(await listMedications(b.id)).toHaveLength(0);
    expect(await listDocuments(b.id)).toHaveLength(0);
    expect(await listEntries(b.id, "2000-01-01", "2100-01-01")).toHaveLength(0);
    expect(await buildTimeline(b.id)).toHaveLength(0);
    expect(await listConflicts(b.id)).toHaveLength(0);
    const exportB = await exportUserData(b.id);
    expect(JSON.stringify(exportB)).not.toContain(mA.id);
    expect(JSON.stringify(exportB)).not.toContain(doc.id);

    // A's data is intact.
    expect((await getMedication(a.id, mA.id)).dose).toBe(40);
    expect(await prisma.medicalDocument.count({ where: { userId: a.id } })).toBe(1);
  });

  it("does not let a user resolve another user's conflict", async () => {
    const a = await makeUser();
    const b = await makeUser();
    await createMedication(a.id, med);
    const doc = await uploadDocument(a.id, { fileName: "rx.pdf", data: await encryptTextPdf(readFileSync("tests/fixtures/prescription.txt", "utf8")) });
    const adaField = doc.extractions[0].fields.find((f) => f.key === "medication:adalimumab")!;
    await reviewField(a.id, adaField.id, "confirm");
    const { conflicts } = await applyReviewedFields(a.id, doc.id);
    expect(conflicts).toHaveLength(1);
    await expect(resolveConflict(b.id, conflicts[0], "KEEP_NEW")).rejects.toThrow(/not found/i);
  });
});
