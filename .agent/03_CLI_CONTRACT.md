# 03 — CLI contract (source of truth)

## Available commands

backupctl v0.2.0 (not released):

- register <config> [-v]
- validate <config>
- status [--apply-fix]
- list [--registry] [--cron] [--enabled|--disabled]
- remove [--target TARGET...]
- enable [--target TARGET...]
- disable [--target TARGET...]
- run <target> [--notify] [--log] [--dry-run]
- inspect [--target TARGET...]

## Invocation rules (UI -> CLI)

- Use local path `./backupctl` (repo symlink folder) as the backend entry.
- The UI should invoke commands through Tauri backend (Rust) to:
  - avoid shell injection
  - control environment
  - capture stdout/stderr/exit code robustly
  
- Never build shell strings. Always pass argv arrays.

## Output handling

- Treat stdout/stderr as authoritative.
- Do not “infer” job state by heuristics.
- If the UI needs structured data:
  - First choice: display raw output in a rich panel (copyable).
  - Second choice: request/implement a CLI flag upstream (preferred long-term).
  - Third choice: thin adapter that:
    - invokes CLI
    - returns { exitCode, stdout, stderr }
    - and does minimal parsing ONLY for display grouping (not logic).

## Canonical locations (user-home relative)

- crontab (contains actual cronjobs)
- ~/.backups/plans/ (generated JSON configs)
- ~/.backups/log/<target_name>/ (job logs)
- ~/.backups/REGISTER with lines:
  <job-name> <cron-schedule> <command-to-run> <ENABLED/DISABLED>
