# 09 — Patient and customer feedback analysis

_Date: 2026-10-10. Tags: [V] verified · [H] hypothesis · [U] unknown._

## 0. Result of the inventory

**Search of the repository for feedback and research files (2026-10-10):** no patient interview notes, beta-test logs, clinician interview notes, support messages, survey responses or VIVIA app-store reviews exist. The only files that mention interviews are the plans in `strategy/` (`02`, `05`, `07`). **There is therefore no VIVIA customer feedback to analyse.**

**What this document does instead:** (1) states the data gap, (2) provides a **reusable analysis framework** ready for the first interviews, (3) separates the **only evidence that exists today** (published research and internal engineering observations) so that none of it is mistaken for VIVIA customer feedback, and (4) gives an initial backlog and a follow-up interview plan.

> **Findings in the required table (theme / number of respondents / %) are intentionally empty.** Filling them now would be fabrication.

---

## 1. Source separation (never mix these)

| Source type | Exists today? | May be reported as… |
|---|---|---|
| **VIVIA patient interviews** | No | "VIVIA patient feedback" (n respondents) |
| **VIVIA beta/usability tests** | No | "VIVIA user testing" |
| **VIVIA clinician interviews** | No | "Clinician feedback" |
| **VIVIA support messages** | No (not deployed) | "Support" |
| **VIVIA app-store reviews** | No (not published) | "Reviews" |
| **Public competitor reviews** | Almost none retrievable (`03` §4) | "Competitor reviews (public)". **Never as VIVIA feedback** |
| **Published studies** | Yes (`01`, `02`) | "Published research (not VIVIA)" |
| **Internal engineering observations** | Yes (tests, screenshots, code review) | "Internal observation (not customer feedback)" |

---

## 2. Collection and handling protocol

1. **Unit of analysis = unique respondent.** Assign each person an anonymous ID (R01, R02…). **Multiple comments from one person count once** per theme. Repeated mentions inside one session count once.
2. **Consent and privacy.** Record that consent was given, for what, and whether quotes may be used. Notes carry no names, emails or health details; consent forms are stored separately from notes. Delete audio after transcription if promised. **Do not paste notes, transcripts or recordings into third-party AI services** unless a privacy and security basis has been documented. Prefer manual coding.
3. **Quotes.** Use only if permitted; paraphrase if in doubt; remove identifying details; mark translation.
4. **Segment tags** (for each respondent): persona (A–D or B2B role), country, language, treatment context only if volunteered and relevant, used-an-IBD-app yes/no.
5. **No generalisation.** Any result must show n and the sample description; fewer than ~10 respondents per segment = "indicative only".

---

## 3. Coding scheme

**Themes (one code per statement; allow multiple codes):**
`MANUAL_EFFORT` · `MEDICATION` · `SYMPTOMS` · `DOCUMENTS` · `DOCTOR_COMM` · `AI_TRUST` · `ACCESSIBILITY` · `REAL_WORLD` (toilets, travel, stoma) · `PRICING` · `PRIVACY` · `RELIABILITY` (technical) · `OTHER`.

**Statement types:** problem · positive experience · feature request · reason to abandon a tool · adoption barrier · privacy concern · trust/reliability concern · willingness-to-pay signal · clinician need · unexpected use.

**Willingness-to-pay signals (strength):** *stated* ("I'd pay") < *behavioural* ("I paid for X last year") < *committed* (paid pre-order). Record the strongest only per respondent.

---

## 4. Findings table (template, empty)

Complete one row per theme × source type. Compute **number of unique respondents** and **percentage of relevant respondents** (denominator = respondents who were asked about the topic, not all participants).

| Theme | Finding (paraphrase) | Unique respondents (n) | % of relevant respondents | Source type | Quote (if permitted) | Severity (1–5) | Confidence (1–5) | Adoption/retention impact | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| _(empty until data exists)_ | | | | | | | | | |

**Severity scale:** 1 cosmetic · 2 minor friction · 3 notable friction · 4 blocks a key task for some · 5 harm, data loss, safety or privacy breach.
**Confidence scale:** 1 single comment · 2 few respondents, one segment · 3 several respondents or two sources agree · 4 several segments and sources agree · 5 supported by behavioural data.

**Worked arithmetic (illustration only, not data):** if 10 patients were asked about toilets and 6 raised a problem, the entry is "6 of 10 (60%) of relevant respondents; n = 10; indicative only".

---

## 5. Prioritisation method

Score each candidate improvement 1–5 on each criterion (5 favourable), then compute:

**Priority = (Frequency + Severity + Strategic fit + Confidence) × Safety factor ÷ Effort factor**

| Criterion | 5 means |
|---|---|
| Frequency | Raised by most relevant respondents |
| Severity | Blocks a key task or creates risk |
| Strategic fit | Supports the chosen position (`04`): visit preparation, daily-life support, patient control |
| Confidence | Several segments and sources agree |
| Effort factor | 1 = small change … 3 = large build (divide) |
| Safety factor | **×2** if it affects safety, privacy or wrong information; ×1 otherwise. **Any item scoring Severity 5 is a critical defect regardless of the score.** |

**Buckets:** (a) **Critical defects** (data loss, privacy, wrong medical information, blocked core task); (b) **High-value improvements** (priority top quartile, confidence ≥3); (c) **Unvalidated requests** (confidence ≤2); (d) **Outside strategy** (competes with `04` non-goals: prediction, coaching, wearables, community, advice).

---

## 6. Evidence available today, kept separate

### 6.1 Published research (not VIVIA feedback)
Urgency, fatigue, pain and mental-health burden are frequent and often unaddressed in consultations; app dropout in chronic disease is high (`01` §2–§3). These shape **hypotheses**, not findings about VIVIA.

### 6.2 Internal engineering observations (not customer feedback)
| Observation | Type | Impact | Action |
|---|---|---|---|
| Claude-based parsing and extraction never tested with a real key | Reliability risk | AI trust | Run E10 (`01`) on synthetic documents |
| Map places in the demo are fictional; OSM import optional; real coverage unmeasured | Data risk | Real-world support promise | Run place audit (`05` #8) |
| No push or email reminders | Missing capability | Engagement | Defer until pilot shows need |
| FR/ES/DE/AR texts machine-assisted | Quality risk | Trust and safety | Native/clinician review before any use |
| No independent security review, DPIA, privacy notice or terms | Compliance gap | Blocks real-data pilot | Launch checklist |
| App not deployed; Docker/Render files never run on a host | Operations gap | Blocks pilot | Deploy to a staging host with fictional data |
| Opening hours evaluated in Europe/Rome time | Known limitation | Wrong "open now" elsewhere | Fix before other regions |
| Accessibility not audited | Quality risk | Accessibility | Screen reader and zoom test |
| Mood prompt wording unreviewed by a clinician | Safety risk | Trust | Clinical review |

---

## 7. Initial backlog (hypothesis-driven; none validated by users)

| Bucket | Item | Why | Source |
|---|---|---|---|
| **Critical (pre-pilot, internal)** | Staging deployment with fictional data | Needed to test with anyone | Internal |
| Critical | Privacy notice, terms, consent wording reviewed by counsel | Required before real data | Launch checklist |
| Critical | Security review and DPIA | Required before real data | Launch checklist |
| Critical | Clinical review of wording (including mood and "low mood" question) | Safety | Launch checklist |
| High-value (hypothesis) | Measure and, if needed, improve map data for target cities | Core promise of the toilet pillar | `05` #8 |
| High-value (hypothesis) | Make Care Summary content editable and clearer for the clinician view | Core promise of the visit pillar | `04` |
| High-value (hypothesis) | Shorter onboarding (3 questions) | Drop-off risk | `05` #12 |
| High-value (hypothesis) | Italian copy reviewed by a native speaker | Initial market | `06` |
| Unvalidated | Reminders and push notifications | Appeared in roadmap, not validated | `docs/ROADMAP.md` |
| Unvalidated | Clinician portal | Depends on E2 and E9 | `05` |
| Unvalidated | Food diary screen | Competitors have it; not validated | `03` |
| Unvalidated | Apple Health / Health Connect | Competitors have it | `03` |
| Outside strategy | Flare prediction, treatment suggestions, AI coach/chat, community forum | Regulatory and trust risk | `04` §4 |

---

## 8. Evidence gaps

- No patient interviews (n=0), no clinician interviews (n=0), no tests (n=0), no support or reviews (n=0). **[U]**
- Public competitor complaints not retrievable (`03`). **[U]**
- Willingness to pay unmeasured. **[U]**
- Italian-language reactions to tone and wording unmeasured. **[U]**

---

## 9. Follow-up interview plan

| Wave | Who | n | Goal | Method | Timing |
|---|---|---|---|---|---|
| 1 | Persona B (experienced, regular visits), Italy | 8 | Problem recognition, current tools, visit routine | 30-min semi-structured (`07` A) | Weeks 1–2 |
| 1 | Persona D (stoma) | 4 | Daily-life planning, toilet needs | Same | Weeks 1–2 |
| 1 | Gastroenterologists / IBD nurses | 8 | Workflow, trust, payer | `07` B | Weeks 1–3 |
| 2 | Persona A and C | 4–6 | Compare needs | Same | Weeks 3–4 |
| 2 | Associations | 3 | Partnership terms | `07` D | Weeks 2–4 |
| 3 | Prototype tests | 10 | Task completion, comprehension of source labels | Observed click-through | Weeks 3–5 |
| 4 | Diary pilot | 15 | 14-day retention, effort | `01` E6 | After hosting and checklist |

**Analysis cadence:** code each interview within 48 hours; after every 5 interviews update the findings table; stop adding interviews in a segment when new ones stop adding new themes **and** n ≥ 8.

**What would change the plan:** if segment B shows little recognition (<30% in the first 10), reallocate interviews to D and C; if clinicians show no appetite (E2 fails), shift to the association/free-tool route.
