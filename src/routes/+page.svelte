<script lang="ts">
import { goto } from '$app/navigation';
import Card from '$lib/components/Card.svelte';

const commands = [
  {
    title: 'clone',
    description: 'Clone labels from a repository to another'
  },
  {
    title: 'list',
    description: 'Display labels in a GitHub repository'
  }
];
</script>

<div id="command-grid">
  {#each commands as command}
    <Card
      on:click={() => goto(`/${command.title}`)}
      title={command.title}
      description={command.description}
    />
  {/each}
</div>

<style>
#command-grid {
  display: grid;
  grid-template-columns: repeat(2, 300px);
  gap: 1rem;
}
</style>
