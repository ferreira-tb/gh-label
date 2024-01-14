import { StorageKey } from '$lib/enum';
import { parseRepoName } from '$lib/utils';
import { derived, writable } from 'svelte/store';

export const owner = writable(localStorage.getItem(StorageKey.Owner) ?? '');
export const repoName = writable(
  localStorage.getItem(StorageKey.Repository) ?? ''
);

owner.subscribe((value) => {
  localStorage.setItem(StorageKey.Owner, value.trim());
});

repoName.subscribe((value) => {
  localStorage.setItem(StorageKey.Repository, value.trim());
});

/** This is the repository name in the format of `owner/repo`. */
export const currentRepo = derived([owner, repoName], ([o, r]) => {
  return parseRepoName(o, r);
});

export const labels = writable<GhLabel[]>([]);

labels.subscribe((value) => {
  value.sort((a, b) => a.name.localeCompare(b.name));
});

export const loading = writable(false);
export const error = writable<string | null>(null);
