<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/_custom/stores/auth.store';
import { useDebugStore } from '@/_custom/stores/debug.store';
import Menu from 'primevue/menu';

const API_BASE_URL = __API_BASE_URL__;
const commit = __GIT_COMMIT__;

// Props
interface Props {
  userId: string;
  avatar: string;
  username: string;
}

interface MenuRef {
  // eslint-disable-next-line no-unused-vars
  toggle: (event: Event) => void;
}

const propsAvatarMenuButton = defineProps<Props>();

// Stores
const userStore = useUserStore();
const debugStore = useDebugStore();

// Menu ref
const menu = ref<MenuRef | null>(null);

// Avatar URL
const avatarUrl = ref(`https://cdn.discordapp.com/avatars/${propsAvatarMenuButton.userId}/${propsAvatarMenuButton.avatar}.webp?size=64`);

// Toggle menu
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
  console.log(`debug store is now: ${debugStore.get()}`);
};

// Menu items
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Debug',
        icon: 'pi pi-wrench',
        // template handled in #item slot
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          userStore.logout();
          window.location.assign(API_BASE_URL + '/auth/logout');
        },
      },
    ],
  },
]);

// Load debug state from storage on mount
onMounted(() => {
  debugStore.get();
});
</script>

<template>
  <Button type="button" variant="outlined" class="!border-1" aria-haspopup="true" aria-controls="overlay_menu" @click="toggleMenu">
    <Avatar :image="avatarUrl" class="mr-2" size="normal" shape="circle" />
    {{ propsAvatarMenuButton.username }}
  </Button>

  <Menu id="overlay_menu" ref="menu" :model="items" :popup="true">
    <template #item="{ item, props }">
      <!-- Custom template for the debug toggle -->
      <div v-if="item.label === 'Debug'" class="flex items-center justify-between px-3 py-2 w-full" @click.stop>
        <div class="flex items-center gap-2">
          <span :class="item.icon"></span>
          <span>{{ item.label }}</span>
        </div>
        <ToggleSwitch v-model="debugStore.enabled" @change="debugStore.save" />
      </div>

      <!-- Default menu items -->
      <a v-else v-ripple class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
</template>

<style scoped>
/* Optional: adjust switch alignment */
.p-inputswitch {
  vertical-align: middle;
}
</style>
