# 05 — Growth opportunity assessment

_Date: 2026-10-10. Sources of truth: `01-business-validation.md`, `02-customer-personas.md`, `03-competitive-analysis.md`, `04-positioning.md`, `docs/LAUNCH_CHECKLIST.md`. Tags: [V] verified · [E] estimate · [A] assumption · [H] hypothesis · [U] unknown._

> **Starting facts.** VIVIA has **no users, no revenue, no retention data, no acquisition cost, no demonstrated willingness to pay** [V, `00`]. The app is **not deployed** (hosting costs about €20–25/month, estimate). Nothing here is a forecast. Cost ranges are my estimates excluding founder time.

---

## 1. Scoring system

Six scores, **1–5, where 5 is always favourable to VIVIA** (so "complexity", "cost", "time to learn" and "risk" are scored so that a high number means *easy*, *cheap*, *fast* and *low risk*).

| Score | 5 means | 1 means |
|---|---|---|
| **Impact** (if it works) | Changes whether VIVIA can become a business or helps many patients | Marginal |
| **Evidence confidence** | Several credible sources or direct data support the idea | Pure speculation |
| **Complexity** | Easy: no new engineering | Hard: major build |
| **Cost / resources** | Under ~€300 and few hours | Over ~€5,000 or needs a team |
| **Time to learn** | Result in ≤2 weeks | More than 6 months |
| **Regulatory / privacy risk** | Low: no health data handled | High: sensitive data, claims, institutions |

**Rules used:**
- **Impact is not inflated for speculative revenue.** Revenue ideas score impact 3 or less unless evidence supports them; no revenue idea has a confidence above 2 because willingness to pay is unproven [V, `01`].
- **Learning value ranks first**: experiments that settle H1 (visit summary), H3 (place data), H4 (a payer) come first.
- **Priority = Impact + Confidence + Time-to-learn + Cost + Risk + Complexity**, max 30, then I apply judgement. Totals are an aid, not a forecast.

---

## 2. Summary table (20 opportunities)

| # | Opportunity | Area | Horizon | Imp. | Conf. | Cmpl. | Cost | Learn | Risk | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Patient discovery interviews via nurses and associations | Acquisition | Near | 5 | 4 | 5 | 5 | 4 | 4 | **27** |
| 2 | Clinician interviews and visit observation | Partnerships | Near | 5 | 3 | 5 | 5 | 4 | 4 | **26** |
| 3 | Landing page + privacy-light waitlist | Acquisition | Near | 4 | 3 | 5 | 4 | 4 | 5 | **25** |
| 4 | Click-through prototype test (Figma) | Onboarding | Near | 3 | 3 | 5 | 5 | 5 | 5 | **26** |
| 5 | 14-day diary pilot | Retention | Near | 5 | 3 | 3 | 4 | 4 | 3 | **22** |
| 6 | Concierge Care Summary for 5–8 patients | Activation | Near | 5 | 3 | 4 | 5 | 4 | 3 | **24** |
| 7 | Pre-visit nudge (3 days before) | Engagement | Near | 3 | 2 | 4 | 5 | 4 | 4 | **22** |
| 8 | Place-data audit and community verification | Real-world support | Near | 4 | 3 | 4 | 5 | 5 | 5 | **26** |
| 9 | Patient-association partnership (Italy) | Referrals / advocacy | Near | 4 | 3 | 4 | 5 | 3 | 4 | **23** |
| 10 | Visit-preparation educational content | Content / SEO | Near | 3 | 3 | 4 | 4 | 3 | 4 | **21** |
| 11 | Willingness-to-pay pre-order test | Freemium / premium | Near | 3 | 2 | 4 | 4 | 4 | 4 | **21** |
| 12 | Three-question onboarding experiment | Onboarding | Near | 3 | 2 | 4 | 5 | 4 | 5 | **23** |
| 13 | IBD-centre pilot (clinic) | Clinics / hospitals | Long | 5 | 2 | 2 | 3 | 2 | 2 | **16** |
| 14 | Clinician / clinic subscription | B2B SaaS | Long | 4 | 2 | 2 | 3 | 1 | 2 | **14** |
| 15 | Shareable summary link with "prepared with VIVIA" | Product-led growth | Long | 3 | 2 | 4 | 4 | 3 | 3 | **19** |
| 16 | Staged multilingual expansion (FR/ES/DE, then AR) | Multilingual | Long | 3 | 2 | 3 | 3 | 3 | 4 | **18** |
| 17 | Italian SEO programme | SEO | Long | 3 | 2 | 3 | 3 | 1 | 4 | **16** |
| 18 | Consented, ethics-approved research partnership | Ethical research | Long | 3 | 2 | 2 | 3 | 1 | 1 | **12** |
| 19 | Operations automation (support, document queue, cost controls) | Automation | Long | 2 | 2 | 3 | 3 | 2 | 3 | **15** |
| 20 | Adjacent workflows (infusion/appointment coordination, transition to adult care) | Expansion | Long | 3 | 1 | 2 | 3 | 1 | 3 | **13** |

*Employer and insurer partnerships were considered and left out: no evidence of fit (see `01` §5).*

---

## 3. Near-term validation opportunities (1–12)

### 1. Patient discovery interviews via nurses and associations
1. **Problem:** we don't know if visit preparation is a real pain for target patients (H1).
2. **Experiment:** 12–15 interviews; show the prototype and a fictional Care Summary; script in `07`.
3. **Audience:** adults on long-term therapy in Italy; 3–4 people with a stoma.
4. **Resources:** founder, interview guide, consent sheet, recruiting contacts.
5. **Cost [E]:** €0–€750 (€30–50 vouchers); assumes no paid recruiter.
6. **Time to learn:** 2–3 weeks.
7. **Success:** ≥60% describe the problem unprompted **and** ≥50% would use the summary before their next visit (proposed thresholds).
8. **Main risk:** self-selected, enthusiastic participants; leading questions.
9. **If successful:** run concierge test (#6) with 5 of them.
10. **Stop if:** fewer than 30% recognise the problem after 10 interviews.

### 2. Clinician interviews and visit observation
1. **Problem:** unknown whether clinicians would read patient-prepared data (H4).
2. **Experiment:** 8–10 interviews with gastroenterologists and IBD nurses; show summary; ask about workflow, liability, integration.
3. **Audience:** hospital and private IBD specialists in Italy.
4. **Resources:** warm introductions (nurses, association, colleagues).
5. **Cost [E]:** €0–€500.
6. **Time:** 3–4 weeks.
7. **Success:** ≥5 say they would read it in a visit **and** ≥2 would test it in a pilot.
8. **Risk:** clinicians are polite; interest ≠ action.
9. **If successful:** design a small pilot with one clinic (#13).
10. **Stop if:** no clinician would test it even for free.

### 3. Landing page and privacy-light waitlist
1. **Problem:** unknown demand and message fit.
2. **Experiment:** one page (see `08`) describing the prototype honestly; waitlist asks **email only** (no health data); measure visit→waitlist.
3. **Audience:** adults with IBD in Italy via patient groups and a small, policy-compliant test.
4. **Resources:** page, analytics without personal data.
5. **Cost [E]:** €300–€2,000 (domain, tool, small ads).
6. **Time:** 3–4 weeks.
7. **Success:** visit→waitlist and cost per signup set before launch; a proposed floor is **≥5% visit-to-signup from organic/association traffic**, and cost per signup **under ~€10** (assumption).
8. **Risk:** health-ad platform restrictions; vanity signups.
9. **If successful:** invite signups to interview/testing, not to a paywall.
10. **Stop if:** <1% conversion after 300+ qualified visits.

### 4. Click-through prototype test
1. **Problem:** unknown if the flows are understandable.
2. **Experiment:** 10 patients complete check-in, Tell VIVIA, document review, summary (Figma prototype).
3. **Audience:** persona B and D.
4. **Resources:** Figma prototype exists; screen-sharing.
5. **Cost [E]:** €0–€500.
6. **Time:** 1–2 weeks.
7. **Success:** ≥80% complete a check-in in <60 s; ≥70% correctly explain source labels.
8. **Risk:** prototype ≠ real app.
9. **If successful:** fix top three friction points; proceed to #5.
10. **Stop if:** <50% complete core tasks after changes.

### 5. 14-day diary pilot
1. **Problem:** retention is the biggest risk (dropout benchmark 43% [V]).
2. **Experiment:** 15 volunteers use the app for 14 days, informed consent, minimal data, option to use fictional entries.
3. **Audience:** persona B.
4. **Resources:** **hosted app** (not yet deployed), consent form, privacy notice, a clinician advisor. Launch-checklist sections 1–4 must be met for real health data.
5. **Cost [E]:** €0–€1,000 plus hosting ≈ €20–25/month.
6. **Time:** 3 weeks.
7. **Success:** ≥50% log on ≥8 of 14 days; median check-in <60 s.
8. **Risk:** data-protection duties (DPIA); small sample.
9. **If successful:** extend to 30 days and add reminders.
10. **Stop if:** <25% reach 8 logged days.

### 6. Concierge Care Summary
1. **Problem:** unclear if the summary changes a visit.
2. **Experiment:** prepare summaries by hand for 5–8 consenting patients before real visits; collect feedback from patient and, if possible, clinician.
3. **Audience:** persona B (and one persona D).
4. **Resources:** template, consent, secure sharing.
5. **Cost [E]:** €0–€500.
6. **Time:** 3–4 weeks.
7. **Success:** ≥4 use it in the visit; ≥3 clinicians say it was useful.
8. **Risk:** handling sensitive data manually; selection bias.
9. **If successful:** automate only the parts users valued.
10. **Stop if:** fewer than 2 patients bring it to the visit.

### 7. Pre-visit nudge
1. **Problem:** engagement tied to appointment dates [H].
2. **Experiment:** manual message 3 days before a visit asking "what do you want to ask?" (opt-in).
3. **Audience:** pilot participants.
4. **Resources:** consent, messaging channel the patient chooses.
5. **Cost [E]:** €0–€100.
6. **Time:** 4 weeks (depends on visit dates).
7. **Success:** ≥50% reply or open the summary within 3 days.
8. **Risk:** intrusive; reminders are not built.
9. **If successful:** build optional push/email reminder.
10. **Stop if:** <20% engagement or opt-outs >20%.

### 8. Place-data audit
1. **Problem:** the toilet/stoma promise depends on accurate data (H3).
2. **Experiment:** audit 3 cities, 10 spot checks each; record accuracy of "nearest open toilet" and stoma flags; test OSM import.
3. **Audience:** internal; later local volunteers.
4. **Resources:** 3–5 days, OSM data, phone.
5. **Cost [E]:** €0–€200.
6. **Time:** 1 week.
7. **Success:** ≥8/10 correct per city.
8. **Risk:** inaccurate data harming trust.
9. **If successful:** recruit stoma nurses/association volunteers to verify.
10. **Stop if:** <6/10 in two cities; then partner for data or remove the map claim.

### 9. Patient-association partnership (Italy)
1. **Problem:** trust and reach.
2. **Experiment:** 3 conversations with associations (e.g. national IBD associations); propose a co-design workshop, not a product launch.
3. **Audience:** association leaders.
4. **Resources:** Playbook D (`07`).
5. **Cost [E]:** €0–€300.
6. **Time:** 4–6 weeks.
7. **Success:** ≥1 agrees to co-design or share an interview invitation.
8. **Risk:** appears commercial; slow decisions.
9. **If successful:** joint educational content and recruitment.
10. **Stop if:** all decline or require conditions that compromise independence.

### 10. Visit-preparation educational content
1. **Problem:** patients may not know what to prepare.
2. **Experiment:** 4 articles/short posts on visit preparation, documents, and questions (see `06`); measure interview requests, not likes.
3. **Audience:** Italian-speaking patients.
4. **Resources:** writer, clinician review.
5. **Cost [E]:** €0–€600.
6. **Time:** 4–8 weeks.
7. **Success:** ≥15 qualified interview or waitlist requests.
8. **Risk:** medical accuracy; time.
9. **If successful:** expand to a content library.
10. **Stop if:** no qualified response after 8 pieces.

### 11. Willingness-to-pay pre-order test
1. **Problem:** payers unknown.
2. **Experiment:** show 3 price points with "reserve", then ask for a paid pre-order or refundable deposit from a small group.
3. **Audience:** interviewees and waitlist.
4. **Resources:** payment link, clear refund terms.
5. **Cost [E]:** €300–€1,500.
6. **Time:** 3 weeks.
7. **Success:** a price at which ≥30% of reservers confirm a paid pre-order.
8. **Risk:** selling an unfinished product; regulatory and consumer-law issues for pre-sales (check).
9. **If successful:** design the premium tier.
10. **Stop if:** no price attracts any paid commitment; drop consumer subscription.

### 12. Three-question onboarding experiment
1. **Problem:** onboarding length may cause drop-off.
2. **Experiment:** compare current onboarding with a three-question version in the pilot.
3. **Audience:** pilot users.
4. **Resources:** small code change, ask before changing production code.
5. **Cost [E]:** €0–€200.
6. **Time:** 2–3 weeks.
7. **Success:** onboarding completion increases by an amount agreed beforehand (suggest +15 points).
8. **Risk:** small sample; confounds.
9. **If successful:** adopt as default.
10. **Stop if:** no difference.

---

## 4. Long-term expansion strategies (13–20)

These depend on near-term results and are **not** to be built now.

### 13. IBD-centre pilot
1. **Problem:** institutions' operational problems unknown.
2. **Experiment:** a 3-month pilot with one centre, designed with clinicians, patient consent, agreed measures (not claimed time savings).
3. **Audience:** hospital IBD department.
4. **Resources:** clinical sponsor, DPIA, security documentation, support.
5. **Cost [E]:** €5,000–€20,000 including legal and data-protection work.
6. **Time:** 6–9 months.
7. **Success:** ≥30 patients enrolled; clinician rates usefulness ≥4/5 in ≥60% of visits where used (proposed).
8. **Risk:** procurement, liability, integration, device-status questions.
9. **If successful:** extend to second centre and define price.
10. **Stop if:** sponsor withdraws or legal review blocks it.

### 14. Clinician / clinic subscription (B2B SaaS)
1. **Problem:** a paying customer is needed.
2. **Experiment:** after #13, offer a paid second-year contract; reference point: one NHS contract for a competitor was £30,554 for a year [V].
3. **Audience:** hospital departments.
4. **Resources:** references, security pack, support.
5. **Cost [E]:** €10,000+ (sales time).
6. **Time:** 9–12 months.
7. **Success:** ≥1 paid contract.
8. **Risk:** long cycles; each hospital differs.
9. **If successful:** package for similar centres.
10. **Stop if:** no centre pays after two pilots.

### 15. Shareable summary link with a quiet "prepared with VIVIA" line
1. **Problem:** how clinicians learn about the tool.
2. **Experiment:** add an optional, patient-controlled footer line on shared summaries; track clinician-initiated inquiries.
3. **Audience:** clinicians receiving summaries.
4. **Resources:** small code change (ask first).
5. **Cost [E]:** €0–€300.
6. **Time:** 3+ months (needs users).
7. **Success:** ≥5 clinician inquiries.
8. **Risk:** appears like advertising on a medical document; privacy.
9. **If successful:** invite clinicians to a pilot.
10. **Stop if:** patients object or no inquiries.

### 16. Staged multilingual expansion
1. **Problem:** other-language users are poorly served [P, `03`].
2. **Experiment:** French first (largest next market in scope), with native clinical review, then Spanish, German; Arabic last (RTL testing).
3. **Audience:** target-language patients.
4. **Resources:** reviewers, partners.
5. **Cost [E]:** €500–€2,000 per language.
6. **Time:** 2–3 months each.
7. **Success:** 10 interviews and 5 pilot users per language.
8. **Risk:** wrong medical wording.
9. **If successful:** language-specific content and partners.
10. **Stop if:** no partner or reviewer.

### 17. Italian SEO programme
1. **Problem:** discoverability.
2. **Experiment:** build topic pages after content validated.
3. **Audience:** searchers in Italian.
4. **Resources:** writer, clinician reviewer.
5. **Cost [E]:** €1,000–€4,000.
6. **Time:** 6+ months.
7. **Success:** organic visits and interview requests; thresholds after baseline.
8. **Risk:** competing with established health sites.
9. **If successful:** expand.
10. **Stop if:** no traffic after 6 months.

### 18. Consented, ethics-approved research partnership
1. **Problem:** funding and evidence.
2. **Experiment:** with a clinical research group, a consented, aggregated, ethics-approved study; **no data sale**.
3. **Audience:** research institutions.
4. **Resources:** ethics approval, legal, data-protection officer.
5. **Cost [E]:** €5,000+.
6. **Time:** 12+ months.
7. **Success:** approved protocol and funding source.
8. **Risk:** erodes trust; re-identification; sponsor influence.
9. **If successful:** publish methods and findings.
10. **Stop if:** the sponsor requires patient-level access without explicit consent.

### 19. Operations automation
1. **Problem:** support and document processing cost.
2. **Experiment:** background queue for documents, canned answers, cost caps on AI.
3. **Audience:** internal.
4. **Resources:** engineering.
5. **Cost [E]:** €0–€3,000 of effort.
6. **Time:** 2–3 months.
7. **Success:** AI cost per active user within the budget in `10`.
8. **Risk:** over-engineering before users exist.
9. **If successful:** keep.
10. **Stop if:** fewer than 100 active users (no value yet).

### 20. Adjacent workflows
1. **Problem:** infusion and appointment coordination; transition from paediatric to adult care.
2. **Experiment:** interviews only, no build.
3. **Audience:** nurses, young adults.
4. **Resources:** interviews.
5. **Cost [E]:** €0–€500.
6. **Time:** 2–3 months.
7. **Success:** one workflow named unprompted by ≥5 respondents.
8. **Risk:** distraction; paediatric data raises consent and regulatory issues.
9. **If successful:** prototype.
10. **Stop if:** no clear need.

---

## 5. Five highest-priority experiments for the next 30 days

Chosen for **learning value, feasibility without hosting, and low privacy risk**; none monetises sensitive data.

| Priority | Experiment | Why now | Decision it informs |
|---|---|---|---|
| 1 | **#1 Patient interviews (12–15)** | Cheapest evidence on H1; shapes everything | Persona and message |
| 2 | **#2 Clinician interviews (8–10)** | Needed to know if a payer exists | B2B or free-tool path |
| 3 | **#6 Concierge Care Summary (5–8)** | Tests the core value in a real visit | Build summary features or not |
| 4 | **#8 Place-data audit (3 cities)** | A one-week check on a risky promise | Keep or cut the map claim |
| 5 | **#3 Landing page + waitlist (email only)** | Gives recruitment and message data without health data | Recruitment channel and wording |

**Why #4 (prototype test, total 26) and #8 (26) are treated differently:** #8 is in the list. #4 is **folded into #1** (the prototype is shown during the patient interviews), so it is not a separate experiment. #3 and #6 score slightly lower on totals (25, 24) but test the core hypotheses (message fit and real-visit value), which the totals do not weight.

**Not in the 30 days:** #5 (needs hosting and data-protection readiness), #11 (pre-orders need legal review), #13–#20.

**Dependencies:** #1 and #2 need warm introductions (nurses, association). #3 needs `08` and `04` wording. #6 needs consent forms and a clinician advisor.
