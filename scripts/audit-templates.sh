#!/usr/bin/env bash
# audit-templates.sh — Validates all 14 templates against CLAUDE.md production-readiness criteria
set -euo pipefail

TEMPLATES_DIR="$(cd "$(dirname "$0")/../templates" && pwd)"
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_CHECKS=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

SRC_EXTS='--include=*.js --include=*.ts --include=*.go --include=*.py --include=*.rs --include=*.java --include=*.rb --include=*.kt --include=*.kts'
ALL_EXTS="$SRC_EXTS --include=*.json --include=*.toml --include=*.yml --include=*.yaml --include=*.properties"

pass() {
  printf "  ${GREEN}PASS${NC}  %s\n" "$1"
  PASS_COUNT=$((PASS_COUNT + 1))
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

fail() {
  printf "  ${RED}FAIL${NC}  %s\n" "$1"
  FAIL_COUNT=$((FAIL_COUNT + 1))
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

header() {
  printf "\n${BOLD}${YELLOW}=== %s ===${NC}\n" "$1"
}

# Helper: search source + config files
grep_src() {
  grep -rli "$1" "$2" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' --include='*.json' --include='*.toml' --include='*.yml' \
    --include='*.yaml' --include='*.properties' --include='*.mjs' \
    2>/dev/null | head -1 || true
}

# Collect all template directories
TEMPLATES=()
for d in "$TEMPLATES_DIR"/*/; do
  TEMPLATES+=("$(basename "$d")")
done

echo ""
printf "${BOLD}Template Audit — %d templates found${NC}\n" "${#TEMPLATES[@]}"
echo "Checking against CLAUDE.md production-readiness criteria"
echo "========================================================"

for tmpl in "${TEMPLATES[@]}"; do
  dir="$TEMPLATES_DIR/$tmpl"
  header "$tmpl"

  # --- 1. theo.yaml ---
  if [[ -f "$dir/theo.yaml" ]]; then
    has_version=$(grep -c 'version: 1' "$dir/theo.yaml" || true)
    has_placeholder=$(grep -c '{{project-name}}' "$dir/theo.yaml" || true)
    if [[ $has_version -gt 0 && $has_placeholder -gt 0 ]]; then
      pass "theo.yaml (version: 1 + {{project-name}})"
    else
      [[ $has_version -eq 0 ]] && fail "theo.yaml missing 'version: 1'"
      [[ $has_placeholder -eq 0 ]] && fail "theo.yaml missing '{{project-name}}'"
    fi
  else
    fail "theo.yaml not found"
  fi

  # --- 2. gitignore ---
  if [[ -f "$dir/gitignore" ]]; then
    pass "gitignore exists (without dot)"
  else
    fail "gitignore not found"
  fi

  # --- 3. README.md ---
  if [[ -f "$dir/README.md" ]]; then
    pass "README.md exists"
  else
    fail "README.md not found"
  fi

  # --- 4. Health endpoint ---
  # Check for /health route in code OR api/health/route.js (Next.js file-based routing)
  health_file=$(find "$dir" -path '*/api/health/route.*' 2>/dev/null | head -1 || true)
  health_code=$(grep_src '/health' "$dir")
  if [[ -n "$health_file" || -n "$health_code" ]]; then
    pass "Health endpoint (/health route found)"
  else
    fail "Health endpoint — no /health route found in source files"
  fi

  # --- 5. PORT env var ---
  # Patterns: process.env.PORT, os.Getenv("PORT"), os.environ.get("PORT"),
  # env::var("PORT"), ENV.fetch("PORT"), ENV["PORT"], ${PORT:...} in YAML,
  # server.port in Spring YAML, next start (reads PORT automatically)
  port_env=$(grep -rli \
    'process\.env\.PORT\|os\.Getenv.*PORT\|os\.environ.*PORT\|env::var.*PORT\|ENV\[.*PORT\|ENV\.fetch.*PORT\|\${PORT\|server\.port\|next start' \
    "$dir" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' --include='*.yml' --include='*.yaml' --include='*.properties' \
    --include='*.json' --include='*.toml' \
    2>/dev/null | head -1 || true)
  if [[ -n "$port_env" ]]; then
    pass "PORT env var reading"
  else
    fail "PORT env var — no PORT environment variable reading found"
  fi

  # --- 6. CORS ---
  cors_found=$(grep -rli 'cors\|CORS\|Access-Control\|allowedOrigins' "$dir" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' --include='*.json' --include='*.mjs' --include='*.yml' \
    2>/dev/null | head -1 || true)
  if [[ -n "$cors_found" ]]; then
    pass "CORS middleware/config"
  else
    fail "CORS — no CORS middleware or Access-Control headers found"
  fi

  # --- 7. Graceful shutdown ---
  # Patterns: SIGTERM, SIGINT, shutdown, signal handling, lifespan (FastAPI),
  # shutdown: graceful (Spring), with_graceful_shutdown (Axum),
  # on_worker_shutdown (Puma), enableShutdownHooks
  shutdown_found=$(grep -rli \
    'SIGTERM\|SIGINT\|graceful.shutdown\|shutdown.*signal\|signal.*shutdown\|lifespan\|on_worker_shutdown\|enableShutdownHooks\|with_graceful_shutdown\|shutdown: graceful\|SignalKind::terminate' \
    "$dir" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' --include='*.yml' --include='*.yaml' \
    2>/dev/null | head -1 || true)
  if [[ -n "$shutdown_found" ]]; then
    pass "Graceful shutdown (signal handling)"
  else
    fail "Graceful shutdown — no SIGTERM/SIGINT/shutdown handling found"
  fi

  # --- 8. Structured logging ---
  # Patterns: pino, slog, logging (Python), Logger (Ruby/Java/NestJS), tracing/tracing-subscriber (Rust),
  # log4j, SLF4J, console: (Spring JSON pattern), fastify logger:true, new Logger
  logging_found=$(grep -rli \
    'pino\|slog\|import logging\|from logging\|tracing_subscriber\|tracing::\|Logger\.new\|new Logger\|LoggerFactory\|logging:\|log4j\|SLF4J\|logger: true\|logger:true\|fastify.*log' \
    "$dir" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' --include='*.json' --include='*.toml' --include='*.yml' \
    2>/dev/null | head -1 || true)
  if [[ -n "$logging_found" ]]; then
    pass "Structured logging"
  else
    fail "Structured logging — no logging framework found"
  fi

  # --- 9. Error handling ---
  # Patterns: 404 handler, not_found, NotFound, error middleware, exception handler,
  # recover() (Go), fallback (Axum), GlobalExceptionHandler, error do (Sinatra),
  # ExceptionFilter (NestJS), @ExceptionHandler, error.js/error.tsx (Next.js),
  # setNotFoundHandler, setErrorHandler, AllExceptionsFilter
  error_code=$(grep -rli \
    'not.found\|NotFound\|not_found\|404\|error.*handler\|error.*middleware\|exception_handler\|GlobalException\|@ExceptionHandler\|ExceptionFilter\|AllExceptionsFilter\|fallback\|recover()\|error do\|setNotFoundHandler\|setErrorHandler' \
    "$dir" \
    --include='*.js' --include='*.ts' --include='*.go' --include='*.py' \
    --include='*.rs' --include='*.java' --include='*.rb' --include='*.kt' \
    --include='*.kts' \
    2>/dev/null | head -1 || true)
  error_file=$(find "$dir" -name 'error.js' -o -name 'error.tsx' -o -name 'not-found.js' -o -name 'not-found.tsx' 2>/dev/null | head -1 || true)
  if [[ -n "$error_code" || -n "$error_file" ]]; then
    pass "Error handling (404/error middleware)"
  else
    fail "Error handling — no 404 handler or error middleware found"
  fi

  # --- 10. Linting config ---
  lint_pass=false
  case "$tmpl" in
    node-*|fullstack-*|monorepo-turbo)
      eslint=$(find "$dir" -name 'eslint.config.js' -o -name 'eslint.config.mjs' -o -name '.eslintrc*' 2>/dev/null | head -1 || true)
      if [[ -n "$eslint" ]]; then
        lint_pass=true
        pass "Linting config (eslint found)"
      fi
      ;;
    go-*|monorepo-go)
      if [[ -f "$dir/Makefile" ]]; then
        has_targets=$(grep -cE 'vet|fmt|test|lint' "$dir/Makefile" || true)
        if [[ $has_targets -gt 0 ]]; then
          lint_pass=true
          pass "Linting config (Makefile with vet/fmt/test)"
        fi
      fi
      ;;
    python-*|monorepo-python)
      # Check all pyproject.toml files for linting config
      has_ruff=$(grep -rlE 'ruff|lint|flake8|pylint|black' "$dir" --include='pyproject.toml' 2>/dev/null | head -1 || true)
      if [[ -n "$has_ruff" ]]; then
        lint_pass=true
        pass "Linting config (pyproject.toml with linting)"
      else
        pyproject=$(find "$dir" -name 'pyproject.toml' 2>/dev/null | head -1 || true)
        if [[ -n "$pyproject" ]]; then
          fail "Linting config — pyproject.toml exists but no ruff/linting section"
          lint_pass=true  # prevent double-fail
        fi
      fi
      ;;
    rust-*)
      if [[ -f "$dir/rustfmt.toml" ]]; then
        lint_pass=true
        pass "Linting config (rustfmt.toml)"
      fi
      ;;
    java-*)
      if [[ -f "$dir/build.gradle.kts" ]]; then
        has_lint=$(grep -cE 'checkstyle|spotless|pmd|lint' "$dir/build.gradle.kts" 2>/dev/null || true)
        if [[ $has_lint -gt 0 ]]; then
          lint_pass=true
          pass "Linting config (build.gradle.kts with linting plugin)"
        fi
      fi
      ;;
    ruby-*)
      if [[ -f "$dir/.rubocop.yml" ]]; then
        lint_pass=true
        pass "Linting config (.rubocop.yml)"
      elif [[ -f "$dir/Gemfile" ]]; then
        has_rubocop=$(grep -c 'rubocop' "$dir/Gemfile" 2>/dev/null || true)
        if [[ $has_rubocop -gt 0 ]]; then
          lint_pass=true
          pass "Linting config (Gemfile includes rubocop)"
        fi
      fi
      ;;
  esac
  if [[ "$lint_pass" == false ]]; then
    fail "Linting config — missing or incomplete for $tmpl"
  fi

done

# Summary
echo ""
echo "========================================================"
printf "${BOLD}AUDIT SUMMARY${NC}\n"
printf "  Templates: %d\n" "${#TEMPLATES[@]}"
printf "  Total checks: %d\n" "$TOTAL_CHECKS"
printf "  ${GREEN}PASS: %d${NC}\n" "$PASS_COUNT"
printf "  ${RED}FAIL: %d${NC}\n" "$FAIL_COUNT"
echo "========================================================"

if [[ $FAIL_COUNT -gt 0 ]]; then
  printf "\n${RED}${BOLD}AUDIT FAILED — %d check(s) need attention${NC}\n\n" "$FAIL_COUNT"
  exit 1
else
  printf "\n${GREEN}${BOLD}ALL CHECKS PASSED${NC}\n\n"
  exit 0
fi
