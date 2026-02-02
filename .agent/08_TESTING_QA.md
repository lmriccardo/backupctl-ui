# 08 — Testing & QA

## Minimum tests

- Unit tests for:
  - formatting helpers (display-only parsing)
  - tauri invoke wrapper (mocked)
- Integration tests (lightweight):
  - run a harmless command (e.g., list --registry) if available in CI environment
  - otherwise mock responses at the Tauri boundary

## Manual QA checklist

- Validate: shows output + exit code
- Register: validates then registers; handles failures cleanly
- Status: shows apply-fix warning before running
- List: shows registry/cron toggles + enabled/disabled filters
- Run job: shows live output + result
- Offline: app indicates degraded features
