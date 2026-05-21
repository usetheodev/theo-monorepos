import type { TemplateInfo } from "../templates.js";
import type { FileDraft } from "./file-draft.js";

export function generateRedisDrafts(template: TemplateInfo): FileDraft[] {
  switch (template.language) {
    case "node":
      return generateRedisNodeDrafts(template);
    case "go":
      return generateRedisGoDrafts();
    case "python":
      return generateRedisPythonDrafts();
    case "rust":
      return generateRedisRustDrafts();
    case "java":
      return generateRedisJavaDrafts();
    case "ruby":
      return generateRedisRubyDrafts();
    case "php":
      return generateRedisPhpDrafts();
    default:
      return [];
  }
}

function generateRedisNodeDrafts(template: TemplateInfo): FileDraft[] {
  const drafts: FileDraft[] = [];

  drafts.push({
    kind: "dependency",
    target: "package.json",
    deps: { ioredis: "^5.0.0" },
    source: "redis",
  });

  const isTypeScript = template.id === "node-nestjs";
  if (isTypeScript) {
    drafts.push({
      kind: "text",
      path: "src/lib/redis.ts",
      content: `import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
`,
    });
  } else {
    drafts.push({
      kind: "text",
      path: "src/lib/redis.js",
      content: `const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

module.exports = { redis };
`,
    });
  }

  return drafts;
}

function generateRedisGoDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "go.mod",
      appendText: `\nrequire github.com/redis/go-redis/v9 v9.7.0\n`,
      source: "redis",
    },
    {
      kind: "text",
      path: "internal/cache/redis.go",
      content: `package cache

import (
\t"context"
\t"os"

\t"github.com/redis/go-redis/v9"
)

var Client *redis.Client

func Connect() error {
\turl := os.Getenv("REDIS_URL")
\tif url == "" {
\t\turl = "redis://localhost:6379"
\t}

\topts, err := redis.ParseURL(url)
\tif err != nil {
\t\treturn err
\t}

\tClient = redis.NewClient(opts)
\treturn Client.Ping(context.Background()).Err()
}
`,
    },
  ];
}

function generateRedisPythonDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "requirements.txt",
      appendText: "redis>=5.0.0\n",
      source: "redis",
    },
    {
      kind: "text",
      path: "cache.py",
      content: `import os

import redis

r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
`,
    },
  ];
}

function generateRedisRustDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "Cargo.toml",
      appendText: `\n[dependencies.redis]\nversion = "0.25"\nfeatures = ["tokio-comp"]\n`,
      source: "redis",
    },
    {
      kind: "text",
      path: "src/cache.rs",
      content: `use redis::AsyncCommands;

pub async fn get_client() -> redis::Client {
    let url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".to_string());
    redis::Client::open(url).expect("Invalid Redis URL")
}
`,
    },
  ];
}

function generateRedisJavaDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "build.gradle.kts",
      replacePatterns: [
        {
          search:
            'implementation("org.springframework.boot:spring-boot-starter-web")',
          replace: `implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")`,
        },
      ],
      source: "redis",
    },
    {
      kind: "dependency",
      target: "src/main/resources/application.yml",
      appendText: `
  data:
    redis:
      url: \${REDIS_URL:redis://localhost:6379}
`,
      source: "redis",
    },
  ];
}

function generateRedisRubyDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "Gemfile",
      appendText: `\ngem "redis", "~> 5.0"\n`,
      source: "redis",
    },
    {
      kind: "text",
      path: "cache.rb",
      content: `require "redis"

REDIS = Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:6379"))
`,
    },
  ];
}

function generateRedisPhpDrafts(): FileDraft[] {
  return [
    {
      kind: "dependency",
      target: "composer.json",
      deps: { "predis/predis": "^2.0" },
      source: "redis",
    },
    {
      kind: "text",
      path: "src/cache.php",
      content: `<?php

declare(strict_types=1);

use Predis\\Client;

$redisUrl = getenv('REDIS_URL') ?: 'redis://localhost:6379';
$redis = new Client($redisUrl);
`,
    },
  ];
}
