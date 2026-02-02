# 05 — App architecture

## High-level idea

React handles UI/state.
Tauri (Rust) handles:
- executing `./backupctl` safely
- filesystem reads (only where needed)
- network connectivity checks

## Suggested directories

src/
  app/            (routing, app shell)
  features/       (jobs, register, run, status)
  components/     (shared UI)
  lib/
    api/          (tauri command wrappers)
    types/        (shared types)
    format/       (display-only formatting helpers)
src-tauri/
  commands/
    backupctl.rs  (invoke wrapper: argv -> {code, out, err})
    net.rs        (connectivity checks)
  security.rs     (allowlist, validation)

## Tauri commands (must-have)

- invoke_backupctl(args: string[]) -> { exitCode, stdout, stderr, startedAt, endedAt }
- check_online() -> { online: boolean, detail?: string }
