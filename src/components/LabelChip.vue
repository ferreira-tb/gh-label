<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { Command, type HexColor, type HslColor, type RgbColor } from '@manatsu/tauri-plugin';

const props = defineProps<{
  label: GitHubLabel;
}>();

const hex = computedAsync(async () => {
  try {
    const color = props.label.color;
    return await invoke<HexColor>(Command.StringToHex, { color });
  } catch {
    return null;
  }
}, null);

const rgb = computedAsync(async () => {
  try {
    if (!hex.value) return null;
    return await invoke<RgbColor>(Command.HexToRgb, { hex: hex.value });
  } catch {
    return null;
  }
}, null);

const hsl = computedAsync(async () => {
  try {
    if (!rgb.value) return null;
    return await invoke<HslColor>(Command.RgbToHsl, { rgb: rgb.value });
  } catch {
    return null;
  }
}, null);

const labelR = computed(() => Math.round(rgb.value?.r ?? 0));
const labelG = computed(() => Math.round(rgb.value?.g ?? 0));
const labelB = computed(() => Math.round(rgb.value?.b ?? 0));

const labelH = computed(() => Math.round(hsl.value?.h ?? 0));
const labelS = computed(() => Math.round((hsl.value?.s ?? 0) * 100));
const labelL = computed(() => Math.round((hsl.value?.l ?? 0) * 100));
</script>

<template>
  <div class="label label-color">
    <span>{{ label.name }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@manatsu/style/mixins/flex';

.label {
  @include flex.center($inline: true);
  border: 1px solid transparent;
  border-radius: 2em;
  padding: 0 10px;
  white-space: nowrap;
}

.label-color {
  --lightness-threshold: 0.6;
  --background-alpha: 0.18;
  --border-alpha: 0.3;

  --label-r: v-bind('labelR');
  --label-g: v-bind('labelG');
  --label-b: v-bind('labelB');

  --label-h: v-bind('labelH');
  --label-s: v-bind('labelS');
  --label-l: v-bind('labelL');

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
