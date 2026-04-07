# monorepo-ruby

Ruby monorepo using [Bundler](https://bundler.io/) with multiple apps, scaffolded by [Theo](https://usetheo.dev).

## Structure

```
apps/
  api/       — Sinatra HTTP API (port 4567)
  worker/    — Background worker (port 4568)
packages/
  shared/    — Shared utilities
```

## Development

```bash
bundle install        # install dependencies
rake api              # start the API
rake worker           # start the worker
```

## Deploy

```bash
theo deploy
```
