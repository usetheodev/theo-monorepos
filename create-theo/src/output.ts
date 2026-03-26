import type { TemplateInfo } from "./templates.js";
import type { StylingOption } from "./styling.js";
import { getOrmForLanguage } from "./database.js";

export function printSuccess(
  projectName: string,
  targetDir: string,
  template: TemplateInfo,
  styling?: StylingOption | null,
  database?: boolean,
): void {
  console.log();
  console.log(`  Created ${projectName} in ./${projectName}`);

  if (styling) {
    console.log(`  Styling: ${styling.name}`);
  }

  if (database) {
    const orm = getOrmForLanguage(template.language);
    console.log(`  Database: PostgreSQL (${orm.name})`);
  }

  console.log();
  console.log("  Next steps:");
  console.log(`    cd ${projectName}`);
  console.log("    theo login        # authenticate (first time only)");
  console.log("    theo deploy       # deploy to production");
  console.log();

  const devInstructions = getDevInstructions(template, database);
  if (devInstructions) {
    console.log("  Local development:");
    for (const line of devInstructions) {
      console.log(`    ${line}`);
    }
    console.log();
  }

  if (database) {
    const dbInstructions = getDatabaseInstructions(template);
    if (dbInstructions) {
      console.log("  Database setup:");
      for (const line of dbInstructions) {
        console.log(`    ${line}`);
      }
      console.log();
    }
  }
}

function getDevInstructions(
  template: TemplateInfo,
  database?: boolean,
): string[] | null {
  switch (template.language) {
    case "node":
      return ["npm install", "npm run dev"];
    case "go": {
      const lines = [];
      if (database) {
        lines.push("go mod tidy");
      }
      lines.push("go run .");
      return lines;
    }
    case "python":
      return [
        "pip install -r requirements.txt",
        "uvicorn main:app --reload --port 8000",
      ];
    default:
      return null;
  }
}

function getDatabaseInstructions(template: TemplateInfo): string[] | null {
  switch (template.language) {
    case "node":
      return [
        "cp .env.example .env      # configure DATABASE_URL",
        "npm run db:migrate        # run migrations",
        "npm run db:studio         # open Prisma Studio",
      ];
    case "go":
      return [
        "cp .env.example .env      # configure DATABASE_URL",
      ];
    case "python":
      return [
        "cp .env.example .env      # configure DATABASE_URL",
        "alembic init alembic      # initialize Alembic migrations",
      ];
    default:
      return null;
  }
}
