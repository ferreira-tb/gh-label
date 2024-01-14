<script lang="ts">
import '../app.css';
import { onMount } from 'svelte';
import { listLabels } from '$lib/label';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import Grid from '$lib/components/Grid.svelte';
import Loading from '$lib/icons/Loading.svelte';
import Editor from '$lib/components/Editor.svelte';
import Clone from '$lib/components/Clone.svelte';
import {
  owner,
  repoName,
  labels,
  error,
  currentRepo,
  loading
} from '$lib/stores';

$: isReady = Boolean($currentRepo && !$loading);

let editor: Editor | null = null;
let cloneDialog: Clone | null = null;

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && isReady) {
    e.preventDefault();
    e.stopPropagation();
    listLabels($currentRepo);
  }
}

onMount(() => {
  if ($currentRepo) listLabels($currentRepo);
});
</script>

<main>
  <div id="toolbar">
    <div>
      <Input label="Owner" bind:value={$owner} on:keydown={onKeydown} />
      <Input label="Repository" bind:value={$repoName} on:keydown={onKeydown} />

      <div class="actions">
        <Button disabled={!isReady} on:click={() => listLabels($currentRepo)}>
          <span>Fetch</span>
        </Button>
        <Button disabled={!isReady} on:click={() => editor?.open('create')}>
          <span>Create</span>
        </Button>
        <Button
          disabled={!isReady || $labels.length === 0}
          on:click={() => cloneDialog?.open()}
        >
          <span>Clone</span>
        </Button>
      </div>
    </div>

    {#if $error}
      <div class="error-message">{$error}</div>
    {/if}
  </div>

  <Editor bind:this={editor} />
  <Clone bind:this={cloneDialog} />

  <div class="loading" class:visible={$loading}>
    <Loading width="2rem" height="2rem" />
  </div>

  {#if $labels.length > 0}
    <Grid on:edit={(e) => editor?.open('edit', e.detail)} />
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
  margin: 1rem;
}

#toolbar > div:first-child {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

#toolbar .actions {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 0.5rem;
  height: 100%;
}

.error-message {
  margin: 1rem;
  color: #ff0000;
  font-weight: bold;
}
</style>
