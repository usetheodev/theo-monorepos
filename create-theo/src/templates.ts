export type TemplateType = "api" | "frontend" | "fullstack" | "monorepo" | "worker";

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  language: "node" | "go" | "python";
  type: TemplateType;
  defaultPort: number | null;
}

export const templateCategories: {
  id: TemplateType;
  name: string;
  description: string;
}[] = [
  { id: "api", name: "API / Backend", description: "REST API server" },
  { id: "frontend", name: "Frontend", description: "Web application with SSR" },
  { id: "fullstack", name: "Fullstack", description: "Frontend + API in one project" },
  { id: "monorepo", name: "Monorepo", description: "Multiple apps in one repo" },
  { id: "worker", name: "Worker", description: "Background job processor" },
];

export const templates: TemplateInfo[] = [
  {
    id: "node-express",
    name: "Node.js — Express",
    description: "Minimal Express.js API server",
    language: "node",
    type: "api",
    defaultPort: 3000,
  },
  {
    id: "node-fastify",
    name: "Node.js — Fastify",
    description: "Minimal Fastify API server",
    language: "node",
    type: "api",
    defaultPort: 3000,
  },
  {
    id: "node-nextjs",
    name: "Next.js",
    description: "Next.js app with App Router (standalone output)",
    language: "node",
    type: "frontend",
    defaultPort: 3000,
  },
  {
    id: "go-api",
    name: "Go — API",
    description: "Go API using the standard library (net/http)",
    language: "go",
    type: "api",
    defaultPort: 8080,
  },
  {
    id: "python-fastapi",
    name: "Python — FastAPI",
    description: "FastAPI + Uvicorn API server",
    language: "python",
    type: "api",
    defaultPort: 8000,
  },
  {
    id: "monorepo-turbo",
    name: "Monorepo — Turborepo",
    description: "Turborepo with Express API + Next.js frontend + shared package",
    language: "node",
    type: "monorepo",
    defaultPort: null,
  },
  {
    id: "fullstack-nextjs",
    name: "Fullstack — Next.js",
    description: "Next.js fullstack with API routes and CRUD example",
    language: "node",
    type: "fullstack",
    defaultPort: 3000,
  },
  {
    id: "node-nestjs",
    name: "Node.js — NestJS",
    description: "NestJS API with modular architecture",
    language: "node",
    type: "api",
    defaultPort: 3000,
  },
  {
    id: "node-worker",
    name: "Node.js — Worker",
    description: "Background job processor with health endpoint",
    language: "node",
    type: "worker",
    defaultPort: 3000,
  },
];

export function getTemplate(id: string): TemplateInfo | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByType(type: TemplateType): TemplateInfo[] {
  return templates.filter((t) => t.type === type);
}

export function listTemplateIds(): string[] {
  return templates.map((t) => t.id);
}
