use std::process::{Command, Output, Stdio};

#[cfg(windows)]
pub fn gh(args: Vec<&str>) -> std::io::Result<Output> {
  use std::os::windows::process::CommandExt;

  // https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags#CREATE_NO_WINDOW
  Command::new("gh")
    .creation_flags(0x08000000)
    .args(args)
    .stderr(Stdio::piped())
    .stdout(Stdio::piped())
    .output()
}

#[cfg(not(windows))]
pub fn gh(args: Vec<&str>) -> std::io::Result<Output> {
  Command::new("gh")
    .args(args)
    .stderr(Stdio::piped())
    .stdout(Stdio::piped())
    .output()
}
