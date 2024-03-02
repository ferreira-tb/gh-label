import { invoke } from '@tauri-apps/api';
import { Command } from '@manatsu/tauri-plugin';
import type { Nullish } from '@tb-dev/utility-types';

export * from './enum';

export async function createEmptyLabel(): Promise<GitHubLabel> {
  let color = await invoke<string>(Command.RandomHexColor);
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
