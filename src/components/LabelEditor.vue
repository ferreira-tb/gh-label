<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { invoke } from '@tauri-apps/api';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import { Command } from '@manatsu/tauri-plugin';
import { computed, nextTick, ref, watch } from 'vue';
import { useStore } from '../store';
import Sync from './icons/Sync.vue';
import LabelChip from './LabelChip.vue';
import { createEmptyLabel } from '../utils';

const emit = defineEmits<{
  (e: 'create', label: GitHubLabel): void;
  (e: 'edit', originalName: string, label: GitHubLabel): void;
}>();

const store = useStore();

const visible = ref(false);
const mode = ref<EditorMode>('create');
const label = ref<GitHubLabel | null>(null);
const originalName = ref<string | null>(null);
const colorPickerValue = ref('#000000');

const ok = computed(() => {
  return Boolean(!store.loading && label.value && label.value.name.length > 0);
});

watch(colorPickerValue, (value) => {
  if (label.value) {
    label.value.color = value.replace('#', '');
  }
});

async function show(editorMode: 'create'): Promise<void>;
async function show(editorMode: 'edit', ghLabel: GitHubLabel): Promise<void>;
async function show(editorMode: EditorMode, ghLabel?: GitHubLabel) {
  if (editorMode === 'edit' && ghLabel) {
    label.value = { ...ghLabel };
    originalName.value = ghLabel.name;
    mode.value = 'edit';
  } else {
    label.value = await createEmptyLabel();
    originalName.value = null;
    mode.value = 'create';
  }

  await nextTick();
  colorPickerValue.value = `#${label.value.color}`;
  visible.value = true;
}

async function save() {
  if (!label.value) return;
  if (mode.value === 'edit' && originalName.value) {
    emit('edit', originalName.value, label.value);
  } else if (store.currentRepository) {
    label.value.repository = store.currentRepository;
    emit('create', label.value);
  }

  await cleanup();
}

async function cleanup() {
  visible.value = false;
  mode.value = 'create';
  originalName.value = null;
  label.value = await createEmptyLabel();
}

async function randomColor() {
  const color = await invoke<string>(Command.RandomHexColor);
  colorPickerValue.value = color;
}

defineExpose({ show });
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" @hide="cleanup">
    <div v-if="label" class="editor">
      <LabelChip v-if="label.name.length > 0" :label="label" />

      <div class="input-group">
        <FloatLabel>
          <InputText id="label-name" v-model="label.name" />
          <label for="label-name">Name</label>
        </FloatLabel>
        <FloatLabel>
          <InputText id="label-description" v-model="label.description" />
          <label for="label-description">Description</label>
        </FloatLabel>
      </div>

      <div>
        <input v-model="colorPickerValue" type="color" />
        <Sync @click="randomColor" />
      </div>

      <div>
        <Button @click="cleanup">
          <span>Cancel</span>
        </Button>
        <Button :disabled="!ok" @click="save">
          <span>Save</span>
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';

.editor {
  @include flex.center;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
}

.input-group {
  @include flex.center;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

div:has(> input[type='color']) {
  @include flex.center;
  gap: 0.5rem;
}

input[type='color'] {
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
}

div:has(button) {
  @include flex.center;
  gap: 0.5rem;
  width: 100%;
}
</style>
