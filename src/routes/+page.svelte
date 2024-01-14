<script lang="ts">
import '../app.css';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import Grid from '$lib/components/Grid.svelte';
import Loading from '$lib/icons/Loading.svelte';
import Editor from '$lib/components/Editor.svelte';
import { onMount } from 'svelte';
import { owner, repo, labels, error, target, loading } from '$lib/stores';
import { cloneLabels, listLabels } from '$lib/label';

$: isReady = Boolean($owner && $repo && !$loading);

let editor: Editor | null = null;

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && isReady) {
    e.preventDefault();
    e.stopPropagation();
    listLabels($target);
  }
}

onMount(() => {
  if ($owner && $repo) listLabels($target);
});
</script>

<main>
  <div id="toolbar">
    <div>
      <Input label="Owner" bind:value={$owner} on:keydown={onKeydown} />
      <Input label="Repository" bind:value={$repo} on:keydown={onKeydown} />

      <div class="actions">
        <Button disabled={!isReady} on:click={() => listLabels($target)}>
          <span>Fetch</span>
        </Button>
        <Button disabled={!isReady} on:click={() => editor?.open('create')}>
          <span>Create</span>
        </Button>
        <Button
          disabled={!isReady || $labels.length === 0}
          on:click={() => cloneLabels()}
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

.loading {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.loading.visible {
  display: initial;
}

.error-message {
  margin: 1rem;
  color: #ff0000;
  font-weight: bold;
}
</style>
