# Test Roadmap — All Combinations

**Date:** 2026-03-26
**Method:** CLI scaffolds + starts the server. Manual testing by user.
**Test directory:** `/tmp/theo-tests/`

---

## Phase 1 — API / Backend (without database)

| # | Template | Scaffold command | Port | Verify |
|---|----------|-----------------|------|--------|
| 01 | node-express | `--template node-express` | 3000 | `GET /` and `GET /health` |
| 02 | node-fastify | `--template node-fastify` | 3000 | `GET /` and `GET /health` |
| 03 | go-api | `--template go-api` | 8080 | `GET /` and `GET /health` |
| 04 | python-fastapi | `--template python-fastapi` | 8000 | `GET /` and `GET /health` |
| 05 | node-nestjs | `--template node-nestjs` | 3000 | `GET /` and `GET /health` |
| 06 | node-worker | `--template node-worker` | 3000 | `GET /health` + worker logs |

---

## Phase 2 — API / Backend (with database)

| # | Template | ORM | Port | Verify |
|---|----------|-----|------|--------|
| 07 | node-express + DB | Prisma | 3000 | `GET /` + `GET /health` + `prisma/schema.prisma` exists + `src/lib/db.js` exists |
| 08 | node-fastify + DB | Prisma | 3000 | `GET /` + `GET /health` + `prisma/schema.prisma` exists + `src/lib/db.js` exists |
| 09 | go-api + DB | GORM | 8080 | `GET /` + `GET /health` + `internal/database/database.go` exists + `internal/models/user.go` exists |
| 10 | python-fastapi + DB | SQLAlchemy | 8000 | `GET /` + `GET /health` + `database.py` exists + `models.py` exists |
| 11 | node-nestjs + DB | Prisma | 3000 | `GET /` + `GET /health` + `prisma/schema.prisma` exists + `src/lib/db.ts` (TypeScript) exists |
| 12 | node-worker + DB | Prisma | 3000 | `GET /health` + worker logs + `prisma/schema.prisma` exists + `src/lib/db.js` exists |

---

## Phase 3 — Frontend (node-nextjs + each styling)

| # | Styling | Port | Verify |
|---|---------|------|--------|
| 13 | Plain CSS (none) | 3000 | Page renders + `GET /api/health` returns ok |
| 14 | Tailwind CSS | 3000 | Page renders + Tailwind working (utility classes applied) + `GET /api/health` |
| 15 | Tailwind + shadcn/ui | 3000 | Page renders + shadcn CSS variables present + `GET /api/health` |
| 16 | Tailwind + daisyUI | 3000 | Page renders + daisyUI classes working + `GET /api/health` |
| 17 | Chakra UI | 3000 | Page renders + ChakraProvider in layout + `GET /api/health` |
| 18 | Mantine | 3000 | Page renders + MantineProvider in layout + `GET /api/health` |
| 19 | Bootstrap | 3000 | Page renders + Bootstrap CSS loaded + `GET /api/health` |
| 20 | Bulma | 3000 | Page renders + Bulma CSS loaded + `GET /api/health` |

---

## Phase 4 — Fullstack (fullstack-nextjs + each styling)

| # | Styling | Port | Verify |
|---|---------|------|--------|
| 21 | Plain CSS (none) | 3000 | Page renders + `GET /api/health` + `GET /api/items` (CRUD) |
| 22 | Tailwind CSS | 3000 | Page + Tailwind + `GET /api/health` + `GET /api/items` |
| 23 | Tailwind + shadcn/ui | 3000 | Page + shadcn + `GET /api/health` + `GET /api/items` |
| 24 | Tailwind + daisyUI | 3000 | Page + daisyUI + `GET /api/health` + `GET /api/items` |
| 25 | Chakra UI | 3000 | Page + Chakra + `GET /api/health` + `GET /api/items` |
| 26 | Mantine | 3000 | Page + Mantine + `GET /api/health` + `GET /api/items` |
| 27 | Bootstrap | 3000 | Page + Bootstrap + `GET /api/health` + `GET /api/items` |
| 28 | Bulma | 3000 | Page + Bulma + `GET /api/health` + `GET /api/items` |

---

## Phase 5 — Monorepo (monorepo-turbo + each styling)

| # | Styling | Ports | Verify |
|---|---------|-------|--------|
| 29 | Plain CSS (none) | API: 3001, Web: 3002 | API `GET /health` on 3001 + Frontend renders on 3002 |
| 30 | Tailwind CSS | API: 3001, Web: 3002 | API + Frontend with Tailwind |
| 31 | Tailwind + shadcn/ui | API: 3001, Web: 3002 | API + Frontend with shadcn |
| 32 | Tailwind + daisyUI | API: 3001, Web: 3002 | API + Frontend with daisyUI |
| 33 | Chakra UI | API: 3001, Web: 3002 | API + Frontend with Chakra |
| 34 | Mantine | API: 3001, Web: 3002 | API + Frontend with Mantine |
| 35 | Bootstrap | API: 3001, Web: 3002 | API + Frontend with Bootstrap |
| 36 | Bulma | API: 3001, Web: 3002 | API + Frontend with Bulma |

---

## Validation Checklist per Test

For each test, verify:

- [ ] Scaffold completed without error
- [ ] Server/app starts without error
- [ ] Endpoints respond correctly
- [ ] No `{{project-name}}` placeholder in any file
- [ ] Frontend renders (when applicable)
- [ ] Styling applied visually (when applicable)
- [ ] Database files present (when applicable)
- [ ] `theo.yaml` correct

---

## Status

| Phase | Total | Passed | Failed | Pending |
|-------|-------|--------|--------|---------|
| 1 — API without DB | 6 | 6 | 0 | 0 |
| 2 — API with DB | 6 | 6 | 0 | 0 |
| 3 — Frontend | 8 | 8 | 0 | 0 |
| 4 — Fullstack | 8 | 8 | 0 | 0 |
| 5 — Monorepo | 8 | 8 | 0 | 0 |
| **TOTAL** | **36** | **36** | **0** | **0** |

**Completion date:** 2026-03-26
**Bugs found and fixed:** 3 (Chakra layout, page without styling classes, CI mode prompts)
