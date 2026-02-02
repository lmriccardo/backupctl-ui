# Playbook: Handle CLI failures

If exitCode != 0:
- show error banner
- show stderr in a visible panel
- provide "copy diagnostics" button
Never swallow stderr.
