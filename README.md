# GHHS Web App

Production-ready school web application with separate frontend and backend codebases.

## Architecture

- `frontend/`: Next.js (React) web app
- `backend/`: FastAPI REST API

## Security Hardening Included

- Admin authentication with token-based session
- Admin login lockout after repeated failed attempts
- Single active admin session (new login invalidates old tokens)
- Admin-only control endpoints for:
  - Notifications page enable/disable
  - Academics page enable/disable
  - Admission open/close
  - Admission Google Form link update
- Backend security headers
- Frontend response security headers
- Trusted hosts support in backend
- Environment-based configuration for CORS and runtime security

## Project Structure

- `backend/main.py`: FastAPI app and admin APIs
- `backend/requirements.txt`: backend dependencies
- `backend/.env.example`: backend environment template
- `frontend/app`: Next.js app router pages/components
- `frontend/.env.example`: frontend environment template
- `frontend/next.config.mjs`: frontend security headers

## Local Development

### 1) Backend setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env
```

Then set strong values in `backend/.env`:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CORS_ALLOW_ORIGINS`
- `ALLOWED_HOSTS`

Run backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2) Frontend setup

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to your backend URL.

## Production Deployment

### Backend (FastAPI)

1. Set environment variables using secure secrets management.
2. Set:
   - `ENVIRONMENT=production`
   - strong `ADMIN_PASSWORD`
   - strict `CORS_ALLOW_ORIGINS` (no wildcard)
   - strict `ALLOWED_HOSTS` (your domain names)
3. Run behind reverse proxy (Nginx/Caddy) with HTTPS.
4. Disable debug logging and expose only required ports.

Example production command:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

### Frontend (Next.js)

1. Build and start:

```powershell
cd frontend
npm ci
npm run build
npm run start
```

2. Serve behind HTTPS reverse proxy.
3. Ensure `NEXT_PUBLIC_API_URL` points to deployed backend API.

## Admin Portal Controls

Admin can manage:

1. Notifications page visibility
2. Academics page visibility
3. Admission state (open/closed)
4. Admission Google Form link

## Verification Commands

### Frontend

```powershell
cd frontend
npm run lint
npm run build
```

### Backend

```powershell
cd backend
.\.venv\Scripts\python.exe -m py_compile main.py
```

## Security Notes

- No software is guaranteed unhackable; this project is hardened for practical deployment but still requires monitoring and updates.
- Rotate admin credentials periodically.
- Always run with HTTPS in production.
- Keep dependencies updated.
- Add database-backed auth/session storage for multi-instance deployments.

## Next Recommended Improvements

1. Replace in-memory admin sessions with Redis/database-backed sessions.
2. Add structured audit logs for admin actions.
3. Add CSRF protection and stricter rate-limiting middleware.
4. Add CI pipeline for lint/build/tests before deployment.