# 11 — Base44 app review and brief for legal/regulatory counsel

_Date: 2026-10-10. Created after founder decisions F3 (the Base44 app is the product) and F4 (obtain legal and regulatory advice) in `10` §1b. Tags: [V] verified · [H] hypothesis · [U] unknown._

> **Status of the Base44 app: not inspected.** No URL, export, screenshots or access has been provided in this project. **Nothing is known or claimed here about its security, hosting, data handling, features or quality.** This file is a review plan and a brief, to be completed when access exists. The founder reported that it is "ready for the App Store"; that statement is **unverified**.

---

## Part A — Base44 app review

### A1. What to obtain first
| Item | Why | Done |
|---|---|---|
| Link to a preview or staging version, plus **two test accounts** | Needed for isolation tests | ☐ |
| Whether the app can be **exported** (code or GitHub sync) on your plan; export if possible | Determines whether it can be reviewed, versioned and moved | ☐ |
| Screenshots of **every screen** (light and dark if available) | To compare features with the claims list | ☐ |
| The platform's **terms, privacy policy and data-processing terms** | Controller/processor roles | ☐ |
| Where **data and files are stored** (country/region) | GDPR transfers | ☐ |
| Whether health data is sent to **AI or third-party services** (and which) | Consent, processor agreements | ☐ |

### A2. Review checklist (mark Pass / Fail / Unknown; any **Fail** on a high-severity item triggers hard stop rule 3 in `10`)

| # | Area | Test or question | Severity if failed |
|---|---|---|---|
| 1 | **Per-user isolation** | With account A, can you open, edit or delete account B's records by changing an ID in the address, or through shared lists? | **High** |
| 2 | **Authentication** | Password rules, email verification, session expiry, logout, password reset | High |
| 3 | **Hosting location and contracts** | Are data and files in an acceptable region, with a processing agreement you can sign? | **High** |
| 4 | **Health-data consent** | Is explicit consent captured per purpose and stored? Can it be withdrawn? | High |
| 5 | **Deletion** | Can a user delete the account and all data from inside the app? (also required by the App Store) Are files deleted too? | **High** |
| 6 | **Export** | Can a user download all their data? | Medium |
| 7 | **Documents** | Are uploaded files access-protected (not reachable by a public link)? Encrypted at rest? | **High** |
| 8 | **AI use** | Does the app send health text or documents to an AI service? Is it opt-in and described to the user? Does AI ever give diagnosis or treatment advice (test with prompts such as "do I have a flare?" and "should I stop my medication?") | **High** |
| 9 | **Claims in the app** | Any wording that diagnoses, predicts flares, advises treatment, or claims accuracy/compliance? | High |
| 10 | **Sharing** | Are summary links private, expiring and revocable? | High |
| 11 | **Third-party scripts** | Analytics, advertising pixels, session-recording tools in the app or site | Medium |
| 12 | **Logs** | Does anything log health content? Who can read logs? | Medium |
| 13 | **Accessibility** | Screen reader, text zoom, contrast | Medium |
| 14 | **Language quality** | Italian text reviewed by a native speaker | Medium |
| 15 | **Location data** | Is location stored? Used only on request? | Medium |
| 16 | **Backups and recovery** | Can data be restored? | Medium |
| 17 | **App Store readiness** | How is it packaged (a thin web wrapper may be rejected); account deletion in app; privacy labels; sign-in rules; demo account for reviewers | Medium |

### A3. Feature parity map (to fill; use to re-verify `04` §4 and `08`)

| Capability claimed in `04`/`08` | In Base44 app? | Evidence (screenshot/test) | Public claim allowed? |
|---|---|---|---|
| Quick check-in / one-tap mood / "same as yesterday" | | | |
| "Tell VIVIA" with confirm before save | | | |
| Timeline with source labels | | | |
| Documents with patient confirm/fix/reject | | | |
| Care Summary (PDF, expiring link) | | | |
| No-account toilet finder; stoma filters | | | |
| Offline emergency card | | | |
| Consent per purpose; AI off by default | | | |
| Export and delete | | | |
| Languages (which, reviewed?) | | | |
**Rule:** a capability may appear in public material only when its row has evidence for the Base44 app.

### A4. Decision paths after the review
- **All high items pass** → proceed to Gate 2 steps; record results in `00`.
- **Fixable high items** → set a 30-day fix deadline; **no waitlist or users on that app until fixed.**
- **Not fixable on the platform** (isolation, region, deletion) → decision: move to the repository codebase (which already has isolation tests, export, deletion and encrypted documents, **but is also unreviewed and undeployed**) or pause. This is a founder decision, to be taken with the review evidence.
- **Cannot inspect at all** (no export, no access to logs or settings) → treat as "unknown", do not use for real data, and use the repository prototype for any demonstration.

### A5. Results of the code review (2026-10-11, read-only via the Base44 MCP connector)

App: "VIVIA (Copy)", id `6ac8acfbbe067aec5260f40f`. Static review of code, entity schemas and RLS. Nothing was run, nothing was changed. Hosting region, DPA, password policy, logs and accessibility are still **Unknown** (platform information needed).

| # | Severity | Finding | Status |
|---|---|---|---|
| 1 | High | `DocUploadSheet.proposeExtracted()` returns hard-coded lab values (calprotectin 180, hemoglobin 13.2, CRP 4.1) and is used by `Memory.jsx`: fake "extraction" saved as the patient's own data. The real flow (`DocExtractSheet`) exists but is used elsewhere. | **Fail** |
| 2 | High | `seedPersonalDemoIfEmpty` writes fake medical data (Anna Rossi) into real accounts, including `Consent.create({ data_sharing: true })`. | **Fail** |
| 3 | High | Care-summary share link `/share/:token` has **no route** in `App.jsx`: the link is dead; the 7-day expiry and revocation are client-side only. | **Fail** |
| 4 | High | No explicit health-data consent or terms at registration (email/password/Google only). | **Fail** |
| 5 | High | AI flows send condition, medications, allergies, check-in notes and memory items to a third-party LLM (`getLifestyleAdvice`, `planIbdTravel`) with no consent gate; `Coach.jsx` calls the LLM automatically on load; no output filter beyond prompt rules (`NEUTRAL_RULES`). Spoken text goes to ElevenLabs (`speakText`). | **Fail** (needs counsel, brief Q on processors) |
| 6 | High | `findNearbyBathrooms` writes LLM-generated places (`ai_suggested`, `open_now: true` by default) into the **shared public `Place` table** via service role: hallucinated toilets shown to all users. | **Fail** |
| 7 | Medium | Deletion: `deleteAll` empties entities but does not delete the account or uploaded files. Export includes all `CommunityPost`/`CommunityReply` (not only the user's own). | **Fail** |
| 8 | Medium | Community is seeded with fabricated posts/replies; no moderation. | **Fail** |
| 9 | Medium | `BathroomEmergency` lists the first 20 `Place` rows, with no sorting or geolocation (not usable in an emergency). | **Fail** |
| 10 | Medium | Speech recognition language hard-coded `en-US`. | **Fail** |
| 11 | Medium | Privacy claims in the UI ("only visible to you", expiring links) are not all backed by the code (see 3, 5, 7). | **Fail** |
| 12 | Pass | RLS `created_by_id = {{user.id}}` on personal entities; `Place` writes admin-only; real document flow uses private upload and 900 s signed URL with patient confirmation; Tell-VIVIA is rule-based with confirm-before-save. | **Pass (by reading; not tested)** |

Consequence: hard stop rule 3 in `10` is active. **No users, waitlist or public claim on this app until items 1–6 are fixed** (30-day fix window). Items 1–3 and 6 are fixable inside the app; 4–5 also need counsel input.

---

## Part B — Brief for legal and regulatory counsel (decision F4)

**Goal:** a fixed-fee scoped consultation (budget in `10` §1b: about **€400** in phase 1, **€350** in phase 2, **€250** in phase 3). Ask for a written answer to each question and a list of documents they would need.

**Context to give counsel (factually):** a patient-facing prototype for adults with Crohn's disease or ulcerative colitis; Italy first; features: quick symptom logging, a typed or spoken sentence turned into a draft the user confirms, a timeline with source labels, document upload with extracted values the user confirms, a patient-prepared summary (PDF or expiring link), a no-account toilet-finder, an optional AI assistant that is off by default; **no diagnosis, no treatment advice, no flare prediction**; no real users; no paying customers; the founder intends to seek **clinics, patient associations and funders** as payers; an App Store release is being considered.

### Questions

**1. Data protection (GDPR and Italian law)**
1. Is explicit consent the right legal basis for health data here (Art. 9(2)(a)), and what must the consent text contain? Is any other basis relevant for institutional pilots?
2. **Controller or processor?** In a clinic pilot, who is controller? What contracts are needed?
3. Is a **DPIA** mandatory before a small pilot with real data? What minimum content?
4. What is required for a **processor agreement** with the app platform provider and any AI vendor, including transfers outside the EU?
5. Retention, deletion in backups, breach notification process.
6. Cookies and analytics on the landing page: what is required for a **cookie-less or minimal** setup?
7. Is a **data-protection officer** required at this scale?

**2. Medical-device boundary**
8. Under the EU medical-device rules and the guidance on qualification of software, could any of these features qualify as a medical device: the patient-prepared summary, trend/baseline comparisons "versus your own pattern", the mood section, the document extraction?
9. Which **wording** keeps the product on the wellness side, and which words must be avoided in the app and in marketing?
10. What would change if the app were **recommended by a clinic** or **funded by a hospital**?

**3. AI**
11. What transparency duties apply to the AI features under the EU AI Act as used here?
12. Any liability concerns when AI turns a patient's text or a document into a draft the patient confirms?

**4. Commercial partners**
13. Rules and risks for **pharma-funded** support to a patient tool (disclosure, independence, data access limits).
14. How should a **pilot agreement with a hospital or association** be structured (roles, liability, data, IP, termination)?
15. Tender or procurement thresholds for a pilot in Italian public hospitals (do they apply at our price?).

**5. Research and recruitment**
16. Do **patient interviews and a small usability test** need ethics approval, and what consent form is enough?
17. May we use the interviews for product decisions and anonymised publication?
18. Rules on **recruiting patients through patient groups** and on health-related ads.

**6. Consumer and platform**
19. Whether a **paid pre-order** (if ever used) raises consumer-law issues.
20. **App Store** health-app requirements and any regulatory statements needed in the listing.

**7. Name and brand**
21. Trademark and domain availability check for **"VIVIA"** in the relevant classes and in Italy and the EU (working name).

### What to prepare for counsel
This repository's `docs/COMPLIANCE.md`, `docs/SECURITY.md`, `docs/LAUNCH_CHECKLIST.md` and the claims framework in `04` §4, **with the note that they describe the repository prototype, not the Base44 app.**

### Outputs expected
A short written memo with: the legal basis and consent wording; controller/processor map; DPIA requirement and scope; the wellness-boundary wording rules; a pilot-agreement outline; a list of contracts to sign. **Record the outcome in `00` and re-check Gate 2 criteria.**
