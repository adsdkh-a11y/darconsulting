# 04 — Brand positioning and differentiation

_Date: 2026-10-10. Inputs read: `01-business-validation.md`, `02-customer-personas.md`, `03-competitive-analysis.md` (all present). Tags: **[V]** verified · **[H]** hypothesis · **[U]** unknown. "VIVIA" is a **working name**: no trademark, domain or app-store availability check has been done; do not print it on anything permanent until it is._

> **Constraint carried from the earlier files:** no VIVIA user, clinician or payer has been interviewed. Everything below is a **proposal to test**, not a finding. Italian-language copy is a draft needing review by a native speaker and, for health content, a clinician.

---

## 1. Ten positioning strategies

Each lists segment · problem · promise · difference · evidence required · vulnerability · monetisation · regulatory/clinical notes. "Evidence" cites the earlier files.

### P1 — Better-prepared doctor visits
- **Segment:** adults on long-term therapy with regular specialist visits (Persona B); extendable to A and C.
- **Problem:** under-discussed symptoms (urgency, fatigue, pain, mood) and scattered history; consultations focus on inflammation [V, `01` §2].
- **Promise:** *"Walk into your visit knowing what you want to say."*
- **Difference:** competitors document PDF reports (Aidy, Flarity, Tami); none was verified as building the report around the patient's own questions and the under-discussed symptoms, with source labels. [P, `03`]
- **Evidence required:** patients use it before a real visit; clinicians read it (E1, E2, E7).
- **Vulnerability:** easy to copy (a report is a feature); depends on clinician acceptance.
- **Monetisation:** free for patient; clinic pilot or association funding (unproven).
- **Regulatory/clinical:** descriptive only; no scoring interpretation; wording reviewed by a clinician.

### P2 — The patient's longitudinal health memory
- **Segment:** complex-care patients (C), also B.
- **Problem:** information spread across services.
- **Promise:** *"Everything about your IBD in one place, with where each item came from."*
- **Difference:** unified timeline with provenance and verification; documents beyond labs. Flarity documents lab OCR; breadth/verification is unproven as better.
- **Evidence:** users finish document verification and say it saved effort; extraction accuracy (E10).
- **Vulnerability:** heavy effort, error risk, privacy.
- **Monetisation:** premium storage or institutional.
- **Regulatory:** AI extraction errors are the main safety risk; patient confirms each value.

### P3 — Minimal-effort daily tracking
- **Segment:** B, A.
- **Problem:** logging fatigue; app dropout pooled at 43% [V].
- **Promise:** *"Ten seconds on a good day."*
- **Difference:** one-tap good day, "Same as yesterday", speak a sentence and confirm.
- **Evidence:** ≥50% log on ≥8 of 14 days (E6).
- **Vulnerability:** crowded; trackers already compete; low defensibility; hard retention.
- **Monetisation:** weak.
- **Regulatory:** low.

### P4 — Documents become usable information
- **Segment:** C, B.
- **Problem:** PDFs and photos nobody can search.
- **Promise:** *"Turn reports into a clear list you can check."*
- **Difference:** per-field confirm/fix/reject with the source text.
- **Evidence:** accuracy test, user effort, trust.
- **Vulnerability:** AI reliability; Claude path untested; competitors improving OCR.
- **Monetisation:** moderate if it works.
- **Regulatory:** high sensitivity; clinical review of any interpretation features.

### P5 — Patient-controlled health information
- **Segment:** privacy-sensitive patients; associations.
- **Problem:** fear of misuse of health data.
- **Promise:** *"Your data stays yours: consent per purpose, export, delete."*
- **Difference:** AI off by default, expiring revocable share links, export/delete (built and tested).
- **Evidence:** users understand and value it; independent security review.
- **Vulnerability:** trust is earned slowly; no certification claim possible; competitors also claim privacy.
- **Monetisation:** supports all models; not a standalone offer.
- **Regulatory:** must not claim GDPR compliance until reviewed.

### P6 — Practical support in everyday life
- **Segment:** D (stoma), A, B.
- **Problem:** urgency (>80% in UC) and planning outings [V].
- **Promise:** *"Know where the nearest open toilet is, without creating an account."*
- **Difference:** no-account flow; stoma filters; offline card. Takeda's app is framed around toilet finding [P].
- **Evidence:** data audit (E8); users trust results.
- **Vulnerability:** map data quality is the whole promise; **demo data are fictional**.
- **Monetisation:** partners (pharmacies, associations); low.
- **Regulatory:** low; never promise availability of a toilet.

### P7 — Multilingual, accessible IBD management
- **Segment:** migrants and non-English speakers across IT/FR/ES/DE/AR.
- **Problem:** many tools are English- or German-oriented. [P, `03`]
- **Promise:** *"IBD tools in your language."*
- **Difference:** six languages exist; **only English and Italian drafted with care; the rest machine-assisted**.
- **Evidence:** native-speaker review, interviews in each language.
- **Vulnerability:** translation quality and medical accuracy; effort.
- **Monetisation:** weak alone.
- **Regulatory:** wrong medical wording is a safety risk.

### P8 — Care coordination across professionals
- **Segment:** C, clinics.
- **Problem:** repeated history to each professional.
- **Promise:** *"One summary that every professional on your team can read."*
- **Difference:** link sharing exists; **no clinician portal**.
- **Evidence:** a clinic pilot.
- **Vulnerability:** needs integration and institutional trust; large competitor presence (My IBD Care in NHS trusts) [V].
- **Monetisation:** best B2B potential; long cycle.
- **Regulatory:** institutional security review; liability for data accuracy.

### P9 — Emotional well-being as part of IBD care
- **Segment:** B, A.
- **Problem:** depression 56% and anxiety 49% reported in a large UK survey; under-addressed [V].
- **Promise:** *"Bring how you feel, not only how your bowels are."*
- **Difference:** mood and stress logged by default; a neutral "ask about support" question; **no supportive-message feature live (needs clinical review)**.
- **Evidence:** users find it acceptable, not intrusive; clinician review.
- **Vulnerability:** sensitive; risk of being read as screening or advice.
- **Monetisation:** none directly.
- **Regulatory:** **high** if framed as screening or therapy; keep as self-rating and communication aid only.

### P10 — The trusted community-backed companion (association co-branding)
- **Segment:** members of patient associations.
- **Problem:** commercial apps funded by pharma may not feel independent.
- **Promise:** *"Built with patients, independent of drug companies."* **Only if true and documented.**
- **Difference:** credibility through partnership.
- **Evidence:** a signed partnership and a governance statement; no sponsor data access.
- **Vulnerability:** slow, small budgets; you cannot claim independence while taking sponsorship.
- **Monetisation:** grants and association funding.
- **Regulatory:** conflict-of-interest and consent rules.

---

## 2. Ranking and choice

**Scoring (1–5, 5 favourable):** evidence of need · differentiation · feasibility to demonstrate soon · defensibility · regulatory ease. /25. Judgements from `01`–`03`.

| Rank | Strategy | Need | Diff. | Feasible | Defensible | Reg. ease | Total |
|---|---|---|---|---|---|---|---|
| 1 | **P1 Better-prepared visits** | 4 | 3 | 5 | 2 | 4 | **18** |
| 2 | **P6 Practical support (toilet/stoma)** | 4 | 3 | 3 | 3 | 5 | **18** |
| 3 | P5 Patient-controlled data | 3 | 2 | 4 | 3 | 4 | 16 |
| 4 | P10 Community-backed | 3 | 4 | 2 | 4 | 3 | 16 |
| 5 | P2 Health memory | 3 | 3 | 4 | 2 | 3 | 15 |
| 6 | P9 Well-being | 4 | 3 | 4 | 2 | 2 | 15 |
| 7 | P3 Minimal-effort tracking | 3 | 1 | 4 | 1 | 5 | 14 |
| 8 | P4 Documents → usable | 3 | 3 | 3 | 2 | 2 | 13 |
| 9 | P7 Multilingual | 3 | 2 | 3 | 2 | 3 | 13 |
| 10 | P8 Care coordination | 3 | 3 | 2 | 3 | 2 | 13 |

Ties are broken by "need". **P5 and P10 score well on totals but are treated as supporting ideas, not lead positions:** privacy is a condition for trust rather than a reason to choose a product, and independence (P10) cannot be claimed without a signed partner.

**Recommendation**
- **Primary position: P1 — better-prepared doctor visits.** It matches the scheduled, recurring moment (Persona B), uses the under-documented symptoms [V], is demonstrable now, and can be tested with real clinicians.
- **Supporting pillar 1: P6 — practical support in daily life** (toilet, stoma, offline card) — the strongest *differentiating* need-fit, conditional on the data audit.
- **Supporting pillar 2: P5 — patient-controlled health information** — the trust condition (consent per purpose, export, deletion, expiring sharing), stated plainly and without certification claims.
- **Kept in reserve:** P2/P4 (document memory) as the *mechanism* behind P1, not the headline, because extraction accuracy is unproven; P9 as a content element inside the visit summary, not a lead claim.
- **Rejected as lead positions:** P3 (undifferentiated), P7 (quality unreviewed), P8 (needs a clinic), P10 (needs a partner).

Avoid: "AI-powered", "all-in-one", "revolutionary", "better healthcare", "the future of medicine", "predict flares". The offline rules engine is not AI, and the Claude path is untested.

---

## 3. Brand definition (working)

### Positioning statement
> **For adults living with Crohn's disease or ulcerative colitis who want to get more out of their appointments, VIVIA is a personal IBD companion that turns what you record and your reports into a clear, source-labelled summary and the questions you want to ask, so what matters gets said, including urgency, fatigue and mood. Unlike trackers that stop at logs, VIVIA is built around the visit, and you decide what is shared. VIVIA does not diagnose and does not replace your care team.**

### Tagline (candidates; test with patients)
| Language | Option | Note |
|---|---|---|
| EN | **Say what matters at your next visit.** | Recommended |
| EN | Your IBD, ready for your visit. | Alternative |
| IT | **Dire ciò che conta alla prossima visita.** | Draft; native review needed |
| IT | La tua visita, meglio preparata. | Alternative; avoids a gendered form |

### Elevator pitch (EN, 30 seconds)
"Many people with IBD leave an appointment realising they forgot to mention fatigue, urgency or how they've felt. VIVIA lets you note what happens in seconds, keeps your reports in one place with where each item came from, and prepares a one-page summary and your own questions for your next visit. You control what is shared and you can delete everything. It's an organising tool, not a doctor. We're an early prototype and we're looking for people to try it with us."

### Short description
*EN:* "VIVIA helps people with Crohn's or ulcerative colitis organise their health information and prepare for appointments. Early prototype."
*IT (draft):* "VIVIA aiuta chi convive con la malattia di Crohn o la colite ulcerosa a organizzare le proprie informazioni di salute e a preparare le visite. Prototipo in fase iniziale."

### Brand personality
**Calm, clear, warm, honest, respectful, practical.** Not clinical, not cheerful-for-the-sake-of-it, never alarming or judgemental. Violet and the awareness ribbon are used as quiet identity; coral appears only for urgency.

### Messaging pillars
1. **Be ready for the visit** — a summary and your own questions.
2. **Your information, labelled** — each item shows where it came from, and you confirm it.
3. **Support for real days** — a toilet nearby without an account, an emergency card on your phone.
4. **You are in control** — AI off by default, export, delete, expiring links.
5. **Honest about limits** — organising tool, early prototype, no diagnosis.

### Tone of voice
Plain sentences, second person, short. Say what the product does, not how smart it is. Acknowledge effort without pity. Use "you decide" language. Avoid exclamation marks and clinical jargon. Never use fear ("don't miss a flare"), shame ("you missed three days"), or outcome promises.

### Three example messages for patients
1. *(Instagram caption)* "You have 15 minutes with your specialist. What will you say first? We're building a small tool to help you prepare your questions. Want to try the early version?" (IT draft: "Hai 15 minuti con il tuo specialista. Cosa dirai per prima cosa? Stiamo costruendo un piccolo strumento per preparare le domande. Vuoi provare la versione iniziale?")
2. *(Waitlist invite)* "VIVIA is an early prototype for people with Crohn's or ulcerative colitis. We'd like to talk to you for 30 minutes about how you prepare for appointments. No medical documents needed, no data collected in the call."
3. *(Product note)* "You can find the nearest open toilet without making an account. Your location is used once and not stored. Map coverage is still being tested in your city."

### Three example messages for clinicians
1. *(Introduction)* "I'm building a patient tool that helps people with IBD prepare a one-page summary and questions before a visit. I'd value 20 minutes of your view on what would be useful, and what would not."
2. *(Pilot discovery)* "We don't claim clinical benefit. We'd like to test whether a patient-prepared summary is useful in your visits, with a pilot you design and consent from patients."
3. *(Safety)* "Every value from a document is confirmed by the patient, labelled with its source, and not interpreted. VIVIA never changes or suggests changes to treatment."

---

## 4. Claims framework

### A. Verified product capabilities (present in the code and covered by automated tests; not yet used by real patients)

> **Update 2026-10-10 (founder decision F3):** this list describes the **VIVIA repository prototype**. The founder chose the **Base44 app** as the product. **No item below may be used publicly for the Base44 app until it has been checked against that app** (`11`). Until then treat every item as *hypothesis*.
- Quick check-in, one-tap mood, "same as yesterday"; **Tell VIVIA** (type or browser voice) with confirmation before saving.
- Timeline with **source labels** and verification state.
- Document upload with extraction proposals the patient **confirms, fixes or rejects**; conflicts shown, not silently merged. *(Tested with the built-in rules engine; the Claude-based path has not been tested with a real key.)*
- **Care Summary** with the patient's questions; PDF and expiring, revocable link.
- **No-account nearby-toilet page**; stoma filters; offline emergency card. *(Place data coverage and accuracy are unmeasured; demo places are fictional.)*
- Consent per purpose, AI off by default, data export, account deletion, access log.
- Six interface languages. *(Italian and English drafted first; the others are machine-assisted and unreviewed.)*

### B. Benefits to validate (say only as goals, "we're testing whether…")
- People feel better prepared for visits.
- Conversations include more of what matters to the patient.
- Less effort than the tools people use now.
- Document organisation saves time.
- Patients trust the source labels and confirmation step.

### C. Roadmap (always labelled "planned", never "available")
Reminders and push notifications; native iOS/Android app; Apple Health / Health Connect; clinician portal; more languages checked by native speakers; saved destinations and offline maps.

### D. Medical or regulatory claims: do **not** make without evidence and assessment
Diagnosis; detection or prediction of flares; fewer flares or hospital visits; better clinical outcomes; treatment advice; medication changes; "clinically validated"; "medical device"; "GDPR compliant"; "secure and certified"; time-saving figures; accuracy percentages; "AI doctor". Any claim about AI must say what it does (e.g. "turns your typed sentence into a draft you confirm"), not that it is "smart".

### E. Review rule
Every public claim gets one of three labels in a claims log before use: **Verified capability** (link to the feature and test), **Hypothesis stated as a goal**, or **Roadmap**. Health statements are checked against a cited source and, before launch, by a clinician.

---

## 5. Why this positioning is more defensible

The recommended position (**prepare the visit**, supported by **daily-life support** and **patient control**) is more defensible than the alternatives for four reasons:
1. **It names a specific moment and a measurable outcome** (a real visit that went better, as judged by patient and clinician), unlike "all-in-one" or "AI health hub", which anyone can claim and nobody can prove.
2. **It rests on documented needs** (under-discussed urgency, fatigue and mood) rather than on technology, and it does not require clinical claims.
3. **It can be tested cheaply and quickly** with interviews and a concierge summary before more code, and it works even if AI features are limited.
4. **Its supporting pillars are honest and checkable** (what we store, where an item came from, who can see it), so trust can be earned with facts instead of promises.

Its weakness is that a summary feature is **easy to copy**; the defence is not the feature but the **clinical partnership, the Italian-language trust, and verified real-world data**, none of which exist yet. That is why the next evidence to collect is partner commitment, not more features.

**Recommended positioning statement (final):** *For adults living with Crohn's disease or ulcerative colitis who want to get more out of their appointments, VIVIA is a personal IBD companion that turns what you record and your reports into a clear, source-labelled summary and the questions you want to ask, so what matters gets said. You decide what is shared. VIVIA organises information; it does not diagnose and does not replace your care team.*
