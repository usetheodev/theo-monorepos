# ruby-sinatra

Ruby API server built with [Sinatra](https://sinatrarb.com/), scaffolded by [Theo](https://usetheo.dev).

## Development

```bash
bundle install
bundle exec rackup
```

The server starts on `http://localhost:4567`.

## Endpoints

- `GET /` — Hello message
- `GET /health` — Health check

## Deploy

```bash
theo deploy
```
