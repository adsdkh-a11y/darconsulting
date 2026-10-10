# 08 — Landing page and conversion strategy

_Date: 2026-10-10. Uses the position in `04-positioning.md` (better-prepared visits; supporting pillars: daily-life support and patient control) and the personas in `02`. Tags: [V] verified capability · [H] hypothesis · [U] unknown._

> **What this page is.** An honest page for an **early prototype**. It invites people to **talk and test**, not to download or pay. VIVIA is **not deployed**; no real user has used it. Therefore: no testimonials, no statistics about VIVIA, no screenshots presented as live use, no "download" button. The Italian copy is a **draft needing native and clinical review**. "VIVIA" is a **working name** (no trademark or domain check done).

**Update 2026-10-10 (founder decision F3):** the Base44 app is the product. The capability statements below were verified for the **VIVIA repository prototype** only; **re-verify each against the Base44 app (`11`) before publishing**, and do not describe privacy or security measures until they are confirmed for that app.

**Feature labelling rule.** Capabilities below are *present in the prototype and covered by automated tests* [V] but **not publicly available**. The page says "In the prototype". Anything not built is labelled **Planned**. Items still unproven are written as goals ("we're testing whether…").

---

## 1. Page structure (top to bottom)

1. Header (logo mark + VIVIA + "MICI · IBD", language switch IT/EN, link to FAQ)
2. Hero (chosen variant) with two CTAs
3. Who it is for
4. The problem
5. The solution
6. Benefits tied to capabilities
7. How it works (3 steps)
8. Product visuals
9. Trust and privacy
10. FAQ
11. Objections
12. Final CTA
13. Footer (working-name notice, privacy notice, contact, "not medical advice / call 112")

---

## 2. Hero variants

| Variant | Headline (EN) | Headline (IT, draft) | Sub-headline (EN) |
|---|---|---|---|
| **1. Patient-centred** | "Living with Crohn's or ulcerative colitis, a little lighter." | "Convivere con Crohn o colite ulcerosa, un po' più leggeri." | "A calm place to keep track of how you are and what your care team needs to know. Early prototype: help us shape it." |
| **2. Doctor-visit-centred** *(recommended)* | "Say what matters at your next visit." | "Dire ciò che conta alla prossima visita." | "VIVIA turns what you record into a clear one-page summary and your own questions. Early prototype, built with patients." |
| **3. Low-effort organisation** | "Your IBD information, in one place, in seconds." | "Le tue informazioni sulla MICI, in un posto solo, in pochi secondi." | "Note how you are in a few taps, keep reports together, see where each item came from. Early prototype." |

**Recommendation: variant 2.** Evidence: it matches the chosen position (`04`), the best-documented need (under-discussed urgency, fatigue, mood [V, `01`]) and the beachhead persona (regular visits, `02`). Variant 1 is the most relatable but least distinctive; variant 3 puts convenience first, where many competitors already compete (`03`). **This is a hypothesis to test.**

### A/B test proposal
- **Design:** three variants, equal split, same page body and CTA; run 3–4 weeks with the same traffic sources.
- **Primary metric:** visit→waitlist (email) conversion; **secondary:** click on "Talk to us" and **quality** (share of sign-ups in the target segment who book an interview).
- **Power reality:** to tell 5% from 10% conversion with 80% power takes roughly **450 visitors per variant** (approx. n ≈ 16·p̄(1−p̄)/δ²; p̄ = 7.5%, δ = 5 points). With the 300–600 visitors expected in the 30-day plan (`05`) the test is **directional only**. Do not declare a winner on fewer than ~150 visitors per variant; prefer a two-way test (variant 2 vs the better of 1 or 3) and weigh interview quality more than clicks.
- **Decision rule (proposed, set before launch):** adopt a variant if it leads on conversion **and** its sign-ups book at least as many interviews per sign-up; otherwise keep variant 2 and rewrite the weakest section.

---

## 3. Complete copy (English master)

### Header
VIVIA · MICI · IBD · [Italiano | English] · [FAQ]

### Hero (variant 2)
**Say what matters at your next visit.**
VIVIA turns what you record into a clear one-page summary and your own questions. Early prototype, built with patients.
**[Join the early test group]** (primary) · **[Talk to us for 30 minutes]** (secondary)
*For adults living with Crohn's disease or ulcerative colitis, and the clinicians and organisations who support them. VIVIA is an organising tool. It does not diagnose and does not replace your care team.*

### Who it is for
- **Adults living with Crohn's or ulcerative colitis** who want to prepare better for appointments.
- **People with a stoma**, who need practical planning for daily life.
- **Clinicians, IBD nurses and patient organisations** who want to help shape a patient-prepared summary.
*Not for: emergencies, diagnosis, or treatment decisions. In an emergency, call 112 (Italy).*

### The problem
Appointments are short. Many people with IBD leave realising they didn't mention fatigue, urgency, how they have felt, or a question they meant to ask. This is not a personal failing: in a UK survey of 8,486 people with IBD, a large share still reported fatigue, abdominal pain and continence difficulties while their disease was in remission, and many wanted help with them. *(Source: IBD-BOOST survey, UK; results may differ in Italy. [Re-verify and link before publishing.])* Meanwhile, reports and test results are often scattered across paper, photos and different hospital portals.

### The solution
VIVIA is a prototype that helps you keep the pieces together and bring them to the visit:
- note how you are in seconds, by tapping or by writing or speaking a sentence you then confirm;
- keep treatments, tests and documents in one timeline, each item showing where it came from;
- prepare a one-page summary with your own questions, and choose what to share.

### Benefits tied to capabilities
| What you may notice | What it is in the prototype |
|---|---|
| A faster way to note a day | One-tap mood, "same as yesterday", or "Tell VIVIA": you write or speak a sentence and **check it before anything is saved** |
| Less hunting for reports | A timeline of treatments, tests and documents, **each item labelled with its source** |
| No surprises from automatic reading | For uploaded documents, VIVIA proposes values and **you confirm, fix or reject each one**; it does not interpret results |
| A visit you feel ready for | A one-page summary with your questions, as a PDF or a private link that **expires and that you can revoke** |
| Help on a bad day | A **nearby-toilet page that works without an account** and **stoma filters** (*map coverage is being tested and varies*) |
| A card in your pocket | An **emergency card saved on your phone**, usable offline |
| Control | **Consent per purpose**, AI **off by default**, **download all your data**, **delete your account** |
*We are testing whether these help you feel more prepared; we make no promises about health outcomes.*

### How it works (3 steps)
1. **Note.** Tap or tell VIVIA how you are. Confirm what it understood.
2. **Keep.** Add treatments and documents. Check each value; everything stays labelled with its source.
3. **Prepare.** Generate a one-page summary with your questions. Share only what you choose.
*Planned, not yet available: reminders, a mobile app, Apple Health / Health Connect, a clinician portal.*

### Product visuals (what to show)
See §5. The prototype designs shown are **labelled "prototype, example data"**.

### Trust and privacy
- **You decide.** AI features are **off until you switch them on**. Consent is separate for each purpose.
- **Your data.** You can **download everything** and **delete your account and data** at any time.
- **Sharing.** Summary links **expire** and you can **revoke** them.
- **Location.** The nearby-toilet search uses your location **once**, for that search, and does not store it.
- **Documents.** In the prototype, uploaded documents are encrypted before storage.
- **No advertising, no sale of health data.**
- **What we haven't done yet:** VIVIA has **not** had an independent security review or a data-protection impact assessment, is **not** certified, and is **not** a medical device. It is an early prototype and will contain mistakes. We will not store real health data in tests until these steps are done.

### FAQ
**Who is VIVIA for?** Adults living with Crohn's disease or ulcerative colitis, including people with a stoma. Clinicians and patient organisations are invited to help shape it.
**What information does it store?** In the prototype: what you choose to record (check-ins, treatments, documents, summaries) and your account details. We don't ask for health information on this website; the early test list asks only for an email and your role.
**How is AI used?** AI is **off by default**. If you turn it on, it can help turn a sentence you write into a draft you confirm, or help read a document. You review everything. The AI part is still being tested with synthetic data. VIVIA does not diagnose and does not give treatment advice.
**Does it replace my doctor?** No. It helps you organise information and prepare for a visit.
**Can I share or export my information?** Yes: download your data, or create a private summary link that expires and can be revoked.
**How much does it cost, and when is it available?** Pricing is **not decided** and nothing is for sale now. We are inviting a small group to test an early prototype. Joining costs nothing and creates no obligation.
**How do I delete my data?** In the prototype, from the privacy page: delete your account and all data. On this website, you can ask us to remove your email at any time.
**Is this a medical app?** No. It is designed as an organising tool. Regulatory and legal advice is still being obtained.

### Objections (answer in short blocks below the FAQ)
- **"It will be another thing to fill in."** You can do it in a few seconds, skip any day, and nothing makes you feel behind. We are testing how little effort is acceptable; tell us.
- **"Can I trust the reading of my reports?"** You confirm every value; VIVIA shows where each one came from; it doesn't interpret results. Accuracy is still being measured.
- **"What about my privacy?"** You control consent, export and deletion. We haven't had an independent review yet and will say so.
- **"Will it be useful?"** We don't know yet. That's why we're asking people with IBD and clinicians to test it with us.
- **"I already use an app."** Nothing to switch. If something about your current tools works, we'd like to hear it.

### Final CTA
**Help us build it, or try it with us.**
[Join the early test group] (email + role, no health data) · [Talk to us for 30 minutes] (booking link).
*No medical records requested. You can leave at any time.*

### Footer
VIVIA is a working name. · Privacy notice · Contact · Not medical advice. In an emergency call 112.

---

## 4. Complete copy (Italian, draft; native and clinical review required)

**Hero (variante 2).** *Dire ciò che conta alla prossima visita.* VIVIA trasforma ciò che registri in un riepilogo chiaro di una pagina e nelle tue domande. Prototipo iniziale, costruito con i pazienti. **[Unisciti al gruppo di test]** · **[Parliamone per 30 minuti]**
*Per adulti che convivono con la malattia di Crohn o la colite ulcerosa, e per i clinici e le organizzazioni che li sostengono. VIVIA è uno strumento di organizzazione: non pone diagnosi e non sostituisce il tuo team di cura.*

**Per chi è.** Adulti con Crohn o colite ulcerosa che vogliono prepararsi meglio alle visite · persone con una stomia · clinici, infermieri IBD e associazioni che vogliono aiutarci a progettarlo. *Non adatto a emergenze, diagnosi o decisioni terapeutiche. In emergenza chiama il 112.*

**Il problema.** Le visite sono brevi. Molte persone escono accorgendosi di non aver detto della stanchezza, dell'urgenza o di una domanda. Non è una colpa: in un'indagine britannica su 8.486 persone con IBD, molti riferivano ancora stanchezza, dolore addominale e difficoltà di continenza in fase di remissione e volevano un aiuto. *(Fonte: IBD-BOOST, Regno Unito; in Italia i risultati possono differire. [Da riverificare prima della pubblicazione.])* Intanto i referti sono sparsi tra carta, foto e portali diversi.

**La soluzione.** VIVIA è un prototipo che aiuta a tenere insieme le informazioni e a portarle alla visita: annota come stai in pochi secondi (con un tocco, oppure scrivendo o dicendo una frase che poi confermi); tiene terapie, esami e documenti in un'unica cronologia, con l'origine di ogni voce; prepara un riepilogo di una pagina con le tue domande e ti lascia scegliere cosa condividere.

**Come funziona.** 1. **Annota.** Tocca o racconta a VIVIA come stai e conferma ciò che ha capito. 2. **Conserva.** Aggiungi terapie e documenti, verifica ogni valore; tutto resta etichettato con l'origine. 3. **Prepara.** Genera un riepilogo con le tue domande e condividi solo ciò che scegli. *In programma, non ancora disponibile: promemoria, app per telefono, Apple Salute / Health Connect, area per i clinici.*

**Fiducia e privacy.** Decidi tu: l'IA è **disattivata finché non la attivi**. Puoi **scaricare tutti i dati** e **cancellare l'account** quando vuoi. I link di condivisione **scadono** e puoi **revocarli**. La posizione per cercare un bagno è usata **una sola volta** e non viene salvata. Nessuna pubblicità, nessuna vendita di dati di salute. **Cosa non abbiamo ancora fatto:** nessuna revisione indipendente di sicurezza né valutazione d'impatto sulla protezione dei dati; non siamo certificati e non siamo un dispositivo medico. Non conserveremo dati sanitari reali nei test finché questi passaggi non sono compiuti.

**FAQ (sintesi).** *Chi può usarlo?* Adulti con Crohn o colite ulcerosa, anche con stomia. *Quali informazioni conserva?* Ciò che scegli di registrare e i dati dell'account; questo sito chiede solo email e ruolo. *Come usa l'IA?* È disattivata di default; se la attivi, può aiutare a trasformare una frase in una bozza che confermi; non pone diagnosi e non dà consigli terapeutici. *Sostituisce il medico?* No. *Posso condividere o esportare?* Sì: scarica i dati o crea un link privato che scade. *Quanto costa?* Il prezzo non è deciso e nulla è in vendita; partecipare è gratuito e senza obblighi. *Come cancello i dati?* Dalla pagina privacy del prototipo; sul sito puoi chiederci di rimuovere la tua email. *È un'app medica?* No.

**CTA finale.** *Aiutaci a costruirlo, o provalo con noi.* [Unisciti al gruppo di test] · [Parliamone per 30 minuti]. *Non chiediamo documenti medici. Puoi uscire quando vuoi.*

---

## 5. Product visuals (specification; do not invent real screenshots)

| # | Visual | Source | Label |
|---|---|---|---|
| 1 | Hero: a phone showing the **Care Summary** (Figma screen or screenshot of the prototype with **fictional data**) | `docs/FIGMA_PROMPT.md` screen 7; real prototype screenshots exist (fictional "Anna Rossi") | "Prototype · example data" |
| 2 | Check-in and Tell VIVIA (confirm step visible) | Prototype / Figma | same |
| 3 | Timeline with source pills ("From a document", "Entered by you") | Prototype | same |
| 4 | Document review (confirm / fix / not right) | Prototype | same |
| 5 | Nearby-toilet page and stoma filters | Prototype (**demo places are fictional**; add a visible note) | "Demo places, coverage being tested" |
| 6 | Privacy screen (consents, export, delete) | Prototype | same |
| 7 | Logo (ribbon mark + wordmark + "MICI · IBD") | `vivia/public/icon.svg` | — |
- **Do not** show: patient photos, real names, fake testimonials, ratings, numbers of users, or screenshots from other apps.
- **Alt text** for every image, high-contrast and reduced-motion respected, no autoplay video.
- A short (≈20 s) **silent demo clip** of the prototype is optional; label it as prototype.

---

## 6. Metadata

| Item | Value |
|---|---|
| `<title>` (≤ 60 chars) | **VIVIA – Prepare your IBD visit (early prototype)** / IT: **VIVIA – Prepara la visita per la MICI (prototipo)** |
| Meta description (≤ 155) | "Early prototype for people with Crohn's or ulcerative colitis: organise information, prepare a one-page summary and questions for your visit. Join the test group." |
| IT description | "Prototipo per chi convive con Crohn o colite ulcerosa: organizza le informazioni e prepara un riepilogo e le domande per la visita. Unisciti al gruppo di test." |
| Open Graph | Title as above; image: Care Summary prototype (labelled); type website |
| Language | `lang="it"` with `hreflang` it/en |
| Indexing | `noindex` until the legal text (privacy notice) and working-name checks are complete |
| Name | State "working name" in the footer until trademark/domain/app-store checks are done |

---

## 7. Conversion measurement plan

**Principle:** measure behaviour, not health. **No health data in marketing forms or analytics.**

| Event | Trigger | Properties (no health data) | Notes |
|---|---|---|---|
| `page_view` | Landing page loaded | variant, language, traffic source group | Cookie-less analytics preferred; confirm legal requirements for the chosen tool |
| `cta_click` | Click on a CTA | cta_id (`join_test`, `talk_30`), variant, section | |
| `waitlist_submit` | Early-test form submitted | role (patient / clinician / association / other), country, language | **Fields: email, role, country, consent checkbox. Nothing about diagnosis or symptoms.** Double opt-in recommended |
| `interview_booked` | Calendar booking completed | role, source | Booking tool should not collect health data |
| `beta_activation` | Test participant completes a first prototype task (first check-in or first summary) | task type | Measured inside the prototype with example/consented data; **no marketing link between this and the email** unless the participant consents |

**Funnel:** visit → CTA click → waitlist submit → interview booked → activation.
**Success thresholds (proposed, set before launch, not benchmarks):** CTA click ≥ 10% of visits; visit→waitlist ≥ 5% from organic/association traffic; ≥ 30% of waitlist sign-ups in the target segment reply to the interview invitation; activation ≥ 60% of invited testers within a week.
**Reporting:** weekly in the dashboard (`10`), by variant and by source; include qualitative notes from replies.
**Privacy practice:** email stored in the newsletter tool only; one-click removal; retention period stated in the privacy notice; no third-party advertising pixels until legal review.

---

## 8. Not to do on this page
No testimonials, "as seen in", download counts, "clinically proven", "AI-powered", "save time", "fewer flares", "GDPR compliant", "secure and certified", "medical-grade", prices, countdown timers, or fear-based copy.
