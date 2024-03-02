// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod error;

use command::Command;
use error::Error;
use serde::{Deserialize, Serialize};

type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
struct GitHubLabel {
  color: String,
  description: String,
  name: String,
}

/// https://cli.github.com/manual/gh_auth_status
#[tauri::command]
async fn is_logged_in() -> Result<bool> {
  let output = Command::new("auth").arg("status").output().await?;

  let stdout = String::from_utf8(output.stdout)?.to_lowercase();
  let logged = stdout.contains("logged in to github.com");

  Ok(logged)
}

/// https://cli.github.com/manual/gh_label_list
#[tauri::command]
async fn list_labels(target: String) -> Result<Vec<GitHubLabel>> {
  let output = Command::new("label")
    .arg("list")
    .repo(&target)
    .json("name,description,color")
    .limit("500")
    .output()
    .await?;

  let stdout = String::from_utf8(output.stdout)?;
  let labels: Vec<GitHubLabel> = serde_json::from_str(&stdout)?;
  Ok(labels)
}

/// https://cli.github.com/manual/gh_label_create
#[tauri::command]
async fn create_label(target: String, label: GitHubLabel) -> Result<()> {
  let mut command = Command::new("label");
  command
    .arg("create")
    .arg(&label.name)
    .repo(&target)
    .color(&label.color);

  if !label.description.is_empty() {
    command.description(&label.description);
  }

  command.output().await?;

  Ok(())
}

/// https://cli.github.com/manual/gh_label_edit
#[tauri::command]
async fn edit_label(target: String, original_name: String, label: GitHubLabel) -> Result<()> {
  Command::new("label")
    .arg("edit")
    .arg(&original_name)
    .repo(&target)
    .name(&label.name)
    .color(&label.color)
    .description(&label.description)
    .output()
    .await?;

  Ok(())
}

/// https://cli.github.com/manual/gh_label_delete
#[tauri::command]
async fn delete_label(target: String, label: String) -> Result<()> {
  Command::new("label")
    .arg("delete")
    .arg(&label)
    .repo(&target)
    .yes()
    .output()
    .await?;

  Ok(())
}

/// https://cli.github.com/manual/gh_label_clone
#[tauri::command]
async fn clone_labels(from: String, to: String) -> Result<()> {
  Command::new("repo")
    .arg("clone")
    .arg(&from)
    .repo(&to)
    .force()
    .output()
    .await?;

  Ok(())
}

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_manatsu::init())
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
