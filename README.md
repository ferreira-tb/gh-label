# gh-label

```bash
cargo install tauri-cli
pnpm install
pnpm run dev
```

## Prerequisites

- [GitHub CLI](https://cli.github.com/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

You must make sure that you have the GitHub CLI installed and authenticated. You can authenticate with the following command:

```bash
gh auth login
```

For more information, see the [GitHub CLI documentation](https://cli.github.com/manual/gh_auth_login).

Rust and [Tauri](https://tauri.app/v1/guides/) are only required before building the app with `pnpm run build`. After that, you can run it without them.
