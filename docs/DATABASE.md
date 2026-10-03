# VIVIA — Database

PostgreSQL 16 + Prisma 6. Schema: `vivia/prisma/schema.prisma`. Migrations: `vivia/prisma/migrations`.

## Conventions

- **UUID** primary keys everywhere.
- **Patient isolation:** every patient-owned row has `userId`. The service layer only ever queries with a
  `userId` filter taken from the session (never from the request). Child rows without `userId`
  (`ExtractedField`, `BowelMovement`) are reached only through their owner (`extraction.document.userId`).
  Verified by `tests/isolation.test.ts`.
- **Provenance on every medical entity:** `sourceType` (`PATIENT_ENTERED`, `DOCUMENT_EXTRACTION`,
  `AI_NATURAL_LANGUAGE`, `DEVICE_IMPORT`, `DOCTOR_ENTERED`, `DEMO`), `sourceId` (document / AI run id),
  `verificationStatus` (`UNVERIFIED`, `PATIENT_CONFIRMED`, `NEEDS_DOCTOR_CONFIRMATION`, `REJECTED`),
  `createdAt`, `updatedAt`. When a later log from another source adds to the same day's check-in, it is
  appended to `SymptomEntry.mergedSources` — provenance is never overwritten.
- **Deletion:** `onDelete: Cascade` from `User`; files are removed from storage first; a non-identifying
  `DeletionRecord` (hash of the user id) is kept.

## Entities

| Group | Model | Purpose |
|---|---|---|
| Identity | `User`, `Session` | Account; sessions store **SHA-256 of the token** only. |
| | `PatientProfile` | Display name, stoma (Stoma Mode), tracked symptoms, locale. |
| Disease | `Diagnosis` | Disease type, location, date — with provenance. |
| | `ClinicalEvent` | Hospitalisation, urgent visit, ER, surgery, stoma created/reversed, major symptom event (disease history). |
| Treatment | `Medication` | Generic model: 6 routes × 10 forms; schedule = `intervalDays` × `timesPerDay`, or `asNeeded`; `scheduleNote` for anything else. (The brief's `MedicationSchedule` is folded into these fields; a separate table is only needed for multi-phase regimens — ROADMAP.) |
| | `MedicationEvent` | TAKEN / SKIPPED / DELAYED / NOT_APPLICABLE, timestamp, optional reason & notes. |
| Symptoms | `SymptomEntry` | One additive check-in per day; all fields optional (progressive disclosure); `rawText` keeps the original "Tell VIVIA" text. |
| | `BowelMovement` | Optional per-event detail. |
| | `FoodEntry` | Optional, never central. |
| | `HealthMetric` | Weight, temperature, sleep… landing zone for Apple Health / Health Connect (`DEVICE_IMPORT`). |
| | `QuestionnaireResponse` | Validated instruments: instrument, version, date, answers, score. |
| Objective | `LabResult` | Normalised `testCode` (CRP, CALPROTECTIN, HB, FERRITIN, WBC, PLT, ALBUMIN, ESR, VITD…) + verbatim name, value / valueText, unit, reference range. |
| | `Procedure` | Colonoscopy, MRI, CT, ultrasound, surgery…; findings **verbatim**; biopsy taken. |
| Documents | `MedicalDocument` | Metadata + encrypted blob key + sha256 + extracted text. |
| | `DocumentExtraction` | Classification + confidence + strict summary + link to `AiRun`. |
| | `ExtractedField` | value, unit, **source snippet**, **confidence**, **status** (PENDING/CONFIRMED/EDITED/REJECTED), `appliedEntity` once written. |
| Care team | `Doctor`, `HealthcareOrganization`, `DoctorVisit` | Appointments + patient concerns. |
| | `VisitSummary` | Immutable JSON snapshot of a Care Summary (reproducible sharing). |
| | `ShareLink` | Token **hash**, expiry, revocation, access count. Foundation for doctor access grants. |
| Integrity | `DataConflict` | Existing vs new value, source, proposed record; OPEN / KEEP_EXISTING / KEEP_NEW / NEEDS_DOCTOR_CONFIRMATION. |
| | `AiRun` | Provider, model, task, **input scope**, source refs, output, safety flags, user confirmation. |
| Map | `Location` | Category, coordinates, hours (`hoursJson`), `source`, `verificationType` (MAP_PROVIDER / USER_REPORTED / VIVIA_VERIFIED / PARTNER_VERIFIED), `lastVerifiedAt`. |
| | `LocationFeature` | Stoma-relevant features, each VERIFIED / COMMUNITY_REPORTED / UNVERIFIED. |
| | `LocationReview`, `LocationReport` | Reliability ratings; "report incorrect information". (The brief's `LocationVerification` is represented by `verificationType` + `lastVerifiedAt` + per-feature status.) |
| Privacy/ops | `Consent` | Append-only history per consent type & version. |
| | `AuditLog` | Security-relevant actions (no health values in metadata). |
| | `Notification` | Reminders / future doctor requests (model only). |
| | `EmergencyCard` | What the patient chooses to show. |
| | `DeletionRecord` | Non-identifying erasure record. |

**Location privacy:** there is no table for user positions. Coordinates only exist in the query string of a
single `/api/locations/nearby` request.

## Indexes

Patient-scoped time-series indexes: `(userId, date)`, `(userId, occurredAt)`, `(userId, testCode, takenAt)`,
`(userId, createdAt)`; `Location (category)`, `(latitude, longitude)` (bounding box pre-filter, then Haversine).
Production: PostGIS `geography` + GiST index for large place datasets.

## Commands

```bash
npm run db:migrate   # apply migrations
npm run db:seed      # fictional demo data (Anna Rossi + demo places)
npm run db:reset     # drop + migrate + seed (dev only)
```
