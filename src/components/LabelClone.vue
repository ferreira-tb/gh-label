<script setup lang="ts">
import { useStore } from '@/stores';
import { Button } from './ui/button';
import { parseRepositoryName } from '@/lib/utils';

const emit = defineEmits<{
  (e: 'clone', target: string): void;
}>();

const store = useStore();

const visible = ref(false);
const targetOwner = ref<string | null>(null);
const targetRepository = ref<string | null>(null);
const target = computed(() => parseRepositoryName(targetOwner.value, targetRepository.value));

const ok = computed(() => {
  return Boolean(
    !store.loading &&
      store.currentRepository &&
      target.value &&
      store.currentRepository !== target.value
  );
});

const headerStyle: CSSProperties = {
  justifyContent: 'center',
  paddingBottom: 0
};

function clone() {
  if (target.value) {
    emit('clone', target.value);
    cleanup();
  }
}

function cleanup() {
  visible.value = false;
  targetOwner.value = null;
  targetRepository.value = null;
}

function show() {
  visible.value = true;
}

defineExpose({ show });
</script>

<template>
  <MDialog
    v-model:visible="visible"
    header="Target"
    :header-style
    storage-key="label-clone"
    storage-type="local"
    @hide="cleanup"
  >
    <div class="flex flex-col items-center justify-center gap-4 p-2 pt-0">
      <div class="flex w-full flex-col gap-4">
        <label>
          <span>Owner</span>
          <MInputText v-model="targetOwner" />
        </label>
        <label>
          <span>Repository</span>
          <MInputText v-model="targetRepository" />
        </label>
      </div>
      <div class="flex w-full items-center justify-center gap-2">
        <Button @click="visible = false">
          <span>Cancel</span>
        </Button>
        <Button :disabled="!ok" @click="clone">
          <span>Clone</span>
        </Button>
      </div>
    </div>
  </MDialog>
</template>
