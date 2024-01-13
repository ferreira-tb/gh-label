<script lang="ts">
import '../app.css';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import { invoke } from '@tauri-apps/api';
import { owner, repo, labels } from '$lib/stores';
import { StorageKey } from '$lib/storage';

$: localStorage.setItem(StorageKey.Owner, $owner);
$: localStorage.setItem(StorageKey.Repository, $repo);

let error: string | null = null;
let loading = false;

$: buttonDisabled = !$owner || !$repo || loading;

async function getLabels() {
  try {
    error = null;
    loading = true;

    const target = `${$owner}/${$repo}`;
    const result = await invoke<RepositoryLabel[]>('list_labels', {
      repo: target
    });

    if (Array.isArray(result)) {
      labels.set(result);
    }
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
      labels.set([]);
    }
  } finally {
    loading = false;
  }
}
</script>

<main>
  <header>
    <h1>gh label</h1>
  </header>

  <div id="toolbar">
    <div>
      <Input label="Owner" bind:value={$owner} />
      <Input label="Repository" bind:value={$repo} />
      <Button disabled={buttonDisabled} on:click={getLabels}>Get Labels</Button>
    </div>
    {#if error}
      <div id="error-message">{error}</div>
    {/if}
  </div>
</main>

<style>
main {
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  inset: 0;
}

header {
  user-select: none;
}

h1 {
  margin: 1rem;
  font-size: 2rem;
}

#toolbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#toolbar > div:first-child {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#toolbar > div:first-child > :global(button) {
  align-self: flex-end;
}

#error-message {
  margin: 1rem;
  color: #ff0000;
  font-size: 0.8rem;
}
</style>
