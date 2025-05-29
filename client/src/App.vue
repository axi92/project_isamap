<script setup lang="ts">
import { inject } from 'vue';
import { EventService } from './event/event.service';
import socket from '@/ws/socket'
import { EventType, type EventResponse } from './event/event.interface';

const es = inject<EventService>('es')!
// TODO: make ws work

socket.connect()
</script>

<template>
  <router-view />
</template>

<style scoped></style>
