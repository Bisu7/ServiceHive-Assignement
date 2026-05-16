# LeadFlow

> A production-grade lead management CRM built on the MERN stack — MongoDB, Express, React, and Node.js — with TypeScript end to end and a pnpm monorepo architecture.

---

## Architecture Overview

```
leadflow/
├── backend/             # Express + TypeScript REST API
├── frontend/            # React + Vite + TypeScript SPA
└── packages/
    └── shared/          # Shared TypeScript types used by both apps
```

The monorepo is managed with **pnpm workspaces**. The shared package is referenced as `@leadflow/shared` in both apps, ensuring a single source of truth for domain types such as `ILead`, `IUser`, and `ApiResponse<T>`.

---

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Runtime      | Node.js ≥ 20                                            |
| Package mgr  | pnpm ≥ 9 (workspaces)                                  |
| Backend      | Express 4, Mongoose 8, Zod, JWT, bcryptjs               |
| Frontend     | React 18, Vite 5, Tailwind CSS 3, Zustand, React Hook Form |
| Validation   | Zod (shared schemas on both sides)                      |
| TypeScript   | v5.5, strict mode, `noImplicitAny`, `exactOptionalPropertyTypes` |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **pnpm** ≥ 9.0.0 (`npm install -g pnpm`)
- **MongoDB** — running locally on port 27017, or provide a connection string

### Installation

```bash
# Install all workspace dependencies from the repo root
pnpm install
```

### Environment Setup

```bash
# Copy the example and fill in your values
cp backend/.env.example backend/.env
```

Key variables:

| Variable           | Description                                        |
|--------------------|----------------------------------------------------|
| `MONGO_URI`        | MongoDB connection string                          |
| `JWT_SECRET`       | Must be ≥ 32 characters for HMAC-SHA256 security   |
| `JWT_EXPIRES_IN`   | Token lifetime (e.g. `7d`)                         |
| `CLIENT_ORIGIN`    | Allowed CORS origin (e.g. `http://localhost:5173`) |

### Development

```bash
# Start both server and client in parallel with hot reload
pnpm dev
```

- **Client** → http://localhost:5173
- **Server** → http://localhost:5000
- **Health check** → http://localhost:5000/health

### Build for Production

```bash
# Type-checks and builds all packages in dependency order
pnpm build
```

---

## API Reference

### Auth

| Method | Endpoint            | Auth | Description                   |
|--------|---------------------|------|-------------------------------|
| POST   | `/api/auth/register`| ✗    | Create account, receive JWT   |
| POST   | `/api/auth/login`   | ✗    | Authenticate, receive JWT     |
| GET    | `/api/auth/me`      | ✓    | Get current user profile      |

### Leads

| Method | Endpoint         | Auth | Description                               |
|--------|------------------|------|-------------------------------------------|
| GET    | `/api/leads`     | ✓    | List leads (filters: status, source, search, page, limit) |
| POST   | `/api/leads`     | ✓    | Create a new lead                         |
| GET    | `/api/leads/:id` | ✓    | Get a single lead by ID                   |
| PATCH  | `/api/leads/:id` | ✓    | Partial update of a lead                  |
| DELETE | `/api/leads/:id` | ✓    | Permanently delete a lead                 |

All responses follow the `ApiResponse<T>` envelope defined in `@leadflow/shared`.

---

## Project Conventions

- **No `any` types** — ESLint enforces `@typescript-eslint/no-explicit-any: error`
- **Immutable fields** — `readonly` on `_id`, `createdAt`, `updatedAt` in all interfaces
- **Error handling** — Throw `ApiError` on the server; catch in the global error middleware
- **Async safety** — All route handlers wrapped in `asyncHandler()` to forward errors to Express
- **Env validation** — Zod parses `process.env` at startup and crashes with clear diagnostics on misconfiguration

---

## Commit Convention

This repository follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(leads): add CSV export with field-level formatting
fix(auth): prevent user enumeration on failed login
refactor(shared): rename LeadStage to LeadStatus for clarity
chore(deps): upgrade mongoose to v8.5
docs(readme): document API rate limiting behaviour
```

---

## License

MIT © LeadFlow
