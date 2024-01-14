interface GhLabel {
  color: string;
  description: string;
  name: string;
  source?: string | null;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
}

type EditorMode = 'edit' | 'create';
