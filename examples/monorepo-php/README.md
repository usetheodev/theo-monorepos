# monorepo-php

PHP monorepo with [Slim Framework](https://www.slimframework.com/) API + Worker, scaffolded by [Theo](https://usetheo.dev).

## Structure

```
apps/
  api/       — Slim API server (port 8000)
  worker/    — Background job processor (port 8001)
packages/
  shared/    — Shared utilities
```

## Development

```bash
composer install

# Run API
make api

# Run Worker
make worker
```

## Deploy

```bash
theo deploy
```
