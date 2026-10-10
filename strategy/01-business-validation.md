# 01 — Business validation

_Date: 2026-10-10. Method: repository inspection + 4 web searches. **Limit:** source pages could not be opened (network access to them was blocked); findings below come from search-result summaries only and must be re-checked against the original pages before external use. Tags: [V] verified · [E] estimate · [H] hypothesis · [R] recommendation · [U] unknown._

## 1. Verdict

**The business hypothesis is not validated, and the evidence found is weak on the two questions that matter most: who pays, and whether people keep using it.** VIVIA has a broad, well-built product and no evidence of demand. Continuing to build features adds cost and no information. The next work should be a short validation sprint (§7), not more development.

## 2. What the evidence says

### 2.1 Problem size
| Finding | Tag | Source |
|---|---|---|
| IBD prevalence is high in Europe. A 2017 systematic review reports the highest values in Europe (ulcerative colitis 505/100,000 in Norway; Crohn's 322/100,000 in Germany) and prevalence above 0.3% in many European countries. | [V] (summary) | PubMed 29050646, via search, accessed 2026-10-10 |
| Nine Central/Eastern European countries: about 234,000 prevalent CD+UC patients aged 15+, 2013. | [V] (summary) | WJG table 1728-T2 (wjgnet.com/1007-9327/full/v21/i6/1728-T2.htm), via search, accessed 2026-10-10 |
| **No single current Europe-wide patient count was found.** | [U] | — |
| Rough order of magnitude: 0.3% × about 450 million EU residents ≈ **1.3 million** people. This is my arithmetic, not a sourced figure; the EU population number was not re-sourced today. | [E] | Method above |

Implication: the condition is common enough for a niche product. Prevalence says nothing about willingness to pay or to use an app.

### 2.2 Who pays
| Finding | Tag | Source |
|---|---|---|
| In a general gastroenterology clinic survey, patients were willing to use a health app up to about 5 minutes a day but **were unwilling to pay out of pocket**. Not IBD-specific; sample size not seen. | [V] (summary) | PMC4816251, via search, accessed 2026-10-10 |
| IBD app surveys found interest in apps and willingness to share data, but **no IBD-specific willingness-to-pay data was found**. Small samples (about 130–200 patients). | [V] (summary) / [U] | JMIR Human Factors 2025;e64471; ECCO abstract P472, via search |
| Germany reimburses a digital health app (DiGA) for **IBS** (Cara Care), with a permanent price reported as **€248 per course**. **No DiGA for Crohn's or ulcerative colitis was found** in these results (the BfArM directory was not checked). | [V] (summary) / [U] | pharmaphorum (Mahana/Cara Care), mobihealthnews, IGES; via search, accessed 2026-10-10 |
| Aidy lists as "Free · In-App Purchases" on the App Store; prices not shown. Competitor pricing for the others was **not found** in this search. | [V] / [U] | apps.apple.com/app/id6747647744, via search |

Implication: **a direct consumer subscription is the weakest-supported model.** Payment is more plausibly made by a third party (pharma, a clinic, an insurer, a patient association), but that is unproven for VIVIA.

### 2.3 Competition (from `docs/COMPETITIVE_ANALYSIS.md`, researched 2026-09-30)
Tracking, medication, reports and clinical scores are already offered by several IBD apps (Aidy, Flarity, My IBD Care, Tami, coreway, FlareCare, Takeda's apps). Only Takeda's apps documented a toilet finder. coreway is a CE Class I device. [V] per that document; nothing was tested hands-on. Features copied by a competitor within months is a realistic risk. [H]

## 3. Hypotheses to test (nothing below is validated)

| ID | Hypothesis | Why it might be false | Test | Proposed pass line* |
|---|---|---|---|---|
| H1 | People with IBD who prepare for appointments want a one-page summary built from their own data. | They rely on memory or the hospital portal; the summary adds no value. | 10 interviews + show the real Care Summary PDF | ≥6 of 10 say they would use it before their next visit **and** would give real data |
| H2 | Keeping a log is easy enough with "Tell VIVIA" that people continue past 2 weeks. | Logging fatigue is the main failure of every tracker. | 10–15 volunteers use it for 14 days, fictional-data-free consent | ≥50% log on ≥8 of 14 days |
| H3 | A toilet / stoma-friendly map is a reason to install, in the cities where data exists. | OSM data is sparse and unreliable; Takeda already offers it free. | Measure coverage in 3 cities; ask 10 patients for the last time they could not find a toilet | Coverage good enough that the nearest open toilet is correct in ≥8 of 10 spot checks |
| H4 | Someone other than the patient will pay (clinic, pharma, association, insurer). | Pharma already funds its own apps; clinics buy few tools; procurement is slow. | 5 conversations with IBD nurses / gastroenterologists, 3 with associations (e.g. national Crohn's/colitis charities) | ≥2 name a budget line or a pilot they would run |
| H5 | Patients will pay a small subscription for convenience. | Surveys suggest reluctance; free competitors exist. | Landing page with a real price and a "reserve" button (no payment), 3–4 weeks | Conversion from visit to reservation high enough to beat a pre-agreed baseline |
| H6 | Stoma users are an under-served segment that adopts faster. | Small group; may already use ostomy-brand apps. | 8 interviews with people with a stoma | A clear unmet need described unprompted by ≥5 |

\* **Pass lines are proposals to set before testing, not industry benchmarks.** Agree them first so the result cannot be rationalised afterwards.

## 4. Where the current product does not match a testable customer

- **Too broad for one customer.** Logging, memory, documents, summaries, map, travel, stoma, emergency card, 6 languages. A first customer needs one promise. [R]
- **Document extraction is the most expensive and riskiest feature** (AI cost, medical-content errors) and its value is unproven. It should not drive the first test. [R]
- **No independent safety review.** Clinical wording, thresholds and the low-mood question are unreviewed. [V]
- **Cost and operations:** hosting is about USD 20–25/month (estimate from Render list prices, not re-verified); the larger costs are legal, clinical and data-protection work. [E]
- **Two codebases:** the Base44 app (not inspected) and this repository. Unresolved. [U]

## 5. Regulatory and trust constraints on any business model

- The wellness position is a **design choice, not a legal conclusion**. Any claim about prediction, diagnosis or treatment changes the picture (medical-device rules). [V] per `docs/COMPLIANCE.md`; legal review needed.
- Selling anything involving health data or paid sponsorship from pharma changes trust and legal duties. A pharma-funded model must be disclosed and must not let the sponsor see patient-level data without explicit consent. [R]
- Real patient data should not be collected before the checklist in `docs/LAUNCH_CHECKLIST.md` sections 1–4. [V]

## 6. Recommended initial customer (hypothesis)

**Recommended to test first: adults with Crohn's or ulcerative colitis on a biologic who have at least one specialist visit a year, in one country where the founder can reach clinics and patient groups.** Reason: they have a recurring, scheduled moment (the visit) where the Care Summary has an obvious job, they already hold documents and medication data, and a clinic is a reachable second buyer. [H]

**Second candidate (test in parallel, cheaply): people with a stoma.** Smaller, probably under-served, strongest fit with the bathroom/stoma features. [H]

**Not recommended as a first customer:** the general "anyone with IBD" market (no wedge), children (guardian model, regulation), clinicians as users (different product).

## 7. Validation sprint (3 weeks, almost no development)

| Week | Action | Output |
|---|---|---|
| 1 | Write interview guide; recruit 10 patients (patient associations, clinic contacts, forums with permission) and 5 clinicians; build a one-page landing page with a real price (use the Figma design; no app needed) | Interview schedule, live page |
| 2 | Run interviews; show the Care Summary PDF made from fictional data; run the landing page with a small paid test if the budget allows | Notes, quotes, conversion numbers |
| 3 | Concierge test: for 5 volunteers, prepare their visit summary by hand (with informed consent and minimal data) and ask them to use it at the visit; collect feedback from them and, if possible, their doctor | Evidence for or against H1/H4 |

Record every result in `09-feedback-analysis.md` with date, source, and sample size. Do not generalise from fewer than ~10 interviews.

## 8. What would change the recommendation

- If H1 and H4 both fail → the product is a good tool without a buyer; consider a narrower service or a partnership rather than an app business.
- If H1 passes but H4/H5 fail → keep it as a free patient tool funded by a partner; do not build a subscription.
- If H6 passes strongly → narrow to stoma first.

## 9. Sources (all via search results; pages not opened; accessed 2026-10-10)

- IBD prevalence systematic review: https://pubmed.ncbi.nlm.nih.gov/29050646/
- Central/Eastern Europe table: https://www.wjgnet.com/1007-9327/full/v21/i6/1728-T2.htm
- GI clinic app survey (willingness to pay): https://pmc.ncbi.nlm.nih.gov/articles/PMC4816251
- IBD app survey 2025 (JMIR Human Factors): https://humanfactors.jmir.org/2025/1/e64471
- ECCO abstract P472: https://ecco-ibd.eu/publications/congress-abstracts/item/p472-optimising-the-development-of-apps-for-the-management-of-inflammatory-bowel-disease-and-participation-in-clinical-trials.html
- Cara Care DiGA: https://cara.care/en/press/diga-launch · https://www.mobihealthnews.com/news/emea/berlin-based-cara-care-app-approved-german-diga · https://pharmaphorum.com/news/mahanas-dtx-ibs-gets-permanent-reimbursement-germany
- IGES on DiGA evidence: https://digital.iges.com/news-and-events/evidence_for_diga/
- Aidy App Store listing: https://apps.apple.com/app/id6747647744
- Earlier competitor sources: see `docs/COMPETITIVE_ANALYSIS.md`
