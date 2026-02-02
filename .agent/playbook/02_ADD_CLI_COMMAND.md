# Playbook: Add a new CLI command to UI

1) Add a Tauri wrapper function that accepts argv array
2) Add a UI hook: useBackupctlCommand(argv) -> {loading, result, error}
3) Add a screen/button that calls the hook
4) Always show stdout/stderr/exitCode
5) Add at least one unit test for UI behavior (mock Tauri)
