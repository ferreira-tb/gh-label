import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { Key, parseRepositoryName } from '@/lib/utils';

export const useStore = defineStore('gh-label-store', () => {
  const owner = useLocalStorage(Key.Owner, 'ferreira-tb');
  const repository = useLocalStorage(Key.Repository, 'ferreira-tb');
  const currentRepository = computed(() => parseRepositoryName(owner.value, repository.value));

  const labels = ref<GitHubLabel[]>([]);
  watch(labels, (value) => {
    value.sort((a, b) => a.name.localeCompare(b.name));
  });

  const loading = ref(false);
  const error = ref<Error | null>(null);
  const ready = computed(() => !loading.value && currentRepository.value);

  return {
    owner,
    repository,
    currentRepository,
    labels,
    loading,
    error,
    ready
  };
});
