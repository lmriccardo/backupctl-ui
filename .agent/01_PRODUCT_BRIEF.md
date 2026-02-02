# 01 — Product brief

## What is this app?

A desktop UI that orchestrates the `backupctl` CLI tool:
- Create/register backup plans
- Validate configurations
- View status/health
- List/inspect jobs
- Enable/disable/remove jobs
- Run jobs (optionally notify, log, dry-run)

## What it is NOT

- Not a reimplementation of backup scheduling, parsing, validation, or rsync logic.
- Not an alternative backend.
- Not a cloud service.

## Key UX pillars

- “One-click correctness”: The UI should guide users to run the correct CLI commands.
- “Explain errors”: surface stderr/stdout, exit codes, and actionable hints.
- “Safe by default”: no destructive actions without confirmation and preview.
