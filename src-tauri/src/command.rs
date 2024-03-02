use crate::error::Error;
use crate::Result;
use std::process::Output;

pub struct Command<'a> {
  command: tokio::process::Command,
  args: Vec<&'a str>,
}

impl<'a> Command<'a> {
  pub fn new(command: &'a str) -> Self {
    let mut cmd = tokio::process::Command::new("gh");
    cmd.arg(command);

    // https://learn.microsoft.com/en-us/windows/win32/procthread/process-creation-flags#CREATE_NO_WINDOW
    if cfg!(windows) {
      cmd.creation_flags(0x08000000);
    }

    Self {
      command: cmd,
      args: Vec::default(),
    }
  }

  pub async fn output(&mut self) -> Result<Output> {
    let output = self.command.args(&self.args).output().await?;

    if !output.status.success() {
      let stderr = String::from_utf8_lossy(&output.stderr).into_owned();
      return Err(Error::Cli(stderr));
    }

    Ok(output)
  }

  pub fn arg(&mut self, arg: &'a str) -> &mut Self {
    self.args.push(arg);
    self
  }

  pub fn color(&mut self, color: &'a str) -> &mut Self {
    self.args.push("--color");
    self.args.push(color);
    self
  }

  pub fn description(&mut self, description: &'a str) -> &mut Self {
    self.args.push("--description");
    self.args.push(description);
    self
  }

  pub fn force(&mut self) -> &mut Self {
    self.args.push("--force");
    self
  }

  pub fn json(&mut self, fields: &'a str) -> &mut Self {
    self.args.push("--json");
    self.args.push(fields);
    self
  }

  pub fn limit(&mut self, limit: &'a str) -> &mut Self {
    self.args.push("--limit");
    self.args.push(limit);
    self
  }

  pub fn name(&mut self, name: &'a str) -> &mut Self {
    self.args.push("--name");
    self.args.push(name);
    self
  }

  pub fn repo(&mut self, repo: &'a str) -> &mut Self {
    self.args.push("--repo");
    self.args.push(repo);
    self
  }

  pub fn yes(&mut self) -> &mut Self {
    self.args.push("--yes");
    self
  }
}
