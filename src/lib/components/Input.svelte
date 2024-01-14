<script lang="ts">
export let value: string | null = null;
export let label: string | null = null;
export let placeholder: string | null = null;
</script>

<label>
  {#if label}
    <span>{label}</span>
  {/if}
  <input type="text" bind:value {placeholder} on:keydown />
</label>

<style>
label {
  display: flex;
  flex-direction: column;
}

label > span {
  margin-bottom: 0.2em;
  font-size: 0.8em;
  user-select: none;
}

input {
  outline: none;
  border: 1px solid var(--color-outline);
  border-radius: var(--border-radius);
  background-color: transparent;
  padding: 0.4em;
  color: inherit;
  caret-color: var(--color-primary);
  font-family: inherit;
}

input:hover,
input:focus {
  border-color: var(--color-primary);
}

input:focus {
  box-shadow: 0 0 0 1px var(--color-primary);
}
</style>
