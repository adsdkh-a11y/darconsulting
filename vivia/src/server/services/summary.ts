/**
 * VIVIA CARE SUMMARY — "Prepare my doctor visit" in one or two taps.
 *
 * 1. Context builder: selects ONLY the data needed for the period and the
 *    sections the patient chose (data minimisation — see AI_ARCHITECTURE.md).
 * 2. Facts are computed deterministically from the Health Memory.
 * 3. AI writes only the overview + the patient's questions, from those facts.
 * 4. The whole content is snapshotted, so what was shared is reproducible.
 */
import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { audit } from "../audit";
import { badRequest, notFound } from "../errors";
import { providerFor, runAI, type VisitNarrative, type VisitSignals } from "../ai";
import { guardList, guardText } from "../ai/safety";
import { randomToken, sha256 } from "../crypto";
import { addDays, dateToDay, dayToDate, todayDay } from "@/lib/dates";
import { SUMMARY_SECTIONS } from "@/lib/schemas";
import { adherence } from "./medications";
import { baselineChanges } from "./symptoms";
import { round1 } from "./baseline";

export type SummarySection = (typeof SUMMARY_SECTIONS)[number];

const METRIC_LABEL: Record<string, string> = {
  bowelMovements: "bowel movement frequency",
  nightBowelMovements: "night-time bowel movements",
  pain: "abdominal pain",
  fatigue: "fatigue",
  urgency: "urgency",
  blood: "blood in stool",
};

export type SummaryContent = {
  generatedAt: string;
  period: { start: string; end: string; days: number };
  patient: { displayName: string; disease: string | null; diagnosedYear: number | null; hasStoma: boolean | null };
  sections: SummarySection[];
  overview?: string;
  symptoms?: {
    daysLogged: number;
    averages: Record<string, number | null>;
    daysWithBlood: number;
    daysWithUrgency: number;
    changes: string[];
  };
  medications?: { id: string; name: string; dose: string; schedule: string; route: string; since: string | null; verification: string }[];
  adherence?: { name: string; taken: number; delayed: number; skipped: number; expected: number | null; reasons: string[] }[];
  labs?: { id: string; name: string; value: string; date: string; source: string; sourceId: string | null }[];
  procedures?: { id: string; type: string; date: string; findings: string | null; sourceId: string | null }[];
  events?: { id: string; type: string; title: string; date: string; description: string | null }[];
  documents?: { id: string; title: string; type: string; date: string | null }[];
  trends?: { bowelMovements: { day: string; value: number }[]; pain: { day: string; value: number }[]; labs: Record<string, { day: string; value: number }[]> };
  questions?: string[];
  concerns?: string | null;
  sourceRefs: string[];
  basedOn: string;
  disclaimer: string;
};

const DISCLAIMER =
  "Prepared by the patient with VIVIA from their own entries and confirmed documents. Not a medical record, not a diagnosis. Values from documents were extracted automatically and confirmed by the patient.";

/** Context builder: the data scope for one summary. Nothing outside it is loaded. */
export async function buildSummaryContext(userId: string, periodDays: number, sections: SummarySection[], today = todayDay()) {
  const start = addDays(today, -(periodDays - 1));
  const from = dayToDate(start);
  const to = new Date(dayToDate(today).getTime() + 86400_000 - 1);
  const want = (s: SummarySection) => sections.includes(s);
  const [profile, diagnosis, entries, meds, medEvents, labs, procs, events, docs] = await Promise.all([
    prisma.patientProfile.findUnique({ where: { userId }, select: { displayName: true, hasStoma: true } }),
    prisma.diagnosis.findFirst({ where: { userId, verificationStatus: { not: "REJECTED" } }, orderBy: { createdAt: "asc" }, select: { disease: true, diagnosedAt: true } }),
    want("symptoms") || want("trends") ? prisma.symptomEntry.findMany({ where: { userId, date: { gte: from, lte: to } }, orderBy: { date: "asc" } }) : [],
    want("medications") || want("adherence") ? prisma.medication.findMany({ where: { userId, active: true, verificationStatus: { not: "REJECTED" } } }) : [],
    want("adherence") ? prisma.medicationEvent.findMany({ where: { userId, occurredAt: { gte: from, lte: to } } }) : [],
    want("labs") || want("trends") ? prisma.labResult.findMany({ where: { userId, takenAt: { gte: from, lte: to }, verificationStatus: { not: "REJECTED" } }, orderBy: { takenAt: "asc" } }) : [],
    want("procedures") ? prisma.procedure.findMany({ where: { userId, performedAt: { gte: from, lte: to } }, orderBy: { performedAt: "asc" } }) : [],
    want("events") ? prisma.clinicalEvent.findMany({ where: { userId, startedAt: { gte: from, lte: to } }, orderBy: { startedAt: "asc" } }) : [],
    want("documents") ? prisma.medicalDocument.findMany({ where: { userId, OR: [{ documentDate: { gte: from, lte: to } }, { documentDate: null, createdAt: { gte: from, lte: to } }] }, select: { id: true, title: true, type: true, documentDate: true } }) : [],
  ]);
  return { start, end: today, from, to, profile, diagnosis, entries, meds, medEvents, labs, procs, events, docs };
}

const avg = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x !== null && x !== undefined);
  return v.length ? round1(v.reduce((a, b) => a + b, 0) / v.length) : null;
};

export async function generateSummary(
  userId: string,
  opts: { visitId?: string | null; periodDays: number; sections: SummarySection[]; concerns?: string | null; locale?: string },
  today = todayDay(),
) {
  if (opts.visitId) {
    const v = await prisma.doctorVisit.findFirst({ where: { id: opts.visitId, userId } });
    if (!v) throw notFound("Visit not found");
    if (!opts.concerns && v.patientConcerns) opts.concerns = v.patientConcerns;
  }
  const sections = opts.sections;
  const ctx = await buildSummaryContext(userId, opts.periodDays, sections, today);
  const refs: string[] = [];
  const content: SummaryContent = {
    generatedAt: new Date().toISOString(),
    period: { start: ctx.start, end: ctx.end, days: opts.periodDays },
    patient: {
      displayName: ctx.profile?.displayName ?? "",
      disease: ctx.diagnosis?.disease ?? null,
      diagnosedYear: ctx.diagnosis?.diagnosedAt?.getUTCFullYear() ?? null,
      hasStoma: ctx.profile?.hasStoma ?? null,
    },
    sections,
    sourceRefs: refs,
    basedOn: `Based on your data from ${ctx.start} to ${ctx.end}.`,
    disclaimer: DISCLAIMER,
  };
  const facts: string[] = [];
  const signals: VisitSignals = { aboveBaseline: [], missedDoses: [], newLabs: [], procedures: [], events: [], patientConcerns: opts.concerns ?? undefined };

  if (sections.includes("symptoms")) {
    const e = ctx.entries;
    e.forEach((x) => refs.push(`SymptomEntry:${x.id}`));
    const changes = await baselineChanges(userId, today);
    content.symptoms = {
      daysLogged: e.length,
      averages: {
        bowelMovements: avg(e.map((x) => x.bowelMovements)),
        pain: avg(e.map((x) => x.pain)),
        fatigue: avg(e.map((x) => x.fatigue)),
        urgency: avg(e.map((x) => x.urgency)),
      },
      daysWithBlood: e.filter((x) => (x.blood ?? 0) > 0).length,
      daysWithUrgency: e.filter((x) => (x.urgency ?? 0) >= 2).length,
      changes: changes.map(
        (c) =>
          `${METRIC_LABEL[c.metric]} has been above the patient's recent 30-day baseline for ${c.consecutiveDays} days (since ${c.since}; recent average ${c.recentMean} vs baseline ${c.baselineMean}).`,
      ),
    };
    facts.push(`${e.length} days logged in the period`);
    if (content.symptoms.averages.bowelMovements !== null) facts.push(`average bowel movements per logged day: ${content.symptoms.averages.bowelMovements}`);
    if (content.symptoms.daysWithBlood) facts.push(`blood reported on ${content.symptoms.daysWithBlood} day(s)`);
    facts.push(...content.symptoms.changes);
    signals.aboveBaseline = changes.map((c) => ({ metric: c.metric, label: METRIC_LABEL[c.metric], since: c.since }));
  }

  if (sections.includes("medications")) {
    content.medications = ctx.meds.map((m) => {
      refs.push(`Medication:${m.id}`);
      return {
        id: m.id,
        name: m.name,
        dose: m.dose != null ? `${m.dose} ${m.unit ?? ""}`.trim() : "—",
        schedule: m.asNeeded ? "as needed" : m.intervalDays ? (m.intervalDays === 1 ? `${m.timesPerDay ?? 1}× daily` : `every ${m.intervalDays} days`) : m.scheduleNote ?? "—",
        route: m.route.toLowerCase(),
        since: m.startDate ? dateToDay(m.startDate) : null,
        verification: m.verificationStatus,
      };
    });
    facts.push(`active medications: ${ctx.meds.map((m) => m.name).join(", ") || "none recorded"}`);
  }

  if (sections.includes("adherence")) {
    content.adherence = ctx.meds.map((m) => {
      const evs = ctx.medEvents.filter((e) => e.medicationId === m.id);
      const a = adherence(m, evs, ctx.from, ctx.to);
      if (a.skipped) signals.missedDoses.push({ medication: m.name, count: a.skipped });
      const reasons = evs.filter((e) => e.reason || e.notes).map((e) => [e.reason, e.notes].filter(Boolean).join(" — "));
      return { name: m.name, ...a, reasons: [...new Set(reasons)].slice(0, 5) };
    });
    for (const a of content.adherence) if (a.skipped) facts.push(`${a.name}: ${a.skipped} dose(s) recorded as skipped`);
  }

  if (sections.includes("labs")) {
    content.labs = ctx.labs.map((l) => {
      refs.push(`LabResult:${l.id}`);
      return { id: l.id, name: l.testName, value: `${l.value ?? l.valueText ?? ""} ${l.unit ?? ""}`.trim(), date: dateToDay(l.takenAt), source: l.sourceType, sourceId: l.sourceId };
    });
    const latestByTest = new Map<string, (typeof content.labs)[number]>();
    for (const l of content.labs) latestByTest.set(l.name, l);
    signals.newLabs = [...latestByTest.values()].map((l) => ({ label: l.name, value: l.value, date: l.date }));
    for (const l of latestByTest.values()) facts.push(`${l.name} ${l.value} on ${l.date}`);
  }

  if (sections.includes("procedures")) {
    content.procedures = ctx.procs.map((p) => {
      refs.push(`Procedure:${p.id}`);
      return { id: p.id, type: p.type, date: dateToDay(p.performedAt), findings: p.findings, sourceId: p.sourceId };
    });
    signals.procedures = content.procedures.map((p) => ({ label: p.type.toLowerCase(), date: p.date, findings: p.findings ?? undefined }));
    for (const p of content.procedures) facts.push(`${p.type.toLowerCase()} on ${p.date}`);
  }

  if (sections.includes("events")) {
    content.events = ctx.events.map((e) => {
      refs.push(`ClinicalEvent:${e.id}`);
      return { id: e.id, type: e.type, title: e.title, date: dateToDay(e.startedAt), description: e.description };
    });
    signals.events = content.events.map((e) => ({ label: e.title, date: e.date }));
    for (const e of content.events) facts.push(`${e.title} on ${e.date}`);
  }

  if (sections.includes("documents")) {
    content.documents = ctx.docs.map((d) => {
      refs.push(`MedicalDocument:${d.id}`);
      return { id: d.id, title: d.title, type: d.type, date: d.documentDate ? dateToDay(d.documentDate) : null };
    });
  }

  if (sections.includes("trends")) {
    const labsByCode: Record<string, { day: string; value: number }[]> = {};
    for (const l of ctx.labs) if (l.value !== null) (labsByCode[l.testCode] ??= []).push({ day: dateToDay(l.takenAt), value: l.value });
    content.trends = {
      bowelMovements: ctx.entries.filter((e) => e.bowelMovements !== null).map((e) => ({ day: dateToDay(e.date), value: e.bowelMovements! })),
      pain: ctx.entries.filter((e) => e.pain !== null).map((e) => ({ day: dateToDay(e.date), value: e.pain! })),
      labs: labsByCode,
    };
  }

  if (sections.includes("concerns")) content.concerns = opts.concerns?.trim() || null;

  // AI: overview + questions, from the computed facts only.
  let aiRunId: string | null = null;
  if (sections.includes("questions") || facts.length) {
    const provider = await providerFor(userId, "AI_PROCESSING");
    const { output, run } = await runAI<VisitNarrative>({
      userId,
      task: "VISIT_SUMMARY",
      provider,
      inputScope: { categories: sections, periodDays: opts.periodDays, from: ctx.start, to: ctx.end, identityDataSent: false },
      sourceRefs: refs,
      exec: (p) => p.visitNarrative({ periodLabel: `from ${ctx.start} to ${ctx.end}`, facts, signals, locale: opts.locale ?? "en" }),
      postprocess: (out) => {
        const o = guardText(out.overview);
        const q = guardList(out.questions);
        return { output: { overview: o.text, questions: q.items }, flags: [...o.flags, ...q.flags] };
      },
    });
    aiRunId = run.id;
    content.overview = output.overview;
    if (sections.includes("questions")) content.questions = output.questions;
  }

  const summary = await prisma.visitSummary.create({
    data: {
      userId,
      visitId: opts.visitId ?? null,
      periodStart: dayToDate(ctx.start),
      periodEnd: dayToDate(ctx.end),
      includedSections: sections,
      content: content as unknown as Prisma.InputJsonValue,
      aiRunId,
    },
  });
  await audit(userId, "summary.generated", "VisitSummary", summary.id, { sections });
  return summary;
}

export async function getSummary(userId: string, id: string) {
  const s = await prisma.visitSummary.findFirst({ where: { id, userId }, include: { shareLinks: { orderBy: { createdAt: "desc" } } } });
  if (!s) throw notFound("Summary not found");
  return { ...s, content: s.content as unknown as SummaryContent };
}

export async function listSummaries(userId: string) {
  return prisma.visitSummary.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, createdAt: true, periodStart: true, periodEnd: true, visitId: true, patientConfirmed: true } });
}

/** Patient edits questions before sharing — patient stays in control of content. */
export async function updateSummaryQuestions(userId: string, id: string, questions: string[], concerns?: string | null) {
  const s = await getSummary(userId, id);
  const q = guardList(questions.map((x) => x.trim()).filter(Boolean).slice(0, 12));
  const content = { ...s.content, questions: q.items, ...(concerns !== undefined ? { concerns } : {}) };
  await prisma.visitSummary.update({ where: { id: s.id }, data: { content: content as unknown as Prisma.InputJsonValue, patientConfirmed: true } });
  if (s.aiRunId) await prisma.aiRun.updateMany({ where: { id: s.aiRunId, userId }, data: { userConfirmed: true, confirmedAt: new Date() } });
  await audit(userId, "summary.edited", "VisitSummary", id);
}

// ─────────────────────────────── Secure sharing ───────────────────────────────

export const MAX_SHARE_DAYS = 30;

export async function createShareLink(userId: string, summaryId: string, days = 7) {
  if (days < 1 || days > MAX_SHARE_DAYS) throw badRequest(`A link can be valid for 1 to ${MAX_SHARE_DAYS} days`);
  await getSummary(userId, summaryId);
  const token = randomToken(24);
  const link = await prisma.shareLink.create({
    data: { userId, summaryId, tokenHash: sha256(token), expiresAt: new Date(Date.now() + days * 86400_000) },
  });
  await audit(userId, "summary.share_link_created", "ShareLink", link.id, { days });
  return { link, token };
}

export async function revokeShareLink(userId: string, linkId: string) {
  const res = await prisma.shareLink.updateMany({ where: { id: linkId, userId, revokedAt: null }, data: { revokedAt: new Date() } });
  if (!res.count) throw notFound("Link not found");
  await audit(userId, "summary.share_link_revoked", "ShareLink", linkId);
}

/** Public, token-based read. Returns null for unknown, expired or revoked links. */
export async function readSharedSummary(token: string) {
  if (!token || token.length > 100) return null;
  const link = await prisma.shareLink.findUnique({ where: { tokenHash: sha256(token) }, include: { summary: true } });
  if (!link || link.revokedAt || link.expiresAt < new Date()) return null;
  await prisma.shareLink.update({ where: { id: link.id }, data: { accessCount: { increment: 1 }, lastAccessAt: new Date() } });
  await audit(link.userId, "summary.share_link_accessed", "ShareLink", link.id);
  return { content: link.summary.content as unknown as SummaryContent, expiresAt: link.expiresAt };
}
