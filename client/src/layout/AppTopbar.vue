<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';
import { useLayout } from '@/layout/composables/layout';
// import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
// const router = useRouter();

onMounted(async () => {
  bindOutsideClickListener();
  let pb = inject('pocketbase');
  console.log('pockebatse', pb);

  let currentUser = ref();
  currentUser.value = inject('currentUser');
  console.log('currentUser', currentUser.value);
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const logoUrl = computed(() => {
  return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
// const onSettingsClick = () => {
//   topbarMenuActive.value = false;
//   router.push('/documentation');
// };

const loginWithDiscord = async () => {
  const authData = await pb.collection('users').authWithOAuth2({
    provider: 'discord',
    scopes: ['identify', 'email'],
  });
  console.log('authData');
  console.log(authData);
  // console.log('pb');
  // console.log(pb);
  currentUser.value = pb.authStore.record;
  // currentUser.value = authData;
};

const logoutFromDiscord = () => {
  pb.authStore.clear();
  currentUser.value = null;
};

const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector('.layout-topbar-menu');
  const topbarEl = document.querySelector('.layout-topbar-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <span>SAKAI</span>
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <Button v-if="!currentUser" @click="loginWithDiscord" label="Login with Discord" class="w-full p-2 text-l p-button-help">
        <span class="p-button-icon p-button-icon-left pi pi-discord" data-pc-section="icon"></span>
        <span class="p-button-label" data-pc-section="label">Login with Discord</span>
      </Button>
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button> -->
      <div v-if="currentUser" class="flex align-items-center flex-column sm:flex-row">
        <div class="flex align-items-center flex-column sm:flex-row">
          <Chip :label="currentUser?.name" :image="pb.files.getURL(pb.authStore.record, currentUser?.avatar)" class="mr-2 mb-2"></Chip>
        </div>
        <button @click="logoutFromDiscord()" class="p-link layout-topbar-button">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
