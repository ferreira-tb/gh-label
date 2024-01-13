import { Command } from '$lib/enum';
import { invoke } from '@tauri-apps/api';
import { error, labels, loading } from '$lib/stores';

export async function listLabels(targetRepo: string | null) {
  try {
    loading.set(true);
    error.set(null);
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
    if (err instanceof Error) {
      error.set(err.message);
      labels.set([]);
    }
  } finally {
    loading.set(false);
  }
}

export async function deleteLabel(label: GhLabel) {
  if (!label.source) return;

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
}
