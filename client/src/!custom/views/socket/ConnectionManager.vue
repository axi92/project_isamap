<script>
import socket from '@/ws/socket';

export default {
  name: 'ConnectionManager',

  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    }
  }
};
</script>

<template>
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
</template>
