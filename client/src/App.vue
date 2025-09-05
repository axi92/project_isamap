<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { EventService } from './event/event.service';
import socket from '@/ws/socket'
import { EventType, type EventResponse } from './event/event.interface';
import { useUserStore } from '@/!custom/stores/auth.store'

const userStore = useUserStore();
onMounted(async () => {
  await userStore.loadUser();
});

const es = inject<EventService>('es')!
// TODO: make ws work

onMounted(() => {
  es.em().on('data', async (data) => {
    console.log('on event data onmounted App.vue', data)
  })
})

// localhost:3000/api/v1/auth/redirect?code=AXTVsuI7aGSJm9gzsFETselx0RoSAp

// const route = useRoute();
// const clientAuthToken = route.query.token;

socket.connect()
</script>

<template>
  <router-view />
</template>

<style scoped></style>
