/**
 * Offline, deterministic AI provider.
 *
 * Used when no LLM is configured, when the patient has not consented to
 * third-party AI processing, and as the fallback when an LLM call fails or
 * declines. It is intentionally conservative: it only extracts values it can
 * anchor to an exact text span, and it never interprets.
 *
 * Languages: English, Italian, French (core vocabulary).
 */
import type {
  AIProvider,
  DocType,
  DocumentExtractionResult,
  ExtractedFieldDraft,
  Explanation,
  ParsedLog,
  VisitNarrative,
  VisitNarrativeInput,
} from "./types";
import { GLOSSARY } from "./glossary";

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, once: 1, two: 2, twice: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
  uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9, dieci: 10,
  deux: 2, trois: 3, quatre: 4, cinq: 5, sept: 7, huit: 8, neuf: 9, dix: 10,
};
const NUM = `(\\d{1,2}|${Object.keys(NUMBER_WORDS).join("|")})`;

function toNum(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) ? n : NUMBER_WORDS[s.toLowerCase()] ?? NaN;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────── Natural-language logging ───────────────────────────────

export function parseLogRules(textRaw: string, today: string, knownMedications: string[] = []): ParsedLog {
  const text = textRaw.toLowerCase().replace(/\s+/g, " ").trim();
  const out: ParsedLog = { estimated: [], unparsed: [] };

  // Day reference
  if (/\b(yesterday|ieri|hier)\b/.test(text)) {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    out.date = isoDay(d);
  }

  // Bowel movements
  const bmPatterns = [
    new RegExp(`${NUM}\\s*(?:times?|x)\\b[^.,;]{0,25}?(?:bathroom|toilet|loo)`),
    new RegExp(`(?:bathroom|toilet|loo)[^.,;]{0,20}?\\b${NUM}\\s*(?:times?|x)\\b`),
    new RegExp(`${NUM}\\s*(?:bowel movements?|bms?|stools?|poops?)`),
    new RegExp(`(?:bagno|toilette)[^.,;]{0,20}?\\b${NUM}\\s*volte`),
    new RegExp(`${NUM}\\s*(?:volte|evacuazioni|scariche)`),
    new RegExp(`${NUM}\\s*(?:fois|selles)`),
  ];
  for (const re of bmPatterns) {
    const m = text.match(re);
    if (m) {
      const n = toNum(m[1]);
      if (Number.isFinite(n)) {
        out.bowelMovements = clamp(n, 0, 40);
        break;
      }
    }
  }
  const night = text.match(new RegExp(`${NUM}\\s*(?:times?\\s*)?(?:at night|during the night|di notte|la nuit)`));
  if (night) out.nightBowelMovements = clamp(toNum(night[1]), 0, 20);

  // Stool consistency
  const diarrhea = /(diarrh?o?ea|diarrhea|diarrea|diarrhée|watery|liquid|liquide|liquid[ae])/.test(text);
  const normal = /\b(normal[ei]?|formed|solid[ei]?|normali)\b/.test(text);
  if (diarrhea && normal) out.stoolVariation = true;
  else if (diarrhea) {
    out.stoolConsistency = 7;
  } else if (/\b(constipat|stitic|constip)/.test(text)) {
    out.stoolConsistency = 1;
  } else if (normal && out.bowelMovements !== undefined) {
    out.stoolConsistency = 4;
  }

  // Blood
  if (/\b(no|without|senza|nessun|niente|pas de|sans)\s+(?:\w+\s+)?(blood|sangue|sang)\b/.test(text)) out.blood = 0;
  else if (/(a little|a bit of|some|traces? of|streaks? of|un po' di|tracce di|striature|un peu de)\s*(blood|sangue|sang)/.test(text)) out.blood = 1;
  else if (/(lots of|a lot of|much|molto)\s*(blood|sangue|sang)/.test(text)) out.blood = 3;
  else if (/\b(blood|bloody|sangue|sang)\b/.test(text)) out.blood = 2;

  // Pain
  const pain =
    text.match(/(?:pain|dolore|douleur|ache|cramps?)\D{0,12}(\d{1,2})\s*(?:\/\s*10|out of 10|su 10|sur 10)?/) ??
    text.match(/(\d{1,2})\s*(?:\/\s*10|out of 10|su 10|sur 10)\s*(?:pain|dolore|douleur)?/);
  if (/\b(no|without|senza|nessun|pas de)\s+(pain|dolore|douleur)\b/.test(text)) out.pain = 0;
  else if (pain) out.pain = clamp(Number(pain[1]), 0, 10);
  else if (/(severe|terrible|strong|forte|fortissimo|intense) (pain|dolore|douleur)|(pain|dolore|douleur) (severe|forte)/.test(text)) {
    out.pain = 8;
    out.estimated!.push("pain");
  } else if (/(mild|slight|lieve|leggero|légère) (pain|dolore|douleur)|(pain|dolore|douleur) (mild|lieve|légère)/.test(text)) {
    out.pain = 2;
    out.estimated!.push("pain");
  }

  // Urgency
  if (/\b(no|without|senza|pas d')\s*(urgency|urgenza|urgence)/.test(text)) out.urgency = 0;
  else if (/(very urgent|couldn't hold|could not hold|accident|incontinen|non riuscivo a trattenere)/.test(text)) out.urgency = 3;
  else if (/(urgen|urgenza|urgence|rush(ed)? to)/.test(text)) out.urgency = 2;

  // Fatigue (estimated from words; the user confirms)
  const fatigueNum = text.match(/(?:fatigue|tired|stanchezza|fatigué)\D{0,10}(\d{1,2})\s*\/\s*10/);
  if (fatigueNum) out.fatigue = clamp(Number(fatigueNum[1]), 0, 10);
  else if (/(exhausted|drained|esaust[oa]|sfinit[oa]|épuisé)/.test(text)) {
    out.fatigue = 8;
    out.estimated!.push("fatigue");
  } else if (/(very tired|molto stanc|très fatigué)/.test(text)) {
    out.fatigue = 7;
    out.estimated!.push("fatigue");
  } else if (/(a bit tired|a little tired|un po' stanc|un peu fatigué)/.test(text)) {
    out.fatigue = 3;
    out.estimated!.push("fatigue");
  } else if (/\b(tired|fatigue|stanc[oa]|fatigué[e]?)\b/.test(text)) {
    out.fatigue = 5;
    out.estimated!.push("fatigue");
  }

  if (/\b(nause|nausea|nausée)/.test(text)) {
    out.nausea = 5;
    out.estimated!.push("nausea");
  }
  if (/\b(bloat|gonfi[oa]|gonfiore|ballonn)/.test(text)) {
    out.bloating = 5;
    out.estimated!.push("bloating");
  }
  if (/(slept badly|poor sleep|didn't sleep|dormito male|mal dormi)/.test(text)) {
    out.sleepQuality = 3;
    out.estimated!.push("sleepQuality");
  }
  if (/(stressed|stress|stressat|anxious|ansios)/.test(text)) {
    out.stress = 6;
    out.estimated!.push("stress");
  }

  // Medications — only names the patient already has in their list.
  const meds: ParsedLog["medicationsMentioned"] = [];
  for (const name of knownMedications) {
    const n = name.toLowerCase();
    if (!n || !text.includes(n)) continue;
    const idx = text.indexOf(n);
    const window = text.slice(Math.max(0, idx - 40), idx + n.length + 20);
    const status = /(skip|missed|forgot|saltat|dimenticat|oubli)/.test(window)
      ? "SKIPPED"
      : /(late|delayed|in ritardo|en retard)/.test(window)
        ? "DELAYED"
        : "TAKEN";
    meds.push({ name, status });
  }
  if (meds.length) out.medicationsMentioned = meds;

  // Food (very light — food is optional in VIVIA)
  const ate = text.match(/(?:\bate\b|\beaten\b|\bhad\b|ho mangiato|j'ai mangé)\s+([^.;]{3,60})/);
  if (ate && !/bathroom|diarr|pain|blood/.test(ate[1])) out.foods = [ate[1].trim()];

  if (!out.estimated!.length) delete out.estimated;
  const recognised = Object.keys(out).filter((k) => !["estimated", "unparsed", "date"].includes(k));
  if (recognised.length === 0) out.unparsed!.push(textRaw.trim());
  if (!out.unparsed!.length) delete out.unparsed;
  out.notes = textRaw.trim().slice(0, 1000);
  return out;
}

// ─────────────────────────────── Document extraction ───────────────────────────────

const CLASSIFIERS: { type: DocType; words: RegExp }[] = [
  { type: "CALPROTECTIN", words: /calprotectin[ae]?/gi },
  { type: "COLONOSCOPY", words: /(colonoscop|ileocolonoscop|colonscopi|coloscopie|endoscop)/gi },
  { type: "HISTOLOGY", words: /(histolog|istolog|patholog|anatomia patologica|biopsy specimen|esame istologico|anatomopatholog)/gi },
  { type: "MRI", words: /(\bmri\b|entero-?mr|risonanza magnetica|\birm\b|magnetic resonance)/gi },
  { type: "CT", words: /(\bct\b|computed tomography|\btac\b|tomografia computerizzata|scanner|tomodensitom)/gi },
  { type: "ULTRASOUND", words: /(ultrasound|ecografia|échographie|intestinal ultrasound|\bius\b)/gi },
  { type: "PRESCRIPTION", words: /(prescription|ricetta|prescrizione|ordonnance|\brx\b)/gi },
  { type: "DISCHARGE_LETTER", words: /(discharge|lettera di dimissione|dimissione|compte rendu d'hospitalisation|lettre de sortie)/gi },
  { type: "SURGERY_REPORT", words: /(operative report|surgery report|intervento chirurgico|verbale operatorio|compte rendu opératoire|resection|resezione)/gi },
  { type: "BLOOD_TEST", words: /(blood test|esami del sangue|emocromo|complete blood count|\bcbc\b|bilan sanguin|laboratory|laboratorio|referto di laboratorio)/gi },
  { type: "SPECIALIST_REPORT", words: /(gastroenterolog|visita specialistica|consultation|specialist)/gi },
];

type LabDef = { code: string; label: string; re: RegExp; units: RegExp };
const LABS: LabDef[] = [
  { code: "CALPROTECTIN", label: "Fecal calprotectin", re: /(?:faecal |fecal |fecale |fécale )?calprotectin[ae]?(?: fecale| fécale)?/i, units: /(µg\/g|μg\/g|ug\/g|mcg\/g|mg\/kg)/i },
  { code: "CRP", label: "C-reactive protein (CRP)", re: /(?:\bcrp\b|\bpcr\b|c-reactive protein|proteina c reattiva|protéine c réactive)/i, units: /(mg\/l|mg\/dl)/i },
  { code: "HB", label: "Hemoglobin", re: /(?:\bhb\b|\bhgb\b|ha?emoglobin|emoglobina|hémoglobine)/i, units: /(g\/dl|g\/l)/i },
  { code: "FERRITIN", label: "Ferritin", re: /(?:ferritin[ae]?)/i, units: /(ng\/ml|µg\/l|ug\/l)/i },
  { code: "WBC", label: "White blood cells", re: /(?:\bwbc\b|white blood cells|leucociti|globuli bianchi|leucocytes|globules blancs)/i, units: /(x ?10\^?9\/l|10\^3\/µl|10\^3\/ul|\/mm3|\/µl|\/ul|g\/l)/i },
  { code: "PLT", label: "Platelets", re: /(?:\bplt\b|platelets|piastrine|plaquettes)/i, units: /(x ?10\^?9\/l|10\^3\/µl|10\^3\/ul|\/mm3|\/µl|\/ul|g\/l)/i },
  { code: "ALBUMIN", label: "Albumin", re: /(?:albumin[ae]?|albumine)/i, units: /(g\/dl|g\/l)/i },
  { code: "ESR", label: "Erythrocyte sedimentation rate (ESR)", re: /(?:\besr\b|\bves\b|sedimentation rate|velocità di eritrosedimentazione|vitesse de sédimentation)/i, units: /(mm\/h)/i },
  { code: "VITD", label: "Vitamin D", re: /(?:vitamin[ae]? d|25-oh)/i, units: /(ng\/ml|nmol\/l)/i },
];

const MED_NAMES =
  "adalimumab|infliximab|vedolizumab|ustekinumab|risankizumab|mirikizumab|guselkumab|golimumab|certolizumab|upadacitinib|tofacitinib|filgotinib|ozanimod|etrasimod|mesalazine|mesalamine|mesalazina|sulfasalazine|azathioprine|azatioprina|mercaptopurine|methotrexate|metotrexato|budesonide|prednisone|prednisolone|beclomethasone|beclometasone|ciprofloxacin|metronidazole|iron|ferro|folic acid|vitamin d";

const DATE_RE = /\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b|\b(\d{4})-(\d{2})-(\d{2})\b/;

export function parseDateEU(s: string): string | undefined {
  const m = s.match(DATE_RE);
  if (!m) return undefined;
  const [y, mo, d] = m[4] ? [+m[4], +m[5], +m[6]] : [+m[3], +m[2], +m[1]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return undefined;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseFrequency(line: string): string | undefined {
  const l = line.toLowerCase();
  const every = l.match(/(?:every|ogni|tous les|toutes les)\s+(\d+)\s*(days?|giorni|jours|weeks?|settimane|semaines)/);
  if (every) {
    const n = +every[1];
    return /week|settiman|semaine/.test(every[2]) ? `every ${n * 7} days` : `every ${n} days`;
  }
  if (/(once a week|weekly|settimanale|una volta a settimana|hebdomadaire)/.test(l)) return "every 7 days";
  if (/(twice a day|twice daily|bid|due volte al giorno|deux fois par jour)/.test(l)) return "twice daily";
  if (/(three times a day|tid|tre volte al giorno|trois fois par jour)/.test(l)) return "three times daily";
  if (/(once a day|once daily|daily|al giorno|\/die|par jour|qd)/.test(l)) return "daily";
  return undefined;
}

export function extractDocumentRules(textRaw: string): DocumentExtractionResult {
  const text = textRaw.replace(/\r/g, "");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Classification
  let best: { type: DocType; hits: number } = { type: "UNKNOWN", hits: 0 };
  let total = 0;
  for (const c of CLASSIFIERS) {
    const hits = (text.match(c.words) ?? []).length;
    total += hits;
    if (hits > best.hits) best = { type: c.type, hits };
  }
  const classificationConfidence = best.hits === 0 ? 0.2 : Math.min(0.95, 0.5 + best.hits / Math.max(total, 1) / 2);

  // Document date: prefer a labelled date line.
  const dateLine = lines.find((l) => /^(date|data|date de l'examen|exam date|data esame|data del prelievo|collection date)\b/i.test(l) && DATE_RE.test(l));
  const documentDate = parseDateEU(dateLine ?? text);

  const fields: ExtractedFieldDraft[] = [];
  if (documentDate) {
    fields.push({
      kind: "date",
      key: "document_date",
      label: "Document date",
      value: documentDate,
      observedAt: documentDate,
      sourceSnippet: (dateLine ?? text.match(DATE_RE)![0]).slice(0, 200),
      confidence: dateLine ? 0.9 : 0.6,
    });
  }

  // Labs: name ... value [unit] on the same line.
  for (const line of lines) {
    for (const lab of LABS) {
      const nameMatch = line.match(lab.re);
      if (!nameMatch) continue;
      const after = line.slice((nameMatch.index ?? 0) + nameMatch[0].length);
      const v = after.match(/([<>≤≥]?\s*\d+(?:[.,]\d+)?)/);
      if (!v) continue;
      // The value must sit right after the test name, and must not be a time
      // expression ("repeat calprotectin in 3 months").
      if ((v.index ?? 0) > 40) continue;
      const tail = after.slice((v.index ?? 0) + v[0].length);
      if (/^\s*(months?|mesi|weeks?|settimane|days?|giorni|mois|jours|semaines|years?|anni|ans)\b/i.test(tail)) continue;
      const rawVal = v[1].replace(/\s/g, "");
      const numeric = Number(rawVal.replace(/[<>≤≥]/g, "").replace(",", "."));
      const unitM = after.match(lab.units);
      const refM = after.match(/(?:\(|ref\.?|range|v\.n\.|valori di riferimento|vn)\s*:?\s*([<>≤≥]?\s*\d+(?:[.,]\d+)?\s*[-–]\s*\d+(?:[.,]\d+)?|[<>≤≥]\s*\d+(?:[.,]\d+)?)/i);
      if (fields.some((f) => f.key === lab.code)) continue; // first occurrence wins
      fields.push({
        kind: "lab",
        key: lab.code,
        label: lab.label,
        value: rawVal.replace(",", "."),
        unit: unitM?.[1],
        numericValue: Number.isFinite(numeric) ? numeric : undefined,
        observedAt: documentDate,
        sourceSnippet: line.slice(0, 200),
        confidence: unitM ? 0.9 : 0.65,
        ...(refM ? { label: `${lab.label} (ref. ${refM[1].replace(/\s/g, "")})` } : {}),
      });
    }
  }

  // Procedure
  const procType: Record<string, string> = {
    COLONOSCOPY: "COLONOSCOPY",
    MRI: "MRI",
    CT: "CT",
    ULTRASOUND: "ULTRASOUND",
    SURGERY_REPORT: "SURGERY",
  };
  if (procType[best.type]) {
    fields.push({
      kind: "procedure",
      key: "procedure_type",
      label: "Procedure",
      value: procType[best.type],
      observedAt: documentDate,
      sourceSnippet: (text.match(CLASSIFIERS.find((c) => c.type === best.type)!.words) ?? [""])[0],
      confidence: classificationConfidence,
    });
    const biopsy = lines.find((l) => /(biops|prelievi bioptici|biopsie)/i.test(l));
    if (biopsy) {
      const negated = /(no biops|non (sono state eseguite|eseguite) biopsie|pas de biopsie|biopsies not taken)/i.test(biopsy);
      fields.push({
        kind: "procedure",
        key: "biopsy_taken",
        label: "Biopsy taken",
        value: negated ? "no" : "yes",
        sourceSnippet: biopsy.slice(0, 200),
        confidence: 0.75,
      });
    }
  }

  // Labelled sections: findings / conclusion / recommendations
  const section = (re: RegExp) => {
    const i = lines.findIndex((l) => re.test(l));
    if (i < 0) return undefined;
    const inline = lines[i].replace(re, "").replace(/^[:\s-]+/, "").trim();
    const collected = inline ? [inline] : [];
    for (let j = i + 1; j < lines.length && collected.length < 4; j++) {
      if (/^[A-ZÀ-Ý][A-Za-zÀ-ÿ\s']{2,30}:\s*$/.test(lines[j])) break; // next heading
      if (/^(recommend|raccomandaz|indicazion|plan|conclusion|conclusioni|findings|reperti|diagnos)/i.test(lines[j])) break;
      collected.push(lines[j]);
    }
    return collected.join(" ").slice(0, 600) || undefined;
  };
  const findings = section(/^(findings|reperti|descrizione|description|résultats)\b\s*:?/i);
  if (findings) fields.push({ kind: "finding", key: "findings", label: "Findings (as written)", value: findings, sourceSnippet: findings, confidence: 0.8 });
  const conclusion = section(/^(conclusions?|conclusioni|impression|diagnosis|diagnosi|conclusion)\b\s*:?/i);
  if (conclusion) fields.push({ kind: "finding", key: "conclusion", label: "Conclusion (as written)", value: conclusion, sourceSnippet: conclusion, confidence: 0.8 });
  const recs = section(/^(recommendations?|raccomandazioni|indicazioni|plan|recommandations?|suggerimenti)\b\s*:?/i);
  if (recs) fields.push({ kind: "recommendation", key: "recommendations", label: "Recommendations (as written)", value: recs, sourceSnippet: recs, confidence: 0.8 });

  // Diagnosis mentioned (never inferred, only if written)
  const dx = text.match(/(crohn'?s? disease|morbo di crohn|malattia di crohn|maladie de crohn|ulcerative colitis|colite ulcerosa|rectocolite hémorragique)/i);
  if (dx) {
    const line = lines.find((l) => l.toLowerCase().includes(dx[1].toLowerCase())) ?? dx[1];
    fields.push({
      kind: "diagnosis",
      key: "diagnosis_mentioned",
      label: "Diagnosis mentioned in the report",
      value: /crohn/i.test(dx[1]) ? "CROHNS" : "ULCERATIVE_COLITIS",
      sourceSnippet: line.slice(0, 200),
      confidence: 0.85,
    });
  }

  // Medications (prescriptions, discharge letters, specialist reports)
  const medRe = new RegExp(`\\b(${MED_NAMES})\\b\\s*(\\d+(?:[.,]\\d+)?)?\\s*(mg|g|ml|mcg|µg|ui|iu)?`, "i");
  const seen = new Set<string>();
  for (const line of lines) {
    const m = line.match(medRe);
    if (!m) continue;
    const name = m[1].toLowerCase();
    if (seen.has(name)) continue;
    seen.add(name);
    const freq = parseFrequency(line);
    const value = [m[1], m[2] && `${m[2].replace(",", ".")} ${m[3] ?? ""}`.trim(), freq].filter(Boolean).join(" · ");
    fields.push({
      kind: "medication",
      key: `medication:${name}`,
      label: "Medication mentioned",
      value,
      unit: m[3],
      numericValue: m[2] ? Number(m[2].replace(",", ".")) : undefined,
      sourceSnippet: line.slice(0, 200),
      confidence: m[2] ? 0.8 : 0.6,
    });
  }

  const summary = buildStrictSummary(best.type, documentDate, fields);
  return { classification: best.type, classificationConfidence, documentDate, summary, fields, text };
}

function buildStrictSummary(type: DocType, date: string | undefined, fields: ExtractedFieldDraft[]) {
  const parts: string[] = [];
  const typeLabel = type === "UNKNOWN" ? "This document" : `This document appears to be a ${type.toLowerCase().replace(/_/g, " ")}`;
  parts.push(`${typeLabel}${date ? ` dated ${date}` : ""}.`);
  const labs = fields.filter((f) => f.kind === "lab");
  if (labs.length) parts.push(`It lists ${labs.map((l) => `${l.label.replace(/ \(ref.*$/, "")} ${l.value}${l.unit ? ` ${l.unit}` : ""}`).join(", ")}.`);
  const concl = fields.find((f) => f.key === "conclusion");
  if (concl) parts.push(`The report states: "${concl.value}"`);
  return parts.join(" ");
}

// ─────────────────────────────── Visit narrative ───────────────────────────────

const Q = {
  en: {
    overview: (p: string, n: number) => `Summary of ${n} data points recorded in VIVIA ${p}. All values were entered or confirmed by the patient.`,
    baseline: (label: string, since: string) => `My ${label} has been higher than my usual pattern since ${since}. What should I keep an eye on?`,
    missed: (med: string, n: number) => `I recorded ${n} missed dose(s) of ${med}. Is there anything I should know about my schedule?`,
    lab: (label: string, value: string, date: string) => `My ${label} on ${date} was ${value}. What does this result mean in my situation?`,
    proc: (label: string, date: string) => `Could we go through the ${label} report from ${date} together?`,
    event: (label: string, date: string) => `I had an event on ${date} (${label}). Should anything change in how I monitor my symptoms?`,
    concerns: (c: string) => `I'd also like to discuss: ${c}`,
    wellbeing: (n: number) => `I rated my mood as low on ${n} days in this period. Could we talk about how I am feeling and whether there is support available?`,
    none: "Is there anything in my recent data you would like me to track more closely?",
  },
  it: {
    overview: (p: string, n: number) => `Riepilogo di ${n} dati registrati in VIVIA ${p}. Tutti i valori sono stati inseriti o confermati dal paziente.`,
    baseline: (label: string, since: string) => `Il mio valore di ${label} è più alto del mio andamento abituale dal ${since}. A cosa devo fare attenzione?`,
    missed: (med: string, n: number) => `Ho registrato ${n} dose/i saltata/e di ${med}. C'è qualcosa che dovrei sapere sul mio schema?`,
    lab: (label: string, value: string, date: string) => `Il mio ${label} del ${date} era ${value}. Cosa significa questo risultato nella mia situazione?`,
    proc: (label: string, date: string) => `Possiamo rivedere insieme il referto ${label} del ${date}?`,
    event: (label: string, date: string) => `Il ${date} ho avuto un evento (${label}). Dovrei cambiare qualcosa nel modo in cui monitoro i sintomi?`,
    concerns: (c: string) => `Vorrei anche parlare di: ${c}`,
    wellbeing: (n: number) => `Ho valutato il mio umore come basso in ${n} giorni di questo periodo. Possiamo parlare di come mi sento e di quale supporto sia disponibile?`,
    none: "C'è qualcosa nei miei dati recenti che vorrebbe che monitorassi con più attenzione?",
  },
};

export function visitNarrativeRules(input: VisitNarrativeInput): VisitNarrative {
  const t = input.locale.startsWith("it") ? Q.it : Q.en;
  const s = input.signals;
  const questions: string[] = [];
  for (const b of s.aboveBaseline) questions.push(t.baseline(b.label, b.since));
  for (const m of s.missedDoses) if (m.count > 0) questions.push(t.missed(m.medication, m.count));
  for (const l of s.newLabs.slice(0, 3)) questions.push(t.lab(l.label, l.value, l.date));
  for (const p of s.procedures.slice(0, 2)) questions.push(t.proc(p.label, p.date));
  for (const e of s.events.slice(0, 2)) questions.push(t.event(e.label, e.date));
  if (s.wellbeing) questions.push(t.wellbeing(s.wellbeing.lowMoodDays));
  if (s.patientConcerns?.trim()) questions.push(t.concerns(s.patientConcerns.trim()));
  if (!questions.length) questions.push(t.none);
  return { overview: t.overview(input.periodLabel, input.facts.length), questions: questions.slice(0, 8) };
}

// ─────────────────────────────── Provider ───────────────────────────────

export class RulesProvider implements AIProvider {
  readonly name = "vivia-rules";
  readonly model = "rules-v1";
  async parseLog(text: string, today: string, knownMedications: string[]) {
    return parseLogRules(text, today, knownMedications);
  }
  async extractDocument(input: { text?: string }) {
    if (!input.text?.trim()) {
      return {
        classification: "UNKNOWN" as const,
        classificationConfidence: 0,
        summary: "VIVIA could not read text from this file offline. You can still keep it in your documents and add values manually.",
        fields: [],
        text: "",
      };
    }
    return extractDocumentRules(input.text);
  }
  async visitNarrative(input: VisitNarrativeInput) {
    return visitNarrativeRules(input);
  }
  async explainTerms(terms: string[], locale: string): Promise<Explanation[]> {
    return explainTermsRules(terms, locale);
  }
}

export function explainTermsRules(terms: string[], locale: string): Explanation[] {
  const lang = locale.startsWith("it") ? "it" : "en";
  return terms.map((term) => {
    const entry = GLOSSARY.find((g) => g.match.test(term));
    return {
      term,
      explanation: entry
        ? entry[lang]
        : lang === "it"
          ? "Non è disponibile una spiegazione generale per questo termine. Chiedi al tuo team di cura."
          : "No general explanation is available for this term. Your care team can explain it.",
    };
  });
}
