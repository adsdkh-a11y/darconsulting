/**
 * AI safety guardrails. Applied to EVERY AI output, whichever provider made it.
 *
 * VIVIA is not a doctor: AI must not diagnose, prescribe, recommend changing or
 * stopping treatment, claim a flare, or invent results.
 */
import type { DocumentExtractionResult, ExtractedFieldDraft } from "./types";

const FORBIDDEN: { re: RegExp; flag: string }[] = [
  { re: /\byou (?:have|are having|are in|'re having|'re in) (?:a |an )?(?:flare|relapse|flare-up|infection|obstruction|abscess)/i, flag: "claims_flare_or_condition" },
  { re: /\b(?:this|it) (?:is|means|indicates|confirms) (?:a |an )?(?:flare|relapse|active disease|remission)/i, flag: "claims_flare_or_condition" },
  { re: /\b(?:stop|discontinue|pause|quit) (?:taking |using )?(?:your |the )?(?:medication|medicine|treatment|drug|dose|\w+mab|\w+nib)/i, flag: "treatment_change" },
  { re: /\b(?:increase|decrease|reduce|double|halve|change|adjust|skip) (?:your |the )?(?:dose|dosage|medication|treatment)/i, flag: "treatment_change" },
  { re: /\byou should (?:take|start|use) /i, flag: "prescribing" },
  { re: /\b(?:i|we) (?:diagnose|can diagnose)|\byour diagnosis is\b/i, flag: "diagnosing" },
  { re: /\b(?:no need|don't need|do not need) to (?:see|contact|call) (?:a |your )?(?:doctor|gastroenterologist|care team|emergency)/i, flag: "discourages_care" },
  { re: /\b(?:this|that) food (?:causes|caused|triggers|triggered)\b/i, flag: "causal_food_claim" },
];

export type SafetyResult = { text: string; flags: string[] };

/** Remove any sentence that crosses a safety line, and report what was removed. */
export function guardText(text: string): SafetyResult {
  const flags = new Set<string>();
  const sentences = text.split(/(?<=[.!?])\s+/);
  const kept = sentences.filter((s) => {
    const hit = FORBIDDEN.find((f) => f.re.test(s));
    if (hit) flags.add(hit.flag);
    return !hit;
  });
  return { text: kept.join(" ").trim(), flags: [...flags] };
}

export function guardList(items: string[]): SafetyResult & { items: string[] } {
  const flags = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const g = guardText(item);
    g.flags.forEach((f) => flags.add(f));
    if (g.text) out.push(g.text);
  }
  return { text: out.join("\n"), items: out, flags: [...flags] };
}

function norm(s: string) {
  return s.toLowerCase().replace(/[\s ]+/g, " ").replace(/[’']/g, "'").trim();
}

/**
 * Anti-hallucination: an extracted field is kept only if its source snippet and
 * its value can be found in the document text. Fields that cannot be anchored
 * are dropped, never "helpfully" kept.
 */
export function verifyExtraction(result: DocumentExtractionResult, documentText: string | undefined) {
  const flags = new Set<string>();
  if (!documentText?.trim()) {
    // Nothing to verify against: keep fields but cap confidence so the UI
    // forces explicit per-field review.
    return {
      result: { ...result, fields: result.fields.map((f) => ({ ...f, confidence: Math.min(f.confidence, 0.5) })) },
      flags: ["unverifiable_no_text"],
    };
  }
  const doc = norm(documentText);
  const fields: ExtractedFieldDraft[] = [];
  for (const f of result.fields) {
    const snippetOk = f.sourceSnippet && doc.includes(norm(f.sourceSnippet).slice(0, 120));
    const valueCore = f.kind === "lab" ? f.value.replace(/[<>≤≥]/g, "") : "";
    const valueOk =
      f.kind !== "lab" ||
      doc.includes(norm(valueCore)) ||
      doc.includes(norm(valueCore.replace(".", ",")));
    if (snippetOk && valueOk) fields.push({ ...f, confidence: Math.max(0, Math.min(1, f.confidence)) });
    else flags.add("dropped_unanchored_field");
  }
  const summary = guardText(result.summary);
  summary.flags.forEach((f) => flags.add(f));
  return { result: { ...result, fields, summary: summary.text }, flags: [...flags] };
}

export const SAFETY_SYSTEM_PROMPT = `You are part of VIVIA, a self-management app for people living with inflammatory bowel disease (Crohn's disease, ulcerative colitis) and people with a stoma.
You are NOT a doctor. Strict rules:
- Never diagnose. Never say the person has, or is having, a flare, relapse, infection or any condition.
- Never recommend starting, stopping, skipping or changing any medication or dose.
- Never invent values, dates or findings. If something is not in the provided data, it does not exist.
- Describe changes neutrally ("your entries show a change compared with your recent baseline") and point to the care team ("this may be useful to discuss with your gastroenterologist").
- Say "I cannot determine the cause from your data" when asked about causes.
- Correlation is not causation: never say a food causes symptoms.`;
