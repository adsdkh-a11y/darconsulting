# VIVIA — Figma master prompt

How to use: paste **PART A** first (the whole idea + design system), let the tool generate, then paste the **screen prompts in PART B one at a time** to refine each screen. Mobile first (iPhone 390 × 844). Ask for dark theme first, then a light variant.

---

## PART A — Master prompt (paste this first)

Design a mobile app called **VIVIA** — "Your IBD health hub". IBD = inflammatory bowel disease (Crohn's disease, ulcerative colitis), in French/Italian "MICI". Audience: people living with IBD or a stoma, mostly 18–45, often anxious, tired, sometimes in an urgent situation. The product promise: **everything about your IBD in one place, with less effort and better conversations with your care team.**

### Product pillars (design every screen around these)
1. **Low-friction logging.** A normal day takes under 30 seconds: one tap for overall mood, "Same as yesterday", or "Tell VIVIA" (speak or type a sentence, VIVIA turns it into a log and the user confirms before anything is saved).
2. **Health Memory timeline.** One timeline of symptoms, treatments, lab results, procedures, events and documents. **Every medical item shows its source** (entered by you / from a document / told to VIVIA / from your doctor) and a verification state.
3. **Documents → data, with the patient in control.** Upload a PDF/photo (colonoscopy, blood test, calprotectin, prescription). VIVIA extracts values, shows each next to the source text with a confidence level, and the user confirms / fixes / rejects each one. Nothing enters the health memory without confirmation. If two sources disagree, show a **conflict card** (current vs newly found) — VIVIA never decides silently.
4. **Doctor Care Summary.** One tap prepares a one-page summary for the next appointment: symptoms, treatment, adherence, labs, procedures, a well-being section, and suggested questions for the doctor. Patient chooses which sections to include, then downloads a PDF or creates a private expiring link (revocable).
5. **Bathroom emergency flow.** A permanent coral "Find a bathroom" button on every screen. Works **without an account**. Shows nearest open toilets with walking minutes, accessibility features (private cubicle, sink, bin, changing shelf, key access), and a "Can't wait" card to show staff.
6. **Stoma Mode.** Optional: filters for stoma-friendly bathrooms and stoma notes in check-ins.
7. **Offline emergency card.** Condition, medication, allergies, surgeries, contact — saved on the phone, opens without internet.
8. **Privacy by default.** Explicit consent screens, AI off until the user enables it, export all data, delete account, access log. EU-hosted.
9. **Psychological well-being.** Mood and stress are tracked by default; they appear in the Care Summary as the patient's own self-ratings, never as a diagnosis.

### Hard content rules (affect copy and UI)
- VIVIA **never diagnoses, never says "flare", never suggests changing/skipping/stopping a treatment**. It only compares the person **with their own recent pattern** ("Your pain has been above your usual level for 3 days — worth discussing with your care team").
- Neutral, warm, never alarmist. No red for symptoms; no shame, no streaks, no guilt about missed days.
- Footer on key screens: "VIVIA is not a doctor and does not give medical advice. In an emergency call 112."
- No emoji; use a consistent line-icon set (2px stroke, rounded).

### Visual design system
- **Brand colour: violet** (IBD awareness ribbon colour). Dark-first.
  - Dark: background `#0A0912`, surface `#14111F`, surface-2 `#1D1930`, ink `#F3F1FA`, secondary ink `#BDB8D0`, muted `#8D88A3`, **primary `#B69CFF`** with on-primary ink `#1B0C42`, chart violet `#8C6EE6`, hero gradient `#2B1B5C → #150D33` with a soft violet glow top-right.
  - Light: background `#F4F2F9`, surface `#FFFFFF`, surface-2 `#EBE7F4`, ink `#120D22`, **primary `#6A3FC9`**, chart `#6A3FC9`.
  - **Coral `#FF7B5C` (dark) / `#E2532F` (light) is reserved for urgency only** (bathroom button, "can't wait"). Amber `#FFC857` for warnings. Never use red for health values.
- **Type:** Manrope (variable). Large friendly headings (32–40, weight 700–800), body 16–17, minimum tap target 48 px.
- **Shape:** generous radii (cards 24, buttons full pill), soft glass bottom navigation, big calm spacing. Fintech-grade polish in the spirit of Revolut: dark cards, subtle gradients, crisp numerals (tabular), mini bar sparklines.
- **Logo:** an awareness-ribbon mark (a loop with two crossing tails, violet gradient) + wordmark "VIVIA" (extra-bold, wide tracking) + a small tag "MICI · IBD". App icon: ribbon on a dark violet rounded square.
- **Motion (specify as prototype interactions):** staggered rise-in of cards, pop on selection, drawing line charts, bars growing from the baseline, a pulsing ring on the user's location dot, a gentle glow on the microphone button, a breathing wave while listening. All must have a **reduced-motion** alternative.
- **Accessibility:** WCAG AA contrast, larger-text mode, high-contrast mode, screen-reader labels, never colour alone.
- **Languages:** EN, IT, FR, ES, DE and **Arabic with full RTL mirroring**. Leave 30% extra room for long German/Italian strings.

### Global layout
- Top bar: logo mark + "VIVIA" on the left with the greeting underneath ("Good afternoon, Anna"); on the right the coral pill **"Find a bathroom"**.
- Bottom glass navigation, 4 tabs + raised centre button: **Home · Memory · [microphone "Tell VIVIA"] · Map · Me**.

### Screens to produce (all in dark + light)
Splash · Welcome · Sign-up with consents · Onboarding (6 steps) · Home · Quick check-in · Tell VIVIA (3 states) · Health Memory timeline · Medication list/detail/add · Documents list · Document review · Conflict resolution · Trends · Doctor visits · Care Summary (preview + share) · Map (list + map) · Place detail · Bathroom emergency (no account) · Emergency card · Travel mode · Profile · Privacy & consent · Arabic RTL version of Home.

Deliver a component library (buttons, cards, chips, pills for source/verification, scale 0–10 input, 5-face mood selector, sparkline, bottom nav, sheet, toast) and a prototype linking the three critical flows: **(1) daily check-in in under 30 s, (2) upload document → verify → add to memory, (3) prepare doctor visit → share link.**

---

## PART B — Screen prompts (paste one at a time)

**1. Home.** Top bar as in the global layout. Hero card (dark violet gradient, glow top-right): date, "How are you feeling today?" and 5 face buttons (Very bad … Very good), under them two buttons: "Same as yesterday" and "Quick check-in". Below: a soft violet banner "2 documents waiting for your review →". A row of 5 round quick actions (Tell, Medication, Bathroom, Documents, Visit). Section "What changed": a horizontal carousel of cards, each with a metric name (e.g. "bowel movement frequency"), a big number "5.3 / day", a 14-bar sparkline where the last 3 bars are highlighted, and the neutral sentence "A change from your recent pattern, worth discussing with your care team." Next-treatment card with a circular progress ring and "Due today". Upcoming appointment card with a "Prepare" button. Empty state variant: "Your health story starts here." with three steps (first check-in, add your medication, upload a recent report).

**2. Quick check-in.** Title "Check-in", subtitle "Only what matters today. Everything else is optional." Steppers for bowel movements (and "at night"), a 7-step stool-consistency picker (hard → liquid), blood chips (None / Streaks / Visible / A lot), urgency chips (None / Mild / Strong / Couldn't wait), 0–10 scales for pain and fatigue, and — because well-being matters — mood (anchors "Low … Good") and stress. A "More details" toggle reveals bloating, nausea, appetite, sleep, stoma output, notes. Sticky bottom bar with a primary "Save" button and "Rather just say it?" link.

**3. Tell VIVIA.** Large centred microphone orb with a breathing wave while listening; text field with the example "Went to the bathroom 5 times, first two normal then diarrhea. No blood, pain 3/10 and I'm tired." After "Understand": a confirmation card listing parsed values as editable chips, values estimated from words flagged "estimated from your words — adjust if needed", an "Understood on this device" or "Understood with AI (you allowed this in Privacy)" label, and "Not recorded:" for anything unparsed. Confirm button saves; nothing is stored before.

**4. Health Memory timeline.** Filter chips (All, Symptoms, Treatment, Labs, Procedures, Events, Documents). Vertical timeline with date headers; each item has an icon, title, value, and a **source pill** ("From a document", "Told to VIVIA", "Entered by you") and a verification pill ("To confirm with doctor"). Floating actions: add event, add lab result.

**5. Document upload and review.** Upload card (PDF/JPEG/PNG up to 15 MB). Review screen: each extracted value as a card — label, value + unit, confidence badge (High / Medium / Low — check carefully), the exact quoted text from the document, and three buttons: Correct / Fix / Not right; "All remaining values are correct"; primary "Add confirmed values to my health memory". Banner when a conflict exists.

**6. Conflict resolution.** Two side-by-side cards: "Currently in VIVIA — 40 mg every 14 days" vs "Found in the prescription of Sept 27 — 40 mg every 7 days". Buttons: "Keep current", "Use the new one", "Need confirmation from doctor". Text: "VIVIA never decides for you."

**7. Care Summary.** Setup: period selector (30/90 days), section toggles (Symptoms, Treatment, Adherence, Lab results, Procedures, Hospital/urgent events, Documents, Trends, **Well-being**, My questions, My concerns). Result: a clean one-page document — patient header, overview, symptoms stats grid, bowel-movement bar chart, lab line charts, treatment list, adherence, **Well-being block (average mood, average stress, days of low mood, note "Self-rated by the patient. Not a screening or a diagnosis.")**, an editable numbered list of suggested questions, disclaimer footer. Actions: Download PDF, Print, "Share securely" (valid 1–30 days, one-time display of the link, revoke).

**7b. Shared link (doctor view).** Read-only, no account, expiry shown, no patient navigation.

**8. Map.** Segmented control List / Map, category chips (Bathrooms, Pharmacies, Hospitals, IBD centres, Airports, Stations, Hotels), filters (Stoma mode, Verified only, Open now only). Place cards: name, distance and "6 min walk", open/closed pill, reliability "4.5/5 (12)", feature icons, and a verification tag (Verified by VIVIA / Reported by users / From map data). Note: "Your location is used only for this search and is never stored."

**9. Bathroom emergency (no account).** Full-screen calm layout, coral accent: "Nearest open bathroom", one huge "Go" button with walking time, three alternatives below, and a "Show my 'can't wait' card" button that opens a full-screen card: "I have a medical condition (inflammatory bowel disease) and urgently need to use a toilet. Thank you for your understanding."

**10. Emergency card.** Toggles for what appears (condition, medication, allergies, surgeries, stoma, emergency contact, extra note), preview of the card in a high-contrast layout, "Save on this device for offline use".

**11. Privacy & consent.** One toggle row per consent with a one-sentence explanation (store my health data — required; AI help with logging and summaries; AI reading of documents; anonymous analytics; location when I search the map), then "Download all my data", "Delete my account and all data" (type DELETE), AI activity log, recent access log.

**12. Arabic RTL Home.** Same as screen 1, fully mirrored (logo on the right, nav order mirrored, chart direction kept, numerals consistent), Arabic strings.

---

## Notes for the designer
- The real app already exists (Next.js PWA). Design tokens above match the code in `vivia/src/app/globals.css`, so the Figma file can be handed to developers directly.
- Keep medical wording neutral and reviewed by a clinician before launch (see `docs/LAUNCH_CHECKLIST.md`).
