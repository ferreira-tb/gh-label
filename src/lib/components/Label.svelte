<script lang="ts">
export let label: RepositoryLabel;

$: hex = label.color;
$: rgb = hexToRgb(hex);
$: hsl = rgbToHsl(rgb);

function hexToRgb(hex: string): RgbColor {
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

function rgbToHsl(rgb: RgbColor): HslColor {
  const { r, g, b } = Object.entries(rgb).reduce(
    (acc, [k, v]: [keyof RgbColor, number]) => {
      acc[k] = v / 255;
      return acc;
    },
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
  } else {
    return (max - min) / (2 - max - min);
  }
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

  hue = hue * 60;
  if (hue < 0) hue += 360;

  return hue;
}
</script>

<div
  class="label label-color"
  style:--label-r={Math.round(rgb.r)}
  style:--label-g={Math.round(rgb.g)}
  style:--label-b={Math.round(rgb.b)}
  style:--label-h={Math.round(hsl.h)}
  style:--label-s={Math.round(hsl.s * 100)}
  style:--label-l={Math.round(hsl.l * 100)}
>
  <span>{label.name}</span>
</div>

<style>
.label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 2em;
  padding: 0 10px;
  white-space: nowrap;
}

.label-color {
  --lightness-threshold: 0.6;
  --background-alpha: 0.18;
  --border-alpha: 0.3;

  /* prettier-ignore */
  --perceived-lightness: calc(((var(--label-r) * 0.2126) + (var(--label-g) * 0.7152) + (var(--label-b) * 0.0722)) / 255);

  /* prettier-ignore */
  --lightness-switch: max(0, min(calc((1 / (var(--lightness-threshold) - var(--perceived-lightness)))), 1));

  /* prettier-ignore */
  --lighten-by: calc(((var(--lightness-threshold) - var(--perceived-lightness)) * 100) * var(--lightness-switch));

  /* prettier-ignore */
  border-color: hsl(var(--label-h) calc(var(--label-s) * 1%) calc((var(--label-l) + var(--lighten-by)) * 1%) / var(--border-alpha));

  /* prettier-ignore */
  background: rgb(var(--label-r) var(--label-g) var(--label-b) / var(--background-alpha));

  /* prettier-ignore */
  color: hsl(var(--label-h) calc(var(--label-s) * 1%) calc((var(--label-l) + var(--lighten-by)) * 1%));
}
</style>
