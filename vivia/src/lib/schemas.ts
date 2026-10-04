import { z } from "zod";

// Shared input schemas (API + forms). Keep ranges in sync with /docs/DATABASE.md.

const int = (min: number, max: number) => z.coerce.number().int().min(min).max(max);
const optInt = (min: number, max: number) => int(min, max).nullish();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const DISEASES = ["CROHNS", "ULCERATIVE_COLITIS", "IBD_UNCLASSIFIED", "OTHER", "UNKNOWN"] as const;
export const ROUTES = ["ORAL", "SUBCUTANEOUS", "INTRAVENOUS", "RECTAL", "TOPICAL", "OTHER"] as const;
export const FORMS = ["TABLET", "CAPSULE", "INJECTION", "INFUSION", "ENEMA", "SUPPOSITORY", "CREAM", "FOAM", "LIQUID", "OTHER"] as const;
export const SYMPTOM_KEYS = [
  "bowelMovements", "stoolConsistency", "blood", "urgency", "pain", "fatigue",
  "bloating", "nausea", "appetite", "sleepQuality", "stress", "mood", "nightBowelMovements",
] as const;

export const registerSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(10).max(200),
  locale: z.string().max(5).optional(),
  consentHealthData: z.literal(true),
  consentTerms: z.literal(true),
});

export const loginSchema = z.object({ email: z.string().max(200), password: z.string().max(200) });

export const onboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  disease: z.enum(DISEASES),
  diagnosedYear: z.coerce.number().int().min(1930).max(2100).nullish(),
  hasStoma: z.boolean().nullable(),
  stomaType: z.string().max(40).nullish(),
  trackedSymptoms: z.array(z.enum(SYMPTOM_KEYS)).min(1).max(SYMPTOM_KEYS.length).optional(),
  locale: z.enum(["en", "it", "fr", "es", "de", "ar"]).optional(),
});

export const profileUpdateSchema = onboardingSchema.partial().extend({
  birthYear: z.coerce.number().int().min(1900).max(2100).nullish(),
  country: z.string().max(60).nullish(),
});

export const symptomSchema = z.object({
  date: isoDate.optional(),
  overall: optInt(1, 5),
  bowelMovements: optInt(0, 40),
  nightBowelMovements: optInt(0, 20),
  stoolConsistency: optInt(1, 7),
  liquidStools: optInt(0, 40),
  blood: optInt(0, 3),
  urgency: optInt(0, 3),
  pain: optInt(0, 10),
  fatigue: optInt(0, 10),
  bloating: optInt(0, 10),
  nausea: optInt(0, 10),
  appetite: optInt(0, 10),
  sleepQuality: optInt(0, 10),
  stress: optInt(0, 10),
  mood: optInt(0, 10),
  stomaOutput: z.string().max(200).nullish(),
  notes: z.string().max(2000).nullish(),
});
export type SymptomInput = z.infer<typeof symptomSchema>;

export const medicationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  activeIngredient: z.string().max(120).nullish(),
  dose: z.coerce.number().positive().max(100000).nullish(),
  unit: z.string().max(20).nullish(),
  route: z.enum(ROUTES),
  form: z.enum(FORMS),
  intervalDays: z.coerce.number().int().min(1).max(365).nullish(),
  timesPerDay: z.coerce.number().int().min(1).max(12).nullish(),
  asNeeded: z.boolean().optional(),
  scheduleNote: z.string().max(200).nullish(),
  startDate: isoDate.nullish(),
  endDate: isoDate.nullish(),
  prescribingDoctor: z.string().max(120).nullish(),
  notes: z.string().max(2000).nullish(),
});
export type MedicationInput = z.infer<typeof medicationSchema>;

export const medicationEventSchema = z.object({
  status: z.enum(["TAKEN", "SKIPPED", "DELAYED", "NOT_APPLICABLE"]),
  occurredAt: z.string().datetime({ offset: true }).optional(),
  reason: z.string().max(200).nullish(),
  notes: z.string().max(1000).nullish(),
});

export const labSchema = z.object({
  testCode: z.string().min(1).max(30),
  testName: z.string().min(1).max(120),
  value: z.coerce.number().nullish(),
  valueText: z.string().max(40).nullish(),
  unit: z.string().max(20).nullish(),
  referenceRange: z.string().max(60).nullish(),
  takenAt: isoDate,
});

export const clinicalEventSchema = z.object({
  type: z.enum(["HOSPITALIZATION", "URGENT_VISIT", "EMERGENCY_ROOM", "MAJOR_SYMPTOM_EVENT", "DIAGNOSIS", "SURGERY", "STOMA_CREATED", "STOMA_REVERSED", "OTHER"]),
  startedAt: isoDate,
  endedAt: isoDate.nullish(),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).nullish(),
  facility: z.string().max(120).nullish(),
});

export const visitSchema = z.object({
  scheduledAt: z.string().min(10).max(30),
  doctorName: z.string().max(120).nullish(),
  specialty: z.string().max(80).nullish(),
  reason: z.string().max(300).nullish(),
  patientConcerns: z.string().max(2000).nullish(),
});

export const SUMMARY_SECTIONS = ["symptoms", "medications", "adherence", "labs", "procedures", "events", "documents", "trends", "wellbeing", "questions", "concerns"] as const;

export const summaryRequestSchema = z.object({
  visitId: z.string().uuid().nullish(),
  periodDays: z.coerce.number().int().min(7).max(365).default(90),
  sections: z.array(z.enum(SUMMARY_SECTIONS)).min(1).default([...SUMMARY_SECTIONS]),
  concerns: z.string().max(2000).nullish(),
});

export const fieldReviewSchema = z.object({
  action: z.enum(["confirm", "edit", "reject"]),
  editedValue: z.string().max(600).optional(),
});

export const conflictResolutionSchema = z.object({
  resolution: z.enum(["KEEP_EXISTING", "KEEP_NEW", "NEEDS_DOCTOR_CONFIRMATION"]),
});

export const consentSchema = z.object({
  type: z.enum(["AI_PROCESSING", "DOCUMENT_AI_PROCESSING", "PRODUCT_ANALYTICS", "LOCATION_ON_REQUEST"]),
  granted: z.boolean(),
});

export const emergencyCardSchema = z.object({
  showCondition: z.boolean(),
  showMedications: z.boolean(),
  showAllergies: z.boolean(),
  showSurgeries: z.boolean(),
  showStoma: z.boolean(),
  showContact: z.boolean(),
  allergies: z.string().max(300).nullish(),
  surgeriesNote: z.string().max(500).nullish(),
  contactName: z.string().max(120).nullish(),
  contactPhone: z.string().max(40).nullish(),
  extraNote: z.string().max(300).nullish(),
});

export const STOMA_FEATURES = ["accessible", "private", "large_space", "sink", "disposal_bin", "changing_area", "open_24_7", "radar_key"] as const;

export const nearbySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  category: z.enum(["BATHROOM", "PHARMACY", "HOSPITAL", "IBD_CENTER", "AIRPORT", "STATION", "HOTEL", "IBD_FRIENDLY_PLACE"]).optional(),
  features: z.array(z.enum(STOMA_FEATURES)).optional(),
  verifiedOnly: z.boolean().optional(),
  openNow: z.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const reviewSchema = z.object({
  reliability: int(1, 5),
  cleanliness: optInt(1, 5),
  comment: z.string().max(500).nullish(),
  features: z.array(z.enum(STOMA_FEATURES)).default([]),
});

export const reportSchema = z.object({
  issue: z.enum(["closed_permanently", "wrong_hours", "not_accessible", "wrong_location", "feature_missing", "other"]),
  details: z.string().max(500).nullish(),
});
