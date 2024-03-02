<script setup lang="ts">
import { invoke } from '@tauri-apps/api';
import { useAsyncState } from '@vueuse/core';
import { confirm } from '@tauri-apps/api/dialog';
import type { Nullish } from '@tb-dev/utility-types';
import { nextTick, onMounted, shallowRef } from 'vue';
import { MButton, MInput, MScaffold, MTopAppbar } from 'manatsu';
import { Command } from './utils';
import { useStore } from './store';
import LabelGrid from './components/LabelGrid.vue';
import Loading from './components/icons/Loading.vue';
import LabelEditor from './components/LabelEditor.vue';

const store = useStore();
const { state: authenticated, isLoading: isCheckingAuth } = useAsyncState(isAuthenticated, false);

const editor = shallowRef<InstanceType<typeof LabelEditor> | null>(null);

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
      store.labels.push(label);
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
      repo: label.repository,
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
    await prepare(label.repository);

    const ok = await confirm('Are you sure you want to delete this label?', {
      title: 'Delete label',
      type: 'warning'
    });

    if (ok) {
      await invoke(Command.Delete, {
        repo: label.repository,
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

async function clone(source: string, target: string) {
  try {
    await prepare(source, target);

    const ok = await confirm(
      'Labels may be overwritten if they have the same name. Are you sure you want to continue?',
      {
        title: 'Clone labels',
        type: 'warning'
      }
    );

    if (ok) {
      await invoke(Command.Clone, { source, target });
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
    store.labels = [];
  }
}

function isFromSameRepository(label: GitHubLabel) {
  if (!store.currentRepository) return false;
  return label.repository === store.currentRepository;
}

onMounted(async () => {
  if (store.currentRepository) {
    await list(store.currentRepository);
  }
});
</script>

<template>
  <MScaffold v-if="authenticated && !isCheckingAuth">
    <template #top-bar>
      <MTopAppbar>
        <template #content>
          <div class="toolbar">
            <div>
              <FloatLabel>
                <MInput id="owner" v-model="store.owner" />
                <label for="owner">Owner</label>
              </FloatLabel>
              <FloatLabel>
                <MInput id="repository" v-model="store.repository" />
                <label for="repository">Repository</label>
              </FloatLabel>

              <div class="actions">
                <MButton outlined :disabled="!store.ready" @click="list(store.currentRepository)">
                  <span>Fetch</span>
                </MButton>
                <MButton outlined :disabled="!store.ready" @click="editor?.show('create')">
                  <span>Create</span>
                </MButton>
                <MButton outlined :disabled="!store.ready || store.labels.length === 0">
                  <span>Clone</span>
                </MButton>
              </div>
            </div>
          </div>
        </template>
      </MTopAppbar>
    </template>
    <template #default>
      <LabelGrid />

      <LabelEditor ref="editor" @edit="edit" @create="create" />
    </template>
  </MScaffold>
  <div v-else-if="isCheckingAuth" class="auth-check">
    <Loading />
  </div>
  <div v-else>
    <div class="unauthenticated">You are not authenticated. Please login first.</div>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/sass/flex';
@use '@manatsu/sass/util';

.toolbar {
  @include flex.center;
  flex-direction: column;
  margin: 1rem;

  & > div:first-child {
    @include flex.center;
    gap: 1rem;
  }

  & .actions {
    @include flex.x-center-y-end;
    gap: 0.5rem;
    height: 100%;
  }
}

.auth-check,
.unauthenticated {
  @include util.translate-abs-center;
}
</style>
