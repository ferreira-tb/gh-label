interface GitHubLabel {
  color: string;
  description: string;
  name: string;
  repository?: string | null;
}

type EditorMode = 'edit' | 'create';
