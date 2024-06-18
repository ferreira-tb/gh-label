<script setup lang="ts">
import { useStore } from '@/stores';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/components/ui/button';
import { Command, showWindow } from '@/lib/utils';
import LabelGrid from '@/components/LabelGrid.vue';
import { confirm } from '@tauri-apps/plugin-dialog';
import LabelClone from '@/components/LabelClone.vue';
import LabelEditor from '@/components/LabelEditor.vue';

const store = useStore();
const { state: authenticated, isLoading: isCheckingAuth } = useAsyncState(isAuthenticated, false);

const editorRef = shallowRef<ComponentInstance<typeof LabelEditor> | null>(null);
const cloneRef = shallowRef<ComponentInstance<typeof LabelClone> | null>(null);

async function isAuthenticated() {
  try {
    const result = await invoke(Command.IsLoggedIn);
    if (typeof result === 'boolean') return result;
    throw result;
  } catch (err) {
    if (err instanceof Error) store.error = err;
    return false;
  }
}

async function list(target: Nullish<string>) {
  try {
    store.labels = [];
    await prepare(target);

    const labels = await invoke<GitHubLabel[]>(Command.List, { target });
    if (Array.isArray(labels)) {
      store.labels = labels.map((label) => ({ ...label, repository: target }));
    }
  } catch (err) {
    handleError(err);
  } finally {
    store.loading = false;
  }
}

async function create(label: GitHubLabel) {
  try {
    await prepare(label.repository);
    await invoke(Command.Create, { target: label.repository, label });

    if (store.labels.every(isFromSameRepository)) {
      store.labels = [...store.labels, label];
    }
  } catch (err) {
    handleError(err);
  } finally {
    store.loading = false;
  }
}

async function edit(originalName: string, label: GitHubLabel) {
  try {
    await prepare(label.repository);
    await invoke(Command.Edit, {
      target: label.repository,
      label,
      originalName
    });

    if (store.labels.every(isFromSameRepository)) {
      store.labels = store.labels.map((l) => (l.name === originalName ? label : l));
    }
  } catch (err) {
    handleError(err);
  } finally {
    store.loading = false;
  }
}

async function remove(label: GitHubLabel) {
  try {
    const ok = await confirm('Are you sure you want to delete this label?', {
      title: 'Delete label',
      kind: 'warning'
    });

    if (ok) {
      await prepare(label.repository);
      await invoke(Command.Delete, {
        target: label.repository,
        label: label.name
      });

      store.labels = store.labels.filter((l) => {
        if (l.repository === label.repository) return l.name !== label.name;
        return true;
      });
    }
  } catch (err) {
    handleError(err);
  } finally {
    store.loading = false;
  }
}

async function clone(to: string) {
  try {
    const ok = await confirm(
      'Labels may be overwritten if they have the same name. Are you sure you want to continue?',
      {
        title: 'Clone labels',
        kind: 'warning'
      }
    );

    if (ok) {
      const from = store.currentRepository;
      await prepare(from, to);
      await invoke(Command.Clone, { from, to });
    }
  } catch (err) {
    handleError(err);
  } finally {
    store.loading = false;
  }
}

async function prepare(...repos: Nullish<string>[]) {
  await nextTick();
  store.error = null;
  store.loading = true;

  for (const repo of repos) {
    if (!repo) throw new Error(`invalid repository: ${repo}`);
  }
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    store.error = err;
  }
}

function isFromSameRepository(label: GitHubLabel) {
  if (!store.currentRepository) return false;
  return label.repository === store.currentRepository;
}

useEventListener('contextmenu', (e) => {
  e.preventDefault();
});

onMounted(async () => {
  try {
    if (store.currentRepository) {
      await list(store.currentRepository);
    }

    await flushPromises();
  } catch (err) {
    handleError(err);
  } finally {
    await showWindow();
  }
});
</script>

<template>
  <MScaffold v-if="authenticated && !isCheckingAuth">
    <template #top>
      <MToolbar :border="false">
        <template #center>
          <div class="toolbar">
            <div>
              <label>
                <span>Owner</span>
                <MInputText v-model="store.owner" />
              </label>
              <label>
                <span>Repository</span>
                <MInputText v-model="store.repository" />
              </label>

              <div class="actions">
                <Button
                  variant="outline"
                  :disabled="!store.ready"
                  @click="list(store.currentRepository)"
                >
                  <span>Fetch</span>
                </Button>
                <Button
                  variant="outline"
                  :disabled="!store.ready"
                  @click="editorRef?.show('create')"
                >
                  <span>Create</span>
                </Button>
                <Button
                  variant="outline"
                  :disabled="!store.ready || store.labels.length === 0"
                  @click="cloneRef?.show()"
                >
                  <span>Clone</span>
                </Button>
              </div>
            </div>
            <div v-if="store.error" class="error">
              <span>{{ store.error.message }}</span>
            </div>
          </div>
        </template>
      </MToolbar>
    </template>
    <template #default>
      <LabelGrid @delete="remove" @edit="(label) => editorRef?.show('edit', label)" />

      <LabelEditor ref="editorRef" @edit="edit" @create="create" />
      <LabelClone ref="cloneRef" @clone="clone" />
    </template>
  </MScaffold>

  <ILoading v-else-if="isCheckingAuth" class="loading" />

  <div v-else>
    <div class="unauthenticated">You are not authenticated. Please login first.</div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/style/mixins/flex';
@use '@manatsu/style/mixins/util';

.toolbar {
  @include flex.x-center;
  flex-direction: column;
  gap: 1rem;
}

.toolbar > div:first-of-type {
  @include flex.x-center-y-end;
  gap: 1rem;
}

.actions {
  @include flex.x-center-y-end;
  gap: 0.5rem;
  height: 100%;
}

.loading,
.unauthenticated {
  @include util.translate-abs-center;
}
</style>
