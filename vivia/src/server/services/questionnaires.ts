/**
 * Validated patient-reported instruments. Registry pattern: new instruments are
 * added as data + a scoring function. Scores are MONITORING TOOLS — they are
 * stored with instrument, version, date and answers, and never presented as a
 * diagnosis or a grade.
 *
 * Wording to be checked against the licensed/validated translations before
 * production (see COMPLIANCE.md).
 */
import { prisma } from "../db";
import { audit } from "../audit";
import { badRequest } from "../errors";

export type Question =
  | { id: string; text: string; type: "choice"; options: { value: number; label: string }[] }
  | { id: string; text: string; type: "number"; min: number; max: number }
  | { id: string; text: string; type: "multi"; options: { value: string; label: string }[] };

export type Instrument = {
  code: string;
  version: string;
  name: string;
  forDisease: ("CROHNS" | "ULCERATIVE_COLITIS")[];
  recallPeriod: string;
  note: string;
  questions: Question[];
  score: (a: Record<string, unknown>) => number;
};

const wellbeing = { value: 0, label: "Very well" };

export const INSTRUMENTS: Instrument[] = [
  {
    code: "HBI",
    version: "1980-patient-reported-items",
    name: "Harvey-Bradshaw Index (patient-reported items)",
    forDisease: ["CROHNS"],
    recallPeriod: "Yesterday",
    note: "The abdominal mass item requires a clinical examination and is not scored here.",
    questions: [
      { id: "wellbeing", text: "General well-being yesterday", type: "choice", options: [wellbeing, { value: 1, label: "Slightly below par" }, { value: 2, label: "Poor" }, { value: 3, label: "Very poor" }, { value: 4, label: "Terrible" }] },
      { id: "pain", text: "Abdominal pain yesterday", type: "choice", options: [{ value: 0, label: "None" }, { value: 1, label: "Mild" }, { value: 2, label: "Moderate" }, { value: 3, label: "Severe" }] },
      { id: "liquidStools", text: "Number of liquid or soft stools yesterday", type: "number", min: 0, max: 40 },
      { id: "complications", text: "Any of these currently? (one point each)", type: "multi", options: [
        { value: "arthralgia", label: "Joint pain" }, { value: "uveitis", label: "Eye inflammation (uveitis)" }, { value: "erythema_nodosum", label: "Erythema nodosum" },
        { value: "aphthous_ulcers", label: "Mouth ulcers" }, { value: "pyoderma", label: "Pyoderma gangrenosum" }, { value: "anal_fissure", label: "Anal fissure" },
        { value: "fistula", label: "New fistula" }, { value: "abscess", label: "Abscess" } ] },
    ],
    score: (a) => Number(a.wellbeing ?? 0) + Number(a.pain ?? 0) + Number(a.liquidStools ?? 0) + (Array.isArray(a.complications) ? a.complications.length : 0),
  },
  {
    code: "SCCAI",
    version: "1998",
    name: "Simple Clinical Colitis Activity Index",
    forDisease: ["ULCERATIVE_COLITIS"],
    recallPeriod: "Today / the last 24 hours",
    note: "A monitoring tool to share with your care team.",
    questions: [
      { id: "freqDay", text: "Bowel frequency during the day", type: "choice", options: [{ value: 0, label: "1–3" }, { value: 1, label: "4–6" }, { value: 2, label: "7–9" }, { value: 3, label: ">9" }] },
      { id: "freqNight", text: "Bowel frequency at night", type: "choice", options: [{ value: 0, label: "None" }, { value: 1, label: "1–3" }, { value: 2, label: "4–6" }] },
      { id: "urgency", text: "Urgency of defecation", type: "choice", options: [{ value: 0, label: "None" }, { value: 1, label: "Hurry" }, { value: 2, label: "Immediately" }, { value: 3, label: "Incontinence" }] },
      { id: "blood", text: "Blood in stool", type: "choice", options: [{ value: 0, label: "None" }, { value: 1, label: "Trace" }, { value: 2, label: "Occasionally frank" }, { value: 3, label: "Usually frank" }] },
      { id: "wellbeing", text: "General well-being", type: "choice", options: [wellbeing, { value: 1, label: "Slightly below par" }, { value: 2, label: "Poor" }, { value: 3, label: "Very poor" }, { value: 4, label: "Terrible" }] },
      { id: "extracolonic", text: "Any of these? (one point each)", type: "multi", options: [
        { value: "arthritis", label: "Joint pain / arthritis" }, { value: "eye", label: "Eye inflammation" }, { value: "erythema_nodosum", label: "Erythema nodosum" }, { value: "pyoderma", label: "Pyoderma gangrenosum" } ] },
    ],
    score: (a) => ["freqDay", "freqNight", "urgency", "blood", "wellbeing"].reduce((s, k) => s + Number(a[k] ?? 0), 0) + (Array.isArray(a.extracolonic) ? a.extracolonic.length : 0),
  },
];

export function getInstrument(code: string) {
  return INSTRUMENTS.find((i) => i.code === code);
}

export function validateAnswers(inst: Instrument, answers: Record<string, unknown>) {
  for (const q of inst.questions) {
    const v = answers[q.id];
    if (q.type === "choice" && !q.options.some((o) => o.value === Number(v))) throw badRequest(`Please answer: ${q.text}`);
    if (q.type === "number" && (!Number.isInteger(Number(v)) || Number(v) < q.min || Number(v) > q.max)) throw badRequest(`Please answer: ${q.text}`);
    if (q.type === "multi" && v !== undefined && (!Array.isArray(v) || v.some((x) => !q.options.some((o) => o.value === x)))) throw badRequest(`Invalid answer: ${q.text}`);
  }
}

export async function submitQuestionnaire(userId: string, code: string, answers: Record<string, unknown>) {
  const inst = getInstrument(code);
  if (!inst) throw badRequest("Unknown questionnaire");
  validateAnswers(inst, answers);
  const r = await prisma.questionnaireResponse.create({
    data: { userId, instrument: inst.code, instrumentVersion: inst.version, completedAt: new Date(), answers: answers as object, score: inst.score(answers) },
  });
  await audit(userId, "questionnaire.completed", "QuestionnaireResponse", r.id, { instrument: code });
  return r;
}

export async function listResponses(userId: string) {
  return prisma.questionnaireResponse.findMany({ where: { userId }, orderBy: { completedAt: "desc" }, take: 50 });
}
