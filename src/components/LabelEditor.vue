<script setup lang="ts">
import { useStore } from '@/stores';
import { Button } from './ui/button';
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
    <div v-if="label" class="flex flex-col items-center justify-center gap-4 p-2">
      <LabelChip v-if="label.name.length > 0" :label />

      <div class="flex w-full flex-col gap-4">
        <label>
          <span>Name</span>
          <MInputText v-model="label.name" />
        </label>
        <label>
          <span>Description</span>
          <MInputText v-model="label.description" />
        </label>
      </div>

      <div class="flex items-center justify-center gap-2">
        <input
          v-model="colorPickerValue"
          type="color"
          class="cursor-pointer border-none bg-transparent p-0"
        />
        <ISync @click="randomColor" />
      </div>

      <div class="flex w-full items-center justify-center gap-2">
        <Button @click="visible = false">
          <span>Cancel</span>
        </Button>
        <Button :disabled="!ok" @click="save">
          <span>Save</span>
        </Button>
      </div>
    </div>
  </MDialog>
</template>
