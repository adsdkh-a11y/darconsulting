# VIVIA — Product

**VIVIA — Your IBD health hub.**
_Everything about your IBD. One place. Less effort. Better conversations with your care team._

VIVIA is a European, mobile-first personal health hub for people living with Crohn's disease, ulcerative
colitis, and people with a stoma. It is **not** another symptom tracker: it competes on *less friction,
better health context, better doctor communication and real-world IBD support*.

## The person we design for

Someone who may be in pain, in urgency, exhausted, anxious or foggy — often on a phone, often outside.
Every design decision is tested against that moment.

## The three critical flows

| Moment | Promise | Implementation |
|---|---|---|
| **Urgency** | Find a bathroom in seconds | `/bathroom`: one tap from every screen (and from the welcome screen **without an account**), location requested by that tap, nearest *open* place first with walking time, "Directions" hands off to the phone's maps app, a full-screen "can't wait" card. Stoma filters if Stoma Mode is on. |
| **Pain** | Log without filling a form | "A good day" = one tap. Quick check-in shows only the symptoms the person chose (progressive disclosure). "Same as yesterday" = one tap. **Tell VIVIA** by text or voice → "I understood: … [Confirm] [Edit] [Cancel]". |
| **Before a visit** | A useful summary in one or two taps | **Prepare my doctor visit** → Care Summary (since last appointment, adherence, labs, procedures, events, documents, trends, *my questions*, *my concerns*) → edit questions → PDF / print / expiring secure link. |

Measured in the E2E run (local, production build): one-tap check-in round-trip ≈ 130 ms; nearest-bathroom
result ≈ 0.5 s after the tap (geolocation granted).

## Differentiators (what we win on)

1. **Lowest tracking friction** — Tell VIVIA, one-tap good day, repeat yesterday, personal symptom set.
2. **Health Memory** — one structured longitudinal record; every item carries provenance
   (entered by you / from a document / told to VIVIA / device / doctor) and verification status.
3. **Contextual AI** — AI works on the patient's own structured data through a context builder, never as a
   disconnected chatbot; everything is confirmed by the patient.
4. **Doctor-ready communication** — facts + questions, not just charts; patient controls what is shared.
5. **Real-world IBD support** — bathrooms, stoma-friendly places, pharmacies, hospitals, IBD centres,
   travel essentials, offline emergency card.
6. **Privacy** — health-data consent, AI off by default, export, deletion, audit trail, no ads, no data sale.

## Screens (MVP)

| # | Screen | Route |
|---|---|---|
| 1 | Splash | `/` |
| 2 | Welcome | `/welcome` |
| 3 | Onboarding (name, language, condition, stoma, symptoms) | `/onboarding` |
| 4 | Home | `/home` |
| 5 | Quick check-in | `/log` |
| 6 | Natural-language logging (+ voice) | `/log/tell` |
| 7 | Medication | `/medications` (+ `/medications/new`) |
| 8 | Medication detail (dose log, adherence, history) | `/medications/[id]` |
| 9 | Timeline (Health Memory) | `/timeline` |
| 10 | Documents | `/documents` |
| 11 | Document detail ("What your document says" / "Help me understand") | `/documents/[id]` |
| 12 | AI extraction review | `/documents/[id]/review` |
| 13 | Health trends (+ questionnaires) | `/trends`, `/trends/q/[code]` |
| 14 | Doctor visit | `/visits`, `/visits/[id]` |
| 15 | Generate / view summary | `/summaries/[id]` (+ public `/share/[token]`) |
| 16 | Map | `/map` |
| 17 | Bathroom emergency mode | `/bathroom` (public) |
| 18 | Stoma mode | onboarding + profile toggle; filters in `/map` and `/bathroom` |
| 19 | Location detail (reviews, report incorrect info) | `/map/[id]` |
| 20 | Profile | `/me` |
| 21 | Privacy & consent | `/privacy` |
| 22 | Medical emergency card | `/emergency-card` (+ offline `/card`) |
| + | Records to check (conflicts) | `/conflicts` |
| + | Travel mode (foundation) | `/travel` |

## Language and tone rules

- Never diagnose, never say "flare", never suggest changing treatment.
- Changes are described relative to the person's **own** pattern:
  "Your bowel movement frequency has been above your recent 30-day baseline for 3 days. This is a change from
  your recent pattern that may be worth discussing with your care team."
- Adherence is shown as neutral counts ("12 taken · 1 skipped"), never as grades or streaks.
- No leaderboards, no streak pressure, no fear-based alerts, no red "danger" dashboards.
- Food correlations (future) use "appears alongside", never "causes".

## Success metrics (what we instrument next)

| Area | Metric | Target |
|---|---|---|
| Activation | Onboarding completed | > 80 % of sign-ups |
| Daily usability | Time to log a normal day | < 30 s (one tap today) |
| Retention | D7 / D30 active | tracked |
| Doctor usefulness | % users generating ≥ 1 Care Summary before a visit | tracked |
| Data quality | % AI-extracted fields confirmed vs rejected | tracked (`ExtractedField.status`) |
| Real-world utility | Bathroom searches ending in "Directions" | tracked |
| Trust | Privacy/consent comprehension (in-app micro-survey) | tracked |

Analytics are consent-gated (`PRODUCT_ANALYTICS`, off by default) and never include health values.
