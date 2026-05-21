import fs from "node:fs";
import path from "node:path";
import type { FileDraft } from "./file-draft.js";
import type { ResolvedDependencies } from "./resolve-dependencies.js";
import { PLACEHOLDER, TEXT_EXTENSIONS } from "./types.js";

function isTextFile(ext: string, basename: string): boolean {
  return (
    TEXT_EXTENSIONS.has(ext) ||
    TEXT_EXTENSIONS.has("." + basename) ||
    basename === "gitignore" ||
    basename === ".prettierrc" ||
    basename === "Dockerfile" ||
    basename === "Procfile" ||
    basename === "Makefile" ||
    basename === "Gemfile" ||
    basename === ".rubocop.yml" ||
    basename === "Rakefile" ||
    basename === "dockerignore"
  );
}

function copyDir(src: string, dest: string, projectName: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "package-lock.json")
        continue;
      const destPath = path.join(dest, entry.name);
      copyDir(srcPath, destPath, projectName);
    } else {
      const destName =
        entry.name === "gitignore"
          ? ".gitignore"
          : entry.name === "dockerignore"
            ? ".dockerignore"
            : entry.name;
      const destPath = path.join(dest, destName);
      copyFile(srcPath, destPath, projectName);
    }
  }
}

function copyFile(src: string, dest: string, projectName: string): void {
  const ext = path.extname(dest);
  const basename = path.basename(dest);

  if (isTextFile(ext, basename)) {
    const content = fs.readFileSync(src, "utf-8");
    fs.writeFileSync(dest, content.replaceAll(PLACEHOLDER, projectName));
  } else {
    fs.copyFileSync(src, dest);
  }
}

function applyJsonMerges(
  targetDir: string,
  resolved: ResolvedDependencies,
): void {
  for (const [target, merge] of resolved.jsonMerges) {
    const filePath = path.join(targetDir, target);
    if (!fs.existsSync(filePath)) continue;

    const pkg = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (Object.keys(merge.deps).length > 0) {
      pkg.dependencies = { ...(pkg.dependencies || {}), ...merge.deps };
    }
    if (Object.keys(merge.devDeps).length > 0) {
      pkg.devDependencies = {
        ...(pkg.devDependencies || {}),
        ...merge.devDeps,
      };
    }
    if (Object.keys(merge.scripts).length > 0) {
      pkg.scripts = { ...(pkg.scripts || {}), ...merge.scripts };
    }

    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
  }
}

function applyTextAppends(
  targetDir: string,
  resolved: ResolvedDependencies,
): void {
  for (const [target, text] of resolved.textAppends) {
    const filePath = path.join(targetDir, target);
    if (!fs.existsSync(filePath)) continue;

    const existing = fs.readFileSync(filePath, "utf-8");
    fs.writeFileSync(filePath, existing + text);
  }
}

function applyReplacePatterns(
  targetDir: string,
  resolved: ResolvedDependencies,
): void {
  for (const [target, patterns] of resolved.replacePatterns) {
    const filePath = path.join(targetDir, target);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, "utf-8");
    for (const p of patterns) {
      content = content.replace(p.search, p.replace);
    }
    fs.writeFileSync(filePath, content);
  }
}

/**
 * Writes all file drafts to disk in the correct order:
 * 1. CopyDirDraft — template directory copy with placeholder replacement
 * 2. DependencyDraft — merge into manifest files (via resolved)
 * 3. TextFileDraft — write/overwrite generated files
 * 4. CopyFileDraft — copy individual files
 */
export function writeDrafts(
  targetDir: string,
  projectName: string,
  drafts: FileDraft[],
  resolved: ResolvedDependencies,
): void {
  // Phase 1: Copy template directories
  for (const draft of drafts) {
    if (draft.kind === "copy-dir") {
      const dest = draft.destPrefix
        ? path.join(targetDir, draft.destPrefix)
        : targetDir;
      copyDir(draft.srcDir, dest, projectName);
    }
  }

  // Phase 2: Apply dependency merges to manifest files
  applyJsonMerges(targetDir, resolved);
  applyTextAppends(targetDir, resolved);
  applyReplacePatterns(targetDir, resolved);

  // Phase 3: Write text file drafts (overwrites template files if same path)
  for (const draft of drafts) {
    if (draft.kind === "text") {
      const filePath = path.join(targetDir, draft.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const content = draft.replacePlaceholder
        ? draft.content.replaceAll(PLACEHOLDER, projectName)
        : draft.content;
      fs.writeFileSync(filePath, content);
    }
  }

  // Phase 4: Copy individual files
  for (const draft of drafts) {
    if (draft.kind === "copy-file") {
      const destPath = path.join(targetDir, draft.destPath);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      if (draft.replacePlaceholder) {
        const content = fs.readFileSync(draft.srcPath, "utf-8");
        fs.writeFileSync(
          destPath,
          content.replaceAll(PLACEHOLDER, projectName),
        );
      } else {
        fs.copyFileSync(draft.srcPath, destPath);
      }
    }
  }
}
