<script setup lang="ts">
import { shallowRef } from 'vue';
import {
  MBrand,
  MButton,
  MDynamicLink,
  MNavbar,
  MScaffold,
  type SidebarItem
} from 'manatsu';
import GitHubIcon from './components/GitHubIcon.vue';

const navbar = shallowRef<InstanceType<typeof MNavbar> | null>(null);

const sidebarItems: SidebarItem[] = [
  { key: 'label', label: 'Label', to: '/label' }
];
</script>

<template>
  <MScaffold
    :sidebar-items="sidebarItems"
    sidebar-item-class="mr-1 flex w-full"
    :sidebar-item-style="{ width: navbar?.startWidth }"
  >
    <template #header>
      <MNavbar ref="navbar">
        <template #start>
          <MBrand :title-link="{ name: 'home' }">
            <template #logo><GitHubIcon class="mr-1" /></template>
            <template #title>GitHub GUI</template>
          </MBrand>
        </template>

        <template #end>
          <MButton variant="outlined" @click="$router.push({ name: 'status' })">
            <span>Status</span>
          </MButton>
        </template>
      </MNavbar>
    </template>

    <template #sidebar-item="{ label, to }">
      <MDynamicLink :to="to">{{ label }}</MDynamicLink>
    </template>

    <template #default>
      <RouterView #default="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <component :is="Component" />
                <template #fallback>Loading...</template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </template>
  </MScaffold>
</template>
