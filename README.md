<p align="center">
  <a href="https://usetheo.dev">
    <h1 align="center">create-theo</h1>
  </a>
</p>

<p align="center">
  Production-ready project scaffolding for Node.js, Go, Python, Rust, Java, and Ruby. Deploy anywhere.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/create-theo"><img src="https://img.shields.io/npm/v/create-theo.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/create-theo"><img src="https://img.shields.io/npm/dm/create-theo.svg" alt="monthly downloads" /></a>
  <a href="https://github.com/usetheodev/theo-monorepos/blob/main/LICENSE"><img src="https://img.shields.io/github/license/usetheodev/theo-monorepos.svg" alt="license" /></a>
</p>

<p align="center">
  <code>npm create theo@latest</code>
</p>

---

## Quick Start

```bash
npm create theo@latest
cd my-project
npm run dev
```

Pick a stack, answer a few prompts, start building. Deploy to any platform — [Theo](https://usetheo.dev), Docker, Railway, Fly.io, or your own infra.

### Other package managers

```bash
# yarn
yarn create theo

# pnpm
pnpm create theo

# bun
bun create theo
```

## Templates

| Template | Stack | Type | Default Port |
|----------|-------|------|:------------:|
| `node-express` | Node.js + Express | API | 3000 |
| `node-fastify` | Node.js + Fastify | API | 3000 |
| `node-nextjs` | Next.js (App Router) | Frontend / SSR | 3000 |
| `node-nestjs` | NestJS (TypeScript) | API | 3000 |
| `node-worker` | Node.js | Background Worker | 3000 |
| `go-api` | Go stdlib (net/http) | API | 8080 |
| `python-fastapi` | Python + FastAPI | API | 8000 |
| `rust-axum` | Rust + Axum + Tokio | API | 8080 |
| `java-spring` | Java + Spring Boot | API | 8080 |
| `ruby-sinatra` | Ruby + Sinatra + Puma | API | 4567 |
| `fullstack-nextjs` | Next.js + API Routes | Fullstack | 3000 |
| `monorepo-turbo` | Turborepo (Express + Next.js) | Monorepo | 3001 / 3002 |
| `monorepo-go` | Go Workspaces (API + Worker) | Monorepo | 8080 / 8081 |
| `monorepo-python` | uv Workspace (FastAPI + Worker) | Monorepo | 8000 / 8001 |

Every template is production-ready out of the box: CORS, structured JSON logging, error handling, graceful shutdown, health endpoint (`GET /health`), linting, and a CI workflow.

## CLI Options

| Flag | Description |
|------|-------------|
| `--template`, `-t` | Skip template prompt (`node-express`, `go-api`, etc.) |
| `--styling`, `-s` | Styling for frontend templates (`tailwind`, `shadcn`, `daisyui`, etc.) |
| `--database`, `-d` | Add PostgreSQL with ORM (Prisma, GORM, SQLAlchemy, Diesel, Spring Data JPA, or Sequel) |
| `--add`, `-a` | Add modules: `redis`, `auth-jwt`, `auth-oauth`, `queue` (comma-separated) |
| `--help` | Show help |

```bash
# Interactive (prompts for everything)
npm create theo@latest

# Non-interactive
npm create theo@latest my-api --template go-api

# With database + modules
npm create theo@latest my-app -t node-express -d --add redis,auth-jwt

# Full stack: database + Redis + Auth + Queue
npm create theo@latest my-app -t node-express -d --add redis,auth-jwt,queue

# With OAuth/OIDC instead of JWT
npm create theo@latest my-app -t go-api --add auth-oauth

# CI mode (no prompts, no install, no git init)
CI=true npx create-theo my-app --template node-express
```

## Add-on Modules

Composable modules added at scaffold time via `--add` or interactive checkbox prompt.

| Module | What it generates | Languages |
|--------|-------------------|-----------|
| `redis` | Redis client + connection helper + docker-compose service | Node.js, Go, Python, Rust, Java, Ruby |
| `auth-jwt` | JWT middleware + token generation helpers | Node.js, Go, Python, Rust, Java, Ruby |
| `auth-oauth` | OAuth/OIDC token validation middleware | Node.js, Go, Python, Rust, Java, Ruby |
| `queue` | Job queue + worker setup (auto-includes Redis) | Node.js (BullMQ), Go (Asynq), Python (arq) |

`auth-jwt` and `auth-oauth` are mutually exclusive — pick one or the other.

### Generated per language

| Module | Node.js | Go | Python | Rust | Java | Ruby |
|--------|---------|-----|--------|------|------|------|
| Redis | ioredis | go-redis | redis-py | redis crate | Spring Data Redis | redis gem |
| Auth JWT | jsonwebtoken | golang-jwt | pyjwt | jsonwebtoken crate | JJWT | ruby-jwt |
| Auth OAuth | openid-client | go-oidc | authlib | openidconnect | Spring OAuth2 | omniauth |
| Queue | BullMQ | Asynq | arq | — | — | — |

Framework-specific variants: Fastify uses `src/plugins/auth.js` with fastify-plugin, NestJS uses `src/guards/auth.guard.ts` with `@Injectable`.

## Database

Pass `--database` to get a fully configured database layer:

| Language | ORM | What you get |
|----------|-----|-------------|
| Node.js | Prisma | Schema, client, migration scripts |
| Go | GORM | Connection helper, User model |
| Python | SQLAlchemy | Engine, session, User model |
| Rust | Diesel | Connection helper, config |
| Java | Spring Data JPA | Entity, Repository, auto-DDL |
| Ruby | Sequel | Connection, User model |

All database setups include:
- `docker-compose.yml` with Postgres 16 (healthcheck, persistent volume)
- `.env` pre-configured for local development
- Ready to run: `docker compose up -d`

When combined with `--add redis`, both Postgres and Redis appear in the same `docker-compose.yml`.

## What's Included in Every Template

| Feature | Node.js | Go | Python | Rust | Java | Ruby |
|---------|---------|-----|--------|------|------|------|
| CORS | `cors` / `@fastify/cors` | stdlib middleware | `CORSMiddleware` | `tower-http` | `WebMvcConfigurer` | Sinatra headers |
| Structured logging | `pino-http` (JSON) | `log/slog` (JSON) | stdlib `logging` (JSON) | `tracing` | Logback JSON | Logger JSON |
| Error handling | Central middleware + 404 | Recovery middleware | Exception handler | Axum fallback | `@ControllerAdvice` | Sinatra `error` block |
| Graceful shutdown | SIGTERM/SIGINT | `http.Server.Shutdown` | FastAPI lifespan | `tokio::signal` | Spring `shutdown: graceful` | Puma workers |
| Linting | ESLint 9 + Prettier | Makefile (go vet/fmt) | ruff (pyproject.toml) | rustfmt + clippy | Gradle build | RuboCop |
| CI | GitHub Actions | GitHub Actions | GitHub Actions | GitHub Actions | GitHub Actions | GitHub Actions |
| Health check | `GET /health` | `GET /health` | `GET /health` | `GET /health` | `GET /health` | `GET /health` |

## Why create-theo?

- **Production-ready from day one.** CORS, structured logging, error handling, graceful shutdown, linting — the things every project needs but nobody wants to configure. Not hello world.
- **One CLI, any stack.** Node.js, Go, Python — same experience. Pick your language and get a real project, not a toy.
- **Composable modules.** Add Redis, JWT auth, or job queues with a flag. Get working code with docker-compose, not boilerplate stubs.
- **Database-ready.** Pass `--database` and get a connected ORM, docker-compose with Postgres, and migration scripts.
- **Deploy anywhere.** Every template works with [Theo](https://usetheo.dev), Docker, Railway, Fly.io, or any container platform. No vendor lock-in.

## Prerequisites

- **Node.js 18+** (required to run `create-theo`)
- **Docker** (optional, for local database/Redis via docker-compose)
- **[Theo CLI](https://usetheo.dev)** (optional, for one-command deploy to Kubernetes)

## Contributing

We welcome contributions! Whether it's a new template, a module, a bug fix, or documentation improvement.

### Adding a template

1. Create `templates/<template-id>/` with all required files
2. Include `theo.yaml`, `GET /health`, `PORT` env support, `gitignore` (without dot), and `README.md`
3. Add CORS, structured logging, error handling, and graceful shutdown
4. Add ESLint + Prettier config (Node) or equivalent linting setup
5. Use `{{project-name}}` as the placeholder everywhere the project name appears
6. Register it in `create-theo/src/templates.ts`
7. Run the validation suite:

```bash
cd create-theo && npm install && npm test
bash scripts/validate-templates.sh
```

### Development

```bash
# Install and build the CLI
cd create-theo && npm install && npm run build

# Run tests (115 tests across 11 suites)
npm test

# Watch mode
npm run dev
```

## Known Limitations

- **Queue addon**: Node.js, Go, Python only
- **OAuth addon**: Node.js, Go, Python, Java only
- **Styling**: Frontend templates only (node-nextjs, fullstack-nextjs, monorepo-turbo)

## License

[MIT](./LICENSE)
