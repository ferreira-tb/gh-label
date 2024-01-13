<script lang="ts">
export let disabled = false;
</script>

<button type="button" class="button" {disabled} on:click>
  <slot />
</button>

<style>
button {
  transition:
    border-color 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out,
    color 0.3s ease-in-out;
  cursor: pointer;
  border: 1px solid var(--color-outline);
  border-radius: var(--border-radius);
  background-color: transparent;
  padding: 0.25em 0.75em;
  min-width: 10ch;
  min-height: 32px;
  color: inherit;
  font-size: 1em;
  font-family: inherit;
  text-align: center;
  user-select: none;
}

button:hover {
  box-shadow: var(--box-shadow);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
