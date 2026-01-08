<script setup>
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import { useUserStore } from '@/_custom/stores/auth.store';
import AvatarMenuButton from '@/_custom/components/AvatarMenuButton.vue';

const API_BASE_URL = __API_BASE_URL__;
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const userStore = useUserStore();
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <Image width="48" src="/android-chrome-192x192.png"></Image>
        <span>LiveMap</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <!-- Dark Mode Button -->
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <!-- AppConfigurator Button -->
        <!-- <div class="relative">
          <button
            v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
          <AppConfigurator />
        </div> -->
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <!-- Calendar Button -->
          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button> -->

          <!-- Inbox Button -->
          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button> -->

          <!-- Profile Button -->
          <!-- <button type="button" class="layout-topbar-action">
            <i class="pi pi-discord"></i>
            <span>Profile</span>
          </button> -->
          <div v-if="userStore.user">
            <!-- <Button variant="outlined" class="!border-1">
                <Avatar :image="avatarUrl" class="mr-2" size="large" shape="circle" />
                {{ userStore.user.username }}
              </Button> -->
            <AvatarMenuButton :userId="userStore.user.userId" :avatar="userStore.user.avatar" :username="userStore.user.username" />
          </div>
          <div v-else>
            <Button as="a" :href="API_BASE_URL + '/auth/redirect'" label="Login" icon="pi pi-discord" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
