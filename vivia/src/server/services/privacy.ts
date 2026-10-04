/**
 * GDPR rights: consent management (art. 7), access & portability (art. 15/20),
 * erasure (art. 17). See /docs/COMPLIANCE.md.
 */
import type { ConsentType } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { sha256 } from "../crypto";
import { storage } from "../storage";
import { CONSENT_VERSION } from "../auth";

export const USER_CONSENTS: ConsentType[] = ["HEALTH_DATA_PROCESSING", "AI_PROCESSING", "DOCUMENT_AI_PROCESSING", "PRODUCT_ANALYTICS", "LOCATION_ON_REQUEST"];

/** Current state of each consent = most recent record (history is kept). */
export async function currentConsents(userId: string) {
  const rows = await prisma.consent.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  const state: Partial<Record<ConsentType, { granted: boolean; at: Date; version: string }>> = {};
  for (const r of rows) if (!state[r.type]) state[r.type] = { granted: r.granted, at: r.createdAt, version: r.version };
  return state;
}

export async function setConsent(userId: string, type: ConsentType, granted: boolean) {
  await prisma.consent.create({ data: { userId, type, granted, version: CONSENT_VERSION } });
  await audit(userId, granted ? "consent.granted" : "consent.withdrawn", "Consent", undefined, { type });
}

/** Machine-readable export of everything VIVIA holds about the user. */
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true, email: true, locale: true, createdAt: true,
      profile: true, diagnoses: true, medications: true, medicationEvts: true, symptomEntries: { include: { bowelMovementsDetail: true } },
      foodEntries: true, labResults: true, procedures: true, clinicalEvents: true, doctors: true, visits: true, metrics: true,
      questionnaires: true, consents: true, conflicts: true, emergencyCard: true, notifications: true,
      documents: { select: { id: true, title: true, fileName: true, mimeType: true, type: true, documentDate: true, status: true, createdAt: true, extractions: { include: { fields: true } } } },
      aiRuns: { select: { id: true, task: true, provider: true, model: true, inputScope: true, sourceRefs: true, output: true, safetyFlags: true, userConfirmed: true, createdAt: true } },
      shareLinks: { select: { id: true, summaryId: true, expiresAt: true, revokedAt: true, accessCount: true, lastAccessAt: true, createdAt: true } },
      locationReviews: true, locationReports: true,
      auditLogs: { orderBy: { createdAt: "desc" }, take: 5000 },
    },
  });
  const summaries = await prisma.visitSummary.findMany({ where: { userId } });
  await audit(userId, "privacy.data_exported");
  return {
    exportFormat: "vivia-export-v1",
    exportedAt: new Date().toISOString(),
    note: "Original document files can be downloaded individually from the Documents screen.",
    ...user,
    visitSummaries: summaries,
  };
}

/** Permanent erasure: files, rows (cascade), sessions. A non-identifying deletion record is kept. */
export async function deleteAccount(userId: string, reason?: string) {
  const docs = await prisma.medicalDocument.findMany({ where: { userId }, select: { storageKey: true } });
  for (const d of docs) await storage().delete(d.storageKey).catch(() => undefined);
  await prisma.$transaction([
    // VisitSummary has no FK to User (it keeps a snapshot); remove explicitly.
    prisma.visitSummary.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
    prisma.deletionRecord.create({ data: { userIdHash: sha256(userId), reason: reason?.slice(0, 200) } }),
  ]);
}
