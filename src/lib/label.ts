import { get } from 'svelte/store';
import { Command } from '$lib/enum';
import { invoke } from '@tauri-apps/api';
import { confirm } from '@tauri-apps/api/dialog';
import type { Nullish } from '@tb-dev/utility-types';
import { currentRepo, error, labels, loading } from '$lib/stores';

export async function listLabels(repo: string | null) {
  try {
    labels.set([]);
    prepareCommand(repo);

    const result = await invoke<GhLabel[]>(Command.List, { repo });

    if (Array.isArray(result)) {
      labels.set(result.map((item) => ({ ...item, repo })));
    }
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

export async function createLabel(label: GhLabel) {
  try {
    prepareCommand(label.repo);
    await invoke(Command.Create, {
      repo: label.repo,
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
    prepareCommand(label.repo);
    await invoke(Command.Edit, {
      repo: label.repo,
      label,
      originalName
    });

    if (get(labels).some(isFromSameSource)) {
      labels.update((prev) => {
        return prev.map((item) => {
          if (item.repo === label.repo && item.name === originalName) {
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
    prepareCommand(label.repo);

    const confirmed = await confirm(
      'Are you sure you want to delete this label?',
      {
        title: 'Delete label',
        type: 'warning'
      }
    );

    if (!confirmed) return;

    await invoke(Command.Delete, {
      repo: label.repo,
      label: label.name
    });

    labels.update((prev) => {
      return prev.filter((item) => {
        if (item.repo === label.repo) {
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

export async function cloneLabels(source: string, target: string) {
  try {
    prepareCommand(source, target);

    const confirmed = await confirm(
      'Labels may be overwritten if they have the same name. Are you sure you want to continue?',
      {
        title: 'Clone labels',
        type: 'warning'
      }
    );

    if (!confirmed) return;

    await invoke(Command.Clone, { source, target });
  } catch (err) {
    handleError(err);
  } finally {
    loading.set(false);
  }
}

function prepareCommand(...repos: Nullish<string>[]) {
  error.set(null);
  loading.set(true);

  for (const repo of repos) {
    if (!repo) {
      throw new Error(`Invalid repository name: ${repo}`);
    }
  }
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    error.set(err.message);
    labels.set([]);
  }
}

function isFromSameSource(label: GhLabel) {
  const repoName = get(currentRepo);
  if (!repoName) return false;

  return label.repo === repoName;
}
