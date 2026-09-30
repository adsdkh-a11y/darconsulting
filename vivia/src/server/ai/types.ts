// AI service contracts. Providers (Anthropic, offline rules) implement these;
// business logic never talks to a vendor SDK directly.

export type ParsedLog = {
  date?: string; // YYYY-MM-DD if the user mentioned a day other than today
  bowelMovements?: number;
  nightBowelMovements?: number;
  liquidStools?: number;
  stoolConsistency?: number; // 1..7
  stoolVariation?: boolean; // "first two normal then diarrhea"
  blood?: number; // 0..3
  urgency?: number; // 0..3
  pain?: number; // 0..10
  fatigue?: number; // 0..10
  nausea?: number;
  bloating?: number;
  sleepQuality?: number;
  stress?: number;
  medicationsMentioned?: { name: string; status: "TAKEN" | "SKIPPED" | "DELAYED" }[];
  foods?: string[];
  notes?: string;
  /** Fields whose number was estimated from words ("tired" → fatigue 5). Shown to the user for confirmation. */
  estimated?: string[];
  /** Things the parser saw but could not map — shown to the user, never stored silently. */
  unparsed?: string[];
};

export type DocType =
  | "COLONOSCOPY" | "HISTOLOGY" | "MRI" | "CT" | "ULTRASOUND" | "BLOOD_TEST" | "CALPROTECTIN"
  | "PRESCRIPTION" | "SPECIALIST_REPORT" | "DISCHARGE_LETTER" | "SURGERY_REPORT" | "OTHER" | "UNKNOWN";

export type ExtractedFieldDraft = {
  kind: "lab" | "procedure" | "medication" | "diagnosis" | "date" | "finding" | "recommendation";
  key: string;
  label: string;
  value: string;
  unit?: string;
  numericValue?: number;
  observedAt?: string; // ISO date
  sourceSnippet: string; // MUST be text present in the document
  confidence: number; // 0..1
};

export type DocumentExtractionResult = {
  classification: DocType;
  classificationConfidence: number;
  documentDate?: string;
  summary: string; // "What your document says" — strictly restating the document
  fields: ExtractedFieldDraft[];
  /** Full text of the document (text layer or OCR transcription), used to verify every snippet. */
  text?: string;
};

export type VisitSignals = {
  aboveBaseline: { metric: string; label: string; since: string }[];
  missedDoses: { medication: string; count: number }[];
  newLabs: { label: string; value: string; date: string }[];
  procedures: { label: string; date: string; findings?: string }[];
  events: { label: string; date: string }[];
  patientConcerns?: string;
};

export type VisitNarrativeInput = {
  periodLabel: string;
  facts: string[]; // pre-computed, source-referenced facts from the Health Memory
  signals: VisitSignals;
  locale: string;
};

export type VisitNarrative = {
  overview: string;
  questions: string[];
};

export type Explanation = { term: string; explanation: string };

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  parseLog(text: string, today: string, knownMedications: string[]): Promise<ParsedLog>;
  extractDocument(input: { text?: string; file?: { data: Buffer; mimeType: string } }): Promise<DocumentExtractionResult>;
  visitNarrative(input: VisitNarrativeInput): Promise<VisitNarrative>;
  explainTerms(terms: string[], locale: string): Promise<Explanation[]>;
}
