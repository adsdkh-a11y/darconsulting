import { prisma } from "../db";
import { audit } from "../audit";
import { notFound } from "../errors";

export async function listVisits(userId: string) {
  return prisma.doctorVisit.findMany({ where: { userId }, orderBy: { scheduledAt: "desc" }, include: { doctor: true, summaries: { select: { id: true, createdAt: true }, orderBy: { createdAt: "desc" } } } });
}

export async function nextVisit(userId: string, now = new Date()) {
  return prisma.doctorVisit.findFirst({ where: { userId, scheduledAt: { gte: new Date(now.getTime() - 3600_000) }, completed: false }, orderBy: { scheduledAt: "asc" }, include: { doctor: true } });
}

export async function getVisit(userId: string, id: string) {
  const v = await prisma.doctorVisit.findFirst({ where: { id, userId }, include: { doctor: true, summaries: { orderBy: { createdAt: "desc" } } } });
  if (!v) throw notFound("Appointment not found");
  return v;
}

export async function createVisit(userId: string, input: { scheduledAt: string; doctorName?: string | null; specialty?: string | null; reason?: string | null; patientConcerns?: string | null }) {
  let doctorId: string | undefined;
  if (input.doctorName?.trim()) {
    const name = input.doctorName.trim();
    const doc = (await prisma.doctor.findFirst({ where: { userId, name } })) ?? (await prisma.doctor.create({ data: { userId, name, specialty: input.specialty ?? "Gastroenterology" } }));
    doctorId = doc.id;
  }
  const v = await prisma.doctorVisit.create({
    data: { userId, doctorId, scheduledAt: new Date(input.scheduledAt), reason: input.reason ?? null, patientConcerns: input.patientConcerns ?? null },
  });
  await audit(userId, "visit.created", "DoctorVisit", v.id);
  return v;
}

export async function updateVisitConcerns(userId: string, id: string, patientConcerns: string | null, completed?: boolean) {
  await getVisit(userId, id);
  return prisma.doctorVisit.update({ where: { id }, data: { patientConcerns, ...(completed !== undefined ? { completed } : {}) } });
}

export async function deleteVisit(userId: string, id: string) {
  await getVisit(userId, id);
  await prisma.doctorVisit.delete({ where: { id } });
  await audit(userId, "visit.deleted", "DoctorVisit", id);
}
