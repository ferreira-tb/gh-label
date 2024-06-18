import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { invoke } from '@tauri-apps/api/core';
import type { Nullish } from '@tb-dev/utility-types';
import { Command as ManatsuCommand } from '@manatsu/tauri-plugin';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum Key {
  Owner = 'gh-label:owner',
  Repository = 'gh-label:repository'
}

export enum Command {
  Clone = 'clone_labels',
  Create = 'create_label',
  Delete = 'delete_label',
  Edit = 'edit_label',
  IsLoggedIn = 'is_logged_in',
  List = 'list_labels',
  ShowWindow = 'show_window'
}

export async function showWindow() {
  await invoke(Command.ShowWindow);
}

export async function createEmptyLabel(): Promise<GitHubLabel> {
  let color = await invoke<string>(ManatsuCommand.RandomStringHexColor);
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
