# VIVIA — Strategic overview (single source of truth)

_Created 2026-10-10. Updated after each strategy deliverable. Every claim is tagged:_
**[V]** verified (source recorded) · **[E]** estimate (method shown) · **[H]** hypothesis · **[R]** recommendation · **[U]** unknown.

## 1. What exists today (verified by inspecting the repository)

| Item | State | Tag |
|---|---|---|
| Product code | `vivia/` Next.js 15 + PostgreSQL + Prisma app. 66 automated tests, 14-flow browser E2E, CI workflow (`.github/workflows/ci.yml`) green on the last checked commit. | [V] |
| Features built | Logging (one-tap, "Tell VIVIA"), Health Memory timeline with provenance, document extraction with patient verification, conflict handling, Care Summary (PDF + expiring link), bathroom finder (no account), stoma filters, offline emergency card, privacy (consent/export/delete/audit), 6 languages. | [V] |
| Real users | **None.** No pilot, no interviews, no analytics. Demo data is fictional (Anna Rossi). | [V] |
| Live deployment | **None.** Docker/Render files exist but were never built or run on a host. | [V] |
| Claude AI integration | Written, **never tested** with a real API key. Offline rules provider is what the tests cover. | [V] |
| Translations | EN reference, IT written first, FR/ES/DE/AR machine-assisted and **not reviewed** by native speakers. | [V] |
| Map data | OpenStreetMap-based; the places shown in the demo are fictional. Real coverage and reliability **unmeasured**. | [V]/[U] |
| Regulatory/privacy | Positioned as wellness/self-management. No DPIA, no clinical review, no legal text, no medical-device assessment. | [V] |
| Design | Figma Make prototype (25 screens) exists; five screens were ported into the code. | [V] |
| Second codebase | The founder reports an app built with Base44 and "ready for the App Store". **Not inspected**; its data hosting, security and behaviour are unknown. | [U] |

## 2. Key decisions so far

| # | Decision | Status |
|---|---|---|
| D1 | Product stays on the wellness / self-management side: no diagnosis, no flare prediction, no treatment advice. | Adopted (code + docs) |
| D2 | Violet is the brand colour; coral is reserved for urgency. | Adopted |
| D3 | No real patient data until DPIA, clinical review and a hosting/DPA decision. | Adopted (launch checklist) |
| D4 | All segments and monetisation models are hypotheses (see `01-business-validation.md`). | Adopted 2026-10-10 |

## 3. Open questions (ranked)

1. **Who is the first customer, and who pays?** [U] — see `01`.
2. **Which codebase is the product** (this repository or the Base44 app)? Two sources of truth would contradict rule 2. [U]
3. Is there evidence that people with IBD will keep logging, and that doctors will read a Care Summary? [U]
4. Is a CE-marking / medical-device route needed for the intended claims? [U] (`docs/COMPLIANCE.md` is design notes, not legal advice.)
5. Real-world coverage of toilets / stoma-friendly places in target cities. [U]

## 4. Contradictions found in existing documents (to fix, not silently)

| Document | Says | Reality |
|---|---|---|
| `docs/PRODUCT.md` "Design system (v2)" | One **mint** accent, mint chart greens | Brand is now **violet** (code and Figma) |
| `docs/ROADMAP.md` | FR/ES/DE/AR "core flows only" is a P1 gap | Full dictionaries now exist (unreviewed) |
| `docs/COMPETITIVE_ANALYSIS.md` | Language row: "EN/IT full; FR/ES/DE/AR core" | Same as above |
| `docs/PRODUCT.md` | "Measured… ≈ 130 ms" etc. are local test timings | Not user-facing performance; do not quote externally |
| Patient name | "Anna Rossi" in code, "Anna Bianchi" in the Figma prototype | Fictional; pick one before any external material |

## 5. Deliverable status

| File | Status |
|---|---|
| `00-strategic-overview.md` | This file |
| `01-business-validation.md` | **Done (2026-10-10)** — verdict: hypotheses unvalidated; run validation sprint before further building |
| `02`–`10` | Not started. Do not start `02` (personas) until the choice of first customer in `01` is made, because personas depend on it. |

## 6. Most important next decision

**Pick one initial customer segment to test in the next 3 weeks and stop adding features until at least five interviews and one concierge test are done.** Recommended candidate: see `01-business-validation.md` §6.
