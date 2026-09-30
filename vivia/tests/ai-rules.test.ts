import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parseLogRules, extractDocumentRules, visitNarrativeRules, explainTermsRules } from "@/server/ai/rules";
import { guardText, verifyExtraction } from "@/server/ai/safety";

describe("natural-language logging (offline engine)", () => {
  it("parses the reference example from the product brief", () => {
    const r = parseLogRules("Today I went to the bathroom 5 times, first two were normal and then I had diarrhea. No blood, pain 3/10 and I'm tired.", "2026-09-30");
    expect(r.bowelMovements).toBe(5);
    expect(r.stoolVariation).toBe(true);
    expect(r.blood).toBe(0);
    expect(r.pain).toBe(3);
    expect(r.fatigue).toBeGreaterThan(0);
    expect(r.estimated).toContain("fatigue");
    expect(r.date).toBeUndefined();
  });

  it("parses Italian", () => {
    const r = parseLogRules("Ieri sono andata in bagno 7 volte, un po' di sangue, dolore 6 e molto stanca", "2026-09-30");
    expect(r.date).toBe("2026-09-29");
    expect(r.bowelMovements).toBe(7);
    expect(r.blood).toBe(1);
    expect(r.pain).toBe(6);
    expect(r.fatigue).toBe(7);
  });

  it("parses French", () => {
    const r = parseLogRules("3 selles aujourd'hui, pas de sang, douleur 2/10", "2026-09-30");
    expect(r.bowelMovements).toBe(3);
    expect(r.blood).toBe(0);
    expect(r.pain).toBe(2);
  });

  it("matches only medications the patient already has", () => {
    const r = parseLogRules("I skipped my adalimumab and took ibuprofen", "2026-09-30", ["Adalimumab", "Mesalazine"]);
    expect(r.medicationsMentioned).toEqual([{ name: "Adalimumab", status: "SKIPPED" }]);
  });

  it("does not invent values when nothing is recognisable", () => {
    const r = parseLogRules("hello there", "2026-09-30");
    expect(r.bowelMovements).toBeUndefined();
    expect(r.pain).toBeUndefined();
    expect(r.unparsed).toEqual(["hello there"]);
  });
});

describe("document extraction (offline engine)", () => {
  it("extracts labs with units, reference ranges and the document date", () => {
    const r = extractDocumentRules(readFileSync("tests/fixtures/bloodtest.txt", "utf8"));
    expect(r.classification).toBe("BLOOD_TEST");
    expect(r.documentDate).toBe("2026-09-03");
    const get = (k: string) => r.fields.find((f) => f.key === k);
    expect(get("CRP")).toMatchObject({ value: "12.4", unit: "mg/L", numericValue: 12.4 });
    expect(get("HB")).toMatchObject({ value: "11.8", unit: "g/dL" });
    expect(get("FERRITIN")?.numericValue).toBe(18);
    expect(get("PLT")?.numericValue).toBe(410);
    expect(get("CALPROTECTIN")).toMatchObject({ numericValue: 320, unit: "µg/g" });
    for (const f of r.fields) expect(r.text).toContain(f.sourceSnippet.split(" ")[0]);
  });

  it("classifies a colonoscopy and keeps findings verbatim", () => {
    const r = extractDocumentRules(readFileSync("tests/fixtures/colonoscopy.txt", "utf8"));
    expect(r.classification).toBe("COLONOSCOPY");
    expect(r.documentDate).toBe("2026-06-12");
    expect(r.fields.find((f) => f.key === "procedure_type")?.value).toBe("COLONOSCOPY");
    expect(r.fields.find((f) => f.key === "biopsy_taken")?.value).toBe("yes");
    expect(r.fields.find((f) => f.key === "findings")?.value).toContain("aphthous ulcers in the terminal ileum");
    expect(r.fields.find((f) => f.key === "conclusion")?.value).toContain("Mild ileal activity");
    expect(r.fields.find((f) => f.key === "diagnosis_mentioned")?.value).toBe("CROHNS");
    // "Repeat fecal calprotectin in 3 months" must NOT become a lab value of 3.
    expect(r.fields.find((f) => f.key === "CALPROTECTIN")).toBeUndefined();
  });

  it("extracts medications with dose and frequency without inferring route", () => {
    const r = extractDocumentRules(readFileSync("tests/fixtures/prescription.txt", "utf8"));
    expect(r.classification).toBe("PRESCRIPTION");
    const meds = r.fields.filter((f) => f.kind === "medication").map((f) => f.value);
    expect(meds).toContain("Adalimumab · 40 mg · every 14 days");
    expect(meds).toContain("Mesalazine · 1000 mg · twice daily");
  });

  it("does not infer absent values", () => {
    const r = extractDocumentRules("Specialist consultation\nThe patient reports feeling well.");
    expect(r.fields.filter((f) => f.kind === "lab")).toHaveLength(0);
  });
});

describe("AI safety guardrails", () => {
  it.each([
    "You are having a flare.",
    "This means active disease.",
    "You should stop taking your medication.",
    "Increase your dose to 80 mg.",
    "You should take prednisone.",
    "There is no need to see a doctor.",
    "This food causes your symptoms.",
  ])("removes unsafe sentence: %s", (s) => {
    const g = guardText(`Your entries show a change compared with your recent baseline. ${s}`);
    expect(g.text).toBe("Your entries show a change compared with your recent baseline.");
    expect(g.flags.length).toBeGreaterThan(0);
  });

  it("keeps neutral wording", () => {
    const g = guardText("This may be useful to discuss with your gastroenterologist. I cannot determine the cause from your data.");
    expect(g.flags).toEqual([]);
  });

  it("drops extracted fields that are not anchored in the document (hallucination guard)", () => {
    const text = "CRP 12 mg/L";
    const v = verifyExtraction(
      {
        classification: "BLOOD_TEST",
        classificationConfidence: 0.9,
        summary: "The report states CRP 12 mg/L.",
        fields: [
          { kind: "lab", key: "CRP", label: "CRP", value: "12", unit: "mg/L", sourceSnippet: "CRP 12 mg/L", confidence: 0.9 },
          { kind: "lab", key: "HB", label: "Hemoglobin", value: "13.5", unit: "g/dL", sourceSnippet: "Hb 13.5 g/dL", confidence: 0.9 },
          { kind: "lab", key: "FERRITIN", label: "Ferritin", value: "99", unit: "ng/mL", sourceSnippet: "CRP 12 mg/L", confidence: 0.9 },
        ],
      },
      text,
    );
    expect(v.result.fields.map((f) => f.key)).toEqual(["CRP"]);
    expect(v.flags).toContain("dropped_unanchored_field");
  });

  it("generates questions only from provided signals", () => {
    const n = visitNarrativeRules({
      periodLabel: "from 2026-07-01 to 2026-09-30",
      facts: ["a", "b"],
      locale: "en",
      signals: { aboveBaseline: [{ metric: "bowelMovements", label: "bowel movement frequency", since: "2026-09-27" }], missedDoses: [{ medication: "Adalimumab", count: 1 }], newLabs: [], procedures: [], events: [] },
    });
    expect(n.questions).toHaveLength(2);
    expect(n.questions.join(" ")).toMatch(/bowel movement frequency/);
    expect(n.questions.join(" ")).not.toMatch(/flare/i);
  });

  it("explains general terms and admits unknown ones", () => {
    const [crp, unknown] = explainTermsRules(["CRP", "zzzz"], "en");
    expect(crp.explanation).toMatch(/generally/);
    expect(unknown.explanation).toMatch(/care team/);
  });
});
