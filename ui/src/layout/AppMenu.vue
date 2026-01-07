<script setup>
import { computed } from 'vue';
import { ref } from 'vue';
import { useUserStore } from '@/_custom/stores/auth.store';
import AppMenuItem from './AppMenuItem.vue';

const userStore = useUserStore();

const model = computed(() => {
  const isLoggedIn = !!userStore.user;

  return [
    {
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          to: '/',
        },
        {
          label: isLoggedIn ? 'Servers' : 'Servers (login required)',
          icon: 'pi pi-fw pi-server',
          to: isLoggedIn ? '/servers' : undefined, // ⛔ disable navigation
          disabled: !isLoggedIn, // 👈 pass state to menu item
        },
      ],
    },
  ];
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      />
      <li v-else class="menu-separator" />
    </template>
  </ul>
</template>

<style scoped>

</style>
