import { writable } from 'svelte/store';
import { StorageKey } from './enum';

export const owner = writable(localStorage.getItem(StorageKey.Owner) ?? '');
export const repo = writable(localStorage.getItem(StorageKey.Repository) ?? '');
export const labels = writable<RepositoryLabel[]>([]);
