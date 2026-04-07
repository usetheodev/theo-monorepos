# node-worker-with-addons

Background worker with health endpoint. Created with [Theo](https://usetheo.dev).

## Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Health endpoint port |
| `POLL_INTERVAL_MS` | `5000` | Polling interval in milliseconds |

## Deploy

```bash
theo login
theo deploy
```
