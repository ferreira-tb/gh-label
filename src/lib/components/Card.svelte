<script lang="ts">
export let title: string;
export let description: string;
</script>

<div
  class="card"
  role="button"
  tabindex="0"
  on:click
  on:keydown|preventDefault={(e) => {
    if (e.key === 'Enter') e.currentTarget.click();
  }}
>
  <div class="card-title">{title}</div>
  <div class="card-description">{description}</div>
</div>

<style>
.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-0.25rem);
  transition: transform 0.2s ease-in-out;
}

.card-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
}

.card-description {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
