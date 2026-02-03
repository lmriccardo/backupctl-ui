use serde::Serialize;
use std::net::TcpStream;
use std::time::Duration;

#[derive(Serialize)]
pub struct OnlineStatus {
    pub online: bool,
    pub detail: Option<String>,
}

#[tauri::command]
pub fn check_online() -> OnlineStatus {
    let addr = "8.8.8.8:53";
    match TcpStream::connect_timeout(&addr.parse().unwrap(), Duration::from_secs(2)) {
        Ok(_) => OnlineStatus {
            online: true,
            detail: None,
        },
        Err(err) => OnlineStatus {
            online: false,
            detail: Some(err.to_string()),
        },
    }
}
