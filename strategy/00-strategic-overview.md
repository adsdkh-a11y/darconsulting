# VIVIA — Strategic overview (single source of truth)

_Created 2026-10-10; updated 2026-10-10 after deliverables `01`–`10`. Every claim is tagged:_
**[V]** verified (source recorded) · **[E]** estimate (method shown) · **[A]** assumption · **[H]** hypothesis · **[R]** recommendation · **[U]** unknown.

## 1. Where things stand (verified by inspecting the repository)

| Item | State | Tag |
|---|---|---|
| Product code | `vivia/` Next.js + PostgreSQL + Prisma. 66 automated tests, 14-flow browser test, CI configured and green on the last check | [V] |
| Features built | Quick logging, "Tell VIVIA" with confirmation, Health Memory timeline with source labels, document extraction with patient verification, conflict handling, Care Summary (PDF + expiring link), no-account toilet finder with stoma filters, offline emergency card, privacy (consent per purpose, export, delete, audit), six languages | [V] |
| Real users | **None.** No interview, pilot, analytics or feedback data exists (`09` §0) | [V] |
| Live deployment | **None.** Docker/Render files exist but never ran on a host | [V] |
| Claude AI integration | Written, **never tested with a real key** | [V] |
| Translations | EN reference, IT first; FR/ES/DE/AR machine-assisted, **unreviewed** | [V] |
| Map data | Demo places are fictional; real coverage unmeasured | [V]/[U] |
| Privacy/regulatory | Wellness position by design. No DPIA, security review, clinical review, privacy notice, terms or legal advice | [V] |
| Design | Violet brand; Figma Make prototype (25 screens); Map, Tell VIVIA, Profile, Health Memory screens ported; **Home not yet aligned** | [V] |
| Second codebase | Base44 app reported "ready for the App Store" by the founder; **not inspected** | [U] |
| Revenue, paying customers, retention, acquisition cost, willingness to pay | **None demonstrated** | [V] |

## 2. Key conclusions from the ten strategy files

| File | Conclusion |
|---|---|
| `01` Business validation | **Proceed with conditions, low confidence.** The problem is real and documented (urgency, fatigue, pain, mental health, often not discussed in consultations). A direct-to-patient subscription is **not supported** (a survey found reluctance to pay; the revenue arithmetic is tiny even in the optimistic case). A payer other than the patient is the key unproven hypothesis. |
| `02` Personas | Four patient personas (A newly diagnosed, B experienced with regular visits, C complex care, D stoma) and four B2B roles are **hypotheses, not interview findings**. Recommended beachhead: **B**; secondary: **D** (with C features). Scores are close and favour C/D on need; B chosen for **reachability and speed of learning** (reversible). |
| `03` Competition | Basic tracking/reminders/reports are crowded. Many more competitors than listed. **No verified user-review pattern could be found.** Differentiation lies in the visit summary, no-account toilet/stoma support and patient control, none verified as combined by a competitor. Distribution (NHS trusts, pharma-funded apps, charities) is a stronger moat than features. |
| `04` Positioning | **Primary: better-prepared doctor visits.** Pillars: daily-life support (toilet/stoma) and patient control. Claims framework separates verified capabilities, benefits to validate, roadmap and prohibited medical claims. "VIVIA" is a working name. |
| `05` Growth | 20 opportunities scored; top five for 30 days: patient interviews, clinician interviews, concierge Care Summary, place-data audit, landing page with email-only waitlist. |
| `06` Content | Italian-first; LinkedIn + Instagram + 3 articles + small newsletter + community listening; measure qualified interest, not likes. Roughly 75 hours of founder time. |
| `07` Sales | Four consultative playbooks (patients, clinicians, clinics, associations); pricing is a discovery framework, not a list. |
| `08` Landing page | Recommended hero: "Say what matters at your next visit." Email-only waitlist; no testimonials or statistics about VIVIA; noindex until legal text exists. A/B test is directional only given traffic. |
| `09` Feedback | **No feedback exists.** Provides a reusable framework and keeps competitor/published/internal evidence separate. |
| `10` 90-day plan | Validate (days 1–30), build only what interviews justify (31–60), evaluate adoption (61–90) with explicit privacy, security, clinical and regulatory gates. Budget about €2.4k–€6.6k [E]. |

## 3. Decisions

| # | Decision | Status |
|---|---|---|
| D1 | Product stays wellness / self-management: no diagnosis, no flare prediction, no treatment advice | Adopted |
| D2 | Violet brand; coral reserved for urgency | Adopted |
| D3 | No real patient data until DPIA, security review, clinical review and a hosting/DPA decision | Adopted |
| D4 | All segments and monetisation models are hypotheses | Adopted |
| D5 | Position: better-prepared doctor visits (`04`) | **Proposed, awaiting founder confirmation and evidence** |
| D6 | Italy first, Italian-language content | **Proposed (assumption A1 in `10`)** |
| D7 | Beachhead B, secondary D | **Proposed, reversible after interviews** |
| D8 | Do not build now: clinician portal, wearables, AI chat/prediction, native apps, community/food/more languages | **Proposed (`10` §8.2)** |

## 4. Open questions (ranked)

1. **Who pays?** A clinic, association or funder, or patients (pre-order)? [U]
2. **Which codebase is the product** (this repository or the Base44 app)? Two sources of truth would contradict rule 2. [U]
3. Will people keep using it for at least two weeks? [U]
4. Will clinicians read a patient-prepared summary and under what conditions? [U]
5. Is the wellness position legally sound for the claims actually made? Legal and regulatory advice not yet obtained. [U]
6. Is map/stoma data good enough in the target cities? [U]
7. Can the Claude-based extraction be made accurate enough, with a clinician check? [U]
8. Trademark, domain and app-store availability for the name "VIVIA". [U]

## 5. Contradictions found and handled

| Where | Said | Reality / handling |
|---|---|---|
| `docs/PRODUCT.md` "Design system (v2)" | One **mint** accent | Brand is **violet**. **To fix in that file** |
| `docs/ROADMAP.md`, `docs/COMPETITIVE_ANALYSIS.md` | FR/ES/DE/AR "core flows only" | Full dictionaries now exist, **unreviewed**. Strategy files use the current state |
| Patient name | "Anna Rossi" (code) vs "Anna Bianchi" (Figma prototype) | Fictional; pick one before external material |
| `01` recommended beachhead (advanced therapy) vs `02` raw scores favouring C/D | Explained in `02` §6 (reachability and speed of learning); reversible |
| `docs/COMPETITIVE_ANALYSIS.md` (2026-09-30) vs `03` (2026-10-10) | Vendor-sourced "documented" features not re-verified today are marked V\* in `03`; some were only partly confirmed (Flarity lab OCR, coreway Class I) |
| `docs/PRODUCT.md` local timing figures | Are test measurements, not user-facing performance; do not quote externally |

## 6. Evidence limits that apply to all files

Web pages could not be opened in this environment; sourced figures come from **search-result summaries** and must be re-checked against the originals before external use. No competitor app was tested hands-on. Population figures for the four countries are approximate and were not re-sourced. All Italian copy is a draft awaiting native and clinical review.

## 7. File status

| File | Status |
|---|---|
| `00` | This file |
| `01`–`10` | **Drafted 2026-10-10.** All depend on hypotheses until interviews are done; update after each result |

## 8. Most important next decision

**Choose the first paying-customer hypothesis to test (patient pre-order vs clinic/association funding) and commit the 90-day plan's interviews and stop rules before building more.** Without a payer or evidence of repeated use, further development adds cost without information. Also decide which codebase is the product.
