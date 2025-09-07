<template>
  <p>State: {{ connected }}</p>
</template>

<script lang="ts">
import { state } from "@/!custom/ws/socket";

export default {
  name: "ConnectionState",

  computed: {
    connected() {
      return state.connected;
    }
  }
}
</script>
