# monorepo-java

Java monorepo using [Gradle multi-project builds](https://docs.gradle.org/current/userguide/multi_project_builds.html), scaffolded by [Theo](https://usetheo.dev).

## Structure

```
apps/
  api/       — Spring Boot HTTP API server (port 8080)
  worker/    — Spring Boot background worker (port 8081)
packages/
  shared/    — Shared Java library
```

## Development

```bash
./gradlew :apps:api:bootRun         # start the API
./gradlew :apps:worker:bootRun      # start the worker
./gradlew build                      # build all subprojects
./gradlew test                       # run all tests
```

## Deploy

```bash
theo deploy
```
