<template>
  <button @click="connect()">Connect</button>
  <button @click="disconnect()">Disconnect</button>
</template>

<script >
import socket from "@/!custom/ws/socket";

export default {
  name: "ConnectionManager",

  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    }
  }
}
</script>
