<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { EventService } from './event/event.service';
import socket from '@/ws/socket'
import { EventType, type EventResponse } from './event/event.interface';

const es = inject<EventService>('es')!
// TODO: make ws work

onMounted(() => {
  es.em().on('data', async (data) => {
    console.log('on event data onmounted App.vue', data)
  })
})




socket.connect()
</script>

<template>
  <router-view />
</template>

<style scoped></style>
