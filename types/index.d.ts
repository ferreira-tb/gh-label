interface GitHubLabel {
  color: string;
  description: string;
  name: string;
  repository?: string | null;
}

type EditorMode = 'edit' | 'create';

interface HexColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}
