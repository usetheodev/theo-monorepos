import { validateDrafts } from "../src/scaffold/validators.js";
import type { FileDraft } from "../src/scaffold/file-draft.js";
import type { ScaffoldOptions } from "../src/scaffold/types.js";
import { getTemplate } from "../src/templates.js";

function makeOptions(
  overrides: Partial<ScaffoldOptions> = {},
): ScaffoldOptions {
  return {
    projectName: "test-project",
    template: getTemplate("node-express")!,
    targetDir: "/tmp/test",
    ...overrides,
  };
}

describe("validateDrafts", () => {
  it("returns no errors for valid drafts", () => {
    const drafts: FileDraft[] = [
      { kind: "text", path: "src/index.js", content: "console.log('hello');" },
      {
        kind: "dependency",
        target: "package.json",
        deps: { "@prisma/client": "^6.0.0" },
        source: "database",
      },
    ];

    const errors = validateDrafts(drafts, makeOptions({ database: true }));
    expect(errors).toHaveLength(0);
  });

  it("detects residual placeholders in text drafts", () => {
    const drafts: FileDraft[] = [
      {
        kind: "text",
        path: "src/config.js",
        content: 'const name = "{{project-name}}";',
      },
    ];

    const errors = validateDrafts(drafts, makeOptions());
    expect(errors.some((e) => e.code === "RESIDUAL_PLACEHOLDER")).toBe(true);
    expect(errors[0].path).toBe("src/config.js");
  });

  it("detects missing database dependency draft", () => {
    const drafts: FileDraft[] = [
      { kind: "text", path: "src/index.js", content: "// empty" },
    ];

    const errors = validateDrafts(drafts, makeOptions({ database: true }));
    expect(errors.some((e) => e.code === "MISSING_DATABASE_DEPS")).toBe(true);
  });

  it("detects missing redis dependency draft", () => {
    const drafts: FileDraft[] = [];
    const errors = validateDrafts(
      drafts,
      makeOptions({ addons: ["redis"] }),
    );
    expect(errors.some((e) => e.code === "MISSING_REDIS_DEPS")).toBe(true);
  });

  it("detects missing auth-jwt dependency draft", () => {
    const drafts: FileDraft[] = [];
    const errors = validateDrafts(
      drafts,
      makeOptions({ addons: ["auth-jwt"] }),
    );
    expect(errors.some((e) => e.code === "MISSING_AUTH_JWT_DEPS")).toBe(true);
  });

  it("detects missing expected package.json dep for node template", () => {
    const drafts: FileDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { "some-unrelated-dep": "^1.0.0" },
        source: "database",
      },
    ];

    const errors = validateDrafts(drafts, makeOptions({ database: true }));
    expect(errors.some((e) => e.code === "MISSING_EXPECTED_DEP")).toBe(true);
    expect(
      errors.find((e) => e.code === "MISSING_EXPECTED_DEP")!.message,
    ).toContain("@prisma/client");
  });

  it("skips package.json integrity check for non-node templates", () => {
    const drafts: FileDraft[] = [
      {
        kind: "dependency",
        target: "go.mod",
        appendText: "\nrequire gorm.io/gorm v1.25.12\n",
        source: "database",
      },
    ];

    const goTemplate = getTemplate("go-api")!;
    const errors = validateDrafts(
      drafts,
      makeOptions({ template: goTemplate, database: true }),
    );
    // Should not have MISSING_EXPECTED_DEP since it's Go, not Node
    expect(errors.some((e) => e.code === "MISSING_EXPECTED_DEP")).toBe(false);
  });

  it("passes when all expected deps are present", () => {
    const drafts: FileDraft[] = [
      {
        kind: "dependency",
        target: "package.json",
        deps: { "@prisma/client": "^6.0.0", ioredis: "^5.0.0", jsonwebtoken: "^9.0.0" },
        source: "database",
      },
    ];

    const errors = validateDrafts(
      drafts,
      makeOptions({
        database: true,
        addons: ["redis", "auth-jwt"],
      }),
    );
    // No MISSING_EXPECTED_DEP errors (there might be MISSING_*_DEPS since sources don't match)
    expect(errors.some((e) => e.code === "MISSING_EXPECTED_DEP")).toBe(false);
  });
});
