# VIVIA — Security

Health data is special-category data. Security controls implemented in the MVP, and what production adds.

## Implemented

| Area | Control | Where |
|---|---|---|
| Authentication | bcrypt (cost 12) password hashes; ≥ 10-char passwords; constant-work login; per-IP rate limit on login/register | `server/auth.ts`, `server/rateLimit.ts` |
| Sessions | 256-bit random tokens, **only SHA-256 stored**, 30-day expiry, httpOnly + SameSite=Lax + Secure (prod) cookie, server-side logout | `server/auth.ts`, `server/session.ts` |
| CSRF | SameSite=Lax + Origin/Host check on every state-changing API call | `server/http.ts` (`withUser`) |
| Authorisation / patient isolation | `userId` comes only from the session; every service query is scoped by it; child entities reached through their owner; cross-user access returns 404 (no existence leak) | `server/services/*`, `tests/isolation.test.ts` |
| Input validation | Zod schemas with ranges on every endpoint | `lib/schemas.ts` |
| Uploads | magic-byte allow-list (PDF/PNG/JPEG), 15 MB cap, PDFs with JavaScript/Launch/EmbeddedFile/XFA rejected, AV-scan hook, served with `nosniff`, `private, no-store` | `services/fileValidation.ts`, `api/documents/[id]/file` |
| Encryption at rest | Documents encrypted with **AES-256-GCM** (random IV, auth tag) before storage; key from `VIVIA_ENCRYPTION_KEY` | `server/crypto.ts`, `server/storage` |
| Encryption in transit | HSTS; TLS terminated by the platform | `next.config.ts` |
| Headers | CSP (self + OSM tiles only), `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` (protects share tokens), `Permissions-Policy` (geolocation/mic/camera self only) | `next.config.ts` |
| Sharing | 192-bit tokens, only hashes stored, 1–30 day expiry, revocable, access-counted and audited, `noindex`, `no-store` | `services/summary.ts` |
| Offline cache | Service worker never caches `/api/*`; the emergency card is stored on the device only at the patient's explicit request and removed on account deletion from that device | `public/sw.js`, `components/EmergencyCard.tsx` |
| Location | Requested only on user action (`getCurrentPosition`, never `watchPosition`); coordinates never stored or logged | `lib/places.ts`, `api/locations/nearby` |
| Audit | `AuditLog` for auth, uploads, downloads, applies, conflicts, summaries, share create/access/revoke, consent changes, exports; no health values in metadata | `server/audit.ts` |
| AI | consent-gated third-party processing, minimised context, safety guard, `AiRun` audit | see AI_ARCHITECTURE.md |
| Secrets | `.env` git-ignored; `.env.example` has no values | repo |

## Tests covering security

`auth.test.ts` (hashing, sessions, expiry, consent required), `isolation.test.ts` (User A can never read,
modify, resolve, share or export User B's data), `documents.test.ts` (file validation, encryption at rest,
deletion), `flows.test.ts` (share-link expiry/revocation, consent-gated AI), `map-privacy.test.ts`
(erasure completeness).

## Production hardening (before real patients)

- Managed PostgreSQL in an EU region with encryption at rest, PITR backups, private networking; separate
  DB roles (app vs migration); consider PostgreSQL row-level security as defence in depth.
- KMS-managed envelope keys for documents (per-user data keys) + key rotation; encrypt `extractedText`.
- Redis-backed rate limiting at the edge; account lockout/notification; optional passkeys/2FA.
- Real antivirus scanning (ClamAV or vendor) in `scanForMalware`; image re-encoding to strip metadata.
- CSP nonces instead of `'unsafe-inline'`; Subresource Integrity; dependency scanning (npm audit, Renovate).
- Centralised, access-controlled log pipeline with retention; alerting on anomalous access.
- Penetration test and DPIA before launch; security incident & breach-notification runbook (GDPR art. 33/34).
