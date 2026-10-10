# 02 — Ideal customers and personas

_Date: 2026-10-10. Builds on `01-business-validation.md`. Tags: **[V]** verified in a source · **[A]** assumption · **[H]** hypothesis · **[U]** unknown._

> **What this document is.** The personas below are **composite hypotheses assembled from published research and product reasoning. They are not based on VIVIA interviews, and no real person is described.** Names are placeholders. Anything marked [H] must be tested with the interviews in §8. Sourced facts come from search summaries (pages not opened); see `01-business-validation.md` §10 for URLs.

**User ≠ payer.** For every segment, the person who uses VIVIA and the person who might fund it are listed separately. **No payer has been validated.**

---

## 1. What the evidence lets us say about patients

| Fact | Tag | Source |
|---|---|---|
| Urgency affects >80% of UC patients in international surveys; not captured by common clinical indices | [V] | UC review via search |
| In remission: fatigue 41%, pain 62%, continence difficulty up to 75%; many want help (fatigue 56%, incontinence 53%, pain 42%) | [V] | IBD-BOOST, 8,486 UK participants |
| Reported depression 56% (27% clinically relevant), anxiety 49% (20%) | [V] | IBD-BOOST analysis |
| These symptoms are often not addressed in consultations focused on inflammation | [V] | Qualitative work / narrative review |
| ~40% of Crohn's survey respondents wanted more involvement in treatment decisions | [V] | Crohn's survey via search |
| Pooled dropout from chronic-disease apps 43% (95% CI 29–57); one cohort 2% sustained use | [V] | JMIR 2020 meta-analysis |
| Share on biologics varies hugely by country and definition (Italy administrative analysis 11.7% on biologics among all identified patients; I-CARE European cohort 47.3% on anti-TNF at inclusion) | [V] | Italian analysis; I-CARE |

**Not found:** Italian patient-specific needs surveys; caregiver needs; how patients keep their documents; share with a stoma; income and digital literacy of IBD patients. **[U]**

---

## 2. Patient personas (starting hypotheses)

The three hypotheses you proposed are kept, then **adjusted**: the third is split because "complex care" and "stoma" behave differently, and a fourth segment (people with a stoma) is added because the earlier research found no competitor documenting stoma-specific features (documented in `docs/COMPETITIVE_ANALYSIS.md`, still to be re-checked).

### Persona A — "Marta": newly diagnosed, overwhelmed (hypothesis)

| Field | Hypothesis |
|---|---|
| **Who** | Adult diagnosed within the last 12 months, starting treatment, many new terms and tests. Not a stereotype: symptom severity, age, income and treatment vary widely [A]. |
| **Life context & routine** | Frequent early visits, first colonoscopy and blood tests, unsure what to track. Often relies on the specialist's instructions and online searching. [H] |
| **Most frustrating problems** | Information overload; fear of missing something; unsure what to tell the doctor; confusing reports. [H] |
| **Workarounds & competitors** | Notes app, screenshots of results, paper diary, forums, patient-association information, a free tracker. [H] |
| **Digital literacy / accessibility** | Usually comfortable with smartphones; may be anxious, tired or in pain, so short sessions and plain language matter. [A] |
| **Motivation to try VIVIA** | "Tell me what to bring to my next visit"; a calm place for reports and questions. [H] |
| **Reasons to abandon** | Too many fields; alarming or medical-sounding language; unclear privacy; feeling judged for missed logs. [H] |
| **Privacy concerns** | Who sees my diagnosis? Is it sold? Can I delete it? (general concern, not measured here) [H] |
| **Willingness to pay** | Likely low at diagnosis; may accept a one-time or small fee if recommended by a clinician. **Evidence needed:** price-reaction test among 30+ newly diagnosed. [H] |
| **Channels / communities** | Hospital IBD team leaflets and nurses, patient associations, forums, Instagram/TikTok health creators. [H] |
| **Most valuable feature** | "Prepare my doctor visit" with her own questions. [H] |
| **Activation event** | Completes first check-in and adds one report or medication within 24 hours. [H] |
| **Retention trigger** | Upcoming appointment reminder; visit summary is prepared in two taps. [H] |
| **User / payer** | User: patient. Payer: unknown (patient, clinic or association). |

### Persona B — "Luca": experienced patient on long-term therapy with recurring appointments (hypothesis)

| Field | Hypothesis |
|---|---|
| **Who** | Adult living with IBD for years, on maintenance therapy (some on biologics or other advanced therapy), seen regularly at an IBD centre; infusion or injection schedules for some. [A] |
| **Life context & routine** | Work and family; scheduled visits, blood tests and calprotectin; routine reminders for doses. [H] |
| **Most frustrating problems** | Remembering what happened between visits; keeping dates of doses and tests; short visits where fatigue, pain and urgency may not be discussed (documented in surveys, [V]); repeating history to each professional. |
| **Workarounds & competitors** | Hospital portal, a notes app, calendar reminders, photos of reports, an existing IBD app (Aidy, My IBD Care, others). [H] |
| **Digital literacy / accessibility** | Comfortable with apps; wants speed. May use screen-reader or large text depending on person. [A] |
| **Motivation to try VIVIA** | One timeline for tests and treatments; a visit summary he can bring or send; fewer taps than his current tool. [H] |
| **Reasons to abandon** | Logging fatigue; duplicate effort vs the hospital app; subscription feels unjustified; poor export. [H] |
| **Privacy concerns** | Wants control over sharing; dislikes data used by pharma or employers. [H] |
| **Willingness to pay** | Possible for a clear, repeated benefit; unproven. **Evidence needed:** paid pre-order test (E5) and interview "last time you paid for a health app". |
| **Channels / communities** | IBD centre nurses and clinics, patient associations, Reddit-style forums, Facebook groups, Instagram. [H] |
| **Most valuable feature** | Care Summary and unified timeline. [H] |
| **Activation event** | First summary generated from real or demo-free data within the first week. [H] |
| **Retention trigger** | Pre-appointment reminder; new document or lab result to add. |
| **User / payer** | User: patient. Payer: patient, or a clinic/association if validated. |

### Persona C — "Giulia": complex care, many documents and professionals (hypothesis)

| Field | Hypothesis |
|---|---|
| **Who** | Adult with long history: surgeries, hospitalisations, multiple specialists (gastroenterology, surgery, nutrition, mental health), many reports. Severity varies; not every patient is in this group. [A] |
| **Life context & routine** | Frequent appointments, repeated explanations, documents in several places. [H] |
| **Most frustrating problems** | Information scattered across services; inconsistent medication lists; hard to give a new professional a short history. [H] |
| **Workarounds & competitors** | Folder of PDFs, photos, personal binder, hospital portal, notes. [H] |
| **Digital literacy / accessibility** | Varies; may need help to upload and verify documents; carers may help. [A] |
| **Motivation to try VIVIA** | "One verified record I can show anywhere." [H] |
| **Reasons to abandon** | Extraction mistakes; effort to verify each field; privacy of sensitive documents. [H] |
| **Privacy concerns** | **High**: documents contain identifiers and sensitive history. [H] |
| **Willingness to pay** | Highest need, uncertain willingness. **Evidence needed:** concierge test with a paid component (E7 + E5). |
| **Channels** | IBD centre nurses, social workers, associations, carers' groups. [H] |
| **Most valuable feature** | Document memory with source and verification; conflict resolution. [H] |
| **Activation event** | First document verified and added to the timeline. [H] |
| **Retention trigger** | New report to add; appointment with a new professional. |
| **User / payer** | User: patient (± carer). Payer: patient, hospital, or association — unknown. |

### Persona D — "Sara": a person with a stoma (recommended addition, hypothesis)

| Field | Hypothesis |
|---|---|
| **Who** | Adult with ileostomy or colostomy (permanent or temporary) due to IBD. Share of IBD patients with a stoma not found. **[U]** |
| **Life context & routine** | Planning outings around changing, supplies, odour and leaks; travel logistics. [H] |
| **Most frustrating problems** | Finding suitable toilets (space, bin, sink, privacy); carrying supplies; travel; fear of leaks. [H] |
| **Workarounds & competitors** | Stoma nurse advice, brand apps and groups, personal maps, "can't wait" cards. Earlier research found **no documented stoma-specific features** in the IBD apps checked (`docs/COMPETITIVE_ANALYSIS.md`, not hands-on) — "not found" does not mean absent. |
| **Digital literacy / accessibility** | Typical smartphone users; dexterity or fatigue may vary. [A] |
| **Motivation to try VIVIA** | Stoma-friendly toilet filters, offline emergency card, travel checklist. [H] |
| **Reasons to abandon** | Sparse or wrong map data (this is the single biggest risk: demo places are fictional, real coverage unmeasured); not enough value outside the map. |
| **Privacy concerns** | Location (VIVIA does not store it; users must be able to verify); visible stoma status in profile. [H] |
| **Willingness to pay** | Unknown; plausibly higher for a reliable map. **Evidence needed:** E8 data audit plus price test. |
| **Channels** | Stoma nurses, ostomy associations and groups; online communities. [H] |
| **Most valuable feature** | One-tap toilet finder with stoma filters. [H] |
| **Activation event** | First successful "nearest open toilet" result and saving the emergency card. |
| **Retention trigger** | Trip planning; sharing a good place; new supplies checklist. |
| **User / payer** | User: patient. Payer: unknown (association or stoma-product company are possible but raise independence issues). |

**Recommendation on segments:** keep A, B and C as hypothesised, **split C from D**, and expect that the best beachhead may be B or D (§6). Patients with moderate disease and low contact with services (an unreached group) cannot be assessed here. **[U]**

---

## 3. B2B personas

All content is a hypothesis; **no clinician or institution has been interviewed.** Procurement details for Italy were not researched. **[U]**

### B1 — Gastroenterologist (IBD specialist, hospital or private)
| Field | Hypothesis |
|---|---|
| **Workflow problems** | Short visits; patient history scattered; hard to see non-inflammatory symptoms that surveys say are under-discussed [V]. |
| **Adoption barriers** | Time; liability for patient-entered data; not integrated with the hospital record; patients arriving with unstructured data; trust in AI. |
| **Purchasing authority** | Rarely buys alone; a **champion** who can start a pilot and refer to management. |
| **Procurement requirements** | Data-protection assurance, security information, documentation of limits, no extra workload. |
| **Measurable value** | Visit-preparation quality (a clinician rating), fewer missing documents, patient-reported usefulness. Time savings **must be measured, not claimed.** |

### B2 — IBD nurse / care coordinator
| Field | Hypothesis |
|---|---|
| **Workflow problems** | Phone and email queries; scheduling; collecting documents; patient education. [H] |
| **Adoption barriers** | Workload; policies on recommending apps; need for a simple handout. |
| **Purchasing authority** | Influencer, sometimes budget holder for patient materials; decisions go up the hierarchy. |
| **Procurement requirements** | Same as above, plus patient-facing materials and training. |
| **Measurable value** | Number of patients using the summary; nurse-reported fewer missing documents; patient questions prepared. |

### B3 — Clinic or hospital IBD department (the likely payer)
| Field | Hypothesis |
|---|---|
| **Workflow problems** | Capacity; patient follow-up; quality reporting; digital offering for patients. |
| **Adoption barriers** | Procurement cycles, IT/security review, data-protection impact assessment by the institution, integration, medical-device status questions. |
| **Purchasing authority** | Department head + management/IT/legal/data-protection officer; public hospitals follow formal procurement. **Italy-specific rules not researched — verify.** |
| **Procurement requirements** | DPA and security evidence, hosting location, support, references, price. |
| **Measurable value** | Patient adoption in the pilot, clinician satisfaction, process measures defined with the clinic. **Evidence from competitors is thin:** one small study (54 patients) reported 47% fewer routine outpatient appointments for My IBD Care; do not cite as a VIVIA result. [V] low strength |

### B4 — Institutional partners (patient associations, scientific societies, regional bodies, pharma programmes)
| Field | Hypothesis |
|---|---|
| **Workflow problems** | Reaching and supporting members; evidence for their advocacy; education. |
| **Adoption barriers** | Independence from commercial interests; resources; trust in a new product; data protection. |
| **Purchasing authority** | Boards or committees; budgets small. Pharma programmes: marketing/medical/compliance approvals; strict rules on patient data. **Not researched.** |
| **Procurement requirements** | Transparency about funding, research ethics, patient control, no resale of data. |
| **Measurable value** | Member sign-ups, completion of research interviews, co-created content reach; no commercial data access. |
| **Related precedents** | Crohn's & Colitis UK partnered with Ampersand on an app [V]. Italian IBD association initiatives found: AppMICI (2013, status unknown), AMICI We Care 2.0 (2022); neither confirmed as active today. [U] |

---

## 4. Scoring the segments

**Scale:** 1–5, **5 is always favourable to VIVIA.** For *existing alternatives* a 5 means few good alternatives; for *complexity* a 5 means low implementation and regulatory complexity.

| Segment | Severity | Frequency | Alternatives | Reach | Adoption | WTP | Retention | Complexity | **Total /40** | Weighted* |
|---|---|---|---|---|---|---|---|---|---|---|
| A. Newly diagnosed | 4 | 3 | 3 | 2 | 3 | 2 | 2 | 3 | **22** | 27 |
| B. Experienced, recurring appointments | 3 | 4 | 2 | 3 | 3 | 2 | 3 | 4 | **24** | 30 |
| C. Complex care / many documents | 5 | 4 | 3 | 2 | 3 | 3 | 4 | 2 | **26** | 31 |
| D. People with a stoma | 4 | 4 | 4 | 2 | 3 | 3 | 3 | 3 | **26** | 31 |
| E. Gastroenterologists (champions) | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | **22** | 27 |
| F. IBD nurses / coordinators | 3 | 4 | 3 | 3 | 3 | 1 | 3 | 3 | **23** | 29 |
| G. Clinics / hospital departments | 3 | 3 | 3 | 2 | 2 | 3 | 4 | 2 | **22** | 26 |
| H. Patient associations | 3 | 3 | 3 | 4 | 3 | 1 | 3 | 4 | **24** | 31 |
| I. Pharma patient programmes | 2 | 2 | 3 | 3 | 2 | 4 | 3 | 1 | **20** | 25 |

\* Weighted: reach and adoption count double (early-stage learning and distribution), others ×1; max 50.

**Scoring assumptions (all [A] or [H], not measured):**
- *Severity/Frequency:* A is intense but short-lived; C and D have the most daily friction; B has regular but predictable friction. Urgency prevalence is documented [V]; the rest is reasoning.
- *Alternatives:* B is crowded with trackers; D and C look less crowded in earlier research, which only established "not found".
- *Reach:* patients are reachable through nurses, associations and online groups; a single country (Italy) assumed. Stoma and complex groups are smaller and need specialist referrals.
- *Adoption:* lowered where the app competes with existing hospital tools or where data entry is heavy.
- *WTP:* no payer validated; highest for institutional or programme buyers who have budgets but long processes.
- *Retention:* higher where there is a recurring event (visits, new documents), lower for newly diagnosed whose needs change.
- *Complexity:* document extraction, pharma funding and institutional integration raise regulatory and privacy complexity; the wellness position limits it.

**Reading the scores:** need favours **C and D**; reachability and measurability favour **B and H**; no segment scores high on willingness to pay. **The scores are close and based on assumptions; treat them as a prioritisation aid for interviews, not as a finding.**

---

## 5. User journey (hypothetical, to test)

Reference persona: **Luca (B)**. Frustration points are hypotheses; the product behaviour listed is what exists today (`docs/PRODUCT.md`).

| Stage | What happens | Frustration risk | Value without heavy data entry |
|---|---|---|---|
| **Discovery** | Recommended by IBD nurse, association post, search | Doubts about trust and who is behind it; app-store crowding | Clear "who we are, what is experimental, no data sold" page |
| **Registration** | Email, password, explicit consent to process health data | Consent screens; fear of sharing | Separate consent for AI (off by default); demo mode without real data [to build] |
| **Onboarding** | Name, condition, stoma yes/no, items to track (mood/stress included), language | Too many questions when tired | Track only a few items; skip the rest |
| **First value** | One-tap mood, or a spoken sentence via Tell VIVIA; or the nearest toilet (no account) | Parsing errors; unsure what was saved | Confirm-before-save; "Same as yesterday" |
| **Daily use** | 10–30 seconds; optional medication log | Reminder fatigue; weekends and bad days | No streaks; neutral wording; reminders optional [reminders not built yet] |
| **First appointment** | "Prepare my doctor visit" → Care Summary with own questions → PDF or expiring link | Does the clinician read it? Is the summary accurate? | Summary built from what exists; editable questions |
| **Continued use** | New documents, labs, changes vs own pattern | Document verification effort | Verify only changed values; reuse prior data |
| **Possible cancellation** | Delete account, export data | Lock-in fears; paywall surprise | Export and deletion exist today; pricing not defined |

**Principle:** value must arrive in the first session without long data entry. Items to protect: confirm-before-save, no guilt about missed days, offline emergency card, no-account toilet finder.

---

## 6. Initial target (recommendation, reversible)

**Primary (beachhead): Persona B — experienced adults with IBD on long-term therapy who have regular specialist visits, in Italy.**
Why: (1) the **visit** is a scheduled, recurring event where the Care Summary has an obvious job (tests H1 directly); (2) they can be reached through IBD-centre nurses and associations, which also tests the B2B route; (3) enough people to recruit 10–15 for interviews and a diary pilot; (4) lower regulatory and privacy complexity than complex-care document extraction.

**Secondary (tested in parallel): Persona D — people with a stoma (with Persona C complex-care features as the extension).**
Why: strongest need-fit with the toilet and stoma-filter features, and no documented stoma-specific competitor in earlier research; but the group is small, the size is unknown **[U]**, and the map data are the weak point (**fictional demo places today**). Treat as high-potential, high-uncertainty.

**Not prioritised now:** A (needs differ and fade; hard to reach respectfully at diagnosis), the general "anyone with IBD" market, children and carers.

**Honest note:** by raw scores C and D rank above B (26 vs 24). B is chosen first for **reachability and for how quickly it tests the core hypotheses**. If interviews show stronger pull among stoma or complex-care patients, **switch the primary**. Record the result in `09-feedback-analysis.md` and update `00`.

---

## 7. Ethical safeguards for research with patients
- Voluntary participation, plain-language consent, option to withdraw, no incentives that pressure sharing of health information.
- Ask about **experiences and habits**, not diagnoses; never ask for documents in an interview.
- Use fictional data in prototypes; no real patient data until the launch checklist is complete.
- Store notes without identifiers; keep consent records separate; do not upload interview recordings to third-party AI services without an approved privacy basis.

---

## 8. Questions to finalise before building more

### Ten questions for real patients (priority order)
1. Tell me about the last time you went to an IBD appointment. What did you bring, and what did you forget to say?
2. How do you keep track of reports, test results and medication today? (Show me, without sharing anything private.)
3. Which of these were hardest in the last month: urgency, fatigue, pain, mood, finding a toilet, remembering doses? Which would you most like help with?
4. Have you tried an IBD or symptom app? Why did you stop, or what keeps you using it?
5. How much effort per day for logging feels acceptable? What makes you give up?
6. Would you upload a medical report to a new app? What would you need to see first (who runs it, where data is stored, how to delete)?
7. If a summary of your recent data and your questions were ready before a visit, would you use it? Would you show it to your doctor?
8. Who would you want to be able to see your information, and what would you never want shared?
9. Have you ever paid for a health app or service? What made it worth it? What would be fair for something like VIVIA, and who should pay (you, your hospital, an association)?
10. What would make you stop trusting an app like this? (e.g. AI mistakes, advertising, wrong toilet information.)

### Five questions for gastroenterologists
1. In a typical IBD visit, what patient information is missing, and how do you collect it today?
2. Would you read a one-page patient-prepared summary? What must be on it, and what should never be on it?
3. What would make you trust, or refuse, patient-entered data and AI-organised documents (accuracy, liability, source labelling)?
4. How would a tool like this need to connect to your hospital systems and meet your security and data-protection requirements, and who decides?
5. What evidence would you need to recommend it, and which measure would show it helps (not time saved unless we measure it)?
