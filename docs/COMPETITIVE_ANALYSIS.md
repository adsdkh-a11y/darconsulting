# VIVIA — Competitive analysis

_Last researched: 30 September 2026. Sources: public App Store / Google Play listings, vendor websites and
publications (links at the end). Nothing here was tested hands-on; features change often — re-verify
before external use._

## Legend

| Mark | Meaning |
|---|---|
| **D** | **Documented** — stated in the vendor's own listing / site / publication |
| **?** | **Unknown** — not mentioned in sources we could access; may or may not exist |
| **F** | **Future** — publicly announced as coming, not yet shipped |
| **NF** | **Not found** — we looked specifically and found no mention |
| ✅ | VIVIA MVP (this repository) · 🟡 VIVIA foundation / partial · 🔜 VIVIA roadmap |

> **Identity caveats.** "**IBD Care**": we could not unambiguously identify a single app with that exact
> name (search results return *My IBD Care*, *IBD Navigator*, etc.) — all cells are **?** until the
> product is confirmed. "**CED Buddy**": no app with that exact name was found; the closest German
> product with a toilet finder is Takeda's *CED Forum* app — cells are **?**. "**We IBD**": results point to
> Takeda's *For You With You: IBD* ("We IBD" branding) — cells below refer to that app and should be
> re-confirmed.

## Feature matrix

| Capability | Aidy | Flarity | My IBD Care | Tami | coreway | IBD Care | We IBD* | CED Buddy | FlareCare | **VIVIA** |
|---|---|---|---|---|---|---|---|---|---|---|
| Symptom tracking | D | D | D | D | D | ? | D | ? | D | ✅ |
| Stool tracking (Bristol) | D | D (BMs) | D | D | D | ? | ? | ? | D | ✅ |
| Medication tracking / reminders | D | D | D | D | D | ? | D | ? | D | ✅ (reminders 🔜 push) |
| Generic routes (rectal, topical…) | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ 6 routes × 10 forms |
| Biologic dose schedules | ? | D | ? | ? | ? | ? | ? | ? | ? | ✅ interval-based |
| Food tracking | D (AI photo/text) | NF | ? | D (lifestyle) | D (nutrition) | ? | recipes | ? | D (AI scanner) | 🟡 optional, via Tell VIVIA |
| AI assistant / chat | D | NF (on-device insights) | D (ElenaAI) | NF | ? | ? | ? | ? | D (meal coach) | 🟡 task-specific AI, no free chat |
| Document upload | ? | D (labs photo/PDF) | ? | ? | ? | ? | ? | ? | ? | ✅ PDF/JPEG/PNG, any report type |
| OCR / structured extraction | NF | D (on-device, 18+ lab values) | ? | ? | ? | ? | ? | ? | ? | ✅ labs, procedures, meds, findings + patient verification |
| Lab tracking (CRP, calprotectin) | ? | D | D (calprotectin testing) | ? | ? | ? | blood test reminders | ? | ? | ✅ |
| Timeline | D | ? | D (health record) | ? | ? | ? | ? | ? | ? | ✅ unified, with provenance |
| Personal baseline | ? | D (pattern detection) | ? | ? | D (patterns) | ? | ? | ? | D (patterns) | ✅ 7/30/90-day personal baselines |
| Clinical scores (HBI / SCCAI / IBD Disk) | D (mod. HBI, SCCAI) | D (HBI, SCCAI) | ? | ? | ? | ? | D (IBD Disk) | ? | ? | ✅ HBI (patient items), SCCAI; registry for more |
| Doctor summary / report | D | D (1-tap GI report) | ? | D (PDF, questions) | ? | ? | ? | ? | D (PDF) | ✅ Care Summary + patient questions |
| Doctor portal | ? (clinician offering unclear) | D (separate clinician product) | D (clinical messaging, hospital link) | NF | ? | ? | ? | ? | NF | 🔜 (architecture ready) |
| Secure sharing (link) | ? | NF (share from report) | ? | NF | ? | ? | ? | ? | email/share of PDF | ✅ expiring, revocable, audited link |
| Bathroom finder | NF | NF | NF | NF | NF | ? | D | ? (CED Forum: D) | NF | ✅ one-tap, no account |
| Stoma-specific features | ? | NF | ? | NF | NF | ? | ? | ? | NF | ✅ Stoma Mode + stoma map filters |
| Pharmacy / hospital map | NF | NF | NF | NF | NF | ? | NF | ? | NF | ✅ |
| Travel support | NF | NF | NF | NF | NF | ? | NF | ? | NF | 🟡 checklist + destination essentials |
| Voice input | NF | NF | NF | NF | NF | ? | NF | ? (CED Forum: Alexa) | D | ✅ Web Speech |
| Natural-language logging | ? | NF | NF | NF | NF | ? | NF | ? | D (voice) | ✅ "Tell VIVIA" + confirm step |
| Apple Health | ? | ? | D (Apple Watch) | ? | ? | ? | ? | ? | ? | 🔜 (HealthMetric landing zone) |
| Android / Health Connect | D (Android) | D (Health Connect) | D (Android) | D (Android) | D (Android) | ? | D (Android) | ? | D (Android) | 🟡 PWA installable; Health Connect 🔜 |
| Wearables | ? | D | D (Fitbit, Oura) | ? | D (HRV) | ? | ? | ? | ? | 🔜 |
| Multilingual | ? | ? | ? (EN) | DE | DE/EN | ? | D (multi-country) | ? | ? | ✅ EN/IT full; FR/ES/DE/AR core flows |
| Privacy posture | "not medical advice" | D (on-device) | NHS-linked | ? | D (MDR) | ? | D ("confidential") | ? | D (encrypted, never sold) | ✅ consent-gated AI, export, delete, audit |
| Community | ? | NF | D (events) | NF | NF | ? | ? | ? (CED Forum: D) | NF | 🔜 (not MVP by design) |
| Medical device status | ? | ? | ? | ? | **D: Class I (CorewayInsights); IIa planned (CorewayPredict)** | ? | ? | ? | ? | Wellness / self-management (see COMPLIANCE.md) |

\* We IBD = Takeda *For You With You: IBD* (to be confirmed).

## What this tells us

1. **Tracking, medication, reports and scores are table stakes.** Aidy and Flarity already ship HBI/SCCAI and
   one-tap GI reports. VIVIA must not compete on "having" these features.
2. **Flarity is closest on documents** (on-device lab OCR). VIVIA goes further on *breadth* (colonoscopy,
   histology, imaging, prescriptions, letters), on *verification* (per-field confirm/fix/reject with the source
   snippet), on *conflict handling*, and on turning documents into a **single timeline**.
3. **Real-world support is fragmented.** Only Takeda's apps (We IBD / CED Forum) document a toilet finder, and
   we found **no competitor** documenting stoma-specific place features or pharmacy/hospital/IBD-centre
   mapping in the same app as clinical data.
4. **Natural-language logging is rare.** FlareCare documents voice logging for food/symptoms; no one else
   documents "tell it what happened" with a structured confirm step across symptoms, meds and food.
5. **Regulatory signal:** coreway is a CE Class I medical device and is pursuing IIa for relapse prediction.
   VIVIA deliberately stays on the wellness side (no prediction, no flare claims) until a regulatory strategy
   is decided — see COMPLIANCE.md.

## VIVIA's 10× workflows (principle 54)

| Competitors say | VIVIA does |
|---|---|
| "Track your symptoms" | **"Tell me what happened"** — or one tap for a good day |
| "PDF report" | **"Prepare my doctor visit"** — facts + your questions + secure link |
| "Bathroom map" | **"I need a bathroom now"** — no account, nearest *open* first |
| "Document storage" | **"Remember my medical history"** — verified extraction into one timeline |

We did **not** invent competitor weaknesses: every "NF" above means "not found in public sources", not
"does not exist".

## Sources

- Aidy — [App Store](https://apps.apple.com/us/app/aidy-manage-crohns-colitis/id6747647744), [aidyhq.com](https://www.aidyhq.com/)
- Flarity — [Google Play](https://play.google.com/store/apps/details?id=com.flaresense.flarity), [getflarity.com](https://getflarity.com/), [Flarity for Clinicians](https://getflarity.ai/)
- My IBD Care — [App Store](https://apps.apple.com/us/app/my-ibd-care-crohns-colitis/id1257828274), [Ampersand Health](https://ampersandhealth.co.uk/myibdcare/)
- Tami — [Google Play](https://play.google.com/store/apps/details?id=com.temedica.tami&hl=en), [PubMed 41767865](https://pubmed.ncbi.nlm.nih.gov/41767865/), [Temedica press](https://temedica.com/press/launch-ibd-digial-companion-temedica-abbvie)
- coreway — [Google Play](https://play.google.com/store/apps/details?id=de.coreway.coreway), [core-way.de](https://core-way.de/en/), [Gesundheitsindustrie BW](https://www.gesundheitsindustrie-bw.de/en/article/news/chronic-inflammatory-bowel-disease-using-app-sustainably-improve-everyday-life)
- We IBD / For You With You: IBD — [Google Play](https://play.google.com/store/apps/details?id=com.takeda.foryouwithyouIBD&hl=en_US), [Takeda story](https://www.takeda.com/our-impact/our-stories/ibd-impact-tracking-app/)
- CED Forum (closest match for "CED Buddy") — [gesundheit.com](https://www.gesundheit.com/news/gesundheit/1/app-fuer-ced-betroffene)
- FlareCare — [App Store](https://apps.apple.com/us/app/flarecare-gut-health-tracker/id6739485719), [flarecare.io](https://flarecare.io/)
- Crohn's & Colitis Foundation app list — [crohnscolitisfoundation.org/helpful-apps](https://www.crohnscolitisfoundation.org/helpful-apps)
