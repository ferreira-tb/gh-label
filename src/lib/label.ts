import { Command } from '$lib/enum';
import { invoke } from '@tauri-apps/api';
import { confirm } from '@tauri-apps/api/dialog';
import { error, labels, loading } from '$lib/stores';

export async function listLabels(targetRepo: string | null) {
  try {
    error.set(null);
    loading.set(true);
    labels.set([]);

    if (!targetRepo) {
      throw new Error('Invalid repository name');
    }

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
    error.set(null);
    loading.set(true);

    if (!label.source) {
      throw new Error('Invalid repository name');
    }

    await invoke(Command.Create, {
      repo: label.source,
      label
    });
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export function editLabel(label: GhLabel) {
  console.log(label);
}

export async function deleteLabel(label: GhLabel) {
  try {
    if (!label.source) return;

    const confirmed = await confirm(
      'Are you sure you want to delete this label?',
      {
        title: 'Delete label',
        type: 'warning'
      }
    );

    if (!confirmed) return;

    error.set(null);
    loading.set(true);

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

function handleError(err: unknown) {
  if (err instanceof Error) {
    error.set(err.message);
    labels.set([]);
  }
}
