import { derived, writable } from 'svelte/store';
import { StorageKey } from './enum';

export const owner = writable(localStorage.getItem(StorageKey.Owner) ?? '');
export const repo = writable(localStorage.getItem(StorageKey.Repository) ?? '');

owner.subscribe((value) => {
  localStorage.setItem(StorageKey.Owner, value.trim());
});

repo.subscribe((value) => {
  localStorage.setItem(StorageKey.Repository, value.trim());
});

export const target = derived([owner, repo], ([$owner, $repo]) => {
  const ownerName = $owner.trim();
  const repoName = $repo.trim();

  return ownerName && repoName ? `${ownerName}/${repoName}` : null;
});

export const labels = writable<GhLabel[]>([]);

labels.subscribe((value) => {
  value.sort((a, b) => a.name.localeCompare(b.name));
});

export const loading = writable(false);
export const error = writable<string | null>(null);
