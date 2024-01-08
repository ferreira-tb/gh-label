<script setup lang="ts">
import { MButton } from 'manatsu';
import { useAsyncState } from '@vueuse/core';
import { invoke } from '@tauri-apps/api/tauri';

const { state: status, execute } = useAsyncState(
  () => invoke<string>('auth_status'),
  null
);
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-8">
    <pre>{{ status }}</pre>
    <MButton @click="execute">Reload</MButton>
  </div>
</template>