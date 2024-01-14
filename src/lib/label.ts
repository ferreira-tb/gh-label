import { get } from 'svelte/store';
import { Command } from '$lib/enum';
import { invoke } from '@tauri-apps/api';
import { confirm } from '@tauri-apps/api/dialog';
import { error, labels, loading, target } from '$lib/stores';

export async function listLabels(targetRepo: string | null) {
  try {
    labels.set([]);
    prepareCommand(targetRepo);

    const result = await invoke<GhLabel[]>(Command.List, {
      repo: targetRepo
    });

    if (Array.isArray(result)) {
      labels.set(result.map((item) => ({ ...item, source: targetRepo })));
    }
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export async function createLabel(label: GhLabel) {
  try {
    prepareCommand(label.source);
    await invoke(Command.Create, {
      repo: label.source,
      label
    });

    if (get(labels).some(isFromSameSource)) {
      labels.update((prev) => [...prev, { ...label }]);
    }
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export async function editLabel(originalName: string, label: GhLabel) {
  try {
    prepareCommand(label.source);
    await invoke(Command.Edit, {
      repo: label.source,
      label,
      originalName
    });

    if (get(labels).some(isFromSameSource)) {
      labels.update((prev) => {
        return prev.map((item) => {
          if (item.source === label.source && item.name === originalName) {
            return label;
          }

          return item;
        });
      });
    }
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export async function deleteLabel(label: GhLabel) {
  try {
    prepareCommand(label.source);

    const confirmed = await confirm(
      'Are you sure you want to delete this label?',
      {
        title: 'Delete label',
        type: 'warning'
      }
    );

    if (!confirmed) return;

    await invoke(Command.Delete, {
      repo: label.source,
      label: label.name
    });

    labels.update((prev) => {
      return prev.filter((item) => {
        if (item.source === label.source) {
          return item.name !== label.name;
        }

        return true;
      });
    });
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export function cloneLabels() {
  console.log('clone labels');
}

function prepareCommand(targetRepo?: string | null) {
  error.set(null);
  loading.set(true);

  if (!targetRepo) {
    throw new Error('Invalid repository name');
  }
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    error.set(err.message);
    labels.set([]);
  }
}

function isFromSameSource(label: GhLabel) {
  return label.source === get(target);
}
