
# GHSS Sagam Website

Live site: https://ghss-sagam.vercel.app

Government Girls Higher Secondary School, Sagam, is a full-stack school website built with Next.js App Router. It combines the public website, admin workflows, and API services in one deployable codebase.

## Why It Matters

- Single-codebase delivery for public content, protected administration, and API endpoints.
- Production-oriented security posture with CSP, HSTS, session auth, rate limiting, and host validation.
- Practical workflows for admissions, notices, downloads, timetable management, teachers, students, and contact intake.
- Flexible storage support for local files, MongoDB-backed persistence, or S3-compatible object storage.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- MongoDB
- AWS SDK S3 client for object storage mode

## What Is Included

- Public pages for academics, admissions, notifications, downloads, contact, and institute information.
- Admin panel for content editing, approvals, timetable management, and record handling.
- API routes for institute data, contact submissions, authentication, reporting, and operational actions.
- SEO-friendly metadata, sitemap, robots, and structured data support.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000 after the server starts.

## Environment Setup

Copy `.env.example` to `.env.local` and set the required values before running or deploying.

Required for a production deployment:

- `MONGODB_URI`
- `ADMIN_SESSION_SECRET`
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` or a hashed admin password value

Common production settings:

- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_SITE_VERIFICATION`
- `ALLOWED_HOSTS`
- `STORAGE_DRIVER`
- `S3_*` values when object storage is enabled

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Deployment Notes

- Vercel is the primary deployment target.
- Production host validation is enforced by default.
- The app is designed to work with either local uploads, MongoDB-backed persistence, or S3-compatible storage depending on environment variables.
