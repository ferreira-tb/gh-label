<script lang="ts">
import '../app.css';
import { invoke } from '@tauri-apps/api';
import { Command } from '$lib/enum';
import Loading from '$lib/icons/Loading.svelte';
import { error } from '$lib/stores';

async function isLoggedIn() {
  try {
    const result = await invoke(Command.IsLoggedIn);
    if (typeof result === 'boolean') return result;
    throw result;
  } catch (err) {
    if (err instanceof Error) {
      error.set(err.message);
    }

    return false;
  }
}
</script>

<main>
  {#await isLoggedIn()}
    <div id="auth-check">
      <Loading width="2rem" height="2rem" />
    </div>
  {:then loggedIn}
    {#if !loggedIn}
      <div class="error-message">
        You are not logged in. Please login first.
      </div>
    {:else}
      <slot />
    {/if}
  {/await}
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

#auth-check,
.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
