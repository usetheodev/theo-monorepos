import type { DependencyDraft } from "./file-draft.js";

export interface DependencyConflict {
  file: string;
  key: string;
  field: "deps" | "devDeps" | "scripts";
  versionA: string;
  sourceA: string;
  versionB: string;
  sourceB: string;
}

export interface ResolvedDependencies {
  /** Merged JSON manifest fields, keyed by target file path */
  jsonMerges: Map<
    string,
    {
      deps: Record<string, string>;
      devDeps: Record<string, string>;
      scripts: Record<string, string>;
    }
  >;
  /** Accumulated text to append, keyed by target file path */
  textAppends: Map<string, string>;
  /** Search/replace patterns, keyed by target file path */
  replacePatterns: Map<string, Array<{ search: string; replace: string }>>;
  /** Detected version conflicts (warnings, not hard errors) */
  conflicts: DependencyConflict[];
}

function mergeField(
  existing: Record<string, string>,
  incoming: Record<string, string>,
  file: string,
  field: "deps" | "devDeps" | "scripts",
  existingSource: Map<string, string>,
  incomingSource: string,
  conflicts: DependencyConflict[],
): void {
  for (const [key, value] of Object.entries(incoming)) {
    if (key in existing && existing[key] !== value) {
      conflicts.push({
        file,
        key,
        field,
        versionA: existing[key],
        sourceA: existingSource.get(key) ?? "unknown",
        versionB: value,
        sourceB: incomingSource,
      });
    }
    existing[key] = value;
    existingSource.set(key, incomingSource);
  }
}

export function resolveDependencies(
  drafts: DependencyDraft[],
): ResolvedDependencies {
  const jsonMerges = new Map<
    string,
    {
      deps: Record<string, string>;
      devDeps: Record<string, string>;
      scripts: Record<string, string>;
    }
  >();
  const textAppends = new Map<string, string>();
  const replacePatterns = new Map<
    string,
    Array<{ search: string; replace: string }>
  >();
  const conflicts: DependencyConflict[] = [];

  // Track which source set each key, for conflict reporting
  const depSources = new Map<string, Map<string, string>>();
  const devDepSources = new Map<string, Map<string, string>>();
  const scriptSources = new Map<string, Map<string, string>>();

  for (const draft of drafts) {
    const { target, source } = draft;

    // JSON merges (deps, devDeps, scripts)
    if (draft.deps || draft.devDeps || draft.scripts) {
      if (!jsonMerges.has(target)) {
        jsonMerges.set(target, { deps: {}, devDeps: {}, scripts: {} });
        depSources.set(target, new Map());
        devDepSources.set(target, new Map());
        scriptSources.set(target, new Map());
      }
      const entry = jsonMerges.get(target)!;

      if (draft.deps) {
        mergeField(
          entry.deps,
          draft.deps,
          target,
          "deps",
          depSources.get(target)!,
          source,
          conflicts,
        );
      }
      if (draft.devDeps) {
        mergeField(
          entry.devDeps,
          draft.devDeps,
          target,
          "devDeps",
          devDepSources.get(target)!,
          source,
          conflicts,
        );
      }
      if (draft.scripts) {
        mergeField(
          entry.scripts,
          draft.scripts,
          target,
          "scripts",
          scriptSources.get(target)!,
          source,
          conflicts,
        );
      }
    }

    // Text appends
    if (draft.appendText) {
      const existing = textAppends.get(target) ?? "";
      textAppends.set(target, existing + draft.appendText);
    }

    // Replace patterns
    if (draft.replacePatterns) {
      const existing = replacePatterns.get(target) ?? [];
      existing.push(...draft.replacePatterns);
      replacePatterns.set(target, existing);
    }
  }

  return { jsonMerges, textAppends, replacePatterns, conflicts };
}
