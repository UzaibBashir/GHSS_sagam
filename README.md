      
                            
 # GHHS Web App (Next.js Full-Stack)
 
This project is now a single **Next.js** application with both frontend and backend API in one codebase, ready for Vercel deployment.

## Stack

- Next.js App Router (frontend + API route handlers)
- React
- Tailwind CSS

## API

All backend endpoints are served from `app/api/[[...path]]/route.js` under `/api/*`.

Examples:

- `GET /api/health`
- `GET /api/institute`
- `POST /api/contact`
- `POST /api/admin/login`
- Admin secured routes under `/api/admin/*`

## Security hardening included

- Admin token auth with expiry
- Login lockout after repeated failures
- Per-IP rate limits for contact and login endpoints
- Host allowlist validation via `proxy.js`
- Security headers via `next.config.mjs`
- Nonce-based CSP + HSTS in production via `proxy.js`
- Production guard for weak admin secrets

## Environment variables

Copy `.env.example` to `.env.local` and set secure values:

- `ENVIRONMENT`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (32+ chars)
- `ADMIN_TOKEN_TTL_SECONDS`
- `ADMIN_FAILED_LOGIN_LIMIT`
- `ADMIN_LOCKOUT_SECONDS`
- `STUDENT_TOKEN_TTL_SECONDS`
- `RATE_LIMIT_WINDOW_SECONDS`
- `ADMIN_RATE_LIMIT`
- `STUDENT_RATE_LIMIT`
- `CONTACT_RATE_LIMIT`
- `MONITORING_RATE_LIMIT`
- `MONITORING_INGEST_KEY` (optional shared key for monitoring ingest)
- `ALLOWED_HOSTS`
- `NEXT_PUBLIC_API_URL` (keep `/api` unless intentionally externalized)
- `ALLOW_MEMORY_STORE_FALLBACK` (set `0` in production)
- `STUDENT_BOOTSTRAP_JSON` (optional one-time bootstrap with hashed/plain passwords)
- `STORAGE_DRIVER` (`local` or `s3`)
- `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`
- `STORAGE_PUBLIC_BASE_URL` (optional CDN/base URL for object URLs)

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Final deployment checks

```powershell
npm run lint
npm run build
```

## Deploy to Vercel

1. Import this repo into Vercel.
2. Framework preset: **Next.js**.
3. Root directory: repository root.
4. Add the environment variables above in Vercel Project Settings.
5. Deploy.

## Persistence and storage

- Application state is persisted to MongoDB.
- State is partitioned into separate Mongo collections (meta/contacts/admissions/students/institute/security/monitoring/backups) with optimistic version checks.
- Uploads use a storage abstraction: local filesystem by default, S3-compatible object storage when `STORAGE_DRIVER=s3`.
- In production, set `ALLOW_MEMORY_STORE_FALLBACK=0` to prevent silent fallback to in-memory state when MongoDB is unavailable.

## Note about legacy locked folders

If `backend/` or `frontend/` folders remain locally due a running process lock, they are excluded by `.gitignore` and not used by the app. You can remove them after stopping related Python/Node processes.
