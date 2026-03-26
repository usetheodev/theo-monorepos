# ROADMAP — create-theo + Templates

**Goal:** `npm create theo@latest` → user picks a stack → project ready for `theo deploy`.
**Start date:** 2026-03-26
**Last updated:** 2026-03-26

---

## Context

Theo already has:
- **30+ examples** in `examples/` (fixtures for theo-packs, most without theo.yaml)
- **3 E2E fixtures** in `infra/tests/e2e/fixtures/` (hello-server, multi-app, dogfood-monorepo)
- **Auto-detection** of 7 monorepo tools + 10 frameworks
- **theo-packs** generating Dockerfiles for Go, Node, Python, Static

What's missing: **a zero-friction bootstrap experience** for new projects. `theo init` works for existing projects. `create-theo` works for new projects.

---

## Design Decisions

### D-01: Standalone templates, no forced Nx/Turbo
Templates are standalone projects. Users who want Turbo monorepo pick the Turbo template. Users who want a simple API don't carry monorepo tooling.

### D-02: `create-theo` as a separate npm package
Industry standard (`create-vite`, `create-next-app`, `create-remix`). Zero dependency on Theo CLI for scaffolding. The CLI is installed afterwards.

### D-03: Templates live in `theo-monorepos/templates/`
Source of truth for all templates. `create-theo` copies from here (bundled in the npm package or fetched from GitHub).

### D-04: Every template must be deployable in < 5 minutes
`npm create theo@latest` → `cd my-app` → `theo login` → `theo deploy` → live URL. No intermediate steps.

### D-05: Reuse existing `examples/` as a base
The 30+ examples from theo-packs already work. Templates in create-theo are enhanced versions of those examples: they add `theo.yaml`, `README.md`, `/health`, `.gitignore`, and correct scripts.

---

## Rules

1. Every template MUST have a valid `theo.yaml` (version 1, project placeholder)
2. Every template MUST have a `/health` endpoint returning `{ "status": "ok" }`
3. Every template MUST respect `PORT` via env var
4. Every template MUST have a proper `.gitignore`
5. Every template MUST work with `theo deploy` without editing any file
6. Templates MUST NOT have unnecessary dependencies — absolute minimum
7. `create-theo` DOES NOT depend on Theo CLI — it's independent
8. Done = `npm create theo@latest` → deploy on DigitalOcean works

---

## Sequence

```
Sprint 1: Base Templates           → 5 working templates + manual validation
    ↓ GATE: each template deploys on DO via `theo deploy`
Sprint 2: create-theo CLI          → interactive scaffolder publishable on npm
    ↓ GATE: `npm create theo@latest` works end-to-end
Sprint 3: Advanced Templates       → monorepos + fullstack + additional languages
    ↓ GATE: all deploy on DO
Sprint 4: Polish + Publication     → docs, tests, npm publish, landing page
    ↓ GATE: external user can use without help
```

---

## Sprint 1 — Base Templates

**Goal:** 5 deployable templates, validated on DigitalOcean.
**Acceptance criteria:** `theo deploy` on each template produces an accessible URL.

### Target Structure

```
theo-monorepos/
├── ROADMAP.md
├── templates/
│   ├── node-express/
│   │   ├── theo.yaml
│   │   ├── package.json
│   │   ├── .gitignore
│   │   ├── src/
│   │   │   └── index.js
│   │   └── README.md
│   ├── node-fastify/
│   ├── node-nextjs/
│   ├── go-api/
│   └── python-fastapi/
└── create-theo/           ← Sprint 2
```

### Tasks

#### T1.1 — Repository structure
**What:** Create the `templates/` directory structure with root README.
**Files:**
- `theo-monorepos/templates/` (dir)
- `theo-monorepos/README.md`
**Criteria:** Directory exists, README explains the purpose.
**Dependencies:** None.

#### T1.2 — Template: node-express
**What:** Minimal Express.js API, ready to deploy.
**Files:**
```
templates/node-express/
├── theo.yaml              # project: {{project-name}}, app: api, framework: express, port: 3000
├── package.json           # express + start script
├── .gitignore             # node_modules, .env*, dist
├── src/
│   └── index.js           # Express app with GET / and GET /health
└── README.md              # 3 lines: install, dev, deploy
```
**Requirements:**
- `GET /` → `{ "message": "Hello from Theo!" }`
- `GET /health` → `{ "status": "ok" }`
- `process.env.PORT || 3000`
- `package.json` scripts: `start`, `dev`
- theo.yaml with `version: 1`, `type: server`, `framework: express`, `port: 3000`
**Criteria:** `npm install && npm start` → server running. `theo deploy` → accessible URL.
**Dependencies:** T1.1

#### T1.3 — Template: node-fastify
**What:** Minimal Fastify API, ready to deploy.
**Files:**
```
templates/node-fastify/
├── theo.yaml              # framework: fastify, port: 3000
├── package.json           # fastify + start script
├── .gitignore
├── src/
│   └── index.js           # Fastify app with GET / and GET /health
└── README.md
```
**Requirements:**
- Same endpoints and rules as T1.2, using Fastify
- `fastify` as the only production dependency
**Criteria:** `npm install && npm start` → server running. `theo deploy` → accessible URL.
**Dependencies:** T1.1

#### T1.4 — Template: node-nextjs
**What:** Minimal Next.js app (App Router), ready to deploy.
**Files:**
```
templates/node-nextjs/
├── theo.yaml              # type: frontend, framework: nextjs, render: server
├── package.json           # next, react, react-dom
├── next.config.js
├── .gitignore
├── src/
│   └── app/
│       ├── layout.js
│       ├── page.js         # Simple landing page
│       └── api/
│           └── health/
│               └── route.js  # GET /api/health → { status: "ok" }
└── README.md
```
**Requirements:**
- Next.js 14+ with App Router
- `type: frontend`, `framework: nextjs`, `render: server` in theo.yaml
- Health check via API route `/api/health`
- Landing page with text "Deployed with Theo"
- Minimal dependencies (next, react, react-dom)
**Criteria:** `npm install && npm run dev` → app running. `theo deploy` → accessible URL.
**Dependencies:** T1.1

#### T1.5 — Template: go-api
**What:** Minimal Go API with net/http (stdlib), ready to deploy.
**Files:**
```
templates/go-api/
├── theo.yaml              # framework: custom, port: 8080
├── go.mod
├── .gitignore
├── main.go                # net/http with GET / and GET /health
└── README.md
```
**Requirements:**
- Go 1.22+ with `net/http` (zero external dependencies)
- `GET /` → `{ "message": "Hello from Theo!" }`
- `GET /health` → `{ "status": "ok" }`
- `os.Getenv("PORT")` with fallback 8080
- `go.mod` with module name `{{project-name}}`
**Criteria:** `go run .` → server running. `theo deploy` → accessible URL.
**Dependencies:** T1.1

#### T1.6 — Template: python-fastapi
**What:** Minimal FastAPI API, ready to deploy.
**Files:**
```
templates/python-fastapi/
├── theo.yaml              # framework: fastapi, port: 8000
├── requirements.txt       # fastapi, uvicorn
├── .gitignore             # __pycache__, .venv, .env*
├── main.py                # FastAPI app with GET / and GET /health
└── README.md
```
**Requirements:**
- FastAPI + Uvicorn as the only dependencies
- `GET /` → `{ "message": "Hello from Theo!" }`
- `GET /health` → `{ "status": "ok" }`
- `PORT` via env var with fallback 8000
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
**Criteria:** `pip install -r requirements.txt && uvicorn main:app` → server running. `theo deploy` → accessible URL.
**Dependencies:** T1.1

#### T1.7 — Local validation of all templates
**What:** Test each template locally (start, health check, graceful shutdown).
**Process:**
1. For each template: install deps → start → curl /health → curl / → stop
2. Verify that `theo init --yes` detects correctly (framework, port, type)
3. Verify that theo-packs generates a working Dockerfile for each
**Criteria:** 5/5 templates pass local validation.
**Dependencies:** T1.2, T1.3, T1.4, T1.5, T1.6

#### T1.8 — DigitalOcean validation
**What:** Real deploy of each template on the DO dev environment.
**Process:**
1. For each template: `git init` → `theo login` → `theo init` → `theo deploy`
2. Validate accessible URL with TLS
3. Validate `/health` returns 200
**Criteria:** 5/5 templates deployed and accessible on DO.
**Dependencies:** T1.7

---

## Sprint 2 — create-theo CLI

**Goal:** `npm create theo@latest` works end-to-end.
**Acceptance criteria:** User runs command, picks template, project is scaffolded and deployable.

### Target Structure

```
theo-monorepos/
├── create-theo/
│   ├── package.json        # name: "create-theo", bin: "create-theo"
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts        # entrypoint (#!/usr/bin/env node)
│   │   ├── prompts.ts      # inquirer/prompts interactive flow
│   │   ├── scaffold.ts     # copy template + replace placeholders
│   │   ├── templates.ts    # template registry
│   │   └── utils.ts        # helpers (git init, pkg manager detect)
│   ├── templates/           # bundled copy of templates
│   └── tests/
│       └── scaffold.test.ts
└── templates/               # source of truth (Sprint 1)
```

### Tasks

#### T2.1 — Scaffold the create-theo package
**What:** Create the `create-theo` npm package with TypeScript structure.
**Files:**
- `create-theo/package.json` (name: "create-theo", bin, scripts)
- `create-theo/tsconfig.json`
- `create-theo/src/index.ts` (entrypoint with shebang)
**Requirements:**
- TypeScript strict mode
- Build to ESM
- `bin` field pointing to `dist/index.js`
- Dependencies: only what's necessary (prompts lib, fs-extra or native)
**Criteria:** `npm run build` compiles without errors.
**Dependencies:** None (can run in parallel with Sprint 1)

#### T2.2 — Interactive prompts system
**What:** Question flow for the user to choose template and name.
**File:** `create-theo/src/prompts.ts`
**Flow:**
```
1. "What's your project name?" → validates RFC 1123 (same rule as theo init)
2. "Pick a template:" → list with description of each
   ○ Node.js — Express
   ○ Node.js — Fastify
   ○ Node.js — Next.js
   ○ Go — API
   ○ Python — FastAPI
3. "Which package manager?" → (Node templates only) npm / pnpm / yarn
```
**Requirements:**
- Accept `--template <name>` and `--name <name>` as flags (skip prompts)
- Project name validation same as `theo init` (RFC 1123)
- CI mode: requires `--template` and `--name` (no interactivity)
**Criteria:** Prompts work interactively and with flags.
**Dependencies:** T2.1

#### T2.3 — Scaffolding engine
**What:** Copy template, replace placeholders, initialize git.
**File:** `create-theo/src/scaffold.ts`
**Process:**
1. Copy template from bundled directory
2. Replace `{{project-name}}` in theo.yaml, package.json, go.mod, README
3. Run `git init` in the created directory
4. Run dependency install (npm/pnpm/yarn install or nothing for Go/Python)
**Requirements:**
- Placeholder: `{{project-name}}` (single, consistent)
- Don't corrupt binaries or non-text files
- Preserve file permissions
**Criteria:** Generated project works without manual editing.
**Dependencies:** T2.1, Sprint 1 complete (templates exist)

#### T2.4 — Bundle templates in package
**What:** Copy templates from `templates/` to `create-theo/templates/` on build.
**File:** `create-theo/package.json` (build script)
**Process:**
- `prebuild` script copies `../templates/*` → `create-theo/templates/`
- `package.json` includes `templates/` in the `files` field
**Criteria:** `npm pack` includes all templates.
**Dependencies:** T2.1, Sprint 1

#### T2.5 — Post-scaffold output
**What:** Clear message after scaffolding showing next steps.
**Output:**
```
✔ Created my-saas in ./my-saas

  Next steps:
    cd my-saas
    theo login        # authenticate (first time only)
    theo deploy       # deploy to production

  Local development:
    npm install
    npm run dev
```
**Requirements:**
- Adapt "Local development" based on the stack (npm/go/python)
- No excessive emojis, clean style (reference: create-vite)
**Criteria:** Output is correct and actionable for each template.
**Dependencies:** T2.3

#### T2.6 — Unit tests
**What:** Tests for prompts, scaffold, and name validation.
**File:** `create-theo/tests/scaffold.test.ts`
**Cases:**
- Valid name → accepted
- Invalid name (special characters, too long) → rejected with message
- Non-existent template → clear error
- Scaffold generates `theo.yaml` with correct name
- Scaffold generates all template files
- Scaffold replaces placeholders correctly
- CI mode without flags → error with instructions
**Criteria:** All tests pass.
**Dependencies:** T2.2, T2.3

#### T2.7 — Local end-to-end validation
**What:** `npx ./create-theo` → scaffold → start → health check.
**Process:**
1. Build create-theo
2. `npx ./create-theo --name test-project --template node-express`
3. `cd test-project && npm install && npm start`
4. `curl localhost:3000/health` → 200
5. Repeat for each template
**Criteria:** 5/5 templates scaffold and work.
**Dependencies:** T2.6

---

## Sprint 3 — Advanced Templates

**Goal:** Monorepo + fullstack templates + additional languages.
**Acceptance criteria:** All deploy on DO via `theo deploy`.

### Tasks

#### T3.1 — Template: monorepo-turbo
**What:** Turborepo with 2 apps (API + Web) + 1 shared package.
**Structure:**
```
templates/monorepo-turbo/
├── theo.yaml              # 2 apps: api (server) + web (frontend)
├── package.json           # workspaces: ["apps/*", "packages/*"]
├── turbo.json
├── .gitignore
├── apps/
│   ├── api/               # Express API
│   │   ├── package.json
│   │   └── src/index.js
│   └── web/               # Next.js frontend
│       ├── package.json
│       └── src/app/...
├── packages/
│   └── shared/            # Shared types/utils
│       ├── package.json
│       └── src/index.js
└── README.md
```
**Criteria:** `npm install && npx turbo dev` works. `theo deploy` deploys both apps.
**Dependencies:** Sprint 1

#### T3.2 — Template: monorepo-pnpm
**What:** pnpm workspaces with 2 apps (Fastify API + Go API).
**Structure:**
```
templates/monorepo-pnpm/
├── theo.yaml              # 2 apps: node-api (server) + go-api (server)
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── apps/
│   ├── node-api/          # Fastify
│   └── go-api/            # Go net/http
└── README.md
```
**Criteria:** Mixed monorepo (Node + Go) deploys both via `theo deploy`.
**Dependencies:** Sprint 1

#### T3.3 — Template: fullstack-nextjs
**What:** Fullstack Next.js with API routes + DB connection pattern.
**Structure:**
```
templates/fullstack-nextjs/
├── theo.yaml              # 1 app: type: frontend, framework: nextjs, render: server
├── package.json
├── .gitignore
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── api/
│   │       ├── health/route.js
│   │       └── items/route.js   # CRUD example with in-memory store
│   └── lib/
│       └── db.js               # Placeholder for DB connection (with comment)
└── README.md
```
**Criteria:** Fullstack app with API routes works. `theo deploy` → accessible URL.
**Dependencies:** Sprint 1

#### T3.4 — Template: node-nestjs
**What:** NestJS API with module pattern, ready to deploy.
**Structure:**
```
templates/node-nestjs/
├── theo.yaml              # framework: nestjs, port: 3000
├── package.json
├── tsconfig.json
├── .gitignore
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts
└── README.md
```
**Criteria:** `npm run start` → server running. `theo deploy` → accessible URL.
**Dependencies:** Sprint 1

#### T3.5 — Template: python-django
**What:** Minimal Django with REST endpoint, ready to deploy.
**Criteria:** `python manage.py runserver` works. `theo deploy` → accessible URL.
**Dependencies:** Sprint 1

#### T3.6 — Update create-theo with new templates
**What:** Add Sprint 3 templates to the create-theo registry and bundle.
**File:** `create-theo/src/templates.ts`
**Criteria:** `npm create theo@latest` lists all templates (Sprint 1 + Sprint 3).
**Dependencies:** T3.1-T3.5, Sprint 2

#### T3.7 — DigitalOcean validation
**What:** Real deploy of each new template on DO.
**Criteria:** All Sprint 3 templates deployed and accessible.
**Dependencies:** T3.6

---

## Sprint 4 — Polish + Publication

**Goal:** Publish `create-theo` on npm, complete documentation.
**Acceptance criteria:** External user can use without help.

### Tasks

#### T4.1 — Main theo-monorepos README
**What:** README.md at root with:
- What create-theo is
- Quick start (3 commands)
- List of templates with descriptions
- How to contribute new templates
**Criteria:** README is self-sufficient to understand and use.
**Dependencies:** Sprint 3

#### T4.2 — Automated integration tests
**What:** Script that scaffolds each template and validates (start + health check).
**File:** `theo-monorepos/scripts/validate-templates.sh`
**Process:** For each template: scaffold → install → start → curl /health → cleanup
**Criteria:** Script passes for all templates. Can run in CI.
**Dependencies:** Sprint 2, Sprint 3

#### T4.3 — GitHub Action for CI
**What:** Workflow that runs `validate-templates.sh` on PRs.
**File:** `.github/workflows/templates-ci.yml`
**Criteria:** PRs that break templates are blocked.
**Dependencies:** T4.2

#### T4.4 — Prepare for npm publish
**What:** Finalize package.json, LICENSE, .npmignore for publication.
**File:** `create-theo/package.json`
**Requirements:**
- `name: "create-theo"` (check availability on npm)
- `version: 0.1.0`
- `license: MIT` (or whatever Theo uses)
- `repository`, `homepage`, `keywords`
- `.npmignore` excluding tests, tsconfig, src/
**Criteria:** `npm pack` generates a clean tarball with only what's needed.
**Dependencies:** Sprint 2

#### T4.5 — npm publish
**What:** `npm publish` of create-theo.
**Process:**
1. `npm login`
2. `npm publish --access public`
3. Test: `npm create theo@latest` on a clean machine
**Criteria:** `npm create theo@latest` works for anyone.
**Dependencies:** T4.4

#### T4.6 — Post-publish smoke test
**What:** On a clean machine/environment, test the full flow.
**Process:**
1. `npm create theo@latest`
2. Pick template
3. `cd project && theo login && theo deploy`
4. Validate accessible URL
**Criteria:** Works end-to-end without manual intervention.
**Dependencies:** T4.5

---

## Summary Table

| Sprint | Tasks | Deliverable | Status |
|--------|-------|-------------|--------|
| 1 — Base Templates | T1.1-T1.7 | 5 deployable templates | Done (T1.8 DO pending) |
| 2 — create-theo CLI | T2.1-T2.7 | `npx create-theo` works | Done (29/29 tests) |
| 3 — Advanced Templates | T3.1-T3.6 | +3 templates (monorepo, fullstack, NestJS) | Done (8/8 validation) |
| 4 — Polish + Publish | T4.1-T4.6 | Published on npm | T4.1-T4.2 done, T4.3-T4.6 pending (npm publish) |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Template works locally but not on DO | Deploy fails | DO validation is a mandatory gate (T1.8, T3.7) |
| theo-packs doesn't generate correct Dockerfile for a template | Build fails | Test Dockerfile generation before deploy (T1.7) |
| Name `create-theo` already taken on npm | Can't publish | Check availability in T4.4, alternative: `create-theo-app` |
| Placeholder `{{project-name}}` appears at runtime | UX bug | Unit test verifies replacement (T2.6) |
| Templates become outdated (vulnerable deps) | Security | CI with `npm audit` on templates (T4.3) |

---

## Relationship with Main Sprint Plan

This roadmap is a **parallel track** to the Theo sprint plan. It neither blocks nor is blocked by the hardening sprints. It can be executed independently while Sprint 6 (status) and future sprints continue.

The only real dependency is that `theo deploy` works end-to-end — which has been validated on DO since Sprint 2.
