<script lang="ts">
import Button from '$lib/components/Button.svelte';
import Input from '$lib/components/Input.svelte';
import Loading from '$lib/icons/Loading.svelte';
import { loading, currentRepo } from '$lib/stores';
import { parseRepoName } from '$lib/utils';
import { cloneLabels } from '$lib/label';
import { onMount } from 'svelte';

let dialog: HTMLDialogElement | null = null;
let targetOwner: string | null = null;
let targetRepoName: string | null = null;

$: target = parseRepoName(targetOwner, targetRepoName);
$: isReady = Boolean(!$loading && target);

export function open() {
  dialog?.showModal();
}

async function clone() {
  if (!target || !$currentRepo) return;
  if (target === $currentRepo) return;

  await cloneLabels($currentRepo, target);

  cleanup();
  dialog?.close();
}

function cleanup() {
  targetOwner = null;
  targetRepoName = null;
}

onMount(() => {
  dialog?.addEventListener('close', cleanup);
});
</script>

<dialog bind:this={dialog}>
  <form method="dialog">
    <span>Destination</span>
    <div>
      <Input label="Owner" bind:value={targetOwner} />
      <Input label="Repository" bind:value={targetRepoName} />
    </div>

    <div>
      <Button on:click={() => dialog?.close()}>
        <span>Cancel</span>
      </Button>
      <Button disabled={!isReady} on:click={clone}>
        <span>Clone</span>
      </Button>
    </div>
  </form>

  <div class="loading" class:visible={$loading}>
    <Loading width="2rem" height="2rem" />
  </div>
</dialog>

<style>
form > span {
  font-weight: 500;
  font-size: 1.1rem;
}
</style>
