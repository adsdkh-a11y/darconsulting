# VIVIA — Roadmap

## Delivered in this MVP

**P0 (all working end-to-end, covered by tests and the browser E2E run)**
Authentication · Onboarding · Patient profile · Medication (any route/form, adherence) · Symptoms (one-tap,
progressive check-in) · Timeline with provenance · Document upload · AI document extraction with per-field
verification · Health Memory with conflict resolution · Doctor summary (PDF, print, edit questions) ·
Bathroom map (public emergency flow) · Stoma map foundation (Stoma Mode, verified/community/unverified
features, reviews, reports) · Privacy controls (consents, export, deletion, audit, AI activity).

**P1 delivered:** Natural-language logging · Voice logging (Web Speech) · Personal baselines · Lab trends ·
Emergency medical card (offline on device) · HBI/SCCAI questionnaires · Apple Health/Health Connect **data
landing zone** (`HealthMetric`, `DEVICE_IMPORT`).

**P2 foundations:** Secure share links (expiring, revocable, audited) · Travel mode (checklist + destination
essentials) · doctor-portal-ready data model.

## Known gaps / next

| Priority | Item |
|---|---|
| P1 | Reminders & notifications (Web Push; native push in wrapper) for medication and appointments |
| P1 | Native wrapper (Capacitor/Expo) for Apple Health / Health Connect import, widgets, Wallet emergency card, lock screen |
| P1 | Complete FR/ES/DE/AR translations (core flows done; other screens fall back to English); translate remaining hard-coded labels (manual lab/event form, error pages, expired-share page, chart "Table" toggle) |
| P1 | Food: quick entry & photo screen (today food is captured via Tell VIVIA only); careful correlation view ("appears alongside…") |
| P1 | IBD Disk questionnaire; per-instrument licensing check |
| P1 | Background job queue for document processing (today synchronous); OCR for scanned PDFs without AI consent (Tesseract on server) |
| P1 | Server-side location timezone (hours are evaluated in Europe/Rome for the demo data set) |
| P2 | Doctor portal (grants, patient summary, trends, questions; "Requested by Dr. X" check-ins) |
| P2 | Travel mode: saved destinations, offline map packs, translated "can't wait" cards per country |
| P2 | Community (moderation, anonymity, misinformation controls) — only after trust & safety design |
| P2 | Wearables; healthcare integrations (FHIR) |
| Ops | Production hardening list in SECURITY.md; DPIA, DPA/SCCs, clinical review (COMPLIANCE.md) |
| Ops | Privacy-first analytics for the success metrics in PRODUCT.md |

## Explicitly out of scope (by design)

Hospital/insurance integrations, e-prescriptions, clinical decision support, autonomous treatment
recommendations, diagnosis, flare prediction, social network, advertising, selling health data.
