import { invoke } from "@tauri-apps/api/core";
import type { OnlineStatus } from "../types/backupctl";

export async function checkOnline(): Promise<OnlineStatus> {
  return invoke<OnlineStatus>("check_online");
}
