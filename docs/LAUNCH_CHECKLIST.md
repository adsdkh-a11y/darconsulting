# VIVIA — Launch checklist

Status: **demo-ready, not patient-ready.** VIVIA is a wellness / self-management tool. It makes no medical-device claim and no regulatory-compliance claim. Everything below must be completed (and owned by a named person) before real patients use it.
Items marked 🧑‍⚕️ need a clinician, ⚖️ a lawyer or DPO, 🛠️ engineering, 💳 a paid account.

## 0. Decide first
- [ ] ⚖️ Legal entity that is the **data controller** (name, address, contact).
- [ ] ⚖️ Intended-purpose statement. Keep it to wellness / self-management and re-check it against EU MDR (Regulation 2017/745) before adding anything that interprets data. Decide explicitly whether any feature could qualify as software with a medical purpose.
- [ ] Target countries for launch (drives language, help numbers and legal text).

## 1. Privacy and GDPR (health data = Art. 9)
- [ ] ⚖️ **DPIA** (Art. 35) completed and signed off. Start from `docs/COMPLIANCE.md` and `docs/SECURITY.md`.
- [ ] ⚖️ Legal basis: explicit consent (Art. 9(2)(a)) — the registration consents are in the app; have the wording reviewed.
- [ ] ⚖️ Privacy policy, terms of use, cookie/storage notice (the app only uses essential storage), in each launch language.
- [ ] ⚖️ Records of processing (Art. 30); DPO or named privacy contact; breach procedure (72 h notification).
- [ ] ⚖️ Data processing agreements with: hosting provider, database provider, and Anthropic if the AI feature is enabled. Confirm EU data residency and any transfer mechanism.
- [ ] 🛠️ Verify export and deletion end to end on the production database (the E2E covers it on a test database).
- [ ] 🛠️ Retention rules for audit logs and backups; deletion must also reach backups within a stated period.

## 2. Clinical safety
- [ ] 🧑‍⚕️ Gastroenterologist review of: baseline thresholds (3+ consecutive days above the personal 30-day baseline), neutral wording, templated doctor questions, glossary explanations, questionnaires.
- [ ] 🧑‍⚕️ Review the **well-being** feature: mood and stress prompts, the Care Summary section, the "low mood" doctor question.
- [ ] 🧑‍⚕️ Decide and approve the **supportive message** for persistently very low mood (draft only today — not live). It needs local help-line numbers per country and an emergency path; do not ship without clinical sign-off.
- [ ] 🧑‍⚕️ Emergency wording: the app must always point to local emergency numbers (112 in the EU) and never imply it monitors the user.
- [ ] Confirm the AI safety rules still hold with real model output (see §3).

## 3. AI
- [ ] 🛠️ Test the Claude integration with a real `ANTHROPIC_API_KEY` on fictional data: log parsing, document extraction, Care Summary narrative. The code path has only been tested against the offline rules provider.
- [ ] 🛠️ Re-run the safety checks (`tests/ai-rules.test.ts`: flare claims, diagnosis, treatment changes) against the real model output and keep the results.
- [ ] AI stays **off by default per patient**; check the consent screen wording.
- [ ] Set a monthly spending cap on the Anthropic account.

## 4. Infrastructure 💳
- [ ] Hosting in an EU region with a persistent disk (`render.yaml` targets Render / Frankfurt). Docker image built and booted at least once.
- [ ] **Back up `VIVIA_ENCRYPTION_KEY`** in two separate secure places. Losing it makes every uploaded document unreadable.
- [ ] Automated database backups + a **restore drill** (restore into a scratch database and open the app).
- [ ] Backup of the document disk (`/data/storage`) — it is useless without the key, so store them separately.
- [ ] Custom domain, HTTPS only, HSTS.
- [ ] One app instance only (rate limiting is in memory); revisit before scaling.
- [ ] Uptime monitoring on `/api/health`, error alerts, log retention policy.
- [ ] Rotate the demo seed: **never** run `db:seed` on the production database (it creates the fictional Anna Rossi account with a known password).

## 5. Security 🛠️
- [ ] Independent penetration test, or at minimum a review of `docs/SECURITY.md` against OWASP ASVS L2.
- [ ] CI green on `main` (`.github/workflows/ci.yml`: lint, typecheck, 61 tests, build, `npm audit`).
- [ ] Dependabot or Renovate enabled; secret scanning enabled on the repository.
- [ ] Review the share-link and bathroom-flow public endpoints for abuse (rate limits, no account data exposed).
- [ ] Session lifetime, password policy and account-lockout settings reviewed for the real audience.

## 6. Product and content
- [ ] Native-speaker review of every language (see `docs/I18N.md`; FR/ES/DE/AR were machine-assisted).
- [ ] Arabic: RTL layout check on a real device.
- [ ] Accessibility pass: screen reader, 200% zoom, reduced motion, high contrast.
- [ ] Real-device test on iOS Safari and Android Chrome (install as PWA, offline emergency card, microphone permission).
- [ ] Replace demo places on the map with real data, or clearly label the map as demo. Verify the Overpass / OpenStreetMap usage policy and attribution.
- [ ] Support email and a visible "report a problem" route.
- [ ] Trademark / logo: the ribbon is a generic awareness symbol — have a designer finalise the mark and check distinctiveness before registering.
- [ ] Claim check: remove any wording that promises detection, prediction or treatment.

## 7. Pilot (recommended before public launch)
- [ ] 10–30 volunteers with IBD, informed consent, a named clinical advisor.
- [ ] Success measures from `docs/PRODUCT.md` instrumented without extra personal data.
- [ ] Weekly review of feedback, safety incidents and AI audit rows (`AiRun`).

## Go / no-go
Launch to real patients only when sections 1, 2, 3 and 4 are fully checked, and sections 5–6 have no open high-severity items.
