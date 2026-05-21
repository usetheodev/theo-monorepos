import type { FileDraft, DependencyDraft } from "./file-draft.js";
import type { ScaffoldOptions } from "./types.js";
import { PLACEHOLDER } from "./types.js";

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
}

type Validator = (
  drafts: FileDraft[],
  options: ScaffoldOptions,
) => ValidationError[];

function validateNoResidualPlaceholders(
  drafts: FileDraft[],
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const draft of drafts) {
    if (draft.kind === "text" && draft.content.includes(PLACEHOLDER)) {
      errors.push({
        code: "RESIDUAL_PLACEHOLDER",
        message: `File "${draft.path}" still contains placeholder ${PLACEHOLDER}`,
        path: draft.path,
      });
    }
  }
  return errors;
}

function validateRequiredFiles(
  drafts: FileDraft[],
  options: ScaffoldOptions,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { database, addons = [] } = options;

  const depDrafts = drafts.filter(
    (d): d is DependencyDraft => d.kind === "dependency",
  );

  if (database && !depDrafts.some((d) => d.source === "database")) {
    errors.push({
      code: "MISSING_DATABASE_DEPS",
      message:
        "Database is enabled but no dependency draft was generated for it",
    });
  }

  if (addons.includes("redis") && !depDrafts.some((d) => d.source === "redis")) {
    errors.push({
      code: "MISSING_REDIS_DEPS",
      message: "Redis addon is enabled but no dependency draft was generated",
    });
  }

  if (
    addons.includes("auth-jwt") &&
    !depDrafts.some((d) => d.source === "auth-jwt")
  ) {
    errors.push({
      code: "MISSING_AUTH_JWT_DEPS",
      message:
        "Auth JWT addon is enabled but no dependency draft was generated",
    });
  }

  if (
    addons.includes("auth-oauth") &&
    !depDrafts.some((d) => d.source === "auth-oauth")
  ) {
    errors.push({
      code: "MISSING_AUTH_OAUTH_DEPS",
      message:
        "Auth OAuth addon is enabled but no dependency draft was generated",
    });
  }

  if (addons.includes("queue") && !depDrafts.some((d) => d.source === "queue")) {
    errors.push({
      code: "MISSING_QUEUE_DEPS",
      message: "Queue addon is enabled but no dependency draft was generated",
    });
  }

  return errors;
}

function validatePackageJsonIntegrity(
  drafts: FileDraft[],
  options: ScaffoldOptions,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const { template, database, addons = [] } = options;

  if (template.language !== "node") return errors;

  // Collect all deps targeting package.json
  const pkgDeps: Record<string, string> = {};
  for (const draft of drafts) {
    if (
      draft.kind === "dependency" &&
      draft.target === "package.json" &&
      draft.deps
    ) {
      Object.assign(pkgDeps, draft.deps);
    }
  }

  const expectedDeps: Array<{ addon: string; dep: string; condition: boolean }> =
    [
      {
        addon: "database",
        dep: "@prisma/client",
        condition: !!database,
      },
      {
        addon: "redis",
        dep: "ioredis",
        condition: addons.includes("redis"),
      },
      {
        addon: "auth-jwt",
        dep: "jsonwebtoken",
        condition: addons.includes("auth-jwt"),
      },
      {
        addon: "auth-oauth",
        dep: "openid-client",
        condition: addons.includes("auth-oauth"),
      },
      {
        addon: "queue",
        dep: "bullmq",
        condition: addons.includes("queue"),
      },
    ];

  for (const { addon, dep, condition } of expectedDeps) {
    if (condition && !(dep in pkgDeps)) {
      errors.push({
        code: "MISSING_EXPECTED_DEP",
        message: `Addon "${addon}" is enabled but "${dep}" not found in package.json deps`,
      });
    }
  }

  return errors;
}

const validators: Validator[] = [
  (drafts) => validateNoResidualPlaceholders(drafts),
  (drafts, options) => validateRequiredFiles(drafts, options),
  (drafts, options) => validatePackageJsonIntegrity(drafts, options),
];

export function validateDrafts(
  drafts: FileDraft[],
  options: ScaffoldOptions,
): ValidationError[] {
  return validators.flatMap((v) => v(drafts, options));
}
