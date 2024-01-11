// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use miho::gh;

#[tauri::command]
fn auth_status() -> Result<String, String> {
  let output = gh!("auth", "status");
  match output {
    Ok(out) => Ok(String::from_utf8(out.stdout).unwrap()),
    Err(err) => Err(err.to_string()),
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![auth_status])
    .run(tauri::generate_context!())
    .expect("error while running gh_gui");
}
