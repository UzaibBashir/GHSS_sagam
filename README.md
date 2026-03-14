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
- Single active admin session (new login invalidates old session)
- Host allowlist validation via `ALLOWED_HOSTS`
- Secure response headers via `middleware.js`
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
- `ALLOWED_HOSTS`
- `NEXT_PUBLIC_API_URL` (keep `/api` unless intentionally externalized)

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

## Note about legacy locked folders

If `backend/` or `frontend/` folders remain locally due a running process lock, they are excluded by `.gitignore` and not used by the app. You can remove them after stopping related Python/Node processes.
