<script lang="ts">
import { labels } from '$lib/stores';
import { deleteLabel } from '$lib/label';
import { createEventDispatcher } from 'svelte';
import Label from '$lib/components/Label.svelte';
import Edit from '$lib/icons/Edit.svelte';
import Delete from '$lib/icons/Delete.svelte';

const dispatch = createEventDispatcher<{
  edit: GhLabel;
}>();

function editLabel(label: GhLabel) {
  dispatch('edit', label);
}
</script>

<div id="label-grid">
  {#each $labels as label}
    <div><Label {label} /></div>
    <div>{label.description}</div>
    <div class="action">
      <Edit on:click={() => editLabel(label)} />
      <Delete on:click={() => deleteLabel(label)} />
    </div>
  {/each}
</div>

<style>
#label-grid {
  --grid-margin: 0.5rem;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  cursor: default;
  margin: var(--grid-margin);
  border-spacing: 0.5rem;
  width: calc(100vw - (var(--grid-margin) * 2));
  overflow-x: hidden;
}

.action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding-right: 1rem;
}

.action > :global(svg) {
  cursor: pointer;
  fill: #888888;
}

.action :global(svg:hover) {
  fill: var(--color-primary);
}
</style>
