# 10 — 90-day validation, launch and growth plan

_Date: 2026-10-10. Built on `00`–`09` and the actual state of the repository. Tags: [V] verified · [E] estimate · [A] assumption · [H] hypothesis · [U] unknown._

## 0. Starting position (from the repository, verified)

- **Product:** a working prototype (`vivia/`) with logging, timeline, document extraction with patient confirmation, Care Summary, toilet finder, emergency card, privacy controls, six languages; **66 automated tests and a 14-flow browser test pass; CI is configured and was green on the last check** [V].
- **Not done:** **not deployed**; **no real user**; Claude-based AI **never tested with a real key**; no privacy notice, terms, DPIA, security review or clinical review; non-IT/EN texts unreviewed; place data unmeasured; no reminders [V].
- **Business:** **no revenue, no paying customer, no retention data, no acquisition cost, no willingness-to-pay data** [V]. All business models are hypotheses (`01`).
- **Second codebase** (Base44 app) not inspected [U].

## 1. Assumptions (change them if wrong)

| # | Assumption |
|---|---|
| A1 | Initial market: **Italy**; interviews and content in **Italian** (founder or an editor can write Italian) |
| A2 | ~~Founder time 15–20 h/week~~ **Superseded 2026-10-10: founder time is < 10 h/week** (see §1b) |
| A3 | ~~Budget €2,400–€6,600~~ **Superseded 2026-10-10: hard cap ≈ €2,400, released by phase** (see §1b) |
| A4 | ~~VIVIA repository is the product~~ **Superseded 2026-10-10: the founder chose the Base44 app as the product**, subject to the review in `11-base44-review-and-counsel-brief.md` before any real data or public claim |
| A5 | Real patient data is **not** processed until the launch checklist sections 1–4 are met; tests use fictional data until then |
| A6 | A clinical advisor and a data-protection/legal adviser can be recruited within 3 weeks [H] |
| A7 | **Primary segment:** adults on long-term therapy with regular visits; **secondary:** people with a stoma (`02`) |

## 1b. Founder decisions and fixed constraints (2026-10-10; override anything earlier in this file)

| # | Decision | Consequence |
|---|---|---|
| F1 | **Payer to test first: clinics, patient associations and funders.** Not patient subscriptions. | Pre-order/price tests (`05` #11) are **removed from the 90 days**. Interviews, association conversations and a clinic pilot discussion move up. Gate 3 no longer accepts a patient pre-order signal as a substitute for a named sponsor. |
| F2 | **Segments confirmed:** primary = experienced adults with regular visits (B); secondary = people with a stoma (D). | Unchanged from `02`. |
| F3 | **The Base44 app is the product codebase.** | Everything in `04` §4 and `08` that was "verified" referred to the **VIVIA repository prototype** and must be **re-verified against the Base44 app** before any public claim. The tests, security work and privacy features in the repository do **not** transfer. See `11`. |
| F4 | **Legal and regulatory advice: yes**, to be obtained. | Brief for counsel in `11`. Budgeted below. |
| F5 | **Hard budget cap ≈ €2,400** for 90 days (excluding founder time), **released by phase**; **founder time < 10 hours/week**. | Smaller volumes (below); no ads; no security review; **no real health data pilot inside the 90 days**. |

### Budget released by phase (hard caps)

| Phase | Cap | Typical use | Release condition |
|---|---|---|---|
| 1 (days 1–30) | **≤ €900** | €300 interview vouchers (8–10 × €30); €400 first scoped legal consultation (privacy notice, wellness boundary); €60 domain and tools; €140 Italian copy review | Start now |
| 2 (days 31–60) | **≤ €900** | €50 staging hosting; €400 clinical advisor honorarium (or volunteer); €350 legal scoping (processor agreement, DPIA outline); €100 tools and review | **Gate 1 passed** |
| 3 (days 61–90) | **≤ €600** | €150 test incentives; €25 hosting; €250 legal follow-up; €175 reserve | **Gate 2 passed** |
| **Total** | **≤ €2,400** | | A single spend above €300 needs a written decision in `00` |

### Time budget and what it allows (≈ 130 hours over 13 weeks)
- **Days 1–30 (≤ ~40 h):** **8 patient interviews, 4 clinician interviews, 2 association conversations, 1 email-only landing page, a place-data audit in 2 cities, and a concierge Care Summary for 3 volunteers.** Content: **LinkedIn only, 2 posts/week, no reels, one article** (`06` lean option reduced further).
- **Volumes are small: every result is "indicative only".** Do not generalise from 8 interviews.
- **Extension rule:** if the Gate 1 sample is not reached because of time, Phase 1 may be extended **once, by up to 14 days**; no other deadline moves.
- **Hours cap:** if two consecutive weeks exceed **10 h**, cut scope (content first, then audit) instead of extending hours.

### What this budget can and cannot prove
- **Can validate:** problem recognition, clinician and association interest, a named sponsor, usability on a prototype, and whether the Base44 app passes a basic review.
- **Cannot validate:** **retention with real health data.** A real-data pilot needs a completed DPIA, processor agreements and a clinical sign-off (about **€2,500–€6,000 more** in legal work alone, `docs/LAUNCH_CHECKLIST.md`). **Decide the pilot budget at Gate 2, not now.** Until then, any "retention" figure from fictional data is **not valid evidence**, so **Gate 3 can only be a conditional "continue to a funded pilot" or "pause".**

### Revised thresholds (fixed now, before results; indicative only given the sample)

| Gate | Evidence required | Stop / change rule |
|---|---|---|
| **Gate 0 (day 14)** | ≥ 6 patient interviews done | **If fewer than 30% (under 2 of 6) recognise** the visit-preparation or under-discussed-symptom problem: change segment (D) or message; if still under 30% after 6 more, **stop this segment** |
| **Gate 1 (day 30, or day 44 with the one extension)** | ≥ 8 patient and ≥ 4 clinician interviews; **≥ 4 of 8 patients** recognise the problem unprompted; **≥ 2 of 4 clinicians** would read a patient summary and **≥ 1 would consider a pilot**; **≥ 2 association or clinic-leader conversations with ≥ 1 offering a concrete next step**; concierge test: **≥ 2 of 3** volunteers bring the summary to a visit | **If no clinician, association or funder offers any next step (even a free pilot) → do not start Phase 2; pivot to a free, association-supported tool or pause.** |
| **Gate 2 (day 60)** | Base44 app review (`11`) **passed** or risks accepted in writing; privacy notice and consent wording reviewed by counsel; wellness/medical-device advice obtained; clinical advisor engaged; staging usable with fictional data; usability: **≥ 7 of 10** complete the core tasks | **If counsel and a clinical advisor are not engaged by day 45 → no real-data work; if still none by day 60 → pause.** Decide the pilot budget here |
| **Gate 3 (day 90)** | ≥ 1 **named sponsor** (clinic, association or funder) willing to design and fund or host a pilot, with a draft agreement; no privacy or safety incident | **No named sponsor at day 90 → pause spending** and keep only low-cost interviews |

### Hard stop rules (decided in advance)
1. **Spending cap reached (≈ €2,400, or a phase cap)** → stop and review; do not borrow from the next phase.
2. **Any privacy or safety incident** (data exposed, medical advice given by the tool, a consent breach) → **pause all public activity** until fixed and documented.
3. **Base44 review fails a high-severity item** (e.g. one user can see another's data, health data hosted outside an acceptable region without a contract, no deletion) and cannot be fixed within 30 days → **do not enrol users or publish a waitlist for that app**.
4. **Counsel or clinical advisor not engaged** by the dates above → no real data.
5. **Two quarters with no sponsor and no repeated use** (checked at day 90 and again at day 180) → stop development.

---

## 2. Roles

**Founder** (interviews, partners, content, decisions) · **Dev** (AI-assisted engineering; ask before architecture changes) · **Clinical advisor** (to recruit) · **Counsel/DPO** (to engage) · **Native editor** (Italian copy, if needed).

---

## 3. Weekly execution plan

Time = founder hours unless stated. Priority: **P0** must, **P1** should, **P2** if time.

### Phase 1 — Days 1–30: Validate

| Wk | Objective | Tasks | Pri | Owner | Time | Dependencies | Deliverable | KPI | Success threshold | Decision gate |
|---|---|---|---|---|---|---|---|---|---|---|
| **1** (D1–7) | Get ready to talk to people | Finalise interview guide and consent sheet (`07`); build 20-person target list (nurses, association, patient groups); publish LinkedIn intro (D1 in `06`); ask 2 moderators for permission to listen; start landing page draft (`08`); begin searching for clinical advisor and counsel | P0 | Founder | 16 h | Positioning (`04`) | Guide, consent form, target list, page draft | Contacts reached out | ≥20 people contacted; ≥3 interviews booked | — |
| **2** (D8–14) | First patient and clinician evidence | 5 patient interviews (persona B/D) with prototype on Figma; 3 clinician interviews; place-data audit in city 1; content days 8–14 | P0 | Founder | 18 h | Week 1 | Interview notes (anonymous), audit sheet | Interviews completed; % reporting the target problem | ≥8 interviews done; ≥50% name visit preparation or under-discussed symptoms unprompted | **Gate 0 (D14):** if <30% recognise the problem after ≥8 interviews, change segment or message before continuing |
| **3** (D15–21) | Broaden and test message | 5 more patient interviews; 3 more clinicians; landing page live (email-only waitlist; 2-way hero test); audit cities 2–3; start concierge summaries (consented, 2–3 patients) | P0 | Founder | 20 h | Counsel review of privacy notice (minimum) | Live page, audit result, 2–3 concierge summaries | Interviews; visit→waitlist; audit accuracy | ≥14 interviews total; ≥5% visit→waitlist; audit ≥8/10 in ≥2 cities | — |
| **4** (D22–30) | Decide whether to continue | Finish 15+ patient and 8+ clinician interviews; association conversations (3); complete concierge test (5–8); synthesise in `09`; update `00`; draft pilot outline | P0 | Founder | 20 h | Weeks 1–3 | Findings report; pilot outline; go/no-go memo | See KPIs §5 | See **Gate 1** | **Gate 1 (D30)** |

**Parallel (low effort):** landing-page analytics events, privacy notice draft, hosting decision, clinical advisor shortlist.

### Phase 2 — Days 31–60: Build and test (only if Gate 1 passes)

**Smallest useful MVP (to build/refine, nothing else):** (1) **staging deployment** with fictional data; (2) **Care Summary** refinements from interviews (clearer, editable, clinician-readable); (3) **quick check-in** and **Tell VIVIA** already exist: only tune; (4) **simplified onboarding** (3 questions); (5) **privacy notice, consent wording, data deletion tested end to end**; (6) **privacy-light usage events** for activation and retention; (7) **Italian copy review**; (8) pilot cohort handling (invites, withdrawal). Document extraction only if interviews show it is valued; otherwise keep it hidden.

| Wk | Objective | Tasks | Pri | Owner | Time | Dependencies | Deliverable | KPI | Success threshold | Decision gate |
|---|---|---|---|---|---|---|---|---|---|---|
| **5** (D31–37) | Decide scope and deploy staging | Write MVP spec from findings; deploy staging (EU region) with fictional data; set up backups and uptime check; start DPIA with counsel; engage clinical advisor | P0 | Founder + Dev | 14 h + dev | Gate 1; hosting budget | Spec; staging URL; DPIA started | Staging healthy; checks pass | `/api/health` OK; tests green in CI | — |
| **6** (D38–44) | Fix top usability issues | Prototype test with 10 patients (task completion); 3-question onboarding; summary edits; clinician review of wording | P0 | Founder + Dev | 14 h + dev | Week 5 | Updated prototype; test results | Task success; time to first value | ≥80% complete check-in in <60 s; ≥70% explain source labels | — |
| **7** (D45–51) | Security and data-protection foundations | Review `docs/SECURITY.md` items for production (secrets, backups, rate limits, logging); test export/deletion; draft processor agreements; prepare consent materials; external security check scoped | P0 | Dev + Counsel | 8 h + dev | DPIA draft | Security checklist status; DPA drafts | Open high-severity items | **0 open high-severity** items that apply to a pilot | — |
| **8** (D52–60) | Recruit and brief a consented beta cohort | Recruit 15 volunteers via nurses/associations; consent session; start 14-day diary; baseline questionnaire (preparedness, no health data in marketing) | P0 | Founder | 18 h | Counsel sign-off on privacy notice; **launch checklist §1–§4 for any real data** | Cohort enrolled; onboarding done | Enrolled; onboarding completion | ≥12 enrolled; ≥75% complete onboarding | **Gate 2 (D60)** |

### Phase 3 — Days 61–90: Evaluate adoption

| Wk | Objective | Tasks | Pri | Owner | Time | Dependencies | Deliverable | KPI | Success threshold | Decision gate |
|---|---|---|---|---|---|---|---|---|---|---|
| **9** (D61–67) | Run the pilot | Cohort uses app; daily-use support; exit micro-surveys; weekly review | P0 | Founder | 14 h | Gate 2 | Usage data (privacy-light) | Weekly active users; day-1 and day-7 retention | ≥60% active in week 1 | — |
| **10** (D68–74) | Observe first appointments | Ask participants to bring the summary to their next visit; collect feedback from patient and, if possible, clinician; clinician pilot discovery meetings (`07` C) | P0 | Founder | 16 h | Week 9 | Visit feedback; 2–3 clinic meetings | Summaries generated; used in visits | ≥50% of due participants generate a summary; ≥3 use it in a visit | — |
| **11** (D75–81) | Measure retention and trust | Day-14 retention; interviews (8) on trust, effort, privacy; willingness-to-pay conversation (pre-order test only after legal check, `05` #11) | P0 | Founder | 16 h | Week 10; counsel for pre-sale | Retention data; interview synthesis | 14-day logging days; trust rating; WTP evidence | ≥50% log ≥8 of 14 days; WTP signal as defined in §5 | — |
| **12** (D82–88) | Institutional discovery | 3–5 meetings with clinics/associations; pilot proposal reviewed; funding conversations | P0 | Founder | 14 h | Week 11 | Pilot proposal with named sponsor | Sponsors | ≥1 named sponsor willing to design a pilot | — |
| **13** (D89–90) | Decide | Compile evidence in `09`; update `00`; run the Gate 3 review with advisors | P0 | Founder + advisors | 8 h | All | Decision memo | — | See **Gate 3** | **Gate 3 (D90): continue / narrow / pivot / pause** |

---

## 4. Decision gates

Each gate needs **all** items in the "evidence" column and **no unresolved item** in the "readiness" column, otherwise the answer is "not yet".

### Gate 1 — Continue after Day 30
| Evidence (proposed thresholds, fixed before starting) | Readiness gate |
|---|---|
| ≥15 patient interviews and ≥8 clinician interviews completed | **Privacy:** no real health data collected; privacy notice drafted |
| ≥50% of patients report preparing for visits or under-discussed symptoms as a real problem, unprompted | **Security:** no production system holding health data |
| ≥5 of 8 clinicians would read a patient summary; ≥2 would consider a pilot | **Clinical safety:** a clinical advisor identified; wording issues logged |
| ≥5% visit→waitlist (organic/association traffic), cost per sign-up under ~€10 if ads used | **Regulatory:** wellness position unchanged; legal adviser engaged |
| Concierge test: ≥4 of 5–8 used the summary in a visit | |
**If not met:** narrow the segment (stoma), reposition, or pause build; do not move to Phase 2.

### Gate 2 — Expand development after Day 60
| Evidence | Readiness gate |
|---|---|
| Staging live; tests green; task success ≥80% | **Privacy:** privacy notice and consent wording approved by counsel; export and deletion tested end to end; DPIA completed or accepted risk documented for the pilot scope |
| ≥12 beta participants enrolled | **Security:** no open high-severity item; backups tested; processor agreements signed (hosting, any AI vendor) |
| Interview themes agree on one clear next improvement | **Clinical safety:** clinician reviewed wording including the mood question; stop rule defined |
| | **Regulatory:** written advice on the wellness/medical-device boundary for the claims actually used |
**If not met:** do not enrol real users; continue with fictional-data tests only. **Limit:** retention and usage measured on fictional data are **not valid evidence** of real-world retention, so Gate 3 cannot be passed on them.

### Gate 3 — Continue toward commercial launch after Day 90
| Evidence | Readiness gate |
|---|---|
| ≥50% of the cohort log ≥8 of 14 days; ≥50% generate a summary; ≥3 clinicians/patients report it used in a visit | **Privacy:** DPIA complete; no privacy incidents; deletion honoured |
| ≥1 named sponsor (clinic, association, funder) ready for a designed pilot (a patient pre-order is **not** a substitute; see §1b F1) | **Security:** independent review done, high findings fixed |
| Trust feedback: majority describe privacy controls as clear; no unresolved safety complaints | **Clinical safety:** clinical review complete; any AI path tested with a real key on synthetic documents and signed off |
| Unit economics plausible (§6): clear route to cover infrastructure and AI costs | **Regulatory:** advice documented; claims log clean |
**Outcomes:** *Continue* (all met) · *Narrow* (one segment passes) · *Pivot* (retention fails but clinicians want summaries; or stoma pulls) · *Pause* (no sponsor, no retention, no trust).

---

## 5. KPIs

| KPI | Definition | Target by phase |
|---|---|---|
| Interviews completed | Patient + clinician + partner | ≥15 + 8 + 3 by D30 |
| % reporting the target problem | Unprompted mention of visit prep / under-discussed symptoms | ≥50% |
| Waitlist conversion | Visits → email sign-up | ≥5% |
| Interview booking rate | Waitlist → interview | ≥30% |
| Onboarding completion | Starts → completes | ≥75% |
| Time to first value | Sign-up → first check-in or summary | <5 min |
| Task completion | Core tasks in prototype | ≥80% |
| Weekly active users | Pilot users active ≥1 day/week | ≥60% in week 1 |
| Meaningful repeat use | ≥8 logged days in 14 | ≥50% |
| 7-day / 30-day retention | Active in the window | Report; no target set (no baseline) |
| Summary-generation rate | Users who generate a summary / due for a visit | ≥50% |
| Trust and usability | Qualitative + 1–5 rating | Majority ≥4; list concerns |
| Willingness-to-pay evidence | Strongest signal per respondent: stated < behavioural < paid pre-order | ≥30% of reservers confirm at one price |
| Clinician pilot interest | Named sponsor | ≥1 |
Targets are **proposals**, not benchmarks; downloads and social engagement are **not** primary measures.

---

## 6. Financial model (all figures are estimates [E] or assumptions [A]; no current revenue)

**Not forecasts and not guaranteed.** The model's purpose is to show **what must be true** for the business to work.

### 6.1 90-day cash budget [E]

| Item | Lean | Base | Higher |
|---|---|---|---|
| Hosting and database (staging/pilot) | €50 | €70 | €75 |
| Domain, email, design, analytics tools | €30 | €60 | €100 |
| Interview incentives | €450 | €750 | €1,000 |
| Ads/recruitment tests | €300 | €1,000 | €2,000 |
| Legal / data-protection (notice, DPIA support) | €800 | €2,500 | €6,000 |
| Clinical advisor honorarium | €500 | €1,000 | €1,500 |
| Italian copy / translation review | €300 | €600 | €1,000 |
| Security review (scoped) | — | — | €1,500 |
| Contingency 10% | — | €598 | €1,317 |
| **Total (rounded)** | **≈ €2,400** | **≈ €6,600** | **≈ €14,500** |
*Founder time excluded.*

### 6.2 Run-rate at month 12 (illustrative; gated on passing Gates 1–3)

| Parameter | Conservative | Base | Optimistic | Basis |
|---|---|---|---|---|
| Active users | 150 | 600 | 2,000 | [A] consistent with `01` SOM ranges (0.5–3% of ~166k serviceable users over 3 years) |
| Paid conversion | 2% | 5% | 8% | [A] no benchmark |
| Price (test price, not validated) | €4.99/month | €4.99/month | €4.99/month | `07` test points |
| Paying users | 3 | 30 | 160 | computed |
| B2C revenue / month | ≈ €15 | ≈ €150 | ≈ €800 | computed |
| B2B revenue / month | €0 | ≈ €833 (**one** clinic at €10,000/yr) | ≈ €3,750 (three clinics at €15,000/yr) | [A]; **one UK contract for a competing app: £30,554 for one year** [V, `01`] — reference only |
| Hosting / infrastructure per month | €25 | €40 | €100 | [E] |
| AI and document-processing cost per month | ≈ €23 | ≈ €54 | ≈ €120 | [A]: 30% of users enable AI, cost €0.50 / €0.30 / €0.20 per AI-enabled user per month (**unmeasured**; the app logs AI runs, so measure it in the pilot) |
| Payment fees (3%) | ≈ €0.5 | ≈ €4.5 | ≈ €24 | [A] |
| **Gross profit / month** (revenue − AI − fees − infrastructure) | **≈ −€33** | **≈ +€885** | **≈ +€4,300** | computed |
| Gross margin | negative | ≈ 90% (driven by the single B2B contract) | ≈ 95% | computed |
| Customer acquisition | Not modelled: no CAC data. For consumer plans, LTV ≈ €40 (`01`), so CAC must stay well under ~€15–20 |

**What the numbers say (honestly):**
- **Consumer subscriptions alone do not cover even modest costs**: in the conservative case B2C revenue (≈ €15/month) is below AI and hosting costs; in the base case B2C revenue is ≈ €150/month.
- **All of the base-case profit comes from the one assumed clinic contract.** Without it, base-case gross profit would be about **+€51/month** (150 − 54 − 4.5 − 40). That is why the plan treats a payer other than the patient as the key hypothesis.
- **Break-even depends on what is being paid for:** covering **€100/month of fixed costs** needs ≈ **21 paying users**; covering **€1,000/month** needs ≈ **207**; a part-time founder wage of **€3,000/month** needs ≈ **620 payers or ≈ 3–4 clinics at €10,000/year (≈ 1 at €30,000)**; **€5,000/month** needs ≈ **1,033 payers or 6 clinics at €10,000** [E]. None of these is a forecast.

---

## 7. What to build in Phase 2 and what to refuse

(Detailed in §8.2.) The product already contains most workflow features; the work is **hardening, deploying, simplifying and measuring**, not adding.

---

## 8. Closing sections

### 8.1 Ten highest-priority actions
1. **Book 15 patient and 8 clinician interviews** (Italy), starting this week (`07`, `09`).
2. **Decide the codebase:** confirm the VIVIA repository is the product; park the Base44 app until reviewed.
3. **Engage counsel/DPO and a clinical advisor** (scope: privacy notice, consent wording, wellness boundary, wording review).
4. **Publish the landing page** (email-only waitlist; no health data) with a two-way hero test (`08`).
5. **Run the place-data audit** in 3 Italian cities.
6. **Run the concierge Care Summary test** with 5–8 consenting volunteers.
7. **Approach 3 patient associations** with the co-design invitation (`07` D).
8. **Fix the pass lines in writing** (Gates 1–3) before looking at results.
9. **Deploy staging** with fictional data only after Gate 1; set up backups and uptime check.
10. **Start the weekly review** with the founder dashboard (§8.4).

### 8.2 Five things to deliberately NOT build in the next 90 days
1. **Clinician portal** (no evidence a clinic will use or pay for it).
2. **Wearable / Apple Health / Health Connect integrations** (competitors have them; no validation).
3. **AI chat, coaching, flare prediction or any diagnostic feature** (regulatory and trust risk; no evidence).
4. **Native iOS/Android apps and App Store release** (heavy; review risk; needs validation first).
5. **Community/forum, food-photo scanner and more languages** (unvalidated; translation quality unreviewed). *Reminders only if interviews or the pilot show them to be the cause of drop-off.*

### 8.3 The most important evidence needed before investing more money
**Someone besides the patient will fund it, *and* people keep using it.** Concretely: **(a)** at least one named sponsor (clinic, association or funder) ready to design a paid or funded pilot (the founder chose this route on 2026-10-10); **and (b)** ≥50% of a pilot cohort logging ≥8 of 14 days with at least some bringing the summary to a real visit. Without (a) and (b) the product is a tool without a business model or without usage. **Note:** (b) cannot be shown with fictional data (§1b); it needs a funded real-data pilot.

### 8.4 Founder dashboard (one page, update weekly)

| Area | Metric | This week | Target / threshold | Status | Next action |
|---|---|---|---|---|---|
| **Learning** | Patient interviews (cumulative) | | 15 by D30 | | |
| | Clinician interviews (cumulative) | | 8 by D30 | | |
| | % reporting target problem | | ≥50% | | |
| | Partner conversations | | 3 by D30 | | |
| **Funnel** | Landing visits | | — | | |
| | Visit→waitlist | | ≥5% | | |
| | Waitlist→interview | | ≥30% | | |
| **Product** (after staging) | Onboarding completion | | ≥75% | | |
| | Time to first value | | <5 min | | |
| | Task completion | | ≥80% | | |
| | Weekly active users | | ≥60% | | |
| | Days logged / 14 | | ≥8 for ≥50% | | |
| | Summaries generated | | ≥50% of due | | |
| **Revenue evidence** | WTP signals (stated / behavioural / paid) | | ≥30% paid at one price | | |
| | Named sponsors | | ≥1 | | |
| **Readiness (gates)** | Privacy notice / consent approved | | Yes by D60 | | |
| | DPIA | | Done by D90 | | |
| | Security high-severity items open | | 0 | | |
| | Clinical advisor engaged / wording reviewed | | Yes by D60 | | |
| | Regulatory advice documented | | Yes by D60 | | |
| **Safety** | Unhandled medical-advice requests or complaints | | 0 | | |
| **Money** | Cash spent vs budget | | Within €2.4k–€6.6k | | |
| **Hours** | Founder hours vs plan | | ≤ 20 h/week | | |
| **Decision** | Next gate date and criteria met (x of y) | | | | |
