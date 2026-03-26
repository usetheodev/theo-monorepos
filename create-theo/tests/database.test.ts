import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { scaffold } from "../src/scaffold.js";
import { getTemplate } from "../src/templates.js";
import { supportsDatabase, getOrmForLanguage } from "../src/database.js";

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "create-theo-db-test-"));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe("database config", () => {
  it("supportsDatabase returns true for api and worker", () => {
    expect(supportsDatabase("api")).toBe(true);
    expect(supportsDatabase("worker")).toBe(true);
  });

  it("supportsDatabase returns false for frontend, fullstack, monorepo", () => {
    expect(supportsDatabase("frontend")).toBe(false);
    expect(supportsDatabase("fullstack")).toBe(false);
    expect(supportsDatabase("monorepo")).toBe(false);
  });

  it("maps node to Prisma", () => {
    expect(getOrmForLanguage("node")).toEqual({
      id: "prisma",
      name: "Prisma",
      language: "node",
    });
  });

  it("maps go to GORM", () => {
    expect(getOrmForLanguage("go")).toEqual({
      id: "gorm",
      name: "GORM",
      language: "go",
    });
  });

  it("maps python to SQLAlchemy", () => {
    expect(getOrmForLanguage("python")).toEqual({
      id: "sqlalchemy",
      name: "SQLAlchemy",
      language: "python",
    });
  });
});

describe("scaffold with database", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanup(tempDir);
  });

  it("adds Prisma to node-express template", () => {
    const template = getTemplate("node-express")!;
    const targetDir = path.join(tempDir, "express-db");

    scaffold({
      projectName: "express-db",
      template,
      targetDir,
      database: true,
      skipInstall: true,
      skipGit: true,
    });

    // prisma/schema.prisma exists
    const schema = fs.readFileSync(
      path.join(targetDir, "prisma", "schema.prisma"),
      "utf-8",
    );
    expect(schema).toContain('provider = "postgresql"');
    expect(schema).toContain("model User");

    // src/lib/db.js exists (JS, not TS)
    const db = fs.readFileSync(
      path.join(targetDir, "src", "lib", "db.js"),
      "utf-8",
    );
    expect(db).toContain("PrismaClient");
    expect(db).toContain("require");

    // package.json has prisma deps and scripts
    const pkg = JSON.parse(
      fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"),
    );
    expect(pkg.dependencies["@prisma/client"]).toBeDefined();
    expect(pkg.devDependencies["prisma"]).toBeDefined();
    expect(pkg.scripts["db:migrate"]).toBe("prisma migrate dev");
    expect(pkg.scripts["db:studio"]).toBe("prisma studio");

    // .env.example exists
    const envExample = fs.readFileSync(
      path.join(targetDir, ".env.example"),
      "utf-8",
    );
    expect(envExample).toContain("DATABASE_URL");
  });

  it("adds Prisma with TypeScript to node-nestjs template", () => {
    const template = getTemplate("node-nestjs")!;
    const targetDir = path.join(tempDir, "nestjs-db");

    scaffold({
      projectName: "nestjs-db",
      template,
      targetDir,
      database: true,
      skipInstall: true,
      skipGit: true,
    });

    // src/lib/db.ts exists (TypeScript)
    const db = fs.readFileSync(
      path.join(targetDir, "src", "lib", "db.ts"),
      "utf-8",
    );
    expect(db).toContain("PrismaClient");
    expect(db).toContain("import");
    expect(db).not.toContain("require");
  });

  it("adds GORM to go-api template", () => {
    const template = getTemplate("go-api")!;
    const targetDir = path.join(tempDir, "go-db");

    scaffold({
      projectName: "go-db",
      template,
      targetDir,
      database: true,
      skipInstall: true,
      skipGit: true,
    });

    // go.mod has gorm dependencies
    const goMod = fs.readFileSync(path.join(targetDir, "go.mod"), "utf-8");
    expect(goMod).toContain("gorm.io/gorm");
    expect(goMod).toContain("gorm.io/driver/postgres");

    // internal/database/database.go exists
    const dbFile = fs.readFileSync(
      path.join(targetDir, "internal", "database", "database.go"),
      "utf-8",
    );
    expect(dbFile).toContain("package database");
    expect(dbFile).toContain("gorm.Open");
    expect(dbFile).toContain("DATABASE_URL");

    // internal/models/user.go exists
    const model = fs.readFileSync(
      path.join(targetDir, "internal", "models", "user.go"),
      "utf-8",
    );
    expect(model).toContain("type User struct");

    // .env.example exists
    expect(fs.existsSync(path.join(targetDir, ".env.example"))).toBe(true);
  });

  it("adds SQLAlchemy to python-fastapi template", () => {
    const template = getTemplate("python-fastapi")!;
    const targetDir = path.join(tempDir, "py-db");

    scaffold({
      projectName: "py-db",
      template,
      targetDir,
      database: true,
      skipInstall: true,
      skipGit: true,
    });

    // requirements.txt has sqlalchemy deps
    const reqs = fs.readFileSync(
      path.join(targetDir, "requirements.txt"),
      "utf-8",
    );
    expect(reqs).toContain("sqlalchemy");
    expect(reqs).toContain("psycopg2-binary");
    expect(reqs).toContain("alembic");

    // database.py exists
    const dbFile = fs.readFileSync(
      path.join(targetDir, "database.py"),
      "utf-8",
    );
    expect(dbFile).toContain("create_engine");
    expect(dbFile).toContain("DATABASE_URL");
    expect(dbFile).toContain("DeclarativeBase");

    // models.py exists
    const models = fs.readFileSync(
      path.join(targetDir, "models.py"),
      "utf-8",
    );
    expect(models).toContain("class User");
    expect(models).toContain("__tablename__");

    // .env.example exists
    expect(fs.existsSync(path.join(targetDir, ".env.example"))).toBe(true);
  });

  it("does not add database when database is false", () => {
    const template = getTemplate("node-express")!;
    const targetDir = path.join(tempDir, "no-db");

    scaffold({
      projectName: "no-db",
      template,
      targetDir,
      database: false,
      skipInstall: true,
      skipGit: true,
    });

    expect(fs.existsSync(path.join(targetDir, "prisma"))).toBe(false);
    expect(fs.existsSync(path.join(targetDir, ".env.example"))).toBe(false);

    const pkg = JSON.parse(
      fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"),
    );
    expect(pkg.dependencies["@prisma/client"]).toBeUndefined();
  });

  it("adds Prisma to node-worker template", () => {
    const template = getTemplate("node-worker")!;
    const targetDir = path.join(tempDir, "worker-db");

    scaffold({
      projectName: "worker-db",
      template,
      targetDir,
      database: true,
      skipInstall: true,
      skipGit: true,
    });

    expect(
      fs.existsSync(path.join(targetDir, "prisma", "schema.prisma")),
    ).toBe(true);
    expect(fs.existsSync(path.join(targetDir, "src", "lib", "db.js"))).toBe(
      true,
    );
  });
});
