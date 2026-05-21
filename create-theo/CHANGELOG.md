# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- License standardized to **Apache-2.0** (was MIT). Aligns all usetheo open-core pillars under a single license — see root `CLAUDE.md` strategic review of 2026-05-14.
- Refactored scaffold system to use FileDraft architecture — each addon module now returns `FileDraft[]` instead of writing to disk directly, enabling centralized dependency resolution, post-generation validation, and real dry-run support
- Centralized dependency resolution with conflict detection via `resolveDependencies()` — merges all package.json/go.mod/Cargo.toml/etc. modifications in a single pass instead of N independent read-modify-write cycles
- Added composable post-generation validators (`validateDrafts()`) that check for residual placeholders, missing dependency drafts, and package.json integrity
- `dryRunScaffold()` now generates actual drafts and returns an exact file list instead of a static approximation
