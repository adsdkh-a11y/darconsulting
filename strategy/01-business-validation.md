# 01 — Business idea validation

_Date: 2026-10-10 (all "accessed" dates below). Evidence tags: **[V]** verified in a source · **[E]** estimate (calculation shown) · **[A]** assumption · **[H]** hypothesis · **[U]** unknown._

> **Evidence limits (read first).** Web pages could not be opened in this environment (direct fetches were blocked), so every sourced figure comes from **search-result summaries**, not from reading the original page. Re-check each figure against its source before quoting it externally. No customer interview, survey or pilot has been run; nothing here comes from VIVIA users. Population figures for the four countries are approximate and were **not** re-sourced today.

---

## 1. Verdict (short)

**Proceed with conditions — low confidence.**
- The **problem is real and well documented** (urgency, fatigue, pain and psychological burden, often ignored in consultations).
- The **consumer-subscription business is not supported**: the revenue it can plausibly generate is small (§3.4), patients in a related survey did not want to pay, and free or partner-funded competitors exist.
- A **viable business, if any, probably needs a payer other than the patient** (clinic, hospital, patient organisation, or a funded programme). That is **unproven** for VIVIA.
- The product is **broad and untested with users**; the cheapest next step is evidence, not code (§6).

Conditions to continue beyond 90 days are in §7.

---

## 2. Problem validation

### 2.1 Patients

| Problem | Evidence | Tag | Frequent or "interesting"? |
|---|---|---|---|
| **Bowel urgency / incontinence** | International surveys report urgency in **>80% of ulcerative-colitis patients**, regardless of treatment status; urgency is **not part of the commonly used clinical activity indices**. In the IBD-BOOST survey (UK), up to **75%** reported difficulty with continence while in remission and **53%** "definitely" wanted help for incontinence. | [V] | **Frequent** |
| **Fatigue** | IBD-BOOST (8,486 participants): **41%** fatigue in remission; **56%** definitely wanted help. | [V] | **Frequent** |
| **Abdominal pain** | IBD-BOOST: **62%** pain in remission; **42%** definitely wanted help. | [V] | **Frequent** |
| **Psychological burden** | Same analysis: **56%** reported depression (27% at clinically relevant levels) and **49%** anxiety (20%). Authors state these are under-diagnosed. Crohn's survey: psychological support generally judged insufficient. | [V] | **Frequent** |
| **Symptoms not addressed in consultations** | Qualitative work reports fatigue, pain and continence symptoms are often ignored in consultations, which focus on inflammation; a narrative review attributes this partly to clinician time, resources and awareness. | [V] | **Frequent** (clinic-side cause) |
| **Wanting more say in treatment** | About **40%** of respondents in a Crohn's survey wanted more involvement in treatment decisions. | [V] | Moderate |
| **Scattered records (reports, labs, medication history)** | Not quantified in the sources found. Plausible for patients seen across several services. | [H] | Unknown frequency |
| **Finding a toilet / planning outings and travel** | Consistent with urgency prevalence above; no direct survey on toilet-finding behaviour found. | [H] | Likely frequent, unquantified |

Sources: NIHR BioResource IBD-BOOST page (bioresource.nihr.ac.uk/studies/nbr34); ECCO abstract DOP59 (ecco-ibd.eu); PMC6206540, PMC12371981; PubMed 39736517; Frontiers in Medicine 2024 (10.3389/fmed.2024.1416054); all via search summaries, accessed 2026-10-10. UK-based samples; European transferability is **[A]**.

**Reading:** the best-evidenced pains (urgency, fatigue, pain, mental health) are **symptoms**, which an app can **record and help communicate** but not treat. VIVIA's strongest legitimate claim is therefore about **making these under-discussed symptoms visible and discussable**, not fixing them.

### 2.2 Caregivers
No evidence found on caregiver needs or purchasing behaviour. **[U]** Do not design for caregivers until interviews show a distinct need (parents of children with IBD are a separate, regulated-sensitive case).

### 2.3 Gastroenterologists and IBD teams
| Problem | Evidence | Tag |
|---|---|---|
| Limited consultation time, resources and awareness for non-inflammatory symptoms | Narrative review summarised via search | [V] (weak: one summary) |
| Appointment length, data-review burden, willingness to read patient-generated data | **Not found** in these searches | [U] |
| Value of structured patient-reported data | One small study (King's College Hospital, 54 patients, 6 months) reported a **47%** reduction in routine outpatient appointments with a self-management app (My IBD Care). Small, single-centre, vendor-associated; **do not generalise**. | [V] (low strength) |

---

## 3. Market demand (Italy, France, Germany, Spain)

### 3.1 Number of patients — sourced figures

| Figure | Tag | Source (via search; accessed 2026-10-10) |
|---|---|---|
| Europe: **2.5–3 million** people with IBD (about 0.4%), direct healthcare cost €4.6–5.6 billion/year | [V] | Burisch et al. (ECCO-EpiCom) and Pellino et al. 2023, as reported in search summary |
| Europe: "over **2.2 million**" (ECCO press page) and "more than **3 million** in the EU" (same page) — sources disagree | [V] | ecco-ibd.eu press page; World IBD Day / EFCCA page |
| **Germany:** IBD prevalence **744/100,000** (Crohn's 322, UC 412), 2010, from insurance data, **actively treated** cases only; +42% in 2001–2010 | [V] | Germany insurance-based study (2014) via search |
| **Italy:** **321/100,000** in one health district (Bra), 2021; incidence rose from 6.7 to 18.0/100,000/yr (2001–06 → 2016–21). Regional, not national | [V] | Italian regional study via search |
| **Spain:** incidence **16/100,000 person-years** (CD 7.5, UC 8.0), national registry covering 22M inhabitants, 2017. Incidence, not prevalence | [V] | Spanish registry via search |
| **France:** no national prevalence found in these searches | [U] | — |
| IBD prevalence >0.3% in many European countries; highest values in Europe | [V] | 2017 systematic review, PubMed 29050646, via search |

### 3.2 Assumptions used

| Parameter | Low | Base | High | Basis |
|---|---|---|---|---|
| Population of IT+FR+DE+ES (millions) | 259 | 259 | 259 | **[A]** about 59 + 68 + 84 + 48; approximate, not re-sourced |
| IBD prevalence | 0.30% | 0.40% | 0.50% | **[E]** 0.3% (review threshold) to 0.4% (Pellino/Burisch); high is my rounding below the German treated figure of 0.74% |
| Adults (excluding children) | 90% | 90% | 90% | **[A]** pediatric share not sourced |
| Smartphone ownership | 85% | 85% | 85% | **[A]** not sourced for IBD patients |
| In regular specialist follow-up | 70% | 70% | 70% | **[A]** not sourced |
| Willing to use a health app regularly | 20% | 30% | 40% | **[A]** surveys: "most interested, only a minority had downloaded an IBD app" (ECCO abstract P472; 2023 survey of 200 patients); exact rate unknown |
| Annual consumer price used for sizing | €48 | €48 | €60 | **[A]** orders of magnitude: a different app, Flarely, lists $39.99/year or $4.99/month (App Store listing via search; different developer from Flarity). Not VIVIA's price |

### 3.3 Calculations

**Patients in the four countries**
- Base: 259,000,000 × 0.40% ≈ **1.04 million** (low 0.78 M; high 1.30 M). **[E]**
- Base by country (same prevalence applied to each): Germany ≈ 336,000 · France ≈ 272,000 · Italy ≈ 236,000 · Spain ≈ 192,000. **[E]** — uniform prevalence is a simplification.

**TAM (theoretical): every patient, every year, one consumer price**
- 1.04 M × €48 ≈ **€50 million/year** (at €60: ≈ €62 M). **[E]**
- For scale only: at the German reimbursed price reported for the IBS app (€248 per course), the same patients would be ≈ €257 M. This is **not** a realistic IBD figure because **no IBD digital health app reimbursement was found** (§5).
- **Important:** TAM counts patients, not paying customers.

**SAM (serviceable): adult, smartphone, in specialist follow-up, willing to use an app regularly**
- 1.04 M × 90% × 85% × 70% ≈ 555,000; × 30% willing ≈ **166,000 users** (low 83k–125k; high 208k–277k depending on scenario). **[E]**
- Revenue if all paid at €48: ≈ **€8.0 million/year** (at €60: ≈ €10 M). **[E]** — real revenue depends on conversion (below).

**SOM (obtainable in ~3 years): illustrative scenarios, all assumptions**

| Scenario | Share of the 166k SAM reached | Users | Paid conversion | Paying users | Price | Revenue/year |
|---|---|---|---|---|---|---|
| Cautious | 0.5% | 832 | 3% | 25 | €48 | ≈ €1,200 |
| Base | 1.5% | 2,497 | 5% | 125 | €48 | ≈ €6,000 |
| Optimistic | 3.0% | 4,993 | 8% | 399 | €60 | ≈ €24,000 |

Share and conversion are **[A]** with no benchmark behind them. **The point of the table is the order of magnitude: even the optimistic case is a few tens of thousands of euros per year, far below the cost of a team, clinical review and legal work.** A direct-to-patient subscription alone is not a business at this scale.

**B2B illustration (assumption-driven)**
- One reference point: a single-supplier NHS contract for My IBD Care was recorded at **£30,554** for 1 Dec 2022 – 30 Nov 2023 (Contracts Finder notice; unit pricing not shown) **[V]**. Another trust rollout covered about **2,800** patients (Worcestershire) **[V]** (LaingBuisson via search).
- If VIVIA won clinics at €10,000–30,000 per year **[A]**: 3 clinics ≈ €30k–90k; 10 clinics ≈ €100k–300k; 25 clinics ≈ €250k–750k **[E]**.
- That is **more plausible than consumer revenue**, but each sale needs clinical evidence, security review and procurement time **[H]**.

**Unit-economics check (consumer)**
- Lifetime value ≈ €48 × 1.2 years × 70% margin ≈ **€40**. To stay profitable, customer acquisition cost would have to stay **well under ~€15–20** **[E]**. No acquisition-cost data exists for this niche **[U]**.

### 3.4 Retention reality
- A meta-analysis of app-based interventions for chronic disease (17 studies) found a **pooled dropout of 43%** (95% CI 29–57%), highly heterogeneous; one real-world cohort found only **2%** with sustained continuous use **[V]** (JMIR 2020; PMC7556375, via search). Daily-logging apps for fluctuating symptoms are likely at the harder end **[H]**.

---

## 4. Existing alternatives (summary; full analysis in `03-competitive-analysis.md`)

| Alternative | What it already does well | Gap / limit | Evidence |
|---|---|---|---|
| **IBD apps** (Aidy, Flarity, My IBD Care, Tami, coreway, FlareCare, Takeda apps) | Symptom and medication tracking, reports, some scores; My IBD Care has NHS trust deployments and clinician links | Documents, timeline, bathroom/stoma map and verification workflow vary; mostly unknown | `docs/COMPETITIVE_ANALYSIS.md` (2026-09-30), My IBD Care sources below |
| **Patient portals / hospital systems** | Official results and letters; clinician-owned | Fragmented across services; patient-friendly summaries unknown | **[U]** not researched |
| **Spreadsheets, notes, paper diaries** | Free, flexible, already used | Manual; no reminders; hard to summarise | **[U]** not researched, widely assumed **[H]** |
| **Generic health / symptom apps** | Free or cheap, large user base | Not IBD-specific (toilets, biologic schedules, scores) | **[U]** not researched |
| **Current doctor workflow** | Free; trusted | Short visits; non-inflammatory symptoms often under-discussed (§2) | [V] (weak) |

**Where VIVIA could be genuinely better (hypotheses, not proven):** (1) turning a pile of reports into **one verified, source-labelled record**; (2) a **visit-ready summary with the patient's own questions**; (3) **no-account toilet finder** with stoma filters; (4) **multi-language** support. Each needs testing against what the competitor apps actually do (research in file 03).

---

## 5. Monetisation

| Model | Who pays | For what | Why they would | Evidence found | Risk | Verdict |
|---|---|---|---|---|---|---|
| **Freemium B2C** | Patient (few) | Premium features | Convenience | A GI-clinic survey found patients willing to use an app but **unwilling to pay out of pocket**; Aidy lists free + in-app purchases | Tiny revenue (§3.3) | Use only as an add-on |
| **Paid subscription B2C** | Patient | Whole app | Value over free alternatives | Pricing of a different IBD app: $4.99/month or $39.99/year **[V]** (Flarely) | Retention, free competitors | Weak |
| **Clinician / clinic subscription** | Clinic or department | Patient summaries, reduced admin | Time and visibility | NHS contract £30,554 (My IBD Care) **[V]** | Needs evidence, security, integration | **Most promising**, unproven |
| **Hospital partnership** | Hospital / trust | Programme for IBD patients | Capacity, outcomes reporting | Worcestershire (2,800 patients), Dorset rollouts **[V]** | Long sales cycle; needs clinical sponsor | Promising, slow |
| **Insurer / employer** | Insurer or employer | Population programme | Cost reduction | Germany reimburses a **gastro DiGA for IBS (€248/course)**; **no IBD DiGA found** **[V]**. France's PECAN: of 13 assessments to mid-2026, only 4 favourable, **all telemonitoring; all digital therapeutics negative**; CE mark is required **[V]**. Italy and Spain not researched **[U]** | Reimbursement needs CE marking and clinical evidence, incompatible with the current wellness position | Not near-term; employers are a poor fit (IBD is a small share of any workforce) **[H]** |
| **Patient support programme (pharma)** | Pharmaceutical company | Funding a free patient tool | Patient adherence, relationship | Takeda's apps exist **[V]** (earlier research) | Conflicts of interest; trust; patient data must stay under patient control; legal review needed | Possible, high trust risk |
| **Research partnership** | Researchers / sponsors | Anonymised insights | Real-world data | Not researched | Consent, GDPR, re-identification risk | Defer until trust is established |
| **Patient-association partnership** | Association (grant/sponsor) | Free access for members, co-branding | Member value | Crohn's & Colitis UK partnered with Ampersand to create an app **[V]** | Slow, small budgets | **Good for reach**, small money |

---

## 6. Ten riskiest assumptions

| # | Assumption | Why it could be false | Impact | Test (see §8) |
|---|---|---|---|---|
| R1 | Patients will keep logging beyond 2–4 weeks | Pooled app dropout 43%; fatigue is itself a symptom | Fatal | E6 |
| R2 | Someone will pay a meaningful amount | Survey reluctance; tiny B2C math | Fatal | E3, E5, E9 |
| R3 | Clinicians will read and value a patient summary | Time-poor; EHR habits | High | E2, E7 |
| R4 | Patients will upload sensitive documents to a new app | Privacy fears; brand trust | High | E1, E4 |
| R5 | AI extraction/parsing is accurate enough to be useful | Medical documents are varied; the Claude path is untested | High | E10 |
| R6 | The toilet/stoma map is accurate and useful | OSM coverage patchy; fictional demo places today | Medium | E8 |
| R7 | We can reach patients cheaply | No acquisition data; niche ad targeting restricted for health | High | E3 |
| R8 | The wellness position holds (no device status needed) | Summary/trends may be seen as medical; payers want CE mark | High | Legal/regulatory advice |
| R9 | Differentiators are hard to copy | Competitors are funded and shipping (e.g. Flarity on-device lab OCR) | Medium | File 03 |
| R10 | A small team can sustain safety, privacy and translation quality across six languages | Machine-assisted, unreviewed texts; no clinical reviewer | High | Partner/advisor search |

---

## 7. Verdict and what would change it

**Proceed with conditions.** Within **90 days**:
1. **At least 2 of 10 interviewed clinicians or clinics** name a concrete budget line or agree to a pilot (R2, R3). *If not → pivot to a free, association- or funder-supported patient tool, or stop.*
2. **≥50% of a 14-day volunteer cohort** log on ≥8 of 14 days (R1). *If not → drop daily tracking as the core and reposition around visit preparation and documents only.*
3. **No real patient data** before the DPIA, hosting/DPA decision and clinical review (launch checklist).
4. **Legal/regulatory advice obtained** on the wellness position and on sponsorship rules (R8).

**Would upgrade to "Proceed":** a signed pilot with a clinic or association, ≥50% 14-day retention, and a patient willingness-to-pay or funder commitment that covers a small team.
**Would trigger "Pivot":** retention fails but clinicians value the summary (→ document/visit-prep tool for clinics), or stoma users show strong pull (→ stoma-first).
**Would trigger "Stop":** no interviewee in either group shows pull, and no funder or buyer appears.

---

## 8. Validation experiments

Cost ranges are my estimates **[E]** (incentives, ads, tools; excluding founder time). Pass lines are **proposals** to be fixed before the test, not industry benchmarks.

| ID | Hypothesis | Method | Sample | Cost | Duration | Success threshold (proposed) | Decision |
|---|---|---|---|---|---|---|---|
| **E1** | People with IBD recognise the problem (scattered records, visit prep) and would use VIVIA's approach | Semi-structured interviews, show Figma prototype and a fictional Care Summary | 12–15 patients across 2 countries, mix of treatments | €0–€750 (€30–50 vouchers) | 2 weeks | ≥60% describe the problem unprompted **and** say they would use it before the next visit | Go: refine segment. No-go: rethink value proposition |
| **E2** | Clinicians value a patient-prepared summary | Interviews, show a Care Summary on fictional data | 8–10 gastroenterologists / IBD nurses | €0–€500 | 2–3 weeks | ≥5 would read it in a visit; ≥3 name what is missing | Go: pilot design. No-go: stop clinician pillar |
| **E3** | Patients can be reached cheaply and are interested | Landing page with real description and price, "reserve a spot" button, small ad test in health-permitted channels and patient groups | 300–600 visitors | €300–€2,000 | 3–4 weeks | Reservation rate and cost per reservation set in advance; reservation cost low enough that a €15–20 acquisition ceiling is plausible | Go: scale test. No-go: channel/message change |
| **E4** | The prototype is understandable | Click-through test of check-in, Tell VIVIA, document review, summary | 10 patients | €0–€500 | 1–2 weeks | ≥80% complete check-in in <60s; ≥70% correctly explain "source" labels | Fix UX before pilot |
| **E5** | Some patients will pay at a given price | Price test (e.g. €3.99 / €5.99 / €8.99 per month shown randomly) with "reserve" or pre-order | 100–150 respondents | €300–€1,500 | 3 weeks | A price at which ≥30% of reservers confirm a paid pre-order | Set price; if none, abandon B2C subscription |
| **E6** | Logging stays easy enough over 14 days | Diary-style pilot with informed consent, minimal data, fictional-ID option | 15 volunteers | €0–€1,000 | 2–3 weeks | ≥50% log on ≥8 of 14 days; median check-in <60 s | Go: keep daily tracking. No-go: reposition |
| **E7** | The Care Summary changes a real visit | Concierge: prepare summaries by hand for volunteers; collect patient and doctor feedback | 5–8 patients | €0–€500 | 3–4 weeks | ≥4 use it in the visit; ≥3 clinicians say it was useful | Go: build clinic features |
| **E8** | The map data are good enough | Audit 3 cities (nearest open toilet correct? stoma-friendly flags?) | 10 spot checks per city | €0 (3–5 days) | 1 week | ≥8/10 correct per city | Go: keep map in scope. No-go: partner or cut |
| **E9** | Someone besides the patient will fund it | 8–10 conversations with clinics, patient associations, a hospital innovation office | 8–10 | €0 | 3–4 weeks | ≥2 propose a pilot or funding | Go: pilot LOIs. No-go: pivot (§7) |
| **E10** | AI extraction is reliable | Run the document pipeline on 30 de-identified or synthetic reports; measure per-field accuracy; review by a clinician | 30 documents | €20–€200 (API) + reviewer time | 1–2 weeks | Clinician-verified field accuracy threshold agreed in advance (suggest ≥95% on lab values, with all errors caught by the confirm step) | Go: keep extraction. No-go: manual-first |

---

## 9. Evidence gaps (what we still do not know)

- Real willingness to pay and acquisition cost for IBD patients in each country **[U]**.
- National prevalence for France and Italy **[U]**; share on biologics varies widely by country (Italy administrative analysis 11.7% on biologics; I-CARE European cohort 47.3% on anti-TNF at inclusion, a prevalent-user snapshot) — **do not pool**.
- Clinician time and appetite for patient-generated data **[U]**.
- Reimbursement routes in Italy and Spain **[U]**.
- Competitor pricing (Flarity, Tami, coreway, FlareCare) **[U]**; "Flarity" returned no pricing page in search.
- Caregiver needs **[U]**.

---

## 10. Sources (via search summaries; pages not opened; accessed 2026-10-10)

- IBD prevalence review: https://pubmed.ncbi.nlm.nih.gov/29050646/
- Central/Eastern Europe table: https://www.wjgnet.com/1007-9327/full/v21/i6/1728-T2.htm
- EU figures (ECCO press / World IBD Day): https://ecco-ibd.eu/public-affairs/press-awareness.html · https://worldibdday.org/world-ibd-day-events/ibd-day-2012/europe-efcca · burden paper: https://research.regionh.dk/da/publications/the-burden-of-inflammatory-bowel-disease-in-europe/
- Germany/Italy/Spain epidemiology: https://pmc.ncbi.nlm.nih.gov/articles/PMC9860659 · https://reed.es/epidemiology-of-inflammatory-bowel-disease-in-malaga-incidence-rate-and-follow-up-of-a-cohort-diagnosed-between-2007-20081689 · https://pmc.ncbi.nlm.nih.gov/articles/PMC8268420 (as returned by search; individual mapping of each figure to each link was not verified)
- Patient burden: https://www.bioresource.nihr.ac.uk/studies/nbr34 · https://ecco-ibd.eu/publications/congress-abstracts/item/dop59-what-is-the-relationship-between-fatigue-pain-and-urgency-in-people-with-inflammatory-bowel-disease-results-of-the-ibd-boost-survey-in-8486-participants.html · https://pmc.ncbi.nlm.nih.gov/articles/PMC6206540 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12371981/ · https://pubmed.ncbi.nlm.nih.gov/39736517/ · https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2024.1416054/epub
- App willingness to pay / interest: https://pmc.ncbi.nlm.nih.gov/articles/PMC4816251 · https://humanfactors.jmir.org/2025/1/e64471 · https://ecco-ibd.eu/publications/congress-abstracts/item/p472-optimising-the-development-of-apps-for-the-management-of-inflammatory-bowel-disease-and-participation-in-clinical-trials.html
- App retention: https://pmc.ncbi.nlm.nih.gov/articles/PMC7556375
- DiGA / reimbursement: https://cara.care/en/press/diga-launch · https://www.mobihealthnews.com/news/emea/berlin-based-cara-care-app-approved-german-diga · https://pharmaphorum.com/news/mahanas-dtx-ibs-gets-permanent-reimbursement-germany · https://digital.iges.com/news-and-events/evidence_for_diga/
- France PECAN: https://www.ispor.org/heor-resources/presentations-database/presentation-cti/ispor-europe-2026/poster-session-2-5/decoding-pecan-what-early-french-assessments-reveal-about-market-access-for-digital-medical-devices · https://icthealth.org/news/pecan-frances-fast-track-scheme-for-digital-health-applications · https://mtac.iges.com/news/2025/digital_therapeutics_dtx_france_2025/index_eng.html
- My IBD Care / Ampersand: https://apps.apple.com/app/id1257828274 · https://www.laingbuissonnews.com/healthcare-markets-content/news-healthcare-markets-content/digital-health-company-partners-with-nhs-trust/ · https://www.contractsfinder.service.gov.uk/Notice/dccc97df-9d38-4773-8046-971ee7ec31ff · https://www.prnewswire.co.uk/news-releases/crohn-s-amp-colitis-uk-and-ampersand-health-partner-to-create-innovative-app-to-help-people-with-crohn-s-and-colitis-837241342.html · https://transform.england.nhs.uk/key-tools-and-info/digital-playbooks/gastroenterology-digital-playbook/patient-self-management-of-inflammatory-bowel-disease-with-a-smartphone-app
- Aidy: https://apps.apple.com/app/id6747647744 · Flarely (different developer): https://apps.apple.com/app/id6760443478
- Biologic use: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9802114/ · https://pubmed.ncbi.nlm.nih.gov/34320885/ · https://air.unimi.it/handle/2434/970719
- Earlier competitor research (30 Sept 2026): `docs/COMPETITIVE_ANALYSIS.md`

---

## 11. Five decisions the founder must make next

1. **Who is the paying customer you will test first: the patient, a clinic/hospital, or a funder (association/programme)?** The numbers say patient subscriptions alone cannot sustain the company; choose the buyer to validate.
2. **Which single patient segment is the beachhead?** (Recommended hypothesis to test: adults on advanced therapy with regular specialist visits; second: people with a stoma. To be confirmed or replaced in `02-customer-personas.md`.)
3. **Which codebase is the product: this repository or the Base44 app?** Two codebases break the single-source-of-truth rule and split the effort and the security posture.
4. **What is the regulatory position, and who will advise you?** Decide whether VIVIA stays strictly wellness (and gives up reimbursement routes that require CE marking) or pursues a medical-device path later, and obtain qualified legal/regulatory advice before any claim about summaries, trends or AI.
5. **What is the 90-day budget and the stop rule?** Commit money and time to the validation sprint (§8), fix the pass lines now, and agree in advance what result makes you pivot or stop.

---

## 12. Founder responses to the five decisions (2026-10-10)

| # | Decision | Response |
|---|---|---|
| 1 | Paying customer to test first | **Clinics, patient associations and funders** (not patient subscriptions) |
| 2 | Beachhead segment | **Confirmed:** experienced adults with regular visits; secondary: people with a stoma |
| 3 | Codebase | **The Base44 app** (review pending; `11`) |
| 4 | Legal/regulatory advice | **Yes** (brief in `11`) |
| 5 | 90-day budget and stop rule | **≈ €2,400 cap, < 10 h/week, stop rules fixed in `10` §1b** |
