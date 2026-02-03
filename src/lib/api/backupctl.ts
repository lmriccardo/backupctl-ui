import { invoke } from "@tauri-apps/api/core";
import type { CommandResult } from "../types/backupctl";

export async function invokeBackupctl(args: string[]): Promise<CommandResult> {
  return invoke<CommandResult>("invoke_backupctl", { args });
}
