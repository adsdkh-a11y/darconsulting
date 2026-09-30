import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { makeUser } from "./helpers";
import { encryptTextPdf } from "./pdf";
import { uploadDocument, reviewField, applyReviewedFields, downloadDocument, deleteDocument } from "@/server/services/documents";
import { createMedication, getMedication } from "@/server/services/medications";
import { listConflicts, resolveConflict } from "@/server/services/conflicts";
import { validateUpload } from "@/server/services/fileValidation";
import { buildTimeline } from "@/server/services/timeline";
import { prisma } from "@/server/db";

const fx = (n: string) => readFileSync(`tests/fixtures/${n}`, "utf8");

describe("file validation", () => {
  it("accepts PDF/PNG/JPEG by magic bytes and rejects everything else", async () => {
    expect(validateUpload(await encryptTextPdf("hello")).ok).toBe(true);
    expect(validateUpload(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])).ok).toBe(true);
    expect(validateUpload(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0])).ok).toBe(true);
    expect(validateUpload(Buffer.from("MZ\x90\x00 executable")).ok).toBe(false);
    expect(validateUpload(Buffer.from("<html><script>")).ok).toBe(false);
    expect(validateUpload(Buffer.alloc(0)).ok).toBe(false);
    expect(validateUpload(Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(16 * 1024 * 1024)])).ok).toBe(false);
  });

  it("rejects PDFs with active content", () => {
    const r = validateUpload(Buffer.from("%PDF-1.4\n1 0 obj << /OpenAction << /S /JavaScript /JS (app.alert(1)) >> >>"));
    expect(r.ok).toBe(false);
  });
});

describe("document pipeline", () => {
  it("stores the file encrypted and extracts fields pending patient verification", async () => {
    const u = await makeUser();
    const pdf = await encryptTextPdf(fx("bloodtest.txt"));
    const doc = await uploadDocument(u.id, { fileName: "esami.pdf", data: pdf });
    expect(doc.status).toBe("NEEDS_REVIEW");
    expect(doc.type).toBe("BLOOD_TEST");
    const fields = doc.extractions[0].fields;
    expect(fields.every((f) => f.status === "PENDING")).toBe(true);
    expect(fields.every((f) => f.confidence > 0 && f.sourceSnippet)).toBe(true);
    // Nothing reaches the Health Memory before confirmation.
    expect(await prisma.labResult.count({ where: { userId: u.id } })).toBe(0);
    // Encrypted at rest, decrypted on download.
    const onDisk = readFileSync(`${process.env.STORAGE_DIR}/${doc.storageKey}`);
    expect(onDisk.subarray(0, 5).toString()).not.toBe("%PDF-");
    expect((await downloadDocument(u.id, doc.id)).data.equals(pdf)).toBe(true);
    // An AI run is recorded for auditability.
    const run = await prisma.aiRun.findFirst({ where: { userId: u.id, task: "DOCUMENT_EXTRACTION" } });
    expect(run?.sourceRefs).toContain(`MedicalDocument:${doc.id}`);
  });

  it("writes only confirmed/edited values, with provenance, and builds the timeline", async () => {
    const u = await makeUser();
    const doc = await uploadDocument(u.id, { fileName: "esami.pdf", data: await encryptTextPdf(fx("bloodtest.txt")) });
    const f = (k: string) => doc.extractions[0].fields.find((x) => x.key === k)!;
    await reviewField(u.id, f("document_date").id, "confirm");
    await reviewField(u.id, f("CRP").id, "confirm");
    await reviewField(u.id, f("HB").id, "edit", "11.9");
    await reviewField(u.id, f("FERRITIN").id, "reject");
    const res = await applyReviewedFields(u.id, doc.id);
    expect(res.applied).toHaveLength(2);
    const labs = await prisma.labResult.findMany({ where: { userId: u.id }, orderBy: { testCode: "asc" } });
    expect(labs.map((l) => [l.testCode, l.value])).toEqual([["CRP", 12.4], ["HB", 11.9]]);
    expect(labs.every((l) => l.sourceType === "DOCUMENT_EXTRACTION" && l.sourceId === doc.id)).toBe(true);
    expect(labs[0].takenAt.toISOString().slice(0, 10)).toBe("2026-09-03");
    const again = await prisma.medicalDocument.findUnique({ where: { id: doc.id } });
    expect(again?.status).toBe("NEEDS_REVIEW"); // PLT + calprotectin still pending
    await expect(reviewField(u.id, f("CRP").id, "reject")).rejects.toThrow(/already/);
    const tl = await buildTimeline(u.id, { from: new Date("2026-01-01") });
    expect(tl.some((i) => i.kind === "lab" && i.title.includes("C-reactive"))).toBe(true);
  });

  it("turns a colonoscopy into a procedure with verbatim findings", async () => {
    const u = await makeUser();
    const doc = await uploadDocument(u.id, { fileName: "colon.pdf", data: await encryptTextPdf(fx("colonoscopy.txt")) });
    for (const field of doc.extractions[0].fields) await reviewField(u.id, field.id, "confirm");
    await applyReviewedFields(u.id, doc.id);
    const proc = await prisma.procedure.findFirstOrThrow({ where: { userId: u.id } });
    expect(proc.type).toBe("COLONOSCOPY");
    expect(proc.biopsyTaken).toBe(true);
    expect(proc.findings).toContain("aphthous ulcers");
    expect(proc.performedAt.toISOString().slice(0, 10)).toBe("2026-06-12");
    expect((await prisma.medicalDocument.findUnique({ where: { id: doc.id } }))?.status).toBe("REVIEWED");
  });

  it("never merges conflicting medication data silently", async () => {
    const u = await makeUser();
    const ada = await createMedication(u.id, { name: "Adalimumab", dose: 40, unit: "mg", route: "SUBCUTANEOUS", form: "INJECTION", intervalDays: 7 });
    const doc = await uploadDocument(u.id, { fileName: "rx.pdf", data: await encryptTextPdf(fx("prescription.txt")) });
    for (const field of doc.extractions[0].fields) await reviewField(u.id, field.id, "confirm");
    const res = await applyReviewedFields(u.id, doc.id);
    expect(res.conflicts).toHaveLength(1);
    // Existing record untouched until the patient decides.
    expect((await getMedication(u.id, ada.id)).intervalDays).toBe(7);
    const [c] = await listConflicts(u.id);
    expect(c.existingValue).toContain("every 7 day");
    expect(c.newValue).toContain("every 14 day");
    // The new medication (mesalazine) was added without inferring route/form.
    const mesa = await prisma.medication.findFirstOrThrow({ where: { userId: u.id, name: "Mesalazine" } });
    expect(mesa.route).toBe("OTHER");
    expect(mesa.timesPerDay).toBe(2);
    expect(mesa.sourceType).toBe("DOCUMENT_EXTRACTION");

    await resolveConflict(u.id, c.id, "NEEDS_DOCTOR_CONFIRMATION");
    expect((await getMedication(u.id, ada.id)).verificationStatus).toBe("NEEDS_DOCTOR_CONFIRMATION");
    await resolveConflict(u.id, c.id, "KEEP_NEW");
    const updated = await getMedication(u.id, ada.id);
    expect(updated.intervalDays).toBe(14);
    expect(updated.sourceType).toBe("DOCUMENT_EXTRACTION");
    expect(updated.verificationStatus).toBe("PATIENT_CONFIRMED");
    await expect(resolveConflict(u.id, c.id, "KEEP_EXISTING")).rejects.toThrow(/already resolved/);
  });

  it("flags a lab value conflict for the same test on the same day", async () => {
    const u = await makeUser();
    await prisma.labResult.create({ data: { userId: u.id, testCode: "CRP", testName: "CRP", value: 8, unit: "mg/L", takenAt: new Date("2026-09-03"), sourceType: "PATIENT_ENTERED" } });
    const doc = await uploadDocument(u.id, { fileName: "esami.pdf", data: await encryptTextPdf(fx("bloodtest.txt")) });
    const f = (k: string) => doc.extractions[0].fields.find((x) => x.key === k)!;
    await reviewField(u.id, f("document_date").id, "confirm");
    await reviewField(u.id, f("CRP").id, "confirm");
    const res = await applyReviewedFields(u.id, doc.id);
    expect(res.conflicts).toHaveLength(1);
    await resolveConflict(u.id, res.conflicts[0], "KEEP_EXISTING");
    const labs = await prisma.labResult.findMany({ where: { userId: u.id, testCode: "CRP" } });
    expect(labs.map((l) => l.value)).toEqual([8]);
  });

  it("deletes the file and its extracted data", async () => {
    const u = await makeUser();
    const doc = await uploadDocument(u.id, { fileName: "esami.pdf", data: await encryptTextPdf(fx("bloodtest.txt")) });
    await deleteDocument(u.id, doc.id);
    expect(await prisma.extractedField.count()).toBe(0);
    expect(() => readFileSync(`${process.env.STORAGE_DIR}/${doc.storageKey}`)).toThrow();
  });
});
