# AGENTS — backupctl Desktop UI (Tauri + React)

You are generating a desktop UI application for `backupctl`. Read and follow the agent docs in this exact order:

1) .agent/00_INDEX.md
2) .agent/01_PRODUCT_BRIEF.md
3) .agent/02_NON_NEGOTIABLES.md
4) .agent/03_CLI_CONTRACT.md
5) .agent/04_UX_FLOWS.md
6) .agent/05_APP_ARCHITECTURE.md
7) .agent/06_ENGINEERING_STANDARDS.md
8) .agent/07_WORKFLOW.md
9) .agent/08_TESTING_QA.md
10) .agent/09_SECURITY_PRIVACY.md
11) .agent/10_CHANGELOG_RELEASE.md

## Absolute rules (do not negotiate)

- The UI MUST NOT reimplement backend logic. The `backupctl` CLI is the source of truth.
- `backupctl` is available in-repo at `./backupctl` (symlink). Use it as the backend.
- Prefer thin “invoke + display + minimal parsing for UI” over duplicated decision-making.
- If you need structured data and the CLI does not provide it, do NOT invent heuristics:
  - Either (A) display the raw output faithfully, OR
  - (B) implement a *thin adapter* that still delegates decisions to the CLI.
  
- Modifications requested by the user can reference GitHub Issues (by ID) or plain chat text.
  - Treat Issues as authoritative acceptance criteria.

## Golden goal

A reliable UI that safely wraps `backupctl` workflows with good UX, correct error handling,
and zero duplicated domain logic.

Proceed to: .agent/00_INDEX.md
