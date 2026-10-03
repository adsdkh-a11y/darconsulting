/**
 * "Tell VIVIA" — natural-language (typed or spoken) logging.
 * interpret() never writes health data; confirm() writes only what the patient
 * approved (possibly edited), with provenance AI_NATURAL_LANGUAGE → AiRun.
 */
import { prisma } from "../db";
import { audit } from "../audit";
import { badRequest, notFound } from "../errors";
import { providerFor, runAI, type ParsedLog } from "../ai";
import { todayDay } from "@/lib/dates";
import { symptomSchema } from "@/lib/schemas";
import { listMedications, logMedicationEvent } from "./medications";
import { logSymptoms } from "./symptoms";

export async function interpretLog(userId: string, text: string, today = todayDay()) {
  const trimmed = text.trim();
  if (!trimmed) throw badRequest("Please tell VIVIA what happened");
  if (trimmed.length > 2000) throw badRequest("Text is too long (max 2000 characters)");
  const meds = await listMedications(userId);
  const provider = await providerFor(userId, "AI_PROCESSING");
  const { output, run } = await runAI<ParsedLog>({
    userId,
    task: "NATURAL_LANGUAGE_LOG",
    provider,
    // Minimisation: only the text and medication names are sent — no identity data.
    inputScope: { categories: ["free_text", "medication_names"], day: today },
    exec: (p) => p.parseLog(trimmed, today, meds.map((m) => m.name)),
  });
  return { runId: run.id, provider: run.provider, parsed: output };
}

export async function confirmLog(userId: string, runId: string, edited: ParsedLog, today = todayDay()) {
  const run = await prisma.aiRun.findFirst({ where: { id: runId, userId, task: "NATURAL_LANGUAGE_LOG" } });
  if (!run) throw notFound("Interpretation not found");
  if (run.userConfirmed) throw badRequest("This entry was already saved");

  const symptomInput = symptomSchema.parse({
    date: edited.date ?? today,
    bowelMovements: edited.bowelMovements,
    nightBowelMovements: edited.nightBowelMovements,
    liquidStools: edited.liquidStools,
    stoolConsistency: edited.stoolConsistency,
    blood: edited.blood,
    urgency: edited.urgency,
    pain: edited.pain,
    fatigue: edited.fatigue,
    nausea: edited.nausea,
    bloating: edited.bloating,
    sleepQuality: edited.sleepQuality,
    stress: edited.stress,
    notes: edited.stoolVariation ? "Stool consistency varied during the day." : undefined,
  });
  const hasSymptom = Object.entries(symptomInput).some(([k, v]) => k !== "date" && v !== undefined && v !== null);
  const src = { sourceType: "AI_NATURAL_LANGUAGE" as const, sourceId: run.id };
  const rawText = (run.output as { notes?: string } | null)?.notes;
  const entry = hasSymptom ? await logSymptoms(userId, { ...symptomInput, rawText }, src) : null;

  const meds = await listMedications(userId);
  let medEvents = 0;
  for (const m of edited.medicationsMentioned ?? []) {
    const med = meds.find((x) => x.name.toLowerCase() === m.name.toLowerCase());
    if (!med) continue;
    await logMedicationEvent(userId, med.id, { status: m.status }, src);
    medEvents++;
  }
  for (const f of edited.foods ?? []) {
    await prisma.foodEntry.create({ data: { userId, occurredAt: new Date(), description: f.slice(0, 200), sourceType: "AI_NATURAL_LANGUAGE", sourceId: run.id } });
  }
  await prisma.aiRun.update({ where: { id: run.id }, data: { userConfirmed: true, confirmedAt: new Date() } });
  await audit(userId, "natural_log.confirmed", "AiRun", run.id);
  return { entryId: entry?.id ?? null, medEvents };
}

export async function cancelLog(userId: string, runId: string) {
  await prisma.aiRun.updateMany({ where: { id: runId, userId, userConfirmed: null }, data: { userConfirmed: false } });
}
