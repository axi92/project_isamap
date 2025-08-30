<template>
  <Button type="button" variant="outlined" class="!border-1" @click="toggle" aria-haspopup="true"
    aria-controls="overlay_menu">
    <Avatar :image="avatarUrl" class="mr-2" size="large" shape="circle" />
    {{ props.username }}
  </Button>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>

<script setup lang="js">
import { ref } from "vue";

const props = defineProps({
  userId: {
    type: String,
    default: null,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
    required: true,
  },
  username: {
    type: String,
    default: null,
    required: true,
  },
});

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Manage Server',
        icon: 'pi pi-wrench'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          window.location.href = '/api/auth/logout';
          window.location.replace('https://your-backend.com/api/logout');

        }
      }
    ]
  }
]);
const avatarUrl = ref(`https://cdn.discordapp.com/avatars/${props.userId}/${props.avatar}.webp?size=64`)

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>
