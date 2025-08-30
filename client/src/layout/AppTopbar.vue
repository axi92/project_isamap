<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useUserStore } from '@/stores/auth.store'
import AvatarMenuButton from '@/components/AvatarMenuButton.vue';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

const userStore = useUserStore();
onMounted(async () => {
  bindOutsideClickListener();
  await userStore.loadUser();
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
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
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
function toggleDarkMode() {
    document.documentElement.classList.toggle('my-app-dark');
}
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>LiveMap</span>
        </router-link>

        <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button> -->

        <Button class="layout-menu-button" icon="pi pi-bars" aria-label="Expand Sidebar" @click="onMenuToggle()" />
        <Button class="layout-topbar-menu-button" @click="onTopBarMenuButton()" icon="pi pi-ellipsis-v" />

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>-->
            <Button label="Toggle Dark Mode WIP" @click="toggleDarkMode()" />
            <div v-if="userStore.user">
              <!-- <Button variant="outlined" class="!border-1">
                <Avatar :image="avatarUrl" class="mr-2" size="large" shape="circle" />
                {{ userStore.user.username }}
              </Button> -->
              <AvatarMenuButton :userId="userStore.user.userId" :avatar="userStore.user.avatar" :username="userStore.user.username"/>
            </div>
            <div v-else>
              <Button as="a" href="http://localhost:3000/api/v1/auth/redirect" label="Login" icon="pi pi-discord" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
