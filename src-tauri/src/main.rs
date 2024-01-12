// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use miho::gh;

#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error(transparent)]
  Utf8(#[from] std::string::FromUtf8Error),
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

#[tauri::command]
fn list(repo: String) -> Result<String, Error> {
  let fields = "name,description,color";
  let output = gh!(["label", "list", "--repo", &repo, "--json", fields])?;
  let stdout = String::from_utf8(output.stdout)?;
  Ok(stdout)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![list])
    .run(tauri::generate_context!())
    .expect("error while running gh-label");
}
