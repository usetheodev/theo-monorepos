# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## What This Project Is

**theo-monorepos** is the starter template repository for [Theo](https://usetheo.dev) — a CLI-first Kubernetes PaaS. It contains:

1. **`templates/`** — 9 production-ready project templates covering Node.js, Go, Python, monorepos, and fullstack
2. **`create-theo/`** — An npm scaffolding CLI (`npm create theo@latest`) with composable modules (database, Redis, auth, queue)
3. **`scripts/`** — Validation tooling to ensure all templates work correctly

The goal: `npm create theo@latest` → choose stack → `theo deploy` → live URL in under 5 minutes. Zero Kubernetes knowledge required.

---

## Development Commands

```bash
# create-theo CLI
cd create-theo && npm install     # Install dependencies
cd create-theo && npm run build   # Copy templates + compile TypeScript
cd create-theo && npm test        # Run all tests (Jest, 115 tests, 11 suites)
cd create-theo && npm run dev     # TypeScript watch mode

# Validation
bash scripts/validate-templates.sh   # Scaffold + validate all 9 templates

# Test a template manually
cd templates/node-express && npm install && PORT=4100 node src/index.js
cd templates/go-api && GOWORK=off go run .
cd templates/python-fastapi && uvicorn main:app --port 4103
```

**Prerequisites:** Node.js 18+, Go 1.22+ (for go-api template testing), Python 3.10+ (for python-fastapi template testing)

---

## The Rules (Non-Negotiable)

### Rule 1: Every template must be deployable
A template that doesn't work with `theo deploy` out of the box is broken. No exceptions.

### Rule 2: Template requirements checklist
Every template MUST have:
- `theo.yaml` with `version: 1` and `{{project-name}}` placeholder
- `GET /health` endpoint returning `{ "status": "ok" }`
- `PORT` environment variable support
- `gitignore` (without dot — npm strips `.gitignore`, scaffold renames it)
- `README.md` with install + dev + deploy instructions
- CORS enabled
- Structured JSON logging (pino for Node, slog for Go, stdlib logging for Python)
- Error handling middleware (404 + central error handler)
- Graceful shutdown (SIGTERM/SIGINT handlers)
- ESLint + Prettier (Node), Makefile (Go), or pyproject.toml with ruff (Python)
- Minimal dependencies — nothing unnecessary

### Rule 3: Placeholder is `{{project-name}}`
This is the only placeholder. It appears in `theo.yaml`, `package.json`, `go.mod`, `README.md`, and anywhere the project name is referenced. The scaffold engine replaces ALL occurrences. Never introduce a second placeholder format.

### Rule 4: Templates are standalone
Each template must work independently. No shared dependencies between templates. No symlinks. No imports from other templates. Copy is always safe.

### Rule 5: Registry must match filesystem
Every directory in `templates/` must have a corresponding entry in `create-theo/src/templates.ts`. The validation script catches drift. If you add a template directory, add it to the registry. If you remove one, remove it from the registry.

### Rule 6: Tests before shipping
The `create-theo` CLI has 115 tests across 11 suites. Any new feature or template must have corresponding test coverage. Run `npm test` before considering work done.

### Rule 7: Node compatibility
Use `fileURLToPath(import.meta.url)` instead of `import.meta.dirname` for Node 18 compatibility. The CLI must work on Node 18, 20, and 22.

### Rule 8: gitignore naming convention
Store `.gitignore` as `gitignore` (without dot) in template directories. npm strips dotfiles named `.gitignore` from published packages. The scaffold engine in `scaffold.ts` renames `gitignore` → `.gitignore` during copy.

---

## Repository Structure

```
theo-monorepos/
├── CLAUDE.md                          ← you are here
├── README.md                          ← user-facing documentation
├── ROADMAP.md                         ← implementation roadmap with status
├── CHANGELOG.md                       ← changelog (Keep a Changelog format)
├── templates/                         ← source of truth for all templates
│   ├── node-express/                  ← Express.js API (port 3000)
│   ├── node-fastify/                  ← Fastify API (port 3000)
│   ├── node-nextjs/                   ← Next.js App Router (frontend, SSR)
│   ├── go-api/                        ← Go stdlib net/http (port 8080)
│   ├── python-fastapi/                ← FastAPI + Uvicorn (port 8000)
│   ├── monorepo-turbo/                ← Turborepo: Express API + Next.js + shared
│   ├── fullstack-nextjs/              ← Next.js with API routes + CRUD
│   ├── node-nestjs/                   ← NestJS with modules (TypeScript)
│   └── node-worker/                   ← Background job processor
├── create-theo/                       ← npm scaffolding CLI
│   ├── package.json                   ← name: "create-theo"
│   ├── tsconfig.json                  ← TypeScript strict, ESM, Node16
│   ├── jest.config.js                 ← Jest + ts-jest ESM config
│   ├── .npmignore                     ← excludes src/, tests/ from publish
│   ├── src/
│   │   ├── index.ts                   ← entrypoint (#!/usr/bin/env node)
│   │   ├── prompts.ts                 ← @inquirer/prompts interactive flow
│   │   ├── scaffold.ts               ← copy + layers + placeholder replacement
│   │   ├── templates.ts              ← template registry (9 entries)
│   │   ├── validate.ts               ← RFC 1123 project name validation
│   │   ├── output.ts                 ← post-scaffold success message
│   │   ├── database.ts               ← database feature detection + ORM config
│   │   ├── addons.ts                 ← add-on module registry (redis, auth, queue)
│   │   └── styling.ts                ← styling options registry
│   ├── scripts/
│   │   └── copy-templates.js          ← prebuild: copies templates/ + README into package
│   └── tests/
│       ├── validate.test.ts           ← name sanitization + validation
│       ├── scaffold.test.ts           ← file creation, placeholder replacement, production-ready checks
│       ├── templates.test.ts          ← registry integrity
│       ├── database.test.ts           ← database layer per language
│       ├── styling.test.ts            ← styling options
│       ├── error-handling.test.ts     ← error paths + edge cases
│       ├── cli-integration.test.ts    ← end-to-end CLI via execSync
│       ├── addons.test.ts             ← addon registry + dependency resolution
│       ├── redis.test.ts              ← Redis module per language
│       ├── auth.test.ts               ← Auth module per framework
│       └── queue.test.ts              ← Queue module + combined addons
└── scripts/
    └── validate-templates.sh          ← end-to-end validation of all templates
```

---

## Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| create-theo CLI | TypeScript + @inquirer/prompts + chalk + ora | Interactive project scaffolding |
| Build | tsc (TypeScript 5.6+) | Compile to ESM |
| Tests | Jest + ts-jest | 115 tests, 11 suites |
| Validation | Bash script | E2E template verification |
| CI | GitHub Actions | Node 18/20/22 × Linux/Windows/macOS |
| Templates | JS, TS, Go, Python | Production-ready starters for Theo users |

---

## Template Details

| Template | Language | Framework | Type | Port | Key Files |
|----------|----------|-----------|------|------|-----------|
| node-express | Node.js | Express 4 | api | 3000 | `src/index.js`, `eslint.config.js` |
| node-fastify | Node.js | Fastify 5 | api | 3000 | `src/index.js`, `eslint.config.js` |
| node-nextjs | Node.js | Next.js 14 | frontend | 3000 | `src/app/page.js`, `next.config.js` |
| go-api | Go | net/http (stdlib) | api | 8080 | `main.go`, `go.mod`, `Makefile` |
| python-fastapi | Python | FastAPI + Uvicorn | api | 8000 | `main.py`, `requirements.txt`, `pyproject.toml` |
| monorepo-turbo | Node.js | Turborepo + Express + Next.js | monorepo | 3001/3002 | `turbo.json`, `apps/`, `packages/` |
| fullstack-nextjs | Node.js | Next.js 14 | fullstack | 3000 | `src/app/api/items/route.js` |
| node-nestjs | TypeScript | NestJS 10 | api | 3000 | `src/main.ts`, `src/app.module.ts`, `src/filters/` |
| node-worker | Node.js | Express + polling loop | worker | 3000 | `src/index.js` |

---

## Scaffold Flow

```
npm create theo@latest
    │
    ├─ parseArgs: --template, --styling, --database, --add, --help
    ├─ promptUser: name → category → template → styling → database → addons (checkbox)
    ├─ scaffold:
    │   ├─ copyDir: template → target (replace {{project-name}})
    │   ├─ applyStyling (if frontend + styling selected)
    │   ├─ applyDatabase (if --database): Prisma / GORM / SQLAlchemy
    │   ├─ applyRedis (if --add redis): ioredis / go-redis / redis-py
    │   ├─ applyAuth (if --add auth): JWT middleware per framework
    │   ├─ applyQueue (if --add queue): BullMQ (Node only)
    │   ├─ writeInfraFiles: docker-compose.yml + .env (merged postgres + redis)
    │   ├─ writeCI: .github/workflows/ci.yml (per language)
    │   ├─ git init
    │   └─ npm install (Node templates only)
    └─ printSuccess: next steps output
```

**Layer pattern:** Each feature (database, styling, redis, auth, queue) is an independent layer applied conditionally. Layers don't know about each other. Docker-compose and env files are merged in a final step.

**CI mode:** When `CI=true`, requires `--template` and project name as positional arg. No prompts, no install, no git init.

---

## Add-on Modules

Modules are registered in `src/addons.ts`. Each module:
- Has a feature detection function (which template types/languages support it)
- Has an apply function in `scaffold.ts` per language
- May contribute docker-compose services and env vars

| Module | Template types | Languages | Docker service | Env vars |
|--------|---------------|-----------|---------------|----------|
| redis | api, worker | node, go, python | redis:7-alpine | REDIS_URL |
| auth | api | node, go, python | — | JWT_SECRET |
| queue | api, worker | node only | redis:7-alpine | REDIS_URL |

Queue auto-includes Redis via `resolveAddonDependencies()`.

**Auth generates framework-specific code:**
- Express: `src/middleware/auth.js`
- Fastify: `src/plugins/auth.js` (fastify-plugin pattern)
- NestJS: `src/guards/auth.guard.ts` (@Injectable + CanActivate)
- Go: `internal/auth/auth.go`
- Python: `auth.py` (FastAPI Depends + HTTPBearer)

---

## Common Mistakes — Read Before Coding

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Using `import.meta.dirname` | Breaks on Node 18 | Use `fileURLToPath` + `path.dirname` |
| Adding template without registry entry | `create-theo` doesn't list it | Add to `create-theo/src/templates.ts` |
| Template without `{{project-name}}` in theo.yaml | Scaffold generates broken config | Always use placeholder |
| Go template with bare module name | `go.mod` parse error | Use `example.com/{{project-name}}` |
| Leaving `node_modules/` in templates | Bloats npm package | Templates must be clean; `gitignore` covers this |
| Running Go templates inside main Theo repo | `go.work` conflict | Use `GOWORK=off` when testing locally |
| Template with hardcoded port | Breaks Theo deploy | Always read `process.env.PORT` / `os.Getenv("PORT")` |
| Using `.gitignore` in templates | npm strips it from published package | Name it `gitignore`, scaffold renames to `.gitignore` |
| Adding `.prettierrc` without updating `isTextFile` | Placeholder not replaced | Add basename check in `isTextFile()` in scaffold.ts |
| Writing docker-compose inside apply functions | Breaks when multiple services needed | Use `writeInfraFiles()` — the shared final step |

---

## Relationship to Main Theo Repo

This is a **subproject** within the Theo monorepo (`theo/theo-monorepos/`). It is a parallel track — does not block or depend on the main sprint plan (hardening sprints, CLI features, etc.).

The only dependency is that `theo deploy` works end-to-end, which has been validated since Sprint 2.

Templates here mirror what `theo-packs` can auto-detect and build Dockerfiles for: Node.js, Go, Python, and static files. If a new language pack is added to `theo-packs`, a corresponding template should be added here.

---

## Adding a New Template

1. Create `templates/<template-id>/` with all required files (see Rule 2)
2. Use `{{project-name}}` placeholder everywhere the project name appears
3. Include production-ready features: CORS, structured logging, error handling, graceful shutdown
4. Add linting config: `eslint.config.js` + `.prettierrc` (Node), `Makefile` (Go), `pyproject.toml` (Python)
5. Store `.gitignore` as `gitignore` (without dot)
6. Add entry to `create-theo/src/templates.ts` with id, name, description, language, type, defaultPort
7. Update help text in `create-theo/src/index.ts`
8. Run `cd create-theo && npm run build && npm test`
9. Run `bash scripts/validate-templates.sh` — must pass 100%
10. Update `README.md` template table

## Adding a New Add-on Module

1. Add entry to `create-theo/src/addons.ts` (AddonId type, addons array, getAvailableAddons filter)
2. Add `apply<Module>()` function in `create-theo/src/scaffold.ts` with per-language variants
3. Add env vars to `collectEnvVars` logic in `writeInfraFiles()` if needed
4. Add docker-compose service to `writeInfraFiles()` if needed
5. Add to `printHelp()` in `index.ts`
6. Create `tests/<module>.test.ts` following the redis/auth/queue test pattern
7. Run `npm run build && npm test`
