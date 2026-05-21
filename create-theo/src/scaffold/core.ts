import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import degit from "degit";
import type { TemplateInfo } from "../templates.js";
import { getInstallCommand, type PackageManager } from "../packageManager.js";
import { TemplateNotFoundError, DependencyInstallError } from "../errors.js";
import { PLACEHOLDER, verboseLog, type ScaffoldOptions } from "./types.js";
import type { FileDraft, DependencyDraft } from "./file-draft.js";
import { generateStylingDrafts } from "./styling.js";
import { generateDatabaseDrafts } from "./database.js";
import { generateRedisDrafts } from "./redis.js";
import { generateAuthDrafts, generateAuthOAuthDrafts } from "./auth.js";
import { generateQueueDrafts } from "./queue.js";
import { generateInfraDrafts } from "./infrastructure.js";
import { generateCIDrafts } from "./ci.js";
import { generateLLMDrafts } from "./llm-instructions.js";
import { resolveDependencies } from "./resolve-dependencies.js";
import { validateDrafts } from "./validators.js";
import { writeDrafts } from "./writer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveTemplatesRoot(template: TemplateInfo): string {
  const templatesRoot = path.resolve(
    __dirname,
    "..",
    "..",
    "templates",
    template.id,
  );

  if (!fs.existsSync(templatesRoot)) {
    throw new TemplateNotFoundError(template.id, templatesRoot);
  }

  return templatesRoot;
}

function collectDrafts(
  options: ScaffoldOptions,
  templatesRoot: string,
): FileDraft[] {
  const { template, styling, database, addons = [] } = options;

  const drafts: FileDraft[] = [];

  // Template copy
  drafts.push({ kind: "copy-dir", srcDir: templatesRoot, destPrefix: "" });

  // Addons
  if (styling) {
    drafts.push(...generateStylingDrafts(template, styling, templatesRoot));
  }

  if (database) {
    drafts.push(...generateDatabaseDrafts(template));
  }

  if (addons.includes("redis")) {
    drafts.push(...generateRedisDrafts(template));
  }
  if (addons.includes("auth-jwt")) {
    drafts.push(...generateAuthDrafts(template));
  }
  if (addons.includes("auth-oauth")) {
    drafts.push(...generateAuthOAuthDrafts(template));
  }
  if (addons.includes("queue")) {
    drafts.push(...generateQueueDrafts(template));
  }

  // Infrastructure (docker-compose, .env)
  const needsRedis = addons.includes("redis") || addons.includes("queue");
  const hasAuthJwt = addons.includes("auth-jwt");
  const hasAuthOAuth = addons.includes("auth-oauth");
  if (database || needsRedis || hasAuthJwt || hasAuthOAuth) {
    drafts.push(
      ...generateInfraDrafts(!!database, needsRedis, hasAuthJwt, hasAuthOAuth),
    );
  }

  // CI and LLM instructions (always)
  drafts.push(...generateCIDrafts(template));
  drafts.push(
    ...generateLLMDrafts(template, { styling, database, addons }),
  );

  return drafts;
}

export function scaffold(options: ScaffoldOptions): void {
  const { projectName, targetDir, skipInstall, skipGit, verbose, template } =
    options;

  const templatesRoot = resolveTemplatesRoot(template);

  verboseLog(verbose, `Copying template ${template.id} from ${templatesRoot}`);

  // 1. Collect all drafts
  const drafts = collectDrafts(options, templatesRoot);

  // 2. Resolve dependencies
  const depDrafts = drafts.filter(
    (d): d is DependencyDraft => d.kind === "dependency",
  );
  const resolved = resolveDependencies(depDrafts);
  if (resolved.conflicts.length > 0) {
    for (const c of resolved.conflicts) {
      verboseLog(
        verbose,
        `Dependency conflict in ${c.file}: ${c.key} (${c.sourceA}: ${c.versionA} vs ${c.sourceB}: ${c.versionB})`,
      );
    }
  }

  // 3. Validate
  const errors = validateDrafts(drafts, options);
  for (const e of errors) {
    verboseLog(verbose, `Validation warning: ${e.message}`);
  }

  // 4. Write to disk
  writeDrafts(targetDir, projectName, drafts, resolved);

  // 5. Post-write steps
  if (!skipGit) {
    verboseLog(verbose, "Initializing git repository");
    initGit(targetDir);
  }

  if (!skipInstall && template.language === "node") {
    installNodeDeps(targetDir);
  }
}

export async function scaffoldExternal(
  repo: string,
  targetDir: string,
  projectName: string,
  verbose?: boolean,
): Promise<void> {
  verboseLog(verbose, `Cloning external template from ${repo}`);
  const emitter = degit(repo, { verbose: !!verbose });
  if (verbose) {
    emitter.on("info", (info: { message: string }) => {
      console.error(`  [degit] ${info.message}`);
    });
  }
  await emitter.clone(targetDir);

  // Rename dotfiles (gitignore → .gitignore, dockerignore → .dockerignore)
  for (const name of ["gitignore", "dockerignore"]) {
    const src = path.join(targetDir, name);
    const dest = path.join(targetDir, `.${name}`);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.renameSync(src, dest);
    }
  }

  // Replace placeholder in package.json if it exists
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    pkg.name = projectName;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }

  // Replace placeholder in theo.yaml if it exists
  const theoPath = path.join(targetDir, "theo.yaml");
  if (fs.existsSync(theoPath)) {
    const content = fs.readFileSync(theoPath, "utf-8");
    fs.writeFileSync(theoPath, content.replaceAll(PLACEHOLDER, projectName));
  }

  verboseLog(verbose, "External template scaffolded successfully");
}

export function dryRunScaffold(options: ScaffoldOptions): string[] {
  const { template } = options;

  const templatesRoot = resolveTemplatesRoot(template);

  const drafts = collectDrafts(options, templatesRoot);

  const files: string[] = [];
  for (const draft of drafts) {
    if (draft.kind === "copy-dir") {
      files.push(...collectFiles(draft.srcDir, draft.destPrefix));
    } else if (draft.kind === "text") {
      files.push(draft.path);
    } else if (draft.kind === "copy-file") {
      files.push(draft.destPath);
    }
    // DependencyDrafts modify existing files, don't add new paths
  }

  return [...new Set(files)].sort();
}

function collectFiles(dir: string, prefix: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "package-lock.json")
      continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(path.join(dir, entry.name), rel));
    } else {
      const name =
        entry.name === "gitignore"
          ? ".gitignore"
          : entry.name === "dockerignore"
            ? ".dockerignore"
            : entry.name;
      files.push(prefix ? `${prefix}/${name}` : name);
    }
  }
  return files;
}

function initGit(dir: string): void {
  try {
    execSync("git init", { cwd: dir, stdio: "ignore" });
  } catch {
    // git not available — not critical
  }
}

export function installNodeDeps(
  dir: string,
  pm: PackageManager = "npm",
): void {
  const args = getInstallCommand(pm);
  const cmd = `${pm} ${args.join(" ")}`;
  try {
    execSync(cmd, {
      cwd: dir,
      stdio: "pipe",
      env: {
        ...process.env,
        ADBLOCK: "1",
        DISABLE_OPENCOLLECTIVE: "1",
        NODE_ENV: "development",
      },
    });
  } catch {
    throw new DependencyInstallError(pm);
  }
}
