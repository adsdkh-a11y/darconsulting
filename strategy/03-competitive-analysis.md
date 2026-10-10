# 03 — Competitive intelligence and market gaps

_Date: 2026-10-10. Builds on `01-business-validation.md`, `02-customer-personas.md` and the earlier `docs/COMPETITIVE_ANALYSIS.md` (researched 2026-09-30)._

> **Evidence limits.** Web pages could not be opened; findings come from **search-result summaries** of store listings, vendor pages and press. No app was installed or tested. Public reviews are sparse. **Nothing below is an app-store review quote, and no complaint is invented.** Where a feature is "not found", it may still exist.

## Evidence classes used in the matrix

| Mark | Meaning |
|---|---|
| **V** | Verified and documented in a source seen in this research round (2026-10-10) |
| **V\*** | Documented in the earlier round (2026-09-30, vendor listing/site) and **not re-verified today** |
| **P** | Partially supported (described by a third party, truncated, or conflicting) |
| **NF** | Not found in available evidence (does **not** mean absent) |
| **U** | Unknown (not researched or no information) |

---

## 1. Executive summary

- **The field is crowded at the basic layer.** Symptom logging, medication reminders and clinician-report PDFs are documented across many IBD apps. Clinical scores (HBI/SCCAI) are documented for Aidy and Flarity. VIVIA cannot win on these.
- **There are more competitors than the list you gave**: at least Ayble Health, Trellus Health, Tract, ReMission, My IBD Tracker, SMART-IBD, Bezzy IBD (community), MyGut (Crohn's & Colitis Canada), AMICI We Care 2.0 and AppMICI (Italy, status unknown), Care+ (Italy, Imid), and **Cara Care** (which publishes a CED manual as well as its IBS product). A Flarity-like name, **Flarely**, is a *different* product.
- **Distribution is a bigger moat than features.** My IBD Care is deployed by NHS trusts and partnered with a patient charity; Tami is built with AbbVie Germany; the Takeda app was distributed through a European alliance. These are partner-funded, free-to-patient models. [V]
- **Real user dissatisfaction could not be established.** Review counts are tiny, and no recurring complaint pattern was found. This is an evidence gap, not evidence of satisfaction.
- **Italy looks under-served by *current* tools in what was found** (only dated or institution-linked Italian tools surfaced), but availability of Aidy, Flarity and others in Italy is **unknown**. [U]
- **What is hardest to copy** is not software but trust, local partnerships, verified real-world data (places) and clinical co-design.

---

## 2. Who was identified and verified

| Product | Verified today | Notes |
|---|---|---|
| **Aidy** | iOS app "Aidy: Manage Crohn's & Colitis" (iPhone only, free with in-app purchases, **18 ratings** at the time of the listing snapshot), YC Winter 2024, San Francisco, reported seed $500K (tracker site). Features per directory listing: symptom/diet/treatment logging, **modified HBI and SCCAI**, biologic schedules and reminders, appointment report. **Countries not found.** | [V] |
| **Flarity** | Google Play listing (via a stats site) describes: symptom tracking with **HBI / SCCAI**, medication schedules with reminders, adherence history shareable with the care team, optional **Health Connect** wearable data, PDF summary for appointments. **Lab OCR, clinician product and getflarity.com not confirmed today** (documented in the earlier round). **Flarely (Low Latency Labs) is a different app**: 14-day trial, then $4.99/month or $39.99/year. | [V]/[V\*] |
| **My IBD Care** | Free app (Google Play / App Store), developed by Ampersand Health; **NHS trust deployments** (Worcestershire: about 2,800 patients; University Hospitals Dorset); a Contracts Finder notice shows a **£30,554** award for 1 Dec 2022–30 Nov 2023; partnered with Crohn's & Colitis UK; **ElenaAI** is an optional paid feature; a **54-patient, 6-month** King's study reported 47% fewer routine outpatient appointments (small, single-centre). | [V] |
| **Tami** (Temedica) | Launched Aug 2023 with **AbbVie Germany**; free; adults 18+ with IBD **in Germany**; symptom tracking, long-term course, "possible influencing factors"; fed by Temedica's RWE platform (Permea); a retrospective usage analysis of Tami data (Jun 2023–Dec 2024) exists (original not verified). **No independent ratings found.** | [V] |
| **coreway** | iOS: free with in-app purchases; daily well-being, symptoms, stool log, medication plan with reminders; "not a substitute for medical advice". **Not enough ratings for an overview**. **CE Class I status not confirmed today** (earlier round recorded it from the vendor). A trade article mentions a PMCF certification (truncated). | [V]/[V\*]/P |
| **IBD Care** | No single product matching that name could be identified (similar names exist). | U |
| **We IBD / "For You With You: IBD"** (Takeda) | Multi-language companion app co-developed with patients and clinicians, distributed through the Health Outcomes Observatory; framed around symptom tracking and toilet-finding; India launch Aug 2025. **Availability in Italy not found.** Whether the toilet finder is in this app is **not confirmed** (the Swiss CED Forum app is a separate product that does list one). | P |
| **CED Buddy** | Not found under that name. Closest: **CED Forum** app (Switzerland/Germany-speaking), which includes a toilet finder per a Concordia page. | NF / P |
| **FlareCare** | App Store listing **4.6 from 74 ratings**; free to download; features per third-party listing: Bristol stool tracker, AI food logging, symptoms, **stoma and pouch support**, PDF/CSV export; a revenue-tracking site showed **593 active subscriptions** in a July 2026 snapshot (third-party, unaudited). Pricing not found. | V / P |
| **Other relevant** | **Ayble Health** ($19.99 basic or $49.99/month with coach, per a Sept 2024 TIME roundup; may be dated); **Trellus Health** (free; symptoms, meds, labs, dietitian/resilience coaches); **Tract** (symptoms, FODMAP, Apple Health, shareable reports; 4 ratings); **ReMission**; **My IBD Tracker** (June 2026); **SMART-IBD** (Cincinnati Children's); **Bezzy IBD** (community); **MyGut** (Crohn's & Colitis Canada); **Regularity** (one-time purchase logger); **AppMICI** (2013, status unknown) and **AMICI We Care 2.0** (2022: lab booking, teleconsultations, wearable remote monitoring) in Italy; **Care+** (Imid, immune-mediated diseases); **Cara Care** (IBS DiGA in Germany; a CED manual exists). | V (listing level) |

---

## 3. Comparison matrix

Columns: core competitors only. Cells use the evidence classes above. Empty knowledge is shown as **U**, never as absence.

| Dimension | Aidy | Flarity | My IBD Care | Tami | coreway | We IBD (Takeda) | CED Forum | FlareCare | **VIVIA (built, untested with users)** |
|---|---|---|---|---|---|---|---|---|---|
| Symptom & bowel tracking | V | V | V\* | V | V | P | U | P | Built |
| Medication reminders / adherence | V | V | V\* | U | V | U | U | U | Adherence log built; **push reminders not built** |
| Food diary | V | NF | U | U | U | U | U | P (AI logging) | Via Tell VIVIA only |
| Laboratory tracking | U | V\* | V\* | U | U | U | U | U | Built |
| Medical document storage | NF | V\* | U | U | U | U | U | U | Built (upload, encrypted) |
| OCR / AI extraction | NF | V\* | U | U | U | U | U | U | Built, **Claude path untested with a real key** |
| Health timeline | U | U | V\* | U | U | U | U | U | Built |
| Personal baseline / trends | U | V\* | U | U | V\* | U | U | P | Built (neutral wording) |
| AI assistant | P (food image AI) | NF | V (ElenaAI, optional paid) | NF | U | U | U | P | Task-specific only, no chat |
| Doctor-visit summary | V | V | U | V\* | U | U | U | P (PDF/CSV export) | Built (PDF, link, questions) |
| Clinician portal / secure sharing | U | V\* (separate product) | V (clinician link, NHS) | NF | U | U | U | NF | Link sharing built; **no portal** |
| Bathroom / pharmacy discovery | NF | NF | NF | NF | NF | P | P | NF | Built; **real data coverage unmeasured** |
| Stoma-specific features | U | NF | U | NF | NF | U | U | P | Built (filters, notes) |
| Travel support | NF | NF | NF | NF | NF | U | U | NF | Checklist only |
| Natural-language / voice logging | NF | NF | NF | NF | NF | NF | P (Alexa, earlier round) | V\* | Built (text + browser voice) |
| Integrations / wearables | U | V (Health Connect) | V\* (Apple Watch, Fitbit, Oura) | U | V\* (HRV) | U | U | U | Not built |
| Languages | U | U | U (EN) | DE | DE/EN | multi-language | DE | U | 6 languages, **non-Italian/English unreviewed** |
| Accessibility | U | U | U | U | U | U | U | U | Larger text, high contrast, reduced motion; **no audit** |
| Privacy / regulatory position | U | on-device claims (V\*) | NHS-linked | U | V\* (Class I, not re-verified) | U | U | V\* (encrypted, "never sold") | Wellness position; **no DPIA, no certification** |
| Business model | Free + IAP | U | Free + optional paid + institutional | Free (pharma-funded) | Free + IAP | Free (pharma-funded) | Free (pharma-linked) | Free download + subscription | **Not defined** |

Sources: see §7. "V\*" cells come from `docs/COMPETITIVE_ANALYSIS.md` (2026-09-30).

---

## 4. Customer dissatisfaction: what could and could not be found

**Method:** searches for store reviews, forum threads, independent reviews and academic evaluations. Result: **almost no analysable reviews were reachable**, so no recurring pattern can be asserted.

| Possible weakness | Evidence found | Source / date / context | Pattern? |
|---|---|---|---|
| Difficult or lengthy data entry | None specific to IBD apps. A one-time-purchase logger (Regularity) markets "one-tap" speed, which suggests the concern is believed to exist, **not that it is proven** | App Store listing (marketing copy) | Not shown |
| Crashes and reliability | None found | — | Not shown |
| Poor export / sharing | None found; a 2025 patient-preference survey on data sharing exists (JMIR Human Factors 2025;e64471) but its results were not read | Search summary | Not shown |
| Weak integrations | None found | — | Not shown |
| Confusing or inaccurate AI output | None found | — | Not shown |
| Missing medication options | None found (Aidy lists many biologics) | Directory listing | Not shown |
| Excessive notifications | None found | — | Not shown |
| Subscription and pricing friction | Pricing exists for Flarely, Ayble, FlareCare (subscription count). **No complaints found** | Store listings / TIME 2024 | Not shown |
| Accessibility issues | None found | — | Not shown |
| Low trust / privacy | None found for IBD apps. A 2022 JMIR mHealth review rated German IBD apps with the MARS tool (1,764 apps identified); detailed findings not read | JMIR mHealth 2022;e31102 | Not shown |
| Low adoption | A 2023 survey of 200 patients: few had used medical apps, only 2 IBD-specific; ECCO abstract (134 patients): only a minority had downloaded an IBD app | Search summaries | **Weak signal**: low adoption in small samples |

**Review-volume signals (V):** Aidy 18 ratings; Tract 4; FlareCare 4.6 (74); coreway insufficient for a summary. These are **too small to rank products or conclude quality**.

**Evidence gap to close:** read the negative reviews directly in the App Store and Google Play for each app (Italy and Germany stores), record date and platform for each, and count unique reviewers. Reddit and forum posts were not retrievable in this environment.

---

## 5. Strategic gaps

1. **Unmet patient needs (documented):** urgency, fatigue, pain, mental health, and the sense that these are not discussed in consultations [V]. Most competitors log symptoms but do not state a way to bring these to the visit as questions.
2. **Unmet clinician needs:** not researched. [U]
3. **Poorly served languages/markets:** in what was found, current Italian-language tools are old or institution-linked (AppMICI 2013, AMICI We Care 2022); several competitors are German- or English-oriented. Italian availability of Aidy/Flarity unknown. [P]
4. **Workflows needing several apps today:** tracker + notes/folder for reports + maps/search for toilets + hospital portal. Plausible; **not measured**. [H]
5. **Features competitors have that VIVIA should not prioritise:** wearable integrations and Health Connect (Flarity), coaching and human support (Ayble, Trellus), AI coaching/chat (ElenaAI), food image scanners (FlareCare, Aidy), community forums (Bezzy), reimbursement-oriented clinical trials.
6. **Differentiators hard to copy:** (a) a **clinical partner relationship** and co-design with an Italian IBD centre; (b) **verified real-world place data** and stoma-friendly information from the community; (c) **independence/trust** (no pharma-sponsored data flows); (d) **local-language, culturally adapted content**. Software features themselves (summary PDF, timeline, voice) are **copyable**.
7. **Opportunities that require partnerships, not software:** patient associations (reach, content, co-design), IBD centres (pilots), stoma nurses and associations (map data), pharmacies and hospitals (verified listings).

---

## 6. Ten most attractive opportunities (ranked)

**Scoring (1–5, 5 favourable to VIVIA):** customer impact; evidence strength; **competitive intensity (5 = few competitors)**; **implementation effort (5 = easy)**; **regulatory risk (5 = low)**. Total /25. All scores are my judgements from the evidence above.

| Rank | Opportunity | Impact | Evidence | Competition | Effort | Reg. risk | Total |
|---|---|---|---|---|---|---|---|
| 1 | **Visit-ready summary that includes urgency, fatigue and mood and the patient's own questions** | 4 | 4 | 3 | 4 | 4 | **19** |
| 2 | **Italy-first, Italian-language IBD tool** with an association/IBD-centre partner | 4 | 3 | 4 | 3 | 4 | **18** |
| 3 | **No-account "I need a toilet now" flow with open-now ranking** | 4 | 3 | 3 | 3 | 5 | **18** |
| 4 | **Stoma-specific planning and stoma-friendly places** | 4 | 2 | 4 | 3 | 4 | **17** |
| 5 | **Patient-controlled, expiring sharing** with clinicians | 3 | 2 | 3 | 4 | 4 | **16** |
| 6 | **Offline emergency card and travel pack** | 2 | 2 | 4 | 4 | 4 | **16** |
| 7 | **Association-funded free access for members** (distribution and sustainability) | 3 | 2 | 3 | 3 | 4 | **15** |
| 8 | **Document → verified, source-labelled timeline** (breadth + verification) | 4 | 2 | 3 | 2 | 3 | **14** |
| 9 | **IBD-centre pilot with nurse-led onboarding** | 4 | 2 | 3 | 2 | 3 | **14** |
| 10 | **Multilingual (FR/ES/DE/AR) accessible IBD tool** | 3 | 2 | 3 | 2 | 4 | **14** |

Ties (ranks 2–3, 5–6, 8–10) are broken by customer impact, then evidence strength. **Opportunity ranks are not forecasts.** Several rest on [H] hypotheses until interviews and the data audit in `01` §8 are done.

---

## 7. Sources (via search summaries; pages not opened; accessed 2026-10-10)

- Aidy: https://apps.apple.com/app/id6747647744 · https://ycombinator.com/companies/aidy · https://healthcarediscovery.ai/companies/aidy/
- Flarity / Flarely: https://chrome-stats.com/d/com.flaresense.flarity · https://apps.apple.com/app/id6760443478
- My IBD Care: https://apps.apple.com/app/id1257828274 · https://www.laingbuissonnews.com/healthcare-markets-content/news-healthcare-markets-content/digital-health-company-partners-with-nhs-trust/ · https://www.contractsfinder.service.gov.uk/Notice/dccc97df-9d38-4773-8046-971ee7ec31ff · https://www.prnewswire.co.uk/news-releases/crohn-s-amp-colitis-uk-and-ampersand-health-partner-to-create-innovative-app-to-help-people-with-crohn-s-and-colitis-837241342.html · https://transform.england.nhs.uk/key-tools-and-info/digital-playbooks/gastroenterology-digital-playbook/patient-self-management-of-inflammatory-bowel-disease-with-a-smartphone-app
- Tami: https://temedica.com/press/launch-ibd-digial-companion-temedica-abbvie · https://eqs-news.com/news/corporate/temedica-and-abbvie-germany-are-launching-digital-companion-for-patients-with-chronic-inflammatory-bowel-diseases/1871825
- coreway: https://apps.apple.com/dk/app/coreway-your-ibd-app/id6496354516 · https://www.gesundheitsindustrie-bw.de/fachbeitrag/aktuell/chronisch-entzuendliche-darmerkrankung-app-den-alltag-nachhaltig-verbessern/sendPdf/681638
- Cara Care: https://apps.apple.com/de/app/cara-care/id1526811241 · https://eu-prod.cara.care/uploads/Cara_Care_fuer_CED_Bedienungsanleitung_version_1.pdf
- Takeda / CED Forum: https://www.takeda.com/our-impact/our-stories/ibd-impact-tracking-app/ · https://biovoicenews.com/takeda-india-launches-for-you-with-you-ibd-app-to-support-personalized-care-for-people-with-ibd/ · https://concordia.ch/en/gesundheit/gesundheitskompass/digitale-begleiter/gesundheits-apps/verschiedene-krankheiten/ced-forum.html
- FlareCare: https://www.producthunt.com/products/flarecare/makers · https://trustmrr.com/startup/flarecare
- Other apps: https://time.com/7021605/best-ibd-apps/ · https://appshunter.io/ios/app/my-ibd-symptom-tracker/id6450712746/similar · https://apps.apple.com/cy/app/regularity/id6759209083
- Italy: https://www.liberoquotidiano.it/news/scienze-tech/salute/21027547/la-prima-app-per-gestire---le-malattie-dell-intestino/ · https://www.liberoquotidiano.it/news/tv-news/31389383/online-amici-we-care-2-0-piattaforma-al-servizio-dei-pazienti/ · https://www.fortuneita.com/?p=253719
- App evaluations: https://mhealth.jmir.org/2022/5/e31102 · https://humanfactors.jmir.org/2025/1/e64471
- Earlier round (vendor sources, not re-verified): `docs/COMPETITIVE_ANALYSIS.md`

---

## 8. Evidence gaps

- Real negative reviews (store-by-store, dated, unique reviewers), forum threads. **[U]**
- Competitor pricing for Aidy, Flarity, My IBD Care (in-app), Tami (free), coreway (in-app). **[U]**
- Country availability for Aidy, Flarity, FlareCare, My IBD Care, Takeda's app (especially Italy). **[U]**
- coreway's regulatory status and Flarity's clinician product; verify against vendor and EU registers. **[U]**
- Hands-on test of each competitor's onboarding, daily-entry time and export. **[U]**
- Italian clinicians' use of existing tools. **[U]**

---

## 9. Prioritised recommendations

1. Do **not** compete on tracking, reminders or scores; reuse a standard approach and keep effort low.
2. Concentrate the product story on **"prepare the visit"**, including the under-discussed symptoms, and test it with 10–15 patients and 8–10 clinicians (`01` E1, E2, E7).
3. Run the **place-data audit** before promising a toilet or stoma map in any marketing (E8).
4. Treat **Italian-first with an association or IBD-centre partner** as the main route to distribution; start conversations now (E9).
5. Perform the **hands-on review** of the top five competitors (Aidy, Flarity, My IBD Care, FlareCare, Ayble) with a fixed checklist (time to first value, entry effort, export, notification behaviour, price).
6. Avoid features that need clinical or regulatory evidence (prediction, flare claims).

---

## 10. Direct answer: why would a patient choose VIVIA over an existing app?

**Today's honest answer:** *no one has yet been shown to prefer it.* The most defensible reason a patient *might* is this: VIVIA is built to turn the patient's own notes and reports into **one visit-ready summary with their own questions, including the symptoms that are often not discussed (urgency, fatigue, mood)**, and to **get them to a toilet in one tap without an account**, in **Italian**, with the **patient controlling what is shared**. Competitors documented in this round cover tracking, reminders and reports well, and some offer parts of the above; **none was verified as combining all of these**, but that is absence of evidence, not proof.

**Evidence still needed to prove the advantage:**
1. Patients and clinicians say the summary is **useful in a real visit** (interviews + concierge test, not opinions on a screenshot).
2. A **head-to-head task test** against two or three top competitors showing VIVIA is faster or clearer for "prepare for my visit" and for "find a toilet now" (measured time and success).
3. **Place data quality** high enough that the toilet result is correct in most spot checks.
4. Italian-language **content and wording reviewed by native speakers and a clinician**.
5. **Retention** over 14–30 days is at least as good as the 43% pooled app-dropout benchmark implies for alternatives; otherwise the advantage is not durable.
