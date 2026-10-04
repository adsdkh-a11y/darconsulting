import { prisma } from "../db";
import { audit } from "../audit";
import { notFound } from "../errors";
import { dayToDate, DAY } from "@/lib/dates";
import type { MedicationInput } from "@/lib/schemas";
import type { Medication, MedicationEvent, MedicationEventStatus, SourceType } from "@prisma/client";

export async function listMedications(userId: string, opts: { includeInactive?: boolean } = {}) {
  return prisma.medication.findMany({
    where: { userId, ...(opts.includeInactive ? {} : { active: true }), verificationStatus: { not: "REJECTED" } },
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
}

export async function getMedication(userId: string, id: string) {
  const med = await prisma.medication.findFirst({
    where: { id, userId },
    include: { events: { orderBy: { occurredAt: "desc" }, take: 60 } },
  });
  if (!med) throw notFound("Medication not found");
  return med;
}

function toData(input: MedicationInput) {
  return {
    name: input.name,
    activeIngredient: input.activeIngredient ?? null,
    dose: input.dose ?? null,
    unit: input.unit ?? null,
    route: input.route,
    form: input.form,
    intervalDays: input.asNeeded ? null : input.intervalDays ?? null,
    timesPerDay: input.asNeeded ? null : input.timesPerDay ?? null,
    asNeeded: input.asNeeded ?? false,
    scheduleNote: input.scheduleNote ?? null,
    startDate: input.startDate ? dayToDate(input.startDate) : null,
    endDate: input.endDate ? dayToDate(input.endDate) : null,
    prescribingDoctor: input.prescribingDoctor ?? null,
    notes: input.notes ?? null,
  };
}

export async function createMedication(
  userId: string,
  input: MedicationInput,
  source: { sourceType: SourceType; sourceId?: string } = { sourceType: "PATIENT_ENTERED" },
) {
  const med = await prisma.medication.create({
    data: { userId, ...toData(input), sourceType: source.sourceType, sourceId: source.sourceId, verificationStatus: "PATIENT_CONFIRMED" },
  });
  await audit(userId, "medication.created", "Medication", med.id);
  return med;
}

export async function updateMedication(userId: string, id: string, input: MedicationInput) {
  await getMedication(userId, id);
  const med = await prisma.medication.update({ where: { id }, data: toData(input) });
  await audit(userId, "medication.updated", "Medication", id);
  return med;
}

export async function setMedicationActive(userId: string, id: string, active: boolean) {
  await getMedication(userId, id);
  await prisma.medication.update({
    where: { id },
    data: { active, ...(active ? { endDate: null } : { endDate: new Date() }) },
  });
  await audit(userId, active ? "medication.resumed" : "medication.stopped_by_patient", "Medication", id);
}

export async function logMedicationEvent(
  userId: string,
  medicationId: string,
  input: { status: MedicationEventStatus; occurredAt?: string; reason?: string | null; notes?: string | null },
  source: { sourceType: SourceType; sourceId?: string } = { sourceType: "PATIENT_ENTERED" },
) {
  await getMedication(userId, medicationId);
  return prisma.medicationEvent.create({
    data: {
      userId,
      medicationId,
      status: input.status,
      occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
      reason: input.reason ?? null,
      notes: input.notes ?? null,
      sourceType: source.sourceType,
      sourceId: source.sourceId,
    },
  });
}

/** Next expected dose, from the last TAKEN/DELAYED event and the interval. Null for PRN or unscheduled. */
export function nextDue(med: Pick<Medication, "asNeeded" | "intervalDays" | "startDate" | "active">, lastTaken: Date | null, now = new Date()): Date | null {
  if (!med.active || med.asNeeded || !med.intervalDays) return null;
  const anchor = lastTaken ?? med.startDate;
  if (!anchor) return med.intervalDays === 1 ? now : null;
  let due = new Date(anchor.getTime() + med.intervalDays * DAY);
  // Never show a date far in the past: roll forward to the next occurrence.
  while (due.getTime() < now.getTime() - DAY) due = new Date(due.getTime() + med.intervalDays * DAY);
  return due;
}

/**
 * Adherence over a period, in neutral terms: counts only, no grades.
 * Expected doses are estimated from the schedule; PRN medications are excluded.
 */
export function adherence(med: Pick<Medication, "asNeeded" | "intervalDays" | "timesPerDay" | "startDate">, events: Pick<MedicationEvent, "status" | "occurredAt">[], from: Date, to: Date) {
  const inRange = events.filter((e) => e.occurredAt >= from && e.occurredAt <= to);
  const taken = inRange.filter((e) => e.status === "TAKEN").length;
  const delayed = inRange.filter((e) => e.status === "DELAYED").length;
  const skipped = inRange.filter((e) => e.status === "SKIPPED").length;
  let expected: number | null = null;
  if (!med.asNeeded && med.intervalDays) {
    const start = med.startDate && med.startDate > from ? med.startDate : from;
    const days = Math.max(0, (to.getTime() - start.getTime()) / DAY);
    expected = Math.floor(days / med.intervalDays) * (med.timesPerDay ?? 1);
  }
  return { taken, delayed, skipped, recorded: taken + delayed + skipped, expected };
}

export async function medicationOverview(userId: string, now = new Date()) {
  const meds = await listMedications(userId);
  const since = new Date(now.getTime() - 30 * DAY);
  const events = await prisma.medicationEvent.findMany({
    where: { userId, medicationId: { in: meds.map((m) => m.id) }, occurredAt: { gte: new Date(now.getTime() - 400 * DAY) } },
    orderBy: { occurredAt: "desc" },
  });
  return meds.map((m) => {
    const evs = events.filter((e) => e.medicationId === m.id);
    const lastTaken = evs.find((e) => e.status === "TAKEN" || e.status === "DELAYED")?.occurredAt ?? null;
    return { ...m, lastTaken, nextDue: nextDue(m, lastTaken, now), adherence30: adherence(m, evs, since, now) };
  });
}
