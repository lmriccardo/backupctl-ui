use serde::Serialize;
use std::process::{Command, Stdio};
use std::time::SystemTime;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandResult {
    pub exit_code: i32,
    pub stdout: String,
    pub stderr: String,
    pub started_at: String,
    pub ended_at: String,
}

fn timestamp() -> String {
    let now = SystemTime::now();
    match now.duration_since(SystemTime::UNIX_EPOCH) {
        Ok(d) => d.as_secs().to_string(),
        Err(_) => "0".to_string(),
    }
}

#[tauri::command]
pub fn invoke_backupctl(args: Vec<String>) -> Result<CommandResult, String> {
    let started_at = timestamp();

    let output = Command::new("./backupctl")
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("failed to execute backupctl: {e}"))?;

    let ended_at = timestamp();
    let exit_code = output.status.code().unwrap_or(-1);
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    Ok(CommandResult {
        exit_code,
        stdout,
        stderr,
        started_at,
        ended_at,
    })
}
