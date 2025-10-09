<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { EventService } from './_custom/event/event.service';
import socket from '@/_custom/ws/socket';
import { EventType } from './_custom/event/event.interface';
import { useUserStore } from '@/_custom/stores/auth.store';

const userStore = useUserStore();
onMounted(async () => {
  await userStore.loadUser();
});

const es = inject<EventService>('es')!;

onMounted(() => {
  es.em().on(EventType.DATA, async (data) => {
    console.log('on event data onmounted App.vue data:', data);
  });
});

// localhost:3000/api/v1/auth/redirect?code=AXTVsuI7aGSJm9gzsFETselx0RoSAp

// const route = useRoute();
// const clientAuthToken = route.query.token;

socket.connect();
</script>

<template>
  <router-view />
</template>

<style scoped></style>
