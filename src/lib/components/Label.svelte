<script lang="ts">
import { hexToRgb, rgbToHsl } from '$lib/utils';

export let label: GhLabel;

$: hex = label.color;
$: rgb = hexToRgb(hex);
$: hsl = rgbToHsl(rgb);
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
