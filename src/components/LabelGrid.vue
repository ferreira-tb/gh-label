<script setup lang="ts">
import { toRaw } from 'vue';
import { useStore } from '@/stores';
import IEdit from './icons/IEdit.vue';
import LabelChip from './LabelChip.vue';
import IDelete from './icons/IDelete.vue';

defineEmits<{
  (e: 'delete' | 'edit', label: GitHubLabel): void;
}>();

const store = useStore();
const { labels } = storeToRefs(store);
</script>

<template>
  <div class="label-grid">
    <template v-for="label of labels" :key="label.name">
      <div><LabelChip :label /></div>
      <div>{{ label.description }}</div>
      <div class="flex items-center justify-end gap-2">
        <IEdit @click="$emit('edit', toRaw(label))" />
        <IDelete @click="$emit('delete', toRaw(label))" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.label-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  cursor: default;
  border-spacing: 0.5rem;
  overflow-x: hidden;
}
</style>
