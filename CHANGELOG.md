# Changelog

## [Unreleased]

### Added
- Template category selection step: "What do you want to build?" with API/Backend, Frontend, Fullstack, Monorepo, Worker categories
- Template `node-worker`: background job processor with health endpoint for Kubernetes probes
- Field `type` on `TemplateInfo` to categorize templates (api, frontend, fullstack, monorepo, worker)
- Function `getTemplatesByType()` to filter templates by category
- Auto-skip template prompt when category has only one template
- PostgreSQL database layer with ORM auto-selection: Prisma (Node.js), GORM (Go), SQLAlchemy (Python)
- Flag `--database` (`-d`) to add database via CLI without prompt
- Database setup instructions in post-scaffold output
- Sample `User` model and connection boilerplate for each ORM
- CI workflow: tests on Node 18/20/22, template validation, security audit
- Release workflow: npm publish on version tag with provenance + post-publish smoke test
- Weekly validation workflow: scheduled Monday checks for template integrity and dependency vulnerabilities
