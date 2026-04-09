#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failed=0

check_identical() {
  local label="$1"; shift
  local base="$ROOT/$1"; shift
  for file in "$@"; do
    if ! diff -q "$base" "$ROOT/$file" >/dev/null 2>&1; then
      echo -e "\033[0;31mFAIL\033[0m [$label] differs: $1 vs $file"
      failed=1
      return
    fi
  done
  echo -e "\033[0;32mPASS\033[0m [$label]"
}

echo "=== Template Consistency Check ==="

check_identical ".prettierrc" \
  "templates/node-nextjs/.prettierrc" \
  "templates/fullstack-nextjs/.prettierrc" \
  "templates/monorepo-turbo/apps/web/.prettierrc"

check_identical "components.json" \
  "templates/node-nextjs/components.json" \
  "templates/fullstack-nextjs/components.json" \
  "templates/monorepo-turbo/apps/web/components.json"

check_identical "tsconfig.json (standalone)" \
  "templates/node-nextjs/tsconfig.json" \
  "templates/fullstack-nextjs/tsconfig.json"

check_identical "eslint.config.mjs (standalone)" \
  "templates/node-nextjs/eslint.config.mjs" \
  "templates/fullstack-nextjs/eslint.config.mjs"

if [ "$failed" -gt 0 ]; then
  echo ""
  echo "Some configs have drifted. Fix the divergences above."
  exit 1
fi

echo ""
echo "All template configs are consistent."
