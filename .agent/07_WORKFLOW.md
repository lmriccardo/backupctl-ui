# 07 — Workflow

## Branch naming

- feat/<area>-<short-desc>
- fix/<area>-<short-desc>
- refactor/<area>-<short-desc>
- chore/<area>-<short-desc>
- docs/<area>-<short-desc>

Examples:
- feat/jobs-list-filtering
- fix/cli-run-exitcode
- refactor/tauri-command-layer
- chore/deps-update
- docs/agent-clarifications

## Commit format

Use:
type(scope): <message>

Types:
- feat, fix, refactor, chore, docs, test, build, ci

Scopes (examples):
- ui, jobs, register, run, status, cli, tauri, net, security, docs

Examples:
- feat(jobs): add registry/cron toggle
- fix(cli): show stderr when exitCode != 0
- refactor(tauri): centralize command invocation

## PR rules

- One PR = one intent.
- PR description MUST include:
  - What changed
  - Why
  - How to test
  - Screenshots for UI changes

## Modification acceptance criteria (Definition of Done)

A change is acceptable only if:

1) Correctness
- Uses `backupctl` as source of truth (no duplicated domain logic).
- Commands invoked with argv arrays (no shell string execution).
- Exit code + stdout + stderr are always visible.

2) UX
- Clear loading/progress state.
- Destructive actions require confirmation and show results.

3) Quality
- Passes lint/format/typecheck.
- Adds/updates tests proportionate to risk.
- Updates docs if behavior changes.

4) Safety
- No secret leakage in logs/telemetry.
- File access remains within allowed boundaries.

## Issue referencing

- If user references GitHub Issue #123:
  - Include "Refs #123" in PR description
  - Include "refs #123" or "fixes #123" in at least one commit footer when appropriate
- If request is plain chat text:
  - Summarize request in PR description under "User request"
