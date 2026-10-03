# VIVIA — Compliance & regulatory architecture

> **Status:** engineering design notes, **not legal advice**. VIVIA makes **no claim of regulatory compliance**
> until reviewed by qualified privacy counsel, a DPO and a medical-device regulatory specialist.

## 1. GDPR

| Topic | Design |
|---|---|
| Special-category data (art. 9) | Health data is processed on the basis of **explicit consent** (art. 9(2)(a)), captured at sign-up with a separate, unticked checkbox and stored as a versioned `Consent` record. Registration is refused without it. |
| Lawfulness & transparency (art. 5, 12–14) | Plain-language consent texts per purpose (Privacy screen); privacy notice to be drafted with counsel. |
| Purpose-specific consent | Separate, independently revocable consents: health-data processing, AI help (logging/summaries), AI document reading, product analytics. AI and analytics are **off by default**. History is append-only. |
| Data minimisation (art. 5(1)(c)) | Onboarding asks only name/nickname, condition, stoma, symptoms to track. No birth date required. AI receives minimised context (see AI_ARCHITECTURE.md). Location never stored. |
| Access & portability (art. 15, 20) | *Download all my data* → complete JSON export (`vivia-export-v1`); original documents downloadable individually. |
| Erasure (art. 17) | *Delete my account* → files deleted from storage, all rows cascade-deleted, sessions revoked, a non-identifying `DeletionRecord` kept. Tested. |
| Rectification (art. 16) | Every value is editable; document extractions are reviewed field by field; conflicts are resolved by the patient. |
| Withdrawal of consent (art. 7(3)) | Toggle in Privacy; takes effect immediately for new processing (provider selection checks the latest consent on every call). |
| Security (art. 32) | See SECURITY.md. |
| Records & accountability (art. 30) | `AuditLog`, `AiRun`, `Consent` history; a RoPA document to be produced. |
| DPIA (art. 35) | **Required** before launch (large-scale special-category data + innovative technology). |
| Retention | Account data kept until the user deletes it; proposed policy: inactive accounts notified after 24 months and deleted after 36; audit logs 24 months; `DeletionRecord` 6 years. To be confirmed by counsel. |
| Children | 16+ at launch (national age of digital consent varies 13–16); paediatric IBD requires a guardian model — ROADMAP. |

### Third-party processors (to be covered by DPAs / SCCs)

| Processor | Purpose | Data | Notes |
|---|---|---|---|
| Hosting / DB / object storage | Run the service | all | EU region required |
| Anthropic (Claude API) | AI logging, extraction, summaries — **only with consent** | minimised text / single document | Verify data-processing terms, retention and zero-retention options, transfer mechanism (SCCs / DPF) |
| OpenStreetMap tile servers | Map tiles | IP address, viewed area | Consider self-hosted or EU tile provider (tile usage policy) |
| OSM Overpass (optional) | Import public places | coordinates of a search area | disabled by default |
| Browser speech recognition | Voice logging | audio handled by the browser/OS vendor | disclose in privacy notice; offer typing |

## 2. Location data

Location is requested only when the user taps a location action; one-shot, never background; not logged,
not stored, no history. The public bathroom endpoint does not require an account.

## 3. AI Act (EU 2024/1689)

VIVIA's AI features are assistive (transcription/extraction for patient verification, drafting questions).
Transparency: users are told when AI was used (provider shown on Tell VIVIA; AI activity log). If any feature
became part of a regulated medical device, the AI Act high-risk requirements would apply through the MDR
route — see §4.

## 4. Medical-device boundary (MDR 2017/745, MDCG 2019-11)

VIVIA is architected so that **wellness / self-management** functionality is clearly separated from
anything that could qualify as **medical-device software**.

| Wellness / self-management (MVP scope) | Potentially medical-device functionality (NOT in MVP) |
|---|---|
| Recording symptoms, medication intake, documents, appointments | Flare / relapse prediction or detection |
| Transcribing and organising what documents *say*, with patient verification | Interpreting results for the individual patient |
| Neutral descriptive statistics vs the person's own past entries | Diagnosis, severity grading, triage, treatment or dose recommendations |
| Validated questionnaires shown as monitoring tools the patient shares | Automated alerts that direct clinical action |
| Generating questions for the patient to ask | Clinical decision support for doctors |
| Finding bathrooms / pharmacies / hospitals | — |

Engineering guardrails that keep this boundary:

- Safety system prompt + output guard (no flare claims, no treatment advice) — tested.
- Baseline messages are fixed, neutral templates; no thresholds are presented as clinical.
- Coreway (competitor) is a CE Class I device and is pursuing IIa for relapse prediction: this is the kind
  of functionality VIVIA must **not** ship without its own conformity assessment.
- Any future diagnostic, predictive or clinical-decision feature must: live behind a separate feature flag and
  module, go through intended-use definition, qualification & classification (MDCG 2019-11), ISO 13485 QMS,
  IEC 62304 software lifecycle, ISO 14971 risk management, clinical evaluation, and notified-body review
  where applicable — **before release**.

## 5. Other items to review

- Validated questionnaire licensing and official translations (HBI, SCCAI, IBD Disk).
- Clinical review of the "Help me understand" glossary.
- Accessibility: WCAG 2.2 AA audit; European Accessibility Act applicability.
- Consumer law: terms of use, no advertising, no sale of health data (already a product rule).
- Doctor sharing: professional secrecy rules per country; doctor portal will need its own terms and possibly
  national e-health integration rules (out of MVP scope).
