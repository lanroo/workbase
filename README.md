# Workbase

This project is for the team, company, contract, task and report management application. A modern SPA that consumes a REST API (authentication) and GraphQL (data), with a responsive UI and role-based access (admin / user).

---

## What is this project?

Workbase is a web application for **operational management**: collaborators, enterprises, contracts, tasks, and reports generated from completed tasks. Users log in, browse paginated lists, open detail views for each entity and — if they are administrators — can create, edit and delete records. The frontend is **mobile-first**, with a responsive sidebar and consistent headers across all screens.

- **Authentication**: login via REST with JWT (access + refresh token), session persisted in `localStorage`.
- **Data**: read and write via GraphQL (Apollo Client), with paginated lists and filters.
- **Protected routes**: only authenticated users can access the app; the `/users` route is restricted to admins.
- **UI**: React + TypeScript, Tailwind CSS, dark theme, reusable components (tables, modals, pagination, empty states).

---

## Features

| Area | Description |
|------|-------------|
| **Login** | Login screen (email/password). Logout available in the sidebar. |
| **Collaborators** | Paginated list of collaborators; create/edit/deactivate. Detail view with data and status. |
| **Enterprises** | CRUD for enterprises (tax ID, legal name, trade name, description). |
| **Contracts** | CRUD for contracts (value, dates, status, link to enterprise/collaborator). |
| **Tasks** | List and board view; create/edit; states (Pending, In progress, Completed, Failed). |
| **Reports** | List of reports generated when tasks are completed; detail view. |
| **Users** | (Admin only) System users list; create/edit/delete and set role (admin/user). |

- **Pagination** on all lists, with a reusable component.
- **Detail pages** for collaborator, enterprise, contract, task and report.
- **Empty states** when there is no data, with a CTA when applicable.
- **Mobile**: header and action buttons adapted; sidebar becomes a drawer on mobile.

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (build and dev server)
- **React Router** (routing and auth/admin protection)
- **Apollo Client** + **GraphQL** (queries and mutations)
- **Tailwind CSS** (styling, dark theme)
- **REST** for auth (login, refresh, logout) and for user CRUD (create/update/delete)

---

## Prerequisites

- **Node.js** 18+ (or compatible with the project)
- **npm** or **pnpm**
- Workbase backend running and reachable (REST + GraphQL)

---

## Installation and running

### 1. Clone and install dependencies

```bash
git clone git@github.com:lanroo/workbase.git
cd workbase
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
VITE_API_URL=YOUR_API
```

Replace with your backend base URL (no trailing slash). **Do not commit** `.env` with real URLs or secrets.

### 3. Start the frontend

```bash
npm run dev
```

The app will open at **http://localhost:5173**. Requests to `/api` and `/graphql` go to the backend; in development Vite proxies them to the value of `VITE_API_URL` (see `vite.config.ts`).

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server (Vite). |
| `npm run build` | Production build in `dist/` (TypeScript + Vite). |
| `npm run preview` | Serves `dist/` locally to test the build. |
| `npm run lint` | Runs ESLint on the codebase. |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend base URL (e.g. `https://api.workbase.example.com`). When unset, the app uses relative `/api` and `/graphql`; in development the Vite proxy forwards those to `http://localhost:4000`. |

Set it in `.env`. Never commit production values or secrets.

---

## Project structure (overview)

```
src/
├── api/           # REST client: auth, config, health, users
├── components/    # Layout, Sidebar, Table, Pagination, TasksBoard, UI (Button, Modal, etc.)
├── context/       # AuthContext (global auth and user profile state)
├── graphql/       # Queries and mutations (collaborators, contracts, enterprises, reports, tasks, users)
├── pages/         # Pages: Login, lists (Collaborators, Enterprises, …), details (*Detail), Users
├── App.tsx        # Routes and ProtectedRoute / AdminRoute
├── main.tsx       # Entry point
└── index.css      # Global styles and animations (e.g. Workbase logo)
public/
└── favicon.svg    # Favicon (lock icon)
docs/
└── API_ENDPOINTS.md   # REST and GraphQL endpoint documentation
```

---

## Backend and API

The frontend expects a backend that exposes:

- **REST**: login (`POST /api/auth/login`), refresh, logout, health and user endpoints (see `src/api/users.ts`).
- **GraphQL**: single endpoint `POST /graphql` with the schema for collaborators, enterprises, contracts, tasks, reports and users.

The base URL is set via `VITE_API_URL`. In production, serve the build (`dist/`) from the same host or configure CORS accordingly. Endpoint and GraphQL operation details are in **`docs/API_ENDPOINTS.md`**.

---

## User roles

- **Admin**: sees all screens, including **Users**; can create, edit and delete across all entities.
- **User**: cannot access `/users`; on other screens has read-only access (no create/edit/delete buttons).

The role comes from the user object returned at login and is used in `AuthContext` and in routes (e.g. `AdminRoute` for `/users`).

---

## Test credentials

Use a user created in the backend (e.g. `admin@example.com` / `admin123`, as per API documentation). The frontend does not define users; it only consumes login and the operations exposed by the backend.

---

## Production build

```bash
npm run build
```

Output goes to **`dist/`**. Serve that directory with a static server (Nginx, Vercel, Netlify, etc.) and ensure the app can reach the backend at the URL configured at build time (via `VITE_API_URL` in the build `.env`).

---

## License

Private project created to help a friend
