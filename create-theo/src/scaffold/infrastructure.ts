import type { FileDraft } from "./file-draft.js";

// --- Infrastructure Files (docker-compose + env) ---

export function generateInfraDrafts(
  hasDatabase: boolean,
  hasRedis: boolean,
  hasAuthJwt = false,
  hasAuthOAuth = false,
): FileDraft[] {
  const drafts: FileDraft[] = [];
  const envVars: Record<string, string> = {};
  const services: string[] = [];
  const volumes: string[] = [];

  if (hasDatabase) {
    envVars.DATABASE_URL =
      "postgresql://postgres:postgres@localhost:5432/mydb?schema=public";
    services.push(`  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5`);
    volumes.push("  pgdata:");
  }

  if (hasRedis) {
    envVars.REDIS_URL = "redis://localhost:6379";
    services.push(`  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5`);
  }

  if (hasAuthJwt) {
    envVars.JWT_SECRET = "change-me-in-production";
  }

  if (hasAuthOAuth) {
    envVars.OIDC_ISSUER_URL = "https://your-provider.com";
    envVars.OIDC_CLIENT_ID = "your-client-id";
    envVars.OIDC_CLIENT_SECRET = "your-client-secret";
  }

  // Docker-compose (only if there are services)
  if (services.length > 0) {
    let compose = "services:\n" + services.join("\n\n") + "\n";
    if (volumes.length > 0) {
      compose += "\nvolumes:\n" + volumes.join("\n") + "\n";
    }
    drafts.push({ kind: "text", path: "docker-compose.yml", content: compose });
  }

  // .env and .env.example
  const envContent =
    Object.entries(envVars)
      .map(([k, v]) => `${k}="${v}"`)
      .join("\n") + "\n";
  drafts.push({ kind: "text", path: ".env", content: envContent });
  drafts.push({ kind: "text", path: ".env.example", content: envContent });

  return drafts;
}
