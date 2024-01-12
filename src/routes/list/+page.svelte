<script>
import Button from '$lib/components/Button.svelte';
import { invoke } from '@tauri-apps/api';
import { owner, repo } from '$lib/stores';

function listLabels() {
  invoke('list', { repo: `${$owner}/${$repo}` })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}
</script>

<div>
  <Button on:click={listLabels}>List Labels</Button>
</div>

<style>
/* Add your styles here */
</style>
