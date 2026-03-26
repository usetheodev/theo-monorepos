import type { TemplateType } from "./templates.js";

export interface OrmConfig {
  id: string;
  name: string;
  language: "node" | "go" | "python";
}

const ormByLanguage: Record<string, OrmConfig> = {
  node: { id: "prisma", name: "Prisma", language: "node" },
  go: { id: "gorm", name: "GORM", language: "go" },
  python: { id: "sqlalchemy", name: "SQLAlchemy", language: "python" },
};

export function getOrmForLanguage(
  language: "node" | "go" | "python",
): OrmConfig {
  return ormByLanguage[language];
}

export function supportsDatabase(templateType: TemplateType): boolean {
  return templateType === "api" || templateType === "worker";
}
