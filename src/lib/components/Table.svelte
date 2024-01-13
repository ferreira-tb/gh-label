<script lang="ts">
import { labels } from '$lib/stores';
import { deleteLabel } from '$lib/label';
import Label from './Label.svelte';
import Edit from '$lib/icons/Edit.svelte';
import Delete from '$lib/icons/Delete.svelte';
</script>

<table>
  <tbody>
    {#each $labels as label}
      <tr>
        <td><Label {label} /></td>
        <td>{label.description}</td>
        <td class="action">
          <Edit />
          <Delete on:click={() => deleteLabel(label)} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
table {
  --table-margin: 0.5rem;

  cursor: default;
  margin: 0 var(--table-margin) var(--table-margin);
  border-spacing: 0.5rem;
  width: calc(100% - (var(--table-margin) * 2));
}

.action {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.action > :global(svg) {
  cursor: pointer;
  fill: #888888;
}

.action :global(svg:hover) {
  fill: var(--color-primary);
}
</style>
