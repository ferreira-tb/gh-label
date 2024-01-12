import { writable } from 'svelte/store';

export const owner = writable(localStorage.getItem('gh-label:owner') ?? '');
export const repo = writable(localStorage.getItem('gh-label:repo') ?? '');

owner.subscribe((value) => {
  localStorage.setItem('gh-label:owner', value);
});

repo.subscribe((value) => {
  localStorage.setItem('gh-label:repo', value);
});
