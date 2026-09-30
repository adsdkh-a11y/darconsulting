/**
 * The Health Memory timeline — the heart of VIVIA. One chronological story
 * assembled from every entity, each item carrying its provenance.
 */
import { prisma } from "../db";
import { dateToDay } from "@/lib/dates";
import type { SourceType, VerificationStatus } from "@prisma/client";

export type TimelineKind = "symptoms" | "medication" | "medication_change" | "lab" | "procedure" | "event" | "document" | "visit" | "questionnaire";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  at: string; // ISO datetime
  day: string;
  title: string;
  detail?: string;
  href?: string;
  source?: SourceType;
  /** Other sources that contributed to the same record (e.g. a Tell VIVIA addition). */
  extraSources?: SourceType[];
  verification?: VerificationStatus;
};

export async function buildTimeline(userId: string, opts: { from?: Date; to?: Date; kinds?: TimelineKind[] } = {}) {
  const from = opts.from ?? new Date(Date.now() - 365 * 86400_000);
  const to = opts.to ?? new Date(Date.now() + 365 * 86400_000);
  const want = (k: TimelineKind) => !opts.kinds || opts.kinds.includes(k);
  const items: TimelineItem[] = [];

  const [symptoms, medEvents, meds, labs, procs, events, docs, visits, qs] = await Promise.all([
    want("symptoms") ? prisma.symptomEntry.findMany({ where: { userId, date: { gte: from, lte: to } } }) : [],
    want("medication") ? prisma.medicationEvent.findMany({ where: { userId, occurredAt: { gte: from, lte: to }, status: { not: "TAKEN" } }, include: { medication: true } }) : [],
    want("medication_change") ? prisma.medication.findMany({ where: { userId } }) : [],
    want("lab") ? prisma.labResult.findMany({ where: { userId, takenAt: { gte: from, lte: to }, verificationStatus: { not: "REJECTED" } } }) : [],
    want("procedure") ? prisma.procedure.findMany({ where: { userId, performedAt: { gte: from, lte: to } } }) : [],
    want("event") ? prisma.clinicalEvent.findMany({ where: { userId, startedAt: { gte: from, lte: to } } }) : [],
    want("document") ? prisma.medicalDocument.findMany({ where: { userId, createdAt: { gte: from, lte: to } } }) : [],
    want("visit") ? prisma.doctorVisit.findMany({ where: { userId, scheduledAt: { gte: from, lte: to } }, include: { doctor: true } }) : [],
    want("questionnaire") ? prisma.questionnaireResponse.findMany({ where: { userId, completedAt: { gte: from, lte: to } } }) : [],
  ]);

  for (const s of symptoms) {
    const bits = [
      s.bowelMovements != null ? `${s.bowelMovements} BM` : null,
      s.blood != null ? (s.blood === 0 ? "no blood" : "blood noted") : null,
      s.pain != null ? `pain ${s.pain}/10` : null,
      s.fatigue != null ? `fatigue ${s.fatigue}/10` : null,
      s.urgency ? "urgency" : null,
    ].filter(Boolean);
    items.push({ id: s.id, kind: "symptoms", at: s.date.toISOString(), day: dateToDay(s.date), title: "Check-in", detail: bits.join(" · ") || undefined, source: s.sourceType, extraSources: [...new Set(s.mergedSources.map((m) => m.split(":")[0] as SourceType))].filter((x) => x !== s.sourceType), verification: s.verificationStatus });
  }
  for (const e of medEvents) {
    items.push({ id: e.id, kind: "medication", at: e.occurredAt.toISOString(), day: dateToDay(e.occurredAt), title: `${e.medication.name}: ${e.status.toLowerCase().replace("_", " ")}`, detail: e.reason ?? undefined, href: `/medications/${e.medicationId}`, source: e.sourceType });
  }
  for (const m of meds) {
    if (m.startDate && m.startDate >= from && m.startDate <= to)
      items.push({ id: `${m.id}-start`, kind: "medication_change", at: m.startDate.toISOString(), day: dateToDay(m.startDate), title: `Started ${m.name}`, detail: [m.dose && `${m.dose} ${m.unit ?? ""}`, m.intervalDays && `every ${m.intervalDays} day(s)`].filter(Boolean).join(" · ") || undefined, href: `/medications/${m.id}`, source: m.sourceType, verification: m.verificationStatus });
    if (m.endDate && m.endDate >= from && m.endDate <= to)
      items.push({ id: `${m.id}-end`, kind: "medication_change", at: m.endDate.toISOString(), day: dateToDay(m.endDate), title: `Stopped ${m.name}`, href: `/medications/${m.id}`, source: m.sourceType });
  }
  for (const l of labs) {
    items.push({ id: l.id, kind: "lab", at: l.takenAt.toISOString(), day: dateToDay(l.takenAt), title: l.testName, detail: `${l.value ?? l.valueText ?? ""} ${l.unit ?? ""}`.trim(), href: l.sourceType === "DOCUMENT_EXTRACTION" && l.sourceId ? `/documents/${l.sourceId}` : "/trends", source: l.sourceType, verification: l.verificationStatus });
  }
  for (const p of procs) {
    items.push({ id: p.id, kind: "procedure", at: p.performedAt.toISOString(), day: dateToDay(p.performedAt), title: p.type.charAt(0) + p.type.slice(1).toLowerCase().replace(/_/g, " "), detail: p.findings?.slice(0, 160) ?? undefined, href: p.sourceType === "DOCUMENT_EXTRACTION" && p.sourceId ? `/documents/${p.sourceId}` : undefined, source: p.sourceType, verification: p.verificationStatus });
  }
  for (const e of events) {
    items.push({ id: e.id, kind: "event", at: e.startedAt.toISOString(), day: dateToDay(e.startedAt), title: e.title, detail: e.description ?? undefined, source: e.sourceType, verification: e.verificationStatus });
  }
  for (const d of docs) {
    items.push({ id: d.id, kind: "document", at: d.createdAt.toISOString(), day: dateToDay(d.createdAt), title: `Document added: ${d.title}`, href: `/documents/${d.id}` });
  }
  for (const v of visits) {
    items.push({ id: v.id, kind: "visit", at: v.scheduledAt.toISOString(), day: dateToDay(v.scheduledAt), title: `Appointment${v.doctor ? ` — ${v.doctor.name}` : ""}`, detail: v.reason ?? undefined, href: `/visits/${v.id}` });
  }
  for (const q of qs) {
    items.push({ id: q.id, kind: "questionnaire", at: q.completedAt.toISOString(), day: dateToDay(q.completedAt), title: `${q.instrument} questionnaire`, detail: q.score != null ? `score ${q.score} (monitoring tool, not a diagnosis)` : undefined, source: q.sourceType });
  }
  return items.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}
