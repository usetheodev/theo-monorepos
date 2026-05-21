<!--
Pitch copy for TheoCreate (theo-stacks / create-theo) landing surfaces (usetheo.dev site, README marketing block, launch material referencing `npm create theo@latest`).
Voice: TheoKit aspirational voice — extended to TheoCreate 2026-05-15 via strategic review (see ../CLAUDE.md and ./CLAUDE.md).
Three layers: HERO (no jargon), BODY (benefit-first, one technical anchor per item), DEEP DIVE (full technical vocabulary, after the "## How it works" delimiter).
Every named feature, count, language, and ORM is verified against README.md, templates/, and create-theo/src.
-->

**Build** — the scaffolding verb of the **Chat. Build. Deploy.** ecosystem.

# Pick a language. Get a real backend.

### `npm create theo@latest` — production-shape scaffolding for AI agents and the apps around them.

*The Build layer of the [Theo ecosystem](https://usetheo.dev). Seven languages. Multi-runtime. Multi-package-manager. No boilerplate. No vendor lock-in.*

**19 templates · 7 languages + Next.js · 7 ORMs · 4 add-on modules · 205 tests across 12 suites · Apache-2.0**

---

## Pick the language. We'll ship the boilerplate.

There is a version of starting a new project that doesn't involve a checklist.

No copy-pasting CORS middleware. No reinventing graceful shutdown. No wiring up health probes for the third time this quarter. No remembering whether it's `tsc --noEmit` or `npm run typecheck`. No "wait, what was the npm script for migrations again?"

You pick a language. You pick a stack. You get a project — with the things every real backend needs already wired in. Then you build the only part that matters: your product.

## What you get

- **One CLI, seven languages.** Node, Go, Python, Rust, Java, Ruby, PHP — same `npm create theo@latest`. Pick what your team writes. Get a real project.
- **19 templates ready for production.** APIs, full-stack Next.js, workers, and 7 monorepo layouts. Each ships with CORS, structured JSON logging, error handling, graceful shutdown, `/health` + `/ready` probes, Dockerfile, CI workflow, and an example test.
- **Composable modules.** Add Redis, JWT auth, OAuth, or job queues with a flag (`--add redis,auth-jwt,queue`). Real code per language — not boilerplate stubs.
- **Database with one flag.** `--database` wires up Postgres + an ORM (Prisma, GORM, SQLAlchemy, Diesel, Spring Data JPA, Sequel, Doctrine), `docker-compose.yml`, and `.env` ready to run.
- **Frontend that ships in 2026.** Next.js 16 (App Router, Turbopack), React 19.2, Tailwind v4 zero-config, ESLint flat config, dark mode, shadcn/ui ready. Not a 2022 starter kit.
- **Package-manager agnostic.** Auto-detects npm, pnpm, yarn, or bun. Lock files removed after scaffold so your team picks freely.
- **Preview before you write.** `--dry-run` lists every file that would be created — including modules and database — before touching disk.
- **Deploy anywhere.** Every template works on TheoCloud, Docker, Railway, Fly.io, or your own infra. Health probes, Dockerfile, and graceful shutdown ship by default.

## Feel it

```bash
# Interactive — pick everything via prompts
npm create theo@latest

# One line — Node.js + Express + Postgres + Redis + JWT auth
npm create theo@latest my-api -t node-express -d --add redis,auth-jwt

# Frontend with shadcn/ui
npm create theo@latest my-app -t node-nextjs -s shadcn

# Preview without writing anything
npm create theo@latest my-app -t node-express -d --add redis --dry-run
```

One command. Modules composed. Database wired. Production shape. Ready to deploy.

## What you'd ship

- **A real backend, in any language.** Pick Go, Python, Rust, or Java for the team's strengths. Pick Node for shared types with the frontend. TheoCreate doesn't force TypeScript to get nice scaffolding.
- **A multi-tenant SaaS in a weekend.** `monorepo-turbo` (Express + Next.js) or `monorepo-go` (Go workspaces). Auth, queue, Postgres — three flags. Deploy to TheoCloud in 4 minutes.
- **An API for your AI agent.** `node-fastify` + `--add auth-jwt,queue` and you have a job-queue-backed API the agent can hit. Pair with TheoKit for the frontend surface.
- **A migration off a 2022 starter.** Modern toolchain — Next.js 16, Tailwind v4, ESLint flat config, strict TypeScript. Replace one file at a time.
- **Internal microservices.** `go-api` for performance, `python-fastapi` for ML, `rust-axum` for safety — all with the same operational shape (logging, health, shutdown, CI).
- **Worker / job-runner.** `node-worker` template, optionally with BullMQ or Asynq. Same Dockerfile, same health probes, same deploy story as the API.

## Why TheoCreate

The `create-X` ecosystem has one shape per framework. **`create-next-app` ships Next.js. `create-vite` ships Vite. `create-t3-app` ships Next.js + tRPC.** Pick a different language and you're back to copy-paste boilerplate or a half-maintained generator.

TheoCreate is **one CLI across the languages your team actually uses**.

| Capability | TheoCreate | `create-next-app` | `create-vite` | `create-t3-app` | Roll your own |
|---|---|---|---|---|---|
| Languages covered | **Node · Go · Python · Rust · Java · Ruby · PHP** | Node | Node | Node | (you) |
| Frameworks per language | **Multiple** (Express, Fastify, NestJS, FastAPI, Axum, Spring, Sinatra, Slim, …) | Next.js only | Frontend-only | Next.js only | (you) |
| Composable modules (Redis, auth, queue) | **Flag-driven** | DIY | DIY | Pre-bundled | DIY |
| Database + ORM + `docker-compose` wired | **`--database` flag** | DIY | DIY | Yes (Prisma) | DIY |
| Monorepo templates | **7** (Turbo · Go · Python · Rust · Java · Ruby · PHP) | DIY | DIY | Limited | DIY |
| Health probes + graceful shutdown by default | **Yes** | DIY | DIY | DIY | DIY |
| Package-manager auto-detect | **npm · pnpm · yarn · bun** | Limited | Limited | Limited | DIY |
| `--dry-run` preview | **Yes** | No | No | No | N/A |
| License | Apache-2.0 | MIT | MIT | MIT | N/A |

`create-next-app` ships Next.js. **TheoCreate ships real backends in any language — not yet another single-framework generator.**

## Why now

Polyglot teams shipping AI agents need scaffolding that crosses languages — not 18 generators that don't talk to each other. The toolchain caught up; the scaffolders didn't.

---

## How it works

> Below this line, full technical vocabulary is in play.

### Install + scaffold

```bash
npm create theo@latest
# or pnpm create theo / yarn create theo / bun create theo
```

The CLI auto-detects your package manager and adapts every output instruction.

### Templates

19 templates registered in `templates/`:

| Category | Templates |
|---|---|
| **API / Backend** | `node-express` · `node-fastify` · `node-nestjs` · `go-api` · `python-fastapi` · `rust-axum` · `java-spring` · `ruby-sinatra` · `php-slim` |
| **Frontend / Fullstack** | `node-nextjs` (Next.js 16 App Router) · `fullstack-nextjs` (Next.js + API Routes) |
| **Monorepo** | `monorepo-turbo` · `monorepo-go` · `monorepo-python` · `monorepo-rust` · `monorepo-java` · `monorepo-ruby` · `monorepo-php` |
| **Worker** | `node-worker` |

> External templates: any GitHub repo via `--template user/repo[#branch]` — useful for private starters or in-house standards.

### Every template ships with

| Feature | Implementation |
|---|---|
| CORS | Language-native middleware (cors, CORSMiddleware, tower-http, …) |
| Structured logging | JSON output (pino, slog, logging, tracing, Logback, …) |
| Error handling | Central middleware + 404 handler |
| Graceful shutdown | SIGTERM/SIGINT handlers with timeout |
| Health check | `GET /health` — liveness probe |
| Readiness check | `GET /ready` — customizable readiness probe |
| Dockerfile | Production-optimized, multi-stage where applicable |
| Example test | Health endpoint test (Jest, Go testing, pytest, cargo test, JUnit, Minitest, PHPUnit) |
| Linting | ESLint, go vet, ruff, clippy, Spotless, RuboCop, PHPStan |
| CI | GitHub Actions workflow |
| `theo.yaml` | Deploy config (apps, framework, ports) |

### Add-on modules

```bash
npm create theo@latest my-app -t node-express --add redis,auth-jwt,queue
```

| Module | Node.js | Go | Python | Rust | Java | Ruby | PHP |
|---|---|---|---|---|---|---|---|
| `redis` | ioredis | go-redis | redis-py | redis crate | Spring Data Redis | redis gem | Predis |
| `auth-jwt` | jsonwebtoken | golang-jwt | pyjwt | jsonwebtoken crate | JJWT | ruby-jwt | firebase/php-jwt |
| `auth-oauth` | openid-client | go-oidc | authlib | openidconnect | Spring OAuth2 | omniauth | Guzzle |
| `queue` | BullMQ | Asynq | arq | — | — | — | Symfony Messenger |

`auth-jwt` and `auth-oauth` are mutually exclusive.

### Database

```bash
npm create theo@latest my-app -t node-express --database
```

| Language | ORM | Comes with |
|---|---|---|
| Node.js | Prisma | Schema, client, migration scripts |
| Go | GORM | Connection helper, User model |
| Python | SQLAlchemy | Engine, session, User model |
| Rust | Diesel | Connection helper, config |
| Java | Spring Data JPA | Entity, Repository, auto-DDL |
| Ruby | Sequel | Connection, User model |
| PHP | Doctrine DBAL | Connection helper |

All database setups ship `docker-compose.yml` (Postgres 16, healthcheck, persistent volume) and `.env` pre-configured.

### Frontend stack (Next.js templates)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack default, standalone output) |
| UI | React 19.2 (Server Components) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`, zero config) |
| Lint | ESLint flat config + `eslint-config-next/core-web-vitals` + TypeScript rules |
| Theme | `next-themes` ThemeProvider, dark mode, system preference detection |
| Components | `components.json` (radix-nova style) — `npx shadcn add` ready |
| Class merge | `clsx` + `tailwind-merge` via `cn()` |
| TypeScript | Strict (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`) + `@/*` aliases |

### CLI flags

| Flag | Description |
|---|---|
| `--template`, `-t` | Skip prompt (`node-express`, `go-api`, `user/repo`, …) |
| `--styling`, `-s` | Frontend styling (`tailwind`, `shadcn`, `daisyui`, `chakra`, `mantine`, `bootstrap`, `bulma`, `none`) |
| `--database`, `-d` | Add Postgres + ORM |
| `--add`, `-a` | Comma-separated modules (`redis`, `auth-jwt`, `auth-oauth`, `queue`) |
| `--dry-run` | Preview without writing |
| `--verbose`, `-v` | Detailed output |

## Where this fits

TheoCreate is part of the [usetheo](https://usetheo.dev) workflow.

| Step | Product | What it does |
|---|---|---|
| 1 | **TheoCode** | Autonomous coding agent (CLI + Desktop). Writes the code in Plan / Code / Infra modes. |
| 2 | **TheoCreate** *(this)* | Scaffolds the project — TheoKit for Full-Stack AI Agents, or one of 18 multi-language stacks. |
| 3 | **TheoKit** | The framework where the app lives. Routing, auth, real-time, deploy. |
| 4 | **TheoCloud** | Managed deploy target. `theo deploy` → live URL in ~4 minutes. Production. |

TheoCreate is standalone — no commitment to the rest of the stack. Every template deploys to TheoCloud, Docker, Railway, Fly.io, or your own infra.

## Mission

**Theo's mission.** From prompt to production. We give every developer the opinion, the infrastructure, and the speed to build and ship real AI agents and applications — with no repetitive setup, no vendor lock-in, and no manual ops.

**Theo's vision.** Be to AI agents what Vercel became to the web: the default, obvious, developer-respected path — with an open runtime end to end.

**TheoCreate's vision.** The first command a developer types when starting anything in any language — `npm create theo@latest`, the scaffolder that already knows what production looks like.

> The full identity (mission, vision, values) lives in [`/IDENTITY.md`](../IDENTITY.md).

## Status

- **Production.** 19 templates, 8 styling options, 4 add-on modules, 7 ORMs, package-manager auto-detection, dry-run preview, external GitHub templates — all shipped on npm. Apache-2.0. Validation suite (`scripts/validate-templates.sh`) covers every template.
- **205 tests across 12 suites** — scaffolding, hooks, error paths, module combinations.
- **`CLAUDE.md` per scaffolded project.** TheoCreate writes a tailored `CLAUDE.md` (AI assistant instructions) into every scaffolded project — keyed by language, framework, and selected add-ons.
- **TheoCloud deploy** — templates ship with `theo.yaml`; `theo deploy` is the canonical PaaS path, wired end-to-end into the production runtime.

## License

[Apache-2.0](./LICENSE) © [usetheo.dev](https://usetheo.dev). Fork the templates. Add your own languages. Keep shipping.

## Next step

**Primary:** Scaffold now.

```bash
npm create theo@latest
```

**Next in the funnel:** Ship it. `theo login` + `theo deploy` puts your scaffolded project on a live URL in ~4 minutes.

**Tertiary:** [Docs](https://docs.usetheo.dev/theocreate) · [GitHub — see all 19 templates](https://github.com/usetheodev/theo-stacks)

## Community

- Discord: https://discord.usetheo.dev/
- X: https://x.com/usetheodev
- LinkedIn: https://linkedin.com/company/usetheodev
