<script lang="ts">
import '../app.css';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import Table from '$lib/components/Table.svelte';
import Loading from '$lib/icons/Loading.svelte';
import { onMount } from 'svelte';
import { owner, repo, labels, error, target, loading } from '$lib/stores';
import { listLabels } from '$lib/label';

$: isReady = Boolean($owner && $repo && !$loading);
$: $labels.sort((a, b) => a.name.localeCompare(b.name));

onMount(() => {
  if ($owner && $repo) listLabels($target);
});
</script>

<main>
  <div id="toolbar">
    <div>
      <Input label="Owner" bind:value={$owner} />
      <Input label="Repository" bind:value={$repo} />
      <Button disabled={!isReady} on:click={() => listLabels($target)}>
        <span>Fetch</span>
      </Button>
    </div>
    {#if $error}
      <div id="error-message">{$error}</div>
    {/if}
  </div>

  <div id="loading" class:visible={$loading}>
    <Loading width="2rem" height="2rem" />
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

#loading {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

#loading.visible {
  display: initial;
}

#error-message {
  margin: 1rem;
  color: #ff0000;
  font-weight: bold;
}

#table {
  width: 100vw;
  overflow-x: hidden;
}
</style>
