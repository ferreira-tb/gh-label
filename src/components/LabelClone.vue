<script setup lang="ts">
import { type CSSProperties, computed, ref } from 'vue';
import { useStore } from '../store';
import { parseRepositoryName } from '../utils';

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
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
  <m-dialog
    v-model:visible="visible"
    header="Target"
    :header-style="headerStyle"
    storage-key="label-clone"
    storage-type="local"
    @hide="cleanup"
  >
    <div class="clone">
      <div class="input-group">
        <label>
          <span>Owner</span>
          <m-input-text v-model:value="targetOwner" />
        </label>
        <label>
          <span>Repository</span>
          <m-input-text v-model:value="targetRepository" />
        </label>
      </div>
      <div>
        <m-button @click="visible = false">
          <span>Cancel</span>
        </m-button>
        <m-button :disabled="!ok" @click="clone">
          <span>Clone</span>
        </m-button>
      </div>
    </div>
  </m-dialog>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.clone {
  @include flex.center;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  padding-top: 0;
}

.input-group {
  @include flex.center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

div:has(button) {
  @include flex.center;
  gap: 0.5rem;
  width: 100%;
}
</style>
