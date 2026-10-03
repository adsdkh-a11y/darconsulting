# VIVIA — AI architecture

```
USER DATA → HEALTH MEMORY → CONTEXT BUILDER → AI SERVICE → SAFETY & ANCHORING → PATIENT CONFIRMATION → HEALTH MEMORY
                                                   │
                                                   └──► AiRun (audit: model, time, input scope, sources, output, flags, confirmation)
```

AI never works on a blind dump of the database and never writes to the Health Memory by itself.

## Providers

`src/server/ai/types.ts` defines `AIProvider`:

| Method | Used by |
|---|---|
| `parseLog(text, today, knownMedications)` | Tell VIVIA (natural-language + voice logging) |
| `extractDocument({ text?, file? })` | Document pipeline (classification, OCR/transcription, extraction) |
| `visitNarrative({ facts, signals, locale })` | Care Summary overview + patient questions |
| `explainTerms(terms, locale)` | "Help me understand" |

Implementations:

- **`AnthropicProvider`** — Claude via the official `@anthropic-ai/sdk`, model `claude-opus-5-5`
  (override with `AI_MODEL`), `client.messages.parse` with **structured outputs** (Zod schemas) so every
  response is schema-valid JSON; explicit `effort` per task (`low` for logging/explanations, `medium` for
  extraction/summaries); PDFs sent as `document` blocks, photos as `image` blocks. A `refusal` stop reason is
  treated as a failure (the caller falls back — see below).
- **`RulesProvider`** (offline, deterministic) — regex/lexicon engine for EN/IT/FR logging, lab/procedure/
  medication/date extraction from text layers, template-based questions, and a curated glossary. It is the
  default, the test oracle, and the fallback.

### Provider selection = configuration × consent

`providerFor(userId, purpose)` returns the LLM only if `AI_PROVIDER` is configured (or `auto` with an API
key) **and** the patient's latest consent for that purpose is granted (`AI_PROCESSING` or
`DOCUMENT_AI_PROCESSING`, both **off by default**). Otherwise the on-device engine is used. `runAI` falls
back to the rules engine if the LLM call throws or declines, and records `fell_back_to_offline_engine`.

## Context builder & minimisation

| Task | What is sent | What is never sent |
|---|---|---|
| Tell VIVIA | the typed/spoken text, today's date, the patient's medication **names** | name, email, birth year, other records |
| Document extraction | that single document (text, or file when no text layer and consent given) | anything else from the record |
| Care Summary | deterministic, pre-computed **facts** for the chosen period and sections + change signals + the patient's own concerns | identity (`identityDataSent: false` is stored in the run's input scope), unrelated history |
| Explain terms | glossary terms that literally occur in the document | the document's values |

`buildSummaryContext()` (in `services/summary.ts`) loads only the sections the patient ticked for the period
they chose.

## Safety layer (`src/server/ai/safety.ts`)

Applied to every output, whichever provider produced it:

1. **System prompt** (`SAFETY_SYSTEM_PROMPT`): not a doctor; no diagnosis, no flare claims, no treatment
   changes, no invented values, neutral wording, correlation ≠ causation.
2. **Output guard** (`guardText`/`guardList`): removes any sentence that claims a flare/condition, suggests
   stopping/changing/skipping treatment, prescribes, discourages seeking care, or makes causal food claims;
   records a safety flag on the `AiRun`.
3. **Anchoring** (`verifyExtraction`): an extracted field is kept only if its source snippet **and** (for labs)
   its value can be found in the document text; otherwise it is dropped (`dropped_unanchored_field`). With no
   text to verify against, confidence is capped at 0.5 so the UI forces careful review.
4. **Human confirmation:** extracted fields start `PENDING`; natural-language logs are previewed; summaries
   are editable before sharing.
5. **Two layers for documents:** "What your document says" (strict restatement) vs "Help me understand"
   (general meaning of terms, explicitly *not* an interpretation of the patient's result).

## Personal baselines (statistics, not AI)

`services/baseline.ts`: 7/30/90-day baselines from the patient's own data, shown only with ≥ 5/14/30 logged
days. A change is reported when ≥ 3 **consecutive** recent logged days exceed the 30-day baseline (computed on
the 30 days *before* the last week, so the change doesn't contaminate its own reference) by more than
max(1 SD, metric-specific minimum). Wording is fixed and neutral.

## Auditability

`AiRun` rows: task, provider, model, timestamp, input scope, source references (e.g.
`MedicalDocument:<id>`, `SymptomEntry:<id>`), output, safety flags, user confirmation. The patient sees this
under *Privacy → AI activity*, and every summary states "Based on your data from … to …".

## Voice

Browser Web Speech API (on-device or browser-vendor STT depending on platform) → text → same Tell VIVIA
pipeline → confirmation. A server-side STT provider can be added behind the same interface for native apps;
audio is never stored.

## Evaluation (next)

- Golden set of anonymised/synthetic reports per document type & language; metrics: field precision/recall,
  unanchored-drop rate, patient confirm/reject rate (from `ExtractedField.status`).
- Red-team prompts for the safety guard (flare claims, treatment changes) run in CI (`tests/ai-rules.test.ts`
  already covers the guard on fixed cases).
