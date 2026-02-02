# 04 — UX flows

## App structure (suggested navigation)

- Dashboard
  - global status
  - quick actions (validate config, run job, list jobs)
  
- Jobs
  - list (registry/cron/enabled/disabled)
  - inspect details
  - enable/disable/remove

- Register plan
  - choose config file
  - run validate
  - run register

- Run job
  - select target
  - options: notify/log/dry-run
  - show progress + output

- Settings
  - path to ./backupctl (auto-detect; show status)
  - network connectivity indicator
  - UI preferences

## Flow rules

- Every command run shows:
  - command summary (argv)
  - live stdout/stderr
  - final exit code
  - “copy output” button

- Any destructive command requires confirm modal:
  - show selected targets
  - show what command will run
