<script lang="ts">
import { labels } from '$lib/stores';
import Label from './Label.svelte';
</script>

<table>
  <tbody>
    {#each $labels as label}
      <tr>
        <td><Label {label} /></td>
        <td>{label.description}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
table {
  margin: 0 1rem 1rem;
  width: 100%;
}
</style>