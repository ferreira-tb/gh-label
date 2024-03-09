import { invoke } from '@tauri-apps/api';
import type { Nullish } from '@tb-dev/utility-types';
import { Command as ManatsuCommand } from '@manatsu/tauri-plugin';

export const enum Key {
  Owner = 'gh-label:owner',
  Repository = 'gh-label:repository'
}

export async function createEmptyLabel(): Promise<GitHubLabel> {
  let color = await invoke<string>(ManatsuCommand.RandomHexColor);
  color = color.replace('#', '');

  return {
    name: 'label',
    description: '',
    color,
    repository: null
  };
}

export function parseRepositoryName(owner: Nullish<string>, name: Nullish<string>) {
  const [o, n] = [owner, name].map((v) => v?.trim());
  return o && n ? `${o}/${n}` : null;
}
