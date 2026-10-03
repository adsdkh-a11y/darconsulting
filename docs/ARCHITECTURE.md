# VIVIA — Architecture

## 1. Repository inspection (phase 1 report)

| Item | Finding (30 Sep 2026) |
|---|---|
| Existing architecture | None. The repository `darconsulting` contained one commit and a single 1-byte file (`Linkedinskill`). |
| Framework / dependencies | None. |
| Database | None. |
| Authentication | None. |
| Current UI / reusable components | None. |
| Problems | No existing code to reuse; no mobile stack (React Native/Expo) to preserve. |
| Recommendation | Greenfield **Next.js (App Router) + TypeScript + PostgreSQL/Prisma**, mobile-first installable **PWA**, as the brief prefers. Keep all business logic in a framework-independent service layer so a native shell (Expo/Capacitor) or a separate API server can be added without rewriting it. |

The app lives in `vivia/`; product/engineering docs in `docs/`.

## 2. System overview

```
 Browser / PWA (mobile-first, offline card + bathroom shell via service worker)
        │  HTTPS, httpOnly session cookie (SameSite=Lax) + Origin check
        ▼
 Next.js App Router
   ├─ Server Components (pages)  ──┐
   └─ Route Handlers  /api/*  ─────┤  withUser(): userId ONLY from session
                                   ▼
             Service layer  src/server/services/*   (all business rules; every query scoped by userId)
                 │         │            │             │
                 ▼         ▼            ▼             ▼
           Prisma/PG   Storage       AI layer       Maps layer
           (Health     (encrypted    (providers +   (Location DB +
            Memory)     blobs)        safety +       external places
                                      context)       providers)
```

### Layers

| Layer | Path | Notes |
|---|---|---|
| Pages | `src/app/(app)/**` (authenticated), `src/app/{welcome,login,register,onboarding,bathroom,card,share}` (public) | Server Components read services directly; client components call `/api/*`. |
| API | `src/app/api/**/route.ts` | Thin: validate with Zod → call service → JSON. `withUser` enforces auth + same-origin. |
| Services | `src/server/services/*.ts` | Pure TypeScript + Prisma. No Next.js imports → unit/integration-testable, portable to a standalone API. |
| AI | `src/server/ai/*` | `AIProvider` interface; `AnthropicProvider` and offline `RulesProvider`; safety guardrails; audit (`AiRun`). See AI_ARCHITECTURE.md. |
| Storage | `src/server/storage` | `StorageProvider` interface; local AES-256-GCM encrypted driver; S3-compatible (EU region) driver is a drop-in. |
| Maps | `src/server/maps`, `src/server/services/locations.ts` | VIVIA `Location` table is the source of truth; `PlacesProvider` (OpenStreetMap Overpass) imports candidates tagged `MAP_PROVIDER`. Directions are handed off to Apple/Google Maps. Tiles: OSM via Leaflet (swappable). |
| i18n | `src/lib/i18n` | Flat keyed dictionaries; EN reference; IT complete; FR/ES/DE/AR core flows with EN fallback; RTL for Arabic. No hard-coded UI strings in components (a few admin/demo labels excepted — see ROADMAP). |

### Vendor decoupling

| Concern | Abstraction | MVP implementation | Swap target |
|---|---|---|---|
| AI | `AIProvider` | Anthropic Claude (`claude-opus-5-5`, structured outputs) + offline rules | any LLM, on-prem model |
| Storage | `StorageProvider` | local encrypted FS | S3/MinIO/OVH/Scaleway (EU) |
| Places | `PlacesProvider` | OSM Overpass (opt-in by env) | Google Places, partner feeds |
| Map tiles | `LeafletMap` component | OSM tiles | MapTiler/Mapbox/self-hosted |
| Notifications | `Notification` table (model only) | — | Web Push / APNs / FCM |
| Analytics | consent flag only | — | privacy-first (e.g. self-hosted Plausible/PostHog EU) |
| Auth | `src/server/auth.ts` | bcrypt + DB sessions | OIDC/passkeys provider |

## 3. Mobile strategy

Mobile-first responsive layout (max-width 28 rem, 48 px touch targets, bottom navigation, sticky primary
actions, safe-area insets), installable PWA (`manifest.webmanifest` with shortcuts to *Find a bathroom*,
*Quick check-in*, *Emergency card*) and a service worker that caches only the offline card and bathroom shell —
never API responses. Native capabilities that need a wrapper (Apple Health, Health Connect, lock-screen
widget, Wallet card) are planned via Capacitor/Expo around the same service API (ROADMAP).

## 4. Key flows (sequence)

**Tell VIVIA:** text/voice → `POST /api/log/interpret` → provider (consent-gated) → `AiRun` saved, **no health
data written** → UI shows "I understood" → `POST /api/log/confirm` with the (possibly edited) values → Symptom
entry/medication events/food with `sourceType=AI_NATURAL_LANGUAGE, sourceId=AiRun.id` → `AiRun.userConfirmed=true`.

**Document:** upload → magic-byte/size/active-content validation → encrypted storage → text layer (unpdf) or
AI vision (consent-gated) → classification + extraction → anchoring check (every value must appear in the
text) → `ExtractedField`s `PENDING` → patient confirm/edit/reject → `apply` → Health Memory rows with
`DOCUMENT_EXTRACTION` provenance, or `DataConflict` when data disagrees.

**Care Summary:** context builder selects period × chosen sections → deterministic facts → AI writes overview
+ questions from facts only → guardrails → immutable JSON snapshot (`VisitSummary`) → PDF/print/share link.

## 5. Future doctor portal (designed, not built)

- `ShareLink` already models a patient-controlled, expiring, revocable, audited grant to a snapshot. A
  `CareTeamGrant` (doctor account ↔ patient, scopes, expiry) generalises it.
- `SourceType.DOCTOR_ENTERED` and `Notification.kind = doctor_request` are reserved for
  "Requested by Dr. X: please complete a symptom check before the appointment".
- Services are already user-scoped; a doctor role would call the same services through a grant check.

## 6. Running locally

See `vivia/README.md`.
