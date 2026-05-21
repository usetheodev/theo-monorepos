import {
  resolveDependencies,
  type DependencyConflict,
} from "../src/scaffold/resolve-dependencies.js";
import type { DependencyDraft } from "../src/scaffold/file-draft.js";

describe("resolveDependencies", () => {
  it("merges deps from multiple drafts targeting same file", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { "@prisma/client": "^6.0.0" },
        source: "database",
      },
      {
        kind: "dependency",
        target: "package.json",
        deps: { ioredis: "^5.0.0" },
        source: "redis",
      },
    ];

    const result = resolveDependencies(drafts);
    const merge = result.jsonMerges.get("package.json")!;

    expect(merge.deps["@prisma/client"]).toBe("^6.0.0");
    expect(merge.deps.ioredis).toBe("^5.0.0");
    expect(result.conflicts).toHaveLength(0);
  });

  it("merges devDeps and scripts", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { "@prisma/client": "^6.0.0" },
        devDeps: { prisma: "^6.0.0" },
        scripts: { "db:migrate": "prisma migrate dev" },
        source: "database",
      },
    ];

    const result = resolveDependencies(drafts);
    const merge = result.jsonMerges.get("package.json")!;

    expect(merge.devDeps.prisma).toBe("^6.0.0");
    expect(merge.scripts["db:migrate"]).toBe("prisma migrate dev");
  });

  it("detects version conflicts", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { "fastify-plugin": "^4.0.0" },
        source: "auth-jwt",
      },
      {
        kind: "dependency",
        target: "package.json",
        deps: { "fastify-plugin": "^5.0.0" },
        source: "auth-oauth",
      },
    ];

    const result = resolveDependencies(drafts);

    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0].key).toBe("fastify-plugin");
    expect(result.conflicts[0].versionA).toBe("^4.0.0");
    expect(result.conflicts[0].versionB).toBe("^5.0.0");
    expect(result.conflicts[0].sourceA).toBe("auth-jwt");
    expect(result.conflicts[0].sourceB).toBe("auth-oauth");
    // Last write wins
    expect(result.jsonMerges.get("package.json")!.deps["fastify-plugin"]).toBe(
      "^5.0.0",
    );
  });

  it("accumulates text appends for same target", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "go.mod",
        appendText: "\nrequire gorm.io/gorm v1.25.12\n",
        source: "database",
      },
      {
        kind: "dependency",
        target: "go.mod",
        appendText: "\nrequire github.com/redis/go-redis/v9 v9.7.0\n",
        source: "redis",
      },
    ];

    const result = resolveDependencies(drafts);
    const appended = result.textAppends.get("go.mod")!;

    expect(appended).toContain("gorm.io/gorm");
    expect(appended).toContain("go-redis");
  });

  it("accumulates replace patterns for same target", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "build.gradle.kts",
        replacePatterns: [
          {
            search: 'implementation("org.springframework.boot:spring-boot-starter-web")',
            replace: 'implementation("org.springframework.boot:spring-boot-starter-web")\n    implementation("spring-data-jpa")',
          },
        ],
        source: "database",
      },
      {
        kind: "dependency",
        target: "build.gradle.kts",
        replacePatterns: [
          {
            search: 'implementation("org.springframework.boot:spring-boot-starter-web")',
            replace: 'implementation("org.springframework.boot:spring-boot-starter-web")\n    implementation("redis")',
          },
        ],
        source: "redis",
      },
    ];

    const result = resolveDependencies(drafts);
    const patterns = result.replacePatterns.get("build.gradle.kts")!;

    expect(patterns).toHaveLength(2);
  });

  it("handles empty drafts array", () => {
    const result = resolveDependencies([]);
    expect(result.jsonMerges.size).toBe(0);
    expect(result.textAppends.size).toBe(0);
    expect(result.replacePatterns.size).toBe(0);
    expect(result.conflicts).toHaveLength(0);
  });

  it("handles multiple target files", () => {
    const drafts: DependencyDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { ioredis: "^5.0.0" },
        source: "redis",
      },
      {
        kind: "dependency",
        target: "apps/web/package.json",
        deps: { tailwindcss: "^4.0.0" },
        source: "styling",
      },
    ];

    const result = resolveDependencies(drafts);

    expect(result.jsonMerges.has("package.json")).toBe(true);
    expect(result.jsonMerges.has("apps/web/package.json")).toBe(true);
    expect(result.jsonMerges.get("package.json")!.deps.ioredis).toBe("^5.0.0");
    expect(
      result.jsonMerges.get("apps/web/package.json")!.deps.tailwindcss,
    ).toBe("^4.0.0");
  });
});
