<script lang="ts">
import { onMount, tick } from 'svelte';
import Input from '$lib/components/Input.svelte';
import Button from '$lib/components/Button.svelte';
import Label from '$lib/components/Label.svelte';
import Sync from '$lib/icons/Sync.svelte';
import Loading from '$lib/icons/Loading.svelte';
import { createEmptyLabel, generateRandomColor } from '$lib/utils';
import { editLabel, createLabel } from '$lib/label';
import { loading, target } from '$lib/stores';

let dialog: HTMLDialogElement | null = null;
let label = createEmptyLabel();
let mode: EditorMode = 'create';

$: isReady = Boolean(!$loading && label.name.length > 0);

let colorPickerValue = '#000000';
$: label.color = colorPickerValue.replace('#', '');

export async function open(mode: 'create'): Promise<void>;
export async function open(mode: 'edit', ghLabel: GhLabel): Promise<void>;
export async function open(mode: EditorMode, ghLabel?: GhLabel) {
  if (!dialog) return;

  if (mode === 'edit' && ghLabel) {
    label = ghLabel;
    mode = 'edit';
  } else {
    label = createEmptyLabel();
    mode = 'create';
  }

  await tick();
  colorPickerValue = `#${label.color}`;

  dialog.showModal();
}

async function save() {
  if (!dialog) return;

  if (mode === 'edit') {
    await editLabel(label);
  } else {
    label.source = $target;
    await createLabel(label);
  }

  dialog.close();
}

onMount(() => {
  dialog?.addEventListener('close', () => {
    mode = 'create';
    label = createEmptyLabel();
  });
});
</script>

<dialog bind:this={dialog}>
  <form method="dialog">
    {#if label.name.length > 0}
      <Label {label} />
    {/if}

    <div>
      <Input label="Name" bind:value={label.name} />
      <Input label="Description" bind:value={label.description} />
    </div>

    <div>
      <input type="color" bind:value={colorPickerValue} />
      <Sync
        width="1.5em"
        height="1.5em"
        on:click={() => {
          const randomColor = generateRandomColor();
          label.color = randomColor;
          colorPickerValue = `#${randomColor}`;
        }}
      />
    </div>

    <div>
      <Button buttonType="button" on:click={() => dialog?.close()}>
        <span>Cancel</span>
      </Button>
      <Button buttonType="submit" disabled={!isReady} on:click={() => save()}>
        <span>Save</span>
      </Button>
    </div>
  </form>

  <div class="loading" class:visible={$loading}>
    <Loading width="2rem" height="2rem" />
  </div>
</dialog>

<style>
dialog {
  position: relative;
  min-width: 220px;
}

dialog::backdrop {
  background-color: rgb(0 0 0 / 0.6);
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

div:has(> input[type='text']) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

div:has(> input[type='text']) {
  width: 100%;
}

div:has(> input[type='color']) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

input[type='color'] {
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
}

div:has(> button) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
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
</style>
