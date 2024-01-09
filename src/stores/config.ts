import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', () => {
  const owner = ref<string | null>(null);

  return { owner };
});
