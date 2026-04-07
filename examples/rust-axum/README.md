# rust-axum

Rust API server built with [Axum](https://github.com/tokio-rs/axum), scaffolded by [Theo](https://usetheo.dev).

## Development

```bash
cargo run
```

The server starts on `http://localhost:8080`.

## Endpoints

- `GET /` — Hello message
- `GET /health` — Health check

## Deploy

```bash
theo deploy
```
