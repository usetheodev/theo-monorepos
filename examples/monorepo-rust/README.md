# monorepo-rust

Rust monorepo using [Cargo Workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html), scaffolded by [Theo](https://usetheo.dev).

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
make build-all     # build all crates
make test-all      # test all crates
make lint-all      # clippy + fmt check
```

## Deploy

```bash
theo deploy
```
