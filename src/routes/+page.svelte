<script lang="ts">
import '../app.css';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import Table from '$lib/components/Table.svelte';
import { onMount } from 'svelte';
import { invoke } from '@tauri-apps/api';
import { owner, repo, labels } from '$lib/stores';
import { Command, StorageKey } from '$lib/enum';

$: localStorage.setItem(StorageKey.Owner, $owner);
$: localStorage.setItem(StorageKey.Repository, $repo);

let loading = false;
let error: string | null = null;

$: isReady = Boolean($owner && $repo && !loading);
$: $labels.sort((a, b) => a.name.localeCompare(b.name));

async function getLabels() {
  try {
    error = null;
    loading = true;

    const target = `${$owner}/${$repo}`;
    const result = await invoke<RepositoryLabel[]>(Command.List, {
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

onMount(() => {
  if ($owner && $repo) {
    getLabels();
  }
});
</script>

<main>
  <div id="toolbar">
    <div>
      <Input label="Owner" bind:value={$owner} />
      <Input label="Repository" bind:value={$repo} />
      <Button disabled={!isReady} on:click={getLabels}>Get</Button>
    </div>
    {#if error}
      <div id="error-message">{error}</div>
    {/if}
  </div>

  {#if $labels.length > 0}
    <div id="table">
      <Table />
    </div>
  {/if}
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

#toolbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 1rem;
}

#toolbar > div:first-child {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#toolbar :global(button) {
  align-self: flex-end;
}

#error-message {
  margin: 1rem;
  color: #ff0000;
  font-size: 0.8rem;
}

#table {
  width: 100%;
  overflow-x: hidden;
}
</style>
