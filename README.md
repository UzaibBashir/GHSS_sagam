
# GHSS Sagam Website

## Live Website
**https://ghss-sagam.vercel.app**

A production-focused school platform built with Next.js, combining a modern public-facing website with secure admin workflows and API services in one codebase.

## Why This Project Stands Out
- Full-stack delivery in a single Next.js App Router architecture
- Security-first backend design (rate limiting, lockouts, token expiry, host validation, CSP/HSTS)
- Real-world admin operations: content updates, admissions, contact management, and student workflows
- Deploy-ready with scalable storage options (MongoDB + local/S3 file storage)

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- MongoDB
- AWS SDK S3 client (for object storage mode)

## Core Capabilities
- Public pages: academics, admissions, notifications, downloads, contact, and institutional info
- Admin panel with protected authentication and operational controls
- API routes for institute data, contact intake, reporting, and admin actions
- SEO-ready metadata, sitemap, robots, and structured data support

## Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Production Checklist
```bash
npm run lint
npm run test
npm run build
```

Set environment variables from `.env.example` before deployment.

## Deployment
Optimized for Vercel deployment with repository-root configuration and environment-based runtime settings.
