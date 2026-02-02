# 09 — Security & privacy

## Command execution

- Never execute via shell.
- Allowlist executable path:
  - only `./backupctl` (repo symlink) or a user-approved absolute path (if you add that feature)
- Validate argv for unexpected flags if needed (defense in depth).

## Secrets

- Do not log passwords, tokens, private keys, or rsync secrets.
- If CLI output includes secrets, offer a “redact before export” flow.

## Filesystem

- Read-only by default.
- Writes only for:
  - app settings
  - diagnostic export (explicit user action)
