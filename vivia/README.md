# VIVIA — Your IBD health hub

Mobile-first personal health hub for people living with Crohn's disease, ulcerative colitis or a stoma.
Next.js 15 (App Router) · TypeScript · PostgreSQL + Prisma · installable PWA.

Product & engineering docs: [`../docs`](../docs) — PRODUCT, ARCHITECTURE, COMPETITIVE_ANALYSIS, DATABASE,
AI_ARCHITECTURE, SECURITY, COMPLIANCE, ROADMAP.

> VIVIA is not a doctor and does not give medical advice. See `docs/COMPLIANCE.md` for the wellness vs
> medical-device boundary.

## Quick start

Requirements: Node 20+, PostgreSQL 14+.

```bash
cp .env.example .env
# set DATABASE_URL and VIVIA_ENCRYPTION_KEY (openssl rand -base64 32)
npm install
npm run db:migrate
npm run db:seed        # fictional demo patient + demo places in Milan
npm run dev            # http://localhost:3000
```

Demo login: **anna.rossi@demo.vivia / vivia-demo-2026** (all data fictional).

### AI

By default VIVIA uses its **offline engine** (no data leaves the server). To enable Claude:

```bash
AI_PROVIDER=auto            # or "anthropic"
ANTHROPIC_API_KEY=...       # optional AI_MODEL (default claude-opus-5-5)
```

Even then, third-party AI is used only for patients who switch on *AI help* / *AI reading of documents* in
Privacy (off by default).

### Optional

`MAP_EXTERNAL_PROVIDER=overpass` imports public toilets/pharmacies/hospitals from OpenStreetMap when the
local database has few results near a search. `STORAGE_DIR` sets where encrypted documents are stored.

## Scripts

| Command | What |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Vitest service & security tests against a real PostgreSQL test DB (`TEST_DATABASE_URL`, default `postgresql://vivia:vivia@localhost:5432/vivia_test`; it is reset on every run) |
| `npm run e2e` | Browser run of the critical flows (needs a running server: `BASE_URL`, Chromium path via `CHROMIUM_PATH`) |
| `npm run db:migrate` · `db:seed` · `db:reset` | Database |

## Layout

```
src/app/(app)/…        authenticated screens (home, log, timeline, documents, trends, visits, map, me…)
src/app/{welcome,login,register,onboarding,bathroom,card,share}   public screens
src/app/api/…          route handlers (thin; Zod validation; userId from session only)
src/server/services    business logic — every query scoped by userId
src/server/ai          AIProvider (Anthropic + offline rules), safety guard, audit
src/server/storage     encrypted object storage abstraction
src/lib/i18n           EN (reference), IT (complete), FR/ES/DE/AR (core flows)
prisma/                schema, migrations, fictional seed
tests/                 vitest suites incl. patient-isolation tests
e2e/                   Playwright-driven critical-flow check
```
