import { prisma } from "../db";
import { audit } from "../audit";
import type { z } from "zod";
import type { emergencyCardSchema } from "@/lib/schemas";

export async function getEmergencyCard(userId: string) {
  return prisma.emergencyCard.findUnique({ where: { userId } });
}

export async function saveEmergencyCard(userId: string, input: z.infer<typeof emergencyCardSchema>) {
  const card = await prisma.emergencyCard.upsert({ where: { userId }, create: { userId, ...input }, update: input });
  await audit(userId, "emergency_card.updated");
  return card;
}

/** The card as displayed — only what the patient chose to show. */
export async function emergencyCardView(userId: string) {
  const [card, profile, dx, meds, surgeries] = await Promise.all([
    getEmergencyCard(userId),
    prisma.patientProfile.findUnique({ where: { userId } }),
    prisma.diagnosis.findFirst({ where: { userId, verificationStatus: { not: "REJECTED" } }, orderBy: { createdAt: "asc" } }),
    prisma.medication.findMany({ where: { userId, active: true, verificationStatus: { not: "REJECTED" } }, orderBy: { name: "asc" } }),
    prisma.clinicalEvent.findMany({ where: { userId, type: { in: ["SURGERY", "STOMA_CREATED", "STOMA_REVERSED"] } }, orderBy: { startedAt: "desc" } }),
  ]);
  const c = card ?? { showCondition: true, showMedications: true, showAllergies: true, showSurgeries: true, showStoma: true, showContact: true, allergies: null, surgeriesNote: null, contactName: null, contactPhone: null, extraNote: null };
  return {
    configured: !!card,
    name: profile?.displayName ?? "",
    condition: c.showCondition && dx ? dx.disease : null,
    medications: c.showMedications ? meds.map((m) => `${m.name}${m.dose ? ` ${m.dose} ${m.unit ?? ""}` : ""}`.trim()) : null,
    allergies: c.showAllergies ? c.allergies : null,
    surgeries: c.showSurgeries ? [...surgeries.map((s) => `${s.title} (${s.startedAt.getUTCFullYear()})`), ...(c.surgeriesNote ? [c.surgeriesNote] : [])] : null,
    stoma: c.showStoma ? (profile?.hasStoma ? profile.stomaType || "yes" : null) : null,
    contact: c.showContact && c.contactName ? { name: c.contactName, phone: c.contactPhone } : null,
    extraNote: c.extraNote,
    settings: c,
  };
}
