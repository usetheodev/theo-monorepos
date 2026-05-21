import type { FileDraft } from "./file-draft.js";
import type { TemplateInfo } from "../templates.js";

export function generateQueueDrafts(template: TemplateInfo): FileDraft[] {
  switch (template.language) {
    case "node":
      return generateQueueNodeDrafts(template);
    case "go":
      return generateQueueGoDrafts();
    case "python":
      return generateQueuePythonDrafts();
    case "php":
      return generateQueuePhpDrafts();
    default:
      return [];
  }
}

function generateQueueNodeDrafts(template: TemplateInfo): FileDraft[] {
  const drafts: FileDraft[] = [];

  drafts.push({
    kind: "dependency",
    target: "package.json",
    deps: { bullmq: "^5.0.0" },
    source: "queue",
  });

  const isTypeScript = template.id === "node-nestjs";
  if (isTypeScript) {
    drafts.push({
      kind: "text",
      path: "src/lib/queue.ts",
      content: `import { Queue, Worker, type Processor } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

export const defaultQueue = new Queue("default", { connection });

export function createWorker(name: string, processor: Processor) {
  return new Worker(name, processor, { connection });
}

export { connection };
`,
    });
  } else {
    drafts.push({
      kind: "text",
      path: "src/lib/queue.js",
      content: `const { Queue, Worker } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

const defaultQueue = new Queue("default", { connection });

function createWorker(name, processor) {
  return new Worker(name, processor, { connection });
}

module.exports = { defaultQueue, createWorker, connection };
`,
    });
  }

  return drafts;
}

function generateQueueGoDrafts(): FileDraft[] {
  const drafts: FileDraft[] = [];

  drafts.push({
    kind: "dependency",
    target: "go.mod",
    appendText: `\nrequire github.com/hibiken/asynq v0.24.1\n`,
    source: "queue",
  });

  drafts.push({
    kind: "text",
    path: "internal/queue/queue.go",
    content: `package queue

import (
\t"os"

\t"github.com/hibiken/asynq"
)

var Client *asynq.Client

func Connect() {
\tredisURL := os.Getenv("REDIS_URL")
\tif redisURL == "" {
\t\tredisURL = "redis://localhost:6379"
\t}

\topt, _ := asynq.ParseRedisURI(redisURL)
\tClient = asynq.NewClient(opt)
}

func Enqueue(task *asynq.Task, opts ...asynq.Option) (*asynq.TaskInfo, error) {
\treturn Client.Enqueue(task, opts...)
}
`,
  });

  drafts.push({
    kind: "text",
    path: "internal/queue/worker.go",
    content: `package queue

import (
\t"os"

\t"github.com/hibiken/asynq"
)

func NewWorker(mux *asynq.ServeMux) *asynq.Server {
\tredisURL := os.Getenv("REDIS_URL")
\tif redisURL == "" {
\t\tredisURL = "redis://localhost:6379"
\t}

\topt, _ := asynq.ParseRedisURI(redisURL)
\tsrv := asynq.NewServer(opt, asynq.Config{
\t\tConcurrency: 10,
\t})

\treturn srv
}
`,
  });

  drafts.push({
    kind: "text",
    path: "internal/queue/tasks.go",
    content: `package queue

import (
\t"context"
\t"encoding/json"
\t"fmt"

\t"github.com/hibiken/asynq"
)

const TypeExample = "example:process"

type ExamplePayload struct {
\tMessage string \`json:"message"\`
}

func NewExampleTask(msg string) (*asynq.Task, error) {
\tpayload, err := json.Marshal(ExamplePayload{Message: msg})
\tif err != nil {
\t\treturn nil, err
\t}
\treturn asynq.NewTask(TypeExample, payload), nil
}

func HandleExampleTask(ctx context.Context, t *asynq.Task) error {
\tvar p ExamplePayload
\tif err := json.Unmarshal(t.Payload(), &p); err != nil {
\t\treturn err
\t}
\tfmt.Printf("Processing task: %s\\n", p.Message)
\treturn nil
}
`,
  });

  return drafts;
}

function generateQueuePythonDrafts(): FileDraft[] {
  const drafts: FileDraft[] = [];

  drafts.push({
    kind: "dependency",
    target: "requirements.txt",
    appendText: "arq>=0.26.0\n",
    source: "queue",
  });

  drafts.push({
    kind: "text",
    path: "queue_worker.py",
    content: `import asyncio
import os

from arq import create_pool
from arq.connections import RedisSettings


async def example_task(ctx, message: str) -> str:
    print(f"Processing: {message}")
    return f"Done: {message}"


class WorkerSettings:
    functions = [example_task]
    redis_settings = RedisSettings.from_dsn(
        os.getenv("REDIS_URL", "redis://localhost:6379")
    )
`,
  });

  drafts.push({
    kind: "text",
    path: "queue_client.py",
    content: `import os

from arq import create_pool
from arq.connections import RedisSettings

REDIS_SETTINGS = RedisSettings.from_dsn(
    os.getenv("REDIS_URL", "redis://localhost:6379")
)


async def get_pool():
    return await create_pool(REDIS_SETTINGS)


async def enqueue(pool, task_name: str, *args, **kwargs):
    return await pool.enqueue_job(task_name, *args, **kwargs)
`,
  });

  return drafts;
}

function generateQueuePhpDrafts(): FileDraft[] {
  const drafts: FileDraft[] = [];

  drafts.push({
    kind: "dependency",
    target: "composer.json",
    deps: {
      "symfony/messenger": "^7.0",
      "symfony/redis-messenger": "^7.0",
    },
    source: "queue",
  });

  drafts.push({
    kind: "text",
    path: "src/Message/ExampleMessage.php",
    content: `<?php

declare(strict_types=1);

namespace App\\Message;

class ExampleMessage
{
    public function __construct(
        public readonly string $content,
    ) {}
}
`,
  });

  drafts.push({
    kind: "text",
    path: "src/Message/ExampleHandler.php",
    content: `<?php

declare(strict_types=1);

namespace App\\Message;

class ExampleHandler
{
    public function __invoke(ExampleMessage $message): void
    {
        echo "Processing: " . $message->content . "\\n";
    }
}
`,
  });

  return drafts;
}
