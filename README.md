<p align="center">
  <a href="https://usetheo.dev">
    <h1 align="center">create-theo</h1>
  </a>
</p>

<p align="center">
  Scaffold a production-ready project and deploy it to Kubernetes — no YAML, no Docker, no cluster config.
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
theo deploy
```

Pick a stack, answer a few prompts, and get a live URL. Zero Kubernetes knowledge required.

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
| `node-nestjs` | NestJS | API | 3000 |
| `node-worker` | Node.js | Background Worker | 3000 |
| `go-api` | Go stdlib (net/http) | API | 8080 |
| `python-fastapi` | Python + FastAPI | API | 8000 |
| `fullstack-nextjs` | Next.js + API Routes | Fullstack | 3000 |
| `monorepo-turbo` | Turborepo (Express + Next.js) | Monorepo | 3001 / 3002 |

Every template ships with a health endpoint (`GET /health`), `PORT` env support, and a `theo.yaml` ready for deploy.

## CLI Options

| Flag | Description |
|------|-------------|
| `--template`, `-t` | Skip template prompt (`node-express`, `go-api`, etc.) |
| `--styling`, `-s` | Styling option for frontend templates (`tailwind`, `shadcn`, `daisyui`, etc.) |
| `--database`, `-d` | Add database layer (Prisma, GORM, or SQLAlchemy) |
| `--help` | Show help |

```bash
# Interactive (prompts for everything)
npm create theo@latest

# Non-interactive
npm create theo@latest my-api --template go-api

# With database
npm create theo@latest my-app --template node-express --database

# CI mode (no prompts, no install, no git init)
CI=true npx create-theo my-app --template node-express
```

## Why create-theo?

- **Zero config to production.** Every template deploys as-is with `theo deploy`. No Dockerfile, no Kubernetes manifests, no CI/CD pipeline to set up.
- **Real projects, not toy examples.** Templates include health checks, structured error handling, environment-based config, and proper `.gitignore` — the things you always add manually.
- **Database-ready.** Pass `--database` and get a connected ORM with a sample model — Prisma for Node.js, GORM for Go, SQLAlchemy for Python.
- **Any stack.** Node.js, Go, Python, monorepos, fullstack — pick what you know. Theo handles the rest.

## Prerequisites

- **Node.js 18+** (required to run `create-theo`)
- **[Theo CLI](https://usetheo.dev)** (required to deploy)

## Contributing

We welcome contributions! Whether it's a new template, a bug fix, or documentation improvement.

### Adding a template

1. Create `templates/<template-id>/` with all required files
2. Include `theo.yaml`, `GET /health`, `PORT` env support, `.gitignore`, and `README.md`
3. Use `{{project-name}}` as the placeholder everywhere the project name appears
4. Register it in `create-theo/src/templates.ts`
5. Run the validation suite:

```bash
cd create-theo && npm install && npm test
bash scripts/validate-templates.sh
```

### Development

```bash
# Install and build the CLI
cd create-theo && npm install && npm run build

# Run tests (84 tests across 7 suites)
npm test

# Watch mode
npm run dev
```

## License

[MIT](./LICENSE)
