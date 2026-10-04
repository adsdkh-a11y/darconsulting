/**
 * Anthropic (Claude) implementation of the AIProvider contract.
 * Structured outputs guarantee schema-valid JSON; every result then goes
 * through the same safety + anchoring checks as the offline engine.
 */
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import * as z from "zod/v4";
import type { AIProvider, DocumentExtractionResult, Explanation, ParsedLog, VisitNarrative, VisitNarrativeInput } from "./types";
import { SAFETY_SYSTEM_PROMPT } from "./safety";

export class AIDeclinedError extends Error {}

const DOC_TYPES = ["COLONOSCOPY", "HISTOLOGY", "MRI", "CT", "ULTRASOUND", "BLOOD_TEST", "CALPROTECTIN", "PRESCRIPTION", "SPECIALIST_REPORT", "DISCHARGE_LETTER", "SURGERY_REPORT", "OTHER", "UNKNOWN"] as const;

const ParsedLogSchema = z.object({
  date: z.string().nullable().describe("YYYY-MM-DD only if the text refers to a day other than today"),
  bowelMovements: z.number().int().nullable(),
  nightBowelMovements: z.number().int().nullable(),
  liquidStools: z.number().int().nullable(),
  stoolConsistency: z.number().int().nullable().describe("Bristol 1-7, only if clearly described"),
  stoolVariation: z.boolean().nullable(),
  blood: z.number().int().nullable().describe("0 none, 1 streaks, 2 obvious, 3 mostly blood"),
  urgency: z.number().int().nullable().describe("0-3"),
  pain: z.number().int().nullable().describe("0-10"),
  fatigue: z.number().int().nullable().describe("0-10"),
  nausea: z.number().int().nullable(),
  bloating: z.number().int().nullable(),
  sleepQuality: z.number().int().nullable(),
  stress: z.number().int().nullable(),
  medicationsMentioned: z.array(z.object({ name: z.string(), status: z.enum(["TAKEN", "SKIPPED", "DELAYED"]) })),
  foods: z.array(z.string()),
  estimated: z.array(z.string()).describe("names of fields whose number you estimated from words rather than read"),
  unparsed: z.array(z.string()).describe("health-relevant phrases you could not map to a field"),
});

const ExtractionSchema = z.object({
  classification: z.enum(DOC_TYPES),
  classificationConfidence: z.number(),
  documentDate: z.string().nullable().describe("YYYY-MM-DD"),
  transcribedText: z.string().describe("The full text of the document, transcribed verbatim"),
  summary: z.string().describe("2-4 sentences restating ONLY what the document says, starting 'The report states'"),
  fields: z.array(
    z.object({
      kind: z.enum(["lab", "procedure", "medication", "diagnosis", "date", "finding", "recommendation"]),
      key: z.string().describe("lab code (CRP, CALPROTECTIN, HB, FERRITIN, WBC, PLT, ALBUMIN, ESR, VITD), procedure_type, biopsy_taken, medication:<name>, diagnosis_mentioned, document_date, findings, conclusion, recommendations"),
      label: z.string(),
      value: z.string(),
      unit: z.string().nullable(),
      numericValue: z.number().nullable(),
      observedAt: z.string().nullable(),
      sourceSnippet: z.string().describe("exact text copied from the document that contains this value"),
      confidence: z.number(),
    }),
  ),
});

const NarrativeSchema = z.object({
  overview: z.string(),
  questions: z.array(z.string()),
});

const ExplainSchema = z.object({
  explanations: z.array(z.object({ term: z.string(), explanation: z.string() })),
});

function strip<T extends Record<string, unknown>>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null)) as T;
}

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";
  readonly model: string;
  private client: Anthropic;

  constructor(model = process.env.AI_MODEL || "claude-opus-5-5") {
    this.model = model;
    this.client = new Anthropic();
  }

  private async call<S extends z.ZodType>(
    schema: S,
    content: Anthropic.ContentBlockParam[] | string,
    task: string,
    effort: "low" | "medium" | "high",
  ): Promise<z.infer<S>> {
    const response = await this.client.messages.parse({
      model: this.model,
      max_tokens: 16000,
      system: `${SAFETY_SYSTEM_PROMPT}\n\nTask: ${task}`,
      output_config: { effort, format: zodOutputFormat(schema) },
      messages: [{ role: "user", content }],
    });
    if (response.stop_reason === "refusal") throw new AIDeclinedError("The AI model declined this request");
    if (!response.parsed_output) throw new Error("AI returned no parseable output");
    return response.parsed_output;
  }

  async parseLog(text: string, today: string, knownMedications: string[]): Promise<ParsedLog> {
    const out = await this.call(
      ParsedLogSchema,
      `Today is ${today}. Patient's medication list: ${knownMedications.join(", ") || "(none)"}.\n\nPatient text:\n"""${text}"""`,
      "Turn the patient's own description of their day into structured fields. Only fill a field when the text supports it; leave it null otherwise. Only report medications from the list.",
      "low",
    );
    const res = strip(out) as ParsedLog;
    res.notes = text.slice(0, 1000);
    return res;
  }

  async extractDocument(input: { text?: string; file?: { data: Buffer; mimeType: string } }): Promise<DocumentExtractionResult> {
    const content: Anthropic.ContentBlockParam[] = [];
    if (input.file?.mimeType === "application/pdf") {
      content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: input.file.data.toString("base64") } });
    } else if (input.file && ["image/png", "image/jpeg"].includes(input.file.mimeType)) {
      content.push({ type: "image", source: { type: "base64", media_type: input.file.mimeType as "image/png" | "image/jpeg", data: input.file.data.toString("base64") } });
    } else if (input.text) {
      content.push({ type: "text", text: `Document text:\n"""${input.text}"""` });
    }
    content.push({
      type: "text",
      text: "Classify this medical document, transcribe it, and extract the fields that are explicitly written in it. Never infer a value that is not written. Every field needs an exact sourceSnippet copied from the document.",
    });
    const out = await this.call(ExtractionSchema, content, "Medical document extraction for patient verification.", "medium");
    return {
      classification: out.classification,
      classificationConfidence: out.classificationConfidence,
      documentDate: out.documentDate ?? undefined,
      summary: out.summary,
      text: input.text || out.transcribedText,
      fields: out.fields.map((f) => ({
        ...f,
        unit: f.unit ?? undefined,
        numericValue: f.numericValue ?? undefined,
        observedAt: f.observedAt ?? undefined,
      })),
    };
  }

  async visitNarrative(input: VisitNarrativeInput): Promise<VisitNarrative> {
    return this.call(
      NarrativeSchema,
      `Language: ${input.locale}. Period: ${input.periodLabel}.\nFacts from the patient's record:\n${input.facts.map((f) => `- ${f}`).join("\n")}\n\nSignals:\n${JSON.stringify(input.signals)}`,
      "Write a short neutral overview (max 3 sentences) of the facts, and up to 8 questions the PATIENT could ask their gastroenterologist. Questions must be based only on these facts, phrased in first person, and must not suggest diagnoses or treatment changes.",
      "medium",
    );
  }

  async explainTerms(terms: string[], locale: string): Promise<Explanation[]> {
    const out = await this.call(
      ExplainSchema,
      `Language: ${locale}. Terms: ${terms.join("; ")}`,
      "Explain in plain language what each term GENERALLY means (start with 'In general'). Do not interpret the patient's result or condition.",
      "low",
    );
    return out.explanations;
  }
}
