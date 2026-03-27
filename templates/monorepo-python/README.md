# {{project-name}}

Python monorepo using [uv workspaces](https://docs.astral.sh/uv/), scaffolded by [Theo](https://usetheo.dev).

## Structure

```
apps/
  api/       — FastAPI server (port 8000)
  worker/    — Background worker (port 8001)
packages/
  shared/    — Shared utilities
```

## Development

```bash
uv sync                                        # install all packages
uv run --package api uvicorn main:app --port 8000  # start API
uv run --package worker python worker.py          # start worker
```

## Deploy

```bash
theo deploy
```
