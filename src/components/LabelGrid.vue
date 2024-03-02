<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../store';
import Edit from './icons/Edit.vue';
import Delete from './icons/Delete.vue';
import LabelChip from './LabelChip.vue';

const store = useStore();
const { labels } = storeToRefs(store);
</script>

<template>
  <div class="label-grid">
    <template v-for="label of labels" :key="label.name">
      <div><LabelChip :label="label" /></div>
      <div>{{ label.description }}</div>
      <div class="action">
        <Edit />
        <Delete />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.label-grid {
  $grid-margin: 0.5rem;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  cursor: default;
  margin: $grid-margin;
  border-spacing: 0.5rem;
  width: calc(100vw - ($grid-margin * 2));
  overflow-x: hidden;
}

.action {
  @include flex.x-end-y-center;
  gap: 0.5rem;
  padding-right: 1rem;
}

.action > :deep(svg) {
  cursor: pointer;
  fill: #888888;
}

.action :deep(svg:hover) {
  fill: var(--color-primary);
}
</style>
