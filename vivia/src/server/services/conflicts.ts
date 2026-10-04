/**
 * "VIVIA found different information. Which one should be kept?"
 * VIVIA never decides. The patient keeps one value or flags it for the doctor.
 */
import type { Prisma, SourceType } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { badRequest, notFound } from "../errors";

export async function createConflict(
  userId: string,
  c: {
    entityType: "Medication" | "LabResult" | "Diagnosis";
    existingId: string;
    field: string;
    existingValue: string;
    newValue: string;
    newSourceType: SourceType;
    newSourceId?: string;
    proposed: Prisma.InputJsonValue;
  },
) {
  const conflict = await prisma.dataConflict.create({ data: { userId, ...c } });
  await audit(userId, "conflict.detected", c.entityType, c.existingId);
  return conflict;
}

export async function listConflicts(userId: string, status: "OPEN" | "ALL" = "OPEN") {
  return prisma.dataConflict.findMany({
    where: { userId, ...(status === "OPEN" ? { status: "OPEN" } : {}) },
    orderBy: { createdAt: "desc" },
  });
}

export async function resolveConflict(userId: string, id: string, resolution: "KEEP_EXISTING" | "KEEP_NEW" | "NEEDS_DOCTOR_CONFIRMATION") {
  const c = await prisma.dataConflict.findFirst({ where: { id, userId } });
  if (!c) throw notFound("Conflict not found");
  if (c.status !== "OPEN" && c.status !== "NEEDS_DOCTOR_CONFIRMATION") throw badRequest("This conflict is already resolved");
  const proposed = c.proposed as Record<string, unknown>;
  const newSource = { sourceType: c.newSourceType, sourceId: c.newSourceId, verificationStatus: "PATIENT_CONFIRMED" as const };

  await prisma.$transaction(async (tx) => {
    if (resolution === "KEEP_NEW") {
      if (c.entityType === "Medication") {
        const own = await tx.medication.findFirst({ where: { id: c.existingId, userId } });
        if (!own) throw notFound();
        await tx.medication.update({ where: { id: own.id }, data: { ...(proposed as Prisma.MedicationUpdateInput), ...newSource } });
      } else if (c.entityType === "LabResult") {
        const own = await tx.labResult.findFirst({ where: { id: c.existingId, userId } });
        if (!own) throw notFound();
        await tx.labResult.update({ where: { id: own.id }, data: { ...(proposed as Prisma.LabResultUpdateInput), ...newSource } });
      } else if (c.entityType === "Diagnosis") {
        const own = await tx.diagnosis.findFirst({ where: { id: c.existingId, userId } });
        if (!own) throw notFound();
        await tx.diagnosis.update({ where: { id: own.id }, data: { ...(proposed as Prisma.DiagnosisUpdateInput), ...newSource } });
      }
    } else if (resolution === "NEEDS_DOCTOR_CONFIRMATION") {
      const data = { verificationStatus: "NEEDS_DOCTOR_CONFIRMATION" as const };
      if (c.entityType === "Medication") await tx.medication.updateMany({ where: { id: c.existingId, userId }, data });
      if (c.entityType === "LabResult") await tx.labResult.updateMany({ where: { id: c.existingId, userId }, data });
      if (c.entityType === "Diagnosis") await tx.diagnosis.updateMany({ where: { id: c.existingId, userId }, data });
    } else if (c.status === "NEEDS_DOCTOR_CONFIRMATION") {
      // Keeping the existing value after a doctor check: mark it confirmed again.
      const data = { verificationStatus: "PATIENT_CONFIRMED" as const };
      if (c.entityType === "Medication") await tx.medication.updateMany({ where: { id: c.existingId, userId }, data });
      if (c.entityType === "LabResult") await tx.labResult.updateMany({ where: { id: c.existingId, userId }, data });
      if (c.entityType === "Diagnosis") await tx.diagnosis.updateMany({ where: { id: c.existingId, userId }, data });
    }
    await tx.dataConflict.update({
      where: { id: c.id },
      data: {
        status: resolution === "KEEP_EXISTING" ? "RESOLVED_KEEP_EXISTING" : resolution === "KEEP_NEW" ? "RESOLVED_KEEP_NEW" : "NEEDS_DOCTOR_CONFIRMATION",
        resolvedAt: resolution === "NEEDS_DOCTOR_CONFIRMATION" ? null : new Date(),
      },
    });
  });
  await audit(userId, "conflict.resolved", c.entityType, c.existingId, { resolution });
}
