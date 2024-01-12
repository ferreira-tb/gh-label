<script>
import '../app.css';
import Input from '$lib/components/Input.svelte';
</script>

<main>
  <h1>
    <a href="/">gh label</a>
  </h1>

  <div>
    <Input />
  </div>

  <slot />
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

h1:hover {
  transition: color 0.3s ease-in-out;
  color: var(--color-primary);
}
</style>
