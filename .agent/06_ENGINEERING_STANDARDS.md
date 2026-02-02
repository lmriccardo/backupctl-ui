# 06 — Engineering standards

## Code quality

- Prefer small modules with single responsibility.
- UI parsing is allowed ONLY for display (grouping, highlighting), not decision making.
- All command runs must be cancellable in UI (best effort).

## Error handling

Standardize a single error object:
- kind: "cli" | "io" | "net" | "ui"
- message: string
- detail?: string
- exitCode?: number
- stdout?: string
- stderr?: string

## Logging

- Store no secrets.
- Persist last N command runs (N=50) locally for debugging.
- Provide “Export diagnostics” button (redact sensitive fields).
