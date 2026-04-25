# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PrimeTvNashville is a Next.js 16 web application for a TV mounting and installation business in Nashville. It combines a marketing site, MDX-based blog, contact/quote forms, and a protected admin dashboard for managing customer leads.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint (next/core-web-vitals)
```

No test suite is configured.

## Architecture

### App Router Structure

Uses Next.js App Router (`src/app/`). Key areas:

- **`src/app/api/`** — Backend API routes (route.js files with HTTP method exports)
  - `leads/` — CRUD for customer leads (POST, GET, DELETE)
  - `send-email/` — Nodemailer email notifications via Gmail SMTP
  - `quote/` — Quote calculation
  - `login/` / `logout/` — Admin session management
  - `fb-conversions/` — Facebook Conversions API integration
- **`src/app/admin/`** — Protected admin pages (login + leads dashboard)
- **`src/app/components/`** — Shared React components
- **`src/app/blog/`** — Blog listing and dynamic `[slug]` pages
- **`src/app/lib/blog.js`** — Reads MDX files from `content/blog/` using gray-matter + next-mdx-remote

### Data Layer

- **MongoDB + Mongoose** — `src/lib/mongodb.js` provides a connection-pooling helper (`connectToDatabase()`). All API routes call this before querying.
- **Models** — `src/models/Lead.js` and `src/models/User.js`
- **Blog content** — Static MDX files in `content/blog/` (not database-backed)

### Authentication

`middleware.js` guards all `/admin/*` routes by checking for an `admin-auth` cookie. The cookie is set client-side on login with a 1-day expiry. There is no JWT or server-side session.

### Path Aliases

`@/*` maps to `./src/*` (configured in `jsconfig.json`). Use this for all internal imports.

### Styling

Tailwind CSS v4 via PostCSS. Primary brand color: `#E50914` (red). Responsive breakpoints use `md:` prefix. Framer Motion handles animations; `react-hot-toast` handles toast notifications.

### SEO / Analytics

Root layout (`src/app/layout.js`) injects Google Analytics (`G-QJMH27JB3N`), Facebook Pixel (`1015602400177523`), and full Open Graph metadata. Homepage (`page.js`) includes JSON-LD LocalBusiness schema markup.

## Environment Variables Required

```
MONGODB_URI
EMAIL_USER
EMAIL_PASS
```

## Deployment

`next.config.mjs` sets `output: "standalone"` for containerized deployments.
