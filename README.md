# gh-label

```bash
cargo install tauri-cli
pnpm install
pnpm run dev
```

## Prerequisites

- [GitHub CLI](https://cli.github.com/)
- [Rust](https://www.rust-lang.org/tools/install)

You must make sure that you have the GitHub CLI installed and authenticated. You can authenticate with the following command:

```bash
gh auth login
```

For more information, see the [GitHub CLI documentation](https://cli.github.com/manual/gh_auth_login).

Rust and [Tauri](https://tauri.app/v1/guides/) are only required before building the application with `pnpm run build`. After that, you can run the application without them.
