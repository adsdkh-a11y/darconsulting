import { prisma } from "../db";
import { audit } from "../audit";
import type { z } from "zod";
import type { onboardingSchema, profileUpdateSchema } from "@/lib/schemas";

export async function getProfile(userId: string) {
  return prisma.patientProfile.findUnique({ where: { userId } });
}

export async function getPrimaryDiagnosis(userId: string) {
  return prisma.diagnosis.findFirst({
    where: { userId, verificationStatus: { not: "REJECTED" } },
    orderBy: { createdAt: "asc" },
  });
}

export async function completeOnboarding(userId: string, input: z.infer<typeof onboardingSchema>) {
  await prisma.$transaction(async (tx) => {
    await tx.patientProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: input.displayName,
        hasStoma: input.hasStoma,
        stomaType: input.hasStoma ? input.stomaType : null,
        onboardingCompleted: true,
        ...(input.trackedSymptoms ? { trackedSymptoms: input.trackedSymptoms } : {}),
      },
      update: {
        displayName: input.displayName,
        hasStoma: input.hasStoma,
        stomaType: input.hasStoma ? input.stomaType : null,
        onboardingCompleted: true,
        ...(input.trackedSymptoms ? { trackedSymptoms: input.trackedSymptoms } : {}),
      },
    });
    const existing = await tx.diagnosis.findFirst({ where: { userId, sourceType: "PATIENT_ENTERED" } });
    const dx = {
      disease: input.disease,
      diagnosedAt: input.diagnosedYear ? new Date(Date.UTC(input.diagnosedYear, 0, 1)) : null,
    };
    if (existing) await tx.diagnosis.update({ where: { id: existing.id }, data: dx });
    else await tx.diagnosis.create({ data: { userId, ...dx, sourceType: "PATIENT_ENTERED", verificationStatus: "PATIENT_CONFIRMED" } });
    if (input.locale) await tx.user.update({ where: { id: userId }, data: { locale: input.locale } });
  });
  await audit(userId, "profile.onboarding_completed");
}

export async function updateProfile(userId: string, input: z.infer<typeof profileUpdateSchema>) {
  const { disease, diagnosedYear, locale, ...rest } = input;
  await prisma.patientProfile.update({
    where: { userId },
    data: {
      ...(rest.displayName !== undefined ? { displayName: rest.displayName } : {}),
      ...(rest.hasStoma !== undefined ? { hasStoma: rest.hasStoma, stomaType: rest.hasStoma ? rest.stomaType ?? null : null } : {}),
      ...(rest.trackedSymptoms ? { trackedSymptoms: rest.trackedSymptoms } : {}),
      ...(rest.birthYear !== undefined ? { birthYear: rest.birthYear } : {}),
      ...(rest.country !== undefined ? { country: rest.country } : {}),
    },
  });
  if (disease || diagnosedYear !== undefined) {
    const existing = await prisma.diagnosis.findFirst({ where: { userId, sourceType: "PATIENT_ENTERED" } });
    const data = {
      ...(disease ? { disease } : {}),
      ...(diagnosedYear !== undefined ? { diagnosedAt: diagnosedYear ? new Date(Date.UTC(diagnosedYear, 0, 1)) : null } : {}),
    };
    if (existing) await prisma.diagnosis.update({ where: { id: existing.id }, data });
    else if (disease) await prisma.diagnosis.create({ data: { userId, disease, sourceType: "PATIENT_ENTERED", ...data } });
  }
  if (locale) await prisma.user.update({ where: { id: userId }, data: { locale } });
  await audit(userId, "profile.updated");
}
