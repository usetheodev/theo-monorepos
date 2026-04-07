# monorepo-go

Go monorepo using [Go Workspaces](https://go.dev/doc/tutorial/workspaces), scaffolded by [Theo](https://usetheo.dev).

## Structure

```
apps/
  api/       — HTTP API server (port 8080)
  worker/    — Background worker (port 8081)
pkg/
  shared/    — Shared utilities
```

## Development

```bash
make run-api       # start the API
make run-worker    # start the worker
make build-all     # build all binaries
make lint-all      # lint all modules
```

## Deploy

```bash
theo deploy
```
