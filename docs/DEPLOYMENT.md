# VIVIA — Deployment

Target: a **private, invite-only demo** in the EU. Not yet suitable for real patient data
(see "Before real patients" below and `COMPLIANCE.md`).

## What is in the repository

| File | Purpose |
|---|---|
| `vivia/Dockerfile` | Production image: installs, builds, applies DB migrations, then serves on `$PORT`. |
| `render.yaml` (repo root) | Render Blueprint: web service + EU Postgres + persistent disk + generated encryption key. |
| `vivia/src/app/api/health/route.ts` | `GET /api/health` → `{"ok":true}` after a database check. Used as the platform health check. No health data. |
| `vivia/.env.example` | The environment variables the app reads. |

Verified locally: the start command (`prisma migrate deploy` then `next start`) on an **empty** database applies
all migrations and `/api/health` answers 200. The Docker image itself and `render.yaml` were **not** built or
applied here (no Docker daemon, no Render access) — check them on the first deploy.

## Deploy on Render (about 10 minutes)

1. Merge the pull request into `main` (or deploy the branch directly).
2. Create a Render account and connect GitHub (Dashboard → Account → GitHub).
3. **New → Blueprint** → choose the `darconsulting` repository and branch → **Apply**.
   Render creates `vivia-db` (Frankfurt), the `vivia` web service, a 5 GB disk at `/data`, and a generated
   `VIVIA_ENCRYPTION_KEY`.
   If Render rejects a plan name, pick the nearest paid plan in the dashboard (disks need a paid web plan).
4. **Back up `VIVIA_ENCRYPTION_KEY`** (service → Environment → reveal → copy to a password manager).
   If it is lost, every uploaded document becomes unreadable.
5. Wait for the first deploy to turn green (health check `/api/health`).
6. Optional: add `ANTHROPIC_API_KEY` under Environment to enable Claude. Each patient must still switch AI on in
   *Privacy*; without a key VIVIA uses its offline engine.
7. Optional, **demo only**: open the service **Shell** and run `npm run db:seed` to load the fictional patient
   (`anna.rossi@demo.vivia`, password in `prisma/seed.ts`). Never seed an environment with real users.
8. Custom domain: service → Settings → Custom Domains. HTTPS is automatic.

## Other hosts

- **Railway / Fly.io**: same image; set the same variables, attach a volume at `/data`, EU region.
- **Vercel**: not supported as-is — functions have no persistent disk, and documents are stored on disk.
  It needs an S3-compatible storage driver first (`StorageProvider` in `vivia/src/server/storage`).
- **Any VPS**: `docker build -t vivia vivia && docker run -p 3000:3000 -v vivia-data:/data --env-file .env vivia`
  behind a TLS reverse proxy.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL URL (add `?sslmode=require` for hosted providers that need it). |
| `VIVIA_ENCRYPTION_KEY` | yes | 32 random bytes, base64 (`openssl rand -base64 32`). The app refuses to store files without it. |
| `STORAGE_DIR` | yes | Folder on the persistent disk (`/data/storage`). |
| `AI_PROVIDER` | no | `auto` (default), `anthropic`, or `rules`. |
| `ANTHROPIC_API_KEY` / `AI_MODEL` | no | Enables Claude (default model `claude-opus-5-5`). |
| `MAP_EXTERNAL_PROVIDER` | no | `overpass` imports public places from OpenStreetMap. |

## Operating notes

- **One instance only.** The disk and the in-memory rate limiter are per instance; scaling out needs shared object
  storage and a Redis-backed limiter (`SECURITY.md`).
- **Backups:** enable the database's automatic backups; snapshot the disk. Restore needs both **and** the key.
- **Updates:** pushes to the connected branch redeploy automatically; migrations run on start.

## Before real patients

Data protection impact assessment, privacy notice and terms, processor agreements (hosting, Anthropic),
clinical review, antivirus scanning, monitoring and alerting, restore drill, penetration test — see
`COMPLIANCE.md` and `SECURITY.md`. VIVIA stays on the wellness / self-management side of the medical-device line.
