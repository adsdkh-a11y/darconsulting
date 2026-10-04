/**
 * Medical documents as first-class health data.
 *
 * UPLOAD → validation → (text layer | OCR) → classification → structured
 * extraction → confidence → PATIENT VERIFICATION → Health Memory → timeline.
 *
 * Nothing extracted is written to the Health Memory until the patient
 * confirms (or edits) it. Conflicts with existing data are never merged
 * silently: they become DataConflict rows for the patient to resolve.
 */
import { randomUUID } from "node:crypto";
import type { DocumentType, ProcedureType } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { badRequest, notFound } from "../errors";
import { sha256 } from "../crypto";
import { storage } from "../storage";
import { providerFor, runAI, type DocumentExtractionResult } from "../ai";
import { verifyExtraction } from "../ai/safety";
import { dayToDate } from "@/lib/dates";
import { validateUpload } from "./fileValidation";
import { pdfToText } from "./pdfText";
import { createConflict } from "./conflicts";

export async function listDocuments(userId: string) {
  return prisma.medicalDocument.findMany({
    where: { userId },
    orderBy: [{ documentDate: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    select: { id: true, title: true, type: true, status: true, documentDate: true, createdAt: true, mimeType: true, sizeBytes: true },
  });
}

export async function getDocument(userId: string, id: string) {
  const doc = await prisma.medicalDocument.findFirst({
    where: { id, userId },
    include: { extractions: { orderBy: { createdAt: "desc" }, take: 1, include: { fields: { orderBy: { createdAt: "asc" } } } } },
  });
  if (!doc) throw notFound("Document not found");
  return doc;
}

export async function downloadDocument(userId: string, id: string) {
  const doc = await getDocument(userId, id);
  const data = await storage().get(doc.storageKey);
  await audit(userId, "document.downloaded", "MedicalDocument", id);
  return { doc, data };
}

export async function uploadDocument(userId: string, input: { fileName: string; title?: string; data: Buffer }) {
  const v = validateUpload(input.data);
  if (!v.ok) throw badRequest(v.reason);
  const storageKey = `${userId}/${randomUUID()}`;
  await storage().put(storageKey, input.data);
  const doc = await prisma.medicalDocument.create({
    data: {
      userId,
      title: (input.title?.trim() || input.fileName.replace(/\.[a-z0-9]+$/i, "")).slice(0, 120),
      fileName: input.fileName.slice(0, 200),
      mimeType: v.file.mimeType,
      sizeBytes: input.data.length,
      sha256: sha256(input.data),
      storageKey,
      status: "PROCESSING",
    },
  });
  await audit(userId, "document.uploaded", "MedicalDocument", doc.id, { mimeType: v.file.mimeType, sizeBytes: input.data.length });
  return processDocument(userId, doc.id, input.data);
}

/** Steps 3–7. Synchronous in the MVP; runs in a job queue in production. */
export async function processDocument(userId: string, documentId: string, data?: Buffer) {
  const doc = await getDocument(userId, documentId);
  const buf = data ?? (await storage().get(doc.storageKey));
  try {
    const text = doc.mimeType === "application/pdf" ? await pdfToText(buf) : "";
    const provider = await providerFor(userId, "DOCUMENT_AI_PROCESSING");
    const sendFile = provider.name !== "vivia-rules" && (!text.trim() || doc.mimeType !== "application/pdf");
    const { output, run } = await runAI<DocumentExtractionResult>({
      userId,
      task: "DOCUMENT_EXTRACTION",
      provider,
      inputScope: { categories: ["single_document"], documentId, mode: sendFile ? "file" : "text" },
      sourceRefs: [`MedicalDocument:${documentId}`],
      exec: (p) => p.extractDocument(sendFile && p.name !== "vivia-rules" ? { text, file: { data: buf, mimeType: doc.mimeType } } : { text }),
      postprocess: (out) => {
        const v = verifyExtraction(out, out.text || text);
        return { output: v.result, flags: v.flags };
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.documentExtraction.create({
        data: {
          documentId,
          aiRunId: run.id,
          classification: output.classification as DocumentType,
          classificationConfidence: output.classificationConfidence,
          summary: output.summary,
          fields: {
            create: output.fields.map((f) => ({
              kind: f.kind,
              key: f.key,
              label: f.label,
              value: f.value,
              unit: f.unit,
              numericValue: f.numericValue,
              observedAt: f.observedAt ? dayToDate(f.observedAt) : undefined,
              sourceSnippet: f.sourceSnippet,
              confidence: f.confidence,
            })),
          },
        },
      });
      await tx.medicalDocument.update({
        where: { id: documentId },
        data: {
          type: output.classification as DocumentType,
          documentDate: output.documentDate ? dayToDate(output.documentDate) : null,
          extractedText: (output.text || text || null)?.slice(0, 200_000),
          status: output.fields.length ? "NEEDS_REVIEW" : "REVIEWED",
        },
      });
    });
  } catch (err) {
    await prisma.medicalDocument.update({ where: { id: documentId }, data: { status: "FAILED", failureReason: (err as Error).message.slice(0, 300) } });
  }
  return getDocument(userId, documentId);
}

async function fieldForUser(userId: string, fieldId: string) {
  const field = await prisma.extractedField.findFirst({
    where: { id: fieldId, extraction: { document: { userId } } },
    include: { extraction: { include: { document: true } } },
  });
  if (!field) throw notFound("Field not found");
  return field;
}

export async function reviewField(userId: string, fieldId: string, action: "confirm" | "edit" | "reject", editedValue?: string) {
  const field = await fieldForUser(userId, fieldId);
  if (field.appliedEntity) throw badRequest("This value is already in your Health Memory");
  if (action === "edit" && !editedValue?.trim()) throw badRequest("Please enter the corrected value");
  return prisma.extractedField.update({
    where: { id: field.id },
    data: {
      status: action === "confirm" ? "CONFIRMED" : action === "edit" ? "EDITED" : "REJECTED",
      editedValue: action === "edit" ? editedValue!.trim() : null,
    },
  });
}

const PROC: Record<string, ProcedureType> = {
  COLONOSCOPY: "COLONOSCOPY",
  ILEOCOLONOSCOPY: "ILEOCOLONOSCOPY",
  MRI: "MRI",
  CT: "CT",
  ULTRASOUND: "ULTRASOUND",
  SURGERY: "SURGERY",
};

function parseMedValue(v: string) {
  // "Adalimumab · 40 mg · every 14 days"
  const dose = v.match(/(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg|µg|ui|iu)\b/i);
  const every = v.match(/every (\d+) days/i);
  const daily = /\bdaily\b/i.test(v) ? 1 : undefined;
  const times = /twice daily/i.test(v) ? 2 : /three times daily/i.test(v) ? 3 : undefined;
  const name = v.split(/[·,]/)[0].replace(/\d.*$/, "").trim();
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    dose: dose ? Number(dose[1]) : undefined,
    unit: dose?.[2],
    intervalDays: every ? Number(every[1]) : daily ?? (times ? 1 : undefined),
    timesPerDay: times,
  };
}

const describeMed = (m: { dose?: number | null; unit?: string | null; intervalDays?: number | null }) =>
  [m.dose != null ? `${m.dose} ${m.unit ?? ""}`.trim() : null, m.intervalDays ? `every ${m.intervalDays} day(s)` : null].filter(Boolean).join(" ") || "not specified";

/**
 * Step 8–10: write every confirmed/edited field into the Health Memory with
 * provenance DOCUMENT_EXTRACTION → documentId. Returns what was applied and
 * what became a conflict.
 */
export async function applyReviewedFields(userId: string, documentId: string) {
  const doc = await getDocument(userId, documentId);
  const extraction = doc.extractions[0];
  if (!extraction) throw badRequest("This document has no extracted data");
  const fields = extraction.fields.filter((f) => (f.status === "CONFIRMED" || f.status === "EDITED") && !f.appliedEntity);
  const val = (f: (typeof fields)[number]) => (f.status === "EDITED" ? f.editedValue! : f.value);
  const dateField = extraction.fields.find((f) => f.key === "document_date" && f.status !== "REJECTED" && f.status !== "PENDING");
  const docDate = dateField ? dayToDate(val(dateField).slice(0, 10)) : doc.documentDate ?? doc.createdAt;
  const src = { sourceType: "DOCUMENT_EXTRACTION" as const, sourceId: doc.id, verificationStatus: "PATIENT_CONFIRMED" as const };
  const applied: string[] = [];
  const conflicts: string[] = [];

  const mark = (fieldId: string, entity: string) => prisma.extractedField.update({ where: { id: fieldId }, data: { appliedEntity: entity } });

  if (dateField && !dateField.appliedEntity) {
    await prisma.medicalDocument.update({ where: { id: doc.id }, data: { documentDate: docDate } });
    await mark(dateField.id, `MedicalDocument:${doc.id}`);
  }

  // Labs
  for (const f of fields.filter((x) => x.kind === "lab")) {
    const raw = val(f);
    const num = Number(raw.replace(/[<>≤≥\s]/g, "").replace(",", "."));
    const takenAt = f.observedAt ?? docDate;
    const same = await prisma.labResult.findFirst({ where: { userId, testCode: f.key, takenAt } });
    if (same && (same.value !== (Number.isFinite(num) ? num : null) || (same.unit ?? "") !== (f.unit ?? ""))) {
      const c = await createConflict(userId, {
        entityType: "LabResult",
        existingId: same.id,
        field: `${f.key} on ${takenAt.toISOString().slice(0, 10)}`,
        existingValue: `${same.value ?? same.valueText} ${same.unit ?? ""}`.trim(),
        newValue: `${raw} ${f.unit ?? ""}`.trim(),
        newSourceType: "DOCUMENT_EXTRACTION",
        newSourceId: doc.id,
        proposed: { value: Number.isFinite(num) ? num : null, valueText: Number.isFinite(num) && !/[<>≤≥]/.test(raw) ? null : raw, unit: f.unit },
      });
      conflicts.push(c.id);
      await mark(f.id, `DataConflict:${c.id}`);
      continue;
    }
    if (same) {
      await mark(f.id, `LabResult:${same.id}`);
      continue;
    }
    const lab = await prisma.labResult.create({
      data: {
        userId,
        testCode: f.key,
        testName: f.label.replace(/ \(ref\. .*\)$/, ""),
        value: Number.isFinite(num) ? num : null,
        valueText: Number.isFinite(num) && !/[<>≤≥]/.test(raw) ? null : raw,
        unit: f.unit,
        referenceRange: f.label.match(/\(ref\. (.*)\)$/)?.[1],
        takenAt,
        ...src,
      },
    });
    applied.push(`LabResult:${lab.id}`);
    await mark(f.id, `LabResult:${lab.id}`);
  }

  // Procedure (+ findings / biopsy / conclusion as written)
  const procField = fields.find((x) => x.key === "procedure_type");
  if (procField) {
    const findings = extraction.fields.filter((x) => ["findings", "conclusion"].includes(x.key) && (x.status === "CONFIRMED" || x.status === "EDITED"));
    const biopsy = extraction.fields.find((x) => x.key === "biopsy_taken" && (x.status === "CONFIRMED" || x.status === "EDITED"));
    const proc = await prisma.procedure.create({
      data: {
        userId,
        type: PROC[val(procField).toUpperCase()] ?? "OTHER",
        performedAt: procField.observedAt ?? docDate,
        findings: findings.map((x) => `${x.label}: ${val(x)}`).join("\n") || null,
        biopsyTaken: biopsy ? val(biopsy).toLowerCase().startsWith("y") : null,
        ...src,
      },
    });
    applied.push(`Procedure:${proc.id}`);
    for (const x of [procField, ...findings, ...(biopsy ? [biopsy] : [])]) if (!x.appliedEntity) await mark(x.id, `Procedure:${proc.id}`);
  }

  // Medications
  for (const f of fields.filter((x) => x.kind === "medication")) {
    const m = parseMedValue(val(f));
    const existing = await prisma.medication.findFirst({
      where: { userId, active: true, OR: [{ name: { equals: m.name, mode: "insensitive" } }, { activeIngredient: { equals: m.name, mode: "insensitive" } }] },
    });
    if (existing) {
      const differs =
        (m.dose !== undefined && existing.dose !== m.dose) || (m.intervalDays !== undefined && existing.intervalDays !== m.intervalDays);
      if (differs) {
        const c = await createConflict(userId, {
          entityType: "Medication",
          existingId: existing.id,
          field: `${existing.name} dose / frequency`,
          existingValue: describeMed(existing),
          newValue: describeMed({ dose: m.dose, unit: m.unit, intervalDays: m.intervalDays }),
          newSourceType: "DOCUMENT_EXTRACTION",
          newSourceId: doc.id,
          proposed: { dose: m.dose ?? existing.dose, unit: m.unit ?? existing.unit, intervalDays: m.intervalDays ?? existing.intervalDays, timesPerDay: m.timesPerDay ?? existing.timesPerDay },
        });
        conflicts.push(c.id);
        await mark(f.id, `DataConflict:${c.id}`);
      } else {
        await mark(f.id, `Medication:${existing.id}`);
      }
      continue;
    }
    const med = await prisma.medication.create({
      data: {
        userId,
        name: m.name,
        dose: m.dose,
        unit: m.unit,
        intervalDays: m.intervalDays,
        timesPerDay: m.timesPerDay,
        // Route and form are NOT inferred from the drug name.
        route: "OTHER",
        form: "OTHER",
        notes: `Added from document "${doc.title}". Please check route and form.`,
        startDate: docDate,
        ...src,
      },
    });
    applied.push(`Medication:${med.id}`);
    await mark(f.id, `Medication:${med.id}`);
  }

  // Diagnosis mentioned
  for (const f of fields.filter((x) => x.kind === "diagnosis")) {
    const disease = val(f).toUpperCase().includes("CROHN") ? "CROHNS" : val(f).toUpperCase().includes("COLITIS") || val(f).toUpperCase().includes("ULCERATIVE") ? "ULCERATIVE_COLITIS" : "OTHER";
    const existing = await prisma.diagnosis.findFirst({ where: { userId, verificationStatus: { not: "REJECTED" } }, orderBy: { createdAt: "asc" } });
    if (existing && existing.disease !== disease && existing.disease !== "UNKNOWN") {
      const c = await createConflict(userId, {
        entityType: "Diagnosis",
        existingId: existing.id,
        field: "Diagnosis",
        existingValue: existing.disease,
        newValue: disease,
        newSourceType: "DOCUMENT_EXTRACTION",
        newSourceId: doc.id,
        proposed: { disease },
      });
      conflicts.push(c.id);
      await mark(f.id, `DataConflict:${c.id}`);
    } else if (existing) {
      if (existing.disease === "UNKNOWN") await prisma.diagnosis.update({ where: { id: existing.id }, data: { disease, sourceType: "DOCUMENT_EXTRACTION", sourceId: doc.id } });
      await mark(f.id, `Diagnosis:${existing.id}`);
    } else {
      const dx = await prisma.diagnosis.create({ data: { userId, disease, ...src } });
      applied.push(`Diagnosis:${dx.id}`);
      await mark(f.id, `Diagnosis:${dx.id}`);
    }
  }

  // Remaining confirmed text fields (recommendations, findings without procedure) stay on the document.
  for (const f of fields.filter((x) => (x.kind === "recommendation" || x.kind === "finding") && !x.appliedEntity)) {
    const fresh = await prisma.extractedField.findUnique({ where: { id: f.id } });
    if (!fresh?.appliedEntity) await mark(f.id, `MedicalDocument:${doc.id}`);
  }

  const stillPending = await prisma.extractedField.count({ where: { extractionId: extraction.id, status: "PENDING" } });
  await prisma.medicalDocument.update({ where: { id: doc.id }, data: { status: stillPending ? "NEEDS_REVIEW" : "REVIEWED" } });
  await audit(userId, "document.applied_to_health_memory", "MedicalDocument", doc.id, { applied: applied.length, conflicts: conflicts.length });
  return { applied, conflicts };
}

export async function deleteDocument(userId: string, id: string) {
  const doc = await getDocument(userId, id);
  await storage().delete(doc.storageKey);
  await prisma.medicalDocument.delete({ where: { id: doc.id } });
  await audit(userId, "document.deleted", "MedicalDocument", id);
}
