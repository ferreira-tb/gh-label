<script setup lang="ts">
import { useStore } from '@/stores';
import ISync from './icons/ISync.vue';
import { invoke } from '@tauri-apps/api/core';
import { createEmptyLabel } from '@/lib/utils';
import { Command } from '@manatsu/tauri-plugin';

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

const headerStyle: CSSProperties = {
  justifyContent: 'center',
  paddingBottom: 0
};

async function show(editorMode: 'create'): Promise<void>;
async function show(editorMode: 'edit', ghLabel: GitHubLabel): Promise<void>;
async function show(editorMode: EditorMode, ghLabel?: GitHubLabel) {
  if (editorMode === 'edit' && ghLabel) {
    label.value = structuredClone(ghLabel);
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
  const color = await invoke<string>(Command.RandomStringHexColor);
  colorPickerValue.value = color;
}

defineExpose({ show });
</script>

<template>
  <MDialog
    v-model:visible="visible"
    modal
    click-outside
    header="Editor"
    :header-style
    storage-key="label-editor"
    storage-type="local"
    @hide="cleanup"
  >
    <div v-if="label" class="editor">
      <LabelChip v-if="label.name.length > 0" :label />

      <div class="input-group">
        <label>
          <span>Name</span>
          <MInputText v-model="label.name" />
        </label>
        <label>
          <span>Description</span>
          <MInputText v-model="label.description" />
        </label>
      </div>

      <div>
        <input v-model="colorPickerValue" type="color" />
        <ISync @click="randomColor" />
      </div>

      <div>
        <MButton @click="visible = false">
          <span>Cancel</span>
        </MButton>
        <MButton :disabled="!ok" @click="save">
          <span>Save</span>
        </MButton>
      </div>
    </div>
  </MDialog>
</template>

<style scoped lang="scss">
@use '@manatsu/style/mixins/flex';

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
