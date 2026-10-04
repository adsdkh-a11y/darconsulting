import type { ClinicalEventType } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { dayToDate, dateToDay } from "@/lib/dates";

export const LAB_CATALOG: { code: string; name: string; unit: string }[] = [
  { code: "CRP", name: "C-reactive protein (CRP)", unit: "mg/L" },
  { code: "CALPROTECTIN", name: "Fecal calprotectin", unit: "µg/g" },
  { code: "HB", name: "Hemoglobin", unit: "g/dL" },
  { code: "FERRITIN", name: "Ferritin", unit: "ng/mL" },
  { code: "WBC", name: "White blood cells", unit: "x10^9/L" },
  { code: "PLT", name: "Platelets", unit: "x10^9/L" },
  { code: "ALBUMIN", name: "Albumin", unit: "g/dL" },
  { code: "ESR", name: "Erythrocyte sedimentation rate (ESR)", unit: "mm/h" },
  { code: "VITD", name: "Vitamin D", unit: "ng/mL" },
];

export async function addLab(userId: string, input: { testCode: string; testName: string; value?: number | null; valueText?: string | null; unit?: string | null; referenceRange?: string | null; takenAt: string }) {
  const lab = await prisma.labResult.create({
    data: { userId, ...input, takenAt: dayToDate(input.takenAt), sourceType: "PATIENT_ENTERED", verificationStatus: "PATIENT_CONFIRMED" },
  });
  await audit(userId, "lab.added", "LabResult", lab.id);
  return lab;
}

export async function labSeries(userId: string) {
  const labs = await prisma.labResult.findMany({ where: { userId, verificationStatus: { not: "REJECTED" } }, orderBy: { takenAt: "asc" } });
  const byCode: Record<string, { name: string; unit: string | null; points: { day: string; value: number | null; text: string; source: string; sourceId: string | null; id: string }[] }> = {};
  for (const l of labs) {
    const s = (byCode[l.testCode] ??= { name: l.testName, unit: l.unit, points: [] });
    s.points.push({ id: l.id, day: dateToDay(l.takenAt), value: l.value, text: `${l.value ?? l.valueText ?? ""}`, source: l.sourceType, sourceId: l.sourceId });
  }
  return byCode;
}

export async function addClinicalEvent(userId: string, input: { type: ClinicalEventType; startedAt: string; endedAt?: string | null; title: string; description?: string | null; facility?: string | null }) {
  const e = await prisma.clinicalEvent.create({
    data: {
      userId,
      type: input.type,
      startedAt: dayToDate(input.startedAt),
      endedAt: input.endedAt ? dayToDate(input.endedAt) : null,
      title: input.title,
      description: input.description ?? null,
      facility: input.facility ?? null,
      sourceType: "PATIENT_ENTERED",
    },
  });
  await audit(userId, "clinical_event.added", "ClinicalEvent", e.id);
  return e;
}
