mod commands;
mod security;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::backupctl::invoke_backupctl,
            commands::net::check_online
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
