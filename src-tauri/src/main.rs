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
struct GhLabel {
  color: String,
  description: String,
  name: String,
}

/// https://cli.github.com/manual/gh_auth_status
#[tauri::command]
fn is_logged_in() -> Result<bool, Error> {
  let output = gh!(["auth", "status"])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  let stdout = String::from_utf8(output.stdout)?;
  let stdout = stdout.to_lowercase();
  let is_logged_in = stdout.contains("logged in to github.com");

  Ok(is_logged_in)
}

/// https://cli.github.com/manual/gh_label_list
#[tauri::command]
fn list_labels(repo: String) -> Result<Vec<GhLabel>, Error> {
  let fields = "name,description,color";
  let output = gh!(["label", "list", "--repo", &repo, "--json", fields, "--limit", "500"])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  let stdout = String::from_utf8(output.stdout)?;
  let labels: Vec<GhLabel> = serde_json::from_str(&stdout)?;
  Ok(labels)
}

/// https://cli.github.com/manual/gh_label_create
#[tauri::command]
fn create_label(repo: String, label: GhLabel) -> Result<(), Error> {
  let mut args = vec![
    "label",
    "create",
    &label.name,
    "--repo",
    &repo,
    "--color",
    &label.color,
  ];

  if !label.description.is_empty() {
    args.push("--description");
    args.push(&label.description);
  }

  let output = gh!(args)?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  Ok(())
}

/// https://cli.github.com/manual/gh_label_edit
#[tauri::command]
fn edit_label(repo: String, original_name: String, label: GhLabel) -> Result<(), Error> {
  let output = gh!([
    "label",
    "edit",
    &original_name,
    "--repo",
    &repo,
    "--name",
    &label.name,
    "--color",
    &label.color,
    "--description",
    &label.description
  ])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  Ok(())
}

/// https://cli.github.com/manual/gh_label_delete
#[tauri::command]
fn delete_label(repo: String, label: String) -> Result<(), Error> {
  let output = gh!(["label", "delete", &label, "--yes", "--repo", &repo])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  Ok(())
}

/// https://cli.github.com/manual/gh_label_clone
#[tauri::command]
fn clone_labels(source: String, target: String) -> Result<(), Error> {
  let output = gh!(["label", "clone", &source, "--repo", &target, "--force"])?;

  if !output.status.success() {
    let stderr = String::from_utf8(output.stderr)?;
    return Err(Error::Cli(stderr));
  }

  Ok(())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      is_logged_in,
      list_labels,
      create_label,
      edit_label,
      delete_label,
      clone_labels
    ])
    .run(tauri::generate_context!())
    .expect("error while running gh-label");
}
