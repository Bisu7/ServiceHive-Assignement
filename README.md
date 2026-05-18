# GigFlow - Sales Lead Management Platform

GigFlow is a high-performance, full-stack lead management platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Designed for sales teams, marketing managers, and executives, the application enables companies to track their customer acquisition pipeline, monitor conversion performance metrics via live KPI dashboard panels, assign follow-ups, and export historical CSV records. It implements Obsidian UI — a custom dark-first premium design system using Tailwind CSS and CSS variables.

---

## Tech Stack

| Category | Technology | Version |
| :--- | :--- | :--- |
| Monorepo Manager | pnpm Workspaces | >= 9.0.0 |
| Runtime Environment | Node.js | >= 20.0.0 |
| Language Spec | TypeScript | ^ 5.5.4 |
| Frontend Framework | React (Vite SPA) | ^ 18.3.1 |
| Styling Engine | Tailwind CSS + Vanilla CSS variables | ^ 3.4.10 |
| State Management | Zustand (with middleware persistence) | ^ 4.5.5 |
| Backend Framework | Express | ^ 4.19.2 |
| Database ORM | Mongoose / MongoDB | ^ 8.5.2 / >= 7.0 |
| Schema Validation | Zod (Shared validation schemas) | ^ 3.23.8 |
| Containerization | Docker / Docker Compose | >= 20.10 |

---

## Key Features

*   **Secure Authentication**: Robust JWT token persistence across browser sessions, anti-flicker native local scripts, and a custom split-screen register/login interface.
*   **Sales Pipeline Grid**: Full CRUD lifecycle operations on lead records, right slide-out details drawer, and custom validation warnings.
*   **Reactive Filtering and Debouncing**: Live full-text search with a 400ms pulsing loading border, dropdown status/source filters, and pagination controllers.
*   **URL-State Synchronization**: Serializes all grid filter selections directly to the browser URL path. This enables browser back-button navigation and shareable pre-filtered pipeline links.
*   **High Performance Memory**: Memoized row lists (React.memo), optimistic client-side deletions/updates with automatic REST rollback policies, and skeleton loaders.
*   **KPI Performance Dashboard**: Computes sales metrics (Total Leads, New This Week, Conversion/Qualified Rate %, Lost Rate %) instantly from database pipelines, featuring redirect links to pre-filtered grids.
*   **Role-Based Access Control**: Gates actions dynamically. Only administrators can delete any lead or manage user records. Sales/Managers can create/edit leads and trigger data downloads.
*   **CSV Exporter**: Generates fully-formatted CSV pipeline reports on the backend, downloaded safely on the frontend with memory object url revocations.
*   **Containerized Orchestration**: A multi-stage Docker compose setup containerizing client static HTML assets under Nginx, and server processes under the non-root alpine node user.

---

## Project Structure

Below is the directory structure of the MERN monorepo:

```text
ServiceHive-Assignement/
├── backend/                       # Express + Mongoose TypeScript Service
│   ├── src/
│   │   ├── config/                # Environment schema definitions and DB connect hooks
│   │   ├── middleware/            # Error, Auth, Rate Limiter, and Validate handlers
│   │   ├── modules/               # Domain modules (Auth, Leads, Users)
│   │   │   ├── auth/              # Registration, Login, and Session API controllers
│   │   │   ├── leads/             # Lead CRUD, CSV exporter, and Schemas
│   │   │   └── users/             # User Profile Models and Statics
│   │   ├── scripts/               # Seeding script for default administrative users
│   │   ├── utils/                 # Winston Logger, ApiError, and pagination helpers
│   │   ├── app.ts                 # Express application middleware registry
│   │   └── server.ts              # Express HTTP bootstrap entry point
│   ├── Dockerfile                 # Multi-stage Docker builder (USER node)
│   └── package.json
├── frontend/                      # Vite + React + Tailwind CSS client
│   ├── src/
│   │   ├── api/                   # Unified Axios API Client with interceptors
│   │   ├── components/            # Layout (Sidebar, Topbar) and Shared UI Badges
│   │   ├── hooks/                 # Custom Hooks (useAuth, usePermissions, useDebounce)
│   │   ├── pages/                 # Routing pages (Dashboard, Leads, Login, Register)
│   │   ├── router/                # Route definitions and session validation guards
│   │   ├── store/                 # Centralized stores (authStore, leadsStore)
│   │   ├── utils/                 # Date and CSV formatting utilities
│   │   ├── App.tsx                # Master bootstrapper and initialize trigger
│   │   └── main.tsx               # Client entry point and Obsidian Toaster wrapper
│   ├── Dockerfile                 # Multi-stage Docker builder (Vite compiling)
│   ├── nginx.conf                 # Nginx custom caching and SPA try_files router
│   └── package.json
├── packages/
│   └── shared/                    # Monorepo shared typescript models & schemas
│       ├── src/
│       │   ├── index.ts           # Unified export file
│       │   └── types/             # Common Enums, Payloads, and Document interfaces
│       └── package.json
├── docker-compose.yml             # Main composition file (Client, Server, Mongo)
├── package.json                   # Workspace root-level pnpm workspace config
└── pnpm-workspace.yaml            # Monorepo workspaces definition
```

---

## Getting Started

### Prerequisites
Ensure the following tools are installed locally:
*   Node.js: >= 20.0.0
*   pnpm: >= 9.0.0
*   MongoDB: >= 7.0 (Optional if running with local DB)
*   Docker: >= 20.10 (Highly recommended)

---

### With Docker (Recommended - Instant Setup)

The complete full-stack environment compiles and boots using a single command:

1.  **Duplicate the Environment Template**:
    ```bash
    cp .env.example .env
    ```
    *(Note: The default environment values are pre-configured to link the frontend, backend, and MongoDB container automatically!)*

2.  **Build and Orchestrate Containers**:
    ```bash
    docker compose up --build
    ```
    This command automatically:
    *   Starts a secure MongoDB server, running health check checks.
    *   Builds and starts the Backend Server on port 5000 (authenticated under the node user).
    *   Builds, bundles, and launches the Frontend Client inside an optimized Nginx server on port 80.

3.  **Access the Platform**:
    Open http://localhost inside your browser.

4.  **Seed Custom Pipeline Data (Optional)**:
    While containers are running, execute the seed command inside a second terminal window to populate the pipeline:
    ```bash
    docker compose exec server pnpm --filter @leadflow/backend run seed
    ```

---

### Local Development (Without Docker)

1.  **Clone and Enter Workspace**:
    ```bash
    git clone <repository-url>
    cd ServiceHive-Assignement
    ```

2.  **Duplicate Environment File**:
    ```bash
    cp .env.example .env
    ```

3.  **Install Monorepo Workspaces & Root Dependencies**:
    ```bash
    pnpm install
    ```

4.  **Start All Services Concurrently**:
    ```bash
    pnpm dev
    ```
    This script concurrently boots:
    *   The Backend Server on http://localhost:5000 (with hot reload).
    *   The Frontend Client on http://localhost:5173.

5.  **Seed Database**:
    Seed default users and 25 pipelines directly from the workspace root:
    ```bash
    pnpm seed
    ```

---

## Default Users (Seeded)

The database seed command registers two default team accounts with secure bcrypt hashing:

*   **System Administrator** (Full pipeline CRUD, system-wide User Management, and Delete Rights):
    *   Email: `admin@leadflow.com`
    *   Password: `Admin@123`
*   **Sales Representative** (Create/Edit leads, download CSV, view Dashboard stats):
    *   Email: `sales@leadflow.com`
    *   Password: `Sales@123`

---

## Environment Variables

| Variable | Required | Description | Example / Default |
| :--- | :---: | :--- | :--- |
| PORT | Yes | Port number exposed by the backend Express engine | `5000` |
| NODE_ENV | Yes | Active node environment profile (development, production, test) | `development` |
| MONGO_URI | Yes | Connection string for MongoDB (pointing to local or Compose service) | `mongodb://localhost:27017/leadflow` |
| CLIENT_ORIGIN | Yes | CORS origin allowed to trigger authenticated requests | `http://localhost:5173` |
| JWT_SECRET | Yes | Cryptographic key securing JSON Web Token payloads (min 32 chars) | `change-in-production-must-be-32-chars-long` |
| JWT_EXPIRES_IN | Yes | Token validation duration before session expiry | `7d` |
| BCRYPT_SALT_ROUNDS | Yes | Password hashing difficulty coefficient | `12` |
| VITE_API_URL | Yes | API endpoint fetched by the Vite React application | `http://localhost:5000/api` |

---

## API Documentation

A comprehensive list of REST endpoints, input payload models, response JSON structures, error mappings, and cURL commands is located in:
**[docs/API.md](file:///c:/Users/biswa/OneDrive/Desktop/ServiceHive-Assignement/docs/API.md)**

---

## Key Design Decisions

*   **Zustand over Redux**: Chosen for its lightweight footprint, zero-boilerplate codebase, and effortless reactive states. Combined with middleware persist, it hydrates authentication credentials instantly on page reboots, avoiding race conditions.
*   **Shared Typesafe Validations via Zod**: Single, monorepo-wide Zod validation schemas are shared between frontend forms and backend controllers, eliminating redundant models and guaranteeing strict runtime API boundaries.
*   **pnpm Workspaces**: Dramatically reduces duplicate sub-folder node_modules allocations, guarantees high cache hits, and speeds up monorepo development cycles.
*   **Multi-Stage Docker Images**: Reduces production image sizes by leaving compiling dependencies (devDependencies like typescript, ts-node-dev) and cache folders in intermediate steps. Exposes the backend solely under the secure, non-root node user to prevent exploits.

---




