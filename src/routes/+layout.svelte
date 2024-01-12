<script>
import '../app.css';
import { page } from '$app/stores';
import Input from '$lib/components/Input.svelte';

$: command = $page.url.pathname.split('/')[1];
</script>

<main class="fixed inset-0 flex flex-col items-center justify-start">
  <h1 id="home-title">
    <a href="/">gh label {command}</a>
  </h1>

  <div>
    <Input />
  </div>

  <slot />
</main>

<style>
#home-title:hover {
  transition: color 0.3s ease-in-out;
  color: var(--color-primary);
}
</style>
