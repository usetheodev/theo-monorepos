import type { TemplateType } from "./templates.js";

export type Language = "node" | "go" | "python" | "rust" | "java" | "ruby";

export interface OrmConfig {
  id: string;
  name: string;
  language: Language;
}

const ormByLanguage: Record<string, OrmConfig> = {
  node: { id: "prisma", name: "Prisma", language: "node" },
  go: { id: "gorm", name: "GORM", language: "go" },
  python: { id: "sqlalchemy", name: "SQLAlchemy", language: "python" },
  rust: { id: "diesel", name: "Diesel", language: "rust" },
  java: { id: "spring-data-jpa", name: "Spring Data JPA", language: "java" },
  ruby: { id: "sequel", name: "Sequel", language: "ruby" },
};

export function getOrmForLanguage(
  language: Language,
): OrmConfig {
  return ormByLanguage[language];
}

export function supportsDatabase(templateType: TemplateType): boolean {
  return templateType === "api" || templateType === "worker";
}
