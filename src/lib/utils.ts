export function createEmptyLabel(): GhLabel {
  return {
    name: 'label',
    description: '',
    color: generateRandomColor(),
    source: null
  };
}

export function generateRandomColor() {
  let randomColor = '';
  for (let i = 0; i < 6; i++) {
    const num = Math.floor(Math.random() * 16);
    randomColor += num.toString(16);
  }

  return randomColor;
}

export function hexToRgb(hex: string): RgbColor {
  const rgb = [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16)
  ];

  if (rgb.some((v) => Number.isNaN(v))) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

export function rgbToHsl(rgb: RgbColor): HslColor {
  const { r, g, b } = Object.entries(rgb).reduce(
    (acc, [key, value]: [keyof RgbColor, number]) => {
      acc[key] = value / 255;
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as RgbColor
  );

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const hue = calcHue({ r, g, b }, max, min);
  const saturation = calcSaturation(max, min, lightness);

  if (hue < 0) {
    throw new Error(`Invalid hue: ${hue}`);
  }

  return { h: hue, s: saturation, l: lightness };
}

function calcSaturation(max: number, min: number, lightness: number): number {
  if (lightness <= 0.5) {
    return (max - min) / (max + min);
  }

  return (max - min) / (2 - max - min);
}

function calcHue(rgb: RgbColor, max: number, min: number): number {
  const { r, g, b } = rgb;
  let hue: number;

  if (max === r) {
    hue = (g - b) / (max - min);
  } else if (max === g) {
    hue = 2 + (b - r) / (max - min);
  } else {
    hue = 4 + (r - g) / (max - min);
  }

  hue *= 60;
  if (hue < 0) hue += 360;

  return hue;
}
