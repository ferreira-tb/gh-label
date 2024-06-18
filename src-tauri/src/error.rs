use serde::ser::Serializer;
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum Error {
  #[error("GitHub CLI error: {0}")]
  Cli(String),
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error(transparent)]
  Manatsu(#[from] tauri_plugin_manatsu::Error),
  #[error(transparent)]
  Utf8(#[from] std::string::FromUtf8Error),
  #[error(transparent)]
  Json(#[from] serde_json::Error),
  #[error(transparent)]
  Tauri(#[from] tauri::Error),
  #[error(transparent)]
  Unknown(#[from] anyhow::Error),
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}
