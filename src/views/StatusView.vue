<script setup lang="ts">
import { MButton, useInvoke } from 'manatsu';

const { state: status, execute } = useInvoke<string>('auth_status');
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-8">
    <pre>{{ status }}</pre>
    <MButton @click="execute">Reload</MButton>
  </div>
</template>
