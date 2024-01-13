// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use miho::gh;
use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
enum Error {
  #[error("GitHub CLI error: {0}")]
  Cli(String),
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error(transparent)]
  Utf8(#[from] std::string::FromUtf8Error),
  #[error(transparent)]
  Json(#[from] serde_json::Error),
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
struct RepositoryLabel {
  color: String,
  description: String,
  name: String,
}

#[tauri::command]
fn list_labels(repo: String) -> Result<Vec<RepositoryLabel>, Error> {
  let fields = "name,description,color";
  let output = gh!(["label", "list", "--repo", &repo, "--json", fields, "--limit", "100"])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  let stdout = String::from_utf8(output.stdout)?;
  let labels: Vec<RepositoryLabel> = serde_json::from_str(&stdout)?;
  Ok(labels)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![list_labels])
    .run(tauri::generate_context!())
    .expect("error while running gh-label");
}
