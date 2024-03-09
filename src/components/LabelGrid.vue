<script setup lang="ts">
import { toRaw } from 'vue';

defineEmits<{
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  (e: 'delete' | 'edit', label: GitHubLabel): void;
}>();

const store = useStore();
const { labels } = storeToRefs(store);
</script>

<template>
  <div class="label-grid">
    <template v-for="label of labels" :key="label.name">
      <div><label-chip :label /></div>
      <div>{{ label.description }}</div>
      <div class="action">
        <i-edit @click="$emit('edit', toRaw(label))" />
        <i-delete @click="$emit('delete', toRaw(label))" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/style/mixins/flex';

.label-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  cursor: default;
  border-spacing: 0.5rem;
  overflow-x: hidden;
}

.action {
  @include flex.x-end-y-center;
  gap: 0.5rem;
}
</style>
