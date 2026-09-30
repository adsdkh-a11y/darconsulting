import { prisma } from "../db";
import { audit } from "../audit";
import { addDays, dateToDay, dayToDate, todayDay } from "@/lib/dates";
import type { SymptomInput } from "@/lib/schemas";
import type { SourceType } from "@prisma/client";
import { BASELINE_METRICS, detectChange, compareWindows, type BaselineMetric, type DailyPoint } from "./baseline";

const FIELDS = [
  "overall", "bowelMovements", "nightBowelMovements", "stoolConsistency", "liquidStools", "blood", "urgency", "pain",
  "fatigue", "bloating", "nausea", "appetite", "sleepQuality", "stress", "mood", "stomaOutput", "notes",
] as const;

/**
 * One check-in per day, additive: logging again on the same day fills in or
 * updates only the fields provided. "Log in seconds" — never a full form.
 */
export async function logSymptoms(
  userId: string,
  input: SymptomInput & { rawText?: string },
  source: { sourceType: SourceType; sourceId?: string } = { sourceType: "PATIENT_ENTERED" },
) {
  const day = input.date ?? todayDay();
  const data: Record<string, unknown> = {};
  for (const f of FIELDS) if (input[f] !== undefined && input[f] !== null) data[f] = input[f];
  if (input.rawText) data.rawText = input.rawText;

  const existing = await prisma.symptomEntry.findFirst({ where: { userId, date: dayToDate(day) }, orderBy: { createdAt: "desc" } });
  const entry = existing
    ? await prisma.symptomEntry.update({
        where: { id: existing.id },
        data: {
          ...data,
          notes: input.notes && existing.notes ? `${existing.notes}\n${input.notes}` : (data.notes as string | undefined),
          recordedAt: new Date(),
          // The original provenance stays; any different contributing source is appended.
          ...(existing.sourceType !== source.sourceType || existing.sourceId !== (source.sourceId ?? null)
            ? { mergedSources: { push: `${source.sourceType}:${source.sourceId ?? ""}` } }
            : {}),
        },
      })
    : await prisma.symptomEntry.create({
        data: { userId, date: dayToDate(day), ...data, sourceType: source.sourceType, sourceId: source.sourceId },
      });
  await audit(userId, "symptoms.logged", "SymptomEntry", entry.id, { source: source.sourceType });
  return entry;
}

export async function repeatYesterday(userId: string, today = todayDay()) {
  const prev = await prisma.symptomEntry.findFirst({
    where: { userId, date: { lt: dayToDate(today) } },
    orderBy: { date: "desc" },
  });
  if (!prev) return null;
  const input: SymptomInput = { date: today };
  for (const f of FIELDS) if (f !== "notes" && prev[f] !== null) (input as Record<string, unknown>)[f] = prev[f];
  return logSymptoms(userId, input);
}

export async function getEntryForDay(userId: string, day = todayDay()) {
  return prisma.symptomEntry.findFirst({ where: { userId, date: dayToDate(day) } });
}

export async function listEntries(userId: string, fromDay: string, toDay: string) {
  return prisma.symptomEntry.findMany({
    where: { userId, date: { gte: dayToDate(fromDay), lte: dayToDate(toDay) } },
    orderBy: { date: "asc" },
  });
}

export async function series(userId: string, metric: BaselineMetric | "stoolConsistency" | "overall", days: number, today = todayDay()): Promise<DailyPoint[]> {
  const entries = await listEntries(userId, addDays(today, -(days - 1)), today);
  return entries
    .filter((e) => e[metric] !== null && e[metric] !== undefined)
    .map((e) => ({ day: dateToDay(e.date), value: e[metric] as number }));
}

/** All neutral "change from your pattern" observations for the Home screen & summary. */
export async function baselineChanges(userId: string, today = todayDay()) {
  const entries = await listEntries(userId, addDays(today, -60), today);
  const out = [];
  for (const m of BASELINE_METRICS) {
    const pts = entries.filter((e) => e[m] !== null).map((e) => ({ day: dateToDay(e.date), value: e[m] as number }));
    const c = detectChange(m, pts, today);
    if (c) out.push(c);
  }
  return out;
}

export async function windowComparisons(userId: string, today = todayDay()) {
  const entries = await listEntries(userId, addDays(today, -60), today);
  const res: Partial<Record<BaselineMetric, ReturnType<typeof compareWindows>>> = {};
  for (const m of BASELINE_METRICS) {
    const pts = entries.filter((e) => e[m] !== null).map((e) => ({ day: dateToDay(e.date), value: e[m] as number }));
    res[m] = compareWindows(pts, today);
  }
  return res;
}
