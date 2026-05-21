/** Draft for a file whose content is generated in-memory. */
export interface TextFileDraft {
  kind: "text";
  /** Relative path from project root, e.g. "src/lib/db.ts" */
  path: string;
  content: string;
  /**
   * If true, replace {{project-name}} placeholder with the actual project name
   * when writing. Use when content was read from a template source file that
   * still contains the placeholder (e.g. layout.tsx metadata title).
   */
  replacePlaceholder?: boolean;
}

/** Draft for copying a single file from the template directory. */
export interface CopyFileDraft {
  kind: "copy-file";
  /** Absolute path to the source file on disk (inside templates/) */
  srcPath: string;
  /** Relative destination path from project root */
  destPath: string;
  /** If true, replace {{project-name}} placeholder in text files */
  replacePlaceholder: boolean;
}

/** Draft for copying an entire directory recursively from the template. */
export interface CopyDirDraft {
  kind: "copy-dir";
  /** Absolute path to the source directory on disk */
  srcDir: string;
  /** Relative destination prefix ("" for root) */
  destPrefix: string;
}

/**
 * Draft for declaring dependencies to merge into a manifest file.
 *
 * For JSON manifests (package.json, composer.json): use deps, devDeps, scripts.
 * For text manifests (go.mod, requirements.txt, Cargo.toml, Gemfile): use appendText.
 * For in-place edits (build.gradle.kts): use replacePatterns.
 */
export interface DependencyDraft {
  kind: "dependency";
  /** Target manifest file, e.g. "package.json", "go.mod", "requirements.txt" */
  target: string;
  /** Dependencies to merge (JSON manifests only) */
  deps?: Record<string, string>;
  /** Dev dependencies to merge (JSON manifests only) */
  devDeps?: Record<string, string>;
  /** Scripts to merge (JSON manifests only) */
  scripts?: Record<string, string>;
  /** Raw text to append (text manifests only) */
  appendText?: string;
  /** Search/replace pairs for in-place edits */
  replacePatterns?: Array<{ search: string; replace: string }>;
  /** The addon that declared this draft, used for conflict reporting */
  source: string;
}

export type FileDraft =
  | TextFileDraft
  | CopyFileDraft
  | CopyDirDraft
  | DependencyDraft;
