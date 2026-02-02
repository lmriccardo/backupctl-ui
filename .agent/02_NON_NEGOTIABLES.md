# 02 — Non-negotiables

## MUSTS

1) No backend logic in UI
- The CLI is source of truth for:
  - validation
  - registry consistency
  - enable/disable state
  - schedule correctness
  - job definitions
- UI may do *presentation parsing* (formatting), but must not “decide” outcomes.

2) Internet connection is needed
- At minimum: checking connectivity to remote host(s).
- UX must clearly show online/offline state and what features degrade.

3) backupctl is local and in-repo
- Use `./backupctl` (symlinked folder) as the invoked backend.
- Do not assume a globally installed binary.

## STRONGLY RECOMMENDED (missing requirements worth adopting)

4) Single source of “paths”
- The app must treat these as canonical user-home relative paths:
  - crontab (actual cronjobs)
  - ~/.backups/plans/
  - ~/.backups/log/<target_name>/
  - ~/.backups/REGISTER

5) Safety rails on destructive operations
- `remove`, `disable`, and any “apply-fix” must require:
  - explicit confirmation
  - clear summary of targets
  - result screen showing CLI output

6) No silent failure
- Always surface:
  - exit code
  - stdout/stderr
  - full invoked command (without secrets)

7) Cross-platform posture (even if Linux-first)
- Avoid hardcoding paths outside those defined above unless the CLI provides them.
